
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  User, 
  Tag, 
  Clock, 
  Calendar, 
  DollarSign,
  ExternalLink
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface BookDetailsDialogProps {
  book: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookDetailsDialog: React.FC<BookDetailsDialogProps> = ({
  book,
  open,
  onOpenChange
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">تفاصيل الكتاب</DialogTitle>
          <DialogDescription>
            عرض معلومات الكتاب الكاملة
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* صورة الكتاب */}
          <div className="md:w-1/3 flex flex-col items-center">
            <div className="w-full max-w-[200px] aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              {book.cover_url ? (
                <img 
                  src={book.cover_url} 
                  alt={book.title} 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-200">
                  <BookOpen className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="mt-4 w-full">
              <Badge 
                className="w-full justify-center py-1"
                variant={
                  book.status === 'published' ? 'success' : 
                  book.status === 'draft' ? 'outline' : 'secondary'
                }
              >
                {book.status === 'published' ? 'منشور' : 
                book.status === 'draft' ? 'مسودة' : 'مراجعة'}
              </Badge>
            </div>
            
            {book.pdf_url && (
              <Button 
                variant="outline" 
                className="mt-2 w-full"
                onClick={() => window.open(`/book-reader/${book.id}`, '_blank')}
              >
                <BookOpen className="ml-2 h-4 w-4" />
                فتح قارئ الكتاب
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="mt-2 w-full"
              onClick={() => window.open(`/books/${book.id}`, '_blank')}
            >
              <ExternalLink className="ml-2 h-4 w-4" />
              عرض صفحة الكتاب
            </Button>
          </div>
          
          {/* تفاصيل الكتاب */}
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold text-primary mb-1">{book.title}</h2>
            
            <div className="space-y-4 mt-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-500 ml-2" />
                <div>
                  <p className="text-sm text-gray-500">المؤلف</p>
                  <p className="font-medium">{book.author}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Tag className="h-5 w-5 text-gray-500 ml-2" />
                <div>
                  <p className="text-sm text-gray-500">الفئة</p>
                  <p className="font-medium">{book.category || 'غير محدد'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-500 ml-2" />
                <div>
                  <p className="text-sm text-gray-500">السعر</p>
                  <p className="font-medium">{book.price} {book.currency}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-gray-500 ml-2" />
                <div>
                  <p className="text-sm text-gray-500">عدد الصفحات</p>
                  <p className="font-medium">{book.pages || 'غير محدد'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 ml-2" />
                <div>
                  <p className="text-sm text-gray-500">تاريخ الإضافة</p>
                  <p className="font-medium">{formatDate(book.created_at)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-500 ml-2" />
                <div>
                  <p className="text-sm text-gray-500">آخر تحديث</p>
                  <p className="font-medium">{formatDate(book.updated_at)}</p>
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="font-semibold text-lg mb-2">الوصف</h3>
              <p className="text-gray-700">{book.description || 'لا يوجد وصف متاح'}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">إغلاق</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailsDialog;
