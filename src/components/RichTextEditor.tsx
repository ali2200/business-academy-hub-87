
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  Image, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Heading1, 
  Heading2,
  Eye,
  Code
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "أدخل المحتوى هنا...",
  className = "",
  rows = 12
}) => {
  const [previewMode, setPreviewMode] = useState(false);
  const [editMode, setEditMode] = useState<'visual' | 'html'>('visual');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // This will handle auto-focusing after inserting a tag
  const insertTag = (startTag: string, endTag: string = "") => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end, value.length);
    
    const newText = beforeText + startTag + selectedText + endTag + afterText;
    onChange(newText);
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + startTag.length, 
        end + startTag.length
      );
    }, 0);
  };

  const formatActions = [
    { icon: <Bold size={18} />, action: () => insertTag("<strong>", "</strong>"), title: "تخشين" },
    { icon: <Italic size={18} />, action: () => insertTag("<em>", "</em>"), title: "مائل" },
    { icon: <Underline size={18} />, action: () => insertTag("<u>", "</u>"), title: "تسطير" },
    { icon: <Link size={18} />, action: () => insertTag('<a href="http://">', "</a>"), title: "رابط" },
    { icon: <Image size={18} />, action: () => insertTag('<img src="', '" alt="صورة" />'), title: "صورة" },
    { icon: <List size={18} />, action: () => insertTag("<ul>\n  <li>", "</li>\n</ul>"), title: "قائمة" },
    { icon: <ListOrdered size={18} />, action: () => insertTag("<ol>\n  <li>", "</li>\n</ol>"), title: "قائمة مرقمة" },
    { icon: <AlignRight size={18} />, action: () => insertTag('<div dir="rtl" style="text-align: right;">', "</div>"), title: "محاذاة لليمين" },
    { icon: <AlignCenter size={18} />, action: () => insertTag('<div style="text-align: center;">', "</div>"), title: "توسيط" },
    { icon: <AlignLeft size={18} />, action: () => insertTag('<div dir="ltr" style="text-align: left;">', "</div>"), title: "محاذاة لليسار" },
    { icon: <Heading1 size={18} />, action: () => insertTag("<h1>", "</h1>"), title: "عنوان 1" },
    { icon: <Heading2 size={18} />, action: () => insertTag("<h2>", "</h2>"), title: "عنوان 2" },
  ];

  // Toggle between visual and HTML mode
  const toggleEditMode = () => {
    setEditMode(editMode === 'visual' ? 'html' : 'visual');
  };

  return (
    <div className={`rich-text-editor ${className}`}>
      <div className="flex flex-wrap gap-1 mb-2 p-1 border rounded bg-gray-50">
        {formatActions.map((action, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            title={action.title}
            onClick={(e) => {
              e.preventDefault();
              action.action();
            }}
            className="h-8 w-8 p-0"
            disabled={previewMode || editMode === 'html'}
          >
            {action.icon}
          </Button>
        ))}
        <div className="flex-grow"></div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={toggleEditMode}
          className="text-xs mr-1"
          disabled={previewMode}
        >
          {editMode === 'visual' ? 'عرض HTML' : 'محرر مرئي'}
        </Button>
        <Button
          type="button"
          variant={previewMode ? "default" : "outline"}
          size="sm"
          onClick={() => setPreviewMode(!previewMode)}
          className="text-xs flex items-center gap-1"
        >
          <Eye className="h-3.5 w-3.5" />
          {previewMode ? "تحرير" : "معاينة"}
        </Button>
      </div>
      
      {previewMode ? (
        <div 
          className="min-h-[200px] border rounded p-3 bg-white overflow-auto" 
          style={{ height: `${rows * 1.5}em` }}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`font-${editMode === 'html' ? 'mono' : 'normal'} text-sm`}
          dir="auto"
          rows={rows}
        />
      )}
    </div>
  );
};

export default RichTextEditor;
