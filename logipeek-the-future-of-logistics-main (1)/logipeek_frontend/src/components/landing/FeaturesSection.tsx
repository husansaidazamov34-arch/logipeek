import { motion } from 'framer-motion';
import { Shield, Clock, MapPin, CreditCard, Phone, Star } from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: Clock,
      title: 'Tez yetkazib berish',
      description: '24/7 xizmat va tezkor yetkazib berish kafolati'
    },
    {
      icon: Shield,
      title: 'Xavfsizlik',
      description: 'Yuklaringiz to\'liq sug\'urtalangan va himoyalangan'
    },
    {
      icon: MapPin,
      title: 'Real-time kuzatuv',
      description: 'Yukingizni real vaqtda kuzatib boring'
    },
    {
      icon: CreditCard,
      title: 'Oson to\'lov',
      description: 'Turli to\'lov usullari: Payme, Click, UzCard'
    },
    {
      icon: Phone,
      title: '24/7 qo\'llab-quvvatlash',
      description: 'Har qanday vaqtda yordam va maslahat'
    },
    {
      icon: Star,
      title: 'Yuqori sifat',
      description: 'Professional haydovchilar va sifatli xizmat'
    }
  ];

  return (
    <section id="features" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Bizning afzalliklarimiz
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            LogiPeek bilan yuk tashish oson, tez va ishonchli
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};