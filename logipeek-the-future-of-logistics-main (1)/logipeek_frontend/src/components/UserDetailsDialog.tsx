import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Truck, 
  Package, 
  Star, 
  DollarSign,
  Building,
  MapPin,
  Shield,
  Trash2,
  AlertTriangle,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetUserDetails, useDeleteUser } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';

interface UserDetailsDialogProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserDetailsDialog = ({ userId, open, onOpenChange }: UserDetailsDialogProps) => {
  const { user: currentUser } = useAuth();
  const { t } = useTranslation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { data: userDetails, isLoading } = useGetUserDetails(userId || '');
  const deleteUserMutation = useDeleteUser();

  const handleDeleteUser = async () => {
    if (!userId) return;
    
    try {
      await deleteUserMutation.mutateAsync(userId);
      toast.success('Foydalanuvchi muvaffaqiyatli o\'chirildi');
      onOpenChange(false);
      setShowDeleteConfirm(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  if (!userId || !userDetails) return null;

  const user = userDetails;
  const isDriver = user.role === 'driver';
  const isShipper = user.role === 'shipper';
  const isAdmin = user.role === 'admin';
  const canDelete = currentUser?.isSuperAdmin && !user.isSuperAdmin && user.id !== currentUser.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">
                {user.fullName?.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.fullName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={isAdmin ? 'default' : isDriver ? 'secondary' : 'outline'}>
                  {isAdmin ? 'Admin' : isDriver ? 'Haydovchi' : 'Yuk beruvchi'}
                </Badge>
                {user.isSuperAdmin && (
                  <Badge variant="default" className="gap-1">
                    <Shield className="w-3 h-3" />
                    Super Admin
                  </Badge>
                )}
                <Badge variant={user.isActive ? 'default' : 'destructive'}>
                  {user.isActive ? 'Faol' : 'To\'xtatilgan'}
                </Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Asosiy ma'lumotlar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('profile.phone')}</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Ro'yxatdan o'tgan</p>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString('uz-UZ', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {user.createdByAdminId && (
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Yaratgan admin</p>
                    <p className="font-medium">Admin tomonidan yaratilgan</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Statistika
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isDriver && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Jami safar</span>
                    <span className="font-medium">{user.driverProfile?.totalTrips || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Reyting</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{user.driverProfile?.rating || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Jami daromad</span>
                    <span className="font-medium">
                      ${Number(user.driverProfile?.totalEarnings || 0).toLocaleString()}
                    </span>
                  </div>
                </>
              )}

              {isShipper && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Jami buyurtma</span>
                    <span className="font-medium">{user.shipperProfile?.totalShipments || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Jami xarajat</span>
                    <span className="font-medium">
                      ${Number(user.shipperProfile?.totalSpent || 0).toLocaleString()}
                    </span>
                  </div>
                </>
              )}

              {isAdmin && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Admin amallari</span>
                    <span className="font-medium">{user.statistics?.totalAdminActions || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Admin turi</span>
                    <Badge variant={user.isSuperAdmin ? 'default' : 'secondary'} className="gap-1">
                      {user.isSuperAdmin && <Shield className="w-3 h-3" />}
                      {user.isSuperAdmin ? 'Super Admin' : 'Oddiy Admin'}
                    </Badge>
                  </div>
                  {user.createdByAdminId && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Yaratgan admin</span>
                      <span className="font-medium">Boshqa admin tomonidan</span>
                    </div>
                  )}
                </>
              )}

              {!isAdmin && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Yuborgan buyurtmalar</span>
                    <span className="font-medium">{user.statistics?.totalShipmentsAsShipper || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Bajargan buyurtmalar</span>
                    <span className="font-medium">{user.statistics?.totalShipmentsAsDriver || 0}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Driver Profile */}
          {isDriver && user.driverProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Transport ma'lumotlari
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Transport turi</p>
                  <p className="font-medium">{user.driverProfile.vehicleType}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Model</p>
                  <p className="font-medium">{user.driverProfile.vehicleModel}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Davlat raqami</p>
                  <p className="font-medium">{user.driverProfile.licensePlate}</p>
                </div>

                {/* Haydovchilik guvohnomasi - faqat super adminlarga ko'rinadi */}
                {currentUser?.isSuperAdmin && user.driverProfile.licenseNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Shield className="w-3 h-3 text-amber-500" />
                      Haydovchilik guvohnomasi
                      <Badge variant="outline" className="text-xs">
                        Maxfiy
                      </Badge>
                    </p>
                    <p className="font-medium font-mono text-sm bg-muted/50 px-2 py-1 rounded">
                      {user.driverProfile.licenseNumber}
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-muted-foreground">Holat</p>
                  <Badge variant={
                    user.driverProfile.status === 'online' ? 'default' :
                    user.driverProfile.status === 'busy' ? 'secondary' : 'outline'
                  }>
                    {user.driverProfile.status === 'online' ? 'Onlayn' :
                     user.driverProfile.status === 'busy' ? 'Band' : 'Oflayn'}
                  </Badge>
                </div>

                {user.driverProfile.currentLatitude && user.driverProfile.currentLongitude && (
                  <div>
                    <p className="text-sm text-muted-foreground">Joriy joylashuv</p>
                    <p className="font-medium text-xs">
                      {user.driverProfile.currentLatitude}, {user.driverProfile.currentLongitude}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Admin Profile */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Admin ma'lumotlari
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Admin turi</p>
                  <Badge variant={user.isSuperAdmin ? 'default' : 'secondary'} className="gap-1">
                    {user.isSuperAdmin && <Crown className="w-3 h-3" />}
                    {user.isSuperAdmin ? 'Super Admin' : 'Oddiy Admin'}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Jami admin amallari</p>
                  <p className="font-medium">{user.statistics?.totalAdminActions || 0}</p>
                </div>
                
                {user.createdByAdminId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Yaratilgan</p>
                    <p className="font-medium">Boshqa admin tomonidan yaratilgan</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Huquqlar</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">Foydalanuvchilarni ko'rish</Badge>
                    <Badge variant="outline" className="text-xs">Statistikalarni ko'rish</Badge>
                    {user.isSuperAdmin && (
                      <>
                        <Badge variant="default" className="text-xs">Admin yaratish</Badge>
                        <Badge variant="default" className="text-xs">Admin o'chirish</Badge>
                        <Badge variant="default" className="text-xs">Foydalanuvchi o'chirish</Badge>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {isShipper && user.shipperProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Kompaniya ma'lumotlari
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Kompaniya nomi</p>
                  <p className="font-medium">{user.shipperProfile.companyName || 'Kiritilmagan'}</p>
                </div>
                
                {user.shipperProfile.companyAddress && (
                  <div>
                    <p className="text-sm text-muted-foreground">Manzil</p>
                    <p className="font-medium">{user.shipperProfile.companyAddress}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions */}
        {canDelete && (
          <div className="flex justify-end pt-4 border-t">
            {!showDeleteConfirm ? (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Foydalanuvchini o'chirish
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Rostdan ham o'chirmoqchimisiz?</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Bekor qilish
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteUser}
                  disabled={deleteUserMutation.isPending}
                >
                  {deleteUserMutation.isPending ? 'O\'chirilmoqda...' : 'Ha, o\'chirish'}
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};