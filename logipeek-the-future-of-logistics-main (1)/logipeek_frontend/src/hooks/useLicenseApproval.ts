import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export function usePendingLicenseApprovals() {
  return useQuery({
    queryKey: ['pending-license-approvals'],
    queryFn: async () => {
      const response = await api.get('/admin/licenses/pending');
      return response.data;
    },
  });
}

export function useApprovedLicenses() {
  return useQuery({
    queryKey: ['approved-licenses'],
    queryFn: async () => {
      const response = await api.get('/admin/licenses/approved');
      return response.data;
    },
  });
}

export function useRejectedLicenses() {
  return useQuery({
    queryKey: ['rejected-licenses'],
    queryFn: async () => {
      const response = await api.get('/admin/licenses/rejected');
      return response.data;
    },
  });
}

export function useApproveLicense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ driverId, approved }: { driverId: string; approved: boolean }) => {
      const response = await api.post('/admin/licenses/approve', { driverId, approved });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pending-license-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['approved-licenses'] });
      queryClient.invalidateQueries({ queryKey: ['rejected-licenses'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(variables.approved ? 'Guvohnoma tasdiqlandi' : 'Guvohnoma rad etildi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
    },
  });
}