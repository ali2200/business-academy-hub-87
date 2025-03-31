
import React from 'react';
import { Calendar, Eye, Edit, Trash2 } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export type ArticleStatus = "published" | "draft" | "review";

export interface ArticleItem {
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

interface ArticlesTableProps {
  articles: ArticleItem[];
  loading: boolean;
  searchTerm: string;
  selectedArticles: string[];
  toggleArticleSelection: (id: string) => void;
  toggleAllArticles: () => void;
  openEditDialog: (article: ArticleItem) => void;
  openViewDialog: (article: ArticleItem) => void;
  handleDeleteArticle: () => void;
  setSelectedArticle: (article: ArticleItem) => void;
}

const ArticlesTable: React.FC<ArticlesTableProps> = ({
  articles,
  loading,
  searchTerm,
  selectedArticles,
  toggleArticleSelection,
  toggleAllArticles,
  openEditDialog,
  openViewDialog,
  handleDeleteArticle,
  setSelectedArticle
}) => {
  const getStatusBadge = (status: ArticleStatus) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 border-green-200">منشور</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">مسودة</Badge>;
      case 'review':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">مراجعة</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input
                type="checkbox"
                checked={selectedArticles.length === articles.length && articles.length > 0}
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
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                <p className="text-gray-500">جاري التحميل...</p>
              </TableCell>
            </TableRow>
          ) : articles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                {searchTerm ? 'لا توجد نتائج للبحث' : 'لا توجد مقالات بعد'}
              </TableCell>
            </TableRow>
          ) : (
            articles.map((article, index) => (
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
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-3.5 w-3.5 ml-1" />
                    {new Date(article.created_at).toLocaleDateString('ar-EG')}
                  </div>
                </TableCell>
                <TableCell>{article.views_count || 0}</TableCell>
                <TableCell>
                  {getStatusBadge(article.status)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="عرض"
                      onClick={() => openViewDialog(article)}
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>حذف المقالة</AlertDialogTitle>
                          <AlertDialogDescription>
                            هل أنت متأكد من حذف هذه المقالة؟ لا يمكن التراجع عن هذا الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => {
                              setSelectedArticle(article);
                              handleDeleteArticle();
                            }}
                            className="bg-red-500 text-white hover:bg-red-600"
                          >
                            حذف المقالة
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
      
      <div className="mt-4 text-center text-sm text-gray-500">
        قائمة بجميع المقالات في المدونة
      </div>
    </div>
  );
};

export default ArticlesTable;
