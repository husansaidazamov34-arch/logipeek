import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, Package, Truck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/hooks/useNotifications';
import { useTranslation } from '@/hooks/useTranslation';

export const NotificationsDropdown = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { data: apiNotifications, isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  // Mock notifications as fallback (with local state)
  const getMockNotifications = () => [
    {
      id: 'mock-1',
      title: t('notifications.orderCreated'),
      message: `${t('notifications.orderNumber')}: SHP-2026-0003. ${t('notifications.waitingDriver')}.`,
      type: 'order',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mock-2',
      title: t('notifications.cargoDelivered'),
      message: `Sizning yukingiz #SHP-2026-0001 yetkazildi. ${t('notifications.confirmDelivery')}.`,
      type: 'shipment',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'mock-3',
      title: t('notifications.orderAccepted'),
      message: `Sizning buyurtmangiz #SHP-2026-0001 ${t('notifications.acceptedByDriver')}.`,
      type: 'alert',
      isRead: true,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ];

  const [mockNotifications, setMockNotifications] = useState(getMockNotifications());

  // Determine if we're using mock data
  const usingMockData = !apiNotifications || apiNotifications.length === 0;
  
  // Use API data if available, otherwise use mock data
  const notifications = usingMockData ? mockNotifications : apiNotifications;

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    // If using mock data, update local state only
    if (usingMockData) {
      setMockNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      return;
    }

    // Otherwise, call API
    try {
      await markAsRead.mutateAsync(id);
    } catch (error) {
      console.debug('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    // If using mock data, update local state only
    if (usingMockData) {
      setMockNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      return;
    }

    // Otherwise, call API
    try {
      await markAllAsRead.mutateAsync();
    } catch (error) {
      console.debug('Failed to mark all as read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-5 h-5 text-primary" />;
      case 'shipment':
        return <Truck className="w-5 h-5 text-accent" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-muted transition-colors"
      >
        <Bell className="w-5 h-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-xs text-destructive-foreground font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-80 max-h-96 overflow-hidden glass-card border border-border/50 rounded-2xl shadow-xl z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{t('notifications.title')}</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-muted-foreground">{unreadCount} {t('notifications.unread')}</p>
                  )}
                </div>
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleMarkAllAsRead}
                    className="text-xs"
                  >
                    {t('notifications.markAllRead')}
                  </Button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground text-sm">{t('notifications.noNotifications')}</p>
                  </div>
                ) : (
                  notifications.map((notification: any) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-border/30 hover:bg-muted/50 transition-colors ${
                        !notification.isRead ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-medium text-foreground text-sm">
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground/60 mt-2">
                                {new Date(notification.createdAt).toLocaleString('uz-UZ', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="flex-shrink-0 p-1 hover:bg-muted rounded-lg transition-colors"
                                title={t('notifications.markAsRead')}
                              >
                                <Check className="w-4 h-4 text-success" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-border/50 text-center">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-sm text-primary hover:underline"
                  >
                    {t('notifications.close')}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
