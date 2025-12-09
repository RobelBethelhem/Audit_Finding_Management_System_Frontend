import { Category, RiskLevel, RiskRating, SystemVulnerability, ComplianceGap, BusinessComplianceGap, RelevantStandard } from './referenceData';

// User interface for associations
export interface AuditFindingUser {
  id: string;
  username: string;
  email: string;
  role: string;
  department: string;
}

// Assignment interface
export interface AuditFindingAssignment {
  assigned_id: string;
  finding_id: string;
  assigned_to_id: string;
  assigned_by_id: string;
  assigned_at: string;
  created_at: string;
  assignedToUser: AuditFindingUser;
  assignedByUser: AuditFindingUser;
}

// Escalation interface
export interface AuditFindingEscalation {
  escalated_to_id: string;
  escalated_by_id: string;
  created_at: string;
  escalation_level: number;
}

// Rectification interface
export interface AuditFindingRectification {
  id: string;
  finding_id: string;
  submitted_by_id: string;
  description: string;
  evidence_file_path?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Amended';
  approved_by_id?: string;
  rejection_reason?: string;
  createdAt: string;
  updatedAt: string;
}

// Evidence interface
export interface AuditFindingEvidence {
  evidence_id: string;
  audit_finding_id: string;
  uploaded_by_id: string;
  file_name: string;
  original_file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  mime_type: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  uploadedBy?: AuditFindingUser;
}

// Amendment History interface
export interface AuditAmendmentHistory {
  amendment_id: string;
  audit_finding_id: string;
  amend_by_id: string;
  title?: string;
  description?: string;
  criteria?: string;
  cause?: string;
  impact?: string;
  recommendation?: string;
  amount?: string;
  risk_level_id?: string;
  category_id?: string;
  risk_rating_id?: string;
  vulnerability_id?: string;
  compliance_gap_id?: string;
  standard_id?: string;
  created_by_id?: string;
  status: string;
  rectification_id?: string;
  amended_at: string;
  amendedBy: AuditFindingUser;
  createdBy?: AuditFindingUser;
  category?: Category;
  riskLevel?: RiskLevel;
  riskRating?: RiskRating;
}

// Currency options
export const CURRENCY_OPTIONS = [
  { value: 'ETB', label: 'ETB - Ethiopian Birr', symbol: 'ETB' },
  { value: 'USD', label: 'USD - US Dollar', symbol: '$' },
  { value: 'GBP', label: 'GBP - British Pound', symbol: '£' },
  { value: 'EUR', label: 'EUR - Euro', symbol: '€' }
] as const;

export type CurrencyCode = 'ETB' | 'USD' | 'GBP' | 'EUR';

// Main Audit Finding interface
export interface AuditFinding {
  id: string;
  title: string;
  reference_number: string;
  description: string;
  criteria: string;
  cause: string;
  impact: string;
  recommendation: string;
  amount: number;
  currency: CurrencyCode;
  risk_level_id: string;
  category_id: string;
  risk_rating_id: string;
  vulnerability_id?: string;
  compliance_gap_id?: string;
  business_compliance_gap_id?: string;
  standard_id?: string;
  status: 'Pending' | 'Under_Rectification' | 'In_Progress' | 'Reviewed' | 'Escalated' | 'Resolved';
  created_by_id: string;
  rectification_id?: string;
  due_date?: string;
  supporting_documentation?: string;
  system_affected?: string;
  createdAt: string;
  updatedAt: string;

  // Associated models (when included in API response)
  createdBy: AuditFindingUser;
  RiskLevel?: RiskLevel;
  Category?: Category;
  RiskRating?: RiskRating;
  SystemVulnerability?: SystemVulnerability;
  ComplianceGap?: ComplianceGap;
  BusinessComplianceGap?: BusinessComplianceGap;
  RelevantStandard?: RelevantStandard;
  AuditFindingAssigneds?: AuditFindingAssignment[];
  AuditFindingEscalations?: AuditFindingEscalation[];
  AuditFindingRectification?: AuditFindingRectification;
  AuditAmendmentHistories?: AuditAmendmentHistory[];
  evidences?: AuditFindingEvidence[];

