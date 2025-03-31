import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useContent } from "@/hooks/use-content";
const HeroSection = () => {
  const {
    content,
    loading
  } = useContent('hero');

  // Default content that will be shown while loading
  const defaultContent = {
    title: 'تعلم مهارات البيزنس الاحترافية',
    subtitle: 'منصة تعليمية متخصصة في مجال الأعمال التجارية وريادة الأعمال',
    button_text: 'تصفح الدورات'
  };

  // Merge default content with loaded content
  const heroContent = {
    ...defaultContent,
    ...content
  };
  return <section className="py-16 md:py-24 bg-gradient-to-b from-secondary-light to-white lg:py-[76px] my-0">
      <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center">
        {/* Text Content */}
        <div className="md:w-1/2 text-right">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight mb-4">
            {heroContent.title}
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            {heroContent.subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/courses">
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-white">
                {heroContent.button_text}
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="md:w-1/2 mb-10 md:mb-0">
          <img src="/images/hero.svg" alt="Business Academy" className="w-full" />
        </div>
      </div>
    </section>;
};
export default HeroSection;