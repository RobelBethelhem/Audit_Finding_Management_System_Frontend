import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit, Trash2, Building2, User, RefreshCw, Calendar, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { User as UserType } from '@/hooks/useAuth';
import { InspectorBranchAssignment } from '@/types/inspectorBranchAssignment';
import { inspectorBranchAssignmentService } from '@/services/inspectorBranchAssignmentService';
import { InspectorBranchAssignmentForm } from './InspectorBranchAssignmentForm';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface InspectorBranchAssignmentManagementProps {
  user: UserType;
}

export const InspectorBranchAssignmentManagement: React.FC<InspectorBranchAssignmentManagementProps> = ({ user }) => {
  const [assignments, setAssignments] = useState<InspectorBranchAssignment[]>([]);

  // Debug log for assignments state changes
  useEffect(() => {
    console.log('🔍 Assignments state changed:', assignments);
    console.log('🔍 Assignments count:', assignments.length);
  }, [assignments]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<InspectorBranchAssignment | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<InspectorBranchAssignment | null>(null);

  // Date range filter state
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [dateRangePreset, setDateRangePreset] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  // Load assignments with filters
  const loadAssignments = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const filterParams = {
        search: searchTerm || undefined,
        startDateFrom: startDateFilter || undefined,
        startDateTo: endDateFilter || undefined,
        ...filters
      };

      const response = await inspectorBranchAssignmentService.getAll(page, itemsPerPage, filterParams);

      // Debug logging to track data flow
      console.log('🔍 API Response received:', response);
      console.log('🔍 Response type:', typeof response);
      console.log('🔍 Response assignments:', response?.assignments);
      console.log('🔍 Assignments length:', response?.assignments?.length);
      console.log('🔍 Response pagination data:', {
        total: response?.total,
        page: response?.page,
        totalPages: response?.totalPages,
        limit: response?.limit
      });

      // Validate and safely process response structure
      try {
        // Check if response has the expected structure from your API
        if (!response || typeof response !== 'object') {
          console.error('❌ Invalid response format:', response);
          throw new Error('Invalid response format from server');
        }

        // Extract assignments and pagination data from response
        const assignments = response.assignments;

        if (!assignments || !Array.isArray(assignments)) {
          console.error('❌ Invalid assignments data:', assignments);
          throw new Error('Invalid assignments data received from server');
        }

        console.log('✅ Processing assignments:', assignments.length, 'items');
        console.log('✅ Processing pagination - total:', response.total, 'page:', response.page, 'totalPages:', response.totalPages);

        // Safely set state with fallback values
        setAssignments(assignments);
        setCurrentPage(response.page || 1);
        setTotalPages(response.totalPages || 1);
        setTotalCount(response.total || assignments.length);

        console.log('✅ State updated successfully');
      } catch (processingError) {
        // If response processing fails, throw a more specific error
        console.error('❌ Error processing response:', processingError);
        throw new Error('Failed to process server response. Please refresh and try again.');
      }
    } catch (error) {
      // Log technical details for debugging while showing user-friendly messages
      console.error('Error loading assignments:', error);
      const errorMessage = getErrorMessage(error, 'Failed to load inspector branch assignments. Please try again.');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadAssignments(1); // Reset to first page when filters change
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, startDateFilter, endDateFilter]);

  // Initial load
  useEffect(() => {
    console.log('🔍 Initial load useEffect triggered');
    loadAssignments();

    // Temporary test data to verify rendering works
    // setTimeout(() => {
    //   console.log('🔍 Setting test data');
    //   setAssignments([{
    //     assignment_id: 'test-123',
    //     inspector_id: 'inspector-123',
    //     branch_id: 'branch-123',
    //     assigned_by_id: 'user-123',
    //     start_date: '2025-01-01',
    //     end_date: '2025-12-31',
    //     is_active: true,
    //     created_at: '2025-01-01T00:00:00.000Z',
    //     updated_at: '2025-01-01T00:00:00.000Z',
    //     inspector: { id: 'inspector-123', username: 'Test Inspector', email: 'test@example.com', role: 'Inspection_Auditors', department: 'Inspection' },
    //     branch: { id: 'branch-123', branch_code: 'BR001', branch_name: 'Test Branch', is_active: true },
    //     assignedBy: { id: 'user-123', username: 'Test Admin', email: 'admin@example.com', role: 'Admin' }
    //   }]);
    //   setTotalCount(1);
    //   setLoading(false);
    // }, 2000);
  }, []);

  // Assignments are now filtered on the backend, so we use them directly
  const filteredAssignments = assignments;

  // Handle create assignment
  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    loadAssignments(currentPage);
    toast.success('Inspector branch assignment created successfully');
  };

  // Handle edit assignment
  const handleEditClick = (assignment: InspectorBranchAssignment) => {
    setSelectedAssignment(assignment);
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedAssignment(null);
    loadAssignments(currentPage);
    toast.success('Inspector branch assignment updated successfully');
  };

  // Handle delete assignment
  const handleDeleteClick = (assignment: InspectorBranchAssignment) => {
    setAssignmentToDelete(assignment);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assignmentToDelete) return;

    try {
      await inspectorBranchAssignmentService.delete(assignmentToDelete.assignment_id);
      setIsDeleteDialogOpen(false);
      setAssignmentToDelete(null);
      loadAssignments(currentPage);
      toast.success('Inspector branch assignment deleted successfully');
    } catch (error) {
      console.error('Error deleting assignment:', error);
      const errorMessage = getErrorMessage(error, 'Failed to delete inspector branch assignment. Please try again.');
      toast.error(errorMessage);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    loadAssignments(currentPage);
  };

  // Utility function for consistent error handling
  const getErrorMessage = (error: unknown, defaultMessage: string): string => {
    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('Network Error') || error.message.includes('fetch')) {
        return 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('timeout')) {
        return 'Request timed out. Please try again.';
      } else if (error.message.includes('500')) {
        return 'Server error. Please try again later.';
      } else if (error.message.includes('403') || error.message.includes('401')) {
        return 'Access denied. Please check your permissions.';
      } else if (error.message.includes('404')) {
        return 'Resource not found. Please refresh and try again.';
      } else if (error.message.includes('Invalid response') || error.message.includes('Invalid assignments') || error.message.includes('Invalid pagination')) {
        return 'Server returned invalid data. Please refresh the page and try again.';
      } else if (error.message.includes('Cannot read properties')) {
        return 'Data format error. Please refresh the page and try again.';
      }
    }

    // Handle non-Error objects (like axios errors)
    if (typeof error === 'object' && error !== null) {
      const errorObj = error as any;
      if (errorObj.response?.status) {
        const status = errorObj.response.status;
        if (status >= 500) {
          return 'Server error. Please try again later.';
        } else if (status === 404) {
          return 'Resource not found. Please refresh and try again.';
        } else if (status === 403 || status === 401) {
          return 'Access denied. Please check your permissions.';
        } else if (status >= 400) {
          return 'Request error. Please check your input and try again.';
        }
      }
    }

    return defaultMessage;
  };

  // Format date
  const formatDate = (dateString: string | undefined, dateOnly: boolean = false) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';

    // For date-only fields (start_date, end_date), don't show time
    if (dateOnly || dateString.length === 10) {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }

    // For datetime fields (assigned_at, created_at), show time
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Date range preset functions
  const getDateRangePresets = () => {
    const today = new Date();
    const formatDateForInput = (date: Date) => date.toISOString().split('T')[0];

    return {
      'last-30-days': {
        label: 'Last 30 days',
        startDate: formatDateForInput(new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)),
        endDate: formatDateForInput(today)
      },
      'last-3-months': {
        label: 'Last 3 months',
        startDate: formatDateForInput(new Date(today.getFullYear(), today.getMonth() - 3, today.getDate())),
        endDate: formatDateForInput(today)
      },
      'this-year': {
        label: 'This year',
        startDate: formatDateForInput(new Date(today.getFullYear(), 0, 1)),
        endDate: formatDateForInput(today)
      },
      'all-time': {
        label: 'All time',
        startDate: '',
        endDate: ''
      }
    };
  };

  // Apply date range preset
  const applyDateRangePreset = (preset: string) => {
    const presets = getDateRangePresets();
    const selectedPreset = presets[preset as keyof typeof presets];

    if (selectedPreset) {
      setStartDateFilter(selectedPreset.startDate);
      setEndDateFilter(selectedPreset.endDate);
      setDateRangePreset(preset);
      // Note: useEffect will trigger loadAssignments automatically
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setStartDateFilter('');
    setEndDateFilter('');
    setDateRangePreset('');
    // Note: useEffect will trigger loadAssignments automatically
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inspector Branch Assignment</h1>
          <p className="text-gray-600 mt-1">
            Manage inspector assignments to branches ({totalCount} total assignments)
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Inspector Branch Assignment</DialogTitle>
                <DialogDescription>
                  Assign an inspector to a specific branch for audit oversight.
                </DialogDescription>
              </DialogHeader>
              <InspectorBranchAssignmentForm
                onSuccess={handleCreateSuccess}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Search & Filter Assignments
                {(searchTerm || startDateFilter || endDateFilter) && (
                  <Badge variant="secondary" className="ml-2">
                    {[searchTerm, startDateFilter, endDateFilter].filter(Boolean).length} active
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Search by inspector, branch, or assigned by user. Filter by date ranges.
              </CardDescription>
            </div>
            {(searchTerm || startDateFilter || endDateFilter) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by inspector name, branch name, assigned by user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
            {loading && (
              <RefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
            )}
          </div>

          {/* Date Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Range Presets */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Filters</Label>
              <Select value={dateRangePreset} onValueChange={applyDateRangePreset} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(getDateRangePresets()).map(([key, preset]) => (
                    <SelectItem key={key} value={key}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Start Date From</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="date"
                  value={startDateFilter}
                  onChange={(e) => {
                    setStartDateFilter(e.target.value);
                    setDateRangePreset(''); // Clear preset when manually setting dates
                  }}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {/* End Date Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Start Date To</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="date"
                  value={endDateFilter}
                  onChange={(e) => {
                    setEndDateFilter(e.target.value);
                    setDateRangePreset(''); // Clear preset when manually setting dates
                  }}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Active Filters Indicator */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Active Filters</Label>
              <div className="flex flex-wrap gap-1">
                {searchTerm && (
                  <Badge variant="secondary" className="text-xs">
                    Search: {searchTerm.length > 10 ? `${searchTerm.substring(0, 10)}...` : searchTerm}
                  </Badge>
                )}
                {startDateFilter && (
                  <Badge variant="secondary" className="text-xs">
                    From: {formatDate(startDateFilter, true)}
                  </Badge>
                )}
                {endDateFilter && (
                  <Badge variant="secondary" className="text-xs">
                    To: {formatDate(endDateFilter, true)}
                  </Badge>
                )}
                {!searchTerm && !startDateFilter && !endDateFilter && (
                  <span className="text-sm text-gray-500">No filters applied</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Inspector Branch Assignments
          </CardTitle>
          <CardDescription>
            {filteredAssignments.length} of {totalCount} assignments
            {(searchTerm || startDateFilter || endDateFilter) && (
              <span className="text-blue-600 ml-2">
                (filtered)
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(() => {
            // Debug logging for render conditions
            console.log('🔍 RENDER CHECK - Loading:', loading);
            console.log('🔍 RENDER CHECK - filteredAssignments.length:', filteredAssignments.length);
            console.log('🔍 RENDER CHECK - filteredAssignments:', filteredAssignments);
            return null;
          })()}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Loading assignments...</span>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
              <p className="text-gray-600 mb-4">
                {(searchTerm || startDateFilter || endDateFilter)
                  ? 'No assignments match your current filters. Try adjusting your search criteria or date range.'
                  : 'No inspector branch assignments have been created yet.'
                }
              </p>
              {(searchTerm || startDateFilter || endDateFilter) ? (
                <Button variant="outline" onClick={clearAllFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              ) : (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Assignment
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Inspector</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Assigned By</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.assignment_id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">{assignment.inspector?.username}</div>
                            <div className="text-sm text-gray-500">{assignment.inspector?.role}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">{assignment.branch?.branch_name}</div>
                            <div className="text-sm text-gray-500">{assignment.branch?.branch_code}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {assignment.assignedBy?.username}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(assignment.start_date, true)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {assignment.end_date ? (
                            formatDate(assignment.end_date, true)
                          ) : (
                            <span className="text-blue-600 font-medium">Ongoing</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={assignment.is_active ? "default" : "secondary"}>
                          {assignment.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(assignment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(assignment)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-4">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadAssignments(currentPage - 1)}
                      disabled={currentPage <= 1 || loading}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadAssignments(currentPage + 1)}
                      disabled={currentPage >= totalPages || loading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Inspector Branch Assignment</DialogTitle>
            <DialogDescription>
              Update the inspector branch assignment details.
            </DialogDescription>
          </DialogHeader>
          {selectedAssignment && (
            <InspectorBranchAssignmentForm
              assignment={selectedAssignment}
              onSuccess={handleEditSuccess}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedAssignment(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Inspector Branch Assignment"
        description={`Are you sure you want to delete the assignment of ${assignmentToDelete?.inspector?.username} to ${assignmentToDelete?.branch?.branch_name}? This action cannot be undone.`}
        confirmText="Delete Assignment"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};
