
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Bookmark, BookOpen, Share, Download, Menu, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from '@/components/Navbar';

// Mock book data
const BOOK_DATA = {
  id: '1',
  title: 'أسرار البيع الناجح',
  author: 'د. أحمد محمد',
  cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop',
  description: 'يقدم هذا الكتاب استراتيجيات متطورة وأسرار البيع الناجح التي يستخدمها كبار المبيعات في العالم. من خلال هذا الكتاب، ستتعلم كيف تتغلب على اعتراضات العملاء وكيف تبني علاقات طويلة المدى معهم.',
  rating: 4.7,
  reviewsCount: 86,
  pages: 280,
  readPages: 145,
  publishDate: '12 مارس 2022',
  language: 'العربية',
  categories: ['مبيعات', 'تسويق', 'تطوير الذات'],
  bookmarks: [
    { id: 1, page: 24, title: 'أساسيات البيع', note: 'مبادئ هامة للمبتدئين' },
    { id: 2, page: 78, title: 'استراتيجيات الإقناع', note: 'تقنيات متقدمة في الإقناع' },
    { id: 3, page: 145, title: 'التعامل مع الاعتراضات', note: 'كيفية الرد على اعتراضات العملاء' },
  ],
  chapters: [
    { id: '1', title: 'مقدمة عن البيع', page: 1 },
    { id: '2', title: 'فهم نفسية العميل', page: 15 },
    { id: '3', title: 'بناء العلاقات مع العملاء', page: 42 },
    { id: '4', title: 'تقنيات العرض الفعال', page: 67 },
    { id: '5', title: 'استراتيجيات الإقناع', page: 95 },
    { id: '6', title: 'التعامل مع الاعتراضات', page: 127 },
    { id: '7', title: 'إتمام عملية البيع', page: 168 },
    { id: '8', title: 'خدمة ما بعد البيع', page: 198 },
    { id: '9', title: 'بناء سمعة قوية', page: 230 },
    { id: '10', title: 'استراتيجيات التطوير المستمر', page: 252 },
  ],
  content: [
    `<h1>الفصل الأول: مقدمة عن البيع</h1>
    <p>البيع هو فن وعلم في آن واحد. يتطلب مهارات خاصة ومعرفة عميقة بنفسية العميل واحتياجاته. في هذا الفصل، سنتعرف على المبادئ الأساسية للبيع الناجح والصفات التي يجب أن يتحلى بها البائع المحترف.</p>
    <p>يعتبر البيع من أقدم المهن في التاريخ، حيث بدأ الإنسان بتبادل السلع والخدمات منذ فجر الحضارة. ومع تطور المجتمعات والاقتصادات، تطورت معها مفاهيم وتقنيات البيع لتصبح أكثر تعقيدًا وتخصصًا.</p>
    <h2>لماذا يُعتبر البيع مهمًا؟</h2>
    <p>البيع هو المحرك الأساسي لأي نشاط تجاري. بدون مبيعات، لا يمكن لأي شركة أو مؤسسة أن تستمر وتنمو. كما أن البيع يساهم في:</p>
    <ul>
      <li>تحقيق الإيرادات والأرباح للشركات</li>
      <li>توفير المنتجات والخدمات التي يحتاجها المستهلكون</li>
      <li>خلق فرص عمل جديدة</li>
      <li>دفع عجلة الاقتصاد</li>
    </ul>
    <h2>صفات البائع الناجح</h2>
    <p>ليس كل شخص يمكنه أن يكون بائعًا ناجحًا. هناك مجموعة من الصفات والمهارات التي يجب أن يتمتع بها البائع المحترف، ومنها:</p>
    <ul>
      <li><strong>الثقة بالنفس:</strong> يجب أن يكون البائع واثقًا من نفسه ومن المنتج أو الخدمة التي يبيعها.</li>
      <li><strong>مهارات التواصل:</strong> القدرة على الاستماع الجيد والتحدث بوضوح وإقناع.</li>
      <li><strong>المعرفة:</strong> معرفة تفاصيل المنتج أو الخدمة وكيف يمكن أن تلبي احتياجات العميل.</li>
      <li><strong>المثابرة:</strong> القدرة على مواجهة الرفض والاستمرار في المحاولة.</li>
      <li><strong>التعاطف:</strong> القدرة على فهم مشاعر واحتياجات العميل.</li>
    </ul>`,
    `<h1>الفصل الثاني: فهم نفسية العميل</h1>
    <p>فهم نفسية العميل هو أحد أهم مفاتيح النجاح في عالم المبيعات. في هذا الفصل، سنتعرف على الدوافع النفسية التي تحرك العملاء وكيفية استخدامها لتحقيق مبيعات ناجحة.</p>
    <h2>الدوافع الأساسية للشراء</h2>
    <p>هناك عدة دوافع أساسية تحرك الناس للشراء، منها:</p>
    <ul>
      <li><strong>الحاجة الفعلية:</strong> العميل يحتاج فعلًا للمنتج أو الخدمة لحل مشكلة معينة.</li>
      <li><strong>الرغبة:</strong> العميل يرغب في المنتج لإشباع رغبة شخصية، وليس بالضرورة حاجة أساسية.</li>
      <li><strong>المكانة الاجتماعية:</strong> بعض المنتجات تُشترى للتباهي أو لتعزيز المكانة الاجتماعية.</li>
      <li><strong>الأمان:</strong> شراء منتجات تعزز الشعور بالأمان والاستقرار.</li>
      <li><strong>الانتماء:</strong> شراء منتجات تعزز الشعور بالانتماء لمجموعة معينة.</li>
    </ul>
    <h2>أنماط الشخصيات وتأثيرها على قرار الشراء</h2>
    <p>يمكن تقسيم العملاء إلى عدة أنماط شخصية، ولكل نمط طريقة تفكير وتفضيلات مختلفة:</p>
    <ul>
      <li><strong>المحلل:</strong> يهتم بالتفاصيل والأرقام والإحصاءات. يحتاج إلى معلومات دقيقة قبل اتخاذ القرار.</li>
      <li><strong>المسيطر:</strong> يحب السيطرة واتخاذ القرارات بسرعة. يهتم بالنتائج أكثر من التفاصيل.</li>
      <li><strong>الودود:</strong> يهتم بالعلاقات والمشاعر. يحتاج إلى الشعور بالثقة والاطمئنان.</li>
      <li><strong>المعبر:</strong> يهتم بالابتكار والإبداع. يفضل المنتجات الفريدة والمميزة.</li>
    </ul>
    <p>فهم هذه الأنماط يساعدك على تكييف أسلوب البيع الخاص بك لتلبية احتياجات كل عميل.</p>`,
    `<h1>الفصل الثالث: بناء العلاقات مع العملاء</h1>
    <p>بناء علاقات قوية مع العملاء هو أساس النجاح على المدى الطويل في عالم المبيعات. في هذا الفصل، سنتعرف على كيفية بناء هذه العلاقات والحفاظ عليها.</p>
    <h2>أهمية بناء العلاقات</h2>
    <p>بناء علاقات قوية مع العملاء يحقق العديد من الفوائد، منها:</p>
    <ul>
      <li>زيادة ولاء العملاء وتكرار عمليات الشراء</li>
      <li>الحصول على توصيات وإحالات لعملاء جدد</li>
      <li>تقليل حساسية السعر لدى العملاء</li>
      <li>الحصول على تغذية راجعة قيمة لتحسين المنتجات والخدمات</li>
    </ul>
    <h2>استراتيجيات لبناء علاقات قوية</h2>
    <p>هناك عدة استراتيجيات يمكن اتباعها لبناء علاقات قوية مع العملاء:</p>
    <ul>
      <li><strong>الصدق والشفافية:</strong> كن صادقًا دائمًا مع عملائك. لا تبالغ في وعودك ولا تخفي المعلومات المهمة.</li>
      <li><strong>الاستماع الفعال:</strong> استمع بانتباه لاحتياجات وشكاوى العملاء. اطرح أسئلة مفتوحة للحصول على المزيد من المعلومات.</li>
      <li><strong>تقديم قيمة مضافة:</strong> قدم للعميل أكثر مما يتوقع. يمكن أن تكون هذه القيمة معلومات مفيدة، نصائح، أو خدمات إضافية.</li>
      <li><strong>المتابعة المستمرة:</strong> لا تنتهي العلاقة بمجرد إتمام عملية البيع. تابع مع العميل للتأكد من رضاه واستفادته من المنتج أو الخدمة.</li>
      <li><strong>حل المشكلات بسرعة:</strong> عندما تظهر مشكلة، بادر بحلها بسرعة وكفاءة. اعتبر الشكاوى فرصة لإظهار التزامك بخدمة العملاء.</li>
    </ul>`,
  ]
};

