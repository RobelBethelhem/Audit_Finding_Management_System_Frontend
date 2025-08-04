import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Branch {
  id: string;
  branch_code: string;
  branch_name: string;
}

interface BranchAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  findingId: string;
  findingTitle: string;
  onAssignmentSuccess: () => void;
}

export const BranchAssignmentModal = ({
  isOpen,
  onClose,
  findingId,
  findingTitle,
  onAssignmentSuccess
}: BranchAssignmentModalProps) => {
  const { api } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);

  // Fetch available branches when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailableBranches();
    }
  }, [isOpen]);

  const fetchAvailableBranches = async () => {
    setLoadingBranches(true);
    try {
      const response = await api.get('/api/branch-assignments/available-branches');
      setBranches(response.data.branches || []);
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast.error('Failed to load available branches');
    } finally {
      setLoadingBranches(false);
    }
  };

  const handleAssignToBranch = async () => {
    if (!selectedBranchId) {
      toast.error('Please select a branch');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/branch-assignments/assign-to-branch', {
        finding_id: findingId,
        branch_id: selectedBranchId
      });

      toast.success(response.data.message || 'Audit finding assigned to branch successfully');
      onAssignmentSuccess();
      onClose();
      setSelectedBranchId('');
    } catch (error: any) {
      console.error('Error assigning to branch:', error);
      const errorMessage = error.response?.data?.error || 'Failed to assign audit finding to branch';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedBranchId('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign to Branch</DialogTitle>
          <DialogDescription>
            Assign the audit finding "{findingTitle}" to a branch. The branch supervisor will then assign it to a team member.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="branch-select">Select Branch</Label>
            {loadingBranches ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading branches...
              </div>
            ) : (
              <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                <SelectTrigger id="branch-select">
                  <SelectValue placeholder="Choose a branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.branch_code} - {branch.branch_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {branches.length === 0 && !loadingBranches && (
            <div className="text-sm text-muted-foreground bg-yellow-50 p-3 rounded-md">
              No branches available for assignment. Please contact your administrator.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleAssignToBranch} 
            disabled={loading || !selectedBranchId || branches.length === 0}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Assign to Branch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
