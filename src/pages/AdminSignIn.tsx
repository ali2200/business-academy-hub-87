
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
  const [isConfirmingEmail, setIsConfirmingEmail] = useState(false);
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    // Prefill admin email
    form.setValue('email', 'ali@ali.com');
  }, [form]);

  // Function to confirm admin email automatically
  const confirmAdminEmail = async () => {
    try {
      setIsConfirmingEmail(true);
      toast.info("جاري تأكيد البريد الإلكتروني للمدير...");

      // First try to sign in to get the user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'ali@ali.com',
        password: '016513066',
      });
      
      // If we can sign in, that means the email is already confirmed
      if (!signInError && signInData.user) {
        toast.success("تم تأكيد البريد الإلكتروني بنجاح");
        setIsConfirmingEmail(false);
        return;
      }

      // Try a direct approach - this won't work for regular users but we can try
      if (signInError && signInError.message?.includes("Email not confirmed")) {
        // Attempt to sign up again with the same credentials
        // This is a workaround that sometimes works
        const { error: signUpError } = await supabase.auth.signUp({
          email: 'ali@ali.com',
          password: '016513066',
          options: {
            emailRedirectTo: window.location.origin + '/admin-dashboard',
          }
        });
        
        if (!signUpError) {
          toast.info("تم إرسال رابط التأكيد. يرجى تأكيد البريد الإلكتروني");
        } else {
          console.error("خطأ في إعادة تسجيل المستخدم:", signUpError);
        }
        
        toast.info("قم بالاتصال بمسؤول قاعدة البيانات لتأكيد البريد الإلكتروني من لوحة تحكم Supabase");
      }
    } catch (err) {
      console.error("خطأ في تأكيد البريد الإلكتروني:", err);
    } finally {
      setIsConfirmingEmail(false);
    }
  };

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
        // If the error is about email confirmation, offer to auto-confirm for admin
        if (error.message?.includes("Email not confirmed") && values.email === 'ali@ali.com') {
          toast.error("البريد الإلكتروني غير مؤكد. سيتم محاولة تأكيده تلقائياً.");
          await confirmAdminEmail();
          return;
        }
        
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
      
      // If not an admin, show error and sign out
      if (!profileData?.is_admin) {
        toast.error("ليس لديك صلاحية الدخول كمسؤول");
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
            <img src="/lovable-uploads/4307c383-57c5-4d42-abdc-1344087ec7a6.png" alt="بيزنس أكاديمي" className="h-12 mx-auto" />
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
                          placeholder="admin@example.com" 
                          type="email" 
                          className="pl-10" 
                          {...field} 
                          disabled={isLoading || isConfirmingEmail}
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
                          disabled={isLoading || isConfirmingEmail}
                        />
                        <KeyRound className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full flex items-center justify-center bg-primary"
                disabled={isLoading || isConfirmingEmail}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>تسجيل دخول المسؤول</span>
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </>
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="link"
                className="w-full mt-1 text-amber-600 hover:text-amber-800"
                disabled={isLoading || isConfirmingEmail}
                onClick={confirmAdminEmail}
              >
                {isConfirmingEmail ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span>تأكيد البريد الإلكتروني للمدير</span>
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
