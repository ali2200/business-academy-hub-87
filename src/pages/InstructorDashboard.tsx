
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { 
  Book, 
  BookOpen, 
  BarChart2, 
  FileText, 
  MessageSquare, 
  Users, 
  Video, 
  LogOut, 
  Settings,
  User,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InstructorCourses from "@/components/instructor/InstructorCourses";
import InstructorLessons from "@/components/instructor/InstructorLessons";
import InstructorStudents from "@/components/instructor/InstructorStudents";
import InstructorAnalytics from "@/components/instructor/InstructorAnalytics";
import InstructorSettings from "@/components/instructor/InstructorSettings";
import InstructorMessages from "@/components/instructor/InstructorMessages";

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("courses");
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast.error("يجب تسجيل الدخول للوصول إلى لوحة تحكم المحاضر");
          navigate('/signin');
          return;
        }
        
        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          toast.error("حدث خطأ أثناء تحميل بيانات المستخدم");
          return;
        }
        
        setProfile(profileData);
      } catch (error) {
        console.error("Error checking auth:", error);
        toast.error("حدث خطأ أثناء التحقق من تسجيل الدخول");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("تم تسجيل الخروج بنجاح");
      navigate('/signin');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          {/* Sidebar */}
          <Sidebar side="right" variant="sidebar">
            <SidebarHeader className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                  {profile?.display_name?.charAt(0) || "م"}
                </div>
                <div className="mr-2">
                  <h3 className="font-medium">{profile?.display_name || "محاضر"}</h3>
                  <p className="text-xs text-gray-500">لوحة تحكم المحاضر</p>
                </div>
              </div>
              <SidebarTrigger />
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>الرئيسية</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "courses"} onClick={() => setActiveTab("courses")}>
                      <BookOpen className="h-4 w-4 ml-2" />
                      <span>دوراتي</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "lessons"} onClick={() => setActiveTab("lessons")}>
                      <Video className="h-4 w-4 ml-2" />
                      <span>الدروس</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "students"} onClick={() => setActiveTab("students")}>
                      <Users className="h-4 w-4 ml-2" />
                      <span>الطلاب</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "analytics"} onClick={() => setActiveTab("analytics")}>
                      <BarChart2 className="h-4 w-4 ml-2" />
                      <span>الإحصائيات</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "messages"} onClick={() => setActiveTab("messages")}>
                      <MessageSquare className="h-4 w-4 ml-2" />
                      <span>الرسائل</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel>الإعدادات</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "settings"} onClick={() => setActiveTab("settings")}>
                      <Settings className="h-4 w-4 ml-2" />
                      <span>إعدادات الحساب</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter className="p-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>تسجيل الخروج</span>
              </Button>
            </SidebarFooter>
          </Sidebar>
          
          {/* Main Content */}
          <SidebarInset className="p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold">مرحباً، {profile?.display_name || "محاضر"}</h1>
                  <p className="text-gray-500 mt-1">إدارة المحتوى التعليمي بسهولة</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="h-10 px-4 py-2 gap-2"
                    onClick={() => navigate('/')}
                  >
                    العودة للصفحة الرئيسية
                  </Button>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="mt-6">
                {activeTab === "courses" && <InstructorCourses />}
                {activeTab === "lessons" && <InstructorLessons />}
                {activeTab === "students" && <InstructorStudents />}
                {activeTab === "analytics" && <InstructorAnalytics />}
                {activeTab === "messages" && <InstructorMessages />}
                {activeTab === "settings" && <InstructorSettings profile={profile} />}
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default InstructorDashboard;
