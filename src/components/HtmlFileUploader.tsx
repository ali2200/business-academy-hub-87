
import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface HtmlFileUploaderProps {
  htmlContent: string;
  onHtmlChange: (content: string) => void;
  onTitleChange?: (title: string) => void;
}

const HtmlFileUploader: React.FC<HtmlFileUploaderProps> = ({
  htmlContent,
  onHtmlChange,
  onTitleChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check if it's an HTML file
    if (!file.name.endsWith('.html') && !file.name.toLowerCase().endsWith('.htm')) {
      toast.error('يرجى تحميل ملف HTML فقط (.html or .htm)');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // Extract title from HTML content (from title tag if possible)
      if (onTitleChange) {
        let title = '';
        const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          title = titleMatch[1].trim();
        } else {
          // Fallback: use filename without extension as title
          title = file.name.replace(/\.(html|htm)$/i, '');
        }
        onTitleChange(title);
      }
      
      onHtmlChange(content);
      toast.success('تم تحميل ملف HTML بنجاح');
    };
    
    reader.onerror = () => {
      toast.error('حدث خطأ أثناء قراءة الملف');
    };
    
    reader.readAsText(file);
  };
  
  const handleHtmlContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onHtmlChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleTriggerFileInput}
        >
          <Upload className="h-4 w-4" />
          استيراد من ملف
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".html,.htm"
          className="hidden"
        />
        <p className="text-sm text-gray-500">أو قم بلصق كود HTML مباشرة أدناه</p>
      </div>
      
      <Textarea
        value={htmlContent}
        onChange={handleHtmlContentChange}
        placeholder="ألصق كود HTML هنا..."
        rows={10}
        dir="ltr"
        className="font-mono text-sm"
      />
    </div>
  );
};

export default HtmlFileUploader;
