
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, X, ShoppingCart } from 'lucide-react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

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
  
  // هذه مجرد صفحات عينة للعرض التوضيحي
  // في التطبيق الحقيقي، يجب جلب صفحات المعاينة من الخادم
  const previewPages = [
    {
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2574',
      content: 'صفحة العنوان - ' + book.title
    },
    {
      image: 'https://images.unsplash.com/photo-1456513080867-f24f120341e0?q=80&w=2574',
      content: 'مقدمة الكتاب - ' + book.title
    },
    {
      image: 'https://images.unsplash.com/photo-1471970394675-613138e45da3?q=80&w=2580',
      content: 'الفصل الأول - ' + book.title
    },
    {
      image: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?q=80&w=2670',
      content: 'نهاية المعاينة - ' + book.title
    }
  ];
  
  const totalPages = previewPages.length;
  
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
            هذه معاينة محدودة لمحتوى الكتاب. اشترِ الكتاب للوصول إلى المحتوى الكامل.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center my-4">
          <div className="relative w-full aspect-[3/4] max-h-[70vh] overflow-hidden rounded-lg border shadow mb-4">
            {/* صفحة الكتاب الحالية */}
            <div className="absolute inset-0 bg-gray-100">
              <img 
                src={previewPages[currentPage - 1].image}
                alt={`صفحة ${currentPage}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="p-6 bg-white/90 rounded-lg shadow-lg max-w-md text-center">
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    {previewPages[currentPage - 1].content}
                  </h3>
                  <p className="mb-4">
                    هذه معاينة محدودة فقط، لقراءة الكتاب كاملاً يرجى شراؤه.
                  </p>
                  {currentPage === totalPages && (
                    <Button onClick={handleBuy} className="bg-secondary hover:bg-secondary-light">
                      <ShoppingCart className="ml-2 h-4 w-4" />
                      اشتري الآن
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            {/* أزرار التنقل */}
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
