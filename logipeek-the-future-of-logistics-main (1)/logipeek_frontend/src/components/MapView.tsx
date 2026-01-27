import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

interface MapViewProps {
  pickup: string;
  dropoff: string;
  showAnimation?: boolean;
}

const MapView = ({ pickup, dropoff, showAnimation = true }: MapViewProps) => {
  return (
    <div className="relative w-full h-full min-h-[300px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Animated route line */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Route path */}
        <motion.path
          d="M 60 220 Q 120 180, 160 140 T 260 100 Q 300 80, 340 60"
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Animated dot on path */}
        {showAnimation && (
          <motion.circle
            r="6"
            fill="#0ea5e9"
            filter="url(#glow)"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ offsetPath: "path('M 60 220 Q 120 180, 160 140 T 260 100 Q 300 80, 340 60')" }}
          />
        )}
      </svg>

      {/* Pickup marker */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="absolute left-[10%] bottom-[20%]"
      >
        <div className="relative">
          {/* Pulse ring */}
          <div className="absolute inset-0 w-12 h-12 -translate-x-1/2 -translate-y-1/2 bg-success/30 rounded-full animate-ping" />
          <div className="relative w-12 h-12 -translate-x-1/2 -translate-y-1/2 bg-success rounded-full flex items-center justify-center shadow-lg shadow-success/50">
            <MapPin className="w-6 h-6 text-success-foreground" />
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-success/90 text-success-foreground text-xs px-2 py-1 rounded-md whitespace-nowrap backdrop-blur-sm">
            Pickup
          </div>
        </div>
      </motion.div>

      {/* Dropoff marker */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
        className="absolute right-[10%] top-[15%]"
      >
        <div className="relative">
          {/* Pulse ring */}
          <div className="absolute inset-0 w-12 h-12 -translate-x-1/2 -translate-y-1/2 bg-primary/30 rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
          <div className="relative w-12 h-12 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/50">
            <Navigation className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-md whitespace-nowrap backdrop-blur-sm">
            Drop-off
          </div>
        </div>
      </motion.div>

      {/* Live indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
        <span className="text-xs text-white font-medium">Live Tracking</span>
      </div>

      {/* Zoom controls mock */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors">
          +
        </button>
        <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors">
          −
        </button>
      </div>

      {/* Distance info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl"
      >
        <p className="text-white/70 text-xs">Distance</p>
        <p className="text-white font-bold">298 km</p>
      </motion.div>
    </div>
  );
};

export default MapView;
