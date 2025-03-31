
import React from 'react';
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
import HtmlFileUploader from '@/components/HtmlFileUploader';
import HtmlPreview from '@/components/HtmlPreview';

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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>استيراد مقال HTML</DialogTitle>
          <DialogDescription>
            قم برفع ملف HTML أو لصق محتواه مباشرة.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
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
          
          <HtmlFileUploader
            htmlContent={htmlContent}
            onHtmlChange={handleHtmlContentChange}
            onTitleChange={handleHtmlTitleChange}
          />
          
          <HtmlPreview 
            htmlContent={htmlContent}
            visible={previewVisible}
          />
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">إلغاء</Button>
          </DialogClose>
          <Button 
            onClick={handleImportHtml}
            disabled={!htmlContent || !htmlTitle}
          >
            استيراد المقال
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HtmlImportDialog;
