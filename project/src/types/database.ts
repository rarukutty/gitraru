export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          city: string | null;
          country: string | null;
          avatar_url: string | null;
          preferred_destinations: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      trips: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          destination: string;
          start_date: string;
          end_date: string;
          budget: number;
          notes: string | null;
          status: 'upcoming' | 'ongoing' | 'completed';
          cover_image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['trips']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['trips']['Insert']>;
      };
      itinerary_days: {
        Row: {
          id: string;
          trip_id: string;
          day_number: number;
          date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['itinerary_days']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['itinerary_days']['Insert']>;
      };
      activities: {
        Row: {
          id: string;
          day_id: string;
          title: string;
          description: string | null;
          start_time: string | null;
          end_time: string | null;
          location: string | null;
          budget: number;
          category: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['activities']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['activities']['Insert']>;
      };
      expenses: {
        Row: {
          id: string;
          trip_id: string;
          user_id: string;
          title: string;
          amount: number;
          category: string;
          date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['expenses']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['expenses']['Insert']>;
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          destination: string | null;
          image_url: string | null;
          likes: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['posts']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['posts']['Insert']>;
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['comments']['Insert']>;
      };
      checklist_items: {
        Row: {
          id: string;
          user_id: string;
          trip_id: string | null;
          title: string;
          category: string;
          is_checked: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['checklist_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['checklist_items']['Insert']>;
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Trip = Database['public']['Tables']['trips']['Row'];
export type ItineraryDay = Database['public']['Tables']['itinerary_days']['Row'];
export type Activity = Database['public']['Tables']['activities']['Row'];
export type Expense = Database['public']['Tables']['expenses']['Row'];
export type Post = Database['public']['Tables']['posts']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];
export type ChecklistItem = Database['public']['Tables']['checklist_items']['Row'];
