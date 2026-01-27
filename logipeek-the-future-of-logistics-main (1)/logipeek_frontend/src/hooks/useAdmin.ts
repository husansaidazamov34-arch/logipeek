import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await adminApi.getDashboardStats();
      return response.data;
    },
    retry: false,
  });
};

export const useAdminUsers = (page: number = 1, limit: number = 20, role?: string, search?: string) => {
  return useQuery({
    queryKey: ['admin', 'users', page, limit, role, search],
    queryFn: async () => {
      const response = await adminApi.getUsers(page, limit, role, search);
      return response.data;
    },
    retry: false,
  });
};

export const useAdmins = () => {
  return useQuery({
    queryKey: ['admin', 'admins'],
    queryFn: async () => {
      const response = await adminApi.getAdmins();
      return response.data;
    },
    retry: false,
  });
};

export const useAdminLogs = (page: number = 1, limit: number = 50, adminId?: string, action?: string) => {
  return useQuery({
    queryKey: ['admin', 'logs', page, limit, adminId, action],
    queryFn: async () => {
      const response = await adminApi.getLogs(page, limit, adminId, action);
      return response.data;
    },
    retry: false,
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => adminApi.createAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'admins'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'logs'] });
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (adminId: string) => adminApi.deleteAdmin(adminId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'admins'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'logs'] });
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: any }) => 
      adminApi.updateUserStatus(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'logs'] });
    },
  });
};

export const useGetUserDetails = (userId: string) => {
  return useQuery({
    queryKey: ['admin', 'user', userId],
    queryFn: async () => {
      const response = await adminApi.getUserDetails(userId);
      return response.data;
    },
    enabled: !!userId,
    retry: false,
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'logs'] });
    },
  });
};