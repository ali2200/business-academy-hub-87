import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogIn, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetClose, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
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
  return <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'py-2 bg-white/10 backdrop-blur-md shadow-md' : 'py-3 lg:py-5 bg-white/5 backdrop-blur-sm'}`}>
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
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-primary" aria-label="سلة التسوق">
            <ShoppingCart size={20} />
          </Button>
          
          {isAuthenticated ? <Link to="/dashboard">
              <Button variant="outline" className="flex items-center gap-2 text-white border-white/50 bg-white/10 hover:bg-primary hover:text-white hover:border-primary">
                <User size={18} />
                <span>حسابي</span>
              </Button>
            </Link> : <div className="flex overflow-hidden rounded-full shadow-md">
              <Link to="/signin" className="group">
                <div className="bg-primary hover:bg-white text-white hover:text-primary transition-all duration-300 px-4 py-2 rounded-r-full font-hacen flex items-center">
                  <span className="group-hover:font-semibold">تسجيل الدخول</span>
                </div>
              </Link>
              <Link to="/signup" className="group">
                <div className="bg-white hover:bg-primary text-primary hover:text-white transition-all duration-300 px-4 py-2 rounded-l-full font-hacen flex items-center">
                  <span className="group-hover:font-semibold">إنشاء حساب</span>
                </div>
              </Link>
            </div>}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="فتح القائمة" className="bg-primary-light text-slate-50 rounded-2xl">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs p-0 bg-primary/95 backdrop-blur-xl border-none">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-white/10">
                  <div className="flex justify-between items-center">
                    <img src="/lovable-uploads/4307c383-57c5-4d42-abdc-1344087ec7a6.png" alt="عـــلى بتاع الـبيزنس" className="h-10" />
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <X size={24} />
                      </Button>
                    </SheetClose>
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto p-4">
                  <MobileNavLinks isActive={isActive} />
                </div>
                
                <div className="p-4 border-t border-white/10">
                  <Link to="https://wa.me/201000820752" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-white font-hacen py-3 w-full border border-white/30 bg-white/10 rounded-md hover:bg-primary/20 hover:border-primary/40 transition-all">
                    <MessageSquare size={18} strokeWidth={1.5} className="fill-primary" />
                    <span>تواصل معنا على واتساب</span>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>;
};
type NavLinksProps = {
  isActive: (path: string) => boolean;
  onClick?: () => void;
};
const NavLinks = ({
  isActive,
  onClick
}: NavLinksProps) => {
  const links = [{
    path: '/',
    label: 'الرئيسية'
  }, {
    path: '/courses',
    label: 'الدورات'
  }, {
    path: '/books',
    label: 'الكتب'
  }, {
    path: '/articles',
    label: 'المقالات'
  }, {
    path: '/contact',
    label: 'اتصل بنا'
  }];
  return <>
      {links.map(link => <NavigationMenuItem key={link.path}>
          <Link to={link.path} className={`${isActive(link.path) ? 'text-primary bg-white/90 font-bold' : 'text-primary hover:text-primary/80 hover:bg-white/20'} font-hacen px-4 py-2 transition-all duration-300 text-base rounded-md`} onClick={onClick}>
            {link.label}
          </Link>
        </NavigationMenuItem>)}
    </>;
};
const MobileNavLinks = ({
  isActive
}: NavLinksProps) => {
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
  const links = [{
    path: '/',
    label: 'الرئيسية'
  }, {
    path: '/courses',
    label: 'الدورات'
  }, {
    path: '/books',
    label: 'الكتب'
  }, {
    path: '/articles',
    label: 'المقالات'
  }, {
    path: '/contact',
    label: 'اتصل بنا'
  }];
  return <div className="flex flex-col space-y-4">
      {/* Main Navigation Links */}
      <div className="space-y-2">
        {links.map(link => <SheetClose asChild key={link.path}>
            <Link to={link.path} className={`${isActive(link.path) ? 'bg-white text-primary font-bold' : 'text-white hover:bg-white/10'} block w-full text-right py-3 px-4 rounded-lg font-hacen text-lg transition-all`}>
              {link.label}
            </Link>
          </SheetClose>)}
      </div>
      
      <div className="border-t border-white/10 pt-4 mt-4">
        {/* Account Actions */}
        {isAuthenticated ? <SheetClose asChild>
            <Link to="/dashboard" className="block w-full">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 text-white border-white/50 bg-white/10 hover:bg-white hover:text-primary">
                <User size={18} />
                <span className="font-hacen">حسابي</span>
              </Button>
            </Link>
          </SheetClose> : <div className="flex flex-col space-y-2">
            <SheetClose asChild>
              <Link to="/signin" className="block w-full">
                <Button className="w-full bg-white text-primary hover:bg-white/90">
                  <span className="font-hacen">تسجيل الدخول</span>
                </Button>
              </Link>
            </SheetClose>
            
            <SheetClose asChild>
              <Link to="/signup" className="block w-full">
                <Button variant="outline" className="w-full text-white border-white hover:bg-white hover:text-primary">
                  <span className="font-hacen text-[#1c033d]">إنشاء حساب</span>
                </Button>
              </Link>
            </SheetClose>
          </div>}
        
        {/* Shopping Cart */}
        <SheetClose asChild>
          <Link to="/cart" className="flex items-center gap-2 text-white p-4 mt-4 hover:bg-white/10 rounded-lg transition-all">
            <ShoppingCart size={20} />
            <span className="font-hacen">سلة التسوق</span>
          </Link>
        </SheetClose>
      </div>
    </div>;
};
export default Navbar;