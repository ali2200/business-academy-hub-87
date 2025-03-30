
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import UserProfile from "@/pages/UserProfile";
import NotFound from "@/pages/NotFound";
import WhatsAppButton from "@/components/WhatsAppButton";
import AdminDashboard from "@/pages/AdminDashboard";
import ContentManagement from "@/pages/ContentManagement";
import AdminCoursePlayer from "@/pages/AdminCoursePlayer";
import CourseEdit from "@/pages/CourseEdit";
import CoursesManagement from "@/pages/CoursesManagement";
import BooksManagement from "@/pages/BooksManagement";
import AdminRoute from "@/components/AdminRoute";
import AdminSignIn from "@/pages/AdminSignIn";
import UsersManagement from "@/pages/UsersManagement";
import MediaManagement from "@/pages/MediaManagement";
import PagesManagement from "@/pages/PagesManagement";
import ArticlesManagement from "@/pages/ArticlesManagement";
import Settings from "@/pages/Settings";
import { supabase } from "@/integrations/supabase/client";

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check authentication status on load and session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Clean up subscription
    return () => subscription.unsubscribe();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Route that requires authentication
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isAuthenticated === null) {
      // Still checking auth status
      return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/signin" />;
    }
    
    return <>{children}</>;
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
          <Route path="/admin-signin" element={<AdminSignIn />} />
          
          {/* Protected User Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          
          {/* Content Management Routes - now only for website content */}
          <Route path="/content-management" element={
            <AdminRoute>
              <ContentManagement />
            </AdminRoute>
          } />
          <Route path="/content-management/:tab" element={
            <AdminRoute>
              <ContentManagement />
            </AdminRoute>
          } />
          
          {/* Courses management routes */}
          <Route path="/courses-management" element={
            <AdminRoute>
              <CoursesManagement />
            </AdminRoute>
          } />
          <Route path="/courses-management/create" element={
            <AdminRoute>
              <CourseEdit />
            </AdminRoute>
          } />
          <Route path="/courses-management/:id" element={
            <AdminRoute>
              <CourseEdit />
            </AdminRoute>
          } />
          <Route path="/courses-management/:id/lessons" element={
            <AdminRoute>
              <CourseEdit defaultTab="lessons" />
            </AdminRoute>
          } />
          <Route path="/admin-course-player/:id" element={
            <AdminRoute>
              <AdminCoursePlayer />
            </AdminRoute>
          } />
          
          {/* Books management routes */}
          <Route path="/books-management" element={
            <AdminRoute>
              <BooksManagement />
            </AdminRoute>
          } />
          
          {/* Media management routes */}
          <Route path="/media-management" element={
            <AdminRoute>
              <MediaManagement />
            </AdminRoute>
          } />
          
          {/* Pages management routes */}
          <Route path="/pages-management" element={
            <AdminRoute>
              <PagesManagement />
            </AdminRoute>
          } />
          
          {/* Articles management routes */}
          <Route path="/articles-management" element={
            <AdminRoute>
              <ArticlesManagement />
            </AdminRoute>
          } />
          
          {/* Users management routes */}
          <Route path="/users-management" element={
            <AdminRoute>
              <UsersManagement />
            </AdminRoute>
          } />
          
          {/* Settings routes */}
          <Route path="/settings" element={
            <AdminRoute>
              <Settings />
            </AdminRoute>
          } />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WhatsAppButton />
      </BrowserRouter>
    </main>
  );
}

export default App;
