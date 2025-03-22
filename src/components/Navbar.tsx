
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogIn, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

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
          ? 'py-2 bg-white/10 backdrop-blur-md shadow-md' 
          : 'py-3 lg:py-5 bg-white/5 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center animate-fade-in">
          <img src="/lovable-uploads/4307c383-57c5-4d42-abdc-1344087ec7a6.png" alt="عـــلى بتاع الـبيزنس" className="h-10 md:h-12" />
        </Link>

        {/* Desktop Navigation - Centered with Border Frame */}
        <div className="hidden md:flex justify-center flex-1">
          <div className="border-2 border-white/50 rounded-full px-6 py-1 bg-white/10 backdrop-blur-sm shadow-sm">
            <NavigationMenu className="mx-auto">
              <NavigationMenuList className="font-hacen flex-row-reverse"> {/* RTL order */}
                <NavLinks isActive={isActive} />
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center space-x-3 rtl:space-x-reverse">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20 hover:text-primary"
            aria-label="سلة التسوق"
          >
            <ShoppingCart size={20} />
          </Button>
          
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button variant="outline" className="flex items-center gap-2 text-white border-white/50 bg-white/10 hover:bg-primary hover:text-white hover:border-primary">
                <User size={18} />
                <span>حسابي</span>
              </Button>
            </Link>
          ) : (
            <Link to="/signin">
              <Button variant="outline" className="flex items-center gap-2 text-white border-white/50 bg-white/10 hover:bg-primary hover:text-white hover:border-primary rounded-full px-6">
                <span className="font-hacen">تسجيل الدخول</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center mobile-menu-button">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:bg-white/20"
            aria-label={isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed inset-0 bg-primary/80 backdrop-blur-md z-50 transition-transform duration-300 ease-in-out mobile-menu-container overflow-y-auto pt-20 ${
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
      <div className={`${isMobile ? 'flex flex-col space-y-5 w-full' : 'flex flex-row space-x-6 rtl:space-x-reverse items-center'}`}>
        {links.map((link, index) => (
          isMobile ? (
            <Link
              key={link.path}
              to={link.path}
              className={`${
                isActive(link.path) 
                  ? 'text-primary font-bold bg-white/90 rounded-md' 
                  : 'text-white hover:text-primary hover:bg-white/20 rounded-md'
              } text-xl py-3 block w-full text-center border-b border-white/20 font-hacen transition-all duration-300 animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={onClick}
            >
              {link.label}
            </Link>
          ) : (
            <NavigationMenuItem key={link.path}>
              <Link
                to={link.path}
                className={`${
                  isActive(link.path) 
                    ? 'text-primary bg-white/90 font-bold' 
                    : 'text-primary hover:text-primary/80 hover:bg-white/20'
                } font-hacen px-4 py-2 transition-all duration-300 text-base rounded-md`}
                onClick={onClick}
              >
                {link.label}
              </Link>
            </NavigationMenuItem>
          )
        ))}
      </div>

      {isMobile && (
        <div className="flex flex-col mt-6 space-y-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mx-auto text-white hover:bg-white/20 hover:text-primary"
            aria-label="سلة التسوق"
          >
            <ShoppingCart size={20} />
          </Button>
          
          {isAuthenticated ? (
            <Link 
              to="/dashboard" 
              className="w-full"
              onClick={onClick}
            >
              <Button variant="outline" className="flex items-center w-full justify-center gap-2 text-white border-white/50 bg-white/10 hover:bg-primary hover:text-white hover:border-primary">
                <User size={18} />
                <span className="font-hacen">حسابي</span>
              </Button>
            </Link>
          ) : (
            <Link 
              to="/signin" 
              className="w-full"
              onClick={onClick}
            >
              <Button variant="outline" className="flex items-center w-full justify-center gap-2 text-white border-white/50 bg-white/10 hover:bg-primary hover:text-white hover:border-primary rounded-full">
                <span className="font-hacen">تسجيل الدخول</span>
              </Button>
            </Link>
          )}
          
          <Link 
            to="https://wa.me/201000820752" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-white font-hacen py-3 w-full border border-white/30 bg-white/10 rounded-md mt-4 hover:bg-primary/20 hover:border-primary/40 transition-all"
            onClick={onClick}
          >
            <MessageSquare size={18} strokeWidth={1.5} className="fill-primary" />
            <span>تواصل معنا على واتساب</span>
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;
