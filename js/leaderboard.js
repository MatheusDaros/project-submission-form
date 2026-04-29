/**
 * Leaderboard module — fetch and render the ranked project list.
 */
const Leaderboard = {
  /** Load and render the leaderboard. */
  async load() {
    const list = document.getElementById('leaderboard-list');
    if (!list) return;
    list.innerHTML = '<p class="loading">Loading projects...</p>';

    try {
      // Fetch all projects with their vote counts
      const { data: projects, error } = await supabase
        .from('projects')
        .select('id, name, description, social_media_link, created_at, user_id');
      if (error) throw error;

      if (!projects || projects.length === 0) {
        list.innerHTML = '<p class="empty-state">No projects submitted yet. Be the first!</p>';
        return;
      }

      // Fetch vote counts per project
      const { data: voteCounts, error: voteError } = await supabase
        .rpc('get_vote_counts');

      if (voteError) {
        // Fallback: count votes manually
        await this.renderWithManualCounts(list, projects);
        return;
      }

      // Build a map of project_id -> vote_count
      const countMap = {};
      if (voteCounts) {
        voteCounts.forEach(function (v) {
          countMap[v.project_id] = v.vote_count;
        });
      }

      // Attach counts and sort
      projects.forEach(function (p) {
        p.vote_count = countMap[p.id] || 0;
      });
      projects.sort(function (a, b) { return b.vote_count - a.vote_count; });

      await this.render(list, projects);
    } catch (err) {
      list.innerHTML = '<p class="error-state">Failed to load projects. Please try again.</p>';
      console.error('Leaderboard error:', err);
    }
  },

  /** Fallback: count votes individually per project. */
  async renderWithManualCounts(list, projects) {
    for (var i = 0; i < projects.length; i++) {
      var p = projects[i];
      var { count } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', p.id);
      p.vote_count = count || 0;
    }
    projects.sort(function (a, b) { return b.vote_count - a.vote_count; });
    await this.render(list, projects);
  },

  /** Render the project cards. */
  async render(list, projects) {
    // Get current user's votes
    var userVotes = {};
    if (Auth.currentUser) {
      var { data: votes } = await supabase
        .from('votes')
        .select('project_id')
        .eq('user_id', Auth.currentUser.id);
      if (votes) {
        votes.forEach(function (v) { userVotes[v.project_id] = true; });
      }
    }

    list.innerHTML = '';
    projects.forEach(function (project, index) {
      var card = document.createElement('div');
      card.className = 'project-card';
      card.setAttribute('data-project-id', project.id);

      var rank = index + 1;
      var rankClass = rank <= 3 ? 'rank-top' : '';
      var rankEmoji = rank === 1 ? ' &#x1F947;' : rank === 2 ? ' &#x1F948;' : rank === 3 ? ' &#x1F949;' : '';
      var hasVoted = userVotes[project.id] || false;
      var isOwn = Auth.currentUser && project.user_id === Auth.currentUser.id;

      card.innerHTML =
        '<div class="project-rank ' + rankClass + '">#' + rank + rankEmoji + '</div>' +
        '<div class="project-info">' +
          '<h3 class="project-name">' + escapeHtml(project.name) + '</h3>' +
          '<p class="project-description">' + escapeHtml(project.description) + '</p>' +
          (project.social_media_link
            ? '<a href="' + escapeHtml(project.social_media_link) + '" target="_blank" rel="noopener" class="social-link">View Social Media Post &rarr;</a>'
            : '') +
        '</div>' +
        '<div class="vote-section">' +
          '<button class="vote-btn' + (hasVoted ? ' voted' : '') + '"' +
            (isOwn ? ' disabled title="You cannot vote for your own project"' : '') +
            ' data-project-id="' + project.id + '">' +
            '<span class="vote-icon">' + (hasVoted ? '&#9650;' : '&#9651;') + '</span>' +
            '<span class="vote-count">' + project.vote_count + '</span>' +
          '</button>' +
        '</div>';

      list.appendChild(card);
    });

    // Attach vote handlers
    list.querySelectorAll('.vote-btn:not([disabled])').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        var projectId = this.getAttribute('data-project-id');
        btn.disabled = true;
        try {
          var result = await Projects.toggleVote(projectId);
          var icon = btn.querySelector('.vote-icon');
          var count = btn.querySelector('.vote-count');
          if (result.voted) {
            btn.classList.add('voted');
            icon.innerHTML = '&#9650;';
          } else {
            btn.classList.remove('voted');
            icon.innerHTML = '&#9651;';
          }
          count.textContent = result.newCount;
        } catch (err) {
          console.error('Vote error:', err);
          alert('Failed to vote. Please try again.');
        }
        btn.disabled = false;
      });
    });
  }
};

/** Escape HTML entities to prevent XSS. */
function escapeHtml(text) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}
