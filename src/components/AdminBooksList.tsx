import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  Pencil, 
  Trash2, 
  Plus, 
  Search, 
  BookOpenText,
  FileText,
  BookOpen
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import BookDetailsDialog from './BookDetailsDialog';
import BookEditDialog from './BookEditDialog';

const AdminBooksList = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<any>(null);
  const [bookDetailsDialogOpen, setBookDetailsDialogOpen] = useState(false);
  const [bookEditDialogOpen, setBookEditDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching books:', error);
        toast.error('فشل في تحميل قائمة الكتب');
        return;
      }
      
      setBooks(data || []);
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async () => {
    if (!bookToDelete) return;
    
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookToDelete.id);
      
      if (error) {
        console.error('Error deleting book:', error);
        toast.error('فشل في حذف الكتاب');
        return;
      }
      
      if (bookToDelete.cover_url) {
        const coverPath = bookToDelete.cover_url.split('/').pop();
        const { error: coverDeleteError } = await supabase.storage
          .from('book-covers')
          .remove([coverPath]);
        
        if (coverDeleteError) {
          console.error('Error deleting cover file:', coverDeleteError);
        }
      }
      
      if (bookToDelete.pdf_url) {
        const pdfPath = bookToDelete.pdf_url.split('/').pop();
        const { error: pdfDeleteError } = await supabase.storage
          .from('book-files')
          .remove([pdfPath]);
        
        if (pdfDeleteError) {
          console.error('Error deleting PDF file:', pdfDeleteError);
        }
      }
      
      setBooks(books.filter(book => book.id !== bookToDelete.id));
      toast.success('تم حذف الكتاب بنجاح');
    } catch (err) {
      console.error('Unexpected error during deletion:', err);
      toast.error('حدث خطأ أثناء حذف الكتاب');
    } finally {
      setDeleteDialogOpen(false);
      setBookToDelete(null);
    }
  };

  const confirmDelete = (book: any) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const showBookDetails = (book: any) => {
    setSelectedBook(book);
    setBookDetailsDialogOpen(true);
  };

  const editBookDetails = (book: any) => {
    setSelectedBook(book);
    setBookEditDialogOpen(true);
  };

  const viewBookReader = (bookId: string) => {
    window.open(`/book-reader/${bookId}`, '_blank');
  };

  const filteredBooks = books.filter(book => 
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            className="pl-4 pr-10"
            placeholder="بحث عن كتاب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => navigate('/add-book')} className="w-full sm:w-auto">
          <Plus className="ml-2" size={18} />
          إضافة كتاب جديد
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الكتاب</TableHead>
              <TableHead className="text-right hidden md:table-cell">المؤلف</TableHead>
              <TableHead className="text-right hidden md:table-cell">الفئة</TableHead>
              <TableHead className="text-right">السعر</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2">جاري التحميل...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {searchTerm ? 'لا توجد كتب تطابق البحث' : 'لا توجد كتب متاحة'}
                </TableCell>
              </TableRow>
            ) : (
              filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-12 w-9 bg-gray-100 rounded overflow-hidden mr-3">
                        {book.cover_url ? (
                          <img 
                            src={book.cover_url} 
                            alt={book.title} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        ) : (
                          <BookOpenText className="h-full w-full p-2 text-gray-400" />
                        )}
                      </div>
                      <span className="font-medium">{book.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{book.author}</TableCell>
                  <TableCell className="hidden md:table-cell">{book.category || 'غير مصنف'}</TableCell>
                  <TableCell>{book.price} {book.currency}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        book.status === 'published' ? 'default' : 
                        book.status === 'draft' ? 'outline' : 'secondary'
                      }
                    >
                      {book.status === 'published' ? 'منشور' : 
                       book.status === 'draft' ? 'مسودة' : 'مراجعة'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => showBookDetails(book)}
                        title="عرض التفاصيل"
                      >
                        <Eye size={18} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => editBookDetails(book)}
                        title="تعديل"
                      >
                        <Pencil size={18} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => confirmDelete(book)}
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </Button>
                      {book.pdf_url && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => viewBookReader(book.id)}
                          title="عرض قارئ الكتاب"
                        >
                          <BookOpen size={18} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا الكتاب؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الكتاب بشكل نهائي من قاعدة البيانات وجميع الملفات المرتبطة به.
              هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedBook && (
        <BookDetailsDialog 
          book={selectedBook}
          open={bookDetailsDialogOpen}
          onOpenChange={setBookDetailsDialogOpen}
        />
      )}

      {selectedBook && (
        <BookEditDialog 
          book={selectedBook}
          open={bookEditDialogOpen}
          onOpenChange={setBookEditDialogOpen}
          onBookUpdated={fetchBooks}
        />
      )}
    </div>
  );
};

export default AdminBooksList;
