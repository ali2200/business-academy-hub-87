
import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show the button after scrolling down 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(true); // Always visible, but can be changed to false to hide initially
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    // Set initial visibility
    toggleVisibility();
    
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className={`fixed bottom-8 left-8 z-50 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a 
              href="https://wa.me/201000820752" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all hover:shadow-xl animate-pulse-glow"
              aria-label="تواصل معنا عبر واتساب"
            >
              <div className="relative">
                <MessageSquare className="w-8 h-8 fill-white text-white" />
              </div>
            </a>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-primary text-white">
            <p>تواصل معنا عبر واتساب</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default WhatsAppButton;
