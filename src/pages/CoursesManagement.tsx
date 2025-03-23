
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
import { FileText, Video, AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CoursesManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [storageError, setStorageError] = useState<string | null>(null);
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);
  
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
      
      const courseImagesBucketExists = buckets.some(bucket => bucket.id === 'course-images');
      const courseVideosBucketExists = buckets.some(bucket => bucket.id === 'course-videos');
      
      if (!courseImagesBucketExists || !courseVideosBucketExists) {
        setStorageError('حاويات التخزين المطلوبة غير موجودة، يرجى التواصل مع مسؤول النظام لإنشائها');
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
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={checkStorageBuckets}
                disabled={isCheckingStorage}
              >
                <RefreshCw className={`h-4 w-4 ${isCheckingStorage ? 'animate-spin' : ''}`} />
              </Button>
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
                      disabled={!!storageError}
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
