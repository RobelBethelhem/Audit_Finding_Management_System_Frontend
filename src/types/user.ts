import { Branch } from './branch';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  department: string;
  is_active: boolean;
  created_at: string;
  permissions?: string[];
  supervisor_id?: string;
  profile_image?: string;
  branch_id?: string;
  branch?: Branch;
}