
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
import { LinkIcon, Printer } from 'lucide-react';

interface ArticleViewerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  article: {
    title: string;
    content: string;
    slug: string;
  } | null;
}

const ArticleViewer: React.FC<ArticleViewerProps> = ({
  isOpen,
  onOpenChange,
  article
}) => {
  if (!article) return null;

  const printArticle = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <title>${article.title}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          h1 {
            text-align: center;
            margin-bottom: 20px;
          }
          img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 15px auto;
          }
          @media print {
            a {
              text-decoration: none;
              color: black;
            }
          }
        </style>
      </head>
      <body>
        <h1>${article.title}</h1>
        <div>${article.content}</div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const copyUrl = () => {
    const url = `${window.location.origin}/articles/${article.slug}`;
    navigator.clipboard.writeText(url)
      .then(() => alert('تم نسخ الرابط'))
      .catch(err => console.error('فشل نسخ الرابط:', err));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">{article.title}</DialogTitle>
          <DialogDescription className="text-center">
            معاينة المقال كما سيظهر على الموقع
          </DialogDescription>
        </DialogHeader>
        
        <div className="article-content mt-4 border rounded-md p-4 bg-white">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
        
        <DialogFooter className="sm:justify-between gap-2 flex-wrap">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={copyUrl}
            >
              <LinkIcon className="h-4 w-4" />
              نسخ الرابط
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={printArticle}
            >
              <Printer className="h-4 w-4" />
              طباعة
            </Button>
          </div>
          <DialogClose asChild>
            <Button variant="default">إغلاق</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleViewer;
