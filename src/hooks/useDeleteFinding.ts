import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { AuditFinding } from '@/types/auditFinding';

interface UseDeleteFindingReturn {
  deleteFinding: (findingId: string, findingTitle?: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export const useDeleteFinding = (): UseDeleteFindingReturn => {
  const { api } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteFinding = async (findingId: string, findingTitle?: string): Promise<boolean> => {
    console.log('🗑️ Attempting to delete finding:', findingId, findingTitle);
    
    setLoading(true);
    setError(null);

    try {
      await api.delete(`/api/audit-findings/${findingId}`);
      
      console.log('✅ Finding deleted successfully');
      toast.success(
        findingTitle 
          ? `Finding "${findingTitle}" deleted successfully`
          : 'Audit finding deleted successfully'
      );
      
      return true;
    } catch (error: any) {
      console.error('❌ Error deleting finding:', error);
      
      let errorMessage = 'Failed to delete audit finding';
      
      if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to delete this finding';
      } else if (error.response?.status === 404) {
        errorMessage = 'Finding not found or already deleted';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteFinding,
    loading,
    error
  };
};

// Utility function to check if user can delete a finding
export const canDeleteFinding = (finding: AuditFinding, currentUserId: string, currentUserRole: string): boolean => {
  // Admin can delete any finding
  if (currentUserRole === 'Admin') {
    return true;
  }

  // Creator can delete their own finding
  if (finding.created_by_id === currentUserId) {
    return true;
  }

  // Supervisors and directors can delete findings in their department
  const supervisorRoles = [
    'Audit_Supervisor', 'Audit_Director',
    'IT_Auditors_Supervisor', 'IT_Auditors_Director',
    'Inspection_Auditors_Supervisor', 'Inspection_Auditors_Director'
  ];

  if (supervisorRoles.includes(currentUserRole)) {
    // Additional logic could be added here to check department matching
    // For now, we'll rely on backend authorization
    return true;
  }

  return false;
};
