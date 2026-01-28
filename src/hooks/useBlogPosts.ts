import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { BlogPost, Vendor, Industry } from "@/types/database";

export function useBlogPosts(options?: {
  limit?: number;
  category?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["blog-posts", options],
    queryFn: async () => {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.category) {
        query = query.eq("category", options.category);
      }

      if (options?.search) {
        query = query.ilike("title", `%${options.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as BlogPost[];
    },
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data: post, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      if (!post) return null;

      // Get related vendors
      const { data: postVendors } = await supabase
        .from("blog_post_vendors")
        .select(`
          vendors(*)
        `)
        .eq("blog_post_id", post.id);

      // Get related industries
      const { data: postIndustries } = await supabase
        .from("blog_post_industries")
        .select(`
          industries(*)
        `)
        .eq("blog_post_id", post.id);

      return {
        ...post,
        vendors: postVendors?.map((pv) => pv.vendors as Vendor) || [],
        industries: postIndustries?.map((pi) => pi.industries as Industry) || [],
      } as BlogPost & { vendors: Vendor[]; industries: Industry[] };
    },
    enabled: !!slug,
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("category")
        .not("category", "is", null);

      if (error) throw error;

      const categories = [...new Set(data?.map((p) => p.category).filter(Boolean))];
      return categories as string[];
    },
  });
}