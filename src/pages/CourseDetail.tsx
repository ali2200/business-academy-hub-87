
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle, Users, Award, ChevronLeft, BookOpen, Play, ShoppingCart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

// Mock data for course detail
const COURSE = {
  id: 1,
  title: 'أساسيات البيع الاحترافي',
  description: 'دورة شاملة لتعلم أساسيات ومهارات البيع الاحترافي وتقنيات الإقناع والتفاوض لتحسين أدائك كمندوب مبيعات وزيادة معدلات إغلاق الصفقات بنجاح.',
  image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
  instructor: {
    name: 'أحمد محمد',
    title: 'خبير مبيعات وتطوير أعمال',
    image: 'https://i.pravatar.cc/150?img=1',
    bio: 'خبير مبيعات وتطوير أعمال بخبرة تزيد عن 15 عامًا في أكبر الشركات المصرية والعربية. درب أكثر من 5000 متدرب على مهارات البيع والتفاوض.'
  },
  price: 599,
  originalPrice: 899,
  category: 'مبيعات',
  level: 'مبتدئ',
  students: 125,
  duration: '5 ساعات',
  lastUpdated: '15 أكتوبر 2023',
  language: 'العربية (اللهجة المصرية)',
  certificate: true,
  access: 'مدى الحياة',
  rating: 4.8,
  reviewCount: 47,
  curriculum: [
    {
      title: 'مقدمة في علم البيع',
      duration: '45 دقيقة',
      lessons: [
        { title: 'مقدمة الدورة وأهدافها', duration: '10 دقائق', type: 'video' },
        { title: 'مفهوم البيع ودوره في نجاح الأعمال', duration: '15 دقيقة', type: 'video' },
        { title: 'الصفات الأساسية لمندوب المبيعات الناجح', duration: '20 دقيقة', type: 'video' }
      ]
    },
    {
      title: 'عملية البيع',
      duration: '90 دقيقة',
      lessons: [
        { title: 'مراحل عملية البيع', duration: '15 دقيقة', type: 'video' },
        { title: 'البحث عن العملاء المحتملين', duration: '20 دقيقة', type: 'video' },
        { title: 'التواصل الأولي مع العميل', duration: '15 دقيقة', type: 'video' },
        { title: 'تحديد احتياجات العميل', duration: '20 دقيقة', type: 'video' },
        { title: 'تطبيق عملي على تحديد احتياجات العميل', duration: '20 دقيقة', type: 'assignment' }
      ]
    },
    {
      title: 'تقنيات العرض والإقناع',
      duration: '75 دقيقة',
      lessons: [
        { title: 'كيفية عرض المنتج أو الخدمة بفعالية', duration: '20 دقيقة', type: 'video' },
        { title: 'بناء مقترح بيع قوي', duration: '15 دقيقة', type: 'video' },
        { title: 'تقنيات الإقناع المؤثرة', duration: '25 دقيقة', type: 'video' },
        { title: 'أسلوب عرض المميزات والفوائد', duration: '15 دقيقة', type: 'video' }
      ]
    },
    {
      title: 'التعامل مع الاعتراضات',
      duration: '60 دقيقة',
      lessons: [
        { title: 'الاعتراضات الشائعة وكيفية الرد عليها', duration: '20 دقيقة', type: 'video' },
        { title: 'تحويل الاعتراضات إلى فرص بيع', duration: '25 دقيقة', type: 'video' },
        { title: 'تمارين على الرد على الاعتراضات', duration: '15 دقيقة', type: 'assignment' }
      ]
    },
    {
      title: 'إتمام الصفقة وخدمة ما بعد البيع',
      duration: '70 دقيقة',
      lessons: [
        { title: 'تقنيات إتمام الصفقة', duration: '20 دقيقة', type: 'video' },
        { title: 'متى وكيف تقترح على العميل إتمام الشراء', duration: '15 دقيقة', type: 'video' },
        { title: 'أهمية خدمة ما بعد البيع', duration: '15 دقيقة', type: 'video' },
        { title: 'بناء العلاقات طويلة المدى مع العملاء', duration: '20 دقيقة', type: 'video' }
      ]
    }
  ],
  features: [
    'محتوى عملي قابل للتطبيق',
    'تمارين وتطبيقات عملية',
    'دراسات حالة من السوق المصري',
    'شهادة إتمام معتمدة',
    'دعم فني مستمر',
    'إمكانية التواصل مع المدرب',
    'موارد ومراجع إضافية'
  ],
  requirements: [
    'لا يشترط خبرة سابقة في المبيعات',
    'الرغبة في تعلم مهارات البيع الاحترافي',
    'الالتزام بتطبيق التمارين العملية',
    'جهاز كمبيوتر أو هاتف ذكي للوصول إلى المحتوى'
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
      image: 'https://i.pravatar.cc/150?img=2',
      rating: 5,
      date: '10 أكتوبر 2023',
      comment: 'دورة رائعة جدًا وعملية، استفدت منها كثيرًا في تطوير مهاراتي في البيع. المدرب متمكن وأسلوبه سلس وممتع. أنصح بها بشدة لكل من يريد تعلم مهارات البيع الاحترافي.'
    },
    {
      id: 2,
      name: 'سارة أحمد',
      image: 'https://i.pravatar.cc/150?img=5',
      rating: 4,
      date: '5 أكتوبر 2023',
      comment: 'محتوى الدورة مفيد جدًا وعملي، خاصة تقنيات الإقناع والتعامل مع اعتراضات العملاء. كنت أتمنى المزيد من التمارين العملية، لكن بشكل عام الدورة ممتازة وأوصي بها.'
    },
    {
      id: 3,
      name: 'أحمد محمود',
      image: 'https://i.pravatar.cc/150?img=3',
      rating: 5,
      date: '28 سبتمبر 2023',
      comment: 'من أفضل الدورات التي التحقت بها في مجال المبيعات. المحتوى شامل ومنظم والأمثلة من السوق المصري سهلت علي فهم وتطبيق المفاهيم. شكرًا للمدرب أحمد على هذه الدورة الرائعة.'
    }
  ]
};

