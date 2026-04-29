# Project Showcase

A project submission and voting platform powered by **Supabase**. Users sign in with email, submit their projects, upvote others, and compete on a live leaderboard.

## Features

- **Email Authentication** — Sign up and sign in with email/password via Supabase Auth
- **Project Submission** — Submit your project with a name, description, and social media post link
- **Upvoting** — One vote per user per project; toggle on/off
- **Leaderboard** — Projects ranked by most upvotes, with medals for the top 3
- **Tagging Reminder** — Prompts users to tag @CognitionAI and @DevinAI on social media
- **Responsive** — Works on desktop, tablet, and mobile
- **Zero build step** — Vanilla HTML/CSS/JS; just open `index.html`

## Setup

### 1. Create a Supabase Project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run the Database Setup

Open the **SQL Editor** in your Supabase Dashboard and run the contents of [`supabase-setup.sql`](supabase-setup.sql). This creates:

- `projects` table
- `votes` table (with unique constraint for one vote per user per project)
- Row Level Security (RLS) policies
- `get_vote_counts()` function for the leaderboard
- Performance indexes

### 3. Configure the App

Edit `js/config.js` and replace the placeholder values with your Supabase project credentials:

```js
const SUPABASE_CONFIG = {
  url: 'https://your-project.supabase.co',
  anonKey: 'your-anon-key-here'
};
```

You can find these in your Supabase Dashboard → Settings → API.

### 4. Open the App

Open `index.html` in your browser. No build step required.

## Project Structure

```
project-submission-form/
├── index.html              # Main HTML page (auth, form, leaderboard)
├── css/
│   └── styles.css          # All styles
├── js/
│   ├── config.js           # Supabase URL and anon key
│   ├── supabase-client.js  # Supabase client initialization
│   ├── auth.js             # Auth module (sign up, sign in, sign out)
│   ├── projects.js         # Project submission and voting logic
│   ├── leaderboard.js      # Leaderboard fetch and rendering
│   └── app.js              # Main controller and event handling
├── supabase-setup.sql      # Database schema and RLS policies
└── README.md
```

## Customization

- **Styling** — Edit `css/styles.css`. Colors and spacing use CSS custom properties in `:root`.
- **Form fields** — Add fields in `index.html`, update `Projects.submit()` in `js/projects.js`, and add columns to the `projects` table.
- **Social media tags** — Edit the info box text in `index.html`.

## License

MIT
