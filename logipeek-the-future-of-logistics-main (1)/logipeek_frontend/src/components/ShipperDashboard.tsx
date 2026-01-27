import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, MapPin, Plus, Clock, Truck, Star, 
  Phone, MessageCircle, ChevronRight, Search,
  CreditCard, FileText, Bell, User, CheckCircle2,
  Circle, ArrowRight, X, Calendar, Settings,
  HelpCircle, LogOut, History, Navigation, 
  Building2, Weight, Box, DollarSign, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DateRangePicker } from "@/components/ui/date-picker";
import MapViewLive from "./MapViewLive";
import { Link } from "react-router-dom";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";

type OrderStatus = "pending" | "pickup" | "transit" | "arrived";

interface Shipment {
  id: string;
  pickup: string;
  dropoff: string;
  status: OrderStatus;
  driver?: {
    name: string;
    phone: string;
    rating: number;
    vehicle: string;
    plate: string;
    photo?: string;
  };
  price: number;
  eta: string;
  created: string;
  weight: string;
  vehicleType: string;
  deliveryDateFrom?: string;
  deliveryDateTo?: string;
}

interface HistoryOrder {
  id: string;
  from: string;
  to: string;
  status: "completed" | "cancelled";
  date: string;
  price: number;
  driverName?: string;
}

const activeShipments: Shipment[] = [
  {
    id: "SHP-2024-0001",
    pickup: "Tashkent, Mirabad tumani",
    dropoff: "Samarkand, Registon maydoni",
    status: "transit",
    driver: {
      name: "Javohir Karimov",
      phone: "+998 90 123 45 67",
      rating: 4.9,
      vehicle: "Isuzu NPR",
      plate: "01 A 777 BA"
    },
    price: 580,
    eta: "2s 15d",
    created: "Bugun, 10:30",
    weight: "750 kg",
    vehicleType: "Yuk mashinasi"
  }
];

const orderHistory: HistoryOrder[] = [
  { id: "SHP-2024-0002", from: "Tashkent", to: "Buxoro", status: "completed", date: "10-Yanvar", price: 720, driverName: "Alisher S." },
  { id: "SHP-2024-0003", from: "Tashkent", to: "Farg'ona", status: "completed", date: "8-Yanvar", price: 450, driverName: "Bobur R." },
  { id: "SHP-2024-0004", from: "Tashkent", to: "Namangan", status: "cancelled", date: "5-Yanvar", price: 380 },
  { id: "SHP-2024-0005", from: "Tashkent", to: "Andijon", status: "completed", date: "3-Yanvar", price: 520, driverName: "Sanjar T." },
  { id: "SHP-2024-0006", from: "Tashkent", to: "Navoiy", status: "completed", date: "1-Yanvar", price: 650, driverName: "Jahongir M." },
];

const ShipperDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"track" | "new" | "history" | "profile">("track");
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(activeShipments[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [driverPhone, setDriverPhone] = useState("");

  // New order form state
  const [newOrder, setNewOrder] = useState({
    pickup: "",
    dropoff: "",
    weight: "",
    vehicleType: "",
    notes: "",
    estimatedPrice: 500,
    deliveryDateFrom: undefined as Date | undefined,
    deliveryDateTo: undefined as Date | undefined,
  });

  // User profile
  const userProfile = {
    name: "Sardor Toshmatov",
    company: "SardorTrade LLC",
    phone: "+998 91 234 56 78",
    email: "sardor@sardortrade.uz",
    ordersCount: 45,
    joinDate: "2023-yil Fevral"
  };

  const statusSteps = [
    { key: "pending", label: t('status.pending'), icon: Clock },
    { key: "pickup", label: t('status.pickup'), icon: Package },
    { key: "transit", label: t('status.transit'), icon: Truck },
    { key: "arrived", label: t('status.delivered'), icon: MapPin },
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.key === selectedShipment?.status);

  const filteredHistory = orderHistory.filter(order => 
    order.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateOrder = () => {
    // Validatsiya: manzillar kamida 3 ta harf bo'lishi kerak
    if (!newOrder.pickup || newOrder.pickup.trim().length < 3) {
      alert("Olish manzili kamida 3 ta harf bo'lishi kerak");
      return;
    }

    if (!newOrder.dropoff || newOrder.dropoff.trim().length < 3) {
      alert("Yetkazish manzili kamida 3 ta harf bo'lishi kerak");
      return;
    }

    // Validatsiya: og'irlik 0 dan katta bo'lishi kerak
    const weight = parseFloat(newOrder.weight);
    if (!newOrder.weight || isNaN(weight) || weight <= 0) {
      alert("Og'irlik 0 dan katta bo'lishi kerak");
      return;
    }

    // Validatsiya: transport turi tanlanishi kerak
    if (!newOrder.vehicleType) {
      alert("Transport turini tanlang");
      return;
    }

    // Validatsiya: narx 0 dan katta bo'lishi kerak
    if (!newOrder.estimatedPrice || newOrder.estimatedPrice <= 0) {
      alert("Taklif qilinadigan summa 0 va undan kichik bo'lishi mumkin emas");
      return;
    }

    // Validatsiya: yetkazish sanasi tanlanishi kerak
    if (!newOrder.deliveryDateFrom) {
      alert("Yetkazish boshlanish sanasini tanlang");
      return;
    }

    if (!newOrder.deliveryDateTo) {
      alert("Yetkazish tugash sanasini tanlang");
      return;
    }

    // Validatsiya: tugash sanasi boshlanish sanasidan kech bo'lishi kerak
    if (newOrder.deliveryDateTo < newOrder.deliveryDateFrom) {
      alert("Tugash sanasi boshlanish sanasidan kech bo'lishi kerak");
      return;
    }

    // Form valid - create order
    alert("Jo'natma yaratildi! (Demo rejim)");
    
    // Reset form
    setNewOrder({
      pickup: "",
      dropoff: "",
      weight: "",
      vehicleType: "",
      notes: "",
      estimatedPrice: 500,
      deliveryDateFrom: undefined,
      deliveryDateTo: undefined,
    });
    
    // Switch to tracking tab
    setActiveTab("track");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center glow-accent">
              <Package className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">LogiPeek</h1>
              <p className="text-xs text-muted-foreground">Yuk beruvchi</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <LanguageSelector variant="light" />
            <button className="relative p-2 rounded-xl hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <button 
              onClick={() => setActiveTab("profile")}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <User className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-4 gap-3"
            >
              {[
                { label: t('shipper.track'), icon: MapPin, tab: "track" as const, color: "bg-primary text-primary-foreground" },
                { label: t('shipper.new'), icon: Plus, tab: "new" as const, color: "bg-accent text-accent-foreground" },
                { label: t('shipper.history'), icon: History, tab: "history" as const, color: "bg-secondary text-secondary-foreground" },
                { label: t('shipper.profile'), icon: User, tab: "profile" as const, color: "bg-muted text-foreground" },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => setActiveTab(action.tab)}
                  className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${
                    activeTab === action.tab 
                      ? action.color + " shadow-lg scale-105" 
                      : "glass-card hover:scale-105"
                  }`}
                >
                  <action.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{action.label}</span>
                </button>
              ))}
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {/* Tracking Tab */}
              {activeTab === "track" && selectedShipment && (
                <motion.div
                  key="track"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Status Timeline */}
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('tracking.activeShipment')}</p>
                        <p className="font-semibold text-foreground">{selectedShipment.id}</p>
                      </div>
                      <Badge className={
                        selectedShipment.status === "transit" ? "bg-warning/20 text-warning border-warning/30" :
                        selectedShipment.status === "arrived" ? "bg-success/20 text-success border-success/30" :
                        "bg-primary/20 text-primary border-primary/30"
                      }>
                        {statusSteps.find(s => s.key === selectedShipment.status)?.label}
                      </Badge>
                    </div>

                    {/* Timeline */}
                    <div className="relative flex items-center justify-between mb-6">
                      {statusSteps.map((step, index) => (
                        <div key={step.key} className="flex flex-col items-center z-10">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                            index <= currentStepIndex 
                              ? "bg-primary text-primary-foreground shadow-glow" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {index < currentStepIndex ? (
                              <CheckCircle2 className="w-6 h-6" />
                            ) : (
                              <step.icon className="w-5 h-5" />
                            )}
                          </div>
                          <p className={`text-xs mt-2 font-medium text-center ${
                            index <= currentStepIndex ? "text-primary" : "text-muted-foreground"
                          }`}>
                            {step.label}
                          </p>
                        </div>
                      ))}
                      
                      {/* Progress Line */}
                      <div className="absolute top-6 left-12 right-12 h-1 bg-muted">
                        <div 
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Route Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-success/10 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Circle className="w-3 h-3 text-success fill-success" />
                          <span className="text-xs text-muted-foreground">{t('tracking.pickupLocation')}</span>
                        </div>
                        <p className="font-medium text-foreground text-sm">{selectedShipment.pickup}</p>
                      </div>
                      <div className="p-4 bg-primary/10 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-3 h-3 text-primary" />
                          <span className="text-xs text-muted-foreground">{t('tracking.deliveryLocation')}</span>
                        </div>
                        <p className="font-medium text-foreground text-sm">{selectedShipment.dropoff}</p>
                      </div>
                    </div>

                    {/* Delivery Date Range */}
                    {(selectedShipment.deliveryDateFrom || selectedShipment.deliveryDateTo) && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {selectedShipment.deliveryDateFrom && (
                          <div className="p-4 bg-warning/10 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-3 h-3 text-warning" />
                              <span className="text-xs text-muted-foreground">Boshlanish sanasi</span>
                            </div>
                            <p className="font-medium text-foreground text-sm">
                              {new Date(selectedShipment.deliveryDateFrom).toLocaleDateString('uz-UZ')}
                            </p>
                          </div>
                        )}
                        {selectedShipment.deliveryDateTo && (
                          <div className="p-4 bg-info/10 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-3 h-3 text-info" />
                              <span className="text-xs text-muted-foreground">Tugash sanasi</span>
                            </div>
                            <p className="font-medium text-foreground text-sm">
                              {new Date(selectedShipment.deliveryDateTo).toLocaleDateString('uz-UZ')}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Map */}
                  <div className="rounded-2xl overflow-hidden h-[300px]">
                    <MapViewLive 
                      pickup={{ 
                        lat: 41.2995, 
                        lng: 69.2401, 
                        address: selectedShipment.pickup 
                      }}
                      dropoff={{ 
                        lat: 39.6542, 
                        lng: 66.9597, 
                        address: selectedShipment.dropoff 
                      }}
                      showAnimation
                      height="300px"
                    />
                  </div>

                  {/* ETA Card */}
                  <div className="glass-card p-4 bg-gradient-primary text-primary-foreground">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="w-6 h-6" />
                        <div>
                          <p className="text-sm opacity-80">Taxminiy yetib kelish</p>
                          <p className="text-2xl font-bold">{selectedShipment.eta}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-80">Umumiy narx</p>
                        <p className="text-xl font-semibold">${(selectedShipment.price || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipment Details */}
                  <div className="glass-card p-4">
                    <h3 className="font-semibold text-foreground mb-3">Jo'natma tafsilotlari</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl">
                        <Weight className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Og'irligi</p>
                          <p className="font-medium text-foreground">{selectedShipment.weight}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl">
                        <Truck className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Transport</p>
                          <p className="font-medium text-foreground">{selectedShipment.vehicleType}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* New Order Tab */}
              {activeTab === "new" && (
                <motion.div
                  key="new"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-card p-6"
                >
                  <h3 className="text-xl font-bold text-foreground mb-6">{t('shipper.createNewShipment')}</h3>
                  
                  <div className="space-y-5">
                    <div>
                      <Label className="text-muted-foreground mb-2 block">Olish manzili</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-success" />
                        <Input 
                          placeholder="Manzilni kiriting (kamida 3 ta harf)..." 
                          className="pl-11"
                          value={newOrder.pickup}
                          onChange={(e) => setNewOrder({ ...newOrder, pickup: e.target.value })}
                          minLength={3}
                        />
                      </div>
                      {newOrder.pickup && newOrder.pickup.trim().length < 3 && (
                        <p className="text-xs text-destructive mt-1">Kamida 3 ta harf kiriting</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-muted-foreground mb-2 block">Yetkazish manzili</Label>
                      <div className="relative">
                        <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                        <Input 
                          placeholder="Manzilni kiriting (kamida 3 ta harf)..." 
                          className="pl-11"
                          value={newOrder.dropoff}
                          onChange={(e) => setNewOrder({ ...newOrder, dropoff: e.target.value })}
                          minLength={3}
                        />
                      </div>
                      {newOrder.dropoff && newOrder.dropoff.trim().length < 3 && (
                        <p className="text-xs text-destructive mt-1">Kamida 3 ta harf kiriting</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground mb-2 block">Og'irligi (kg)</Label>
                        <div className="relative">
                          <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input 
                            type="number" 
                            placeholder="500"
                            className="pl-11"
                            value={newOrder.weight}
                            onChange={(e) => setNewOrder({ ...newOrder, weight: e.target.value })}
                            min="0.1"
                            step="0.1"
                          />
                        </div>
                        {newOrder.weight && parseFloat(newOrder.weight) <= 0 && (
                          <p className="text-xs text-destructive mt-1">Og'irlik 0 dan katta bo'lishi kerak</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-muted-foreground mb-2 block">Transport turi</Label>
                        <Select 
                          value={newOrder.vehicleType}
                          onValueChange={(value) => setNewOrder({ ...newOrder, vehicleType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Kichik yuk (1-2t)</SelectItem>
                            <SelectItem value="medium">O'rta yuk (3-5t)</SelectItem>
                            <SelectItem value="large">Katta yuk (10t+)</SelectItem>
                            <SelectItem value="special">Maxsus transport</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-muted-foreground mb-2 block">Qo'shimcha izohlar</Label>
                      <Input 
                        placeholder="Mo'rt yuk, ehtiyot bo'ling..."
                        value={newOrder.notes}
                        onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                      />
                    </div>

                    {/* Delivery Date Range */}
                    <div>
                      <Label className="text-muted-foreground mb-2 block">Yetkazish muddati</Label>
                      <DateRangePicker
                        dateFrom={newOrder.deliveryDateFrom}
                        dateTo={newOrder.deliveryDateTo}
                        onDateFromChange={(date) => setNewOrder({ ...newOrder, deliveryDateFrom: date })}
                        onDateToChange={(date) => setNewOrder({ ...newOrder, deliveryDateTo: date })}
                        placeholderFrom="Boshlanish sanasi"
                        placeholderTo="Tugash sanasi"
                      />
                      {newOrder.deliveryDateFrom && newOrder.deliveryDateTo && newOrder.deliveryDateTo < newOrder.deliveryDateFrom && (
                        <p className="text-xs text-destructive mt-1">Tugash sanasi boshlanish sanasidan kech bo'lishi kerak</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Yukni qachon yetkazish kerakligini belgilang
                      </p>
                    </div>

                    {/* Price Input */}
                    <div>
                      <Label className="text-muted-foreground mb-2 block">Taklif qilinadigan summani kiriting (USD)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input 
                          type="number" 
                          placeholder="500"
                          className="pl-11"
                          value={newOrder.estimatedPrice}
                          onChange={(e) => setNewOrder({ ...newOrder, estimatedPrice: parseFloat(e.target.value) || 0 })}
                          min="10"
                          step="10"
                        />
                      </div>
                      {newOrder.estimatedPrice && newOrder.estimatedPrice < 10 && (
                        <p className="text-xs text-destructive mt-1">Kamida $10 bo'lishi kerak</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Haydovchilar sizning taklifingizni ko'rib, qabul qilishlari mumkin
                      </p>
                    </div>

                    <Button 
                      className="w-full btn-gradient py-6 text-lg"
                      onClick={handleCreateOrder}
                    >
                      <Truck className="w-5 h-5 mr-2" />
                      Haydovchilarni topish
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* History Tab */}
              {activeTab === "history" && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="Buyurtmalarni qidirish..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">{t('shipper.orderHistory')}</h2>
                    <Badge variant="secondary">{filteredHistory.length} ta</Badge>
                  </div>

                  {filteredHistory.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-card p-4 card-hover cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            order.status === "completed" ? "bg-success/10" : "bg-destructive/10"
                          }`}>
                            {order.status === "completed" ? (
                              <CheckCircle2 className="w-6 h-6 text-success" />
                            ) : (
                              <X className="w-6 h-6 text-destructive" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{order.from} → {order.to}</p>
                            <p className="text-sm text-muted-foreground">{order.id} • {order.date}</p>
                            {order.driverName && (
                              <p className="text-xs text-muted-foreground">Haydovchi: {order.driverName}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">${(order.price || 0).toLocaleString()}</p>
                          <Badge 
                            variant="secondary" 
                            className={order.status === "completed" ? "" : "bg-destructive/20 text-destructive"}
                          >
                            {order.status === "completed" ? "Bajarildi" : "Bekor qilindi"}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {filteredHistory.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">Buyurtma topilmadi</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Profile Card */}
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center text-3xl font-bold text-accent-foreground">
                        {userProfile.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">{userProfile.name}</h2>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Building2 className="w-4 h-4" /> {userProfile.company}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{userProfile.ordersCount} ta jo'natma</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-muted-foreground" />
                          <span className="text-muted-foreground">{t('profile.phone')}</span>
                        </div>
                        <span className="font-medium text-foreground">{userProfile.phone}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <span className="text-muted-foreground">Email</span>
                        </div>
                        <span className="font-medium text-foreground">{userProfile.email}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                          <span className="text-muted-foreground">{t('profile.memberSince')}</span>
                        </div>
                        <span className="font-medium text-foreground">{userProfile.joinDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-4 text-center">
                      <Package className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">45</p>
                      <p className="text-sm text-muted-foreground">{t('profile.totalShipments')}</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                      <DollarSign className="w-8 h-8 text-success mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">12.5M</p>
                      <p className="text-sm text-muted-foreground">Jami sarflangan</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    {[
                      { icon: CreditCard, label: "To'lov usullari", color: "text-success" },
                      { icon: Building2, label: "Kompaniya ma'lumotlari", color: "text-primary" },
                      { icon: Settings, label: "Sozlamalar", color: "text-muted-foreground" },
                      { icon: HelpCircle, label: "Yordam markazi", color: "text-info" },
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Driver Info (only show when tracking) */}
          {activeTab === "track" && selectedShipment?.driver && (
            <div className="lg:col-span-2 space-y-6">
              {/* Driver Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">Haydovchi ma'lumotlari</h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-primary-foreground text-2xl font-bold">
                    {selectedShipment.driver.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-lg">{selectedShipment.driver.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span className="font-medium text-foreground">{selectedShipment.driver.rating}</span>
                      <span className="text-muted-foreground text-sm">• 156 ta sayohat</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-muted-foreground">Avtomobil</span>
                    <span className="font-medium text-foreground">{selectedShipment.driver.vehicle}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-muted-foreground">Raqami</span>
                    <span className="font-medium text-foreground">{selectedShipment.driver.plate}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      if (selectedShipment?.driver?.phone) {
                        setDriverPhone(selectedShipment.driver.phone);
                        setShowPhoneDialog(true);
                      } else {
                        alert(t('contact.phoneNotFound'));
                      }
                    }}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Qo'ng'iroq
                  </Button>
                  <Button 
                    className="w-full bg-primary"
                    onClick={() => {
                      setShowMessageDialog(true);
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Xabar
                  </Button>
                </div>
              </motion.div>

              {/* Payment Summary */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">To'lov ma'lumotlari</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Asosiy narx</span>
                    <span className="text-foreground">$450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Masofa uchun</span>
                    <span className="text-foreground">$120</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Xizmat haqi</span>
                    <span className="text-foreground">$10</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold text-foreground">Jami</span>
                    <span className="font-bold text-primary text-lg">$580</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Hisob-fakturani ko'rish
                </Button>
              </motion.div>

              {/* Help */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-4"
              >
                <button className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-info" />
                    </div>
                    <span className="font-medium text-foreground">Yordam kerakmi?</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-border/50 px-4 py-2 lg:hidden safe-area-bottom">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {[
            { icon: MapPin, label: t('shipper.track'), tab: "track" as const },
            { icon: Plus, label: t('shipper.new'), tab: "new" as const },
            { icon: History, label: t('shipper.history'), tab: "history" as const },
            { icon: User, label: t('shipper.profile'), tab: "profile" as const },
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

      {/* Phone Dialog */}
      <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              {t('contact.driverPhone')}
            </DialogTitle>
            <DialogDescription>
              {t('contact.driverContact')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary mb-2">{driverPhone}</p>
              <Button 
                className="mt-4"
                onClick={() => {
                  window.location.href = `tel:${driverPhone}`;
                }}
              >
                <Phone className="w-4 h-4 mr-2" />
                {t('contact.callButton')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Xabar yuborish
            </DialogTitle>
            <DialogDescription>
              Bu funksiya hozircha ishlab chiqilmoqda
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-foreground mb-2">
                Hali jarayonda ishlab chiqilmoqda
              </p>
              <p className="text-sm text-muted-foreground">
                Tez orada xabar yuborish imkoniyati qo'shiladi
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShipperDashboard;
