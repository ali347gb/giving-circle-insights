
import { NavBar } from '@/components/NavBar';
import { LoginForm } from '@/components/LoginForm';
import { Button } from '@/components/ui/button';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  
  // Redirect if already logged in
  if (user && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm />
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button variant="link" asChild className="p-0">
                <Link to="/register">Register</Link>
              </Button>
            </p>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">© {new Date().getFullYear()} Giving Circle Insights. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
