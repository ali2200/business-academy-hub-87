
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, BookOpen, ShoppingCart, Settings, LogOut, Play, Award, Book, Clock, Check, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Mock user data
const USER = {
  name: 'محمد أحمد',
  email: 'mohammed.ahmed@example.com',
  avatar: 'https://i.pravatar.cc/150?img=4',
  joinDate: '12 أكتوبر 2023'
};

// Mock enrolled courses
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

// Mock purchased books
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

// Mock certificates
const CERTIFICATES = [
  {
    id: 1,
    courseTitle: 'إدارة المشاريع الصغيرة',
    issueDate: '20 سبتمبر 2023',
    certificate: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=1935&auto=format&fit=crop'
  }
];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    window.scrollTo(0, 0);

    const checkWidth = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const showCertificateToast = () => {
    toast.success("تم تحميل الشهادة بنجاح", {
      description: "يمكنك الآن طباعة الشهادة أو مشاركتها",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toggle sidebar button (mobile only) */}
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
      
      {/* Sidebar */}
      <aside 
        className={`bg-white fixed top-0 right-0 h-full shadow-lg transform transition-all duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 w-64 lg:w-80`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* User info */}
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
          
          {/* Navigation */}
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
          
          {/* Footer */}
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
      
      {/* Main content */}
      <main 
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:mr-80' : 'mr-0'
        } min-h-screen pt-8 pb-16`}
      >
        <div className="container mx-auto px-4">
          {/* Page header */}
          <header className="mb-8 pt-4">
            <h1 className="text-3xl font-bold text-primary mb-2">لوحة التحكم</h1>
            <p className="text-gray-600">اهلا بك {USER.name}، هنا يمكنك متابعة تعلمك ومشترياتك</p>
          </header>
          
          {/* Dashboard content */}
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
              </TabsList>
              
              {/* Courses Tab */}
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
              
              {/* Books Tab */}
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
              
              {/* Certificates Tab */}
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
