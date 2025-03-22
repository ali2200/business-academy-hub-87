
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

const BENEFITS = [
  'محتوى عربي أصيل باللهجة المصرية',
  'دورات وكتب مصممة خصيصًا للسوق المصري',
  'مدربين محترفين ذوي خبرة واسعة',
  'شهادات معتمدة بعد إكمال الدورات',
  'تطبيقات عملية وأمثلة واقعية',
  'دعم فني وأكاديمي على مدار الساعة'
];

const CtaSection = () => {
  return (
    <section className="bg-primary py-12 md:py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-1/4 top-10 bg-white/5 w-60 md:w-96 h-60 md:h-96 rounded-full blur-3xl"></div>
        <div className="absolute left-1/4 bottom-10 bg-secondary/10 w-48 md:w-80 h-48 md:h-80 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* CTA Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-white text-center lg:text-right">ابدأ رحلة تعلم مهارات البيزنس الآن</h2>
            <p className="text-white/80 text-sm md:text-lg mb-6 md:mb-8 text-center lg:text-right">
              انضم إلى آلاف المتعلمين الذين طوروا مهاراتهم وحياتهم المهنية مع بيزنس أكاديمي.
            </p>
            
            {/* Benefits list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 md:gap-y-3 mb-6 md:mb-8">
              {BENEFITS.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="bg-secondary rounded-full p-1 flex-shrink-0">
                    <Check size={12} className="text-white" />
                  </div>
                  <span className="text-white/90 text-xs md:text-base">{benefit}</span>
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4 mt-6 md:mt-8">
              <Link to="/courses">
                <Button className="bg-secondary hover:bg-secondary-light text-white px-5 py-5 md:px-8 md:py-6 rounded-xl flex items-center space-x-2 rtl:space-x-reverse shadow-lg shadow-secondary/20 hover:shadow-xl transition-all text-sm md:text-lg">
                  <span>ابدأ التعلم الآن</span>
                  <ArrowLeft size={18} />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-5 py-5 md:px-8 md:py-6 rounded-xl text-sm md:text-lg transition-all">
                  تواصل معنا
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 md:gap-6">
            <StatCard number="25+" label="دورة تدريبية" />
            <StatCard number="15+" label="كتاب متخصص" />
            <StatCard number="1,500+" label="طالب" />
            <StatCard number="10+" label="مدرب محترف" />
          </div>
        </div>
      </div>
    </section>
  );
};

type StatCardProps = {
  number: string;
  label: string;
};

const StatCard = ({ number, label }: StatCardProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 text-center border border-white/20 hover:bg-white/15 transition-colors">
      <div className="text-secondary text-2xl md:text-4xl font-bold mb-1 md:mb-2">{number}</div>
      <div className="text-white text-sm md:text-base">{label}</div>
    </div>
  );
};

export default CtaSection;
