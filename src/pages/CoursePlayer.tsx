
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Check, Lock, Play, ChevronRight, ChevronLeft, BookOpen, Clock, Award, Download } from 'lucide-react';
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Navbar from '@/components/Navbar';

// Mock course data
const COURSE_DATA = {
  id: '1',
  title: 'أساسيات البيع الاحترافي',
  instructor: 'أحمد محمد',
  description: 'تعلم أساسيات البيع الاحترافي وكيفية إقناع العملاء وإتمام الصفقات بنجاح. هذه الدورة ستمكنك من فهم احتياجات العملاء وتقديم الحلول المناسبة لهم.',
  image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
  rating: 4.8,
  reviewsCount: 120,
  studentsCount: 1250,
  duration: '24 ساعة',
  level: 'متوسط',
  progress: 65,
  lastUpdated: '15 أبريل 2023',
  chapters: [
    {
      id: '1',
      title: 'مقدمة عن البيع الاحترافي',
      lessons: [
        { id: '1-1', title: 'أهمية البيع في عالم الأعمال', duration: '15:30', completed: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { id: '1-2', title: 'مهارات البيع الأساسية', duration: '12:45', completed: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { id: '1-3', title: 'أنواع العملاء وكيفية التعامل معهم', duration: '20:15', completed: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      ]
    },
    {
      id: '2',
      title: 'تقنيات الإقناع والتفاوض',
      lessons: [
        { id: '2-1', title: 'أساسيات الإقناع', duration: '18:20', completed: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { id: '2-2', title: 'تقنيات التفاوض الفعالة', duration: '22:10', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { id: '2-3', title: 'التعامل مع الاعتراضات', duration: '16:45', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { id: '2-4', title: 'كيفية إتمام الصفقات بنجاح', duration: '19:35', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      ]
    },
    {
      id: '3',
      title: 'استراتيجيات ما بعد البيع',
      lessons: [
        { id: '3-1', title: 'بناء علاقات طويلة الأمد مع العملاء', duration: '17:55', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { id: '3-2', title: 'خدمة العملاء المميزة', duration: '14:30', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { id: '3-3', title: 'استراتيجيات التسويق لعملاء سابقين', duration: '21:15', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      ]
    }
  ],
  resources: [
    { id: '1', title: 'دليل البيع الاحترافي', type: 'PDF', size: '2.5 MB' },
    { id: '2', title: 'قوالب عروض البيع', type: 'ZIP', size: '4.7 MB' },
    { id: '3', title: 'قائمة تحقق لمتابعة العملاء', type: 'PDF', size: '1.2 MB' },
  ]
};

const CoursePlayer = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('content');
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [nextLesson, setNextLesson] = useState<any>(null);
  const [prevLesson, setPrevLesson] = useState<any>(null);
  const [course, setCourse] = useState(COURSE_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch course data from an API
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setCourse(COURSE_DATA);
      
      // Find current lesson and adjacent lessons
      let foundCurrent = null;
      let foundNext = null;
      let foundPrev = null;
      
      // Flatten lessons array to find current, next, and previous lessons
      const allLessons = course.chapters.flatMap(chapter => 
        chapter.lessons.map(lesson => ({
          ...lesson,
          chapterId: chapter.id,
          chapterTitle: chapter.title
        }))
      );
      
      const currentIndex = allLessons.findIndex(lesson => lesson.id === lessonId);
      
      if (currentIndex !== -1) {
        foundCurrent = allLessons[currentIndex];
        if (currentIndex < allLessons.length - 1) {
          foundNext = allLessons[currentIndex + 1];
        }
        if (currentIndex > 0) {
          foundPrev = allLessons[currentIndex - 1];
        }
      } else if (allLessons.length > 0) {
        // If no lesson ID provided, default to first lesson
        foundCurrent = allLessons[0];
        if (allLessons.length > 1) {
          foundNext = allLessons[1];
        }
        navigate(`/course-player/${courseId}/${foundCurrent.id}`);
      }
      
      setCurrentLesson(foundCurrent);
      setNextLesson(foundNext);
      setPrevLesson(foundPrev);
      setIsLoading(false);
    }, 1000);
  }, [courseId, lessonId, navigate]);

  const markAsCompleted = () => {
    // In a real app, this would send a request to update the user's progress
    toast.success("تم تحديث تقدمك", {
      description: "تم تحديد الدرس كمكتمل"
    });
    
    // Update local state to reflect completion
    const updatedCourse = {...course};
    updatedCourse.chapters.forEach(chapter => {
      chapter.lessons.forEach(lesson => {
        if (lesson.id === currentLesson.id) {
          lesson.completed = true;
        }
      });
    });
    
    setCourse(updatedCourse);
    
    // Automatically navigate to next lesson if available
    if (nextLesson) {
      navigate(`/course-player/${courseId}/${nextLesson.id}`);
    }
  };

  const downloadResource = (resource: any) => {
    toast.success(`جاري تحميل ${resource.title}`, {
      description: "سيبدأ التحميل خلال لحظات"
    });
  };

  // Calculate overall course progress
  const totalLessons = course.chapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0);
  const completedLessons = course.chapters.reduce((acc, chapter) => 
    acc + chapter.lessons.filter(lesson => lesson.completed).length, 0);
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل المحتوى...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="pt-20 pb-12 flex-grow">
        <div className="container mx-auto px-4">
          {/* Course header */}
          <div className="mb-8">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Link to="/dashboard" className="hover:text-primary">لوحة التحكم</Link>
              <ChevronLeft className="mx-2 h-4 w-4" />
              <Link to="/dashboard" className="hover:text-primary">{course.title}</Link>
              <ChevronLeft className="mx-2 h-4 w-4" />
              <span>{currentLesson?.chapterTitle}</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-primary">{currentLesson?.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="ml-1 h-4 w-4" />
                <span>{currentLesson?.duration}</span>
              </div>
              
              {currentLesson?.completed ? (
                <div className="flex items-center text-green-600">
                  <Check className="ml-1 h-4 w-4" />
                  <span>مكتمل</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Play className="ml-1 h-4 w-4" />
                  <span>قيد التقدم</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content area */}
            <div className="lg:col-span-2">
              {/* Video player */}
              <div className="bg-black rounded-lg overflow-hidden aspect-video mb-6 shadow-lg">
                <iframe 
                  src={currentLesson?.videoUrl} 
                  title={currentLesson?.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
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
                        في هذا الدرس، ستتعلم كيفية {currentLesson?.title.toLowerCase()}. 
                        نغطي الأساسيات والتقنيات المتقدمة التي تساعدك على تحسين مهاراتك في البيع وبناء علاقات قوية مع العملاء.
                      </p>
                      
                      <h4 className="text-lg font-semibold mt-6 mb-3 text-primary">ما ستتعلمه:</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>فهم الأسس النظرية لـ {currentLesson?.title.toLowerCase()}</li>
                        <li>تطبيق التقنيات العملية في سيناريوهات واقعية</li>
                        <li>تجنب الأخطاء الشائعة التي يقع فيها المبتدئون</li>
                        <li>قياس فعالية استراتيجياتك وتحسينها باستمرار</li>
                      </ul>
                      
                      <div className="mt-8 flex gap-4">
                        {prevLesson && (
                          <Button 
                            variant="outline" 
                            onClick={() => navigate(`/course-player/${courseId}/${prevLesson.id}`)}
                            className="flex items-center"
                          >
                            <ChevronRight className="ml-1 h-4 w-4" />
                            <span>الدرس السابق</span>
                          </Button>
                        )}
                        
                        {!currentLesson?.completed ? (
                          <Button 
                            onClick={markAsCompleted}
                            className="flex items-center mr-auto"
                          >
                            <Check className="ml-1 h-4 w-4" />
                            <span>إنهاء وانتقل للدرس التالي</span>
                          </Button>
                        ) : nextLesson ? (
                          <Button 
                            onClick={() => navigate(`/course-player/${courseId}/${nextLesson.id}`)}
                            className="flex items-center mr-auto"
                          >
                            <span>الدرس التالي</span>
                            <ChevronLeft className="mr-1 h-4 w-4" />
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center mr-auto bg-green-600 hover:bg-green-700"
                          >
                            <Award className="ml-1 h-4 w-4" />
                            <span>إكمال الدورة</span>
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
                        استخدم هذه الموارد لتعزيز تعلمك ومساعدتك على تطبيق ما تعلمته في العالم الحقيقي.
                      </p>
                      
                      <div className="space-y-4">
                        {course.resources.map((resource) => (
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
                        ))}
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
                      <span>تقدمك في الدورة</span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{completedLessons} من {totalLessons} درس مكتمل</span>
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>
                
                <ScrollArea className="h-[60vh]">
                  <div className="p-1">
                    {course.chapters.map((chapter, index) => (
                      <div key={chapter.id} className="mb-2">
                        <div className="px-3 py-2 bg-gray-50 rounded-md">
                          <h4 className="font-medium text-primary">
                            {index + 1}. {chapter.title}
                          </h4>
                        </div>
                        
                        <div className="mt-1 space-y-1">
                          {chapter.lessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => navigate(`/course-player/${courseId}/${lesson.id}`)}
                              className={`w-full flex items-center px-3 py-2 rounded-md ${
                                currentLesson?.id === lesson.id 
                                  ? 'bg-primary text-white' 
                                  : 'hover:bg-gray-100 text-gray-700'
                              }`}
                            >
                              <div className={`ml-3 flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                                currentLesson?.id === lesson.id 
                                  ? 'bg-white text-primary' 
                                  : lesson.completed 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-200 text-gray-600'
                              }`}>
                                {lesson.completed ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Play className="h-3 w-3" />
                                )}
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
                              
                              {/* Show lock icon for "locked" lessons (future implementation) */}
                              {false && (
                                <Lock className="h-4 w-4 text-gray-400 mr-auto" />
                              )}
                            </button>
                          ))}
                        </div>
                        {index < course.chapters.length - 1 && (
                          <Separator className="my-3" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
