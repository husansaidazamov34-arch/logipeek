import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driversApi } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useDriverStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['driver', 'stats'],
    queryFn: async () => {
      const response = await driversApi.getStats();
      return response.data;
    },
    enabled: user?.role === 'driver', // Only fetch if user is a driver
    retry: false,
    meta: {
      errorMessage: 'Failed to fetch driver stats',
    },
    // Suppress errors in console
    onError: () => {
      // Silently fail
    },
  });
};

export const useUpdateDriverLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { latitude: number; longitude: number }) =>
      driversApi.updateLocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver'] });
    },
    onError: (error: any) => {
      console.error('Location update failed:', error);
    },
  });
};

export const useUpdateDriverStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: 'online' | 'busy' | 'offline') =>
      driversApi.updateStatus(status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver'] });
      toast.success('Status yangilandi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
    },
  });
};

export const useOnlineDrivers = () => {
  return useQuery({
    queryKey: ['drivers', 'online'],
    queryFn: async () => {
      const response = await driversApi.getOnlineDrivers();
      return response.data;
    },
    refetchInterval: 10000, // Refresh every 10 seconds
    retry: false,
  });
};
