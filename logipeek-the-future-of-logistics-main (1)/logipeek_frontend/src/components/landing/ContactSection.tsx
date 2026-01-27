import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export const ContactSection = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Telefon',
      info: '+998 90 123 45 67',
      description: '24/7 qo\'llab-quvvatlash'
    },
    {
      icon: Mail,
      title: 'Email',
      info: 'info@logipeek.uz',
      description: 'Savollaringiz uchun'
    },
    {
      icon: MapPin,
      title: 'Manzil',
      info: 'Toshkent, O\'zbekiston',
      description: 'Bosh ofis'
    },
    {
      icon: Clock,
      title: 'Ish vaqti',
      info: '24/7',
      description: 'Har doim xizmatda'
    }
  ];

  return (
    <section id="contact" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Biz bilan bog'laning
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Savollaringiz bormi? Biz sizga yordam berishga tayyormiz
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactInfo.map((contact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <contact.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{contact.title}</h3>
              <p className="text-primary font-medium mb-1">{contact.info}</p>
              <p className="text-gray-600 text-sm">{contact.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};