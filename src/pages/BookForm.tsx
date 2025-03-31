import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Upload, 
  FileText,
  X, 
  ChevronLeft,
  Save,
  Eye
} from 'lucide-react';
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import RichTextEditor from '@/components/RichTextEditor';
import HtmlPreview from '@/components/HtmlPreview';

const CATEGORIES = [
  'مبيعات',
  'تسويق',
  'إدارة',
  'ريادة أعمال',
  'تطوير ذاتي',
];

const BookForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    category: '',
    pages: '',
    status: 'draft',
    currency: 'EGP',
  });
  
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  
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
      
      // تحميل الملفات إلى التخزين
      let coverUrl = null;
      let pdfUrl = null;
      
      // تحميل صورة الغلاف (إذا وجدت)
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
      }
      
      // تحميل ملف PDF (إذا وجد)
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
      }
      
      // إضافة الكتاب إلى قاعدة البيانات
      const { data, error } = await supabase
        .from('books')
        .insert([
          {
            title: formData.title,
            author: formData.author,
            description: formData.description,
            price: parseFloat(formData.price.toString()),
            category: formData.category || null,
            pages: formData.pages ? parseInt(formData.pages.toString()) : null,
            status: formData.status,
            currency: formData.currency,
            cover_url: coverUrl,
            pdf_url: pdfUrl,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select();
      
      if (error) {
        throw new Error(`فشل في إضافة الكتاب: ${error.message}`);
      }
      
      toast.success('تم إضافة الكتاب بنجاح');
      navigate('/books-management');
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error(error instanceof Error ? error.message : 'حدث خطأ أثناء إضافة الكتاب');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 p-0"
              onClick={() => navigate('/books-management')}
            >
              <ChevronLeft size={16} />
              <span>العودة إلى قائمة الكتب</span>
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold text-primary">إضافة كتاب جديد</h1>
          <p className="text-gray-600 mt-1">قم بإدخال معلومات الكتاب وتحميل الملفات اللازمة</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 sticky top-8">
              <h3 className="font-bold text-lg mb-4">معلومات الكتاب</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-1">العنوان</div>
                  <div className="text-gray-600 text-sm line-clamp-1">
                    {formData.title || 'لم يتم تحديده بعد'}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">المؤلف</div>
                  <div className="text-gray-600 text-sm line-clamp-1">
                    {formData.author || 'لم يتم تحديده بعد'}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">الفئة</div>
                  <div className="text-gray-600 text-sm">
                    {formData.category || 'لم يتم تحديدها بعد'}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">السعر</div>
                  <div className="text-gray-600 text-sm">
                    {formData.price ? `${formData.price} ${formData.currency}` : 'لم يتم تحديده بعد'}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <div className="text-sm font-medium mb-1">ملفات الكتاب</div>
                  <div className="text-gray-600 text-sm">
                    <div className="flex items-center gap-1 mb-1">
                      <span className={coverPreview ? 'text-green-500' : 'text-gray-400'}>
                        {coverPreview ? '✓' : '○'}
                      </span>
                      <span>صورة الغلاف</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={pdfFileName ? 'text-green-500' : 'text-gray-400'}>
                        {pdfFileName ? '✓' : '○'}
                      </span>
                      <span>ملف الكتاب PDF</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">الحالة</div>
                  <div className="text-gray-600 text-sm">
                    {formData.status === 'published' ? 'منشور' : 
                     formData.status === 'draft' ? 'مسودة' : 'مراجعة'}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  <Save className="ml-2 h-4 w-4" />
                  {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ الكتاب'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/books-management')}
                  disabled={isSubmitting}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle>معلومات الكتاب</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="details">البيانات الأساسية</TabsTrigger>
                    <TabsTrigger value="files">الملفات</TabsTrigger>
                    <TabsTrigger value="description">الوصف</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-6">
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
                                <p className="text-xs text-gray-500">ملف جديد</p>
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
                        className="text-xs flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookForm;
