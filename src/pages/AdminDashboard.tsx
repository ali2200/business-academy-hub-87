
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Book, 
  FileText, 
  Settings, 
  LogOut,
  Users,
  DollarSign,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

// Mock data for courses
const COURSES_DATA = [
  {
    id: "1",
    title: "أساسيات البيع الاحترافي",
    instructor: "أحمد محمد",
    price: 499,
    currency: "ج.م",
    studentsCount: 1250,
    status: "published",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    lastUpdated: "15 أبريل 2023",
  },
  {
    id: "2",
    title: "التسويق الرقمي للمبتدئين",
    instructor: "سارة أحمد",
    price: 399,
    currency: "ج.م",
    studentsCount: 820,
    status: "published",
    image: "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=2069&auto=format&fit=crop",
    lastUpdated: "3 مايو 2023",
  },
  {
    id: "3",
    title: "إدارة المشاريع الصغيرة",
    instructor: "محمد علي",
    price: 599,
    currency: "ج.م",
    studentsCount: 634,
    status: "published",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
    lastUpdated: "20 مارس 2023",
  },
  {
    id: "4",
    title: "أسرار التفاوض الفعال",
    instructor: "ليلى محمود",
    price: 349,
    currency: "ج.م",
    studentsCount: 0,
    status: "draft",
    image: "https://images.unsplash.com/photo-1573496546038-82f9c39f6365?q=80&w=2069&auto=format&fit=crop",
    lastUpdated: "10 يونيو 2023",
  },
];

// Mock data for books
const BOOKS_DATA = [
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
  },
];

// Mock data for articles
const ARTICLES_DATA = [
  {
    id: "1",
    title: "10 استراتيجيات لزيادة المبيعات في 2023",
    author: "أحمد محمد",
    viewsCount: 12530,
    status: "published",
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2070&auto=format&fit=crop",
    publishDate: "15 مايو 2023",
  },
  {
    id: "2",
    title: "كيف تبني علاقات قوية مع العملاء",
    author: "سارة أحمد",
    viewsCount: 8745,
    status: "published",
    image: "https://images.unsplash.com/photo-1525130413817-d45c1d127c42?q=80&w=2070&auto=format&fit=crop",
    publishDate: "3 يونيو 2023",
  },
  {
    id: "3",
    title: "أساسيات التسويق عبر وسائل التواصل الاجتماعي",
    author: "محمد علي",
    viewsCount: 6320,
    status: "published",
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=2070&auto=format&fit=crop",
    publishDate: "20 أبريل 2023",
  },
  {
    id: "4",
    title: "تحديات ريادة الأعمال في العالم العربي",
    author: "ليلى محمود",
    viewsCount: 0,
    status: "draft",
    image: "https://images.unsplash.com/photo-1664575599618-8f6bd76fc670?q=80&w=2070&auto=format&fit=crop",
    publishDate: "لم يتم النشر بعد",
  },
];

// Mock data for sales and analytics
const ANALYTICS_DATA = {
  courseSales: {
    totalSales: 142500,
    growth: 15.4,
    monthly: [12500, 14200, 11800, 13400, 16200, 15700, 14900, 17200, 16800, 17500, 18300, 20100],
  },
  bookSales: {
    totalSales: 28700,
    growth: 8.7,
    monthly: [2100, 2300, 2200, 2400, 2500, 2300, 2600, 2700, 2600, 2900, 3000, 3100],
  },
  users: {
    total: 3250,
    growth: 22.1,
    monthly: [210, 240, 270, 260, 290, 310, 320, 350, 370, 390, 420, 450],
  },
  pageViews: {
    total: 187450,
    growth: 32.6,
    monthly: [12500, 13200, 14500, 15100, 16200, 15700, 16900, 17200, 18500, 19100, 20100, 21500],
  },
};

