
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, Eye, Clipboard, Code, Save } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

interface HtmlImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  htmlContent: string;
  htmlTitle: string;
  previewVisible: boolean;
  setHtmlTitle: (title: string) => void;
  handleHtmlContentChange: (content: string) => void;
  handleHtmlTitleChange: (title: string) => void;
  handleImportHtml: () => void;
}

const HtmlImportDialog: React.FC<HtmlImportDialogProps> = ({
  isOpen,
  onOpenChange,
  htmlContent,
  htmlTitle,
  previewVisible,
  setHtmlTitle,
  handleHtmlContentChange,
  handleHtmlTitleChange,
  handleImportHtml
}) => {
  const [activeTab, setActiveTab] = useState<string>("upload");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check if it's an HTML file
    if (!file.name.endsWith('.html') && !file.name.toLowerCase().endsWith('.htm')) {
      alert('يرجى تحميل ملف HTML فقط (.html or .htm)');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // Extract title from HTML content (from title tag if possible)
      let title = '';
      const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
      } else {
        // Fallback: use filename without extension as title
        title = file.name.replace(/\.(html|htm)$/i, '');
      }
      
      handleHtmlContentChange(content);
      setHtmlTitle(title);
      setActiveTab("preview");
    };
    
    reader.onerror = () => {
      alert('حدث خطأ أثناء قراءة الملف');
    };
    
    reader.readAsText(file);
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      handleHtmlContentChange(clipboardText);
      
      // Try to extract title from content
      const titleMatch = clipboardText.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        setHtmlTitle(titleMatch[1].trim());
      }
      
      setActiveTab("preview");
    } catch (err) {
      alert('فشل في الوصول إلى الحافظة. يرجى التأكد من منح الإذن أو نسخ المحتوى يدويًا.');
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleHtmlContentChange(e.target.value);
  };

  const cleanHtml = (html: string): string => {
    // Basic HTML cleaning function - you can expand this as needed
    let cleaned = html;
    
    // Remove <html>, <head>, <meta>, <title> tags and their content
    cleaned = cleaned.replace(/<html[^>]*>|<\/html>/gi, '');
    cleaned = cleaned.replace(/<head>[\s\S]*?<\/head>/gi, '');
    cleaned = cleaned.replace(/<body[^>]*>|<\/body>/gi, '');
    
    // Remove scripts
    cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove styles
    cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    
    // Remove comments
    cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
    
    // Clean up any excessive line breaks or spaces
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    return cleaned.trim();
  };

  const handleCleanHtml = () => {
    handleHtmlContentChange(cleanHtml(htmlContent));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>استيراد مقال HTML</DialogTitle>
          <DialogDescription>
            يمكنك رفع ملف HTML، أو لصق محتواه مباشرة، أو كتابته يدويًا.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="html-title">عنوان المقال</Label>
            <Input
              id="html-title"
              value={htmlTitle}
              onChange={(e) => setHtmlTitle(e.target.value)}
              placeholder="أدخل عنوان المقال"
              className="w-full"
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="upload" className="flex items-center gap-1">
                <FileUp className="h-4 w-4" />
                <span>رفع ملف</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-1">
                <Code className="h-4 w-4" />
                <span>إدخال HTML</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>معاينة</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="p-4 border rounded-lg min-h-[300px] flex flex-col justify-center items-center gap-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".html,.htm"
                hidden
              />
              <div className="text-center">
                <Button
                  onClick={handleTriggerFileInput}
                  className="mb-2 w-40"
                  variant="outline"
                  size="lg"
                >
                  <FileUp className="h-4 w-4 ml-2" />
                  اختر ملف HTML
                </Button>
                <p className="text-sm text-gray-500">اسحب ملف HTML وأفلته هنا أو اضغط للتصفح</p>
              </div>
              
              <div className="w-full border-t my-4"></div>
              
              <Button
                onClick={handlePasteFromClipboard}
                variant="outline"
                className="w-40"
              >
                <Clipboard className="h-4 w-4 ml-2" />
                لصق من الحافظة
              </Button>
            </TabsContent>
            
            <TabsContent value="code" className="min-h-[300px]">
              <div className="flex justify-end mb-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCleanHtml}
                  className="text-xs"
                >
                  تنظيف HTML
                </Button>
              </div>
              <Textarea
                value={htmlContent}
                onChange={handleContentChange}
                placeholder="ضع كود HTML هنا..."
                className="font-mono text-sm min-h-[280px]"
                dir="ltr"
              />
            </TabsContent>
            
            <TabsContent value="preview" className="min-h-[300px]">
              <div className="border rounded-md p-4 bg-white min-h-[280px] overflow-auto">
                {htmlContent ? (
                  <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    لا يوجد محتوى للمعاينة
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">إلغاء</Button>
          </DialogClose>
          <Button 
            onClick={handleImportHtml}
            disabled={!htmlContent || !htmlTitle}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            استيراد المقال
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HtmlImportDialog;
