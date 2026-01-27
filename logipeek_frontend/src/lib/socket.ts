import { io, Socket } from 'socket.io-client';
import { getToken } from './auth';

const WS_URL = import.meta.env.VITE_WS_URL || window.location.origin;

let socket: Socket | null = null;

export const initSocket = () => {
  const token = getToken();
  
  if (!token) {
    console.warn('No token found, socket connection skipped');
    return null;
  }

  if (socket?.connected) {
    return socket;
  }

  try {
    socket = io(WS_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 3,
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      // Silently handle connection errors
      console.debug('Socket connection error (will retry):', error.message);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  } catch (error) {
    console.error('Failed to initialize socket:', error);
    return null;
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

// Event listeners
export const onNotification = (callback: (data: any) => void) => {
  socket?.on('notification', callback);
};

export const onOrderUpdate = (callback: (data: any) => void) => {
  socket?.on('orderUpdate', callback);
};

export const onLocationUpdate = (callback: (data: any) => void) => {
  socket?.on('locationUpdate', callback);
};

export const offNotification = () => {
  socket?.off('notification');
};

export const offOrderUpdate = () => {
  socket?.off('orderUpdate');
};

export const offLocationUpdate = () => {
  socket?.off('locationUpdate');
};

// Emit events
export const emitLocationUpdate = (data: { latitude: number; longitude: number }) => {
  socket?.emit('updateLocation', data);
};
