import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, MapPin, Plus, Clock, Truck, Star, 
  Phone, MessageCircle, ChevronRight, Search,
  CreditCard, FileText, Bell, User, CheckCircle2,
  Circle, X, Calendar, Settings,
  HelpCircle, LogOut, History, Navigation, 
  Building2, Weight, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DateRangePicker } from "@/components/ui/date-picker";
import MapViewLive from "./MapViewLive";
import MapViewDriver from "./MapViewDriver";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useShipments, useCreateShipment } from "@/hooks/useShipments";
import { useUnreadCount } from "@/hooks/useNotifications";
import { useConfirmDelivery } from "@/hooks/useOrders";
import { toast } from "sonner";
import { SettingsDialog } from "./SettingsDialog";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSelector } from "./LanguageSelector";

type OrderStatus = "pending" | "accepted" | "pickup" | "transit" | "arrived" | "completed";

import { NotificationsDropdown } from "./NotificationsDropdown";

const ShipperDashboardIntegrated = () => {
  const { user, logout, refreshUser } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"track" | "new" | "history" | "profile">("track");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [driverPhone, setDriverPhone] = useState("");
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [rating, setRating] = useState(5);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  // Format duration to hours and minutes
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    
    if (hours > 0) {
      return `${hours}s ${remainingMinutes}d`;
    } else {
      return `${remainingMinutes}d`;
    }
  };

  // Mock data - only used when no real API data is available
  const mockShipments = [
    {
      id: "SHP-2024-0001",
      orderNumber: "SHP-2024-0001",
      pickupAddress: "Tashkent, Mirabad tumani",
      dropoffAddress: "Samarkand, Registon maydoni",
      status: "accepted", // Match real API data status
      driver: {
        fullName: "Javohir Karimov",
        phone: "+998 90 123 45 67",
        driverProfile: {
          rating: 4.9,
          vehicleModel: "Isuzu NPR",
          licensePlate: "01 A 777 BA",
          totalTrips: 156
        }
      },
      estimatedPrice: 580000,
      distanceKm: 298,
      weight: 750,
      vehicleTypeRequired: "Yuk mashinasi",
      createdAt: new Date().toISOString()
    }
  ];

  const mockCompletedShipments = [
    { id: "SHP-2024-0002", orderNumber: "SHP-2024-0002", pickupAddress: "Tashkent", dropoffAddress: "Buxoro", status: "completed", createdAt: new Date(Date.now() - 86400000).toISOString(), estimatedPrice: 720 },
    { id: "SHP-2024-0003", orderNumber: "SHP-2024-0003", pickupAddress: "Tashkent", dropoffAddress: "Farg'ona", status: "completed", createdAt: new Date(Date.now() - 172800000).toISOString(), estimatedPrice: 450 },
    { id: "SHP-2024-0004", orderNumber: "SHP-2024-0004", pickupAddress: "Tashkent", dropoffAddress: "Namangan", status: "cancelled", createdAt: new Date(Date.now() - 259200000).toISOString(), estimatedPrice: 380 },
  ];

  // API Hooks (with fallback to mock data)
  const { data: apiShipments, isLoading } = useShipments();
  const { data: unreadCount } = useUnreadCount();
  const createShipment = useCreateShipment();
  const confirmDelivery = useConfirmDelivery();

  // Use API data if available, otherwise use mock data
  const shipments = apiShipments && apiShipments.length > 0 ? apiShipments : [...mockShipments, ...mockCompletedShipments];

  // Filter shipments
  const activeShipments = shipments.filter((s: any) => 
    ['pending', 'accepted', 'pickup', 'transit', 'delivered'].includes(s.status)
  );
  const completedShipments = shipments.filter((s: any) => 
    ['completed', 'cancelled'].includes(s.status)
  );
  const selectedShipment = activeShipments[0] || null;

  // Check if shipment is delivered and show confirmation dialog
  useEffect(() => {
    if (selectedShipment && selectedShipment.status === 'delivered') {
      setShowConfirmDialog(true);
    }
  }, [selectedShipment]);

  // Show confirmation button when shipment is delivered
  const showConfirmButton = selectedShipment && selectedShipment.status === 'delivered';

  // New order form state
  const [newOrder, setNewOrder] = useState({
    pickupAddress: "",
    pickupLatitude: 41.2995,
    pickupLongitude: 69.2401,
    dropoffAddress: "",
    dropoffLatitude: 39.6542,
    dropoffLongitude: 66.9597,
    weight: "",
    vehicleTypeRequired: "",
    description: "",
    estimatedPrice: 500,
    paymentMethod: "",
    distanceKm: 0,
    deliveryDateFrom: undefined as Date | undefined,
    deliveryDateTo: undefined as Date | undefined,
  });

  const handleCreateShipment = async () => {
    // Validatsiya: manzillar kamida 3 ta harf bo'lishi kerak
    if (!newOrder.pickupAddress || newOrder.pickupAddress.trim().length < 3) {
      toast.error(t('shipper.pickupAddressError'));
      return;
    }

    if (!newOrder.dropoffAddress || newOrder.dropoffAddress.trim().length < 3) {
      toast.error(t('shipper.dropoffAddressError'));
      return;
    }

    // Validatsiya: og'irlik 0 dan katta bo'lishi kerak
    const weight = parseFloat(newOrder.weight);
    if (!newOrder.weight || isNaN(weight) || weight <= 0) {
      toast.error("Og'irlik 0 dan katta bo'lishi kerak");
      return;
    }

    // Validatsiya: transport turi tanlanishi kerak
    if (!newOrder.vehicleTypeRequired) {
      toast.error(t('message.selectVehicleType'));
      return;
    }

    // Validatsiya: narx 0 dan katta bo'lishi kerak
    if (!newOrder.estimatedPrice || newOrder.estimatedPrice <= 0) {
      toast.error("Taklif qilinadigan summa 0 va undan kichik bo'lishi mumkin emas");
      return;
    }

    // Validatsiya: to'lov usuli tanlanishi kerak
    if (!newOrder.paymentMethod) {
      toast.error(t('message.selectPaymentMethod'));
      return;
    }

    // Validatsiya: yetkazish sanasi tanlanishi kerak
    if (!newOrder.deliveryDateFrom) {
      toast.error(t('shipper.selectStartDateError'));
      return;
    }

    if (!newOrder.deliveryDateTo) {
      toast.error(t('shipper.selectEndDateError'));
      return;
    }

    // Validatsiya: tugash sanasi boshlanish sanasidan kech bo'lishi kerak
    if (newOrder.deliveryDateTo < newOrder.deliveryDateFrom) {
      toast.error(t('message.endDateAfterStart'));
      return;
    }

    try {
      await createShipment.mutateAsync({
        ...newOrder,
        weight: weight,
        deliveryDateFrom: newOrder.deliveryDateFrom?.toISOString(),
        deliveryDateTo: newOrder.deliveryDateTo?.toISOString(),
      });
      setNewOrder({
        pickupAddress: "",
        pickupLatitude: 41.2995,
        pickupLongitude: 69.2401,
        dropoffAddress: "",
        dropoffLatitude: 39.6542,
        dropoffLongitude: 66.9597,
        weight: "",
        vehicleTypeRequired: "",
        description: "",
        estimatedPrice: 500,
        paymentMethod: "",
        distanceKm: 0,
        deliveryDateFrom: undefined,
        deliveryDateTo: undefined,
      });
      setActiveTab("track");
      // toast.success("Jo'natma yaratildi!"); // Removed notification
    } catch (error) {
      toast.error(t('message.error'));
    }
  };

  const handleConfirmDelivery = async () => {
    if (!selectedShipment) return;
    
    try {
      await confirmDelivery.mutateAsync({
        orderId: selectedShipment.id,
        rating
      });
      setShowConfirmDialog(false);
      // Refresh will happen automatically via query invalidation
    } catch (error) {
      console.error('Confirm delivery error:', error);
      // For mock orders, still show success
      if (selectedShipment.id.startsWith('SHP-') || selectedShipment.id.startsWith('ORD-')) {
        toast.success(`Yetkazilish tasdiqlandi! Haydovchi ${rating} yulduz oldi. (Mock mode)`);
        setShowConfirmDialog(false);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error("Xatolik yuz berdi");
      }
    }
  };

  // User profile
  const userProfile = {
    name: user?.fullName || "User",
    company: "SardorTrade LLC",
    phone: user?.phone || "",
    email: user?.email || "",
    ordersCount: shipments.length,
    joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long' }) : "N/A"
  };

  const statusSteps = [
    { key: "pending", label: t('status.pending'), icon: Clock },
    { key: "pickup", label: t('status.pickup'), icon: Package },
    { key: "transit", label: t('status.transit'), icon: Truck },
    { key: "arrived", label: t('status.delivered'), icon: MapPin },
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.key === selectedShipment?.status);

  const filteredHistory = completedShipments.filter((order: any) => 
    order.pickupAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.dropoffAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                { label: t('dashboard.track'), icon: MapPin, tab: "track" as const, color: "bg-primary text-primary-foreground" },
                { label: t('dashboard.new'), icon: Plus, tab: "new" as const, color: "bg-accent text-accent-foreground" },
                { label: t('dashboard.history'), icon: History, tab: "history" as const, color: "bg-secondary text-secondary-foreground" },
                { label: t('dashboard.profile'), icon: User, tab: "profile" as const, color: "bg-muted text-foreground" },
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
              {activeTab === "track" && (
                <motion.div
                  key="track"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : selectedShipment ? (
                    <>
                      {/* Status Timeline */}
                      <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <p className="text-sm text-muted-foreground">{t('tracking.activeShipment')}</p>
                            <p className="font-semibold text-foreground">{selectedShipment.orderNumber}</p>
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
                            <p className="font-medium text-foreground text-sm">{selectedShipment.pickupAddress}</p>
                          </div>
                          <div className="p-4 bg-primary/10 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-3 h-3 text-primary" />
                              <span className="text-xs text-muted-foreground">{t('tracking.deliveryLocation')}</span>
                            </div>
                            <p className="font-medium text-foreground text-sm">{selectedShipment.dropoffAddress}</p>
                          </div>
                        </div>

                        {/* Delivery Date Range */}
                        {(selectedShipment.deliveryDateFrom || selectedShipment.deliveryDateTo) && (
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            {selectedShipment.deliveryDateFrom && (
                              <div className="p-4 bg-warning/10 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                  <Calendar className="w-3 h-3 text-warning" />
                                  <span className="text-xs text-muted-foreground">{t('shipper.startDate')}</span>
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
                                  <span className="text-xs text-muted-foreground">{t('shipper.endDate')}</span>
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
                      <div className="rounded-2xl overflow-hidden h-[300px] relative z-0">
                        {selectedShipment.driver?.driverProfile?.currentLatitude && 
                         selectedShipment.driver?.driverProfile?.currentLongitude ? (
                          <MapViewDriver 
                            driverLocation={{
                              lat: selectedShipment.driver.driverProfile.currentLatitude,
                              lng: selectedShipment.driver.driverProfile.currentLongitude
                            }}
                            pickup={{ 
                              lat: 41.2995, 
                              lng: 69.2401, 
                              address: selectedShipment.pickupAddress 
                            }}
                            dropoff={{ 
                              lat: 39.6542, 
                              lng: 66.9597, 
                              address: selectedShipment.dropoffAddress 
                            }}
                            showRoute={true}
                            height="300px"
                            onRouteCalculated={(distance, duration) => {
                              setRouteInfo({ distance, duration });
                            }}
                          />
                        ) : (
                          <MapViewLive 
                            pickup={{ 
                              lat: 41.2995, 
                              lng: 69.2401, 
                              address: selectedShipment.pickupAddress 
                            }}
                            dropoff={{ 
                              lat: 39.6542, 
                              lng: 66.9597, 
                              address: selectedShipment.dropoffAddress 
                            }}
                            showAnimation
                            height="300px"
                          />
                        )}
                      </div>

                      {/* ETA Card */}
                      <div className="glass-card p-4 bg-gradient-primary text-primary-foreground">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Clock className="w-6 h-6" />
                            <div>
                              <p className="text-sm opacity-80">
                                {routeInfo ? "Taxminiy yetkazish vaqti" : "Umumiy narx"}
                              </p>
                              <p className="text-2xl font-bold">
                                {routeInfo 
                                  ? `~${formatDuration(routeInfo.duration)}` 
                                  : `$${selectedShipment.estimatedPrice?.toLocaleString()}`
                                }
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm opacity-80">
                              {routeInfo ? t('tracking.totalDistance') : t('tracking.distance')}
                            </p>
                            <p className="text-xl font-semibold">
                              {routeInfo 
                                ? `${routeInfo.distance} km` 
                                : `${selectedShipment.distanceKm || 0} km`
                              }
                            </p>
                          </div>
                        </div>
                        {routeInfo && (
                          <div className="mt-3 pt-3 border-t border-white/20">
                            <p className="text-xs opacity-80">Umumiy narx: ${selectedShipment.estimatedPrice?.toLocaleString()}</p>
                          </div>
                        )}
                        {showConfirmButton && (
                          <div className="mt-3 pt-3 border-t border-white/20">
                            <Button
                              variant="secondary"
                              className="w-full bg-white text-primary hover:bg-white/90"
                              onClick={() => setShowConfirmDialog(true)}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Yetkazilishni tasdiqlash
                            </Button>
                          </div>
                        )}
                        {/* Test button to simulate driver marking as delivered */}
                        {selectedShipment && selectedShipment.status === 'accepted' && (
                          <div className="mt-3 pt-3 border-t border-white/20">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-yellow-500/10 text-yellow-600 border-yellow-500/30 hover:bg-yellow-500/20"
                              onClick={async () => {
                                // Simulate driver marking as delivered (for testing)
                                if (selectedShipment.id.startsWith('SHP-') || selectedShipment.id.startsWith('ORD-')) {
                                  // For mock data, just show a message
                                  toast.success("Test: Haydovchi 'Yuk yetkazildi' tugmasini bosdi (Mock mode)");
                                } else {
                                  // For real data, call the simulateDelivered endpoint
                                  try {
                                    const response = await fetch(`http://localhost:5000/api/v1/orders/${selectedShipment.id}/simulate-delivered`, {
                                      method: 'POST',
                                      headers: {
                                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                        'Content-Type': 'application/json'
                                      }
                                    });
                                    
                                    if (response.ok) {
                                      toast.success("Haydovchi yukni yetkazdi! Endi tasdiqlashingiz mumkin.");
                                      // Refresh the page to show updated status
                                      setTimeout(() => window.location.reload(), 1500);
                                    } else {
                                      toast.error("Xatolik yuz berdi");
                                    }
                                  } catch (error) {
                                    console.error('Mark as delivered error:', error);
                                    toast.error("Xatolik yuz berdi");
                                  }
                                }
                              }}
                            >
                              🚛 Test: Haydovchi "Yuk yetkazildi" tugmasini bosish
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">{t('profile.noActiveShipments')}</p>
                      <Button className="mt-4" onClick={() => setActiveTab("new")}>
                        <Plus className="w-4 h-4 mr-2" />
                        {t('shipper.createNewShipment')}
                      </Button>
                    </div>
                  )}
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
                      <Label className="text-muted-foreground mb-2 block">{t('shipper.pickupAddress')}</Label>
                      <AddressAutocomplete
                        value={newOrder.pickupAddress}
                        onChange={(address, lat, lng) => {
                          setNewOrder({ 
                            ...newOrder, 
                            pickupAddress: address,
                            pickupLatitude: lat || newOrder.pickupLatitude,
                            pickupLongitude: lng || newOrder.pickupLongitude
                          });
                        }}
                        placeholder="Manzilni kiriting (kamida 3 ta harf)..."
                        icon={<MapPin className="w-5 h-5 text-success" />}
                      />
                      {newOrder.pickupAddress && newOrder.pickupAddress.trim().length < 3 && (
                        <p className="text-xs text-destructive mt-1">Kamida 3 ta harf kiriting</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-muted-foreground mb-2 block">{t('shipper.dropoffAddress')}</Label>
                      <AddressAutocomplete
                        value={newOrder.dropoffAddress}
                        onChange={(address, lat, lng) => {
                          setNewOrder({ 
                            ...newOrder, 
                            dropoffAddress: address,
                            dropoffLatitude: lat || newOrder.dropoffLatitude,
                            dropoffLongitude: lng || newOrder.dropoffLongitude
                          });
                        }}
                        placeholder="Manzilni kiriting (kamida 3 ta harf)..."
                        icon={<Navigation className="w-5 h-5 text-primary" />}
                      />
                      {newOrder.dropoffAddress && newOrder.dropoffAddress.trim().length < 3 && (
                        <p className="text-xs text-destructive mt-1">Kamida 3 ta harf kiriting</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground mb-2 block">{t('shipper.weight')}</Label>
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
                        <Label className="text-muted-foreground mb-2 block">{t('shipper.vehicleType')}</Label>
                        <Select 
                          value={newOrder.vehicleTypeRequired}
                          onValueChange={(value) => setNewOrder({ ...newOrder, vehicleTypeRequired: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('shipper.selectVehicleType')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Kichik yuk (1-2t)</SelectItem>
                            <SelectItem value="medium">O'rta yuk (3-5t)</SelectItem>
                            <SelectItem value="large">Katta yuk (10t+)</SelectItem>
                            <SelectItem value="truck">Yuk mashinasi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-muted-foreground mb-2 block">{t('shipper.additionalNotes')}</Label>
                      <Input 
                        placeholder="Mo'rt yuk, ehtiyot bo'ling..."
                        value={newOrder.description}
                        onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
                      />
                    </div>

                    {/* Delivery Date Range */}
                    <div>
                      <Label className="text-muted-foreground mb-2 block">{t('shipper.deliveryPeriod')}</Label>
                      <DateRangePicker
                        dateFrom={newOrder.deliveryDateFrom}
                        dateTo={newOrder.deliveryDateTo}
                        onDateFromChange={(date) => setNewOrder({ ...newOrder, deliveryDateFrom: date })}
                        onDateToChange={(date) => setNewOrder({ ...newOrder, deliveryDateTo: date })}
                        placeholderFrom={t('shipper.startDate')}
                        placeholderTo={t('shipper.endDate')}
                      />
                      {newOrder.deliveryDateFrom && newOrder.deliveryDateTo && newOrder.deliveryDateTo < newOrder.deliveryDateFrom && (
                        <p className="text-xs text-destructive mt-1">{t('shipper.endDateAfterStartError')}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('shipper.deliveryDateNote')}
                      </p>
                    </div>

                    {/* Price Input */}
                    <div>
                      <Label className="text-muted-foreground mb-2 block">{t('shipper.suggestedPrice')}</Label>
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
                        {t('shipper.priceNote')}
                      </p>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <Label className="text-muted-foreground mb-2 block">{t('shipper.paymentMethod')}</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 'payme', label: 'Payme', icon: '💳', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
                          { value: 'click', label: 'Click', icon: '💳', color: 'bg-green-50 border-green-200 hover:bg-green-100' },
                          { value: 'uzcard', label: 'UzCard', icon: '💳', color: 'bg-purple-50 border-purple-200 hover:bg-purple-100' },
                          { value: 'humo', label: 'Humo', icon: '💳', color: 'bg-orange-50 border-orange-200 hover:bg-orange-100' },
                          { value: 'bank', label: 'Bank', icon: '🏦', color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100' },
                        ].map((method) => (
                          <button
                            key={method.value}
                            type="button"
                            onClick={() => setNewOrder({ ...newOrder, paymentMethod: method.value })}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              newOrder.paymentMethod === method.value
                                ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                                : method.color
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-2xl">{method.icon}</span>
                              <span className="text-sm font-medium text-foreground">{method.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {t('shipper.paymentNote')}
                      </p>
                    </div>

                    <Button 
                      className="w-full btn-gradient py-6 text-lg"
                      onClick={handleCreateShipment}
                      disabled={createShipment.isPending}
                    >
                      <Truck className="w-5 h-5 mr-2" />
                      {createShipment.isPending ? t('message.loading') : t('shipper.findDrivers')}
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

                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : (
                    filteredHistory.map((order: any, index: number) => (
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
                              <p className="font-semibold text-foreground">{order.pickupAddress} → {order.dropoffAddress}</p>
                              <p className="text-sm text-muted-foreground">{order.orderNumber} • {new Date(order.createdAt).toLocaleDateString('uz-UZ')}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">${order.estimatedPrice?.toLocaleString()}</p>
                            <Badge 
                              variant="secondary" 
                              className={order.status === "completed" ? "" : "bg-destructive/20 text-destructive"}
                            >
                              {order.status === "completed" ? "Bajarildi" : "Bekor qilindi"}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}

                  {!isLoading && filteredHistory.length === 0 && (
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
                      <p className="text-2xl font-bold text-foreground">{userProfile.ordersCount}</p>
                      <p className="text-sm text-muted-foreground">{t('profile.totalShipments')}</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                      <DollarSign className="w-8 h-8 text-success mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">{activeShipments.length}</p>
                      <p className="text-sm text-muted-foreground">{t('profile.activeShipments')}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button 
                      className="w-full glass-card p-4 flex items-center gap-3 hover:bg-accent/10 transition-colors" 
                      onClick={() => setShowSettingsDialog(true)}
                    >
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">Sozlamalar</span>
                    </button>
                    <button className="w-full glass-card p-4 flex items-center gap-3 text-destructive hover:bg-destructive/10 transition-colors" onClick={logout}>
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Haydovchi ma'lumotlari</h3>
                  {selectedShipment.driver.driverProfile?.currentLatitude && 
                   selectedShipment.driver.driverProfile?.currentLongitude && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-success/10 rounded-full">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      <span className="text-xs font-medium text-success">Jonli kuzatuv</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-primary-foreground text-2xl font-bold">
                    {selectedShipment.driver.fullName?.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-lg">{selectedShipment.driver.fullName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span className="font-medium text-foreground">{selectedShipment.driver.driverProfile?.rating || 5.0}</span>
                      <span className="text-muted-foreground text-sm">• {selectedShipment.driver.driverProfile?.totalTrips || 0} ta sayohat</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-muted-foreground">Avtomobil</span>
                    <span className="font-medium text-foreground">{selectedShipment.driver.driverProfile?.vehicleModel || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-muted-foreground">Raqami</span>
                    <span className="font-medium text-foreground">{selectedShipment.driver.driverProfile?.licensePlate || 'N/A'}</span>
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
                        toast.error(t('contact.phoneNotFound'));
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
            </div>
          )}
        </div>
      </main>

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

      {/* Delivery Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Yetkazilishni tasdiqlash
            </DialogTitle>
            <DialogDescription>
              Haydovchi yukni yetkazib berdi. Iltimos, yetkazilishni tasdiqlang va haydovchini baholang.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-6">
            {/* Driver Info */}
            {selectedShipment?.driver && (
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  {selectedShipment.driver.fullName?.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedShipment.driver.fullName}</p>
                  <p className="text-sm text-muted-foreground">{selectedShipment.driver.driverProfile?.vehicleModel}</p>
                </div>
              </div>
            )}

            {/* Rating */}
            <div>
              <Label className="text-muted-foreground mb-3 block">Haydovchini baholang</Label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= rating
                          ? 'text-warning fill-warning'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                {rating === 5 ? 'A\'lo!' : rating === 4 ? 'Yaxshi' : rating === 3 ? 'O\'rtacha' : rating === 2 ? 'Yomon' : 'Juda yomon'}
              </p>
            </div>

            {/* Order Info */}
            <div className="p-4 bg-success/10 rounded-xl border border-success/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{t('notifications.orderNumber')}</span>
                <span className="font-medium text-foreground">{selectedShipment?.orderNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">To'lov summasi</span>
                <span className="font-bold text-success">${selectedShipment?.estimatedPrice?.toLocaleString()}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirmDialog(false)}
              >
                Bekor qilish
              </Button>
              <Button
                className="flex-1 bg-success hover:bg-success/90"
                onClick={handleConfirmDelivery}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Tasdiqlash
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      {user && (
        <SettingsDialog
          open={showSettingsDialog}
          onOpenChange={setShowSettingsDialog}
          user={user}
          onUpdate={refreshUser}
        />
      )}
    </div>
  );
};

export default ShipperDashboardIntegrated;
