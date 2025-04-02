
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { 
  Search, 
  Users
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const InstructorStudents = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    completedCourses: 0
  });
  
  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [selectedCourse]);
  
  const fetchStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return;
      }
      
      // Get total enrollments
      const { count: totalCount, error: totalError } = await supabase
        .from('course_enrollments')
        .select('*', { count: 'exact', head: true });
      
      // Get active enrollments
      const { count: activeCount, error: activeError } = await supabase
        .from('course_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      
      // Get completed enrollments (assuming progress >= 100 means completed)
      const { count: completedCount, error: completedError } = await supabase
        .from('course_enrollments')
        .select('*', { count: 'exact', head: true })
        .gte('progress', 100);
      
      if (totalError || activeError || completedError) {
        throw new Error('Error fetching enrollment statistics');
      }
      
      setStats({
        totalStudents: totalCount || 0,
        activeStudents: activeCount || 0,
        completedCourses: completedCount || 0
      });
    } catch (error) {
      console.error('Error fetching student statistics:', error);
    }
  };
  
  const fetchCourses = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return;
      }
      
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .order('title', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('حدث خطأ أثناء تحميل الدورات');
    } 
  };
  
  const fetchEnrollments = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return;
      }
      
      let query = supabase
        .from('course_enrollments')
        .select(`
          *,
          courses(title),
          profiles(id, first_name, last_name, display_name, avatar_url, email)
        `)
        .order('created_at', { ascending: false });
        
      if (selectedCourse) {
        query = query.eq('course_id', selectedCourse);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setEnrollments(data || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast.error('حدث خطأ أثناء تحميل بيانات الطلاب');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredEnrollments = enrollments.filter(enrollment => {
    const userProfile = enrollment.profiles || {};
    const courseName = enrollment.courses?.title || '';
    
    return (
      userProfile.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userProfile.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userProfile.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userProfile.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courseName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.totalStudents}</CardTitle>
            <CardDescription>إجمالي الطلاب</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">
              في جميع الدورات التعليمية
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.activeStudents}</CardTitle>
            <CardDescription>الطلاب النشطين</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">
              طلاب يتابعون الدورات حالياً
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.completedCourses}</CardTitle>
            <CardDescription>دورات مكتملة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">
              الدورات التي أكملها الطلاب بنجاح
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <CardTitle>قائمة الطلاب</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث عن طالب..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9 h-10 w-[250px]"
                />
              </div>
              
              <Select 
                value={selectedCourse || ""}
                onValueChange={(value) => setSelectedCourse(value || null)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="تصفية حسب الدورة" />
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
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
              <p className="text-gray-500">جاري تحميل بيانات الطلاب...</p>
            </div>
          ) : filteredEnrollments.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">لا يوجد طلاب</h3>
              <p className="text-gray-500">
                {searchQuery || selectedCourse ? 
                  'لا توجد نتائج للبحث. حاول تغيير معايير البحث.' : 
                  'لم يسجل أي طالب في الدورات بعد.'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الطالب</TableHead>
                    <TableHead className="text-right">الدورة</TableHead>
                    <TableHead className="text-right">التقدم</TableHead>
                    <TableHead className="text-right">تاريخ التسجيل</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnrollments.map((enrollment) => {
                    const profile = enrollment.profiles || {};
                    const displayName = profile.display_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'مستخدم';
                    const initials = displayName.slice(0, 2).toUpperCase();
                    
                    return (
                      <TableRow key={enrollment.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={profile.avatar_url} />
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{displayName}</p>
                              <p className="text-sm text-gray-500">{profile.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{enrollment.courses?.title || 'غير معروف'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={enrollment.progress || 0} className="h-2 w-32" />
                            <span className="text-sm">{enrollment.progress || 0}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(enrollment.created_at).toLocaleDateString('ar-EG')}</TableCell>
                        <TableCell>
                          {enrollment.status === 'active' ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200">نشط</Badge>
                          ) : (
                            <Badge variant="outline" className="border-gray-300 text-gray-600">{enrollment.status}</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorStudents;
