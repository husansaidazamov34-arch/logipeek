import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Mail, Lock, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Particles from '@/components/reactbit/particles';
import { api } from '@/lib/api';

type Step = 'email' | 'verify' | 'success';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Send reset code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Parolni tiklash kodi emailga yuborildi');
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi');
      toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Parollar mos kelmadi');
      toast.error('Parollar mos kelmadi');
      return;
    }

    if (newPassword.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      toast.error('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        email,
        code: verificationCode,
        newPassword,
      });
      toast.success('Parol muvaffaqiyatli yangilandi!');
      setStep('success');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Noto\'g\'ri kod yoki xatolik');
      toast.error(err.response?.data?.message || 'Noto\'g\'ri kod');
    } finally {
      setLoading(false);
    }
  };

  // Resend code
  const handleResendCode = async () => {
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Kod qayta yuborildi');
      setCountdown(300);
      
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

      {/* Form */}
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
          <p className="text-white">Parolni tiklash</p>
        </div>

        <div className="glass-card p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Enter Email */}
            {step === 'email' && (
              <motion.form
                key="email"
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
                  <Label htmlFor="email" className="text-red-500 mb-2 block">
                    Email manzilingizni kiriting
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      className="pl-11"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-xs text-white/70 mt-2">
                    Parolni tiklash kodi ushbu emailga yuboriladi
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-gradient py-6 text-lg"
                  disabled={loading}
                >
                  {loading ? 'Yuborilmoqda...' : 'Tiklash kodini yuborish'}
                </Button>

                <div className="text-center">
                  <Link to="/login" className="text-primary text-sm hover:underline inline-flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Kirish sahifasiga qaytish
                  </Link>
                </div>
              </motion.form>
            )}

            {/* Step 2: Verify Code and Reset Password */}
            {step === 'verify' && (
              <motion.form
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleResetPassword}
                className="space-y-4"
              >
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep('email')}
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
                    Tiklash kodi <strong>{email}</strong> manziliga yuborildi
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

                <div>
                  <Label htmlFor="newPassword" className="text-red-500 mb-2 block">
                    Yangi parol
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-11"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-red-500 mb-2 block">
                    Parolni tasdiqlang
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-11"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-gradient py-6 text-lg"
                  disabled={loading || verificationCode.length !== 6}
                >
                  {loading ? 'Yangilanmoqda...' : 'Parolni yangilash'}
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

            {/* Step 3: Success */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <CheckCircle className="w-20 h-20 text-success mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  Parol yangilandi!
                </h2>
                <p className="text-white/70 mb-6">
                  Parolingiz muvaffaqiyatli yangilandi. Endi yangi parol bilan tizimga kirishingiz mumkin.
                </p>
                <p className="text-white/50 text-sm">
                  Kirish sahifasiga yo'naltirilmoqda...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
