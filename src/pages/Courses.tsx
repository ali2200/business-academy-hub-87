
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CourseCard } from '@/components/ui/course-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Filter } from 'lucide-react';

const Courses = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);

  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      console.log('Fetching courses for Courses page...');
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
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true, // Refetch when component mounts
    staleTime: 10000, // Data becomes stale after 10 seconds
  });

  useEffect(() => {
    if (!courses) {
      setFilteredCourses([]);
      return;
    }

    let filtered = [...courses];

    // Filter by search
    if (search) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description?.toLowerCase().includes(search.toLowerCase()) ||
        course.instructor.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by category
    if (category && category !== 'all') {
      filtered = filtered.filter(course => course.category === category);
    }

    setFilteredCourses(filtered);
  }, [courses, search, category]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">استكشف دوراتنا التدريبية</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
            مجموعة متنوعة من الدورات التدريبية المتميزة لتطوير مهاراتك وبناء مستقبلك المهني
          </p>
        </div>
      </section>
      
      {/* Filters Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                type="text" 
                placeholder="ابحث عن دورة..." 
                className="w-full pl-4 pr-10" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <div className="w-full md:w-48">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع التصنيفات</SelectItem>
                    <SelectItem value="sales">مبيعات</SelectItem>
                    <SelectItem value="marketing">تسويق</SelectItem>
                    <SelectItem value="business">إدارة</SelectItem>
                    <SelectItem value="entrepreneurship">ريادة أعمال</SelectItem>
                    <SelectItem value="development">تطوير ذاتي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Courses Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-24 text-red-500">
              <p className="text-xl">حدث خطأ أثناء تحميل الدورات</p>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  instructor={course.instructor}
                  image={course.image_url}
                  price={course.price}
                  currency={course.currency}
                  category={course.category}
                  level={course.level}
                  duration={course.duration}
                  students={course.students_count || 0}
                  isNew={new Date(course.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-xl">لا توجد دورات متاحة تطابق معايير البحث</p>
              {search || category !== 'all' ? (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearch('');
                    setCategory('all');
                  }}
                >
                  إعادة ضبط الفلتر
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Courses;
