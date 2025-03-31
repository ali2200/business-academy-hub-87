
import React from 'react';
import { Label } from '@/components/ui/label';

interface HtmlPreviewProps {
  htmlContent: string;
  visible: boolean;
  className?: string;
  maxHeight?: string;
}

const HtmlPreview: React.FC<HtmlPreviewProps> = ({ 
  htmlContent, 
  visible, 
  className = "",
  maxHeight = "300px" 
}) => {
  if (!visible) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="font-bold text-right">معاينة المحتوى</Label>
      <div 
        className="border border-gray-200 rounded-lg p-4 overflow-y-auto bg-white"
        style={{ maxHeight }}
      >
        <div 
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
          className="prose prose-sm max-w-none"
        />
      </div>
    </div>
  );
};

export default HtmlPreview;