const CourseDetail = () => {
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

  const handleEnroll = () => {
    toast.success("تم إضافة الدورة إلى سلة المشتريات", {
      description: "يمكنك متابعة عملية الشراء الآن",
      action: {
        label: "عرض السلة",
        onClick: () => console.log("Redirecting to cart"),
      },
    });
  };

  const calculateTotalDuration = () => {
    const minutesSum = COURSE.curriculum.reduce((total, section) => 
      total + section.lessons.reduce((sum, lesson) => {
        const minutes = parseInt(lesson.duration.split(' ')[0]);
        return sum + minutes;
      }, 0), 0);
    
    const hours = Math.floor(minutesSum / 60);
    const minutes = minutesSum % 60;
    
    return `${hours} ساعة${hours !== 1 ? 'ات' : ''} ${minutes > 0 ? `و ${minutes} دقيقة` : ''}`;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Course Header */}
      <section className="pt-28 pb-12 bg-gradient-to-b from-primary/5 to-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 animate-fade-in">
              {/* Breadcrumbs */}
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
                <ChevronLeft size={14} className="mx-2" />
                <Link to="/courses" className="hover:text-primary transition-colors">الدورات</Link>
                <ChevronLeft size={14} className="mx-2" />
                <span className="text-primary">{COURSE.title}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-primary">{COURSE.title}</h1>
              
              <p className="text-gray-600 mb-6">{COURSE.description}</p>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 items-center mb-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Award size={16} className="ml-1 text-secondary" />
                  <span>{COURSE.level}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="ml-1 text-secondary" />
                  <span>{calculateTotalDuration()}</span>
                </div>
                <div className="flex items-center">
                  <Users size={16} className="ml-1 text-secondary" />
                  <span>{COURSE.students} طالب</span>
                </div>
                <div className="flex items-center">
                  <BookOpen size={16} className="ml-1 text-secondary" />
                  <span>{COURSE.curriculum.reduce((sum, section) => sum + section.lessons.length, 0)} درس</span>
                </div>
              </div>
              
              <div className="flex items-center mb-8">
                <img 
                  src={COURSE.instructor.image} 
                  alt={COURSE.instructor.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-secondary"
                />
                <div className="mr-3">
                  <p className="font-semibold text-primary">{COURSE.instructor.name}</p>
                  <p className="text-sm text-gray-500">{COURSE.instructor.title}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  className="bg-secondary hover:bg-secondary-light text-white px-8 py-6 rounded-xl flex items-center justify-center space-x-2 rtl:space-x-reverse shadow-lg hover:shadow-xl transition-all"
                  onClick={handleEnroll}
                >
                  <ShoppingCart size={20} />
                  <span className="text-lg">اشترك الآن</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 rounded-xl flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all"
                >
                  <Play size={20} />
                  <span className="text-lg">شاهد مقدمة الدورة</span>
                </Button>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl transform rotate-3"></div>
                <div className="glassmorphism p-2 rounded-2xl shadow-xl relative z-10">
                  <img 
                    src={COURSE.image} 
                    alt={COURSE.title} 
                    className="w-full h-auto rounded-xl object-cover aspect-video"
                  />
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-5 -right-5 bg-white p-3 rounded-xl shadow-lg animate-float">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <div className="text-yellow-400 flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          filled={i < Math.floor(COURSE.rating)} 
                          half={i === Math.floor(COURSE.rating) && COURSE.rating % 1 >= 0.5} 
                        />
                      ))}
                    </div>
                    <div className="font-bold">{COURSE.rating}</div>
                    <div className="text-xs text-gray-500">({COURSE.reviewCount} تقييم)</div>
                  </div>
                </div>
                
                <div className="absolute -bottom-5 -left-5 bg-white p-3 rounded-xl shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                  <div className="text-center">
                    <div className="text-secondary font-bold text-xl">{COURSE.price} ج.م</div>
                    <div className="text-xs text-gray-500 line-through">{COURSE.originalPrice} ج.م</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Course Content */}
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
                  <TabsTrigger value="curriculum" className="py-3 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                    المحتوى
                  </TabsTrigger>
                  <TabsTrigger value="instructor" className="py-3 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                    المدرب
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="py-3 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                    التقييمات
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="bg-white rounded-xl p-6 shadow-sm animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6 text-primary">عن الدورة</h2>
                  <p className="text-gray-700 mb-8 leading-relaxed">
                    {COURSE.description}
                  </p>
                  
                  <h3 className="text-xl font-bold mb-4 text-primary">ما الذي ستتعلمه</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                    {COURSE.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle size={20} className="text-green-500 mt-1 ml-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-primary">المتطلبات</h3>
                  <ul className="list-disc list-inside mb-8 space-y-2 text-gray-700">
                    {COURSE.requirements.map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                  
                  <h3 className="text-xl font-bold mb-4 text-primary">الفئة المستهدفة</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {COURSE.targetAudience.map((audience, index) => (
                      <li key={index}>{audience}</li>
                    ))}
                  </ul>
                </TabsContent>
                
                <TabsContent value="curriculum" className="bg-white rounded-xl p-6 shadow-sm animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6 text-primary">محتوى الدورة</h2>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-gray-700">
                      <span className="font-medium">{COURSE.curriculum.length} أقسام</span>
                      <span className="mx-2">•</span>
                      <span className="font-medium">{COURSE.curriculum.reduce((sum, section) => sum + section.lessons.length, 0)} درس</span>
                      <span className="mx-2">•</span>
                      <span className="font-medium">{calculateTotalDuration()}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {COURSE.curriculum.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-4 flex justify-between items-center">
                          <h3 className="font-bold text-lg text-primary">{section.title}</h3>
                          <div className="text-sm text-gray-500">{section.duration}</div>
                        </div>
                        <div className="p-3">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="flex justify-between items-center p-3 border-b last:border-0 border-gray-100">
                              <div className="flex items-center">
                                {lesson.type === 'video' ? (
                                  <Play size={16} className="text-secondary ml-3" />
                                ) : (
                                  <AlertCircle size={16} className="text-primary ml-3" />
                                )}
                                <span>{lesson.title}</span>
                              </div>
                              <div className="text-sm text-gray-500">{lesson.duration}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="instructor" className="bg-white rounded-xl p-6 shadow-sm animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6 text-primary">المدرب</h2>
                  <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
                    <img 
                      src={COURSE.instructor.image} 
                      alt={COURSE.instructor.name} 
                      className="w-24 h-24 rounded-xl object-cover border-2 border-secondary"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-1">{COURSE.instructor.name}</h3>
                      <p className="text-gray-500 mb-4">{COURSE.instructor.title}</p>
                      <p className="text-gray-700 leading-relaxed">{COURSE.instructor.bio}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-secondary font-bold text-2xl">15+</div>
                      <div className="text-gray-600">سنوات خبرة</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-secondary font-bold text-2xl">5000+</div>
                      <div className="text-gray-600">متدرب</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-secondary font-bold text-2xl">12+</div>
                      <div className="text-gray-600">دورة تدريبية</div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="bg-white rounded-xl p-6 shadow-sm animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6 text-primary">تقييمات الطلاب</h2>
                  <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="bg-gray-50 p-6 rounded-lg text-center flex-shrink-0">
                      <div className="text-5xl font-bold text-primary mb-2">{COURSE.rating}</div>
                      <div className="flex justify-center text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            filled={i < Math.floor(COURSE.rating)} 
                            half={i === Math.floor(COURSE.rating) && COURSE.rating % 1 >= 0.5} 
                          />
                        ))}
                      </div>
                      <div className="text-gray-500">{COURSE.reviewCount} تقييم</div>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="space-y-6">
                        {COURSE.reviews.map((review) => (
                          <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                            <div className="flex items-start mb-2">
                              <img 
                                src={review.image} 
                                alt={review.name} 
                                className="w-12 h-12 rounded-full object-cover border border-gray-200"
                              />
                              <div className="mr-3 flex-grow">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-bold text-primary">{review.name}</h4>
                                  <span className="text-sm text-gray-500">{review.date}</span>
                                </div>
                                <div className="flex text-yellow-400 my-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} filled={i < review.rating} size={14} />
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
            
            {/* Course details sidebar */}
            <div>
              <Card className={`bg-white rounded-xl shadow-lg border-none overflow-hidden ${isSticky ? 'lg:sticky lg:top-24' : ''} transition-all`}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-6">تفاصيل الدورة</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">السعر</span>
                      <div>
                        <span className="text-secondary font-bold text-xl">{COURSE.price} ج.م</span>
                        <span className="text-sm text-gray-500 line-through mr-2">{COURSE.originalPrice} ج.م</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">آخر تحديث</span>
                      <span className="font-medium">{COURSE.lastUpdated}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">المستوى</span>
                      <span className="font-medium">{COURSE.level}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">اللغة</span>
                      <span className="font-medium">{COURSE.language}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">المدة</span>
                      <span className="font-medium">{calculateTotalDuration()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">مدة الوصول</span>
                      <span className="font-medium">{COURSE.access}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">شهادة</span>
                      <span className="font-medium text-green-500">{COURSE.certificate ? 'نعم' : 'لا'}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-secondary hover:bg-secondary-light text-white py-6 rounded-xl flex items-center justify-center space-x-2 rtl:space-x-reverse shadow-lg hover:shadow-xl transition-all mb-4"
                    onClick={handleEnroll}
                  >
                    <ShoppingCart size={20} />
                    <span className="text-lg">اشترك الآن</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white py-6 rounded-xl flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all"
                  >
                    <Play size={20} />
                    <span className="text-lg">شاهد مقدمة الدورة</span>
                  </Button>
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

// Star rating component
type StarProps = {
  filled?: boolean;
  half?: boolean;
  size?: number;
};

const Star = ({ filled = true, half = false, size = 16 }: StarProps) => {
  if (filled) {
    return <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>;
  } else if (half) {
    return (
      <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <defs>
          <linearGradient id="halfGradient">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="#d1d5db" />
          </linearGradient>
        </defs>
        <path fill="url(#halfGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    );
  } else {
    return <svg className="w-4 h-4 mr-1 text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>;
  }
};

export default CourseDetail;
