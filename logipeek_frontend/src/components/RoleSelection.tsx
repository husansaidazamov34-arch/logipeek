import { Truck, Package, ArrowRight, Star, Shield, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Truck, value: "5,000+", label: "Haydovchilar" },
    { icon: Package, value: "50,000+", label: "Jo'natmalar" },
    { icon: Star, value: "4.9", label: "Reyting" },
    { icon: Shield, value: "100%", label: "Xavfsiz" },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow animate-float">
                <Package className="w-9 h-9 text-primary-foreground" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                Logi<span className="text-gradient">Peek</span>
              </h1>
            </div>
            <p className="text-white/60 text-lg max-w-md mx-auto">
              O'zbekistonning zamonaviy logistika platformasi
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-4 gap-4 mb-10 max-w-2xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/50">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Driver Card */}
            <motion.button
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={() => navigate("/driver")}
              className="group glass-card-dark p-8 text-left card-hover border border-white/10 hover:border-primary/50"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                  <Truck className="w-8 h-8 text-primary-foreground" />
                </div>
                <ArrowRight className="w-6 h-6 text-white/40 group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Haydovchi</h2>
              <p className="text-xl text-primary font-medium mb-4">Driver App</p>
              <p className="text-white/60 leading-relaxed">
                Buyurtmalarni qabul qiling, yo'nalishlarni kuzating va daromadingizni boshqaring.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {["Jonli buyurtmalar", "GPS navigatsiya", "Daromadlar"].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-primary/20 text-primary text-sm rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.button>

            {/* Shipper Card */}
            <motion.button
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onClick={() => navigate("/shipper")}
              className="group glass-card-dark p-8 text-left card-hover border border-white/10 hover:border-accent/50"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center glow-accent group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-8 h-8 text-accent-foreground" />
                </div>
                <ArrowRight className="w-6 h-6 text-white/40 group-hover:text-accent group-hover:translate-x-2 transition-all duration-300" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Yuk beruvchi</h2>
              <p className="text-xl text-accent font-medium mb-4">Shipper App</p>
              <p className="text-white/60 leading-relaxed">
                Jo'natmalar yarating, real vaqtda kuzating va logistikani oson boshqaring.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {["Jonli kuzatuv", "Buyurtmalar tarixi", "Tez buyurtma"].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-accent/20 text-accent text-sm rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.button>
          </div>

          {/* Features */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 grid grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {[
              { icon: Clock, text: "24/7 qo'llab-quvvatlash" },
              { icon: MapPin, text: "Butun O'zbekiston bo'ylab" },
              { icon: Shield, text: "Xavfsiz to'lovlar" },
            ].map((feature) => (
              <div key={feature.text} className="flex items-center gap-2 justify-center text-white/50 text-sm">
                <feature.icon className="w-4 h-4" />
                <span>{feature.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center text-white/40 mt-10 text-sm"
          >
            © 2024 LogiPeek • Xavfsiz • Tez • Ishonchli Logistika Platformasi
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
