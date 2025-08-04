import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchableDropdown } from '@/components/ui/searchable-dropdown';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { toast } from '@/components/ui/sonner';
import { User } from '@/types/user';
import { Branch } from '@/types/branch';
import { UserPlus, Search, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
  department: string;
  supervisor?: string;
  is_active: boolean;
  created_at: string;
  branch_id?: string;
  branch?: Branch;
}

interface UserFormData {
  username: string;
  email: string;
  password: string;
  role: string;
  department: string;
  supervisor_id?: string;
  branch_id?: string;
}

export const UserManagement = ({ user }: { user: User }) => {
  const { api } = useAuth();

  // Add null check for user
  if (!user) {
    return <div>Loading...</div>;
  }
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [supervisorUsers, setSupervisorUsers] = useState<UserData[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    password: '',
    role: '',
    department: '',
    supervisor_id: '',
    branch_id: 'no-branch', // Default to "no-branch" for SearchableDropdown component
  });

  const roles = [
    'Admin',
    'Resident_Auditors',
    'Auditees',
    'Audit_Supervisor',
    'Auditee_Supervisor',
    'Auditee_Super_Supervisor',
    'Audit_Director',
    'Management',
    'IT_Auditors',
    'IT_Auditors_Supervisor',
    'IT_Auditors_Director',
    'IT_Auditees',
    'IT_Auditees_Supervisor',
    'IT_Auditees_Super_Supervisor',
    'Inspection_Auditors',
    'Inspection_Auditors_Supervisor',
    'Inspection_Auditors_Director',
    'Inspection_Auditees',
    'Inspection_Auditees_Supervisor',
    'Inspection_Auditees_Super_Supervisor'
  ];

  const departments = [
    'Business',
    'IT_Audit',
    'Inspection',
    'Admin'
  ];

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm, roleFilter, departmentFilter, statusFilter]);

  useEffect(() => {
    fetchSupervisorUsers();
    fetchBranches();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (roleFilter && roleFilter !== 'all') params.append('role', roleFilter);
      if (departmentFilter && departmentFilter !== 'all') params.append('department', departmentFilter);
      if (statusFilter && statusFilter !== 'all') params.append('is_active', statusFilter);
      
      const response = await api.get(`/auth?${params.toString()}`);
      setUsers(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      setUsers([]); // Reset to empty array on error
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupervisorUsers = async () => {
    try {
      const response = await api.get('/auth', {
        params: {
          limit: 1000 // Get all users for supervisor selection
        }
      });
      setSupervisorUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching supervisor users:', error);
      setSupervisorUsers([]);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await api.get('/api/branches/active');
      setBranches(response.data || []);
    } catch (error) {
      console.error('Error fetching branches:', error);
      setBranches([]);
    }
  };

  const handleCreateUser = async () => {
    try {
      await api.post('/auth', formData);
      toast.success('User created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.response?.data?.error || 'Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    if (!currentUser) return;
    
    try {
      const updateData = { ...formData };
      // Don't send password if it's empty (no change)
      if (!updateData.password) delete updateData.password;
      
      await api.put(`/auth/${currentUser.id}`, updateData);
      toast.success('User updated successfully');
      setIsEditDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.error || 'Failed to update user');
    }
  };

  const handleDeleteUser = async () => {
    if (!currentUser) return;
    
    try {
      await api.delete(`/auth/${currentUser.id}`);
      toast.success('User deleted successfully');
      setIsDeleteDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await api.put(`/auth/${userId}`, { is_active: !isActive });
      toast.success(`User ${isActive ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (error: any) {
      console.error('Error toggling user status:', error);
      toast.error(error.response?.data?.error || 'Failed to update user status');
    }
  };

  const openEditDialog = (userData: UserData) => {
    setCurrentUser(userData);
    setFormData({
      username: userData.username,
      email: userData.email,
      password: '', // Don't set password for edit
      role: userData.role,
      department: userData.department,
      supervisor_id: userData.supervisor || '',
      branch_id: userData.branch_id || 'no-branch', // Convert empty to "no-branch" for SearchableDropdown component
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (userData: UserData) => {
    setCurrentUser(userData);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: '',
      department: '',
      supervisor_id: '',
      branch_id: 'no-branch', // Default to "no-branch" for SearchableDropdown component
    });
    setCurrentUser(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    // Convert "no-branch" back to empty string for backend compatibility
    const processedValue = value === 'no-branch' ? '' : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button  className="bg-black text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system. All fields are required.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="username">Username</label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password">Password</label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="role">Role</label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="department">Department</label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleSelectChange('department', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="branch">Branch (Optional)</label>
                <SearchableDropdown
                  options={[
                    { id: 'no-branch', name: 'No Branch' },
                    ...(branches || []).map(branch => ({
                      id: branch.id,
                      name: `${branch.branch_code} - ${branch.branch_name}`,
                      description: branch.is_active ? 'Active' : 'Inactive'
                    }))
                  ]}
                  value={formData.branch_id}
                  onValueChange={(value) => handleSelectChange('branch_id', value)}
                  placeholder="Select branch"
                  searchPlaceholder="Search branches..."
                  emptyMessage="No branches found"
                  loading={loading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="supervisor">Supervisor (Optional)</label>
                <SearchableDropdown
                  options={[
                    { id: '', name: 'No Supervisor' },
                    ...(supervisorUsers || []).map(user => ({
                      id: user.id,
                      name: `${user.username} (${user.role})`,
                      description: user.email
                    }))
                  ]}
                  value={formData.supervisor_id}
                  onValueChange={(value) => handleSelectChange('supervisor_id', value)}
                  placeholder="Select supervisor"
                  searchPlaceholder="Search supervisors..."
                  emptyMessage="No supervisors found"
                  loading={loading}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage system users, their roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select
              value={roleFilter}
              onValueChange={setRoleFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Supervisor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Loading users...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (!users || users.length === 0) ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  (users || []).map((userData) => (
                    <TableRow key={userData.id}>
                      <TableCell className="font-medium">{userData.username}</TableCell>
                      <TableCell>{userData.email}</TableCell>
                      <TableCell>{userData.role}</TableCell>
                      <TableCell>{userData.department}</TableCell>
                      <TableCell>
                        {userData.branch ? (
                          <span className="text-sm text-gray-600">
                            {userData.branch.branch_code} - {userData.branch.branch_name}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">No branch</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {userData.supervisor ? (
                          <span className="text-sm text-gray-600">
                            {(supervisorUsers || []).find(user => user.id === userData.supervisor)?.username || userData.supervisor}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">No supervisor</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          userData.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {userData.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleUserStatus(userData.id, userData.is_active)}
                            title={userData.is_active ? 'Deactivate user' : 'Activate user'}
                          >
                            {userData.is_active ? (
                              <XCircle className="h-4 w-4 text-red-500" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openEditDialog(userData)}
                            title="Edit user"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openDeleteDialog(userData)}
                            className="text-red-500 border-red-200 hover:bg-red-50"
                            title="Delete user"
                            disabled={userData.role === 'Admin'} // Prevent deleting admin users
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={page === 1 ? undefined : () => setPage(p => Math.max(1, p - 1))}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={page === p}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={page === totalPages ? undefined : () => setPage(p => Math.min(totalPages, p + 1))}
                    className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Leave password blank to keep it unchanged.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-username">Username</label>
              <Input
                id="edit-username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-email">Email</label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-password">Password (leave blank to keep unchanged)</label>
              <Input
                id="edit-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-role">Role</label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-department">Department</label>
              <Select
                value={formData.department}
                onValueChange={(value) => handleSelectChange('department', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-branch">Branch (Optional)</label>
              <SearchableDropdown
                options={[
                  { id: 'no-branch', name: 'No Branch' },
                  ...(branches || []).map(branch => ({
                    id: branch.id,
                    name: `${branch.branch_code} - ${branch.branch_name}`,
                    description: branch.is_active ? 'Active' : 'Inactive'
                  }))
                ]}
                value={formData.branch_id}
                onValueChange={(value) => handleSelectChange('branch_id', value)}
                placeholder="Select branch"
                searchPlaceholder="Search branches..."
                emptyMessage="No branches found"
                loading={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-supervisor">Supervisor (Optional)</label>
              <SearchableDropdown
                options={[
                  { id: '', name: 'No Supervisor' },
                  ...(supervisorUsers || [])
                    .filter(user => user.id !== currentUser?.id) // Don't allow self-supervision
                    .map(user => ({
                      id: user.id,
                      name: `${user.username} (${user.role})`,
                      description: user.email
                    }))
                ]}
                value={formData.supervisor_id}
                onValueChange={(value) => handleSelectChange('supervisor_id', value)}
                placeholder="Select supervisor"
                searchPlaceholder="Search supervisors..."
                emptyMessage="No supervisors found"
                loading={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>Update User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {currentUser && (
              <div className="bg-gray-50 p-4 rounded-md">
                <p><strong>Username:</strong> {currentUser.username}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p><strong>Role:</strong> {currentUser.role}</p>
                <p><strong>Department:</strong> {currentUser.department}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteUser}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};




