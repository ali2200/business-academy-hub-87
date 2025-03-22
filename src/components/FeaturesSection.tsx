
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
    <section className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 reveal-on-scroll">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-4">لماذا تختارنا</Badge>
          <h2 className="text-4xl font-bold mb-6">مميزات التعلم معنا</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            بيزنس أكاديمي توفر لك تجربة تعليمية فريدة ومميزة لتطوير مهاراتك في عالم الأعمال
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-500 border border-gray-100 flex flex-col items-center text-center reveal-on-scroll" 
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="rounded-full bg-primary/10 p-4 mb-6">
        <Icon size={28} className="text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-primary">{feature.title}</h3>
      <p className="text-gray-600">{feature.description}</p>
    </div>
  );
};

export default FeaturesSection;
