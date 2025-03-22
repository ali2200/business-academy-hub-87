
import React, { useState } from 'react';
import { 
  FileText, 
  Edit,
  Trash2,
  PlusCircle,
  Eye,
  Save,
  X,
  Home,
  Layout,
  Image,
  Settings
} from 'lucide-react';
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// Dummy data for pages
const MOCK_PAGES = [
  {
    id: "1",
    title: "الصفحة الرئيسية",
    slug: "home",
    content: "محتوى الصفحة الرئيسية",
    status: "published",
    lastUpdated: "15 أبريل 2023",
  },
  {
    id: "2",
    title: "من نحن",
    slug: "about",
    content: "محتوى صفحة من نحن",
    status: "published",
    lastUpdated: "20 مايو 2023",
  },
  {
    id: "3",
    title: "اتصل بنا",
    slug: "contact",
    content: "محتوى صفحة اتصل بنا",
    status: "published",
    lastUpdated: "10 يونيو 2023",
  },
  {
    id: "4",
    title: "سياسة الخصوصية",
    slug: "privacy-policy",
    content: "محتوى صفحة سياسة الخصوصية",
    status: "draft",
    lastUpdated: "5 يوليو 2023",
  },
];

const PagesManagement = () => {
  const [pages, setPages] = useState(MOCK_PAGES);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<any>(null);

  const handleEditPage = (page: any) => {
    setCurrentPage(page);
    setEditMode(true);
  };

  const handleSavePage = () => {
    if (!currentPage) return;

    const updatedPages = pages.map(page => 
      page.id === currentPage.id ? currentPage : page
    );
    
    setPages(updatedPages);
    toast.success('تم حفظ التغييرات بنجاح');
    setEditMode(false);
    setCurrentPage(null);
  };

  const handleDeletePage = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصفحة؟')) return;
    
    const updatedPages = pages.filter(page => page.id !== id);
    setPages(updatedPages);
    toast.success('تم حذف الصفحة بنجاح');
  };

  const handleCreatePage = () => {
    const newPage = {
      id: Date.now().toString(),
      title: "صفحة جديدة",
      slug: `page-${Date.now()}`,
      content: "",
      status: "draft",
      lastUpdated: new Date().toLocaleDateString('ar-EG'),
    };

    setPages([...pages, newPage]);
    handleEditPage(newPage);
  };

  return (
    <div className="min-h-screen bg-[#f0f0f1] rtl">
      {/* WordPress-like Admin Header */}
      <header className="bg-[#1d2327] text-white py-2 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <span className="text-2xl">أ</span>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button variant="ghost" className="text-white hover:text-gray-200 p-1">
              <PlusCircle className="h-4 w-4 ml-1" />
              <span>جديد</span>
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button variant="ghost" className="text-white hover:text-gray-200 p-1">
            <Home className="h-4 w-4 ml-1" />
            <span>زيارة الموقع</span>
          </Button>
        </div>
      </header>

      {/* WordPress-like Admin Body */}
      <div className="flex h-[calc(100vh-48px)]">
        {/* Sidebar */}
        <div className="bg-[#1d2327] text-white w-64 flex-shrink-0">
          <div className="p-4">
            <ul className="space-y-1">
              <li>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#2c3338]">
                  <Layout className="h-5 w-5 ml-2" />
                  <span>لوحة التحكم</span>
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start bg-[#2271b1] hover:bg-[#135e96]">
                  <FileText className="h-5 w-5 ml-2" />
                  <span>الصفحات</span>
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#2c3338]">
                  <Image className="h-5 w-5 ml-2" />
                  <span>الوسائط</span>
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#2c3338]">
                  <Settings className="h-5 w-5 ml-2" />
                  <span>إدارة المحتوى</span>
                </Button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">إدارة الصفحات</h1>
              <p className="text-gray-500">عرض وتعديل وإضافة صفحات جديدة</p>
            </div>
            <div>
              <Button onClick={handleCreatePage}>
                <PlusCircle className="ml-2 h-4 w-4" />
                إضافة صفحة جديدة
              </Button>
            </div>
          </div>

          {editMode ? (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>تعديل الصفحة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">عنوان الصفحة</label>
                    <Input 
                      value={currentPage?.title || ''}
                      onChange={(e) => setCurrentPage({...currentPage, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">الرابط</label>
                    <Input 
                      value={currentPage?.slug || ''}
                      onChange={(e) => setCurrentPage({...currentPage, slug: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">المحتوى</label>
                    <Textarea 
                      className="min-h-[300px]"
                      value={currentPage?.content || ''}
                      onChange={(e) => setCurrentPage({...currentPage, content: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  <X className="ml-2 h-4 w-4" />
                  إلغاء
                </Button>
                <Button onClick={handleSavePage}>
                  <Save className="ml-2 h-4 w-4" />
                  حفظ التغييرات
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="shadow-sm">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-right py-3 px-4 font-medium">العنوان</th>
                      <th className="text-right py-3 px-4 font-medium">الرابط</th>
                      <th className="text-right py-3 px-4 font-medium">الحالة</th>
                      <th className="text-right py-3 px-4 font-medium">آخر تحديث</th>
                      <th className="text-right py-3 px-4 font-medium">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map((page) => (
                      <tr key={page.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium">{page.title}</div>
                        </td>
                        <td className="py-3 px-4 text-gray-600 font-mono text-sm">/{page.slug}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            page.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {page.status === 'published' ? 'منشور' : 'مسودة'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{page.lastUpdated}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2 rtl:space-x-reverse">
                            <Button variant="ghost" size="sm" onClick={() => handleEditPage(page)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeletePage(page.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PagesManagement;
