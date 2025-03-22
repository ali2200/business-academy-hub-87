
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogIn, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Check for user authentication
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setIsAuthenticated(user.isAuthenticated);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    // Close mobile menu when changing routes
    setIsMobileMenuOpen(false);

    checkAuth();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container') && !target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close mobile menu when clicking on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'py-2 bg-white/90 backdrop-blur-md shadow-md' 
          : 'py-3 lg:py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center animate-fade-in">
          <img src="/lovable-uploads/4307c383-57c5-4d42-abdc-1344087ec7a6.png" alt="عـــلى بتاع الـبيزنس" className="h-10 md:h-12" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1 rtl:space-x-reverse items-center">
          <NavLinks isActive={isActive} />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center mobile-menu-button">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-primary"
            aria-label={isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed inset-0 bg-white/95 backdrop-blur-sm z-50 transition-transform duration-300 ease-in-out mobile-menu-container overflow-y-auto pt-20 ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-6">
          <NavLinks isActive={isActive} onClick={() => setIsMobileMenuOpen(false)} isMobile />
        </div>
      </div>
    </header>
  );
};

type NavLinksProps = {
  isActive: (path: string) => boolean;
  onClick?: () => void;
  isMobile?: boolean;
};

const NavLinks = ({ isActive, onClick, isMobile = false }: NavLinksProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check for user authentication
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setIsAuthenticated(user.isAuthenticated);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setIsAuthenticated(false);
      }
    }
  }, []);
  
  const links = [
    { path: '/', label: 'الرئيسية' },
    { path: '/courses', label: 'الدورات' },
    { path: '/books', label: 'الكتب' },
    { path: '/articles', label: 'المقالات' },
    { path: '/contact', label: 'اتصل بنا' },
  ];

  return (
    <>
      <div className={`${isMobile ? 'flex flex-col space-y-5 w-full' : 'flex flex-row space-x-2 rtl:space-x-reverse items-center'}`}>
        {links.map((link, index) => (
          <Link
            key={link.path}
            to={link.path}
            className={`${
              isActive(link.path) 
                ? 'text-primary font-bold after:w-full' 
                : 'text-gray-800 hover:text-primary'
            } ${isMobile 
                ? 'text-xl py-3 block w-full text-center border-b border-gray-100' 
                : 'text-base mx-3 py-2 relative after:absolute after:bottom-0 after:right-0 after:h-0.5 after:bg-primary after:transition-all'
              } transition-all duration-300 animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={onClick}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className={`flex ${isMobile ? 'flex-col mt-6 space-y-4' : 'items-center space-x-3 rtl:space-x-reverse'}`}>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`animate-fade-in ${isMobile ? 'mx-auto' : ''} text-primary hover:text-primary-light`}
          style={{ animationDelay: `${links.length * 0.1}s` }}
          aria-label="سلة التسوق"
        >
          <ShoppingCart size={20} />
        </Button>
        
        {isAuthenticated ? (
          <Link 
            to="/dashboard" 
            className={`animate-fade-in ${isMobile ? 'w-full' : ''}`}
            style={{ animationDelay: `${(links.length + 1) * 0.1}s` }}
            onClick={onClick}
          >
            <Button variant="outline" className={`flex items-center ${isMobile ? 'w-full justify-center' : ''} gap-2`}>
              <User size={18} />
              <span>حسابي</span>
            </Button>
          </Link>
        ) : (
          <Link 
            to="/signin" 
            className={`animate-fade-in ${isMobile ? 'w-full' : ''}`}
            style={{ animationDelay: `${(links.length + 1) * 0.1}s` }}
            onClick={onClick}
          >
            <Button variant="outline" className={`flex items-center ${isMobile ? 'w-full justify-center' : ''} gap-2`}>
              <LogIn size={18} />
              <span>تسجيل الدخول</span>
            </Button>
          </Link>
        )}
        
        {isMobile && (
          <Link 
            to="https://wa.me/201000820752" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-primary font-medium py-3 w-full border rounded-md mt-4"
            onClick={onClick}
          >
            <MessageSquare size={18} strokeWidth={1.5} className="fill-primary" />
            <span>تواصل معنا على واتساب</span>
          </Link>
        )}
      </div>
    </>
  );
};

export default Navbar;
