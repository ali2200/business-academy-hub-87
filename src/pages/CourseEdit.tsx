
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { useMutation, useQuery } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { useDropzone } from 'react-dropzone';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Check, ChevronsUpDown, Copy, Edit, Eye, File, FileText, Loader2, Plus, RefreshCw, Trash2, Upload, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Course {
  id: string;
  title: string;
  instructor: string;
  price: number;
  currency: string;
  description?: string;
  category?: string;
  studentsCount: number;
  duration?: string;
  level?: string;
  image_url?: string;
  status: string;
  lastUpdated?: string;
  updated_at?: string;
}

interface LessonData {
  title: string;
  description: string;
  video_url: string;
  video_file_name: string;
  duration: string;
  is_free: boolean;
  order_number: number;
}

const CourseEdit = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [lessonData, setLessonData] = useState<LessonData>({
    title: '',
    description: '',
    video_url: '',
    video_file_name: '',
    duration: '',
    is_free: false,
    order_number: 1
  });
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: course, error: courseError } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) {
        console.error('Error fetching course:', error);
        throw new Error('Failed to load course');
      }
      return data;
    }
  });

  useEffect(() => {
    fetchLessons();
  }, [refreshTrigger]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      
      // Fetch real data from Supabase
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_number', { ascending: true });
      
      if (error) throw error;
      
      setLessons(data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error('فشل في تحميل الدروس');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    setUploading(true);

    try {
      const { data, error } = await supabase.storage
        .from('course-videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading file:', error);
        toast.error('فشل في رفع الملف');
        setUploading(false);
        return;
      }

      // Generate public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('course-videos')
        .getPublicUrl(filePath);

      setFileUrl(publicUrl);
      setFileName(fileName);
      setLessonData({
        ...lessonData,
        video_url: publicUrl,
        video_file_name: fileName
      });
      toast.success('تم رفع الملف بنجاح');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('فشل في رفع الملف');
    } finally {
      setUploading(false);
    }
  }, [lessonData, setLessonData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'video/*': [] } })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle checkbox separately
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      setLessonData({
        ...lessonData,
        [name]: e.target.checked
      });
    } else {
      setLessonData({
        ...lessonData,
        [name]: value
      });
    }
  };
  
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    
    setLessonData({
      ...lessonData,
      [name]: numValue
    });
  };

  const saveLesson = useMutation({
    mutationFn: async (lessonData: LessonData) => {
      if (selectedLessonId) {
        const dataToUpdate = {
          title: lessonData.title,
          description: lessonData.description,
          video_url: lessonData.video_url,
          video_file_name: lessonData.video_file_name,
          duration: lessonData.duration,
          is_free: lessonData.is_free,
          order_number: lessonData.order_number
        };
        
        const { data, error } = await supabase
          .from('lessons')
          .update(dataToUpdate)
          .eq('id', selectedLessonId)
          .select();
        
        if (error) throw error;
        return data;
      } else {
        const dataToInsert = {
          title: lessonData.title,
          description: lessonData.description,
          video_url: lessonData.video_url,
          video_file_name: lessonData.video_file_name,
          duration: lessonData.duration,
          is_free: lessonData.is_free,
          order_number: lessonData.order_number,
          course_id: courseId
        };
        
        const { data, error } = await supabase
          .from('lessons')
          .insert(dataToInsert)
          .select();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      toast.success('تم حفظ الدرس بنجاح');
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setLessonData({
        title: '',
        description: '',
        video_url: '',
        video_file_name: '',
        duration: '',
        is_free: false,
        order_number: 1
      });
      setFileUrl(null);
      setFileName(null);
      setSelectedLessonId(null);
      setRefreshTrigger(prev => prev + 1);
    },
    onError: (error) => {
      console.error('Error saving lesson:', error);
      toast.error('حدث خطأ أثناء حفظ الدرس');
    }
  });

  const handleDeleteLesson = async () => {
    if (!selectedLessonId) return;
    
    try {
      // Delete lesson from database
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', selectedLessonId);
      
      if (error) throw error;
      
      toast.success('تم حذف الدرس بنجاح');
      setIsDeleteDialogOpen(false);
      setSelectedLessonId(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('حدث خطأ أثناء حذف الدرس');
    }
  };

  const handleAddLesson = () => {
    saveLesson.mutate(lessonData);
  };

  const handleUpdateLesson = () => {
    saveLesson.mutate(lessonData);
  };

  const editLesson = (lesson: any) => {
    setSelectedLessonId(lesson.id);
    setLessonData({
      title: lesson.title,
      description: lesson.description,
      video_url: lesson.video_url,
      video_file_name: lesson.video_file_name,
      duration: lesson.duration,
      is_free: lesson.is_free,
      order_number: lesson.order_number
    });
    setFileUrl(lesson.video_url);
    setFileName(lesson.video_file_name);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                {course ? `تعديل الدورة: ${course.title}` : 'جاري التحميل...'}
              </h1>
              <p className="text-gray-600 mt-1">
                إدارة وتنظيم محتوى الدورة التدريبية
              </p>
            </div>
            <Button
              onClick={() => navigate('/courses-management')}
              variant="outline"
              className="flex items-center gap-2"
            >
              العودة إلى إدارة الدورات
            </Button>
          </div>
        </header>

        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                الدروس والمحاضرات
              </h2>
              <div className="flex justify-between items-center">
                <p className="text-gray-500">
                  إضافة وتعديل الدروس والمحاضرات الخاصة بالدورة
                </p>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  إضافة درس جديد
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>عنوان الدرس</TableHead>
                    <TableHead>المدة</TableHead>
                    <TableHead>مجاني؟</TableHead>
                    <TableHead>الترتيب</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        جاري التحميل...
                      </TableCell>
                    </TableRow>
                  ) : lessons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        لا توجد دروس متاحة
                      </TableCell>
                    </TableRow>
                  ) : (
                    lessons.map(lesson => (
                      <TableRow key={lesson.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium">{lesson.title}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{lesson.duration}</TableCell>
                        <TableCell>
                          {lesson.is_free ? 'نعم' : 'لا'}
                        </TableCell>
                        <TableCell>{lesson.order_number}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="عرض"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="تعديل"
                              onClick={() => editLesson(lesson)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="حذف"
                              onClick={() => {
                                setSelectedLessonId(lesson.id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Dialog for adding a lesson */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>إضافة درس جديد</DialogTitle>
              <DialogDescription>
                إضافة معلومات الدرس. اضغط "حفظ" عند الانتهاء.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان الدرس</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={lessonData.title} 
                    onChange={handleInputChange} 
                    placeholder="أدخل عنوان الدرس"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">وصف الدرس</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={lessonData.description} 
                    onChange={handleInputChange} 
                    placeholder="أدخل وصفاً تفصيلياً للدرس"
                    rows={3}
                    autoSize
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">المدة</Label>
                  <Input 
                    id="duration" 
                    name="duration" 
                    value={lessonData.duration} 
                    onChange={handleInputChange} 
                    placeholder="مثال: 25 دقيقة"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order_number">الترتيب</Label>
                  <Input 
                    id="order_number" 
                    name="order_number" 
                    type="number"
                    value={lessonData.order_number} 
                    onChange={handleNumberInputChange} 
                    placeholder="أدخل ترتيب الدرس"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Input 
                  type="checkbox" 
                  id="is_free" 
                  name="is_free"
                  checked={lessonData.is_free}
                  onChange={handleInputChange} 
                  className="h-4 w-4" 
                />
                <Label htmlFor="is_free">الدرس مجاني؟</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="video_url">رابط الفيديو</Label>
                <div {...getRootProps()} className="border-dashed border-2 rounded-md p-4 cursor-pointer">
                  <input {...getInputProps()} />
                  {uploading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>جاري الرفع...</span>
                    </div>
                  ) : fileUrl ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Video className="mr-2 h-4 w-4" />
                        <span>{fileName}</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => {
                        setFileUrl(null);
                        setFileName(null);
                        setLessonData({
                          ...lessonData,
                          video_url: '',
                          video_file_name: ''
                        });
                      }}>
                        تغيير
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="h-6 w-6 text-gray-500" />
                      <p className="text-gray-500">
                        {isDragActive ? "أفلت الملف هنا..." : "إضغط أو اسحب الملف لرفعه"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">إلغاء</Button>
              </DialogClose>
              <Button onClick={handleAddLesson}>حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog for editing a lesson */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>تعديل الدرس</DialogTitle>
              <DialogDescription>
                تعديل معلومات الدرس. اضغط "حفظ" عند الانتهاء.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">عنوان الدرس</Label>
                  <Input 
                    id="edit-title" 
                    name="title" 
                    value={lessonData.title} 
                    onChange={handleInputChange} 
                    placeholder="أدخل عنوان الدرس"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">وصف الدرس</Label>
                  <Textarea 
                    id="edit-description" 
                    name="description" 
                    value={lessonData.description} 
                    onChange={handleInputChange} 
                    placeholder="أدخل وصفاً تفصيلياً للدرس"
                    rows={3}
                    autoSize
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">المدة</Label>
                  <Input 
                    id="edit-duration" 
                    name="duration" 
                    value={lessonData.duration} 
                    onChange={handleInputChange} 
                    placeholder="مثال: 25 دقيقة"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-order_number">الترتيب</Label>
                  <Input 
                    id="edit-order_number" 
                    name="order_number" 
                    type="number"
                    value={lessonData.order_number} 
                    onChange={handleNumberInputChange} 
                    placeholder="أدخل ترتيب الدرس"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Input 
                  type="checkbox" 
                  id="edit-is_free" 
                  name="is_free"
                  checked={lessonData.is_free}
                  onChange={handleInputChange} 
                  className="h-4 w-4" 
                />
                <Label htmlFor="edit-is_free">الدرس مجاني؟</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-video_url">رابط الفيديو</Label>
                <div {...getRootProps()} className="border-dashed border-2 rounded-md p-4 cursor-pointer">
                  <input {...getInputProps()} />
                  {uploading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>جاري الرفع...</span>
                    </div>
                  ) : fileUrl ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Video className="mr-2 h-4 w-4" />
                        <span>{fileName}</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => {
                        setFileUrl(null);
                        setFileName(null);
                        setLessonData({
                          ...lessonData,
                          video_url: '',
                          video_file_name: ''
                        });
                      }}>
                        تغيير
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="h-6 w-6 text-gray-500" />
                      <p className="text-gray-500">
                        {isDragActive ? "أفلت الملف هنا..." : "إضغط أو اسحب الملف لرفعه"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">إلغاء</Button>
              </DialogClose>
              <Button onClick={handleUpdateLesson}>حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog for deleting a lesson */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>حذف الدرس</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من حذف هذا الدرس؟ هذا الإجراء لا يمكن التراجع عنه.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">إلغاء</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleDeleteLesson}>
                حذف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CourseEdit;
