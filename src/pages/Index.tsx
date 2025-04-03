
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, isLoading } = useAuth();
  
  // Show simple loading indicator while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-t-transparent border-teal-500 animate-spin"></div>
      </div>
    );
  }
  
  // Redirect to dashboard if logged in, otherwise to home page
  return <Navigate to={user ? "/dashboard" : "/home"} replace />;
};

export default Index;
