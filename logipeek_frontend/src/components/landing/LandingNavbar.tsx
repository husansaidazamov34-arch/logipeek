import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface LandingNavbarProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const LandingNavbar = ({ onOpenAuth }: LandingNavbarProps) => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
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
              Xizmatlar
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm tracking-wide">
              Qanday ishlaydi
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm tracking-wide">
              Aloqa
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex gap-2 lg:gap-3">
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Navigate to appropriate dashboard based on role
                    if (user.role === 'admin') {
                      window.location.href = '/admin';
                    } else if (user.role === 'driver') {
                      window.location.href = '/driver';
                    } else {
                      window.location.href = '/shipper';
                    }
                  }}
                  className="btn-tesla text-sm px-3 py-2 sm:px-4 sm:py-2.5"
                >
                  Dashboard
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onOpenAuth('login')}
                    className="px-3 py-2 sm:px-5 sm:py-2.5 text-primary hover:bg-primary/10 rounded-full transition-colors font-medium text-sm"
                  >
                    Kirish
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(1, 57, 39, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onOpenAuth('register')}
                    className="btn-tesla text-sm px-3 py-2 sm:px-4 sm:py-2.5"
                  >
                    Ro'yxatdan o'tish
                  </motion.button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Menyuni yopish" : "Menyuni ochish"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
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
                Xizmatlar
              </a>
              <a
                href="#how-it-works"
                className="block text-base sm:text-lg font-medium text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Qanday ishlaydi
              </a>
              <a
                href="#contact"
                className="block text-base sm:text-lg font-medium text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Aloqa
              </a>

              <div className="pt-3 sm:pt-4 flex flex-col gap-2 sm:gap-3">
                {user ? (
                  <Button
                    className="w-full py-4 sm:py-6 rounded-xl btn-tesla"
                    onClick={() => {
                      if (user.role === 'admin') {
                        window.location.href = '/admin';
                      } else if (user.role === 'driver') {
                        window.location.href = '/driver';
                      } else {
                        window.location.href = '/shipper';
                      }
                    }}
                  >
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full py-4 sm:py-6 rounded-xl"
                      onClick={() => {
                        onOpenAuth('login');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Kirish
                    </Button>
                    <Button
                      className="w-full py-4 sm:py-6 rounded-xl btn-tesla"
                      onClick={() => {
                        onOpenAuth('register');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Ro'yxatdan o'tish
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};