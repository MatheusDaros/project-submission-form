/**
 * Authentication module — email sign-up, sign-in, sign-out.
 */
const Auth = {
  currentUser: null,

  /** Initialize auth state listener. */
  init() {
    supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser = session ? session.user : null;
      this.updateUI();
    });
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      this.currentUser = session ? session.user : null;
      this.updateUI();
    });
  },

  /** Update UI based on auth state. */
  updateUI() {
    const authSection = document.getElementById('auth-section');
    const appSection = document.getElementById('app-section');
    const userEmail = document.getElementById('user-email');

    if (this.currentUser) {
      authSection.style.display = 'none';
      appSection.style.display = 'block';
      if (userEmail) userEmail.textContent = this.currentUser.email;
      Leaderboard.load();
    } else {
      authSection.style.display = 'block';
      appSection.style.display = 'none';
    }
  },

  /** Sign up with email and password. */
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },

  /** Sign in with email and password. */
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  /** Sign out. */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};
