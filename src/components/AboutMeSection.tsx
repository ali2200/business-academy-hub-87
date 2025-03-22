
import React from 'react';
import { GraduationCap, BookOpen, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";

const AboutMeSection = () => {
  return (
    <section className="section-padding py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto">
        <div className="flex flex-col items-center">
          {/* Title */}
          <h2 className="text-4xl font-bold mb-12 text-center">
            <span className="text-primary">تعرف على </span>
            <span className="text-secondary">بيزنس أكاديمي</span>
          </h2>

          {/* Video Section - Now at the top */}
          <div className="w-full max-w-5xl mx-auto mb-16 relative">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 rounded-2xl overflow-hidden border border-gray-100 shadow-xl">
              <video 
                className="w-full h-auto"
                controls
                autoPlay
                muted
                loop
                poster="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop"
              >
                <source src="https://static.videezy.com/system/resources/previews/000/005/529/original/Reaviling_Sjusj%C3%B8en_Ski_Senter.mp4" type="video/mp4" />
                عذراً، متصفحك لا يدعم تشغيل الفيديو
              </video>
            </div>
            <div className="absolute bottom-4 right-4 bg-white p-6 rounded-xl shadow-lg z-20 max-w-xs">
              <p className="text-primary font-bold text-lg mb-2">مرحبًا بك في بيزنس أكاديمي!</p>
              <p className="text-gray-600">أنا مدرس متخصص في مجالات البيزنس والمبيعات والتسويق، وهدفي مساعدتك على النجاح في عالم الأعمال.</p>
            </div>
          </div>

          {/* Content Section - Now below the video */}
          <div className="w-full max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-10 text-center">
              أنا أحمد، خبير في مجال البيزنس والمبيعات مع خبرة تمتد لأكثر من 10 سنوات في السوق المصري. أسست بيزنس أكاديمي لمساعدة رواد الأعمال والمهنيين المصريين على تطوير مهاراتهم وتحقيق النجاح في عالم الأعمال.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
                <div className="bg-primary/10 p-4 rounded-lg inline-block mb-4">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">دورات تدريبية احترافية</h3>
                <p className="text-gray-600">
                  دورات متخصصة في مجالات البيع والتسويق وإدارة الأعمال مقدمة باللهجة المصرية لتناسب احتياجات السوق المحلي.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
                <div className="bg-secondary/10 p-4 rounded-lg inline-block mb-4">
                  <BookOpen className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">كتب ومراجع تعليمية</h3>
                <p className="text-gray-600">
                  مجموعة من الكتب الإلكترونية المتخصصة التي تشرح أساسيات ومفاهيم البيزنس بطريقة سهلة وعملية.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
                <div className="bg-green-100 p-4 rounded-lg inline-block mb-4">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">خبرة عملية حقيقية</h3>
                <p className="text-gray-600">
                  محتوى مبني على تجارب حقيقية وخبرات عملية في السوق المصري، وليس مجرد نظريات.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <Button 
                className="bg-primary hover:bg-primary-light text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                اعرف المزيد عني
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMeSection;
