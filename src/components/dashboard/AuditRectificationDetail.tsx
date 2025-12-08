// import React, { useState, useEffect, useCallback } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { toast } from 'sonner';
// import {
//   ArrowLeft,
//   FileCheck,
//   FileText,
//   CheckCircle,
//   XCircle,
//   User,
//   Calendar,
//   Clock,
//   Upload,
//   Download,
//   Edit,
//   Save,
//   X,
//   History,
//   ChevronDown,
//   ChevronRight,
//   Loader2,
//   Eye,
//   AlertTriangle
// } from 'lucide-react';
// import { AuditFinding, RECTIFICATION_STATUSES } from '@/types/auditFinding';
// import { User as UserType } from '@/types/user';

// // Helper function to check if file type is previewable image
// const isPreviewableImage = (fileType: string): boolean => {
//   return fileType.startsWith('image/') && ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(fileType.toLowerCase());
// };

// // Helper function to check if file type is previewable PDF
// const isPreviewablePDF = (fileType: string): boolean => {
//   return fileType.toLowerCase() === 'application/pdf';
// };

// // Helper function to get file type icon
// const getFileTypeIcon = (fileType: string) => {
//   if (isPreviewableImage(fileType)) {
//     return <Eye className="h-4 w-4" />;
//   } else if (isPreviewablePDF(fileType)) {
//     return <FileText className="h-4 w-4" />;
//   } else {
//     return <Download className="h-4 w-4" />;
//   }
// };

// // RectificationFilePreview component
// interface RectificationFilePreviewProps {
//   evidence: {
//     evidence_id: string;
//     rectification_evidence_url: string;
//     rectification_file_name: string;
//     rectification_file_type: string;
//     created_at: string;
//   };
// }

// const RectificationFilePreview: React.FC<RectificationFilePreviewProps> = ({ evidence }) => {
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [imageLoading, setImageLoading] = useState(true);
//   const [imageError, setImageError] = useState(false);

//   const fileName = evidence.rectification_file_name;
//   const fileType = evidence.rectification_file_type;
//   const fileUrl = evidence.rectification_evidence_url ?
//     `${'https://aps2.zemenbank.com/ZAMS/api' || 'https://aps2.zemenbank.com/ZAMS/api'}/${evidence.rectification_evidence_url}` : null;

//   const canPreview = isPreviewableImage(fileType) || isPreviewablePDF(fileType);

//   // Format date helper for this component
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   // Enhanced file information display
//   const getFileExtension = (filename: string) => {
//     return filename.split('.').pop()?.toUpperCase() || 'FILE';
//   };

//   const getFileTypeDisplay = (type: string) => {
//     const typeMap: { [key: string]: string } = {
//       'application/pdf': 'PDF Document',
//       'image/jpeg': 'JPEG Image',
//       'image/jpg': 'JPG Image',
//       'image/png': 'PNG Image',
//       'application/msword': 'Word Document',
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
//       'text/plain': 'Text File',
//       'application/vnd.ms-excel': 'Excel Spreadsheet',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet'
//     };
//     return typeMap[type] || type;
//   };

//   if (!canPreview) {
//     return (
//       <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             {getFileTypeIcon(fileType)}
//             <span>{getFileTypeDisplay(fileType)}</span>
//             <span className="px-2 py-1 bg-gray-200 rounded text-xs">
//               {getFileExtension(fileName)}
//             </span>
//           </div>
//           <span className="text-xs text-gray-500">Preview not available</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-2">
//       <Button
//         variant="outline"
//         size="sm"
//         onClick={() => setPreviewOpen(true)}
//         className="w-full justify-start hover:bg-blue-50 hover:border-blue-200"
//       >
//         <Eye className="h-4 w-4 mr-2" />
//         Preview {getFileTypeDisplay(fileType)}
//         <span className="ml-auto text-xs text-gray-500">
//           {getFileExtension(fileName)}
//         </span>
//       </Button>

//       <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
//         <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               {getFileTypeIcon(fileType)}
//               {fileName}
//             </DialogTitle>
//             <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
//               <span className="px-2 py-1 bg-gray-100 rounded">
//                 {getFileTypeDisplay(fileType)}
//               </span>
//               <span>•</span>
//               <span>Uploaded {formatDate(evidence.created_at)}</span>
//             </div>
//           </DialogHeader>

//           <div className="flex-1 overflow-auto">
//             {isPreviewableImage(fileType) && fileUrl && (
//               <div className="flex justify-center">
//                 {imageLoading && (
//                   <div className="flex items-center justify-center h-64">
//                     <Loader2 className="h-8 w-8 animate-spin" />
//                   </div>
//                 )}
//                 <img
//                   src={fileUrl}
//                   alt={fileName}
//                   className={`max-w-full max-h-[70vh] object-contain ${imageLoading ? 'hidden' : ''}`}
//                   onLoad={() => setImageLoading(false)}
//                   onError={() => {
//                     setImageError(true);
//                     setImageLoading(false);
//                   }}
//                 />
//                 {imageError && (
//                   <div className="flex items-center justify-center h-64 text-gray-500">
//                     <div className="text-center">
//                       <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
//                       <p>Failed to load image</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {isPreviewablePDF(fileType) && fileUrl && (
//               <div className="w-full h-[70vh]">
//                 <iframe
//                   src={fileUrl}
//                   className="w-full h-full border-0"
//                   title={fileName}
//                 />
//               </div>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// interface AuditRectificationDetailProps {
//   finding: AuditFinding;
//   currentUser: UserType;
//   onBack?: () => void;
//   onRectificationUpdate?: () => void;
// }

// interface RectificationData {
//   rectification_id: string;
//   finding_id: string;
//   submitted_by_id: string;
//   rectification_text: string;
//   status: 'Pending' | 'Approved' | 'Rejected' | 'Amended';
//   reason?: string;
//   approved_by_id?: string;
//   approved_at?: string;
//   created_at: string;
//   updated_at: string;
//   submittedBy?: {
//     id: string;
//     username: string;
//     email: string;
//     role: string;
//     department: string;
//   };
//   approvedBy?: {
//     id: string;
//     username: string;
//     email: string;
//     role: string;
//     department: string;
//   };
//   AuditRectificationEvidences?: Array<{
//     evidence_id: string;
//     rectification_evidence_url: string;
//     rectification_file_name: string;
//     rectification_file_type: string;
//     created_at: string;
//   }>;
//   AuditRectificationAmendmentHistories?: Array<{
//     amendment_id: string;
//     rectification_id: string;
//     amend_by_id: string;
//     rectification: string;
//     status: string;
//     rejection_reason?: string;
//     amended_at: string;
//     amendedBy?: {
//       id: string;
//       username: string;
//       email: string;
//       role: string;
//       department: string;
//     };
//   }>;
// }

// export const AuditRectificationDetail: React.FC<AuditRectificationDetailProps> = ({
//   finding,
//   currentUser,
//   onBack,
//   onRectificationUpdate
// }) => {
//   const { api } = useAuth();
//   const [rectification, setRectification] = useState<RectificationData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editText, setEditText] = useState('');
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [expandedAmendments, setExpandedAmendments] = useState<{ [key: string]: boolean }>({});
//   const [showRejectDialog, setShowRejectDialog] = useState(false);
//   const [rejectionReason, setRejectionReason] = useState('');

//   // Amendment management state
//   const [showAmendDialog, setShowAmendDialog] = useState(false);
//   const [amendRectificationText, setAmendRectificationText] = useState('');
//   const [amendEvidenceFiles, setAmendEvidenceFiles] = useState<File[]>([]);

//   // Permissions removed - universal access for all users

//   // Fetch rectification data - for now, we'll fetch the full finding data which should include rectification
//   const fetchRectificationData = useCallback(async () => {
//     if (!finding) return;

//     setLoading(true);
//     try {
//       // Fetch the full finding data which should include rectification information
//       const response = await api.get(`ZAMS/api/audit-findings/${finding.id}`);
//       const findingData = response.data;

//       // Check if the finding has rectification data
//       if (findingData.rectification_id && findingData.AuditFindingRectifications && findingData.AuditFindingRectifications.length > 0) {
//         // Use the first (and should be only) rectification
//         setRectification(findingData.AuditFindingRectifications[0]);
//       } else if (findingData.rectification_id) {
//         // If rectification_id exists but no data, try to fetch it separately
//         // For now, we'll create a mock structure to show the create form
//         setRectification(null);
//       } else {
//         setRectification(null);
//       }
//     } catch (error: any) {
//       console.error('Error fetching rectification data:', error);
//       toast.error('Failed to fetch rectification data');
//     } finally {
//       setLoading(false);
//     }
//   }, [api, finding]);

//   useEffect(() => {
//     if (finding) {
//       fetchRectificationData();
//     }
//   }, [finding, fetchRectificationData]);

//   // Handle create rectification
//   const handleCreateRectification = async () => {
//     if (!finding || !editText.trim()) {
//       toast.error('Please provide rectification description');
//       return;
//     }

//     setActionLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('rectification_description', editText);
//       if (selectedFile) {
//         formData.append('file', selectedFile);
//       }

//       await api.post(`/ZAMS/api/audit-findings/${finding.id}/rectify`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       toast.success('Rectification submitted successfully');
//       setIsEditing(false);
//       setEditText('');
//       setSelectedFile(null);
//       fetchRectificationData();
//       if (onRectificationUpdate) {
//         onRectificationUpdate();
//       }
//     } catch (error: any) {
//       console.error('Error creating rectification:', error);
//       const errorMessage = error.response?.data?.error || 'Failed to create rectification';
//       toast.error(errorMessage);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Handle amend rectification
//   const handleAmendRectification = async () => {
//     if (!finding || !rectification || !editText.trim()) {
//       toast.error('Please provide rectification description');
//       return;
//     }

//     setActionLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('rectification_description', editText);
//       if (selectedFile) {
//         formData.append('file', selectedFile);
//       }

//       await api.put(`/ZAMS/api/audit-findings/${finding.id}/rectify/amend`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       toast.success('Rectification amended successfully');
//       setIsEditing(false);
//       setEditText('');
//       setSelectedFile(null);
//       fetchRectificationData();
//       if (onRectificationUpdate) {
//         onRectificationUpdate();
//       }
//     } catch (error: any) {
//       console.error('Error amending rectification:', error);
//       const errorMessage = error.response?.data?.error || 'Failed to amend rectification';
//       toast.error(errorMessage);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Handle approve rectification
//   const handleApproveRectification = async () => {
//     if (!finding || !rectification) return;

//     setActionLoading(true);
//     try {
//       await api.put(`/ZAMS/api/audit-findings/${finding.id}/rectify/approve`);
//       toast.success('Rectification approved successfully');
//       fetchRectificationData();
//       if (onRectificationUpdate) {
//         onRectificationUpdate();
//       }
//     } catch (error: any) {
//       console.error('Error approving rectification:', error);
//       const errorMessage = error.response?.data?.error || 'Failed to approve rectification';
//       toast.error(errorMessage);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Handle reject rectification
//   const handleRejectRectification = async () => {
//     if (!finding || !rectification || !rejectionReason.trim()) {
//       toast.error('Please provide a rejection reason');
//       return;
//     }

//     setActionLoading(true);
//     try {
//       await api.put(`/ZAMS/api/audit-findings/${finding.id}/rectify/reject`, {
//         rejection_reason: rejectionReason
//       });
//       toast.success('Rectification rejected');
//       setShowRejectDialog(false);
//       setRejectionReason('');
//       fetchRectificationData();
//       if (onRectificationUpdate) {
//         onRectificationUpdate();
//       }
//     } catch (error: any) {
//       console.error('Error rejecting rectification:', error);
//       const errorMessage = error.response?.data?.error || 'Failed to Audit Addendum rectification';
//       toast.error(errorMessage);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Handle file change
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//     }
//   };

//   // Handle download evidence
//   const handleDownloadEvidence = async (evidence: any) => {
//     try {
//       const evidenceId = evidence.evidence_id;
//       if (!evidenceId) {
//         toast.error('Evidence ID not found');
//         return;
//       }

