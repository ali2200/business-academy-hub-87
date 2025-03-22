
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Save, 
  X, 
  PlusCircle,
  Image,
  Video,
  Link as LinkIcon,
  RefreshCw,
  CheckSquare
} from 'lucide-react';
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { ContentItem } from '@/hooks/use-content';

// Define types for content items
type ContentType = 'text' | 'image' | 'video' | 'link';

// Group content items by section
interface GroupedContent {
  [section: string]: ContentItem[];
}

const ContentManagement = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [groupedContent, setGroupedContent] = useState<GroupedContent>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('homepage');
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [newItemFormVisible, setNewItemFormVisible] = useState(false);
  const [newItem, setNewItem] = useState({
    section: '',
    key: '',
    content_type: 'text' as ContentType,
    content: ''
  });

  // Fetch content from database
  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .order('section', { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        setContentItems(data as ContentItem[]);
        
        // Group content by section
        const grouped = data.reduce((acc: GroupedContent, item: ContentItem) => {
          if (!acc[item.section]) {
            acc[item.section] = [];
          }
          acc[item.section].push(item);
          return acc;
        }, {});
        
        setGroupedContent(grouped);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('فشل في تحميل المحتوى');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Handle updating content item
  const handleUpdateContent = async () => {
    if (!editingItem) return;

    try {
      const { error } = await supabase
        .from('website_content')
        .update({
          content: editingItem.content,
          content_type: editingItem.content_type,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingItem.id);

      if (error) {
        throw error;
      }

      toast.success('تم تحديث المحتوى بنجاح');
      fetchContent();
      setEditFormVisible(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('فشل في تحديث المحتوى');
    }
  };

  // Handle adding new content item
  const handleAddContent = async () => {
    try {
      if (!newItem.section || !newItem.key || !newItem.content) {
        toast.error('جميع الحقول مطلوبة');
        return;
      }

      const { error } = await supabase
        .from('website_content')
        .insert([{
          section: newItem.section,
          key: newItem.key,
          content_type: newItem.content_type,
          content: newItem.content
        }]);

      if (error) {
        throw error;
      }

      toast.success('تم إضافة المحتوى بنجاح');
      fetchContent();
      setNewItemFormVisible(false);
      setNewItem({
        section: '',
        key: '',
        content_type: 'text',
        content: ''
      });
    } catch (error) {
      console.error('Error adding content:', error);
      toast.error('فشل في إضافة المحتوى');
    }
  };

  // Handle deleting content item
  const handleDeleteContent = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المحتوى؟')) return;

    try {
      const { error } = await supabase
        .from('website_content')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('تم حذف المحتوى بنجاح');
      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('فشل في حذف المحتوى');
    }
  };

  // Render content item card
  const renderContentItem = (item: ContentItem) => {
    return (
      <Card key={item.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-base">{item.key}</CardTitle>
              <CardDescription>{getContentTypeLabel(item.content_type as ContentType)}</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setEditingItem(item);
                setEditFormVisible(true);
              }}
            >
              تعديل
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {renderContentPreview(item)}
        </CardContent>
      </Card>
    );
  };

  // Get label for content type
  const getContentTypeLabel = (type: ContentType) => {
    switch (type) {
      case 'text': return 'نص';
      case 'image': return 'صورة';
      case 'video': return 'فيديو';
      case 'link': return 'رابط';
      default: return type;
    }
  };

  // Render content preview based on type
  const renderContentPreview = (item: ContentItem) => {
    const contentType = item.content_type as ContentType;
    switch (contentType) {
      case 'text':
        return <p className="text-sm break-words">{item.content}</p>;
      case 'image':
        return (
          <div className="relative h-32 w-full overflow-hidden rounded-md">
            <img 
              src={item.content} 
              alt={item.key} 
              className="h-full w-full object-contain"
            />
          </div>
        );
      case 'video':
        return (
          <div className="relative h-32 w-full overflow-hidden rounded-md">
            <video 
              src={item.content}
              className="h-full w-full object-contain"
              controls
            />
          </div>
        );
      case 'link':
        return (
          <a 
            href={item.content} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-words"
          >
            {item.content}
          </a>
        );
      default:
        return <p className="text-sm">{item.content}</p>;
    }
  };

  // Get sections for current active tab
  const getTabSections = () => {
    switch (activeTab) {
      case 'homepage':
        return ['hero', 'about', 'features', 'testimonials', 'cta'];
      case 'courses':
        return ['courses_page', 'course_detail'];
      case 'books':
        return ['books_page', 'book_detail'];
      default:
        return Object.keys(groupedContent);
    }
  };

  // Create edit form for content
  const renderEditForm = () => {
    if (!editingItem) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>تعديل المحتوى</CardTitle>
            <CardDescription>
              قسم: {editingItem.section} | مفتاح: {editingItem.key}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">نوع المحتوى</label>
                  <Select
                    value={editingItem.content_type}
                    onValueChange={(value: string) => setEditingItem({
                      ...editingItem,
                      content_type: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع المحتوى" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">نص</SelectItem>
                      <SelectItem value="image">صورة</SelectItem>
                      <SelectItem value="video">فيديو</SelectItem>
                      <SelectItem value="link">رابط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">المحتوى</label>
                {editingItem.content_type === 'text' ? (
                  <Textarea
                    value={editingItem.content}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      content: e.target.value
                    })}
                    rows={5}
                    className="mt-1"
                  />
                ) : (
                  <Input
                    value={editingItem.content}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      content: e.target.value
                    })}
                    className="mt-1"
                    dir={editingItem.content_type !== 'text' ? 'ltr' : 'rtl'}
                  />
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setEditFormVisible(false);
                setEditingItem(null);
              }}
            >
              <X className="ml-2 h-4 w-4" />
              إلغاء
            </Button>
            <Button onClick={handleUpdateContent}>
              <Save className="ml-2 h-4 w-4" />
              حفظ التغييرات
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  // Create form for adding new content
  const renderNewItemForm = () => {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>إضافة محتوى جديد</CardTitle>
            <CardDescription>
              أضف عنصر محتوى جديد للموقع
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">القسم</label>
                  <Input
                    value={newItem.section}
                    onChange={(e) => setNewItem({
                      ...newItem,
                      section: e.target.value
                    })}
                    placeholder="مثال: hero، about"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">المفتاح</label>
                  <Input
                    value={newItem.key}
                    onChange={(e) => setNewItem({
                      ...newItem,
                      key: e.target.value
                    })}
                    placeholder="مثال: title، description"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">نوع المحتوى</label>
                <Select
                  value={newItem.content_type}
                  onValueChange={(value: string) => setNewItem({
                    ...newItem,
                    content_type: value as ContentType
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع المحتوى" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">نص</SelectItem>
                    <SelectItem value="image">صورة</SelectItem>
                    <SelectItem value="video">فيديو</SelectItem>
                    <SelectItem value="link">رابط</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">المحتوى</label>
                {newItem.content_type === 'text' ? (
                  <Textarea
                    value={newItem.content}
                    onChange={(e) => setNewItem({
                      ...newItem,
                      content: e.target.value
                    })}
                    rows={5}
                    className="mt-1"
                  />
                ) : (
                  <Input
                    value={newItem.content}
                    onChange={(e) => setNewItem({
                      ...newItem,
                      content: e.target.value
                    })}
                    className="mt-1"
                    dir={newItem.content_type !== 'text' ? 'ltr' : 'rtl'}
                    placeholder={
                      newItem.content_type === 'image' ? 'رابط الصورة' :
                      newItem.content_type === 'video' ? 'رابط الفيديو' :
                      newItem.content_type === 'link' ? 'الرابط' : ''
                    }
                  />
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setNewItemFormVisible(false);
                setNewItem({
                  section: '',
                  key: '',
                  content_type: 'text',
                  content: ''
                });
              }}
            >
              <X className="ml-2 h-4 w-4" />
              إلغاء
            </Button>
            <Button onClick={handleAddContent}>
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة محتوى
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">إدارة محتوى الموقع</h1>
          <p className="text-gray-500">تعديل النصوص والصور والروابط في الموقع</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchContent}>
            <RefreshCw className="ml-2 h-4 w-4" />
            تحديث
          </Button>
          <Button onClick={() => setNewItemFormVisible(true)}>
            <PlusCircle className="ml-2 h-4 w-4" />
            إضافة محتوى
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="homepage">الصفحة الرئيسية</TabsTrigger>
          <TabsTrigger value="courses">الدورات</TabsTrigger>
          <TabsTrigger value="books">الكتب</TabsTrigger>
          <TabsTrigger value="other">محتوى آخر</TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="text-center py-10">
            <RefreshCw className="h-10 w-10 animate-spin mx-auto text-gray-400" />
            <p className="mt-4 text-gray-500">جاري تحميل المحتوى...</p>
          </div>
        ) : (
          <>
            {getTabSections().map(section => {
              const sectionContent = groupedContent[section] || [];
              return sectionContent.length > 0 ? (
                <div key={section} className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 border-b pb-2">{section}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sectionContent.map(item => renderContentItem(item))}
                  </div>
                </div>
              ) : null;
            })}

            {getTabSections().every(section => !groupedContent[section] || groupedContent[section].length === 0) && (
              <div className="text-center py-10">
                <FileText className="h-10 w-10 mx-auto text-gray-400" />
                <p className="mt-4 text-gray-500">لا يوجد محتوى في هذا القسم</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setNewItemFormVisible(true)}
                >
                  <PlusCircle className="ml-2 h-4 w-4" />
                  إضافة محتوى
                </Button>
              </div>
            )}
          </>
        )}
      </Tabs>

      {editFormVisible && renderEditForm()}
      {newItemFormVisible && renderNewItemForm()}
    </div>
  );
};

export default ContentManagement;
