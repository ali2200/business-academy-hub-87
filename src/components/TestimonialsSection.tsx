
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Mock testimonials data
const TESTIMONIALS = [
  {
    id: 1,
    name: 'محمد إبراهيم',
    role: 'مدير مبيعات',
    image: 'https://i.pravatar.cc/150?img=1',
    text: 'الدورات في بيزنس أكاديمي غيرت مسار حياتي المهنية بالكامل. المحتوى عملي ومفيد جدًا والمدربين خبراء حقيقيين في مجالاتهم. أنصح بشدة بالاشتراك في دوراتهم لكل من يريد تطوير مهاراته في البيع والتسويق.',
    rating: 5
  },
  {
    id: 2,
    name: 'سارة أحمد',
    role: 'صاحبة مشروع ناشئ',
    image: 'https://i.pravatar.cc/150?img=5',
    text: 'كنت محتارة في بداية مشروعي الخاص، ولكن بعد الاشتراك في دورة إدارة المشاريع الصغيرة، أصبح لدي رؤية واضحة وخطة عمل محددة. المحتوى باللهجة المصرية سهل الفهم والتطبيق. شكرًا بيزنس أكاديمي!',
    rating: 5
  },
  {
    id: 3,
    name: 'أحمد محمود',
    role: 'مسؤول تسويق',
    image: 'https://i.pravatar.cc/150?img=3',
    text: 'دورة التسويق الرقمي كانت نقطة تحول في مسيرتي المهنية. تعلمت استراتيجيات فعالة أدت لزيادة مبيعات الشركة بنسبة 40%. أنصح بها لكل من يريد تعلم التسويق الرقمي بطريقة عملية ومناسبة للسوق المصري.',
    rating: 4
  },
  {
    id: 4,
    name: 'ليلى محمد',
    role: 'مندوبة مبيعات',
    image: 'https://i.pravatar.cc/150?img=10',
    text: 'بعد أخذ دورة أساسيات البيع الاحترافي، تضاعفت مبيعاتي خلال شهرين فقط. تعلمت تقنيات إقناع وتفاوض لم أكن أعرفها من قبل. المدرب كان رائعًا وشرح كل شيء ببساطة وبأمثلة عملية من السوق المصري.',
    rating: 5
  },
  {
    id: 5,
    name: 'عمر خالد',
    role: 'مدير عام',
    image: 'https://i.pravatar.cc/150?img=12',
    text: 'استفدت كثيرًا من الكتب المتخصصة في بيزنس أكاديمي. المحتوى عميق ومفيد وفي نفس الوقت مقدم بطريقة سهلة الفهم. أنصح بها لكل مهتم بتطوير مهاراته في مجال إدارة الأعمال.',
    rating: 5
  }
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Handle next/prev navigation
  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % TESTIMONIALS.length);
    setIsAutoPlay(false);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    setIsAutoPlay(false);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  // Restart auto-play after 10 seconds of inactivity
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAutoPlay(true);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [activeIndex]);

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
    <section className="py-16 md:py-24 animated-gradient">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-10 md:mb-16 reveal-on-scroll">
          <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 mb-3 md:mb-4">آراء العملاء</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">ماذا يقول طلابنا</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
            اطلع على تجارب وآراء بعض طلابنا الذين استفادوا من دوراتنا وكتبنا في تطوير مهاراتهم
          </p>
        </div>

        {/* Testimonials carousel */}
        <div className="relative max-w-4xl mx-auto reveal-on-scroll">
          <div className="overflow-hidden px-0 md:px-4">
            <div className="flex transition-transform duration-500 ease-in-out" 
                style={{ transform: `translateX(${activeIndex * 100}%)` }}>
              {TESTIMONIALS.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-1 md:px-4">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center mt-6 md:mt-8 space-x-2 rtl:space-x-reverse">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handlePrev}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-primary hover:bg-primary hover:text-white transition-colors border-primary"
            >
              <ChevronRight size={16} className="md:w-5 md:h-5" />
            </Button>
            
            {/* Pagination indicators */}
            <div className="flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse mx-2 md:mx-4">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsAutoPlay(false);
                  }}
                  className={`h-2 md:h-3 rounded-full transition-all ${
                    activeIndex === index 
                      ? 'bg-primary w-4 md:w-6' 
                      : 'bg-gray-300 w-2 md:w-3 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleNext}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-primary hover:bg-primary hover:text-white transition-colors border-primary"
            >
              <ChevronLeft size={16} className="md:w-5 md:h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

type TestimonialCardProps = {
  testimonial: typeof TESTIMONIALS[0];
};

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <Card className="bg-white rounded-xl shadow-lg border-none overflow-hidden h-full">
      <CardContent className="p-4 md:p-8">
        {/* Quote icon */}
        <div className="mb-4 md:mb-6 text-primary/20">
          <svg width="36" height="36" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="md:w-12 md:h-12">
            <path d="M14.4 24H8V18.4C8 14.8654 10.8654 12 14.4 12H16V16H14.4C13.0745 16 12 17.0745 12 18.4V24ZM30.4 24H24V18.4C24 14.8654 26.8654 12 30.4 12H32V16H30.4C29.0745 16 28 17.0745 28 18.4V24Z" />
          </svg>
        </div>
        
        {/* Testimonial text */}
        <p className="text-gray-700 mb-6 text-sm md:text-lg leading-relaxed line-clamp-4 md:line-clamp-none">{testimonial.text}</p>
        
        {/* Rating */}
        <div className="flex mb-4 md:mb-6">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 md:w-5 md:h-5 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
        </div>
        
        {/* Author info */}
        <div className="flex items-center">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-secondary">
            <img 
              src={testimonial.image} 
              alt={testimonial.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mr-3 md:mr-4">
            <h4 className="font-bold text-primary text-sm md:text-base">{testimonial.name}</h4>
            <p className="text-gray-500 text-xs md:text-sm">{testimonial.role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialsSection;
