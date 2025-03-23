import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  PenTool, 
  Search, 
  PlusCircle, 
  Eye, 
  Edit, 
  Trash2, 
  Image,
  FileVideo,
  Link as LinkIcon,
  File,
  RefreshCw,
  Filter,
  MoreHorizontal,
  Layout,
  FolderOpen
} from 'lucide-react';
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { supabase } from "@/integrations/supabase/client";

// Define the content item type
interface ContentItem {
  id: string;
  section: string;
  key: string;
  content: string;
  content_type: 'text' | 'image' | 'video' | 'link';
  created_at?: string;
  updated_at?: string;
}

interface ContentManagementProps {
  tab?: string;
}

const ADMIN_TABS = [
  { id: 'website-content', label: 'محتوى الموقع', icon: <PenTool className="h-4 w-4" /> },
  { id: 'pages', label: 'الصفحات', icon: <File className="h-4 w-4" /> },
  { id: 'media', label: 'الوسائط', icon: <Image className="h-4 w-4" /> },
];

const ContentManagement = ({ tab }: ContentManagementProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('website-content');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Form state for new content
  const [newContent, setNewContent] = useState({
    section: '',
    key: '',
    content: '',
    content_type: 'text' as 'text' | 'image' | 'video' | 'link'
  });

  // Set active tab based on URL path or query param or prop
  useEffect(() => {
    if (tab && ADMIN_TABS.some(t => t.id === tab)) {
      setActiveTab(tab);
      return;
    }
    
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    if (lastSegment === 'content-management') {
      // Default to website-content when on the main route
      setActiveTab('website-content');
    } else if (ADMIN_TABS.some(t => t.id === lastSegment)) {
      setActiveTab(lastSegment);
    }
    
    // Also check for query params if needed
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ADMIN_TABS.some(t => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location, tab]);

  // Load content from Supabase
  useEffect(() => {
    const fetchContent = async () => {
      if (activeTab !== 'website-content') return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('website_content')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setContentItems(data as ContentItem[]);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        toast.error('فشل في تحميل المحتوى');
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, [activeTab, refreshTrigger]);

  // Filter content based on search term and active tab
  const filteredContent = contentItems.filter(item => {
    const matchesSearch = 
      item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'website-content') {
      return matchesSearch;
    }
    
    return item.section === activeTab && matchesSearch;
  });

  // Get unique sections for tabs
  const sections = Array.from(new Set(contentItems.map(item => item.section)));

  // Handle adding new content
  const handleAddContent = async () => {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .insert([newContent])
        .select();
      
      if (error) {
        throw error;
      }
      
      toast.success('تمت إضافة المحتوى بنجاح');
      setIsAddDialogOpen(false);
      setRefreshTrigger(prev => prev + 1);
      setNewContent({
        section: '',
        key: '',
        content: '',
        content_type: 'text'
      });
    } catch (error) {
      console.error('Error adding content:', error);
      toast.error('فشل في إضافة المحتوى');
    }
  };

  // Handle updating content
  const handleUpdateContent = async () => {
    if (!selectedItem) return;
    
    try {
      const { error } = await supabase
        .from('website_content')
        .update({
          section: selectedItem.section,
          key: selectedItem.key,
          content: selectedItem.content,
          content_type: selectedItem.content_type,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedItem.id);
      
      if (error) {
        throw error;
      }
      
      toast.success('تم تحديث المحتوى بنجاح');
      setIsEditDialogOpen(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('فشل في تحديث المحتوى');
    }
  };

  // Handle deleting content
  const handleDeleteContent = async () => {
    if (!selectedItem) return;
    
    try {
      const { error } = await supabase
        .from('website_content')
        .delete()
        .eq('id', selectedItem.id);
      
      if (error) {
        throw error;
      }
      
      toast.success('تم حذف المحتوى بنجاح');
      setIsDeleteDialogOpen(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('فشل في حذف المحتوى');
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update the URL without a full page reload
    const newUrl = `/content-management/${value}`;
    window.history.pushState({}, '', newUrl);
  };

  // Render content type icon
  const renderContentTypeIcon = (type: 'text' | 'image' | 'video' | 'link') => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <FileVideo className="h-4 w-4" />;
      case 'link':
        return <LinkIcon className="h-4 w-4" />;
      case 'text':
      default:
        return <File className="h-4 w-4" />;
    }
  };

  // Render page header
  const renderPageHeader = () => {
    const tabData = ADMIN_TABS.find(tab => tab.id === activeTab);
    
    return (
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              إدارة {tabData?.label || 'المحتوى'}
            </h1>
            <p className="text-gray-600 mt-1">
              {activeTab === 'website-content' && 'تعديل محتوى الموقع من مكان واحد'}
              {activeTab === 'pages' && 'تحكم في صفحات الموقع الإلكتروني'}
              {activeTab === 'media' && 'إدارة ملفات الوسائط والصور المستخدمة في الموقع'}
            </p>
          </div>
          <Button
            onClick={() => navigate('/admin-dashboard')}
            variant="outline"
            className="flex items-center gap-2"
          >
            العودة للوحة التحكم
          </Button>
        </div>
      </header>
    );
  };

  // Render appropriate content for the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'website-content':
        return renderWebsiteContentTab();
      case 'pages':
        return (
          <div className="mt-4">
            <Button className="mb-4" onClick={() => navigate('/pages-management')}>
              فتح إدارة الصفحات التفصيلية
            </Button>
            <iframe 
              src="/pages-management" 
              className="w-full min-h-[600px] border border-gray-200 rounded-lg"
              title="إدارة الصفحات"
            />
          </div>
        );
      case 'media':
        return (
          <div className="mt-4">
            <Button className="mb-4" onClick={() => navigate('/media-management')}>
              فتح إدارة الوسائط التفصيلية
            </Button>
            <iframe 
              src="/media-management" 
              className="w-full min-h-[600px] border border-gray-200 rounded-lg"
              title="إدارة الوسائط"
            />
          </div>
        );
      default:
        return <div>يرجى اختيار قسم من الأقسام أعلاه</div>;
    }
  };

  // Render website content tab
  const renderWebsiteContentTab = () => {
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              إضافة محتوى جديد
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setRefreshTrigger(prev => prev + 1)}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              تحديث
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  تصفية
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>تصفية حسب النوع</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab('website-content')}>
                  الكل
                </DropdownMenuItem>
                {sections.map(section => (
                  <DropdownMenuItem 
                    key={section} 
                    onClick={() => setActiveTab(section)}
                  >
                    {section}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="بحث في المحتوى..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-right">
                <th className="px-4 py-3 text-sm font-medium text-gray-600">القسم</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">المفتاح</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">المحتوى</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">النوع</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">آخر تحديث</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    جاري التحميل...
                  </td>
                </tr>
              ) : filteredContent.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    لا توجد نتائج
                  </td>
                </tr>
              ) : (
                filteredContent.map(item => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Badge variant="outline">{item.section}</Badge>
                    </td>
                    <td className="px-4 py-3 font-medium">{item.key}</td>
                    <td className="px-4 py-3">
                      <div className="max-w-xs truncate">
                        {item.content_type === 'image' || item.content_type === 'video' ? (
                          <a
                            href={item.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            عرض الملف
                          </a>
                        ) : item.content_type === 'link' ? (
                          <a
                            href={item.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {item.content}
                          </a>
                        ) : (
                          item.content.length > 50
                            ? `${item.content.substring(0, 50)}...`
                            : item.content
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {renderContentTypeIcon(item.content_type)}
                        <span>
                          {item.content_type === 'text' ? 'نص' : 
                           item.content_type === 'image' ? 'صورة' : 
                           item.content_type === 'video' ? 'فيديو' : 'رابط'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {item.updated_at
                        ? new Date(item.updated_at).toLocaleDateString('ar-EG')
                        : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {renderPageHeader()}

        <Card className="mb-8">
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="mb-6 flex flex-wrap gap-2">
                {ADMIN_TABS.map(tab => (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                    {tab.icon}
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {renderTabContent()}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Add Content Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>إضافة محتوى جديد</DialogTitle>
            <DialogDescription>
              أضف محتوى جديد إلى الموقع الإلكتروني
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="section">القسم</Label>
              <Input
                id="section"
                placeholder="مثال: home, about, courses"
                value={newContent.section}
                onChange={(e) => setNewContent({...newContent, section: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="key">المفتاح</Label>
              <Input
                id="key"
                placeholder="مثال: title, description, video_url"
                value={newContent.key}
                onChange={(e) => setNewContent({...newContent, key: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content_type">نوع المحتوى</Label>
              <Select
                value={newContent.content_type}
                onValueChange={(value) => setNewContent({
                  ...newContent, 
                  content_type: value as 'text' | 'image' | 'video' | 'link'
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
            <div className="grid gap-2">
              <Label htmlFor="content">المحتوى</Label>
              <Textarea
                id="content"
                placeholder="أدخل المحتوى هنا..."
                value={newContent.content}
                onChange={(e) => setNewContent({...newContent, content: e.target.value})}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={handleAddContent}>إضافة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Content Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تعديل المحتوى</DialogTitle>
            <DialogDescription>
              قم بتعديل المحتوى الحالي
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-section">القسم</Label>
                <Input
                  id="edit-section"
                  value={selectedItem.section}
                  onChange={(e) => setSelectedItem({
                    ...selectedItem, 
                    section: e.target.value
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-key">المفتاح</Label>
                <Input
                  id="edit-key"
                  value={selectedItem.key}
                  onChange={(e) => setSelectedItem({
                    ...selectedItem, 
                    key: e.target.value
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-content-type">نوع المحتوى</Label>
                <Select
                  value={selectedItem.content_type}
                  onValueChange={(value) => setSelectedItem({
                    ...selectedItem, 
                    content_type: value as 'text' | 'image' | 'video' | 'link'
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">نص</SelectItem>
                    <SelectItem value="image">صورة</SelectItem>
                    <SelectItem value="video">فيديو</SelectItem>
                    <SelectItem value="link">رابط</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-content">المحتوى</Label>
                <Textarea
                  id="edit-content"
                  value={selectedItem.content}
                  onChange={(e) => setSelectedItem({
                    ...selectedItem, 
                    content: e.target.value
                  })}
                  rows={5}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={handleUpdateContent}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Content Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>حذف المحتوى</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذا المحتوى؟ هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteContent}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentManagement;
