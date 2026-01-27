import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Mail, Lock, User, Phone, AlertCircle, FileText, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Particles from '@/components/reactbit/particles';
import { api } from '@/lib/api';

type Step = 'details' | 'verify';

const RegisterWithVerification = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>('details');
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: 'driver' as 'driver' | 'shipper',
    vehicleType: '',
    licenseNumber: '',
    companyName: '',
    companyAddress: '',
  });
  const [error, setError] = useState('');

  // Send verification code after form is filled
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate all required fields
    if (!formData.email || !formData.password || !formData.fullName || !formData.phone) {
      setError('Barcha majburiy maydonlarni to\'ldiring');
      toast.error('Barcha majburiy maydonlarni to\'ldiring');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email noto\'g\'ri formatda');
      toast.error('Email noto\'g\'ri formatda');
      return;
    }

    // Validate phone format
    if (!formData.phone.match(/^\+998\d{9}$/)) {
      setError('Telefon raqam +998XXXXXXXXX formatida bo\'lishi kerak');
      toast.error('Telefon raqam +998XXXXXXXXX formatida bo\'lishi kerak');
      return;
    }

    // Validate password
    if (formData.password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      toast.error('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    if (formData.role === 'driver') {
      if (!formData.vehicleType || !formData.licenseNumber) {
        setError('Haydovchi uchun barcha maydonlarni to\'ldiring');
        toast.error('Barcha maydonlarni to\'ldiring');
        return;
      }
    }

    setLoading(true);

    try {
      await api.post('/auth/send-verification-code', { email: formData.email });
      toast.success('Tasdiqlash kodi emailga yuborildi');
      setStep('verify');
      setCountdown(300); // 5 minutes
      
      // Start countdown
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Xatolik yuz berdi';
      setError(errorMessage);
      
      // Show specific error messages
      if (errorMessage.includes('email') && errorMessage.includes('ro\'yxatdan')) {
        toast.error('Bu email allaqachon ro\'yxatdan o\'tgan. Boshqa email ishlatib ko\'ring yoki tizimga kiring.');
      } else if (errorMessage.includes('telefon') && errorMessage.includes('ro\'yxatdan')) {
        toast.error('Bu telefon raqam allaqachon ro\'yxatdan o\'tgan. Boshqa raqam ishlatib ko\'ring.');
      } else if (errorMessage.includes('davlat raqami')) {
        toast.error('Bu avtomobil raqami allaqachon ro\'yxatdan o\'tgan. Boshqa raqam kiriting.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Verify code and complete registration
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First verify the code
      console.log('Verifying code:', verificationCode, 'for email:', formData.email);
      await api.post('/auth/verify-email', { email: formData.email, code: verificationCode });
      
      // Then complete registration
      await register(formData);
      toast.success('Muvaffaqiyatli ro\'yxatdan o\'tdingiz!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Verification error:', err.response?.data);
      const errorMessage = err.response?.data?.message || 'Noto\'g\'ri kod yoki ro\'yxatdan o\'tish xatosi';
      setError(errorMessage);
      
      // Show specific error messages for verification
      if (errorMessage.includes('muddati tugagan') || errorMessage.includes('expired')) {
        toast.error('Tasdiqlash kodi muddati tugagan. Yangi kod so\'rang.');
        setStep('details'); // Go back to get new code
      } else if (errorMessage.includes('Noto\'g\'ri') || errorMessage.includes('yaroqsiz') || errorMessage.includes('invalid')) {
        toast.error('Noto\'g\'ri tasdiqlash kodi. Qaytadan kiriting.');
      } else if (errorMessage.includes('email') && errorMessage.includes('ro\'yxatdan')) {
        toast.error('Bu email allaqachon ro\'yxatdan o\'tgan. Tizimga kiring yoki boshqa email ishlatib ko\'ring.');
        setStep('details');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/send-verification-code', { email: formData.email });
      toast.success('Tasdiqlash kodi qayta yuborildi');
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
    } catch (err: any) {
      toast.error('Kodni qayta yuborishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <p className="text-white">Ro'yxatdan o'tish</p>
        </div>

        <div className="glass-card p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Fill Details */}
            {step === 'details' && (
              <motion.form
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSendCode}
                className="space-y-4"
              >
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-xl flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div>
                  <Label className="text-red-500 mb-3 block">Rol tanlang</Label>
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
                        <span className="font-medium">Haydovchi</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="shipper" id="shipper" className="peer sr-only" />
                      <Label
                        htmlFor="shipper"
                        className="flex flex-col items-center justify-center p-4 bg-muted rounded-xl cursor-pointer peer-data-[state=checked]:bg-accent peer-data-[state=checked]:text-accent-foreground transition-all"
                      >
                        <User className="w-6 h-6 mb-2" />
                        <span className="font-medium">Yuk beruvchi</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="fullName" className="text-red-500 mb-2 block">
                    To'liq ism
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
                  <Label htmlFor="phone" className="text-red-500 mb-2 block">
                    Telefon
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+998 90 123 45 67"
                      className="pl-11"
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
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Format: +998XXXXXXXXX</p>
                </div>

                <div>
                  <Label htmlFor="email" className="text-red-500 mb-2 block">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      className="pl-11"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase().trim() })}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Masalan: user@example.com</p>
                </div>

                <div>
                  <Label htmlFor="password" className="text-red-500 mb-2 block">
                    Parol
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
                  <p className="text-xs text-muted-foreground mt-1">Kamida 6 ta belgi</p>
                </div>

                {/* Driver specific fields */}
                {formData.role === 'driver' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-2 border-t border-border/50"
                  >
                    <p className="text-sm text-red-500 font-medium">Avtomobil ma'lumotlari</p>

                    <div>
                      <Label htmlFor="vehicleType" className="text-red-500 mb-2 block">
                        Avtomobil turi
                      </Label>
                      <Select
                        value={formData.vehicleType}
                        onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yuk mashinasi">Yuk mashinasi</SelectItem>
                          <SelectItem value="Katta yuk">Katta yuk</SelectItem>
                          <SelectItem value="Yengil yuk">Yengil yuk</SelectItem>
                          <SelectItem value="Furgon">Furgon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="licenseNumber" className="text-red-500 mb-2 block">
                        Haydovchilik guvohnomasi raqami
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
                        Kompaniya nomi (ixtiyoriy)
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
                  {loading ? 'Yuborilmoqda...' : 'Emailga tasdiqlash kodini yuborish'}
                </Button>

                <div className="text-center">
                  <p className="text-red-500 text-sm">
                    Hisobingiz bormi?{' '}
                    <Link to="/login" className="text-primary font-medium hover:underline">
                      Kirish
                    </Link>
                  </p>
                </div>
              </motion.form>
            )}

            {/* Step 2: Verify Code */}
            {step === 'verify' && (
              <motion.form
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyCode}
                className="space-y-4"
              >
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep('details')}
                  className="mb-4 text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Orqaga
                </Button>

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-xl flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                  <p className="text-white text-sm">
                    Tasdiqlash kodi <strong>{formData.email}</strong> manziliga yuborildi
                  </p>
                  {countdown > 0 && (
                    <p className="text-white/70 text-xs mt-2">
                      Kod {formatTime(countdown)} davomida amal qiladi
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="code" className="text-red-500 mb-2 block">
                    6 raqamli kodni kiriting
                  </Label>
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

                <Button
                  type="submit"
                  className="w-full btn-gradient py-6 text-lg"
                  disabled={loading || verificationCode.length !== 6}
                >
                  {loading ? 'Tekshirilmoqda...' : 'Tasdiqlash va Ro\'yxatdan o\'tish'}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={countdown > 0 || loading}
                    className="text-primary text-sm hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Kodni qayta yuborish
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterWithVerification;
