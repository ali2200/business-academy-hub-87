
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Loader2, Star, Clock, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";

// Categories with mapping
const CATEGORIES = [
  { id: 'all', name: 'الكل' },
  { id: 'sales', name: 'مبيعات' }, 
  { id: 'marketing', name: 'تسويق' }, 
  { id: 'business', name: 'إدارة' }, 
  { id: 'entrepreneurship', name: 'ريادة أعمال' }, 
  { id: 'development', name: 'تطوير ذاتي' }
];

// Levels with mapping
const LEVELS = [
  { id: 'all', name: 'كل المستويات' },
  { id: 'beginner', name: 'مبتدئ' },
  { id: 'intermediate', name: 'متوسط' },
  { id: 'advanced', name: 'متقدم' }
];

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch courses from Supabase
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }
      
      console.log('Fetched courses count:', data?.length || 0);
      return data || [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 10000, // Data becomes stale after 10 seconds
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Apply filters
  useEffect(() => {
    if (!courses) {
      setFilteredCourses([]);
      return;
    }

    let result = [...courses];

    // Search filter
    if (searchTerm) {
      result = result.filter(course => 
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(course => course.category === selectedCategory);
    }

    // Level filter
    if (selectedLevel !== 'all') {
      result = result.filter(course => course.level === selectedLevel);
    }

    // Price filter
    result = result.filter(course => 
      course.price >= priceRange[0] && course.price <= priceRange[1]
    );

    setFilteredCourses(result);
  }, [courses, searchTerm, selectedCategory, selectedLevel, priceRange]);

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
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-4">دوراتنا</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">دورات متخصصة في مجالات البيزنس</h1>
            <p className="text-gray-600 mb-8">
              تصفح مجموعة متميزة من الدورات التدريبية المتخصصة في مجالات البيزنس والمبيعات والتسويق
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
                        key={category.id}
                        className={`block w-full text-right py-1 px-2 rounded-md transition-colors ${
                          selectedCategory === category.id 
                            ? 'bg-primary text-white' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">المستوى</h4>
                  <div className="space-y-2">
                    {LEVELS.map(level => (
                      <button
                        key={level.id}
                        className={`block w-full text-right py-1 px-2 rounded-md transition-colors ${
                          selectedLevel === level.id 
                            ? 'bg-primary text-white' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedLevel(level.id)}
                      >
                        {level.name}
                      </button>
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
                    setSelectedCategory('all');
                    setSelectedLevel('all');
                    setPriceRange([0, 1000]);
                  }}
                >
                  إعادة تعيين الفلاتر
                </Button>
              </div>
            </div>
            
            {/* Courses grid */}
            <div className="lg:w-3/4">
              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                  <h3 className="text-xl font-bold mb-2 text-red-500">حدث خطأ</h3>
                  <p className="text-gray-600">لم نتمكن من تحميل الدورات، يرجى المحاولة مرة أخرى</p>
                </div>
              ) : filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
  course: any;
  index: number;
};

const CourseCard = ({ course, index }: CourseCardProps) => {
  // Determine if course is new based on creation date (within last 30 days)
  const isNew = new Date(course.created_at).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;
  
  // Determine if course is hot (simple logic based on students count)
  const isHot = course.students_count && course.students_count > 50;

  // Fallback rating information
  const rating = 4.7;
  const reviewCount = 85;

  // Map category code to Arabic display name
  const getCategoryName = (categoryCode?: string): string => {
    if (!categoryCode) return 'عام';
    
    const categoryMap: {[key: string]: string} = {
      'sales': 'مبيعات',
      'marketing': 'تسويق',
      'business': 'إدارة',
      'entrepreneurship': 'ريادة أعمال',
      'development': 'تطوير ذاتي'
    };
    
    return categoryMap[categoryCode] || categoryCode;
  };
  
  // Map level code to Arabic display name
  const getLevelName = (levelCode?: string): string => {
    if (!levelCode) return 'عام';
    
    const levelMap: {[key: string]: string} = {
      'beginner': 'مبتدئ',
      'intermediate': 'متوسط',
      'advanced': 'متقدم',
      'all': 'جميع المستويات'
    };
    
    return levelMap[levelCode] || levelCode;
  };

  return (
    <Card className="overflow-hidden border-none shadow-card hover:shadow-hover transition-all duration-500 card-hover reveal-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="relative group">
        {/* Image */}
        <div className="relative h-[220px] overflow-hidden">
          <img 
            src={course.image_url || `https://source.unsplash.com/random/600x400?business,${course.id}`} 
            alt={course.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
            <Link to={`/courses/${course.id}`}>
              <Button className="bg-white text-primary hover:bg-primary hover:text-white transition-all mb-4">
                عرض التفاصيل
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {isHot && (
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
              الأكثر مبيعًا
            </span>
          )}
          {isNew && (
            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
              جديد
            </span>
          )}
        </div>
        
        {/* Category */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-white/80 backdrop-blur-md text-primary text-xs px-3 py-1 rounded-full">
            {getCategoryName(course.category)}
          </span>
        </div>
      </div>
      
      <CardContent className="p-4 text-center">
        <div className="font-semibold text-sm text-gray-500 mb-2 flex items-center justify-center">
          <span>{course.instructor}</span>
          <span className="mx-2">•</span>
          <span>{getLevelName(course.level)}</span>
        </div>
        <h3 className="text-lg font-bold text-primary mb-2 line-clamp-1">{course.title}</h3>
        
        {/* Rating */}
        <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse mb-3">
          <div className="text-yellow-400 flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={16}
                className={i < Math.floor(rating) ? "fill-yellow-400" : "fill-gray-300"}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{rating}</span>
          <span className="text-xs text-gray-500">({reviewCount} تقييم)</span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {course.description || 'دورة تدريبية متميزة لتطوير مهاراتك'}
        </p>
        
        {/* Course details */}
        <div className="flex justify-between text-sm text-gray-500">
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
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-gray-100 mt-4">
        <div>
          <span className="text-secondary font-bold text-xl">{course.price} {course.currency}</span>
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
