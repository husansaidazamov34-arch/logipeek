import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation2, MapPin, Flag, Map, Satellite, Mountain, Maximize2, Minimize2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

type MapLayer = 'standard' | 'satellite' | 'terrain';

interface MapViewDriverProps {
  driverLocation: { lat: number; lng: number };
  pickup: { lat: number; lng: number; address: string };
  dropoff: { lat: number; lng: number; address: string };
  showRoute?: boolean;
  height?: string;
  onRouteCalculated?: (distance: number, duration: number) => void;
}

const MapViewDriver = ({
  driverLocation,
  pickup,
  dropoff,
  showRoute = true,
  height = "400px",
  onRouteCalculated
}: MapViewDriverProps) => {
  const { t } = useTranslation();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<MapLayer>('standard');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ driver: L.Marker | null; pickup: L.Marker | null; dropoff: L.Marker | null }>({
    driver: null,
    pickup: null,
    dropoff: null
  });
  const isInitializedRef = useRef(false);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    
    if (!isFullscreen) {
      if (mapContainerRef.current.requestFullscreen) {
        mapContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

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

  // Custom marker icons
  const createCustomIcon = (color: string, emoji: string) => {
    const iconHtml = `
      <div style="
        width: 40px;
        height: 40px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="transform: rotate(45deg); font-size: 20px;">
          ${emoji}
        </div>
      </div>
    `;
    return L.divIcon({
      html: iconHtml,
      className: "custom-marker",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
  };

  const driverIcon = createCustomIcon("#0ea5e9", "🚚");
  const pickupIcon = createCustomIcon("#22c55e", "📍");
  const dropoffIcon = createCustomIcon("#8b5cf6", "🎯");

  // Map layer configurations
  const mapLayers = {
    standard: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
    },
    terrain: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
    }
  };

  // Change map layer
  const changeMapLayer = (layer: MapLayer) => {
    if (!mapRef.current || !tileLayerRef.current) return;
    
    // Remove current tile layer
    mapRef.current.removeLayer(tileLayerRef.current);
    
    // Add new tile layer
    const newTileLayer = L.tileLayer(mapLayers[layer].url, {
      attribution: mapLayers[layer].attribution,
      maxZoom: 19
    }).addTo(mapRef.current);
    
    tileLayerRef.current = newTileLayer;
    setCurrentLayer(layer);
  };

  // Fetch route from OSRM
  const fetchRoute = async (from: { lat: number; lng: number }, to: { lat: number; lng: number }) => {
    try {
      setIsLoadingRoute(true);
      const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === "Ok" && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          coordinates: route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]),
          distance: route.distance / 1000, // Convert to km
          duration: route.duration / 60 // Convert to minutes
        };
      }
      return null;
    } catch (error) {
      console.error("Route fetch error:", error);
      return null;
    } finally {
      setIsLoadingRoute(false);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    
    // Validate coordinates
    if (!driverLocation?.lat || !driverLocation?.lng || 
        !pickup?.lat || !pickup?.lng || 
        !dropoff?.lat || !dropoff?.lng) {
      console.warn('Invalid coordinates provided to MapViewDriver');
      return;
    }

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: [driverLocation.lat, driverLocation.lng],
      zoom: 13,
      zoomControl: false,
      attributionControl: true
    });

    mapRef.current = map;

    // Add OpenStreetMap tile layer
    const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);
    
    tileLayerRef.current = tileLayer;

    // Add zoom control to bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Add driver marker
    const driverMarker = L.marker([driverLocation.lat, driverLocation.lng], { icon: driverIcon })
      .addTo(map)
      .bindPopup("<b>Sizning joylashuvingiz</b><br>Hozirgi pozitsiya");
    markersRef.current.driver = driverMarker;

    // Add pickup marker
    const pickupMarker = L.marker([pickup.lat, pickup.lng], { icon: pickupIcon })
      .addTo(map)
      .bindPopup(`<b>Olish manzili</b><br>${pickup.address}`);
    markersRef.current.pickup = pickupMarker;

    // Add dropoff marker
    const dropoffMarker = L.marker([dropoff.lat, dropoff.lng], { icon: dropoffIcon })
      .addTo(map)
      .bindPopup(`<b>Yetkazish manzili</b><br>${dropoff.address}`);
    markersRef.current.dropoff = dropoffMarker;

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current = { driver: null, pickup: null, dropoff: null };
      isInitializedRef.current = false;
    };
  }, []);

  // Fetch and draw routes - only once
  useEffect(() => {
    if (!mapRef.current || !showRoute || isInitializedRef.current) return;

    const drawRoutes = async () => {
      isInitializedRef.current = true;
      
      // Clear previous routes
      if (routeLayerRef.current) {
        mapRef.current?.removeLayer(routeLayerRef.current);
      }

      const routeGroup = L.layerGroup().addTo(mapRef.current!);
      routeLayerRef.current = routeGroup;

      // Route 1: Driver to Pickup
      const route1 = await fetchRoute(driverLocation, pickup);
      if (route1) {
        const polyline1 = L.polyline(route1.coordinates, {
          color: "#0ea5e9",
          weight: 5,
          opacity: 0.8,
          dashArray: "10, 10"
        }).addTo(routeGroup);

        // Add arrow markers along the route
        const arrowIcon = L.divIcon({
          html: '<div style="color: #0ea5e9; font-size: 20px;">➤</div>',
          className: "arrow-icon",
          iconSize: [20, 20]
        });

        // Add arrows every 20% of the route
        for (let i = 0.2; i <= 0.8; i += 0.2) {
          const point = polyline1.getLatLngs()[Math.floor(route1.coordinates.length * i)] as L.LatLng;
          L.marker(point, { icon: arrowIcon }).addTo(routeGroup);
        }
      }

      // Route 2: Pickup to Dropoff
      const route2 = await fetchRoute(pickup, dropoff);
      if (route2) {
        L.polyline(route2.coordinates, {
          color: "#8b5cf6",
          weight: 5,
          opacity: 0.6,
          dashArray: "5, 10"
        }).addTo(routeGroup);
      }

      // Calculate total distance and duration
      if (route1 && route2) {
        const totalDistance = route1.distance + route2.distance;
        const totalDuration = route1.duration + route2.duration;
        
        setRouteInfo({
          distance: Math.round(totalDistance * 10) / 10,
          duration: Math.round(totalDuration)
        });

        if (onRouteCalculated) {
          onRouteCalculated(totalDistance, totalDuration);
        }
      }

      // Fit bounds to show all markers and routes
      const bounds = L.latLngBounds([
        [driverLocation.lat, driverLocation.lng],
        [pickup.lat, pickup.lng],
        [dropoff.lat, dropoff.lng]
      ]);
      
      if (mapRef.current && mapRef.current.getContainer() && mapRef.current._loaded) {
        try {
          mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        } catch (error) {
          console.warn('Error fitting bounds in MapViewDriver:', error);
        }
      }
    };

    drawRoutes();
  }, [mapRef.current, showRoute]);

  // Update driver marker position when location changes
  useEffect(() => {
    if (markersRef.current.driver && driverLocation) {
      markersRef.current.driver.setLatLng([driverLocation.lat, driverLocation.lng]);
    }
  }, [driverLocation.lat, driverLocation.lng]);

  return (
    <div className="relative w-full z-0" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full rounded-xl overflow-hidden" />

      {/* Map Layer Switcher */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg shadow-lg transition-all duration-200 bg-white hover:bg-gray-100 text-gray-700"
          title={isFullscreen ? "Fullscreendan chiqish" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
        <button
          onClick={() => changeMapLayer('standard')}
          className={`p-2 rounded-lg shadow-lg transition-all duration-200 ${
            currentLayer === 'standard' 
              ? 'bg-primary text-white' 
              : 'bg-white hover:bg-gray-100 text-gray-700'
          }`}
          title="Standart xarita"
        >
          <Map className="w-5 h-5" />
        </button>
        <button
          onClick={() => changeMapLayer('satellite')}
          className={`p-2 rounded-lg shadow-lg transition-all duration-200 ${
            currentLayer === 'satellite' 
              ? 'bg-primary text-white' 
              : 'bg-white hover:bg-gray-100 text-gray-700'
          }`}
          title="Sun'iy yo'ldosh"
        >
          <Satellite className="w-5 h-5" />
        </button>
        <button
          onClick={() => changeMapLayer('terrain')}
          className={`p-2 rounded-lg shadow-lg transition-all duration-200 ${
            currentLayer === 'terrain' 
              ? 'bg-primary text-white' 
              : 'bg-white hover:bg-gray-100 text-gray-700'
          }`}
          title="Relyef xaritasi"
        >
          <Mountain className="w-5 h-5" />
        </button>
      </div>

      {/* Center on Current Location Button */}
      <button
        onClick={() => {
          if (mapRef.current && driverLocation) {
            mapRef.current.setView([driverLocation.lat, driverLocation.lng], 15, {
              animate: true,
              duration: 0.5
            });
            // Open driver marker popup
            if (markersRef.current.driver) {
              markersRef.current.driver.openPopup();
            }
          }
        }}
        className="absolute bottom-20 right-4 z-[1000] bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        title="Joriy joylashuvni ko'rsatish"
      >
        <Navigation2 className="w-5 h-5" />
      </button>

      {/* Loading indicator */}
      {isLoadingRoute && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-black/70 backdrop-blur-md px-4 py-2 rounded-full">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-white font-medium">Yo'l hisoblanmoqda...</span>
          </div>
        </div>
      )}

      {/* Route info */}
      {routeInfo && (
        <div className="absolute top-4 left-4 z-[1000] bg-black/70 backdrop-blur-md px-4 py-3 rounded-xl space-y-2">
          <div className="flex items-center gap-2">
            <Navigation2 className="w-4 h-4 text-primary" />
            <div>
              <p className="text-white/70 text-xs">{t('tracking.totalDistance')}</p>
              <p className="text-white font-bold">{routeInfo.distance} km</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-white/70 text-xs">Taxminiy vaqt</p>
              <p className="text-white font-bold">{formatDuration(routeInfo.duration)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-black/70 backdrop-blur-md px-3 py-2 rounded-xl space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-primary" style={{ borderTop: "2px dashed #0ea5e9" }} />
          <span className="text-xs text-white">{t('tracking.fromYouToPickup')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-purple-500" style={{ borderTop: "2px dashed #8b5cf6" }} />
          <span className="text-xs text-white">{t('tracking.fromPickupToDelivery')}</span>
        </div>
      </div>
    </div>
  );
};

export default MapViewDriver;
