import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { useMutation, useQuery } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { useDropzone } from 'react-dropzone';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  CalendarIcon, 
  Check, 
  ChevronsUpDown, 
  Copy, 
  Edit, 
  Eye, 
  File, 
  FileText, 
  ImageIcon, 
  Loader2, 
  Link as LinkIcon,
  Plus, 
  RefreshCw, 
  Trash2, 
  Upload, 
  Video 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const courseFormSchema = z.object({
  title: z.string().min(3, "العنوان يجب أن يكون 3 أحرف على الأقل"),
  instructor: z.string().min(3, "اسم المحاضر يجب أن يكون 3 أحرف على الأقل"),
  price: z.coerce.number().min(0, "السعر لا يمكن أن يكون سالب"),
  currency: z.string().default("EGP"),
  description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
  category: z.string().optional(),
  level: z.string().optional(),
  duration: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

type CourseForm = z.infer<typeof courseFormSchema>;

interface LessonData {
  title: string;
  description: string;
  video_url: string;
  video_file_name: string;
  duration: string;
  is_free: boolean;
  order_number: number;
}

interface CourseEditProps {
  defaultTab?: string;
}

const CourseEdit: React.FC<CourseEditProps> = ({ defaultTab = 'details' }) => {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState(defaultTab);
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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isNewCourse, setIsNewCourse] = useState(!courseId);
  const [tempCourseId, setTempCourseId] = useState<string | null>(null);
  const [isUrlInput, setIsUrlInput] = useState(false);
  const [isImageUrlInput, setIsImageUrlInput] = useState(false);
  const [imageDirectUrl, setImageDirectUrl] = useState<string>('');

  const form = useForm<CourseForm>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
      instructor: '',
      price: 0,
      currency: 'EGP',
      description: '',
      category: '',
      level: '',
      duration: '',
      status: 'draft',
    },
  });

  const { data: course, error: courseError, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      if (!courseId) return null;
      
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
    },
    enabled: !!courseId
  });

  useEffect(() => {
    if (course) {
      form.reset({
        title: course.title || '',
        instructor: course.instructor || '',
        price: course.price || 0,
        currency: course.currency || 'EGP',
        description: course.description || '',
        category: course.category || '',
        level: course.level || '',
        duration: course.duration || '',
        status: (course.status as "draft" | "published") || 'draft',
      });
      setImageUrl(course.image_url || null);
    }
  }, [course, form]);

  useEffect(() => {
    if (courseId) {
      fetchLessons();
    }
  }, [courseId, refreshTrigger]);

  const fetchLessons = async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_number', { ascending: true });
      
      if (error) throw error;
      
      setLessons(data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error('فشل في تحميل الدروس');
    } finally {
      setLoading(false);
    }
  };

  const onDropImage = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    setUploadingImage(true);

    try {
      console.log('Trying to upload image to bucket: course-images');
      
      const { data: buckets, error: bucketsError } = await supabase.storage
        .listBuckets();
      
      if (bucketsError) {
        console.error('Error listing buckets:', bucketsError);
        throw bucketsError;
      }
      
      console.log('Available buckets:', buckets);
      
      const bucketName = 'course-images';
      
      const courseImagesBucket = buckets.find(bucket => bucket.id === 'course-images');
      
      if (!courseImagesBucket) {
        console.error('Error: course images bucket does not exist');
        toast.error('حاوية تخزين الصور غير موجودة، يرجى إنشاء حاوية لصور الدورات من صفحة إدارة الدورات');
        setUploadingImage(false);
        return;
      }

      console.log(`Using bucket: ${bucketName} for upload`);

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        toast.error('فشل في رفع الصورة');
        setUploadingImage(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      toast.success('تم رفع الصورة بنجاح');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('فشل في رفع الصورة');
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps, isDragActive: isImageDragActive } = useDropzone({ 
    onDrop: onDropImage, 
    accept: { 'image/*': [] },
    maxFiles: 1
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    setUploading(true);

    try {
      console.log('Trying to upload file to bucket: course_videos');
      
      const { data: buckets, error: bucketsError } = await supabase.storage
        .listBuckets();
      
      if (bucketsError) {
        console.error('Error listing buckets:', bucketsError);
        throw bucketsError;
      }
      
      console.log('Available buckets:', buckets);
      
      let bucketName = '';
      
      if (buckets.some(bucket => bucket.name === 'course_videos')) {
        bucketName = 'course_videos';
      } else if (buckets.some(bucket => bucket.name === 'Course Videos')) {
        bucketName = 'Course Videos';
      } else {
        console.error('Error: course videos bucket does not exist');
        toast.error('حاوية تخزين الفيديوهات غير موجودة، يرجى إنشاء حاوية لفيديوهات الدورات من صفحة إدارة الدورات');
        setUploading(false);
        return;
      }

      console.log(`Using bucket: ${bucketName} for upload`);

      const { data, error } = await supabase.storage
        .from(bucketName)
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

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'video/*': [] } });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
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

  const toggleUploadMethod = () => {
    setIsUrlInput(!isUrlInput);
    if (isUrlInput) {
      setFileUrl(null);
      setFileName(null);
      setLessonData({
        ...lessonData,
        video_url: '',
        video_file_name: ''
      });
    }
  };

  const handleDirectUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFileUrl(url);
    setLessonData({
      ...lessonData,
      video_url: url,
      video_file_name: url.split('/').pop() || 'external-video'
    });
  };

  const toggleImageUploadMethod = () => {
    setIsImageUrlInput(!isImageUrlInput);
    if (!isImageUrlInput) {
      setImageUrl(null);
    } else {
      setImageDirectUrl('');
    }
  };

  const handleImageUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageDirectUrl(url);
    setImageUrl(url);
  };

  const saveCourse = useMutation({
    mutationFn: async (courseData: CourseForm) => {
      const courseToSave = {
        ...courseData,
        title: courseData.title,
        instructor: courseData.instructor,
        price: courseData.price,
        image_url: imageUrl
      };
      
      if (courseId || tempCourseId) {
        const { data, error } = await supabase
          .from('courses')
          .update(courseToSave)
          .eq('id', courseId || tempCourseId)
          .select();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('courses')
          .insert(courseToSave)
          .select();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data) => {
      if (!courseId && data && data.length > 0) {
        const newCourseId = data[0].id;
        setTempCourseId(newCourseId);
        
        if (activeTab === 'lessons') {
          window.history.replaceState(null, '', `/courses-management/${newCourseId}/lessons`);
        } else {
          navigate(`/courses-management/${newCourseId}`);
        }
        
        toast.success('تم إنشاء الدورة بنجاح');
      } else {
        toast.success('تم تحديث الدورة بنجاح');
      }
    },
    onError: (error) => {
      console.error('Error saving course:', error);
      toast.error('حدث خطأ أثناء حفظ الدورة');
    }
  });

  const saveLesson = useMutation({
    mutationFn: async (lessonData: LessonData) => {
      const actualCourseId = courseId || tempCourseId;
      
      if (!actualCourseId) {
        throw new Error('يجب حفظ الدورة أولاً قبل إضافة الدروس');
      }
      
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
          course_id: actualCourseId
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
    setIsUrlInput(!(lesson.video_url || '').includes('supabase'));
    setIsEditDialogOpen(true);
  };

  const onSubmit = (data: CourseForm) => {
    saveCourse.mutate(data);
  };

  const handleTabChange = (newTab: string) => {
    if (newTab === 'lessons' && isNewCourse && !tempCourseId) {
      saveCourse.mutate(form.getValues(), {
        onSuccess: () => {
          setActiveTab(newTab);
        }
      });
    } else {
      setActiveTab(newTab);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                {courseId || tempCourseId ? `تعديل ال��ورة: ${course?.title || ''}` : 'إضافة دورة جديدة'}
              </h1>
              <p className="text-gray-600 mt-1">
                {courseId || tempCourseId ? 'إدارة وتنظيم محتوى الدورة التدريبية' : 'إضافة دورة تدريبية جديدة إلى المنصة'}
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

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">تفاصيل الدورة</TabsTrigger>
            <TabsTrigger value="lessons">الدروس والمحاضرات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    تفاصيل الدورة
                  </h2>
                  <p className="text-gray-500">
                    أدخل معلومات الدورة التدريبية
                  </p>
                </div>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>عنوان الدورة</FormLabel>
                            <FormControl>
                              <Input placeholder="أساسيات البيع الاحترافي" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="instructor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم المحاضر</FormLabel>
                            <FormControl>
                              <Input placeholder="أحمد محمد" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>صورة الدورة</Label>
                        <Button variant="outline" size="sm" type="button" onClick={toggleImageUploadMethod}>
                          {isImageUrlInput ? <Upload className="h-4 w-4 ml-1" /> : <LinkIcon className="h-4 w-4 ml-1" />}
                          {isImageUrlInput ? 'رفع صورة' : 'إضافة رابط'}
                        </Button>
                      </div>
                      
                      {isImageUrlInput ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="image_url_input">رابط الصورة</Label>
                            <Input 
                              id="image_url_input"
                              placeholder="https://example.com/image.jpg"
                              value={imageDirectUrl}
                              onChange={handleImageUrlInput}
                            />
                            <p className="text-xs text-gray-500">
                              أدخل عنوان URL للصورة من أي موقع على الإنترنت
                            </p>
                          </div>
                          
                          {imageUrl && (
                            <div className="flex flex-col items-center gap-4 mt-4">
                              <img src={imageUrl} alt="صورة الدورة" className="max-h-48 rounded-md object-cover" 
                                onError={() => {
                                  toast.error("تعذر تحميل الصورة من الرابط المحدد");
                                }}
                              />
                              <Button variant="outline" size="sm" onClick={() => {
                                setImageUrl(null);
                                setImageDirectUrl('');
                              }}>
                                تغيير الصورة
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div {...getImageRootProps()} className="border-dashed border-2 rounded-md p-4 cursor-pointer">
                          <input {...getImageInputProps()} />
                          {uploadingImage ? (
                            <div className="flex items-center justify-center">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              <span>جاري الرفع...</span>
                            </div>
                          ) : imageUrl ? (
                            <div className="flex flex-col items-center gap-4">
                              <img src={imageUrl} alt="صورة الدورة" className="max-h-48 rounded-md object-cover" />
                              <Button variant="outline" size="sm" onClick={() => setImageUrl(null)}>
                                تغيير الصورة
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-4">
                              <ImageIcon className="h-10 w-10 text-gray-400" />
                              <p className="text-gray-500 mt-2">
                                {isImageDragActive ? "أفلت الصورة هنا..." : "اسحب صورة أو انقر لاختيار ملف"}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                يفضل صورة بأبعاد 16:9
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>وصف الدورة</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="أدخل وصفاً تفصيلياً للدورة..." 
                              rows={5}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>السعر</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>العملة</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر العملة" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="EGP">جنيه مصري</SelectItem>
                                <SelectItem value="USD">دولار أمريكي</SelectItem>
                                <SelectItem value="SAR">ريال سعودي</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>التصنيف</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value || undefined}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر التصنيف" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="business">إدارة أعمال</SelectItem>
                                <SelectItem value="marketing">تسويق</SelectItem>
                                <SelectItem value="sales">مبيعات</SelectItem>
                                <SelectItem value="development">تطوير ذاتي</SelectItem>
                                <SelectItem value="technology">تكنولوجيا</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>المستوى</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value || undefined}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر المستوى" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="beginner">مبتدئ</SelectItem>
                                <SelectItem value="intermediate">متوسط</SelectItem>
                                <SelectItem value="advanced">متقدم</SelectItem>
                                <SelectItem value="all">جميع المستويات</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>المدة</FormLabel>
                            <FormControl>
                              <Input placeholder="مثال: 5 ساعات و 30 دقيقة" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>حالة الدورة</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر الحالة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">مسودة</SelectItem>
                              <SelectItem value="published">منشورة</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            الدورات المنشورة فقط هي التي يمكن للمستخدمين رؤيتها
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">محتويات الدورة</h3>
                      
                      <div className="bg-gray-50 p-4 rounded-md border border-dashed border-gray-300">
                        <div className="flex flex-col items-center justify-center py-6">
                          <FileText className="h-12 w-12 text-gray-400" />
                          <h4 className="mt-2 font-medium">ما الذي ستتعلمه</h4>
                          <p className="text-gray-500 text-sm mt-1 text-center">
                            بعد حفظ الدورة، يمكنك إضافة دروس ومحاضرات من خلال تبويب "الدروس والمحاضرات"
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 rtl:space-x-reverse">
                      <Button type="button" variant="outline" onClick={() => navigate('/courses-management')}>
                        إلغاء
                      </Button>
                      <Button type="submit" disabled={saveCourse.isPending}>
                        {saveCourse.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {courseId ? 'تحديث الدورة' : 'إنشاء الدورة'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="lessons">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    الدروس والمحاضرات
                  </h2>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500">
                      {!courseId && !tempCourseId ? 
                        'يجب حفظ الدورة أولاً قبل إضافة الدروس' : 
                        'إضافة وتعديل الدروس والمحاضرات الخاصة بالدورة'}
                    </p>
                    <Button
                      onClick={() => setIsAddDialogOpen(true)}
                      className="flex items-center gap-2"
                      disabled={!courseId && !tempCourseId}
                    >
                      <Plus className="h-4 w-4" />
                      إضافة درس جديد
                    </Button>
                  </div>
                </div>

                {!courseId && !tempCourseId ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800 mb-4">
                    <p className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      يجب حفظ معلومات الدورة أولاً قبل إضافة الدروس والمحاضرات. الرجاء إكمال معلومات الدورة في تبويب "تفاصيل الدورة" والضغط على زر "إنشاء الدورة".
                    </p>
                  </div>
                ) : (
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
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
                <div className="flex justify-between mb-2">
                  <Label htmlFor="video_url">فيديو الدرس</Label>
                  <Button variant="outline" size="sm" type="button" onClick={toggleUploadMethod}>
                    {isUrlInput ? <Upload className="h-4 w-4 ml-1" /> : <LinkIcon className="h-4 w-4 ml-1" />}
                    {isUrlInput ? 'رفع ملف' : 'إضافة رابط'}
                  </Button>
                </div>
                
                {isUrlInput ? (
                  <div className="space-y-2">
                    <Label htmlFor="video_url_input">رابط الفيديو الخارجي</Label>
                    <Input 
                      id="video_url_input"
                      placeholder="https://example.com/video.mp4"
                      value={fileUrl || ''}
                      onChange={handleDirectUrlInput}
                    />
                    <p className="text-xs text-gray-500">
                      يمكنك إضافة روابط من YouTube أو Vimeo أو أي منصة فيديو أخرى
                    </p>
                  </div>
                ) : (
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
                      <div className="flex flex-col items-center justify-center py-4">
                        <Upload className="h-6 w-6 text-gray-500" />
                        <p className="text-gray-500 mt-2">
                          {isDragActive ? "أفلت الملف هنا..." : "إضغط أو اسحب الملف لرفعه"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
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
                <div className="flex justify-between mb-2">
                  <Label htmlFor="edit-video_url">فيديو الدرس</Label>
                  <Button variant="outline" size="sm" type="button" onClick={toggleUploadMethod}>
                    {isUrlInput ? <Upload className="h-4 w-4 ml-1" /> : <LinkIcon className="h-4 w-4 ml-1" />}
                    {isUrlInput ? 'رفع ملف' : 'إضافة رابط'}
                  </Button>
                </div>
                
                {isUrlInput ? (
                  <div className="space-y-2">
                    <Label htmlFor="edit-video_url_input">رابط الفيديو الخارجي</Label>
                    <Input 
                      id="edit-video_url_input"
                      placeholder="https://example.com/video.mp4"
                      value={fileUrl || ''}
                      onChange={handleDirectUrlInput}
                    />
                    <p className="text-xs text-gray-500">
                      يمكنك إضافة روابط من YouTube أو Vimeo أو أي منصة فيديو أخرى
                    </p>
                  </div>
                ) : (
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
                      <div className="flex flex-col items-center justify-center py-4">
                        <Upload className="h-6 w-6 text-gray-500" />
                        <p className="text-gray-500 mt-2">
                          {isDragActive ? "أفلت الملف هنا..." : "إضغط أو اسحب الملف لرفعه"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
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
