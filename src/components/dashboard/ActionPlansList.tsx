import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { toast } from 'sonner';
import { Plus, Search, Eye, Edit, Trash2, Clock } from 'lucide-react';
import { 
  ActionPlan, 
  ActionPlanFilters,
  ActionPlanListResponse,
  ACTION_PLAN_STATUSES,
  getActionPlanPermissions
} from '@/types/actionPlan';
import { User } from '@/types/user';

interface ActionPlansListProps {
  user: User;
  onCreateNew?: () => void;
  onViewDetails?: (actionPlan: ActionPlan) => void;
  onEdit?: (actionPlan: ActionPlan) => void;
  onDelete?: (actionPlan: ActionPlan) => void;
  onChangeStatus?: (actionPlan: ActionPlan, newStatus: string) => void;
}

export const ActionPlansList = ({ 
  user, 
  onCreateNew, 
  onViewDetails, 
  onEdit, 
  onDelete,
  onChangeStatus 
}: ActionPlansListProps) => {
  const { api } = useAuth();
  
  // Add null check for user
  if (!user) {
    return <div>Loading...</div>;
  }

  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });

  // Filter states
  const [filters, setFilters] = useState<ActionPlanFilters>({
    search: '',
    status: '',
    audit_finding_id: '',
    submitted_by_id: '',
    page: 1,
    limit: 10
  });

  // UI filter states (separate from API filters)
  const [uiFilters, setUiFilters] = useState({
    status: 'all'
  });

  // Get user permissions
  const permissions = getActionPlanPermissions(user.role, user.department);

  // Fetch action plans
  const fetchActionPlans = async (currentFilters: ActionPlanFilters = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await api.get(`/api/action-plans?${params.toString()}`);

      // Handle both array response and paginated response
      let data: ActionPlan[];
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
        const paginatedData: ActionPlanListResponse = response.data;
        data = paginatedData.data || [];
        paginationData = {
          page: paginatedData.page || 1,
          totalPages: paginatedData.totalPages || 1,
          total: paginatedData.total || 0,
          limit: paginatedData.limit || 10
        };
      }

      setActionPlans(data);
      setPagination(paginationData);
    } catch (error) {
      console.error('Error fetching action plans:', error);
      toast.error('Failed to fetch action plans');
      setActionPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActionPlans();
  }, []);

  // Handle filter changes
  const handleFilterChange = (key: keyof ActionPlanFilters, value: string) => {
    // Update UI filters
    if (key === 'status') {
      setUiFilters(prev => ({ ...prev, status: value }));
    }

    // Convert "all" to empty string for API
    const filterValue = value === 'all' ? '' : value;
    const newFilters = { ...filters, [key]: filterValue, page: 1 };
    setFilters(newFilters);
    fetchActionPlans(newFilters);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchActionPlans(newFilters);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = ACTION_PLAN_STATUSES.find(s => s.value === status);
    return (
      <Badge className={statusConfig?.color || 'bg-gray-100 text-gray-800'}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Handle status change
  const handleStatusChange = async (actionPlan: ActionPlan, newStatus: string) => {
    try {
      await api.put(`/api/action-plans/${actionPlan.action_plan_id}/status`, { status: newStatus });
      toast.success(`Action plan status updated to ${newStatus.replace('_', ' ')}`);
      fetchActionPlans(); // Refresh data
      if (onChangeStatus) {
        onChangeStatus(actionPlan, newStatus);
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update status';
      toast.error(errorMessage);
    }
  };

  // Get available status transitions
  const getAvailableStatuses = (currentStatus: string) => {
    const statusTransitions: Record<string, string[]> = {
      'Draft': ['Submitted'],
      'Submitted': ['Under_Review', 'Rejected'],
      'Under_Review': ['Approved', 'Rejected'],
      'Approved': ['In_Progress'],
      'Rejected': [], // Can be amended by creating new action plan
      'In_Progress': ['Completed'],
      'Completed': []
    };
    
    return statusTransitions[currentStatus] || [];
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Action Plans</h1>
            <p className="text-gray-600">Manage action plans for audit findings</p>
          </div>
          {onCreateNew && (
            <Button onClick={onCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create Action Plan
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Action Plans</CardTitle>
          <CardDescription>
            Create and manage action plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search action plans..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={uiFilters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {ACTION_PLAN_STATUSES.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fetchActionPlans()}
                disabled={loading}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : actionPlans.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No action plans found. Click "Create Action Plan" to add one.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Finding Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actionPlans.map((actionPlan) => (
                    <TableRow key={actionPlan.action_plan_id}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate" title={actionPlan.AuditFinding?.title}>
                          {actionPlan.AuditFinding?.title || 'Unknown Finding'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(actionPlan.status)}
                          {getAvailableStatuses(actionPlan.status).length > 0 && (
                            <Select onValueChange={(value) => handleStatusChange(actionPlan, value)}>
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue placeholder="Change" />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailableStatuses(actionPlan.status).map(status => {
                                  const statusConfig = ACTION_PLAN_STATUSES.find(s => s.value === status);
                                  return (
                                    <SelectItem key={status} value={status}>
                                      {statusConfig?.label || status}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{actionPlan.timeline}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{actionPlan.submittedBy?.username || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{actionPlan.submittedBy?.role?.replace(/_/g, ' ')}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(actionPlan.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {onViewDetails && (
                            <Button variant="ghost" size="sm" onClick={() => onViewDetails(actionPlan)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {onEdit && (
                            <Button variant="ghost" size="sm" onClick={() => onEdit(actionPlan)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button variant="ghost" size="sm" onClick={() => onDelete(actionPlan)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {actionPlans.length} of {pagination.total} results
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
    </div>
  );
};
