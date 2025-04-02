
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
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Video,
  Filter
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const InstructorLessons = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [lessons, setLessons] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  
  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [selectedCourse]);
  
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
  
  const fetchLessons = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return;
      }
      
      let query = supabase
        .from('lessons')
        .select(`
          *,
          courses(title)
        `)
        .order('order_number', { ascending: true });
        
      if (selectedCourse) {
        query = query.eq('course_id', selectedCourse);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setLessons(data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error('حدث خطأ أثناء تحميل الدروس');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredLessons = lessons.filter(lesson => 
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.courses?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">إدارة الدروس</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <CardTitle>قائمة الدروس</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث في الدروس..."
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
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchLessons}
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
              <p className="text-gray-500">جاري تحميل الدروس...</p>
            </div>
          ) : filteredLessons.length === 0 ? (
            <div className="text-center py-8">
              <Video className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">لا توجد دروس</h3>
              <p className="text-gray-500">
                {searchQuery || selectedCourse ? 
                  'لا توجد نتائج للبحث. حاول تغيير معايير البحث.' : 
                  'لم يتم إضافة أي دروس بعد.'}
              </p>
              {!searchQuery && selectedCourse && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate(`/courses-management/${selectedCourse}/lessons`)}
                >
                  إضافة درس للدورة
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right w-[40%]">عنوان الدرس</TableHead>
                    <TableHead className="text-right">الدورة</TableHead>
                    <TableHead className="text-right">الترتيب</TableHead>
                    <TableHead className="text-right">المدة</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-400">
                            <Video className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium truncate">{lesson.title}</p>
                            {lesson.description && (
                              <p className="text-sm text-gray-500 truncate">{lesson.description.substring(0, 40)}{lesson.description.length > 40 ? '...' : ''}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{lesson.courses?.title || 'غير معروف'}</TableCell>
                      <TableCell>{lesson.order_number}</TableCell>
                      <TableCell>{lesson.duration || 'غير محدد'}</TableCell>
                      <TableCell>
                        {lesson.is_free ? (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">مجاني</Badge>
                        ) : (
                          <Badge variant="outline" className="border-gray-300 text-gray-600">مدفوع</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/admin-course-player/${lesson.course_id}?lesson=${lesson.id}`)}>
                              <Eye className="ml-2 h-4 w-4" />
                              <span>معاينة</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/courses-management/${lesson.course_id}/lessons?edit=${lesson.id}`)}>
                              <Edit className="ml-2 h-4 w-4" />
                              <span>تعديل</span>
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

export default InstructorLessons;
