
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
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      console.log('Available buckets:', buckets);
      
      if (error) {
        console.error('Error checking storage buckets:', error);
        setStorageError('حدث خطأ أثناء التحقق من حاويات التخزين');
        return;
      }
      
      // التحقق من وجود الحاويات المطلوبة (باستخدام الأسماء الموجودة في سوبربيز)
      // استخدام الأسماء الدقيقة كما هي في Supabase
      const bookCoversBucketExists = buckets?.some(bucket => 
        bucket.id === 'book_covers' || bucket.id === 'Book Covers');
      const bookFilesBucketExists = buckets?.some(bucket => 
        bucket.id === 'book_files' || bucket.id === 'Book Files');
      
      if (!bookCoversBucketExists || !bookFilesBucketExists) {
        setStorageError('حاويات التخزين المطلوبة غير موجودة، يجب التأكد من وجود حاويات لأغلفة وملفات الكتب');
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
      
      // إنشاء حاوية book_covers (استخدام الاسم الدقيق كما هو متوقع في الكود)
      const { data: coversBucket, error: coversError } = await supabase.storage.createBucket(
        'book_covers', 
        { public: true }
      );
      
      if (coversError && !coversError.message.includes('already exists')) {
        console.error('Error creating book_covers bucket:', coversError);
        toast.error('فشل إنشاء حاوية أغلفة الكتب');
        return;
      }
      
      // إنشاء حاوية book_files (استخدام الاسم الدقيق كما هو متوقع في الكود)
      const { data: filesBucket, error: filesError } = await supabase.storage.createBucket(
        'book_files', 
        { public: true }
      );
      
      if (filesError && !filesError.message.includes('already exists')) {
        console.error('Error creating book_files bucket:', filesError);
        toast.error('فشل إنشاء حاوية ملفات الكتب');
        return;
      }
      
      // تحديث الوصول العام للحاويات
      for (const bucketId of ['book_covers', 'book_files']) {
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
