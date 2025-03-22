
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

    checkAuth();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-white/90 backdrop-blur-md shadow-md' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center animate-fade-in">
          <img src="/images/logo.svg" alt="بيزنس أكاديمي" className="h-10" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1 rtl:space-x-reverse items-center">
          <NavLinks isActive={isActive} />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-primary"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
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
      {links.map((link, index) => (
        <Link
          key={link.path}
          to={link.path}
          className={`${
            isActive(link.path) ? 'nav-link-active' : 'nav-link'
          } text-lg mx-2 py-2 ${isMobile ? 'block' : 'inline-block'} animate-fade-in`}
          style={{ animationDelay: `${index * 0.1}s` }}
          onClick={onClick}
        >
          {link.label}
        </Link>
      ))}
      <div className="flex items-center space-x-2 rtl:space-x-reverse mr-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="animate-fade-in text-primary hover:text-secondary"
          style={{ animationDelay: `${links.length * 0.1}s` }}
        >
          <ShoppingCart size={20} />
        </Button>
        
        {isAuthenticated ? (
          <Link 
            to="/dashboard" 
            className="animate-fade-in"
            style={{ animationDelay: `${(links.length + 1) * 0.1}s` }}
          >
            <Button variant="outline" className="flex items-center space-x-2 rtl:space-x-reverse">
              <User size={18} />
              <span>حسابي</span>
            </Button>
          </Link>
        ) : (
          <Link 
            to="/signin" 
            className="animate-fade-in"
            style={{ animationDelay: `${(links.length + 1) * 0.1}s` }}
          >
            <Button variant="outline" className="flex items-center space-x-2 rtl:space-x-reverse">
              <LogIn size={18} />
              <span>تسجيل الدخول</span>
            </Button>
          </Link>
        )}
      </div>
    </>
  );
};

export default Navbar;
