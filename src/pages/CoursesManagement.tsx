
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import AdminCoursesList from '@/components/AdminCoursesList';
import CourseEdit from '@/pages/CourseEdit';

const CoursesManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={
            <>
              <header className="mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold text-primary">إدارة الدورات</h1>
                    <p className="text-gray-600 mt-1">إدارة وتنظيم الدورات التدريبية المتاحة على المنصة</p>
                  </div>
                  <Button
                    onClick={() => navigate('/admin-dashboard')}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    العودة للوحة التحكم
                  </Button>
                </div>
              </header>

              <AdminCoursesList />
            </>
          } />
          <Route path="/:id" element={<CourseEdit />} />
        </Routes>
      </div>
    </div>
  );
};

export default CoursesManagement;
