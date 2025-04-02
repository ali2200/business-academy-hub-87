
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, Pie, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const InstructorAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [viewsData, setViewsData] = useState<any[]>([]);
  const [enrollmentsData, setEnrollmentsData] = useState<any[]>([]);
  const [courseStats, setCourseStats] = useState<any[]>([]);
  
  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      fetchAnalyticsData();
      generateMockData();
    }
  }, [courses, selectedCourse, timeRange]);
  
  const fetchCourses = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return;
      }
      
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, students_count')
        .order('students_count', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setCourses(data || []);
      if (data && data.length > 0) {
        setSelectedCourse(data[0].id);
      }
      
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('حدث خطأ أثناء تحميل الدورات');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchAnalyticsData = async () => {
    // In a real application, you would fetch analytics data from your database
    // For this example, we'll create mock data based on the actual courses
    
    // Mock course stats data
    const statData = courses.map(course => ({
      name: course.title,
      students: course.students_count || 0,
      views: Math.floor(Math.random() * 500) + 100,
      completionRate: Math.floor(Math.random() * 100)
    }));
    
    setCourseStats(statData);
  };
  
  // Generate mock data for charts
  const generateMockData = () => {
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const weeks = ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'];
    const years = ['2020', '2021', '2022', '2023'];
    
    let labels: string[] = [];
    let dataPoints = 0;
    
    switch (timeRange) {
      case 'week':
        labels = weeks;
        dataPoints = 4;
        break;
      case 'month':
        labels = months;
        dataPoints = 12;
        break;
      case 'year':
        labels = years;
        dataPoints = years.length;
        break;
    }
    
    // Generate views data
    const viewsArr = [];
    for (let i = 0; i < dataPoints; i++) {
      viewsArr.push({
        name: labels[i],
        views: Math.floor(Math.random() * 500) + 50
      });
    }
    setViewsData(viewsArr);
    
    // Generate enrollments data
    const enrollmentsArr = [];
    for (let i = 0; i < dataPoints; i++) {
      enrollmentsArr.push({
        name: labels[i],
        enrollments: Math.floor(Math.random() * 50) + 5
      });
    }
    setEnrollmentsData(enrollmentsArr);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">إحصائيات وتحليلات</h2>
        <div className="flex gap-2">
          <Select 
            value={timeRange}
            onValueChange={(value: 'week' | 'month' | 'year') => setTimeRange(value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="الفترة الزمنية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">أسبوعي</SelectItem>
              <SelectItem value="month">شهري</SelectItem>
              <SelectItem value="year">سنوي</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={selectedCourse || ""}
            onValueChange={(value) => setSelectedCourse(value || null)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="اختر دورة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع الدورات</SelectItem>
              {courses.map(course => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-gray-500">جاري تحميل البيانات...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{selectedCourse ? 
                  courses.find(c => c.id === selectedCourse)?.students_count || 0 : 
                  courses.reduce((sum, course) => sum + (course.students_count || 0), 0)}</CardTitle>
                <CardDescription>إجمالي الطلاب</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">
                  {selectedCourse ? 'في هذه الدورة' : 'في جميع الدورات'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">
                  {viewsData.reduce((sum, item) => sum + item.views, 0)}
                </CardTitle>
                <CardDescription>المشاهدات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">
                  إجمالي المشاهدات خلال {timeRange === 'week' ? 'الأسبوع' : timeRange === 'month' ? 'الشهر' : 'السنة'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">
                  {enrollmentsData.reduce((sum, item) => sum + item.enrollments, 0)}
                </CardTitle>
                <CardDescription>التسجيلات الجديدة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">
                  خلال {timeRange === 'week' ? 'الأسبوع' : timeRange === 'month' ? 'الشهر' : 'السنة'} الماضي
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>المشاهدات</CardTitle>
                <CardDescription>
                  إحصائيات المشاهدات {timeRange === 'week' ? 'الأسبوعية' : timeRange === 'month' ? 'الشهرية' : 'السنوية'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={viewsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="views" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>التسجيلات الجديدة</CardTitle>
                <CardDescription>
                  عدد التسجيلات الجديدة {timeRange === 'week' ? 'الأسبوعية' : timeRange === 'month' ? 'الشهرية' : 'السنوية'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={enrollmentsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="enrollments" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>مقارنة الدورات</CardTitle>
              <CardDescription>مقارنة أداء الدورات التعليمية المختلفة</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="students">
                <TabsList className="mb-4">
                  <TabsTrigger value="students">الطلاب</TabsTrigger>
                  <TabsTrigger value="views">المشاهدات</TabsTrigger>
                  <TabsTrigger value="completion">معدل الإكمال</TabsTrigger>
                </TabsList>
                
                <TabsContent value="students">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={courseStats} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="students" fill="#8884d8" name="عدد الطلاب" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="views">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={courseStats} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="views" fill="#82ca9d" name="عدد المشاهدات" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="completion">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={courseStats} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completionRate" fill="#ffc658" name="معدل الإكمال %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default InstructorAnalytics;
