
import React, { useState } from 'react';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Search, 
  PlusCircle, 
  RefreshCw,
  Filter 
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the course item type
interface CourseItem {
  id: string;
  title: string;
  instructor: string;
  price: number;
  currency: string;
  studentsCount: number;
  status: 'published' | 'draft';
  image: string;
  lastUpdated: string;
  description?: string;
  category?: string;
  duration?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
}

interface AdminCoursesListProps {
  initialCourses?: CourseItem[];
}

const AdminCoursesList = ({ initialCourses }: AdminCoursesListProps) => {
  const defaultCourses: CourseItem[] = [
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
      description: "دورة شاملة في أساسيات البيع الاحترافي تغطي جميع المهارات اللازمة للنجاح في مجال المبيعات.",
      category: "المبيعات",
      duration: "12 ساعة",
      level: "beginner"
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
      description: "دورة متكاملة في التسويق الرقمي للمبتدئين تشمل وسائل التواصل الاجتماعي، تحسين محركات البحث، والإعلانات المدفوعة.",
      category: "التسويق",
      duration: "10 ساعات",
      level: "beginner"
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
      description: "دورة متقدمة في إدارة المشاريع الصغيرة، تغطي جميع جوانب تأسيس وإدارة وتنمية المشاريع الصغيرة.",
      category: "إدارة الأعمال",
      duration: "15 ساعة",
      level: "intermediate"
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
      description: "دورة متخصصة في فنون وأسرار التفاوض الفعال في بيئة الأعمال وإدارة المفاوضات التجارية.",
      category: "تطوير المهارات",
      duration: "8 ساعات",
      level: "advanced"
    }
  ];

  const [courses, setCourses] = useState<CourseItem[]>(initialCourses || defaultCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPublished, setShowPublished] = useState(true);
  const [showDrafts, setShowDrafts] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // New course form state
  const [newCourse, setNewCourse] = useState<Omit<CourseItem, 'id' | 'lastUpdated' | 'studentsCount'>>({
    title: '',
    instructor: '',
    price: 0,
    currency: 'ج.م',
    status: 'draft',
    image: '',
    description: '',
    category: '',
    duration: '',
    level: 'beginner'
  });

  // Filtered courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.category && course.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      (showPublished && course.status === 'published') ||
      (showDrafts && course.status === 'draft');
    
    return matchesSearch && matchesStatus;
  });

  // Handle adding new course
  const handleAddCourse = () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const newCourseWithId: CourseItem = {
      ...newCourse,
      id: `course-${courses.length + 1}`,
      lastUpdated: formattedDate,
      studentsCount: 0
    };
    
    setCourses([...courses, newCourseWithId]);
    setIsAddDialogOpen(false);
    setNewCourse({
      title: '',
      instructor: '',
      price: 0,
      currency: 'ج.م',
      status: 'draft',
      image: '',
      description: '',
      category: '',
      duration: '',
      level: 'beginner'
    });
    
    toast.success('تم إضافة الدورة بنجاح');
  };

  // Handle updating course
  const handleUpdateCourse = () => {
    if (!selectedCourse) return;
    
    const now = new Date();
    const formattedDate = now.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const updatedCourses = courses.map(course => 
      course.id === selectedCourse.id 
        ? { ...selectedCourse, lastUpdated: formattedDate } 
        : course
    );
    
    setCourses(updatedCourses);
    setIsEditDialogOpen(false);
    
    toast.success('تم تحديث الدورة بنجاح');
  };

  // Handle deleting course
  const handleDeleteCourse = () => {
    if (!selectedCourse) return;
    
    const updatedCourses = courses.filter(course => course.id !== selectedCourse.id);
    setCourses(updatedCourses);
    setIsDeleteDialogOpen(false);
    
    toast.success('تم حذف الدورة بنجاح');
  };

  // Handle toggling course status
  const handleToggleStatus = (course: CourseItem) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const updatedCourses = courses.map(item => 
      item.id === course.id
        ? { 
            ...item, 
            status: item.status === 'published' ? 'draft' : 'published',
            lastUpdated: formattedDate
          }
        : item
    );
    
    setCourses(updatedCourses);
    
    toast.success(
      `تم ${course.status === 'published' ? 'إلغاء نشر' : 'نشر'} الدورة بنجاح`
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            إضافة دورة جديدة
          </Button>
          <Button 
            variant="outline" 
            onClick={() => toast.success('تم تحديث البيانات')}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            تحديث
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                تصفية
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>تصفية حسب الحالة</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => {
                  setShowPublished(true);
                  setShowDrafts(true);
                }}
              >
                الكل
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  setShowPublished(true);
                  setShowDrafts(false);
                }}
              >
                المنشورة فقط
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  setShowPublished(false);
                  setShowDrafts(true);
                }}
              >
                المسودات فقط
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="ابحث عن دورة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-3 pr-10"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-gray-500 font-medium">الدورة</th>
              <th className="py-3 px-4 text-gray-500 font-medium">المدرب</th>
              <th className="py-3 px-4 text-gray-500 font-medium">السعر</th>
              <th className="py-3 px-4 text-gray-500 font-medium">الطلاب</th>
              <th className="py-3 px-4 text-gray-500 font-medium">الحالة</th>
              <th className="py-3 px-4 text-gray-500 font-medium">آخر تحديث</th>
              <th className="py-3 px-4 text-gray-500 font-medium">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  لا توجد دورات متطابقة مع البحث
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => (
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
                      onClick={() => handleToggleStatus(course)}
                    >
                      {course.status === 'published' ? 'منشور' : 'مسودة'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{course.lastUpdated}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedCourse(course);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
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
                        onClick={() => {
                          setSelectedCourse(course);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
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

      {/* Add Course Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>إضافة دورة جديدة</DialogTitle>
            <DialogDescription>
              أضف دورة جديدة إلى المنصة
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">عنوان الدورة</Label>
                <Input
                  id="title"
                  placeholder="أدخل عنوان الدورة"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="instructor">المدرب</Label>
                <Input
                  id="instructor"
                  placeholder="اسم المدرب"
                  value={newCourse.instructor}
                  onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">السعر</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  value={newCourse.price.toString()}
                  onChange={(e) => setNewCourse({
                    ...newCourse, 
                    price: parseFloat(e.target.value) || 0
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currency">العملة</Label>
                <Input
                  id="currency"
                  placeholder="ج.م"
                  value={newCourse.currency}
                  onChange={(e) => setNewCourse({...newCourse, currency: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">التصنيف</Label>
                <Input
                  id="category"
                  placeholder="تصنيف الدورة"
                  value={newCourse.category || ''}
                  onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">المدة</Label>
                <Input
                  id="duration"
                  placeholder="مثال: 8 ساعات"
                  value={newCourse.duration || ''}
                  onChange={(e) => setNewCourse({
                    ...newCourse, 
                    duration: e.target.value
                  })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">رابط صورة الدورة</Label>
              <Input
                id="image"
                placeholder="رابط صورة الدورة"
                value={newCourse.image}
                onChange={(e) => setNewCourse({...newCourse, image: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">وصف الدورة</Label>
              <Textarea
                id="description"
                placeholder="وصف تفصيلي للدورة..."
                value={newCourse.description || ''}
                onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="level">المستوى</Label>
              <div className="flex gap-4">
                <Label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={newCourse.level === 'beginner'}
                    onChange={() => setNewCourse({...newCourse, level: 'beginner'})}
                  />
                  مبتدئ
                </Label>
                <Label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={newCourse.level === 'intermediate'}
                    onChange={() => setNewCourse({...newCourse, level: 'intermediate'})}
                  />
                  متوسط
                </Label>
                <Label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={newCourse.level === 'advanced'}
                    onChange={() => setNewCourse({...newCourse, level: 'advanced'})}
                  />
                  متقدم
                </Label>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">الحالة</Label>
              <div className="flex gap-4">
                <Label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={newCourse.status === 'draft'}
                    onChange={() => setNewCourse({...newCourse, status: 'draft'})}
                  />
                  مسودة
                </Label>
                <Label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={newCourse.status === 'published'}
                    onChange={() => setNewCourse({...newCourse, status: 'published'})}
                  />
                  منشور
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={handleAddCourse}>إضافة الدورة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تعديل الدورة</DialogTitle>
            <DialogDescription>
              قم بتعديل معلومات الدورة
            </DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">عنوان الدورة</Label>
                  <Input
                    id="edit-title"
                    value={selectedCourse.title}
                    onChange={(e) => setSelectedCourse({
                      ...selectedCourse, 
                      title: e.target.value
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-instructor">المدرب</Label>
                  <Input
                    id="edit-instructor"
                    value={selectedCourse.instructor}
                    onChange={(e) => setSelectedCourse({
                      ...selectedCourse, 
                      instructor: e.target.value
                    })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">السعر</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={selectedCourse.price}
                    onChange={(e) => setSelectedCourse({
                      ...selectedCourse, 
                      price: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-currency">العملة</Label>
                  <Input
                    id="edit-currency"
                    value={selectedCourse.currency}
                    onChange={(e) => setSelectedCourse({
                      ...selectedCourse, 
                      currency: e.target.value
                    })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">التصنيف</Label>
                  <Input
                    id="edit-category"
                    value={selectedCourse.category || ''}
                    onChange={(e) => setSelectedCourse({
                      ...selectedCourse, 
                      category: e.target.value
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-duration">المدة</Label>
                  <Input
                    id="edit-duration"
                    value={selectedCourse.duration || ''}
                    onChange={(e) => setSelectedCourse({
                      ...selectedCourse, 
                      duration: e.target.value
                    })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">رابط صورة الدورة</Label>
                <Input
                  id="edit-image"
                  value={selectedCourse.image}
                  onChange={(e) => setSelectedCourse({
                    ...selectedCourse, 
                    image: e.target.value
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">وصف الدورة</Label>
                <Textarea
                  id="edit-description"
                  value={selectedCourse.description || ''}
                  onChange={(e) => setSelectedCourse({
                    ...selectedCourse, 
                    description: e.target.value
                  })}
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-level">المستوى</Label>
                <div className="flex gap-4">
                  <Label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={selectedCourse.level === 'beginner'}
                      onChange={() => setSelectedCourse({
                        ...selectedCourse, 
                        level: 'beginner'
                      })}
                    />
                    مبتدئ
                  </Label>
                  <Label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={selectedCourse.level === 'intermediate'}
                      onChange={() => setSelectedCourse({
                        ...selectedCourse, 
                        level: 'intermediate'
                      })}
                    />
                    متوسط
                  </Label>
                  <Label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={selectedCourse.level === 'advanced'}
                      onChange={() => setSelectedCourse({
                        ...selectedCourse, 
                        level: 'advanced'
                      })}
                    />
                    متقدم
                  </Label>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">الحالة</Label>
                <div className="flex gap-4">
                  <Label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={selectedCourse.status === 'draft'}
                      onChange={() => setSelectedCourse({
                        ...selectedCourse, 
                        status: 'draft'
                      })}
                    />
                    مسودة
                  </Label>
                  <Label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={selectedCourse.status === 'published'}
                      onChange={() => setSelectedCourse({
                        ...selectedCourse, 
                        status: 'published'
                      })}
                    />
                    منشور
                  </Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={handleUpdateCourse}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Course Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تفاصيل الدورة</DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <div className="py-4">
              <div className="flex mb-6 gap-6">
                <div className="w-24 h-24 rounded overflow-hidden flex-shrink-0">
                  <img 
                    src={selectedCourse.image} 
                    alt={selectedCourse.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 flex-grow">
                  <h3 className="text-xl font-bold">{selectedCourse.title}</h3>
                  <div className="text-gray-600">المدرب: {selectedCourse.instructor}</div>
                  <div className="text-gray-600">
                    {selectedCourse.category && <span>التصنيف: {selectedCourse.category} • </span>}
                    {selectedCourse.duration && <span>المدة: {selectedCourse.duration} • </span>}
                    <span>{selectedCourse.price} {selectedCourse.currency}</span>
                  </div>
                  <div className="text-gray-600">
                    المستوى: {
                      selectedCourse.level === 'beginner' ? 'مبتدئ' :
                      selectedCourse.level === 'intermediate' ? 'متوسط' : 'متقدم'
                    }
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant={selectedCourse.status === 'published' ? 'secondary' : 'outline'}
                      className={selectedCourse.status === 'published' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {selectedCourse.status === 'published' ? 'منشور' : 'مسودة'}
                    </Badge>
                    <span className="text-sm text-gray-500">آخر تحديث: {selectedCourse.lastUpdated}</span>
                  </div>
                </div>
              </div>

              {selectedCourse.description && (
                <div className="mb-6">
                  <h4 className="font-bold mb-2">الوصف:</h4>
                  <p className="text-gray-700">{selectedCourse.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-bold mb-2">إحصائيات:</h4>
                  <div className="text-gray-700">عدد الطلاب: {selectedCourse.studentsCount}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button>إغلاق</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Course Dialog */}
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
    </div>
  );
};

export default AdminCoursesList;