const BookReader = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(BOOK_DATA);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarkNote, setBookmarkNote] = useState("");
  const [bookmarkTitle, setBookmarkTitle] = useState("");
  const [isBookmarkDialogOpen, setIsBookmarkDialogOpen] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch book data from an API
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setBook(BOOK_DATA);
      setIsLoading(false);
    }, 1000);
  }, [bookId]);

  const handlePageChange = (page: number) => {
    if (page < 1) return;
    if (page > book.pages) return;
    
    setCurrentPage(page);
    
    // Update read progress
    if (page > book.readPages) {
      setBook(prev => ({
        ...prev,
        readPages: page
      }));
      
      // In a real app, you would save this progress to a database
      console.log(`Updated reading progress to page ${page}`);
    }
  };

  const toggleBookmark = () => {
    // Check if current page is already bookmarked
    const existingBookmark = book.bookmarks.find(b => b.page === currentPage);
    
    if (existingBookmark) {
      // Remove bookmark
      const updatedBookmarks = book.bookmarks.filter(b => b.page !== currentPage);
      setBook(prev => ({
        ...prev,
        bookmarks: updatedBookmarks
      }));
      
      toast.success("تم إزالة الإشارة المرجعية");
    } else {
      // Open the bookmark dialog to add a new bookmark
      setBookmarkTitle("");
      setBookmarkNote("");
      setIsBookmarkDialogOpen(true);
    }
  };

  const addBookmark = () => {
    // Add new bookmark
    const newBookmark = {
      id: Date.now(),
      page: currentPage,
      title: bookmarkTitle || `صفحة ${currentPage}`,
      note: bookmarkNote
    };
    
    setBook(prev => ({
      ...prev,
      bookmarks: [...prev.bookmarks, newBookmark]
    }));
    
    setIsBookmarkDialogOpen(false);
    toast.success("تم إضافة إشارة مرجعية جديدة");
  };

  const goToBookmark = (page: number) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
  };

  const shareBook = () => {
    toast.success("تم نسخ رابط الكتاب", {
      description: "يمكنك الآن مشاركته مع أصدقائك"
    });
  };

  const downloadBook = () => {
    toast.success("جاري تحميل الكتاب", {
      description: "سيبدأ التحميل خلال لحظات"
    });
  };

  // Calculate progress percentage
  const progressPercentage = Math.round((book.readPages / book.pages) * 100);

  // Get chapter content based on current page
  const getContent = () => {
    // For demo purposes, just cycling through the available content
    return book.content[currentPage % book.content.length];
  };

  // Get current chapter
  const getCurrentChapter = () => {
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="pt-20 pb-12 flex-grow">
        <div className="container mx-auto px-4 relative">
          {/* Book header */}
          <div className="mb-6 flex flex-wrap items-center justify-between">
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Link to="/dashboard" className="hover:text-primary">لوحة التحكم</Link>
                <ChevronLeft className="mx-2 h-4 w-4" />
                <Link to="/dashboard" className="hover:text-primary">كتبي</Link>
                <ChevronLeft className="mx-2 h-4 w-4" />
                <span>{book.title}</span>
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
                variant={book.bookmarks.some(b => b.page === currentPage) ? "secondary" : "outline"}
                onClick={toggleBookmark}
                className="flex items-center"
              >
                <Bookmark className="ml-1 h-4 w-4" />
                <span>{book.bookmarks.some(b => b.page === currentPage) ? "إزالة الإشارة" : "إضافة إشارة"}</span>
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
                    <p className="text-gray-500">صفحة {currentPage} من {book.pages}</p>
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
                      صفحة {currentPage} من {book.pages}
                    </span>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= book.pages}
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
  book: typeof BOOK_DATA;
  currentPage: number;
  onNavigate: (page: number) => void;
};

const BookSidebar = ({ book, currentPage, onNavigate }: BookSidebarProps) => {
  const [activeTab, setActiveTab] = useState<'toc' | 'bookmarks'>('toc');
  
  return (
    <div>
      {/* Reading progress */}
      <div className="p-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>تقدم القراءة</span>
          <span>{Math.round((book.readPages / book.pages) * 100)}%</span>
        </div>
        <Progress value={(book.readPages / book.pages) * 100} className="h-2" />
        <div className="text-xs text-gray-500 mt-1">
          {book.readPages} من {book.pages} صفحة
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
            {book.chapters.map((chapter) => (
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
            ))}
          </div>
        ) : (
          <div className="p-4">
            {book.bookmarks.length > 0 ? (
              book.bookmarks.map((bookmark) => (
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
