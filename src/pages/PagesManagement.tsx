import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw,
  Filter,
  MoreHorizontal,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  DialogClose
} from "@/components/ui/dialog";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

type PageStatus = "published" | "draft";

interface PageItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: PageStatus;
  lastUpdated: string;
  author?: string;
  template?: string;
  featured_image?: string;
}

const PagesManagement = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState<PageItem[]>([
    {
      id: '1',
      title: 'الصفحة الرئيسية',
      slug: 'home',
      content: 'محتوى الصفحة الرئيسية',
      status: 'published',
      lastUpdated: '2025-02-15',
      author: 'أحمد محمد',
      template: 'default',
      featured_image: '/images/home-hero.jpg'
    },
    {
      id: '2',
      title: 'من نحن',
      slug: 'about',
      content: 'محتوى صفحة من نحن',
      status: 'published',
      lastUpdated: '2025-02-20',
      author: 'سارة أحمد',
      template: 'about',
      featured_image: '/images/about-hero.jpg'
    },
    {
      id: '3',
      title: 'سياسة الخصوصية',
      slug: 'privacy-policy',
      content: 'محتوى سياسة الخصوصية',
      status: 'draft',
      lastUpdated: '2025-02-25',
      author: 'محمد عبد الرحمن',
      template: 'legal',
      featured_image: '/images/legal-hero.jpg'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<PageItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Filter pages based on search term and status filter
  const filteredPages = pages.filter(page => {
    const matchesSearch = 
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (page.author && page.author.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (statusFilter) {
      return matchesSearch && page.status === statusFilter;
    }
    
    return matchesSearch;
  });

  // Toggle selection of a page
  const togglePageSelection = (pageId: string) => {
    if (selectedPages.includes(pageId)) {
      setSelectedPages(selectedPages.filter(id => id !== pageId));
    } else {
      setSelectedPages([...selectedPages, pageId]);
    }
  };

  // Toggle selection of all pages
  const toggleAllPages = () => {
    if (selectedPages.length === filteredPages.length) {
      setSelectedPages([]);
    } else {
      setSelectedPages(filteredPages.map(page => page.id));
    }
  };

  // Handle adding a new page
  const handleAddPage = () => {
    // TODO: Implement page creation via Supabase
    toast.success('تمت إضافة الصفحة بنجاح');
    setIsAddDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle updating a page
  const handleUpdatePage = () => {
    if (!selectedPage) return;
    
    // TODO: Implement page update via Supabase
    toast.success('تم تحديث الصفحة بنجاح');
    setIsEditDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle deleting a page
  const handleDeletePage = () => {
    if (!selectedPage) return;
    
    // TODO: Implement page deletion via Supabase
    toast.success('تم حذف الصفحة بنجاح');
    setIsDeleteDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle bulk deleting pages
  const handleBulkDelete = () => {
    if (selectedPages.length === 0) return;
    
    // TODO: Implement bulk deletion via Supabase
    toast.success(`تم حذف ${selectedPages.length} صفحات بنجاح`);
    setSelectedPages([]);
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle bulk status change
  const handleBulkStatusChange = (status: PageStatus) => {
    if (selectedPages.length === 0) return;
    
    // TODO: Implement bulk status change via Supabase
    toast.success(`تم تغيير حالة ${selectedPages.length} صفحات إلى "${status === 'published' ? 'منشور' : 'مسودة'}"`);
    setSelectedPages([]);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">إدارة الصفحات</h1>
              <p className="text-gray-600 mt-1">تحكم في صفحات الموقع الإلكتروني</p>
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

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  إضافة صفحة جديدة
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      disabled={selectedPages.length === 0}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span>إجراءات جماعية</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>الإجراءات الجماعية</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkStatusChange('published')}>
                      <Check className="h-4 w-4 mr-2" />
                      نشر المحدد
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkStatusChange('draft')}>
                      <AlertCircle className="h-4 w-4 mr-2" />
                      تحويل إلى مسودة
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleBulkDelete}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      حذف المحدد
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  variant="outline"
                  onClick={() => setRefreshTrigger(prev => prev + 1)}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  تحديث
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="بحث في الصفحات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Filter className="h-4 w-4" />
                      <span>تصفية</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>تصفية حسب الحالة</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                      الكل
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('published')}>
                      منشور
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('draft')}>
                      مسودة
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedPages.length === filteredPages.length && filteredPages.length > 0}
                        onChange={toggleAllPages}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead>العنوان</TableHead>
                    <TableHead>الرابط</TableHead>
                    <TableHead>المؤلف</TableHead>
                    <TableHead>القالب</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>آخر تحديث</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        جاري التحميل...
                      </TableCell>
                    </TableRow>
                  ) : filteredPages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        لا توجد صفحات متاحة
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPages.map(page => (
                      <TableRow key={page.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedPages.includes(page.id)}
                            onChange={() => togglePageSelection(page.id)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{page.title}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-blue-600">{page.slug}</div>
                        </TableCell>
                        <TableCell>{page.author || '-'}</TableCell>
                        <TableCell>{page.template || 'default'}</TableCell>
                        <TableCell>
                          <Badge variant={page.status === 'published' ? 'success' : 'secondary'}>
                            {page.status === 'published' ? 'منشور' : 'مسودة'}
                          </Badge>
                        </TableCell>
                        <TableCell>{page.lastUpdated}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="عرض"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="تعديل"
                              onClick={() => {
                                setSelectedPage(page);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="حذف"
                              onClick={() => {
                                setSelectedPage(page);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
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
          </CardContent>
        </Card>
      </div>

      {/* Delete Page Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>حذف الصفحة</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذه الصفحة؟ هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeletePage}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Page Dialogs would be implemented here */}
    </div>
  );
};

export default PagesManagement;
