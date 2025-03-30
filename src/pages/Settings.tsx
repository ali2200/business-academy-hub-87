
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, RefreshCw, Settings as SettingsIcon, Globe, Mail, Phone, CreditCard, Shield, EyeOff } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface WebsiteSettings {
  site_title: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  social_media: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
  };
  payment_settings: {
    currency: string;
    payment_methods: string[];
  };
  maintenance_mode: boolean;
}

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<WebsiteSettings>({
    site_title: 'بيزنس أكاديمي',
    site_description: 'منصة تعليمية متخصصة في مجال الأعمال والتطوير المهني',
    contact_email: 'info@business-academy.com',
    contact_phone: '+20123456789',
    social_media: {
      facebook: 'https://facebook.com/business-academy',
      twitter: 'https://twitter.com/business-academy',
      instagram: 'https://instagram.com/business-academy',
      youtube: 'https://youtube.com/business-academy',
    },
    payment_settings: {
      currency: 'EGP',
      payment_methods: ['visa', 'mastercard', 'paypal'],
    },
    maintenance_mode: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .eq('section', 'settings')
        .eq('key', 'general_settings')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is fine for default settings
        throw error;
      }
      
      if (data && data.content) {
        try {
          const parsedSettings = JSON.parse(data.content);
          setSettings(parsedSettings);
        } catch (parseError) {
          console.error('Error parsing settings JSON:', parseError);
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('حدث خطأ أثناء تحميل إعدادات الموقع');
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // Check if settings record exists
      const { data: existingData, error: checkError } = await supabase
        .from('website_content')
        .select('id')
        .eq('section', 'settings')
        .eq('key', 'general_settings')
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('website_content')
          .update({
            content: JSON.stringify(settings),
            content_type: 'json'
          })
          .eq('id', existingData.id);
        
        if (updateError) throw updateError;
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('website_content')
          .insert({
            section: 'settings',
            key: 'general_settings',
            content: JSON.stringify(settings),
            content_type: 'json'
          });
        
        if (insertError) throw insertError;
      }
      
      toast.success('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleInputChange = (field: string, value: string) => {
    setSettings({
      ...settings,
      [field]: value
    });
  };
  
  const handleSocialMediaChange = (platform: string, value: string) => {
    setSettings({
      ...settings,
      social_media: {
        ...settings.social_media,
        [platform]: value
      }
    });
  };
  
  const handleMaintenanceModeToggle = (enabled: boolean) => {
    setSettings({
      ...settings,
      maintenance_mode: enabled
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">إعدادات الموقع</h1>
              <p className="text-gray-600 mt-1">تكوين وتخصيص إعدادات الموقع</p>
            </div>
            <Button
              onClick={() => navigate('/admin-dashboard')}
              variant="outline"
              className="flex items-center gap-2"
            >
              العودة للوحة التحكم
            </Button>
          </div>
        </header>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
            <p className="text-gray-500">جاري تحميل الإعدادات...</p>
          </div>
        ) : (
          <Tabs defaultValue="general">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-64 space-y-2">
                <TabsList className="flex flex-col h-auto p-0 bg-transparent">
                  <TabsTrigger 
                    value="general"
                    className="justify-start rounded-md px-3 py-2 h-9 data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <Globe className="h-4 w-4 ml-2" />
                    إعدادات عامة
                  </TabsTrigger>
                  <TabsTrigger 
                    value="contact"
                    className="justify-start rounded-md px-3 py-2 h-9 data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <Mail className="h-4 w-4 ml-2" />
                    معلومات الاتصال
                  </TabsTrigger>
                  <TabsTrigger 
                    value="payment"
                    className="justify-start rounded-md px-3 py-2 h-9 data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <CreditCard className="h-4 w-4 ml-2" />
                    إعدادات الدفع
                  </TabsTrigger>
                  <TabsTrigger 
                    value="maintenance"
                    className="justify-start rounded-md px-3 py-2 h-9 data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <Shield className="h-4 w-4 ml-2" />
                    وضع الصيانة
                  </TabsTrigger>
                </TabsList>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">حفظ الإعدادات</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Button 
                      onClick={saveSettings}
                      disabled={isSaving}
                      className="w-full"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 ml-2" />
                          حفظ الإعدادات
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex-1">
                <TabsContent value="general" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>الإعدادات العامة</CardTitle>
                      <CardDescription>
                        المعلومات الأساسية لموقعك
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="site_title">عنوان الموقع</Label>
                        <Input 
                          id="site_title"
                          value={settings.site_title}
                          onChange={(e) => handleInputChange('site_title', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="site_description">وصف الموقع</Label>
                        <Textarea 
                          id="site_description"
                          value={settings.site_description}
                          onChange={(e) => handleInputChange('site_description', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="contact" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>معلومات الاتصال</CardTitle>
                      <CardDescription>
                        إعدادات الاتصال وروابط وسائل التواصل الاجتماعي
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact_email">البريد الإلكتروني للتواصل</Label>
                        <Input 
                          id="contact_email"
                          type="email"
                          value={settings.contact_email}
                          onChange={(e) => handleInputChange('contact_email', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contact_phone">رقم الهاتف للتواصل</Label>
                        <Input 
                          id="contact_phone"
                          value={settings.contact_phone}
                          onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                        />
                      </div>
                      
                      <div className="pt-2">
                        <h3 className="text-lg font-medium mb-3">وسائل التواصل الاجتماعي</h3>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="facebook">فيسبوك</Label>
                            <Input 
                              id="facebook"
                              value={settings.social_media.facebook}
                              onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="twitter">تويتر / X</Label>
                            <Input 
                              id="twitter"
                              value={settings.social_media.twitter}
                              onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="instagram">انستجرام</Label>
                            <Input 
                              id="instagram"
                              value={settings.social_media.instagram}
                              onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="youtube">يوتيوب</Label>
                            <Input 
                              id="youtube"
                              value={settings.social_media.youtube}
                              onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="payment" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>إعدادات الدفع</CardTitle>
                      <CardDescription>
                        تكوين خيارات الدفع وعملة الموقع
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currency">العملة الافتراضية</Label>
                        <Input 
                          id="currency"
                          value={settings.payment_settings.currency}
                          onChange={(e) => setSettings({
                            ...settings,
                            payment_settings: {
                              ...settings.payment_settings,
                              currency: e.target.value
                            }
                          })}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          الرمز المستخدم للعملة (مثال: EGP، USD)
                        </p>
                      </div>
                      
                      {/* More payment settings can be added here in the future */}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="maintenance" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>وضع الصيانة</CardTitle>
                      <CardDescription>
                        تمكين وضع الصيانة يجعل الموقع غير متاح للزوار العاديين
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="maintenance-mode">وضع الصيانة</Label>
                          <p className="text-sm text-gray-500">
                            عند تفعيل هذا الوضع، سيتم عرض صفحة صيانة للزوار
                          </p>
                        </div>
                        <Switch
                          id="maintenance-mode"
                          checked={settings.maintenance_mode}
                          onCheckedChange={handleMaintenanceModeToggle}
                        />
                      </div>
                      
                      {settings.maintenance_mode && (
                        <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200 mt-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <EyeOff className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div className="mr-3">
                              <h3 className="text-sm font-medium text-yellow-800">
                                تنبيه: وضع الصيانة مفعل
                              </h3>
                              <div className="mt-1 text-sm text-yellow-700">
                                <p>
                                  الموقع حاليًا في وضع الصيانة ولن يتمكن الزوار العاديون من الوصول إليه.
                                  فقط المشرفون يمكنهم الوصول إلى الموقع.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <p className="text-sm text-gray-500">
                        قم بتفعيل وضع الصيانة فقط عند إجراء تغييرات كبيرة على الموقع.
                      </p>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Settings;
