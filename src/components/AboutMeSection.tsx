
import React from 'react';
import { GraduationCap, BookOpen, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";

const AboutMeSection = () => {
  return (
    <section className="section-padding py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 rounded-2xl overflow-hidden border border-gray-100 shadow-xl">
              <img 
                src="/images/instructor.jpg" 
                alt="أحمد المدرس" 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop";
                }}
              />
            </div>
            <div className="absolute bottom-4 right-4 bg-white p-6 rounded-xl shadow-lg z-20 max-w-xs">
              <p className="text-primary font-bold text-lg mb-2">مرحبًا بك في بيزنس أكاديمي!</p>
              <p className="text-gray-600">أنا مدرس متخصص في مجالات البيزنس والمبيعات والتسويق، وهدفي مساعدتك على النجاح في عالم الأعمال.</p>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl font-bold mb-6 text-primary">تعرف على <span className="text-secondary">بيزنس أكاديمي</span></h2>
            <p className="text-lg text-gray-600 mb-8">
              أنا أحمد، خبير في مجال البيزنس والمبيعات مع خبرة تمتد لأكثر من 10 سنوات في السوق المصري. أسست بيزنس أكاديمي لمساعدة رواد الأعمال والمهنيين المصريين على تطوير مهاراتهم وتحقيق النجاح في عالم الأعمال.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">دورات تدريبية احترافية</h3>
                  <p className="text-gray-600">
                    دورات متخصصة في مجالات البيع والتسويق وإدارة الأعمال مقدمة باللهجة المصرية لتناسب احتياجات السوق المحلي.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="bg-secondary/10 p-3 rounded-lg">
                  <BookOpen className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">كتب ومراجع تعليمية</h3>
                  <p className="text-gray-600">
                    مجموعة من الكتب الإلكترونية المتخصصة التي تشرح أساسيات ومفاهيم البيزنس بطريقة سهلة وعملية.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">خبرة عملية حقيقية</h3>
                  <p className="text-gray-600">
                    محتوى مبني على تجارب حقيقية وخبرات عملية في السوق المصري، وليس مجرد نظريات.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              className="bg-primary hover:bg-primary-light text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              اعرف المزيد عني
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMeSection;