//       const response = await api.get(`ZAMS/api/audit-findings/rectification-evidence/${evidenceId}/download`, {
//         responseType: 'blob',
//       });

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', evidence.rectification_file_name || 'evidence');
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);

//       toast.success('Evidence file downloaded successfully');
//     } catch (error: any) {
//       console.error('Error downloading evidence:', error);
//       const errorMessage = error.response?.data?.error || 'Failed to download evidence file';
//       toast.error(errorMessage);
//     }
//   };

//   // Format date helper
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   // Format time helper
//   const formatTime = (dateString: string) => {
//     return new Date(dateString).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Get rectification status badge
//   const getRectificationStatusBadge = (status: string) => {
//     const statusConfig = RECTIFICATION_STATUSES.find(s => s.value === status);
//     return (
//       <Badge className={statusConfig?.color || 'bg-gray-100 text-gray-800'}>
//         {statusConfig?.label || status}
//       </Badge>
//     );
//   };

//   // Check if user can create rectification
//   const canCreateRectification = () => {
//     if (!finding) return false;

//     // Check if finding doesn't have rectification yet (removed role permission check)
//     return !finding.rectification_id;
//   };

//   // Check if user can amend rectification - Universal access for all users
//   const canAmendRectification = () => {
//     if (!finding || !rectification) return false;

//     // All users can amend rectifications if status allows it
//     const allowedStatuses = ['Pending', 'Rejected'];
//     return allowedStatuses.includes(rectification.status);
//   };

//   // Check if user can approve/reject rectification - Universal access with business logic only
//   const canApproveRectification = () => {
//     if (!finding || !rectification) return false;

//     // All users can approve/reject if rectification is in appropriate status
//     return (rectification.status === 'Pending' || rectification.status === 'Amended');
//   };



//   // Helper function to detect changes between amendments
//   const detectChanges = (currentAmendment: any, previousAmendment: any) => {
//     const changes: Array<{ field: string; before: string; after: string }> = [];

//     if (currentAmendment.rectification !== previousAmendment.rectification) {
//       changes.push({
//         field: 'Rectification Description',
//         before: previousAmendment.rectification || '',
//         after: currentAmendment.rectification || ''
//       });
//     }

//     if (currentAmendment.status !== previousAmendment.status) {
//       changes.push({
//         field: 'Status',
//         before: previousAmendment.status || '',
//         after: currentAmendment.status || ''
//       });
//     }

//     return changes;
//   };

//   // Initialize amendment form with current data
//   const initializeAmendmentForm = () => {
//     if (rectification) {
//       setAmendRectificationText(rectification.rectification_text || '');
//       setShowAmendDialog(true);
//     }
//   };

//   // Handle submit amendment
//   const handleSubmitAmendment = async () => {
//     if (!finding || !rectification) return;

//     setActionLoading(true);
//     try {
//       const formData = new FormData();

//       // Add basic fields
//       formData.append('rectification_description', amendRectificationText);

//       // Add evidence files
//       amendEvidenceFiles.forEach((file) => {
//         formData.append(`file`, file);
//       });

//       await api.put(`/ZAMS/api/audit-findings/${finding.id}/rectify/amend`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       toast.success('Rectification amended successfully');
//       setShowAmendDialog(false);

//       // Reset amendment form
//       setAmendRectificationText('');
//       setAmendEvidenceFiles([]);

//       fetchRectificationData();
//       if (onRectificationUpdate) {
//         onRectificationUpdate();
//       }
//     } catch (error: any) {
//       console.error('Error amending rectification:', error);
//       const errorMessage = error.response?.data?.error || 'Failed to amend rectification';
//       toast.error(errorMessage);
//     } finally {
//       setActionLoading(false);
//     }
//   };



//   return (
//     <div className="container mx-auto py-6">
//       {/* Header */}
//       <div className="mb-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             {onBack && (
//               <Button variant="outline" onClick={onBack}>
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//             )}
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Rectification Management</h1>
//               <p className="text-gray-600">For: "{finding.title}"</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-6">
//         {loading ? (
//           <div className="flex items-center justify-center py-8">
//             <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//             <span className="ml-2">Loading rectification data...</span>
//           </div>
//         ) : (
//           <>
//             {/* Rectification Status and Actions */}
//             {rectification ? (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center justify-between">
//                     <span className="flex items-center gap-2">
//                       <FileText className="h-5 w-5" />
//                       Rectification Status
//                     </span>
//                     <div className="flex items-center gap-2">
//                       {getRectificationStatusBadge(rectification.status)}
//                       <div className="flex gap-2">
//                         {canAmendRectification() && (
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={initializeAmendmentForm}
//                             disabled={actionLoading}
//                             className="border-blue-300 text-blue-700 hover:bg-blue-50"
//                           >
//                             <Edit className="h-4 w-4 mr-2" />
//                             Amend
//                           </Button>
//                         )}
//                         {canApproveRectification() && (
//                           <>
//                             <Button
//                               size="sm"
//                               onClick={handleApproveRectification}
//                               disabled={actionLoading}
//                             >
//                               <CheckCircle className="h-4 w-4 mr-2" />
//                               Approve
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="destructive"
//                               onClick={() => setShowRejectDialog(true)}
//                               disabled={actionLoading}
//                             >
//                               <XCircle className="h-4 w-4 mr-2" />
//                               Audit Addendum
//                             </Button>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </CardTitle>
//                 </CardHeader>
//               </Card>
//             ) : (
//               canCreateRectification() && (
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <FileCheck className="h-5 w-5" />
//                       Create Rectification
//                     </CardTitle>
//                     <CardDescription>
//                       No rectification has been created for this finding yet. You can create one below.
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <Button
//                       onClick={() => setIsEditing(true)}
//                       disabled={actionLoading}
//                     >
//                       <FileText className="h-4 w-4 mr-2" />
//                       Create Rectification
//                     </Button>
//                   </CardContent>
//                 </Card>
//               )
//             )}

//             {/* Rectification Details */}
//             {rectification && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <FileText className="h-5 w-5" />
//                     Rectification Details
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="flex items-center gap-3">
//                       <User className="h-5 w-5 text-gray-400" />
//                       <div>
//                         <div className="text-sm text-gray-500">Submitted By</div>
//                         <div className="font-medium">{rectification.submittedBy?.username || 'Unknown'}</div>
//                         <div className="text-xs text-gray-500">{rectification.submittedBy?.role?.replace(/_/g, ' ')}</div>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <Calendar className="h-5 w-5 text-gray-400" />
//                       <div>
//                         <div className="text-sm text-gray-500">Submitted On</div>
//                         <div className="font-medium">{formatDate(rectification.created_at)}</div>
//                         <div className="text-xs text-gray-500">{formatTime(rectification.created_at)}</div>
//                       </div>
//                     </div>
//                   </div>

//                   <Separator />

//                   <div>
//                     <div className="text-sm text-gray-500 mb-2">Rectification Description</div>
//                     <div className="bg-gray-50 p-3 rounded-md">
//                       <p className="text-gray-700">{rectification.rectification_text}</p>
//                     </div>
//                   </div>

//                   {rectification.reason && (
//                     <>
//                       <Separator />
//                       <div>
//                         <div className="text-sm text-red-600 mb-2">Audit Addendum</div>
//                         <div className="bg-red-50 border border-red-200 p-3 rounded-md">
//                           <p className="text-red-700">{rectification.reason}</p>
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   {rectification.approved_by_id && rectification.approvedBy && (
//                     <>
//                       <Separator />
//                       <div className="flex items-center gap-3">
//                         <CheckCircle className="h-5 w-5 text-green-500" />
//                         <div>
//                           <div className="text-sm text-gray-500">Approved By</div>
//                           <div className="font-medium">{rectification.approvedBy.username}</div>
//                           <div className="text-xs text-gray-500">
//                             {rectification.approved_at && `on ${formatDate(rectification.approved_at)}`}
//                           </div>
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   {/* Amendment Action */}
//                   {canAmendRectification() && (
//                     <>
//                       <Separator />
//                       <div className="flex justify-end">
//                         <Button
//                           onClick={() => {
//                             setIsEditing(true);
//                             setEditText(rectification.rectification_text);
//                           }}
//                           disabled={actionLoading}
//                         >
//                           <Edit className="h-4 w-4 mr-2" />
//                           Amend Rectification
//                         </Button>
//                       </div>
//                     </>
//                   )}
//                 </CardContent>
//               </Card>
//             )}

//             {/* Evidence Files - Complete File History */}
//             {rectification && rectification.AuditRectificationEvidences && rectification.AuditRectificationEvidences.length > 0 && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Upload className="h-5 w-5" />
//                     Evidence Files History
//                     <span className="text-sm font-normal text-gray-500">
//                       ({rectification.AuditRectificationEvidences.length} file{rectification.AuditRectificationEvidences.length !== 1 ? 's' : ''})
//                     </span>
//                   </CardTitle>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Complete history of all evidence files uploaded for this rectification
//                   </p>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {/* Sort files by upload date (newest first) for chronological order */}
//                     {rectification.AuditRectificationEvidences
//                       .slice()
//                       .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
//                       .map((evidence, index) => (
//                       <div key={evidence.evidence_id} className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
//                         <div className="flex items-center justify-between mb-3">
//                           <div className="flex items-center gap-3">
//                             <div className="flex-shrink-0">
//                               <FileText className="h-5 w-5 text-gray-400" />
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <div className="font-medium text-gray-900 truncate">
//                                 {evidence.rectification_file_name}
//                               </div>
//                               <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
//                                 <span className="px-2 py-1 bg-gray-100 rounded-full">
//                                   {evidence.rectification_file_type}
//                                 </span>
//                                 <span>•</span>
//                                 <span>Uploaded {formatDate(evidence.created_at)}</span>
//                                 {index === 0 && (
//                                   <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
//                                     Latest
//                                   </span>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                           <div className="flex gap-2 flex-shrink-0">
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => handleDownloadEvidence(evidence)}
//                               className="hover:bg-blue-50 hover:border-blue-200"
//                             >
//                               <Download className="h-4 w-4 mr-1" />
//                               Download
//                             </Button>
//                           </div>
//                         </div>

//                         {/* Enhanced File Preview for Rectification Evidence */}
//                         <RectificationFilePreview evidence={evidence} />
//                       </div>
//                     ))}
//                   </div>

//                   {/* File History Summary */}
//                   <div className="mt-4 pt-4 border-t bg-gray-50 rounded-md p-3">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
//                       <div>
//                         <span className="font-medium">Total files:</span> {rectification.AuditRectificationEvidences.length}
//                       </div>
//                       <div>
//                         <span className="font-medium">First uploaded:</span> {formatDate(
//                           rectification.AuditRectificationEvidences
//                             .slice()
//                             .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0]?.created_at
//                         )}
//                       </div>
//                       <div>
//                         <span className="font-medium">Latest upload:</span> {formatDate(
//                           rectification.AuditRectificationEvidences
//                             .slice()
//                             .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.created_at
//                         )}
//                       </div>
//                     </div>

//                     {/* File type distribution */}
//                     <div className="mt-3 pt-3 border-t border-gray-200">
//                       <div className="flex flex-wrap gap-2">
//                         {Array.from(new Set(rectification.AuditRectificationEvidences.map(e => e.rectification_file_type)))
//                           .map(fileType => {
//                             const count = rectification.AuditRectificationEvidences.filter(e => e.rectification_file_type === fileType).length;
//                             return (
//                               <span key={fileType} className="px-2 py-1 bg-white border rounded-full text-xs">
//                                 {fileType.split('/')[1]?.toUpperCase() || fileType}: {count}
//                               </span>
//                             );
//                           })}
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Amendment History - Chronological Order */}
//             {rectification && rectification.AuditRectificationAmendmentHistories && rectification.AuditRectificationAmendmentHistories.length > 0 && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <History className="h-5 w-5" />
//                     Amendment History
//                     <span className="text-sm font-normal text-gray-500">
//                       ({rectification.AuditRectificationAmendmentHistories.length} amendment{rectification.AuditRectificationAmendmentHistories.length !== 1 ? 's' : ''})
//                     </span>
//                   </CardTitle>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Complete chronological history of all amendments and changes
//                   </p>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {/* Sort amendments by amended_at date (newest first) for chronological order */}
//                     {rectification.AuditRectificationAmendmentHistories
//                       .slice()
//                       .sort((a, b) => new Date(b.amended_at).getTime() - new Date(a.amended_at).getTime())
//                       .map((amendment, index) => (
//                       <div key={amendment.amendment_id} className="border rounded-md hover:bg-gray-50 transition-colors">
//                         <div
//                           className="flex items-center justify-between p-3 cursor-pointer"
//                           onClick={() => setExpandedAmendments(prev => ({
//                             ...prev,
//                             [amendment.amendment_id]: !prev[amendment.amendment_id]
//                           }))}
//                         >
//                           <div className="flex items-center gap-3">
//                             <div className="flex-shrink-0">
//                               {expandedAmendments[amendment.amendment_id] ? (
//                                 <ChevronDown className="h-4 w-4 text-gray-400" />
//                               ) : (
//                                 <ChevronRight className="h-4 w-4 text-gray-400" />
//                               )}
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center gap-2">
//                                 <div className="font-medium text-gray-900">
//                                   Amendment #{rectification.AuditRectificationAmendmentHistories.length - index}
//                                 </div>
//                                 {index === 0 && (
//                                   <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
//                                     Latest
//                                   </span>
//                                 )}
//                               </div>
//                               <div className="text-sm text-gray-500 mt-1">
//                                 by {amendment.amendedBy?.username || 'Unknown'} • {formatDate(amendment.amended_at)} at {formatTime(amendment.amended_at)}
//                               </div>
//                             </div>
//                           </div>
//                           <div className="flex-shrink-0">
//                             <Badge className={amendment.status === 'Approved' ? 'bg-green-100 text-green-800' :
//                                             amendment.status === 'Rejected' ? 'bg-red-100 text-red-800' :
//                                             'bg-yellow-100 text-yellow-800'}>
//                               {amendment.status}
//                             </Badge>
//                           </div>
//                         </div>

