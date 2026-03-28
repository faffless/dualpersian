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
