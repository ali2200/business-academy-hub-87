
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronLeft, BookOpen, Star, Check, Award, User, Clock, Calendar, Play } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import HtmlPreview from '@/components/HtmlPreview';
import BookPreviewDialog from '@/components/BookPreviewDialog';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isSticky, setIsSticky] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [book, setBook] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // جلب بيانات الكتاب من Supabase
  const fetchBookDetails = async () => {
    try {
      setIsLoading(true);
      
      if (!id) {
        setError('معرف الكتاب غير صحيح');
        return;
      }
      
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .single();
      
      if (error) {
        console.error('Error fetching book details:', error);
        setError('فشل في تحميل بيانات الكتاب');
        return;
      }
      
      if (!data) {
        setError('الكتاب غير موجود أو غير متاح حالياً');
        return;
      }
      
      setBook(data);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBookDetails();

    const handleScroll = () => {
      setIsSticky(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  const handleBuy = () => {
    toast.success("تم إضافة الكتاب إلى سلة المشتريات", {
      description: "يمكنك متابعة عملية الشراء الآن",
      action: {
        label: "عرض السلة",
        onClick: () => console.log("Redirecting to cart"),
      },
    });
  };
  
  const handleReadBook = () => {
    navigate(`/book-reader/${id}`);
  };

  const handlePreviewBook = () => {
    setShowPreview(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-16 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <span className="mr-3">جاري تحميل بيانات الكتاب...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-16 container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">عفواً، لا يمكن عرض الكتاب</h1>
          <p className="text-gray-600 mb-8">{error || 'الكتاب غير موجود أو غير متاح حالياً'}</p>
          <Link to="/books">
            <Button>العودة إلى قائمة الكتب</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // تحضير البيانات لعرضها
  const rating = 4.7; 
  const reviewCount = 85;

  // محتويات الكتاب
  const tableOfContents = [
    {
      title: 'الفصل الأول: مقدمة في البيع الاحترافي',
      sections: [
        'مفهوم البيع ودوره في نجاح الأعمال',
        'التطور التاريخي لمفهوم البيع',
        'الصفات الأساسية لمندوب المبيعات الناجح',
        'الفرق بين البيع والتسويق'
      ]
    },
    {
      title: 'الفصل الثاني: استراتيجيات البيع الحديثة',
      sections: [
        'البيع القائم على القيمة',
        'البيع القائم على العلاقات',
        'البيع الاستشاري',
        'البيع عبر الإنترنت'
      ]
    },
  ];

  // ما ستتعلمه
  const benefits = [
    'تعلم أساسيات ومهارات البيع الاحترافي',
    'تطوير قدراتك في الإقناع والتفاوض',
    'فهم سلوك المستهلك واحتياجاته',
    'اكتساب مهارات التعامل مع اعتراضات العملاء',
    'إتقان تقنيات إغلاق الصفقات بنجاح',
    'تطبيق الاستراتيجيات على السوق المحلي',
    'دراسة حالات نجاح واقعية من السوق'
  ];

  // الفئة المستهدفة
  const targetAudience = [
    'مندوبي المبيعات الجدد',
    'رواد الأعمال وأصحاب المشاريع الصغيرة',
    'مديري المبيعات والتسويق',
    'أي شخص يرغب في تحسين مهارات البيع والإقناع'
  ];

  // المحتويات
  const contents = [
    'لا يشترط خبرة سابقة في المبيعات',
    'الرغبة في تعلم مهارات البيع الاحترافي',
    'الالتزام بتطبيق التمارين العملية',
    'جهاز كمبيوتر أو هاتف ذكي للوصول إلى المحتوى'
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Book Header */}
      <section className="pt-28 pb-12 bg-gradient-to-b from-primary/5 to-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
            <ChevronLeft size={14} className="mx-2" />
            <Link to="/books" className="hover:text-primary transition-colors">الكتب</Link>
            <ChevronLeft size={14} className="mx-2" />
            <span className="text-primary">{book.title}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 animate-fade-in">
              <h1 className="text-3xl md:text-5xl font-bold mb-2 text-primary">{book.title}</h1>
              <h2 className="text-xl text-gray-600 mb-6">{book.subtitle || book.category}</h2>
              
              <div className="text-gray-600 mb-6 leading-relaxed">
                {book.description ? (
                  <HtmlPreview 
                    htmlContent={book.description} 
                    visible={true} 
                    className="prose prose-sm max-w-none pt-0" 
                  />
                ) : (
                  <p>دورة شاملة لتعلم أساسيات ومهارات البيع الاحترافي وتقنيات الإقناع والتفاوض لتحسين أدائك كمندوب مبيعات وزيادة معدلات إغلاق الصفقات بنجاح.</p>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center">
                  <BookOpen className="w-6 h-6 text-primary mb-2" />
                  <div className="text-sm text-gray-600">
                    <span className="font-bold text-primary block text-lg">{book.pages || 125}</span>
                    صفحة
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <Calendar className="w-6 h-6 text-primary mb-2" />
                  <div className="text-sm text-gray-600">
                    <span className="font-bold text-primary block text-lg">
                      {formatDate(book.created_at).split(" ")[2]}
                    </span>
                    تاريخ النشر
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <Star className="w-6 h-6 text-primary mb-2 fill-yellow-400 text-yellow-400" />
                  <div className="text-sm text-gray-600">
                    <span className="font-bold text-primary block text-lg">{rating}</span>
                    تقييم
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mb-8">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(book.author)}&background=random`} 
                  alt={book.author} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-secondary"
                />
                <div className="mr-3">
                  <p className="font-semibold text-primary">{book.author}</p>
                  <p className="text-sm text-gray-500">مؤلف الكتاب</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  className="bg-secondary hover:bg-secondary-light text-white px-8 py-6 rounded-xl flex items-center justify-center space-x-2 rtl:space-x-reverse shadow-lg hover:shadow-xl transition-all"
                  onClick={handleBuy}
                >
                  <ShoppingCart size={20} />
                  <span className="text-lg">اشتري الآن</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 rounded-xl flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all"
                  onClick={handlePreviewBook}
                >
                  <Play size={20} />
                  <span className="text-lg">شاهد مقدمة الكتاب</span>
                </Button>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl transform rotate-3"></div>
                <div className="glassmorphism p-2 rounded-2xl shadow-xl relative z-10">
                  <img 
                    src={book.cover_url || '/placeholder.svg'} 
                    alt={book.title} 
                    className="w-full h-auto rounded-xl object-cover aspect-[3/4]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-5 -right-5 bg-white p-3 rounded-xl shadow-lg animate-float">
                  <div className="text-center">
                    <div className="text-sm font-semibold">{book.category || 'كتاب إلكتروني'}</div>
                  </div>
                </div>
                
                <div className="absolute -bottom-5 -left-5 bg-white p-3 rounded-xl shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                  <div className="text-center">
                    <div className="text-secondary font-bold text-xl">{book.price} {book.currency}</div>
                    <div className="text-xs text-gray-500 line-through">{Math.round(book.price * 1.5)} {book.currency}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Book Details Tabs */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main content */}
            <div className="lg:col-span-8">
              <Tabs 
                value={selectedTab} 
                onValueChange={setSelectedTab} 
                className="w-full"
              >
                <TabsList className="mb-8 bg-white p-1 rounded-xl shadow-sm w-full flex justify-between">
                  <TabsTrigger value="overview" className="py-3 px-6 rounded-lg flex-1 data-[state=active]:bg-primary data-[state=active]:text-white">
                    نظرة عامة
                  </TabsTrigger>
                  <TabsTrigger value="contents" className="py-3 px-6 rounded-lg flex-1 data-[state=active]:bg-primary data-[state=active]:text-white">
                    المحتويات
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="py-3 px-6 rounded-lg flex-1 data-[state=active]:bg-primary data-[state=active]:text-white">
                    التقييمات
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="bg-white rounded-xl p-6 shadow-sm animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6 text-primary">عن الكتاب</h2>
                  {book.description ? (
                    <HtmlPreview 
                      htmlContent={book.description} 
                      visible={true} 
                      className="prose prose-lg max-w-none mb-8" 
                    />
                  ) : (
                    <p className="text-gray-700 mb-8 leading-relaxed">
                      دورة شاملة لتعلم أساسيات ومهارات البيع الاحترافي وتقنيات الإقناع والتفاوض لتحسين أدائك كمندوب مبيعات وزيادة معدلات إغلاق الصفقات بنجاح.
                    </p>
                  )}
                  
                  <h3 className="text-xl font-bold mb-4 text-primary">ما ستتعلمه</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start">
                        <Check size={20} className="text-green-500 mt-1 ml-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-primary">الفئة المستهدفة</h3>
                  <ul className="mb-8">
                    {targetAudience.map((audience, index) => (
                      <li key={index} className="flex items-start mb-2">
                        <div className="h-2 w-2 bg-primary rounded-full mt-2 ml-3 flex-shrink-0"></div>
                        <span>{audience}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <h3 className="text-xl font-bold mb-4 text-primary">المحتويات</h3>
                  <ul className="mb-8">
                    {contents.map((content, index) => (
                      <li key={index} className="flex items-start mb-2">
                        <div className="h-2 w-2 bg-primary rounded-full mt-2 ml-3 flex-shrink-0"></div>
                        <span>{content}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                
                <TabsContent value="contents" className="bg-white rounded-xl p-6 shadow-sm animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6 text-primary">محتويات الكتاب</h2>
                  <div className="space-y-6">
                    {tableOfContents.map((chapter, chapterIndex) => (
                      <div key={chapterIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-4">
                          <h3 className="font-bold text-lg text-primary">{chapter.title}</h3>
                        </div>
                        <div className="p-3">
                          <ul className="space-y-2">
                            {chapter.sections.map((section, sectionIndex) => (
                              <li key={sectionIndex} className="flex items-center p-2 border-b last:border-0 border-gray-100">
                                <div className="h-2 w-2 bg-secondary rounded-full ml-3"></div>
                                <span>{section}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="bg-white rounded-xl p-6 shadow-sm animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6 text-primary">تقييمات القراء</h2>
                  <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="bg-gray-50 p-6 rounded-lg text-center flex-shrink-0">
                      <div className="text-5xl font-bold text-primary mb-2">{rating}</div>
                      <div className="flex justify-center text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={18}
                            className={i < Math.floor(rating) ? "fill-yellow-400" : "fill-gray-300"}
                          />
                        ))}
                      </div>
                      <div className="text-gray-500">{reviewCount} تقييم</div>
                    </div>
                    
                    <div className="flex-grow">
                      <p className="text-gray-600 text-center py-12">
                        لا توجد تقييمات لهذا الكتاب حالياً، كن أول من يقيم هذا الكتاب
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Book details sidebar */}
            <div className="lg:col-span-4">
              <Card className={`bg-white rounded-xl shadow-lg border-none overflow-hidden ${isSticky ? 'lg:sticky lg:top-24' : ''} transition-all`}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-6">تفاصيل الشراء</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">السعر</span>
                      <div>
                        <span className="text-secondary font-bold text-xl">{book.price} {book.currency}</span>
                        <span className="text-sm text-gray-500 line-through mr-2">{Math.round(book.price * 1.5)} {book.currency}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">الصيغة</span>
                      <span className="font-medium">كتاب إلكتروني + نسخة PDF</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">عدد الصفحات</span>
                      <span className="font-medium">{book.pages || '--'} صفحة</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">تاريخ النشر</span>
                      <span className="font-medium">
                        {formatDate(book.created_at)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">الإتاحة</span>
                      <span className="font-medium text-green-500">متوفر</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-secondary hover:bg-secondary-light text-white py-6 rounded-xl flex items-center justify-center space-x-2 rtl:space-x-reverse shadow-lg hover:shadow-xl transition-all mb-4"
                    onClick={handleBuy}
                  >
                    <ShoppingCart size={20} />
                    <span className="text-lg">اشتري الآن</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white py-6 rounded-xl flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all mb-4"
                    onClick={handlePreviewBook}
                  >
                    <Play size={20} />
                    <span className="text-lg">شاهد مقدمة الكتاب</span>
                  </Button>
                  
                  {book.pdf_url && (
                    <Button 
                      variant="outline" 
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white py-6 rounded-xl flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all"
                      onClick={handleReadBook}
                    >
                      <BookOpen size={20} />
                      <span className="text-lg">قراءة الكتاب</span>
                    </Button>
                  )}
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-bold text-primary mb-2">مميزات الشراء</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Check size={16} className="text-green-500 ml-2" />
                        <span className="text-sm">وصول فوري بعد الشراء</span>
                      </li>
                      <li className="flex items-center">
                        <Check size={16} className="text-green-500 ml-2" />
                        <span className="text-sm">قراءة على جميع الأجهزة</span>
                      </li>
                      <li className="flex items-center">
                        <Check size={16} className="text-green-500 ml-2" />
                        <span className="text-sm">دعم فني على مدار الساعة</span>
                      </li>
                      <li className="flex items-center">
                        <Check size={16} className="text-green-500 ml-2" />
                        <span className="text-sm">ضمان استرداد المال خلال 30 يوم</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Book Preview Dialog */}
      <BookPreviewDialog
        book={book}
        open={showPreview}
        onOpenChange={setShowPreview}
      />
      
      <Footer />
    </div>
  );
};

export default BookDetail;
