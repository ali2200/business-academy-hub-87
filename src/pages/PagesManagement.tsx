
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Edit, Trash2, Eye, FileEdit, Newspaper, Calendar, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Page {
  id: string;
  title: string;
  slug: string;
  template: string;
  status: string;
  author: string | null;
  created_at: string;
  updated_at: string;
}

const PagesManagement = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    loadPages();
  }, []);
  
  const loadPages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setPages(data || []);
    } catch (error) {
      console.error('Error loading pages:', error);
      toast.error('حدث خطأ أثناء تحميل الصفحات');
    } finally {
      setIsLoading(false);
    }
  };
  
  const deletePage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setPages(pages.filter(page => page.id !== id));
      toast.success('تم حذف الصفحة بنجاح');
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('حدث خطأ أثناء حذف الصفحة');
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 border-green-200">منشورة</Badge>;
      case 'draft':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">مسودة</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Filter pages based on search query
  const filteredPages = pages.filter(page => {
    const searchLower = searchQuery.toLowerCase();
    return (
      page.title.toLowerCase().includes(searchLower) ||
      page.slug.toLowerCase().includes(searchLower) ||
      (page.author && page.author.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">إدارة الصفحات</h1>
              <p className="text-gray-600 mt-1">إنشاء وتعديل صفحات الموقع</p>
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
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>الصفحات</CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadPages}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />
                  تحديث
                </Button>
                <Button 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => navigate('/admin-dashboard/pages/create')}
                >
                  <PlusCircle className="h-4 w-4" />
                  إنشاء صفحة
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث في الصفحات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9"
                />
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                <p className="text-gray-500">جاري تحميل الصفحات...</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">العنوان</TableHead>
                      <TableHead className="text-right">الرابط</TableHead>
                      <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                      <TableHead className="text-right">آخر تحديث</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد صفحات بعد'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPages.map((page) => (
                        <TableRow key={page.id}>
                          <TableCell>
                            <div className="font-medium">{page.title}</div>
                            <div className="text-sm text-gray-500">
                              {page.template === 'default' ? 'القالب الافتراضي' : page.template}
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                              /{page.slug}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-3.5 w-3.5 ml-1" />
                              {new Date(page.created_at).toLocaleDateString('ar-EG')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-3.5 w-3.5 ml-1" />
                              {new Date(page.updated_at).toLocaleDateString('ar-EG')}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(page.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => window.open(`/${page.slug}`, '_blank')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => navigate(`/admin-dashboard/pages/${page.id}`)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>حذف الصفحة</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      هل أنت متأكد من حذف هذه الصفحة؟ لا يمكن التراجع عن هذا الإجراء.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => deletePage(page.id)}
                                      className="bg-red-500 text-white hover:bg-red-600"
                                    >
                                      حذف الصفحة
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PagesManagement;
