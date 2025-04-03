
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Donation {
  id: string;
  userId: string;
  amount: number;
  organizationName: string;
  date: string;
  frequency: 'one-time' | 'monthly' | 'annual';
  category?: string;
  notes?: string;
}

export interface DonationSummary {
  total: number;
  monthly: number;
  annual: number;
  oneTime: number;
}
