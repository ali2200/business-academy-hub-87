
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

import ArticlesTable, { ArticleItem, ArticleStatus } from '@/components/articles/ArticlesTable';
import ArticleActions from '@/components/articles/ArticleActions';
import ArticleForm from '@/components/articles/ArticleForm';
import HtmlImportDialog from '@/components/articles/HtmlImportDialog';

const ArticlesManagement = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('editor');
  
  // Article editor state
  const [articleForm, setArticleForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft' as ArticleStatus,
    tags: [] as string[],
    featured_image: ''
  });
  
  // HTML import state
  const [htmlContent, setHtmlContent] = useState('');
  const [htmlTitle, setHtmlTitle] = useState('');
  const [htmlPreview, setHtmlPreview] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, [refreshTrigger]);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, statusFilter]);

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
            status,
            author: 'غير معروف'
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

  const filterArticles = () => {
    let filtered = [...articles];
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(article => (
        article.title?.toLowerCase().includes(searchLower) ||
        article.slug?.toLowerCase().includes(searchLower) ||
        (article.author && article.author.toLowerCase().includes(searchLower))
      ));
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(article => article.status === statusFilter);
    }
    
    setFilteredArticles(filtered);
  };

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
    setActiveTab('editor');
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
    setActiveTab('editor');
    setIsEditDialogOpen(true);
  };

  const openImportDialog = () => {
    setHtmlContent('');
    setHtmlTitle('');
    setHtmlPreview('');
    setPreviewVisible(false);
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

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setArticleForm(prev => ({ 
      ...prev, 
      status: e.target.value as ArticleStatus 
    }));
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

  const handleHtmlContentChange = (content: string) => {
    setHtmlContent(content);
    setHtmlPreview(content);
    setPreviewVisible(true);
  };

  const handleHtmlTitleChange = (title: string) => {
    setHtmlTitle(title);
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
          <CardHeader className="pb-3">
            <CardTitle>جميع المقالات</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ArticleActions 
              selectedArticles={selectedArticles}
              openAddDialog={openAddDialog}
              openImportDialog={openImportDialog}
              handleBulkStatusChange={handleBulkStatusChange}
              handleBulkDelete={handleBulkDelete}
              refreshArticles={() => setRefreshTrigger(prev => prev + 1)}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setStatusFilter={setStatusFilter}
            />

            <ArticlesTable 
              articles={filteredArticles}
              loading={loading}
              searchTerm={searchTerm}
              selectedArticles={selectedArticles}
              toggleArticleSelection={toggleArticleSelection}
              toggleAllArticles={toggleAllArticles}
              openEditDialog={openEditDialog}
              handleDeleteArticle={handleDeleteArticle}
              setSelectedArticle={setSelectedArticle}
            />
          </CardContent>
        </Card>
      </div>

      {/* Add Article Dialog */}
      <ArticleForm 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title="إضافة مقال جديد"
        description="أدخل تفاصيل المقال الجديد. اضغط حفظ عند الانتهاء."
        formData={articleForm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleTitleChange={handleTitleChange}
        handleInputChange={handleInputChange}
        handleTagsChange={handleTagsChange}
        handleStatusChange={handleStatusChange}
        handleSubmit={handleAddArticle}
        submitButtonText="إضافة المقال"
      />

      {/* Edit Article Dialog */}
      <ArticleForm 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="تعديل المقال"
        description="قم بتعديل تفاصيل المقال. اضغط حفظ عند الانتهاء."
        formData={articleForm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleTitleChange={handleTitleChange}
        handleInputChange={handleInputChange}
        handleTagsChange={handleTagsChange}
        handleStatusChange={handleStatusChange}
        handleSubmit={handleUpdateArticle}
        submitButtonText="حفظ التغييرات"
      />

      {/* HTML Import Dialog */}
      <HtmlImportDialog 
        isOpen={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        htmlContent={htmlContent}
        htmlTitle={htmlTitle}
        previewVisible={previewVisible}
        setHtmlTitle={setHtmlTitle}
        handleHtmlContentChange={handleHtmlContentChange}
        handleHtmlTitleChange={handleHtmlTitleChange}
        handleImportHtml={handleImportHtml}
      />
    </div>
  );
};

export default ArticlesManagement;
