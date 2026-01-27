import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { usersApi } from "@/lib/api";
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, Trash2, AlertTriangle } from "lucide-react";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";
import { LicenseImageUpload } from "./LicenseImageUpload";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  onUpdate: () => void;
}

export function SettingsDialog({ open, onOpenChange, user, onUpdate }: SettingsDialogProps) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const deleteAccountMutation = useDeleteAccount();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    licenseImageUrl: user?.driverProfile?.licenseImageUrl || "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      await deleteAccountMutation.mutateAsync();
      toast.success(t('account.deleteSuccess'));
      onOpenChange(false);
      logout();
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('account.deleteError'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password change
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        toast.error("Parolni o'zgartirish uchun joriy parolni kiriting");
        return;
      }
      if (formData.newPassword.length < 6) {
        toast.error("Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Yangi parollar mos kelmayapti");
        return;
      }
    }

    // Validate phone format
    if (formData.phone && !formData.phone.match(/^\+998\d{9}$/)) {
      toast.error("Telefon raqam +998XXXXXXXXX formatida bo'lishi kerak");
      return;
    }

    setIsLoading(true);

    try {
      const updateData: any = {};
      
      if (formData.fullName !== user.fullName) {
        updateData.fullName = formData.fullName;
      }
      if (formData.email !== user.email) {
        updateData.email = formData.email;
      }
      if (formData.phone !== user.phone) {
        updateData.phone = formData.phone;
      }
      if (formData.newPassword) {
        updateData.newPassword = formData.newPassword;
        updateData.currentPassword = formData.currentPassword;
      }
      
      // For drivers, check license image URL
      if (user.role === 'driver' && formData.licenseImageUrl !== (user.driverProfile?.licenseImageUrl || '')) {
        updateData.licenseImageUrl = formData.licenseImageUrl;
      }

      if (Object.keys(updateData).length === 0) {
        toast.info("Hech qanday o'zgarish kiritilmadi");
        return;
      }

      // Direct update without email verification
      await usersApi.updateProfile(user._id, updateData);
      
      toast.success("Profil muvaffaqiyatli yangilandi");
      onUpdate();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Xatolik yuz berdi";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t('settings.title')}
          </DialogTitle>
        </DialogHeader>

        {!showDeleteConfirm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium">
                {t('profile.fullName')}
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="pl-10"
                  placeholder="To'liq ismingizni kiriting"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                {t('profile.email')}
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase().trim() })}
                  className="pl-10"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">
                {t('profile.phone')}
              </Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    let value = e.target.value;
                    // Auto-format phone number
                    if (!value.startsWith('+998')) {
                      if (value.startsWith('998')) {
                        value = '+' + value;
                      } else if (value.startsWith('9')) {
                        value = '+998' + value;
                      } else if (!value.startsWith('+')) {
                        value = '+998' + value;
                      }
                    }
                    // Remove non-digits except +
                    value = value.replace(/[^\d+]/g, '');
                    // Limit length
                    if (value.length <= 13) {
                      setFormData({ ...formData, phone: value });
                    }
                  }}
                  className="pl-10"
                  placeholder="+998 90 123 45 67"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Format: +998XXXXXXXXX</p>
            </div>

            {/* License Image Upload for Drivers */}
            {user?.role === 'driver' && (
              <div>
                <Label className="text-sm font-medium">
                  Haydovchilik guvohnomasi rasmi
                </Label>
                <LicenseImageUpload
                  currentImageUrl={formData.licenseImageUrl}
                  onImageUploaded={(url) => setFormData({ ...formData, licenseImageUrl: url })}
                />
              </div>
            )}

            {/* Password Change Section */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-3">Parolni o'zgartirish (ixtiyoriy)</h3>
              
              {/* Current Password */}
              <div className="mb-3">
                <Label htmlFor="currentPassword" className="text-sm font-medium">
                  Joriy parol
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className="pl-10 pr-10"
                    placeholder="Joriy parolingizni kiriting"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="mb-3">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  Yangi parol
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="pl-10 pr-10"
                    placeholder="Yangi parolingizni kiriting"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Kamida 6 ta belgi</p>
              </div>

              {/* Confirm New Password */}
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Yangi parolni tasdiqlang
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10 pr-10"
                    placeholder="Yangi parolni qayta kiriting"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
              </Button>

              {/* Delete Account Button */}
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full"
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t('account.deleteAccount')}
              </Button>
            </div>
          </form>
        ) : (
          /* Delete Confirmation */
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-destructive">
                  {t('account.deleteConfirmTitle')}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('account.deleteConfirmMessage')}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
                disabled={deleteAccountMutation.isPending}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                className="flex-1"
                disabled={deleteAccountMutation.isPending}
              >
                {deleteAccountMutation.isPending ? t('common.deleting') : t('account.confirmDelete')}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}