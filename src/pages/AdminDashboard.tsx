
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, BookText, FileText, LayoutGrid, Image, Video, FileVideo, Users, Settings, ShoppingCart, Bell, User, LogOut, PenTool, Newspaper, BookOpen as BookIcon } from 'lucide-react';
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        
        // Get current auth session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast.error("يجب تسجيل الدخول للوصول إلى لوحة التحكم");
          navigate('/signin');
          return;
        }
        
        setUserEmail(session.user.email || '');
        
        // Check if user is admin
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin, display_name, first_name, last_name, avatar_url')
          .eq('id', session.user.id)
          .single();
        
        if (error || !data?.is_admin) {
          toast.error("ليس لديك صلاحية للوصول إلى لوحة التحكم");
          navigate('/dashboard');
          return;
        }
        
        setIsAdmin(true);
        setUserName(data.display_name || `${data.first_name || ''} ${data.last_name || ''}`);
        setUserAvatar(data.avatar_url || '');
      } catch (err) {
        console.error("Error checking admin status:", err);
        toast.error("حدث خطأ أثناء التحقق من صلاحياتك");
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('user');
      toast.success("تم تسجيل الخروج بنجاح");
      navigate('/signin');
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };
  
  const stats = [
    { label: 'إجمالي المبيعات', value: '14,560 ج.م', percentage: '+12%', trend: 'up' },
    { label: 'مستخدمين جدد', value: '57', percentage: '+5%', trend: 'up' },
    { label: 'الزيارات', value: '1,245', percentage: '-3%', trend: 'down' },
    { label: 'الدورات النشطة', value: '8', percentage: '+2', trend: 'up' },
  ];
  
  const adminMenu = [
    { 
      title: 'إدارة المحتوى', 
      description: 'تحكم في محتوى الموقع', 
      icon: <PenTool className="h-10 w-10 text-primary" />,
      link: '/content-management',
      actions: [
        { label: 'عرض المحتوى', link: '/content-management' }
      ]
    },
    { 
      title: 'إدارة الدورات', 
      description: 'أضف وعدّل الدورات التدريبية', 
      icon: <FileVideo className="h-10 w-10 text-primary" />,
      link: '/courses-management',
      actions: [
        { label: 'عرض الدورات', link: '/courses-management' },
        { label: 'إضافة دورة', link: '/courses-management/create' }
      ]
    },
    { 
      title: 'إدارة الكتب', 
      description: 'أضف وعدّل الكتب الإلكترونية', 
      icon: <BookIcon className="h-10 w-10 text-primary" />,
      link: '/books-management',
      actions: [
        { label: 'عرض الكتب', link: '/books-management' }
      ]
    },
    { 
      title: 'إدارة المقالات', 
      description: 'أضف وعدّل المقالات والمدونة', 
      icon: <Newspaper className="h-10 w-10 text-primary" />,
      link: '/articles-management',
      actions: [
        { label: 'عرض المقالات', link: '/articles-management' }
      ]
    },
    { 
      title: 'إدارة الصفحات', 
      description: 'تحكم في صفحات الموقع', 
      icon: <FileText className="h-10 w-10 text-primary" />,
      link: '/pages-management',
      actions: [
        { label: 'عرض الصفحات', link: '/pages-management' }
      ]
    },
    { 
      title: 'إدارة الوسائط', 
      description: 'أضف وعدّل الصور والفيديوهات', 
      icon: <Image className="h-10 w-10 text-primary" />,
      link: '/media-management',
      actions: [
        { label: 'مكتبة الوسائط', link: '/media-management' }
      ]
    },
    { 
      title: 'إدارة المستخدمين', 
      description: 'إدارة حسابات المستخدمين', 
      icon: <Users className="h-10 w-10 text-primary" />,
      link: '/users-management',
      actions: [
        { label: 'عرض المستخدمين', link: '/users-management' }
      ]
    },
    { 
      title: 'الإعدادات', 
      description: 'تكوين إعدادات الموقع', 
      icon: <Settings className="h-10 w-10 text-primary" />,
      link: '/settings',
      actions: [
        { label: 'عرض الإعدادات', link: '/settings' }
      ]
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/4307c383-57c5-4d42-abdc-1344087ec7a6.png" 
              alt="شعار بتاع البيزنس" 
              className="h-10 ml-4"
            />
            <h1 className="text-xl font-bold text-gray-900">لوحة تحكم المشرف</h1>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 relative">
                  {userAvatar ? (
                    <img src={userAvatar} alt={userName} className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-gray-600" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="font-medium text-sm">{userName}</p>
                    <p className="text-xs text-gray-500">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/')}>
                  <LayoutGrid className="h-4 w-4 ml-2" />
                  <span>الموقع الرئيسي</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <User className="h-4 w-4 ml-2" />
                  <span>لوحة تحكم المستخدم</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Settings className="h-4 w-4 ml-2" />
                  <span>إدارة الملف الشخصي</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="h-4 w-4 ml-2" />
                  <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Heading */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">لوحة التحكم</h2>
          <p className="text-gray-600">إدارة المحتوى والمستخدمين والإحصائيات</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    stat.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {stat.percentage}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {adminMenu.map((item, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription className="mt-1">{item.description}</CardDescription>
                  </div>
                  {item.icon}
                </div>
              </CardHeader>
              <CardFooter className="pt-2 flex flex-col items-stretch gap-2">
                {item.actions.map((action, actionIndex) => (
                  <Button 
                    key={actionIndex} 
                    className={actionIndex === 0 ? "w-full" : "w-full bg-secondary hover:bg-secondary/90"}
                    onClick={() => navigate(action.link)}
                  >
                    {action.label}
                  </Button>
                ))}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Quick Access Buttons */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate('/')}>
            <LayoutGrid className="h-4 w-4" />
            العودة للموقع الرئيسي
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
