
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import { DonationSummary } from '@/components/DonationSummary';
import { DonationsList } from '@/components/DonationsList';
import { DonationForm } from '@/components/DonationForm';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    // Set page title
    document.title = 'Dashboard | Giving Circle Insights';
    
    return () => {
      document.title = 'Giving Circle Insights';
    };
  }, []);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow container mx-auto py-8 px-4">
          <div className="space-y-8">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    );
  }
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-muted-foreground">
            Track, manage, and share your donations
          </p>
        </div>
        
        <div className="mb-8">
          <DonationSummary />
        </div>
        
        <Tabs defaultValue="donations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="addDonation">Add Donation</TabsTrigger>
          </TabsList>
          <TabsContent value="donations" className="space-y-4">
            <DonationsList />
          </TabsContent>
          <TabsContent value="addDonation">
            <DonationForm />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="border-t py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">© {new Date().getFullYear()} Giving Circle Insights. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
