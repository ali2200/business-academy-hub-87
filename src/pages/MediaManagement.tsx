
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UploadCloud, Image, FileVideo, File, RefreshCw, Search, Eye, Trash2, Edit, Download, Link as LinkIcon } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

interface MediaFile {
  id: string;
  name: string;
  bucket: string;
  url: string;
  type: string;
  size: number;
  created_at: string;
}

const MediaManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("images");
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    loadMediaFiles();
  }, [activeTab]);
  
  const loadMediaFiles = async () => {
    setIsLoading(true);
    try {
      let bucket = '';
      switch (activeTab) {
        case 'images':
          bucket = 'book-covers';
          break;
        case 'videos':
          bucket = 'course-videos';
          break;
        case 'documents':
          bucket = 'book-files';
          break;
        default:
          bucket = 'book-covers';
      }
      
      // List files in the selected bucket
      const { data, error } = await supabase.storage.from(bucket).list();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        setFiles([]);
        return;
      }
      
      // Filter out folders
      const fileObjects = data.filter(item => !item.id.endsWith('/'));
      
      // Create URL for each file
      const mediaFiles: MediaFile[] = await Promise.all(
        fileObjects.map(async (file) => {
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(file.name);
          return {
            id: file.id,
            name: file.name,
            bucket,
            url: urlData.publicUrl,
            type: getFileType(file.name),
            size: file.metadata?.size || 0,
            created_at: file.created_at,
          };
        })
      );
      
      setFiles(mediaFiles);
    } catch (error) {
      console.error('Error loading media files:', error);
      toast.error('حدث خطأ أثناء تحميل ملفات الوسائط');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getFileType = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return 'image';
    } else if (['mp4', 'webm', 'mov', 'avi'].includes(extension)) {
      return 'video';
    } else if (['pdf', 'doc', 'docx', 'txt', 'xlsx', 'xls', 'ppt', 'pptx'].includes(extension)) {
      return 'document';
    }
    return 'other';
  };
  
  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return;
    }
    
    setIsUploading(true);
    
    try {
      let bucket = '';
      switch (activeTab) {
        case 'images':
          bucket = 'book-covers';
          break;
        case 'videos':
          bucket = 'course-videos';
          break;
        case 'documents':
          bucket = 'book-files';
          break;
        default:
          bucket = 'book-covers';
      }
      
      // Upload each file
      const uploadPromises = acceptedFiles.map(async (file) => {
        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        
        const { error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file);
        
        if (error) throw error;
        return fileName;
      });
      
      await Promise.all(uploadPromises);
      toast.success('تم رفع الملفات بنجاح');
      
      // Reload files list
      loadMediaFiles();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('حدث خطأ أثناء رفع الملفات');
    } finally {
      setIsUploading(false);
    }
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  
  const deleteFile = async (fileName: string, bucket: string) => {
    try {
      const { error } = await supabase.storage.from(bucket).remove([fileName]);
      
      if (error) throw error;
      
      toast.success('تم حذف الملف بنجاح');
      
      // Update local state
      setFiles(files.filter(file => file.name !== fileName));
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('حدث خطأ أثناء حذف الملف');
    }
  };
  
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('تم نسخ الرابط إلى الحافظة');
  };
  
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">إدارة الوسائط</h1>
              <p className="text-gray-600 mt-1">إدارة ملفات الصور والفيديو والمستندات</p>
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
        
        <Tabs defaultValue="images" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              الصور
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <FileVideo className="h-4 w-4" />
              الفيديوهات
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <File className="h-4 w-4" />
              المستندات
            </TabsTrigger>
          </TabsList>
          
          {['images', 'videos', 'documents'].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue}>
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {tabValue === 'images' && 'الصور'}
                      {tabValue === 'videos' && 'الفيديوهات'}
                      {tabValue === 'documents' && 'المستندات'}
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={loadMediaFiles}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />
                      تحديث
                    </Button>
                  </div>
                  <CardDescription>
                    {tabValue === 'images' && 'رفع وإدارة الصور المستخدمة في الموقع'}
                    {tabValue === 'videos' && 'رفع وإدارة فيديوهات الدورات'}
                    {tabValue === 'documents' && 'رفع وإدارة ملفات الكتب والمستندات'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="البحث عن ملف..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-9"
                      />
                    </div>
                  </div>
                  
                  <div 
                    {...getRootProps()} 
                    className={`border-2 border-dashed rounded-lg p-6 text-center mb-6 transition-colors ${
                      isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <UploadCloud className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">اسحب وأفلت الملفات هنا، أو انقر للتصفح</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {tabValue === 'images' && 'الصيغ المدعومة: JPG, PNG, GIF, SVG'}
                      {tabValue === 'videos' && 'الصيغ المدعومة: MP4, WEBM, MOV'}
                      {tabValue === 'documents' && 'الصيغ المدعومة: PDF, DOCX, XLSX, PPTX'}
                    </p>
                    {isUploading && (
                      <div className="mt-2">
                        <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent mr-2"></div>
                        <span className="text-sm text-gray-500">جاري رفع الملفات...</span>
                      </div>
                    )}
                  </div>
                  
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                      <p className="text-gray-500">جاري تحميل الملفات...</p>
                    </div>
                  ) : filteredFiles.length === 0 ? (
                    <div className="text-center py-8 border rounded-lg">
                      <File className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">
                        {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد ملفات بعد'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredFiles.map((file) => (
                        <Card key={file.id} className="overflow-hidden">
                          <div className="relative h-40 bg-gray-100 flex items-center justify-center">
                            {file.type === 'image' ? (
                              <img 
                                src={file.url} 
                                alt={file.name} 
                                className="h-full w-full object-contain p-2" 
                              />
                            ) : file.type === 'video' ? (
                              <div className="flex flex-col items-center justify-center text-gray-500">
                                <FileVideo className="h-12 w-12" />
                                <span className="mt-1 text-sm">ملف فيديو</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center text-gray-500">
                                <File className="h-12 w-12" />
                                <span className="mt-1 text-sm">مستند</span>
                              </div>
                            )}
                          </div>
                          <CardContent className="pt-4 pb-2">
                            <p className="font-medium truncate" title={file.name}>{file.name}</p>
                            <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                              <span>{formatFileSize(file.size)}</span>
                              <span>{new Date(file.created_at).toLocaleDateString('ar-EG')}</span>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between pt-0">
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => window.open(file.url, '_blank')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => copyToClipboard(file.url)}
                              >
                                <LinkIcon className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => window.open(file.url, '_blank')}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => deleteFile(file.name, file.bucket)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default MediaManagement;
