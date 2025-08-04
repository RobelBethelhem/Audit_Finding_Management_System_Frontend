import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Calendar,
  Clock,
  FileText,
  Users,
  Package,
  ChevronDown,
  ChevronRight,
  History
} from 'lucide-react';
import {
  ActionPlan,
  ActionPlanAmendmentHistory,
  ACTION_PLAN_STATUSES
} from '@/types/actionPlan';
import { User as UserType } from '@/types/user';
import { FilePreview } from './FilePreview';

interface ActionPlanDetailProps {
  user: UserType;
  actionPlanId: string;
  onEdit?: (actionPlan: ActionPlan) => void;
  onBack?: () => void;
}

export const ActionPlanDetail = ({ 
  user, 
  actionPlanId, 
  onEdit, 
  onBack
}: ActionPlanDetailProps) => {
  const { api } = useAuth();
  
  // Add null check for user
  if (!user) {
    return <div>Loading...</div>;
  }

  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [amendmentHistory, setAmendmentHistory] = useState<ActionPlanAmendmentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [amendmentLoading, setAmendmentLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [expandedAmendments, setExpandedAmendments] = useState<Set<string>>(new Set());

  // Permissions removed - universal access for all users

  // Fetch action plan details
  const fetchActionPlan = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/action-plans/${actionPlanId}`);
      setActionPlan(response.data);
    } catch (error) {
      console.error('Error fetching action plan:', error);
      toast.error('Failed to fetch action plan details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch amendment history
  const fetchAmendmentHistory = async () => {
    setAmendmentLoading(true);
    try {
      const response = await api.get(`/api/action-plans/${actionPlanId}/history`);
      setAmendmentHistory(response.data || []);
    } catch (error) {
      console.error('Error fetching amendment history:', error);
      // Don't show error toast for amendment history as it's not critical
      setAmendmentHistory([]);
    } finally {
      setAmendmentLoading(false);
    }
  };

  useEffect(() => {
    fetchActionPlan();
    fetchAmendmentHistory();
  }, [actionPlanId]);

  // Handle delete
  const handleDelete = async () => {
    if (!actionPlan) return;
    
    setActionLoading(true);
    try {
      await api.delete(`/api/action-plans/${actionPlan.action_plan_id}`);
      toast.success('Action plan deleted successfully');
      setDeleteDialogOpen(false);
      if (onBack) onBack();
    } catch (error: any) {
      console.error('Error deleting action plan:', error);
      const errorMessage = error.response?.data?.error || 'Failed to delete action plan';
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    if (!actionPlan) return;
    
    setActionLoading(true);
    try {
      await api.put(`/api/action-plans/${actionPlan.action_plan_id}/status`, { status: newStatus });
      toast.success(`Action plan status updated to ${newStatus.replace('_', ' ')}`);
      fetchActionPlan(); // Refresh data
    } catch (error: any) {
      console.error('Error updating status:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update status';
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Toggle amendment expansion
  const toggleAmendmentExpansion = (amendmentId: string) => {
    setExpandedAmendments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(amendmentId)) {
        newSet.delete(amendmentId);
      } else {
        newSet.add(amendmentId);
      }
      return newSet;
    });
  };

  // Change detection function for amendment history
  const detectChanges = (current: ActionPlanAmendmentHistory, previous: ActionPlanAmendmentHistory) => {
    const changes: Array<{ field: string; before: string; after: string }> = [];

    // Check action plan content changes
    if (current.action_plan !== previous.action_plan) {
      changes.push({
        field: 'Action Plan Content',
        before: previous.action_plan || 'Not specified',
        after: current.action_plan || 'Not specified'
      });
    }

    // Check timeline changes
    if (current.timeline !== previous.timeline) {
      changes.push({
        field: 'Timeline',
        before: previous.timeline || 'Not specified',
        after: current.timeline || 'Not specified'
      });
    }

    // Check status changes
    if (current.status !== previous.status) {
      changes.push({
        field: 'Status',
        before: previous.status?.replace(/_/g, ' ') || 'Not specified',
        after: current.status?.replace(/_/g, ' ') || 'Not specified'
      });
    }

    // Check responsible persons changes
    const currentResponsible = typeof current.responsible_persons_id === 'string'
      ? current.responsible_persons_id
      : Array.isArray(current.responsible_persons_id)
        ? current.responsible_persons_id.join(', ')
        : 'Not specified';

    const previousResponsible = typeof previous.responsible_persons_id === 'string'
      ? previous.responsible_persons_id
      : Array.isArray(previous.responsible_persons_id)
        ? previous.responsible_persons_id.join(', ')
        : 'Not specified';

    if (currentResponsible !== previousResponsible) {
      changes.push({
        field: 'Responsible Persons',
        before: previousResponsible,
        after: currentResponsible
      });
    }

    return changes;
  };

  // Format time helper
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (!actionPlan) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-8">
          <div className="text-gray-500">Action plan not found</div>
          {onBack && (
            <Button onClick={onBack} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Action Plan Details</h1>
              <p className="text-gray-600">{actionPlan.AuditFinding?.title || 'Unknown Finding'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusBadge(actionPlan.status)}
            
            {/* Status Change Buttons */}
            {getAvailableStatuses(actionPlan.status).length > 0 && (
              <div className="flex gap-2 ml-4">
                {getAvailableStatuses(actionPlan.status).map(status => {
                  const statusConfig = ACTION_PLAN_STATUSES.find(s => s.value === status);
                  return (
                    <Button
                      key={status}
                      size="sm"
                      variant={status === 'Approved' ? 'default' : status === 'Rejected' ? 'destructive' : 'outline'}
                      onClick={() => handleStatusChange(status)}
                      disabled={actionLoading}
                    >
                      {status === 'Approved' && <CheckCircle className="h-4 w-4 mr-2" />}
                      {status === 'Rejected' && <XCircle className="h-4 w-4 mr-2" />}
                      {statusConfig?.label || status}
                    </Button>
                  );
                })}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-2 ml-4">
              {onEdit && (
                <Button variant="outline" onClick={() => onEdit(actionPlan)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}

              {(
                <Button 
                  variant="destructive" 
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Plan Details */}
          <Card>
            <CardHeader>
              <CardTitle>Action Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{actionPlan.action_plan}</p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{actionPlan.timeline}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                  {getStatusBadge(actionPlan.status)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responsible Persons */}
          {actionPlan.responsiblePersons && actionPlan.responsiblePersons.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Responsible Persons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {actionPlan.responsiblePersons.map((rp) => (
                    <div key={rp.id} className="flex items-center gap-3 p-3 border rounded-md">
                      <User className="h-8 w-8 text-gray-400" />
                      <div>
                        <div className="font-medium">{rp.User?.username || 'Unknown User'}</div>
                        <div className="text-sm text-gray-500">
                          {rp.User?.role?.replace(/_/g, ' ')} - {rp.User?.department}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resources */}
          {actionPlan.resources && actionPlan.resources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Required Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {actionPlan.resources.map((resource) => (
                    <div key={resource.id}>
                      {resource.file_path ? (
                        <FilePreview file={resource} type="resource" />
                      ) : (
                        <div className="flex items-center gap-2 p-3 border rounded-md">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span>{resource.resource_name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Evidence Files */}
          {actionPlan.evidences && actionPlan.evidences.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Evidence Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {actionPlan.evidences.map((evidence) => (
                    <FilePreview key={evidence.id} file={evidence} type="evidence" />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Amendment History - Chronological Order */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Amendment History
                {amendmentHistory.length > 0 && (
                  <span className="text-sm font-normal text-gray-500">
                    ({amendmentHistory.length} amendment{amendmentHistory.length !== 1 ? 's' : ''})
                  </span>
                )}
              </CardTitle>
              {amendmentHistory.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Complete chronological history of all amendments and changes
                </p>
              )}
            </CardHeader>
            <CardContent>
              {amendmentLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="text-gray-500">Loading amendment history...</div>
                </div>
              ) : amendmentHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No amendments have been made to this action plan yet.</p>
                  <p className="text-sm">Changes and updates will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Sort amendments by amended_at date (newest first) for chronological order */}
                  {amendmentHistory
                    .slice()
                    .sort((a, b) => new Date(b.amended_at || b.createdAt).getTime() - new Date(a.amended_at || a.createdAt).getTime())
                    .map((amendment, index) => {
                    const isExpanded = expandedAmendments.has(amendment.id);
                    return (
                      <div key={amendment.id} className="border rounded-md hover:bg-gray-50 transition-colors">
                        {/* Amendment Header - Always Visible */}
                        <div
                          className="flex items-center justify-between p-3 cursor-pointer"
                          onClick={() => toggleAmendmentExpansion(amendment.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="font-medium text-gray-900">
                                  Amendment #{amendmentHistory.length - index} by {amendment.amendedBy?.username || 'Unknown User'}
                                </div>
                                {index === 0 && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    Latest
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {formatDate(amendment.amended_at || amendment.createdAt)} at {formatTime(amendment.amended_at || amendment.createdAt)}
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-xs text-gray-400">
                            {isExpanded ? 'Click to collapse' : 'Click to expand'}
                          </div>
                        </div>

                        {/* Expandable Details */}
                        {isExpanded && (
                          <div className="border-t p-3 bg-gray-50">
                            <div className="space-y-3">
                              {/* Change Detection - Compare with previous amendment in chronological order */}
                              {(() => {
                                // Get the sorted array for proper chronological comparison
                                const sortedAmendments = amendmentHistory
                                  .slice()
                                  .sort((a, b) => new Date(b.amended_at || b.createdAt).getTime() - new Date(a.amended_at || a.createdAt).getTime());

                                const currentIndex = sortedAmendments.findIndex(a => a.id === amendment.id);
                                const previousAmendment = sortedAmendments[currentIndex + 1];

                                if (!previousAmendment) return null;

                                const changes = detectChanges(amendment, previousAmendment);

                                if (changes.length === 0) return null;

                                return (
                                  <div className="mb-4">
                                    <div className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                                      <AlertTriangle className="h-4 w-4" />
                                      Changes Made from Previous Amendment
                                    </div>

                                    {changes.map((change, changeIndex) => (
                                      <div key={changeIndex} className="bg-blue-50 border border-blue-200 rounded p-3 mb-2">
                                        <div className="text-sm font-medium text-blue-800 mb-2">{change.field}</div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          <div>
                                            <div className="text-xs font-medium text-red-600 mb-1">After:</div>
                                            <div className="bg-red-50 border border-red-200 p-2 rounded text-sm">
                                              {change.after || 'Not specified'}
                                            </div>
                                          </div>
                                          <div>
                                            <div className="text-xs font-medium text-gray-600 mb-1">Before:</div>
                                            <div className="bg-gray-50 border border-gray-200 p-2 rounded text-sm">
                                              {change.before || 'Not specified'}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                );
                              })()}

                              {/* Amendment Details */}
                              <div>
                                <div className="text-sm font-medium text-gray-700 mb-1">Action Plan Content</div>
                                <div className="bg-white p-2 rounded border text-sm">
                                  {amendment.action_plan || 'Not specified'}
                                </div>
                              </div>

                              {amendment.timeline && (
                                <div>
                                  <div className="text-sm font-medium text-gray-700 mb-1">Timeline</div>
                                  <div className="bg-white p-2 rounded border text-sm">
                                    {amendment.timeline}
                                  </div>
                                </div>
                              )}

                              {amendment.status && (
                                <div>
                                  <div className="text-sm font-medium text-gray-700 mb-1">Status</div>
                                  <div className="bg-white p-2 rounded border text-sm">
                                    {amendment.status.replace(/_/g, ' ')}
                                  </div>
                                </div>
                              )}

                              {amendment.responsible_persons_id && (
                                <div>
                                  <div className="text-sm font-medium text-gray-700 mb-1">Responsible Persons</div>
                                  <div className="bg-white p-2 rounded border text-sm">
                                    {typeof amendment.responsible_persons_id === 'string'
                                      ? amendment.responsible_persons_id
                                      : Array.isArray(amendment.responsible_persons_id)
                                        ? amendment.responsible_persons_id.join(', ')
                                        : 'Not specified'
                                    }
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>Amended by: {amendment.amendedBy?.username || 'Unknown'}</span>
                                <span>Role: {amendment.amendedBy?.role?.replace(/_/g, ' ')}</span>
                                <span>Email: {amendment.amendedBy?.email}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Amendment History Summary */}
                  <div className="mt-4 pt-4 border-t bg-gray-50 rounded-md p-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Total amendments:</span> {amendmentHistory.length}
                      </div>
                      <div>
                        <span className="font-medium">First amendment:</span> {formatDate(
                          amendmentHistory
                            .slice()
                            .sort((a, b) => new Date(a.amended_at || a.createdAt).getTime() - new Date(b.amended_at || b.createdAt).getTime())[0]?.amended_at ||
                          amendmentHistory
                            .slice()
                            .sort((a, b) => new Date(a.amended_at || a.createdAt).getTime() - new Date(b.amended_at || b.createdAt).getTime())[0]?.createdAt
                        )}
                      </div>
                      <div>
                        <span className="font-medium">Latest amendment:</span> {formatDate(
                          amendmentHistory
                            .slice()
                            .sort((a, b) => new Date(b.amended_at || b.createdAt).getTime() - new Date(a.amended_at || a.createdAt).getTime())[0]?.amended_at ||
                          amendmentHistory
                            .slice()
                            .sort((a, b) => new Date(b.amended_at || b.createdAt).getTime() - new Date(a.amended_at || a.createdAt).getTime())[0]?.createdAt
                        )}
                      </div>
                    </div>

                    {/* Amendment status distribution */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(amendmentHistory.map(a => a.status).filter(Boolean)))
                          .map(status => {
                            const count = amendmentHistory.filter(a => a.status === status).length;
                            const statusColor = status === 'Completed' ? 'bg-green-100 text-green-700 border-green-200' :
                                              status === 'In_Progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                              status === 'Pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                              'bg-gray-100 text-gray-700 border-gray-200';
                            return (
                              <span key={status} className={`px-2 py-1 border rounded-full text-xs ${statusColor}`}>
                                {status?.replace(/_/g, ' ')}: {count}
                              </span>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
                )}
              </CardContent>
            </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Finding</div>
                  <div className="font-medium">{actionPlan.AuditFinding?.title || 'Unknown'}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Submitted By</div>
                  <div className="font-medium">{actionPlan.submittedBy?.username || 'Unknown'}</div>
                  <div className="text-xs text-gray-500">{actionPlan.submittedBy?.role?.replace(/_/g, ' ')}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Created</div>
                  <div className="font-medium">{formatDate(actionPlan.createdAt)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Last Updated</div>
                  <div className="font-medium">{formatDate(actionPlan.updatedAt)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Finding Information */}
          {actionPlan.AuditFinding && (
            <Card>
              <CardHeader>
                <CardTitle>Related Finding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Title</div>
                  <div className="font-medium">{actionPlan.AuditFinding.title}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500">Amount</div>
                  <div className="font-medium">{formatCurrency(actionPlan.AuditFinding.amount)}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <div className="font-medium">{actionPlan.AuditFinding.status}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this action plan? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={actionLoading}
            >
              {actionLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