//                         {expandedAmendments[amendment.amendment_id] && (
//                           <div className="border-t p-3 bg-gray-50">
//                             <div className="space-y-3">
//                               {/* Change Detection - Compare with previous amendment in chronological order */}
//                               {(() => {
//                                 // Get the sorted array for proper chronological comparison
//                                 const sortedAmendments = rectification.AuditRectificationAmendmentHistories
//                                   .slice()
//                                   .sort((a, b) => new Date(b.amended_at).getTime() - new Date(a.amended_at).getTime());

//                                 const currentIndex = sortedAmendments.findIndex(a => a.amendment_id === amendment.amendment_id);
//                                 const previousAmendment = sortedAmendments[currentIndex + 1];

//                                 if (!previousAmendment) return null;

//                                 const changes = detectChanges(amendment, previousAmendment);

//                                 if (changes.length === 0) return null;

//                                 return (
//                                   <div className="mb-4">
//                                     <div className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
//                                       <AlertTriangle className="h-4 w-4" />
//                                       Changes Made from Previous Amendment
//                                     </div>

//                                     {changes.map((change, changeIndex) => (
//                                       <div key={changeIndex} className="bg-blue-50 border border-blue-200 rounded p-3 mb-2">
//                                         <div className="text-sm font-medium text-blue-800 mb-2">{change.field}</div>
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                           <div>
//                                             <div className="text-xs font-medium text-red-600 mb-1">After:</div>
//                                             <div className="bg-red-50 border border-red-200 p-2 rounded text-sm">
//                                               {change.after || 'Not specified'}
//                                             </div>
//                                           </div>
//                                           <div>
//                                             <div className="text-xs font-medium text-gray-600 mb-1">Before:</div>
//                                             <div className="bg-gray-50 border border-gray-200 p-2 rounded text-sm">
//                                               {change.before || 'Not specified'}
//                                             </div>
//                                           </div>
//                                         </div>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 );
//                               })()}

//                               <div>
//                                 <div className="text-sm font-medium text-gray-700 mb-1">Rectification Description</div>
//                                 <div className="bg-white p-2 rounded border text-sm">
//                                   {amendment.rectification}
//                                 </div>
//                               </div>

//                               {amendment.rejection_reason && (
//                                 <div>
//                                   <div className="text-sm font-medium text-red-700 mb-1">Audit Addendum</div>
//                                   <div className="bg-red-50 border border-red-200 p-2 rounded text-sm text-red-700">
//                                     {amendment.rejection_reason}
//                                   </div>
//                                 </div>
//                               )}

//                               <div className="flex items-center gap-4 text-xs text-gray-500">
//                                 <span>Amended by: {amendment.amendedBy?.username || 'Unknown'}</span>
//                                 <span>Role: {amendment.amendedBy?.role?.replace(/_/g, ' ')}</span>
//                                 <span>Department: {amendment.amendedBy?.department}</span>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>

//                   {/* Amendment History Summary */}
//                   <div className="mt-4 pt-4 border-t bg-gray-50 rounded-md p-3">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
//                       <div>
//                         <span className="font-medium">Total amendments:</span> {rectification.AuditRectificationAmendmentHistories.length}
//                       </div>
//                       <div>
//                         <span className="font-medium">First amendment:</span> {formatDate(
//                           rectification.AuditRectificationAmendmentHistories
//                             .slice()
//                             .sort((a, b) => new Date(a.amended_at).getTime() - new Date(b.amended_at).getTime())[0]?.amended_at
//                         )}
//                       </div>
//                       <div>
//                         <span className="font-medium">Latest amendment:</span> {formatDate(
//                           rectification.AuditRectificationAmendmentHistories
//                             .slice()
//                             .sort((a, b) => new Date(b.amended_at).getTime() - new Date(a.amended_at).getTime())[0]?.amended_at
//                         )}
//                       </div>
//                     </div>

//                     {/* Amendment status distribution */}
//                     <div className="mt-3 pt-3 border-t border-gray-200">
//                       <div className="flex flex-wrap gap-2">
//                         {Array.from(new Set(rectification.AuditRectificationAmendmentHistories.map(a => a.status)))
//                           .map(status => {
//                             const count = rectification.AuditRectificationAmendmentHistories.filter(a => a.status === status).length;
//                             const statusColor = status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' :
//                                               status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
//                                               'bg-yellow-100 text-yellow-700 border-yellow-200';
//                             return (
//                               <span key={status} className={`px-2 py-1 border rounded-full text-xs ${statusColor}`}>
//                                 {status}: {count}
//                               </span>
//                             );
//                           })}
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </>
//         )}

//         {/* Editing Form Dialog */}
//         <Dialog open={isEditing} onOpenChange={setIsEditing}>
//           <DialogContent className="max-w-2xl">
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2">
//                 <Edit className="h-5 w-5" />
//                 {rectification ? 'Amend Rectification' : 'Create Rectification'}
//               </DialogTitle>
//               <DialogDescription>
//                 {rectification ? 'Update the rectification description and provide additional evidence if needed.' : 'Provide a detailed description of the rectification actions taken.'}
//               </DialogDescription>
//             </DialogHeader>

//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="rectification-text">Rectification Description</Label>
//                 <Textarea
//                   id="rectification-text"
//                   value={editText}
//                   onChange={(e) => setEditText(e.target.value)}
//                   placeholder="Describe the rectification actions taken to address this audit finding..."
//                   rows={6}
//                   className="mt-1"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="evidence-file">Evidence File (Optional)</Label>
//                 <Input
//                   id="evidence-file"
//                   type="file"
//                   onChange={handleFileChange}
//                   className="mt-1"
//                   accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
//                 />
//                 {selectedFile && (
//                   <p className="text-sm text-gray-600 mt-1">
//                     Selected: {selectedFile.name}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <DialogFooter>
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setIsEditing(false);
//                   setEditText('');
//                   setSelectedFile(null);
//                 }}
//                 disabled={actionLoading}
//               >
//                 <X className="h-4 w-4 mr-2" />
//                 Cancel
//               </Button>
//               <Button
//                 onClick={rectification ? handleAmendRectification : handleCreateRectification}
//                 disabled={actionLoading || !editText.trim()}
//               >
//                 {actionLoading ? (
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 ) : (
//                   <Save className="h-4 w-4 mr-2" />
//                 )}
//                 {rectification ? 'Save Amendment' : 'Submit Rectification'}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Rejection Reason Dialog */}
//         <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2">
//                 <XCircle className="h-5 w-5 text-red-600" />
//                 Audit Addendum
//               </DialogTitle>
//               <DialogDescription>
//                 Please provide a reason for Audit Addendum this rectification. This will help the submitter understand what needs to be improved.
//               </DialogDescription>
//             </DialogHeader>

//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="rejection-reason">Audit Addendum Reason</Label>
//                 <Textarea
//                   id="rejection-reason"
//                   value={rejectionReason}
//                   onChange={(e) => setRejectionReason(e.target.value)}
//                   placeholder="Explain why this rectification is being Audit Addendum and what improvements are needed..."
//                   rows={4}
//                   className="mt-1"
//                 />
//               </div>
//             </div>

//             <DialogFooter>
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setShowRejectDialog(false);
//                   setRejectionReason('');
//                 }}
//                 disabled={actionLoading}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="destructive"
//                 onClick={handleRejectRectification}
//                 disabled={actionLoading || !rejectionReason.trim()}
//               >
//                 {actionLoading ? (
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 ) : (
//                   <XCircle className="h-4 w-4 mr-2" />
//                 )}
//                 Audit Addendum
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Amendment Dialog */}
//         <Dialog open={showAmendDialog} onOpenChange={setShowAmendDialog}>
//           <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2">
//                 <Edit className="h-5 w-5 text-blue-600" />
//                 Amend Rectification
//               </DialogTitle>
//               <DialogDescription>
//                 Update the rectification details and add additional evidence if needed.
//               </DialogDescription>
//             </DialogHeader>

//             <div className="space-y-4">
//               {/* Rectification Text */}
//               <div className="space-y-2">
//                 <Label htmlFor="amendRectificationText">Rectification Description</Label>
//                 <Textarea
//                   id="amendRectificationText"
//                   placeholder="Describe the rectification measures taken..."
//                   value={amendRectificationText}
//                   onChange={(e) => setAmendRectificationText(e.target.value)}
//                   rows={6}
//                   className="min-h-[120px]"
//                 />
//               </div>

