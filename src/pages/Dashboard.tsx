import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, BookOpen, ShoppingCart, Settings, LogOut, Play, Award, Book, Clock, Check, Info, Edit, FileText, Video, Save, Plus, Trash2, School } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const USER = {
  name: 'محمد أحمد',
  email: 'mohammed.ahmed@example.com',
  avatar: 'https://i.pravatar.cc/150?img=4',
  joinDate: '12 أكتوبر 2023'
};

const ENROLLED_COURSES = [
  {
    id: 1,
    title: 'أساسيات البيع الاحترافي',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
    instructor: 'أحمد محمد',
    progress: 65,
    totalLessons: 24,
    completedLessons: 16,
    lastAccessed: 'منذ يومين',
    certificate: false
  },
  {
    id: 2,
    title: 'التسويق الرقمي للمبتدئين',
    image: 'https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=2069&auto=format&fit=crop',
    instructor: 'سارة أحمد',
    progress: 30,
    totalLessons: 32,
    completedLessons: 10,
    lastAccessed: 'منذ أسبوع',
    certificate: false
  },
  {
    id: 3,
    title: 'إدارة المشاريع الصغيرة',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
    instructor: 'محمد علي',
    progress: 100,
    totalLessons: 28,
    completedLessons: 28,
    lastAccessed: 'منذ شهر',
    certificate: true
  }
];

const PURCHASED_BOOKS = [
  {
    id: 1,
    title: 'أسرار البيع الناجح',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop',
    author: 'د. أحمد محمد',
    purchaseDate: '15 أكتوبر 2023',
    pages: 280,
    readPages: 145
  },
  {
    id: 2,
    title: 'استراتيجيات التسويق الحديثة',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop',
    author: 'م. سارة أحمد',
    purchaseDate: '3 أكتوبر 2023',
    pages: 320,
    readPages: 50
  }
];

const CERTIFICATES = [
  {
    id: 1,
    courseTitle: 'إدارة المشاريع الصغيرة',
    issueDate: '20 سبتمبر 2023',
    certificate: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=1935&auto=format&fit=crop'
  }
];

