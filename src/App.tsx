
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import Index from '@/pages/Index';
import Courses from '@/pages/Courses';
import CourseDetail from '@/pages/CourseDetail';
import CoursePlayer from '@/pages/CoursePlayer';
import Books from '@/pages/Books';
import BookDetail from '@/pages/BookDetail';
import BookReader from '@/pages/BookReader';
import Articles from '@/pages/Articles';
import Contact from '@/pages/Contact';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/Dashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import ContentManagement from '@/pages/ContentManagement';
import PagesManagement from '@/pages/PagesManagement';
import MediaManagement from '@/pages/MediaManagement';

// Components
import WhatsAppButton from '@/components/WhatsAppButton';
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/course/:id/lesson/:lessonId" element={<CoursePlayer />} />
        <Route path="/books" element={<Books />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/book/:id/read" element={<BookReader />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/content-management" element={<ContentManagement />} />
        <Route path="/pages-management" element={<PagesManagement />} />
        <Route path="/media-management" element={<MediaManagement />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <WhatsAppButton />
      <Toaster />
    </Router>
  );
}

export default App;
