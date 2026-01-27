import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Truck, MapPin, DollarSign, MessageCircle, Bell, 
  CheckCircle, X, Navigation, Clock, Star, ChevronRight,
  Wifi, WifiOff, Circle, Phone, Settings, User, 
  FileText, CreditCard, HelpCircle, LogOut, Camera,
  Package, AlertCircle, Zap, Award, TrendingUp, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MapViewLive from "./MapViewLive";
import MapViewDriver from "./MapViewDriver";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

type DriverStatus = "online" | "busy" | "offline";

interface Order {
  id: string;
  pickup: string;
  dropoff: string;
  distance: string;
  price: number;
  time: string;
  weight: string;
  urgent?: boolean;
  customerName: string;
  customerPhone: string;
}

interface CompletedOrder {
  id: string;
  from: string;
  to: string;
  date: string;
  price: number;
  rating: number;
}

const mockOrders: Order[] = [
  { id: "ORD-001", pickup: "Tashkent, Chilanzar", dropoff: "Samarkand, Center", distance: "298 km", price: 450000, time: "4h 30m", weight: "500 kg", customerName: "Alisher Karimov", customerPhone: "+998 90 123 45 67" },
  { id: "ORD-002", pickup: "Tashkent, Mirzo Ulugbek", dropoff: "Bukhara, Old City", distance: "420 km", price: 680000, time: "6h", weight: "750 kg", urgent: true, customerName: "Nodira Rahimova", customerPhone: "+998 91 234 56 78" },
  { id: "ORD-003", pickup: "Tashkent, Sergeli", dropoff: "Fergana, Industrial", distance: "310 km", price: 520000, time: "5h", weight: "1200 kg", customerName: "Jasur Toshmatov", customerPhone: "+998 93 345 67 89" },
];

const completedOrders: CompletedOrder[] = [
  { id: "ORD-100", from: "Tashkent", to: "Samarkand", date: "Bugun, 08:30", price: 380000, rating: 5 },
  { id: "ORD-099", from: "Tashkent", to: "Namangan", date: "Kecha", price: 520000, rating: 5 },
  { id: "ORD-098", from: "Tashkent", to: "Andijan", date: "12-Yanvar", price: 450000, rating: 4 },
  { id: "ORD-097", from: "Tashkent", to: "Bukhara", date: "10-Yanvar", price: 680000, rating: 5 },
];

