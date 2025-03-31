
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArticleStatus } from './ArticlesTable';
import RichTextEditor from '@/components/RichTextEditor';

interface ArticleFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: ArticleStatus;
  tags: string[];
  featured_image: string;
}

interface ArticleFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  formData: ArticleFormData;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleTagsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleContentChange: (content: string) => void;
  handleSubmit: () => void;
  submitButtonText: string;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  formData,
  activeTab,
  setActiveTab,
  handleTitleChange,
  handleInputChange,
  handleTagsChange,
  handleStatusChange,
  handleContentChange,
  handleSubmit,
  submitButtonText
}) => {
  const idPrefix = title.includes('تعديل') ? 'edit-' : '';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="editor">محرر المقال</TabsTrigger>
            <TabsTrigger value="settings">إعدادات المقال</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="space-y-4 overflow-y-auto max-h-[60vh]">
            <div className="grid gap-2">
              <Label htmlFor={`${idPrefix}title`}>عنوان المقال *</Label>
              <Input
                id={`${idPrefix}title`}
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="أدخل عنوان المقال"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor={`${idPrefix}content`}>محتوى المقال *</Label>
              <RichTextEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="أدخل محتوى المقال"
                rows={16}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4 overflow-y-auto max-h-[60vh]">
            <div className="grid gap-2">
              <Label htmlFor={`${idPrefix}slug`}>الرابط الدائم *</Label>
              <Input
                id={`${idPrefix}slug`}
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="مثال: my-article-title"
                required
              />
              <p className="text-xs text-gray-500">
                سيظهر المقال على الرابط: /articles/{formData.slug}
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor={`${idPrefix}excerpt`}>مقتطف المقال</Label>
              <Textarea
                id={`${idPrefix}excerpt`}
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="مقتطف قصير يظهر في القوائم وصفحات البحث"
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor={`${idPrefix}tags`}>التصنيفات</Label>
              <Input
                id={`${idPrefix}tags`}
                name="tags"
                value={formData.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="أدخل التصنيفات مفصولة بفواصل (مثال: تعليم, تكنولوجيا)"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor={`${idPrefix}featured_image`}>رابط الصورة المميزة</Label>
              <Input
                id={`${idPrefix}featured_image`}
                name="featured_image"
                value={formData.featured_image}
                onChange={handleInputChange}
                placeholder="أدخل رابط الصورة المميزة"
              />
              {formData.featured_image && (
                <div className="mt-2">
                  <img 
                    src={formData.featured_image} 
                    alt="صورة المقال" 
                    className="max-h-40 border rounded p-1"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor={`${idPrefix}status`}>حالة المقال</Label>
              <select
                id={`${idPrefix}status`}
                name="status"
                value={formData.status}
                onChange={handleStatusChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="draft">مسودة</option>
                <option value="review">مراجعة</option>
                <option value="published">منشور</option>
              </select>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">إلغاء</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>{submitButtonText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleForm;
