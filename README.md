# Project Showcase

A project submission and voting platform built with **Next.js**, **Supabase**, and **Tailwind CSS**. Users sign in with email, submit their projects, upvote others, and compete on a live leaderboard.

## Features

- **Email Authentication** — Sign up / sign in / sign out via Supabase Auth
- **Project Submission** — Name, description, and social media post link
- **Tagging Reminder** — Prompts users to tag @CognitionAI and @DevinAI
- **Upvoting** — One vote per user per project; toggle on/off
- **Leaderboard** — Projects ranked by most upvotes with medals for top 3
- **Responsive** — Works on desktop, tablet, and mobile

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router, TypeScript)
- [Supabase](https://supabase.com/) (Auth + PostgreSQL)
- [Tailwind CSS](https://tailwindcss.com/) v4

## Setup

### 1. Create a Supabase Project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run the Database Setup

Open the **SQL Editor** in your Supabase Dashboard and run [`supabase-setup.sql`](supabase-setup.sql). This creates:

- `projects` table
- `votes` table (unique constraint: one vote per user per project)
- Row Level Security (RLS) policies
- Performance indexes

### 3. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these at: Supabase Dashboard → Settings → API.

### 4. Install and Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with AuthProvider and Navbar
│   ├── page.tsx            # Home page with leaderboard
│   ├── globals.css         # Tailwind imports
│   ├── login/
│   │   └── page.tsx        # Sign in / sign up page
│   └── submit/
│       └── page.tsx        # Project submission form
├── components/
│   ├── AuthProvider.tsx    # Auth context with Supabase
│   ├── Navbar.tsx          # Navigation bar
│   ├── Leaderboard.tsx     # Leaderboard data fetching and rendering
│   ├── ProjectCard.tsx     # Individual project card
│   └── VoteButton.tsx      # Upvote toggle button
└── lib/
    ├── supabase.ts         # Supabase client
    └── types.ts            # TypeScript types
```

## License

MIT
