import { motion } from 'framer-motion';
import { ArrowRight, Package, Truck } from 'lucide-react';

interface CTASectionProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const CTASection = ({ onOpenAuth }: CTASectionProps) => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-r from-primary to-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Bugun boshlab ko'ring!
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            LogiPeek bilan yuk tashish oson va ishonchli. Hoziroq ro'yxatdan o'ting va birinchi buyurtmangizni bering.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onOpenAuth('register')}
              className="px-8 py-4 bg-white text-primary rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <Package className="w-5 h-5" />
              Yuk beruvchi bo'lish
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onOpenAuth('register')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white hover:text-primary transition-colors"
            >
              <Truck className="w-5 h-5" />
              Haydovchi bo'lish
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};