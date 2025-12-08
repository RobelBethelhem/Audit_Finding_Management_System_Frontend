import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, User } from 'lucide-react';

interface AssignableUser {
  id: string;
  username: string;
  email: string;
  role: string;
  department: string;
}

interface UserAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  findingId: string;
  findingTitle: string;
  branchId: string;
  branchName: string;
  onAssignmentSuccess: () => void;
}

export const UserAssignmentModal = ({
  isOpen,
  onClose,
  findingId,
  findingTitle,
  branchId,
  branchName,
  onAssignmentSuccess
}: UserAssignmentModalProps) => {
  const { api } = useAuth();
  const [users, setUsers] = useState<AssignableUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch assignable users when modal opens
  useEffect(() => {
    if (isOpen && branchId) {
      fetchAssignableUsers();
    }
  }, [isOpen, branchId]);

  const fetchAssignableUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await api.put(`ZAMS/api/branch-assignments/assignable-users/${branchId}`);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching assignable users:', error);
      toast.error('Failed to load assignable users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAssignToUser = async () => {
    if (!selectedUserId) {
      toast.error('Please select a user');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/ZAMS/api/branch-assignments/assign-to-user', {
        finding_id: findingId,
        assigned_to_id: selectedUserId
      });

      toast.success(response.data.message || 'User assigned to audit finding successfully');
      onAssignmentSuccess();
      onClose();
      setSelectedUserId('');
    } catch (error: any) {
      console.error('Error assigning to user:', error);
      const errorMessage = error.response?.data?.error || 'Failed to assign user to audit finding';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedUserId('');
    onClose();
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'Auditees': 'Auditee',
      'IT_Auditees': 'IT Auditee',
      'Inspection_Auditees': 'Inspection Auditee'
    };
    return roleMap[role] || role;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Assign to Team Member</DialogTitle>
          <DialogDescription>
            Assign the audit finding "{findingTitle}" to a team member in {branchName}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="user-select">Select Team Member</Label>
            {loadingUsers ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading team members...
              </div>
            ) : (
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger id="user-select">
                  <SelectValue placeholder="Choose a team member" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <div className="flex flex-col">
                          <span className="font-medium">{user.username}</span>
                          <span className="text-xs text-muted-foreground">
                            {getRoleDisplayName(user.role)} • {user.email}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {users.length === 0 && !loadingUsers && (
            <div className="text-sm text-muted-foreground bg-yellow-50 p-3 rounded-md">
              No assignable team members found in this branch. Please ensure there are active auditee users in your branch.
            </div>
          )}

          {users.length > 0 && (
            <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-md">
              <strong>Note:</strong> Only users with Auditee roles in your branch can be assigned to audit findings.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleAssignToUser} 
            disabled={loading || !selectedUserId || users.length === 0}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Assign to User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
