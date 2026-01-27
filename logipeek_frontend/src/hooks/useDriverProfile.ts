import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';
import { toast } from 'sonner';

export function useDriverProfile() {
  return useQuery({
    queryKey: ['driver-profile'],
    queryFn: async () => {
      const response = await usersApi.getProfile();
      return response.data;
    },
  });
}

export function useUpdateLicenseImage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (licenseImageUrl: string) => {
      const response = await usersApi.updateProfile(undefined, { licenseImageUrl });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-profile'] });
      toast.success('Haydovchilik guvohnomasi rasmi yuklandi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
    },
  });
}