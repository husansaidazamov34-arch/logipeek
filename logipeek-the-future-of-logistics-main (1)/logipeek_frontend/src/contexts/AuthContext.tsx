import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getToken, setToken, removeToken, getUser, setUser as saveUser, removeUser } from '@/lib/auth';
import { authApi } from '@/lib/api';
import { initSocket, disconnectSocket } from '@/lib/socket';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: 'driver' | 'shipper';
  // Driver fields
  licensePlate?: string;
  licenseNumber?: string;
  // Shipper fields
  companyName?: string;
  companyAddress?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const savedUser = getUser();

      if (token && savedUser) {
        try {
          const response = await authApi.getMe();
          console.log('Auth response:', response.data);
          setUserState(response.data);
          saveUser(response.data);
          
          // Initialize socket connection only after successful auth
          setTimeout(() => {
            initSocket();
          }, 500);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          removeToken();
          removeUser();
        }
      }
      setLoading(false);
    };

    initAuth();

    // Cleanup socket on unmount
    return () => {
      disconnectSocket();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      const { token, user: userData } = response.data;
      
      console.log('Login response:', userData);
      
      setToken(token);
      saveUser(userData);
      setUserState(userData);
      
      // Initialize socket after login with delay
      setTimeout(() => {
        initSocket();
      }, 500);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authApi.register(data);
      const { token, user: userData } = response.data;
      
      setToken(token);
      saveUser(userData);
      setUserState(userData);
      
      // Initialize socket after registration with delay
      setTimeout(() => {
        initSocket();
      }, 500);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    disconnectSocket();
    removeToken();
    removeUser();
    setUserState(null);
    window.location.href = '/login';
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.getMe();
      setUserState(response.data);
      saveUser(response.data);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
