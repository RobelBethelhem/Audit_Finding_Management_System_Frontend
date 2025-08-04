export interface Branch {
  id: string;
  branch_code: string;
  branch_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  users?: Array<{
    id: string;
    username: string;
    email?: string;
    role?: string;
  }>;
}

export interface CreateBranchRequest {
  branch_code: string;
  branch_name: string;
  is_active?: boolean;
}

export interface UpdateBranchRequest {
  branch_code?: string;
  branch_name?: string;
  is_active?: boolean;
}

export interface BranchResponse {
  branches: Branch[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BranchFormData {
  branch_code: string;
  branch_name: string;
  is_active: boolean;
}
