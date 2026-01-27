import { useState, useEffect } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { useAvailableOrders, useActiveOrders, useOrderHistory, useAcceptOrder } from "@/hooks/useOrders";
import { useUpdateDriverStatus, useDriverStats } from "@/hooks/useDriver";
import { useUnreadCount } from "@/hooks/useNotifications";
import { toast } from "sonner";

type DriverStatus = "online" | "busy" | "offline";

import { NotificationsDropdown } from "./NotificationsDropdown";
import { useTranslation } from "@/hooks/useTranslation";

const DriverDashboardIntegrated = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [status, setStatus] = useState<DriverStatus>("offline");
  const [activeOrder, setActiveOrder] = useState<any | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");

  // Mock data
  const mockAvailableOrders = [
    { id: "ORD-001", pickupAddress: "Tashkent, Chilanzar", dropoffAddress: "Samarkand, Center", distanceKm: 298, estimatedPrice: 450000, weight: 500, vehicleTypeRequired: "Yuk mashinasi" },
    { id: "ORD-002", pickupAddress: "Tashkent, Mirzo Ulugbek", dropoffAddress: "Bukhara, Old City", distanceKm: 420, estimatedPrice: 680000, weight: 750, vehicleTypeRequired: "Yuk mashinasi", urgent: true },
    { id: "ORD-003", pickupAddress: "Tashkent, Sergeli", dropoffAddress: "Fergana, Industrial", distanceKm: 310, estimatedPrice: 520000, weight: 1200, vehicleTypeRequired: "Katta yuk" },
  ];

  const mockOrderHistory = [
    { id: "ORD-100", pickupAddress: "Tashkent", dropoffAddress: "Samarkand", completedAt: new Date().toISOString(), finalPrice: 380000 },
    { id: "ORD-099", pickupAddress: "Tashkent", dropoffAddress: "Namangan", completedAt: new Date(Date.now() - 86400000).toISOString(), finalPrice: 520000 },
    { id: "ORD-098", pickupAddress: "Tashkent", dropoffAddress: "Andijan", completedAt: new Date(Date.now() - 172800000).toISOString(), finalPrice: 450000 },
  ];

  // API Hooks (with fallback to mock data)
  const { data: apiAvailableOrders, isLoading: loadingAvailable } = useAvailableOrders();
  const { data: apiActiveOrders, isLoading: loadingActive } = useActiveOrders();
  const { data: apiOrderHistory, isLoading: loadingHistory } = useOrderHistory();
  const { data: stats } = useDriverStats();
  const { data: unreadCount } = useUnreadCount();
  const updateStatus = useUpdateDriverStatus();
  const acceptOrder = useAcceptOrder();

  // Use API data if available, otherwise use mock data
  const availableOrders = apiAvailableOrders && apiAvailableOrders.length > 0 ? apiAvailableOrders : mockAvailableOrders;
  const orderHistory = apiOrderHistory && apiOrderHistory.length > 0 ? apiOrderHistory : mockOrderHistory;

  // Set active order from API
  useEffect(() => {
    if (apiActiveOrders && apiActiveOrders.length > 0) {
      setActiveOrder(apiActiveOrders[0]);
      setStatus("busy");
    } else {
      setActiveOrder(null);
      if (status === "busy") {
        setStatus("online");
      }
    }
  }, [apiActiveOrders]);

  const handleStatusChange = async (checked: boolean) => {
    if (activeOrder) return; // Can't change status while busy
    
    const newStatus = checked ? "online" : "offline";
    try {
      await updateStatus.mutateAsync(newStatus);
      setStatus(newStatus);
      toast.success(`Status: ${newStatus === "online" ? "Onlayn" : "Oflayn"}`);
    } catch (error: any) {
      console.debug('Status update error:', error);
      // If driver profile doesn't exist, just update local state
      if (error.response?.status === 404) {
        setStatus(newStatus);
        toast.warning("Driver profili topilmadi, faqat local status o'zgartirildi");
      } else {
        toast.error("Status o'zgartirishda xatolik");
      }
    }
  };

  const handleAccept = async (order: any) => {
    try {
      await acceptOrder.mutateAsync(order.id);
      setActiveOrder(order);
      setStatus("busy");
      setShowMap(true);
      toast.success(t('notifications.orderAcceptedToast'));
    } catch (error) {
      toast.error("Buyurtmani qabul qilishda xatolik");
    }
  };

  const handleComplete = async () => {
    // This will be handled by updating shipment status
    setActiveOrder(null);
    setStatus("online");
    setShowMap(false);
    toast.success("Buyurtma yakunlandi!");
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

  // Driver Profile Data from API
  const driverProfile = {
    name: user?.fullName || "Driver",
    phone: user?.phone || "",
    vehicle: stats?.vehicleModel || "N/A",
    plate: stats?.licensePlate || "N/A",
    rating: typeof stats?.rating === 'number' ? stats.rating : parseFloat(stats?.rating || '5.0'),
    trips: typeof stats?.totalTrips === 'number' ? stats.totalTrips : parseInt(stats?.totalTrips || '0'),
    joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long' }) : "N/A"
  };

  // Weekly earnings data (mock for now, can be from API)
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
            <NotificationsDropdown />
            <button 
              onClick={() => setActiveTab("profile")}
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
                onCheckedChange={handleStatusChange}
                disabled={!!activeOrder || updateStatus.isPending}
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
            <p className="text-2xl font-bold text-foreground">{driverProfile.rating.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Reyting</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{driverProfile.trips}</p>
            <p className="text-xs text-muted-foreground">Sayohatlar</p>
          </div>
          <div className="glass-card p-4 text-center">
            <TrendingUp className="w-6 h-6 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {stats?.totalEarnings 
                ? (parseFloat(stats.totalEarnings.toString()) / 1000000).toFixed(1) + 'M' 
                : '0'}
            </p>
            <p className="text-xs text-muted-foreground">Daromad</p>
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
                <span className="text-success font-semibold">{activeOrder.estimatedPrice?.toLocaleString()} so'm</span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('tracking.pickupLocation')}</p>
                    <p className="font-medium text-foreground">{activeOrder.pickupAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('tracking.deliveryLocation')}</p>
                    <p className="font-medium text-foreground">{activeOrder.dropoffAddress}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {activeOrder.distanceKm}km</span>
                <span>•</span>
                <span>{activeOrder.weight}kg</span>
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
                  lat: driverProfile?.currentLatitude || 41.3111,
                  lng: driverProfile?.currentLongitude || 69.2797
                }}
                pickup={{ 
                  lat: 41.2995, 
                  lng: 69.2401, 
                  address: activeOrder.pickupAddress 
                }}
                dropoff={{ 
                  lat: 39.6542, 
                  lng: 66.9597, 
                  address: activeOrder.dropoffAddress 
                }}
                showRoute={true}
                height="400px"
                onRouteCalculated={(distance, duration) => {
                  console.log(`Route: ${distance}km, ${duration}min`);
                }}
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
                  <Badge variant="secondary">{availableOrders.length} ta mavjud</Badge>
                </div>

                {loadingAvailable ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : (
                  <AnimatePresence>
                    {availableOrders.map((order: any, index: number) => (
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
                            <Star className="w-4 h-4 text-warning fill-warning" />
                            <span className="text-sm text-muted-foreground">{order.weight}kg</span>
                          </div>
                          <span className="text-lg font-bold text-primary">{order.estimatedPrice?.toLocaleString()} so'm</span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-success" />
                            <p className="text-sm text-foreground truncate">{order.pickupAddress}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <p className="text-sm text-foreground truncate">{order.dropoffAddress}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-3 text-xs text-muted-foreground">
                            <span>{order.distanceKm}km</span>
                            <span>•</span>
                            <span>{order.vehicleTypeRequired}</span>
                          </div>
                          
                          <Button
                            size="sm"
                            className="bg-success hover:bg-success/90 text-success-foreground"
                            onClick={() => handleAccept(order)}
                            disabled={acceptOrder.isPending}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Qabul
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}

                {!loadingAvailable && availableOrders.length === 0 && (
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
              <Badge variant="secondary">{orderHistory.length} ta</Badge>
            </div>

            {loadingHistory ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : (
              orderHistory.map((order: any, index: number) => (
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
                        <p className="font-medium text-foreground">{order.pickupAddress} → {order.dropoffAddress}</p>
                        <p className="text-sm text-muted-foreground">{new Date(order.completedAt).toLocaleDateString('uz-UZ')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{order.finalPrice?.toLocaleString()} so'm</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
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
              <button className="w-full glass-card p-4 flex items-center gap-3 text-destructive hover:bg-destructive/10 transition-colors" onClick={logout}>
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

export default DriverDashboardIntegrated;
