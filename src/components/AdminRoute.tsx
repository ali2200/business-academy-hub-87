
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No active session found");
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }
        
        console.log("Active session found for user:", session.user.id);
        
        // Check if user is admin
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }
        
        console.log("Admin status:", data?.is_admin);
        setIsAdmin(!!data?.is_admin);
      } catch (err) {
        console.error("Unexpected error in AdminRoute:", err);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, []);

  if (isLoading) {
    // Show loading state
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-gray-600">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }
  
  if (!isAdmin) {
    toast.error("ليس لديك صلاحية للوصول إلى هذه الصفحة");
    return <Navigate to="/admin-signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
