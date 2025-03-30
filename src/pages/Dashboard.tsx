import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('courses');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [purchasedBooks, setPurchasedBooks] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  
  const [aboutContent, setAboutContent] = useState({
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
        description: "مجموعة من الكتب الإلكترونية المتخصصة التي تشرح أساسيات ومفاهيم البيزنس بطريقة سهلة وعملية.",
        icon: "book-open"
      },
      {
        id: 3,
        title: "خبرة عملية حقيقية",
        description: "محتوى مبني على تجارب حقيقية وخبرات عملية في السوق المصري، وليس مجرد نظريات.",
        icon: "award"
      }
    ]
  });
  
  const [editMode, setEditMode] = useState(false);
  const [editedFeature, setEditedFeature] = useState<null | number>(null);
  const [tempContent, setTempContent] = useState(aboutContent);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get current auth session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast.error("يجب تسجيل الدخول للوصول إلى لوحة التحكم");
          navigate('/signin');
          return;
        }
        
        // Store user data
        setUser(session.user);
        
        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching profile:", profileError);
          toast.error("حدث خطأ أثناء جلب بيانات الملف الشخصي");
        } else if (profileData) {
          setProfile(profileData);
        }
        
        // Fetch enrolled courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('course_enrollments')
          .select(`
            id,
            progress,
            created_at,
            courses:course_id (
              id,
              title,
              description,
              instructor,
              price,
              image_url,
              students_count,
              level,
              duration,
              status
            )
          `)
          .eq('user_id', session.user.id);
        
        if (coursesError) {
          console.error("Error fetching enrolled courses:", coursesError);
        } else if (coursesData) {
          // Fetch lesson progress for each course
          const enhancedCoursesData = await Promise.all(coursesData.map(async (enrollment) => {
            // Get all lessons for this course
            const { data: lessonsData, error: lessonsError } = await supabase
              .from('lessons')
              .select('id')
              .eq('course_id', enrollment.courses.id);
            
            // Get completed lessons for this course
            const { data: completedLessons, error: completedError } = await supabase
              .from('lesson_progress')
              .select('*')
              .eq('user_id', session.user.id)
              .in('lesson_id', lessonsData?.map(l => l.id) || [])
              .eq('completed', true);
            
            // Get latest accessed lesson
            const { data: latestAccess, error: latestError } = await supabase
              .from('lesson_progress')
              .select('created_at, updated_at')
              .eq('user_id', session.user.id)
              .in('lesson_id', lessonsData?.map(l => l.id) || [])
              .order('updated_at', { ascending: false })
              .limit(1);
            
            // Calculate days since last access
            let lastAccessed = "لم يتم الوصول بعد";
            if (latestAccess && latestAccess.length > 0) {
              const lastDate = new Date(latestAccess[0].updated_at);
              const currentDate = new Date();
              const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              if (diffDays === 0) {
                lastAccessed = "اليوم";
              } else if (diffDays === 1) {
                lastAccessed = "منذ يوم واحد";
              } else if (diffDays < 7) {
                lastAccessed = `منذ ${diffDays} أيام`;
              } else if (diffDays < 30) {
                const weeks = Math.floor(diffDays / 7);
                lastAccessed = `منذ ${weeks} ${weeks === 1 ? 'أسبوع' : 'أسابيع'}`;
              } else {
                const months = Math.floor(diffDays / 30);
                lastAccessed = `منذ ${months} ${months === 1 ? 'شهر' : 'أشهر'}`;
              }
            }
            
            const totalLessons = lessonsData?.length || 0;
            const completedLessonsCount = completedLessons?.length || 0;
            const progress = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;
            
            // Check if eligible for certificate
            const certificateEligible = progress === 100;
            
            return {
              id: enrollment.courses.id,
              title: enrollment.courses.title,
              image: enrollment.courses.image_url || 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
              instructor: enrollment.courses.instructor,
              progress: progress,
              totalLessons: totalLessons,
              completedLessons: completedLessonsCount,
              lastAccessed: lastAccessed,
              certificate: certificateEligible,
              enrollmentId: enrollment.id,
              enrollmentDate: enrollment.created_at
            };
          }));
          
          setEnrolledCourses(enhancedCoursesData);
          
          // Fetch certificates for completed courses
          if (enhancedCoursesData) {
            const completedCourses = enhancedCoursesData.filter(course => course.progress === 100);
            
            const certificatesData = completedCourses.map(course => ({
              id: course.id,
              courseTitle: course.title,
              issueDate: new Date(course.enrollmentDate).toLocaleDateString('ar-EG'),
              certificate: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=1935&auto=format&fit=crop'
            }));
            
            setCertificates(certificatesData);
          }
        }
        
        // Fetch purchased books
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            id,
            created_at,
            order_items (
              item_id,
              item_type
            )
          `)
          .eq('user_id', session.user.id)
          .eq('status', 'completed');
        
        if (!ordersError && ordersData) {
          // Extract book IDs from orders
          const bookItemIds = ordersData.flatMap(order => 
            order.order_items
              .filter(item => item.item_type === 'book')
              .map(item => item.item_id)
          );
          
          if (bookItemIds.length > 0) {
            // Fetch book details
            const { data: booksData, error: booksError } = await supabase
              .from('books')
              .select('*')
              .in('id', bookItemIds);
            
            if (!booksError && booksData) {
              // Format books with purchase date from order
              const formattedBooks = booksData.map(book => {
                // Find the order that contains this book
                const order = ordersData.find(o => 
                  o.order_items.some(item => 
                    item.item_id === book.id && item.item_type === 'book'
                  )
                );
                
                // Placeholder for read progress (in a real app, you would track this)
                const readPages = Math.floor(Math.random() * (book.pages || 100));
                
                return {
                  id: book.id,
                  title: book.title,
                  cover: book.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop',
                  author: book.author,
                  purchaseDate: new Date(order?.created_at || Date.now()).toLocaleDateString('ar-EG'),
                  pages: book.pages || 100,
                  readPages: readPages,
                };
              });
              
              setPurchasedBooks(formattedBooks);
            }
          }
        }
        
      } catch (err) {
        console.error("Error in fetchUserData:", err);
        toast.error("حدث خطأ أثناء جلب بيانات المستخدم");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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

  const goToCoursePlayer = (courseId: string) => {
    navigate(`/course-player/${courseId}`);
  };

  const goToBookReader = (bookId: string) => {
    navigate(`/book-reader/${bookId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

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
            <Avatar 
              className="h-14 w-14 border-2 border-secondary cursor-pointer" 
              onClick={() => navigate('/profile')}
            >
              <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} alt={profile?.display_name || user?.email} />
              <AvatarFallback>{(profile?.display_name || user?.email || '').charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-bold text-lg text-primary">{profile?.display_name || profile?.first_name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
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
                href="/profile" 
                active={activeTab === 'settings'} 
                onClick={() => {
                  navigate('/profile');
                  isMobile && setSidebarOpen(false);
                }} 
              />
            </ul>
          </nav>
          
          <div className="pt-6 border-t border-gray-100">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
              onClick={handleLogout}
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
            <p className="text-gray-600">اهلا بك {profile?.display_name || profile?.first_name || user?.email}، هنا يمكنك متابعة تعلمك ومشترياتك</p>
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
                
                {enrolledCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((course) => (
                      <CourseCard key={course.id} course={course} onContinue={() => goToCoursePlayer(course.id)} />
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
                
                {purchasedBooks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {purchasedBooks.map((book) => (
                      <BookCard key={book.id} book={book} onRead={() => goToBookReader(book.id)} />
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
                
                {certificates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert) => (
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
