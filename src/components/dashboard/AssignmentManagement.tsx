import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { toast } from 'sonner';
import { Plus, Search, Trash2, AlertTriangle, User, Calendar, FileText } from 'lucide-react';
import { 
  AuditFindingAssignment, 
  AssignmentFormData, 
  AssignmentFilters,
  AssignmentListResponse,
  getAssignmentPermissions
} from '@/types/assignment';
import { AuditFinding, AUDIT_FINDING_STATUSES } from '@/types/auditFinding';
import { User as UserType } from '@/types/user';

interface AssignmentManagementProps {
  user: UserType;
}

export const AssignmentManagement = ({ user }: AssignmentManagementProps) => {
  const { api } = useAuth();
  
  // Add null check for user
  if (!user) {
    return <div>Loading...</div>;
  }

  const [assignments, setAssignments] = useState<AuditFindingAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<AuditFindingAssignment | null>(null);
  const [referenceDataLoading, setReferenceDataLoading] = useState(true);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });

  // Filter states
  const [filters, setFilters] = useState<AssignmentFilters>({
    search: '',
    status: '',
    assigned_to_id: '',
    page: 1,
    limit: 10
  });

  // Form state
  const [formData, setFormData] = useState<AssignmentFormData>({
    finding_id: '',
    assigned_to_id: ''
  });

  // Reference data
  const [auditFindings, setAuditFindings] = useState<AuditFinding[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);

  // Get user permissions
  const permissions = getAssignmentPermissions(user.role, user.department);

  // Fetch assignments
  const fetchAssignments = async (currentFilters: AssignmentFilters = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await api.get(`/api/audit-finding-assignments?${params.toString()}`);

      // Handle both array response and paginated response
      let data: AuditFindingAssignment[];
      let paginationData = {
        page: 1,
        totalPages: 1,
        total: 0,
        limit: 10
      };

      if (Array.isArray(response.data)) {
        // Direct array response
        data = response.data;
        paginationData.total = data.length;
      } else {
        // Paginated response
        const paginatedData: AssignmentListResponse = response.data;
        data = paginatedData.data || [];
        paginationData = {
          page: paginatedData.page || 1,
          totalPages: paginatedData.totalPages || 1,
          total: paginatedData.total || 0,
          limit: paginatedData.limit || 10
        };
      }

      setAssignments(data);
      setPagination(paginationData);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to fetch assignments');
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reference data
  const fetchReferenceData = async () => {
    setReferenceDataLoading(true);
    try {
      const [findingsRes, usersRes] = await Promise.all([
        api.get('/api/audit-findings?limit=1000'),
        api.get('/api/users?limit=1000')
      ]);

      setAuditFindings(findingsRes.data?.data || findingsRes.data || []);
      setUsers(usersRes.data?.data || usersRes.data || []);
    } catch (error) {
      console.error('Error fetching reference data:', error);
      toast.error('Failed to fetch reference data');
    } finally {
      setReferenceDataLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchReferenceData();
  }, []);

  // Handle filter changes
  const handleFilterChange = (key: keyof AssignmentFilters, value: string) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    fetchAssignments(newFilters);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchAssignments(newFilters);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      finding_id: '',
      assigned_to_id: ''
    });
  };

  // Open create dialog
  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  // Handle create assignment
  const handleCreate = async () => {
    if (!formData.finding_id || !formData.assigned_to_id) {
      toast.error('Please select both audit finding and assignee');
      return;
    }

    try {
      await api.post('/api/audit-finding-assignments', formData);
      toast.success('Assignment created successfully');
      setDialogOpen(false);
      fetchAssignments();
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create assignment';
      toast.error(errorMessage);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!assignmentToDelete) return;
    
    try {
      await api.delete(`/api/audit-finding-assignments/${assignmentToDelete.id}`);
      toast.success('Assignment deleted successfully');
      setDeleteDialogOpen(false);
      setAssignmentToDelete(null);
      fetchAssignments();
    } catch (error: any) {
      console.error('Error deleting assignment:', error);
      const errorMessage = error.response?.data?.error || 'Failed to delete assignment';
      toast.error(errorMessage);
    }
  };

  // Open delete confirmation
  const openDeleteDialog = (assignment: AuditFindingAssignment) => {
    setAssignmentToDelete(assignment);
    setDeleteDialogOpen(true);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = AUDIT_FINDING_STATUSES.find(s => s.value === status);
    return (
      <Badge className={statusConfig?.color || 'bg-gray-100 text-gray-800'}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Filter users to show only auditees for assignment
  const getAssignableUsers = () => {
    const auditeeRoles = [
      'Auditee_Supervisor', 'Auditee_Super_Supervisor',
      'IT_Auditees_Supervisor', 'IT_Auditees_Super_Supervisor',
      'Inspection_Auditees_Supervisor', 'Inspection_Auditees_Super_Supervisor'
    ];
    return users.filter(u => auditeeRoles.includes(u.role));
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assignment Management</h1>
            <p className="text-gray-600">Manage audit finding assignments to auditees</p>
          </div>
          <Button onClick={openCreateDialog} disabled={referenceDataLoading}>
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Finding Assignments</CardTitle>
          <CardDescription>
            Create and manage audit finding assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search assignments..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {AUDIT_FINDING_STATUSES.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.assigned_to_id || 'all'} onValueChange={(value) => handleFilterChange('assigned_to_id', value === 'all' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {getAssignableUsers().map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.username} ({user.role.replace(/_/g, ' ')})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No assignments found. Click "Create Assignment" to add one.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Finding Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Assigned By</TableHead>
                    <TableHead>Assigned Date</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate" title={assignment.AuditFinding?.title}>
                          {assignment.AuditFinding?.title || 'Unknown Finding'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {assignment.AuditFinding?.status ? 
                          getStatusBadge(assignment.AuditFinding.status) : 
                          <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
                        }
                      </TableCell>
                      <TableCell>
                        {assignment.AuditFinding?.amount ? 
                          formatCurrency(assignment.AuditFinding.amount) : 
                          '-'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">{assignment.assignedToUser?.username || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">{assignment.assignedToUser?.role?.replace(/_/g, ' ')}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{assignment.assignedByUser?.username || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{assignment.assignedByUser?.role?.replace(/_/g, ' ')}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(assignment.assigned_at || assignment.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(assignment)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {assignments.length} of {pagination.total} results
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={pagination.page === 1 ? undefined : () => handlePageChange(pagination.page - 1)}
                          className={pagination.page === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={page === pagination.page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={pagination.page === pagination.totalPages ? undefined : () => handlePageChange(pagination.page + 1)}
                          className={pagination.page === pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Assignment Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Assignment</DialogTitle>
            <DialogDescription>
              Assign an audit finding to an auditee for rectification
            </DialogDescription>
          </DialogHeader>
          
          {referenceDataLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading reference data...</div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="finding_id">Audit Finding *</Label>
                <Select 
                  value={formData.finding_id} 
                  onValueChange={(value) => setFormData({ ...formData, finding_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select audit finding" />
                  </SelectTrigger>
                  <SelectContent>
                    {auditFindings.map(finding => (
                      <SelectItem key={finding.id} value={finding.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{finding.title}</span>
                          <span className="text-xs text-gray-500">
                            {formatCurrency(finding.amount)} - {finding.status}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assigned_to_id">Assign To *</Label>
                <Select 
                  value={formData.assigned_to_id} 
                  onValueChange={(value) => setFormData({ ...formData, assigned_to_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select auditee" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAssignableUsers().map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.username}</span>
                          <span className="text-xs text-gray-500">
                            {user.role.replace(/_/g, ' ')} - {user.department}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={referenceDataLoading}>
              Create Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this assignment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
