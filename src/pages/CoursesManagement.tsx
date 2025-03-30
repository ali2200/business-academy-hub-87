
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
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      console.log('Available buckets:', buckets);
      
      if (error) {
        console.error('Error checking storage buckets:', error);
        setStorageError('حدث خطأ أثناء التحقق من حاويات التخزين');
        return;
      }
      
      // استخدام أسماء الحاويات بدقة، مع الشرطة العادية "-"
      const courseImagesBucketExists = buckets?.some(bucket => bucket.id === 'course-images');
      const courseVideosBucketExists = buckets?.some(bucket => bucket.id === 'course-videos');
      
      if (!courseImagesBucketExists || !courseVideosBucketExists) {
        setStorageError('حاويات التخزين المطلوبة غير موجودة، يجب إنشاء حاويات بأسماء: course-images و course-videos (مع الشرطة -)');
      } else {
        setStorageError(null);
        toast.success('تم التحقق من حاويات التخزين بنجاح');
      }
    } catch (err) {
      console.error('Unexpected error checking storage:', err);
      setStorageError('حدث خطأ غير متوقع أثناء التحقق من حاويات التخزين');
    } finally {
      setIsCheckingStorage(false);
    }
  };

  const createStorageBuckets = async () => {
    try {
      setIsCreatingBuckets(true);
      
      // إنشاء حاوية course-images مع الشرطة العادية "-"
      const { data: coversBucket, error: coversError } = await supabase.storage.createBucket(
        'course-images', 
        { public: true }
      );
      
      if (coversError && !coversError.message.includes('already exists')) {
        console.error('Error creating course-images bucket:', coversError);
        toast.error('فشل إنشاء حاوية صور الدورات');
        return;
      }
      
      // إنشاء حاوية course-videos مع الشرطة العادية "-"
      const { data: filesBucket, error: filesError } = await supabase.storage.createBucket(
        'course-videos', 
        { public: true }
      );
      
      if (filesError && !filesError.message.includes('already exists')) {
        console.error('Error creating course-videos bucket:', filesError);
        toast.error('فشل إنشاء حاوية فيديوهات الدورات');
        return;
      }
      
      // تحديث الوصول العام للحاويات
      for (const bucketId of ['course-images', 'course-videos']) {
        const { error: policyError } = await supabase.storage.updateBucket(
          bucketId,
          { public: true }
        );
        
        if (policyError) {
          console.error(`Error updating policy for ${bucketId}:`, policyError);
        }
      }
      
      toast.success('تم إنشاء حاويات التخزين بنجاح');
      // إعادة التحقق من الحاويات
      await checkStorageBuckets();
    } catch (err) {
      console.error('Error creating storage buckets:', err);
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
