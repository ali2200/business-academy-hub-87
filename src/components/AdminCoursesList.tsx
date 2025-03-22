
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Eye, MoreHorizontal, VideoIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

const AdminCoursesList = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const { data: courses, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500">منشور</Badge>;
      case 'draft':
        return <Badge variant="outline">مسودة</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleEditCourse = (courseId: string) => {
    navigate(`/courses-management/${courseId}`);
  };

  const handleEditLessons = (courseId: string) => {
    navigate(`/courses-management/${courseId}/lessons`);
  };

  const handleViewCourse = (courseId: string) => {
    window.open(`/courses/${courseId}`, '_blank');
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">قائمة الدورات</h2>
          <Button onClick={() => navigate('/courses-management/create')} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            دورة جديدة
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان الدورة</TableHead>
                <TableHead>المحاضر</TableHead>
                <TableHead>السعر</TableHead>
                <TableHead>التصنيف</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>آخر تحديث</TableHead>
                <TableHead className="text-left">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses && courses.length > 0 ? (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <button 
                        onClick={() => handleEditCourse(course.id)}
                        className="font-medium text-blue-600 hover:underline text-right w-full"
                      >
                        {course.title}
                      </button>
                    </TableCell>
                    <TableCell>{course.instructor}</TableCell>
                    <TableCell>{course.price} {course.currency}</TableCell>
                    <TableCell>{course.category || '-'}</TableCell>
                    <TableCell>{getStatusBadge(course.status)}</TableCell>
                    <TableCell>
                      {course.updated_at
                        ? format(new Date(course.updated_at), 'dd MMMM yyyy', { locale: ar })
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewCourse(course.id)}
                          title="عرض"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditCourse(course.id)}
                          title="تعديل"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <div className="relative">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>خيارات</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleEditLessons(course.id)}
                                className="cursor-pointer"
                              >
                                <VideoIcon className="h-4 w-4 mr-2" />
                                تعديل الدروس
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    لا توجد دورات متاحة
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCoursesList;
