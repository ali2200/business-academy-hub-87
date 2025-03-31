
import React from 'react';
import { 
  PlusCircle, 
  FileCode, 
  MoreHorizontal, 
  Check, 
  AlertCircle, 
  Eye, 
  Trash2,
  RefreshCw,
  Filter,
  Search 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArticleStatus } from './ArticlesTable';

interface ArticleActionsProps {
  selectedArticles: string[];
  openAddDialog: () => void;
  openImportDialog: () => void;
  handleBulkStatusChange: (status: ArticleStatus) => void;
  handleBulkDelete: () => void;
  refreshArticles: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string | null) => void;
}

const ArticleActions: React.FC<ArticleActionsProps> = ({
  selectedArticles,
  openAddDialog,
  openImportDialog,
  handleBulkStatusChange,
  handleBulkDelete,
  refreshArticles,
  searchTerm,
  setSearchTerm,
  setStatusFilter
}) => {
  return (
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
              <Check className="h-4 w-4 ml-2" />
              نشر المحدد
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkStatusChange('draft')}>
              <AlertCircle className="h-4 w-4 ml-2" />
              تحويل إلى مسودة
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkStatusChange('review')}>
              <Eye className="h-4 w-4 ml-2" />
              إرسال للمراجعة
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleBulkDelete}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 ml-2" />
              حذف المحدد
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button 
          variant="outline"
          onClick={refreshArticles}
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
            placeholder="البحث عن مقال..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
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
  );
};

export default ArticleActions;
