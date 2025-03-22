
import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-lg">
        <div className="relative mb-6 mx-auto w-32 h-32 animate-float">
          <div className="absolute inset-0 bg-secondary/30 rounded-full blur-2xl"></div>
          <div className="relative bg-white rounded-full w-full h-full flex items-center justify-center border-4 border-primary shadow-lg">
            <span className="text-5xl font-bold text-primary">404</span>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">الصفحة غير موجودة</h1>
        <p className="text-gray-600 mb-8">
          عذرًا، الصفحة التي تبحث عنها غير موجودة أو تم نقلها أو حذفها.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary-light flex items-center justify-center gap-2">
              <Home size={18} />
              <span>العودة للرئيسية</span>
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={18} />
            <span>الرجوع للصفحة السابقة</span>
          </Button>
        </div>
        
        <p className="mt-8 text-sm text-gray-500">
          إذا كنت تعتقد أن هناك خطأ، يرجى <Link to="/contact" className="text-secondary hover:underline">الاتصال بنا</Link>.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
