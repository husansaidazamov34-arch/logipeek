import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Truck, MapPin, DollarSign, Bell, CheckCircle, X, Navigation, Clock, Star,
  Wifi, WifiOff, Phone, Settings, User, LogOut, Package, Award, TrendingUp,
  Calendar, Weight, FileText, ChevronRight, AlertTriangle, Upload, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MapViewDriver from "./MapViewDriver";
import MapViewAllDrivers from "./MapViewAllDrivers";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAvailableOrders, useActiveOrders, useOrderHistory, useAcceptOrder, useMarkAsDelivered } from "@/hooks/useOrders";
import { useUpdateDriverStatus, useDriverStats, useOnlineDrivers, useUpdateDriverLocation } from "@/hooks/useDriver";
import { useDriverProfile, useUpdateLicenseImage } from "@/hooks/useDriverProfile";
import { useUnreadCount } from "@/hooks/useNotifications";
import { toast } from "sonner";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { SettingsDialog } from "./SettingsDialog";
import { LicenseImageUpload } from "./LicenseImageUpload";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSelector } from "./LanguageSelector";

type DriverStatus = "online" | "busy" | "offline";

const DriverDashboardWeb = () => {
  const { user, logout, refreshUser } = useAuth();
  const { t } = useTranslation();
  const [status, setStatus] = useState<DriverStatus>("offline");
  const [activeOrder, setActiveOrder] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("available");
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<{name: string, phone: string}>({name: "", phone: ""});
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showLicenseUploadDialog, setShowLicenseUploadDialog] = useState(false);

  // Hooks
  const { data: driverProfile, isLoading: profileLoading } = useDriverProfile();
  const updateLicenseImageMutation = useUpdateLicenseImage();

  // Mock data
  const mockAvailableOrders = [
    { 
      id: "ORD-001", 
      pickupAddress: "Tashkent, Chilanzar", 
      dropoffAddress: "Samarkand, Center", 
      distanceKm: 298, 
      estimatedPrice: 500, 
      weight: 500, 
      vehicleTypeRequired: "Yuk mashinasi",
      deliveryDateFrom: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      deliveryDateTo: new Date(Date.now() + 259200000).toISOString(), // 3 days later
      shipper: {
        fullName: "Akmal Karimov",
        phone: "+998 90 123 45 67"
      }
    },
    { 
      id: "ORD-002", 
      pickupAddress: "Tashkent, Mirzo Ulugbek", 
      dropoffAddress: "Bukhara, Old City", 
      distanceKm: 420, 
      estimatedPrice: 680000, 
      weight: 750, 
      vehicleTypeRequired: "Yuk mashinasi", 
      urgent: true,
      deliveryDateFrom: new Date(Date.now() + 43200000).toISOString(), // 12 hours later
      deliveryDateTo: new Date(Date.now() + 172800000).toISOString(), // 2 days later
      shipper: {
        fullName: "Dilnoza Rahimova",
        phone: "+998 91 234 56 78"
      }
    },
    { 
      id: "ORD-003", 
      pickupAddress: "Tashkent, Sergeli", 
      dropoffAddress: "Fergana, Industrial", 
      distanceKm: 310, 
      estimatedPrice: 520000, 
      weight: 1200, 
      vehicleTypeRequired: "Katta yuk",
      deliveryDateFrom: new Date(Date.now() + 172800000).toISOString(), // 2 days later
      deliveryDateTo: new Date(Date.now() + 432000000).toISOString(), // 5 days later
      shipper: {
        fullName: "Bobur Toshmatov",
        phone: "+998 93 345 67 89"
      }
    },
  ];

  const mockOrderHistory = [
    { 
      id: "ORD-100", 
      pickupAddress: "Tashkent", 
      dropoffAddress: "Samarkand", 
      completedAt: new Date().toISOString(), 
      finalPrice: 380000 
    },
    { 
      id: "ORD-099", 
      pickupAddress: "Tashkent", 
      dropoffAddress: "Namangan", 
      completedAt: new Date(Date.now() - 86400000).toISOString(), 
      finalPrice: 520000 
    },
  ];

  // API Hooks
  const { data: apiAvailableOrders } = useAvailableOrders();
  const { data: apiActiveOrders } = useActiveOrders();
  const { data: apiOrderHistory } = useOrderHistory();
  const { data: stats } = useDriverStats();
  const { data: unreadCount } = useUnreadCount();
  const { data: onlineDrivers } = useOnlineDrivers();
  const updateStatus = useUpdateDriverStatus();
  const acceptOrder = useAcceptOrder();
  const updateLocation = useUpdateDriverLocation();
  const markAsDelivered = useMarkAsDelivered();

  const availableOrders = apiAvailableOrders && apiAvailableOrders.length > 0 ? apiAvailableOrders : mockAvailableOrders;
  const orderHistory = apiOrderHistory && apiOrderHistory.length > 0 ? apiOrderHistory : mockOrderHistory;

  // Mock drivers for map (Global - Asia and Europe)
  const mockDrivers = [
    // Tashkent, Uzbekistan
    {
      id: "driver-1",
      userId: "user-1",
      vehicleModel: "Isuzu NPR 75",
      licensePlate: "01 A 123 BC",
      status: "online" as const,
      currentLatitude: 41.3111,
      currentLongitude: 69.2797,
      user: { fullName: "Javohir Karimov" }
    },
    // Samarkand, Uzbekistan
    {
      id: "driver-2",
      userId: "user-2",
      vehicleModel: "Hyundai HD78",
      licensePlate: "01 B 456 DE",
      status: "busy" as const,
      currentLatitude: 39.6542,
      currentLongitude: 66.9597,
      user: { fullName: "Sardor Toshmatov" }
    },
    // Almaty, Kazakhstan
    {
      id: "driver-3",
      userId: "user-3",
      vehicleModel: "Kamaz 5320",
      licensePlate: "KZ C 789 FG",
      status: "online" as const,
      currentLatitude: 43.2220,
      currentLongitude: 76.8512,
      user: { fullName: "Aziz Rahimov" }
    },
    // Bishkek, Kyrgyzstan
    {
      id: "driver-4",
      userId: "user-4",
      vehicleModel: "Mercedes Sprinter",
      licensePlate: "KG D 321 HI",
      status: "online" as const,
      currentLatitude: 42.8746,
      currentLongitude: 74.5698,
      user: { fullName: "Bobur Aliyev" }
    },
    // Dushanbe, Tajikistan
    {
      id: "driver-5",
      userId: "user-5",
      vehicleModel: "GAZ 3302",
      licensePlate: "TJ E 654 JK",
      status: "busy" as const,
      currentLatitude: 38.5598,
      currentLongitude: 68.7870,
      user: { fullName: "Dilshod Yusupov" }
    },
    // Tehran, Iran
    {
      id: "driver-6",
      userId: "user-6",
      vehicleModel: "Isuzu ELF",
      licensePlate: "IR F 987 LM",
      status: "online" as const,
      currentLatitude: 35.6892,
      currentLongitude: 51.3890,
      user: { fullName: "Ahmad Hosseini" }
    },
    // Istanbul, Turkey
    {
      id: "driver-7",
      userId: "user-7",
      vehicleModel: "Hyundai Porter",
      licensePlate: "TR G 147 NO",
      status: "online" as const,
      currentLatitude: 41.0082,
      currentLongitude: 28.9784,
      user: { fullName: "Mehmet Özkan" }
    },
    // Moscow, Russia
    {
      id: "driver-8",
      userId: "user-8",
      vehicleModel: "Volvo FH",
      licensePlate: "RU H 258 PQ",
      status: "busy" as const,
      currentLatitude: 55.7558,
      currentLongitude: 37.6176,
      user: { fullName: "Dmitri Volkov" }
    },
    // Warsaw, Poland
    {
      id: "driver-9",
      userId: "user-9",
      vehicleModel: "Scania R450",
      licensePlate: "PL I 369 RS",
      status: "online" as const,
      currentLatitude: 52.2297,
      currentLongitude: 21.0122,
      user: { fullName: "Piotr Kowalski" }
    },
    // Berlin, Germany
    {
      id: "driver-10",
      userId: "user-10",
      vehicleModel: "MAN TGX",
      licensePlate: "DE J 741 TU",
      status: "online" as const,
      currentLatitude: 52.5200,
      currentLongitude: 13.4050,
      user: { fullName: "Hans Mueller" }
    },
    // Paris, France
    {
      id: "driver-11",
      userId: "user-11",
      vehicleModel: "Renault T High",
      licensePlate: "FR K 852 VW",
      status: "busy" as const,
      currentLatitude: 48.8566,
      currentLongitude: 2.3522,
      user: { fullName: "Pierre Dubois" }
    },
    // Madrid, Spain
    {
      id: "driver-12",
      userId: "user-12",
      vehicleModel: "Iveco Stralis",
      licensePlate: "ES L 963 XY",
      status: "online" as const,
      currentLatitude: 40.4168,
      currentLongitude: -3.7038,
      user: { fullName: "Carlos Garcia" }
    },
    // Rome, Italy
    {
      id: "driver-13",
      userId: "user-13",
      vehicleModel: "DAF XF",
      licensePlate: "IT M 159 ZA",
      status: "online" as const,
      currentLatitude: 41.9028,
      currentLongitude: 12.4964,
      user: { fullName: "Marco Rossi" }
    },
    // Vienna, Austria
    {
      id: "driver-14",
      userId: "user-14",
      vehicleModel: "Mercedes Actros",
      licensePlate: "AT N 357 BC",
      status: "busy" as const,
      currentLatitude: 48.2082,
      currentLongitude: 16.3738,
      user: { fullName: "Wolfgang Schmidt" }
    },
    // Prague, Czech Republic
    {
      id: "driver-15",
      userId: "user-15",
      vehicleModel: "Tatra Phoenix",
      licensePlate: "CZ O 468 DE",
      status: "online" as const,
      currentLatitude: 50.0755,
      currentLongitude: 14.4378,
      user: { fullName: "Pavel Novák" }
    },
    // Budapest, Hungary
    {
      id: "driver-16",
      userId: "user-16",
      vehicleModel: "Volvo FM",
      licensePlate: "HU P 579 FG",
      status: "online" as const,
      currentLatitude: 47.4979,
      currentLongitude: 19.0402,
      user: { fullName: "László Nagy" }
    },
    // Bucharest, Romania
    {
      id: "driver-17",
      userId: "user-17",
      vehicleModel: "Scania G410",
      licensePlate: "RO Q 681 HI",
      status: "busy" as const,
      currentLatitude: 44.4268,
      currentLongitude: 26.1025,
      user: { fullName: "Ion Popescu" }
    },
    // Sofia, Bulgaria
    {
      id: "driver-18",
      userId: "user-18",
      vehicleModel: "MAN TGL",
      licensePlate: "BG R 792 JK",
      status: "online" as const,
      currentLatitude: 42.6977,
      currentLongitude: 23.3219,
      user: { fullName: "Georgi Petrov" }
    },
    // Athens, Greece
    {
      id: "driver-19",
      userId: "user-19",
      vehicleModel: "Iveco Daily",
      licensePlate: "GR S 814 LM",
      status: "online" as const,
      currentLatitude: 37.9838,
      currentLongitude: 23.7275,
      user: { fullName: "Nikos Papadopoulos" }
    },
    // Kiev, Ukraine
    {
      id: "driver-20",
      userId: "user-20",
      vehicleModel: "Renault Master",
      licensePlate: "UA T 925 NO",
      status: "busy" as const,
      currentLatitude: 50.4501,
      currentLongitude: 30.5234,
      user: { fullName: "Oleksandr Kovalenko" }
    }
  ];

  const driverStats = (stats as any) || {
    rating: 4.9,
    totalTrips: 256,
    totalEarnings: 15000000,
    vehicleModel: "Isuzu NPR 75",
    licensePlate: "01 B 555 CA",
    currentLatitude: 41.3111,
    currentLongitude: 69.2797
  };

  // Get real-time location from browser
  const [currentLocation, setCurrentLocation] = useState({
    lat: driverStats.currentLatitude,
    lng: driverStats.currentLongitude
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Could not get current location:', error);
        }
      );
    }
  }, []);

  // Add current driver to mock drivers list
  const currentDriver = {
    id: user?.id || "current-driver",
    userId: user?.id || "current-user",
    vehicleModel: driverStats.vehicleModel,
    licensePlate: driverStats.licensePlate,
    status: status as 'online' | 'busy' | 'offline',
    currentLatitude: currentLocation.lat,
    currentLongitude: currentLocation.lng,
    user: { fullName: user?.fullName || "Siz" }
  };

  // Combine current driver with mock drivers
  const allDrivers = onlineDrivers && onlineDrivers.length > 0 
    ? onlineDrivers 
    : [currentDriver, ...mockDrivers];

  useEffect(() => {
    if (apiActiveOrders && apiActiveOrders.length > 0) {
      setActiveOrder(apiActiveOrders[0]);
      setStatus("busy");
    } else {
      // Test uchun mock faol buyurtma
      setActiveOrder(mockAvailableOrders[0]);
      setStatus("busy");
    }
  }, [apiActiveOrders]);

  // Request location permission on mount
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (!navigator.geolocation) {
        toast.error('Brauzeringiz joylashuvni qo\'llab-quvvatlamaydi');
        setLocationPermissionDenied(true);
        return;
      }

      try {
        // Request permission
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
        });

        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        updateLocation.mutate({ latitude, longitude });
        setLocationPermissionDenied(false);
        toast.success('Joylashuv muvaffaqiyatli olindi');
      } catch (error: any) {
        console.error('Location permission error:', error);
        setLocationPermissionDenied(true);
        
        if (error.code === 1) { // PERMISSION_DENIED
          toast.error('Joylashuv ruxsati berilmadi. Iltimos, brauzer sozlamalaridan ruxsat bering.', {
            duration: 10000,
          });
        } else if (error.code === 2) { // POSITION_UNAVAILABLE
          toast.error('Joylashuv ma\'lumoti mavjud emas');
        } else if (error.code === 3) { // TIMEOUT
          toast.error('Joylashuv olish vaqti tugadi');
        }
      }
    };

    requestLocationPermission();
  }, []);

  // Real-time location tracking
  useEffect(() => {
    let watchId: number | null = null;

    const startLocationTracking = () => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by this browser');
        return;
      }

      // Get initial position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Initial location:', latitude, longitude);
          
          // Update backend
          updateLocation.mutate({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting initial location:', error);
        }
      );

      // Watch position changes
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Location updated:', latitude, longitude);
          
          // Update backend every time location changes
          updateLocation.mutate({ latitude, longitude });
        },
        (error) => {
          console.error('Error watching location:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    };

    // Start tracking when driver is online or busy
    if (status === 'online' || status === 'busy') {
      startLocationTracking();
    }

    // Cleanup
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [status]);

  // Periodic location update (every 30 seconds as backup)
  useEffect(() => {
    if (status !== 'online' && status !== 'busy') return;

    const intervalId = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            updateLocation.mutate({ latitude, longitude });
          },
          (error) => {
            console.error('Periodic location update failed:', error);
          }
        );
      }
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [status]);

  const handleStatusChange = async (checked: boolean) => {
    if (activeOrder) return;
    
    // Check location permission before going online
    if (checked && locationPermissionDenied) {
      toast.error('Avval joylashuv ruxsatini bering!');
      return;
    }
    
    const newStatus = checked ? "online" : "offline";
    try {
      await updateStatus.mutateAsync(newStatus);
      setStatus(newStatus);
      toast.success(`Status: ${newStatus === "online" ? "Onlayn" : "Oflayn"}`);
    } catch (error: any) {
      setStatus(newStatus);
      toast.warning("Status o'zgartirildi");
    }
  };

  const handleAccept = async (order: any) => {
    // Check if driver has uploaded license image
    if (!(user as any)?.driverProfile?.licenseImageUrl) {
      toast.error("Buyurtma qabul qilish uchun avval haydovchilik guvohnomasining rasmini yuklashingiz kerak. Sozlamalar bo'limiga o'ting.");
      setShowSettingsDialog(true);
      return;
    }

    // Check if license is approved by admin
    if ((user as any)?.driverProfile?.isLicenseApproved !== true) {
      if ((user as any)?.driverProfile?.isLicenseApproved === false) {
        toast.error("Haydovchilik guvohnomasiningiz rad etilgan. Yangi guvohnoma rasmini yuklang.");
        setShowSettingsDialog(true);
      } else {
        toast.error("Buyurtma qabul qilish uchun haydovchilik guvohnomasini admin tomonidan tasdiqlanishi kerak. Iltimos, kuting.");
      }
      return;
    }

    try {
      await acceptOrder.mutateAsync(order.id);
      setActiveOrder(order);
      setStatus("busy");
      toast.success(t('notifications.orderAcceptedToast'));
    } catch (error: any) {
      console.error('Accept order error:', error);
      
      // Check if error is about missing license image
      if (error.response?.data?.message?.includes('guvohnoma')) {
        toast.error(error.response.data.message);
        setShowSettingsDialog(true);
        return;
      }
      
      // For mock orders, still update UI
      if (order.id.startsWith('ORD-')) {
        setActiveOrder(order);
        setStatus("busy");
        toast.success(`${t('notifications.orderAcceptedToast')} (Mock mode)`);
      } else {
        toast.error(error.response?.data?.message || "Buyurtmani qabul qilishda xatolik");
      }
    }
  };

  const handleComplete = async () => {
    if (!activeOrder) return;
    
    try {
      await markAsDelivered.mutateAsync(activeOrder.id);
      toast.success(t('status.waitingConfirmation'));
      // Keep the order active until shipper confirms
    } catch (error) {
      console.error('Mark as delivered error:', error);
      // For mock orders, still show success
      if (activeOrder.id.startsWith('ORD-')) {
        toast.success(`${t('status.waitingConfirmation')} (Mock mode)`);
      } else {
        toast.error("Xatolik yuz berdi");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Location Permission Warning */}
      {locationPermissionDenied && (
        <div className="bg-destructive text-destructive-foreground px-6 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5" />
              <div>
                <p className="font-semibold">Joylashuv ruxsati kerak!</p>
                <p className="text-sm opacity-90">
                  Haydovchi sifatida ishlash uchun joylashuvingizni ulashishingiz shart. 
                  Brauzer sozlamalaridan ruxsat bering va sahifani yangilang.
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white text-destructive hover:bg-white/90"
              onClick={() => window.location.reload()}
            >
              Sahifani yangilash
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Truck className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">LogiPeek Driver</h1>
                <p className="text-sm text-muted-foreground">{t('driver.panel')}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Location Indicator */}
              {(status === "online" || status === "busy") && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-lg border border-success/20">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-success">
                    {t('driver.gpsActive')}
                  </span>
                </div>
              )}

              {/* Status Toggle */}
              <div className="flex items-center gap-3 px-4 py-2 bg-muted rounded-lg">
                {status === "online" ? (
                  <Wifi className="w-5 h-5 text-success" />
                ) : (
                  <WifiOff className="w-5 h-5 text-muted-foreground" />
                )}
                <span className="text-sm font-medium">
                  {status === "online" ? t('driver.online') : status === "busy" ? t('driver.busy') : t('driver.offline')}
                </span>
                <Switch
                  checked={status === "online" || status === "busy"}
                  onCheckedChange={handleStatusChange}
                  disabled={status === "busy"}
                />
              </div>

              <NotificationsDropdown />

              <LanguageSelector variant="light" />

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 hover:bg-muted">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{user?.fullName}</p>
                      <p className="text-xs text-muted-foreground">{t('auth.role.driver')}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                      {user?.fullName?.split(' ').map(n => n[0]).join('') || 'H'}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-3 py-2">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user?.fullName?.split(' ').map(n => n[0]).join('') || 'H'}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{user?.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Statistika
                  </DropdownMenuLabel>
                  
                  <div className="px-2 py-2 space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-warning" />
                        <span className="text-sm text-muted-foreground">Reyting</span>
                      </div>
                      <span className="font-bold text-foreground">{driverStats.rating}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Safar</span>
                      </div>
                      <span className="font-bold text-foreground">{driverStats.totalTrips}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-success" />
                        <span className="text-sm text-muted-foreground">Daromad</span>
                      </div>
                      <span className="font-bold text-foreground">
                        {(driverStats.totalEarnings / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>

                  <DropdownMenuSeparator />
                  
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Transport
                  </DropdownMenuLabel>
                  
                  <div className="px-2 py-2 space-y-2">
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Model</p>
                      <p className="font-medium text-foreground text-sm">{driverStats.vehicleModel}</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Raqam</p>
                      <p className="font-medium text-foreground text-sm">{driverStats.licensePlate}</p>
                    </div>
                  </div>

                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => setShowSettingsDialog(true)} className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    {t('dashboard.settings')}
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('dashboard.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* Main Content - Full Width */}
        <div className="space-y-6">
          {/* All Drivers Map - Always visible */}
          {!activeOrder && (
            <div className="mb-6">
              <div className="bg-card rounded-xl p-4 border border-border mb-4">
                <h3 className="text-lg font-semibold text-foreground">{t('driver.allDrivers')}</h3>
                <p className="text-sm text-muted-foreground">{t('driver.realTimeLocation')}</p>
              </div>
              <MapViewAllDrivers 
                drivers={allDrivers}
                currentDriverId={user?.id}
                height="500px"
              />
            </div>
          )}

          {/* Active Order */}
          {activeOrder && (
              <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-xl p-6 mb-6 border border-primary/20">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{t('driver.activeOrder')}</h3>
                    <p className="text-sm text-muted-foreground">{t('driver.orderNumber')} #{activeOrder.id}</p>
                  </div>
                  <Badge className="bg-success text-success-foreground">{t('driver.busy')}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t('driver.pickup')}</p>
                        <p className="font-medium text-foreground">{activeOrder.pickupAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Navigation className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t('driver.delivery')}</p>
                        <p className="font-medium text-foreground">{activeOrder.dropoffAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                      <span className="text-sm text-muted-foreground">{t('driver.distance')}</span>
                      <span className="font-bold text-foreground">{activeOrder.distanceKm} {t('common.km')}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                      <span className="text-sm text-muted-foreground">{t('driver.payment')}</span>
                      <span className="font-bold text-success">${(activeOrder.estimatedPrice || 0).toLocaleString()}</span>
                    </div>
                    {activeOrder.deliveryDateFrom && (
                      <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                        <span className="text-sm text-muted-foreground">{t('driver.startDate')}</span>
                        <span className="font-medium text-foreground">
                          {activeOrder.deliveryDateFrom ? new Date(activeOrder.deliveryDateFrom).toLocaleDateString('uz-UZ') : 'N/A'}
                        </span>
                      </div>
                    )}
                    {activeOrder.deliveryDateTo && (
                      <div className="flex items-center justify-between p-3 bg-info/10 rounded-lg">
                        <span className="text-sm text-muted-foreground">{t('driver.endDate')}</span>
                        <span className="font-medium text-foreground">
                          {activeOrder.deliveryDateTo ? new Date(activeOrder.deliveryDateTo).toLocaleDateString('uz-UZ') : 'N/A'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Map */}
                {activeOrder && activeOrder.pickupAddress && activeOrder.dropoffAddress && (
                  <div className="rounded-xl overflow-hidden mb-4" style={{ height: "400px" }}>
                    <MapViewDriver 
                      driverLocation={{
                        lat: currentLocation.lat,
                        lng: currentLocation.lng
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
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <Button className="flex-1 bg-success hover:bg-success/90" onClick={handleComplete}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t('status.cargoDelivered')}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      // Get customer info from active order
                      const phone = activeOrder?.shipper?.phone || "+998 90 123 45 67";
                      const name = activeOrder?.shipper?.fullName || "Mijoz";
                      setCustomerInfo({name, phone});
                      setShowPhoneDialog(true);
                    }}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Mijozga qo'ng'iroq
                  </Button>
                </div>
              </div>
            )}

            {/* Orders Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-3 mb-6">
                <TabsTrigger value="available">{t('driver.availableOrders')}</TabsTrigger>
                <TabsTrigger value="history">{t('driver.history')}</TabsTrigger>
                <TabsTrigger value="telegram">{t('telegram.bot')}</TabsTrigger>
              </TabsList>

              <TabsContent value="available" className="space-y-4">
                {/* License Image Warning for Drivers */}
                {user?.role === 'driver' && !(user as any)?.driverProfile?.licenseImageUrl && (
                  <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-medium text-warning mb-1">{t('driver.licenseImageRequired')}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {t('driver.licenseImageWarning')}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowSettingsDialog(true)}
                          className="gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          {t('driver.goToSettings')}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* License Approval Pending Warning */}
                {user?.role === 'driver' && (user as any)?.driverProfile?.licenseImageUrl && (user as any)?.driverProfile?.isLicenseApproved === null && (
                  <div className="bg-info/10 border border-info/20 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-medium text-info mb-1">Guvohnoma tasdiqlanmoqda</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Haydovchilik guvohnomasining rasmi yuklandi. Admin tomonidan tasdiqlanishini kuting. 
                          Tasdiqlangandan keyin buyurtma qabul qilishingiz mumkin bo'ladi.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-info">
                          <Shield className="w-4 h-4" />
                          <span>Holat: Tekshirilmoqda</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* License Rejected Warning */}
                {user?.role === 'driver' && (user as any)?.driverProfile?.licenseImageUrl && (user as any)?.driverProfile?.isLicenseApproved === false && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-medium text-destructive mb-1">Guvohnoma rad etildi</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Haydovchilik guvohnomasiningiz admin tomonidan rad etildi. Yangi guvohnoma rasmini yuklang.
                        </p>
                        <Button
                          onClick={() => setShowSettingsDialog(true)}
                          size="sm"
                          variant="destructive"
                          className="gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Qayta yuklash
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* License Approved Success */}
                {user?.role === 'driver' && (user as any)?.driverProfile?.isLicenseApproved === true && (
                  <div className="bg-success/10 border border-success/20 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-medium text-success mb-1">Guvohnoma tasdiqlandi</h4>
                        <p className="text-sm text-muted-foreground">
                          Haydovchilik guvohnomasiningiz admin tomonidan tasdiqlandi. Endi buyurtma qabul qilishingiz mumkin!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {availableOrders.length === 0 ? (
                  <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Hozircha buyurtmalar yo'q</p>
                  </div>
                ) : (
                  availableOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card rounded-xl p-6 border border-border hover:border-primary transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">{t('driver.orderNumber')} #{order.id}</h4>
                            {order.urgent && (
                              <Badge variant="destructive" className="text-xs">{t('driver.urgent')}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{order.vehicleTypeRequired}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-success">${(order.estimatedPrice || 0).toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{t('common.usd')}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Olish</p>
                            <p className="text-sm font-medium text-foreground">{order.pickupAddress}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Navigation className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Yetkazish</p>
                            <p className="text-sm font-medium text-foreground">{order.dropoffAddress}</p>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Date Range */}
                      {(order.deliveryDateFrom || order.deliveryDateTo) && (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {order.deliveryDateFrom && (
                            <div className="flex items-start gap-2">
                              <Calendar className="w-4 h-4 text-warning mt-1 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-muted-foreground">{t('driver.startDate')}</p>
                                <p className="text-sm font-medium text-foreground">
                                  {order.deliveryDateFrom ? new Date(order.deliveryDateFrom).toLocaleDateString('uz-UZ') : 'N/A'}
                                </p>
                              </div>
                            </div>
                          )}
                          {order.deliveryDateTo && (
                            <div className="flex items-start gap-2">
                              <Calendar className="w-4 h-4 text-info mt-1 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-muted-foreground">{t('driver.endDate')}</p>
                                <p className="text-sm font-medium text-foreground">
                                  {order.deliveryDateTo ? new Date(order.deliveryDateTo).toLocaleDateString('uz-UZ') : 'N/A'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Navigation className="w-4 h-4" />
                            {order.distanceKm} {t('common.km')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Weight className="w-4 h-4" />
                            {order.weight} kg
                          </span>
                        </div>
                        <Button 
                          onClick={() => handleAccept(order)}
                          disabled={status !== "online"}
                        >
                          {t('driver.acceptOrder')}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                {orderHistory.map((order) => (
                  <div key={order.id} className="bg-card rounded-xl p-6 border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-success" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{t('driver.orderNumber')} #{order.id}</h4>
                          <p className="text-sm text-muted-foreground">
                            {order.pickupAddress} → {order.dropoffAddress}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {order.completedAt ? new Date(order.completedAt).toLocaleDateString('uz-UZ') : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-success">${(order.finalPrice || 0).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{t('common.usd')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* Telegram Bot Tab */}
              <TabsContent value="telegram" className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
                  <div className="text-center">
                    {/* Telegram Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.377 2.617-1.407 3.08-2.896 1.596l-2.123-1.596-1.018.613c-.442.265-.818.265-1.265 0L8.8 13.834l-3.032-.613c-.64-.128-.64-.64 0-.896l11.71-4.49c.523-.21.896.106.896.64 0 .128-.042.256-.106.384z"/>
                      </svg>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      {t('telegram.integration')}
                    </h3>

                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-sm font-medium mb-4">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                      {t('telegram.inDevelopment')}
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                      {t('telegram.description')}
                    </p>

                    {/* Features List */}
                    <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-6 mb-6">
                      <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        {t('telegram.features')}
                      </h4>
                      <div className="space-y-3 text-left">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{t('telegram.feature1')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{t('telegram.feature2')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{t('telegram.feature3')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{t('telegram.feature4')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Coming Soon */}
                    <div className="text-center">
                      <p className="text-lg font-semibold text-primary mb-2">{t('telegram.comingSoon')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('telegram.notificationTip')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bot Link Card */}
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.377 2.617-1.407 3.08-2.896 1.596l-2.123-1.596-1.018.613c-.442.265-.818.265-1.265 0L8.8 13.834l-3.032-.613c-.64-.128-.64-.64 0-.896l11.71-4.49c.523-.21.896.106.896.64 0 .128-.042.256-.106.384z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{t('telegram.botName')}</h4>
                        <p className="text-sm text-muted-foreground">@logi_peek_bot</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open('https://t.me/logi_peek_bot', '_blank')}
                      className="gap-2"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.377 2.617-1.407 3.08-2.896 1.596l-2.123-1.596-1.018.613c-.442.265-.818.265-1.265 0L8.8 13.834l-3.032-.613c-.64-.128-.64-.64 0-.896l11.71-4.49c.523-.21.896.106.896.64 0 .128-.042.256-.106.384z"/>
                      </svg>
                      {t('telegram.openBot')}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Phone Dialog */}
        <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              {t('contact.customerInfo')}
            </DialogTitle>
            <DialogDescription>
              {t('contact.customerContact')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground mb-1">{customerInfo.name}</p>
                <p className="text-lg text-primary font-semibold">{customerInfo.phone}</p>
              </div>
              <Button 
                className="mt-4"
                onClick={() => {
                  window.location.href = `tel:${customerInfo.phone}`;
                }}
              >
                <Phone className="w-4 h-4 mr-2" />
                {t('contact.callButton')}
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

export default DriverDashboardWeb;
