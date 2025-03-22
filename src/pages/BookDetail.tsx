
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ChevronLeft, BookOpen, Star, Check, Award, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

// Mock data for book detail
const BOOK = {
  id: 1,
  title: 'أسرار البيع الناجح',
  subtitle: 'دليلك الشامل لإتقان مهارات البيع والإقناع في السوق المصري',
  description: 'يقدم هذا الكتاب نظرة شاملة ومعمقة لأساسيات وتقنيات البيع الاحترافي، مع التركيز على السوق المصري واحتياجاته الخاصة. يغطي الكتاب استراتيجيات البيع المختلفة، مهارات التفاوض والإقناع، كيفية التعامل مع اعتراضات العملاء، وطرق إغلاق الصفقات بنجاح. كل ذلك من خلال أمثلة وقصص نجاح حقيقية من السوق المصري.',
  cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop',
  author: {
    name: 'د. أحمد محمد',
    title: 'خبير مبيعات وتطوير أعمال',
    image: 'https://i.pravatar.cc/150?img=1',
    bio: 'دكتور أحمد محمد، خبير مبيعات وتطوير أعمال بخبرة تزيد عن 15 عامًا في أكبر الشركات المصرية والعربية. ألف العديد من الكتب في مجال المبيعات وتطوير الأعمال، ودرب أكثر من 5000 متدرب على مهارات البيع والتفاوض.'
  },
  price: 199,
  originalPrice: 299,
  category: 'مبيعات',
  language: 'العربية (اللهجة المصرية)',
  pages: 280,
  publicationDate: '15 يناير 2023',
  publisher: 'دار النشر المصرية',
  isbn: '978-1-234567-89-0',
  rating: 4.8,
  reviewCount: 124,
  format: 'كتاب إلكتروني + نسخة PDF',
  preview: 'https://drive.google.com/file/sample-preview.pdf',
  tableOfContents: [
    {
      title: 'الفصل الأول: مقدمة في علم البيع',
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
    {
      title: 'الفصل الثالث: مراحل عملية البيع',
      sections: [
        'البحث عن العملاء المحتملين',
        'التواصل الأولي مع العميل',
        'تحديد احتياجات العميل',
        'تقديم العرض وشرح المميزات والفوائد',
        'التعامل مع الاعتراضات',
        'إغلاق الصفقة',
        'خدمة ما بعد البيع'
      ]
    },
    {
      title: 'الفصل الرابع: مهارات الإقناع والتأثير',
      sections: [
        'علم النفس الشرائي',
        'تقنيات الإقناع المؤثرة',
        'لغة الجسد في البيع',
        'التواصل الفعال مع العملاء',
        'بناء الثقة والمصداقية'
      ]
    },
    {
      title: 'الفصل الخامس: التعامل مع الاعتراضات',
      sections: [
        'الاعتراضات الشائعة وكيفية الرد عليها',
        'تحويل الاعتراضات إلى فرص بيع',
        'الاستماع الفعال واستيعاب مخاوف العميل',
        'تقنيات الرد على الاعتراضات'
      ]
    },
    {
      title: 'الفصل السادس: إتمام الصفقة وما بعدها',
      sections: [
        'تقنيات إغلاق الصفقة',
        'متى وكيف تقترح على العميل إتمام الشراء',
        'أهمية خدمة ما بعد البيع',
        'بناء العلاقات طويلة المدى مع العملاء',
        'تحويل العملاء إلى سفراء للعلامة التجارية'
      ]
    },
    {
      title: 'الفصل السابع: دراسات حالة من السوق المصري',
      sections: [
        'قصص نجاح لمندوبي مبيعات في السوق المصري',
        'تحليل لأفضل الممارسات في البيع في السوق المصري',
        'الدروس المستفادة من قصص النجاح',
        'التحديات الخاصة بالسوق المصري وكيفية التغلب عليها'
      ]
    }
  ],
  benefits: [
    'تعلم أساسيات ومهارات البيع الاحترافي',
    'تطوير قدراتك في الإقناع والتفاوض',
    'فهم سلوك المستهلك المصري واحتياجاته',
    'اكتساب مهارات التعامل مع اعتراضات العملاء',
    'إتقان تقنيات إغلاق الصفقات بنجاح',
    'تطبيق الاستراتيجيات على السوق المصري',
    'دراسة حالات نجاح واقعية من السوق المحلي'
  ],
  targetAudience: [
    'مندوبي المبيعات الجدد',
    'رواد الأعمال وأصحاب المشاريع الصغيرة',
    'مديري المبيعات والتسويق',
    'أي شخص يرغب في تحسين مهارات البيع والإقناع'
  ],
  reviews: [
    {
      id: 1,
      name: 'محمد إبراهيم',
      title: 'مدير مبيعات',
      image: 'https://i.pravatar.cc/150?img=2',
      rating: 5,
      date: '10 أكتوبر 2023',
      comment: 'من أفضل الكتب التي قرأتها في مجال المبيعات. يتميز بأسلوب سلس وعملي، مع أمثلة واقعية من السوق المصري. استفدت كثيرًا من تقنيات التعامل مع اعتراضات العملاء والتي نجحت في تطبيقها فعليًا. أنصح به بشدة لكل من يعمل في مجال المبيعات.'
    },
    {
      id: 2,
      name: 'سارة أحمد',
      title: 'صاحبة مشروع ناشئ',
      image: 'https://i.pravatar.cc/150?img=5',
      rating: 4,
      date: '5 أكتوبر 2023',
      comment: 'كتاب قيم جدًا لأصحاب المشاريع الناشئة مثلي. ساعدني على فهم آليات البيع وكيفية التواصل الفعال مع العملاء. كنت أتمنى المزيد من النصائح حول البيع عبر الإنترنت، لكن بشكل عام الكتاب ممتاز وعملي جدًا.'
    },
    {
      id: 3,
      name: 'أحمد محمود',
      title: 'مدير تسويق',
      image: 'https://i.pravatar.cc/150?img=3',
      rating: 5,
      date: '28 سبتمبر 2023',
      comment: 'قرأت العديد من الكتب في مجال المبيعات، لكن هذا الكتاب يتميز بتركيزه على السوق المصري واحتياجاته الخاصة. الفصل الخاص بدراسات الحالة كان ملهمًا جدًا. أسلوب الكاتب سلس وممتع، والمعلومات مفيدة وقابلة للتطبيق. أنصح به بشدة.'
    }
  ]
};

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      setIsSticky(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBuy = () => {
    toast.success("تم إضافة الكتاب إلى سلة المشتريات", {
      description: "يمكنك متابعة عملية الشراء الآن",
      action: {
        label: "عرض السلة",
        onClick: () => console.log("Redirecting to cart"),
      },
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Book Header */}
      <section className="pt-28 pb-12 bg-gradient-to-b from-primary/5 to-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 animate-fade-in">
              {/* Breadcrumbs */}
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
                <ChevronLeft size={14} className="mx-2" />
                <Link to="/books" className="hover:text-primary transition-colors">الكتب</Link>
                <ChevronLeft size={14} className="mx-2" />
                <span className="text-primary">{BOOK.title}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">{BOOK.title}</h1>
              <h2 className="text-xl text-gray-600 mb-6">{BOOK.subtitle}</h2>
              
              <div className="flex items-center mb-6">
                <div className="text-yellow-400 flex ml-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18}
                      className={i < Math.floor(BOOK.rating) ? "fill-yellow-400" : "fill-gray-300"}
                    />
                  ))}
                </div>
                <span className="font-bold ml-1">{BOOK.rating}</span>
                <span className="text-sm text-gray-500">({BOOK.reviewCount} تقييم)</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-sm text-gray-600">
                  <BookOpen size={16} className="inline ml-1" />
                  {BOOK.pages} صفحة
                </span>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">{BOOK.description}</p>
              
              <div className="flex items-center mb-8">
                <img 
                  src={BOOK.author.image} 
                  alt={BOOK.author.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-secondary"
                />
                <div className="mr-3">
                  <p className="font-semibold text-primary">{BOOK.author.name}</p>
                  <p className="text-sm text-gray-500">{BOOK.author.title}</p>
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
                >
                  <BookOpen size={20} />
                  <span className="text-lg">قراءة مقتطفات</span>
                </Button>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl transform rotate-3"></div>
                <div className="glassmorphism p-2 rounded-2xl shadow-xl relative z-10">
                  <img 
                    src={BOOK.cover} 
                    alt={BOOK.title} 
                    className="w-full h-auto rounded-xl object-cover aspect-[3/4]"
                  />
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-5 -right-5 bg-white p-3 rounded-xl shadow-lg animate-float">
                  <div className="text-center">
                    <div className="text-sm font-semibold">{BOOK.category}</div>
                  </div>
                </div>
                
                <div className="absolute -bottom-5 -left-5 bg-white p-3 rounded-xl shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                  <div className="text-center">
                    <div className="text-secondary font-bold text-xl">{BOOK.price} ج.م</div>
                    <div className="text-xs text-gray-500 line-through">{BOOK.originalPrice} ج.م</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Book Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <Tabs 
                value={selectedTab} 
                onValueChange={setSelectedTab} 
                className="w-full"
              >
                <TabsList className="mb-8 bg-gray-100 p-1 rounded-xl">
                  <TabsTrigger value="overview" className="py-3 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                    نظرة عامة
                  </TabsTrigger>
                  <TabsTrigger value="contents" className="py-3 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                    المحتويات
                  </TabsTrigger>
                  <TabsTrigger value="author" className="py-3 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                    المؤلف
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="py-3 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                    التقييمات
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="bg-white rounded-xl p-6 shadow-sm animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6 text-primary">عن الكتاب</h2>
                  <p className="text-gray-700 mb-8 leading-relaxed">
                    {BOOK.description}
                  </p>
                  
                  <h3 className="text-xl font-bold mb-4 text-primary">ما الذي ستتعلمه</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                    {BOOK.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start">
                        <Check size={20} className="text-green-500 mt-1 ml-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-primary">الفئة المستهدفة</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-8">
                    {BOOK.targetAudience.map((audience, index) => (
                      <li key={index}>{audience}</li>
                    ))}
                  </ul>
                  
                  <h3 className="text-xl font-bold mb-4 text-primary">تفاصيل الكتاب</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-4">
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">عدد الصفحات</span>
                        <span className="font-medium">{BOOK.pages} صفحة</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">تاريخ النشر</span>
                        <span className="font-medium">{BOOK.publicationDate}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">الناشر</span>
                        <span className="font-medium">{BOOK.publisher}</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-4">
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">اللغة</span>
                        <span className="font-medium">{BOOK.language}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">الصيغة</span>
                        <span className="font-medium">{BOOK.format}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">ISBN</span>
                        <span className="font-medium">{BOOK.isbn}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="contents" className="bg-white rounded-xl p-6 shadow-sm animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6 text-primary">محتويات الكتاب</h2>
                  <div className="space-y-6">
                    {BOOK.tableOfContents.map((chapter, chapterIndex) => (
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
                
                <TabsContent value="author" className="bg-white rounded-xl p-6 shadow-sm animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6 text-primary">المؤلف</h2>
                  <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
                    <img 
                      src={BOOK.author.image} 
                      alt={BOOK.author.name} 
                      className="w-24 h-24 rounded-xl object-cover border-2 border-secondary"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-1">{BOOK.author.name}</h3>
                      <p className="text-gray-500 mb-4">{BOOK.author.title}</p>
                      <p className="text-gray-700 leading-relaxed">{BOOK.author.bio}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-secondary font-bold text-2xl">15+</div>
                      <div className="text-gray-600">سنوات خبرة</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-secondary font-bold text-2xl">7+</div>
                      <div className="text-gray-600">كتب منشورة</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-secondary font-bold text-2xl">5000+</div>
                      <div className="text-gray-600">متدرب</div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="bg-white rounded-xl p-6 shadow-sm animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6 text-primary">تقييمات القراء</h2>
                  <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="bg-gray-50 p-6 rounded-lg text-center flex-shrink-0">
                      <div className="text-5xl font-bold text-primary mb-2">{BOOK.rating}</div>
                      <div className="flex justify-center text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={18}
                            className={i < Math.floor(BOOK.rating) ? "fill-yellow-400" : "fill-gray-300"}
                          />
                        ))}
                      </div>
                      <div className="text-gray-500">{BOOK.reviewCount} تقييم</div>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="space-y-6">
                        {BOOK.reviews.map((review) => (
                          <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                            <div className="flex items-start mb-2">
                              <img 
                                src={review.image} 
                                alt={review.name} 
                                className="w-12 h-12 rounded-full object-cover border border-gray-200"
                              />
                              <div className="mr-3 flex-grow">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-bold text-primary">{review.name}</h4>
                                    <p className="text-sm text-gray-500">{review.title}</p>
                                  </div>
                                  <span className="text-sm text-gray-500">{review.date}</span>
                                </div>
                                <div className="flex text-yellow-400 my-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      size={14}
                                      className={i < review.rating ? "fill-yellow-400" : "fill-gray-300"}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Book details sidebar */}
            <div>
              <Card className={`bg-white rounded-xl shadow-lg border-none overflow-hidden ${isSticky ? 'lg:sticky lg:top-24' : ''} transition-all`}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-6">تفاصيل الشراء</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">السعر</span>
                      <div>
                        <span className="text-secondary font-bold text-xl">{BOOK.price} ج.م</span>
                        <span className="text-sm text-gray-500 line-through mr-2">{BOOK.originalPrice} ج.م</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">الصيغة</span>
                      <span className="font-medium">{BOOK.format}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">عدد الصفحات</span>
                      <span className="font-medium">{BOOK.pages} صفحة</span>
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
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white py-6 rounded-xl flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all"
                  >
                    <BookOpen size={20} />
                    <span className="text-lg">قراءة مقتطفات</span>
                  </Button>
                  
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
      
      <Footer />
    </div>
  );
};

export default BookDetail;
