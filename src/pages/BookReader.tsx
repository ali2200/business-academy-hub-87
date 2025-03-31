
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ZoomIn, ZoomOut, X, Menu, Home, ChevronLeft, Book, Bookmark } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BookReader = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  
  const [book, setBook] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bookContainerRef = useRef<HTMLDivElement>(null);
  
  // فهرس الكتاب الوهمي
  const bookIndex = [
    { title: 'المقدمة', page: 1 },
    { title: 'الفصل الأول: أساسيات البيع', page: 3 },
    { title: 'الفصل الثاني: مهارات التواصل', page: 10 },
    { title: 'الفصل الثالث: تحديد احتياجات العملاء', page: 18 },
    { title: 'الفصل الرابع: التعامل مع الاعتراضات', page: 25 },
    { title: 'الفصل الخامس: إغلاق الصفقات', page: 32 },
    { title: 'الخاتمة', page: 40 },
  ];
  
  // جلب بيانات الكتاب من Supabase
  const fetchBookDetails = async () => {
    try {
      setIsLoading(true);
      
      if (!id) {
        setError('معرف الكتاب غير صحيح');
        return;
      }
      
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching book details:', error);
        setError('فشل في تحميل بيانات الكتاب');
        return;
      }
      
      if (!data) {
        setError('الكتاب غير موجود أو غير متاح حالياً');
        return;
      }
      
      setBook(data);
      setTotalPages(data.pages || 40); // استخدام عدد الصفحات الفعلي أو قيمة افتراضية
      
      // في النسخة الحقيقية، يجب التحقق مما إذا كان المستخدم قد اشترى الكتاب
      // وإذا كان isPreview=true، يجب عرض صفحات المعاينة فقط
      if (isPreview && !data.is_purchased) {
        setTotalPages(4); // عرض 4 صفحات فقط للمعاينة
      }
      
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, [id]);
  
  // تغيير الصفحة
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      
      // إذا كانت المعاينة والمستخدم يحاول الوصول إلى صفحة بعد نهاية المعاينة
      if (isPreview && newPage > 4 && !book?.is_purchased) {
        toast.error("هذه معاينة محدودة فقط", {
          description: "لقراءة الكتاب كاملاً، يرجى شراؤه",
        });
        setCurrentPage(4); // العودة إلى آخر صفحة في المعاينة
        return;
      }
    }
  };
  
  // التكبير والتصغير
  const handleZoomChange = (newZoom: number[]) => {
    setZoom(newZoom[0]);
  };
  
  // الانتقال إلى صفحة من الفهرس
  const goToIndexPage = (page: number) => {
    handlePageChange(page);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="mr-3">جاري تحميل الكتاب...</span>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <h1 className="text-3xl font-bold text-primary mb-4">عفواً، لا يمكن عرض الكتاب</h1>
        <p className="text-gray-600 mb-8">{error || 'الكتاب غير موجود أو غير متاح حالياً'}</p>
        <Button onClick={() => navigate('/books')}>
          العودة إلى قائمة الكتب
        </Button>
      </div>
    );
  }
  
  // توليد صفحات الكتاب الوهمية
  const generatePageSrc = (pageNumber: number) => {
    if (pageNumber === 1) {
      return book.cover_url || `https://source.unsplash.com/random/800x1200?book&sig=${pageNumber}`;
    }
    return `https://source.unsplash.com/random/800x1200?book,page&sig=${book.id}-${pageNumber}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white relative">
      {/* شريط الأدوات العلوي */}
      <div className="flex justify-between items-center p-4 bg-gray-800 shadow-md">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/books')} className="mr-2">
            <Home className="h-5 w-5" />
          </Button>
          <Button variant="ghost" onClick={() => navigate(`/book/${id}`)}>
            <ChevronLeft className="h-5 w-5 ml-1" />
            <span className="hidden sm:inline">العودة إلى صفحة الكتاب</span>
          </Button>
        </div>
        
        <div className="text-center flex-1">
          <h1 className="text-lg sm:text-xl font-bold truncate max-w-xs sm:max-w-sm mx-auto">
            {book.title}
          </h1>
        </div>
        
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost">
                <Book className="h-5 w-5 ml-1" />
                <span className="hidden sm:inline">الفهرس</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>فهرس الكتاب</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <ul className="space-y-2">
                  {bookIndex.map((item, index) => (
                    <li key={index}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => goToIndexPage(item.page)}
                      >
                        <span className="ml-2 text-primary">{item.page}</span>
                        <span>{item.title}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </SheetContent>
          </Sheet>
          
          <Button variant="ghost" onClick={() => navigate(`/books`)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* محتوى الكتاب */}
      <div className="flex-1 overflow-hidden relative bg-gray-800 flex flex-col">
        {/* صفحات الكتاب */}
        <div 
          ref={bookContainerRef}
          className="flex-1 flex justify-center items-center overflow-auto p-4 relative"
        >
          <div
            className="relative bg-white shadow-xl rounded-sm transition-all duration-300"
            style={{
              width: `${zoom}%`,
              maxWidth: '100%',
              aspectRatio: '3/4',
            }}
          >
            <img
              src={generatePageSrc(currentPage)}
              alt={`صفحة ${currentPage}`}
              className="w-full h-full object-cover rounded-sm"
            />
            
            {/* ترويسة الصفحة */}
            <div className="absolute top-4 left-4 right-4 flex justify-between text-gray-800 bg-white/70 rounded p-2 text-sm">
              <span>{book.author}</span>
              <span>{currentPage}</span>
            </div>
            
            {/* إذا كانت آخر صفحة في المعاينة، أظهر إشعار شراء */}
            {isPreview && currentPage === 4 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
                  <h3 className="text-xl font-bold text-primary mb-2">انتهت المعاينة</h3>
                  <p className="text-gray-600 mb-4">
                    لقراءة الكتاب كاملاً، يرجى شراؤه
                  </p>
                  <Button 
                    onClick={() => navigate(`/book/${id}`)}
                    className="bg-secondary hover:bg-secondary-light"
                  >
                    اشتري الآن
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* أزرار التنقل بين الصفحات */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full h-12 w-12"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full h-12 w-12"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ArrowRight className="h-6 w-6" />
          </Button>
        </div>
        
        {/* شريط التحكم السفلي */}
        <div className="p-3 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              disabled={zoom <= 50}
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            <div className="w-32">
              <Slider
                value={[zoom]}
                min={50}
                max={150}
                step={5}
                onValueChange={handleZoomChange}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              disabled={zoom >= 150}
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
            <span className="text-sm ml-2">{zoom}%</span>
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="flex border rounded overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 rounded-none border-l"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
              <div className="flex items-center px-3 bg-gray-700">
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
                  className="w-12 bg-transparent text-center text-white"
                />
                <span className="mx-1">/</span>
                <span>{totalPages}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 rounded-none border-r"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            
            <Button variant="ghost" size="sm">
              <Bookmark className="h-4 w-4 ml-1" />
              <span className="hidden sm:inline">إضافة إشارة مرجعية</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookReader;
