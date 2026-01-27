import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileCheck } from 'lucide-react';

export const SecuritySection = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: 'Sug\'urta himoyasi',
      description: 'Barcha yuklar to\'liq sug\'urtalangan'
    },
    {
      icon: Lock,
      title: 'Xavfsiz to\'lovlar',
      description: 'SSL shifrlash bilan himoyalangan to\'lovlar'
    },
    {
      icon: Eye,
      title: 'Real-time monitoring',
      description: 'Yukingizni 24/7 kuzatib boring'
    },
    {
      icon: FileCheck,
      title: 'Tekshirilgan haydovchilar',
      description: 'Barcha haydovchilar tekshirilgan va litsenziyalangan'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Xavfsizlik va ishonch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sizning yukingiz va ma\'lumotlaringiz to\'liq himoyalangan
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};