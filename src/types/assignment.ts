import { AuditFindingUser } from './auditFinding';

// Assignment interface
export interface AuditFindingAssignment {
  id: string;
  finding_id: string;
  assigned_to_id: string;
  assigned_by_id: string;
  assigned_at: string;
  createdAt: string;
  updatedAt: string;

  // Associated models (when included in API response)
  assignedToUser?: AuditFindingUser;
  assignedByUser?: AuditFindingUser;
  AuditFinding?: {
    id: string;
    title: string;
    description: string;
    status: string;
    amount: number;
    createdAt: string;
  };
}

// Form data for creating assignments
export interface AssignmentFormData {
  finding_id: string;
  assigned_to_id: string;
}

// Assignment filters
export interface AssignmentFilters {
  search?: string;
  status?: string;
  assigned_to_id?: string;
  page?: number;
  limit?: number;
}

// Assignment list response
export interface AssignmentListResponse {
  data: AuditFindingAssignment[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

// Role-based permissions for assignments
export interface AssignmentPermissions {
  canCreate: boolean;
  canView: boolean;
  canDelete: boolean;
  canViewAll: boolean;
}

// Helper function to get assignment permissions
export const getAssignmentPermissions = (userRole: string, userDepartment: string): AssignmentPermissions => {
  const supervisorRoles = ['Audit_Supervisor', 'IT_Auditors_Supervisor', 'Inspection_Auditors_Supervisor'];
  const directorRoles = ['Audit_Director', 'IT_Auditors_Director', 'Inspection_Auditors_Director'];
  const auditorRoles = ['Resident_Auditors', 'IT_Auditors', 'Inspection_Auditors'];

  return {
    canCreate: userRole === 'Admin' || supervisorRoles.includes(userRole) || directorRoles.includes(userRole),
    canView: true, // All authenticated users can view assignments
    canDelete: userRole === 'Admin' || supervisorRoles.includes(userRole),
    canViewAll: userRole === 'Admin' || supervisorRoles.includes(userRole) || directorRoles.includes(userRole)
  };
};
