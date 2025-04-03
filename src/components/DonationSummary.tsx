
import { useDonations } from '@/contexts/DonationContext';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

export function DonationSummary() {
  const { summary, isLoading } = useDonations();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const pieChartData = [
    { name: 'One-time', value: summary.oneTime, color: '#14b8a6' },
    { name: 'Monthly', value: summary.monthly, color: '#0d9488' },
    { name: 'Annual', value: summary.annual, color: '#7e22ce' },
  ].filter(item => item.value > 0);

  const barChartData = [
    {
      name: 'Donation Types',
      'One-time': summary.oneTime,
      'Monthly': summary.monthly,
      'Annual': summary.annual,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <SummaryCard 
        title="Total Donations" 
        value={summary.total} 
        isLoading={isLoading} 
        className="bg-gradient-to-br from-teal-500 to-teal-600"
      />
      <SummaryCard 
        title="Monthly Donations" 
        value={summary.monthly} 
        isLoading={isLoading} 
        className="bg-gradient-to-br from-teal-600 to-teal-700"
      />
      <SummaryCard 
        title="Annual Donations" 
        value={summary.annual} 
        isLoading={isLoading} 
        className="bg-gradient-to-br from-purple-600 to-purple-700"
      />
      <SummaryCard 
        title="One-time Donations" 
        value={summary.oneTime} 
        isLoading={isLoading} 
        className="bg-gradient-to-br from-teal-400 to-teal-500"
      />

      {summary.total > 0 && (
        <>
          <Card className="col-span-1 md:col-span-2">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Donation Distribution</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value as number), 'Amount']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Donation Breakdown</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value as number), 'Amount']}
                    />
                    <Legend />
                    <Bar dataKey="One-time" fill="#14b8a6" />
                    <Bar dataKey="Monthly" fill="#0d9488" />
                    <Bar dataKey="Annual" fill="#7e22ce" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: number;
  isLoading: boolean;
  className?: string;
}

function SummaryCard({ title, value, isLoading, className }: SummaryCardProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        {isLoading ? (
          <Skeleton className="h-12 w-full bg-white/20" />
        ) : (
          <p className="text-3xl font-bold mt-2 text-white">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
