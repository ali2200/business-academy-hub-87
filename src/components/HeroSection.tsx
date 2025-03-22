
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
      className="relative min-h-[90vh] flex items-center animated-gradient overflow-hidden pt-28 md:pt-24"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 bg-secondary/5 w-96 h-96 rounded-full blur-3xl parallax" data-strength="40"></div>
        <div className="absolute -left-20 top-1/3 bg-primary/5 w-80 h-80 rounded-full blur-3xl parallax" data-strength="30"></div>
        <div className="absolute right-1/4 bottom-1/4 bg-secondary/10 w-64 h-64 rounded-full blur-3xl parallax" data-strength="20"></div>
      </div>
      
      <div className="container mx-auto px-4 z-10 py-6 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Image/Illustration - First on mobile */}
          <div className="order-1 lg:order-2 flex justify-center mb-8 md:mb-0">
            <div className="relative w-full max-w-sm md:max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl transform rotate-6 parallax" data-strength="5"></div>
              <div className="glassmorphism p-4 rounded-2xl shadow-xl relative z-10 transform transition-transform hover:scale-105 duration-700">
                <img 
                  src="/images/hero.svg" 
                  alt="Ali For Business Hub" 
                  className="w-full h-auto mx-auto parallax" 
                  data-strength="10"
                />
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl -z-10"></div>
              </div>
              
              {/* Floating elements - hidden on smallest screens */}
              <div className="absolute -top-10 -right-5 sm:-right-10 bg-white p-2 sm:p-3 rounded-xl shadow-lg animate-float parallax hidden sm:block" data-strength="15">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-secondary rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold">4.9/5</div>
                    <div className="text-[10px] sm:text-xs text-gray-500">تقييم الطلاب</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-5 -left-5 bg-white p-2 sm:p-3 rounded-xl shadow-lg animate-float parallax hidden sm:block" data-strength="10" style={{ animationDelay: '1s' }}>
                <div className="text-center">
                  <div className="text-secondary font-bold text-base sm:text-lg">+25</div>
                  <div className="text-[10px] sm:text-xs text-gray-500">دورة تدريبية</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Text Content - Second on mobile */}
          <div className="order-2 lg:order-1 text-center lg:text-right">
            <div className="inline-block bg-secondary/10 text-secondary px-3 py-1 rounded-full mb-4 text-sm animate-fade-in">
              أفضل منصة تعليمية عربية للبيزنس
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.2s' }}>
              تعلم <span className="text-secondary">مهارات البيزنس</span> بالطريقة الصحيحة
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              منصة عـــلى بتاع الـبيزنس هي وجهتك الأولى لتعلم مهارات البيزنس والمبيعات والتسويق باللهجة المصرية.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Button className="bg-secondary hover:bg-secondary-light text-white px-5 py-5 md:px-8 md:py-6 rounded-xl flex items-center space-x-2 rtl:space-x-reverse shadow-lg hover:shadow-xl transition-all text-base md:text-lg">
                <span>استكشف الدورات</span>
                <ArrowLeft size={18} />
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-5 py-5 md:px-8 md:py-6 rounded-xl text-base md:text-lg transition-all">
                تصفح الكتب
              </Button>
            </div>
            <div className="mt-8 flex items-center space-x-4 rtl:space-x-reverse justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="flex -space-x-3 rtl:space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                    <img 
                      src={`https://i.pravatar.cc/150?img=${i+20}`} 
                      alt="User" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div>
                <div className="font-bold text-primary text-sm md:text-base">+1,500 طالب</div>
                <div className="text-xs md:text-sm text-gray-500">انضموا بالفعل</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
