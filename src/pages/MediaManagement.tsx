
import React, { useState } from 'react';
import { 
  Image as ImageIcon,
  Video,
  File,
  PlusCircle,
  Trash2,
  Search,
  Copy,
  Layout,
  FileText,
  Settings,
  Home
} from 'lucide-react';
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for media files
const MOCK_MEDIA = [
  {
    id: "1",
    type: "image",
    name: "hero-image.jpg",
    url: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    size: "512 KB",
    dimensions: "1920 × 1080",
    uploadDate: "15 أبريل 2023"
  },
  {
    id: "2",
    type: "image",
    name: "product-1.jpg",
    url: "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=2069&auto=format&fit=crop",
    size: "324 KB",
    dimensions: "1600 × 900",
    uploadDate: "20 مايو 2023"
  },
  {
    id: "3",
    type: "image",
    name: "team-photo.jpg",
    url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
    size: "728 KB",
    dimensions: "2048 × 1152",
    uploadDate: "10 يونيو 2023"
  },
  {
    id: "4",
    type: "video",
    name: "product-demo.mp4",
    url: "https://example.com/videos/product-demo.mp4",
    size: "5.2 MB",
    dimensions: "1280 × 720",
    uploadDate: "5 يوليو 2023"
  },
  {
    id: "5",
    type: "document",
    name: "price-list.pdf",
    url: "https://example.com/documents/price-list.pdf",
    size: "1.1 MB",
    dimensions: "",
    uploadDate: "8 يوليو 2023"
  }
];

const MediaManagement = () => {
  const [mediaItems, setMediaItems] = useState(MOCK_MEDIA);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) return;
    
    const updatedMedia = mediaItems.filter(item => item.id !== id);
    setMediaItems(updatedMedia);
    toast.success('تم حذف الملف بنجاح');
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('تم نسخ الرابط إلى الحافظة');
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleBulkDelete = () => {
    if (!selectedItems.length) return;
    if (!confirm(`هل أنت متأكد من حذف ${selectedItems.length} ملف/ملفات؟`)) return;
    
    const updatedMedia = mediaItems.filter(item => !selectedItems.includes(item.id));
    setMediaItems(updatedMedia);
    setSelectedItems([]);
    toast.success('تم حذف الملفات المحددة بنجاح');
  };

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = activeTab === 'all' || item.type === activeTab;
    return matchesSearch && matchesType;
  });

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-8 w-8 text-blue-500" />;
      case 'video': return <Video className="h-8 w-8 text-purple-500" />;
      case 'document': return <File className="h-8 w-8 text-orange-500" />;
      default: return <File className="h-8 w-8 text-gray-500" />;
    }
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
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#2c3338]">
                  <FileText className="h-5 w-5 ml-2" />
                  <span>الصفحات</span>
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start bg-[#2271b1] hover:bg-[#135e96]">
                  <ImageIcon className="h-5 w-5 ml-2" />
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
              <h1 className="text-2xl font-bold">مكتبة الوسائط</h1>
              <p className="text-gray-500">عرض وإدارة الصور والفيديوهات والملفات</p>
            </div>
            <div>
              <Button>
                <PlusCircle className="ml-2 h-4 w-4" />
                إضافة ملفات جديدة
              </Button>
            </div>
          </div>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="relative w-64">
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="بحث في الوسائط..."
                    className="pl-3 pr-10"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <div className="flex items-center gap-2">
                  {selectedItems.length > 0 && (
                    <Button variant="destructive" onClick={handleBulkDelete}>
                      <Trash2 className="ml-2 h-4 w-4" />
                      حذف المحدد ({selectedItems.length})
                    </Button>
                  )}
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 bg-[#f0f0f1] border-b border-gray-200 p-0 rounded-none w-full justify-start overflow-x-auto">
                  <TabsTrigger value="all" className="py-3 px-4 rounded-none data-[state=active]:bg-white data-[state=active]:border-t-2 data-[state=active]:border-t-[#2271b1] data-[state=active]:shadow-none">
                    الكل
                  </TabsTrigger>
                  <TabsTrigger value="image" className="py-3 px-4 rounded-none data-[state=active]:bg-white data-[state=active]:border-t-2 data-[state=active]:border-t-[#2271b1] data-[state=active]:shadow-none">
                    صور
                  </TabsTrigger>
                  <TabsTrigger value="video" className="py-3 px-4 rounded-none data-[state=active]:bg-white data-[state=active]:border-t-2 data-[state=active]:border-t-[#2271b1] data-[state=active]:shadow-none">
                    فيديوهات
                  </TabsTrigger>
                  <TabsTrigger value="document" className="py-3 px-4 rounded-none data-[state=active]:bg-white data-[state=active]:border-t-2 data-[state=active]:border-t-[#2271b1] data-[state=active]:shadow-none">
                    مستندات
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredMedia.length > 0 ? (
                      filteredMedia.map((item) => (
                        <div 
                          key={item.id} 
                          className={`relative border rounded-md overflow-hidden group hover:border-blue-500 ${
                            selectedItems.includes(item.id) ? 'ring-2 ring-blue-500 border-blue-500' : ''
                          }`}
                          onClick={() => handleSelectItem(item.id)}
                        >
                          <div className="absolute top-2 right-2 z-10">
                            <input 
                              type="checkbox" 
                              checked={selectedItems.includes(item.id)}
                              onChange={() => {}}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </div>
                          <div className="aspect-square bg-gray-100 flex items-center justify-center">
                            {item.type === 'image' ? (
                              <img 
                                src={item.url} 
                                alt={item.name} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex flex-col items-center">
                                {getMediaIcon(item.type)}
                                <span className="mt-2 text-sm text-gray-600">{item.name}</span>
                              </div>
                            )}
                          </div>
                          <div className="p-3 bg-white">
                            <h3 className="text-sm font-medium truncate">{item.name}</h3>
                            <div className="text-xs text-gray-500 mt-1">{item.size}</div>
                            
                            <div className="flex space-x-2 rtl:space-x-reverse mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyUrl(item.url);
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(item.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-10">
                        <ImageIcon className="h-10 w-10 mx-auto text-gray-400" />
                        <p className="mt-4 text-gray-500">لم يتم العثور على ملفات</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MediaManagement;
