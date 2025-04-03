
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, ChartBar, Share2, DollarSign } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block p-2 bg-teal-100 rounded-full mb-6">
              <Heart className="h-8 w-8 text-teal-600" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Track Your <span className="bg-gradient-to-r from-teal-500 to-purple-600 text-transparent bg-clip-text">Charitable Impact</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Record, visualize, and share your donations. See your generosity add up over time and inspire others to give.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button size="lg" asChild>
                  <Link to="/dashboard">
                    Go to Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link to="/register">
                      Get Started
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/login">
                      Log In
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Track Your Donations?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<DollarSign className="h-10 w-10 text-teal-500" />}
                title="Track All Donations"
                description="Keep a record of every contribution, whether it's one-time, monthly, or annual."
              />
              <FeatureCard 
                icon={<ChartBar className="h-10 w-10 text-teal-500" />}
                title="Visualize Your Impact"
                description="See beautiful charts of your giving patterns and total contributions over time."
              />
              <FeatureCard 
                icon={<Share2 className="h-10 w-10 text-teal-500" />}
                title="Share Your Generosity"
                description="Inspire others by sharing your giving profile with friends and family."
              />
            </div>
          </div>
        </section>
        
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to Start Tracking?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Join thousands of donors who are keeping track of their charitable impact.
            </p>
            {user ? (
              <Button size="lg" asChild>
                <Link to="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            ) : (
              <Button size="lg" asChild>
                <Link to="/register">
                  Create Free Account
                </Link>
              </Button>
            )}
          </div>
        </section>
      </main>
      
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Giving Circle Insights. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-background rounded-lg p-6 shadow-sm">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
