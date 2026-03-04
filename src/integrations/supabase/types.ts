export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      authors: {
        Row: {
          bio: string | null
          created_at: string
          email: string | null
          id: string
          image_url: string | null
          is_default: boolean | null
          linkedin_url: string | null
          name: string
          slug: string
          title: string | null
          twitter_url: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          image_url?: string | null
          is_default?: boolean | null
          linkedin_url?: string | null
          name: string
          slug: string
          title?: string | null
          twitter_url?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          image_url?: string | null
          is_default?: boolean | null
          linkedin_url?: string | null
          name?: string
          slug?: string
          title?: string | null
          twitter_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      blog_post_industries: {
        Row: {
          blog_post_id: string
          industry_id: string
        }
        Insert: {
          blog_post_id: string
          industry_id: string
        }
        Update: {
          blog_post_id?: string
          industry_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_industries_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_industries_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_vendors: {
        Row: {
          blog_post_id: string
          vendor_id: string
        }
        Insert: {
          blog_post_id: string
          vendor_id: string
        }
        Update: {
          blog_post_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_vendors_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_vendors_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          author_name: string | null
          author_title: string | null
          category: string | null
          co_author_name: string | null
          co_author_title: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          slug: string
          title: string
          updated_at: string
          verified_by_name: string | null
          verified_by_title: string | null
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          author_title?: string | null
          category?: string | null
          co_author_name?: string | null
          co_author_title?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
          verified_by_name?: string | null
          verified_by_title?: string | null
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          author_title?: string | null
          category?: string | null
          co_author_name?: string | null
          co_author_title?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
          verified_by_name?: string | null
          verified_by_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors_public"
            referencedColumns: ["id"]
          },
        ]
      }
      case_studies: {
        Row: {
          content: string | null
          created_at: string
          featured_image: string | null
          id: string
          industry_id: string | null
          metrics: string[] | null
          published_at: string | null
          slug: string
          summary: string | null
          title: string
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          featured_image?: string | null
          id?: string
          industry_id?: string | null
          metrics?: string[] | null
          published_at?: string | null
          slug: string
          summary?: string | null
          title: string
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          featured_image?: string | null
          id?: string
          industry_id?: string | null
          metrics?: string[] | null
          published_at?: string | null
          slug?: string
          summary?: string | null
          title?: string
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_studies_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_studies_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_publications: {
        Row: {
          created_at: string
          display_order: number
          id: string
          logo_url: string | null
          name: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          logo_url?: string | null
          name: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          logo_url?: string | null
          name?: string
          website_url?: string | null
        }
        Relationships: []
      }
      features: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      hero_vendors: {
        Row: {
          created_at: string
          display_order: number
          id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hero_vendors_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      industries: {
        Row: {
          core_problems: string[] | null
          created_at: string
          featured: boolean | null
          id: string
          key_requirements: string | null
          name: string
          overview: string | null
          slug: string
          summary: string | null
          updated_at: string
        }
        Insert: {
          core_problems?: string[] | null
          created_at?: string
          featured?: boolean | null
          id?: string
          key_requirements?: string | null
          name: string
          overview?: string | null
          slug: string
          summary?: string | null
          updated_at?: string
        }
        Update: {
          core_problems?: string[] | null
          created_at?: string
          featured?: boolean | null
          id?: string
          key_requirements?: string | null
          name?: string
          overview?: string | null
          slug?: string
          summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          company: string | null
          company_size: string | null
          created_at: string
          email: string
          honeypot: string | null
          id: string
          industry: string | null
          message: string | null
          name: string
          role: string | null
          source_page: string | null
          status: Database["public"]["Enums"]["lead_status"] | null
          updated_at: string
          vendors_interested: string[] | null
        }
        Insert: {
          company?: string | null
          company_size?: string | null
          created_at?: string
          email: string
          honeypot?: string | null
          id?: string
          industry?: string | null
          message?: string | null
          name: string
          role?: string | null
          source_page?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          updated_at?: string
          vendors_interested?: string[] | null
        }
        Update: {
          company?: string | null
          company_size?: string | null
          created_at?: string
          email?: string
          honeypot?: string | null
          id?: string
          industry?: string | null
          message?: string | null
          name?: string
          role?: string | null
          source_page?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          updated_at?: string
          vendors_interested?: string[] | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          certifications: string[] | null
          created_at: string
          employees_count: string | null
          erp_specializations: string[] | null
          featured: boolean | null
          headquarters: string | null
          id: string
          industries_served: string[] | null
          logo_url: string | null
          long_description: string | null
          name: string
          notable_clients: string[] | null
          regions_served: string[] | null
          services_offered: string[] | null
          short_description: string | null
          slug: string
          updated_at: string
          website_url: string | null
          year_founded: number | null
        }
        Insert: {
          certifications?: string[] | null
          created_at?: string
          employees_count?: string | null
          erp_specializations?: string[] | null
          featured?: boolean | null
          headquarters?: string | null
          id?: string
          industries_served?: string[] | null
          logo_url?: string | null
          long_description?: string | null
          name: string
          notable_clients?: string[] | null
          regions_served?: string[] | null
          services_offered?: string[] | null
          short_description?: string | null
          slug: string
          updated_at?: string
          website_url?: string | null
          year_founded?: number | null
        }
        Update: {
          certifications?: string[] | null
          created_at?: string
          employees_count?: string | null
          erp_specializations?: string[] | null
          featured?: boolean | null
          headquarters?: string | null
          id?: string
          industries_served?: string[] | null
          logo_url?: string | null
          long_description?: string | null
          name?: string
          notable_clients?: string[] | null
          regions_served?: string[] | null
          services_offered?: string[] | null
          short_description?: string | null
          slug?: string
          updated_at?: string
          website_url?: string | null
          year_founded?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_features: {
        Row: {
          feature_id: string
          vendor_id: string
        }
        Insert: {
          feature_id: string
          vendor_id: string
        }
        Update: {
          feature_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_features_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_features_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_industries: {
        Row: {
          industry_id: string
          vendor_id: string
        }
        Insert: {
          industry_id: string
          vendor_id: string
        }
        Update: {
          industry_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_industries_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_industries_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          awards: string[] | null
          company_size_fit: Database["public"]["Enums"]["company_size"][] | null
          cons: string[] | null
          created_at: string
          deployment: Database["public"]["Enums"]["deployment_type"][] | null
          featured: boolean | null
          id: string
          implementation_time:
            | Database["public"]["Enums"]["implementation_time"]
            | null
          integrations: string[] | null
          key_differentiators: string[] | null
          logo_url: string | null
          long_description: string | null
          name: string
          partner_names: string[] | null
          pricing_stance: Database["public"]["Enums"]["pricing_stance"] | null
          pros: string[] | null
          reviews_count: number | null
          screenshots: string[] | null
          short_description: string | null
          slug: string
          sponsor_label: string | null
          sponsored: boolean | null
          top_clients: string[] | null
          updated_at: string
          user_rating: number | null
          website_url: string | null
        }
        Insert: {
          awards?: string[] | null
          company_size_fit?:
            | Database["public"]["Enums"]["company_size"][]
            | null
          cons?: string[] | null
          created_at?: string
          deployment?: Database["public"]["Enums"]["deployment_type"][] | null
          featured?: boolean | null
          id?: string
          implementation_time?:
            | Database["public"]["Enums"]["implementation_time"]
            | null
          integrations?: string[] | null
          key_differentiators?: string[] | null
          logo_url?: string | null
          long_description?: string | null
          name: string
          partner_names?: string[] | null
          pricing_stance?: Database["public"]["Enums"]["pricing_stance"] | null
          pros?: string[] | null
          reviews_count?: number | null
          screenshots?: string[] | null
          short_description?: string | null
          slug: string
          sponsor_label?: string | null
          sponsored?: boolean | null
          top_clients?: string[] | null
          updated_at?: string
          user_rating?: number | null
          website_url?: string | null
        }
        Update: {
          awards?: string[] | null
          company_size_fit?:
            | Database["public"]["Enums"]["company_size"][]
            | null
          cons?: string[] | null
          created_at?: string
          deployment?: Database["public"]["Enums"]["deployment_type"][] | null
          featured?: boolean | null
          id?: string
          implementation_time?:
            | Database["public"]["Enums"]["implementation_time"]
            | null
          integrations?: string[] | null
          key_differentiators?: string[] | null
          logo_url?: string | null
          long_description?: string | null
          name?: string
          partner_names?: string[] | null
          pricing_stance?: Database["public"]["Enums"]["pricing_stance"] | null
          pros?: string[] | null
          reviews_count?: number | null
          screenshots?: string[] | null
          short_description?: string | null
          slug?: string
          sponsor_label?: string | null
          sponsored?: boolean | null
          top_clients?: string[] | null
          updated_at?: string
          user_rating?: number | null
          website_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      authors_public: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string | null
          image_url: string | null
          is_default: boolean | null
          linkedin_url: string | null
          name: string | null
          slug: string | null
          title: string | null
          twitter_url: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string | null
          image_url?: string | null
          is_default?: boolean | null
          linkedin_url?: string | null
          name?: string | null
          slug?: string | null
          title?: string | null
          twitter_url?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string | null
          image_url?: string | null
          is_default?: boolean | null
          linkedin_url?: string | null
          name?: string | null
          slug?: string | null
          title?: string | null
          twitter_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      company_size: "Small" | "Mid-market" | "Enterprise"
      deployment_type: "SaaS" | "On-Prem" | "Hybrid"
      implementation_time:
        | "<3 months"
        | "3-6 months"
        | "6-12 months"
        | "12+ months"
        | "Unknown"
      lead_status: "New" | "Contacted" | "Qualified" | "Closed"
      pricing_stance: "Quote-based" | "Starts at $" | "Free trial" | "Unknown"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      company_size: ["Small", "Mid-market", "Enterprise"],
      deployment_type: ["SaaS", "On-Prem", "Hybrid"],
      implementation_time: [
        "<3 months",
        "3-6 months",
        "6-12 months",
        "12+ months",
        "Unknown",
      ],
      lead_status: ["New", "Contacted", "Qualified", "Closed"],
      pricing_stance: ["Quote-based", "Starts at $", "Free trial", "Unknown"],
    },
  },
} as const