// Mock data for recent users
const RECENT_USERS = [
  {
    id: "1",
    name: "محمد أحمد",
    email: "mohamed.ahmed@example.com",
    registeredDate: "12 مايو 2023",
    purchases: 3,
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "سارة محمود",
    email: "sara.mahmoud@example.com",
    registeredDate: "5 يونيو 2023",
    purchases: 1,
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "أحمد علي",
    email: "ahmed.ali@example.com",
    registeredDate: "20 أبريل 2023",
    purchases: 2,
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "4",
    name: "نور حسن",
    email: "nour.hassan@example.com",
    registeredDate: "8 يوليو 2023",
    purchases: 0,
    avatar: "https://i.pravatar.cc/150?img=4",
  },
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const createCourse = () => {
    toast.success("تم إنشاء مسودة دورة جديدة", {
      description: "يمكنك الآن إضافة محتوى الدورة"
    });
  };

  const createBook = () => {
    toast.success("تم إنشاء مسودة كتاب جديد", {
      description: "يمكنك الآن إضافة محتوى الكتاب"
    });
  };

  const createArticle = () => {
    toast.success("تم إنشاء مسودة مقال جديد", {
      description: "يمكنك الآن كتابة المقال"
    });
  };

  const createFunnel = () => {
    toast.success("تم إنشاء مسودة قمع مبيعات جديد", {
      description: "يمكنك الآن تصميم صفحات قمع المبيعات"
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
          {sidebarOpen ? <Trash2 size={20} /> : <LayoutDashboard size={20} />}
        </Button>
      </div>
      
      {/* Sidebar */}
      <aside 
        className={`bg-white fixed top-0 right-0 h-full shadow-lg transform transition-all duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 w-64 lg:w-72`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Admin info */}
          <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-6">
            <Avatar className="h-12 w-12 border-2 border-primary">
              <AvatarImage src="https://i.pravatar.cc/150?img=5" alt="المشرف" />
              <AvatarFallback>م</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-bold text-lg text-primary">المشرف</h2>
              <p className="text-sm text-gray-500">admin@example.com</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-grow">
            <ul className="space-y-1">
              <AdminNavItem 
                icon={LayoutDashboard} 
                label="لوحة التحكم" 
                active={activeTab === 'overview'} 
                onClick={() => {
                  setActiveTab('overview');
                  isMobile && setSidebarOpen(false);
                }} 
              />
              <AdminNavItem 
                icon={BookOpen} 
                label="الدورات" 
                active={activeTab === 'courses'} 
                onClick={() => {
                  setActiveTab('courses');
                  isMobile && setSidebarOpen(false);
                }} 
              />
              <AdminNavItem 
                icon={Book} 
                label="الكتب" 
                active={activeTab === 'books'} 
                onClick={() => {
                  setActiveTab('books');
                  isMobile && setSidebarOpen(false);
                }} 
              />
              <AdminNavItem 
                icon={FileText} 
                label="المقالات" 
                active={activeTab === 'articles'} 
                onClick={() => {
                  setActiveTab('articles');
                  isMobile && setSidebarOpen(false);
                }} 
              />
              <AdminNavItem 
                icon={ArrowUpRight} 
                label="قمع المبيعات" 
                active={activeTab === 'funnels'} 
                onClick={() => {
                  setActiveTab('funnels');
                  isMobile && setSidebarOpen(false);
                }} 
              />
              <AdminNavItem 
                icon={Users} 
                label="المستخدمين" 
                active={activeTab === 'users'} 
                onClick={() => {
                  setActiveTab('users');
                  isMobile && setSidebarOpen(false);
                }} 
              />
              <AdminNavItem 
                icon={Settings} 
                label="الإعدادات" 
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
              onClick={() => navigate('/')}
            >
              <LogOut size={18} className="ml-2" />
              <span>العودة للموقع</span>
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main 
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:mr-72' : 'mr-0'
        } min-h-screen pt-8 pb-16`}
      >
        <div className="container mx-auto px-4">
          {/* Page header */}
          <header className="mb-8 pt-4">
            <h1 className="text-3xl font-bold text-primary mb-2">لوحة تحكم المشرف</h1>
            <p className="text-gray-600">إدارة المحتوى والمستخدمين والإحصائيات</p>
          </header>
          
          {/* Dashboard content */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-8 bg-gray-100 p-1 rounded-xl w-full justify-start overflow-x-auto">
                <TabsTrigger value="overview" className="py-3 px-4 rounded-lg">
                  <LayoutDashboard size={18} className="ml-2" />
                  نظرة عامة
                </TabsTrigger>
                <TabsTrigger value="courses" className="py-3 px-4 rounded-lg">
                  <BookOpen size={18} className="ml-2" />
                  الدورات
                </TabsTrigger>
                <TabsTrigger value="books" className="py-3 px-4 rounded-lg">
                  <Book size={18} className="ml-2" />
                  الكتب
                </TabsTrigger>
                <TabsTrigger value="articles" className="py-3 px-4 rounded-lg">
                  <FileText size={18} className="ml-2" />
                  المقالات
                </TabsTrigger>
                <TabsTrigger value="funnels" className="py-3 px-4 rounded-lg">
                  <ArrowUpRight size={18} className="ml-2" />
                  قمع المبيعات
                </TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Summary Cards */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">إجمالي المبيعات</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground text-gray-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">
                        {ANALYTICS_DATA.courseSales.totalSales + ANALYTICS_DATA.bookSales.totalSales} ج.م
                      </div>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                        {ANALYTICS_DATA.courseSales.growth}% منذ الشهر الماضي
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">مبيعات الدورات</CardTitle>
                      <BookOpen className="h-4 w-4 text-muted-foreground text-gray-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">
                        {ANALYTICS_DATA.courseSales.totalSales} ج.م
                      </div>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                        {ANALYTICS_DATA.courseSales.growth}% منذ الشهر الماضي
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">مبيعات الكتب</CardTitle>
                      <Book className="h-4 w-4 text-muted-foreground text-gray-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">
                        {ANALYTICS_DATA.bookSales.totalSales} ج.م
                      </div>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                        {ANALYTICS_DATA.bookSales.growth}% منذ الشهر الماضي
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">المستخدمين</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground text-gray-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">
                        {ANALYTICS_DATA.users.total}
                      </div>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                        {ANALYTICS_DATA.users.growth}% منذ الشهر الماضي
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Recent Users */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>أحدث المستخدمين</CardTitle>
                    <CardDescription>
                      المستخدمين الذين انضموا مؤخرًا إلى المنصة
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="py-3 px-4 text-gray-500 font-medium text-right">المستخدم</th>
                            <th className="py-3 px-4 text-gray-500 font-medium text-right">البريد الإلكتروني</th>
                            <th className="py-3 px-4 text-gray-500 font-medium text-right">تاريخ التسجيل</th>
                            <th className="py-3 px-4 text-gray-500 font-medium text-right">المشتريات</th>
                            <th className="py-3 px-4 text-gray-500 font-medium text-right">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {RECENT_USERS.map((user) => (
                            <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 ml-2">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{user.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-gray-600">{user.email}</td>
                              <td className="py-3 px-4 text-gray-600">{user.registeredDate}</td>
                              <td className="py-3 px-4">
                                <Badge variant={user.purchases > 0 ? "secondary" : "outline"}>
                                  {user.purchases}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2 rtl:space-x-reverse">
                                  <Button variant="ghost" size="icon">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Courses Tab */}
              <TabsContent value="courses" className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-primary">إدارة الدورات</h2>
                  <Button onClick={createCourse} className="flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>إضافة دورة جديدة</span>
                  </Button>
                </div>
                
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="ابحث عن دورة..."
                      className="pl-3 pr-10"
                    />
                  </div>
                </div>
                
                <div className="overflow-x-auto bg-white rounded-lg border">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-gray-500 font-medium text-right">الدورة</th>
                        <th className="py-3 px-4 text-gray-500 font-medium text-right">المدرب</th>
                        <th className="py-3 px-4 text-gray-500 font-medium text-right">السعر</th>
                        <th className="py-3 px-4 text-gray-500 font-medium text-right">الطلاب</th>
                        <th className="py-3 px-4 text-gray-500 font-medium text-right">الحالة</th>
                        <th className="py-3 px-4 text-gray-500 font-medium text-right">آخر تحديث</th>
                        <th className="py-3 px-4 text-gray-500 font-medium text-right">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COURSES_DATA.map((course) => (
                        <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded overflow-hidden ml-2">
                                <img 
                                  src={course.image} 
                                  alt={course.title} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <span className="font-medium">{course.title}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{course.instructor}</td>
                          <td className="py-3 px-4 text-gray-600">{course.price} {course.currency}</td>
                          <td className="py-3 px-4 text-gray-600">{course.studentsCount}</td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={course.status === 'published' ? 'secondary' : 'outline'}
                              className={course.status === 'published' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                            >
                              {course.status === 'published' ? 'منشور' : 'مسودة'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{course.lastUpdated}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2 rtl:space-x-reverse">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
                      <PaginationLink href="#">
                        2
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </TabsContent>
              
              {/* Books Tab */}
              <TabsContent value="books" className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-primary">إدارة الكتب</h2>
                  <Button onClick={createBook} className="flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>إضافة كتاب جديد</span>
                  </Button>
                </div>
                
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="ابحث عن كتاب..."
                      className="pl-3 pr-10"
                    />
                  </div>
                </div>
                
                <div className="overflow-x-auto bg-white rounded-lg border">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-gray-500 font-medium text-right">الكتاب</th>
                        <th className="py-3 px-4 text-gray-500 font-medium text-right">المؤلف</th>
                        <th className="py-3 px-4 text-gray-500 font-medium text-right">السعر</th>
                        <th className="py-3 px-4 text-gray-500 font-medium text-right">المشتريات</th>
                        <th className="py-3 px-4 text-gray-500 font-medium text-right">الحالة</th>
                        <th className="py-3 px-4 text-gray-500 font-medium text-right">آخر تحديث</th>
                        <th className="py-3 px-4 text-gray-500 font-medium text-right">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {BOOKS_DATA.map((book) => (
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
                            >
                              {book.status === 'published' ? 'منشور' : 'مسودة'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{book.lastUpdated}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2 rtl:space-x-reverse">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
              </TabsContent>
              
              {/* Articles Tab */}
              <TabsContent value="articles" className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-primary">إدارة المقالات</h2>
                  <Button onClick={createArticle} className="flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>إضافة مقال جديد</span>
                  </Button>
                </div>
                
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="ابحث عن مقال..."
                      className="pl-3 pr-10"
                    />
                  </div>
                </div>
                
                <div className="overflow-x-auto bg-white rounded-lg border">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-gray-500 font-medium text-right">المقال</th>
                        <th className="py-3 px-4 text-gray-500 font-medium text-right">الكاتب</th>
                        <th className="py-3 px-4 text-gray-500 font-medium text-right">المشاهدات</th>
                        <th className="py-3 px-4 text-gray-500 font-medium text-right">الحالة</th>
                        <th className="py-3 px-4 text-gray-500 font-medium text-right">تاريخ النشر</th>
                        <th className="py-3 px-4 text-gray-500 font-medium text-right">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ARTICLES_DATA.map((article) => (
                        <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded overflow-hidden ml-2">
                                <img 
                                  src={article.image} 
                                  alt={article.title} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <span className="font-medium">{article.title}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{article.author}</td>
                          <td className="py-3 px-4 text-gray-600">{article.viewsCount}</td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={article.status === 'published' ? 'secondary' : 'outline'}
                              className={article.status === 'published' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                            >
                              {article.status === 'published' ? 'منشور' : 'مسودة'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{article.publishDate}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2 rtl:space-x-reverse">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
              </TabsContent>
              
              {/* Sales Funnels Tab */}
              <TabsContent value="funnels" className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-primary">قمع المبيعات</h2>
                  <Button onClick={createFunnel} className="flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>إنشاء قمع مبيعات جديد</span>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Example Sales Funnel Cards */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>دورة البيع الاحترافي</CardTitle>
                      <CardDescription>قمع مبيعات لدورة البيع الاحترافي</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>معدل التحويل</span>
                        <span>8.2%</span>
                      </div>
                      <Progress value={8.2} className="h-1" />
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>الزيارات</span>
                          <span>1,245</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>المشتركين</span>
                          <span>102</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>الإيرادات</span>
                          <span>50,898 ج.م</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button variant="outline" className="flex-1">تعديل</Button>
                      <Button className="flex-1">عرض التقرير</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>كتاب أسرار البيع</CardTitle>
                      <CardDescription>قمع مبيعات لكتاب أسرار البيع</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>معدل التحويل</span>
                        <span>5.7%</span>
                      </div>
                      <Progress value={5.7} className="h-1" />
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>الزيارات</span>
                          <span>837</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>المشتركين</span>
                          <span>48</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>الإيرادات</span>
                          <span>3,792 ج.م</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button variant="outline" className="flex-1">تعديل</Button>
                      <Button className="flex-1">عرض التقرير</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>قمع مبيعات جديد</CardTitle>
                      <CardDescription>أنشئ قمع مبيعات جديد لمنتجاتك</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 pb-8 text-center">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <PlusCircle className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">
                        ابدأ بإنشاء قمع مبيعات جديد لزيادة مبيعات منتجاتك
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={createFunnel} className="w-full">
                        إنشاء قمع مبيعات
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

type AdminNavItemProps = {
  icon: React.FC<any>;
  label: string;
  active: boolean;
  onClick: () => void;
};

const AdminNavItem = ({ icon: Icon, label, active, onClick }: AdminNavItemProps) => (
  <li>
    <button
      className={`flex items-center py-3 px-4 rounded-lg transition-colors w-full text-right ${
        active 
          ? 'bg-primary text-white' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      <Icon size={20} className="ml-3" />
      <span>{label}</span>
    </button>
  </li>
);

export default AdminDashboard;
