import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, Mail, Lock, User, Phone, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Particles from '@/components/reactbit/particles';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSelector } from '@/components/LanguageSelector';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: 'driver' as 'driver' | 'shipper',
    // Driver fields - FAQAT AVTOMOBIL RAQAMI VA GUVOHNOMA
    licensePlate: '',
    licenseNumber: '',
    // Shipper fields
    companyName: '',
    companyAddress: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate driver fields - FAQAT 2 TA MAYDON
    if (formData.role === 'driver') {
      if (!formData.licensePlate || !formData.licenseNumber) {
        setError('Haydovchi uchun avtomobil raqami va guvohnoma raqamini kiriting');
        toast.error('Avtomobil raqami va guvohnoma raqamini kiriting');
        return;
      }
    }

    setLoading(true);

    try {
      await register(formData);
      toast.success('Muvaffaqiyatli ro\'yxatdan o\'tdingiz!');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Ro\'yxatdan o\'tish xato');
      toast.error(err.message || 'Ro\'yxatdan o\'tish xato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Particles Background */}
      <div className="absolute inset-0 z-0 bg-black">
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
          className=""
        />
      </div>

      {/* Register Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Truck className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">LogiPeek</h1>
          <p className="text-white">{t('auth.register.subtitle')}</p>
          <div className="mt-4 flex justify-center">
            <LanguageSelector />
          </div>
        </div>

        <div className="glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-xl flex items-center gap-2 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <Label className="text-red-500 mb-3 block">{t('auth.role')}</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value: 'driver' | 'shipper') =>
                  setFormData({ ...formData, role: value })
                }
                className="grid grid-cols-2 gap-3"
              >
                <div>
                  <RadioGroupItem value="driver" id="driver" className="peer sr-only" />
                  <Label
                    htmlFor="driver"
                    className="flex flex-col items-center justify-center p-4 bg-muted rounded-xl cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground transition-all"
                  >
                    <Truck className="w-6 h-6 mb-2" />
                    <span className="font-medium">{t('auth.role.driver')}</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="shipper" id="shipper" className="peer sr-only" />
                  <Label
                    htmlFor="shipper"
                    className="flex flex-col items-center justify-center p-4 bg-muted rounded-xl cursor-pointer peer-data-[state=checked]:bg-accent peer-data-[state=checked]:text-accent-foreground transition-all"
                  >
                    <User className="w-6 h-6 mb-2" />
                    <span className="font-medium">{t('auth.role.shipper')}</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="fullName" className="text-red-500 mb-2 block">
                {t('auth.fullName')}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Ism Familiya"
                  className="pl-11"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-red-500 mb-2 block">
                {t('auth.email')}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  className="pl-11"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-red-500 mb-2 block">
                {t('auth.phone')}
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  className="pl-11"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-red-500 mb-2 block">
                {t('auth.password')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-11"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* HAYDOVCHI UCHUN FAQAT 2 TA MAYDON */}
            {formData.role === 'driver' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2 border-t border-border/50"
              >
                <p className="text-sm text-red-500 font-medium">🚗 AVTOMOBIL MA'LUMOTLARI 🚗</p>

                {/* AVTOMOBIL RAQAMI */}
                <div>
                  <Label htmlFor="licensePlate" className="text-red-500 mb-2 block">
                    🚙 Avtomobil raqami
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                    <Input
                      id="licensePlate"
                      type="text"
                      placeholder="01 A 777 BA"
                      className="pl-11"
                      value={formData.licensePlate}
                      onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                      required={formData.role === 'driver'}
                    />
                  </div>
                </div>

                {/* GUVOHNOMA RAQAMI */}
                <div>
                  <Label htmlFor="licenseNumber" className="text-red-500 mb-2 block">
                    📄 Haydovchilik guvohnomasi raqami
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                    <Input
                      id="licenseNumber"
                      type="text"
                      placeholder="DL123456789"
                      className="pl-11"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      required={formData.role === 'driver'}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Shipper specific fields */}
            {formData.role === 'shipper' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2 border-t border-border/50"
              >
                <p className="text-sm text-red-500 font-medium">Kompaniya ma'lumotlari</p>

                <div>
                  <Label htmlFor="companyName" className="text-red-500 mb-2 block">
                    {t('auth.companyName')}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="SardorTrade LLC"
                      className="pl-11"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="companyAddress" className="text-red-500 mb-2 block">
                    Kompaniya manzili (ixtiyoriy)
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                    <Input
                      id="companyAddress"
                      type="text"
                      placeholder="Tashkent, Chilanzar"
                      className="pl-11"
                      value={formData.companyAddress}
                      onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full btn-gradient py-6 text-lg"
              disabled={loading}
            >
              {loading ? t('message.loading') : t('auth.registerButton')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-red-500 text-sm">
              {t('auth.hasAccount')}{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                {t('auth.loginButton')}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;