import api from './api';
import { Branch } from '@/types/branch';
import { inspectorBranchAssignmentService } from './inspectorBranchAssignmentService';

export interface BranchSelectionOption {
  id: string;
  branch_code: string;
  branch_name: string;
  label: string; // For display in dropdown
  value: string; // For form value
}

export const branchService = {
  // Get all available branches
  async getAllBranches(): Promise<BranchSelectionOption[]> {
    try {
      const response = await api.get('/api/branches?limit=1000');
      const branches: Branch[] = response.data.branches || [];

      if (!Array.isArray(branches)) {
        console.warn('Invalid branches response:', response.data);
        return [];
      }

      return branches
        .filter(branch => branch?.is_active && branch?.id && branch?.branch_code && branch?.branch_name)
        .map(branch => ({
          id: branch.id,
          branch_code: branch.branch_code,
          branch_name: branch.branch_name,
          label: `${branch.branch_code} - ${branch.branch_name}`,
          value: branch.id
        }));
    } catch (error: any) {
      console.error('Error fetching all branches:', error);
      // Return empty array for non-critical errors
      if (error.response?.status === 404) {
        console.warn('No branches found in the system');
        return [];
      }
      throw error;
    }
  },

  // Get user's associated branch (for Resident_Auditors)
  async getUserBranch(userId: string): Promise<BranchSelectionOption | null> {
    try {
      const response = await api.get(`/api/users/${userId}/branch`);
      const branch: Branch = response.data.branch;

      if (!branch) {
        return null;
      }

      return {
        id: branch.id,
        branch_code: branch.branch_code,
        branch_name: branch.branch_name,
        label: `${branch.branch_code} - ${branch.branch_name}`,
        value: branch.id
      };
    } catch (error: any) {
      console.error('Error fetching user branch:', error);
      // If endpoint doesn't exist or user not found, return null
      if (error.response?.status === 404 || error.response?.status === 400) {
        console.warn(`User ${userId} has no associated branch or endpoint not available`);
        return null;
      }
      // For other errors, still return null but log the error
      if (error.response?.status >= 500) {
        console.error('Server error when fetching user branch:', error.response?.data);
        return null;
      }
      throw error;
    }
  },

  // Get branches assigned to an inspector (for Inspection_Auditors)
  async getInspectorAssignedBranches(inspectorId: string): Promise<BranchSelectionOption[]> {
    try {
      if (!inspectorId) {
        throw new Error('Inspector ID is required');
      }

      const assignments = await inspectorBranchAssignmentService.getByInspectorId(inspectorId);

      if (!Array.isArray(assignments)) {
        console.warn('Invalid assignments response:', assignments);
        return [];
      }

      // Filter active assignments and extract branches
      const activeBranches = assignments
        .filter(assignment => assignment?.is_active && assignment?.branch)
        .map(assignment => assignment.branch)
        .filter(branch => branch && branch.is_active && branch.id && branch.branch_code && branch.branch_name);

      return activeBranches.map(branch => ({
        id: branch.id,
        branch_code: branch.branch_code,
        branch_name: branch.branch_name,
        label: `${branch.branch_code} - ${branch.branch_name}`,
        value: branch.id
      }));
    } catch (error: any) {
      console.error('Error fetching inspector assigned branches:', error);
      // Return empty array instead of throwing to prevent component crashes
      if (error.response?.status === 404) {
        console.warn(`No branch assignments found for inspector ${inspectorId}`);
        return [];
      }
      throw error;
    }
  },

  // Get branches based on user role
  async getBranchesForUser(user: { id: string; role: string }): Promise<{
    branches: BranchSelectionOption[];
    isFixed: boolean; // Whether user can change selection
    defaultBranch?: BranchSelectionOption;
  }> {
    try {
      switch (user.role) {
        case 'Resident_Auditors':
          // Get user's associated branch
          const userBranch = await this.getUserBranch(user.id);
          return {
            branches: userBranch ? [userBranch] : [],
            isFixed: true,
            defaultBranch: userBranch || undefined
          };

        case 'Inspection_Auditors':
          // Get branches assigned to this inspector
          const assignedBranches = await this.getInspectorAssignedBranches(user.id);
          return {
            branches: assignedBranches,
            isFixed: false,
            defaultBranch: assignedBranches.length === 1 ? assignedBranches[0] : undefined
          };

        case 'IT_Auditors':
          // Get all available branches
          const allBranches = await this.getAllBranches();
          return {
            branches: allBranches,
            isFixed: false
          };

        default:
          // For other roles, return empty array
          return {
            branches: [],
            isFixed: false
          };
      }
    } catch (error) {
      console.error('Error getting branches for user:', error);
      throw error;
    }
  }
};
