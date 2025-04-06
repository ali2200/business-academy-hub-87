
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { User, KeyRound, ArrowRight, Loader2, ShieldAlert } from 'lucide-react';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Validation schema
const formSchema = z.object({
  email: z.string().email({
    message: "يرجى إدخال بريد إلكتروني صحيح.",
  }),
  password: z.string().min(6, {
    message: "كلمة المرور يجب أن تحتوي على الأقل 6 أحرف.",
  }),
});

const AdminSignIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Check if already authenticated
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Check if user is admin
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (profileData?.is_admin) {
            navigate('/admin-dashboard');
          }
        }
      } catch (err) {
        console.error("Session check error:", err);
      }
    };
    
    checkSession();
  }, [navigate]);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setError("");
      
      console.log("Attempting to sign in with:", values.email);
      
      // Login with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (signInError) {
        console.error("Login error:", signInError);
        setError(signInError.message || "فشل تسجيل الدخول، تأكد من صحة البيانات");
        return;
      }

      // Success - now check if user is admin
      if (data && data.user) {
        console.log("User authenticated:", data.user.id);
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', data.user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          setError("حدث خطأ أثناء التحقق من صلاحيات المستخدم");
          await supabase.auth.signOut();
          return;
        }
        
        console.log("Profile data:", profileData);
        
        // If not an admin, show error and sign out
        if (!profileData?.is_admin) {
          setError("ليس لديك صلاحية الدخول كمسؤول");
          await supabase.auth.signOut();
          return;
        }
        
        // Store user info in localStorage 
        localStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          isAdmin: profileData?.is_admin || false,
          isAuthenticated: true
        }));
        
        // Redirect to admin dashboard
        toast.success("تم تسجيل الدخول كمسؤول بنجاح");
        navigate('/admin-dashboard');
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("حدث خطأ غير متوقع أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animated-gradient">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <Link to="/" className="mx-auto mb-4 block">
            <img src="/lovable-uploads/3b2734a9-07b7-4ecc-b0cd-eb2671429612.png" alt="بيزنس أكاديمي" className="h-12 mx-auto" />
          </Link>
          <CardTitle className="text-2xl font-bold">تسجيل دخول المسؤول</CardTitle>
          <CardDescription>
            أدخل بيانات حساب المسؤول للوصول إلى لوحة التحكم
          </CardDescription>
          <div className="flex justify-center">
            <div className="bg-amber-50 border border-amber-300 text-amber-800 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <ShieldAlert size={16} />
              <span>هذه الصفحة مخصصة للمسؤولين فقط</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>خطأ</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                        <Input 
                          placeholder="admin@example.com" 
                          type="email" 
                          className="pr-10" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                        <Input 
                          type="password" 
                          className="pr-10" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full flex items-center justify-center bg-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>تسجيل دخول</span>
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex justify-center border-t p-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">هل أنت مستخدم عادي؟</p>
            <Link to="/signin" className="text-primary hover:text-primary/80 font-medium">
              تسجيل الدخول للمستخدمين
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminSignIn;