const DriverDashboard = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<DriverStatus>("online");
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const [showProfile, setShowProfile] = useState(false);

  const handleAccept = (order: Order) => {
    setActiveOrder(order);
    setOrders(orders.filter(o => o.id !== order.id));
    setStatus("busy");
    setShowMap(true);
  };

  const handleReject = (orderId: string) => {
    setOrders(orders.filter(o => o.id !== orderId));
  };

  const handleComplete = () => {
    setActiveOrder(null);
    setStatus("online");
    setShowMap(false);
  };

  const statusColors = {
    online: "bg-success text-success-foreground",
    busy: "bg-warning text-warning-foreground",
    offline: "bg-muted text-muted-foreground"
  };

  const statusLabels = {
    online: "Onlayn",
    busy: "Band",
    offline: "Oflayn"
  };

  // Driver Profile Data
  const driverProfile = {
    name: "Bobur Rahmonov",
    phone: "+998 90 987 65 43",
    vehicle: "Isuzu NPR 75",
    plate: "01 B 555 CA",
    rating: 4.9,
    trips: 256,
    joinDate: "2023-yil Mart"
  };

  // Weekly earnings data
  const weeklyEarnings = [
    { day: "Du", amount: 450000 },
    { day: "Se", amount: 380000 },
    { day: "Ch", amount: 520000 },
    { day: "Pa", amount: 620000 },
    { day: "Ju", amount: 480000 },
    { day: "Sh", amount: 720000 },
    { day: "Ya", amount: 280000 },
  ];

  const totalWeekly = weeklyEarnings.reduce((sum, d) => sum + d.amount, 0);
  const maxAmount = Math.max(...weeklyEarnings.map(d => d.amount));

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Truck className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">LogiPeek</h1>
              <p className="text-xs text-muted-foreground">Haydovchi</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-xl hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <User className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Status Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                status === "online" ? "bg-success/20" : status === "busy" ? "bg-warning/20" : "bg-muted"
              }`}>
                {status === "online" ? <Wifi className="w-5 h-5 text-success" /> : 
                 status === "busy" ? <Circle className="w-5 h-5 text-warning fill-warning" /> : 
                 <WifiOff className="w-5 h-5 text-muted-foreground" />}
              </div>
              <div>
                <p className="font-semibold text-foreground">{statusLabels[status]}</p>
                <p className="text-sm text-muted-foreground">
                  {status === "online" ? t('status.waitingOrders') : 
                   status === "busy" ? t('status.delivering') : 
                   t('status.notAccepting')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch 
                checked={status === "online" || status === "busy"}
                onCheckedChange={(checked) => {
                  if (!activeOrder) {
                    setStatus(checked ? "online" : "offline");
                  }
                }}
                disabled={!!activeOrder}
              />
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="glass-card p-4 text-center">
            <Award className="w-6 h-6 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{driverProfile.rating}</p>
            <p className="text-xs text-muted-foreground">Reyting</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{driverProfile.trips}</p>
            <p className="text-xs text-muted-foreground">Sayohatlar</p>
          </div>
          <div className="glass-card p-4 text-center">
            <TrendingUp className="w-6 h-6 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">98%</p>
            <p className="text-xs text-muted-foreground">Bajarildi</p>
          </div>
        </motion.div>

        {/* Earnings Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-5 bg-gradient-primary text-primary-foreground"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-primary-foreground/80 text-sm mb-1">Bugungi daromad</p>
              <p className="text-3xl font-bold">2,450,000 <span className="text-lg font-normal">so'm</span></p>
              <p className="text-sm text-primary-foreground/70 mt-1">5 ta yetkazib berish</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-7 h-7" />
            </div>
          </div>
          
          {/* Weekly chart */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-primary-foreground/80">Haftalik</p>
              <p className="text-sm font-medium">{(totalWeekly / 1000000).toFixed(1)}M so'm</p>
            </div>
            <div className="flex items-end justify-between gap-1 h-16">
              {weeklyEarnings.map((day, i) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full bg-white/30 rounded-t"
                    style={{ height: `${(day.amount / maxAmount) * 100}%` }}
                  />
                  <span className="text-xs text-primary-foreground/60">{day.day}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Active Order */}
        <AnimatePresence>
          {activeOrder && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-5 border-2 border-primary"
            >
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-primary text-primary-foreground">Faol yetkazib berish</Badge>
                <span className="text-success font-semibold">{activeOrder.price.toLocaleString()} so'm</span>
              </div>

              {/* Customer Info */}
              <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-xl">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{activeOrder.customerName}</p>
                  <p className="text-sm text-muted-foreground">{activeOrder.customerPhone}</p>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-success" />
                  </button>
                  <button className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('tracking.pickupLocation')}</p>
                    <p className="font-medium text-foreground">{activeOrder.pickup}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('tracking.deliveryLocation')}</p>
                    <p className="font-medium text-foreground">{activeOrder.dropoff}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {activeOrder.time}</span>
                <span>•</span>
                <span>{activeOrder.distance}</span>
                <span>•</span>
                <span>{activeOrder.weight}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowMap(!showMap)}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {showMap ? "Xaritani yopish" : "Yo'nalish"}
                </Button>
                <Button 
                  className="w-full btn-gradient"
                  onClick={handleComplete}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Yakunlash
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map View */}
        <AnimatePresence>
          {showMap && activeOrder && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 400 }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-2xl overflow-hidden"
            >
              <MapViewDriver 
                driverLocation={{
                  lat: 41.3111,
                  lng: 69.2797
                }}
                pickup={{ 
                  lat: 41.2995, 
                  lng: 69.2401, 
                  address: activeOrder.pickup 
                }}
                dropoff={{ 
                  lat: 39.6542, 
                  lng: 66.9597, 
                  address: activeOrder.dropoff 
                }}
                showRoute={true}
                height="400px"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="orders">Buyurtmalar</TabsTrigger>
            <TabsTrigger value="history">Tarix</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          {/* New Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            {!activeOrder && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Yangi buyurtmalar</h2>
                  <Badge variant="secondary">{orders.length} ta mavjud</Badge>
                </div>

                <AnimatePresence>
                  {orders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card p-4 card-hover"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {order.urgent && (
                            <Badge className="bg-destructive/20 text-destructive border-destructive/30">
                              <Zap className="w-3 h-3 mr-1" /> Shoshilinch
                            </Badge>
                          )}
                          <Star className="w-4 h-4 text-warning fill-warning" />
                          <span className="text-sm text-muted-foreground">{order.weight}</span>
                        </div>
                        <span className="text-lg font-bold text-primary">{order.price.toLocaleString()} so'm</span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-success" />
                          <p className="text-sm text-foreground truncate">{order.pickup}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <p className="text-sm text-foreground truncate">{order.dropoff}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {order.time}</span>
                          <span>{order.distance}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleReject(order.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-success hover:bg-success/90 text-success-foreground"
                            onClick={() => handleAccept(order)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Qabul
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {orders.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">Hozircha yangi buyurtmalar yo'q</p>
                    <p className="text-sm text-muted-foreground/60">Tez orada keladi!</p>
                  </motion.div>
                )}
              </>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Buyurtmalar tarixi</h2>
              <Badge variant="secondary">{completedOrders.length} ta</Badge>
            </div>

            {completedOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success/20 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{order.from} → {order.to}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{order.price.toLocaleString()} so'm</p>
                    <div className="flex items-center gap-1 justify-end">
                      {[...Array(order.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-warning fill-warning" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            {/* Profile Card */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center text-3xl font-bold text-primary-foreground">
                  {driverProfile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{driverProfile.name}</h2>
                  <p className="text-muted-foreground">{driverProfile.phone}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="font-medium">{driverProfile.rating}</span>
                    <span className="text-muted-foreground text-sm">• {driverProfile.trips} sayohat</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Avtomobil</span>
                  </div>
                  <span className="font-medium text-foreground">{driverProfile.vehicle}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Raqam</span>
                  </div>
                  <span className="font-medium text-foreground">{driverProfile.plate}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">{t('profile.memberSince')}</span>
                  </div>
                  <span className="font-medium text-foreground">{driverProfile.joinDate}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {[
                { icon: CreditCard, label: "To'lovlar", color: "text-success" },
                { icon: FileText, label: "Hujjatlar", color: "text-primary" },
                { icon: Settings, label: "Sozlamalar", color: "text-muted-foreground" },
                { icon: HelpCircle, label: "Yordam", color: "text-info" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full glass-card p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className="font-medium text-foreground">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
              
              <button className="w-full glass-card p-4 flex items-center gap-3 text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Chiqish</span>
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-border/50 px-4 py-2 safe-area-bottom">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {[
            { icon: Package, label: "Buyurtmalar", tab: "orders" },
            { icon: Clock, label: "Tarix", tab: "history" },
            { icon: User, label: "Profil", tab: "profile" },
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
                activeTab === item.tab 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default DriverDashboard;
