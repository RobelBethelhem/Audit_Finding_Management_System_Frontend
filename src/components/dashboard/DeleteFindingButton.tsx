import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useDeleteFinding, canDeleteFinding } from '@/hooks/useDeleteFinding';
import { Trash2 } from 'lucide-react';
import { AuditFinding } from '@/types/auditFinding';
import { User } from '@/hooks/useAuth';

interface DeleteFindingButtonProps {
  finding: AuditFinding;
  user: User;
  onDeleted?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showText?: boolean;
  className?: string;
}

export const DeleteFindingButton: React.FC<DeleteFindingButtonProps> = ({
  finding,
  user,
  onDeleted,
  variant = 'outline',
  size = 'default',
  showText = true,
  className = ''
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { deleteFinding, loading } = useDeleteFinding();

  // Check if user has permission to delete this finding
  const canDelete = canDeleteFinding(finding, user.id, user.role);

  if (!canDelete) {
    return null; // Don't render the button if user can't delete
  }

  const handleDelete = async () => {
    const success = await deleteFinding(finding.id, finding.title);
    
    if (success) {
      setShowConfirmDialog(false);
      if (onDeleted) {
        onDeleted();
      }
    }
    // Error handling is done in the hook
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowConfirmDialog(true)}
        disabled={loading}
        className={`text-red-600 hover:text-red-700 hover:bg-red-50 ${className}`}
      >
        <Trash2 className={`h-4 w-4 ${showText ? 'mr-2' : ''}`} />
        {showText && 'Delete'}
      </Button>

      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Delete Audit Finding"
        description={`Are you sure you want to delete the finding "${finding.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={handleCancel}
        variant="destructive"
        loading={loading}
      />
    </>
  );
};
