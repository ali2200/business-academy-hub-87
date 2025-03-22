
import React, { useEffect } from 'react';
import { LampCeiling, BookOpen, PenTool, GraduationCap, Users, DollarSign } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    icon: BookOpen,
    title: 'محتوى تعليمي عالي الجودة',
    description: 'دورات وكتب مصممة خصيصًا للسوق المصري بأفضل المعايير التعليمية العالمية'
  },
  {
    icon: PenTool,
    title: 'خبراء متخصصون',
    description: 'مدربين ومؤلفين محترفين من أصحاب الخبرة الواسعة في مجالات البيزنس المختلفة'
  },
  {
    icon: GraduationCap,
    title: 'شهادات معتمدة',
    description: 'احصل على شهادات إتمام الدورات المعتمدة لتعزيز سيرتك الذاتية وفرصك المهنية'
  },
  {
    icon: Users,
    title: 'مجتمع داعم',
    description: 'انضم إلى مجتمع من المتعلمين والخبراء للنقاش وتبادل الخبرات في مجال الأعمال'
  },
  {
    icon: LampCeiling,
    title: 'محتوى عربي أصيل',
    description: 'محتوى باللهجة المصرية سهل الفهم ومناسب للسوق المحلي واحتياجاته الخاصة'
  },
  {
    icon: DollarSign,
    title: 'ضمان استرداد المال',
    description: 'ضمان استرداد المال في حالة عدم الرضا عن الدورة أو الكتاب خلال 14 يومًا'
  }
];

const FeaturesSection = () => {
  // Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => {
      document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-10 md:mb-16 reveal-on-scroll">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-3 md:mb-4">لماذا تختارنا</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">مميزات التعلم معنا</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
            بيزنس أكاديمي توفر لك تجربة تعليمية فريدة ومميزة لتطوير مهاراتك في عالم الأعمال
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

type FeatureCardProps = {
  feature: typeof FEATURES[0];
  index: number;
};

const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  const Icon = feature.icon;
  
  return (
    <div 
      className="bg-white rounded-xl p-5 md:p-6 shadow-sm hover:shadow-lg transition-all duration-500 border border-gray-100 flex flex-col items-center text-center reveal-on-scroll" 
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="rounded-full bg-primary/10 p-3 md:p-4 mb-4 md:mb-6">
        <Icon size={24} className="text-primary" />
      </div>
      <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-primary">{feature.title}</h3>
      <p className="text-gray-600 text-sm md:text-base">{feature.description}</p>
    </div>
  );
};

export default FeaturesSection;
