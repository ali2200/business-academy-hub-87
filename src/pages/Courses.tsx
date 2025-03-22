import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Clock, Award, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

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
  },
  {
    id: 5,
    title: 'فن إدارة الموارد البشرية',
    description: 'تعلم أساسيات وتقنيات إدارة فريق العمل بكفاءة وتحفيز الموظفين لتحقيق أفضل النتائج',
    image: 'https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?q=80&w=1964&auto=format&fit=crop',
    instructor: 'رانيا خالد',
    price: 699,
    category: 'إدارة',
    level: 'متوسط',
    students: 78,
    duration: '6 ساعات',
    isNew: true
  },
  {
    id: 6,
    title: 'تطوير مهارات التواصل في بيئة العمل',
    description: 'كيفية تحسين مهارات التواصل والعرض التقديمي والتأثير في بيئة العمل',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop',
    instructor: 'هاني سمير',
    price: 499,
    category: 'تطوير ذاتي',
    level: 'مبتدئ',
    students: 142,
    duration: '4 ساعات'
  },
  {
    id: 7,
    title: 'إدارة الحملات الإعلانية على السوشيال ميديا',
    description: 'تعلم كيفية إعداد وإدارة حملات إعلانية ناجحة على منصات التواصل الاجتماعي',
    image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1974&auto=format&fit=crop',
    instructor: 'سارة أحمد',
    price: 799,
    category: 'تسويق',
    level: 'متوسط',
    students: 115,
    duration: '7 ساعات',
    isHot: true
  },
  {
    id: 8,
    title: 'تحليل البيانات لاتخاذ القرارات التجارية',
    description: 'استخدام تحليل البيانات لاتخاذ قرارات تجارية مبنية على أسس علمية',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    instructor: 'علي حسام',
    price: 899,
    category: 'إدارة',
    level: 'متقدم',
    students: 58,
    duration: '9 ساعات',
    isNew: true
  }
];

// Categories
const CATEGORIES = ['الكل', 'مبيعات', 'تسويق', 'إدارة', 'ريادة أعمال', 'تطوير ذاتي'];

// Levels
const LEVELS = ['مبتدئ', 'متوسط', 'متقدم'];

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [filteredCourses, setFilteredCourses] = useState(COURSES);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = COURSES;

    // Search filter
    if (searchTerm) {
      result = result.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'الكل') {
      result = result.filter(course => course.category === selectedCategory);
    }

    // Level filter
    if (selectedLevels.length > 0) {
      result = result.filter(course => selectedLevels.includes(course.level));
    }

    // Price filter
    result = result.filter(course => 
      course.price >= priceRange[0] && course.price <= priceRange[1]
    );

    setFilteredCourses(result);
  }, [searchTerm, selectedCategory, selectedLevels, priceRange]);

  const toggleLevel = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level) 
        : [...prev, level]
    );
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
    <div className="min-h-screen">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-16 animated-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 mb-4">الدورات التد��يبية</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">دورات احترافية في مجالات البيزنس</h1>
            <p className="text-gray-600 mb-8">
              تصفح مجموعة متنوعة من الدورات التدريبية في مجالات البيزنس والمبيعات والتسويق المصممة خصيصًا للسوق المصري
            </p>
            
            {/* Search bar */}
            <div className="relative max-w-lg mx-auto mb-8">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                type="text" 
                placeholder="ابحث عن دورة..." 
                className="py-6 pr-10 rounded-xl border-gray-300 focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Courses listing */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters - Mobile Toggle */}
            <div className="lg:hidden w-full mb-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                <span>{showFilters ? 'إخفاء الفلاتر' : 'عرض الفلاتر'}</span>
              </Button>
            </div>
            
            {/* Filters sidebar */}
            <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <h3 className="text-xl font-bold mb-6 text-primary">تصفية النتائج</h3>
                
                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">التصنيفات</h4>
                  <div className="space-y-2">
                    {CATEGORIES.map(category => (
                      <button
                        key={category}
                        className={`block w-full text-right py-1 px-2 rounded-md transition-colors ${
                          selectedCategory === category 
                            ? 'bg-primary text-white' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Levels */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">المستوى</h4>
                  <div className="space-y-2">
                    {LEVELS.map(level => (
                      <div key={level} className="flex items-center">
                        <Checkbox 
                          id={`level-${level}`} 
                          checked={selectedLevels.includes(level)}
                          onCheckedChange={() => toggleLevel(level)}
                          className="border-gray-400"
                        />
                        <label htmlFor={`level-${level}`} className="mr-2 cursor-pointer">
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price range */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">السعر</h4>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 1000]}
                      max={1000}
                      step={50}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{priceRange[0]} ج.م</span>
                      <span>{priceRange[1]} ج.م</span>
                    </div>
                  </div>
                </div>
                
                {/* Reset filters */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('الكل');
                    setSelectedLevels([]);
                    setPriceRange([0, 1000]);
                  }}
                >
                  إعادة تعيين الفلاتر
                </Button>
              </div>
            </div>
            
            {/* Courses grid */}
            <div className="lg:w-3/4">
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCourses.map((course, index) => (
                    <CourseCard key={course.id} course={course} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                  <h3 className="text-xl font-bold mb-2">لا توجد نتائج</h3>
                  <p className="text-gray-600">لم نتمكن من العثور على دورات تطابق معايير البحث الخاصة بك</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
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

export default Courses;
