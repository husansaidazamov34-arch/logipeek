import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      console.log('User role:', user.role, 'User data:', user);
      // Redirect based on user role - admin first priority
      if (user.role === 'admin') {
        console.log('Redirecting to admin panel');
        navigate('/admin', { replace: true });
      } else if (user.role === 'driver') {
        console.log('Redirecting to driver dashboard');
        navigate('/driver', { replace: true });
      } else if (user.role === 'shipper') {
        console.log('Redirecting to shipper dashboard');
        navigate('/shipper', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // If not logged in, show login prompt
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">LogiPeek</h1>
        <p className="text-muted-foreground mb-6">Iltimos, tizimga kiring</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Kirish
        </button>
      </div>
    </div>
  );
};

export default Index;
