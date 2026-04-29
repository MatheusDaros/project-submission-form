/**
 * Main application controller.
 */
(function () {
  'use strict';

  // ---- Auth form handling ----
  var authForm = document.getElementById('auth-form');
  var authToggle = document.getElementById('auth-toggle');
  var authTitle = document.getElementById('auth-title');
  var authSubmitBtn = document.getElementById('auth-submit-btn');
  var authToggleText = document.getElementById('auth-toggle-text');
  var authError = document.getElementById('auth-error');
  var authSuccess = document.getElementById('auth-success');
  var signOutBtn = document.getElementById('sign-out-btn');
  var isSignUp = false;

  authToggle.addEventListener('click', function (e) {
    e.preventDefault();
    isSignUp = !isSignUp;
    authTitle.textContent = isSignUp ? 'Create Account' : 'Sign In';
    authSubmitBtn.textContent = isSignUp ? 'Sign Up' : 'Sign In';
    authToggleText.innerHTML = isSignUp
      ? 'Already have an account? <a href="#" id="auth-toggle">Sign In</a>'
      : 'Don\'t have an account? <a href="#" id="auth-toggle">Sign Up</a>';
    authError.textContent = '';
    authSuccess.textContent = '';
    // Re-attach toggle listener to new link
    document.getElementById('auth-toggle').addEventListener('click', arguments.callee.bind(this, e));
  });

  authForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    var email = document.getElementById('auth-email').value.trim();
    var password = document.getElementById('auth-password').value;
    authError.textContent = '';
    authSuccess.textContent = '';
    authSubmitBtn.disabled = true;

    try {
      if (isSignUp) {
        await Auth.signUp(email, password);
        authSuccess.textContent = 'Account created! Check your email to confirm, then sign in.';
        isSignUp = false;
        authTitle.textContent = 'Sign In';
        authSubmitBtn.textContent = 'Sign In';
      } else {
        await Auth.signIn(email, password);
      }
    } catch (err) {
      authError.textContent = err.message || 'Authentication failed. Please try again.';
    }
    authSubmitBtn.disabled = false;
  });

  signOutBtn.addEventListener('click', async function () {
    try {
      await Auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  });

  // ---- Tab navigation ----
  var tabs = document.querySelectorAll('.tab-btn');
  var panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = this.getAttribute('data-tab');
      tabs.forEach(function (t) { t.classList.remove('active'); });
      panels.forEach(function (p) { p.classList.remove('active'); });
      this.classList.add('active');
      document.getElementById(target).classList.add('active');
      if (target === 'leaderboard-panel') {
        Leaderboard.load();
      }
    });
  });

  // ---- Project submission ----
  var submitForm = document.getElementById('project-form');
  var submitError = document.getElementById('submit-error');
  var submitSuccess = document.getElementById('submit-success');

  submitForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    var name = document.getElementById('project-name').value;
    var description = document.getElementById('project-description').value;
    var socialLink = document.getElementById('social-media-link').value;
    submitError.textContent = '';
    submitSuccess.textContent = '';

    // Basic validation
    if (!name.trim()) {
      submitError.textContent = 'Project name is required.';
      return;
    }
    if (!description.trim()) {
      submitError.textContent = 'Project description is required.';
      return;
    }

    var submitBtn = submitForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
      await Projects.submit(name, description, socialLink);
      submitSuccess.textContent = 'Project submitted successfully!';
      submitForm.reset();
      // Refresh leaderboard
      Leaderboard.load();
    } catch (err) {
      submitError.textContent = err.message || 'Failed to submit project. Please try again.';
    }
    submitBtn.disabled = false;
  });

  // ---- Initialize ----
  Auth.init();
})();
