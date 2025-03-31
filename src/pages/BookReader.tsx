
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Bookmark, BookOpen, Share, Download, Menu, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from '@/components/Navbar';

// تعديل مكون BookReader لاستخدام بيانات من Supabase
const BookReader = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkNote, setBookmarkNote] = useState("");
  const [bookmarkTitle, setBookmarkTitle] = useState("");
  const [isBookmarkDialogOpen, setIsBookmarkDialogOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // Fetch book data
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setIsLoading(true);
        
        if (!bookId) {
          setError('معرف الكتاب غير صحيح');
          return;
        }
        
        // Fetch book details from Supabase
        const { data: bookData, error: bookError } = await supabase
          .from('books')
          .select('*')
          .eq('id', bookId)
          .single();
        
        if (bookError) {
          console.error('Error fetching book:', bookError);
          setError('فشل في تحميل بيانات الكتاب');
          return;
        }
        
        if (!bookData) {
          setError('الكتاب غير موجود');
          return;
        }
        
        // Check if PDF is available
        if (!bookData.pdf_url) {
          setError('ملف الكتاب غير متوفر');
          return;
        }
        
        // Load mock data for book content and chapters for now
        // In a real app, you would fetch these from your backend
        const mockBook = {
          ...bookData,
          readPages: Math.floor(bookData.pages ? bookData.pages / 2 : 50), // As an example
          bookmarks: [
            { id: 1, page: 24, title: 'ملاحظة مهمة', note: 'تذكر هذه النقطة للاستفادة منها' },
            { id: 2, page: 58, title: 'مفهوم أساسي', note: 'يجب مراجعة هذا المفهوم لاحقًا' },
          ],
          chapters: Array.from({ length: 10 }, (_, i) => ({
            id: String(i + 1),
            title: `الفصل ${i + 1}: عنوان الفصل`,
            page: i * Math.floor((bookData.pages || 100) / 10) + 1
          })),
          content: Array.from({ length: 10 }, (_, i) => (
            `<h1>الفصل ${i + 1}</h1>
            <p>هذا هو محتوى الفصل ${i + 1} من الكتاب. في نسخة واقعية من التطبيق، سيتم استبدال هذا بالمحتوى الفعلي للكتاب من قاعدة البيانات أو من ملف PDF محول.</p>
            <p>يمكنك تقليب الصفحات باستخدام الأزرار في الأسفل أو بالضغط على السهم الأيمن والأيسر في لوحة المفاتيح.</p>
            <h2>قسم فرعي ${i + 1}.1</h2>
            <p>هذا هو محتوى القسم الفرعي الأول من الفصل ${i + 1}. يمكنك إضافة إشارات مرجعية للصفحات المهمة للرجوع إليها لاحقًا.</p>
            <ul>
              <li>نقطة مهمة 1</li>
              <li>نقطة مهمة 2</li>
              <li>نقطة مهمة 3</li>
            </ul>
            <h2>قسم فرعي ${i + 1}.2</h2>
            <p>هذا هو محتوى القسم الفرعي الثاني من الفصل ${i + 1}. استمتع بالقراءة!</p>`
          ))
        };
        
        setBook(mockBook);
        setBookmarks(mockBook.bookmarks || []);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('حدث خطأ غير متوقع أثناء تحميل الكتاب');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookData();
  }, [bookId]);

  // Handle page navigation
  const handlePageChange = (page: number) => {
    if (!book) return;
    
    if (page < 1) return;
    if (page > (book.pages || 100)) return;
    
    setCurrentPage(page);
    
    // في تطبيق حقيقي، ستقوم بحفظ تقدم القراءة في قاعدة البيانات
    if (page > book.readPages) {
      setBook(prev => ({
        ...prev,
        readPages: page
      }));
      
      console.log(`Updated reading progress to page ${page}`);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        // للتنقل للصفحة السابقة في اللغة العربية (اتجاه القراءة من اليمين لليسار)
        handlePageChange(currentPage - 1);
      } else if (e.key === 'ArrowLeft') {
        // للتنقل للصفحة التالية في اللغة العربية
        handlePageChange(currentPage + 1);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

  // Bookmark functions
  const toggleBookmark = () => {
    // التحقق مما إذا كانت الصفحة الحالية مرجعية بالفعل
    const existingBookmark = bookmarks.find(b => b.page === currentPage);
    
    if (existingBookmark) {
      // إزالة الإشارة المرجعية
      setBookmarks(bookmarks.filter(b => b.page !== currentPage));
      toast.success("تم إزالة الإشارة المرجعية");
    } else {
      // فتح مربع حوار لإضافة إشارة مرجعية جديدة
      setBookmarkTitle("");
      setBookmarkNote("");
      setIsBookmarkDialogOpen(true);
    }
  };

  const addBookmark = () => {
    // إضافة إشارة مرجعية جديدة
    const newBookmark = {
      id: Date.now(),
      page: currentPage,
      title: bookmarkTitle || `صفحة ${currentPage}`,
      note: bookmarkNote
    };
    
    setBookmarks([...bookmarks, newBookmark]);
    setIsBookmarkDialogOpen(false);
    toast.success("تم إضافة إشارة مرجعية جديدة");
  };

  const goToBookmark = (page: number) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
  };

  const shareBook = () => {
    // نسخ الرابط إلى الحافظة
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success("تم نسخ رابط الكتاب", {
        description: "يمكنك الآن مشاركته مع أصدقائك"
      });
    }).catch(err => {
      console.error('Failed to copy URL:', err);
      toast.error("فشل نسخ الرابط");
    });
  };

  const downloadBook = () => {
    if (book && book.pdf_url) {
      // فتح رابط PDF في نافذة جديدة
      window.open(book.pdf_url, '_blank');
      toast.success("جاري تحميل الكتاب", {
        description: "سيبدأ التحميل خلال لحظات"
      });
    } else {
      toast.error("ملف الكتاب غير متوفر");
    }
  };

  // حساب نسبة التقدم
  const calculateProgress = () => {
    if (!book) return 0;
    return Math.round((book.readPages / (book.pages || 100)) * 100);
  };

  // الحصول على محتوى الصفحة الحالية
  const getContent = () => {
    if (!book || !book.content) return '<p>المحتوى غير متوفر</p>';
    
    // للتبسيط، نستخدم مؤشر الصفحة الحالية للدوران في المحتوى المتاح
    return book.content[currentPage % book.content.length];
  };

  // الحصول على الفصل الحالي
  const getCurrentChapter = () => {
    if (!book || !book.chapters || book.chapters.length === 0) {
      return { title: 'الكتاب', page: 1 };
    }
    
    for (let i = book.chapters.length - 1; i >= 0; i--) {
      if (currentPage >= book.chapters[i].page) {
        return book.chapters[i];
      }
    }
    
    return book.chapters[0];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الكتاب...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-2">عفواً، لا يمكن عرض الكتاب</h2>
          <p className="text-gray-600 mb-6">{error || 'حدث خطأ أثناء تحميل الكتاب'}</p>
          <Button onClick={() => navigate('/books')} className="mr-2">
            عرض جميع الكتب
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            العودة للصفحة السابقة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="pt-20 pb-12 flex-grow">
        <div className="container mx-auto px-4 relative">
          {/* Book header */}
          <div className="mb-6 flex flex-wrap items-center justify-between">
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Link to="/books" className="hover:text-primary">الكتب</Link>
                <ChevronLeft className="mx-2 h-4 w-4" />
                <Link to={`/books/${book.id}`} className="hover:text-primary">{book.title}</Link>
                <ChevronLeft className="mx-2 h-4 w-4" />
                <span>قارئ الكتاب</span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-primary">{book.title}</h1>
              <p className="text-gray-600">{book.author}</p>
            </div>
            
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button
                variant="outline"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex items-center"
              >
                {isSidebarOpen ? (
                  <>
                    <X className="ml-1 h-4 w-4" />
                    <span>إغلاق القائمة</span>
                  </>
                ) : (
                  <>
                    <Menu className="ml-1 h-4 w-4" />
                    <span>محتويات الكتاب</span>
                  </>
                )}
              </Button>
              
              <Button 
                variant={bookmarks.some(b => b.page === currentPage) ? "secondary" : "outline"}
                onClick={toggleBookmark}
                className="flex items-center"
              >
                <Bookmark className="ml-1 h-4 w-4" />
                <span>{bookmarks.some(b => b.page === currentPage) ? "إزالة الإشارة" : "إضافة إشارة"}</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={shareBook}
                className="flex items-center md:hidden"
              >
                <Share className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline"
                onClick={shareBook}
                className="hidden md:flex items-center"
              >
                <Share className="ml-1 h-4 w-4" />
                <span>مشاركة</span>
              </Button>
              
              <Button 
                onClick={downloadBook}
                className="hidden md:flex items-center"
              >
                <Download className="ml-1 h-4 w-4" />
                <span>تحميل PDF</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar for book navigation - conditionally shown on mobile */}
            {isSidebarOpen && (
              <div className="lg:hidden fixed inset-0 z-30 bg-black/50">
                <div className="absolute right-0 top-0 bottom-0 w-4/5 max-w-md bg-white h-full overflow-auto">
                  <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-primary">محتويات الكتاب</h3>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <BookSidebar 
                    book={book} 
                    bookmarks={bookmarks}
                    currentPage={currentPage} 
                    onNavigate={goToBookmark}
                  />
                </div>
              </div>
            )}
            
            {/* Desktop sidebar - always visible on large screens */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-bold text-lg text-primary">محتويات الكتاب</h3>
                </div>
                <BookSidebar 
                  book={book} 
                  bookmarks={bookmarks}
                  currentPage={currentPage} 
                  onNavigate={goToBookmark}
                />
              </div>
            </div>
            
            {/* Main content area */}
            <div className="lg:col-span-3">
              <Card className="shadow-sm">
                <CardContent className="p-6 md:p-8">
                  {/* Current chapter title */}
                  <div className="mb-6 text-center">
                    <h2 className="text-xl font-bold text-primary">{getCurrentChapter().title}</h2>
                    <p className="text-gray-500">صفحة {currentPage} من {book.pages || 100}</p>
                  </div>
                  
                  {/* Book content */}
                  <div 
                    className="prose prose-lg max-w-none prose-headings:text-primary prose-headings:font-bold prose-p:text-gray-700 prose-strong:text-gray-900 prose-li:text-gray-700"
                    dangerouslySetInnerHTML={{ __html: getContent() }}
                  />
                  
                  {/* Page navigation */}
                  <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
                    <Button 
                      variant="outline" 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="flex items-center"
                    >
                      <ArrowRight className="ml-1 h-4 w-4" />
                      <span>الصفحة السابقة</span>
                    </Button>
                    
                    <span className="text-sm text-gray-500">
                      صفحة {currentPage} من {book.pages || 100}
                    </span>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= (book.pages || 100)}
                      className="flex items-center"
                    >
                      <span>الصفحة التالية</span>
                      <ArrowLeft className="mr-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bookmark dialog */}
      {isBookmarkDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4 text-primary">إضافة إشارة مرجعية</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الإشارة</label>
                <input
                  type="text"
                  value={bookmarkTitle}
                  onChange={(e) => setBookmarkTitle(e.target.value)}
                  placeholder={`صفحة ${currentPage}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظة (اختياري)</label>
                <textarea
                  value={bookmarkNote}
                  onChange={(e) => setBookmarkNote(e.target.value)}
                  placeholder="أضف ملاحظة لهذه الإشارة..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6 gap-3">
              <Button variant="outline" onClick={() => setIsBookmarkDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={addBookmark}>
                إضافة
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

type BookSidebarProps = {
  book: any;
  bookmarks: any[];
  currentPage: number;
  onNavigate: (page: number) => void;
};

const BookSidebar = ({ book, bookmarks, currentPage, onNavigate }: BookSidebarProps) => {
  const [activeTab, setActiveTab] = useState<'toc' | 'bookmarks'>('toc');
  
  return (
    <div>
      {/* Reading progress */}
      <div className="p-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>تقدم القراءة</span>
          <span>{Math.round((book.readPages / (book.pages || 100)) * 100)}%</span>
        </div>
        <Progress value={(book.readPages / (book.pages || 100)) * 100} className="h-2" />
        <div className="text-xs text-gray-500 mt-1">
          {book.readPages} من {book.pages || 100} صفحة
        </div>
      </div>
      
      {/* Tabs for TOC and Bookmarks */}
      <div className="px-4 border-t border-gray-100">
        <div className="flex space-x-4 rtl:space-x-reverse -mb-px">
          <button
            className={`py-3 px-1 border-b-2 text-sm font-medium ${
              activeTab === 'toc' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('toc')}
          >
            الفهرس
          </button>
          <button
            className={`py-3 px-1 border-b-2 text-sm font-medium ${
              activeTab === 'bookmarks' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('bookmarks')}
          >
            الإشارات المرجعية
          </button>
        </div>
      </div>
      
      {/* Tab content */}
      <ScrollArea className="h-[60vh]">
        {activeTab === 'toc' ? (
          <div className="p-4">
            {book.chapters && book.chapters.length > 0 ? (
              book.chapters.map((chapter: any) => (
                <button
                  key={chapter.id}
                  onClick={() => onNavigate(chapter.page)}
                  className={`w-full text-right px-3 py-2 rounded-md mb-1 ${
                    currentPage >= chapter.page && 
                    (book.chapters[parseInt(chapter.id)] 
                      ? currentPage < book.chapters[parseInt(chapter.id)].page 
                      : true)
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <BookOpen className="ml-2 h-4 w-4" />
                    <div>
                      <p className="font-medium">{chapter.title}</p>
                      <p className="text-xs opacity-80">صفحة {chapter.page}</p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                <p>لا يوجد فهرس متاح لهذا الكتاب</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4">
            {bookmarks.length > 0 ? (
              bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="mb-3">
                  <button
                    onClick={() => onNavigate(bookmark.page)}
                    className={`w-full text-right px-3 py-3 rounded-md ${
                      currentPage === bookmark.page
                        ? 'bg-primary text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <Bookmark className="ml-2 h-4 w-4" />
                      <div>
                        <p className="font-medium">{bookmark.title}</p>
                        <p className="text-xs opacity-80">صفحة {bookmark.page}</p>
                        {bookmark.note && (
                          <p className={`text-xs mt-1 ${currentPage === bookmark.page ? 'text-white/80' : 'text-gray-500'}`}>
                            {bookmark.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Bookmark className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                <p>لم تقم بإضافة أي إشارات مرجعية بعد</p>
                <p className="text-sm mt-1">اضغط على زر "إضافة إشارة" أثناء القراءة</p>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default BookReader;
