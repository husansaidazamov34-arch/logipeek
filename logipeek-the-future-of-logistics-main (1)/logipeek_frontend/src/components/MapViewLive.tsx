import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation, Truck, Map, Satellite, Mountain, Maximize2, Minimize2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

type MapLayer = 'standard' | 'satellite' | 'terrain';

interface MapViewLiveProps {
  pickup?: { lat: number; lng: number; address: string };
  dropoff?: { lat: number; lng: number; address: string };
  driverLocation?: { lat: number; lng: number };
  showAnimation?: boolean;
  height?: string;
}

const MapViewLive = ({
  pickup = { lat: 41.2995, lng: 69.2401, address: "Tashkent, Mirabad" },
  dropoff = { lat: 39.6542, lng: 66.9597, address: "Samarkand, Registon" },
  driverLocation,
  showAnimation = true,
  height = "400px"
}: MapViewLiveProps) => {
  const { t } = useTranslation();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState<number>(0);
  const [currentLayer, setCurrentLayer] = useState<MapLayer>('standard');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);

  // Custom marker icons
  const createCustomIcon = (color: string, IconComponent: any) => {
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
        <div style="transform: rotate(45deg); color: white;">
          ${IconComponent}
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

  const pickupIcon = createCustomIcon("#22c55e", "📍");
  const dropoffIcon = createCustomIcon("#8b5cf6", "🎯");
  const driverIcon = createCustomIcon("#0ea5e9", "🚚");

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
    
    mapRef.current.removeLayer(tileLayerRef.current);
    
    const newTileLayer = L.tileLayer(mapLayers[layer].url, {
      attribution: mapLayers[layer].attribution,
      maxZoom: 19
    }).addTo(mapRef.current);
    
    tileLayerRef.current = newTileLayer;
    setCurrentLayer(layer);
  };

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

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: [pickup.lat, pickup.lng],
      zoom: 8,
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

    // Add pickup marker
    const pickupMarker = L.marker([pickup.lat, pickup.lng], { icon: pickupIcon })
      .addTo(map)
      .bindPopup(`<b>Olish manzili</b><br>${pickup.address}`);

    // Add dropoff marker
    const dropoffMarker = L.marker([dropoff.lat, dropoff.lng], { icon: dropoffIcon })
      .addTo(map)
      .bindPopup(`<b>Yetkazish manzili</b><br>${dropoff.address}`);

    // Draw route line
    const routeLine = L.polyline(
      [
        [pickup.lat, pickup.lng],
        [dropoff.lat, dropoff.lng]
      ],
      {
        color: "#0ea5e9",
        weight: 4,
        opacity: 0.7,
        dashArray: "10, 10"
      }
    ).addTo(map);

    routeLayerRef.current = routeLine;

    // Calculate distance
    const dist = map.distance([pickup.lat, pickup.lng], [dropoff.lat, dropoff.lng]) / 1000;
    setDistance(Math.round(dist));

    // Fit bounds to show both markers
    const bounds = L.latLngBounds([
      [pickup.lat, pickup.lng],
      [dropoff.lat, dropoff.lng]
    ]);
    
    if (map && map.getContainer() && map._loaded) {
      try {
        map.fitBounds(bounds, { padding: [50, 50] });
      } catch (error) {
        console.warn('Error fitting bounds in MapViewLive:', error);
      }
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [pickup.lat, pickup.lng, dropoff.lat, dropoff.lng]);

  // Update driver location
  useEffect(() => {
    if (!mapRef.current || !driverLocation) return;

    if (driverMarkerRef.current) {
      // Update existing marker
      driverMarkerRef.current.setLatLng([driverLocation.lat, driverLocation.lng]);
    } else {
      // Create new marker
      const marker = L.marker([driverLocation.lat, driverLocation.lng], { icon: driverIcon })
        .addTo(mapRef.current)
        .bindPopup("<b>Haydovchi</b><br>Hozirgi joylashuv");
      driverMarkerRef.current = marker;
    }
  }, [driverLocation]);

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

      {/* Live indicator */}
      <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
        <span className="text-xs text-white font-medium">{t('tracking.liveTracking')}</span>
      </div>

      {/* Distance info */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl">
        <p className="text-white/70 text-xs">{t('tracking.distance')}</p>
        <p className="text-white font-bold">{distance} km</p>
      </div>
    </div>
  );
};

export default MapViewLive;