  // Branch assignment fields
  assigned_branch_id?: string;
  branch_assigned_by_id?: string;
  branch_assigned_at?: string;
  branch_supervisor_id?: string;
  assignedBranch?: {
    id: string;
    branch_code: string;
    branch_name: string;
  };
  branchAssignedBy?: {
    id: string;
    username: string;
    email: string;
    department: string;
    role: string;
  };
  branchSupervisor?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

// Form data for creating/updating audit findings
export interface AuditFindingFormData {
  title: string;
  description: string;
  criteria: string;
  cause: string;
  impact: string;
  recommendation: string;
  amount: number;
  currency: CurrencyCode;
  risk_level_id: string;
  category_id: string;
  risk_rating_id: string;
  vulnerability_id?: string;
  compliance_gap_id?: string;
  business_compliance_gap_id?: string;
  standard_id?: string;
  status?: 'Pending' | 'Under_Rectification' | 'In_Progress' | 'Reviewed' | 'Escalated' | 'Resolved';
  initial_assigned_to_id?: string;
  due_date?: string;
}



// Filter options for audit findings list
export interface AuditFindingFilters {
  search?: string;
  status?: string;
  category_id?: string;
  risk_level_id?: string;
  risk_rating_id?: string;
  page?: number;
  limit?: number;
}

// Pagination response
export interface AuditFindingListResponse {
  data: AuditFinding[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

// Status options - Updated to match backend model
export const AUDIT_FINDING_STATUSES = [
  { value: 'Pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Under_Rectification', label: 'Under Rectification', color: 'bg-orange-100 text-orange-800' },
  { value: 'In_Progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { value: 'Reviewed', label: 'Reviewed', color: 'bg-purple-100 text-purple-800' },
  { value: 'Escalated', label: 'Escalated', color: 'bg-red-100 text-red-800' },
  { value: 'Resolved', label: 'Resolved', color: 'bg-green-100 text-green-800' }
] as const;

// Rectification status options
export const RECTIFICATION_STATUSES = [
  { value: 'Pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
  { value: 'Rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  { value: 'Amended', label: 'Amended', color: 'bg-blue-100 text-blue-800' }
] as const;

// Role-based permissions helper
export interface RolePermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canAssign: boolean;
  canApproveRectification: boolean;
  canInitiateRectification: boolean;
  canAmendRectification: boolean;
  canCreateActionPlan: boolean;
  requiresITFields: boolean;
}

// Enhanced permissions that include finding-specific context
export interface FindingPermissions extends RolePermissions {
  canEditThisFinding: boolean;
  canDeleteThisFinding: boolean;
  canApproveThisRectification: boolean;
  canInitiateThisRectification: boolean;
  canAmendThisRectification: boolean;
  canCreateActionPlanForThis: boolean;
}

// Helper function to get role permissions based on RBAC requirements
export const getRolePermissions = (userRole: string, userDepartment: string): RolePermissions => {
  // Define role groups based on the new RBAC requirements
  const auditorRoles = ['Resident_Auditors', 'IT_Auditors', 'Inspection_Auditors'];
  const auditeeRoles = [
    'Auditees', 'IT_Auditees', 'Inspection_Auditees',
    'Auditee_Supervisor', 'Auditee_Super_Supervisor',
    'IT_Auditees_Supervisor', 'IT_Auditees_Super_Supervisor',
    'Inspection_Auditees_Supervisor', 'Inspection_Auditees_Super_Supervisor'
  ];
  const supervisorDirectorRoles = [
    'Audit_Supervisor', 'Audit_Director',
    'IT_Auditors_Supervisor', 'IT_Auditors_Director',
    'Inspection_Auditors_Supervisor', 'Inspection_Auditors_Director'
  ];

  // Cross-department director roles - These directors have access across all departments
  const crossDepartmentDirectorRoles = ['Audit_Director'];

  // Admin has full access to everything
  if (userRole === 'Admin') {
    return {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canAssign: true,
      canApproveRectification: true,
      canInitiateRectification: true,
      canAmendRectification: true,
      canCreateActionPlan: true,
      requiresITFields: userDepartment === 'IT_Audit'
    };
  }

  // Audit_Director has cross-department access (like Admin but without delete)
  if (crossDepartmentDirectorRoles.includes(userRole)) {
    return {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canAssign: true,
      canApproveRectification: true,
      canInitiateRectification: true,
      canAmendRectification: true,
      canCreateActionPlan: true,
      requiresITFields: false // Audit_Director can work with all department types
    };
  }

  // Auditor Roles (Full Management Access)
  if (auditorRoles.includes(userRole)) {
    return {
      canCreate: true,
      canEdit: true,
      canDelete: false, // Only Admin can delete
      canAssign: true,
      canApproveRectification: true,
      canInitiateRectification: true,
      canAmendRectification: false, // Auditors cannot amend rectifications
      canCreateActionPlan: true,
      requiresITFields: userDepartment === 'IT_Audit'
    };
  }

  // Auditee Roles (Response & Management Access)
  if (auditeeRoles.includes(userRole)) {
    return {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canAssign: false,
      canApproveRectification: false,
      canInitiateRectification: true,
      canAmendRectification: true,
      canCreateActionPlan: true,
      requiresITFields: userDepartment === 'IT_Audit'
    };
  }

  // Supervisor/Director Roles (Oversight Access)
  if (supervisorDirectorRoles.includes(userRole)) {
    return {
      canCreate: false,
      canEdit: true,
      canDelete: false,
      canAssign: true,
      canApproveRectification: true,
      canInitiateRectification: false, // Supervisors/Directors don't initiate rectifications
      canAmendRectification: false,
      canCreateActionPlan: true,
      requiresITFields: userDepartment === 'IT_Audit'
    };
  }

  // Default: No permissions for unrecognized roles
  return {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canAssign: false,
    canApproveRectification: false,
    canInitiateRectification: false,
    canAmendRectification: false,
    canCreateActionPlan: false,
    requiresITFields: userDepartment === 'IT_Audit'
  };
};

// Enhanced function to get finding-specific permissions (aligns with backend authorization)
export const getFindingPermissions = (
  user: { id: string; role: string; department: string },
  finding: AuditFinding,
  userAssignments?: { finding_id: string; assigned_to_id: string }[],
  userActionPlanResponsibilities?: { action_plan_id: string; audit_finding_id: string }[],
  userEscalations?: { audit_finding_id: string; escalated_to_id: string }[]
): FindingPermissions => {
  // Get base role permissions first
  const basePermissions = getRolePermissions(user.role, user.department);

  // Define role groups
  const auditorRoles = ['Resident_Auditors', 'IT_Auditors', 'Inspection_Auditors'];
  const auditeeRoles = [
    'Auditees', 'IT_Auditees', 'Inspection_Auditees',
    'Auditee_Supervisor', 'Auditee_Super_Supervisor',
    'IT_Auditees_Supervisor', 'IT_Auditees_Super_Supervisor',
    'Inspection_Auditees_Supervisor', 'Inspection_Auditees_Super_Supervisor'
  ];
  const supervisorDirectorRoles = [
    'Audit_Supervisor', 'Audit_Director',
    'IT_Auditors_Supervisor', 'IT_Auditors_Director',
    'Inspection_Auditors_Supervisor', 'Inspection_Auditors_Director'
  ];

  // Cross-department director roles - have access across all departments
  const crossDepartmentDirectorRoles = ['Audit_Director'];

  // Basic checks
  const isAdmin = user.role === 'Admin';
  const isAuditDirector = crossDepartmentDirectorRoles.includes(user.role);
  const isCreator = finding.created_by_id === user.id;
  const isSameDepartment = finding.createdBy?.department === user.department;

  // Assignment checks
  const isAssigned = userAssignments?.some(assignment =>
    assignment.finding_id === finding.id && assignment.assigned_to_id === user.id
  ) || false;

  // Escalation checks
  const isEscalated = userEscalations?.some(escalation =>
    escalation.audit_finding_id === finding.id && escalation.escalated_to_id === user.id
  ) || false;

  // Action plan responsibility checks
  const isActionPlanResponsible = userActionPlanResponsibilities?.some(responsibility =>
    responsibility.audit_finding_id === finding.id
  ) || false;

  // Edit/Delete permissions: Base role permissions + finding-specific checks
  // Audit_Director has cross-department access (can edit any finding)
  const canEditThisFinding = basePermissions.canEdit && (
    isAdmin || isAuditDirector || isCreator ||
    (supervisorDirectorRoles.includes(user.role) && isSameDepartment)
  );

  const canDeleteThisFinding = basePermissions.canDelete && (
    isAdmin || isCreator ||
    (supervisorDirectorRoles.includes(user.role) && isSameDepartment)
  );

  // Assignment permissions: Base role permissions + finding-specific checks
  // Audit_Director can assign across all departments
  const canAssign = basePermissions.canAssign && (
    isAdmin || isAuditDirector ||
    (supervisorDirectorRoles.includes(user.role) && isSameDepartment)
  );

  // Rectification approval permissions: Base role permissions + finding-specific checks
  // Audit_Director can approve rectifications across all departments
  const canApproveThisRectification = basePermissions.canApproveRectification && (
    isAdmin || isAuditDirector || isCreator ||
    (supervisorDirectorRoles.includes(user.role) && isSameDepartment)
  );

  // Rectification initiation permissions: Base role permissions + finding-specific checks
  // Audit_Director can initiate rectifications across all departments
  const canInitiateThisRectification = basePermissions.canInitiateRectification && (
    isAdmin || isAuditDirector || isAssigned || isEscalated || isActionPlanResponsible ||
    (auditorRoles.includes(user.role) && isSameDepartment)
  );

  // Rectification amendment permissions: Base role permissions + finding-specific checks
  // Audit_Director can amend rectifications across all departments
  const canAmendThisRectification = basePermissions.canAmendRectification && (
    isAdmin || isAuditDirector || isAssigned || isEscalated || isActionPlanResponsible ||
    (auditeeRoles.includes(user.role) && isSameDepartment)
  );

  // Action plan creation permissions: Base role permissions + finding-specific checks
  // Audit_Director can create action plans across all departments
  const canCreateActionPlanForThis = basePermissions.canCreateActionPlan && (
    isAdmin || isAuditDirector || isAssigned || isEscalated || isActionPlanResponsible ||
    (auditeeRoles.includes(user.role) && isSameDepartment) ||
    (supervisorDirectorRoles.includes(user.role) && isSameDepartment)
  );

  return {
    ...basePermissions,
    canEditThisFinding,
    canDeleteThisFinding,
    canApproveThisRectification,
    canInitiateThisRectification,
    canAmendThisRectification,
    canCreateActionPlanForThis
  };
};
