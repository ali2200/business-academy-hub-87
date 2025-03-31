import React, { useState } from 'react';
import { Book, Award, School } from 'lucide-react';
import { useContent } from "@/hooks/use-content";
interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}
const AboutMeSection = () => {
  const {
    content,
    loading
  } = useContent('about');

  // Default content
  const defaultContent = {
    title: 'تعرف على بيزنس أكاديمي',
    description: 'أنا أحمد، خبير في مجال البيزنس والمبيعات مع خبرة تمتد لأكثر من 10 سنوات في السوق المصري. أسست بيزنس أكاديمي لمساعدة رواد الأعمال والمهنيين المصريين على تطوير مهاراتهم وتحقيق النجاح في عالم الأعمال.',
    video_url: 'https://static.videezy.com/system/resources/previews/000/005/529/original/Reaviling_Sjusj%C3%B8en_Ski_Senter.mp4'
  };

  // Merge default content with loaded content
  const aboutContent = {
    ...defaultContent,
    ...content
  };
  const [features] = useState<FeatureItem[]>([{
    id: 1,
    title: "دورات تدريبية احترافية",
    description: "دورات متخصصة في مجالات البيع والتسويق وإدارة الأعمال مقدمة باللهجة المصرية لتناسب احتياجات السوق المحلي.",
    icon: "graduation-cap"
  }, {
    id: 2,
    title: "كتب ومراجع تعليمية",
    description: "مجموعة من الكتب الإلكترونية المتخصصة التي تشرح أساسيات ومفاهيم البيزنس بطريقة سهلة وعملية.",
    icon: "book-open"
  }, {
    id: 3,
    title: "خبرة عملية حقيقية",
    description: "محتوى مبني على تجارب حقيقية وخبرات عملية في السوق المصري، وليس مجرد نظريات.",
    icon: "award"
  }]);
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'graduation-cap':
        return <School className="w-6 h-6 text-primary" />;
      case 'book-open':
        return <Book className="w-6 h-6 text-primary" />;
      case 'award':
        return <Award className="w-6 h-6 text-primary" />;
      default:
        return <School className="w-6 h-6 text-primary" />;
    }
  };
  return <section className="py-10 bg-white md:py-0 px-[9px] my-0">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-4">
              {aboutContent.title}
            </h2>
            
            <p className="text-lg text-gray-700 mb-6">
              {aboutContent.description}
            </p>
          </div>

          {/* Video */}
          <div className="mb-10 rounded-xl overflow-hidden shadow-xl">
            <video className="w-full aspect-video object-cover" controls poster="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop">
              <source src={aboutContent.video_url} type="video/mp4" />
              عذراً، متصفحك لا يدعم تشغيل الفيديو
            </video>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(feature => <div key={feature.id} className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-secondary/10 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4">
                  {renderIcon(feature.icon)}
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default AboutMeSection;