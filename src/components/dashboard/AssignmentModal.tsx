import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SearchableDropdown, transformToDropdownOptions } from '@/components/ui/searchable-dropdown';
import { toast } from 'sonner';
import { UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { AuditFinding } from '@/types/auditFinding';
import { User } from '@/types/user';

interface AssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  finding: AuditFinding | null;
  currentUser: User;
  onAssignmentSuccess?: () => void;
}

interface AssignableUser {
  id: string;
  username: string;
  email: string;
  role: string;
  department: string;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  open,
  onOpenChange,
  finding,
  currentUser,
  onAssignmentSuccess
}) => {
  const { api } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [users, setUsers] = useState<AssignableUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string>('');

  // Fetch assignable users when modal opens
  useEffect(() => {
    if (open && finding) {
      fetchAssignableUsers();
    }
  }, [open, finding]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedUserId('');
      setUsers([]);
      setError('');
    }
  }, [open]);

  const fetchAssignableUsers = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch assignable users from the same department
      const response = await api.get('/auth/assignable-users_by_branch', {
        params: {
          limit: 1000, // Get all assignable users in department
          is_active: true
        }
      });

      // Users are already filtered by the backend
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching assignable users:', error);
      setError('Failed to fetch assignable users. Please try again.');
      toast.error('Failed to fetch assignable users');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedUserId || !finding) {
      toast.error('Please select a user to assign');
      return;
    }

    setAssigning(true);
    setError('');

    try {
      const response = await api.post('/api/audit-finding-assignments', {
        finding_id: finding.id,
        assigned_to_id: selectedUserId
      });

      const assignedUser = users.find(user => user.id === selectedUserId);
      toast.success(`Successfully assigned finding to ${assignedUser?.username || 'user'}`);
      
      onOpenChange(false);
      if (onAssignmentSuccess) {
        onAssignmentSuccess();
      }
    } catch (error: any) {
      console.error('Error assigning finding:', error);
      const errorMessage = error.response?.data?.error || 'Failed to assign finding';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setAssigning(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  // Transform users for dropdown
  const userOptions = transformToDropdownOptions(
    users,
    'username',
    'role'
  ).map(option => {
    const user = users.find(u => u.id === option.id);
    return {
      ...option,
      description: user ? `${user.role.replace(/_/g, ' ')} • ${user.email}` : option.description
    };
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            Assign Audit Finding
          </DialogTitle>
          <DialogDescription>
            {finding ? (
              <>
                Assign "<strong>{finding.title}</strong>" to a team member from your department.
                Only users with Auditee roles can be assigned.
              </>
            ) : (
              'Select a user to assign this audit finding to.'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="assignee">Select Assignee</Label>
            <SearchableDropdown
              options={userOptions}
              value={selectedUserId}
              onValueChange={setSelectedUserId}
              placeholder="Choose a user to assign..."
              searchPlaceholder="Search users..."
              emptyMessage="No assignable users found"
              loading={loading}
              disabled={assigning}
              className="w-full"
            />
            {users.length === 0 && !loading && (
              <p className="text-sm text-gray-500">
                No assignable users found in your department. Users must have Auditee roles to be assigned.
              </p>
            )}
          </div>

          {selectedUserId && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="text-sm">
                <strong>Selected User:</strong>
                {(() => {
                  const selectedUser = users.find(u => u.id === selectedUserId);
                  return selectedUser ? (
                    <div className="mt-1">
                      <div className="font-medium">{selectedUser.username}</div>
                      <div className="text-gray-600">{selectedUser.role.replace(/_/g, ' ')}</div>
                      <div className="text-gray-600">{selectedUser.email}</div>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={assigning}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedUserId || assigning || loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {assigning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Assign
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
