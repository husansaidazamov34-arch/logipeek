import { Truck, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">LogiPeek</h3>
                <p className="text-sm text-gray-400">Logistika platformasi</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Yuk tashish va logistika xizmatlarini zamonaviy texnologiyalar bilan 
              birlashtiruvchi platforma. Tez, ishonchli va xavfsiz.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Tezkor havolalar</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Xizmatlar</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">Qanday ishlaydi</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Aloqa</a></li>
              <li><a href="/login" className="text-gray-400 hover:text-white transition-colors">Kirish</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Aloqa</h4>
            <ul className="space-y-2 text-gray-400">
              <li>+998 90 123 45 67</li>
              <li>info@logipeek.uz</li>
              <li>Toshkent, O'zbekiston</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 LogiPeek. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
};