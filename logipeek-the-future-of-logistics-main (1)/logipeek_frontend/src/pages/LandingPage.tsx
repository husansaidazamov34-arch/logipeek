import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Truck, ArrowRight, Package, Star, MapPin, 
  Shield, Clock, Users, CheckCircle, Phone, Mail, 
  Facebook, Twitter, Instagram, Linkedin, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSelector } from '@/components/LanguageSelector';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth Modal Handler - navigate to actual login/register pages
  const handleOpenAuth = (mode: 'login' | 'register') => {
    if (mode === 'login') {
      navigate('/login');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <motion.div
              className="flex items-center gap-2 sm:gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <Truck className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  LogiPeek
                </h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-medium tracking-wide">
                  Logistika platformasi
                </p>
              </div>
            </motion.div>

            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm tracking-wide">
                {t('nav.services')}
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm tracking-wide">
                {t('nav.howItWorks')}
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm tracking-wide">
                {t('nav.contact')}
              </a>
            </nav>

            <div className="flex items-center gap-2 sm:gap-4">
              <LanguageSelector />
              <div className="hidden md:flex gap-2 lg:gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOpenAuth('login')}
                  className="px-3 py-2 sm:px-5 sm:py-2.5 text-primary hover:bg-primary/10 rounded-full transition-colors font-medium text-sm"
                >
                  {t('nav.login')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(1, 57, 39, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOpenAuth('register')}
                  className="btn-tesla text-sm px-3 py-2 sm:px-4 sm:py-2.5"
                >
                  {t('nav.getStarted')}
                </motion.button>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-border/50 overflow-hidden"
            >
              <div className="px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
                <a
                  href="#features"
                  className="block text-base sm:text-lg font-medium text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.services')}
                </a>
                <a
                  href="#how-it-works"
                  className="block text-base sm:text-lg font-medium text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.howItWorks')}
                </a>
                <a
                  href="#contact"
                  className="block text-base sm:text-lg font-medium text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.contact')}
                </a>

                <div className="pt-3 sm:pt-4 flex flex-col gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    className="w-full py-4 sm:py-6 rounded-xl"
                    onClick={() => {
                      handleOpenAuth('login')
                      setMobileMenuOpen(false)
                    }}
                  >
                    {t('nav.login')}
                  </Button>
                  <Button
                    className="w-full py-4 sm:py-6 rounded-xl btn-tesla"
                    onClick={() => {
                      handleOpenAuth('register')
                      setMobileMenuOpen(false)
                    }}
                  >
                    {t('nav.getStarted')}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center pt-16 sm:pt-20 overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-green-800" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-4 sm:mb-6 leading-tight">
                  {t('hero.title')}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-primary mt-1 sm:mt-2">
                    {t('hero.badge')}
                  </span>
                </h2>

                <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-10 leading-relaxed">
                  {t('hero.description')}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(1, 57, 39, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenAuth('register')}
                    className="btn-tesla px-5 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 flex items-center justify-center gap-2 sm:gap-3 group text-sm sm:text-base"
                  >
                    <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t('hero.postLoad')}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenAuth('register')}
                    className="px-5 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2 sm:gap-3 font-medium text-sm sm:text-base"
                  >
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t('hero.becomeDriver')}
                  </motion.button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1 sm:-space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-400 to-primary border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">
                          {i}
                        </div>
                      ))}
                    </div>
                    <div className="ml-1 sm:ml-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-300 font-medium">1000+ foydalanuvchi</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Animated scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5 sm:p-2">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Package, label: 'Yetkazilgan yuklar', value: '10,000+' },
              { icon: Truck, label: 'Faol haydovchilar', value: '500+' },
              { icon: Users, label: 'Mijozlar', value: '1,000+' },
              { icon: MapPin, label: 'Shaharlar', value: '50+' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Nima uchun LogiPeek?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Zamonaviy texnologiyalar va professional xizmat bilan yukingizni xavfsiz yetkazib beramiz
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: 'Tez yetkazish',
                description: '24 soat ichida shahar bo\'ylab, 3 kun ichida mamlakat bo\'ylab'
              },
              {
                icon: Shield,
                title: 'Xavfsizlik',
                description: 'To\'liq sug\'urta va yukni kuzatish tizimi'
              },
              {
                icon: Star,
                title: 'Yuqori sifat',
                description: 'Professional haydovchilar va sifatli xizmat'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Qanday ishlaydi?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oddiy 3 qadamda yukingizni yetkazib bering
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Buyurtma bering',
                description: 'Yukingiz haqida ma\'lumot kiriting va narxni bilib oling'
              },
              {
                step: '02',
                title: 'Haydovchi toping',
                description: 'Eng yaqin va ishonchli haydovchini tanlang'
              },
              {
                step: '03',
                title: 'Yetkazib oling',
                description: 'Yukingizni real vaqtda kuzatib boring'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Bugun boshlab ko'ring!
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Minglab mijozlar bizga ishonib yuklarini yetkazib bermoqda. Siz ham qo'shiling!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenAuth('register')}
            className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Bepul ro'yxatdan o'tish
          </motion.button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Biz bilan bog'laning
            </h2>
            <p className="text-xl text-gray-600">
              Savollaringiz bormi? Biz doim yordam berishga tayyormiz
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Telefon</h3>
              <p className="text-gray-600">+998 90 449 08 93</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">logipeek@gmail.com</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manzil</h3>
              <p className="text-gray-600">Samarqand, O'zbekiston</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Send className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Telegram</h3>
              <div className="space-y-1">
                <p className="text-gray-600">
                  <a href="https://t.me/logipeek_logistika" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    Kanal
                  </a>
                </p>
                <p className="text-gray-600">
                  <a href="https://t.me/logi_peek_bot" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    Bot
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">LogiPeek</h3>
                  <p className="text-sm text-gray-400">Logistika platformasi</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                O'zbekistondagi eng zamonaviy logistika platformasi. Yukingizni tez, xavfsiz va arzon yetkazib berish uchun bizga ishoning.
              </p>
              <div className="flex gap-4">
                <a href="https://t.me/logipeek_logistika" target="_blank" rel="noopener noreferrer">
                  <Send className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                </a>
                <a href="https://www.instagram.com/logi_peek/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                </a>
                <a href="https://www.linkedin.com/in/logi-peek-62b269387/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                </a>
                <a href="https://t.me/logi_peek_bot" target="_blank" rel="noopener noreferrer">
                  <div className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors flex items-center justify-center">
                    🤖
                  </div>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Ijtimoiy Tarmoqlar</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="https://t.me/logipeek_logistika" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Telegram Kanal
                  </a>
                </li>
                <li>
                  <a href="https://t.me/logi_peek_bot" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Telegram Bot
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/logi_peek/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/logi-peek-62b269387/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Aloqa</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="tel:+998904490893" className="hover:text-white transition-colors">
                    +998 90 449 08 93
                  </a>
                </li>
                <li>
                  <a href="mailto:logipeek@gmail.com" className="hover:text-white transition-colors">
                    logipeek@gmail.com
                  </a>
                </li>
                <li>Samarqand, O'zbekiston</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 LogiPeek. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};