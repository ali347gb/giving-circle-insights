
import { useState } from 'react';
import { useDonations } from '@/contexts/DonationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Pencil, Trash2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function DonationsList() {
  const { donations, isLoading, deleteDonation } = useDonations();
  const [selectedDonation, setSelectedDonation] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selectedDonation) return;
    
    setIsDeleting(true);
    
    try {
      await deleteDonation(selectedDonation);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      // Error handled in context
    } finally {
      setIsDeleting(false);
      setSelectedDonation(null);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getFrequencyBadge = (frequency: string) => {
    switch (frequency) {
      case 'one-time':
        return <Badge variant="outline">One-time</Badge>;
      case 'monthly':
        return <Badge variant="secondary">Monthly</Badge>;
      case 'annual':
        return <Badge className="bg-purple-600">Annual</Badge>;
      default:
        return <Badge variant="outline">{frequency}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Donations</CardTitle>
        <CardDescription>
          Track and manage all your generous contributions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No donations yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Start recording your charitable giving by adding your first donation.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">
                      {donation.organizationName}
                      {donation.category && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {donation.category}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatAmount(donation.amount)}</TableCell>
                    <TableCell>{formatDate(donation.date)}</TableCell>
                    <TableCell>{getFrequencyBadge(donation.frequency)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            // Edit functionality would go here
                            console.log('Edit donation:', donation.id);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedDonation(donation.id);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this donation? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
