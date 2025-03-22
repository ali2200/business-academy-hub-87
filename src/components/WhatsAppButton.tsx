
import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from '@/hooks/use-mobile';

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const toggleVisibility = () => {
      // Show the button after scrolling down 100px or immediately on mobile
      if (window.pageYOffset > 100 || isMobile) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    // Set initial visibility
    toggleVisibility();
    
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [isMobile]);

  return (
    <div className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-8 right-8'} z-50 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a 
              href="https://wa.me/201000820752" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary-light transition-all hover:shadow-xl animate-pulse-glow"
              aria-label="تواصل معنا عبر واتساب"
            >
              <div className="relative">
                <MessageSquare className="w-6 h-6 fill-white" strokeWidth={1.5} />
              </div>
            </a>
          </TooltipTrigger>
          <TooltipContent side={isMobile ? "left" : "right"} className="bg-primary text-white">
            <p>تواصل معنا عبر واتساب</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default WhatsAppButton;
