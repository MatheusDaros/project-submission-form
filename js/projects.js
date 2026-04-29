/**
 * Projects module — submit projects and manage votes.
 */
const Projects = {
  /** Submit a new project. */
  async submit(name, description, socialMediaLink) {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: name.trim(),
        description: description.trim(),
        social_media_link: socialMediaLink.trim(),
        user_id: Auth.currentUser.id
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /** Toggle vote on a project. Returns { voted, newCount }. */
  async toggleVote(projectId) {
    const userId = Auth.currentUser.id;

    // Check if already voted
    const { data: existing } = await supabase
      .from('votes')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      // Remove vote
      const { error } = await supabase
        .from('votes')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', userId);
      if (error) throw error;
    } else {
      // Add vote
      const { error } = await supabase
        .from('votes')
        .insert({ project_id: projectId, user_id: userId });
      if (error) throw error;
    }

    // Get updated count
    const { count } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId);

    return { voted: !existing, newCount: count || 0 };
  },

  /** Check if current user has voted for a project. */
  async hasVoted(projectId) {
    const { data } = await supabase
      .from('votes')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', Auth.currentUser.id)
      .maybeSingle();
    return !!data;
  }
};
