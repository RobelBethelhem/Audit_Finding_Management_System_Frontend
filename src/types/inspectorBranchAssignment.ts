export interface InspectorBranchAssignment {
  assignment_id: string;
  inspector_id: string;
  branch_id: string; // Changed from assigned_branch_id to match backend
  assigned_by_id: string;
  assigned_at: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  // Related data
  inspector?: {
    id: string;
    username: string;
    email?: string;
    role?: string;
    department?: string;
  };

  branch?: { // Changed from assignedBranch to match backend
    id: string;
    branch_code: string;
    branch_name: string;
    is_active: boolean;
  };

  assignedBy?: {
    id: string;
    username: string;
    email?: string;
    role?: string;
  };
}

export interface CreateInspectorBranchAssignmentRequest {
  inspector_id: string;
  assigned_branch_id: string;
  start_date: string;
  end_date: string;
}

export interface UpdateInspectorBranchAssignmentRequest {
  inspector_id?: string;
  assigned_branch_id?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

export interface InspectorBranchAssignmentResponse {
  assignments: InspectorBranchAssignment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface InspectorBranchAssignmentFormData {
  inspector_id: string;
  assigned_branch_id: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

// For API responses
export interface AssignmentApiResponse {
  message: string;
  assignment: InspectorBranchAssignment;
}

export interface DeleteAssignmentApiResponse {
  message: string;
}

// For dropdowns and selects
export interface InspectorOption {
  id: string;
  username: string;
  email?: string;
  role?: string;
  department?: string;
}

export interface BranchOption {
  id: string;
  branch_code: string;
  branch_name: string;
  is_active: boolean;
}
