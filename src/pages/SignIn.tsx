
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { User, KeyRound, ArrowRight, Loader2 } from 'lucide-react';

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

// Validation schema
const formSchema = z.object({
  email: z.string().email({
    message: "يرجى إدخال بريد إلكتروني صحيح.",
  }),
  password: z.string().min(6, {
    message: "كلمة المرور يجب أن تحتوي على الأقل 6 أحرف.",
  }),
});

const SignIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
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
      
      // Login with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        toast.error(error.message || "حدث خطأ أثناء تسجيل الدخول");
        console.error("خطأ في تسجيل الدخول:", error);
        return;
      }
      
      // Check if user is admin
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        toast.error("حدث خطأ أثناء التحقق من صلاحيات المستخدم");
        console.error("خطأ في جلب بيانات المستخدم:", profileError);
        return;
      }
      
      // Store user info in localStorage 
      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        isAdmin: profileData?.is_admin || false,
        isAuthenticated: true
      }));
      
      // Redirect based on user role
      if (profileData?.is_admin) {
        toast.success("تم تسجيل الدخول كمسؤول بنجاح");
        navigate('/admin-dashboard');
      } else {
        toast.success("تم تسجيل الدخول بنجاح");
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("خطأ غير متوقع:", err);
      toast.error("حدث خطأ غير متوقع أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animated-gradient">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <Link to="/" className="mx-auto mb-4 block">
            <img src="/images/logo.svg" alt="بيزنس أكاديمي" className="h-12 mx-auto" />
          </Link>
          <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
          <CardDescription>
            أدخل بياناتك للوصول إلى حسابك
          </CardDescription>
        </CardHeader>
        
        <CardContent>
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
                        <Input 
                          placeholder="your.email@example.com" 
                          type="email" 
                          className="pl-10" 
                          {...field} 
                          disabled={isLoading}
                        />
                        <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
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
                        <Input 
                          type="password" 
                          className="pl-10" 
                          {...field} 
                          disabled={isLoading}
                        />
                        <KeyRound className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-600">
                    تذكرني
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="#" className="font-medium text-primary hover:text-secondary">
                    نسيت كلمة المرور؟
                  </Link>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>تسجيل الدخول</span>
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex justify-center border-t p-6">
          <div className="flex overflow-hidden rounded-full shadow-md w-full max-w-xs">
            <Link to="/signin" className="w-1/2 group">
              <div className="bg-primary hover:bg-white text-white hover:text-primary transition-all duration-300 py-2 text-center rounded-r-full font-hacen flex items-center justify-center">
                <span className="group-hover:font-semibold">تسجيل الدخول</span>
              </div>
            </Link>
            <Link to="/signup" className="w-1/2 group">
              <div className="bg-white hover:bg-primary text-primary hover:text-white transition-all duration-300 py-2 text-center rounded-l-full font-hacen flex items-center justify-center">
                <span className="group-hover:font-semibold">إنشاء حساب</span>
              </div>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
