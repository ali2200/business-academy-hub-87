
import React, { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate mouse position as percentages
      const moveX = (clientX / innerWidth) - 0.5;
      const moveY = (clientY / innerHeight) - 0.5;
      
      // Apply the parallax effect to various elements
      const elements = heroRef.current?.querySelectorAll('.parallax') || [];
      elements.forEach((el) => {
        const strength = Number(el.getAttribute('data-strength') || 20);
        const element = el as HTMLElement;
        element.style.transform = `translate(${moveX * strength}px, ${moveY * strength}px)`;
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center animated-gradient overflow-hidden pt-24"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 bg-secondary/5 w-96 h-96 rounded-full blur-3xl parallax" data-strength="40"></div>
        <div className="absolute -left-20 top-1/3 bg-primary/5 w-80 h-80 rounded-full blur-3xl parallax" data-strength="30"></div>
        <div className="absolute right-1/4 bottom-1/4 bg-secondary/10 w-64 h-64 rounded-full blur-3xl parallax" data-strength="20"></div>
      </div>
      
      <div className="container mx-auto px-4 z-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <div className="inline-block bg-secondary/10 text-secondary px-4 py-1 rounded-full mb-6 animate-fade-in">
              أفضل منصة تعليمية عربية للبيزنس
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.2s' }}>
              تعلم <span className="text-secondary">مهارات البيزنس</span> بالطريقة الصحيحة
            </h1>
            <p className="text-lg text-gray-600 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              منصة بيزنس أكاديمي هي وجهتك الأولى لتعلم مهارات البيزنس والمبيعات والتسويق باللهجة المصرية. دورات احترافية وكتب متخصصة لتطوير مهاراتك وتحقيق نجاحك.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Button className="bg-secondary hover:bg-secondary-light text-white px-8 py-6 rounded-xl flex items-center space-x-2 rtl:space-x-reverse shadow-lg hover:shadow-xl transition-all">
                <span className="text-lg">استكشف الدورات</span>
                <ArrowLeft size={20} />
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 rounded-xl text-lg transition-all">
                تصفح الكتب
              </Button>
            </div>
            <div className="mt-10 flex items-center space-x-6 rtl:space-x-reverse animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="flex -space-x-4 rtl:space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                    <img 
                      src={`https://i.pravatar.cc/150?img=${i+20}`} 
                      alt="User" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div>
                <div className="font-bold text-primary">+1,500 طالب</div>
                <div className="text-sm text-gray-500">انضموا بالفعل</div>
              </div>
            </div>
          </div>
          
          {/* Image/Illustration */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl transform rotate-6 parallax" data-strength="5"></div>
              <div className="glassmorphism p-4 rounded-2xl shadow-xl relative z-10 transform transition-transform hover:scale-105 duration-700">
                <img 
                  src="/images/hero.svg" 
                  alt="Business Academy Hub" 
                  className="w-full h-auto max-w-md mx-auto parallax" 
                  data-strength="10"
                />
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl -z-10"></div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-10 -right-10 bg-white p-3 rounded-xl shadow-lg animate-float parallax" data-strength="15">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold">4.9/5</div>
                    <div className="text-xs text-gray-500">تقييم الطلاب</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-5 -left-5 bg-white p-3 rounded-xl shadow-lg animate-float parallax" data-strength="10" style={{ animationDelay: '1s' }}>
                <div className="text-center">
                  <div className="text-secondary font-bold text-lg">+25</div>
                  <div className="text-xs text-gray-500">دورة تدريبية</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
