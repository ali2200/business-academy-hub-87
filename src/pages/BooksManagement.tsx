
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import AdminBooksList from '@/components/AdminBooksList';
import { AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BooksManagement = () => {
  const navigate = useNavigate();
  const [storageError, setStorageError] = useState<string | null>(null);
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);
  const [isCreatingBuckets, setIsCreatingBuckets] = useState(false);
  
  const checkStorageBuckets = async () => {
    try {
      setIsCheckingStorage(true);
      
      // تسجيل عملية التحقق في السجل
      console.log('بدء التحقق من حاويات التخزين...');
      
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
      const bookCoversBucketExists = buckets.some(bucket => 
        bucket.name === 'book-covers'
      );
      
      const bookFilesBucketExists = buckets.some(bucket => 
        bucket.name === 'book-files'
      );
      
      console.log('حالة الحاويات - book-covers:', bookCoversBucketExists, 'book-files:', bookFilesBucketExists);
      
      if (!bookCoversBucketExists || !bookFilesBucketExists) {
        setStorageError('حاويات التخزين المطلوبة غير موجودة، يجب التأكد من وجود حاويات لأغلفة وملفات الكتب');
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
      
      // إنشاء حاوية book-covers
      console.log('جاري إنشاء حاوية book-covers...');
      const { data: coversBucket, error: coversError } = await supabase.storage.createBucket(
        'book-covers', 
        { public: true }
      );
      
      if (coversError && !coversError.message.includes('already exists')) {
        console.error('خطأ في إنشاء حاوية book-covers:', coversError);
        toast.error('فشل إنشاء حاوية أغلفة الكتب');
        return;
      } else {
        console.log('تم إنشاء أو التأكد من وجود حاوية book-covers بنجاح');
      }
      
      // إنشاء حاوية book-files
      console.log('جاري إنشاء حاوية book-files...');
      const { data: filesBucket, error: filesError } = await supabase.storage.createBucket(
        'book-files', 
        { public: true }
      );
      
      if (filesError && !filesError.message.includes('already exists')) {
        console.error('خطأ في إنشاء حاوية book-files:', filesError);
        toast.error('فشل إنشاء حاوية ملفات الكتب');
        return;
      } else {
        console.log('تم إنشاء أو التأكد من وجود حاوية book-files بنجاح');
      }
      
      // تحديث الوصول العام للحاويات
      console.log('جاري تحديث إعدادات الوصول للحاويات...');
      for (const bucketId of ['book-covers', 'book-files']) {
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
        
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">إدارة الكتب</h1>
              <p className="text-gray-600 mt-1">إدارة وتنظيم الكتب المتاحة للبيع على المنصة</p>
            </div>
            <Button
              onClick={() => navigate('/admin-dashboard')}
              variant="outline"
              className="flex items-center gap-2"
            >
              العودة للوحة التحكم
            </Button>
          </div>
        </header>

        <AdminBooksList />
      </div>
    </div>
  );
};

export default BooksManagement;
