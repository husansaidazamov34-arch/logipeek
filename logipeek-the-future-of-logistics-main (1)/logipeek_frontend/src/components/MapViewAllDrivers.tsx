import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Map, Satellite, Mountain, Maximize2, Minimize2 } from "lucide-react";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

type MapLayer = 'standard' | 'satellite' | 'terrain';

interface Driver {
  id: string;
  userId: string;
  vehicleModel: string;
  licensePlate: string;
  status: 'online' | 'busy' | 'offline';
  currentLatitude: number;
  currentLongitude: number;
  user: {
    fullName: string;
  };
}

interface MapViewAllDriversProps {
  drivers: Driver[];
  currentDriverId?: string;
  height?: string;
}

const MapViewAllDrivers = ({
  drivers,
  currentDriverId,
  height = "600px"
}: MapViewAllDriversProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const [filter, setFilter] = useState<'all' | 'online' | 'busy'>('all');
  const [currentLayer, setCurrentLayer] = useState<MapLayer>('standard');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Filter drivers based on selected filter
  const filteredDrivers = drivers.filter(driver => {
    if (filter === 'all') return true;
    if (filter === 'online') return driver.status === 'online';
    if (filter === 'busy') return driver.status === 'busy';
    return true;
  });

  const onlineCount = drivers.filter(d => d.status === 'online').length;
  const busyCount = drivers.filter(d => d.status === 'busy').length;

  // Map layer configurations
  const mapLayers = {
    standard: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      
      // Invalidate map size when exiting fullscreen to fix marker positioning
      if (!document.fullscreenElement && mapRef.current) {
        setTimeout(() => {
          mapRef.current?.invalidateSize();
        }, 100);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Create custom truck icon
  const createTruckIcon = (isCurrentDriver: boolean, status: string) => {
    const color = isCurrentDriver 
      ? "#0ea5e9" // Blue for current driver
      : status === "busy" 
        ? "#ef4444" // Red for busy
        : "#22c55e"; // Green for online

    const iconHtml = `
      <div style="
        width: 36px;
        height: 36px;
        background: ${color};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      ">
        🚚
      </div>
    `;
    
    return L.divIcon({
      html: iconHtml,
      className: "truck-marker",
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    try {
      // Initialize map centered on Europe/Asia for global view
      const map = L.map(mapContainerRef.current, {
        center: [50.0, 30.0], // Center between Europe and Asia
        zoom: 3, // Global zoom level
        zoomControl: false,
        attributionControl: true
      });

      mapRef.current = map;

      // Add OpenStreetMap tile layer
      const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(map);
      
      tileLayerRef.current = tileLayer;

      // Add zoom control to bottom right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Wait for map to be fully loaded before any operations
      map.whenReady(() => {
        console.log('Map is ready');
        // Don't auto-fit bounds on initialization to prevent errors
        // Let user manually zoom/pan as needed
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (error) {
          console.error('Error removing map:', error);
        }
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when drivers change
  useEffect(() => {
    if (!mapRef.current || !drivers || drivers.length === 0) return;

    const map = mapRef.current;
    const currentMarkers = markersRef.current;

    // Get IDs of drivers that should be visible
    const visibleDriverIds = new Set(
      filteredDrivers
        .filter(d => d.currentLatitude && d.currentLongitude)
        .map(d => d.id)
    );

    // Remove markers for drivers that are no longer visible
    Object.keys(currentMarkers).forEach(driverId => {
      if (!visibleDriverIds.has(driverId)) {
        map.removeLayer(currentMarkers[driverId]);
        delete currentMarkers[driverId];
      }
    });

    // Add or update markers for visible drivers
    filteredDrivers.forEach(driver => {
      if (!driver.currentLatitude || !driver.currentLongitude) {
        return;
      }

      const isCurrentDriver = driver.userId === currentDriverId;
      const position: [number, number] = [driver.currentLatitude, driver.currentLongitude];

      // If marker already exists, just update its position
      if (currentMarkers[driver.id]) {
        currentMarkers[driver.id].setLatLng(position);
        return;
      }

      // Create new marker only if it doesn't exist
      const marker = L.marker(position, {
        icon: createTruckIcon(isCurrentDriver, driver.status)
      }).addTo(map);

      // Add popup
      const statusText = driver.status === 'busy' ? 'Band' : 'Onlayn';
      const statusColor = driver.status === 'busy' ? '#ef4444' : '#22c55e';
      
      marker.bindPopup(`
        <div style="min-width: 200px;">
          <div style="font-weight: bold; margin-bottom: 8px; color: #1f2937;">
            ${isCurrentDriver ? '🔵 Siz' : driver.user.fullName}
          </div>
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
            <strong>Transport:</strong> ${driver.vehicleModel}
          </div>
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
            <strong>Raqam:</strong> ${driver.licensePlate}
          </div>
          <div style="font-size: 12px; margin-top: 8px;">
            <span style="
              display: inline-block;
              padding: 2px 8px;
              background: ${statusColor};
              color: white;
              border-radius: 4px;
              font-weight: 500;
            ">
              ${statusText}
            </span>
          </div>
        </div>
      `);

      currentMarkers[driver.id] = marker;
    });

    markersRef.current = currentMarkers;
  }, [filteredDrivers, currentDriverId, filter]);

  // Fit bounds only when filter changes, not on every update
  // Disabled to prevent Leaflet errors - users can manually zoom/pan
  /*
  useEffect(() => {
    // fitBounds functionality disabled due to Leaflet timing issues
  }, [filter]);
  */

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

      {/* Filter Buttons */}
      <div className="absolute top-4 left-4 z-[1000] flex gap-2">
        <Button
          size="sm"
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className="bg-white/95 backdrop-blur-md shadow-lg border border-gray-200 hover:bg-gray-100"
        >
          <span className="mr-2">🚚</span>
          Barchasi ({drivers.length})
        </Button>
        <Button
          size="sm"
          variant={filter === 'online' ? 'default' : 'outline'}
          onClick={() => setFilter('online')}
          className="bg-white/95 backdrop-blur-md shadow-lg border border-gray-200 hover:bg-gray-100"
        >
          <span className="mr-2">🟢</span>
          Onlayn ({onlineCount})
        </Button>
        <Button
          size="sm"
          variant={filter === 'busy' ? 'default' : 'outline'}
          onClick={() => setFilter('busy')}
          className="bg-white/95 backdrop-blur-md shadow-lg border border-gray-200 hover:bg-gray-100"
        >
          <span className="mr-2">🔴</span>
          Band ({busyCount})
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute top-48 right-4 z-[1000] bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Haydovchilar</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs">
              🚚
            </div>
            <span className="text-xs text-gray-700">Siz</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs">
              🚚
            </div>
            <span className="text-xs text-gray-700">Onlayn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs">
              🚚
            </div>
            <span className="text-xs text-gray-700">Band</span>
          </div>
        </div>
      </div>

      {/* Driver count */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-900">
            {filteredDrivers.length} haydovchi ko'rsatilmoqda
          </span>
        </div>
      </div>
    </div>
  );
};

export default MapViewAllDrivers;
