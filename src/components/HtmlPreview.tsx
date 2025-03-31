
import React from 'react';
import { Label } from '@/components/ui/label';

interface HtmlPreviewProps {
  htmlContent: string;
  visible: boolean;
}

const HtmlPreview: React.FC<HtmlPreviewProps> = ({ htmlContent, visible }) => {
  if (!visible) return null;

  return (
    <div className="space-y-2">
      <Label className="font-bold text-right">معاينة المحتوى</Label>
      <div className="border border-gray-200 rounded-lg p-4 max-h-[300px] overflow-y-auto">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </div>
  );
};

export default HtmlPreview;
