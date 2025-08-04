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
import { Plus, Search, Eye, Edit, Trash2, FileText, CheckCircle, XCircle, UserPlus, FileCheck, ClipboardList, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import {
  AuditFinding,
  AuditFindingFilters,
  AuditFindingListResponse,
  AUDIT_FINDING_STATUSES
} from '@/types/auditFinding';
import { Category, RiskLevel, RiskRating } from '@/types/referenceData';
import { User } from '@/types/user';

interface AuditFindingsListProps {
  user: User;
  onCreateNew?: () => void;
  onUnifiedCreate?: () => void;
  onViewDetails?: (finding: AuditFinding) => void;
  onEdit?: (finding: AuditFinding) => void;
  onDelete?: (finding: AuditFinding) => void;
  onAssign?: (finding: AuditFinding) => void;
  onRectify?: (finding: AuditFinding) => void;
  onActionPlan?: (finding: AuditFinding) => void;
}

export const AuditFindingsList = ({
  user,
  onCreateNew,
  onUnifiedCreate,
  onViewDetails,
  onEdit,
  onDelete,
  onAssign,
  onRectify,
  onActionPlan
}: AuditFindingsListProps) => {
  const { api } = useAuth();

  // Add null check for user
  if (!user) {
    return <div>Loading...</div>;
  }

  const [findings, setFindings] = useState<AuditFinding[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });

  // Filter states
  const [filters, setFilters] = useState<AuditFindingFilters>({
    search: '',
    status: '',
    category_id: '',
    risk_level_id: '',
    risk_rating_id: '',
    page: 1,
    limit: 10
  });

  // Reference data for filters
  const [categories, setCategories] = useState<Category[]>([]);
  const [riskLevels, setRiskLevels] = useState<RiskLevel[]>([]);
  const [riskRatings, setRiskRatings] = useState<RiskRating[]>([]);

  // Permissions removed - universal access for all users

  // Fetch audit findings
  const fetchFindings = async (currentFilters: AuditFindingFilters = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await api.get(`/api/audit-findings?${params.toString()}`);
      const data: AuditFindingListResponse = response.data;
      
      setFindings(data.data || []);
      setPagination({
        page: data.page || 1,
        totalPages: data.totalPages || 1,
        total: data.total || 0,
        limit: data.limit || 10
      });
    } catch (error) {
      console.error('Error fetching audit findings:', error);
      toast.error('Failed to fetch audit findings');
      setFindings([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reference data for filters
  const fetchReferenceData = async () => {
    try {
      const [categoriesRes, riskLevelsRes, riskRatingsRes] = await Promise.all([
        api.get('/api/reference-data/categories?limit=1000'),
        api.get('/api/reference-data/risk-levels?limit=1000'),
        api.get('/api/reference-data/risk-ratings?limit=1000')
      ]);

      setCategories(categoriesRes.data?.data || categoriesRes.data || []);
      setRiskLevels(riskLevelsRes.data?.data || riskLevelsRes.data || []);
      setRiskRatings(riskRatingsRes.data?.data || riskRatingsRes.data || []);
    } catch (error) {
      console.error('Error fetching reference data:', error);
    }
  };

  useEffect(() => {
    fetchFindings();
    fetchReferenceData();
  }, []);

  // Handle filter changes
  const handleFilterChange = (key: keyof AuditFindingFilters, value: string) => {
    // Convert "all" back to empty string for API
    const filterValue = value === 'all' ? '' : value;
    const newFilters = { ...filters, [key]: filterValue, page: 1 };
    setFilters(newFilters);
    fetchFindings(newFilters);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchFindings(newFilters);
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

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Audit Findings</h1>
            <p className="text-gray-600">Manage and track audit findings</p>
          </div>
          {/* {onCreateNew && (
            <Button onClick={onCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create Finding
            </Button>
          )} */}
        </div>
      </div>

      {/* Quick Stats */}
      {onUnifiedCreate && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-900">{pagination.total}</div>
                  <div className="text-sm text-blue-700">Total Findings</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-900">
                    {findings.filter(f => f.status === 'Resolved').length}
                  </div>
                  <div className="text-sm text-green-700">Resolved</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-900">
                    {findings.filter(f => f.status === 'Pending').length}
                  </div>
                  <div className="text-sm text-yellow-700">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-900">
                    {findings.filter(f => f.status === 'Escalated').length}
                  </div>
                  <div className="text-sm text-red-700">Escalated</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Audit Findings</CardTitle>
              <CardDescription className="mt-2">
                Create and manage audit findings 
              </CardDescription>
            </div>

            {onUnifiedCreate && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">Ready to create?</div>
                  <div className="text-xs text-gray-500">Choose single or multiple findings</div>
                </div>
               <Button
                onClick={onUnifiedCreate}
                size="lg"
                className="bg-black text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Finding
              </Button>

              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search findings..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
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

            <Select value={filters.category_id || 'all'} onValueChange={(value) => handleFilterChange('category_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.risk_level_id || 'all'} onValueChange={(value) => handleFilterChange('risk_level_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Risk Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                {riskLevels.map(level => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.risk_level_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.risk_rating_id || 'all'} onValueChange={(value) => handleFilterChange('risk_rating_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Risk Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Ratings</SelectItem>
                {riskRatings.map(rating => (
                  <SelectItem key={rating.id} value={rating.id}>
                    {rating.risk_rating_name}
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
          ) : findings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No audit findings found. Click "Create Finding" to add one.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {findings.map((finding) => (
                    <TableRow key={finding.id}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate" title={finding.title}>
                          {finding.title}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(finding.status)}</TableCell>
                      <TableCell>{finding.Category?.category_name || '-'}</TableCell>
                      <TableCell>{finding.RiskLevel?.risk_level_name || '-'}</TableCell>
                      <TableCell>{formatCurrency(finding.amount)}</TableCell>
                      <TableCell>{finding.createdBy?.username || '-'}</TableCell>
                      <TableCell>{formatDate(finding.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {onViewDetails && (
                            <Button variant="ghost" size="sm" onClick={() => onViewDetails(finding)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {onEdit && (
                            <Button variant="ghost" size="sm" onClick={() => onEdit(finding)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {onAssign && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onAssign(finding)}
                              title="Assign to user"
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          )}
                          {onRectify && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRectify(finding)}
                              title="Manage rectification"
                            >
                              <FileCheck className="h-4 w-4" />
                            </Button>
                          )}
                          {onActionPlan && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onActionPlan(finding)}
                              title="Manage action plan"
                            >
                              <ClipboardList className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button variant="ghost" size="sm" onClick={() => onDelete(finding)}>
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
                    Showing {findings.length} of {pagination.total} results
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