//               {/* Evidence Files */}
//               <div className="space-y-2">
//                 <Label htmlFor="amendEvidenceFiles">Additional Evidence Files (Optional)</Label>
//                 <Input
//                   id="amendEvidenceFiles"
//                   type="file"
//                   multiple
//                   onChange={(e) => {
//                     const files = Array.from(e.target.files || []);
//                     setAmendEvidenceFiles(files);
//                   }}
//                   className="cursor-pointer"
//                 />
//                 {amendEvidenceFiles.length > 0 && (
//                   <div className="text-sm text-gray-600">
//                     Selected files: {amendEvidenceFiles.map(f => f.name).join(', ')}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <DialogFooter>
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setShowAmendDialog(false);
//                   setAmendRectificationText('');
//                   setAmendEvidenceFiles([]);
//                 }}
//                 disabled={actionLoading}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleSubmitAmendment}
//                 disabled={actionLoading || !amendRectificationText.trim()}
//               >
//                 {actionLoading ? (
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 ) : (
//                   <Save className="h-4 w-4 mr-2" />
//                 )}
//                 Submit Amendment
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// };


// import React, { useState, useEffect, useCallback } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { toast } from 'sonner';
// import {
//   ArrowLeft,
//   FileCheck,
//   FileText,
//   CheckCircle,
//   XCircle,
//   User,
//   Calendar,
//   Clock,
//   Upload,
//   Download,
//   Edit,
//   Save,
//   X,
//   History,
//   ChevronDown,
//   ChevronRight,
//   Loader2,
//   Eye,
//   AlertTriangle
// } from 'lucide-react';
// import { AuditFinding, RECTIFICATION_STATUSES } from '@/types/auditFinding';
// import { User as UserType } from '@/types/user';

// // Helper function to check if file type is previewable image
// const isPreviewableImage = (fileType: string): boolean => {
//   return fileType.startsWith('image/') && ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(fileType.toLowerCase());
// };

// // Helper function to check if file type is previewable PDF
// const isPreviewablePDF = (fileType: string): boolean => {
//   return fileType.toLowerCase() === 'application/pdf';
// };

// // Helper function to get file type icon
// const getFileTypeIcon = (fileType: string) => {
//   if (isPreviewableImage(fileType)) {
//     return <Eye className="h-4 w-4" />;
//   } else if (isPreviewablePDF(fileType)) {
//     return <FileText className="h-4 w-4" />;
//   } else {
//     return <Download className="h-4 w-4" />;
//   }
// };

// // RectificationFilePreview component
// interface RectificationFilePreviewProps {
//   evidence: {
//     evidence_id: string;
//     rectification_evidence_url: string;
//     rectification_file_name: string;
//     rectification_file_type: string;
//     created_at: string;
//   };
// }

// const RectificationFilePreview: React.FC<RectificationFilePreviewProps> = ({ evidence }) => {
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [imageLoading, setImageLoading] = useState(true);
//   const [imageError, setImageError] = useState(false);

//   const fileName = evidence.rectification_file_name;
//   const fileType = evidence.rectification_file_type;
//   const fileUrl = evidence.rectification_evidence_url ?
//     `${'https://aps2.zemenbank.com/ZAMS/api' || 'https://aps2.zemenbank.com/ZAMS/api'}/${evidence.rectification_evidence_url}` : null;

//   const canPreview = isPreviewableImage(fileType) || isPreviewablePDF(fileType);

//   // Format date helper for this component
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   // Enhanced file information display
//   const getFileExtension = (filename: string) => {
//     return filename.split('.').pop()?.toUpperCase() || 'FILE';
//   };

//   const getFileTypeDisplay = (type: string) => {
//     const typeMap: { [key: string]: string } = {
//       'application/pdf': 'PDF Document',
//       'image/jpeg': 'JPEG Image',
//       'image/jpg': 'JPG Image',
//       'image/png': 'PNG Image',
//       'application/msword': 'Word Document',
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
//       'text/plain': 'Text File',
//       'application/vnd.ms-excel': 'Excel Spreadsheet',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet'
//     };
//     return typeMap[type] || type;
//   };

//   if (!canPreview) {
//     return (
//       <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             {getFileTypeIcon(fileType)}
//             <span>{getFileTypeDisplay(fileType)}</span>
//             <span className="px-2 py-1 bg-gray-200 rounded text-xs">
//               {getFileExtension(fileName)}
//             </span>
//           </div>
//           <span className="text-xs text-gray-500">Preview not available</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-2">
//       <Button
//         variant="outline"
//         size="sm"
//         onClick={() => setPreviewOpen(true)}
//         className="w-full justify-start hover:bg-blue-50 hover:border-blue-200"
//       >
//         <Eye className="h-4 w-4 mr-2" />
//         Preview {getFileTypeDisplay(fileType)}
//         <span className="ml-auto text-xs text-gray-500">
//           {getFileExtension(fileName)}
//         </span>
//       </Button>

//       <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
//         <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               {getFileTypeIcon(fileType)}
//               {fileName}
//             </DialogTitle>
//             <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
//               <span className="px-2 py-1 bg-gray-100 rounded">
//                 {getFileTypeDisplay(fileType)}
//               </span>
//               <span>•</span>
//               <span>Uploaded {formatDate(evidence.created_at)}</span>
//             </div>
//           </DialogHeader>

//           <div className="flex-1 overflow-auto">
//             {isPreviewableImage(fileType) && fileUrl && (
//               <div className="flex justify-center">
//                 {imageLoading && (
//                   <div className="flex items-center justify-center h-64">
//                     <Loader2 className="h-8 w-8 animate-spin" />
//                   </div>
//                 )}
//                 <img
//                   src={fileUrl}
//                   alt={fileName}
//                   className={`max-w-full max-h-[70vh] object-contain ${imageLoading ? 'hidden' : ''}`}
//                   onLoad={() => setImageLoading(false)}
//                   onError={() => {
//                     setImageError(true);
//                     setImageLoading(false);
//                   }}
//                 />
//                 {imageError && (
//                   <div className="flex items-center justify-center h-64 text-gray-500">
//                     <div className="text-center">
//                       <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
//                       <p>Failed to load image</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {isPreviewablePDF(fileType) && fileUrl && (
//               <div className="w-full h-[70vh]">
//                 <iframe
//                   src={fileUrl}
//                   className="w-full h-full border-0"
//                   title={fileName}
//                 />
//               </div>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// interface AuditRectificationDetailProps {
//   finding: AuditFinding;
//   currentUser: UserType;
//   onBack?: () => void;
//   onRectificationUpdate?: () => void;
// }

// interface RectificationData {
//   rectification_id: string;
//   finding_id: string;
//   submitted_by_id: string;
//   rectification_text: string;
//   status: 'Pending' | 'Approved' | 'Rejected' | 'Amended';
//   reason?: string;
//   approved_by_id?: string;
//   approved_at?: string;
//   created_at: string;
//   updated_at: string;
//   submittedBy?: {
//     id: string;
//     username: string;
//     email: string;
//     role: string;
//     department: string;
//   };
//   approvedBy?: {
//     id: string;
//     username: string;
//     email: string;
//     role: string;
//     department: string;
//   };
//   AuditRectificationEvidences?: Array<{
//     evidence_id: string;
//     rectification_evidence_url: string;
//     rectification_file_name: string;
//     rectification_file_type: string;
//     created_at: string;
//   }>;
//   AuditRectificationAmendmentHistories?: Array<{
//     amendment_id: string;
//     rectification_id: string;
//     amend_by_id: string;
//     rectification: string;
//     status: string;
//     rejection_reason?: string;
//     amended_at: string;
//     amendedBy?: {
//       id: string;
//       username: string;
//       email: string;
//       role: string;
//       department: string;
//     };
//   }>;
// }

// export const AuditRectificationDetail: React.FC<AuditRectificationDetailProps> = ({
//   finding,
//   currentUser,
//   onBack,
//   onRectificationUpdate
// }) => {
//   const { api } = useAuth();
//   const [rectification, setRectification] = useState<RectificationData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editText, setEditText] = useState('');
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [expandedAmendments, setExpandedAmendments] = useState<{ [key: string]: boolean }>({});
//   const [showRejectDialog, setShowRejectDialog] = useState(false);
//   const [rejectionReason, setRejectionReason] = useState('');

//   // Amendment management state
//   const [showAmendDialog, setShowAmendDialog] = useState(false);
//   const [amendRectificationText, setAmendRectificationText] = useState('');
//   const [amendEvidenceFiles, setAmendEvidenceFiles] = useState<File[]>([]);

//   // Permissions removed - universal access for all users

//   // Fetch rectification data - for now, we'll fetch the full finding data which should include rectification
//   const fetchRectificationData = useCallback(async () => {
//     if (!finding) return;

//     setLoading(true);
//     try {
//       // Fetch the full finding data which should include rectification information
//       const response = await api.get(`ZAMS/api/audit-findings/${finding.id}`);
//       const findingData = response.data;

//       // Check if the finding has rectification data
//       if (findingData.rectification_id && findingData.AuditFindingRectifications && findingData.AuditFindingRectifications.length > 0) {
//         // Use the first (and should be only) rectification
//         setRectification(findingData.AuditFindingRectifications[0]);
//       } else if (findingData.rectification_id) {
//         // If rectification_id exists but no data, try to fetch it separately
//         // For now, we'll create a mock structure to show the create form
//         setRectification(null);
//       } else {
//         setRectification(null);
//       }
//     } catch (error: any) {
//       console.error('Error fetching rectification data:', error);
//       toast.error('Failed to fetch rectification data');
//     } finally {
//       setLoading(false);
//     }
//   }, [api, finding]);

//   useEffect(() => {
//     if (finding) {
//       fetchRectificationData();
//     }
//   }, [finding, fetchRectificationData]);

//   // Handle create rectification
//   const handleCreateRectification = async () => {
//     if (!finding || !editText.trim()) {
//       toast.error('Please provide rectification description');
//       return;
//     }

//     setActionLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('rectification_description', editText);
//       if (selectedFile) {
//         formData.append('file', selectedFile);
//       }

//       await api.post(`/ZAMS/api/audit-findings/${finding.id}/rectify`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       toast.success('Rectification submitted successfully');
//       setIsEditing(false);
//       setEditText('');
//       setSelectedFile(null);
//       fetchRectificationData();
//       if (onRectificationUpdate) {
//         onRectificationUpdate();
//       }
//     } catch (error: any) {
//       console.error('Error creating rectification:', error);
//       const errorMessage = error.response?.data?.error || 'Failed to create rectification';
//       toast.error(errorMessage);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Handle amend rectification
//   const handleAmendRectification = async () => {
//     if (!finding || !rectification || !editText.trim()) {
//       toast.error('Please provide rectification description');
//       return;
//     }

//     setActionLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('rectification_description', editText);
//       if (selectedFile) {
//         formData.append('file', selectedFile);
//       }

//       await api.put(`/ZAMS/api/audit-findings/${finding.id}/rectify/amend`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       toast.success('Rectification amended successfully');
//       setIsEditing(false);
//       setEditText('');
//       setSelectedFile(null);
//       fetchRectificationData();
//       if (onRectificationUpdate) {
//         onRectificationUpdate();
//       }
//     } catch (error: any) {
//       console.error('Error amending rectification:', error);
//       const errorMessage = error.response?.data?.error || 'Failed to amend rectification';
//       toast.error(errorMessage);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Handle approve rectification
//   const handleApproveRectification = async () => {
//     if (!finding || !rectification) return;

//     setActionLoading(true);
//     try {
//       await api.put(`/ZAMS/api/audit-findings/${finding.id}/rectify/approve`);
//       toast.success('Rectification approved successfully');
//       fetchRectificationData();
//       if (onRectificationUpdate) {
//         onRectificationUpdate();
//       }
//     } catch (error: any) {
//       console.error('Error approving rectification:', error);
//       const errorMessage = error.response?.data?.error || 'Failed to approve rectification';
//       toast.error(errorMessage);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Handle reject rectification
//   const handleRejectRectification = async () => {
//     if (!finding || !rectification || !rejectionReason.trim()) {
//       toast.error('Please provide a rejection reason');
//       return;
//     }

//     setActionLoading(true);
//     try {
//       await api.put(`/ZAMS/api/audit-findings/${finding.id}/rectify/reject`, {
//         rejection_reason: rejectionReason
//       });
//       toast.success('Rectification rejected');
//       setShowRejectDialog(false);
//       setRejectionReason('');
//       fetchRectificationData();
//       if (onRectificationUpdate) {
//         onRectificationUpdate();
//       }
//     } catch (error: any) {
//       console.error('Error rejecting rectification:', error);
//       const errorMessage = error.response?.data?.error || 'Failed to Audit Addendum rectification';
//       toast.error(errorMessage);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Handle file change
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//     }
//   };

//   // Handle download evidence
//   const handleDownloadEvidence = async (evidence: any) => {
//     try {
//       const evidenceId = evidence.evidence_id;
//       if (!evidenceId) {
//         toast.error('Evidence ID not found');
//         return;
//       }

//       const response = await api.get(`ZAMS/api/audit-findings/rectification-evidence/${evidenceId}/download`, {
//         responseType: 'blob',
//       });

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', evidence.rectification_file_name || 'evidence');
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);

//       toast.success('Evidence file downloaded successfully');
//     } catch (error: any) {
//       console.error('Error downloading evidence:', error);
//       const errorMessage = error.response?.data?.error || 'Failed to download evidence file';
//       toast.error(errorMessage);
//     }
//   };

