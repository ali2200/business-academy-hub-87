
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  BookOpen 
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const InstructorCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchCourses();
  }, []);
  
  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return;
      }
      
      // Assuming instructor's id is stored as instructor_id in courses table
      // Or you could match by instructor name
      const { data, error } = await supabase
        .from('courses')
        .select('*, course_enrollments(count)')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('حدث خطأ أثناء تحميل الدورات');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 border-green-200">منشور</Badge>;
      case 'draft':
        return <Badge variant="outline" className="border-gray-300 text-gray-600">مسودة</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">دوراتي التعليمية</h2>
        <Button 
          onClick={() => navigate('/courses-management/create')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          إضافة دورة جديدة
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>قائمة الدورات</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث في الدورات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9 h-10"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchCourses}
              >
                تحديث
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
              <p className="text-gray-500">جاري تحميل الدورات...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">لا توجد دورات</h3>
              <p className="text-gray-500">
                {searchQuery ? 'لا توجد نتائج للبحث. حاول استخدام كلمات مختلفة.' : 'لم تقم بإضافة أي دورات بعد. أضف دورتك الأولى الآن.'}
              </p>
              {!searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate('/courses-management/create')}
                >
                  إضافة دورة جديدة
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right w-[40%]">عنوان الدورة</TableHead>
                    <TableHead className="text-right">التصنيف</TableHead>
                    <TableHead className="text-right">السعر</TableHead>
                    <TableHead className="text-right">الطلاب</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                            {course.image_url ? (
                              <img src={course.image_url} alt={course.title} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-400">
                                <BookOpen className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium truncate">{course.title}</p>
                            <p className="text-sm text-gray-500 truncate">{course.duration || 'غير محدد'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{course.category || 'بدون تصنيف'}</TableCell>
                      <TableCell>{course.price} {course.currency}</TableCell>
                      <TableCell>{course.students_count || 0}</TableCell>
                      <TableCell>{getStatusBadge(course.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/admin-course-player/${course.id}`)}>
                              <Eye className="ml-2 h-4 w-4" />
                              <span>معاينة</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/courses-management/${course.id}`)}>
                              <Edit className="ml-2 h-4 w-4" />
                              <span>تعديل</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/courses-management/${course.id}/lessons`)}>
                              <BookOpen className="ml-2 h-4 w-4" />
                              <span>إدارة الدروس</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorCourses;
