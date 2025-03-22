
import React, { useState, useEffect } from 'react';
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
  ArrowUpRight,
  PenTool,
  Mail,
  Phone,
  MoreHorizontal,
  Pencil
} from 'lucide-react';
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddContentDialog from '@/components/AddContentDialog';

const AdminNavItem = ({ icon: Icon, label, active, onClick }: { 
  icon: React.ElementType; 
  label: string; 
  active: boolean; 
  onClick: () => void 
}) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full flex items-center px-4 py-3 rounded-lg text-right transition-colors ${
          active 
            ? 'bg-primary/10 text-primary font-medium' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Icon className="ml-3 h-5 w-5" />
        <span>{label}</span>
      </button>
    </li>
  );
};

// User details dialog component
const UserDetailsDialog = ({ user, onClose, onEdit }: { 
  user: any, 
  onClose: () => void,
  onEdit: (userData: any) => void
}) => {
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    display_name: user.display_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    phone: user.phone || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await onEdit(userData);
      setEditMode(false);
      toast.success("تم تحديث بيانات المستخدم بنجاح");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("حدث خطأ أثناء تحديث بيانات المستخدم");
    }
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span>بيانات المستخدم</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setEditMode(!editMode)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="flex justify-center mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar_url} alt={userData.display_name} />
            <AvatarFallback>{userData.display_name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </div>
        
        {editMode ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">الاسم الأول</label>
                <Input 
                  name="first_name"
                  value={userData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">الاسم الأخير</label>
                <Input 
                  name="last_name"
                  value={userData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">اسم العرض</label>
              <Input 
                name="display_name"
                value={userData.display_name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">البريد الإلكتروني</label>
              <Input 
                name="email"
                value={userData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">رقم الهاتف</label>
              <Input 
                name="phone"
                value={userData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="font-medium text-lg">{userData.display_name}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 ml-2" />
                <span>{userData.email}</span>
              </div>
              {userData.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 ml-2" />
                  <span>{userData.phone}</span>
                </div>
              )}
            </div>
            <div className="pt-2 border-t">
              <div className="text-sm text-gray-500">
                تاريخ التسجيل: {new Date(user.created_at).toLocaleDateString('ar-EG')}
              </div>
              <div className="text-sm text-gray-500">
                عدد المشتريات: {user.purchases || 0}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <DialogFooter>
        {editMode ? (
          <>
            <Button variant="outline" onClick={() => setEditMode(false)}>إلغاء</Button>
            <Button onClick={handleSave}>حفظ التغييرات</Button>
          </>
        ) : (
          <Button onClick={onClose}>إغلاق</Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
};

// Course edit dialog component
const CourseEditDialog = ({ course, onSave, onClose }: { 
  course: any, 
  onSave: (courseData: any) => void,
  onClose: () => void
}) => {
  const [courseData, setCourseData] = useState({
    title: course?.title || '',
    instructor: course?.instructor || '',
    description: course?.description || '',
    price: course?.price || 0,
    currency: course?.currency || 'ج.م',
    status: course?.status || 'draft',
    image_url: course?.image_url || '',
    category: course?.category || '',
    level: course?.level || 'beginner',
    duration: course?.duration || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(courseData);
      toast.success("تم حفظ الدورة بنجاح");
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("حدث خطأ أثناء حفظ الدورة");
    }
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {course ? 'تعديل الدورة' : 'إضافة دورة جديدة'}
        </DialogTitle>
        <DialogDescription>
          {course ? 'قم بتعديل بيانات الدورة' : 'قم بإدخال بيانات الدورة الجديدة'}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">عنوان الدورة</label>
            <Input 
              name="title"
              value={courseData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">اسم المدرب</label>
            <Input 
              name="instructor"
              value={courseData.instructor}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">وصف الدورة</label>
          <Textarea 
            name="description"
            value={courseData.description}
            onChange={handleChange}
            rows={4}
            autoSize
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">السعر</label>
            <Input 
              name="price"
              type="number"
              value={courseData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">العملة</label>
            <Input 
              name="currency"
              value={courseData.currency}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">الحالة</label>
            <select
              name="status"
              value={courseData.status}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="draft">مسودة</option>
              <option value="published">منشور</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">رابط الصورة</label>
            <Input 
              name="image_url"
              value={courseData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">التصنيف</label>
            <Input 
              name="category"
              value={courseData.category}
              onChange={handleChange}
              placeholder="مبيعات، تسويق، إدارة..."
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">المستوى</label>
            <select
              name="level"
              value={courseData.level}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="beginner">مبتدئ</option>
              <option value="intermediate">متوسط</option>
              <option value="advanced">متقدم</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">المدة</label>
            <Input 
              name="duration"
              value={courseData.duration}
              onChange={handleChange}
              placeholder="4 ساعات، 12 أسبوع..."
            />
          </div>
        </div>
      
        <DialogFooter>
          <Button variant="outline" type="button" onClick={onClose}>إلغاء</Button>
          <Button type="submit">حفظ</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

// Book edit dialog component
const BookEditDialog = ({ book, onSave, onClose }: { 
  book: any, 
  onSave: (bookData: any) => void,
  onClose: () => void
}) => {
  const [bookData, setBookData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    description: book?.description || '',
    price: book?.price || 0,
    currency: book?.currency || 'ج.م',
    status: book?.status || 'draft',
    cover_url: book?.cover_url || '',
    category: book?.category || '',
    pages: book?.pages || 0,
    pdf_url: book?.pdf_url || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookData(prev => ({ 
      ...prev, 
      [name]: name === 'pages' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(bookData);
      toast.success("تم حفظ الكتاب بنجاح");
    } catch (error) {
      console.error("Error saving book:", error);
      toast.error("حدث خطأ أثناء حفظ الكتاب");
    }
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {book ? 'تعديل الكتاب' : 'إضافة كتاب جديد'}
        </DialogTitle>
        <DialogDescription>
          {book ? 'قم بتعديل بيانات الكتاب' : 'قم بإدخال بيانات الكتاب الجديد'}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">عنوان الكتاب</label>
            <Input 
              name="title"
              value={bookData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">اسم المؤلف</label>
            <Input 
              name="author"
              value={bookData.author}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">وصف الكتاب</label>
          <Textarea 
            name="description"
            value={bookData.description}
            onChange={handleChange}
            rows={4}
            autoSize
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">السعر</label>
            <Input 
              name="price"
              type="number"
              value={bookData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">العملة</label>
            <Input 
              name="currency"
              value={bookData.currency}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">الحالة</label>
            <select
              name="status"
              value={bookData.status}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="draft">مسودة</option>
              <option value="published">منشور</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">رابط صورة الغلاف</label>
            <Input 
              name="cover_url"
              value={bookData.cover_url}
              onChange={handleChange}
              placeholder="https://example.com/cover.jpg"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">التصنيف</label>
            <Input 
              name="category"
              value={bookData.category}
              onChange={handleChange}
              placeholder="مبيعات، تسويق، إدارة..."
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">عدد الصفحات</label>
            <Input 
              name="pages"
              type="number"
              value={bookData.pages}
              onChange={handleChange}
              placeholder="100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">رابط ملف PDF</label>
            <Input 
              name="pdf_url"
              value={bookData.pdf_url}
              onChange={handleChange}
              placeholder="https://example.com/book.pdf"
            />
          </div>
        </div>
      
        <DialogFooter>
          <Button variant="outline" type="button" onClick={onClose}>إلغاء</Button>
          <Button type="submit">حفظ</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

// Article edit dialog component
const ArticleEditDialog = ({ article, onSave, onClose }: { 
  article: any, 
  onSave: (articleData: any) => void,
  onClose: () => void
}) => {
  const [articleData, setArticleData] = useState({
    title: article?.title || '',
    author: article?.author_id || '',
    content: article?.content || '',
    excerpt: article?.excerpt || '',
    status: article?.status || 'draft',
    slug: article?.slug || '',
    featured_image: article?.featured_image || '',
    tags: article?.tags?.join(', ') || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setArticleData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert tags from comma-separated string to array
    const formattedData = {
      ...articleData,
      tags: articleData.tags ? articleData.tags.split(',').map(tag => tag.trim()) : [],
    };
    
    try {
      await onSave(formattedData);
      toast.success("تم حفظ المقال بنجاح");
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error("حدث خطأ أثناء حفظ المقال");
    }
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {article ? 'تعديل المقال' : 'إضافة مقال جديد'}
        </DialogTitle>
        <DialogDescription>
          {article ? 'قم بتعديل بيانات المقال' : 'قم بإدخال بيانات المقال الجديد'}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">عنوان المقال</label>
          <Input 
            name="title"
            value={articleData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">الكاتب</label>
            <Input 
              name="author"
              value={articleData.author}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">الرابط (Slug)</label>
            <Input 
              name="slug"
              value={articleData.slug}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">ملخص المقال</label>
          <Textarea 
            name="excerpt"
            value={articleData.excerpt}
            onChange={handleChange}
            rows={2}
            placeholder="ملخص قصير للمقال يظهر في صفحة قائمة المقالات"
            autoSize
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">محتوى المقال</label>
          <Textarea 
            name="content"
            value={articleData.content}
            onChange={handleChange}
            rows={6}
            required
            autoSize
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">الحالة</label>
            <select
              name="status"
              value={articleData.status}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="draft">مسودة</option>
              <option value="published">منشور</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">الوسوم (مفصولة بفواصل)</label>
            <Input 
              name="tags"
              value={articleData.tags}
              onChange={handleChange}
              placeholder="مبيعات, تسويق, نصائح"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">رابط الصورة المميزة</label>
          <Input 
            name="featured_image"
            value={articleData.featured_image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      
        <DialogFooter>
          <Button variant="outline" type="button" onClick={onClose}>إلغاء</Button>
          <Button type="submit">حفظ</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

// Main AdminDashboard component
const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  
  // State for dashboard data
  const [analyticsData, setAnalyticsData] = useState({
    courseSales: {
      totalSales: 0,
      growth: 0,
      monthly: [] as number[],
    },
    bookSales: {
      totalSales: 0,
      growth: 0,
      monthly: [] as number[],
    },
    users: {
      total: 0,
      growth: 0,
      monthly: [] as number[],
    },
    pageViews: {
      total: 0,
      growth: 0,
      monthly: [] as number[],
    },
  });
  
  // State for database content
  const [courses, setCourses] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  // State for dialog content
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  
  // State for dialogs
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [articleDialogOpen, setArticleDialogOpen] = useState(false);
  
  // State for loading states
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(false); 
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  
  // State for search queries
  const [courseSearch, setCourseSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [articleSearch, setArticleSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchAnalyticsData();
    fetchCourses();
    fetchBooks();
    fetchArticles();
    fetchUsers();
    
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

  // Fetch analytics data from Supabase
  const fetchAnalyticsData = async () => {
    setLoadingAnalytics(true);
    try {
      // Fetch course sales data
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('price, students_count, created_at');
      
      // Fetch book sales data
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select('price, purchases_count, created_at');
      
      // Fetch users data
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('created_at');
      
      if (coursesError) throw coursesError;
      if (booksError) throw booksError;
      if (usersError) throw usersError;
      
      // Calculate total course sales
      const courseSalesTotal = coursesData?.reduce((total, course) => {
        return total + (course.price * (course.students_count || 0));
      }, 0) || 0;
      
      // Calculate total book sales
      const bookSalesTotal = booksData?.reduce((total, book) => {
        return total + (book.price * (book.purchases_count || 0));
      }, 0) || 0;
      
      // Set analytics data
      setAnalyticsData({
        courseSales: {
          totalSales: courseSalesTotal,
          growth: 15.4, // Mock data for now
          monthly: [12500, 14200, 11800, 13400, 16200, 15700, 14900, 17200, 16800, 17500, 18300, 20100], // Mock data
        },
        bookSales: {
          totalSales: bookSalesTotal,
          growth: 8.7, // Mock data
          monthly: [2100, 2300, 2200, 2400, 2500, 2300, 2600, 2700, 2600, 2900, 3000, 3100], // Mock data
        },
        users: {
          total: usersData?.length || 0,
          growth: 22.1, // Mock data
          monthly: [210, 240, 270, 260, 290, 310, 320, 350, 370, 390, 420, 450], // Mock data
        },
        pageViews: {
          total: 187450, // Mock data
          growth: 32.6, // Mock data
          monthly: [12500, 13200, 14500, 15100, 16200, 15700, 16900, 17200, 18500, 19100, 20100, 21500], // Mock data
        },
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('حدث خطأ أثناء تحميل بيانات الإحصائيات');
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Fetch courses from Supabase
  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('حدث خطأ أثناء تحميل بيانات الدورات');
    } finally {
      setLoadingCourses(false);
    }
  };

  // Fetch books from Supabase
  const fetchBooks = async () => {
    setLoadingBooks(true);
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('حدث خطأ أثناء تحميل بيانات الكتب');
    } finally {
      setLoadingBooks(false);
    }
  };

  // Fetch articles from Supabase
  const fetchArticles = async () => {
    setLoadingArticles(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('حدث خطأ أثناء تحميل بيانات المقالات');
    } finally {
      setLoadingArticles(false);
    }
  };

  // Fetch users from Supabase
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('حدث خطأ أثناء تحميل بيانات المستخدمين');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
    course.instructor.toLowerCase().includes(courseSearch.toLowerCase())
  );

  // Filter books based on search query
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
    book.author.toLowerCase().includes(bookSearch.toLowerCase())
  );

  // Filter articles based on search query
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(articleSearch.toLowerCase())
  );

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    (user.display_name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  // Recent users for the dashboard
  const recentUsers = filteredUsers.slice(0, 4);

  // Handle add new course 
  const handleAddCourse = async (courseData: any) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([courseData])
        .select();
      
      if (error) throw error;
      
      toast.success("تم إنشاء مسودة دورة جديدة", {
        description: "يمكنك الآن إضافة محتوى الدورة"
      });
      
      // Refresh courses data
      fetchCourses();
      
      return data;
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('حدث خطأ أثناء إضافة الدورة');
      throw error;
    }
  };

  // Handle edit course
  const handleEditCourse = async (courseData: any) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', selectedCourse.id);
      
      if (error) throw error;
      
      toast.success("تم تحديث الدورة بنجاح");
      
      // Refresh courses data
      fetchCourses();
      
      // Close the dialog
      setCourseDialogOpen(false);
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('حدث خطأ أثناء تحديث الدورة');
      throw error;
    }
  };

  // Handle delete course
  const handleDeleteCourse = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
      
      if (error) throw error;
      
      toast.success("تم حذف الدورة بنجاح");
      
      // Refresh courses data
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('حدث خطأ أثناء حذف الدورة');
    }
  };

  // Handle add new book
  const handleAddBook = async (bookData: any) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert([bookData])
        .select();
      
      if (error) throw error;
      
      toast.success("تم إنشاء مسودة كتاب جديد", {
        description: "يمكنك الآن إضافة محتوى الكتاب"
      });
      
      // Refresh books data
      fetchBooks();
      
      return data;
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('حدث خطأ أثناء إضافة الكتاب');
      throw error;
    }
  };

  // Handle edit book
  const handleEditBook = async (bookData: any) => {
    try {
      const { error } = await supabase
        .from('books')
        .update(bookData)
        .eq('id', selectedBook.id);
      
      if (error) throw error;
      
      toast.success("تم تحديث الكتاب بنجاح");
      
      // Refresh books data
      fetchBooks();
      
      // Close the dialog
      setBookDialogOpen(false);
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('حدث خطأ أثناء تحديث الكتاب');
      throw error;
    }
  };

  // Handle delete book
  const handleDeleteBook = async (bookId: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);
      
      if (error) throw error;
      
      toast.success("تم حذف الكتاب بنجاح");
      
      // Refresh books data
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('حدث خطأ أثناء حذف الكتاب');
    }
  };

  // Handle add new article
  const handleAddArticle = async (articleData: any) => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .insert([articleData])
        .select();
      
      if (error) throw error;
      
      toast.success("تم إنشاء مسودة مقال جديد", {
        description: "يمكنك الآن كتابة المقال"
      });
      
      // Refresh articles data
      fetchArticles();
      
      return data;
    } catch (error) {
      console.error('Error adding article:', error);
      toast.error('حدث خطأ أثناء إضافة المقال');
      throw error;
    }
  };

  // Handle edit article
  const handleEditArticle = async (articleData: any) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update(articleData)
        .eq('id', selectedArticle.id);
      
      if (error) throw error;
      
      toast.success("تم تحديث المقال بنجاح");
      
      // Refresh articles data
      fetchArticles();
      
      // Close the dialog
      setArticleDialogOpen(false);
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error('حدث خطأ أثناء تحديث المقال');
      throw error;
    }
  };

  // Handle delete article
  const handleDeleteArticle = async (articleId: string) => {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId);
      
      if (error) throw error;
      
      toast.success("تم حذف المقال بنجاح");
      
      // Refresh articles data
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('حدث خطأ أثناء حذف المقال');
    }
  };

  // Handle edit user
  const handleEditUser = async (userData: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', selectedUser.id);
      
      if (error) throw error;
      
      // Refresh users data
      fetchUsers();
      
      return userData;
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('حدث خطأ أثناء تحديث بيانات المستخدم');
      throw error;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
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
                icon={PenTool} 
                label="إدارة المحتوى" 
                active={false} 
                onClick={() => {
                  navigate('/content-management');
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
                <TabsTrigger value="users" className="py-3 px-4 rounded-lg">
                  <Users size={18} className="ml-2" />
                  المستخدمين
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
                        {analyticsData.courseSales.totalSales + analyticsData.bookSales.totalSales} ج.م
                      </div>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                        {analyticsData.courseSales.growth}% منذ الشهر الماضي
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
                        {analyticsData.courseSales.totalSales} ج.م
                      </div>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                        {analyticsData.courseSales.growth}% منذ الشهر الماضي
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
                        {analyticsData.bookSales.totalSales} ج.م
                      </div>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                        {analyticsData.bookSales.growth}% منذ الشهر الماضي
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
                        {analyticsData.users.total}
                      </div>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                        {analyticsData.users.growth}% منذ الشهر الماضي
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
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right">المستخدم</TableHead>
                            <TableHead className="text-right">البريد الإلكتروني</TableHead>
                            <TableHead className="text-right">تاريخ التسجيل</TableHead>
                            <TableHead className="text-right">المشتريات</TableHead>
                            <TableHead className="text-right">الإجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loadingUsers ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-10">جاري التحميل...</TableCell>
                            </TableRow>
                          ) : recentUsers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-10">لا يوجد مستخدمين حالياً</TableCell>
                            </TableRow>
                          ) : (
                            recentUsers.map((user) => (
                              <TableRow key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <TableCell>
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8 ml-2">
                                      <AvatarImage src={user.avatar_url} alt={user.display_name || 'مستخدم'} />
                                      <AvatarFallback>{(user.display_name || 'م').charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{user.display_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'مستخدم'}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-gray-600">{user.email || 'غير متوفر'}</TableCell>
                                <TableCell className="text-gray-600">{formatDate(user.created_at)}</TableCell>
                                <TableCell>
                                  <Badge variant={user.purchases > 0 ? "secondary" : "outline"}>
                                    {user.purchases || 0}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2 rtl:space-x-reverse">
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => {
                                        setSelectedUser(user);
                                        setUserDialogOpen(true);
                                      }}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => {
                                        setSelectedUser(user);
                                        setUserDialogOpen(true);
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center py-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('users')}
                    >
                      عرض جميع المستخدمين
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Courses Tab */}
              <TabsContent value="courses" className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-primary">إدارة الدورات</h2>
                  <AddContentDialog 
                    contentType="course" 
                    onAdd={handleAddCourse}
                    trigger={
                      <Button className="flex items-center">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>إضافة دورة جديدة</span>
                      </Button>
                    }
                  />
                </div>
                
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="ابحث عن دورة..."
                      className="pl-3 pr-10"
                      value={courseSearch}
                      onChange={(e) => setCourseSearch(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="overflow-x-auto bg-white rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الدورة</TableHead>
                        <TableHead className="text-right">المدرب</TableHead>
                        <TableHead className="text-right">السعر</TableHead>
                        <TableHead className="text-right">الطلاب</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">آخر تحديث</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingCourses ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10">جاري التحميل...</TableCell>
                        </TableRow>
                      ) : filteredCourses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10">لا توجد دورات متطابقة مع البحث</TableCell>
                        </TableRow>
                      ) : (
                        filteredCourses.map((course) => (
                          <TableRow key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <TableCell>
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded overflow-hidden ml-2">
                                  <img 
                                    src={course.image_url || 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop'} 
                                    alt={course.title} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <span className="font-medium">{course.title}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-600">{course.instructor}</TableCell>
                            <TableCell className="text-gray-600">{course.price} {course.currency}</TableCell>
                            <TableCell className="text-gray-600">{course.students_count || 0}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={course.status === 'published' ? 'secondary' : 'outline'}
                                className={course.status === 'published' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                              >
                                {course.status === 'published' ? 'منشور' : 'مسودة'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-600">{formatDate(course.updated_at)}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => navigate(`/course/${course.id}`)}
                                  >
                                    <Eye className="ml-2 h-4 w-4" />
                                    <span>عرض</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedCourse(course);
                                      setCourseDialogOpen(true);
                                    }}
                                  >
                                    <Edit className="ml-2 h-4 w-4" />
                                    <span>تعديل</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                        className="text-red-600"
                                      >
                                        <Trash2 className="ml-2 h-4 w-4" />
                                        <span>حذف</span>
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>هل أنت متأكد من حذف هذه الدورة؟</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          سيتم حذف هذه الدورة نهائيًا وكل محتوياتها. هذا الإجراء لا يمكن التراجع عنه.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteCourse(course.id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          حذف
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
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
                  <AddContentDialog 
                    contentType="book" 
                    onAdd={handleAddBook}
                    trigger={
                      <Button className="flex items-center">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>إضافة كتاب جديد</span>
                      </Button>
                    }
                  />
                </div>
                
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="ابحث عن كتاب..."
                      className="pl-3 pr-10"
                      value={bookSearch}
                      onChange={(e) => setBookSearch(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="overflow-x-auto bg-white rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الكتاب</TableHead>
                        <TableHead className="text-right">المؤلف</TableHead>
                        <TableHead className="text-right">السعر</TableHead>
                        <TableHead className="text-right">المشتريات</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">آخر تحديث</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingBooks ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10">جاري التحميل...</TableCell>
                        </TableRow>
                      ) : filteredBooks.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10">لا توجد كتب متطابقة مع البحث</TableCell>
                        </TableRow>
                      ) : (
                        filteredBooks.map((book) => (
                          <TableRow key={book.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <TableCell>
                              <div className="flex items-center">
                                <div className="h-14 w-10 rounded overflow-hidden ml-2">
                                  <img 
                                    src={book.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop'} 
                                    alt={book.title} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <span className="font-medium">{book.title}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-600">{book.author}</TableCell>
                            <TableCell className="text-gray-600">{book.price} {book.currency}</TableCell>
                            <TableCell className="text-gray-600">{book.purchases_count || 0}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={book.status === 'published' ? 'secondary' : 'outline'}
                                className={book.status === 'published' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                              >
                                {book.status === 'published' ? 'منشور' : 'مسودة'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-600">{formatDate(book.updated_at)}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => navigate(`/book/${book.id}`)}
                                  >
                                    <Eye className="ml-2 h-4 w-4" />
                                    <span>عرض</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedBook(book);
                                      setBookDialogOpen(true);
                                    }}
                                  >
                                    <Edit className="ml-2 h-4 w-4" />
                                    <span>تعديل</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                        className="text-red-600"
                                      >
                                        <Trash2 className="ml-2 h-4 w-4" />
                                        <span>حذف</span>
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>هل أنت متأكد من حذف هذا الكتاب؟</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          سيتم حذف هذا الكتاب نهائيًا. هذا الإجراء لا يمكن التراجع عنه.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteBook(book.id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          حذف
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
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
                      <PaginationEllipsis />
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
                  <AddContentDialog 
                    contentType="article" 
                    onAdd={handleAddArticle}
                    trigger={
                      <Button className="flex items-center">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>إضافة مقال جديد</span>
                      </Button>
                    }
                  />
                </div>
                
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="ابحث عن مقال..."
                      className="pl-3 pr-10"
                      value={articleSearch}
                      onChange={(e) => setArticleSearch(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="overflow-x-auto bg-white rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">المقال</TableHead>
                        <TableHead className="text-right">الكاتب</TableHead>
                        <TableHead className="text-right">المشاهدات</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">تاريخ النشر</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingArticles ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">جاري التحميل...</TableCell>
                        </TableRow>
                      ) : filteredArticles.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">لا توجد مقالات متطابقة مع البحث</TableCell>
                        </TableRow>
                      ) : (
                        filteredArticles.map((article) => (
                          <TableRow key={article.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <TableCell>
                              <div className="flex items-center">
                                <div className="h-10 w-16 rounded overflow-hidden ml-2">
                                  <img 
                                    src={article.featured_image || 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2070&auto=format&fit=crop'} 
                                    alt={article.title} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <span className="font-medium">{article.title}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-600">{article.author_id || 'غير معروف'}</TableCell>
                            <TableCell className="text-gray-600">{article.views_count || 0}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={article.status === 'published' ? 'secondary' : 'outline'}
                                className={article.status === 'published' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                              >
                                {article.status === 'published' ? 'منشور' : 'مسودة'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-600">{formatDate(article.created_at)}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => navigate(`/article/${article.slug}`)}
                                  >
                                    <Eye className="ml-2 h-4 w-4" />
                                    <span>عرض</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedArticle(article);
                                      setArticleDialogOpen(true);
                                    }}
                                  >
                                    <Edit className="ml-2 h-4 w-4" />
                                    <span>تعديل</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                        className="text-red-600"
                                      >
                                        <Trash2 className="ml-2 h-4 w-4" />
                                        <span>حذف</span>
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>هل أنت متأكد من حذف هذا المقال؟</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          سيتم حذف هذا المقال نهائيًا. هذا الإجراء لا يمكن التراجع عنه.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteArticle(article.id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          حذف
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
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
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </TabsContent>
              
              {/* Funnels Tab */}
              <TabsContent value="funnels" className="animate-fade-in">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <h3 className="text-xl font-medium text-gray-500 mb-2">قريبًا</h3>
                    <p className="text-gray-400">
                      ميزة قمع المبيعات قيد التطوير وستكون متاحة قريبًا
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              {/* Users Tab */}
              <TabsContent value="users" className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-primary">إدارة المستخدمين</h2>
                </div>
                
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="ابحث عن مستخدم..."
                      className="pl-3 pr-10"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="overflow-x-auto bg-white rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">المستخدم</TableHead>
                        <TableHead className="text-right">البريد الإلكتروني</TableHead>
                        <TableHead className="text-right">رقم الهاتف</TableHead>
                        <TableHead className="text-right">تاريخ التسجيل</TableHead>
                        <TableHead className="text-right">المشتريات</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingUsers ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">جاري التحميل...</TableCell>
                        </TableRow>
                      ) : filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">لا يوجد مستخدمين متطابقين مع البحث</TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <TableCell>
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 ml-2">
                                  <AvatarImage src={user.avatar_url} alt={user.display_name || 'مستخدم'} />
                                  <AvatarFallback>{(user.display_name || 'م').charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{user.display_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'مستخدم'}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-600">{user.email || 'غير متوفر'}</TableCell>
                            <TableCell className="text-gray-600">{user.phone || 'غير متوفر'}</TableCell>
                            <TableCell className="text-gray-600">{formatDate(user.created_at)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {user.purchases || 0}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2 rtl:space-x-reverse">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setUserDialogOpen(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setUserDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
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
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings" className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-primary">إعدادات المنصة</h2>
                </div>
                
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <h3 className="text-xl font-medium text-gray-500 mb-2">قريبًا</h3>
                    <p className="text-gray-400">
                      صفحة الإعدادات قيد التطوير وستكون متاحة قريبًا
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      {/* User View/Edit Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        {selectedUser && (
          <UserDetailsDialog 
            user={selectedUser} 
            onClose={() => setUserDialogOpen(false)}
            onEdit={handleEditUser}
          />
        )}
      </Dialog>
      
      {/* Course Edit Dialog */}
      <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
        {selectedCourse && (
          <CourseEditDialog 
            course={selectedCourse} 
            onSave={handleEditCourse}
            onClose={() => setCourseDialogOpen(false)}
          />
        )}
      </Dialog>
      
      {/* Book Edit Dialog */}
      <Dialog open={bookDialogOpen} onOpenChange={setBookDialogOpen}>
        {selectedBook && (
          <BookEditDialog 
            book={selectedBook} 
            onSave={handleEditBook}
            onClose={() => setBookDialogOpen(false)}
          />
        )}
      </Dialog>
      
      {/* Article Edit Dialog */}
      <Dialog open={articleDialogOpen} onOpenChange={setArticleDialogOpen}>
        {selectedArticle && (
          <ArticleEditDialog 
            article={selectedArticle} 
            onSave={handleEditArticle}
            onClose={() => setArticleDialogOpen(false)}
          />
        )}
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
