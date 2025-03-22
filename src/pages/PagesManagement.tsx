
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Edit,
  Trash2,
  PlusCircle,
  Eye,
  Save,
  X,
  Home,
  Layout,
  Image,
  Settings,
  Search,
  FilterX,
  Calendar,
  ExternalLink,
  Globe,
  RefreshCw
} from 'lucide-react';
import { toast } from "sonner";
import { Link } from 'react-router-dom';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table,
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { ContentItem } from '@/hooks/use-content';

// Extended interface for page
interface PageItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: "published" | "draft";
  lastUpdated: string;
  author?: string;
  template?: string;
  featured_image?: string;
}

const MOCK_PAGES: PageItem[] = [
  {
    id: "1",
    title: "الصفحة الرئيسية",
    slug: "home",
    content: "محتوى الصفحة الرئيسية",
    status: "published",
    lastUpdated: "2024/04/20",
    author: "منشور",
  },
  {
    id: "2",
    title: "من نحن",
    slug: "about",
    content: "محتوى صفحة من نحن",
    status: "published",
    lastUpdated: "2024/05/02",
    author: "منشور",
  },
  {
    id: "3",
    title: "اتصل بنا",
    slug: "contact",
    content: "محتوى صفحة اتصل بنا",
    status: "published",
    lastUpdated: "2024/04/20",
    author: "آخر تعديل",
  },
  {
    id: "4",
    title: "سياسة الخصوصية",
    slug: "privacy-policy",
    content: "محتوى صفحة سياسة الخصوصية",
    status: "draft",
    lastUpdated: "2025/03/13",
    author: "منشور",
  },
  {
    id: "5",
    title: "الخدمات",
    slug: "services",
    content: "محتوى صفحة الخدمات",
    status: "published",
    lastUpdated: "2025/03/13",
    author: "منشور",
  },
  {
    id: "6",
    title: "تواصل معنا",
    slug: "contact-us",
    content: "محتوى صفحة تواصل معنا",
    status: "published",
    lastUpdated: "2025/03/13",
    author: "منشور",
  },
  {
    id: "7",
    title: "ساعة الأعمال",
    slug: "business-hours",
    content: "محتوى صفحة ساعة الأعمال",
    status: "published",
    lastUpdated: "2025/03/20",
    author: "منشور",
  },
  {
    id: "8",
    title: "من نحن",
    slug: "about-us",
    content: "محتوى صفحة من نحن",
    status: "published",
    lastUpdated: "2025/03/13",
    author: "منشور",
  }
];

