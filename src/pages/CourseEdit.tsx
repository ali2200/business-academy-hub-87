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
  
  // New lesson form state
  const [newLesson, setNewLesson] = useState<Omit<Lesson, 'id'>>({
    title: '',
    description: '',
    duration: '',
    video_url: '',
    order_number: 1,
    is_free: false
  });

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (courseError) throw courseError;
      
      // Fetch lessons for this course
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .order('order_number', { ascending: true });
      
      if (lessonsError) throw lessonsError;
      
      // Fix the type issues by properly casting both level and status fields
      setCourse({
        ...courseData,
        level: (courseData.level as CourseLevel) || 'beginner',
        status: (courseData.status as CourseStatus) || 'draft'
      });
      
      setLessons(lessonsData || []);
      
      // Update the new lesson order number
      if (lessonsData && lessonsData.length > 0) {
        const maxOrderNumber = Math.max(...lessonsData.map(lesson => lesson.order_number));
        setNewLesson(prev => ({ ...prev, order_number: maxOrderNumber + 1 }));
      }
      
    } catch (error) {
      console.error('Error fetching course details:', error);
      toast.error('فشل في تحميل تفاصيل الدورة');
    } finally {
      setLoading(false);
    }
  };

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
      // Edit mode
      setSelectedLesson({
        ...selectedLesson,
        [name]: value
      });
    } else {
      // Add mode
      setNewLesson({
        ...newLesson,
        [name]: value
      });
    }
  };

  const handleLessonBooleanChange = (value: boolean, fieldName: string) => {
    if (selectedLesson) {
      // Edit mode
      setSelectedLesson({
        ...selectedLesson,
        [fieldName]: value
      });
    } else {
      // Add mode
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
      // Edit mode
      setSelectedLesson({
        ...selectedLesson,
        [name]: numValue
      });
    } else {
      // Add mode
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
      // Insert new lesson
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
      
      // Reset form and close dialog
      setLessons([...lessons, data[0]]);
      setNewLesson({
        title: '',
        description: '',
        duration: '',
        video_url: '',
        order_number: newLesson.order_number + 1,
        is_free: false
      });
      setIsAddLessonDialogOpen(false);
      
      toast.success('تمت إضافة الدرس بنجاح');
    } catch (error) {
      console.error('Error adding lesson:', error);
      toast.error('حدث خطأ أثناء إضافة الدرس');
    }
  };

  const updateLesson = async () => {
    if (!selectedLesson) return;
    
    try {
      // Update lesson
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
      
      // Update local state and close dialog
      setLessons(lessons.map(lesson => 
        lesson.id === selectedLesson.id ? selectedLesson : lesson
      ));
      setSelectedLesson(null);
      setIsEditLessonDialogOpen(false);
      
      toast.success('تم تحديث الدرس بنجاح');
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast.error('حدث خطأ أثناء تحديث الدرس');
    }
  };

  const deleteLesson = async () => {
    if (!selectedLesson) return;
    
    try {
      // Delete lesson
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', selectedLesson.id);
      
      if (error) throw error;
      
      // Update local state and close dialog
      setLessons(lessons.filter(lesson => lesson.id !== selectedLesson.id));
      setSelectedLesson(null);
      setIsDeleteLessonDialogOpen(false);
      
      toast.success('تم حذف الدرس بنجاح');
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('حدث خطأ أثناء حذف الدرس');
    }
  };
  
  const openVideoUploadDialog = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    // إذا كان هناك فيديو مرفوع مسبقًا، قم بتعيين عنوان URL للمعاينة
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
        .createSignedUrl(fileName, 3600); // ينتهي بعد ساعة
      
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
      // رفع الملف إلى التخزين
      const { error: uploadError, data } = await supabase.storage
        .from('course_videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(percent);
          }
        });
      
      if (uploadError) throw uploadError;
      
      // تحديث الدرس بمعلومات الفيديو الجديد
      const { error: updateError } = await supabase
        .from('lessons')
        .update({
          video_file_name: fileName
        })
        .eq('id', selectedLesson.id);
      
      if (updateError) throw updateError;
      
      // تحديث الحالة المحلية
      const updatedLesson = { ...selectedLesson, video_file_name: fileName };
      setLessons(lessons.map(lesson => 
        lesson.id === selectedLesson.id ? updatedLesson : lesson
      ));
      setSelectedLesson(updatedLesson);
      
      // الحصول على رابط المعاينة
      getVideoUrl(fileName);
      
      toast.success('تم رفع الفيديو بنجاح');
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('حدث خطأ أثناء رفع الفيديو');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (loading) {
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
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/admin-dashboard/courses')}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">تعديل دورة: {course.title}</h1>
              <p className="text-sm text-gray-500">معرف الدورة: {course.id}</p>
            </div>
          </div>
          
          <Button 
            onClick={saveCourseDetails}
            disabled={saving}
            className="bg-primary hover:bg-primary-dark"
          >
            <Save className="ml-2 h-4 w-4" />
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </Button>
        </div>
        
        {/* Course status badge */}
        <div className="mb-6">
          <Badge 
            variant={course.status === 'published' ? 'default' : 'secondary'}
            className={course.status === 'published' ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            {course.status === 'published' ? 'منشور' : 'مسودة'}
          </Badge>
          <span className="mr-2 text-sm text-gray-500">
            آخر تحديث: {new Date(course.updated_at || '').toLocaleDateString('ar-EG')}
          </span>
        </div>
        
        {/* Tabs for different sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="details">تفاصيل الدورة</TabsTrigger>
            <TabsTrigger value="lessons">الدروس</TabsTrigger>
            <TabsTrigger value="preview">معاينة</TabsTrigger>
          </TabsList>
          
          {/* Course Details Tab */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>تفاصيل الدورة</CardTitle>
                <CardDescription>
                  قم بتعديل المعلومات الأساسية للدورة التدريبية
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic info section */}
                <div>
                  <h3 className="text-lg font-medium mb-4">المعلومات الأساسية</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="space-y-2">
                      <Label htmlFor="instructor">المدرب</Label>
                      <Input 
                        id="instructor" 
                        name="instructor" 
                        value={course.instructor} 
                        onChange={handleInputChange} 
                        placeholder="اسم المدرب"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">التصنيف</Label>
                      <Input 
                        id="category" 
                        name="category" 
                        value={course.category || ''} 
                        onChange={handleInputChange} 
                        placeholder="أدخل التصنيف"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level">المستوى</Label>
                      <Select 
                        value={course.level} 
                        onValueChange={(value) => handleSelectChange(value as CourseLevel, 'level')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المستوى" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">مبتدئ</SelectItem>
                          <SelectItem value="intermediate">متوسط</SelectItem>
                          <SelectItem value="advanced">متقدم</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Pricing section */}
                <div>
                  <h3 className="text-lg font-medium mb-4">التسعير</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">السعر</Label>
                      <Input 
                        id="price" 
                        name="price" 
                        type="number" 
                        value={course.price} 
                        onChange={handleNumberInputChange} 
                        placeholder="أدخل السعر"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">العملة</Label>
                      <Select 
                        value={course.currency} 
                        onValueChange={(value) => handleSelectChange(value, 'currency')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر العملة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EGP">جنيه مصري</SelectItem>
                          <SelectItem value="USD">دولار أمريكي</SelectItem>
                          <SelectItem value="SAR">ريال سعودي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Media section */}
                <div>
                  <h3 className="text-lg font-medium mb-4">الوسائط</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image_url">رابط صورة الدورة</Label>
                      <Input 
                        id="image_url" 
                        name="image_url" 
                        value={course.image_url || ''} 
                        onChange={handleInputChange} 
                        placeholder="أدخل رابط الصورة"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Additional info section */}
                <div>
                  <h3 className="text-lg font-medium mb-4">معلومات إضافية</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">المدة</Label>
                      <Input 
                        id="duration" 
                        name="duration" 
                        value={course.duration || ''} 
                        onChange={handleInputChange} 
                        placeholder="مثال: 8 أسابيع"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">الحالة</Label>
                      <Select 
                        value={course.status} 
                        onValueChange={(value) => handleSelectChange(value as CourseStatus, 'status')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="published">منشور</SelectItem>
                          <SelectItem value="draft">مسودة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Description section */}
                <div>
                  <h3 className="text-lg font-medium mb-4">الوصف</h3>
                  <div className="space-y-2">
                    <Label htmlFor="description">وصف الدورة</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={course.description || ''} 
                      onChange={handleInputChange} 
                      placeholder="أدخل وصفاً تفصيلياً للدورة"
                      rows={5}
                      autoSize
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={saveCourseDetails}
                  disabled={saving}
                  className="bg-primary hover:bg-primary-dark"
                >
                  <Save className="ml-2 h-4 w-4" />
                  {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Lessons Tab */}
          <TabsContent value="lessons">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>دروس الدورة</CardTitle>
                  <CardDescription>
                    إدارة دروس ومحتوى الدورة التدريبية
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setIsAddLessonDialogOpen(true)}
                  className="bg-primary hover:bg-primary-dark"
                >
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة درس جديد
                </Button>
              </CardHeader>
              <CardContent>
                {lessons.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Info className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium mb-1">لا توجد دروس بعد</h3>
                    <p className="text-gray-500 mb-4">قم بإضافة دروس لدورتك التدريبية</p>
                    <Button 
                      onClick={() => setIsAddLessonDialogOpen(true)}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      <Plus className="ml-2 h-4 w-4" />
                      إضافة درس جديد
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center border rounded-lg p-3 bg-gray-50">
                        <div className="mr-3 text-gray-400">
                          <GripVertical className="h-5 w-5" />
                        </div>
                        <div className="flex-1 mr-4">
                          <div className="flex items-center">
                            <span className="bg-primary/10 text-primary font-medium px-2 py-1 rounded text-sm ml-2">
                              {lesson.order_number}
                            </span>
                            <h3 className="font-medium">{lesson.title}</h3>
                            {lesson.is_free && (
                              <Badge variant="outline" className="mr-2">مجاني</Badge>
                            )}
                          </div>
                          {lesson.description && (
                            <p className="text-gray-500 text-sm mt-1 line-clamp-1">{lesson.description}</p>
                          )}
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            {lesson.duration && (
                              <div className="flex items-center ml-4">
                                <Clock className="h-3 w-3 ml-1" />
                                {lesson.duration}
                              </div>
                            )}
                            {(lesson.video_url || lesson.video_file_name) && (
                              <div className="flex items-center">
                                <Video className="h-3 w-3 ml-1" />
                                فيديو متاح
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openVideoUploadDialog(lesson)}
                            className="ml-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            title="تحديث فيديو الدرس"
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLesson(lesson);
                              setIsEditLessonDialogOpen(true);
                            }}
                            className="ml-1"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLesson(lesson);
                              setIsDeleteLessonDialogOpen(true);
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Preview Tab */}
          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>معاينة الدورة</CardTitle>
                <CardDescription>
                  اطلع على كيفية ظهور الدورة للمستخدمين
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                  {course.image_url ? (
                    <img 
                      src={course.image_url} 
                      alt={course.title} 
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">لا توجد صورة</p>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-primary mb-2">{course.title}</h2>
                    <div className="flex items-center text-gray-600 mb-4">
                      <span className="ml-4">{course.instructor}</span>
                      <span className="ml-4">
                        {course.level === 'beginner' ? 'مبتدئ' : 
                         course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                      </span>
                      {course.duration && (
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 ml-1" />
                          {course.duration}
                        </span>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-2">وصف الدورة</h3>
                      <p className="text-gray-700 whitespace-pre-line">
                        {course.description || 'لا يوجد وصف متاح.'}
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-3">محتوى الدورة</h3>
                      {lessons.length > 0 ? (
                        <div className="space-y-3 border rounded-lg divide-y">
                          {lessons.map((lesson) => (
                            <div key={lesson.id} className="p-3 flex items-center">
                              <div className="ml-3 text-primary bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
                                {lesson.order_number}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{lesson.title}</h4>
                                {lesson.duration && (
                                  <div className="text-gray-500 text-sm flex items-center">
                                    <Clock className="h-3 w-3 ml-1" />
                                    {lesson.duration}
                                  </div>
                                )}
                              </div>
                              {lesson.is_free && (
                                <Badge variant="outline">مجاني</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">لا توجد دروس متاحة بعد.</p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-secondary">
                        {course.price} {course.currency}
                      </div>
                      <Button className="bg-secondary hover:bg-secondary-dark">
                        التسجيل في الدورة
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add Lesson Dialog */}
      <Dialog open={isAddLessonDialogOpen} onOpenChange={setIsAddLessonDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>إضافة درس جديد</DialogTitle>
            <DialogDescription>
              قم بإدخال تفاصيل الدرس الجديد. اضغط "حفظ" عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان الدرس</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={newLesson.title} 
                  onChange={handleLessonInputChange} 
                  placeholder="أدخل عنوان الدرس"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order_number">رقم الترتيب</Label>
                <Input 
                  id="order_number" 
                  name="order_number" 
                  type="number" 
                  value={newLesson.order_number} 
                  onChange={handleLessonNumberChange} 
                  placeholder="ترتيب الدرس"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">وصف الدرس</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={newLesson.description} 
                onChange={handleLessonInputChange} 
                placeholder="أدخل وصفاً للدرس"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">المدة</Label>
                <Input 
                  id="duration" 
                  name="duration" 
                  value={newLesson.duration} 
                  onChange={handleLessonInputChange} 
                  placeholder="مثال: 30 دقيقة"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="is_free">إتاحة مجانية</Label>
                <Select 
                  value={newLesson.is_free ? 'true' : 'false'} 
                  onValueChange={(value) => handleLessonBooleanChange(value === 'true', 'is_free')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">متاح مجاناً</SelectItem>
                    <SelectItem value="false">غير متاح مجاناً</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="video_url">رابط الفيديو</Label>
              <Input 
                id="video_url" 
                name="video_url" 
                value={newLesson.video_url} 
                onChange={handleLessonInputChange} 
                placeholder="أدخل رابط الفيديو"
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={addLesson}>إضافة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Lesson Dialog */}
      <Dialog open={isEditLessonDialogOpen} onOpenChange={setIsEditLessonDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تعديل الدرس</DialogTitle>
            <DialogDescription>
              قم بتعديل تفاصيل الدرس. اضغط "حفظ" عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          
          {selectedLesson && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="edit-order_number">رقم الترتيب</Label>
                  <Input 
                    id="edit-order_number" 
                    name="order_number" 
                    type="number" 
                    value={selectedLesson.order_number} 
                    onChange={handleLessonNumberChange} 
                    placeholder="ترتيب الدرس"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">وصف الدرس</Label>
                <Textarea 
                  id="edit-description" 
                  name="description" 
                  value={selectedLesson.description || ''} 
                  onChange={handleLessonInputChange} 
                  placeholder="أدخل وصفاً للدرس"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">المدة</Label>
                  <Input 
                    id="edit-duration" 
                    name="duration" 
                    value={selectedLesson.duration || ''} 
                    onChange={handleLessonInputChange} 
                    placeholder="مثال: 30 دقيقة"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-is_free">إتاحة مجانية</Label>
                  <Select 
                    value={selectedLesson.is_free ? 'true' : 'false'} 
                    onValueChange={(value) => handleLessonBooleanChange(value === 'true', 'is_free')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">متاح مجاناً</SelectItem>
                      <SelectItem value="false">غير متاح مجاناً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-video_url">رابط الفيديو</Label>
                <Input 
                  id="edit-video_url" 
                  name="video_url" 
                  value={selectedLesson.video_url || ''} 
                  onChange={handleLessonInputChange} 
                  placeholder="أدخل رابط الفيديو"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={updateLesson}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Lesson Dialog */}
      <Dialog open={isDeleteLessonDialogOpen} onOpenChange={setIsDeleteLessonDialogOpen}>
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
            <Button variant="destructive" onClick={deleteLesson}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Video Upload Dialog */}
      <Dialog open={isVideoUploadDialogOpen} onOpenChange={setIsVideoUploadDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>رفع فيديو الدرس</DialogTitle>
            <DialogDescription>
              {selectedLesson && (
                <>
                قم برفع فيديو للدرس: <strong>{selectedLesson.title}</strong>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {videoPreviewUrl && (
              <div className="mb-4">
                <Label className="mb-2 block">معاينة الفيديو الحالي</Label>
                <div className="relative rounded-md overflow-hidden aspect-video bg-black">
                  <video 
                    src={videoPreviewUrl} 
                    className="w-full h-full" 
                    controls
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <Label htmlFor="video_file">ملف الفيديو</Label>
              <Input 
                id="video_file" 
                type="file" 
                accept="video/*"
                onChange={handleVideoUpload}
                disabled={uploading}
              />
              <p className="text-xs text-gray-500">
                الصيغ المدعومة: MP4, MKV, WEBM. الحد الأقصى: 200 ميجابايت.
              </p>
            </div>
            
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">جاري الرفع...</span>
                  <span className="text-sm">{uploadProgress.toFixed(0)}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إغلاق</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseEdit;