const ABOUT_ME_CONTENT = {
  title: "تعرف على بيزنس أكاديمي",
  videoUrl: "https://static.videezy.com/system/resources/previews/000/005/529/original/Reaviling_Sjusj%C3%B8en_Ski_Senter.mp4",
  description: "أنا أحمد، خبير في مجال البيزنس والمبيعات مع خبرة تمتد لأكثر من 10 سنوات في السوق المصري. أسست بيزنس أكاديمي لمساعدة رواد الأعمال والمهنيين المصريين على تطوير مهاراتهم وتحقيق النجاح في عالم الأعمال.",
  features: [
    {
      id: 1,
      title: "دورات تدريبية احترافية",
      description: "دورات متخصصة في مجالات البيع والتسويق وإدارة الأعمال مقدمة باللهجة المصرية لتناسب احتياجات السوق المحلي.",
      icon: "graduation-cap"
    },
    {
      id: 2,
      title: "كتب ومراجع تعليمية",
      description: "مجموعة من الكتب الإلكترونية ال��تخصصة التي تشرح أساسيات ومفاهيم البيزنس بطريقة سهلة وعملية.",
      icon: "book-open"
    },
    {
      id: 3,
      title: "خبرة عملية حقيقية",
      description: "محتوى مبني على تجارب حقيقية وخبرات عملية في السوق المصري، وليس مجرد نظريات.",
      icon: "award"
    }
  ]
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('courses');
  
  const [aboutContent, setAboutContent] = useState(ABOUT_ME_CONTENT);
  const [editMode, setEditMode] = useState(false);
  const [editedFeature, setEditedFeature] = useState<null | number>(null);
  
  const [tempContent, setTempContent] = useState(ABOUT_ME_CONTENT);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const showCertificateToast = () => {
    toast.success("تم تحميل الشهادة بنجاح", {
      description: "يمكنك الآن طباعة الشهادة أو مشاركتها",
    });
  };
  
  const handleContentSave = () => {
    setAboutContent(tempContent);
    setEditMode(false);
    toast.success("تم حفظ التغييرات بنجاح", {
      description: "تم تحديث المحتوى على الموقع"
    });
  };
  
  const handleCancelEdit = () => {
    setTempContent(aboutContent);
    setEditMode(false);
    setEditedFeature(null);
  };
  
  const addNewFeature = () => {
    if (tempContent.features.length >= 6) {
      toast.error("الحد الأقصى للميزات هو 6 ميزات");
      return;
    }
    
    const newFeature = {
      id: Date.now(),
      title: "ميزة جديدة",
      description: "وصف الميزة الجديدة",
      icon: "info"
    };
    
    setTempContent({
      ...tempContent,
      features: [...tempContent.features, newFeature]
    });
  };
  
  const removeFeature = (id: number) => {
    if (tempContent.features.length <= 1) {
      toast.error("يجب أن يكون هناك ميزة واحدة على الأقل");
      return;
    }
    
    setTempContent({
      ...tempContent,
      features: tempContent.features.filter(feature => feature.id !== id)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSidebar}
          className="bg-white shadow-md"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>
      
      <aside 
        className={`bg-white fixed top-0 right-0 h-full shadow-lg transform transition-all duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 w-64 lg:w-80`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-6 mb-6">
            <Avatar className="h-14 w-14 border-2 border-secondary">
              <AvatarImage src={USER.avatar} alt={USER.name} />
              <AvatarFallback>{USER.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-bold text-lg text-primary">{USER.name}</h2>
              <p className="text-sm text-gray-500">{USER.email}</p>
            </div>
          </div>
          
          <nav className="flex-grow">
            <ul className="space-y-1">
              <NavItem 
                icon={Home} 
                label="الرئيسية" 
                href="/" 
                active={false} 
                onClick={() => isMobile && setSidebarOpen(false)} 
              />
              <NavItem 
                icon={BookOpen} 
                label="دوراتي" 
                href="/dashboard" 
                active={activeTab === 'courses'} 
                onClick={() => {
                  setActiveTab('courses');
                  isMobile && setSidebarOpen(false);
                }} 
              />
              <NavItem 
                icon={Book} 
                label="كتبي" 
                href="/dashboard" 
                active={activeTab === 'books'} 
                onClick={() => {
                  setActiveTab('books');
                  isMobile && setSidebarOpen(false);
                }} 
              />
              <NavItem 
                icon={Award} 
                label="شهاداتي" 
                href="/dashboard" 
                active={activeTab === 'certificates'} 
                onClick={() => {
                  setActiveTab('certificates');
                  isMobile && setSidebarOpen(false);
                }} 
              />
              <NavItem 
                icon={FileText} 
                label="إدارة المحتوى" 
                href="/dashboard" 
                active={activeTab === 'content'} 
                onClick={() => {
                  setActiveTab('content');
                  isMobile && setSidebarOpen(false);
                }} 
              />
              <NavItem 
                icon={ShoppingCart} 
                label="مشترياتي" 
                href="/dashboard" 
                active={activeTab === 'purchases'} 
                onClick={() => {
                  setActiveTab('purchases');
                  isMobile && setSidebarOpen(false);
                }} 
              />
              <NavItem 
                icon={Settings} 
                label="الإعدادات" 
                href="/dashboard" 
                active={activeTab === 'settings'} 
                onClick={() => {
                  setActiveTab('settings');
                  isMobile && setSidebarOpen(false);
                }} 
              />
            </ul>
          </nav>
          
          <div className="pt-6 border-t border-gray-100">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
            >
              <LogOut size={18} className="ml-2" />
              <span>تسجيل الخروج</span>
            </Button>
          </div>
        </div>
      </aside>
      
      <main 
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:mr-80' : 'mr-0'
        } min-h-screen pt-8 pb-16`}
      >
        <div className="container mx-auto px-4">
          <header className="mb-8 pt-4">
            <h1 className="text-3xl font-bold text-primary mb-2">لوحة التحكم</h1>
            <p className="text-gray-600">اهلا بك {USER.name}، هنا يمك��ك متابعة تعلمك ومشترياتك</p>
          </header>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-8 bg-gray-100 p-1 rounded-xl w-full justify-start overflow-x-auto">
                <TabsTrigger value="courses" className="py-3 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                  <BookOpen size={18} className="ml-2" />
                  دوراتي
                </TabsTrigger>
                <TabsTrigger value="books" className="py-3 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Book size={18} className="ml-2" />
                  كتبي
                </TabsTrigger>
                <TabsTrigger value="certificates" className="py-3 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Award size={18} className="ml-2" />
                  شهاداتي
                </TabsTrigger>
                <TabsTrigger value="content" className="py-3 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                  <FileText size={18} className="ml-2" />
                  إدارة المحتوى
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="courses" className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-primary">دوراتي</h2>
                
                {ENROLLED_COURSES.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ENROLLED_COURSES.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                ) : (
                  <EmptyState 
                    title="ليس لديك دورات بعد"
                    description="استكشف دوراتنا وابدأ رحلة التعلم الآن"
                    buttonText="استكشف الدورات"
                    buttonHref="/courses"
                  />
                )}
              </TabsContent>
              
              <TabsContent value="books" className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-primary">كتبي</h2>
                
                {PURCHASED_BOOKS.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PURCHASED_BOOKS.map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                ) : (
                  <EmptyState 
                    title="ليس لديك كتب بعد"
                    description="استكشف كتبنا واثري معرفتك الآن"
                    buttonText="استكشف الكتب"
                    buttonHref="/books"
                  />
                )}
              </TabsContent>
              
              <TabsContent value="certificates" className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-primary">شهاداتي</h2>
                
                {CERTIFICATES.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {CERTIFICATES.map((cert) => (
                      <Card key={cert.id} className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="p-4 pb-0">
                          <div className="rounded-lg overflow-hidden mb-4 border border-gray-200">
                            <img 
                              src={cert.certificate} 
                              alt={`${cert.courseTitle} Certificate`} 
                              className="w-full h-auto"
                            />
                          </div>
                          <h3 className="text-lg font-bold text-primary">{cert.courseTitle}</h3>
                        </CardHeader>
                        
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-500">تاريخ الإصدار</span>
                            <span className="text-sm font-medium">{cert.issueDate}</span>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="p-4 pt-0 flex justify-between gap-3">
                          <Button 
                            variant="outline" 
                            className="flex-1 border-gray-300"
                            onClick={() => showCertificateToast()}
                          >
                            مشاركة
                          </Button>
                          <Button 
                            className="flex-1 bg-primary hover:bg-primary-light"
                            onClick={() => showCertificateToast()}
                          >
                            تحميل PDF
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <EmptyState 
                    title="ليس لديك شهادات بعد"
                    description="أكمل إحدى دوراتنا للحصول على شهادة معتمدة"
                    buttonText="استكشف الدورات"
                    buttonHref="/courses"
                  />
                )}
              </TabsContent>
              
              <TabsContent value="content" className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-primary">إدارة المحتوى</h2>
                  {!editMode ? (
                    <Button 
                      onClick={() => setEditMode(true)}
                      className="bg-primary hover:bg-primary-light"
                    >
                      <Edit size={18} className="ml-2" />
                      تعديل المحتوى
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={handleCancelEdit}
                      >
                        <X size={18} className="ml-2" />
                        إلغاء
                      </Button>
                      <Button 
                        onClick={handleContentSave}
                        className="bg-primary hover:bg-primary-light"
                      >
                        <Save size={18} className="ml-2" />
                        حفظ التغييرات
                      </Button>
                    </div>
                  )}
                </div>
                
                <Card className="mb-6">
                  <CardHeader>
                    <h3 className="text-xl font-bold text-primary">معلومات القسم التعريفي</h3>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-lg font-medium mb-2">عنوان القسم</h4>
                      {editMode ? (
                        <Input 
                          value={tempContent.title}
                          onChange={(e) => setTempContent({...tempContent, title: e.target.value})}
                          className="w-full"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 rounded">{aboutContent.title}</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium mb-2">رابط الفيديو</h4>
                      {editMode ? (
                        <Input 
                          value={tempContent.videoUrl}
                          onChange={(e) => setTempContent({...tempContent, videoUrl: e.target.value})}
                          className="w-full"
                          dir="ltr"
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded dir-ltr text-left">
                          {aboutContent.videoUrl}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium mb-2">الوصف</h4>
                      {editMode ? (
                        <Textarea 
                          value={tempContent.description}
                          onChange={(e) => setTempContent({...tempContent, description: e.target.value})}
                          className="w-full min-h-32"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 rounded">{aboutContent.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row justify-between items-center">
                    <h3 className="text-xl font-bold text-primary">الميزات والمزايا</h3>
                    {editMode && (
                      <Button 
                        size="sm" 
                        onClick={addNewFeature}
                        className="bg-secondary hover:bg-secondary-light"
                      >
                        <Plus size={16} className="ml-1" />
                        إضافة ميزة
                      </Button>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-6">
                      {(editMode ? tempContent.features : aboutContent.features).map((feature, index) => (
                        <div key={feature.id} className="p-4 border border-gray-100 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              <div className="bg-primary/10 p-2 rounded">
                                {feature.icon === "graduation-cap" && <School className="w-5 h-5 text-primary" />}
                                {feature.icon === "book-open" && <BookOpen className="w-5 h-5 text-primary" />}
                                {feature.icon === "award" && <Award className="w-5 h-5 text-primary" />}
                                {feature.icon === "info" && <Info className="w-5 h-5 text-primary" />}
                              </div>
                              {editMode ? (
                                <Input 
                                  value={feature.title}
                                  onChange={(e) => {
                                    const updatedFeatures = [...tempContent.features];
                                    updatedFeatures[index].title = e.target.value;
                                    setTempContent({...tempContent, features: updatedFeatures});
                                  }}
                                  className="font-bold text-primary"
                                />
                              ) : (
                                <h4 className="font-bold text-primary">{feature.title}</h4>
                              )}
                            </div>
                            
                            {editMode && (
                              <Button 
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeFeature(feature.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            )}
                          </div>
                          
                          {editMode ? (
                            <Textarea 
                              value={feature.description}
                              onChange={(e) => {
                                const updatedFeatures = [...tempContent.features];
                                updatedFeatures[index].description = e.target.value;
                                setTempContent({...tempContent, features: updatedFeatures});
                              }}
                              className="w-full"
                            />
                          ) : (
                            <p className="text-gray-600">{feature.description}</p>
                          )}
                          
                          {editMode && (
                            <div className="mt-3">
                              <label className="block text-sm font-medium mb-1">الأيقونة</label>
                              <select 
                                value={feature.icon}
                                onChange={(e) => {
                                  const updatedFeatures = [...tempContent.features];
                                  updatedFeatures[index].icon = e.target.value;
                                  setTempContent({...tempContent, features: updatedFeatures});
                                }}
                                className="w-full p-2 border border-gray-300 rounded-md"
                              >
                                <option value="graduation-cap">دورات تدريبية</option>
                                <option value="book-open">كتب ومراجع</option>
                                <option value="award">خبرة عملية</option>
                                <option value="info">معلومات</option>
                              </select>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-primary mb-4">معاينة القسم</h3>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h2 className="text-2xl font-bold mb-4 text-primary">{editMode ? tempContent.title : aboutContent.title}</h2>
                    
                    <div className="mb-4 rounded overflow-hidden max-w-lg mx-auto">
                      <video 
                        controls
                        className="w-full h-auto"
                        poster="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop"
                      >
                        <source src={editMode ? tempContent.videoUrl : aboutContent.videoUrl} type="video/mp4" />
                        عذراً، متصفحك لا يدعم تشغيل الفيديو
                      </video>
                    </div>
                    
                    <p className="text-gray-600 mb-6">
                      {editMode ? tempContent.description : aboutContent.description}
                    </p>
                    
                    <div className="space-y-4">
                      {(editMode ? tempContent.features : aboutContent.features).map((feature) => (
                        <div key={feature.id} className="flex items-start space-x-3 rtl:space-x-reverse">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            {feature.icon === "graduation-cap" && <School className="w-5 h-5 text-primary" />}
                            {feature.icon === "book-open" && <BookOpen className="w-5 h-5 text-primary" />}
                            {feature.icon === "award" && <Award className="w-5 h-5 text-primary" />}
                            {feature.icon === "info" && <Info className="w-5 h-5 text-primary" />}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-primary mb-1">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

type NavItemProps = {
  icon: React.FC<any>;
  label: string;
  href: string;
  active: boolean;
  onClick: () => void;
};

const NavItem = ({ icon: Icon, label, href, active, onClick }: NavItemProps) => (
  <li>
    <Link
      to={href}
      className={`flex items-center py-3 px-4 rounded-lg transition-colors ${
        active 
          ? 'bg-primary text-white' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      <Icon size={20} className="ml-3" />
      <span>{label}</span>
    </Link>
  </li>
);

type CourseCardProps = {
  course: typeof ENROLLED_COURSES[0];
};

const CourseCard = ({ course }: CourseCardProps) => (
  <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
    <div className="relative h-40 overflow-hidden">
      <img 
        src={course.image} 
        alt={course.title} 
        className="w-full h-full object-cover"
      />
      {course.certificate && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-green-500 hover:bg-green-600">
            <Award size={14} className="ml-1" />
            شهادة مكتملة
          </Badge>
        </div>
      )}
    </div>
    
    <CardHeader className="p-4 pb-0">
      <h3 className="text-lg font-bold text-primary mb-1">{course.title}</h3>
      <p className="text-sm text-gray-500">المدرب: {course.instructor}</p>
    </CardHeader>
    
    <CardContent className="p-4">
      <div className="mb-2 flex justify-between items-center">
        <span className="text-sm text-gray-600">تقدمك</span>
        <span className="text-sm font-medium">{course.progress}%</span>
      </div>
      <Progress value={course.progress} className="h-2 mb-4" />
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-50 p-2 rounded text-center">
          <div className="text-primary font-semibold">{course.completedLessons}</div>
          <div className="text-xs text-gray-500">دروس مكتملة</div>
        </div>
        <div className="bg-gray-50 p-2 rounded text-center">
          <div className="text-primary font-semibold">{course.totalLessons}</div>
          <div className="text-xs text-gray-500">إجمالي الدروس</div>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 flex items-center">
        <Clock size={14} className="ml-1" />
        آخر نشاط: {course.lastAccessed}
      </div>
    </CardContent>
    
    <CardFooter className="p-4 pt-0">
      <Button className="w-full bg-secondary hover:bg-secondary-light flex items-center justify-center">
        <Play size={18} className="ml-2" />
        {course.progress === 100 ? 'مراجعة الدورة' : 'متابعة التعلم'}
      </Button>
    </CardFooter>
  </Card>
);

type BookCardProps = {
  book: typeof PURCHASED_BOOKS[0];
};

const BookCard = ({ book }: BookCardProps) => (
  <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex">
      <div className="w-1/3 p-4">
        <img 
          src={book.cover} 
          alt={book.title} 
          className="w-full h-auto object-cover aspect-[3/4] rounded-lg shadow-sm"
        />
      </div>
      
      <div className="w-2/3 p-4">
        <h3 className="text-lg font-bold text-primary mb-1">{book.title}</h3>
        <p className="text-sm text-gray-500 mb-3">{book.author}</p>
        
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>تقدم القراءة</span>
            <span>{Math.round((book.readPages / book.pages) * 100)}%</span>
          </div>
          <Progress value={(book.readPages / book.pages) * 100} className="h-1 mb-2" />
          <div className="text-xs text-gray-500">
            {book.readPages} من {book.pages} صفحة
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mb-3">
          تاريخ الشراء: {book.purchaseDate}
        </div>
      </div>
    </div>
    
    <CardFooter className="p-4 pt-0 flex justify-between gap-2">
      <Button 
        variant="outline" 
        className="flex-1 border-gray-300 text-sm"
      >
        تحميل PDF
      </Button>
      <Button 
        className="flex-1 bg-primary hover:bg-primary-light text-sm"
      >
        متابعة القراءة
      </Button>
    </CardFooter>
  </Card>
);

type EmptyStateProps = {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
};

const EmptyState = ({ title, description, buttonText, buttonHref }: EmptyStateProps) => (
  <div className="text-center py-16 bg-gray-50 rounded-xl">
    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Info size={24} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-bold mb-2 text-primary">{title}</h3>
    <p className="text-gray-600 mb-6">{description}</p>
    <Link to={buttonHref}>
      <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
        {buttonText}
      </Button>
    </Link>
  </div>
);

export default Dashboard;
