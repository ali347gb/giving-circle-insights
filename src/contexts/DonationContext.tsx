
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Donation, DonationSummary } from '@/types';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

type DonationContextType = {
  donations: Donation[];
  isLoading: boolean;
  summary: DonationSummary;
  addDonation: (donation: Omit<Donation, 'id' | 'userId'>) => Promise<void>;
  deleteDonation: (id: string) => Promise<void>;
  editDonation: (id: string, donation: Partial<Omit<Donation, 'id' | 'userId'>>) => Promise<void>;
};

// Mock donation data
const mockDonations: Donation[] = [
  {
    id: '1',
    userId: '1',
    amount: 100,
    organizationName: 'Red Cross',
    date: '2023-12-15',
    frequency: 'one-time',
    category: 'Disaster Relief',
    notes: 'Annual holiday donation',
  },
  {
    id: '2',
    userId: '1',
    amount: 25,
    organizationName: 'World Wildlife Fund',
    date: '2023-11-20',
    frequency: 'monthly',
    category: 'Environment',
  },
  {
    id: '3',
    userId: '1',
    amount: 500,
    organizationName: 'Local Food Bank',
    date: '2023-10-05',
    frequency: 'annual',
    category: 'Hunger',
    notes: 'Supporting local community',
  },
  {
    id: '4',
    userId: '2',
    amount: 200,
    organizationName: 'Doctors Without Borders',
    date: '2023-09-10',
    frequency: 'one-time',
    category: 'Healthcare',
  },
];

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export const DonationProvider = ({ children }: { children: ReactNode }) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<DonationSummary>({
    total: 0,
    monthly: 0,
    annual: 0,
    oneTime: 0,
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadUserDonations();
    } else {
      setDonations([]);
      setSummary({
        total: 0,
        monthly: 0,
        annual: 0,
        oneTime: 0,
      });
    }
  }, [user]);

  useEffect(() => {
    calculateSummary();
  }, [donations]);

  const loadUserDonations = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!user) return;
      
      // Filter donations for current user
      const userDonations = mockDonations.filter(d => d.userId === user.id);
      setDonations(userDonations);
    } catch (error) {
      console.error('Error loading donations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your donations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSummary = () => {
    const total = donations.reduce((sum, donation) => sum + donation.amount, 0);
    
    const monthly = donations
      .filter(d => d.frequency === 'monthly')
      .reduce((sum, donation) => sum + donation.amount, 0);
    
    const annual = donations
      .filter(d => d.frequency === 'annual')
      .reduce((sum, donation) => sum + donation.amount, 0);
    
    const oneTime = donations
      .filter(d => d.frequency === 'one-time')
      .reduce((sum, donation) => sum + donation.amount, 0);
    
    setSummary({
      total,
      monthly,
      annual,
      oneTime,
    });
  };

  const addDonation = async (donation: Omit<Donation, 'id' | 'userId'>) => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!user) throw new Error('User not authenticated');
      
      const newDonation: Donation = {
        ...donation,
        id: `${Date.now()}`,
        userId: user.id,
      };
      
      // In a real app, we would save to a database
      mockDonations.push(newDonation);
      
      // Update local state
      setDonations(prev => [...prev, newDonation]);
      
      toast({
        title: 'Donation added',
        description: `${donation.amount} to ${donation.organizationName}`,
      });
    } catch (error) {
      console.error('Error adding donation:', error);
      toast({
        title: 'Error',
        description: 'Failed to add donation',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDonation = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find donation index in the mock array
      const index = mockDonations.findIndex(d => d.id === id);
      
      if (index !== -1) {
        mockDonations.splice(index, 1);
      }
      
      // Update local state
      setDonations(prev => prev.filter(d => d.id !== id));
      
      toast({
        title: 'Donation deleted',
        description: 'Donation has been removed',
      });
    } catch (error) {
      console.error('Error deleting donation:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete donation',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const editDonation = async (
    id: string,
    donationUpdate: Partial<Omit<Donation, 'id' | 'userId'>>
  ) => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find donation in the mock array
      const index = mockDonations.findIndex(d => d.id === id);
      
      if (index !== -1) {
        mockDonations[index] = {
          ...mockDonations[index],
          ...donationUpdate,
        };
      }
      
      // Update local state
      setDonations(prev =>
        prev.map(d => (d.id === id ? { ...d, ...donationUpdate } : d))
      );
      
      toast({
        title: 'Donation updated',
        description: 'Your changes have been saved',
      });
    } catch (error) {
      console.error('Error updating donation:', error);
      toast({
        title: 'Error',
        description: 'Failed to update donation',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DonationContext.Provider
      value={{
        donations,
        isLoading,
        summary,
        addDonation,
        deleteDonation,
        editDonation,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};

export const useDonations = () => {
  const context = useContext(DonationContext);
  
  if (context === undefined) {
    throw new Error('useDonations must be used within a DonationProvider');
  }
  
  return context;
};
