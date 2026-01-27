import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { usersApi, api } from "@/lib/api";
import { User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Trash2, AlertTriangle } from "lucide-react";
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

type Step = 'form' | 'verify';

export function SettingsDialog({ open, onOpenChange, user, onUpdate }: SettingsDialogProps) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const deleteAccountMutation = useDeleteAccount();
  const [step, setStep] = useState<Step>('form');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [pendingUpdate, setPendingUpdate] = useState<any>(null);
  
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccountMutation.mutateAsync();
      toast.success(t('account.deleteSuccess'));
      onOpenChange(false);
      logout(); // Logout after successful deletion
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

      // Determine which email to send verification code to
      const emailForVerification = updateData.email ? formData.email : user.email;
      
      // Always send verification code for any profile update
      // Add forUpdate=true query parameter to allow sending to existing emails
      await api.post('/auth/send-verification-code?forUpdate=true', { email: emailForVerification });
      
      if (updateData.email) {
        toast.success('Tasdiqlash kodi yangi emailga yuborildi');
      } else {
        toast.success('Tasdiqlash kodi emailingizga yuborildi');
      }
      
      setPendingUpdate(updateData);
      setStep('verify');
      setCountdown(300); // 5 minutes
      
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Xatolik yuz berdi";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const handleVerifyAndUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Determine which email was used for verification
      const emailForVerification = pendingUpdate.email ? formData.email : user.email;
      
      console.log('Verifying code:', verificationCode, 'for email:', emailForVerification);
      
      // Verify the code
      await api.post('/auth/verify-email', { 
        email: emailForVerification, 
        code: verificationCode 
      });

      // Update profile
      await usersApi.updateProfile(user.id, pendingUpdate);
      
      toast.success("Ma'lumotlar muvaffaqiyatli yangilandi!");
      
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setStep('form');
      setVerificationCode('');
      setPendingUpdate(null);
      
      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Settings verification error:', error.response?.data);
      const errorMessage = error.response?.data?.message || "Noto'g'ri kod";
      
      if (errorMessage.includes('muddati tugagan') || errorMessage.includes('expired')) {
        toast.error('Tasdiqlash kodi muddati tugagan. Yangi kod so\'rang.');
      } else if (errorMessage.includes('Noto\'g\'ri') || errorMessage.includes('yaroqsiz') || errorMessage.includes('invalid')) {
        toast.error('Noto\'g\'ri tasdiqlash kodi. Qaytadan kiriting.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      // Determine which email to resend to
      const emailForVerification = pendingUpdate.email ? formData.email : user.email;
      
      await api.post('/auth/send-verification-code?forUpdate=true', { email: emailForVerification });
      toast.success('Kod qayta yuborildi');
      setCountdown(300); // 5 minutes
      
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error('Kodni qayta yuborishda xatolik');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">{t('dashboard.settings')}</DialogTitle>
        </DialogHeader>

        {step === 'form' ? (
          <div className="flex-1 overflow-y-auto pr-2 py-4 max-h-[70vh]">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">{t('auth.fullName')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Alisher Karimov"
                    className="pl-10"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="alisher@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">{t('auth.phone')}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+998901234567"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Format: +998XXXXXXXXX</p>
              </div>

              {/* Divider */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-3">Parolni o'zgartirish (ixtiyoriy)</h3>
              </div>

              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Joriy parol</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
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
              <div className="space-y-2">
                <Label htmlFor="newPassword">Yangi parol</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Kamida 6 ta belgi</p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Yangi parolni tasdiqlang</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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

              {/* License Image Upload for Drivers */}
              {user?.role === 'driver' && (
                <div className="border-t pt-4">
                  <LicenseImageUpload
                    onImageUploaded={(imageUrl) => setFormData({ ...formData, licenseImageUrl: imageUrl })}
                    currentImageUrl={formData.licenseImageUrl}
                    disabled={isLoading}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => onOpenChange(false)}
                    disabled={isLoading}
                  >
                    {t('button.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? t('message.loading') : t('button.save')}
                  </Button>
                </div>

                {/* Delete Account Section */}
                <div className="border-t pt-4">
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-destructive mb-1">{t('account.delete')}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {t('account.deleteWarning')}
                        </p>
                        {!showDeleteConfirm ? (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            {t('account.delete')}
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-destructive">
                              {t('account.deleteConfirm')}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setShowDeleteConfirm(false)}
                            >
                              {t('button.cancel')}
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={handleDeleteAccount}
                              disabled={deleteAccountMutation.isPending}
                            >
                              {deleteAccountMutation.isPending ? t('message.loading') : t('account.confirmDelete')}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 py-4 max-h-[70vh]">
            <form onSubmit={handleVerifyAndUpdate} className="space-y-4">
              <div className="text-center mb-6">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Tasdiqlash kodi <strong>{pendingUpdate?.email ? formData.email : user.email}</strong> manziliga yuborildi
                </p>
                {countdown > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Kod {formatTime(countdown)} davomida amal qiladi
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">6 raqamli kodni kiriting</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  className="text-center text-2xl tracking-widest"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setStep('form');
                    setVerificationCode('');
                    setPendingUpdate(null);
                  }}
                  disabled={isLoading}
                >
                  Orqaga
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading || verificationCode.length !== 6}
                >
                  {isLoading ? "Tekshirilmoqda..." : "Tasdiqlash"}
                </Button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={countdown > 0 || isLoading}
                  className="text-primary text-sm hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Kodni qayta yuborish
                </button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}