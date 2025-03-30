
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus, RefreshCw, Search, Edit, Trash2, UserCheck, UserX, Shield, ShieldOff } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  created_at: string;
  profile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    display_name: string | null;
    avatar_url: string | null;
    is_admin: boolean;
  };
}

const UsersManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    // Check if user is admin
    const checkAdminStatus = async () => {
      setIsCheckingAuth(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast.error("يجب تسجيل الدخول للوصول إلى لوحة التحكم");
          navigate('/admin-signin');
          return;
        }
        
        // Check if user is admin
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (error || !data?.is_admin) {
          toast.error("ليس لديك صلاحية للوصول إلى لوحة التحكم");
          navigate('/dashboard');
          return;
        }
        
        // Load users if admin
        loadUsers();
      } catch (err) {
        console.error("Error checking admin status:", err);
        toast.error("حدث خطأ أثناء التحقق من صلاحياتك");
        navigate('/admin-signin');
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAdminStatus();
  }, [navigate]);
  
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch users with their profiles
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        throw authError;
      }
      
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) {
        throw profilesError;
      }
      
      // Map profiles to users
      const usersWithProfiles = authUsers.users.map(user => {
        const profile = profiles.find(p => p.id === user.id) || {
          id: user.id,
          first_name: null,
          last_name: null,
          display_name: null,
          avatar_url: null,
          is_admin: false
        };
        
        return {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          profile
        };
      });
      
      setUsers(usersWithProfiles);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('حدث خطأ أثناء تحميل بيانات المستخدمين');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleAdminStatus = async (userId: string, isAdmin: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !isAdmin })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, profile: { ...user.profile, is_admin: !isAdmin } } 
          : user
      ));
      
      toast.success(`تم ${!isAdmin ? 'منح' : 'إلغاء'} صلاحيات الإدارة للمستخدم بنجاح`);
    } catch (error) {
      console.error('Error toggling admin status:', error);
      toast.error('حدث خطأ أثناء تحديث صلاحيات المستخدم');
    }
  };
  
  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      // Remove from local state
      setUsers(users.filter(user => user.id !== userId));
      toast.success('تم حذف المستخدم بنجاح');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('حدث خطأ أثناء حذف المستخدم');
    }
  };
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      (user.profile.display_name && user.profile.display_name.toLowerCase().includes(searchLower)) ||
      (user.profile.first_name && user.profile.first_name.toLowerCase().includes(searchLower)) ||
      (user.profile.last_name && user.profile.last_name.toLowerCase().includes(searchLower))
    );
  });
  
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <span className="mr-2">جاري التحقق من الصلاحيات...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">إدارة المستخدمين</h1>
              <p className="text-gray-600 mt-1">إدارة حسابات المستخدمين وصلاحياتهم</p>
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
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>المستخدمين</CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadUsers}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />
                  تحديث
                </Button>
                <Button 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => navigate('/admin-dashboard/add-user')}
                >
                  <UserPlus className="h-4 w-4" />
                  إضافة مستخدم
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث عن مستخدم..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9"
                />
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                <p className="text-gray-500">جاري تحميل بيانات المستخدمين...</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">المستخدم</TableHead>
                      <TableHead className="text-right">البريد الإلكتروني</TableHead>
                      <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          {searchQuery ? 'لا توجد نتائج للبحث' : 'لا يوجد مستخدمين بعد'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={user.profile.avatar_url || ''} />
                                <AvatarFallback>
                                  {user.profile.display_name 
                                    ? user.profile.display_name.slice(0, 2).toUpperCase() 
                                    : user.email.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {user.profile.display_name || user.profile.first_name || 'مستخدم'}
                                </p>
                                {user.profile.is_admin && (
                                  <Badge variant="secondary" className="mt-1">
                                    مسؤول
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.email}
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString('ar-EG')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                              نشط
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" onClick={() => navigate(`/admin-dashboard/users/${user.id}`)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => toggleAdminStatus(user.id, user.profile.is_admin)}
                              >
                                {user.profile.is_admin ? (
                                  <ShieldOff className="h-4 w-4 text-orange-500" />
                                ) : (
                                  <Shield className="h-4 w-4 text-green-600" />
                                )}
                              </Button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>حذف المستخدم</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => deleteUser(user.id)}
                                      className="bg-red-500 text-white hover:bg-red-600"
                                    >
                                      حذف المستخدم
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersManagement;
