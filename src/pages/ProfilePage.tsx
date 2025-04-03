
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import { ShareProfile } from '@/components/ShareProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDonations } from '@/contexts/DonationContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DonationSummary } from '@/components/DonationSummary';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const { donations } = useDonations();
  
  useEffect(() => {
    document.title = 'My Profile | Giving Circle Insights';
    
    return () => {
      document.title = 'Giving Circle Insights';
    };
  }, []);
  
  // Redirect if not logged in
  if (!user && !isLoading) {
    return <Navigate to="/login" replace />;
  }
  
  if (!user || isLoading) return null;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Donation Profile</CardTitle>
                  <CardDescription>
                    Your charitable giving overview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="summary">
                    <TabsList className="mb-6">
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                      <TabsTrigger value="stats">Stats</TabsTrigger>
                    </TabsList>
                    <TabsContent value="summary">
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <StatCard 
                            label="Total Donations" 
                            value={donations.length} 
                            unit="donations"
                          />
                          <StatCard 
                            label="Unique Organizations" 
                            value={new Set(donations.map(d => d.organizationName)).size} 
                            unit="orgs"
                          />
                          <StatCard 
                            label="Categories" 
                            value={new Set(donations.filter(d => d.category).map(d => d.category)).size} 
                            unit="categories"
                          />
                        </div>
                        <DonationSummary />
                      </div>
                    </TabsContent>
                    <TabsContent value="stats">
                      <div className="space-y-6">
                        <p className="text-muted-foreground">
                          You've been tracking your donations since {
                            donations.length > 0 
                              ? new Date(Math.min(...donations.map(d => new Date(d.date).getTime()))).toLocaleDateString()
                              : 'you joined'
                          }.
                        </p>
                        
                        {donations.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Top Organizations</h3>
                            {Object.entries(
                              donations.reduce((acc, donation) => {
                                acc[donation.organizationName] = (acc[donation.organizationName] || 0) + 1;
                                return acc;
                              }, {} as Record<string, number>)
                            )
                              .sort((a, b) => b[1] - a[1])
                              .slice(0, 3)
                              .map(([org, count]) => (
                                <div key={org} className="flex justify-between items-center">
                                  <span>{org}</span>
                                  <span className="text-muted-foreground">{count} donation{count > 1 ? 's' : ''}</span>
                                </div>
                              ))
                            }
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <ShareProfile />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">© {new Date().getFullYear()} Giving Circle Insights. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  unit: string;
}

function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <div className="bg-muted rounded-lg p-4 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
