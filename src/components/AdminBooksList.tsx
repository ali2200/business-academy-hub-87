
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  cover_url?: string;
  pdf_url?: string;
  status: BookStatus;
  lastUpdated?: string;
  updated_at?: string;
}

interface NewBookForm {
  title: string;
  author: string;
  price: number;
  currency: string;
  description?: string;
  category?: string;
  pages?: number;
  cover_url?: string;
  pdf_url?: string;
  status: BookStatus;
}

const defaultNewBook: NewBookForm = {
  title: '',
  author: '',
  price: 0,
  currency: 'EGP',
  description: '',
  category: '',
  pages: 0,
  cover_url: '',
  pdf_url: '',
  status: 'draft'
};

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
  const [newBook, setNewBook] = useState<NewBookForm>(defaultNewBook);

  useEffect(() => {
    fetchBooks();
  }, [refreshTrigger]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      
      // Fetch real data from Supabase
      const { data, error } = await supabase
        .from('books')
        .select('*');
      
      if (error) throw error;
      
      // Transform the data to match our component's format
      const formattedBooks = data.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        currency: book.currency,
        description: book.description,
        category: book.category,
        purchasesCount: book.purchases_count || 0,
        pages: book.pages,
        cover_url: book.cover_url,
        pdf_url: book.pdf_url,
        status: book.status as BookStatus,
        lastUpdated: new Date(book.updated_at).toLocaleDateString('ar-EG'),
        updated_at: book.updated_at
      }));
      
      setBooks(formattedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('فشل في تحميل الكتب');
      
      // Fallback to mock data if API fails
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
          cover_url: '/images/book-cover-1.jpg',
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
          cover_url: '/images/book-cover-2.jpg',
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
          cover_url: '/images/book-cover-3.jpg',
          status: 'draft',
          lastUpdated: '2025-02-25'
        }
      ];
      
      setBooks(mockBooks);
    } finally {
      setLoading(false);
    }
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (selectedBook) {
      // Edit mode - update selected book
      setSelectedBook({
        ...selectedBook,
        [name]: value
      });
    } else {
      // Add mode - update new book
      setNewBook({
        ...newBook,
        [name]: value
      });
    }
  };

  const handleSelectChange = (value: string, fieldName: string) => {
    if (selectedBook) {
      // Edit mode
      setSelectedBook({
        ...selectedBook,
        [fieldName]: value
      });
    } else {
      // Add mode
      setNewBook({
        ...newBook,
        [fieldName]: value
      });
    }
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    if (selectedBook) {
      // Edit mode
      setSelectedBook({
        ...selectedBook,
        [name]: numValue
      });
    } else {
      // Add mode
      setNewBook({
        ...newBook,
        [name]: numValue
      });
    }
  };

  const handleAddBook = async () => {
    try {
      // Insert new book into database
      const { data, error } = await supabase
        .from('books')
        .insert({
          title: newBook.title,
          author: newBook.author,
          price: newBook.price,
          currency: newBook.currency,
          description: newBook.description,
          category: newBook.category,
          pages: newBook.pages,
          cover_url: newBook.cover_url,
          pdf_url: newBook.pdf_url,
          status: newBook.status,
          purchases_count: 0
        })
        .select();
      
      if (error) throw error;
      
      toast.success('تمت إضافة الكتاب بنجاح');
      setIsAddDialogOpen(false);
      setNewBook(defaultNewBook);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('حدث خطأ أثناء إضافة الكتاب');
    }
  };

  const handleUpdateBook = async () => {
    if (!selectedBook) return;
    
    try {
      // Update book in database
      const { error } = await supabase
        .from('books')
        .update({
          title: selectedBook.title,
          author: selectedBook.author,
          price: selectedBook.price,
          currency: selectedBook.currency,
          description: selectedBook.description,
          category: selectedBook.category,
          pages: selectedBook.pages,
          cover_url: selectedBook.cover_url,
          pdf_url: selectedBook.pdf_url,
          status: selectedBook.status
        })
        .eq('id', selectedBook.id);
      
      if (error) throw error;
      
      toast.success('تم تحديث الكتاب بنجاح');
      setIsEditDialogOpen(false);
      setSelectedBook(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('حدث خطأ أثناء تحديث الكتاب');
    }
  };

  const handleDeleteBook = async () => {
    if (!selectedBook) return;
    
    try {
      // Delete book from database
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', selectedBook.id);
      
      if (error) throw error;
      
      toast.success('تم حذف الكتاب بنجاح');
      setIsDeleteDialogOpen(false);
      setSelectedBook(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('حدث خطأ أثناء حذف الكتاب');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBooks.length === 0) return;
    
    try {
      // Delete multiple books
      const { error } = await supabase
        .from('books')
        .delete()
        .in('id', selectedBooks);
      
      if (error) throw error;
      
      toast.success(`تم حذف ${selectedBooks.length} كتب بنجاح`);
      setSelectedBooks([]);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error bulk deleting books:', error);
      toast.error('حدث خطأ أثناء حذف الكتب');
    }
  };

  const handleBulkStatusChange = async (status: BookStatus) => {
    if (selectedBooks.length === 0) return;
    
    try {
      // Update status for multiple books
      const { error } = await supabase
        .from('books')
        .update({ status })
        .in('id', selectedBooks);
      
      if (error) throw error;
      
      toast.success(`تم تغيير حالة ${selectedBooks.length} كتب إلى "${status === 'published' ? 'منشور' : 'مسودة'}"`);
      setSelectedBooks([]);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error changing status:', error);
      toast.error('حدث خطأ أثناء تغيير حالة الكتب');
    }
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
                          src={book.cover_url} 
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

      {/* Dialog for adding a new book */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>إضافة كتاب جديد</DialogTitle>
            <DialogDescription>
              أدخل معلومات الكتاب الجديد. اضغط "حفظ" عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان الكتاب</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={newBook.title} 
                  onChange={handleInputChange} 
                  placeholder="أدخل عنوان الكتاب"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">المؤلف</Label>
                <Input 
                  id="author" 
                  name="author" 
                  value={newBook.author} 
                  onChange={handleInputChange} 
                  placeholder="اسم المؤلف"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">السعر</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  value={newBook.price} 
                  onChange={handleNumberInputChange} 
                  placeholder="أدخل السعر"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">العملة</Label>
                <Select 
                  value={newBook.currency} 
                  onValueChange={(value) => handleSelectChange(value, 'currency')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العملة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EGP">جنيه مصري</SelectItem>
                    <SelectItem value="USD">دولار أمريكي</SelectItem>
                    <SelectItem value="SAR">ريال سعودي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">التصنيف</Label>
                <Input 
                  id="category" 
                  name="category" 
                  value={newBook.category || ''} 
                  onChange={handleInputChange} 
                  placeholder="أدخل التصنيف"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pages">عدد الصفحات</Label>
                <Input 
                  id="pages" 
                  name="pages" 
                  type="number"
                  value={newBook.pages || ''} 
                  onChange={handleNumberInputChange} 
                  placeholder="أدخل عدد الصفحات"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">الحالة</Label>
              <Select 
                value={newBook.status} 
                onValueChange={(value) => handleSelectChange(value as BookStatus, 'status')}
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
            
            <div className="space-y-2">
              <Label htmlFor="cover_url">رابط صورة الغلاف</Label>
              <Input 
                id="cover_url" 
                name="cover_url" 
                value={newBook.cover_url || ''} 
                onChange={handleInputChange} 
                placeholder="أدخل رابط صورة الغلاف"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pdf_url">رابط ملف PDF</Label>
              <Input 
                id="pdf_url" 
                name="pdf_url" 
                value={newBook.pdf_url || ''} 
                onChange={handleInputChange} 
                placeholder="أدخل رابط ملف PDF للكتاب"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">وصف الكتاب</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={newBook.description || ''} 
                onChange={handleInputChange} 
                placeholder="أدخل وصفاً تفصيلياً للكتاب"
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={handleAddBook}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing a book */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تعديل الكتاب</DialogTitle>
            <DialogDescription>
              تعديل معلومات الكتاب. اضغط "حفظ" عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBook && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">عنوان الكتاب</Label>
                  <Input 
                    id="edit-title" 
                    name="title" 
                    value={selectedBook.title} 
                    onChange={handleInputChange} 
                    placeholder="أدخل عنوان الكتاب"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-author">المؤلف</Label>
                  <Input 
                    id="edit-author" 
                    name="author" 
                    value={selectedBook.author} 
                    onChange={handleInputChange} 
                    placeholder="اسم المؤلف"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">السعر</Label>
                  <Input 
                    id="edit-price" 
                    name="price" 
                    type="number" 
                    value={selectedBook.price} 
                    onChange={handleNumberInputChange} 
                    placeholder="أدخل السعر"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-currency">العملة</Label>
                  <Select 
                    value={selectedBook.currency} 
                    onValueChange={(value) => handleSelectChange(value, 'currency')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العملة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EGP">جنيه مصري</SelectItem>
                      <SelectItem value="USD">دولار أمريكي</SelectItem>
                      <SelectItem value="SAR">ريال سعودي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">التصنيف</Label>
                  <Input 
                    id="edit-category" 
                    name="category" 
                    value={selectedBook.category || ''} 
                    onChange={handleInputChange} 
                    placeholder="أدخل التصنيف"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pages">عدد الصفحات</Label>
                  <Input 
                    id="edit-pages" 
                    name="pages" 
                    type="number"
                    value={selectedBook.pages || ''} 
                    onChange={handleNumberInputChange} 
                    placeholder="أدخل عدد الصفحات"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-status">الحالة</Label>
                <Select 
                  value={selectedBook.status} 
                  onValueChange={(value) => handleSelectChange(value as BookStatus, 'status')}
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
              
              <div className="space-y-2">
                <Label htmlFor="edit-cover_url">رابط صورة الغلاف</Label>
                <Input 
                  id="edit-cover_url" 
                  name="cover_url" 
                  value={selectedBook.cover_url || ''} 
                  onChange={handleInputChange} 
                  placeholder="أدخل رابط صورة الغلاف"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-pdf_url">رابط ملف PDF</Label>
                <Input 
                  id="edit-pdf_url" 
                  name="pdf_url" 
                  value={selectedBook.pdf_url || ''} 
                  onChange={handleInputChange} 
                  placeholder="أدخل رابط ملف PDF للكتاب"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">وصف الكتاب</Label>
                <Textarea 
                  id="edit-description" 
                  name="description" 
                  value={selectedBook.description || ''} 
                  onChange={handleInputChange} 
                  placeholder="أدخل وصفاً تفصيلياً للكتاب"
                  rows={5}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={handleUpdateBook}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for deleting a book */}
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
