export type Profile = {
  id: string;
  name: string;
  age: number;
  gender: string;
  looking_for: string;
  bio: string;
  education: string;
  profession: string;
  height_cm: number;
  city: string;
  country: string;
  lat: number | null;
  lng: number | null;
  avatar_url: string | null;
  is_premium: boolean;
  daily_likes_used: number;
  daily_likes_reset_at: string;
  created_at: string;
};

export type Photo = {
  id: string;
  user_id: string;
  url: string;
  order: number;
};

export type Match = {
  id: string;
  user1: string;
  user2: string;
  created_at: string;
};

export type Message = {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

// Community types

export type ForumCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sort_order: number;
  created_at: string;
  thread_count?: number;
};

export type ForumThread = {
  id: string;
  category_id: string;
  author_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  reply_count: number;
  last_reply_at: string;
  created_at: string;
  author?: Profile;
  category?: ForumCategory;
};

export type ForumReply = {
  id: string;
  thread_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: Profile;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  event_date: string;
  event_time: string | null;
  city: string;
  country: string;
  venue: string | null;
  organiser_id: string | null;
  created_at: string;
  rsvp_count?: number;
};

export type EventRsvp = {
  id: string;
  event_id: string;
  user_id: string;
  status: 'interested' | 'going';
  created_at: string;
};
