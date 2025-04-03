
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useDonations } from '@/contexts/DonationContext';
import { Share2 } from 'lucide-react';
import { useState } from 'react';

export function ShareProfile() {
  const { user } = useAuth();
  const { summary } = useDonations();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  // Create a share URL (in a real app, this would be a real shareable link)
  const shareUrl = `${window.location.origin}/donors/${user.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: 'Link copied!',
      description: 'Share link has been copied to clipboard',
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.name}'s Giving Circle Profile`,
          text: `Check out my charitable giving profile with a total of ${formatCurrency(summary.total)} in donations!`,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Your Impact</CardTitle>
        <CardDescription>
          Share your giving profile with others to inspire generosity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">Generous Donor</p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-2xl font-bold">{formatCurrency(summary.total)}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(summary.monthly)}</p>
              <p className="text-xs text-muted-foreground">Monthly</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(summary.annual)}</p>
              <p className="text-xs text-muted-foreground">Annual</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Input
            value={shareUrl}
            readOnly
            onClick={(e) => e.currentTarget.select()}
          />
          <Button onClick={handleCopyLink} variant="outline">
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleShare} className="w-full">
          <Share2 className="mr-2 h-4 w-4" />
          Share My Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
