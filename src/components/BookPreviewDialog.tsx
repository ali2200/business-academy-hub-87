
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, X, ShoppingCart, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

interface BookPreviewDialogProps {
  book: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookPreviewDialog: React.FC<BookPreviewDialogProps> = ({
  book,
  open,
  onOpenChange
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfPages, setPdfPages] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // عدد صفحات المعاينة (3 صفحات)
  const MAX_PREVIEW_PAGES = 3;
  
  useEffect(() => {
    if (open && book?.pdf_url) {
      fetchPdfPreview();
    }
  }, [open, book]);
  
  const fetchPdfPreview = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // التحقق من وجود رابط للملف
      if (!book.pdf_url) {
        setError("لا يوجد ملف PDF لهذا الكتاب");
        setIsLoading(false);
        return;
      }
      
      // استخراج اسم الملف من الرابط
      const filename = book.pdf_url.split('/').pop();
      
      // تنزيل الملف من التخزين
      const { data: fileData, error: fileError } = await supabase
        .storage
        .from('books')
        .download(`pdfs/${filename}`);
      
      if (fileError) {
        console.error('Error downloading PDF:', fileError);
        setError("فشل في تحميل ملف PDF");
        setIsLoading(false);
        return;
      }
      
      // استخدام PDF.js لعرض معاينة الصفحات
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      
      const pdf = await pdfjsLib.getDocument(await fileData.arrayBuffer()).promise;
      const pageCount = pdf.numPages;
      
      // تحديد عدد الصفحات المتاحة للمعاينة (بحد أقصى 3 صفحات)
      const previewPagesCount = Math.min(pageCount, MAX_PREVIEW_PAGES);
      setTotalPages(previewPagesCount);
      
      // جلب معلومات الصفحات
      const pagesDataUrls: string[] = [];
      
      for (let i = 1; i <= previewPagesCount; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) {
          continue;
        }
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        pagesDataUrls.push(canvas.toDataURL('image/jpeg', 0.8));
      }
      
      setPdfPages(pagesDataUrls);
      setCurrentPage(1);
      
    } catch (err) {
      console.error('Error with PDF preview:', err);
      setError("حدث خطأ أثناء تحميل معاينة الكتاب");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleBuy = () => {
    onOpenChange(false);
    toast.success("تم إضافة الكتاب إلى سلة المشتريات", {
      description: "يمكنك متابعة عملية الشراء الآن",
      action: {
        label: "عرض السلة",
        onClick: () => console.log("Redirecting to cart"),
      },
    });
  };
  
  const handleFullScreen = () => {
    onOpenChange(false);
    navigate(`/book-reader/${book.id}?preview=true`);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-screen" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>معاينة الكتاب: {book.title}</span>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            هذه معاينة محدودة لمحتوى الكتاب ({MAX_PREVIEW_PAGES} صفحات). اشترِ الكتاب للوصول إلى المحتوى الكامل.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center my-4">
          <div className="relative w-full aspect-[3/4] max-h-[70vh] overflow-hidden rounded-lg border shadow mb-4">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-gray-600">جاري تحميل معاينة الكتاب...</p>
                </div>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="p-6 bg-white/90 rounded-lg shadow-lg max-w-md text-center">
                  <h3 className="text-xl font-bold text-red-500 mb-4">
                    حدث خطأ
                  </h3>
                  <p className="mb-4 text-gray-700">
                    {error}
                  </p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-gray-100">
                {pdfPages.length > 0 ? (
                  <img 
                    src={pdfPages[currentPage - 1]}
                    alt={`صفحة ${currentPage}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">لا توجد صفحات متاحة للمعاينة</p>
                  </div>
                )}
                
                {currentPage === totalPages && (
                  <div className="absolute bottom-10 left-0 right-0 flex justify-center">
                    <div className="p-4 bg-white/90 rounded-lg shadow-lg max-w-md text-center">
                      <p className="mb-4">
                        انتهت المعاينة المجانية، لقراءة الكتاب كاملاً يرجى شراؤه.
                      </p>
                      <Button onClick={handleBuy} className="bg-secondary hover:bg-secondary-light">
                        <ShoppingCart className="ml-2 h-4 w-4" />
                        اشتري الآن
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* أزرار التنقل */}
            {!isLoading && !error && pdfPages.length > 0 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 rtl:space-x-reverse">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="rounded-full h-10 w-10 p-0"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <span className="p-2 bg-white/80 rounded-md">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="rounded-full h-10 w-10 p-0"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            معاينة صفحة {currentPage} من {totalPages}
          </div>
          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button variant="outline" onClick={handleFullScreen}>
              عرض في وضع ملء الشاشة
            </Button>
            <Button onClick={handleBuy} className="bg-secondary hover:bg-secondary-light">
              <ShoppingCart className="ml-2 h-4 w-4" />
              اشتري الآن
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookPreviewDialog;
