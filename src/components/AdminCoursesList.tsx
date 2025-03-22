
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  RefreshCw,
  Filter,
  MoreHorizontal,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import AddContentDialog from "@/components/AddContentDialog";

type CourseStatus = "published" | "draft";
type CourseLevel = "beginner" | "intermediate" | "advanced";

interface CourseItem {
  id: string;
  title: string;
  instructor: string;
  price: number;
  currency: string;
  description?: string;
  category?: string;
  studentsCount: number;
  duration?: string;
  level?: CourseLevel;
  image_url?: string;
  status: CourseStatus;
  lastUpdated?: string;
  updated_at?: string;
}

interface NewCourseForm {
  title: string;
  instructor: string;
  price: number;
  currency: string;
  description?: string;
  category?: string;
  duration?: string;
  level?: CourseLevel;
  image_url?: string;
  status: CourseStatus;
}

const defaultNewCourse: NewCourseForm = {
  title: '',
  instructor: '',
  price: 0,
  currency: 'EGP',
  description: '',
  category: '',
  duration: '',
  level: 'beginner',
  image_url: '',
  status: 'draft'
};

const AdminCoursesList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [newCourse, setNewCourse] = useState<NewCourseForm>(defaultNewCourse);

  useEffect(() => {
    fetchCourses();
  }, [refreshTrigger]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // Fetch real data from Supabase
      const { data, error } = await supabase
        .from('courses')
        .select('*');
      
      if (error) throw error;
      
      // Transform the data to match our component's format
      const formattedCourses = data.map(course => ({
        id: course.id,
        title: course.title,
        instructor: course.instructor,
        price: course.price,
        currency: course.currency,
        description: course.description,
        category: course.category,
        studentsCount: course.students_count || 0,
        duration: course.duration,
        level: course.level as CourseLevel,
        image_url: course.image_url,
        status: course.status as CourseStatus,
        lastUpdated: new Date(course.updated_at).toLocaleDateString('ar-EG'),
        updated_at: course.updated_at
      }));
      
      setCourses(formattedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('فشل في تحميل الدورات');
      
      // Fallback to mock data if API fails
      const mockCourses: CourseItem[] = [
        {
          id: '1',
          title: 'أساسيات إدارة الأعمال',
          instructor: 'د. أحمد محمد',
          price: 599.99,
          currency: 'EGP',
          description: 'دورة شاملة في أساسيات إدارة الأعمال والمشاريع',
          category: 'إدارة أعمال',
          studentsCount: 155,
          duration: '16 أسبوع',
          level: 'beginner',
          image_url: '/images/course-thumb-1.jpg',
          status: 'published',
          lastUpdated: '2025-02-15'
        },
        {
          id: '2',
          title: 'التسويق الرقمي المتقدم',
          instructor: 'أ. سارة أحمد',
          price: 799.99,
          currency: 'EGP',
          description: 'استراتيجيات وتقنيات متقدمة في التسويق الرقمي',
          category: 'تسويق',
          studentsCount: 123,
          duration: '12 أسبوع',
          level: 'advanced',
          image_url: '/images/course-thumb-2.jpg',
          status: 'published',
          lastUpdated: '2025-02-20'
        },
        {
          id: '3',
          title: 'إدارة المشاريع الصغيرة',
          instructor: 'م. محمد عبد الرحمن',
          price: 499.99,
          currency: 'EGP',
          description: 'كل ما تحتاج معرفته لإدارة مشروع صغير بنجاح',
          category: 'ريادة أعمال',
          studentsCount: 78,
          duration: '8 أسبوع',
          level: 'intermediate',
          image_url: '/images/course-thumb-3.jpg',
          status: 'draft',
          lastUpdated: '2025-02-25'
        }
      ];
      
      setCourses(mockCourses);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.category && course.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (statusFilter) {
      return matchesSearch && course.status === statusFilter;
    }
    
    return matchesSearch;
  });

  const toggleCourseSelection = (courseId: string) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const toggleAllCourses = () => {
    if (selectedCourses.length === filteredCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredCourses.map(course => course.id));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (selectedCourse) {
      // Edit mode - update selected course
      setSelectedCourse({
        ...selectedCourse,
        [name]: value
      });
    } else {
      // Add mode - update new course
      setNewCourse({
        ...newCourse,
        [name]: value
      });
    }
  };

  const handleSelectChange = (value: string, fieldName: string) => {
    if (selectedCourse) {
      // Edit mode
      setSelectedCourse({
        ...selectedCourse,
        [fieldName]: value
      });
    } else {
      // Add mode
      setNewCourse({
        ...newCourse,
        [fieldName]: value
      });
    }
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    if (selectedCourse) {
      // Edit mode
      setSelectedCourse({
        ...selectedCourse,
        [name]: numValue
      });
    } else {
      // Add mode
      setNewCourse({
        ...newCourse,
        [name]: numValue
      });
    }
  };

  const handleAddCourse = async () => {
    try {
      // Insert new course into database
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: newCourse.title,
          instructor: newCourse.instructor,
          price: newCourse.price,
          currency: newCourse.currency,
          description: newCourse.description,
          category: newCourse.category,
          duration: newCourse.duration,
          level: newCourse.level,
          image_url: newCourse.image_url,
          status: newCourse.status,
          students_count: 0
        })
        .select();
      
      if (error) throw error;
      
      toast.success('تمت إضافة الدورة بنجاح');
      setIsAddDialogOpen(false);
      setNewCourse(defaultNewCourse);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('حدث خطأ أثناء إضافة الدورة');
    }
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourse) return;
    
    try {
      // Update course in database
      const { error } = await supabase
        .from('courses')
        .update({
          title: selectedCourse.title,
          instructor: selectedCourse.instructor,
          price: selectedCourse.price,
          currency: selectedCourse.currency,
          description: selectedCourse.description,
          category: selectedCourse.category,
          duration: selectedCourse.duration,
          level: selectedCourse.level,
          image_url: selectedCourse.image_url,
          status: selectedCourse.status
        })
        .eq('id', selectedCourse.id);
      
      if (error) throw error;
      
      toast.success('تم تحديث الدورة بنجاح');
      setIsEditDialogOpen(false);
      setSelectedCourse(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('حدث خطأ أثناء تحديث الدورة');
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;
    
    try {
      // Delete course from database
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', selectedCourse.id);
      
      if (error) throw error;
      
      toast.success('تم حذف الدورة بنجاح');
      setIsDeleteDialogOpen(false);
      setSelectedCourse(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('حدث خطأ أثناء حذف الدورة');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCourses.length === 0) return;
    
    try {
      // Delete multiple courses
      const { error } = await supabase
        .from('courses')
        .delete()
        .in('id', selectedCourses);
      
      if (error) throw error;
      
      toast.success(`تم حذف ${selectedCourses.length} دورات بنجاح`);
      setSelectedCourses([]);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error bulk deleting courses:', error);
      toast.error('حدث خطأ أثناء حذف الدورات');
    }
  };

  const handleBulkStatusChange = async (status: CourseStatus) => {
    if (selectedCourses.length === 0) return;
    
    try {
      // Update status for multiple courses
      const { error } = await supabase
        .from('courses')
        .update({ status })
        .in('id', selectedCourses);
      
      if (error) throw error;
      
      toast.success(`تم تغيير حالة ${selectedCourses.length} دورات إلى "${status === 'published' ? 'منشور' : 'مسودة'}"`);
      setSelectedCourses([]);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error changing status:', error);
      toast.error('حدث خطأ أثناء تغيير حالة الدورات');
    }
  };

  const viewCourseDetails = (courseId: string) => {
    navigate(`/admin-dashboard/courses/${courseId}`);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex gap-2">
            <AddContentDialog 
              contentType="course" 
              onAdd={(courseData) => {
                handleAddCourse();
                setRefreshTrigger(prev => prev + 1);
              }}
            />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={selectedCourses.length === 0}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span>إجراءات جماعية</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>الإجراءات الجماعية</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkStatusChange('published')}>
                  <Check className="h-4 w-4 mr-2" />
                  نشر المحدد
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkStatusChange('draft')}>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  تحويل إلى مسودة
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleBulkDelete}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  حذف المحدد
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="outline"
              onClick={() => setRefreshTrigger(prev => prev + 1)}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              تحديث
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="بحث في الدورات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  <span>تصفية</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>تصفية حسب الحالة</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                  الكل
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('published')}>
                  منشور
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('draft')}>
                  مسودة
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedCourses.length === filteredCourses.length && filteredCourses.length > 0}
                    onChange={toggleAllCourses}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>الدورة</TableHead>
                <TableHead>السعر</TableHead>
                <TableHead>المسجلين</TableHead>
                <TableHead>المستوى</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>آخر تحديث</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    لا توجد دورات متاحة
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map(course => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course.id)}
                        onChange={() => toggleCourseSelection(course.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img 
                          src={course.image_url} 
                          alt={course.title} 
                          className="h-12 w-16 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-gray-500 text-sm">{course.instructor}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{course.price} {course.currency}</TableCell>
                    <TableCell>{course.studentsCount}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {course.level === 'beginner' ? 'مبتدئ' : 
                         course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={course.status === 'published' ? 'default' : 'secondary'}
                        className={course.status === 'published' ? 'bg-green-500 hover:bg-green-600' : ''}>
                        {course.status === 'published' ? 'منشور' : 'مسودة'}
                      </Badge>
                    </TableCell>
                    <TableCell>{course.lastUpdated}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="عرض"
                          onClick={() => viewCourseDetails(course.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="تعديل"
                          onClick={() => {
                            setSelectedCourse(course);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="حذف"
                          onClick={() => {
                            setSelectedCourse(course);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>

      {/* Dialog for editing a course */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تعديل الدورة</DialogTitle>
            <DialogDescription>
              تعديل معلومات الدورة. اضغط "حفظ" عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCourse && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">عنوان الدورة</Label>
                  <Input 
                    id="edit-title" 
                    name="title" 
                    value={selectedCourse.title} 
                    onChange={handleInputChange} 
                    placeholder="أدخل عنوان الدورة"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-instructor">المدرب</Label>
                  <Input 
                    id="edit-instructor" 
                    name="instructor" 
                    value={selectedCourse.instructor} 
                    onChange={handleInputChange} 
                    placeholder="اسم المدرب"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">السعر</Label>
                  <Input 
                    id="edit-price" 
                    name="price" 
                    type="number" 
                    value={selectedCourse.price} 
                    onChange={handleNumberInputChange} 
                    placeholder="أدخل السعر"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-currency">العملة</Label>
                  <Select 
                    value={selectedCourse.currency} 
                    onValueChange={(value) => handleSelectChange(value, 'currency')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العملة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EGP">جنيه مصري</SelectItem>
                      <SelectItem value="USD">دولار أمريكي</SelectItem>
                      <SelectItem value="SAR">ريال سعودي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-level">المستوى</Label>
                  <Select 
                    value={selectedCourse.level} 
                    onValueChange={(value) => handleSelectChange(value as CourseLevel, 'level')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستوى" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">مبتدئ</SelectItem>
                      <SelectItem value="intermediate">متوسط</SelectItem>
                      <SelectItem value="advanced">متقدم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">الحالة</Label>
                  <Select 
                    value={selectedCourse.status} 
                    onValueChange={(value) => handleSelectChange(value as CourseStatus, 'status')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">منشور</SelectItem>
                      <SelectItem value="draft">مسودة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">التصنيف</Label>
                  <Input 
                    id="edit-category" 
                    name="category" 
                    value={selectedCourse.category || ''} 
                    onChange={handleInputChange} 
                    placeholder="أدخل التصنيف"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">المدة</Label>
                  <Input 
                    id="edit-duration" 
                    name="duration" 
                    value={selectedCourse.duration || ''} 
                    onChange={handleInputChange} 
                    placeholder="مثال: 8 أسابيع"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-image_url">رابط صورة الدورة</Label>
                <Input 
                  id="edit-image_url" 
                  name="image_url" 
                  value={selectedCourse.image_url || ''} 
                  onChange={handleInputChange} 
                  placeholder="أدخل رابط الصورة"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">وصف الدورة</Label>
                <Textarea 
                  id="edit-description" 
                  name="description" 
                  value={selectedCourse.description || ''} 
                  onChange={handleInputChange} 
                  placeholder="أدخل وصفاً تفصيلياً للدورة"
                  rows={5}
                  autoSize
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={handleUpdateCourse}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for deleting a course */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>حذف الدورة</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذه الدورة؟ هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteCourse}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminCoursesList;
