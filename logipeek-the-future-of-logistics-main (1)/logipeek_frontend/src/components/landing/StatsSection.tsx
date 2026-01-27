import { motion } from 'framer-motion';
import { Package, Truck, Users, MapPin } from 'lucide-react';

export const StatsSection = () => {
  const stats = [
    { icon: Package, label: 'Yetkazilgan yuklar', value: '10,000+' },
    { icon: Truck, label: 'Faol haydovchilar', value: '500+' },
    { icon: Users, label: 'Mijozlar', value: '1,000+' },
    { icon: MapPin, label: 'Shaharlar', value: '50+' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};