const PagesManagement = () => {
  const [pages, setPages] = useState<PageItem[]>(MOCK_PAGES);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("all");

  // Handle edit page
  const handleEditPage = (page: PageItem) => {
    setCurrentPage(page);
    setEditMode(true);
  };

  // Handle save page
  const handleSavePage = () => {
    if (!currentPage) return;

    const updatedPages = pages.map(page => 
      page.id === currentPage.id ? currentPage : page
    );
    
    setPages(updatedPages);
    toast.success('تم حفظ التغييرات بنجاح');
    setEditMode(false);
    setCurrentPage(null);
  };

  // Handle delete page
  const handleDeletePage = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصفحة؟')) return;
    
    const updatedPages = pages.filter(page => page.id !== id);
    setPages(updatedPages);
    toast.success('تم حذف الصفحة بنجاح');
  };

  // Handle create page
  const handleCreatePage = () => {
    const newPage = {
      id: Date.now().toString(),
      title: "صفحة جديدة",
      slug: `page-${Date.now()}`,
      content: "",
      status: "draft" as "draft",
      lastUpdated: new Date().toLocaleDateString('ar-EG'),
      author: "مسودة",
    };

    setPages([...pages, newPage]);
    handleEditPage(newPage);
  };

  // Handle view page
  const handleViewPage = (slug: string) => {
    toast.info(`سيتم فتح الصفحة: /${slug} في نافذة جديدة`);
    // Can be implemented to open the page in a new window
    window.open(`/${slug}`, '_blank');
  };

  // Handle toggle select all
  const handleToggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedPages([]);
    } else {
      setSelectedPages(filteredPages.map(page => page.id));
    }
    setIsSelectAll(!isSelectAll);
  };

  // Handle toggle select page
  const handleToggleSelectPage = (id: string) => {
    if (selectedPages.includes(id)) {
      setSelectedPages(selectedPages.filter(pageId => pageId !== id));
    } else {
      setSelectedPages([...selectedPages, id]);
    }
  };

  // Handle delete selected pages
  const handleDeleteSelected = () => {
    if (selectedPages.length === 0) return;
    
    if (!confirm(`هل أنت متأكد من حذف ${selectedPages.length} صفحة؟`)) return;
    
    const updatedPages = pages.filter(page => !selectedPages.includes(page.id));
    setPages(updatedPages);
    setSelectedPages([]);
    setIsSelectAll(false);
    toast.success('تم حذف الصفحات المحددة بنجاح');
  };

  // Handle bulk status change
  const handleBulkStatusChange = (status: "published" | "draft") => {
    if (selectedPages.length === 0) return;
    
    const updatedPages = pages.map(page => 
      selectedPages.includes(page.id) 
        ? { ...page, status: status } 
        : page
    );
    
    setPages(updatedPages);
    toast.success(`تم تغيير حالة ${selectedPages.length} صفحة إلى ${status === 'published' ? 'منشور' : 'مسودة'} بنجاح`);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterDate('all');
  };

  // Apply filters to pages
  const filteredPages = pages.filter(page => {
    // Search filter
    const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || page.status === filterStatus;
    
    // Date filter - simplified for mock data
    const matchesDate = filterDate === 'all';
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Effect to update isSelectAll when filtered pages change
  useEffect(() => {
    if (filteredPages.length > 0 && selectedPages.length === filteredPages.length) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  }, [selectedPages, filteredPages]);

  // Simulate loading effect
  const refreshPages = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('تم تحديث الصفحات بنجاح');
    }, 1000);
  };

  // Handle publish/unpublish page
  const handleToggleStatus = (page: PageItem) => {
    const newStatus = page.status === "published" ? "draft" : "published";
    const updatedPages = pages.map(p => 
      p.id === page.id ? { ...p, status: newStatus } : p
    );
    setPages(updatedPages);
    toast.success(`تم ${newStatus === "published" ? "نشر" : "إلغاء نشر"} الصفحة بنجاح`);
  };

  // Get filtered pages with applied sorting
  const getSortedPages = () => {
    return [...filteredPages].sort((a, b) => {
      // Sort by status first, then by title
      if (a.status !== b.status) {
        return a.status === "published" ? -1 : 1;
      }
      return a.title.localeCompare(b.title);
    });
  };

  return (
    <div className="min-h-screen bg-[#f0f0f1] rtl">
      {/* WordPress-like Admin Header */}
      <header className="bg-[#1d2327] text-white py-2 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <span className="text-2xl">أ</span>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button variant="ghost" className="text-white hover:text-gray-200 p-1" onClick={handleCreatePage}>
              <PlusCircle className="h-4 w-4 ml-1" />
              <span>جديد</span>
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button 
            variant="ghost" 
            className="text-white hover:text-gray-200 p-1"
            onClick={() => window.open('/', '_blank')}
          >
            <Home className="h-4 w-4 ml-1" />
            <span>زيارة الموقع</span>
          </Button>
        </div>
      </header>

      {/* WordPress-like Admin Body */}
      <div className="flex h-[calc(100vh-48px)]">
        {/* Sidebar */}
        <div className="bg-[#1d2327] text-white w-64 flex-shrink-0">
          <div className="p-4">
            <ul className="space-y-1">
              <li>
                <Link to="/dashboard">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#2c3338]">
                    <Layout className="h-5 w-5 ml-2" />
                    <span>لوحة التحكم</span>
                  </Button>
                </Link>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start bg-[#2271b1] hover:bg-[#135e96]">
                  <FileText className="h-5 w-5 ml-2" />
                  <span>الصفحات</span>
                </Button>
              </li>
              <li>
                <Link to="/media-management">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#2c3338]">
                    <Image className="h-5 w-5 ml-2" />
                    <span>الوسائط</span>
                  </Button>
                </Link>
              </li>
              <li>
                <Link to="/content-management">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#2c3338]">
                    <Settings className="h-5 w-5 ml-2" />
                    <span>إدارة المحتوى</span>
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">إدارة الصفحات</h1>
              <p className="text-gray-500">عرض وتعديل وإضافة صفحات جديدة</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={refreshPages} disabled={isLoading}>
                <RefreshCw className={`ml-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
              <Button onClick={handleCreatePage}>
                <PlusCircle className="ml-2 h-4 w-4" />
                إضافة صفحة جديدة
              </Button>
            </div>
          </div>

          {editMode ? (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>تعديل الصفحة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">عنوان الصفحة</label>
                    <Input 
                      value={currentPage?.title || ''}
                      onChange={(e) => setCurrentPage({...currentPage!, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">الرابط</label>
                    <Input 
                      value={currentPage?.slug || ''}
                      onChange={(e) => setCurrentPage({...currentPage!, slug: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">الحالة</label>
                    <Select 
                      value={currentPage?.status || 'draft'}
                      onValueChange={(value) => setCurrentPage({...currentPage!, status: value as "published" | "draft"})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">منشور</SelectItem>
                        <SelectItem value="draft">مسودة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">المحتوى</label>
                    <Textarea 
                      className="min-h-[300px]"
                      value={currentPage?.content || ''}
                      onChange={(e) => setCurrentPage({...currentPage!, content: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  <X className="ml-2 h-4 w-4" />
                  إلغاء
                </Button>
                <Button onClick={handleSavePage}>
                  <Save className="ml-2 h-4 w-4" />
                  حفظ التغييرات
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="shadow-sm">
              <CardContent className="p-0">
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <Checkbox
                      checked={isSelectAll}
                      onCheckedChange={handleToggleSelectAll}
                      aria-label="تحديد الكل"
                    />
                    <div className="relative">
                      <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        className="pl-4 pr-10 w-64"
                        placeholder="بحث في الصفحات..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    {(searchQuery || filterStatus !== 'all' || filterDate !== 'all') && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleClearFilters} 
                        className="text-gray-500"
                      >
                        <FilterX className="h-4 w-4 ml-1" />
                        مسح التصفية
                      </Button>
                    )}
                  </div>
                  {selectedPages.length > 0 && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleBulkStatusChange("published")}
                      >
                        <Globe className="h-4 w-4 ml-1" />
                        نشر المحدد
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleBulkStatusChange("draft")}
                      >
                        <FileText className="h-4 w-4 ml-1" />
                        تحويل إلى مسودة
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={handleDeleteSelected}
                      >
                        <Trash2 className="h-4 w-4 ml-2" />
                        حذف المحدد ({selectedPages.length})
                      </Button>
                    </div>
                  )}
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>العنوان</TableHead>
                      <TableHead>الرابط</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>آخر تحديث</TableHead>
                      <TableHead>المؤلف</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getSortedPages().map((page) => (
                      <TableRow key={page.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedPages.includes(page.id)}
                            onCheckedChange={() => handleToggleSelectPage(page.id)}
                            aria-label={`تحديد ${page.title}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div 
                            className="font-medium hover:text-blue-600 cursor-pointer" 
                            onClick={() => handleEditPage(page)}
                          >
                            {page.title}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 font-mono text-sm">/{page.slug}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(page)}
                            className={`rounded-full text-xs ${
                              page.status === 'published' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {page.status === 'published' ? 'منشور' : 'مسودة'}
                          </Button>
                        </TableCell>
                        <TableCell className="text-gray-600">{page.lastUpdated}</TableCell>
                        <TableCell className="text-gray-600">{page.author}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2 rtl:space-x-reverse">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditPage(page)}
                              title="تعديل"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewPage(page.slug)}
                              title="معاينة"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeletePage(page.id)}
                              title="حذف"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredPages.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10">
                          <div className="text-gray-500">
                            {searchQuery 
                              ? 'لا توجد نتائج مطابقة للبحث' 
                              : 'لا توجد صفحات، قم بإضافة صفحة جديدة'}
                          </div>
                          {!searchQuery && (
                            <Button 
                              variant="outline" 
                              className="mt-4"
                              onClick={handleCreatePage}
                            >
                              <PlusCircle className="ml-2 h-4 w-4" />
                              إضافة صفحة جديدة
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                
                <div className="p-4 border-t flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    إجمالي {filteredPages.length} صفحة {filteredPages.length !== pages.length && `(من ${pages.length})`}
                  </div>
                  <div className="flex gap-2">
                    <Select 
                      value={filterStatus} 
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger className="w-36 h-9">
                        <SelectValue placeholder="كل الحالات" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">كل الحالات</SelectItem>
                        <SelectItem value="published">منشور</SelectItem>
                        <SelectItem value="draft">مسودة</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={filterDate}
                      onValueChange={setFilterDate}
                    >
                      <SelectTrigger className="w-36 h-9">
                        <SelectValue placeholder="كل التواريخ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">كل التواريخ</SelectItem>
                        <SelectItem value="today">اليوم</SelectItem>
                        <SelectItem value="week">هذا الأسبوع</SelectItem>
                        <SelectItem value="month">هذا الشهر</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" size="sm">
                      تطبيق
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PagesManagement;
