import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Truck, 
  Package, 
  Shield, 
  Activity, 
  UserPlus, 
  History,
  Settings,
  LogOut,
  Search,
  Filter,
  MoreVertical,
  Eye,
  UserX,
  UserCheck,
  Crown,
  Trash2,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAdminStats, useAdminUsers, useAdmins, useAdminLogs, useUpdateUserStatus, useDeleteUser } from '@/hooks/useAdmin';
import { usePendingLicenseApprovals, useApprovedLicenses, useRejectedLicenses, useApproveLicense } from '@/hooks/useLicenseApproval';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { CreateAdminDialog } from './CreateAdminDialog';
import { UserDetailsDialog } from './UserDetailsDialog';
import { SettingsDialog } from './SettingsDialog';
import { LanguageSelector } from './LanguageSelector';
import { toast } from 'sonner';

export const AdminDashboard = () => {
  const { user, logout, refreshUser } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: usersData, isLoading: usersLoading } = useAdminUsers(1, 20, selectedRole === 'all' ? undefined : selectedRole, searchTerm);
  const { data: admins, isLoading: adminsLoading } = useAdmins();
  const { data: logsData, isLoading: logsLoading } = useAdminLogs(1, 50);
  const { data: pendingLicenses, isLoading: licensesLoading } = usePendingLicenseApprovals();
  const { data: approvedLicenses, isLoading: approvedLoading } = useApprovedLicenses();
  const { data: rejectedLicenses, isLoading: rejectedLoading } = useRejectedLicenses();
  
  const updateUserStatusMutation = useUpdateUserStatus();
  const deleteUserMutation = useDeleteUser();
  const approveLicenseMutation = useApproveLicense();

  const handleUserStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      await updateUserStatusMutation.mutateAsync({
        userId,
        data: { 
          isActive: !currentStatus,
          reason: !currentStatus ? 'Admin tomonidan faollashtirildi' : 'Admin tomonidan to\'xtatildi'
        }
      });
      toast.success(currentStatus ? 'Foydalanuvchi to\'xtatildi' : 'Foydalanuvchi faollashtirildi');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUserMutation.mutateAsync(userId);
      toast.success('Foydalanuvchi o\'chirildi');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const canDeleteUser = (targetUser: any) => {
    return user?.isSuperAdmin && !targetUser.isSuperAdmin && targetUser.id !== user.id;
  };

  const handleViewUserDetails = (userId: string) => {
    setSelectedUserId(userId);
    setShowUserDetails(true);
  };

  const handleDeleteAdmin = async (adminId: string) => {
    try {
      // API call to delete admin
      toast.success('Admin o\'chirildi');
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    }
  };

  const handleApproveLicense = async (driverId: string, approved: boolean) => {
    try {
      await approveLicenseMutation.mutateAsync({ driverId, approved });
    } catch (error: any) {
      // Error is handled in the mutation
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <Card className="glass-card border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {change && (
              <p className={`text-xs ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change}% o'tgan oyga nisbatan
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-b border-border/50 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{t('admin.panel')}</h1>
                <p className="text-sm text-muted-foreground">LogiPeek boshqaruv paneli</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <LanguageSelector variant="light" />
              
              <Badge variant={user?.isSuperAdmin ? "default" : "secondary"} className="gap-1">
                {user?.isSuperAdmin && <Crown className="w-3 h-3" />}
                {user?.isSuperAdmin ? 'Super Admin' : 'Admin'}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {user?.fullName?.charAt(0)}
                      </span>
                    </div>
                    <span className="hidden md:block">{user?.fullName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowSettingsDialog(true)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Sozlamalar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Chiqish
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="dashboard" className="gap-2">
              <Activity className="w-4 h-4" />
              {t('admin.dashboard')}
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              {t('admin.users')}
            </TabsTrigger>
            <TabsTrigger value="licenses" className="gap-2">
              <FileText className="w-4 h-4" />
              {t('admin.licenses')}
              {pendingLicenses && pendingLicenses.length > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  {pendingLicenses.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="admins" className="gap-2">
              <Shield className="w-4 h-4" />
              {t('admin.admins')}
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <History className="w-4 h-4" />
              {t('admin.logs')}
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title={t('admin.totalUsers')}
                value={stats?.totalUsers || 0}
                icon={Users}
                color="bg-blue-500"
                change={12}
              />
              <StatCard
                title={t('admin.drivers')}
                value={stats?.totalDrivers || 0}
                icon={Truck}
                color="bg-green-500"
                change={8}
              />
              <StatCard
                title={t('admin.shippers')}
                value={stats?.totalShippers || 0}
                icon={Package}
                color="bg-purple-500"
                change={15}
              />
              <StatCard
                title="Faol buyurtmalar"
                value={stats?.activeShipments || 0}
                icon={Activity}
                color="bg-orange-500"
                change={-3}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Haydovchilar holati
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Onlayn</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium">{stats?.onlineDrivers || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Band</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="font-medium">{stats?.activeShipments || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Oflayn</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <span className="font-medium">{(stats?.totalDrivers || 0) - (stats?.onlineDrivers || 0)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Buyurtmalar statistikasi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Jami buyurtmalar</span>
                      <span className="font-medium">{stats?.totalShipments || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Faol</span>
                      <span className="font-medium text-blue-600">{stats?.activeShipments || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Yakunlangan</span>
                      <span className="font-medium text-green-600">{stats?.completedShipments || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="glass-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Jami</p>
                      <p className="text-3xl font-bold text-foreground">
                        {((stats?.totalDrivers || 0) + (stats?.totalShippers || 0))}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Haydovchilar</p>
                      <p className="text-3xl font-bold text-foreground">
                        {(stats?.totalDrivers || 0)}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Truck className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Yuk beruvchilar</p>
                      <p className="text-3xl font-bold text-foreground">
                        {(stats?.totalShippers || 0)}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Package className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Foydalanuvchi qidirish..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="w-4 h-4" />
                      {selectedRole === 'all' ? 'Barchasi' : selectedRole === 'driver' ? 'Haydovchilar' : 'Yuk beruvchilar'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedRole('all')}>
                      Barchasi
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedRole('driver')}>
                      Haydovchilar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedRole('shipper')}>
                      Yuk beruvchilar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <Card className="glass-card border-border/50">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-muted-foreground">Foydalanuvchi</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Rol</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Holat</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Ro'yxatdan o'tgan</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">Amallar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersData?.users?.map((user: any) => (
                        <tr key={user.id} className="border-b border-border/30 hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-primary-foreground">
                                  {user.fullName?.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{user.fullName}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant={user.role === 'driver' ? 'default' : 'secondary'}>
                              {user.role === 'driver' ? 'Haydovchi' : 'Yuk beruvchi'}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge variant={user.isActive ? 'default' : 'destructive'}>
                              {user.isActive ? 'Faol' : 'To\'xtatilgan'}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString('uz-UZ')}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewUserDetails(user.id)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleUserStatusToggle(user.id, user.isActive)}
                              >
                                {user.isActive ? (
                                  <UserX className="w-4 h-4" />
                                ) : (
                                  <UserCheck className="w-4 h-4" />
                                )}
                              </Button>
                              {canDeleteUser(user) && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="ghost">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewUserDetails(user.id)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Tafsilotlar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* License Approvals Tab */}
          <TabsContent value="licenses" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Haydovchilik guvohnomalari</h2>
                <p className="text-muted-foreground">{t('admin.licenseManagement')}</p>
              </div>
            </div>

            <Tabs defaultValue="pending" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending" className="gap-2">
                  <Clock className="w-4 h-4" />
                  {t('admin.pending')}
                  {pendingLicenses && pendingLicenses.length > 0 && (
                    <Badge variant="destructive" className="ml-1 text-xs">
                      {pendingLicenses.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved" className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {t('admin.approved')}
                  {approvedLicenses && approvedLicenses.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {approvedLicenses.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="rejected" className="gap-2">
                  <XCircle className="w-4 h-4" />
                  {t('admin.rejected')}
                  {rejectedLicenses && rejectedLicenses.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {rejectedLicenses.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Pending Licenses */}
              <TabsContent value="pending">
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      {t('admin.pendingLicenses')}
                      {pendingLicenses && pendingLicenses.length > 0 && (
                        <Badge variant="secondary">{pendingLicenses.length}</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {licensesLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground mt-2">{t('admin.loading')}</p>
                      </div>
                    ) : !pendingLicenses || pendingLicenses.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                        <p className="text-muted-foreground">{t('admin.noPendingLicenses')}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {pendingLicenses.map((driver: any) => (
                          <div key={driver.id} className="border border-border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                                    {driver.fullName?.split(' ').map((n: string) => n[0]).join('') || 'H'}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-foreground">{driver.fullName}</h4>
                                    <p className="text-sm text-muted-foreground">{driver.email}</p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Telefon</p>
                                    <p className="text-sm font-medium">{driver.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Avtomobil</p>
                                    <p className="text-sm font-medium">
                                      {driver.driverProfile?.vehicleModel} ({driver.driverProfile?.licensePlate})
                                    </p>
                                  </div>
                                </div>

                                {driver.driverProfile?.licenseImageUrl && (
                                  <div className="mb-4">
                                    <p className="text-xs text-muted-foreground mb-2">Haydovchilik guvohnomasi</p>
                                    <img 
                                      src={`http://localhost:5000${driver.driverProfile.licenseImageUrl}`}
                                      alt="Haydovchilik guvohnomasi"
                                      className="w-full max-w-md h-48 object-cover rounded-lg border border-border"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-border">
                              <Button
                                onClick={() => handleApproveLicense(driver.id, true)}
                                disabled={approveLicenseMutation.isPending}
                                className="gap-2 bg-success hover:bg-success/90"
                              >
                                <CheckCircle className="w-4 h-4" />
                                {t('admin.approve')}
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleApproveLicense(driver.id, false)}
                                disabled={approveLicenseMutation.isPending}
                                className="gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                {t('admin.reject')}
                              </Button>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
                                <Clock className="w-4 h-4" />
                                <span>Yuklangan: {new Date(driver.createdAt).toLocaleDateString('uz-UZ')}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Approved Licenses */}
              <TabsContent value="approved">
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-success" />
                      Tasdiqlangan guvohnomaları
                      {approvedLicenses && approvedLicenses.length > 0 && (
                        <Badge variant="secondary">{approvedLicenses.length}</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {approvedLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground mt-2">Yuklanmoqda...</p>
                      </div>
                    ) : !approvedLicenses || approvedLicenses.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Tasdiqlangan guvohnomaları yo'q</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {approvedLicenses.map((driver: any) => (
                          <div key={driver.id} className="border border-success/30 bg-success/5 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center text-white font-bold">
                                    {driver.fullName?.split(' ').map((n: string) => n[0]).join('') || 'H'}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-foreground">{driver.fullName}</h4>
                                    <p className="text-sm text-muted-foreground">{driver.email}</p>
                                  </div>
                                  <Badge variant="default" className="bg-success">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Tasdiqlangan
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Telefon</p>
                                    <p className="text-sm font-medium">{driver.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Avtomobil</p>
                                    <p className="text-sm font-medium">
                                      {driver.driverProfile?.vehicleModel} ({driver.driverProfile?.licensePlate})
                                    </p>
                                  </div>
                                </div>

                                {driver.driverProfile?.licenseImageUrl && (
                                  <div className="mb-4">
                                    <p className="text-xs text-muted-foreground mb-2">Haydovchilik guvohnomasi</p>
                                    <img 
                                      src={`http://localhost:5000${driver.driverProfile.licenseImageUrl}`}
                                      alt="Haydovchilik guvohnomasi"
                                      className="w-full max-w-md h-48 object-cover rounded-lg border border-border"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-border">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-success" />
                                  <span>Tasdiqlangan: {new Date(driver.driverProfile?.licenseApprovedAt).toLocaleDateString('uz-UZ')}</span>
                                </div>
                                {driver.driverProfile?.licenseApprovedByAdmin && (
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>Tomonidan: {driver.driverProfile.licenseApprovedByAdmin.fullName}</span>
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleApproveLicense(driver.id, false)}
                                disabled={approveLicenseMutation.isPending}
                                className="gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                Rad etish
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Rejected Licenses */}
              <TabsContent value="rejected">
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-destructive" />
                      Rad etilgan guvohnomaları
                      {rejectedLicenses && rejectedLicenses.length > 0 && (
                        <Badge variant="secondary">{rejectedLicenses.length}</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {rejectedLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground mt-2">Yuklanmoqda...</p>
                      </div>
                    ) : !rejectedLicenses || rejectedLicenses.length === 0 ? (
                      <div className="text-center py-8">
                        <XCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Rad etilgan guvohnomaları yo'q</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {rejectedLicenses.map((driver: any) => (
                          <div key={driver.id} className="border border-destructive/30 bg-destructive/5 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-10 h-10 bg-destructive rounded-full flex items-center justify-center text-white font-bold">
                                    {driver.fullName?.split(' ').map((n: string) => n[0]).join('') || 'H'}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-foreground">{driver.fullName}</h4>
                                    <p className="text-sm text-muted-foreground">{driver.email}</p>
                                  </div>
                                  <Badge variant="destructive">
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Rad etilgan
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Telefon</p>
                                    <p className="text-sm font-medium">{driver.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Avtomobil</p>
                                    <p className="text-sm font-medium">
                                      {driver.driverProfile?.vehicleModel} ({driver.driverProfile?.licensePlate})
                                    </p>
                                  </div>
                                </div>

                                {driver.driverProfile?.licenseImageUrl && (
                                  <div className="mb-4">
                                    <p className="text-xs text-muted-foreground mb-2">Haydovchilik guvohnomasi</p>
                                    <img 
                                      src={`http://localhost:5000${driver.driverProfile.licenseImageUrl}`}
                                      alt="Haydovchilik guvohnomasi"
                                      className="w-full max-w-md h-48 object-cover rounded-lg border border-border"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-border">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <XCircle className="w-4 h-4 text-destructive" />
                                  <span>Rad etilgan: {new Date(driver.driverProfile?.licenseApprovedAt).toLocaleDateString('uz-UZ')}</span>
                                </div>
                                {driver.driverProfile?.licenseApprovedByAdmin && (
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>Tomonidan: {driver.driverProfile.licenseApprovedByAdmin.fullName}</span>
                                  </div>
                                )}
                              </div>
                              <Button
                                onClick={() => handleApproveLicense(driver.id, true)}
                                disabled={approveLicenseMutation.isPending}
                                className="gap-2 bg-success hover:bg-success/90"
                                size="sm"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Tasdiqlash
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Admins Tab */}
          <TabsContent value="admins" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Adminlar</h2>
                <p className="text-muted-foreground">Tizim adminlarini boshqarish</p>
              </div>
              {user?.isSuperAdmin && (
                <Button onClick={() => setShowCreateAdmin(true)} className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Yangi admin
                </Button>
              )}
            </div>

            <Card className="glass-card border-border/50">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-muted-foreground">Admin</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Tur</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Yaratilgan</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">Amallar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins?.map((admin: any) => (
                        <tr key={admin.id} className="border-b border-border/30 hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-primary-foreground">
                                  {admin.fullName?.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{admin.fullName}</p>
                                <p className="text-sm text-muted-foreground">{admin.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant={admin.isSuperAdmin ? 'default' : 'secondary'} className="gap-1">
                              {admin.isSuperAdmin && <Crown className="w-3 h-3" />}
                              {admin.isSuperAdmin ? 'Super Admin' : 'Admin'}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {new Date(admin.createdAt).toLocaleDateString('uz-UZ')}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              {user?.isSuperAdmin && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleViewUserDetails(admin.id)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              )}
                              {user?.isSuperAdmin && !admin.isSuperAdmin && admin.id !== user.id && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteAdmin(admin.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <UserX className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Admin amallar tarixi</h2>
              <p className="text-muted-foreground">Barcha admin amallarining to'liq tarixi</p>
            </div>

            <Card className="glass-card border-border/50">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-muted-foreground">Admin</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Amal</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Tavsif</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Vaqt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logsData?.logs?.map((log: any) => (
                        <tr key={log.id} className="border-b border-border/30 hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-primary-foreground">
                                  {log.admin?.fullName?.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-foreground text-sm">{log.admin?.fullName}</p>
                                <p className="text-xs text-muted-foreground">{log.admin?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="text-xs">
                              {log.action}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <p className="text-sm text-foreground">{log.description}</p>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {new Date(log.createdAt).toLocaleString('uz-UZ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Admin Dialog */}
      <CreateAdminDialog 
        open={showCreateAdmin} 
        onOpenChange={setShowCreateAdmin}
      />

      {/* User Details Dialog */}
      <UserDetailsDialog
        userId={selectedUserId}
        open={showUserDetails}
        onOpenChange={setShowUserDetails}
      />

      {/* Settings Dialog */}
      {user && (
        <SettingsDialog
          open={showSettingsDialog}
          onOpenChange={setShowSettingsDialog}
          user={user}
          onUpdate={refreshUser}
        />
      )}
    </div>
  );
};