//   // Format date helper
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   // Format time helper
//   const formatTime = (dateString: string) => {
//     return new Date(dateString).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Get rectification status badge
//   const getRectificationStatusBadge = (status: string) => {
//     const statusConfig = RECTIFICATION_STATUSES.find(s => s.value === status);
//     return (
//       <Badge className={statusConfig?.color || 'bg-gray-100 text-gray-800'}>
//         {statusConfig?.label || status}
//       </Badge>
//     );
//   };

//   // Check if user can create rectification
//   const canCreateRectification = () => {
//     if (!finding) return false;

//     // Check if finding doesn't have rectification yet (removed role permission check)
//     return !finding.rectification_id;
//   };

//   // Check if user can amend rectification - Universal access for all users
//   const canAmendRectification = () => {
//     if (!finding || !rectification) return false;

//     // All users can amend rectifications if status allows it
//     const allowedStatuses = ['Pending', 'Rejected'];
//     return allowedStatuses.includes(rectification.status);
//   };

//   // Check if user can approve/reject rectification - Universal access with business logic only
//   const canApproveRectification = () => {
//     if (!finding || !rectification) return false;

//     // All users can approve/reject if rectification is in appropriate status
//     return (rectification.status === 'Pending' || rectification.status === 'Amended');
//   };



//   // Helper function to detect changes between amendments
//   const detectChanges = (currentAmendment: any, previousAmendment: any) => {
//     const changes: Array<{ field: string; before: string; after: string }> = [];

//     if (currentAmendment.rectification !== previousAmendment.rectification) {
//       changes.push({
//         field: 'Rectification Description',
//         before: previousAmendment.rectification || '',
//         after: currentAmendment.rectification || ''
//       });
//     }

//     if (currentAmendment.status !== previousAmendment.status) {
//       changes.push({
//         field: 'Status',
//         before: previousAmendment.status || '',
//         after: currentAmendment.status || ''
//       });
//     }

//     return changes;
//   };

//   // Initialize amendment form with current data
//   const initializeAmendmentForm = () => {
//     if (rectification) {
//       setAmendRectificationText(rectification.rectification_text || '');
//       setShowAmendDialog(true);
//     }
//   };

//   // Handle submit amendment
//   const handleSubmitAmendment = async () => {
//     if (!finding || !rectification) return;

//     setActionLoading(true);
//     try {
//       const formData = new FormData();

//       // Add basic fields
//       formData.append('rectification_description', amendRectificationText);

//       // Add evidence files
//       amendEvidenceFiles.forEach((file) => {
//         formData.append(`file`, file);
//       });

//       await api.put(`/ZAMS/api/audit-findings/${finding.id}/rectify/amend`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       toast.success('Rectification amended successfully');
//       setShowAmendDialog(false);

//       // Reset amendment form
//       setAmendRectificationText('');
//       setAmendEvidenceFiles([]);

//       fetchRectificationData();
//       if (onRectificationUpdate) {
//         onRectificationUpdate();
//       }
//     } catch (error: any) {
//       console.error('Error amending rectification:', error);
//       const errorMessage = error.response?.data?.error || 'Failed to amend rectification';
//       toast.error(errorMessage);
//     } finally {
//       setActionLoading(false);
//     }
//   };



//   return (
//     <div className="container mx-auto py-6">
//       {/* Header */}
//       <div className="mb-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             {onBack && (
//               <Button variant="outline" onClick={onBack}>
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//             )}
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Rectification Management</h1>
//               <p className="text-gray-600">For: "{finding.title}"</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-6">
//         {loading ? (
//           <div className="flex items-center justify-center py-8">
//             <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//             <span className="ml-2">Loading rectification data...</span>
//           </div>
//         ) : (
//           <>
//             {/* Rectification Status and Actions */}
//             {rectification ? (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center justify-between">
//                     <span className="flex items-center gap-2">
//                       <FileText className="h-5 w-5" />
//                       Rectification Status
//                     </span>
//                     <div className="flex items-center gap-2">
//                       {getRectificationStatusBadge(rectification.status)}
//                       <div className="flex gap-2">
//                         {canAmendRectification() && (
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={initializeAmendmentForm}
//                             disabled={actionLoading}
//                             className="border-blue-300 text-blue-700 hover:bg-blue-50"
//                           >
//                             <Edit className="h-4 w-4 mr-2" />
//                             Amend
//                           </Button>
//                         )}
//                         {canApproveRectification() && (
//                           <>
//                             <Button
//                               size="sm"
//                               onClick={handleApproveRectification}
//                               disabled={actionLoading}
//                             >
//                               <CheckCircle className="h-4 w-4 mr-2" />
//                               Approve
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="destructive"
//                               onClick={() => setShowRejectDialog(true)}
//                               disabled={actionLoading}
//                             >
//                               <XCircle className="h-4 w-4 mr-2" />
//                               Audit Addendum
//                             </Button>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </CardTitle>
//                 </CardHeader>
//               </Card>
//             ) : (
//               canCreateRectification() && (
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <FileCheck className="h-5 w-5" />
//                       Create Rectification
//                     </CardTitle>
//                     <CardDescription>
//                       No rectification has been created for this finding yet. You can create one below.
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <Button
//                       onClick={() => setIsEditing(true)}
//                       disabled={actionLoading}
//                     >
//                       <FileText className="h-4 w-4 mr-2" />
//                       Create Rectification
//                     </Button>
//                   </CardContent>
//                 </Card>
//               )
//             )}

//             {/* Rectification Details */}
//             {rectification && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <FileText className="h-5 w-5" />
//                     Rectification Details
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="flex items-center gap-3">
//                       <User className="h-5 w-5 text-gray-400" />
//                       <div>
//                         <div className="text-sm text-gray-500">Submitted By</div>
//                         <div className="font-medium">{rectification.submittedBy?.username || 'Unknown'}</div>
//                         <div className="text-xs text-gray-500">{rectification.submittedBy?.role?.replace(/_/g, ' ')}</div>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <Calendar className="h-5 w-5 text-gray-400" />
//                       <div>
//                         <div className="text-sm text-gray-500">Submitted On</div>
//                         <div className="font-medium">{formatDate(rectification.created_at)}</div>
//                         <div className="text-xs text-gray-500">{formatTime(rectification.created_at)}</div>
//                       </div>
//                     </div>
//                   </div>

//                   <Separator />

//                   <div>
//                     <div className="text-sm text-gray-500 mb-2">Rectification Description</div>
//                     <div className="bg-gray-50 p-3 rounded-md">
//                       <p className="text-gray-700">{rectification.rectification_text}</p>
//                     </div>
//                   </div>

//                   {rectification.reason && (
//                     <>
//                       <Separator />
//                       <div>
//                         <div className="text-sm text-red-600 mb-2">Audit Addendum</div>
//                         <div className="bg-red-50 border border-red-200 p-3 rounded-md">
//                           <p className="text-red-700">{rectification.reason}</p>
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   {rectification.approved_by_id && rectification.approvedBy && (
//                     <>
//                       <Separator />
//                       <div className="flex items-center gap-3">
//                         <CheckCircle className="h-5 w-5 text-green-500" />
//                         <div>
//                           <div className="text-sm text-gray-500">Approved By</div>
//                           <div className="font-medium">{rectification.approvedBy.username}</div>
//                           <div className="text-xs text-gray-500">
//                             {rectification.approved_at && `on ${formatDate(rectification.approved_at)}`}
//                           </div>
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   {/* Amendment Action */}
//                   {canAmendRectification() && (
//                     <>
//                       <Separator />
//                       <div className="flex justify-end">
//                         <Button
//                           onClick={() => {
//                             setIsEditing(true);
//                             setEditText(rectification.rectification_text);
//                           }}
//                           disabled={actionLoading}
//                         >
//                           <Edit className="h-4 w-4 mr-2" />
//                           Amend Rectification
//                         </Button>
//                       </div>
//                     </>
//                   )}
//                 </CardContent>
//               </Card>
//             )}

//             {/* Evidence Files - Complete File History */}
//             {rectification && rectification.AuditRectificationEvidences && rectification.AuditRectificationEvidences.length > 0 && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Upload className="h-5 w-5" />
//                     Evidence Files History
//                     <span className="text-sm font-normal text-gray-500">
//                       ({rectification.AuditRectificationEvidences.length} file{rectification.AuditRectificationEvidences.length !== 1 ? 's' : ''})
//                     </span>
//                   </CardTitle>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Complete history of all evidence files uploaded for this rectification
//                   </p>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {/* Sort files by upload date (newest first) for chronological order */}
//                     {rectification.AuditRectificationEvidences
//                       .slice()
//                       .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
//                       .map((evidence, index) => (
//                       <div key={evidence.evidence_id} className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
//                         <div className="flex items-center justify-between mb-3">
//                           <div className="flex items-center gap-3">
//                             <div className="flex-shrink-0">
//                               <FileText className="h-5 w-5 text-gray-400" />
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <div className="font-medium text-gray-900 truncate">
//                                 {evidence.rectification_file_name}
//                               </div>
//                               <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
//                                 <span className="px-2 py-1 bg-gray-100 rounded-full">
//                                   {evidence.rectification_file_type}
//                                 </span>
//                                 <span>•</span>
//                                 <span>Uploaded {formatDate(evidence.created_at)}</span>
//                                 {index === 0 && (
//                                   <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
//                                     Latest
//                                   </span>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                           <div className="flex gap-2 flex-shrink-0">
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => handleDownloadEvidence(evidence)}
//                               className="hover:bg-blue-50 hover:border-blue-200"
//                             >
//                               <Download className="h-4 w-4 mr-1" />
//                               Download
//                             </Button>
//                           </div>
//                         </div>

//                         {/* Enhanced File Preview for Rectification Evidence */}
//                         <RectificationFilePreview evidence={evidence} />
//                       </div>
//                     ))}
//                   </div>

//                   {/* File History Summary */}
//                   <div className="mt-4 pt-4 border-t bg-gray-50 rounded-md p-3">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
//                       <div>
//                         <span className="font-medium">Total files:</span> {rectification.AuditRectificationEvidences.length}
//                       </div>
//                       <div>
//                         <span className="font-medium">First uploaded:</span> {formatDate(
//                           rectification.AuditRectificationEvidences
//                             .slice()
//                             .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0]?.created_at
//                         )}
//                       </div>
//                       <div>
//                         <span className="font-medium">Latest upload:</span> {formatDate(
//                           rectification.AuditRectificationEvidences
//                             .slice()
//                             .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.created_at
//                         )}
//                       </div>
//                     </div>

//                     {/* File type distribution */}
//                     <div className="mt-3 pt-3 border-t border-gray-200">
//                       <div className="flex flex-wrap gap-2">
//                         {Array.from(new Set(rectification.AuditRectificationEvidences.map(e => e.rectification_file_type)))
//                           .map(fileType => {
//                             const count = rectification.AuditRectificationEvidences.filter(e => e.rectification_file_type === fileType).length;
//                             return (
//                               <span key={fileType} className="px-2 py-1 bg-white border rounded-full text-xs">
//                                 {fileType.split('/')[1]?.toUpperCase() || fileType}: {count}
//                               </span>
//                             );
//                           })}
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Amendment History - Chronological Order */}
//             {rectification && rectification.AuditRectificationAmendmentHistories && rectification.AuditRectificationAmendmentHistories.length > 0 && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <History className="h-5 w-5" />
//                     Amendment History
//                     <span className="text-sm font-normal text-gray-500">
//                       ({rectification.AuditRectificationAmendmentHistories.length} amendment{rectification.AuditRectificationAmendmentHistories.length !== 1 ? 's' : ''})
//                     </span>
//                   </CardTitle>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Complete chronological history of all amendments and changes
//                   </p>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {/* Sort amendments by amended_at date (newest first) for chronological order */}
//                     {rectification.AuditRectificationAmendmentHistories
//                       .slice()
//                       .sort((a, b) => new Date(b.amended_at).getTime() - new Date(a.amended_at).getTime())
//                       .map((amendment, index) => (
//                       <div key={amendment.amendment_id} className="border rounded-md hover:bg-gray-50 transition-colors">
//                         <div
//                           className="flex items-center justify-between p-3 cursor-pointer"
//                           onClick={() => setExpandedAmendments(prev => ({
//                             ...prev,
//                             [amendment.amendment_id]: !prev[amendment.amendment_id]
//                           }))}
//                         >
//                           <div className="flex items-center gap-3">
//                             <div className="flex-shrink-0">
//                               {expandedAmendments[amendment.amendment_id] ? (
//                                 <ChevronDown className="h-4 w-4 text-gray-400" />
//                               ) : (
//                                 <ChevronRight className="h-4 w-4 text-gray-400" />
//                               )}
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center gap-2">
//                                 <div className="font-medium text-gray-900">
//                                   Amendment #{rectification.AuditRectificationAmendmentHistories.length - index}
//                                 </div>
//                                 {index === 0 && (
//                                   <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
//                                     Latest
//                                   </span>
//                                 )}
//                               </div>
//                               <div className="text-sm text-gray-500 mt-1">
//                                 by {amendment.amendedBy?.username || 'Unknown'} • {formatDate(amendment.amended_at)} at {formatTime(amendment.amended_at)}
//                               </div>
//                             </div>
//                           </div>
//                           <div className="flex-shrink-0">
//                             <Badge className={amendment.status === 'Approved' ? 'bg-green-100 text-green-800' :
//                                             amendment.status === 'Rejected' ? 'bg-red-100 text-red-800' :
//                                             'bg-yellow-100 text-yellow-800'}>
//                               {amendment.status}
//                             </Badge>
//                           </div>
//                         </div>

