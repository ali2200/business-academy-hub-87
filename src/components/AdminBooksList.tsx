
import React, { useState } from 'react';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Search, 
  PlusCircle, 
  RefreshCw,
  Filter 
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the book item type
interface BookItem {
  id: string;
  title: string;
  author: string;
  price: number;
  currency: string;
  purchasesCount: number;
  status: 'published' | 'draft';
  cover: string;
  lastUpdated: string;
  description?: string;
  category?: string;
  pages?: number;
}

interface AdminBooksListProps {
  initialBooks?: BookItem[];
}

const AdminBooksList = ({ initialBooks }: AdminBooksListProps) => {
  const defaultBooks: BookItem[] = [
    {
      id: "1",
      title: "أسرار البيع الناجح",
      author: "د. أحمد محمد",
      price: 79,
      currency: "ج.م",
      purchasesCount: 532,
      status: "published",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop",
      lastUpdated: "12 فبراير 2023",
    },
    {
      id: "2",
      title: "استراتيجيات التسويق الحديثة",
      author: "م. سارة أحمد",
      price: 89,
      currency: "ج.م",
      purchasesCount: 421,
      status: "published",
      cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop",
      lastUpdated: "5 مارس 2023",
    },
    {
      id: "3",
      title: "القيادة في عصر التحول الرقمي",
      author: "د. محمد علي",
      price: 99,
      currency: "ج.م",
      purchasesCount: 287,
      status: "published",
      cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2012&auto=format&fit=crop",
      lastUpdated: "18 أبريل 2023",
    }
  ];

  const [books, setBooks] = useState<BookItem[]>(initialBooks || defaultBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPublished, setShowPublished] = useState(true);
  const [showDrafts, setShowDrafts] = useState(true);
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // New book form state
  const [newBook, setNewBook] = useState<Omit<BookItem, 'id' | 'lastUpdated' | 'purchasesCount'>>({
    title: '',
    author: '',
    price: 0,
    currency: 'ج.م',
    status: 'draft',
    cover: '',
    description: '',
    category: '',
    pages: 0
  });

  // Filtered books based on search and filters
  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      (showPublished && book.status === 'published') ||
      (showDrafts && book.status === 'draft');
    
    return matchesSearch && matchesStatus;
  });

  // Handle adding new book
  const handleAddBook = () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const newBookWithId: BookItem = {
      ...newBook,
      id: `book-${books.length + 1}`,
      lastUpdated: formattedDate,
      purchasesCount: 0
    };
    
    setBooks([...books, newBookWithId]);
    setIsAddDialogOpen(false);
    setNewBook({
      title: '',
      author: '',
      price: 0,
      currency: 'ج.م',
      status: 'draft',
      cover: '',
      description: '',
      category: '',
      pages: 0
    });
    
    toast.success('تم إضافة الكتاب بنجاح');
  };

  // Handle updating book
  const handleUpdateBook = () => {
    if (!selectedBook) return;
    
    const now = new Date();
    const formattedDate = now.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const updatedBooks = books.map(book => 
      book.id === selectedBook.id 
        ? { ...selectedBook, lastUpdated: formattedDate } 
        : book
    );
    
    setBooks(updatedBooks);
    setIsEditDialogOpen(false);
    
    toast.success('تم تحديث الكتاب بنجاح');
  };

  // Handle deleting book
  const handleDeleteBook = () => {
    if (!selectedBook) return;
    
    const updatedBooks = books.filter(book => book.id !== selectedBook.id);
    setBooks(updatedBooks);
    setIsDeleteDialogOpen(false);
    
    toast.success('تم حذف الكتاب بنجاح');
  };

  // Handle toggling book status
  const handleToggleStatus = (book: BookItem) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const updatedBooks = books.map(item => 
      item.id === book.id
        ? { 
            ...item, 
            status: item.status === 'published' ? 'draft' : 'published',
            lastUpdated: formattedDate
          }
        : item
    );
    
    setBooks(updatedBooks);
    
    toast.success(
      `تم ${book.status === 'published' ? 'إلغاء نشر' : 'نشر'} الكتاب بنجاح`
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            إضافة كتاب جديد
          </Button>
          <Button 
            variant="outline" 
            onClick={() => toast.success('تم تحديث البيانات')}
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
              <DropdownMenuLabel>تصفية حسب الحالة</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => {
                  setShowPublished(true);
                  setShowDrafts(true);
                }}
              >
                الكل
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  setShowPublished(true);
                  setShowDrafts(false);
                }}
              >
                المنشورة فقط
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  setShowPublished(false);
                  setShowDrafts(true);
                }}
              >
                المسودات فقط
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="ابحث عن كتاب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-3 pr-10"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-gray-500 font-medium">الكتاب</th>
              <th className="py-3 px-4 text-gray-500 font-medium">المؤلف</th>
              <th className="py-3 px-4 text-gray-500 font-medium">السعر</th>
              <th className="py-3 px-4 text-gray-500 font-medium">المشتريات</th>
              <th className="py-3 px-4 text-gray-500 font-medium">الحالة</th>
              <th className="py-3 px-4 text-gray-500 font-medium">آخر تحديث</th>
              <th className="py-3 px-4 text-gray-500 font-medium">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  لا توجد كتب متطابقة مع البحث
                </td>
              </tr>
            ) : (
              filteredBooks.map((book) => (
                <tr key={book.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="h-14 w-10 rounded overflow-hidden ml-2">
                        <img 
                          src={book.cover} 
                          alt={book.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="font-medium">{book.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{book.author}</td>
                  <td className="py-3 px-4 text-gray-600">{book.price} {book.currency}</td>
                  <td className="py-3 px-4 text-gray-600">{book.purchasesCount}</td>
                  <td className="py-3 px-4">
                    <Badge 
                      variant={book.status === 'published' ? 'secondary' : 'outline'}
                      className={book.status === 'published' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                      onClick={() => handleToggleStatus(book)}
                    >
                      {book.status === 'published' ? 'منشور' : 'مسودة'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{book.lastUpdated}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedBook(book);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
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
                        onClick={() => {
                          setSelectedBook(book);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Add Book Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>إضافة كتاب جديد</DialogTitle>
            <DialogDescription>
              أضف كتاب جديد إلى المكتبة
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">عنوان الكتاب</Label>
                <Input
                  id="title"
                  placeholder="أدخل عنوان الكتاب"
                  value={newBook.title}
                  onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="author">المؤلف</Label>
                <Input
                  id="author"
                  placeholder="اسم المؤلف"
                  value={newBook.author}
                  onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">السعر</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  value={newBook.price.toString()}
                  onChange={(e) => setNewBook({
                    ...newBook, 
                    price: parseFloat(e.target.value) || 0
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currency">العملة</Label>
                <Input
                  id="currency"
                  placeholder="ج.م"
                  value={newBook.currency}
                  onChange={(e) => setNewBook({...newBook, currency: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">التصنيف</Label>
                <Input
                  id="category"
                  placeholder="تصنيف الكتاب"
                  value={newBook.category || ''}
                  onChange={(e) => setNewBook({...newBook, category: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pages">عدد الصفحات</Label>
                <Input
                  id="pages"
                  type="number"
                  placeholder="0"
                  value={newBook.pages?.toString() || ''}
                  onChange={(e) => setNewBook({
                    ...newBook, 
                    pages: parseInt(e.target.value) || 0
                  })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cover">رابط صورة الغلاف</Label>
              <Input
                id="cover"
                placeholder="رابط صورة الغلاف"
                value={newBook.cover}
                onChange={(e) => setNewBook({...newBook, cover: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">وصف الكتاب</Label>
              <Textarea
                id="description"
                placeholder="وصف تفصيلي للكتاب..."
                value={newBook.description || ''}
                onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">الحالة</Label>
              <div className="flex gap-4">
                <Label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={newBook.status === 'draft'}
                    onChange={() => setNewBook({...newBook, status: 'draft'})}
                  />
                  مسودة
                </Label>
                <Label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={newBook.status === 'published'}
                    onChange={() => setNewBook({...newBook, status: 'published'})}
                  />
                  منشور
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={handleAddBook}>إضافة الكتاب</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Book Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تعديل الكتاب</DialogTitle>
            <DialogDescription>
              قم بتعديل معلومات الكتاب
            </DialogDescription>
          </DialogHeader>
          {selectedBook && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">عنوان الكتاب</Label>
                  <Input
                    id="edit-title"
                    value={selectedBook.title}
                    onChange={(e) => setSelectedBook({
                      ...selectedBook, 
                      title: e.target.value
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-author">المؤلف</Label>
                  <Input
                    id="edit-author"
                    value={selectedBook.author}
                    onChange={(e) => setSelectedBook({
                      ...selectedBook, 
                      author: e.target.value
                    })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">السعر</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={selectedBook.price}
                    onChange={(e) => setSelectedBook({
                      ...selectedBook, 
                      price: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-currency">العملة</Label>
                  <Input
                    id="edit-currency"
                    value={selectedBook.currency}
                    onChange={(e) => setSelectedBook({
                      ...selectedBook, 
                      currency: e.target.value
                    })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">التصنيف</Label>
                  <Input
                    id="edit-category"
                    value={selectedBook.category || ''}
                    onChange={(e) => setSelectedBook({
                      ...selectedBook, 
                      category: e.target.value
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-pages">عدد الصفحات</Label>
                  <Input
                    id="edit-pages"
                    type="number"
                    value={selectedBook.pages?.toString() || ''}
                    onChange={(e) => setSelectedBook({
                      ...selectedBook, 
                      pages: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-cover">رابط صورة الغلاف</Label>
                <Input
                  id="edit-cover"
                  value={selectedBook.cover}
                  onChange={(e) => setSelectedBook({
                    ...selectedBook, 
                    cover: e.target.value
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">وصف الكتاب</Label>
                <Textarea
                  id="edit-description"
                  value={selectedBook.description || ''}
                  onChange={(e) => setSelectedBook({
                    ...selectedBook, 
                    description: e.target.value
                  })}
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">الحالة</Label>
                <div className="flex gap-4">
                  <Label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={selectedBook.status === 'draft'}
                      onChange={() => setSelectedBook({
                        ...selectedBook, 
                        status: 'draft'
                      })}
                    />
                    مسودة
                  </Label>
                  <Label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={selectedBook.status === 'published'}
                      onChange={() => setSelectedBook({
                        ...selectedBook, 
                        status: 'published'
                      })}
                    />
                    منشور
                  </Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={handleUpdateBook}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Book Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تفاصيل الكتاب</DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <div className="py-4">
              <div className="flex mb-6 gap-6">
                <div className="w-24 h-36 rounded overflow-hidden flex-shrink-0">
                  <img 
                    src={selectedBook.cover} 
                    alt={selectedBook.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 flex-grow">
                  <h3 className="text-xl font-bold">{selectedBook.title}</h3>
                  <div className="text-gray-600">تأليف: {selectedBook.author}</div>
                  <div className="text-gray-600">
                    {selectedBook.category && <span>التصنيف: {selectedBook.category} • </span>}
                    {selectedBook.pages && <span>{selectedBook.pages} صفحة • </span>}
                    <span>{selectedBook.price} {selectedBook.currency}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant={selectedBook.status === 'published' ? 'secondary' : 'outline'}
                      className={selectedBook.status === 'published' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {selectedBook.status === 'published' ? 'منشور' : 'مسودة'}
                    </Badge>
                    <span className="text-sm text-gray-500">آخر تحديث: {selectedBook.lastUpdated}</span>
                  </div>
                </div>
              </div>

              {selectedBook.description && (
                <div className="mb-6">
                  <h4 className="font-bold mb-2">الوصف:</h4>
                  <p className="text-gray-700">{selectedBook.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-bold mb-2">إحصائيات:</h4>
                  <div className="text-gray-700">عدد المشتريات: {selectedBook.purchasesCount}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button>إغلاق</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Book Dialog */}
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
    </div>
  );
};

export default AdminBooksList;
