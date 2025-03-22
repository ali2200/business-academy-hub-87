
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Clock, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for courses
const COURSES = [
  {
    id: 1,
    title: 'أساسيات البيع الاحترافي',
    description: 'تعلم أساسيات البيع وتقنيات الإقناع والتفاوض لتحسين أدائك كمندوب مبيعات',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
    instructor: 'أحمد محمد',
    price: 599,
    category: 'مبيعات',
    level: 'مبتدئ',
    students: 125,
    duration: '5 ساعات',
    isFeatured: true,
    isHot: true
  },
  {
    id: 2,
    title: 'التسويق الرقمي للمبتدئين',
    description: 'دورة شاملة في التسويق الرقمي وكيفية استخدام وسائل التواصل الاجتماعي لتنمية مشروعك',
    image: 'https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=2069&auto=format&fit=crop',
    instructor: 'سارة أحمد',
    price: 799,
    category: 'تسويق',
    level: 'مبتدئ',
    students: 210,
    duration: '8 ساعات',
    isFeatured: true,
    isNew: true
  },
  {
    id: 3,
    title: 'إدارة المشاريع الصغيرة',
    description: 'كيفية بدء وإدارة مشروع صغير بنجاح من الصفر وحتى تحقيق الأرباح',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
    instructor: 'محمد علي',
    price: 699,
    category: 'إدارة',
    level: 'متوسط',
    students: 95,
    duration: '6 ساعات',
    isFeatured: true
  },
  {
    id: 4,
    title: 'استراتيجيات التفاوض المتقدمة',
    description: 'تقنيات وأساليب متقدمة في التفاوض لإتمام الصفقات بنجاح وتحقيق أفضل النتائج',
    image: 'https://images.unsplash.com/photo-1573167507387-6b4b98cb7c13?q=80&w=2069&auto=format&fit=crop',
    instructor: 'أمير حسن',
    price: 899,
    category: 'مبيعات',
    level: 'متقدم',
    students: 63,
    duration: '7 ساعات',
    isHot: true
  }
];

// Categories
const CATEGORIES = ['الكل', 'مبيعات', 'تسويق', 'إدارة', 'ريادة أعمال', 'تطوير ذاتي'];

const CoursesSection = () => {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [filteredCourses, setFilteredCourses] = useState(COURSES);

  useEffect(() => {
    if (activeCategory === 'الكل') {
      setFilteredCourses(COURSES);
    } else {
      setFilteredCourses(COURSES.filter(course => course.category === activeCategory));
    }
  }, [activeCategory]);

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
    <section className="section-padding animated-gradient">
      <div className="container mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 reveal-on-scroll">
          <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 mb-4">دوراتنا التدريبية</Badge>
          <h2 className="text-4xl font-bold mb-6">أحدث الدورات التدريبية</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            اختر من بين مجموعة متنوعة من الدورات التدريبية المصممة خصيصًا لتنمية مهاراتك في مجالات البيزنس، المبيعات والتسويق
          </p>
        </div>

        {/* Categories filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 reveal-on-scroll">
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

        {/* Courses grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCourses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 reveal-on-scroll">
          <Link to="/courses">
            <Button className="bg-primary hover:bg-primary-light text-white px-8 py-6 rounded-xl flex items-center space-x-2 rtl:space-x-reverse mx-auto shadow-lg hover:shadow-xl transition-all">
              <span className="text-lg">عرض جميع الدورات</span>
              <ArrowLeft size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

type CourseCardProps = {
  course: typeof COURSES[0];
  index: number;
};

const CourseCard = ({ course, index }: CourseCardProps) => {
  return (
    <Card className="overflow-hidden bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 card-hover reveal-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {course.isHot && (
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
              الأكثر مبيعًا
            </span>
          )}
          {course.isNew && (
            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
              جديد
            </span>
          )}
        </div>
        
        {/* Category */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-white/80 backdrop-blur-md text-primary text-xs px-3 py-1 rounded-full">
            {course.category}
          </span>
        </div>
      </div>
      
      <CardHeader className="p-4 pb-0">
        <div className="font-semibold text-sm text-gray-500 mb-2 flex items-center">
          <span>{course.instructor}</span>
          <span className="mx-2">•</span>
          <span>{course.level}</span>
        </div>
        <h3 className="text-xl font-bold text-primary line-clamp-2">{course.title}</h3>
      </CardHeader>
      
      <CardContent className="p-4">
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{course.description}</p>
        <div className="flex justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Users size={16} className="ml-1" />
            <span>{course.students} طالب</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="ml-1" />
            <span>{course.duration}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-gray-100 mt-2">
        <div>
          <span className="text-secondary font-bold text-xl">{course.price} ج.م</span>
        </div>
        <Link to={`/courses/${course.id}`}>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white transition-all">
            عرض التفاصيل
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CoursesSection;
