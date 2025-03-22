
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, FileUp, PlusCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

type ContentType = 'article' | 'book' | 'course';

interface AddContentDialogProps {
  contentType: ContentType;
  onAdd?: (data: any) => void;
  trigger?: React.ReactNode;
}

const AddContentDialog: React.FC<AddContentDialogProps> = ({ 
  contentType, 
  onAdd,
  trigger
}) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'import'>('basic');
  const [loading, setLoading] = useState(false);

  const contentTypeMap = {
    article: {
      title: 'مقال',
      importLabel: 'استيراد من HTML',
      successMessage: 'تم إنشاء مسودة مقال جديد',
      successDescription: 'يمكنك الآن كتابة المقال'
    },
    book: {
      title: 'كتاب',
      importLabel: 'استيراد من PDF',
      successMessage: 'تم إنشاء مسودة كتاب جديد',
      successDescription: 'يمكنك الآن إضافة محتوى الكتاب'
    },
    course: {
      title: 'دورة',
      importLabel: 'استيراد من ملف',
      successMessage: 'تم إنشاء مسودة دورة جديدة',
      successDescription: 'يمكنك الآن إضافة محتوى الدورة'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('يرجى إدخال العنوان');
      return;
    }
    
    setLoading(true);
    
    try {
      let newContent;
      
      // Create the appropriate content based on type
      if (contentType === 'article') {
        const { data, error } = await supabase
          .from('articles')
          .insert({
            title,
            excerpt: description,
            content: activeTab === 'import' ? htmlContent : '<p>محتوى المقال</p>',
            status: 'draft'
          })
          .select();
          
        if (error) throw error;
        newContent = data[0];
        
      } else if (contentType === 'book') {
        const { data, error } = await supabase
          .from('books')
          .insert({
            title,
            author: 'المؤلف',
            description,
            price: 0,
            status: 'draft'
          })
          .select();
          
        if (error) throw error;
        newContent = data[0];
        
      } else if (contentType === 'course') {
        const { data, error } = await supabase
          .from('courses')
          .insert({
            title,
            instructor: 'المدرب',
            description,
            price: 0,
            currency: 'EGP',
            status: 'draft'
          })
          .select();
          
        if (error) throw error;
        newContent = data[0];
      }
      
      // Show success toast
      toast.success(contentTypeMap[contentType].successMessage, {
        description: contentTypeMap[contentType].successDescription
      });
      
      // Call the onAdd callback if provided
      if (onAdd) {
        onAdd(newContent);
      }
      
      // Reset form and close dialog
      setTitle('');
      setDescription('');
      setHtmlContent('');
      setActiveTab('basic');
      setOpen(false);
      
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error(`حدث خطأ أثناء إنشاء ${contentTypeMap[contentType].title}`);
    } finally {
      setLoading(false);
    }
  };

  const handleHtmlImport = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const html = e.target.value;
    setHtmlContent(html);
    
    // Extract title from HTML if possible
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1] && !title) {
      setTitle(titleMatch[1]);
    }
    
    // Try to extract content from body
    const bodyMatch = html.match(/<body>(.*?)<\/body>/is);
    if (bodyMatch && bodyMatch[1] && !description) {
      // Get first paragraph or few sentences for description
      const textContent = bodyMatch[1].replace(/<[^>]*>/g, ' ').trim();
      setDescription(textContent.substring(0, 150) + (textContent.length > 150 ? '...' : ''));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-primary hover:bg-primary/90">
            <PlusCircle className="ml-2 h-4 w-4" />
            إضافة {contentTypeMap[contentType].title} جديد
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>إضافة {contentTypeMap[contentType].title} جديد</DialogTitle>
          <DialogDescription>
            قم بإدخال المعلومات الأساسية لإنشاء {contentTypeMap[contentType].title} جديد.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'basic' | 'import')} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">إنشاء جديد</TabsTrigger>
            <TabsTrigger value="import">
              {contentTypeMap[contentType].importLabel}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">العنوان</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`عنوان ال${contentTypeMap[contentType].title}`}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={`اكتب وصفًا مختصرًا لل${contentTypeMap[contentType].title}`}
                  rows={4}
                />
              </div>
              
              <DialogFooter className="mt-6">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'جاري الإنشاء...' : `إنشاء ${contentTypeMap[contentType].title}`}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="import">
            <div className="space-y-4 pt-4">
              {contentType === 'article' && (
                <div className="space-y-2">
                  <Label htmlFor="html-content">محتوى HTML</Label>
                  <Textarea
                    id="html-content"
                    value={htmlContent}
                    onChange={handleHtmlImport}
                    placeholder="ضع كود HTML هنا..."
                    rows={10}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    قم بنسخ محتوى HTML للمقال هنا وسيتم استخراج العنوان والمحتوى تلقائيًا.
                  </p>
                </div>
              )}
              
              {contentType !== 'article' && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold">
                    اضغط لتحميل ملف أو اسحب وأفلت
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {contentType === 'book' ? 'PDF، EPUB' : 'ZIP، MP4، PDF'}
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => toast.info("ميزة التحميل قيد التطوير", {
                      description: "سيتم إضافة هذه الميزة قريبًا"
                    })}
                  >
                    <FileUp className="ml-2 h-4 w-4" />
                    اختر ملف
                  </Button>
                </div>
              )}
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="import-title">العنوان</Label>
                <Input
                  id="import-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`عنوان ال${contentTypeMap[contentType].title}`}
                  required
                />
              </div>
              
              <DialogFooter className="mt-6">
                <Button 
                  onClick={handleSubmit} 
                  className="w-full"
                  disabled={contentType !== 'article' && true || loading}
                >
                  {loading ? 'جاري الإنشاء...' : `استيراد ${contentTypeMap[contentType].title}`}
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddContentDialog;
