
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, LogOut, Lock, Eye, EyeOff, User, Mail, Phone } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';

const profileFormSchema = z.object({
  displayName: z.string().min(2, {
    message: "الاسم يجب أن يكون على الأقل حرفين.",
  }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email({
    message: "يرجى إدخال بريد إلكتروني صحيح.",
  }).optional(),
  phone: z.string().optional(),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "كلمة المرور يجب أن تكون على الأقل 6 أحرف.",
  }),
  newPassword: z.string().min(6, {
    message: "كلمة المرور الجديدة يجب أن تكون على الأقل 6 أحرف.",
  }),
  confirmPassword: z.string().min(6, {
    message: "تأكيد كلمة المرور يجب أن يكون على الأقل 6 أحرف.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [createdAt, setCreatedAt] = useState<string>('');

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get current auth session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast.error("يجب تسجيل الدخول للوصول إلى ملفك الشخصي");
          navigate('/signin');
          return;
        }
        
        // Store user data
        setUser(session.user);
        
        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          toast.error("حدث خطأ أثناء جلب بيانات الملف الشخصي");
          return;
        }
        
        setProfile(profileData);
        
        // Format created_at date
        if (profileData.created_at) {
          try {
            // Parse the ISO date string and format it
            const date = new Date(profileData.created_at);
            setCreatedAt(format(date, 'yyyy-MM-dd'));
          } catch (error) {
            console.error("Error formatting date:", error);
            setCreatedAt('غير معروف');
          }
        }
        
        // Set form values
        profileForm.reset({
          displayName: profileData.display_name || "",
          firstName: profileData.first_name || "",
          lastName: profileData.last_name || "",
          email: session.user.email || "",
          phone: profileData.phone || "",
        });
        
      } catch (error) {
        console.error("Error in fetchUserData:", error);
        toast.error("حدث خطأ أثناء جلب بيانات المستخدم");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, profileForm]);

  const onProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      setSavingProfile(true);
      
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: values.displayName,
          first_name: values.firstName,
          last_name: values.lastName,
          phone: values.phone,
        })
        .eq('id', user.id);
      
      if (error) {
        console.error("Error updating profile:", error);
        toast.error("حدث خطأ أثناء تحديث الملف الشخصي");
        return;
      }
      
      toast.success("تم تحديث الملف الشخصي بنجاح");
    } catch (error) {
      console.error("Error in onProfileSubmit:", error);
      toast.error("حدث خطأ غير متوقع أثناء تحديث الملف الشخصي");
    } finally {
      setSavingProfile(false);
    }
  };

  const onPasswordSubmit = async (values: z.infer<typeof passwordFormSchema>) => {
    try {
      setSavingPassword(true);
      
      // First verify current password by signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: values.currentPassword,
      });
      
      if (signInError) {
        toast.error("كلمة المرور الحالية غير صحيحة");
        return;
      }
      
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword,
      });
      
      if (error) {
        console.error("Error updating password:", error);
        toast.error("حدث خطأ أثناء تحديث كلمة المرور");
        return;
      }
      
      // Reset password form
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      toast.success("تم تحديث كلمة المرور بنجاح");
    } catch (error) {
      console.error("Error in onPasswordSubmit:", error);
      toast.error("حدث خطأ غير متوقع أثناء تحديث كلمة المرور");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('user');
      toast.success("تم تسجيل الخروج بنجاح");
      navigate('/signin');
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-gray-600">جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">الملف الشخصي</h1>
            <p className="text-gray-600">إدارة بيانات حسابك الشخصي</p>
          </div>
          <Button
            variant="ghost"
            className="flex items-center"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة للوحة التحكم
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Info */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>المعلومات الشخصية</CardTitle>
              <CardDescription>تحديث البيانات الشخصية لحسابك</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">الاسم الأول</Label>
                      <div className="relative">
                        <Input
                          id="firstName"
                          placeholder="الاسم الأول"
                          className="pl-10"
                          {...profileForm.register("firstName")}
                        />
                        <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">اسم العائلة</Label>
                      <div className="relative">
                        <Input
                          id="lastName"
                          placeholder="اسم العائلة"
                          className="pl-10"
                          {...profileForm.register("lastName")}
                        />
                        <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="displayName">اسم العرض</Label>
                    <div className="relative">
                      <Input
                        id="displayName"
                        placeholder="الاسم الذي سيظهر للآخرين"
                        className="pl-10"
                        {...profileForm.register("displayName")}
                      />
                      <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    {profileForm.formState.errors.displayName && (
                      <p className="text-red-500 text-sm">{profileForm.formState.errors.displayName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        placeholder="البريد الإلكتروني"
                        className="pl-10 bg-gray-50"
                        readOnly
                        disabled
                        {...profileForm.register("email")}
                      />
                      <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500">لا يمكن تغيير البريد الإلكتروني</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        placeholder="رقم الهاتف"
                        className="pl-10"
                        {...profileForm.register("phone")}
                      />
                      <Phone className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={savingProfile}
                  >
                    {savingProfile ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        جاري الحفظ...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Save className="ml-2 h-4 w-4" />
                        حفظ التغييرات
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات الحساب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">نوع الحساب</p>
                    <p className="text-base font-medium">
                      {profile?.is_admin ? "مسؤول" : "مستخدم عادي"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">تاريخ الإنشاء</p>
                    <p className="text-base font-medium">{createdAt}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-6">
                <Button 
                  variant="destructive" 
                  className="w-full flex items-center justify-center"
                  onClick={handleLogout}
                >
                  <LogOut className="ml-2 h-4 w-4" />
                  تسجيل الخروج
                </Button>
              </CardFooter>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle>تغيير كلمة المرور</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          className="pl-10"
                          {...passwordForm.register("currentPassword")}
                        />
                        <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                        <button
                          type="button"
                          className="absolute left-3 top-2.5 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="text-red-500 text-sm">{passwordForm.formState.errors.currentPassword.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          className="pl-10"
                          {...passwordForm.register("newPassword")}
                        />
                        <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                        <button
                          type="button"
                          className="absolute left-3 top-2.5 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {passwordForm.formState.errors.newPassword && (
                        <p className="text-red-500 text-sm">{passwordForm.formState.errors.newPassword.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          className="pl-10"
                          {...passwordForm.register("confirmPassword")}
                        />
                        <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                        <button
                          type="button"
                          className="absolute left-3 top-2.5 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="text-red-500 text-sm">{passwordForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={savingPassword}
                    >
                      {savingPassword ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          جاري الحفظ...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Save className="ml-2 h-4 w-4" />
                          تحديث كلمة المرور
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
