/**
 * Hand-written DB types matching migrations 001-006.
 */

export type PostStatus = "draft" | "scheduled" | "published";
export type LeadStatus = "new" | "contacted" | "qualified" | "closed" | "spam";
export type BookingStatus = "pending" | "confirmed" | "rescheduled" | "cancelled" | "completed";
export type SubscriberStatus = "pending" | "active" | "unsubscribed" | "bounced";
export type MeetingType = "online" | "offline";

export interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  display_order: number;
  created_at: string;
}
export interface CategoryInsert {
  id?: string;
  slug: string;
  name: string;
  description?: string | null;
  display_order?: number;
  created_at?: string;
}

export interface TagRow {
  id: string;
  slug: string;
  name: string;
  created_at: string;
}
export interface TagInsert {
  id?: string;
  slug: string;
  name: string;
  created_at?: string;
}

export interface AuthorRow {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  bio: string | null;
  avatar_url: string | null;
  user_id: string | null;
  created_at: string;
}
export interface AuthorInsert {
  id?: string;
  slug: string;
  name: string;
  title?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  user_id?: string | null;
  created_at?: string;
}

export interface PostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  body_mdx: string;
  body_html: string | null;
  reading_time: number | null;
  author_id: string | null;
  category_id: string | null;
  status: PostStatus;
  published_at: string | null;
  scheduled_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  view_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}
export interface PostInsert {
  id?: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  cover_url?: string | null;
  body_mdx: string;
  body_html?: string | null;
  reading_time?: number | null;
  author_id?: string | null;
  category_id?: string | null;
  status?: PostStatus;
  published_at?: string | null;
  scheduled_at?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  og_image_url?: string | null;
  view_count?: number;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PostTagRow {
  post_id: string;
  tag_id: string;
}
export interface PostTagInsert {
  post_id: string;
  tag_id: string;
}

export interface LeadRow {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company: string | null;
  company_size: string | null;
  services: string[] | null;
  message: string | null;
  source: string | null;
  utm: Record<string, string> | null;
  status: LeadStatus;
  internal_notes: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}
export interface LeadInsert {
  id?: string;
  full_name: string;
  email: string;
  phone: string;
  company?: string | null;
  company_size?: string | null;
  services?: string[] | null;
  message?: string | null;
  source?: string | null;
  utm?: Record<string, string> | null;
  status?: LeadStatus;
  internal_notes?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BookingRow {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company: string | null;
  service: string | null;
  scheduled_at: string;
  duration_min: number;
  meeting_type: MeetingType;
  meeting_link: string | null;
  status: BookingStatus;
  message: string | null;
  ics_uid: string | null;
  created_at: string;
  updated_at: string;
}
export interface BookingInsert {
  id?: string;
  full_name: string;
  email: string;
  phone: string;
  company?: string | null;
  service?: string | null;
  scheduled_at: string;
  duration_min?: number;
  meeting_type?: MeetingType;
  meeting_link?: string | null;
  status?: BookingStatus;
  message?: string | null;
  ics_uid?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SubscriberRow {
  id: string;
  email: string;
  resend_id: string | null;
  source: string | null;
  status: SubscriberStatus;
  unsub_token: string;
  subscribed_at: string;
}
export interface SubscriberInsert {
  id?: string;
  email: string;
  resend_id?: string | null;
  source?: string | null;
  status?: SubscriberStatus;
  unsub_token?: string;
  subscribed_at?: string;
}

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      categories: { Row: CategoryRow; Insert: CategoryInsert; Update: Partial<CategoryInsert>; Relationships: [] };
      tags: { Row: TagRow; Insert: TagInsert; Update: Partial<TagInsert>; Relationships: [] };
      authors: { Row: AuthorRow; Insert: AuthorInsert; Update: Partial<AuthorInsert>; Relationships: [] };
      posts: { Row: PostRow; Insert: PostInsert; Update: Partial<PostInsert>; Relationships: [] };
      post_tags: { Row: PostTagRow; Insert: PostTagInsert; Update: PostTagInsert; Relationships: [] };
      leads: { Row: LeadRow; Insert: LeadInsert; Update: Partial<LeadInsert>; Relationships: [] };
      bookings: { Row: BookingRow; Insert: BookingInsert; Update: Partial<BookingInsert>; Relationships: [] };
      subscribers: {
        Row: SubscriberRow;
        Insert: SubscriberInsert;
        Update: Partial<SubscriberInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Post = PostRow;
export type Category = CategoryRow;
export type Tag = TagRow;
export type Author = AuthorRow;
export type Lead = LeadRow;
export type Booking = BookingRow;
export type Subscriber = SubscriberRow;

export type PostWithMeta = PostRow & {
  author: Pick<AuthorRow, "name" | "slug" | "avatar_url" | "title"> | null;
  category: Pick<CategoryRow, "name" | "slug"> | null;
};
