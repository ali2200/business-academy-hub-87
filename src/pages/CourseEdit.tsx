
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Video,
  Upload,
  X,
  FileText
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from "@/components/ui/progress";

interface CourseForm {
  title: string;
  description: string;
  price: number;
  currency: string;
  instructor: string;
  category: string;
  level: string;
  duration: string;
  image_url: string;
  status: string;
}

interface LessonForm {
  title: string;
  description: string;
  order_number: number;
  is_free: boolean;
  video_url: string;
  video_file_name: string;
  duration: string;
}

interface LessonData {
  id?: string;
  title: string;
  description: string;
  order_number: number;
  is_free: boolean;
  video_url: string;
  video_file_name: string;
  duration: string;
  course_id: string;
}

const CourseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [courseForm, setCourseForm] = useState<CourseForm>({
    title: '',
    description: '',
    price: 0,
    currency: 'EGP',
    instructor: '',
    category: '',
    level: 'beginner',
    duration: '',
    image_url: '',
    status: 'draft',
  });

  const [lessonForm, setLessonForm] = useState<LessonForm>({
    title: '',
    description: '',
    order_number: 1,
    is_free: false,
    video_url: '',
    video_file_name: '',
    duration: '',
  });

  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
  const [isDeleteLessonOpen, setIsDeleteLessonOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  const { data: course, isLoading: isCourseLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      if (!id || id === 'create') return null;
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id && id !== 'create'
  });

  const { data: lessons, isLoading: isLessonsLoading } = useQuery({
    queryKey: ['lessons', id],
    queryFn: async () => {
      if (!id || id === 'create') return [];
      
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .order('order_number', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!id && id !== 'create'
  });

  useEffect(() => {
    if (course) {
      setCourseForm({
        title: course.title || '',
        description: course.description || '',
        price: course.price || 0,
        currency: course.currency || 'EGP',
        instructor: course.instructor || '',
        category: course.category || '',
        level: course.level || 'beginner',
        duration: course.duration || '',
        image_url: course.image_url || '',
        status: course.status || 'draft',
      });

      if (course.image_url) {
        setPreviewUrl(course.image_url);
      }
    }
  }, [course]);

  const resetLessonForm = (orderNumber?: number) => {
    setLessonForm({
      title: '',
      description: '',
      order_number: orderNumber || (lessons?.length ? lessons.length + 1 : 1),
      is_free: false,
      video_url: '',
      video_file_name: '',
      duration: '',
    });
    setVideoPreviewUrl(null);
  };

  const saveCourse = useMutation({
    mutationFn: async (courseData: CourseForm) => {
      if (id && id !== 'create') {
        const { data, error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', id);
        
        if (error) throw error;
        return { ...data, id };
      } else {
        const { data, error } = await supabase
          .from('courses')
          .insert([courseData])
          .select();
        
        if (error) throw error;
        return data?.[0];
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['course', id]});
      queryClient.invalidateQueries({queryKey: ['courses']});
      toast.success(id === 'create' ? 'تم إنشاء الدورة بنجاح' : 'تم تحديث الدورة بنجاح');
      
      if (id === 'create' && data?.id) {
        navigate(`/courses-management/${data.id}`);
      }
    },
    onError: (error) => {
      console.error('Error saving course:', error);
      toast.error('حدث خطأ أثناء حفظ الدورة');
    }
  });

  const saveLesson = useMutation({
    mutationFn: async (lessonData: LessonData) => {
      if (selectedLessonId) {
        // Create a new object with all properties explicitly
        const dataToUpdate = {
          title: lessonData.title,
          description: lessonData.description,
          order_number: lessonData.order_number,
          is_free: lessonData.is_free,
          video_url: lessonData.video_url,
          video_file_name: lessonData.video_file_name,
          duration: lessonData.duration,
          course_id: lessonData.course_id
        };
        
        const { data, error } = await supabase
          .from('lessons')
          .update(dataToUpdate)
          .eq('id', selectedLessonId);
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('lessons')
          .insert([lessonData])
          .select();
        
        if (error) throw error;
        return data?.[0];
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['lessons', id]});
      toast.success(selectedLessonId ? 'تم تحديث الدرس بنجاح' : 'تم إضافة الدرس بنجاح');
      setIsAddLessonOpen(false);
      setIsEditLessonOpen(false);
      resetLessonForm();
    },
    onError: (error) => {
      console.error('Error saving lesson:', error);
      toast.error('حدث خطأ أثناء حفظ الدرس');
    }
  });

  const deleteLesson = useMutation({
    mutationFn: async (lessonId: string) => {
      const { data, error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['lessons', id]});
      toast.success('تم حذف الدرس بنجاح');
      setIsDeleteLessonOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting lesson:', error);
      toast.error('حدث خطأ أثناء حذف الدرس');
    }
  });

  const handleCourseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newCourseForm = { ...courseForm };
    if (name === 'price') {
      newCourseForm.price = parseFloat(value);
    } else {
      (newCourseForm as any)[name] = value;
    }
    setCourseForm(newCourseForm);
  };

  const handleLessonInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newLessonForm = { ...lessonForm };
    if (name === 'order_number') {
      newLessonForm.order_number = parseInt(value);
    } else {
      (newLessonForm as any)[name] = value;
    }
    setLessonForm(newLessonForm);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    saveCourse.mutate(courseForm);
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    const lessonData: LessonData = {
      title: lessonForm.title,
      description: lessonForm.description,
      order_number: lessonForm.order_number,
      is_free: lessonForm.is_free,
      video_url: lessonForm.video_url,
      video_file_name: lessonForm.video_file_name,
      duration: lessonForm.duration,
      course_id: id
    };
    
    saveLesson.mutate(lessonData);
  };

  const handleEditLesson = (lesson: any) => {
    setSelectedLessonId(lesson.id);
    setLessonForm({
      title: lesson.title,
      description: lesson.description || '',
      order_number: lesson.order_number,
      is_free: lesson.is_free || false,
      video_url: lesson.video_url || '',
      video_file_name: lesson.video_file_name || '',
      duration: lesson.duration || '',
    });
    
    if (lesson.video_url) {
      setVideoPreviewUrl(lesson.video_url);
    } else {
      setVideoPreviewUrl(null);
    }
    
    setIsEditLessonOpen(true);
  };

  const handleDeleteLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setIsDeleteLessonOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      const uploadOptions = {
        cacheControl: '3600',
        upsert: true
      };
      
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      });
      
      const { data, error } = await supabase.storage
        .from('course_images')
        .upload(filePath, file, uploadOptions);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('course_images')
        .getPublicUrl(filePath);

      const newCourseForm = { ...courseForm };
      newCourseForm.image_url = publicUrl;
      setCourseForm(newCourseForm);

      toast.success('تم رفع الصورة بنجاح');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('حدث خطأ أثناء رفع الصورة');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const objectUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(objectUrl);
      
      const uploadOptions = {
        cacheControl: '3600',
        upsert: true
      };
      
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      });
      
      const { data, error } = await supabase.storage
        .from('course_videos')
        .upload(filePath, file, uploadOptions);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('course_videos')
        .getPublicUrl(filePath);

      const newLessonForm = { ...lessonForm };
      newLessonForm.video_url = publicUrl;
      newLessonForm.video_file_name = fileName;
      setLessonForm(newLessonForm);

      toast.success('تم رفع الفيديو بنجاح');
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('حدث خطأ أثناء رفع الفيديو');
      setVideoPreviewUrl(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    }
  };

  const removeImage = () => {
    const newCourseForm = { ...courseForm };
    newCourseForm.image_url = '';
    setCourseForm(newCourseForm);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeVideo = () => {
    const newLessonForm = { ...lessonForm };
    newLessonForm.video_url = '';
    newLessonForm.video_file_name = '';
    setLessonForm(newLessonForm);
    setVideoPreviewUrl(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  if (isCourseLoading && id && id !== 'create') {
    return <div className="flex justify-center items-center h-96">جاري التحميل...</div>;
  }

  return (
    <div>
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/courses-management')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {id === 'create' ? 'إضافة دورة جديدة' : `تعديل دورة: ${courseForm.title}`}
              </h1>
              <p className="text-gray-600">
                {id === 'create' ? 'أدخل تفاصيل الدورة الجديدة' : 'تعديل تفاصيل ومحتوى الدورة'}
              </p>
            </div>
          </div>
          <Button
            onClick={handleSaveCourse}
            disabled={saveCourse.isPending}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            حفظ الدورة
          </Button>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            تفاصيل الدورة
          </TabsTrigger>
          <TabsTrigger 
            value="lessons" 
            className="flex items-center gap-2"
            disabled={id === 'create'}
          >
            <Video className="h-4 w-4" />
            دروس الدورة
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الدورة الأساسية</CardTitle>
              <CardDescription>
                أدخل المعلومات الأساسية للدورة التدريبية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">عنوان الدورة</Label>
                      <Input
                        id="title"
                        name="title"
                        value={courseForm.title}
                        onChange={handleCourseInputChange}
                        placeholder="عنوان الدورة"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instructor">اسم المدرب</Label>
                      <Input
                        id="instructor"
                        name="instructor"
                        value={courseForm.instructor}
                        onChange={handleCourseInputChange}
                        placeholder="اسم المدرب"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">وصف الدورة</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={courseForm.description}
                      onChange={handleCourseInputChange}
                      placeholder="وصف مفصل للدورة"
                      rows={5}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price">سعر الدورة</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={courseForm.price}
                        onChange={handleCourseInputChange}
                        placeholder="سعر الدورة"
                        min="0"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currency">العملة</Label>
                      <Select 
                        name="currency"
                        value={courseForm.currency}
                        onValueChange={(value) => setCourseForm({...courseForm, currency: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر العملة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EGP">جنيه مصري</SelectItem>
                          <SelectItem value="USD">دولار أمريكي</SelectItem>
                          <SelectItem value="SAR">ريال سعودي</SelectItem>
                          <SelectItem value="AED">درهم إماراتي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration">مدة الدورة</Label>
                      <Input
                        id="duration"
                        name="duration"
                        value={courseForm.duration}
                        onChange={handleCourseInputChange}
                        placeholder="مثال: 10 ساعات"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category">فئة الدورة</Label>
                      <Input
                        id="category"
                        name="category"
                        value={courseForm.category}
                        onChange={handleCourseInputChange}
                        placeholder="مثال: برمجة، تسويق، إدارة أعمال"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="level">مستوى الدورة</Label>
                      <Select 
                        name="level"
                        value={courseForm.level}
                        onValueChange={(value) => setCourseForm({...courseForm, level: value})}
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">حالة الدورة</Label>
                      <Select 
                        name="status"
                        value={courseForm.status}
                        onValueChange={(value) => setCourseForm({...courseForm, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">مسودة</SelectItem>
                          <SelectItem value="published">منشور</SelectItem>
                          <SelectItem value="archived">مؤرشف</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>صورة الدورة</Label>
                    <div className="border border-input rounded-md p-4">
                      {previewUrl ? (
                        <div className="relative">
                          <img 
                            src={previewUrl} 
                            alt="معاينة صورة الدورة" 
                            className="h-48 w-auto object-cover rounded-md mx-auto"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                            onClick={removeImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-2">اضغط لتحميل صورة للدورة</p>
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                          >
                            اختر صورة
                          </Button>
                        </div>
                      )}
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      
                      {isUploading && (
                        <div className="mt-4">
                          <Label className="mb-2 block">جارِ الرفع: {uploadProgress}%</Label>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/courses-management')}>
                إلغاء
              </Button>
              <Button onClick={handleSaveCourse} disabled={saveCourse.isPending}>
                {saveCourse.isPending ? 'جارِ الحفظ...' : 'حفظ الدورة'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="lessons">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>قائمة الدروس</CardTitle>
                  <CardDescription>
                    إدارة دروس الدورة وفيديوهات المحتوى
                  </CardDescription>
                </div>
                <Dialog open={isAddLessonOpen} onOpenChange={setIsAddLessonOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      resetLessonForm();
                      setSelectedLessonId(null);
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      إضافة درس جديد
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>إضافة درس جديد</DialogTitle>
                      <DialogDescription>
                        أضف تفاصيل الدرس وقم برفع فيديو المحتوى
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="lesson-title">عنوان الدرس</Label>
                        <Input
                          id="lesson-title"
                          name="title"
                          value={lessonForm.title}
                          onChange={handleLessonInputChange}
                          placeholder="عنوان الدرس"
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="lesson-description">وصف الدرس</Label>
                        <Textarea
                          id="lesson-description"
                          name="description"
                          value={lessonForm.description}
                          onChange={handleLessonInputChange}
                          placeholder="وصف محتوى الدرس"
                          rows={3}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="order_number">ترتيب الدرس</Label>
                          <Input
                            id="order_number"
                            name="order_number"
                            type="number"
                            value={lessonForm.order_number}
                            onChange={handleLessonInputChange}
                            min="1"
                            required
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="duration">مدة الدرس</Label>
                          <Input
                            id="duration"
                            name="duration"
                            value={lessonForm.duration}
                            onChange={handleLessonInputChange}
                            placeholder="مثال: 45 دقيقة"
                          />
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <input
                            type="checkbox"
                            id="is_free"
                            className="h-4 w-4 rounded border-gray-300"
                            checked={lessonForm.is_free}
                            onChange={(e) => setLessonForm({...lessonForm, is_free: e.target.checked})}
                          />
                          <Label htmlFor="is_free">درس مجاني؟</Label>
                        </div>
                        <p className="text-sm text-gray-500">
                          الدروس المجانية يمكن للمستخدمين مشاهدتها دون شراء الدورة
                        </p>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label>فيديو الدرس</Label>
                        <div className="border border-input rounded-md p-4">
                          {videoPreviewUrl ? (
                            <div className="relative">
                              <video 
                                src={videoPreviewUrl} 
                                controls
                                className="w-full h-auto rounded-md"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                onClick={removeVideo}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                              <Video className="h-10 w-10 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600 mb-2">اضغط لتحميل فيديو الدرس</p>
                              <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => videoInputRef.current?.click()}
                                disabled={isUploading}
                              >
                                اختر فيديو
                              </Button>
                            </div>
                          )}
                          
                          <input
                            type="file"
                            ref={videoInputRef}
                            className="hidden"
                            accept="video/*"
                            onChange={handleVideoUpload}
                          />
                          
                          {isUploading && (
                            <div className="mt-4">
                              <Label className="mb-2 block">جارِ الرفع: {uploadProgress}%</Label>
                              <Progress value={uploadProgress} className="h-2" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsAddLessonOpen(false);
                          resetLessonForm();
                        }}
                      >
                        إلغاء
                      </Button>
                      <Button 
                        type="button" 
                        onClick={handleSaveLesson}
                        disabled={!lessonForm.title || saveLesson.isPending}
                      >
                        {saveLesson.isPending ? 'جارِ الحفظ...' : 'حفظ الدرس'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {isLessonsLoading ? (
                <div className="flex justify-center items-center h-40">جاري تحميل الدروس...</div>
              ) : lessons && lessons.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>عنوان الدرس</TableHead>
                      <TableHead>المدة</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="text-left">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lessons.map((lesson: any, index: number) => (
                      <TableRow key={lesson.id}>
                        <TableCell>{lesson.order_number}</TableCell>
                        <TableCell>
                          <div className="font-medium">{lesson.title}</div>
                          {lesson.description && (
                            <div className="text-gray-500 text-xs truncate max-w-60">
                              {lesson.description}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{lesson.duration || 'غير محدد'}</TableCell>
                        <TableCell>
                          {lesson.is_free ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              مجاني
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              مدفوع
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="تعديل"
                              onClick={() => handleEditLesson(lesson)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="حذف"
                              onClick={() => handleDeleteLesson(lesson.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                            {lesson.video_url && (
                              <Button
                                variant="ghost"
                                size="icon"
                                title="عرض الفيديو"
                                asChild
                              >
                                <a href={lesson.video_url} target="_blank" rel="noreferrer">
                                  <Play className="h-4 w-4 text-green-500" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10 border rounded-md">
                  <Video className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">لا توجد دروس</h3>
                  <p className="text-gray-500 mt-2">قم بإضافة دروس جديدة للدورة من خلال الزر أعلاه</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditLessonOpen} onOpenChange={setIsEditLessonOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تعديل الدرس</DialogTitle>
            <DialogDescription>
              قم بتعديل تفاصيل الدرس وفيديو المحتوى
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-lesson-title">عنوان الدرس</Label>
              <Input
                id="edit-lesson-title"
                name="title"
                value={lessonForm.title}
                onChange={handleLessonInputChange}
                placeholder="عنوان الدرس"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-lesson-description">وصف الدرس</Label>
              <Textarea
                id="edit-lesson-description"
                name="description"
                value={lessonForm.description}
                onChange={handleLessonInputChange}
                placeholder="وصف محتوى الدرس"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-order_number">ترتيب الدرس</Label>
                <Input
                  id="edit-order_number"
                  name="order_number"
                  type="number"
                  value={lessonForm.order_number}
                  onChange={handleLessonInputChange}
                  min="1"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-duration">مدة الدرس</Label>
                <Input
                  id="edit-duration"
                  name="duration"
                  value={lessonForm.duration}
                  onChange={handleLessonInputChange}
                  placeholder="مثال: 45 دقيقة"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  id="edit-is_free"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={lessonForm.is_free}
                  onChange={(e) => setLessonForm({...lessonForm, is_free: e.target.checked})}
                />
                <Label htmlFor="edit-is_free">درس مجاني؟</Label>
              </div>
              <p className="text-sm text-gray-500">
                الدروس المجانية يمكن للمستخدمين مشاهدتها دون شراء الدورة
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label>فيديو الدرس</Label>
              <div className="border border-input rounded-md p-4">
                {videoPreviewUrl ? (
                  <div className="relative">
                    <video 
                      src={videoPreviewUrl} 
                      controls
                      className="w-full h-auto rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={removeVideo}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <Video className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">اضغط لتحميل فيديو الدرس</p>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => videoInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      اختر فيديو
                    </Button>
                  </div>
                )}
                
                <input
                  type="file"
                  ref={videoInputRef}
                  className="hidden"
                  accept="video/*"
                  onChange={handleVideoUpload}
                />
                
                {isUploading && (
                  <div className="mt-4">
                    <Label className="mb-2 block">جارِ الرفع: {uploadProgress}%</Label>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsEditLessonOpen(false);
                resetLessonForm();
              }}
            >
              إلغاء
            </Button>
            <Button 
              type="button" 
              onClick={handleSaveLesson}
              disabled={!lessonForm.title || saveLesson.isPending}
            >
              {saveLesson.isPending ? 'جارِ الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteLessonOpen} onOpenChange={setIsDeleteLessonOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف الدرس</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا الدرس؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteLessonOpen(false)}>
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedLessonId && deleteLesson.mutate(selectedLessonId)}
              disabled={deleteLesson.isPending}
            >
              {deleteLesson.isPending ? 'جارِ الحذف...' : 'حذف'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseEdit;