//                         {expandedAmendments[amendment.amendment_id] && (
//                           <div className="border-t p-3 bg-gray-50">
//                             <div className="space-y-3">
//                               {/* Change Detection - Compare with previous amendment in chronological order */}
//                               {(() => {
//                                 // Get the sorted array for proper chronological comparison
//                                 const sortedAmendments = rectification.AuditRectificationAmendmentHistories
//                                   .slice()
//                                   .sort((a, b) => new Date(b.amended_at).getTime() - new Date(a.amended_at).getTime());

//                                 const currentIndex = sortedAmendments.findIndex(a => a.amendment_id === amendment.amendment_id);
//                                 const previousAmendment = sortedAmendments[currentIndex + 1];

//                                 if (!previousAmendment) return null;

//                                 const changes = detectChanges(amendment, previousAmendment);

//                                 if (changes.length === 0) return null;

//                                 return (
//                                   <div className="mb-4">
//                                     <div className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
//                                       <AlertTriangle className="h-4 w-4" />
//                                       Changes Made from Previous Amendment
//                                     </div>

//                                     {changes.map((change, changeIndex) => (
//                                       <div key={changeIndex} className="bg-blue-50 border border-blue-200 rounded p-3 mb-2">
//                                         <div className="text-sm font-medium text-blue-800 mb-2">{change.field}</div>
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                           <div>
//                                             <div className="text-xs font-medium text-red-600 mb-1">After:</div>
//                                             <div className="bg-red-50 border border-red-200 p-2 rounded text-sm">
//                                               {change.after || 'Not specified'}
//                                             </div>
//                                           </div>
//                                           <div>
//                                             <div className="text-xs font-medium text-gray-600 mb-1">Before:</div>
//                                             <div className="bg-gray-50 border border-gray-200 p-2 rounded text-sm">
//                                               {change.before || 'Not specified'}
//                                             </div>
//                                           </div>
//                                         </div>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 );
//                               })()}

//                               <div>
//                                 <div className="text-sm font-medium text-gray-700 mb-1">Rectification Description</div>
//                                 <div className="bg-white p-2 rounded border text-sm">
//                                   {amendment.rectification}
//                                 </div>
//                               </div>

//                               {amendment.rejection_reason && (
//                                 <div>
//                                   <div className="text-sm font-medium text-red-700 mb-1">Audit Addendum</div>
//                                   <div className="bg-red-50 border border-red-200 p-2 rounded text-sm text-red-700">
//                                     {amendment.rejection_reason}
//                                   </div>
//                                 </div>
//                               )}

//                               <div className="flex items-center gap-4 text-xs text-gray-500">
//                                 <span>Amended by: {amendment.amendedBy?.username || 'Unknown'}</span>
//                                 <span>Role: {amendment.amendedBy?.role?.replace(/_/g, ' ')}</span>
//                                 <span>Department: {amendment.amendedBy?.department}</span>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>

//                   {/* Amendment History Summary */}
//                   <div className="mt-4 pt-4 border-t bg-gray-50 rounded-md p-3">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
//                       <div>
//                         <span className="font-medium">Total amendments:</span> {rectification.AuditRectificationAmendmentHistories.length}
//                       </div>
//                       <div>
//                         <span className="font-medium">First amendment:</span> {formatDate(
//                           rectification.AuditRectificationAmendmentHistories
//                             .slice()
//                             .sort((a, b) => new Date(a.amended_at).getTime() - new Date(b.amended_at).getTime())[0]?.amended_at
//                         )}
//                       </div>
//                       <div>
//                         <span className="font-medium">Latest amendment:</span> {formatDate(
//                           rectification.AuditRectificationAmendmentHistories
//                             .slice()
//                             .sort((a, b) => new Date(b.amended_at).getTime() - new Date(a.amended_at).getTime())[0]?.amended_at
//                         )}
//                       </div>
//                     </div>

//                     {/* Amendment status distribution */}
//                     <div className="mt-3 pt-3 border-t border-gray-200">
//                       <div className="flex flex-wrap gap-2">
//                         {Array.from(new Set(rectification.AuditRectificationAmendmentHistories.map(a => a.status)))
//                           .map(status => {
//                             const count = rectification.AuditRectificationAmendmentHistories.filter(a => a.status === status).length;
//                             const statusColor = status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' :
//                                               status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
//                                               'bg-yellow-100 text-yellow-700 border-yellow-200';
//                             return (
//                               <span key={status} className={`px-2 py-1 border rounded-full text-xs ${statusColor}`}>
//                                 {status}: {count}
//                               </span>
//                             );
//                           })}
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </>
//         )}

//         {/* Editing Form Dialog */}
//         <Dialog open={isEditing} onOpenChange={setIsEditing}>
//           <DialogContent className="max-w-2xl">
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2">
//                 <Edit className="h-5 w-5" />
//                 {rectification ? 'Amend Rectification' : 'Create Rectification'}
//               </DialogTitle>
//               <DialogDescription>
//                 {rectification ? 'Update the rectification description and provide additional evidence if needed.' : 'Provide a detailed description of the rectification actions taken.'}
//               </DialogDescription>
//             </DialogHeader>

//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="rectification-text">Rectification Description</Label>
//                 <Textarea
//                   id="rectification-text"
//                   value={editText}
//                   onChange={(e) => setEditText(e.target.value)}
//                   placeholder="Describe the rectification actions taken to address this audit finding..."
//                   rows={6}
//                   className="mt-1"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="evidence-file">Evidence File (Optional)</Label>
//                 <Input
//                   id="evidence-file"
//                   type="file"
//                   onChange={handleFileChange}
//                   className="mt-1"
//                   accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
//                 />
//                 {selectedFile && (
//                   <p className="text-sm text-gray-600 mt-1">
//                     Selected: {selectedFile.name}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <DialogFooter>
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setIsEditing(false);
//                   setEditText('');
//                   setSelectedFile(null);
//                 }}
//                 disabled={actionLoading}
//               >
//                 <X className="h-4 w-4 mr-2" />
//                 Cancel
//               </Button>
//               <Button
//                 onClick={rectification ? handleAmendRectification : handleCreateRectification}
//                 disabled={actionLoading || !editText.trim()}
//               >
//                 {actionLoading ? (
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 ) : (
//                   <Save className="h-4 w-4 mr-2" />
//                 )}
//                 {rectification ? 'Save Amendment' : 'Submit Rectification'}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Rejection Reason Dialog */}
//         <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2">
//                 <XCircle className="h-5 w-5 text-red-600" />
//                 Audit Addendum
//               </DialogTitle>
//               <DialogDescription>
//                 Please provide a reason for Audit Addendum this rectification. This will help the submitter understand what needs to be improved.
//               </DialogDescription>
//             </DialogHeader>

//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="rejection-reason">Audit Addendum Reason</Label>
//                 <Textarea
//                   id="rejection-reason"
//                   value={rejectionReason}
//                   onChange={(e) => setRejectionReason(e.target.value)}
//                   placeholder="Explain why this rectification is being Audit Addendum and what improvements are needed..."
//                   rows={4}
//                   className="mt-1"
//                 />
//               </div>
//             </div>

//             <DialogFooter>
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setShowRejectDialog(false);
//                   setRejectionReason('');
//                 }}
//                 disabled={actionLoading}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="destructive"
//                 onClick={handleRejectRectification}
//                 disabled={actionLoading || !rejectionReason.trim()}
//               >
//                 {actionLoading ? (
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 ) : (
//                   <XCircle className="h-4 w-4 mr-2" />
//                 )}
//                 Audit Addendum
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Amendment Dialog */}
//         <Dialog open={showAmendDialog} onOpenChange={setShowAmendDialog}>
//           <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2">
//                 <Edit className="h-5 w-5 text-blue-600" />
//                 Amend Rectification
//               </DialogTitle>
//               <DialogDescription>
//                 Update the rectification details and add additional evidence if needed.
//               </DialogDescription>
//             </DialogHeader>

//             <div className="space-y-4">
//               {/* Rectification Text */}
//               <div className="space-y-2">
//                 <Label htmlFor="amendRectificationText">Rectification Description</Label>
//                 <Textarea
//                   id="amendRectificationText"
//                   placeholder="Describe the rectification measures taken..."
//                   value={amendRectificationText}
//                   onChange={(e) => setAmendRectificationText(e.target.value)}
//                   rows={6}
//                   className="min-h-[120px]"
//                 />
//               </div>

//               {/* Evidence Files */}
//               <div className="space-y-2">
//                 <Label htmlFor="amendEvidenceFiles">Additional Evidence Files (Optional)</Label>
//                 <Input
//                   id="amendEvidenceFiles"
//                   type="file"
//                   multiple
//                   onChange={(e) => {
//                     const files = Array.from(e.target.files || []);
//                     setAmendEvidenceFiles(files);
//                   }}
//                   className="cursor-pointer"
//                 />
//                 {amendEvidenceFiles.length > 0 && (
//                   <div className="text-sm text-gray-600">
//                     Selected files: {amendEvidenceFiles.map(f => f.name).join(', ')}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <DialogFooter>
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setShowAmendDialog(false);
//                   setAmendRectificationText('');
//                   setAmendEvidenceFiles([]);
//                 }}
//                 disabled={actionLoading}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleSubmitAmendment}
//                 disabled={actionLoading || !amendRectificationText.trim()}
//               >
//                 {actionLoading ? (
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 ) : (
//                   <Save className="h-4 w-4 mr-2" />
//                 )}
//                 Submit Amendment
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// };

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
  AlertTriangle,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Shield,
  Zap,
  Award,
  Target,
  FileImage,
  FilePlus,
  CheckSquare,
  XSquare,
  RefreshCw,
  Timer,
  UserCheck
} from 'lucide-react';
import { AuditFinding, RECTIFICATION_STATUSES } from '@/types/auditFinding';
import { User as UserType } from '@/types/user';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4 }
  }
};

const scaleIn = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Helper functions (keep all existing helper functions)
const isPreviewableImage = (fileType: string): boolean => {
  return fileType.startsWith('image/') && ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(fileType.toLowerCase());
};

const isPreviewablePDF = (fileType: string): boolean => {
  return fileType.toLowerCase() === 'application/pdf';
};

const getFileTypeIcon = (fileType: string) => {
  if (isPreviewableImage(fileType)) {
    return <FileImage className="h-4 w-4" />;
  } else if (isPreviewablePDF(fileType)) {
    return <FileText className="h-4 w-4" />;
  } else {
    return <Download className="h-4 w-4" />;
  }
};

