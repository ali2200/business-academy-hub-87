
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  ExternalLink,
  Check
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import HtmlPreview from '@/components/HtmlPreview';

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
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const handleOpenBookReader = () => {
    onOpenChange(false); // Close the dialog first
    setTimeout(() => {
      navigate(`/book-reader/${book.id}`);
    }, 100);
  };

  const handleOpenBookPage = () => {
    onOpenChange(false); // Close the dialog first
    setTimeout(() => {
      navigate(`/book/${book.id}`);
    }, 100);
  };

  // التأكد من أن كل هذه الحقول صالحة كمصفوفات، حتى لو كانت null أو undefined
  const whatYouWillLearn = Array.isArray(book.what_you_will_learn) 
    ? book.what_you_will_learn 
    : (book.what_you_will_learn ? JSON.parse(book.what_you_will_learn) : []);

  const benefits = Array.isArray(book.benefits) 
    ? book.benefits 
    : (book.benefits ? JSON.parse(book.benefits) : []);

  const targetAudience = Array.isArray(book.target_audience) 
    ? book.target_audience 
    : (book.target_audience ? JSON.parse(book.target_audience) : []);

  const tableOfContents = Array.isArray(book.table_of_contents) 
    ? book.table_of_contents 
    : (book.table_of_contents ? JSON.parse(book.table_of_contents) : []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">تفاصيل الكتاب</DialogTitle>
          <DialogDescription>
            عرض معلومات الكتاب الكاملة
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* صورة الكتاب وتفاصيل أساسية */}
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
                  book.status === 'published' ? 'default' : 
                  book.status === 'draft' ? 'outline' : 'secondary'
                }
              >
                {book.status === 'published' ? 'منشور' : 
                book.status === 'draft' ? 'مسودة' : 'مراجعة'}
              </Badge>
            </div>
            
            <Card className="w-full mt-4">
              <CardContent className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">السعر:</span>
                  <span className="font-bold text-secondary">{book.price} {book.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">الصيغة:</span>
                  <span>{book.pdf_url ? 'كتاب إلكتروني + نسخة PDF' : 'كتاب إلكتروني'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">عدد الصفحات:</span>
                  <span>{book.pages || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">تاريخ النشر:</span>
                  <span>{book.publish_date || formatDate(book.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">الإتاحة:</span>
                  <span className="text-green-500">{book.availability || 'متوفر'}</span>
                </div>
              </CardContent>
            </Card>
            
            {book.pdf_url && (
              <Button 
                variant="outline" 
                className="mt-2 w-full"
                onClick={handleOpenBookReader}
              >
                <BookOpen className="ml-2 h-4 w-4" />
                فتح قارئ الكتاب
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="mt-2 w-full"
              onClick={handleOpenBookPage}
            >
              <ExternalLink className="ml-2 h-4 w-4" />
              عرض صفحة الكتاب
            </Button>
          </div>
          
          {/* تفاصيل الكتاب المُفصلة */}
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold text-primary mb-1">{book.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
            
            {/* قسم الوصف */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">الوصف</h3>
              {book.description ? (
                <HtmlPreview 
                  htmlContent={book.description} 
                  visible={true} 
                  className="prose prose-sm max-w-none" 
                />
              ) : (
                <p className="text-gray-700">لا يوجد وصف متاح</p>
              )}
            </div>
            
            {/* ما ستتعلمه */}
            {whatYouWillLearn && whatYouWillLearn.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 text-primary">ما ستتعلمه</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {whatYouWillLearn.map((item: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <Check size={18} className="text-green-500 mt-1 ml-2 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* الفئة المستهدفة */}
            {targetAudience && targetAudience.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 text-primary">الفئة المستهدفة</h3>
                <ul className="space-y-2">
                  {targetAudience.map((audience: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2 ml-3 flex-shrink-0"></div>
                      <span className="text-sm">{audience}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* المزايا */}
            {benefits && benefits.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 text-primary">مميزات الكتاب</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {benefits.map((benefit: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <Check size={18} className="text-green-500 mt-1 ml-2 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* محتويات الكتاب */}
            {tableOfContents && tableOfContents.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 text-primary">محتويات الكتاب</h3>
                <div className="space-y-3">
                  {tableOfContents.map((chapter: any, chapterIndex: number) => (
                    <div key={chapterIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-3">
                        <h4 className="font-bold text-primary">{chapter.title}</h4>
                      </div>
                      {chapter.sections && (
                        <div className="p-3">
                          <ul className="space-y-1">
                            {chapter.sections.map((section: string, sectionIndex: number) => (
                              <li key={sectionIndex} className="flex items-center p-1 border-b last:border-0 border-gray-100">
                                <div className="h-2 w-2 bg-secondary rounded-full ml-3"></div>
                                <span className="text-sm">{section}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
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
