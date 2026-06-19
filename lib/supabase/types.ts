/**
 * Hand-written DB types matching migrations 001-006.
 */

export type PostStatus = "draft" | "scheduled" | "published";
export type PublishStatus = "draft" | "published";
export type EventStatus = "draft" | "published" | "upcoming" | "past";
export type LeadStatus = "new" | "contacted" | "qualified" | "closed" | "spam";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type SubscriberStatus = "active" | "unsubscribed";
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

export interface PersonRow {
  id: string;
  legacy_author_id: string | null;
  slug: string;
  name: string;
  title: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone: string | null;
  expertise: string[];
  credentials: string[];
  social_links: Record<string, string>;
  status: PublishStatus;
  display_order: number;
  is_featured: boolean;
  profile_enabled: boolean;
  created_at: string;
  updated_at: string;
}
export interface PersonInsert {
  id?: string;
  legacy_author_id?: string | null;
  slug: string;
  name: string;
  title?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  expertise?: string[];
  credentials?: string[];
  social_links?: Record<string, string>;
  status?: PublishStatus;
  display_order?: number;
  is_featured?: boolean;
  profile_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
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
  people_id: string | null;
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
  people_id?: string | null;
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

export interface ServiceRow {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  cover_url: string | null;
  status: PublishStatus;
  display_order: number;
  pricing: string | null;
  cta_label: string | null;
  cta_href: string | null;
  seo_title: string | null;
  seo_description: string | null;
  when_items: string[];
  process_items: string[];
  deliverable_items: string[];
  created_at: string;
  updated_at: string;
}
export interface ServiceInsert {
  id?: string;
  slug: string;
  title: string;
  short_description?: string | null;
  description?: string | null;
  cover_url?: string | null;
  status?: PublishStatus;
  display_order?: number;
  pricing?: string | null;
  cta_label?: string | null;
  cta_href?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  when_items?: string[];
  process_items?: string[];
  deliverable_items?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ServicePersonRow {
  service_id: string;
  person_id: string;
  role_label: string | null;
  display_order: number;
}
export interface ServicePersonInsert {
  service_id: string;
  person_id: string;
  role_label?: string | null;
  display_order?: number;
}

export interface EventRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  description: string | null;
  cover_url: string | null;
  event_date: string | null;
  location: string | null;
  format: string | null;
  status: EventStatus;
  display_order: number;
  agenda_items: string[];
  audience_items: string[];
  cta_label: string | null;
  cta_href: string | null;
  created_at: string;
  updated_at: string;
}
export interface EventInsert {
  id?: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  description?: string | null;
  cover_url?: string | null;
  event_date?: string | null;
  location?: string | null;
  format?: string | null;
  status?: EventStatus;
  display_order?: number;
  agenda_items?: string[];
  audience_items?: string[];
  cta_label?: string | null;
  cta_href?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface EventPersonRow {
  event_id: string;
  person_id: string;
  role_label: string | null;
  display_order: number;
}
export interface EventPersonInsert {
  event_id: string;
  person_id: string;
  role_label?: string | null;
  display_order?: number;
}

export interface LeadRow {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company: string | null;
  company_size: string | null;
  services: string[] | null;
  meeting_type: MeetingType;
  meeting_link: string | null;
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
  meeting_type?: MeetingType;
  meeting_link?: string | null;
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
  services: string[] | null;
  scheduled_at: string | null;
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
  services?: string[] | null;
  scheduled_at?: string | null;
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

export interface NewsletterSendRow {
  id: string;
  post_id: string;
  status: "sent" | "failed" | "mocked";
  subject: string;
  recipient_count: number;
  sent_at: string;
  error_message: string | null;
}
export interface NewsletterSendInsert {
  id?: string;
  post_id: string;
  status?: "sent" | "failed" | "mocked";
  subject: string;
  recipient_count?: number;
  sent_at?: string;
  error_message?: string | null;
}

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      categories: {
        Row: CategoryRow;
        Insert: CategoryInsert;
        Update: Partial<CategoryInsert>;
        Relationships: [];
      };
      tags: {
        Row: TagRow;
        Insert: TagInsert;
        Update: Partial<TagInsert>;
        Relationships: [];
      };
      authors: {
        Row: AuthorRow;
        Insert: AuthorInsert;
        Update: Partial<AuthorInsert>;
        Relationships: [];
      };
      people: {
        Row: PersonRow;
        Insert: PersonInsert;
        Update: Partial<PersonInsert>;
        Relationships: [];
      };
      posts: {
        Row: PostRow;
        Insert: PostInsert;
        Update: Partial<PostInsert>;
        Relationships: [];
      };
      post_tags: {
        Row: PostTagRow;
        Insert: PostTagInsert;
        Update: PostTagInsert;
        Relationships: [];
      };
      services: {
        Row: ServiceRow;
        Insert: ServiceInsert;
        Update: Partial<ServiceInsert>;
        Relationships: [];
      };
      service_people: {
        Row: ServicePersonRow;
        Insert: ServicePersonInsert;
        Update: Partial<ServicePersonInsert>;
        Relationships: [];
      };
      events: {
        Row: EventRow;
        Insert: EventInsert;
        Update: Partial<EventInsert>;
        Relationships: [];
      };
      event_people: {
        Row: EventPersonRow;
        Insert: EventPersonInsert;
        Update: Partial<EventPersonInsert>;
        Relationships: [];
      };
      leads: {
        Row: LeadRow;
        Insert: LeadInsert;
        Update: Partial<LeadInsert>;
        Relationships: [];
      };
      bookings: {
        Row: BookingRow;
        Insert: BookingInsert;
        Update: Partial<BookingInsert>;
        Relationships: [];
      };
      subscribers: {
        Row: SubscriberRow;
        Insert: SubscriberInsert;
        Update: Partial<SubscriberInsert>;
        Relationships: [];
      };
      newsletter_sends: {
        Row: NewsletterSendRow;
        Insert: NewsletterSendInsert;
        Update: Partial<NewsletterSendInsert>;
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
export type Person = PersonRow;
export type Service = ServiceRow;
export type Event = EventRow;
export type Lead = LeadRow;
export type Booking = BookingRow;
export type Subscriber = SubscriberRow;
export type NewsletterSend = NewsletterSendRow;

export type PostWithMeta = PostRow & {
  author: Pick<AuthorRow, "name" | "slug" | "avatar_url" | "title"> | null;
  person: Pick<PersonRow, "name" | "slug" | "avatar_url" | "title"> | null;
  category: Pick<CategoryRow, "name" | "slug"> | null;
};

export type ServiceWithPeople = ServiceRow & {
  service_people?: Array<{
    role_label: string | null;
    display_order: number;
    person: Pick<
      PersonRow,
      | "id"
      | "slug"
      | "name"
      | "title"
      | "bio"
      | "avatar_url"
      | "phone"
      | "expertise"
      | "credentials"
      | "social_links"
      | "status"
      | "profile_enabled"
    > | null;
  }>;
};
