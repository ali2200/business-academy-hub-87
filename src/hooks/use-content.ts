
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export interface ContentItem {
  id: string;
  section: string;
  key: string;
  content_type: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContentData {
  [key: string]: string;
}

export function useContent(section: string) {
  const [content, setContent] = useState<ContentData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('website_content')
          .select('*')
          .eq('section', section);
        
        if (error) {
          throw error;
        }

        if (data && data.length) {
          const contentObj: ContentData = {};
          data.forEach((item: ContentItem) => {
            contentObj[item.key] = item.content;
          });
          setContent(contentObj);
        }
      } catch (err) {
        console.error(`Error fetching ${section} content:`, err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [section]);

  return { content, loading, error };
}
