
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import AdminCoursesList from '@/components/AdminCoursesList';
import CourseEdit from '@/pages/CourseEdit';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FileText, Video, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CoursesManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [storageError, setStorageError] = useState<string | null>(null);
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);
  const [isCreatingBuckets, setIsCreatingBuckets] = useState(false);
  
  const checkStorageBuckets = async () => {
    try {
      setIsCheckingStorage(true);
      
      // تسجيل عملية التحقق في السجل
      console.log('بدء التحقق من حاويات التخزين للدورات...');
      
      // الحصول على قائمة الحاويات المتاحة
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('خطأ في الحصول على قائمة الحاويات:', error);
        setStorageError('حدث خطأ أثناء التحقق من حاويات التخزين');
        return;
      }
      
      // تسجيل الحاويات المتاحة
      console.log('الحاويات المتاحة:', buckets);
      
      if (!buckets || buckets.length === 0) {
        console.log('لا توجد حاويات متاحة');
        setStorageError('لا توجد حاويات تخزين متاحة، يرجى إنشاء الحاويات المطلوبة');
        return;
      }
      
      // التحقق من وجود الحاويات المطلوبة
      // تحديث أسماء الحاويات المطلوبة
      const courseImages1BucketExists = buckets.some(bucket => 
        bucket.name === 'course_images'
      );
      
      const courseVideos1BucketExists = buckets.some(bucket => 
        bucket.name === 'course_videos'
      );

      const courseImages2BucketExists = buckets.some(bucket => 
        bucket.name === 'Course Images'
      );
      
      const courseVideos2BucketExists = buckets.some(bucket => 
        bucket.name === 'Course Videos'
      );
      
      console.log('حالة الحاويات - course_images:', courseImages1BucketExists, 
                  'course_videos:', courseVideos1BucketExists,
                  'Course Images:', courseImages2BucketExists,
                  'Course Videos:', courseVideos2BucketExists);
      
      if (!courseImages1BucketExists && !courseImages2BucketExists || 
          !courseVideos1BucketExists && !courseVideos2BucketExists) {
        setStorageError('حاويات التخزين المطلوبة غير موجودة، يجب التأكد من وجود حاويات لصور وفيديوهات الدورات');
      } else {
        setStorageError(null);
        toast.success('تم التحقق من حاويات التخزين بنجاح');
      }
    } catch (err) {
      console.error('خطأ غير متوقع أثناء التحقق من حاويات التخزين:', err);
      setStorageError('حدث خطأ غير متوقع أثناء التحقق من حاويات التخزين');
    } finally {
      setIsCheckingStorage(false);
    }
  };

  const createStorageBuckets = async () => {
    try {
      setIsCreatingBuckets(true);
      
      // إنشاء حاوية course_images
      console.log('جاري إنشاء حاوية course_images...');
      const { data: imagesBucket, error: imagesError } = await supabase.storage.createBucket(
        'course_images', 
        { public: true }
      );
      
      if (imagesError && !imagesError.message.includes('already exists')) {
        console.error('خطأ في إنشاء حاوية course_images:', imagesError);
        toast.error('فشل إنشاء حاوية صور الدورات');
        return;
      } else {
        console.log('تم إنشاء أو التأكد من وجود حاوية course_images بنجاح');
      }
      
      // إنشاء حاوية course_videos
      console.log('جاري إنشاء حاوية course_videos...');
      const { data: videosBucket, error: videosError } = await supabase.storage.createBucket(
        'course_videos', 
        { public: true }
      );
      
      if (videosError && !videosError.message.includes('already exists')) {
        console.error('خطأ في إنشاء حاوية course_videos:', videosError);
        toast.error('فشل إنشاء حاوية فيديوهات الدورات');
        return;
      } else {
        console.log('تم إنشاء أو التأكد من وجود حاوية course_videos بنجاح');
      }
      
      // إنشاء حاوية Course Images
      console.log('جاري إنشاء حاوية Course Images...');
      const { data: images2Bucket, error: images2Error } = await supabase.storage.createBucket(
        'Course Images', 
        { public: true }
      );
      
      if (images2Error && !images2Error.message.includes('already exists')) {
        console.error('خطأ في إنشاء حاوية Course Images:', images2Error);
        toast.error('فشل إنشاء حاوية صور الدورات الثانية');
        return;
      } else {
        console.log('تم إنشاء أو التأكد من وجود حاوية Course Images بنجاح');
      }
      
      // إنشاء حاوية Course Videos
      console.log('جاري إنشاء حاوية Course Videos...');
      const { data: videos2Bucket, error: videos2Error } = await supabase.storage.createBucket(
        'Course Videos', 
        { public: true }
      );
      
      if (videos2Error && !videos2Error.message.includes('already exists')) {
        console.error('خطأ في إنشاء حاوية Course Videos:', videos2Error);
        toast.error('فشل إنشاء حاوية فيديوهات الدورات الثانية');
        return;
      } else {
        console.log('تم إنشاء أو التأكد من وجود حاوية Course Videos بنجاح');
      }
      
      // تحديث الوصول العام للحاويات
      console.log('جاري تحديث إعدادات الوصول للحاويات...');
      for (const bucketId of ['course_images', 'course_videos', 'Course Images', 'Course Videos']) {
        const { error: policyError } = await supabase.storage.updateBucket(
          bucketId,
          { public: true }
        );
        
        if (policyError) {
          console.error(`خطأ في تحديث سياسة الوصول لـ ${bucketId}:`, policyError);
        } else {
          console.log(`تم تحديث سياسة الوصول لـ ${bucketId} بنجاح`);
        }
      }
      
      toast.success('تم إنشاء حاويات التخزين بنجاح');
      // إعادة التحقق من الحاويات
      await checkStorageBuckets();
    } catch (err) {
      console.error('خطأ في إنشاء حاويات التخزين:', err);
      toast.error('حدث خطأ أثناء إنشاء حاويات التخزين');
    } finally {
      setIsCreatingBuckets(false);
    }
  };
  
  useEffect(() => {
    // التحقق من وجود حاويات التخزين عند تحميل الصفحة
    checkStorageBuckets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {storageError && (
          <Alert variant="destructive" className="mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>تنبيه!</AlertTitle>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={createStorageBuckets}
                  disabled={isCreatingBuckets}
                >
                  <Plus className="h-4 w-4 ml-1" />
                  {isCreatingBuckets ? 'جاري الإنشاء...' : 'إنشاء الحاويات'}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={checkStorageBuckets}
                  disabled={isCheckingStorage}
                >
                  <RefreshCw className={`h-4 w-4 ${isCheckingStorage ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            <AlertDescription className="mt-2">
              {storageError}
            </AlertDescription>
          </Alert>
        )}
        
        <Routes>
          <Route path="/" element={
            <>
              <header className="mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold text-primary">إدارة الدورات</h1>
                    <p className="text-gray-600 mt-1">إدارة وتنظيم الدورات التدريبية المتاحة على المنصة</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate('/courses-management/create')}
                      className="flex items-center gap-2"
                      disabled={!!storageError && !isCreatingBuckets}
                    >
                      إضافة دورة جديدة
                    </Button>
                    <Button
                      onClick={() => navigate('/admin-dashboard')}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      العودة للوحة التحكم
                    </Button>
                  </div>
                </div>
              </header>

              <AdminCoursesList />
            </>
          } />
          <Route path="/create" element={<CourseEdit />} />
          <Route path="/create/lessons" element={<CourseEdit defaultTab="lessons" />} />
          <Route path=":id" element={<CourseEdit />} />
          <Route path=":id/lessons" element={<CourseEdit defaultTab="lessons" />} />
        </Routes>
      </div>
    </div>
  );
};

export default CoursesManagement;
