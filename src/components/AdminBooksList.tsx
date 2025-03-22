import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
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
  DialogTrigger,
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

type BookStatus = "published" | "draft";

interface BookItem {
  id: string;
  title: string;
  author: string;
  price: number;
  currency: string;
  description?: string;
  category?: string;
  purchasesCount: number;
  pages?: number;
  cover: string;
  status: BookStatus;
  lastUpdated: string;
}

const AdminBooksList = () => {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        
        const mockBooks: BookItem[] = [
          {
            id: '1',
            title: 'إدارة الأعمال للمبتدئين',
            author: 'أحمد محمد',
            price: 99.99,
            currency: 'EGP',
            description: 'كتاب شامل للمبتدئين في عالم إدارة الأعمال',
            category: 'إدارة أعمال',
            purchasesCount: 255,
            pages: 320,
            cover: '/images/book-cover-1.jpg',
            status: 'published',
            lastUpdated: '2025-02-15'
          },
          {
            id: '2',
            title: 'أساسيات التسويق الإلكتروني',
            author: 'سارة أحمد',
            price: 149.99,
            currency: 'EGP',
            description: 'تعلم أساسيات التسويق الإلكتروني في عصر التكنولوجيا',
            category: 'تسويق',
            purchasesCount: 178,
            pages: 250,
            cover: '/images/book-cover-2.jpg',
            status: 'published',
            lastUpdated: '2025-02-20'
          },
          {
            id: '3',
            title: 'التخطيط الاستراتيجي للشركات الناشئة',
            author: 'محمد عبد الرحمن',
            price: 199.99,
            currency: 'EGP',
            description: 'دليل شامل للتخطيط الاستراتيجي للشركات الناشئة',
            category: 'استراتيجية',
            purchasesCount: 120,
            pages: 380,
            cover: '/images/book-cover-3.jpg',
            status: 'draft',
            lastUpdated: '2025-02-25'
          }
        ];
        
        setBooks(mockBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
        toast.error('فشل في تحميل الكتب');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [refreshTrigger]);

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.category && book.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (statusFilter) {
      return matchesSearch && book.status === statusFilter;
    }
    
    return matchesSearch;
  });

  const toggleBookSelection = (bookId: string) => {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter(id => id !== bookId));
    } else {
      setSelectedBooks([...selectedBooks, bookId]);
    }
  };

  const toggleAllBooks = () => {
    if (selectedBooks.length === filteredBooks.length) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(filteredBooks.map(book => book.id));
    }
  };

  const handleAddBook = () => {
    toast.success('تمت إضافة الكتاب بنجاح');
    setIsAddDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleUpdateBook = () => {
    if (!selectedBook) return;
    
    toast.success('تم تحديث الكتاب بنجاح');
    setIsEditDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeleteBook = () => {
    if (!selectedBook) return;
    
    toast.success('تم حذف الكتاب بنجاح');
    setIsDeleteDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleBulkDelete = () => {
    if (selectedBooks.length === 0) return;
    
    toast.success(`تم حذف ${selectedBooks.length} كتب بنجاح`);
    setSelectedBooks([]);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleBulkStatusChange = (status: BookStatus) => {
    if (selectedBooks.length === 0) return;
    
    toast.success(`تم تغيير حالة ${selectedBooks.length} كتب إلى "${status === 'published' ? 'منشور' : 'مسودة'}"`);
    setSelectedBooks([]);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              إضافة كتاب جديد
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={selectedBooks.length === 0}
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
                placeholder="بحث في الكتب..."
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
                    checked={selectedBooks.length === filteredBooks.length && filteredBooks.length > 0}
                    onChange={toggleAllBooks}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>الكتاب</TableHead>
                <TableHead>السعر</TableHead>
                <TableHead>المبيعات</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>آخر تحديث</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : filteredBooks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    لا توجد كتب متاحة
                  </TableCell>
                </TableRow>
              ) : (
                filteredBooks.map(book => (
                  <TableRow key={book.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedBooks.includes(book.id)}
                        onChange={() => toggleBookSelection(book.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img 
                          src={book.cover} 
                          alt={book.title} 
                          className="h-12 w-10 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-gray-500 text-sm">{book.author}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{book.price} {book.currency}</TableCell>
                    <TableCell>{book.purchasesCount}</TableCell>
                    <TableCell>
                      <Badge variant={book.status === 'published' ? 'default' : 'secondary'} 
                        className={book.status === 'published' ? 'bg-green-500 hover:bg-green-600' : ''}>
                        {book.status === 'published' ? 'منشور' : 'مسودة'}
                      </Badge>
                    </TableCell>
                    <TableCell>{book.lastUpdated}</TableCell>
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
                            setSelectedBook(book);
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
                            setSelectedBook(book);
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>حذف الكتاب</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذا الكتاب؟ هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteBook}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminBooksList;
