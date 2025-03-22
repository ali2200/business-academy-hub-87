
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface ContentData {
  [key: string]: string;
}

const HeroSection = () => {
  const [content, setContent] = useState<ContentData>({
    title: 'تعلم مهارات البيزنس الاحترافية',
    subtitle: 'منصة تعليمية متخصصة في مجال الأعمال التجارية وريادة الأعمال',
    button_text: 'تصفح الدورات'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('website_content')
          .select('key, content')
          .eq('section', 'hero');
        
        if (error) {
          throw error;
        }

        if (data && data.length) {
          const contentObj: ContentData = {};
          data.forEach(item => {
            contentObj[item.key] = item.content;
          });
          
          // Only update state with values that exist in the database
          setContent(prevContent => ({
            ...prevContent,
            ...contentObj
          }));
        }
      } catch (error) {
        console.error('Error fetching hero content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-secondary-light to-white">
      <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center">
        {/* Text Content */}
        <div className="md:w-1/2 text-right">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight mb-4">
            {content.title}
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            {content.subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/courses">
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-white">
                {content.button_text}
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="md:w-1/2 mb-10 md:mb-0">
          <img 
            src="/images/hero.svg" 
            alt="Business Academy" 
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
