
import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  FileCode,
  Upload
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
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

type ArticleStatus = "published" | "draft" | "review";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: ArticleStatus;
  author_id?: string;
  author?: string;
  tags?: string[];
  featured_image?: string;
  views_count?: number;
  created_at: string;
  updated_at: string;
}

const ArticlesManagement = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Form state for adding/editing articles
  const [articleForm, setArticleForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft' as ArticleStatus,
    tags: [],
    featured_image: ''
  });
  
  // HTML import state
  const [htmlContent, setHtmlContent] = useState('');
  const [htmlTitle, setHtmlTitle] = useState('');

  useEffect(() => {
    fetchArticles();
  }, [refreshTrigger]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Fetch author names for each article
      const articlesWithAuthors = await Promise.all(
        (data || []).map(async (article) => {
          // Ensure article.status is one of the allowed ArticleStatus values
          const status: ArticleStatus = 
            article.status === 'published' || 
            article.status === 'draft' || 
            article.status === 'review' 
              ? article.status as ArticleStatus 
              : 'draft';
              
          if (article.author_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('display_name')
              .eq('id', article.author_id)
              .single();
            
            return {
              ...article,
              status,
              author: profileData?.display_name || 'غير معروف'
            } as ArticleItem;
          }
          return {
            ...article,
            status
          } as ArticleItem;
        })
      );

      setArticles(articlesWithAuthors);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('فشل في جلب المقالات');
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = 
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.author && article.author.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (statusFilter) {
      return matchesSearch && article.status === statusFilter;
    }
    
    return matchesSearch;
  });

  const toggleArticleSelection = (articleId: string) => {
    if (selectedArticles.includes(articleId)) {
      setSelectedArticles(selectedArticles.filter(id => id !== articleId));
    } else {
      setSelectedArticles([...selectedArticles, articleId]);
    }
  };

  const toggleAllArticles = () => {
    if (selectedArticles.length === filteredArticles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(filteredArticles.map(article => article.id));
    }
  };

  const openAddDialog = () => {
    setArticleForm({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      status: 'draft',
      tags: [],
      featured_image: ''
    });
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (article: ArticleItem) => {
    setSelectedArticle(article);
    setArticleForm({
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt || '',
      status: article.status,
      tags: article.tags || [],
      featured_image: article.featured_image || ''
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (article: ArticleItem) => {
    setSelectedArticle(article);
    setIsDeleteDialogOpen(true);
  };

  const openImportDialog = () => {
    setHtmlContent('');
    setHtmlTitle('');
    setIsImportDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setArticleForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    setArticleForm(prev => ({
      ...prev,
      tags: tagsArray
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setArticleForm(prev => ({
      ...prev,
      title
    }));
    
    // Only auto-generate slug if it's a new article or slug hasn't been manually edited
    if (!selectedArticle || selectedArticle.slug === articleForm.slug) {
      setArticleForm(prev => ({
        ...prev,
        slug: generateSlug(title)
      }));
    }
  };

  const handleAddArticle = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      const { error } = await supabase
        .from('articles')
        .insert({
          title: articleForm.title,
          slug: articleForm.slug,
          content: articleForm.content,
          excerpt: articleForm.excerpt || null,
          status: articleForm.status,
          tags: articleForm.tags.length > 0 ? articleForm.tags : null,
          featured_image: articleForm.featured_image || null,
          author_id: userId || null
        });

      if (error) throw error;
      
      toast.success('تمت إضافة المقالة بنجاح');
      setIsAddDialogOpen(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error adding article:', error);
      toast.error('فشل في إضافة المقالة');
    }
  };

  const handleUpdateArticle = async () => {
    if (!selectedArticle) return;
    
    try {
      const { error } = await supabase
        .from('articles')
        .update({
          title: articleForm.title,
          slug: articleForm.slug,
          content: articleForm.content,
          excerpt: articleForm.excerpt || null,
          status: articleForm.status,
          tags: articleForm.tags.length > 0 ? articleForm.tags : null,
          featured_image: articleForm.featured_image || null
        })
        .eq('id', selectedArticle.id);

      if (error) throw error;
      
      toast.success('تم تحديث المقالة بنجاح');
      setIsEditDialogOpen(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error('فشل في تحديث المقالة');
    }
  };

  const handleDeleteArticle = async () => {
    if (!selectedArticle) return;
    
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', selectedArticle.id);

      if (error) throw error;
      
      toast.success('تم حذف المقالة بنجاح');
      setIsDeleteDialogOpen(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('فشل في حذف المقالة');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedArticles.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .in('id', selectedArticles);

      if (error) throw error;
      
      toast.success(`تم حذف ${selectedArticles.length} مقالات بنجاح`);
      setSelectedArticles([]);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error bulk deleting articles:', error);
      toast.error('فشل في حذف المقالات المحددة');
    }
  };

  const handleBulkStatusChange = async (status: ArticleStatus) => {
    if (selectedArticles.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('articles')
        .update({ status })
        .in('id', selectedArticles);

      if (error) throw error;
      
      const statusText = status === 'published' ? 'منشور' : status === 'draft' ? 'مسودة' : 'مراجعة';
      toast.success(`تم تغيير حالة ${selectedArticles.length} مقالات إلى "${statusText}"`);
      setSelectedArticles([]);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error changing articles status:', error);
      toast.error('فشل في تغيير حالة المقالات المحددة');
    }
  };

  const handleImportHtml = async () => {
    if (!htmlContent || !htmlTitle) {
      toast.error('يرجى إدخال عنوان ومحتوى HTML');
      return;
    }
    
    try {
      const slug = generateSlug(htmlTitle);
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      const { error } = await supabase
        .from('articles')
        .insert({
          title: htmlTitle,
          slug,
          content: htmlContent,
          status: 'draft',
          author_id: userId || null
        });

      if (error) throw error;
      
      toast.success('تم استيراد مقالة HTML بنجاح');
      setIsImportDialogOpen(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error importing HTML article:', error);
      toast.error('فشل في استيراد مقالة HTML');
    }
  };

  const getStatusBadge = (status: ArticleStatus) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500 hover:bg-green-600">منشور</Badge>;
      case 'draft':
        return <Badge variant="secondary">مسودة</Badge>;
      case 'review':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300">مراجعة</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Re-adding missing functions
  const filteredArticles = articles.filter(article => {
    const matchesSearch = 
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.author && article.author.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (statusFilter) {
      return matchesSearch && article.status === statusFilter;
    }
    
    return matchesSearch;
  });

  const toggleArticleSelection = (articleId: string) => {
    if (selectedArticles.includes(articleId)) {
      setSelectedArticles(selectedArticles.filter(id => id !== articleId));
    } else {
      setSelectedArticles([...selectedArticles, articleId]);
    }
  };

  const toggleAllArticles = () => {
    if (selectedArticles.length === filteredArticles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(filteredArticles.map(article => article.id));
    }
  };

  const openAddDialog = () => {
    setArticleForm({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      status: 'draft',
      tags: [],
      featured_image: ''
    });
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (article: ArticleItem) => {
    setSelectedArticle(article);
    setArticleForm({
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt || '',
      status: article.status,
      tags: article.tags || [],
      featured_image: article.featured_image || ''
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (article: ArticleItem) => {
    setSelectedArticle(article);
    setIsDeleteDialogOpen(true);
  };

  const openImportDialog = () => {
    setHtmlContent('');
    setHtmlTitle('');
    setIsImportDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setArticleForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    setArticleForm(prev => ({
      ...prev,
      tags: tagsArray
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setArticleForm(prev => ({
      ...prev,
      title
    }));
    
    // Only auto-generate slug if it's a new article or slug hasn't been manually edited
    if (!selectedArticle || selectedArticle.slug === articleForm.slug) {
      setArticleForm(prev => ({
        ...prev,
        slug: generateSlug(title)
      }));
    }
  };

  const handleUpdateArticle = async () => {
    if (!selectedArticle) return;
    
    try {
      const { error } = await supabase
        .from('articles')
        .update({
          title: articleForm.title,
          slug: articleForm.slug,
          content: articleForm.content,
          excerpt: articleForm.excerpt || null,
          status: articleForm.status,
          tags: articleForm.tags.length > 0 ? articleForm.tags : null,
          featured_image: articleForm.featured_image || null
        })
        .eq('id', selectedArticle.id);

      if (error) throw error;
      
      toast.success('تم تحديث المقالة بنجاح');
      setIsEditDialogOpen(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error('فشل في تحديث المقالة');
    }
  };

  const handleDeleteArticle = async () => {
    if (!selectedArticle) return;
    
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', selectedArticle.id);

      if (error) throw error;
      
      toast.success('تم حذف المقالة بنجاح');
      setIsDeleteDialogOpen(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('فشل في حذف المقالة');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedArticles.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .in('id', selectedArticles);

      if (error) throw error;
      
      toast.success(`تم حذف ${selectedArticles.length} مقالات بنجاح`);
      setSelectedArticles([]);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error bulk deleting articles:', error);
      toast.error('فشل في حذف المقالات المحددة');
    }
  };

  const handleBulkStatusChange = async (status: ArticleStatus) => {
    if (selectedArticles.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('articles')
        .update({ status })
        .in('id', selectedArticles);

      if (error) throw error;
      
      const statusText = status === 'published' ? 'منشور' : status === 'draft' ? 'مسودة' : 'مراجعة';
      toast.success(`تم تغيير حالة ${selectedArticles.length} مقالات إلى "${statusText}"`);
      setSelectedArticles([]);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error changing articles status:', error);
      toast.error('فشل في تغيير حالة المقالات المحددة');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">إدارة المقالات</h1>
              <p className="text-gray-600 mt-1">تحكم في محتوى مقالات الموقع الإلكتروني</p>
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
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={openAddDialog}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  إضافة مقال جديد
                </Button>
                <Button
                  onClick={openImportDialog}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <FileCode className="h-4 w-4" />
                  استيراد HTML
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      disabled={selectedArticles.length === 0}
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
                    <DropdownMenuItem onClick={() => handleBulkStatusChange('review')}>
                      <Eye className="h-4 w-4 mr-2" />
                      إرسال للمراجعة
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
                    placeholder="بحث في المقالات..."
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
                    <DropdownMenuItem onClick={() => setStatusFilter('review')}>
                      مراجعة
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
                        checked={selectedArticles.length === filteredArticles.length && filteredArticles.length > 0}
                        onChange={toggleAllArticles}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>العنوان</TableHead>
                    <TableHead>الكاتب</TableHead>
                    <TableHead>التصنيف</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>المشاهدات</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        جاري التحميل...
                      </TableCell>
                    </TableRow>
                  ) : filteredArticles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        لا توجد مقالات متاحة
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredArticles.map((article, index) => (
                      <TableRow key={article.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedArticles.includes(article.id)}
                            onChange={() => toggleArticleSelection(article.id)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </TableCell>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <div className="font-medium">{article.title}</div>
                          <div className="text-gray-500 text-xs">{article.slug}</div>
                          {article.excerpt && (
                            <div className="text-gray-500 text-sm truncate max-w-52">
                              {article.excerpt}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{article.author || "غير معروف"}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {article.tags?.length ? article.tags.map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            )) : <span className="text-gray-400">-</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(article.created_at).toLocaleDateString('ar-EG')}
                        </TableCell>
                        <TableCell>{article.views_count || 0}</TableCell>
                        <TableCell>
                          {getStatusBadge(article.status as ArticleStatus)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="عرض"
                              onClick={() => navigate(`/articles/${article.slug}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="تعديل"
                              onClick={() => openEditDialog(article)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="حذف"
                              onClick={() => openDeleteDialog(article)}
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

      {/* Add Article Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>إضافة مقال جديد</DialogTitle>
            <DialogDescription>
              أدخل تفاصيل المقال الجديد. اضغط حفظ عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                عنوان المقال *
              </label>
              <Input
                id="title"
                name="title"
                value={articleForm.title}
                onChange={handleTitleChange}
                placeholder="أدخل عنوان المقال"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="slug" className="text-sm font-medium">
                الرابط الدائم *
              </label>
              <Input
                id="slug"
                name="slug"
                value={articleForm.slug}
                onChange={handleInputChange}
                placeholder="مثال: my-article-title"
                required
              />
              <p className="text-xs text-gray-500">
                سيظهر المقال على الرابط: /articles/{articleForm.slug}
              </p>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="content" className="text-sm font-medium">
                محتوى المقال *
              </label>
              <Textarea
                id="content"
                name="content"
                value={articleForm.content}
                onChange={handleInputChange}
                placeholder="أدخل محتوى المقال"
                rows={8}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="excerpt" className="text-sm font-medium">
                مقتطف المقال
              </label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={articleForm.excerpt}
                onChange={handleInputChange}
                placeholder="مقتطف قصير يظهر في القوائم وصفحات البحث"
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="tags" className="text-sm font-medium">
                التصنيفات
              </label>
              <Input
                id="tags"
                name="tags"
                value={articleForm.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="أدخل التصنيفات مفصولة بفواصل (مثال: تعليم, تكنولوجيا)"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="featured_image" className="text-sm font-medium">
                رابط الصورة المميزة
              </label>
              <Input
                id="featured_image"
                name="featured_image"
                value={articleForm.featured_image}
                onChange={handleInputChange}
                placeholder="أدخل رابط الصورة المميزة"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">
                حالة المقال
              </label>
              <select
                id="status"
                name="status"
                value={articleForm.status}
                onChange={(e) => setArticleForm(prev => ({ ...prev, status: e.target.value as ArticleStatus }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="draft">مسودة</option>
                <option value="review">مراجعة</option>
                <option value="published">منشور</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={handleAddArticle}>إضافة المقال</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Article Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تعديل المقال</DialogTitle>
            <DialogDescription>
              قم بتعديل تفاصيل المقال. اضغط حفظ عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-title" className="text-sm font-medium">
                عنوان المقال *
              </label>
              <Input
                id="edit-title"
                name="title"
                value={articleForm.title}
                onChange={handleTitleChange}
                placeholder="أدخل عنوان المقال"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-slug" className="text-sm font-medium">
                الرابط الدائم *
              </label>
              <Input
                id="edit-slug"
                name="slug"
                value={articleForm.slug}
                onChange={handleInputChange}
                placeholder="مثال: my-article-title"
                required
              />
              <p className="text-xs text-gray-500">
                سيظهر المقال على الرابط: /articles/{articleForm.slug}
              </p>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-content" className="text-sm font-medium">
                محتوى المقال *
              </label>
              <Textarea
                id="edit-content"
                name="content"
                value={articleForm.content}
                onChange={handleInputChange}
                placeholder="أدخل محتوى المقال"
                rows={8}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-excerpt" className="text-sm font-medium">
                مقتطف المقال
              </label>
              <Textarea
                id="edit-excerpt"
                name="excerpt"
                value={articleForm.excerpt}
                onChange={handleInputChange}
                placeholder="مقتطف قصير يظهر في القوائم وصفحات البحث"
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-tags" className="text-sm font-medium">
                التصنيفات
              </label>
              <Input
                id="edit-tags"
                name="tags"
                value={articleForm.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="أدخل التصنيفات مفصولة بفواصل (مثال: تعليم, تكنولوجيا)"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-featured_image" className="text-sm font-medium">
                رابط الصورة المميزة
              </label>
              <Input
                id="edit-featured_image"
                name="featured_image"
                value={articleForm.featured_image}
                onChange={handleInputChange}
                placeholder="أدخل رابط الصورة المميزة"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-status" className="text-sm font-medium">
                حالة المقال
              </label>
              <select
                id="edit-status"
                name="status"
                value={articleForm.status}
                onChange={(e) => setArticleForm(prev => ({ ...prev, status: e.target.value as ArticleStatus }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="draft">مسودة</option>
                <option value="review">مراجعة</option>
                <option value="published">منشور</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={handleUpdateArticle}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Article Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>حذف المقال</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذا المقال؟ هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteArticle}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import HTML Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>استيراد مقال HTML</DialogTitle>
            <DialogDescription>
              أدخل عنوان المقال ثم قم بلصق كود HTML للمقال.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="html-title" className="text-sm font-medium">
                عنوان المقال *
              </label>
              <Input
                id="html-title"
                value={htmlTitle}
                onChange={(e) => setHtmlTitle(e.target.value)}
                placeholder="أدخل عنوان المقال"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="html-content" className="text-sm font-medium">
                محتوى HTML *
              </label>
              <Textarea
                id="html-content"
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder="الصق كود HTML هنا"
                rows={12}
                required
                className="font-mono text-sm"
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={handleImportHtml} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              استيراد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArticlesManagement;
