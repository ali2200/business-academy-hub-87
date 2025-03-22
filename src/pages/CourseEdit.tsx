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
      
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (courseError) throw courseError;
      
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .order('order_number', { ascending: true });
      
      if (lessonsError) throw lessonsError;
      
      setCourse({
        ...courseData,
        level: (courseData.level as CourseLevel) || 'beginner',
        status: (courseData.status as CourseStatus) || 'draft'
      });
      
      setLessons(lessonsData || []);
      
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
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', selectedLesson.id);
      
      if (error) throw error;
      
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
      const { error: uploadError, data } = await supabase.storage
        .from('course_videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) throw uploadError;
      
      const { error: updateError } = await supabase
        .from('lessons')
        .update({
          video_file_name: fileName
        })
        .eq('id', selectedLesson.id);
      
      if (updateError) throw updateError;
      
      const updatedLesson = { ...selectedLesson, video_file_name: fileName };
      setLessons(lessons.map(lesson => 
        lesson.id === selectedLesson.id ? updatedLesson : lesson
      ));
      setSelectedLesson(updatedLesson);
      
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

  useEffect(() => {
    let progressInterval: number | undefined;
    
    if (uploading) {
      progressInterval = window.setInterval(() => {
        setUploadProgress(prev => {
          if (prev < 90) {
            return prev + 5;
          }
          return prev;
        });
      }, 300);
    }
    
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [uploading]);

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
      {/* ... rest of the component code remains unchanged ... */}
    </div>
  );
};

export default CourseEdit;
