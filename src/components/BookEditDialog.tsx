import React, { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Upload, FileText, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import RichTextEditor from '@/components/RichTextEditor';
import HtmlPreview from '@/components/HtmlPreview';

interface BookEditDialogProps {
  book: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookUpdated: () => void;
}

const CATEGORIES = [
  'مبيعات',
  'تسويق',
  'إدارة',
  'ريادة أعمال',
  'تطوير ذاتي',
];

const BookEditDialog: React.FC<BookEditDialogProps> = ({
  book,
  open,
  onOpenChange,
  onBookUpdated
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState({
    title: book.title || '',
    author: book.author || '',
    description: book.description || '',
    price: book.price || '',
    category: book.category || '',
    pages: book.pages || '',
    status: book.status || 'draft',
    currency: book.currency || 'EGP',
  });
  
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(book.cover_url);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(
    book.pdf_url ? book.pdf_url.split('/').pop() : null
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewContent, setPreviewContent] = useState(false);
  
  const coverInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setCoverFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setPdfFile(file);
      setPdfFileName(file.name);
    }
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
  };

  const removePdf = () => {
    setPdfFile(null);
    setPdfFileName(null);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.author || !formData.price) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // تحميل الملفات إلى التخزين (إذا تم تغييرها)
      let coverUrl = book.cover_url;
      let pdfUrl = book.pdf_url;
      
      // تحميل صورة الغ��اف الجديدة
      if (coverFile) {
        // إنشاء اسم فريد للملف
        const fileExt = coverFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        
        // تحميل الملف
        const { data: coverData, error: coverError } = await supabase.storage
          .from('book-covers')
          .upload(fileName, coverFile, {
            upsert: true,
            contentType: coverFile.type
          });
          
        if (coverError) {
          throw new Error(`فشل في تحميل صورة الغلاف: ${coverError.message}`);
        }
        
        // الحصول على URL العام
        const { data: coverPublicUrl } = supabase.storage
          .from('book-covers')
          .getPublicUrl(fileName);
          
        coverUrl = coverPublicUrl.publicUrl;
      } else if (coverPreview === null && book.cover_url) {
        // إذا تم إزالة الصورة، قم بحذفها من التخزين
        const coverPath = book.cover_url.split('/').pop();
        if (coverPath) {
          await supabase.storage
            .from('book-covers')
            .remove([coverPath]);
        }
        coverUrl = null;
      }
      
      // تحميل ملف PDF الجديد
      if (pdfFile) {
        // إنشاء اسم فريد للملف
        const fileExt = pdfFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        
        // تحميل الملف
        const { data: pdfData, error: pdfError } = await supabase.storage
          .from('book-files')
          .upload(fileName, pdfFile, {
            upsert: true,
            contentType: pdfFile.type
          });
          
        if (pdfError) {
          throw new Error(`فشل في تحميل ملف PDF: ${pdfError.message}`);
        }
        
        // الحصول على URL العام
        const { data: pdfPublicUrl } = supabase.storage
          .from('book-files')
          .getPublicUrl(fileName);
          
        pdfUrl = pdfPublicUrl.publicUrl;
      } else if (pdfFileName === null && book.pdf_url) {
        // إذا تم إزالة الملف، قم بحذفه من التخزين
        const pdfPath = book.pdf_url.split('/').pop();
        if (pdfPath) {
          await supabase.storage
            .from('book-files')
            .remove([pdfPath]);
        }
        pdfUrl = null;
      }
      
      // تحديث بيانات الكتاب في قاعدة البيانات
      const { error: updateError } = await supabase
        .from('books')
        .update({
          title: formData.title,
          author: formData.author,
          description: formData.description,
          price: parseFloat(formData.price.toString()),
          category: formData.category,
          pages: formData.pages ? parseInt(formData.pages.toString()) : null,
          status: formData.status,
          currency: formData.currency,
          cover_url: coverUrl,
          pdf_url: pdfUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', book.id);
      
      if (updateError) {
        throw new Error(`فشل في تحديث الكتاب: ${updateError.message}`);
      }
      
      toast.success('تم تحديث الكتاب بنجاح');
      onBookUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error(error instanceof Error ? error.message : 'حدث خطأ أثناء تحديث الكتاب');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">تعديل الكتاب</DialogTitle>
          <DialogDescription>
            تعديل معلومات وملفات الكتاب
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="details">تفاصيل الكتاب</TabsTrigger>
            <TabsTrigger value="files">الملفات</TabsTrigger>
            <TabsTrigger value="description">الوصف</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان الكتاب *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="عنوان الكتاب"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">اسم المؤلف *</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="اسم المؤلف"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">الفئة</Label>
                <Select 
                  value={formData.category || "none"}
                  onValueChange={(value) => handleSelectChange('category', value === "none" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر فئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">بدون فئة</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">السعر *</Label>
                <div className="flex">
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                  />
                  <Select 
                    value={formData.currency}
                    onValueChange={(value) => handleSelectChange('currency', value)}
                  >
                    <SelectTrigger className="w-24 mr-2">
                      <SelectValue placeholder="العملة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EGP">ج.م</SelectItem>
                      <SelectItem value="USD">$</SelectItem>
                      <SelectItem value="EUR">€</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pages">عدد الصفحات</Label>
                <Input
                  id="pages"
                  name="pages"
                  type="number"
                  value={formData.pages}
                  onChange={handleInputChange}
                  placeholder="عدد الصفحات"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">الحالة</Label>
                <Select 
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">مسودة</SelectItem>
                    <SelectItem value="review">مراجعة</SelectItem>
                    <SelectItem value="published">منشور</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="files" className="space-y-6">
            {/* صورة الغلاف */}
            <div className="space-y-2">
              <Label>صورة الغلاف</Label>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  {/* معاينة الصورة */}
                  {coverPreview && (
                    <div className="relative w-36 h-48 bg-white rounded-lg overflow-hidden border">
                      <img 
                        src={coverPreview} 
                        alt="معاينة الغلاف" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeCover}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                        title="إزالة الصورة"
                      >
                        <X size={16} className="text-red-500" />
                      </button>
                    </div>
                  )}
                  
                  {/* زر تحميل الصورة */}
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={coverInputRef}
                      onChange={handleCoverChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => coverInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="ml-2 h-4 w-4" />
                      {coverPreview ? 'تغيير الصورة' : 'تحميل صورة الغلاف'}
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      يفضل صورة بنسبة 3:4 بدقة جيدة وحجم لا يتجاوز 2 ميجابايت
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* ملف الكتاب */}
            <div className="space-y-2">
              <Label>ملف الكتاب (PDF)</Label>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  {/* معلومات الملف */}
                  {pdfFileName && (
                    <div className="relative flex items-center p-3 bg-white rounded-lg overflow-hidden border flex-1">
                      <FileText className="h-8 w-8 text-primary ml-3" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{pdfFileName}</p>
                        <p className="text-xs text-gray-500">
                          {book.pdf_url ? 'ملف تم تحميله مسبقًا' : 'ملف جديد'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removePdf}
                        className="mr-2 text-red-500"
                        title="إزالة الملف"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                  
                  {/* زر تحميل الملف */}
                  {!pdfFileName && (
                    <div className="flex-1 w-full">
                      <input
                        type="file"
                        ref={pdfInputRef}
                        onChange={handlePdfChange}
                        accept=".pdf"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => pdfInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="ml-2 h-4 w-4" />
                        تحميل ملف الكتاب (PDF)
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        يرجى تحميل الكتاب بصيغة PDF. الحجم الأقصى هو 50 ميجابايت.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="description" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="description">وصف الكتاب</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => setPreviewContent(!previewContent)}
                className="text-xs"
              >
                {previewContent ? 'تحرير' : 'معاينة'}
              </Button>
            </div>
            
            {previewContent ? (
              <HtmlPreview 
                htmlContent={formData.description} 
                visible={true} 
                maxHeight="300px"
              />
            ) : (
              <RichTextEditor
                value={formData.description}
                onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                placeholder="أدخل وصف الكتاب هنا..."
                rows={12}
              />
            )}
            
            <p className="text-xs text-gray-500">
              يمكنك استخدام تنسيق النص والصور لجعل وصف الكتاب أكثر جاذبية.
            </p>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            إلغاء
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookEditDialog;
