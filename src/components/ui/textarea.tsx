
import * as React from "react"
import { useImperativeHandle, useRef, useEffect } from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoSize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoSize, onChange, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    // Auto resize functionality
    const resizeTextarea = () => {
      if (autoSize && textareaRef.current) {
        // Reset height to calculate accurate scrollHeight
        textareaRef.current.style.height = 'auto';
        // Set new height based on scrollHeight
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      }
    };

    // Run resize on input change
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) onChange(e);
      if (autoSize) resizeTextarea();
    };

    // Initial resize on component mount and when content changes externally
    useEffect(() => {
      if (autoSize) resizeTextarea();
    }, [autoSize, props.value, props.defaultValue]);
    
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={textareaRef}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
