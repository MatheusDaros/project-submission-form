export interface Project {
  id: string;
  name: string;
  description: string;
  social_media_link: string | null;
  user_id: string;
  created_at: string;
  vote_count?: number;
}

export interface Vote {
  id: string;
  project_id: string;
  user_id: string;
  created_at: string;
}
