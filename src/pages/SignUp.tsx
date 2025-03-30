
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { User, KeyRound, Mail, ArrowRight } from 'lucide-react';

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

// Validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "الاسم يجب أن يحتوي على الأقل حرفين.",
  }),
  email: z.string().email({
    message: "يرجى إدخال بريد إلكتروني صحيح.",
  }),
  password: z.string().min(6, {
    message: "كلمة المرور يجب أن تحتوي على الأقل 6 أحرف.",
  }),
  confirmPassword: z.string().min(6, {
    message: "تأكيد كلمة المرور يجب أن يحتوي على الأقل 6 أحرف.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

const SignUp = () => {
  const navigate = useNavigate();
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Form submission handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    
    // Mock signup - in a real app, this would call an API
    setTimeout(() => {
      toast.success("تم إنشاء حسابك بنجاح");
      navigate('/signin');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animated-gradient">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <Link to="/" className="mx-auto mb-4 block">
            <img src="/lovable-uploads/3b2734a9-07b7-4ecc-b0cd-eb2671429612.png" alt="بيزنس أكاديمي" className="h-12 mx-auto" />
          </Link>
          <CardTitle className="text-2xl font-bold">إنشاء حساب جديد</CardTitle>
          <CardDescription>
            أدخل بياناتك لإنشاء حساب جديد
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                        <Input 
                          placeholder="محمد أحمد" 
                          className="pr-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                        <Input 
                          placeholder="your.email@example.com" 
                          type="email" 
                          className="pr-10" 
                          {...field} 
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
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تأكيد كلمة المرور</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                        <Input 
                          type="password" 
                          className="pr-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full flex items-center justify-center">
                <span>إنشاء حساب</span>
                <ArrowRight className="mr-2 h-4 w-4" />
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

export default SignUp;
