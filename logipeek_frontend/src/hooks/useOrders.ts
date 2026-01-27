import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useAvailableOrders = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['orders', 'available'],
    queryFn: async () => {
      const response = await ordersApi.getAvailable();
      return response.data;
    },
    enabled: user?.role === 'driver',
    retry: false,
  });
};

export const useActiveOrders = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['orders', 'active'],
    queryFn: async () => {
      const response = await ordersApi.getActive();
      return response.data;
    },
    enabled: user?.role === 'driver',
    retry: false,
  });
};

export const useOrderHistory = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['orders', 'history'],
    queryFn: async () => {
      const response = await ordersApi.getHistory();
      return response.data;
    },
    enabled: user?.role === 'driver',
    retry: false,
  });
};

export const useAcceptOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => ordersApi.accept(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Buyurtma qabul qilindi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
    },
  });
};

export const useMarkAsDelivered = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => ordersApi.markAsDelivered(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      toast.success('Yuk yetkazildi deb belgilandi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
    },
  });
};

export const useConfirmDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, rating }: { orderId: string; rating: number }) => 
      ordersApi.confirmDelivery(orderId, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      toast.success('Yetkazilish tasdiqlandi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
    },
  });
};
