
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface InstructorSettingsProps {
  profile: any;
}

const InstructorSettings: React.FC<InstructorSettingsProps> = ({ profile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  
  const form = useForm({
    defaultValues: {
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      displayName: profile?.display_name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      bio: profile?.bio || '',
      emailNotifications: profile?.email_notifications !== false,
      pushNotifications: profile?.push_notifications !== false,
    }
  });
  
  const securityForm = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });
  
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Update profile information
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          display_name: data.displayName,
          phone: data.phone,
          bio: data.bio,
          email_notifications: data.emailNotifications,
          push_notifications: data.pushNotifications,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);
      
      if (error) {
        throw error;
      }
      
      // Upload avatar if changed
      if (avatar) {
        const fileExt = avatar.name.split('.').pop();
        const fileName = `${profile.id}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(filePath, avatar, {
            upsert: true,
          });
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('profiles')
          .getPublicUrl(filePath);
        
        // Update profile with avatar URL
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            avatar_url: urlData.publicUrl,
          })
          .eq('id', profile.id);
        
        if (updateError) {
          throw updateError;
        }
      }
      
      toast.success('تم تحديث بيانات الحساب بنجاح');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('حدث خطأ أثناء تحديث بيانات الحساب');
    } finally {
      setIsLoading(false);
    }
  };
  
  const onSecuritySubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (data.newPassword !== data.confirmPassword) {
        toast.error('كلمة المرور الجديدة لا تطابق تأكيد كلمة المرور');
        return;
      }
      
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (error) {
        throw error;
      }
      
      securityForm.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      toast.success('تم تحديث كلمة المرور بنجاح');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('حدث خطأ أثناء تحديث كلمة المرور');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">إعدادات الحساب</h2>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
          <TabsTrigger value="security">الأمان</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Photo */}
            <Card>
              <CardHeader>
                <CardTitle>الصورة الشخصية</CardTitle>
                <CardDescription>صورتك الشخصية التي ستظهر للطلاب</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage 
                      src={avatar ? URL.createObjectURL(avatar) : profile?.avatar_url} 
                      alt={profile?.display_name || "المحاضر"} 
                    />
                    <AvatarFallback className="text-xl">
                      {profile?.display_name?.charAt(0) || "م"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex items-center justify-center">
                  <Input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    asChild
                  >
                    <label htmlFor="avatar">تغيير الصورة</label>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Profile Information */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>المعلومات الشخصية</CardTitle>
                <CardDescription>تحديث المعلومات الشخصية الخاصة بك</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الاسم الأول</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل الاسم الأول" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الاسم الأخير</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل الاسم الأخير" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم العرض</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل اسم العرض" {...field} />
                          </FormControl>
                          <FormDescription>
                            هذا هو الاسم الذي سيظهر للطلاب
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>البريد الإلكتروني</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="أدخل البريد الإلكتروني" 
                                {...field} 
                                disabled 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>رقم الهاتف</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل رقم الهاتف" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نبذة تعريفية</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="اكتب نبذة تعريفية عن نفسك..."
                              className="min-h-32"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            ستظهر هذه النبذة في صفحات الدورات التي تقدمها
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>تغيير كلمة المرور</CardTitle>
              <CardDescription>تحديث كلمة المرور الخاصة بك</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                  <FormField
                    control={securityForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>كلمة المرور الحالية</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="أدخل كلمة المرور الحالية" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={securityForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>كلمة المرور الجديدة</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="أدخل كلمة المرور الجديدة" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={securityForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>تأكيد كلمة المرور</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="أدخل كلمة المرور مرة أخرى" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'جاري الحفظ...' : 'تحديث كلمة المرور'}
                    </Button>
                  </div>
                </form>
              </Form>
              
              <Separator className="my-8" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">جلسات تسجيل الدخول</h3>
                <p className="text-sm text-gray-500">
                  إدارة جلسات تسجيل الدخول الخاصة بك على الأجهزة المختلفة
                </p>
                
                <Button variant="destructive">تسجيل الخروج من جميع الأجهزة</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
              <CardDescription>
                تخصيص كيف ومتى تتلقى الإشعارات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">الإشعارات العامة</h3>
                    
                    <FormField
                      control={form.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              إشعارات البريد الإلكتروني
                            </FormLabel>
                            <FormDescription>
                              استلام إشعارات عبر البريد الإلكتروني
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="pushNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              الإشعارات الفورية
                            </FormLabel>
                            <FormDescription>
                              استلام إشعارات فورية على المنصة
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InstructorSettings;
