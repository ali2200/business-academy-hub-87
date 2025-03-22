
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Check, Lock, Play, ChevronRight, ChevronLeft, BookOpen, Clock, Award, Download } from 'lucide-react';
import { toast } from "sonner";
import { useQuery } from '@tanstack/react-query';

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

// This component is very similar to CoursePlayer but adapted for admin use
const AdminCoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('content');
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [nextLesson, setNextLesson] = useState<any>(null);
  const [prevLesson, setPrevLesson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch course data
  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['admin-course-player', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  // Fetch course lessons
  const { data: lessons, isLoading: isLoadingLessons } = useQuery({
    queryKey: ['admin-course-lessons', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .order('order', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  // Organize lessons into chapters
  const chaptersMap = lessons ? lessons.reduce((acc: any, lesson: any) => {
    if (!acc[lesson.chapter]) {
      acc[lesson.chapter] = {
        id: lesson.chapter,
        title: lesson.chapter,
        lessons: []
      };
    }
    acc[lesson.chapter].lessons.push({
      id: lesson.id,
      title: lesson.title,
      duration: lesson.duration || '10:00',
      completed: false,
      videoUrl: lesson.video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      order: lesson.order
    });
    return acc;
  }, {}) : {};

  const chapters = Object.values(chaptersMap);

  useEffect(() => {
    if (!isLoadingCourse && !isLoadingLessons && lessons && lessons.length > 0) {
      // Find first lesson as default if no lessonId provided
      const firstLesson = lessons[0];
      
      if (firstLesson) {
        setCurrentLesson({
          ...firstLesson,
          chapterId: firstLesson.chapter,
          chapterTitle: firstLesson.chapter
        });
        
        if (lessons.length > 1) {
          setNextLesson(lessons[1]);
        }
      }
      
      setIsLoading(false);
    }
  }, [isLoadingCourse, isLoadingLessons, lessons]);

  const handleLessonClick = (lesson: any) => {
    setCurrentLesson({
      ...lesson,
      chapterId: lesson.chapter,
      chapterTitle: lesson.chapter
    });
    
    const currentIndex = lessons.findIndex((l: any) => l.id === lesson.id);
    
    if (currentIndex > 0) {
      setPrevLesson(lessons[currentIndex - 1]);
    } else {
      setPrevLesson(null);
    }
    
    if (currentIndex < lessons.length - 1) {
      setNextLesson(lessons[currentIndex + 1]);
    } else {
      setNextLesson(null);
    }
  };

  const downloadResource = (resource: any) => {
    toast.success(`جاري تحميل ${resource.title}`, {
      description: "سيبدأ التحميل خلال لحظات"
    });
  };

  if (isLoading || isLoadingCourse || isLoadingLessons) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل المحتوى...</p>
        </div>
      </div>
    );
  }

  // Mock resources for now
  const resources = [
    { id: '1', title: 'دليل المحتوى', type: 'PDF', size: '2.5 MB' },
    { id: '2', title: 'مواد الدورة', type: 'ZIP', size: '4.7 MB' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="py-8 px-4 mb-4 bg-white shadow-sm border-b">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">عرض الدورة - وضع المشرف</h1>
            <Button
              onClick={() => navigate('/courses-management')}
              variant="outline"
              className="flex items-center gap-2"
            >
              العودة لقائمة الدورات
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pb-12 flex-grow">
        {/* Course header */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Link to="/admin-dashboard" className="hover:text-primary">لوحة التحكم</Link>
            <ChevronLeft className="mx-2 h-4 w-4" />
            <Link to="/courses-management" className="hover:text-primary">إدارة الدورات</Link>
            <ChevronLeft className="mx-2 h-4 w-4" />
            <span>{course?.title}</span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            {currentLesson?.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
            {currentLesson?.duration && (
              <div className="flex items-center">
                <Clock className="ml-1 h-4 w-4" />
                <span>{currentLesson.duration}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2">
            {/* Video player */}
            <div className="bg-black rounded-lg overflow-hidden aspect-video mb-6 shadow-lg">
              {currentLesson?.video_url ? (
                <iframe 
                  src={currentLesson.video_url} 
                  title={currentLesson.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  لا يوجد فيديو متاح لهذا الدرس
                </div>
              )}
            </div>
            
            {/* Tabs for lesson content and resources */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
              <TabsList className="mb-6">
                <TabsTrigger value="content" className="py-2 px-4">محتوى الدرس</TabsTrigger>
                <TabsTrigger value="resources" className="py-2 px-4">الموارد</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="animate-fade-in">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-primary">وصف الدرس</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {currentLesson?.description || 'لا يوجد وصف متاح لهذا الدرس.'}
                    </p>
                    
                    <div className="mt-8 flex gap-4">
                      {prevLesson && (
                        <Button 
                          variant="outline" 
                          onClick={() => handleLessonClick(prevLesson)}
                          className="flex items-center"
                        >
                          <ChevronRight className="ml-1 h-4 w-4" />
                          <span>الدرس السابق</span>
                        </Button>
                      )}
                      
                      {nextLesson && (
                        <Button 
                          onClick={() => handleLessonClick(nextLesson)}
                          className="flex items-center mr-auto"
                        >
                          <span>الدرس التالي</span>
                          <ChevronLeft className="mr-1 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="resources" className="animate-fade-in">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-primary">موارد الدرس</h3>
                    <p className="text-gray-700 mb-6">
                      الموارد المتاحة لهذا الدرس.
                    </p>
                    
                    <div className="space-y-4">
                      {resources.length > 0 ? (
                        resources.map((resource) => (
                          <div 
                            key={resource.id} 
                            className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:border-primary transition-colors"
                          >
                            <div className="flex items-center">
                              <div className="bg-gray-100 rounded-lg p-2 ml-3">
                                <BookOpen className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{resource.title}</h4>
                                <p className="text-sm text-gray-500">{resource.type} • {resource.size}</p>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => downloadResource(resource)}
                              className="flex items-center"
                            >
                              <Download className="ml-1 h-4 w-4" />
                              <span>تحميل</span>
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          لا توجد موارد متاحة لهذا الدرس
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar with course content */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 sticky top-24">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-lg text-primary">محتوى الدورة</h3>
                
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>الدروس المتاحة</span>
                    <span>{lessons?.length || 0} درس</span>
                  </div>
                </div>
              </div>
              
              <ScrollArea className="h-[60vh]">
                <div className="p-1">
                  {chapters.length > 0 ? (
                    chapters.map((chapter: any, index: number) => (
                      <div key={chapter.id} className="mb-2">
                        <div className="px-3 py-2 bg-gray-50 rounded-md">
                          <h4 className="font-medium text-primary">
                            {index + 1}. {chapter.title}
                          </h4>
                        </div>
                        
                        <div className="mt-1 space-y-1">
                          {chapter.lessons.map((lesson: any) => (
                            <button
                              key={lesson.id}
                              onClick={() => handleLessonClick(lesson)}
                              className={`w-full flex items-center px-3 py-2 rounded-md ${
                                currentLesson?.id === lesson.id 
                                  ? 'bg-primary text-white' 
                                  : 'hover:bg-gray-100 text-gray-700'
                              }`}
                            >
                              <div className={`ml-3 flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                                currentLesson?.id === lesson.id 
                                  ? 'bg-white text-primary' 
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                <Play className="h-3 w-3" />
                              </div>
                              <div className="text-right overflow-hidden">
                                <p className={`text-sm truncate ${
                                  currentLesson?.id === lesson.id ? 'text-white' : 'text-gray-700'
                                }`}>
                                  {lesson.title}
                                </p>
                                <p className={`text-xs ${
                                  currentLesson?.id === lesson.id ? 'text-white/80' : 'text-gray-500'
                                }`}>
                                  {lesson.duration}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                        {index < chapters.length - 1 && (
                          <Separator className="my-3" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      لا توجد دروس متاحة لهذه الدورة
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCoursePlayer;
