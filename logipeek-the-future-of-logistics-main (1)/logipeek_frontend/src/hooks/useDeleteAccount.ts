import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.delete('/users/me');
      return response.data;
    },
  });
};