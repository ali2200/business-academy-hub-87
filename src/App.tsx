
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner";
import Index from "@/pages/Index";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import CoursePlayer from "@/pages/CoursePlayer";
import Books from "@/pages/Books";
import BookDetail from "@/pages/BookDetail";
import BookReader from "@/pages/BookReader";
import Articles from "@/pages/Articles";
import Contact from "@/pages/Contact";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import WhatsAppButton from "@/components/WhatsAppButton";
import AdminDashboard from "@/pages/AdminDashboard";
import ContentManagement from "@/pages/ContentManagement";
import AdminCoursePlayer from "@/pages/AdminCoursePlayer";
import CourseEdit from "@/pages/CourseEdit";

// These pages are now integrated into ContentManagement
// import PagesManagement from "@/pages/PagesManagement";
// import MediaManagement from "@/pages/MediaManagement";
// import BooksManagement from "@/pages/BooksManagement";
// import CoursesManagement from "@/pages/CoursesManagement";
// import ArticlesManagement from "@/pages/ArticlesManagement";

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <main dir="rtl">
      <Toaster richColors position="top-center" />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/course-player/:id" element={<CoursePlayer />} />
          <Route path="/books" element={<Books />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/book-reader/:id" element={<BookReader />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          
          {/* Consolidated Content Management with Nested Routes */}
          <Route path="/content-management" element={<ContentManagement />} />
          <Route path="/content-management/:tab" element={<ContentManagement />} />
          
          {/* Old management pages kept for backward compatibility */}
          <Route path="/pages-management" element={<ContentManagement />} />
          <Route path="/media-management" element={<ContentManagement />} />
          <Route path="/books-management/*" element={<ContentManagement />} />
          <Route path="/articles-management/*" element={<ContentManagement />} />
          
          {/* Courses management routes */}
          <Route path="/courses-management" element={<ContentManagement />} />
          <Route path="/courses-management/create" element={<CourseEdit />} />
          <Route path="/courses-management/:id" element={<CourseEdit />} />
          <Route path="/courses-management/:id/lessons" element={<CourseEdit defaultTab="lessons" />} />
          
          <Route path="/admin-course-player/:id" element={<AdminCoursePlayer />} />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WhatsAppButton />
      </BrowserRouter>
    </main>
  );
}

export default App;
