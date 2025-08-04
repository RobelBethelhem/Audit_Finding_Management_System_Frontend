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
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Calendar,
  DollarSign,
  Shield,
  Tag,
  History,
  ChevronDown,
  ChevronRight,
  Users,
  Clock,
  Timer,
  File,
  Download,
  Eye,
  FileText as FileIcon,
  Image,
  X
} from 'lucide-react';
import {
  AuditFinding,
  AUDIT_FINDING_STATUSES,
  RECTIFICATION_STATUSES
} from '@/types/auditFinding';
import { User as UserType } from '@/types/user';
import { BranchAssignmentModal } from './BranchAssignmentModal';
import { UserAssignmentModal } from './UserAssignmentModal';

interface AuditFindingDetailProps {
  user: UserType;
  findingId: string;
  onEdit?: (finding: AuditFinding) => void;
  onBack?: () => void;
  onInitiateRectification?: (finding: AuditFinding) => void;
}

export const AuditFindingDetail = ({ 
  user, 
  findingId, 
  onEdit, 
  onBack,
  onInitiateRectification 
}: AuditFindingDetailProps) => {
  const { api } = useAuth();

  // Add null check for user
  if (!user) {
    return <div>Loading...</div>;
  }

  const [finding, setFinding] = useState<AuditFinding | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [expandedAmendments, setExpandedAmendments] = useState<{ [key: string]: boolean }>({});

  // File preview state
  const [previewFile, setPreviewFile] = useState<{
    url: string;
    name: string;
    type: string;
  } | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  // Assignment modal states
  const [branchAssignmentModalOpen, setBranchAssignmentModalOpen] = useState(false);
  const [userAssignmentModalOpen, setUserAssignmentModalOpen] = useState(false);

  // Permission check functions
  const canAssignToBranch = () => {
    if (!finding) return false;
    const auditorRoles = ['Resident_Auditors', 'IT_Auditors', 'Inspection_Auditors', 'Audit_Supervisor', 'IT_Auditors_Supervisor', 'Inspection_Auditors_Supervisor'];
    return auditorRoles.includes(user.role) && !finding.assigned_branch_id;
  };

  const canAssignToUser = () => {
    if (!finding) return false;
    const supervisorRoles = ['Auditee_Supervisor', 'IT_Auditees_Supervisor', 'Inspection_Auditees_Supervisor'];
    return supervisorRoles.includes(user.role) &&
           finding.assigned_branch_id &&
           finding.branch_supervisor_id === user.id &&
           (!finding.AuditFindingAssigneds || finding.AuditFindingAssigneds.length === 0);
  };

  // Countdown state
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    isOverdue: boolean;
    urgencyLevel: 'green' | 'yellow' | 'red';
  } | null>(null);

  // Permissions removed - universal access for all users

  // Fetch finding details
  const fetchFinding = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/audit-findings/${findingId}`);
      setFinding(response.data);
    } catch (error) {
      console.error('Error fetching audit finding:', error);
      toast.error('Failed to fetch audit finding details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinding();
  }, [findingId]);

  // Countdown timer effect
  useEffect(() => {
    if (!finding?.due_date || finding.status === 'Resolved') {
      setCountdown(null);
      return;
    }

    const updateCountdown = () => {
      const countdownData = calculateCountdown(finding.due_date!);
      setCountdown(countdownData);
    };

    // Update immediately
    updateCountdown();

    // Update every 100ms for smooth animation
    const interval = setInterval(updateCountdown, 100);

    // Cleanup interval on unmount or when due_date or status changes
    return () => clearInterval(interval);
  }, [finding?.due_date, finding?.status]);

  // Handle delete
  const handleDelete = async () => {
    if (!finding) return;
    
    setActionLoading(true);
    try {
      await api.delete(`/api/audit-findings/${finding.id}`);
      toast.success('Audit finding deleted successfully');
      setDeleteDialogOpen(false);
      if (onBack) onBack();
    } catch (error: any) {
      console.error('Error deleting audit finding:', error);
      const errorMessage = error.response?.data?.error || 'Failed to delete audit finding';
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle rectification approval
  const handleApproveRectification = async () => {
    if (!finding) return;
    
    setActionLoading(true);
    try {
      await api.put(`/api/audit-findings/${finding.id}/rectify/approve`);
      toast.success('Rectification approved successfully');
      fetchFinding(); // Refresh data
    } catch (error: any) {
      console.error('Error approving rectification:', error);
      const errorMessage = error.response?.data?.error || 'Failed to approve rectification';
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle rectification rejection
  const handleRejectRectification = async () => {
    if (!finding) return;
    
    setActionLoading(true);
    try {
      await api.put(`/api/audit-findings/${finding.id}/rectify/reject`, {
        rejection_reason: 'Rectification does not meet requirements'
      });
      toast.success('Rectification rejected');
      fetchFinding(); // Refresh data
    } catch (error: any) {
      console.error('Error rejecting rectification:', error);
      const errorMessage = error.response?.data?.error || 'Failed to reject rectification';
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
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

  // Get rectification status badge
  const getRectificationStatusBadge = (status: string) => {
    const statusConfig = RECTIFICATION_STATUSES.find(s => s.value === status);
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

  // Format time helper
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate countdown for due date
  const calculateCountdown = (dueDate: string) => {
    const now = new Date().getTime();
    const due = new Date(dueDate).getTime();
    const difference = due - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        isOverdue: true,
        urgencyLevel: 'red' as const
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    const milliseconds = difference % 1000;

    // Determine urgency level
    const totalHours = days * 24 + hours;
    let urgencyLevel: 'green' | 'yellow' | 'red';

    if (totalHours < 24) {
      urgencyLevel = 'red';
    } else if (totalHours < 72) { // Less than 3 days
      urgencyLevel = 'yellow';
    } else {
      urgencyLevel = 'green';
    }

    return {
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      isOverdue: false,
      urgencyLevel
    };
  };

  // Helper function to detect changes between amendments
  const detectChanges = (currentAmendment: any, previousAmendment: any) => {
    const changes: Array<{ field: string; before: string; after: string }> = [];

    const fieldsToCheck = [
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description' },
      { key: 'criteria', label: 'Criteria' },
      { key: 'cause', label: 'Cause' },
      { key: 'impact', label: 'Impact' },
      { key: 'recommendation', label: 'Recommendation' },
      { key: 'amount', label: 'Amount' },
      { key: 'status', label: 'Status' }
    ];

    fieldsToCheck.forEach(field => {
      const currentValue = currentAmendment[field.key];
      const previousValue = previousAmendment[field.key];

      if (currentValue !== previousValue) {
        changes.push({
          field: field.label,
          before: previousValue || '',
          after: currentValue || ''
        });
      }
    });

    return changes;
  };

  // File handling functions
  const downloadFile = async (evidenceId: string, fileName: string) => {
    try {
      const response = await api.get(`/api/audit-findings/evidence/${evidenceId}/download`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const previewFileHandler = async (evidenceId: string, fileName: string, mimeType: string) => {
    try {
      const response = await api.get(`/api/audit-findings/evidence/${evidenceId}/download`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: mimeType }));
      setPreviewFile({
        url,
        name: fileName,
        type: mimeType
      });
      setPreviewDialogOpen(true);
    } catch (error) {
      console.error('Error previewing file:', error);
      toast.error('Failed to preview file');
    }
  };

  const closePreview = () => {
    if (previewFile?.url) {
      window.URL.revokeObjectURL(previewFile.url);
    }
    setPreviewFile(null);
    setPreviewDialogOpen(false);
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="h-4 w-4 text-blue-600" />;
    } else if (mimeType === 'application/pdf') {
      return <FileIcon className="h-4 w-4 text-red-600" />;
    } else if (mimeType.includes('document') || mimeType.includes('word')) {
      return <FileIcon className="h-4 w-4 text-blue-600" />;
    } else {
      return <File className="h-4 w-4 text-gray-600" />;
    }
  };

  const canPreviewFile = (mimeType: string) => {
    return mimeType === 'application/pdf' || mimeType.startsWith('image/');
  };

  // Check if user can approve/reject rectification
  const canApproveRectification = (finding: AuditFinding) => {
    if (user.role === 'Admin') return true;
    if (finding.created_by_id === user.id) return true;
    
    const supervisorRoles = ['Audit_Supervisor', 'IT_Auditors_Supervisor', 'Inspection_Auditors_Supervisor'];
    const directorRoles = ['Audit_Director', 'IT_Auditors_Director', 'Inspection_Auditors_Director'];
    
    if ((supervisorRoles.includes(user.role) || directorRoles.includes(user.role)) && 
        finding.createdBy?.department === user.department) {
      return true;
    }
    
    return false;
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

  if (!finding) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-8">
          <div className="text-gray-500">Audit finding not found</div>
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
              <h1 className="text-2xl font-bold text-gray-900">{finding.title}</h1>
              <p className="text-gray-600">Audit Finding Details</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusBadge(finding.status)}
            
            {/* Action Buttons */}
            <div className="flex gap-2 ml-4">
              {onEdit && (
                <Button variant="outline" onClick={() => onEdit(finding)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}

              {finding.status === 'Pending' &&
               onInitiateRectification && (
                <Button onClick={() => onInitiateRectification(finding)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Initiate Rectification
                </Button>
              )}

              {/* Branch Assignment Button - For Auditors */}
              {/* {canAssignToBranch() && (
                <Button
                  variant="outline"
                  onClick={() => setBranchAssignmentModalOpen(true)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Assign to Branch
                </Button>
              )} */}

              {/* User Assignment Button - For Branch Supervisors */}
              {canAssignToUser() && (
                <Button
                  variant="outline"
                  onClick={() => setUserAssignmentModalOpen(true)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Assign to User
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

      {/* Real-Time Due Date Countdown - Only show for non-resolved findings */}
      {finding.due_date && countdown && finding.status !== 'Resolved' && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className={`flex items-center justify-between p-4 rounded-lg ${
              countdown.urgencyLevel === 'red' ? 'bg-red-50 border border-red-200' :
              countdown.urgencyLevel === 'yellow' ? 'bg-yellow-50 border border-yellow-200' :
              'bg-green-50 border border-green-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  countdown.urgencyLevel === 'red' ? 'bg-red-100' :
                  countdown.urgencyLevel === 'yellow' ? 'bg-yellow-100' :
                  'bg-green-100'
                }`}>
                  <Timer className={`h-5 w-5 ${
                    countdown.urgencyLevel === 'red' ? 'text-red-600' :
                    countdown.urgencyLevel === 'yellow' ? 'text-yellow-600' :
                    'text-green-600'
                  }`} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {countdown.isOverdue ? 'OVERDUE' : 'Time Remaining'}
                  </div>
                  <div className="text-sm font-medium text-gray-700 mt-1">
                    Due Date: {formatDate(finding.due_date)}
                  </div>
                </div>
              </div>

              <div className="text-right">
                {countdown.isOverdue ? (
                  <div className="text-lg font-bold text-red-600">
                    OVERDUE
                  </div>
                ) : (
                  <div className={`text-lg font-mono font-bold ${
                    countdown.urgencyLevel === 'red' ? 'text-red-600' :
                    countdown.urgencyLevel === 'yellow' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s {countdown.milliseconds}ms
                  </div>
                )}
                <div className={`text-xs font-medium mt-1 ${
                  countdown.urgencyLevel === 'red' ? 'text-red-500' :
                  countdown.urgencyLevel === 'yellow' ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
                  {countdown.urgencyLevel === 'red' ? 'URGENT - Less than 24 hours' :
                   countdown.urgencyLevel === 'yellow' ? 'ATTENTION - Less than 3 days' :
                   'ON TRACK - More than 3 days'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Due Date Display for Resolved Findings */}
      {finding.due_date && finding.status === 'Resolved' && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gray-100">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Finding Resolved
                  </div>
                  <div className="text-sm font-medium text-gray-700 mt-1">
                    Original Due Date: {formatDate(finding.due_date)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  COMPLETED
                </div>
                <div className="text-xs font-medium mt-1 text-green-500">
                  No action required
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Finding Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700">{finding.description}</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Criteria</h4>
                <p className="text-gray-700">{finding.criteria}</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cause</h4>
                <p className="text-gray-700">{finding.cause}</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Impact</h4>
                <p className="text-gray-700">{finding.impact}</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Recommendation</h4>
                <p className="text-gray-700">{finding.recommendation}</p>
              </div>
            </CardContent>
          </Card>

          {/* Evidence Files Section */}
          {finding.evidences && finding.evidences.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileIcon className="h-5 w-5" />
                  Evidence Files
                </CardTitle>
                <CardDescription>
                  Supporting documents and evidence files for this audit finding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {finding.evidences.map((evidence) => (
                    <div
                      key={evidence.evidence_id}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getFileIcon(evidence.mime_type)}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {evidence.original_file_name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {(evidence.file_size / 1024 / 1024).toFixed(2)} MB •
                            Uploaded by {evidence.uploadedBy?.username} •
                            {new Date(evidence.created_at).toLocaleDateString()}
                          </div>
                          {evidence.description && (
                            <div className="text-xs text-gray-600 mt-1 italic">
                              {evidence.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        {canPreviewFile(evidence.mime_type) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => previewFileHandler(
                              evidence.evidence_id,
                              evidence.original_file_name,
                              evidence.mime_type
                            )}
                            className="h-8 w-8 p-0"
                            title="Preview file"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadFile(
                            evidence.evidence_id,
                            evidence.original_file_name
                          )}
                          className="h-8 w-8 p-0"
                          title="Download file"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rectification Section */}
          {finding.AuditFindingRectification && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Rectification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Status</h4>
                    <div className="mt-1">
                      {getRectificationStatusBadge(finding.AuditFindingRectification.status)}
                    </div>
                  </div>

                  {canApproveRectification(finding) &&
                   finding.AuditFindingRectification.status === 'Pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleApproveRectification}
                        disabled={actionLoading}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleRejectRectification}
                        disabled={actionLoading}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{finding.AuditFindingRectification.description}</p>
                </div>

                {finding.AuditFindingRectification.rejection_reason && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-red-900 mb-2">Rejection Reason</h4>
                      <p className="text-red-700">{finding.AuditFindingRectification.rejection_reason}</p>
                    </div>
                  </>
                )}

                <div className="text-sm text-gray-500">
                  Submitted on {formatDate(finding.AuditFindingRectification.createdAt)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Amendment History - Chronological Order */}
          {finding.AuditAmendmentHistories && finding.AuditAmendmentHistories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Amendment History
                  <span className="text-sm font-normal text-gray-500">
                    ({finding.AuditAmendmentHistories.length} amendment{finding.AuditAmendmentHistories.length !== 1 ? 's' : ''})
                  </span>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Complete chronological history of all amendments and changes
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Sort amendments by amended_at date (newest first) for chronological order */}
                  {finding.AuditAmendmentHistories
                    .slice()
                    .sort((a, b) => new Date(b.amended_at).getTime() - new Date(a.amended_at).getTime())
                    .map((amendment, index) => {
                      const isExpanded = expandedAmendments[amendment.amendment_id];
                      const previousAmendment = index < finding.AuditAmendmentHistories!.length - 1
                        ? finding.AuditAmendmentHistories![index + 1]
                        : null;
                      const changes = previousAmendment ? detectChanges(amendment, previousAmendment) : [];

                      return (
                        <div key={amendment.amendment_id} className="border rounded-md hover:bg-gray-50 transition-colors">
                          <div
                            className="flex items-center justify-between p-3 cursor-pointer"
                            onClick={() => setExpandedAmendments(prev => ({
                              ...prev,
                              [amendment.amendment_id]: !prev[amendment.amendment_id]
                            }))}
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
                                    Amendment #{finding.AuditAmendmentHistories!.length - index}
                                  </div>
                                  {index === 0 && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                      Latest
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  by {amendment.amendedBy?.username || 'Unknown'} • {formatDate(amendment.amended_at)} at {formatTime(amendment.amended_at)}
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              {changes.length > 0 && (
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                  {changes.length} change{changes.length !== 1 ? 's' : ''}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="border-t p-3 bg-gray-50">
                              <div className="space-y-3">
                                {/* Enhanced Change Detection */}
                                {changes.length > 0 && (
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
                                )}

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <div className="text-gray-500 mb-1">Amendment Details:</div>
                                  <div className="space-y-1">
                                    <div><span className="font-medium">Status:</span> {amendment.status}</div>
                                    <div><span className="font-medium">Amount:</span> {formatCurrency(Number(amendment.amount))}</div>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-500 mb-1">User Information:</div>
                                  <div className="space-y-1">
                                    <div><span className="font-medium">Role:</span> {amendment.amendedBy?.role?.replace(/_/g, ' ')}</div>
                                    <div><span className="font-medium">Department:</span> {amendment.amendedBy?.department}</div>
                                  </div>
                                </div>
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
                        <span className="font-medium">Total amendments:</span> {finding.AuditAmendmentHistories.length}
                      </div>
                      <div>
                        <span className="font-medium">First amendment:</span> {formatDate(
                          finding.AuditAmendmentHistories
                            .slice()
                            .sort((a, b) => new Date(a.amended_at).getTime() - new Date(b.amended_at).getTime())[0]?.amended_at
                        )}
                      </div>
                      <div>
                        <span className="font-medium">Latest amendment:</span> {formatDate(
                          finding.AuditAmendmentHistories
                            .slice()
                            .sort((a, b) => new Date(b.amended_at).getTime() - new Date(a.amended_at).getTime())[0]?.amended_at
                        )}
                      </div>
                    </div>

                    {/* Amendment status distribution */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(finding.AuditAmendmentHistories.map(a => a.status).filter(Boolean)))
                          .map(status => {
                            const count = finding.AuditAmendmentHistories.filter(a => a.status === status).length;
                            const statusColor = status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' :
                                              status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                              status === 'Pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                              'bg-gray-100 text-gray-700 border-gray-200';
                            return (
                              <span key={status} className={`px-2 py-1 border rounded-full text-xs ${statusColor}`}>
                                {status}: {count}
                              </span>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assignment Information Section */}
          {(finding.assignedBranch || (finding.AuditFindingAssigneds && finding.AuditFindingAssigneds.length > 0)) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Assignment Information
                </CardTitle>
                <CardDescription>
                  Branch and user assignment details for this audit finding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Branch Assignment Information */}
                  {finding.assignedBranch && (
                    <div className="border rounded-lg p-4 bg-blue-50">
                      <h5 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Branch Assignment
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="font-medium">Assigned Branch:</span> {finding.assignedBranch.branch_code} - {finding.assignedBranch.branch_name}
                            </div>
                            {finding.branchSupervisor && (
                              <div className="text-sm">
                                <span className="font-medium">Branch Supervisor:</span> {finding.branchSupervisor.username}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="space-y-2">
                            {finding.branch_assigned_at && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <div>
                                  <div className="text-sm font-medium">Assigned On</div>
                                  <div className="text-sm text-gray-600">{formatDate(finding.branch_assigned_at)}</div>
                                </div>
                              </div>
                            )}
                            {finding.branchAssignedBy && (
                              <div className="text-sm">
                                <span className="font-medium">Assigned By:</span> {finding.branchAssignedBy.username}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User Assignment Information */}
                  {finding.AuditFindingAssigneds && finding.AuditFindingAssigneds.length > 0 && (
                    <>
                      {finding.assignedBranch && <Separator />}
                      {finding.AuditFindingAssigneds.map((assignment, index) => (
                    <div key={assignment.assigned_id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Assigned To</h5>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="font-medium">{assignment.assignedToUser?.username || 'Unknown User'}</div>
                                <div className="text-sm text-gray-500">{assignment.assignedToUser?.email}</div>
                              </div>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Role:</span> {assignment.assignedToUser?.role?.replace(/_/g, ' ')}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Department:</span> {assignment.assignedToUser?.department}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Assignment Details</h5>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="text-sm font-medium">Assigned On</div>
                                <div className="text-sm text-gray-600">{formatDate(assignment.assigned_at)}</div>
                              </div>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Assigned By:</span> {assignment.assignedByUser?.username || 'Unknown'}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Assigner Role:</span> {assignment.assignedByUser?.role?.replace(/_/g, ' ')}
                            </div>
                          </div>
                        </div>
                      </div>

                      {index < finding.AuditFindingAssigneds!.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
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
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Amount</div>
                  <div className="font-medium">{formatCurrency(finding.amount)}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Category</div>
                  <div className="font-medium">{finding.Category?.category_name || '-'}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Risk Level</div>
                  <div className="font-medium">{finding.RiskLevel?.risk_level_name || '-'}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Created By</div>
                  <div className="font-medium">{finding.createdBy?.username || '-'}</div>
                  <div className="text-xs text-gray-500">{finding.createdBy?.role?.replace(/_/g, ' ')}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Created</div>
                  <div className="font-medium">{formatDate(finding.createdAt)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* IT Audit Specific Information */}
          {(finding.SystemVulnerability || finding.ComplianceGap || finding.RelevantStandard) && (
            <Card>
              <CardHeader>
                <CardTitle>IT Audit Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {finding.SystemVulnerability && (
                  <div>
                    <div className="text-sm text-gray-500">System Vulnerability</div>
                      {/* <div className="font-medium">{finding.SystemVulnerability.vulnerability_name}</div> */}

                     <div className="text-sm sm:text-base text-gray-800">
                      <span className="font-semibold">Vulnerability Name:</span>{' '}
                      {finding.SystemVulnerability.vulnerability_name}
                    </div>

                  

                     <div className="text-sm sm:text-base text-gray-800">
                      <span className="font-semibold">Vulnerability Description:</span>{' '}
                      {finding.SystemVulnerability.vulnerability_description}
                    </div>

                     <div className="text-sm sm:text-base text-gray-800">
                      <span className="font-semibold">Affected System:</span>{' '}
                      {finding.SystemVulnerability.affected_systems}
                    </div>


                     <div className="text-sm sm:text-base text-gray-800">
                      <span className="font-semibold">Vulnerability Severity Level:</span>{' '}
                      {finding.SystemVulnerability.severity_level}
                    </div>

                    {/* {finding.SystemVulnerability.vulnerability_description && (
                      <div className="text-sm text-gray-600 mt-1">{finding.SystemVulnerability.vulnerability_description}</div>
                    )} */}
                  </div>
                )}

                {finding.ComplianceGap && (
                  <div>
                    <div className="text-sm text-gray-500">Compliance Gap</div>
                    {/* <div className="font-medium">{finding.ComplianceGap.gap_name}</div>
                    {finding.ComplianceGap.gap_description && (
                      <div className="text-sm text-gray-600 mt-1">{finding.ComplianceGap.gap_description}</div>
                    )} */}

                    <div className="text-sm sm:text-base text-gray-800">
                      <span className="font-semibold">Gap Name:</span>{' '}
                      {finding.ComplianceGap.gap_name}
                    </div>
                      <div className="text-sm sm:text-base text-gray-800">
                      <span className="font-semibold">Gap Description:</span>{' '}
                      {finding.ComplianceGap.gap_description}
                    </div>
                      <div className="text-sm sm:text-base text-gray-800">
                      <span className="font-semibold">Regulatory Impact:</span>{' '}
                      {finding.ComplianceGap.regulatory_impact}
                    </div>

                  </div>
                )}

                {finding.RelevantStandard && (
                  <div>
                    <div className="text-sm text-gray-500">Relevant Standard</div>
                    {/* <div className="font-medium">{finding.RelevantStandard.standard_name}</div>
                    {finding.RelevantStandard.standard_description && (
                      <div className="text-sm text-gray-600 mt-1">{finding.RelevantStandard.standard_description}</div>
                    )} */}

                     <div className="text-sm sm:text-base text-gray-800">
                      <span className="font-semibold">Standard Name:</span>{' '}
                      {finding.RelevantStandard.standard_name}
                    </div>

                     <div className="text-sm sm:text-base text-gray-800">
                      <span className="font-semibold">Standard Description:</span>{' '}
                      {finding.RelevantStandard.standard_description}
                    </div>

                     <div className="text-sm sm:text-base text-gray-800">
                      <span className="font-semibold">Issuing Body:</span>{' '}
                      {finding.RelevantStandard.issuing_body}
                    </div>

                     <div className="text-sm sm:text-base text-gray-800">
                      <span className="font-semibold">Version:</span>{' '}
                      {finding.RelevantStandard.version}
                    </div>


                  </div>
                )}
              </CardContent>
            </Card>
          )}






           {/* Business Audit Specific Information */}
            {finding.BusinessComplianceGap && (
              <div className="border border-gray-300 rounded-lg p-4 space-y-2">
                <div className="text-lg text-gray-500 underline">Business Compliance Gap</div>

                <div className="text-sm sm:text-base text-gray-800">
                  <span className="font-semibold">Gap Name:</span>{' '}
                  {finding.BusinessComplianceGap.gap_name}
                </div>

                {finding.BusinessComplianceGap.gap_description && (
                  <div className="text-sm sm:text-base text-gray-800">
                    <span className="font-semibold">Gap Description:</span>{' '}
                    {finding.BusinessComplianceGap.gap_description}
                  </div>
                )}

                {finding.BusinessComplianceGap.regulatory_impact && (
                  <div className="text-sm sm:text-base text-gray-800">
                    <span className="font-semibold">Regulatory Impact:</span>{' '}
                    {finding.BusinessComplianceGap.regulatory_impact}
                  </div>
                )}
              </div>
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
              Are you sure you want to delete this audit finding? This action cannot be undone.
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

      {/* File Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              File Preview: {previewFile?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {previewFile && (
              <div className="w-full h-full min-h-[500px]">
                {previewFile.type === 'application/pdf' ? (
                  <iframe
                    src={previewFile.url}
                    className="w-full h-full min-h-[500px] border-0"
                    title={`Preview of ${previewFile.name}`}
                  />
                ) : previewFile.type.startsWith('image/') ? (
                  <div className="flex items-center justify-center p-4">
                    <img
                      src={previewFile.url}
                      alt={previewFile.name}
                      className="max-w-full max-h-full object-contain"
                      style={{ maxHeight: '70vh' }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <FileIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Preview not available for this file type</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Click download to view the file
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closePreview}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
            {previewFile && (
              <Button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = previewFile.url;
                  link.download = previewFile.name;
                  link.click();
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Branch Assignment Modal */}
      {finding && (
        <BranchAssignmentModal
          isOpen={branchAssignmentModalOpen}
          onClose={() => setBranchAssignmentModalOpen(false)}
          findingId={finding.id}
          findingTitle={finding.title}
          onAssignmentSuccess={() => {
            fetchFinding();
            setBranchAssignmentModalOpen(false);
          }}
        />
      )}

      {/* User Assignment Modal */}
      {finding && finding.assignedBranch && (
        <UserAssignmentModal
          isOpen={userAssignmentModalOpen}
          onClose={() => setUserAssignmentModalOpen(false)}
          findingId={finding.id}
          findingTitle={finding.title}
          branchId={finding.assignedBranch.id}
          branchName={finding.assignedBranch.branch_name}
          onAssignmentSuccess={() => {
            fetchFinding();
            setUserAssignmentModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
