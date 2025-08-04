import { AuditFindingUser } from './auditFinding';

// Action Plan interface
export interface ActionPlan {
  action_plan_id: string;
  audit_finding_id: string;
  action_plan: string;
  timeline: string;
  due_date: string;
  status: 'Pending' | 'Overdue' |'In_Progress' | 'Completed';
  submitted_by_id: string;
  progress_percentage?: number;
  progress_justification?: string;
  createdAt: string;
  updatedAt: string;

  // Associated models (when included in API response)
  submittedBy?: AuditFindingUser;
  AuditFinding?: {
    id: string;
    title: string;
    description: string;
    status: string;
    amount: number;
    createdAt: string;
  };
  responsiblePersons?: ActionPlanResponsiblePerson[];
  resources?: ActionPlanResource[];
  evidences?: ActionPlanEvidence[];
  amendmentHistory?: ActionPlanAmendmentHistory[];
}

// Responsible Person interface
export interface ActionPlanResponsiblePerson {
  id: string;
  action_plan_id: string;
  user_id: string;
  createdAt: string;
  updatedAt: string;
  User?: AuditFindingUser;
}

// Resource interface
export interface ActionPlanResource {
  id: string;
  action_plan_id: string;
  resource_id?: string;
  resource_name: string;
  resource_path?: string;
  file_name?: string;
  file_path?: string;
  file_type?: string;
  file_size?: number;
  createdAt: string;
  updatedAt: string;
}

// Evidence interface
export interface ActionPlanEvidence {
  id: string;
  action_plan_id: string;
  evidence_id?: string;
  evidence_name?: string;
  evidence_path?: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size?: number;
  createdAt: string;
  updatedAt: string;
}

// Amendment History interface
export interface ActionPlanAmendmentHistory {
  id: string;
  action_plan_id: string;
  amend_by_id: string;
  action_plan?: string;
  responsible_persons_id?: string | string[];
  timeline?: string;
  status?: string;
  progress_percentage?: number;
  progress_justification?: string;
  changes?: any;
  amended_at: string;
  createdAt: string;
  amendedBy?: AuditFindingUser;
}

// Form data for creating/updating action plans
export interface ActionPlanFormData {
  audit_finding_id: string;
  action_plan: string;
  timeline: string;
  responsible_persons_ids: string[];
  resource_name?: string;
  resource_file?: File;
  evidence_file?: File;
  status?: 'Draft' | 'Submitted' | 'Under_Review' | 'Approved' | 'Rejected' | 'In_Progress' | 'Completed';
}

// Status update form data
export interface ActionPlanStatusUpdateData {
  status: 'Draft' | 'Submitted' | 'Under_Review' | 'Approved' | 'Rejected' | 'In_Progress' | 'Completed';
  rejection_reason?: string;
}

// Progress update form data
export interface ActionPlanProgressUpdateData {
  progress_percentage: number;
  progress_justification: string;
}

// Action Plan filters
export interface ActionPlanFilters {
  search?: string;
  status?: string;
  audit_finding_id?: string;
  submitted_by_id?: string;
  page?: number;
  limit?: number;
}

// Action Plan list response
export interface ActionPlanListResponse {
  data: ActionPlan[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

// Status options
export const ACTION_PLAN_STATUSES = [
  { value: 'Draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { value: 'Submitted', label: 'Submitted', color: 'bg-blue-100 text-blue-800' },
  { value: 'Under_Review', label: 'Under Review', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
  { value: 'Rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  { value: 'In_Progress', label: 'In Progress', color: 'bg-purple-100 text-purple-800' },
  { value: 'Completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-800' }
] as const;

// Role-based permissions for action plans
export interface ActionPlanPermissions {
  canCreate: boolean;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canChangeStatus: boolean;
  canViewAll: boolean;
  canViewAmendmentHistory: boolean;
}

// Helper function to get action plan permissions
export const getActionPlanPermissions = (userRole: string, userDepartment: string): ActionPlanPermissions => {
  const supervisorRoles = ['Audit_Supervisor', 'IT_Auditors_Supervisor', 'Inspection_Auditors_Supervisor'];
  const directorRoles = ['Audit_Director', 'IT_Auditors_Director', 'Inspection_Auditors_Director'];
  const auditorRoles = ['Resident_Auditors', 'IT_Auditors', 'Inspection_Auditors'];
  const auditeeRoles = [
    'Auditee_Supervisor', 'Auditee_Super_Supervisor',
    'IT_Auditees_Supervisor', 'IT_Auditees_Super_Supervisor',
    'Inspection_Auditees_Supervisor', 'Inspection_Auditees_Super_Supervisor'
  ];

  const isAdmin = userRole === 'Admin';
  const isAuditor = auditorRoles.includes(userRole);
  const isSupervisor = supervisorRoles.includes(userRole);
  const isDirector = directorRoles.includes(userRole);
  const isAuditee = auditeeRoles.includes(userRole);

  return {
    canCreate: isAdmin || isAuditee, // Only auditees and admin can create action plans
    canView: true, // All authenticated users can view action plans
    canEdit: isAdmin || isAuditee, // Only auditees and admin can edit action plans
    canDelete: isAdmin, // Only admin can delete action plans
    canChangeStatus: isAdmin || isAuditor || isSupervisor || isDirector, // Auditors and above can change status
    canViewAll: isAdmin || isAuditor || isSupervisor || isDirector, // Auditors and above can view all
    canViewAmendmentHistory: true // All authenticated users can view amendment history
  };
};

// File type utilities
export const SUPPORTED_FILE_TYPES = {
  images: ['image/jpeg', 'image/jpg', 'image/png'],
  pdf: ['application/pdf'],
  documents: [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
};

export const FILE_TYPE_ICONS = {
  'application/pdf': '📄',
  'application/msword': '📝',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
  'application/vnd.ms-excel': '📊',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
  'application/vnd.ms-powerpoint': '📽️',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '📽️',
  'image/jpeg': '🖼️',
  'image/jpg': '🖼️',
  'image/png': '🖼️'
};

export const getFileTypeIcon = (mimeType: string): string => {
  return FILE_TYPE_ICONS[mimeType as keyof typeof FILE_TYPE_ICONS] || '📎';
};

export const isPreviewableImage = (mimeType: string): boolean => {
  return SUPPORTED_FILE_TYPES.images.includes(mimeType);
};

export const isPreviewablePDF = (mimeType: string): boolean => {
  return SUPPORTED_FILE_TYPES.pdf.includes(mimeType);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
