
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  ArrowRight, 
  Save, 
  Plus, 
  Trash2, 
  GripVertical,
  FileText,
  Video,
  Clock,
  Info,
  Edit,
  Upload,
  Play
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { Progress } from "@/components/ui/progress";
import { useQuery } from '@tanstack/react-query';

type CourseStatus = "published" | "draft";
type CourseLevel = "beginner" | "intermediate" | "advanced";

interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  video_url?: string;
  video_file_name?: string;
  order_number: number;
  is_free: boolean;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  price: number;
  currency: string;
  description?: string;
  category?: string;
  students_count: number;
  duration?: string;
  level?: CourseLevel;
  image_url?: string;
  status: CourseStatus;
  updated_at?: string;
  lessons?: Lesson[];
}

const CourseEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeTab, setActiveTab] = useState('details');
  const [isAddLessonDialogOpen, setIsAddLessonDialogOpen] = useState(false);
  const [isEditLessonDialogOpen, setIsEditLessonDialogOpen] = useState(false);
  const [isDeleteLessonDialogOpen, setIsDeleteLessonDialogOpen] = useState(false);
  const [isVideoUploadDialogOpen, setIsVideoUploadDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  
  const [newLesson, setNewLesson] = useState<Omit<Lesson, 'id'>>({
    title: '',
    description: '',
    duration: '',
    video_url: '',
    order_number: 1,
    is_free: false
  });

  // استخدام React Query لجلب بيانات الدورة
  const { data: courseData, isLoading: isCourseLoading, refetch: refetchCourse } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // استخدام React Query لجلب دروس الدورة
  const { data: lessonsData, isLoading: isLessonsLoading, refetch: refetchLessons } = useQuery({
    queryKey: ['lessons', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .order('order_number', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (courseData) {
      setCourse({
        ...courseData,
        level: (courseData.level as CourseLevel) || 'beginner',
        status: (courseData.status as CourseStatus) || 'draft'
      });
      setLoading(false);
    }
  }, [courseData]);

  useEffect(() => {
    if (lessonsData) {
      setLessons(lessonsData);
      
      if (lessonsData.length > 0) {
        const maxOrderNumber = Math.max(...lessonsData.map(lesson => lesson.order_number));
        setNewLesson(prev => ({ ...prev, order_number: maxOrderNumber + 1 }));
      }
    }
  }, [lessonsData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (course) {
      setCourse({
        ...course,
        [name]: value
      });
    }
  };

  const handleSelectChange = (value: string, fieldName: string) => {
    if (course) {
      setCourse({
        ...course,
        [fieldName]: value
      });
    }
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    if (course) {
      setCourse({
        ...course,
        [name]: numValue
      });
    }
  };

  const handleLessonInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (selectedLesson) {
      setSelectedLesson({
        ...selectedLesson,
        [name]: value
      });
    } else {
      setNewLesson({
        ...newLesson,
        [name]: value
      });
    }
  };

  const handleLessonBooleanChange = (value: boolean, fieldName: string) => {
    if (selectedLesson) {
      setSelectedLesson({
        ...selectedLesson,
        [fieldName]: value
      });
    } else {
      setNewLesson({
        ...newLesson,
        [fieldName]: value
      });
    }
  };

  const handleLessonNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    
    if (selectedLesson) {
      setSelectedLesson({
        ...selectedLesson,
        [name]: numValue
      });
    } else {
      setNewLesson({
        ...newLesson,
        [name]: numValue
      });
    }
  };

  const saveCourseDetails = async () => {
    if (!course) return;
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('courses')
        .update({
          title: course.title,
          instructor: course.instructor,
          price: course.price,
          currency: course.currency,
          description: course.description,
          category: course.category,
          duration: course.duration,
          level: course.level,
          image_url: course.image_url,
          status: course.status
        })
        .eq('id', course.id);
      
      if (error) throw error;
      
      toast.success('تم حفظ تفاصيل الدورة بنجاح');
      refetchCourse();
    } catch (error) {
      console.error('Error saving course details:', error);
      toast.error('حدث خطأ أثناء حفظ تفاصيل الدورة');
    } finally {
      setSaving(false);
    }
  };

  const addLesson = async () => {
    if (!course) return;
    
    try {
      const { data, error } = await supabase
        .from('lessons')
        .insert({
          course_id: course.id,
          title: newLesson.title,
          description: newLesson.description,
          duration: newLesson.duration,
          video_url: newLesson.video_url,
          order_number: newLesson.order_number,
          is_free: newLesson.is_free
        })
        .select();
      
      if (error) throw error;
      
      setNewLesson({
        title: '',
        description: '',
        duration: '',
        video_url: '',
        order_number: newLesson.order_number + 1,
        is_free: false
      });
      setIsAddLessonDialogOpen(false);
      refetchLessons();
      
      toast.success('تمت إضافة الدرس بنجاح');
    } catch (error) {
      console.error('Error adding lesson:', error);
      toast.error('حدث خطأ أثناء إضافة الدرس');
    }
  };

  const updateLesson = async () => {
    if (!selectedLesson) return;
    
    try {
      const { error } = await supabase
        .from('lessons')
        .update({
          title: selectedLesson.title,
          description: selectedLesson.description,
          duration: selectedLesson.duration,
          video_url: selectedLesson.video_url,
          order_number: selectedLesson.order_number,
          is_free: selectedLesson.is_free
        })
        .eq('id', selectedLesson.id);
      
      if (error) throw error;
      
      setSelectedLesson(null);
      setIsEditLessonDialogOpen(false);
      refetchLessons();
      
      toast.success('تم تحديث الدرس بنجاح');
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast.error('حدث خطأ أثناء تحديث الدرس');
    }
  };

  const deleteLesson = async () => {
    if (!selectedLesson) return;
    
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', selectedLesson.id);
      
      if (error) throw error;
      
      setSelectedLesson(null);
      setIsDeleteLessonDialogOpen(false);
      refetchLessons();
      
      toast.success('تم حذف الدرس بنجاح');
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('حدث خطأ أثناء حذف الدرس');
    }
  };

  const openVideoUploadDialog = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    if (lesson.video_file_name) {
      getVideoUrl(lesson.video_file_name);
    } else {
      setVideoPreviewUrl(null);
    }
    setIsVideoUploadDialogOpen(true);
  };

  const getVideoUrl = async (fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('course_videos')
        .createSignedUrl(fileName, 3600);
      
      if (error) throw error;
      setVideoPreviewUrl(data.signedUrl);
    } catch (error) {
      console.error('Error getting video URL:', error);
      setVideoPreviewUrl(null);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !selectedLesson) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${selectedLesson.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // بدء التقدم المحاكى لإعطاء تفاعل للمستخدم
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev < 90) return prev + 5;
          return prev;
        });
      }, 300);
      
      const { error: uploadError, data } = await supabase.storage
        .from('course_videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (uploadError) throw uploadError;
      
      const { error: updateError } = await supabase
        .from('lessons')
        .update({
          video_file_name: fileName
        })
        .eq('id', selectedLesson.id);
      
      if (updateError) throw updateError;
      
      setIsVideoUploadDialogOpen(false);
      refetchLessons();
      toast.success('تم رفع الفيديو بنجاح');
      
      // إعادة فتح النافذة مع تحديث البيانات
      setTimeout(() => {
        const updatedLesson = { ...selectedLesson, video_file_name: fileName };
        openVideoUploadDialog(updatedLesson);
      }, 500);
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('حدث خطأ أثناء رفع الفيديو');
    } finally {
      setUploading(false);
    }
  };

  const uploadCourseImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !course) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `course-${course.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('course_images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = await supabase.storage
        .from('course_images')
        .getPublicUrl(fileName);
      
      if (urlData) {
        const imageUrl = urlData.publicUrl;
        
        setCourse({
          ...course,
          image_url: imageUrl
        });
        
        const { error: updateError } = await supabase
          .from('courses')
          .update({
            image_url: imageUrl
          })
          .eq('id', course.id);
        
        if (updateError) throw updateError;
        
        toast.success('تم رفع صورة الدورة بنجاح');
      }
    } catch (error) {
      console.error('Error uploading course image:', error);
      toast.error('حدث خطأ أثناء رفع صورة الدورة');
    }
  };

  if (isCourseLoading || isLessonsLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>جاري التحميل...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>لم يتم العثور على الدورة</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">{course.title}</h1>
              <p className="text-gray-600 mt-1">تحرير محتوى الدورة وإدارتها</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate('/courses-management')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowRight size={16} />
                <span>العودة للدورات</span>
              </Button>
              <Button
                onClick={saveCourseDetails}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save size={16} />
                <span>{saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
              </Button>
            </div>
          </div>
        </header>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details" className="text-lg py-3">
              <Info size={16} className="ml-2" />
              تفاصيل الدورة
            </TabsTrigger>
            <TabsTrigger value="lessons" className="text-lg py-3">
              <FileText size={16} className="ml-2" />
              دروس الدورة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>بيانات الدورة الأساسية</CardTitle>
                <CardDescription>تحديث البيانات الأساسية للدورة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">عنوان الدورة</Label>
                    <Input
                      id="title"
                      name="title"
                      value={course.title}
                      onChange={handleInputChange}
                      placeholder="أدخل عنوان الدورة"
                    />
                  </div>

                  {/* Instructor */}
                  <div className="space-y-2">
                    <Label htmlFor="instructor">اسم المدرب</Label>
                    <Input
                      id="instructor"
                      name="instructor"
                      value={course.instructor}
                      onChange={handleInputChange}
                      placeholder="أدخل اسم المدرب"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">تصنيف الدورة</Label>
                    <Select value={course.category || ''} onValueChange={(value) => handleSelectChange(value, 'category')}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="اختر تصنيف الدورة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="مبيعات">مبيعات</SelectItem>
                        <SelectItem value="تسويق">تسويق</SelectItem>
                        <SelectItem value="إدارة">إدارة</SelectItem>
                        <SelectItem value="ريادة أعمال">ريادة أعمال</SelectItem>
                        <SelectItem value="تطوير ذاتي">تطوير ذاتي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Level */}
                  <div className="space-y-2">
                    <Label htmlFor="level">مستوى الدورة</Label>
                    <Select value={course.level || ''} onValueChange={(value) => handleSelectChange(value, 'level')}>
                      <SelectTrigger id="level">
                        <SelectValue placeholder="اختر مستوى الدورة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">مبتدئ</SelectItem>
                        <SelectItem value="intermediate">متوسط</SelectItem>
                        <SelectItem value="advanced">متقدم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <Label htmlFor="price">سعر الدورة</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={course.price}
                      onChange={handleNumberInputChange}
                      placeholder="أدخل سعر الدورة"
                    />
                  </div>

                  {/* Currency */}
                  <div className="space-y-2">
                    <Label htmlFor="currency">العملة</Label>
                    <Select value={course.currency} onValueChange={(value) => handleSelectChange(value, 'currency')}>
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="اختر العملة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EGP">جنيه مصري</SelectItem>
                        <SelectItem value="USD">دولار أمريكي</SelectItem>
                        <SelectItem value="SAR">ريال سعودي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <Label htmlFor="duration">مدة الدورة</Label>
                    <Input
                      id="duration"
                      name="duration"
                      value={course.duration || ''}
                      onChange={handleInputChange}
                      placeholder="مثال: 5 ساعات"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status">حالة الدورة</Label>
                    <Select value={course.status} onValueChange={(value) => handleSelectChange(value as CourseStatus, 'status')}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="اختر حالة الدورة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">مسودة</SelectItem>
                        <SelectItem value="published">منشورة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">وصف الدورة</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={course.description || ''}
                    onChange={handleInputChange}
                    placeholder="أدخل وصف الدورة"
                    rows={5}
                  />
                </div>

                {/* Course Image */}
                <div className="space-y-4">
                  <Label>صورة الدورة</Label>
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-full md:w-1/3 h-48 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 relative">
                      {course.image_url ? (
                        <img 
                          src={course.image_url} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          لا توجد صورة
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="image_url">رابط الصورة</Label>
                      <div className="flex mt-2 gap-2">
                        <Input
                          id="image_url"
                          name="image_url"
                          value={course.image_url || ''}
                          onChange={handleInputChange}
                          placeholder="أدخل رابط صورة الدورة"
                        />
                        <div className="relative">
                          <Input
                            id="upload_image"
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={uploadCourseImage}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="h-full"
                          >
                            <Upload size={16} className="ml-2" />
                            رفع صورة
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        يفضل استخدام صورة بأبعاد 16:9 وبدقة عالية لأفضل ظهور للدورة
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  onClick={saveCourseDetails}
                  disabled={saving}
                  className="w-full md:w-auto"
                >
                  {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>دروس الدورة</CardTitle>
                  <CardDescription>إدارة محتوى الدورة التدريبية</CardDescription>
                </div>
                <Button 
                  onClick={() => setIsAddLessonDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  إضافة درس جديد
                </Button>
              </CardHeader>
              <CardContent>
                {lessons.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                    <p>لا توجد دروس حتى الآن</p>
                    <p className="text-sm mt-1">قم بإضافة درس جديد للبدء في إنشاء محتوى الدورة</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lessons.map((lesson) => (
                      <div 
                        key={lesson.id} 
                        className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-all"
                      >
                        <div className="flex-shrink-0 text-gray-400">
                          <GripVertical size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <h4 className="font-medium truncate">{lesson.title}</h4>
                            {lesson.is_free && (
                              <Badge variant="outline" className="mr-2 border-green-500 text-green-600">مجاني</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center">
                              <Clock size={14} className="ml-1" />
                              {lesson.duration || 'غير محدد'}
                            </span>
                            {lesson.video_file_name ? (
                              <span className="flex items-center text-green-600">
                                <Video size={14} className="ml-1" />
                                تم رفع الفيديو
                              </span>
                            ) : (
                              <span className="flex items-center text-gray-400">
                                <Video size={14} className="ml-1" />
                                لم يتم رفع الفيديو
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openVideoUploadDialog(lesson)}
                            className="h-9 w-9 p-0"
                          >
                            <Video size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLesson(lesson);
                              setIsEditLessonDialogOpen(true);
                            }}
                            className="h-9 w-9 p-0"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLesson(lesson);
                              setIsDeleteLessonDialogOpen(true);
                            }}
                            className="h-9 w-9 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Lesson Dialog */}
        <Dialog open={isAddLessonDialogOpen} onOpenChange={setIsAddLessonDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>إضافة درس جديد</DialogTitle>
              <DialogDescription>
                أدخل تفاصيل الدرس الجديد للدورة
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="new-title">عنوان الدرس</Label>
                <Input
                  id="new-title"
                  name="title"
                  value={newLesson.title}
                  onChange={handleLessonInputChange}
                  placeholder="أدخل عنوان الدرس"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-description">وصف الدرس</Label>
                <Textarea
                  id="new-description"
                  name="description"
                  value={newLesson.description || ''}
                  onChange={handleLessonInputChange}
                  placeholder="أدخل وصف الدرس"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-duration">مدة الدرس</Label>
                  <Input
                    id="new-duration"
                    name="duration"
                    value={newLesson.duration || ''}
                    onChange={handleLessonInputChange}
                    placeholder="مثال: 30 دقيقة"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-order">ترتيب الدرس</Label>
                  <Input
                    id="new-order"
                    name="order_number"
                    type="number"
                    value={newLesson.order_number}
                    onChange={handleLessonNumberChange}
                    placeholder="رقم ترتيب الدرس"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-video">رابط الفيديو (اختياري)</Label>
                <Input
                  id="new-video"
                  name="video_url"
                  value={newLesson.video_url || ''}
                  onChange={handleLessonInputChange}
                  placeholder="أدخل رابط فيديو الدرس (يمكن تركه فارغاً)"
                />
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <input
                  type="checkbox"
                  id="new-is-free"
                  checked={newLesson.is_free}
                  onChange={(e) => handleLessonBooleanChange(e.target.checked, 'is_free')}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="new-is-free" className="cursor-pointer">درس مجاني</Label>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  إلغاء
                </Button>
              </DialogClose>
              <Button type="button" onClick={addLesson}>
                إضافة الدرس
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Lesson Dialog */}
        {selectedLesson && (
          <Dialog open={isEditLessonDialogOpen} onOpenChange={setIsEditLessonDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>تعديل الدرس</DialogTitle>
                <DialogDescription>
                  تعديل تفاصيل الدرس
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">عنوان الدرس</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    value={selectedLesson.title}
                    onChange={handleLessonInputChange}
                    placeholder="أدخل عنوان الدرس"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">وصف الدرس</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    value={selectedLesson.description || ''}
                    onChange={handleLessonInputChange}
                    placeholder="أدخل وصف الدرس"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-duration">مدة الدرس</Label>
                    <Input
                      id="edit-duration"
                      name="duration"
                      value={selectedLesson.duration || ''}
                      onChange={handleLessonInputChange}
                      placeholder="مثال: 30 دقيقة"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-order">ترتيب الدرس</Label>
                    <Input
                      id="edit-order"
                      name="order_number"
                      type="number"
                      value={selectedLesson.order_number}
                      onChange={handleLessonNumberChange}
                      placeholder="رقم ترتيب الدرس"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-video">رابط الفيديو (اختياري)</Label>
                  <Input
                    id="edit-video"
                    name="video_url"
                    value={selectedLesson.video_url || ''}
                    onChange={handleLessonInputChange}
                    placeholder="أدخل رابط فيديو الدرس (يمكن تركه فارغاً)"
                  />
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    id="edit-is-free"
                    checked={selectedLesson.is_free}
                    onChange={(e) => handleLessonBooleanChange(e.target.checked, 'is_free')}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="edit-is-free" className="cursor-pointer">درس مجاني</Label>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    إلغاء
                  </Button>
                </DialogClose>
                <Button type="button" onClick={updateLesson}>
                  حفظ التغييرات
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Lesson Dialog */}
        {selectedLesson && (
          <Dialog open={isDeleteLessonDialogOpen} onOpenChange={setIsDeleteLessonDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>حذف الدرس</DialogTitle>
                <DialogDescription>
                  هل أنت متأكد من حذف هذا الدرس؟ هذا الإجراء لا يمكن التراجع عنه.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    إلغاء
                  </Button>
                </DialogClose>
                <Button type="button" variant="destructive" onClick={deleteLesson}>
                  حذف الدرس
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Video Upload Dialog */}
        {selectedLesson && (
          <Dialog open={isVideoUploadDialogOpen} onOpenChange={setIsVideoUploadDialogOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>رفع فيديو الدرس</DialogTitle>
                <DialogDescription>
                  {selectedLesson.title}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-2">
                {videoPreviewUrl && (
                  <div className="rounded-lg overflow-hidden aspect-video bg-black">
                    <video 
                      src={videoPreviewUrl} 
                      controls 
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                {uploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">جاري الرفع...</span>
                      <span className="text-sm">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                <div className="space-y-4">
                  <Label htmlFor="video-upload">رفع الفيديو</Label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="video-upload"
                        type="file"
                        accept="video/*"
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleVideoUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploading}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Upload size={16} />
                        {videoPreviewUrl ? 'تغيير الفيديو' : 'اختيار ملف الفيديو'}
                      </Button>
                    </div>
                    {videoPreviewUrl && (
                      <Button
                        type="button"
                        variant="default"
                        className="flex items-center gap-2 bg-secondary text-white hover:bg-secondary/90"
                        onClick={() => window.open(videoPreviewUrl, '_blank')}
                      >
                        <Play size={16} />
                        فتح في نافذة جديدة
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    يمكنك رفع ملفات فيديو بصيغة MP4 أو WebM بحجم أقصى 100 ميجابايت.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" disabled={uploading}>
                    تم
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default CourseEdit;
