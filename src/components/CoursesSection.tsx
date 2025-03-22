
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Clock, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface CourseData {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  instructor: string;
  price: number;
  currency: string;
  category?: string;
  level?: string;
  students_count: number;
  duration?: string;
  status: string;
  created_at: string;
  updated_at: string;
  isFeatured?: boolean;
  isHot?: boolean;
  isNew?: boolean;
}

// Categories
const CATEGORIES = ['الكل', 'مبيعات', 'تسويق', 'إدارة', 'ريادة أعمال', 'تطوير ذاتي'];

const CoursesSection = () => {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (activeCategory === 'الكل') {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(courses.filter(course => course.category === activeCategory));
    }
  }, [activeCategory, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // Fetch published courses from Supabase
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('status', 'published');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Format and enhance data with UI-specific properties
        const enhancedData = data.map((course, index) => ({
          ...course,
          isFeatured: index < 3, // First 3 courses are featured
          isHot: index % 3 === 0, // Every 3rd course is hot
          isNew: new Date(course.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 // New if created in the last 7 days
        }));
        
        setCourses(enhancedData);
      } else {
        // Fallback to mock data if no courses are available
        setCourses(MOCK_COURSES);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses(MOCK_COURSES);
    } finally {
      setLoading(false);
    }
  };

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
  }, [filteredCourses]);

  return (
    <section className="py-16 md:py-24 animated-gradient">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-10 md:mb-16 reveal-on-scroll">
          <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 mb-3 md:mb-4">دوراتنا التدريبية</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">أحدث الدورات التدريبية</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
            اختر من بين مجموعة متنوعة من الدورات التدريبية المصممة خصيصًا لتنمية مهاراتك
          </p>
        </div>

        {/* Categories filter - scrollable on mobile */}
        <div className="mb-8 md:mb-12 reveal-on-scroll">
          <ScrollArea className="w-full pb-4 md:hidden">
            <div className="flex gap-2 w-max">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  className={`rounded-full px-4 py-1.5 transition-all whitespace-nowrap ${
                    activeCategory === category 
                      ? 'bg-primary text-white' 
                      : 'border-gray-300 text-gray-700 hover:border-primary hover:text-primary'
                  }`}
                  onClick={() => setActiveCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </ScrollArea>
          
          <div className="hidden md:flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={`rounded-full px-6 py-2 transition-all ${
                  activeCategory === category 
                    ? 'bg-primary text-white' 
                    : 'border-gray-300 text-gray-700 hover:border-primary hover:text-primary'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Courses grid */}
        {loading ? (
          <div className="text-center py-12">
            <p>جاري تحميل الدورات...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {filteredCourses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-10 md:mt-16 reveal-on-scroll">
          <Link to="/courses">
            <Button className="bg-primary hover:bg-primary-light text-white px-6 py-5 md:px-8 md:py-6 rounded-xl flex items-center space-x-2 rtl:space-x-reverse mx-auto shadow-lg hover:shadow-xl transition-all text-base md:text-lg">
              <span>عرض جميع الدورات</span>
              <ArrowLeft size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

type CourseCardProps = {
  course: CourseData;
  index: number;
};

const CourseCard = ({ course, index }: CourseCardProps) => {
  return (
    <Card className="overflow-hidden bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 card-hover reveal-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
      {/* Image */}
      <div className="relative overflow-hidden h-36 sm:h-40 md:h-48">
        <img 
          src={course.image_url || `https://source.unsplash.com/random/400x300?business,${course.id}`} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 md:gap-2">
          {course.isHot && (
            <span className="bg-red-500 text-white text-[10px] md:text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full">
              الأكثر مبيعًا
            </span>
          )}
          {course.isNew && (
            <span className="bg-green-500 text-white text-[10px] md:text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full">
              جديد
            </span>
          )}
        </div>
        
        {/* Category */}
        <div className="absolute bottom-2 right-2">
          <span className="bg-white/80 backdrop-blur-md text-primary text-[10px] md:text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full">
            {course.category || 'عام'}
          </span>
        </div>
      </div>
      
      <CardHeader className="p-3 md:p-4 pb-0">
        <div className="font-semibold text-xs md:text-sm text-gray-500 mb-1 md:mb-2 flex items-center">
          <span>{course.instructor}</span>
          <span className="mx-1 md:mx-2">•</span>
          <span>{course.level === 'beginner' ? 'مبتدئ' : 
                course.level === 'intermediate' ? 'متوسط' : 
                course.level === 'advanced' ? 'متقدم' : 'عام'}</span>
        </div>
        <h3 className="text-base md:text-xl font-bold text-primary line-clamp-2">{course.title}</h3>
      </CardHeader>
      
      <CardContent className="p-3 md:p-4">
        <p className="text-gray-600 text-xs md:text-sm line-clamp-2 mb-3 md:mb-4">{course.description || 'دورة تدريبية متميزة لتطوير مهاراتك'}</p>
        <div className="flex justify-between text-xs md:text-sm text-gray-500">
          <div className="flex items-center">
            <Users size={14} className="ml-1" />
            <span>{course.students_count || 0} طالب</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="ml-1" />
            <span>{course.duration || '-'}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 md:p-4 pt-2 md:pt-0 flex justify-between items-center border-t border-gray-100 mt-2">
        <div>
          <span className="text-secondary font-bold text-base md:text-xl">{course.price} {course.currency}</span>
        </div>
        <Link to={`/courses/${course.id}`}>
          <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs md:text-sm">
            عرض التفاصيل
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

// Mock data as fallback if API fails
const MOCK_COURSES: CourseData[] = [
  {
    id: '1',
    title: 'أساسيات البيع الاحترافي',
    description: 'تعلم أساسيات البيع وتقنيات الإقناع والتفاوض لتحسين أدائك كمندوب مبيعات',
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
    instructor: 'أحمد محمد',
    price: 599,
    currency: 'EGP',
    category: 'مبيعات',
    level: 'beginner',
    students_count: 125,
    duration: '5 ساعات',
    status: 'published',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    isFeatured: true,
    isHot: true
  },
  {
    id: '2',
    title: 'التسويق الرقمي للمبتدئين',
    description: 'دورة شاملة في التسويق الرقمي وكيفية استخدام وسائل التواصل الاجتماعي لتنمية مشروعك',
    image_url: 'https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=2069&auto=format&fit=crop',
    instructor: 'سارة أحمد',
    price: 799,
    currency: 'EGP',
    category: 'تسويق',
    level: 'beginner',
    students_count: 210,
    duration: '8 ساعات',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    isFeatured: true,
    isNew: true
  },
  {
    id: '3',
    title: 'إدارة المشاريع الصغيرة',
    description: 'كيفية بدء وإدارة مشروع صغير بنجاح من الصفر وحتى تحقيق الأرباح',
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
    instructor: 'محمد علي',
    price: 699,
    currency: 'EGP',
    category: 'إدارة',
    level: 'intermediate',
    students_count: 95,
    duration: '6 ساعات',
    status: 'published',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    isFeatured: true
  },
  {
    id: '4',
    title: 'استراتيجيات التفاوض المتقدمة',
    description: 'تقنيات وأساليب متقدمة في التفاوض لإتمام الصفقات بنجاح وتحقيق أفضل النتائج',
    image_url: 'https://images.unsplash.com/photo-1573167507387-6b4b98cb7c13?q=80&w=2069&auto=format&fit=crop',
    instructor: 'أمير حسن',
    price: 899,
    currency: 'EGP',
    category: 'مبيعات',
    level: 'advanced',
    students_count: 63,
    duration: '7 ساعات',
    status: 'published',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    isHot: true
  }
];

export default CoursesSection;
