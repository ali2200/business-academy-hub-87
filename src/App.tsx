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
import PagesManagement from "@/pages/PagesManagement";
import MediaManagement from "@/pages/MediaManagement";
import BooksManagement from "@/pages/BooksManagement";
import CoursesManagement from "@/pages/CoursesManagement";
import ArticlesManagement from "@/pages/ArticlesManagement";
import AdminCoursePlayer from "@/pages/AdminCoursePlayer";

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
          <Route path="/" element={<Index />} />
          <Route path="/courses" element={<Courses />} />
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
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/content-management" element={<ContentManagement />} />
          <Route path="/pages-management" element={<PagesManagement />} />
          <Route path="/media-management" element={<MediaManagement />} />
          <Route path="/books-management/*" element={<BooksManagement />} />
          <Route path="/courses-management/*" element={<CoursesManagement />} />
          <Route path="/articles-management/*" element={<ArticlesManagement />} />
          <Route path="/admin-course-player/:id" element={<AdminCoursePlayer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WhatsAppButton />
      </BrowserRouter>
    </main>
  );
}

export default App;
