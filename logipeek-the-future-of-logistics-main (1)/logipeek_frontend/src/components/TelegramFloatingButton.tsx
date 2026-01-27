import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const TelegramFloatingButton = () => {
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null);

  // Auto-move animation - gentle floating movement
  useEffect(() => {
    if (isDragging) return;

    const interval = setInterval(() => {
      setPosition(prev => {
        const maxX = window.innerWidth - 60;
        const maxY = window.innerHeight - 60;
        
        // Gentle movement within bounds
        const newX = Math.max(20, Math.min(maxX, prev.x + (Math.random() - 0.5) * 50));
        const newY = Math.max(20, Math.min(maxY, prev.y + (Math.random() - 0.5) * 50));
        
        return { x: newX, y: newY };
      });
    }, 4000); // Move every 4 seconds

    return () => clearInterval(interval);
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 60;
    
    setPosition({
      x: Math.max(0, Math.min(maxX, e.clientX - dragStart.x)),
      y: Math.max(0, Math.min(maxY, e.clientY - dragStart.y))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (clickTimer) {
        clearTimeout(clickTimer);
      }
    };
  }, [clickTimer]);

  const handleTelegramClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Agar drag qilinayotgan bo'lsa, hech narsa qilma
    if (isDragging) return;
    
    // Click count ni oshir
    setClickCount(prev => prev + 1);
    
    // Agar timer mavjud bo'lsa, uni bekor qil
    if (clickTimer) {
      clearTimeout(clickTimer);
    }
    
    // Yangi timer o'rnat
    const newTimer = setTimeout(() => {
      if (clickCount + 1 >= 2) {
        // 2 marta bosilgan - Telegram botni och
        window.open('https://t.me/logi_peek_bot', '_blank');
      }
      // Click count ni reset qil
      setClickCount(0);
      setClickTimer(null);
    }, 300); // 300ms ichida 2 marta bosish kerak
    
    setClickTimer(newTimer);
  };

  return (
    <motion.div
      className="fixed z-[9999] cursor-pointer select-none"
      style={{
        left: position.x,
        top: position.y,
      }}
      animate={{
        x: 0,
        y: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onMouseDown={handleMouseDown}
      onClick={handleTelegramClick}
    >
      {/* Main Telegram Button */}
      <motion.div
        className="relative w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-full shadow-lg flex items-center justify-center group"
        animate={{
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Telegram Icon */}
        <motion.svg
          className="w-6 h-6 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.377 2.617-1.407 3.08-2.863 1.624l-3.552-2.624-1.785 1.711c-.191.191-.353.353-.721.353l.256-3.673L18.72 6.73c.353-.32-.077-.497-.549-.177l-8.085 5.089-3.488-1.088c-.756-.235-.77-.756.16-1.12L17.216 5.96c.624-.246 1.17.15.352 1.2z"/>
        </motion.svg>

        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 border-2 border-blue-300 rounded-full"
          animate={{
            scale: [1, 1.8, 2.2],
            opacity: [0.6, 0.2, 0]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      </motion.div>

      {/* Tooltip */}
      <motion.div
        className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none"
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 0, x: -5 }}
        whileHover={{ opacity: 1, x: 0 }}
      >
        2 marta bosing - @logi_peek_bot
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-gray-900 rotate-45"></div>
      </motion.div>

      {/* Floating message bubbles */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-300 rounded-full"
          style={{
            left: 15 + i * 10,
            top: -8,
          }}
          animate={{
            y: [-8, -20, -8],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.div>
  );
};