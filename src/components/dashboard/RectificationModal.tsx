import React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { AuditRectificationDetail } from './AuditRectificationDetail';
import { AuditFinding } from '@/types/auditFinding';
import { User as UserType } from '@/types/user';

interface RectificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  finding: AuditFinding | null;
  currentUser: UserType;
  onRectificationUpdate?: () => void;
}

export const RectificationModal: React.FC<RectificationModalProps> = ({
  open,
  onOpenChange,
  finding,
  currentUser,
  onRectificationUpdate
}) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  const handleRectificationUpdate = () => {
    if (onRectificationUpdate) {
      onRectificationUpdate();
    }
    // Close the modal after update
    handleClose();
  };

  if (!finding) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0">
        <AuditRectificationDetail
          finding={finding}
          currentUser={currentUser}
          onBack={handleClose}
          onRectificationUpdate={handleRectificationUpdate}
        />
      </DialogContent>
    </Dialog>
  );
};
