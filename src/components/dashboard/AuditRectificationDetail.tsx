import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  ArrowLeft,
  FileCheck,
  FileText,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Clock,
  Upload,
  Download,
  Edit,
  Save,
  X,
  History,
  ChevronDown,
  ChevronRight,
  Loader2,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { AuditFinding, RECTIFICATION_STATUSES } from '@/types/auditFinding';
import { User as UserType } from '@/types/user';

// Helper function to check if file type is previewable image
const isPreviewableImage = (fileType: string): boolean => {
  return fileType.startsWith('image/') && ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(fileType.toLowerCase());
};

// Helper function to check if file type is previewable PDF
const isPreviewablePDF = (fileType: string): boolean => {
  return fileType.toLowerCase() === 'application/pdf';
};

// Helper function to get file type icon
const getFileTypeIcon = (fileType: string) => {
  if (isPreviewableImage(fileType)) {
    return <Eye className="h-4 w-4" />;
  } else if (isPreviewablePDF(fileType)) {
    return <FileText className="h-4 w-4" />;
  } else {
    return <Download className="h-4 w-4" />;
  }
};

// RectificationFilePreview component
interface RectificationFilePreviewProps {
  evidence: {
    evidence_id: string;
    rectification_evidence_url: string;
    rectification_file_name: string;
    rectification_file_type: string;
    created_at: string;
  };
}