// Keep the existing RectificationFilePreview component but with enhanced styling
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
    `${'https://aps2.zemenbank.com/ZAMS/api' || 'https://aps2.zemenbank.com/ZAMS/api'}/${evidence.rectification_evidence_url}` : null;

  const canPreview = isPreviewableImage(fileType) || isPreviewablePDF(fileType);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-2 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {getFileTypeIcon(fileType)}
            <span>{getFileTypeDisplay(fileType)}</span>
            <span className="px-2 py-1 bg-gray-200 rounded-full text-xs font-medium">
              {getFileExtension(fileName)}
            </span>
          </div>
          <span className="text-xs text-gray-500">Preview not available</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPreviewOpen(true)}
        className="w-full justify-start bg-gradient-to-r from-white to-gray-50 hover:from-red-50 hover:to-white border-gray-200 hover:border-red-300 transition-all duration-300 group"
      >
        <Eye className="h-4 w-4 mr-2 text-red-600 group-hover:scale-110 transition-transform" />
        Preview {getFileTypeDisplay(fileType)}
        <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
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
                    <Loader2 className="h-8 w-8 animate-spin text-red-600" />
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
                      <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-red-500" />
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
                  className="w-full h-full border-0 rounded-lg"
                  title={fileName}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

// Main component interfaces (keep existing)
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
  const [showAmendDialog, setShowAmendDialog] = useState(false);
  const [amendRectificationText, setAmendRectificationText] = useState('');
  const [amendEvidenceFiles, setAmendEvidenceFiles] = useState<File[]>([]);

  // Keep all existing functions exactly as they are
  const fetchRectificationData = useCallback(async () => {
    if (!finding) return;

    setLoading(true);
    try {
      const response = await api.get(`ZAMS/api/audit-findings/${finding.id}`);
      const findingData = response.data;

      if (findingData.rectification_id && findingData.AuditFindingRectifications && findingData.AuditFindingRectifications.length > 0) {
        setRectification(findingData.AuditFindingRectifications[0]);
      } else if (findingData.rectification_id) {
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

  // Keep all handler functions exactly as they are
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

      await api.post(`/ZAMS/api/audit-findings/${finding.id}/rectify`, formData, {
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

  const isAmendRectificationButton = currentUser.role === 'Auditees'  || currentUser.role === 'Auditee_Supervisor' || currentUser.role === 'IT_Auditees' || currentUser.role === 'IT_Auditees_Supervisor' || currentUser.role === 'Inspection_Auditees'  || currentUser.role === 'Inspection_Auditees_Supervisor';
  const isApproveRectificationButton =  currentUser.role === 'Resident_Auditors' || currentUser.role === 'Audit_Supervisor'  || currentUser.role === 'IT_Auditors_Director' || currentUser.role === 'IT_Auditors_Supervisor' || currentUser.role === 'IT_Auditors'  || currentUser.role === 'Inspection_Auditors' || currentUser.role === 'Inspection_Auditors_Supervisor';
  const isAuditAddendumRectificationButton = currentUser.role === 'Resident_Auditors' || currentUser.role === 'Audit_Supervisor'  || currentUser.role === 'IT_Auditors_Director' || currentUser.role === 'IT_Auditors_Supervisor' || currentUser.role === 'IT_Auditors'  || currentUser.role === 'Inspection_Auditors' || currentUser.role === 'Inspection_Auditors_Supervisor';
  const isAmenButton = currentUser.role === 'Auditees'  || currentUser.role === 'Auditee_Supervisor' || currentUser.role === 'IT_Auditees' || currentUser.role === 'IT_Auditees_Supervisor' || currentUser.role === 'Inspection_Auditees'  || currentUser.role === 'Inspection_Auditees_Supervisor';
  const isCreateRectficationButton = currentUser.role === 'Auditees'  || currentUser.role === 'Auditee_Supervisor' || currentUser.role === 'IT_Auditees' || currentUser.role === 'IT_Auditees_Supervisor' || currentUser.role === 'Inspection_Auditees'  || currentUser.role === 'Inspection_Auditees_Supervisor';



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

      await api.put(`/ZAMS/api/audit-findings/${finding.id}/rectify/amend`, formData, {
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

  const handleApproveRectification = async () => {
    if (!finding || !rectification) return;

    setActionLoading(true);
    try {
      await api.put(`/ZAMS/api/audit-findings/${finding.id}/rectify/approve`);
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

  const handleRejectRectification = async () => {
    if (!finding || !rectification || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      await api.put(`/ZAMS/api/audit-findings/${finding.id}/rectify/reject`, {
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDownloadEvidence = async (evidence: any) => {
    try {
      const evidenceId = evidence.evidence_id;
      if (!evidenceId) {
        toast.error('Evidence ID not found');
        return;
      }

      const response = await api.get(`ZAMS/api/audit-findings/rectification-evidence/${evidenceId}/download`, {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRectificationStatusBadge = (status: string) => {
    const statusConfig = RECTIFICATION_STATUSES.find(s => s.value === status);
    const statusIcons = {
      'Pending': <Clock className="h-3 w-3" />,
      'Approved': <CheckCircle className="h-3 w-3" />,
      'Rejected': <XCircle className="h-3 w-3" />,
      'Amended': <RefreshCw className="h-3 w-3" />
    };
    
    return (
      <Badge className={`${statusConfig?.color || 'bg-gray-100 text-gray-800'} flex items-center gap-1`}>
        {statusIcons[status as keyof typeof statusIcons]}
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const canCreateRectification = () => {
    if (!finding) return false;
    return !finding.rectification_id;
  };

  const canAmendRectification = () => {
    if (!finding || !rectification) return false;
    const allowedStatuses = ['Pending', 'Rejected'];
    return allowedStatuses.includes(rectification.status);
  };

  const canApproveRectification = () => {
    if (!finding || !rectification) return false;
    return (rectification.status === 'Pending' || rectification.status === 'Amended');
  };

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

  const initializeAmendmentForm = () => {
    if (rectification) {
      setAmendRectificationText(rectification.rectification_text || '');
      setShowAmendDialog(true);
    }
  };

  const handleSubmitAmendment = async () => {
    if (!finding || !rectification) return;

    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('rectification_description', amendRectificationText);
      amendEvidenceFiles.forEach((file) => {
        formData.append(`file`, file);
      });

      await api.put(`/ZAMS/api/audit-findings/${finding.id}/rectify/amend`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Rectification amended successfully');
      setShowAmendDialog(false);
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

  // Prepare chart data
  const getStatusDistributionData = () => {
    if (!rectification || !rectification.AuditRectificationAmendmentHistories) return [];
    
    const statusCounts: { [key: string]: number } = {};
    rectification.AuditRectificationAmendmentHistories.forEach(amendment => {
      statusCounts[amendment.status] = (statusCounts[amendment.status] || 0) + 1;
    });
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      color: status === 'Approved' ? '#10B981' : 
             status === 'Rejected' ? '#EF4444' :
             status === 'Pending' ? '#F59E0B' : '#6B7280'
    }));
  };

  const getAmendmentTimelineData = () => {
    if (!rectification || !rectification.AuditRectificationAmendmentHistories) return [];
    
    return rectification.AuditRectificationAmendmentHistories
      .slice()
      .sort((a, b) => new Date(a.amended_at).getTime() - new Date(b.amended_at).getTime())
      .map((amendment, index) => ({
        date: new Date(amendment.amended_at).toLocaleDateString(),
        amendment: index + 1,
        status: amendment.status === 'Approved' ? 3 : 
                amendment.status === 'Rejected' ? 1 : 2
      }));
  };

  const getFileTypeDistribution = () => {
    if (!rectification || !rectification.AuditRectificationEvidences) return [];
    
    const typeCount: { [key: string]: number } = {};
    rectification.AuditRectificationEvidences.forEach(evidence => {
      const type = evidence.rectification_file_type.split('/')[1]?.toUpperCase() || 'Other';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
    
    return Object.entries(typeCount).map(([type, count]) => ({
      name: type,
      value: count
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto py-6">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-black via-gray-900 to-black rounded-2xl p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {onBack && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      onClick={onBack}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                  </motion.div>
                )}
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Shield className="h-8 w-8 text-red-500" />
                    Rectification Management
                  </h1>
                  <p className="text-gray-300 mt-1">Finding: "{finding.title}"</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="opacity-30"
                >
                  <Activity className="h-12 w-12 text-red-500" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-16"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="h-12 w-12 text-red-600 mx-auto mb-4" />
                </motion.div>
                <p className="text-gray-600 font-medium">Loading rectification data...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-6"
            >
              {/* Quick Stats Section */}
              {rectification && (
                <motion.div variants={fadeInUp}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <p className="text-lg font-bold text-black">{rectification.status}</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full">
                          <Target className="h-6 w-6 text-red-600" />
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Amendments</p>
                          <p className="text-lg font-bold text-black">
                            {rectification.AuditRectificationAmendmentHistories?.length || 0}
                          </p>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-full">
                          <RefreshCw className="h-6 w-6 text-gray-600" />
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Evidence Files</p>
                          <p className="text-lg font-bold text-black">
                            {rectification.AuditRectificationEvidences?.length || 0}
                          </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                          <FileCheck className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Days Active</p>
                          <p className="text-lg font-bold text-black">
                            {Math.floor((new Date().getTime() - new Date(rectification.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                          </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                          <Timer className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Analytics Charts */}
              {rectification && (rectification.AuditRectificationAmendmentHistories?.length > 0 || rectification.AuditRectificationEvidences?.length > 0) && (
                <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Status Distribution Chart */}
                  {rectification.AuditRectificationAmendmentHistories?.length > 0 && (
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-black">
                          <PieChartIcon className="h-5 w-5 text-red-600" />
                          Amendment Status Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={getStatusDistributionData()}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {getStatusDistributionData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap gap-2 mt-4 justify-center">
                          {getStatusDistributionData().map((item, index) => (
                            <div key={index} className="flex items-center gap-1">
                              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }} />
                              <span className="text-xs text-gray-600">{item.name}: {item.value}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Amendment Timeline Chart */}
                  {rectification.AuditRectificationAmendmentHistories?.length > 1 && (
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-black">
                          <TrendingUp className="h-5 w-5 text-red-600" />
                          Amendment Timeline
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                          <AreaChart data={getAmendmentTimelineData()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Area 
                              type="monotone" 
                              dataKey="status" 
                              stroke="#EF4444" 
                              fill="url(#colorGradient)" 
                              strokeWidth={2}
                            />
                            <defs>
                              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}

                  {/* File Type Distribution */}
                  {rectification.AuditRectificationEvidences?.length > 0 && (
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-black">
                          <BarChart3 className="h-5 w-5 text-red-600" />
                          File Types
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={getFileTypeDistribution()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#DC2626" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}

              {/* Rectification Status and Actions */}
              {rectification ? (
                <motion.div variants={fadeInUp}>
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full -mr-32 -mt-32" />
                    <CardHeader className="relative">
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-3 text-black">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <FileText className="h-6 w-6 text-red-600" />
                          </motion.div>
                          Rectification Status
                        </span>
                        <div className="flex items-center gap-3">
                          {getRectificationStatusBadge(rectification.status)}
                          <div className="flex gap-2">
                            {(canAmendRectification() && isAmenButton) && (
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={initializeAmendmentForm}
                                  disabled={actionLoading}
                                  className="border-blue-300 text-blue-700 hover:bg-blue-50 transition-all duration-300"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Amend
                                </Button>
                              </motion.div>
                            )}
                            {(canApproveRectification() && isApproveRectificationButton) && (
                              <>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    size="sm"
                                    onClick={handleApproveRectification}
                                    disabled={actionLoading}
                                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all duration-300"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => setShowRejectDialog(true)}
                                    disabled={actionLoading}
                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Audit Addendum
                                  </Button>
                                </motion.div>
                              </>
                            )}
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </motion.div>
              ) : (
                canCreateRectification() && (
                  <motion.div variants={fadeInUp}>
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-red-50 via-white to-gray-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-black">
                          <FileCheck className="h-6 w-6 text-red-600" />
                          Create Rectification
                        </CardTitle>
                        <CardDescription>
                          No rectification has been created for this finding yet. You can create one below.
                        </CardDescription>
                      </CardHeader>


                       {isCreateRectficationButton && ( <CardContent>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            onClick={() => setIsEditing(true)}
                            disabled={actionLoading}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300"
                          >
                            <FilePlus className="h-4 w-4 mr-2" />
                            Create Rectification
                          </Button>
                        </motion.div>
                      </CardContent>
                             )}

                    </Card>
                  </motion.div>
                )
              )}

              {/* Rectification Details */}
              {rectification && (
                <motion.div variants={fadeInUp}>
                  <Card className="border-0 shadow-xl bg-white overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-red-500 via-black to-red-500" />
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-black">
                        <FileText className="h-6 w-6 text-red-600" />
                        Rectification Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl">
                          <div className="p-3 bg-red-100 rounded-full">
                            <UserCheck className="h-6 w-6 text-red-600" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Submitted By</div>
                            <div className="font-semibold text-black">{rectification.submittedBy?.username || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">{rectification.submittedBy?.role?.replace(/_/g, ' ')}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl">
                          <div className="p-3 bg-gray-100 rounded-full">
                            <Calendar className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Submitted On</div>
                            <div className="font-semibold text-black">{formatDate(rectification.created_at)}</div>
                            <div className="text-xs text-gray-500">{formatTime(rectification.created_at)}</div>
                          </div>
                        </div>
                      </motion.div>

                      <Separator className="my-6" />

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="text-sm text-gray-500 mb-3 font-medium">Rectification Description</div>
                        <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                          <p className="text-gray-700 leading-relaxed">{rectification.rectification_text}</p>
                        </div>
                      </motion.div>

                      {rectification.reason && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <div className="text-sm text-red-600 mb-3 font-medium flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Audit Addendum
                          </div>
                          <div className="bg-gradient-to-r from-red-50 to-white border border-red-200 p-4 rounded-xl">
                            <p className="text-red-700">{rectification.reason}</p>
                          </div>
                        </motion.div>
                      )}

                      {rectification.approved_by_id && rectification.approvedBy && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-white rounded-xl border border-green-200"
                        >
                          <CheckCircle className="h-6 w-6 text-green-500" />
                          <div>
                            <div className="text-sm text-gray-500">Approved By</div>
                            <div className="font-semibold text-black">{rectification.approvedBy.username}</div>
                            <div className="text-xs text-gray-500">
                              {rectification.approved_at && `on ${formatDate(rectification.approved_at)}`}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {(canAmendRectification() && isAmendRectificationButton )&& (
                        <>
                          <Separator className="my-6" />
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex justify-end"
                          >
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                onClick={() => {
                                  setIsEditing(true);
                                  setEditText(rectification.rectification_text);
                                }}
                                disabled={actionLoading}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-300"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Amend Rectification
                              </Button>
                            </motion.div>
                          </motion.div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Evidence Files with Enhanced Design */}
              {rectification && rectification.AuditRectificationEvidences && rectification.AuditRectificationEvidences.length > 0 && (
                <motion.div variants={fadeInUp}>
                  <Card className="border-0 shadow-xl bg-white overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600" />
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-black">
                        <Upload className="h-6 w-6 text-green-600" />
                        Evidence Files History
                        <Badge className="bg-green-100 text-green-800">
                          {rectification.AuditRectificationEvidences.length} file{rectification.AuditRectificationEvidences.length !== 1 ? 's' : ''}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Complete history of all evidence files uploaded for this rectification
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <AnimatePresence>
                          {rectification.AuditRectificationEvidences
                            .slice()
                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .map((evidence, index) => (
                            <motion.div 
                              key={evidence.evidence_id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.01 }}
                              className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <motion.div 
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex-shrink-0 p-2 bg-gray-100 rounded-lg"
                                  >
                                    <FileText className="h-5 w-5 text-gray-600" />
                                  </motion.div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 truncate">
                                      {evidence.rectification_file_name}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        {evidence.rectification_file_type}
                                      </Badge>
                                      <span>•</span>
                                      <span>Uploaded {formatDate(evidence.created_at)}</span>
                                      {index === 0 && (
                                        <Badge className="bg-blue-100 text-blue-700">
                                          Latest
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <motion.div 
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex gap-2 flex-shrink-0"
                                >
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDownloadEvidence(evidence)}
                                    className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                  </Button>
                                </motion.div>
                              </div>
                              <RectificationFilePreview evidence={evidence} />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      {/* File History Summary with Animation */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 pt-6 border-t bg-gradient-to-r from-gray-50 to-white rounded-xl p-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <div className="font-semibold text-black text-lg">{rectification.AuditRectificationEvidences.length}</div>
                            <div>Total files</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <div className="font-semibold text-black text-lg">
                              {formatDate(
                                rectification.AuditRectificationEvidences
                                  .slice()
                                  .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0]?.created_at
                              )}
                            </div>
                            <div>First uploaded</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <div className="font-semibold text-black text-lg">
                              {formatDate(
                                rectification.AuditRectificationEvidences
                                  .slice()
                                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.created_at
                              )}
                            </div>
                            <div>Latest upload</div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex flex-wrap gap-2 justify-center">
                            {Array.from(new Set(rectification.AuditRectificationEvidences.map(e => e.rectification_file_type)))
                              .map(fileType => {
                                const count = rectification.AuditRectificationEvidences.filter(e => e.rectification_file_type === fileType).length;
                                return (
                                  <motion.span 
                                    key={fileType}
                                    whileHover={{ scale: 1.1 }}
                                    className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium shadow-sm"
                                  >
                                    {fileType.split('/')[1]?.toUpperCase() || fileType}: {count}
                                  </motion.span>
                                );
                              })}
                          </div>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Amendment History with Timeline Design */}
              {rectification && rectification.AuditRectificationAmendmentHistories && rectification.AuditRectificationAmendmentHistories.length > 0 && (
                <motion.div variants={fadeInUp}>
                  <Card className="border-0 shadow-xl bg-white overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600" />
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-black">
                        <History className="h-6 w-6 text-purple-600" />
                        Amendment History Timeline
                        <Badge className="bg-purple-100 text-purple-800">
                          {rectification.AuditRectificationAmendmentHistories.length} amendment{rectification.AuditRectificationAmendmentHistories.length !== 1 ? 's' : ''}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Complete chronological history of all amendments and changes
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <AnimatePresence>
                          {rectification.AuditRectificationAmendmentHistories
                            .slice()
                            .sort((a, b) => new Date(b.amended_at).getTime() - new Date(a.amended_at).getTime())
                            .map((amendment, index) => (
                            <motion.div 
                              key={amendment.amendment_id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: index * 0.1 }}
                              className="relative"
                            >
                              {/* Timeline Line */}
                              {index !== rectification.AuditRectificationAmendmentHistories.length - 1 && (
                                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 to-transparent" />
                              )}
                              
                              <motion.div 
                                whileHover={{ scale: 1.01 }}
                                className="border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50 overflow-hidden"
                              >
                                <div
                                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                  onClick={() => setExpandedAmendments(prev => ({
                                    ...prev,
                                    [amendment.amendment_id]: !prev[amendment.amendment_id]
                                  }))}
                                >
                                  <div className="flex items-center gap-3">
                                    <motion.div 
                                      whileHover={{ rotate: 180 }}
                                      transition={{ duration: 0.3 }}
                                      className="flex-shrink-0 p-2 bg-purple-100 rounded-full"
                                    >
                                      {expandedAmendments[amendment.amendment_id] ? (
                                        <ChevronDown className="h-4 w-4 text-purple-600" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 text-purple-600" />
                                      )}
                                    </motion.div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <div className="font-semibold text-gray-900">
                                          Amendment #{rectification.AuditRectificationAmendmentHistories.length - index}
                                        </div>
                                        {index === 0 && (
                                          <Badge className="bg-blue-100 text-blue-700">
                                            Latest
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="text-sm text-gray-500 mt-1">
                                        by {amendment.amendedBy?.username || 'Unknown'} • {formatDate(amendment.amended_at)} at {formatTime(amendment.amended_at)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0">
                                    <Badge className={
                                      amendment.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                      amendment.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                      'bg-yellow-100 text-yellow-800'
                                    }>
                                      {amendment.status}
                                    </Badge>
                                  </div>
                                </div>

                                <AnimatePresence>
                                  {expandedAmendments[amendment.amendment_id] && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="border-t bg-gradient-to-r from-gray-50 to-white"
                                    >
                                      <div className="p-4 space-y-3">
                                        {(() => {
                                          const sortedAmendments = rectification.AuditRectificationAmendmentHistories
                                            .slice()
                                            .sort((a, b) => new Date(b.amended_at).getTime() - new Date(a.amended_at).getTime());

                                          const currentIndex = sortedAmendments.findIndex(a => a.amendment_id === amendment.amendment_id);
                                          const previousAmendment = sortedAmendments[currentIndex + 1];

                                          if (!previousAmendment) return null;

                                          const changes = detectChanges(amendment, previousAmendment);

                                          if (changes.length === 0) return null;

                                          return (
                                            <motion.div 
                                              initial={{ opacity: 0 }}
                                              animate={{ opacity: 1 }}
                                              className="mb-4"
                                            >
                                              <div className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                                                <Zap className="h-4 w-4" />
                                                Changes Made from Previous Amendment
                                              </div>

                                              {changes.map((change, changeIndex) => (
                                                <motion.div 
                                                  key={changeIndex}
                                                  initial={{ opacity: 0, y: 10 }}
                                                  animate={{ opacity: 1, y: 0 }}
                                                  transition={{ delay: changeIndex * 0.1 }}
                                                  className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2"
                                                >
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
                                                </motion.div>
                                              ))}
                                            </motion.div>
                                          );
                                        })()}

                                        <div>
                                          <div className="text-sm font-medium text-gray-700 mb-1">Rectification Description</div>
                                          <div className="bg-white p-3 rounded-lg border text-sm">
                                            {amendment.rectification}
                                          </div>
                                        </div>

                                        {amendment.rejection_reason && (
                                          <div>
                                            <div className="text-sm font-medium text-red-700 mb-1">Audit Addendum</div>
                                            <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-sm text-red-700">
                                              {amendment.rejection_reason}
                                            </div>
                                          </div>
                                        )}

                                        <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
                                          <span>Amended by: {amendment.amendedBy?.username || 'Unknown'}</span>
                                          <span>Role: {amendment.amendedBy?.role?.replace(/_/g, ' ')}</span>
                                          <span>Department: {amendment.amendedBy?.department}</span>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      {/* Amendment History Summary */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 pt-6 border-t bg-gradient-to-r from-gray-50 to-white rounded-xl p-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <div className="font-semibold text-black text-lg">{rectification.AuditRectificationAmendmentHistories.length}</div>
                            <div>Total amendments</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <div className="font-semibold text-black text-lg">
                              {formatDate(
                                rectification.AuditRectificationAmendmentHistories
                                  .slice()
                                  .sort((a, b) => new Date(a.amended_at).getTime() - new Date(b.amended_at).getTime())[0]?.amended_at
                              )}
                            </div>
                            <div>First amendment</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <div className="font-semibold text-black text-lg">
                              {formatDate(
                                rectification.AuditRectificationAmendmentHistories
                                  .slice()
                                  .sort((a, b) => new Date(b.amended_at).getTime() - new Date(a.amended_at).getTime())[0]?.amended_at
                              )}
                            </div>
                            <div>Latest amendment</div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex flex-wrap gap-2 justify-center">
                            {Array.from(new Set(rectification.AuditRectificationAmendmentHistories.map(a => a.status)))
                              .map(status => {
                                const count = rectification.AuditRectificationAmendmentHistories.filter(a => a.status === status).length;
                                const statusColor = status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' :
                                                  status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                                  'bg-yellow-100 text-yellow-700 border-yellow-200';
                                return (
                                  <motion.span 
                                    key={status}
                                    whileHover={{ scale: 1.1 }}
                                    className={`px-3 py-1 border rounded-full text-xs font-medium ${statusColor}`}
                                  >
                                    {status}: {count}
                                  </motion.span>
                                );
                              })}
                          </div>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keep all existing dialogs with enhanced styling */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-red-600" />
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
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
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
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
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


