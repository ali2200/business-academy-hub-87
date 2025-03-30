
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, UploadCloud, Save, ArrowRight, Key, Mail, User as UserIcon, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const UserProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  
  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  // Password update states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast.error("يجب تسجيل الدخول للوصول إلى صفحة الملف الشخصي");
          navigate('/signin');
          return;
        }
        
        setUser(session.user);
        
        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          toast.error("حدث خطأ أثناء تحميل بيانات الملف الشخصي");
          return;
        }
        
        setProfile(profileData);
        
        // Set form values
        setFirstName(profileData?.first_name || '');
        setLastName(profileData?.last_name || '');
        setDisplayName(profileData?.display_name || '');
        setPhone(profileData?.phone || '');
        setAvatarUrl(profileData?.avatar_url || '');
        
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("حدث خطأ غير متوقع");
      } finally {
        setLoading(false);
      }
    };
    
    getProfile();
  }, [navigate]);
  
  const handleProfileUpdate = async () => {
    try {
      setUpdating(true);
      
      // Upload avatar if selected
      let finalAvatarUrl = avatarUrl;
      
      if (avatarFile) {
        // First check if avatars bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        
        const avatarsBucketExists = buckets?.some(bucket => bucket.id === 'avatars');
        
        // Create bucket if it doesn't exist
        if (!avatarsBucketExists) {
          await supabase.storage.createBucket('avatars', { public: true });
        }
        
        // Upload new avatar
        const fileName = `${user.id}-${Date.now()}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, { upsert: true });
        
        if (uploadError) {
          console.error("Error uploading avatar:", uploadError);
          toast.error("فشل تحميل الصورة الشخصية");
        } else {
          // Get public URL
          const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);
          
          finalAvatarUrl = urlData.publicUrl;
        }
      }
      
      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          display_name: displayName || `${firstName} ${lastName}`,
          phone,
          avatar_url: finalAvatarUrl,
          updated_at: new Date()
        })
        .eq('id', user.id);
      
      if (updateError) {
        console.error("Error updating profile:", updateError);
        toast.error("فشل تحديث الملف الشخصي");
        return;
      }
      
      toast.success("تم تحديث الملف الشخصي بنجاح");
      
    } catch (error) {
      console.error("Unexpected error during update:", error);
      toast.error("حدث خطأ غير متوقع أثناء التحديث");
    } finally {
      setUpdating(false);
    }
  };
  
  const handlePasswordUpdate = async () => {
    try {
      setUpdating(true);
      
      // Validate passwords
      if (newPassword !== confirmPassword) {
        toast.error("كلمة المرور الجديدة وتأكيدها غير متطابقين");
        return;
      }
      
      if (newPassword.length < 6) {
        toast.error("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل");
        return;
      }
      
      // Update password
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) {
        console.error("Error updating password:", error);
        toast.error("فشل تحديث كلمة المرور");
        return;
      }
      
      // Reset password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast.success("تم تحديث كلمة المرور بنجاح");
      
    } catch (error) {
      console.error("Unexpected error updating password:", error);
      toast.error("حدث خطأ غير متوقع أثناء تحديث كلمة المرور");
    } finally {
      setUpdating(false);
    }
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Show preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
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
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-primary">إدارة الملف الشخصي</h1>
              <p className="text-gray-600">تعديل وتحديث بيانات حسابك الشخصي</p>
            </header>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar */}
              <div className="w-full md:w-64">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center space-y-4 py-6">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={avatarUrl} alt={displayName || `${firstName} ${lastName}`} />
                        <AvatarFallback>{firstName?.charAt(0) || ''}{lastName?.charAt(0) || ''}</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h3 className="font-medium text-lg">{displayName || `${firstName} ${lastName}`}</h3>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <Button variant="outline" className="w-full justify-between" onClick={() => navigate('/dashboard')}>
                        <span>لوحة التحكم</span>
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-between text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
                        <span>تسجيل الخروج</span>
                        <LogOut className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main Content */}
              <div className="flex-1">
                <Card>
                  <Tabs defaultValue="info">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>معلومات الحساب</CardTitle>
                        <TabsList>
                          <TabsTrigger value="info" className="flex items-center gap-1">
                            <UserIcon className="h-4 w-4" />
                            <span>البيانات الشخصية</span>
                          </TabsTrigger>
                          <TabsTrigger value="security" className="flex items-center gap-1">
                            <Key className="h-4 w-4" />
                            <span>الأمان</span>
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      <CardDescription>
                        تعديل وتحديث معلومات حسابك الشخصي
                      </CardDescription>
                    </CardHeader>
                    
                    <TabsContent value="info">
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">الاسم الأول</Label>
                              <Input 
                                id="firstName" 
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="أدخل الاسم الأول"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="lastName">الاسم الأخير</Label>
                              <Input 
                                id="lastName" 
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="أدخل الاسم الأخير"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="displayName">اسم العرض</Label>
                            <Input 
                              id="displayName" 
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              placeholder="اسم العرض (سيظهر للمستخدمين الآخرين)"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">البريد الإلكتروني</Label>
                            <Input 
                              id="email" 
                              value={user?.email || ''}
                              disabled
                              className="bg-gray-100"
                            />
                            <p className="text-xs text-gray-500">لا يمكن تغيير البريد الإلكتروني</p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">رقم الهاتف</Label>
                            <Input 
                              id="phone" 
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="أدخل رقم الهاتف"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="avatar">الصورة الشخصية</Label>
                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={avatarUrl} />
                                <AvatarFallback>{firstName?.charAt(0) || ''}{lastName?.charAt(0) || ''}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <Input 
                                  id="avatar" 
                                  type="file"
                                  accept="image/*"
                                  onChange={handleAvatarChange}
                                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0 file:text-sm file:font-semibold
                                  file:bg-primary-50 file:text-primary hover:file:bg-primary-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">يفضل صورة مربعة بحجم 200×200 بكسل</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-end">
                        <Button onClick={handleProfileUpdate} disabled={updating}>
                          {updating ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent ml-2"></div>
                              جاري الحفظ...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 ml-2" />
                              حفظ التغييرات
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </TabsContent>
                    
                    <TabsContent value="security">
                      <CardContent>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                            <Input 
                              id="currentPassword" 
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="أدخل كلمة المرور الحالية"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                            <Input 
                              id="newPassword" 
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="أدخل كلمة المرور الجديدة"
                            />
                            <p className="text-xs text-gray-500">يجب أن تكون كلمة المرور 6 أحرف على الأقل</p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</Label>
                            <Input 
                              id="confirmPassword" 
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="أدخل تأكيد كلمة المرور الجديدة"
                            />
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-end">
                        <Button onClick={handlePasswordUpdate} disabled={updating || !newPassword || !confirmPassword}>
                          {updating ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent ml-2"></div>
                              جاري التحديث...
                            </>
                          ) : (
                            <>
                              <Key className="h-4 w-4 ml-2" />
                              تحديث كلمة المرور
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
