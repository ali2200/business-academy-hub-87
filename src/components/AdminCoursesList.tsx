import React, { useState, useEffect } from 'react';
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
import { supabase } from "@/integrations/supabase/client";

type CourseStatus = "published" | "draft";

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
  level?: "beginner" | "intermediate" | "advanced";
  image: string;
  status: CourseStatus;
  lastUpdated: string;
}

const AdminCoursesList = () => {
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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        
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
            image: '/images/course-thumb-1.jpg',
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
            image: '/images/course-thumb-2.jpg',
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
            image: '/images/course-thumb-3.jpg',
            status: 'draft',
            lastUpdated: '2025-02-25'
          }
        ];
        
        setCourses(mockCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('فشل في تحميل الدورات');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [refreshTrigger]);

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

  const handleAddCourse = () => {
    toast.success('تمت إضافة الدورة بنجاح');
    setIsAddDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleUpdateCourse = () => {
    if (!selectedCourse) return;
    
    toast.success('تم تحديث الدورة بنجاح');
    setIsEditDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeleteCourse = () => {
    if (!selectedCourse) return;
    
    toast.success('تم حذف الدورة بنجاح');
    setIsDeleteDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleBulkDelete = () => {
    if (selectedCourses.length === 0) return;
    
    toast.success(`تم حذف ${selectedCourses.length} دورات بنجاح`);
    setSelectedCourses([]);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleBulkStatusChange = (status: CourseStatus) => {
    if (selectedCourses.length === 0) return;
    
    toast.success(`تم تغيير حالة ${selectedCourses.length} دورات إلى "${status === 'published' ? 'منشور' : 'مسودة'}"`);
    setSelectedCourses([]);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              إضافة دورة جديدة
            </Button>
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
                          src={course.image} 
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