const RectificationFilePreview: React.FC<RectificationFilePreviewProps> = ({ evidence }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const fileName = evidence.rectification_file_name;
  const fileType = evidence.rectification_file_type;
  const fileUrl = evidence.rectification_evidence_url ?
    `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/${evidence.rectification_evidence_url}` : null;

  const canPreview = isPreviewableImage(fileType) || isPreviewablePDF(fileType);

  // Format date helper for this component
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Enhanced file information display
  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || 'FILE';
  };

  const getFileTypeDisplay = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'application/pdf': 'PDF Document',
      'image/jpeg': 'JPEG Image',
      'image/jpg': 'JPG Image',
      'image/png': 'PNG Image',
      'application/msword': 'Word Document',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
      'text/plain': 'Text File',
      'application/vnd.ms-excel': 'Excel Spreadsheet',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet'
    };
    return typeMap[type] || type;
  };

  if (!canPreview) {
    return (
      <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {getFileTypeIcon(fileType)}
            <span>{getFileTypeDisplay(fileType)}</span>
            <span className="px-2 py-1 bg-gray-200 rounded text-xs">
              {getFileExtension(fileName)}
            </span>
          </div>
          <span className="text-xs text-gray-500">Preview not available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPreviewOpen(true)}
        className="w-full justify-start hover:bg-blue-50 hover:border-blue-200"
      >
        <Eye className="h-4 w-4 mr-2" />
        Preview {getFileTypeDisplay(fileType)}
        <span className="ml-auto text-xs text-gray-500">
          {getFileExtension(fileName)}
        </span>
      </Button>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getFileTypeIcon(fileType)}
              {fileName}
            </DialogTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
              <span className="px-2 py-1 bg-gray-100 rounded">
                {getFileTypeDisplay(fileType)}
              </span>
              <span>•</span>
              <span>Uploaded {formatDate(evidence.created_at)}</span>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            {isPreviewableImage(fileType) && fileUrl && (
              <div className="flex justify-center">
                {imageLoading && (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                )}
                <img
                  src={fileUrl}
                  alt={fileName}
                  className={`max-w-full max-h-[70vh] object-contain ${imageLoading ? 'hidden' : ''}`}
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                  }}
                />
                {imageError && (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                      <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
                      <p>Failed to load image</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isPreviewablePDF(fileType) && fileUrl && (
              <div className="w-full h-[70vh]">
                <iframe
                  src={fileUrl}
                  className="w-full h-full border-0"
                  title={fileName}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface AuditRectificationDetailProps {
  finding: AuditFinding;
  currentUser: UserType;
  onBack?: () => void;
  onRectificationUpdate?: () => void;
}

interface RectificationData {
  rectification_id: string;
  finding_id: string;
  submitted_by_id: string;
  rectification_text: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Amended';
  reason?: string;
  approved_by_id?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  submittedBy?: {
    id: string;
    username: string;
    email: string;
    role: string;
    department: string;
  };
  approvedBy?: {
    id: string;
    username: string;
    email: string;
    role: string;
    department: string;
  };
  AuditRectificationEvidences?: Array<{
    evidence_id: string;
    rectification_evidence_url: string;
    rectification_file_name: string;
    rectification_file_type: string;
    created_at: string;
  }>;
  AuditRectificationAmendmentHistories?: Array<{
    amendment_id: string;
    rectification_id: string;
    amend_by_id: string;
    rectification: string;
    status: string;
    rejection_reason?: string;
    amended_at: string;
    amendedBy?: {
      id: string;
      username: string;
      email: string;
      role: string;
      department: string;
    };
  }>;
}

export const AuditRectificationDetail: React.FC<AuditRectificationDetailProps> = ({
  finding,
  currentUser,
  onBack,
  onRectificationUpdate
}) => {
  const { api } = useAuth();
  const [rectification, setRectification] = useState<RectificationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expandedAmendments, setExpandedAmendments] = useState<{ [key: string]: boolean }>({});
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Amendment management state
  const [showAmendDialog, setShowAmendDialog] = useState(false);
  const [amendRectificationText, setAmendRectificationText] = useState('');
  const [amendEvidenceFiles, setAmendEvidenceFiles] = useState<File[]>([]);

  // Permissions removed - universal access for all users

  // Fetch rectification data - for now, we'll fetch the full finding data which should include rectification
  const fetchRectificationData = useCallback(async () => {
    if (!finding) return;

    setLoading(true);
    try {
      // Fetch the full finding data which should include rectification information
      const response = await api.get(`/api/audit-findings/${finding.id}`);
      const findingData = response.data;

      // Check if the finding has rectification data
      if (findingData.rectification_id && findingData.AuditFindingRectifications && findingData.AuditFindingRectifications.length > 0) {
        // Use the first (and should be only) rectification
        setRectification(findingData.AuditFindingRectifications[0]);
      } else if (findingData.rectification_id) {
        // If rectification_id exists but no data, try to fetch it separately
        // For now, we'll create a mock structure to show the create form
        setRectification(null);
      } else {
        setRectification(null);
      }
    } catch (error: any) {
      console.error('Error fetching rectification data:', error);
      toast.error('Failed to fetch rectification data');
    } finally {
      setLoading(false);
    }
  }, [api, finding]);

  useEffect(() => {
    if (finding) {
      fetchRectificationData();
    }
  }, [finding, fetchRectificationData]);

  // Handle create rectification
  const handleCreateRectification = async () => {
    if (!finding || !editText.trim()) {
      toast.error('Please provide rectification description');
      return;
    }

    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('rectification_description', editText);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      await api.post(`/api/audit-findings/${finding.id}/rectify`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Rectification submitted successfully');
      setIsEditing(false);
      setEditText('');
      setSelectedFile(null);
      fetchRectificationData();
      if (onRectificationUpdate) {
        onRectificationUpdate();
      }
    } catch (error: any) {
      console.error('Error creating rectification:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create rectification';
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle amend rectification
  const handleAmendRectification = async () => {
    if (!finding || !rectification || !editText.trim()) {
      toast.error('Please provide rectification description');
      return;
    }

    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('rectification_description', editText);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      await api.put(`/api/audit-findings/${finding.id}/rectify/amend`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Rectification amended successfully');
      setIsEditing(false);
      setEditText('');
      setSelectedFile(null);
      fetchRectificationData();
      if (onRectificationUpdate) {
        onRectificationUpdate();
      }
    } catch (error: any) {
      console.error('Error amending rectification:', error);
      const errorMessage = error.response?.data?.error || 'Failed to amend rectification';
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle approve rectification
  const handleApproveRectification = async () => {
    if (!finding || !rectification) return;

    setActionLoading(true);
    try {
      await api.put(`/api/audit-findings/${finding.id}/rectify/approve`);
      toast.success('Rectification approved successfully');
      fetchRectificationData();
      if (onRectificationUpdate) {
        onRectificationUpdate();
      }
    } catch (error: any) {
      console.error('Error approving rectification:', error);
      const errorMessage = error.response?.data?.error || 'Failed to approve rectification';
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reject rectification
  const handleRejectRectification = async () => {
    if (!finding || !rectification || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      await api.put(`/api/audit-findings/${finding.id}/rectify/reject`, {
        rejection_reason: rejectionReason
      });
      toast.success('Rectification rejected');
      setShowRejectDialog(false);
      setRejectionReason('');
      fetchRectificationData();
      if (onRectificationUpdate) {
        onRectificationUpdate();
      }
    } catch (error: any) {
      console.error('Error rejecting rectification:', error);
      const errorMessage = error.response?.data?.error || 'Failed to Audit Addendum rectification';
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Handle download evidence
  const handleDownloadEvidence = async (evidence: any) => {
    try {
      const evidenceId = evidence.evidence_id;
      if (!evidenceId) {
        toast.error('Evidence ID not found');
        return;
      }

      const response = await api.get(`/api/audit-findings/rectification-evidence/${evidenceId}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', evidence.rectification_file_name || 'evidence');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Evidence file downloaded successfully');
    } catch (error: any) {
      console.error('Error downloading evidence:', error);
      const errorMessage = error.response?.data?.error || 'Failed to download evidence file';
      toast.error(errorMessage);
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time helper
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
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

  // Check if user can create rectification
  const canCreateRectification = () => {
    if (!finding) return false;

    // Check if finding doesn't have rectification yet (removed role permission check)
    return !finding.rectification_id;
  };

  // Check if user can amend rectification - Universal access for all users
  const canAmendRectification = () => {
    if (!finding || !rectification) return false;

    // All users can amend rectifications if status allows it
    const allowedStatuses = ['Pending', 'Rejected'];
    return allowedStatuses.includes(rectification.status);
  };

  // Check if user can approve/reject rectification - Universal access with business logic only
  const canApproveRectification = () => {
    if (!finding || !rectification) return false;

    // All users can approve/reject if rectification is in appropriate status
    return (rectification.status === 'Pending' || rectification.status === 'Amended');
  };



  // Helper function to detect changes between amendments
  const detectChanges = (currentAmendment: any, previousAmendment: any) => {
    const changes: Array<{ field: string; before: string; after: string }> = [];

    if (currentAmendment.rectification !== previousAmendment.rectification) {
      changes.push({
        field: 'Rectification Description',
        before: previousAmendment.rectification || '',
        after: currentAmendment.rectification || ''
      });
    }

    if (currentAmendment.status !== previousAmendment.status) {
      changes.push({
        field: 'Status',
        before: previousAmendment.status || '',
        after: currentAmendment.status || ''
      });
    }

    return changes;
  };

  // Initialize amendment form with current data
  const initializeAmendmentForm = () => {
    if (rectification) {
      setAmendRectificationText(rectification.rectification_text || '');
      setShowAmendDialog(true);
    }
  };

  // Handle submit amendment
  const handleSubmitAmendment = async () => {
    if (!finding || !rectification) return;

    setActionLoading(true);
    try {
      const formData = new FormData();

      // Add basic fields
      formData.append('rectification_description', amendRectificationText);

      // Add evidence files
      amendEvidenceFiles.forEach((file) => {
        formData.append(`file`, file);
      });

      await api.put(`/api/audit-findings/${finding.id}/rectify/amend`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Rectification amended successfully');
      setShowAmendDialog(false);

      // Reset amendment form
      setAmendRectificationText('');
      setAmendEvidenceFiles([]);

      fetchRectificationData();
      if (onRectificationUpdate) {
        onRectificationUpdate();
      }
    } catch (error: any) {
      console.error('Error amending rectification:', error);
      const errorMessage = error.response?.data?.error || 'Failed to amend rectification';
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };



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
              <h1 className="text-2xl font-bold text-gray-900">Rectification Management</h1>
              <p className="text-gray-600">For: "{finding.title}"</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Loading rectification data...</span>
          </div>
        ) : (
          <>
            {/* Rectification Status and Actions */}
            {rectification ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Rectification Status
                    </span>
                    <div className="flex items-center gap-2">
                      {getRectificationStatusBadge(rectification.status)}
                      <div className="flex gap-2">
                        {canAmendRectification() && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={initializeAmendmentForm}
                            disabled={actionLoading}
                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Amend
                          </Button>
                        )}
                        {canApproveRectification() && (
                          <>
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
                              onClick={() => setShowRejectDialog(true)}
                              disabled={actionLoading}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Audit Addendum
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>
            ) : (
              canCreateRectification() && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5" />
                      Create Rectification
                    </CardTitle>
                    <CardDescription>
                      No rectification has been created for this finding yet. You can create one below.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => setIsEditing(true)}
                      disabled={actionLoading}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Create Rectification
                    </Button>
                  </CardContent>
                </Card>
              )
            )}

            {/* Rectification Details */}
            {rectification && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Rectification Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Submitted By</div>
                        <div className="font-medium">{rectification.submittedBy?.username || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{rectification.submittedBy?.role?.replace(/_/g, ' ')}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Submitted On</div>
                        <div className="font-medium">{formatDate(rectification.created_at)}</div>
                        <div className="text-xs text-gray-500">{formatTime(rectification.created_at)}</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-sm text-gray-500 mb-2">Rectification Description</div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-gray-700">{rectification.rectification_text}</p>
                    </div>
                  </div>

                  {rectification.reason && (
                    <>
                      <Separator />
                      <div>
                        <div className="text-sm text-red-600 mb-2">Audit Addendum</div>
                        <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                          <p className="text-red-700">{rectification.reason}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {rectification.approved_by_id && rectification.approvedBy && (
                    <>
                      <Separator />
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="text-sm text-gray-500">Approved By</div>
                          <div className="font-medium">{rectification.approvedBy.username}</div>
                          <div className="text-xs text-gray-500">
                            {rectification.approved_at && `on ${formatDate(rectification.approved_at)}`}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Amendment Action */}
                  {canAmendRectification() && (
                    <>
                      <Separator />
                      <div className="flex justify-end">
                        <Button
                          onClick={() => {
                            setIsEditing(true);
                            setEditText(rectification.rectification_text);
                          }}
                          disabled={actionLoading}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Amend Rectification
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Evidence Files - Complete File History */}
            {rectification && rectification.AuditRectificationEvidences && rectification.AuditRectificationEvidences.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Evidence Files History
                    <span className="text-sm font-normal text-gray-500">
                      ({rectification.AuditRectificationEvidences.length} file{rectification.AuditRectificationEvidences.length !== 1 ? 's' : ''})
                    </span>
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Complete history of all evidence files uploaded for this rectification
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Sort files by upload date (newest first) for chronological order */}
                    {rectification.AuditRectificationEvidences
                      .slice()
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map((evidence, index) => (
                      <div key={evidence.evidence_id} className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              <FileText className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {evidence.rectification_file_name}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <span className="px-2 py-1 bg-gray-100 rounded-full">
                                  {evidence.rectification_file_type}
                                </span>
                                <span>•</span>
                                <span>Uploaded {formatDate(evidence.created_at)}</span>
                                {index === 0 && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    Latest
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadEvidence(evidence)}
                              className="hover:bg-blue-50 hover:border-blue-200"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>

                        {/* Enhanced File Preview for Rectification Evidence */}
                        <RectificationFilePreview evidence={evidence} />
                      </div>
                    ))}
                  </div>

                  {/* File History Summary */}
                  <div className="mt-4 pt-4 border-t bg-gray-50 rounded-md p-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Total files:</span> {rectification.AuditRectificationEvidences.length}
                      </div>
                      <div>
                        <span className="font-medium">First uploaded:</span> {formatDate(
                          rectification.AuditRectificationEvidences
                            .slice()
                            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0]?.created_at
                        )}
                      </div>
                      <div>
                        <span className="font-medium">Latest upload:</span> {formatDate(
                          rectification.AuditRectificationEvidences
                            .slice()
                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.created_at
                        )}
                      </div>
                    </div>

                    {/* File type distribution */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(rectification.AuditRectificationEvidences.map(e => e.rectification_file_type)))
                          .map(fileType => {
                            const count = rectification.AuditRectificationEvidences.filter(e => e.rectification_file_type === fileType).length;
                            return (
                              <span key={fileType} className="px-2 py-1 bg-white border rounded-full text-xs">
                                {fileType.split('/')[1]?.toUpperCase() || fileType}: {count}
                              </span>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Amendment History - Chronological Order */}
            {rectification && rectification.AuditRectificationAmendmentHistories && rectification.AuditRectificationAmendmentHistories.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Amendment History
                    <span className="text-sm font-normal text-gray-500">
                      ({rectification.AuditRectificationAmendmentHistories.length} amendment{rectification.AuditRectificationAmendmentHistories.length !== 1 ? 's' : ''})
                    </span>
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Complete chronological history of all amendments and changes
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Sort amendments by amended_at date (newest first) for chronological order */}
                    {rectification.AuditRectificationAmendmentHistories
                      .slice()
                      .sort((a, b) => new Date(b.amended_at).getTime() - new Date(a.amended_at).getTime())
                      .map((amendment, index) => (
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
                              {expandedAmendments[amendment.amendment_id] ? (
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="font-medium text-gray-900">
                                  Amendment #{rectification.AuditRectificationAmendmentHistories.length - index}
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
                            <Badge className={amendment.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                            amendment.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'}>
                              {amendment.status}
                            </Badge>
                          </div>
                        </div>

                        {expandedAmendments[amendment.amendment_id] && (
                          <div className="border-t p-3 bg-gray-50">
                            <div className="space-y-3">
                              {/* Change Detection - Compare with previous amendment in chronological order */}
                              {(() => {
                                // Get the sorted array for proper chronological comparison
                                const sortedAmendments = rectification.AuditRectificationAmendmentHistories
                                  .slice()
                                  .sort((a, b) => new Date(b.amended_at).getTime() - new Date(a.amended_at).getTime());

                                const currentIndex = sortedAmendments.findIndex(a => a.amendment_id === amendment.amendment_id);
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

                              <div>
                                <div className="text-sm font-medium text-gray-700 mb-1">Rectification Description</div>
                                <div className="bg-white p-2 rounded border text-sm">
                                  {amendment.rectification}
                                </div>
                              </div>

                              {amendment.rejection_reason && (
                                <div>
                                  <div className="text-sm font-medium text-red-700 mb-1">Audit Addendum</div>
                                  <div className="bg-red-50 border border-red-200 p-2 rounded text-sm text-red-700">
                                    {amendment.rejection_reason}
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>Amended by: {amendment.amendedBy?.username || 'Unknown'}</span>
                                <span>Role: {amendment.amendedBy?.role?.replace(/_/g, ' ')}</span>
                                <span>Department: {amendment.amendedBy?.department}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Amendment History Summary */}
                  <div className="mt-4 pt-4 border-t bg-gray-50 rounded-md p-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Total amendments:</span> {rectification.AuditRectificationAmendmentHistories.length}
                      </div>
                      <div>
                        <span className="font-medium">First amendment:</span> {formatDate(
                          rectification.AuditRectificationAmendmentHistories
                            .slice()
                            .sort((a, b) => new Date(a.amended_at).getTime() - new Date(b.amended_at).getTime())[0]?.amended_at
                        )}
                      </div>
                      <div>
                        <span className="font-medium">Latest amendment:</span> {formatDate(
                          rectification.AuditRectificationAmendmentHistories
                            .slice()
                            .sort((a, b) => new Date(b.amended_at).getTime() - new Date(a.amended_at).getTime())[0]?.amended_at
                        )}
                      </div>
                    </div>

                    {/* Amendment status distribution */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(rectification.AuditRectificationAmendmentHistories.map(a => a.status)))
                          .map(status => {
                            const count = rectification.AuditRectificationAmendmentHistories.filter(a => a.status === status).length;
                            const statusColor = status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' :
                                              status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                              'bg-yellow-100 text-yellow-700 border-yellow-200';
                            return (
                              <span key={status} className={`px-2 py-1 border rounded-full text-xs ${statusColor}`}>
                                {status}: {count}
                              </span>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Editing Form Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                {rectification ? 'Amend Rectification' : 'Create Rectification'}
              </DialogTitle>
              <DialogDescription>
                {rectification ? 'Update the rectification description and provide additional evidence if needed.' : 'Provide a detailed description of the rectification actions taken.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="rectification-text">Rectification Description</Label>
                <Textarea
                  id="rectification-text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Describe the rectification actions taken to address this audit finding..."
                  rows={6}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="evidence-file">Evidence File (Optional)</Label>
                <Input
                  id="evidence-file"
                  type="file"
                  onChange={handleFileChange}
                  className="mt-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditText('');
                  setSelectedFile(null);
                }}
                disabled={actionLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={rectification ? handleAmendRectification : handleCreateRectification}
                disabled={actionLoading || !editText.trim()}
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {rectification ? 'Save Amendment' : 'Submit Rectification'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rejection Reason Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                Audit Addendum
              </DialogTitle>
              <DialogDescription>
                Please provide a reason for Audit Addendum this rectification. This will help the submitter understand what needs to be improved.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="rejection-reason">Audit Addendum Reason</Label>
                <Textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this rectification is being Audit Addendum and what improvements are needed..."
                  rows={4}
                  className="mt-1"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectionReason('');
                }}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectRectification}
                disabled={actionLoading || !rejectionReason.trim()}
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Audit Addendum
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Amendment Dialog */}
        <Dialog open={showAmendDialog} onOpenChange={setShowAmendDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-blue-600" />
                Amend Rectification
              </DialogTitle>
              <DialogDescription>
                Update the rectification details and add additional evidence if needed.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Rectification Text */}
              <div className="space-y-2">
                <Label htmlFor="amendRectificationText">Rectification Description</Label>
                <Textarea
                  id="amendRectificationText"
                  placeholder="Describe the rectification measures taken..."
                  value={amendRectificationText}
                  onChange={(e) => setAmendRectificationText(e.target.value)}
                  rows={6}
                  className="min-h-[120px]"
                />
              </div>

              {/* Evidence Files */}
              <div className="space-y-2">
                <Label htmlFor="amendEvidenceFiles">Additional Evidence Files (Optional)</Label>
                <Input
                  id="amendEvidenceFiles"
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setAmendEvidenceFiles(files);
                  }}
                  className="cursor-pointer"
                />
                {amendEvidenceFiles.length > 0 && (
                  <div className="text-sm text-gray-600">
                    Selected files: {amendEvidenceFiles.map(f => f.name).join(', ')}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAmendDialog(false);
                  setAmendRectificationText('');
                  setAmendEvidenceFiles([]);
                }}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitAmendment}
                disabled={actionLoading || !amendRectificationText.trim()}
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Submit Amendment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
