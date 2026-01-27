import { motion } from 'framer-motion';
import { Package, Search, Truck, CheckCircle } from 'lucide-react';

export const HowItWorksSection = () => {
  const steps = [
    {
      icon: Package,
      title: 'Buyurtma bering',
      description: 'Yuk ma\'lumotlarini kiriting va narxni ko\'ring'
    },
    {
      icon: Search,
      title: 'Haydovchi topiladi',
      description: 'Tizim sizga eng yaqin haydovchini topadi'
    },
    {
      icon: Truck,
      title: 'Yuk olinadi',
      description: 'Haydovchi yukingizni olib, yo\'lga chiqadi'
    },
    {
      icon: CheckCircle,
      title: 'Yetkazib beriladi',
      description: 'Yukingiz xavfsiz yetkazib beriladi'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Qanday ishlaydi?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Faqat 4 ta oddiy qadam bilan yukingizni yetkazib bering
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center relative"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <step.icon className="w-8 h-8 text-white" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full">
                  <div className="w-full h-0.5 bg-gray-300 relative">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};