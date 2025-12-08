// import { useState, useEffect } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { toast } from 'sonner';
// import {
//   ArrowLeft,
//   Edit,
//   Trash2,
//   FileText,
//   CheckCircle,
//   XCircle,
//   AlertTriangle,
//   User,
//   Calendar,
//   DollarSign,
//   Shield,
//   Tag,
//   History,
//   ChevronDown,
//   ChevronRight,
//   Users,
//   Clock,
//   Timer,
//   File,
//   Download,
//   Eye,
//   FileText as FileIcon,
//   Image,
//   X
// } from 'lucide-react';
// import {
//   AuditFinding,
//   AUDIT_FINDING_STATUSES,
//   RECTIFICATION_STATUSES
// } from '@/types/auditFinding';
// import { User as UserType } from '@/types/user';
// import { BranchAssignmentModal } from './BranchAssignmentModal';
// import { UserAssignmentModal } from './UserAssignmentModal';

// interface AuditFindingDetailProps {
//   user: UserType;
//   findingId: string;
//   onEdit?: (finding: AuditFinding) => void;
//   onBack?: () => void;
//   onInitiateRectification?: (finding: AuditFinding) => void;
// }

// export const AuditFindingDetail = ({ 
//   user, 
//   findingId, 
//   onEdit, 
//   onBack,
//   onInitiateRectification 
// }: AuditFindingDetailProps) => {
//   const { api } = useAuth();

//   // Add null check for user
//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   const [finding, setFinding] = useState<AuditFinding | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [expandedAmendments, setExpandedAmendments] = useState<{ [key: string]: boolean }>({});

//   // File preview state
//   const [previewFile, setPreviewFile] = useState<{
//     url: string;
//     name: string;
//     type: string;
//   } | null>(null);
//   const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

//   // Assignment modal states
//   const [branchAssignmentModalOpen, setBranchAssignmentModalOpen] = useState(false);
//   const [userAssignmentModalOpen, setUserAssignmentModalOpen] = useState(false);

//   // Permission check functions
//   const canAssignToBranch = () => {
//     if (!finding) return false;
//     const auditorRoles = ['Resident_Auditors', 'IT_Auditors', 'Inspection_Auditors', 'Audit_Supervisor', 'IT_Auditors_Supervisor', 'Inspection_Auditors_Supervisor'];
//     return auditorRoles.includes(user.role) && !finding.assigned_branch_id;
//   };

//   const canAssignToUser = () => {
//     if (!finding) return false;
//     const supervisorRoles = ['Auditee_Supervisor', 'IT_Auditees_Supervisor', 'Inspection_Auditees_Supervisor'];
//     return supervisorRoles.includes(user.role) &&
//            finding.assigned_branch_id &&
//            finding.branch_supervisor_id === user.id &&
//            (!finding.AuditFindingAssigneds || finding.AuditFindingAssigneds.length === 0);
//   };

//   // Countdown state
//   const [countdown, setCountdown] = useState<{
//     days: number;
//     hours: number;
//     minutes: number;
//     seconds: number;
//     milliseconds: number;
//     isOverdue: boolean;
//     urgencyLevel: 'green' | 'yellow' | 'red';
//   } | null>(null);

//   // Permissions removed - universal access for all users

//   // Fetch finding details
//   const fetchFinding = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get(`ZAMS/api/audit-findings/${findingId}`);
//       setFinding(response.data);
//     } catch (error) {
//       console.error('Error fetching audit finding:', error);
//       toast.error('Failed to fetch audit finding details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFinding();
//   }, [findingId]);

//   // Countdown timer effect
//   useEffect(() => {
//     if (!finding?.due_date || finding.status === 'Resolved') {
//       setCountdown(null);
//       return;
//     }

//     const updateCountdown = () => {
//       const countdownData = calculateCountdown(finding.due_date!);
//       setCountdown(countdownData);
//     };

//     // Update immediately
//     updateCountdown();

//     // Update every 100ms for smooth animation
//     const interval = setInterval(updateCountdown, 100);

//     // Cleanup interval on unmount or when due_date or status changes
//     return () => clearInterval(interval);
//   }, [finding?.due_date, finding?.status]);

//   // Handle delete
//   const handleDelete = async () => {
//     if (!finding) return;
    
//     setActionLoading(true);
//     try {
//       await api.delete(`ZAMS/api/audit-findings/${finding.id}`);
//       toast.success('Audit finding deleted successfully');
//       setDeleteDialogOpen(false);
//       if (onBack) onBack();
//     } catch (error: any) {
//       console.error('Error deleting audit finding:', error);
//       const errorMessage = error.response?.data?.error || 'Failed to delete audit finding';
//       toast.error(errorMessage);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Handle rectification approval
//   const handleApproveRectification = async () => {
//     if (!finding) return;
    
//     setActionLoading(true);
//     try {
//       await api.put(`/ZAMS/api/audit-findings/${finding.id}/rectify/approve`);
//       toast.success('Rectification approved successfully');
//       fetchFinding(); // Refresh data
//     } catch (error: any) {
//       console.error('Error approving rectification:', error);
//       const errorMessage = error.response?.data?.error || 'Failed to approve rectification';
//       toast.error(errorMessage);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Handle rectification rejection
//   const handleRejectRectification = async () => {
//     if (!finding) return;
    
//     setActionLoading(true);
//     try {
//       await api.put(`/ZAMS/api/audit-findings/${finding.id}/rectify/reject`, {
//         rejection_reason: 'Rectification does not meet requirements'
//       });
//       toast.success('Rectification rejected');
//       fetchFinding(); // Refresh data
//     } catch (error: any) {
//       console.error('Error rejecting rectification:', error);
//       const errorMessage = error.response?.data?.error || 'Failed to reject rectification';
//       toast.error(errorMessage);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Get status badge
//   const getStatusBadge = (status: string) => {
//     const statusConfig = AUDIT_FINDING_STATUSES.find(s => s.value === status);
//     return (
//       <Badge className={statusConfig?.color || 'bg-gray-100 text-gray-800'}>
//         {statusConfig?.label || status}
//       </Badge>
//     );
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

//   // Format currency
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'ETB',
//       minimumFractionDigits: 0
//     }).format(amount);
//   };

//   // Format date
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Format time helper
//   const formatTime = (dateString: string) => {
//     return new Date(dateString).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Calculate countdown for due date
//   const calculateCountdown = (dueDate: string) => {
//     const now = new Date().getTime();
//     const due = new Date(dueDate).getTime();
//     const difference = due - now;

//     if (difference <= 0) {
//       return {
//         days: 0,
//         hours: 0,
//         minutes: 0,
//         seconds: 0,
//         milliseconds: 0,
//         isOverdue: true,
//         urgencyLevel: 'red' as const
//       };
//     }

//     const days = Math.floor(difference / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((difference % (1000 * 60)) / 1000);
//     const milliseconds = difference % 1000;

//     // Determine urgency level
//     const totalHours = days * 24 + hours;
//     let urgencyLevel: 'green' | 'yellow' | 'red';

//     if (totalHours < 24) {
//       urgencyLevel = 'red';
//     } else if (totalHours < 72) { // Less than 3 days
//       urgencyLevel = 'yellow';
//     } else {
//       urgencyLevel = 'green';
//     }

//     return {
//       days,
//       hours,
//       minutes,
//       seconds,
//       milliseconds,
//       isOverdue: false,
//       urgencyLevel
//     };
//   };

//   // Helper function to detect changes between amendments
//   const detectChanges = (currentAmendment: any, previousAmendment: any) => {
//     const changes: Array<{ field: string; before: string; after: string }> = [];

//     const fieldsToCheck = [
//       { key: 'title', label: 'Title' },
//       { key: 'description', label: 'Description' },
//       { key: 'criteria', label: 'Criteria' },
//       { key: 'cause', label: 'Cause' },
//       { key: 'impact', label: 'Impact' },
//       { key: 'recommendation', label: 'Recommendation' },
//       { key: 'amount', label: 'Amount' },
//       { key: 'status', label: 'Status' }
//     ];

//     fieldsToCheck.forEach(field => {
//       const currentValue = currentAmendment[field.key];
//       const previousValue = previousAmendment[field.key];

//       if (currentValue !== previousValue) {
//         changes.push({
//           field: field.label,
//           before: previousValue || '',
//           after: currentValue || ''
//         });
//       }
//     });

//     return changes;
//   };

//   // File handling functions
//   const downloadFile = async (evidenceId: string, fileName: string) => {
//     try {
//       const response = await api.get(`ZAMS/api/audit-findings/evidence/${evidenceId}/download`, {
//         responseType: 'blob'
//       });

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', fileName);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//       toast.success('File downloaded successfully');
//     } catch (error) {
//       console.error('Error downloading file:', error);
//       toast.error('Failed to download file');
//     }
//   };

//   const previewFileHandler = async (evidenceId: string, fileName: string, mimeType: string) => {
//     try {
//       const response = await api.get(`ZAMS/api/audit-findings/evidence/${evidenceId}/download`, {
//         responseType: 'blob'
//       });

//       const url = window.URL.createObjectURL(new Blob([response.data], { type: mimeType }));
//       setPreviewFile({
//         url,
//         name: fileName,
//         type: mimeType
//       });
//       setPreviewDialogOpen(true);
//     } catch (error) {
//       console.error('Error previewing file:', error);
//       toast.error('Failed to preview file');
//     }
//   };

//   const closePreview = () => {
//     if (previewFile?.url) {
//       window.URL.revokeObjectURL(previewFile.url);
//     }
//     setPreviewFile(null);
//     setPreviewDialogOpen(false);
//   };

//   const getFileIcon = (mimeType: string) => {
//     if (mimeType.startsWith('image/')) {
//       return <Image className="h-4 w-4 text-blue-600" />;
//     } else if (mimeType === 'application/pdf') {
//       return <FileIcon className="h-4 w-4 text-red-600" />;
//     } else if (mimeType.includes('document') || mimeType.includes('word')) {
//       return <FileIcon className="h-4 w-4 text-blue-600" />;
//     } else {
//       return <File className="h-4 w-4 text-gray-600" />;
//     }
//   };

//   const canPreviewFile = (mimeType: string) => {
//     return mimeType === 'application/pdf' || mimeType.startsWith('image/');
//   };

//   // Check if user can approve/reject rectification
//   const canApproveRectification = (finding: AuditFinding) => {
//     if (user.role === 'Admin') return true;
//     if (finding.created_by_id === user.id) return true;
    
//     const supervisorRoles = ['Audit_Supervisor', 'IT_Auditors_Supervisor', 'Inspection_Auditors_Supervisor'];
//     const directorRoles = ['Audit_Director', 'IT_Auditors_Director', 'Inspection_Auditors_Director'];
    
//     if ((supervisorRoles.includes(user.role) || directorRoles.includes(user.role)) && 
//         finding.createdBy?.department === user.department) {
//       return true;
//     }
    
//     return false;
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto py-6">
//         <div className="flex items-center justify-center py-8">
//           <div className="text-gray-500">Loading...</div>
//         </div>
//       </div>
//     );
//   }

//   if (!finding) {
//     return (
//       <div className="container mx-auto py-6">
//         <div className="text-center py-8">
//           <div className="text-gray-500">Audit finding not found</div>
//           {onBack && (
//             <Button onClick={onBack} className="mt-4">
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to List
//             </Button>
//           )}
//         </div>
//       </div>
//     );
//   }

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
//               <h1 className="text-2xl font-bold text-gray-900">{finding.title}</h1>
//               <p className="text-gray-600">Audit Finding Details</p>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-2">
//             {getStatusBadge(finding.status)}
            
//             {/* Action Buttons */}
//             <div className="flex gap-2 ml-4">
//               {onEdit && (
//                 <Button variant="outline" onClick={() => onEdit(finding)}>
//                   <Edit className="h-4 w-4 mr-2" />
//                   Edit
//                 </Button>
//               )}

//               {finding.status === 'Pending' &&
//                onInitiateRectification && (
//                 <Button onClick={() => onInitiateRectification(finding)}>
//                   <FileText className="h-4 w-4 mr-2" />
//                   Initiate Rectification
//                 </Button>
//               )}

//               {/* Branch Assignment Button - For Auditors */}
//               {/* {canAssignToBranch() && (
//                 <Button
//                   variant="outline"
//                   onClick={() => setBranchAssignmentModalOpen(true)}
//                 >
//                   <Users className="h-4 w-4 mr-2" />
//                   Assign to Branch
//                 </Button>
//               )} */}

//               {/* User Assignment Button - For Branch Supervisors */}
//               {canAssignToUser() && (
//                 <Button
//                   variant="outline"
//                   onClick={() => setUserAssignmentModalOpen(true)}
//                 >
//                   <User className="h-4 w-4 mr-2" />
//                   Assign to User
//                 </Button>
//               )}

//               {(
//                 <Button
//                   variant="destructive"
//                   onClick={() => setDeleteDialogOpen(true)}
//                 >
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Delete
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Real-Time Due Date Countdown - Only show for non-resolved findings */}
//       {finding.due_date && countdown && finding.status !== 'Resolved' && (
//         <Card className="mb-6">
//           <CardContent className="p-4">
//             <div className={`flex items-center justify-between p-4 rounded-lg ${
//               countdown.urgencyLevel === 'red' ? 'bg-red-50 border border-red-200' :
//               countdown.urgencyLevel === 'yellow' ? 'bg-yellow-50 border border-yellow-200' :
//               'bg-green-50 border border-green-200'
//             }`}>
//               <div className="flex items-center gap-3">
//                 <div className={`p-2 rounded-full ${
//                   countdown.urgencyLevel === 'red' ? 'bg-red-100' :
//                   countdown.urgencyLevel === 'yellow' ? 'bg-yellow-100' :
//                   'bg-green-100'
//                 }`}>
//                   <Timer className={`h-5 w-5 ${
//                     countdown.urgencyLevel === 'red' ? 'text-red-600' :
//                     countdown.urgencyLevel === 'yellow' ? 'text-yellow-600' :
//                     'text-green-600'
//                   }`} />
//                 </div>
//                 <div>
//                   <div className="font-medium text-gray-900">
//                     {countdown.isOverdue ? 'OVERDUE' : 'Time Remaining'}
//                   </div>
//                   <div className="text-sm font-medium text-gray-700 mt-1">
//                     Due Date: {formatDate(finding.due_date)}
//                   </div>
//                 </div>
//               </div>

//               <div className="text-right">
//                 {countdown.isOverdue ? (
//                   <div className="text-lg font-bold text-red-600">
//                     OVERDUE
//                   </div>
//                 ) : (
//                   <div className={`text-lg font-mono font-bold ${
//                     countdown.urgencyLevel === 'red' ? 'text-red-600' :
//                     countdown.urgencyLevel === 'yellow' ? 'text-yellow-600' :
//                     'text-green-600'
//                   }`}>
//                     {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s {countdown.milliseconds}ms
//                   </div>
//                 )}
//                 <div className={`text-xs font-medium mt-1 ${
//                   countdown.urgencyLevel === 'red' ? 'text-red-500' :
//                   countdown.urgencyLevel === 'yellow' ? 'text-yellow-500' :
//                   'text-green-500'
//                 }`}>
//                   {countdown.urgencyLevel === 'red' ? 'URGENT - Less than 24 hours' :
//                    countdown.urgencyLevel === 'yellow' ? 'ATTENTION - Less than 3 days' :
//                    'ON TRACK - More than 3 days'}
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Due Date Display for Resolved Findings */}
//       {finding.due_date && finding.status === 'Resolved' && (
//         <Card className="mb-6">
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 rounded-full bg-gray-100">
//                   <Clock className="h-5 w-5 text-gray-600" />
//                 </div>
//                 <div>
//                   <div className="font-medium text-gray-900">
//                     Finding Resolved
//                   </div>
//                   <div className="text-sm font-medium text-gray-700 mt-1">
//                     Original Due Date: {formatDate(finding.due_date)}
//                   </div>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <div className="text-lg font-bold text-green-600">
//                   COMPLETED
//                 </div>
//                 <div className="text-xs font-medium mt-1 text-green-500">
//                   No action required
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main Content */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Basic Information */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Finding Details</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <h4 className="font-medium text-gray-900 mb-2">Description</h4>
//                 <p className="text-gray-700">{finding.description}</p>
//               </div>
              
//               <Separator />
              
//               <div>
//                 <h4 className="font-medium text-gray-900 mb-2">Criteria</h4>
//                 <p className="text-gray-700">{finding.criteria}</p>
//               </div>
              
//               <Separator />
              
//               <div>
//                 <h4 className="font-medium text-gray-900 mb-2">Cause</h4>
//                 <p className="text-gray-700">{finding.cause}</p>
//               </div>
              
//               <Separator />
              
//               <div>
//                 <h4 className="font-medium text-gray-900 mb-2">Impact</h4>
//                 <p className="text-gray-700">{finding.impact}</p>
//               </div>
              
//               <Separator />
              
//               <div>
//                 <h4 className="font-medium text-gray-900 mb-2">Recommendation</h4>
//                 <p className="text-gray-700">{finding.recommendation}</p>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Evidence Files Section */}
//           {finding.evidences && finding.evidences.length > 0 && (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <FileIcon className="h-5 w-5" />
//                   Evidence Files
//                 </CardTitle>
//                 <CardDescription>
//                   Supporting documents and evidence files for this audit finding
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   {finding.evidences.map((evidence) => (
//                     <div
//                       key={evidence.evidence_id}
//                       className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
//                     >
//                       <div className="flex items-center gap-3 flex-1 min-w-0">
//                         {getFileIcon(evidence.mime_type)}
//                         <div className="flex-1 min-w-0">
//                           <div className="font-medium text-sm text-gray-900 truncate">
//                             {evidence.original_file_name}
//                           </div>
//                           <div className="text-xs text-gray-500 mt-1">
//                             {(evidence.file_size / 1024 / 1024).toFixed(2)} MB •
//                             Uploaded by {evidence.uploadedBy?.username} •
//                             {new Date(evidence.created_at).toLocaleDateString()}
//                           </div>
//                           {evidence.description && (
//                             <div className="text-xs text-gray-600 mt-1 italic">
//                               {evidence.description}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2 ml-3">
//                         {canPreviewFile(evidence.mime_type) && (
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => previewFileHandler(
//                               evidence.evidence_id,
//                               evidence.original_file_name,
//                               evidence.mime_type
//                             )}
//                             className="h-8 w-8 p-0"
//                             title="Preview file"
//                           >
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                         )}
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => downloadFile(
//                             evidence.evidence_id,
//                             evidence.original_file_name
//                           )}
//                           className="h-8 w-8 p-0"
//                           title="Download file"
//                         >
//                           <Download className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Rectification Section */}
//           {finding.AuditFindingRectification && (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <FileText className="h-5 w-5" />
//                   Rectification
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h4 className="font-medium text-gray-900">Status</h4>
//                     <div className="mt-1">
//                       {getRectificationStatusBadge(finding.AuditFindingRectification.status)}
//                     </div>
//                   </div>

//                   {canApproveRectification(finding) &&
//                    finding.AuditFindingRectification.status === 'Pending' && (
//                     <div className="flex gap-2">
//                       <Button
//                         size="sm"
//                         onClick={handleApproveRectification}
//                         disabled={actionLoading}
//                       >
//                         <CheckCircle className="h-4 w-4 mr-2" />
//                         Approve
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="destructive"
//                         onClick={handleRejectRectification}
//                         disabled={actionLoading}
//                       >
//                         <XCircle className="h-4 w-4 mr-2" />
//                         Reject
//                       </Button>
//                     </div>
//                   )}
//                 </div>

//                 <Separator />

//                 <div>
//                   <h4 className="font-medium text-gray-900 mb-2">Description</h4>
//                   <p className="text-gray-700">{finding.AuditFindingRectification.description}</p>
//                 </div>

//                 {finding.AuditFindingRectification.rejection_reason && (
//                   <>
//                     <Separator />
//                     <div>
//                       <h4 className="font-medium text-red-900 mb-2">Rejection Reason</h4>
//                       <p className="text-red-700">{finding.AuditFindingRectification.rejection_reason}</p>
//                     </div>
//                   </>
//                 )}

//                 <div className="text-sm text-gray-500">
//                   Submitted on {formatDate(finding.AuditFindingRectification.createdAt)}
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Amendment History - Chronological Order */}
//           {finding.AuditAmendmentHistories && finding.AuditAmendmentHistories.length > 0 && (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <History className="h-5 w-5" />
//                   Amendment History
//                   <span className="text-sm font-normal text-gray-500">
//                     ({finding.AuditAmendmentHistories.length} amendment{finding.AuditAmendmentHistories.length !== 1 ? 's' : ''})
//                   </span>
//                 </CardTitle>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Complete chronological history of all amendments and changes
//                 </p>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {/* Sort amendments by amended_at date (newest first) for chronological order */}
//                   {finding.AuditAmendmentHistories
//                     .slice()
//                     .sort((a, b) => new Date(b.amended_at).getTime() - new Date(a.amended_at).getTime())
//                     .map((amendment, index) => {
//                       const isExpanded = expandedAmendments[amendment.amendment_id];
//                       const previousAmendment = index < finding.AuditAmendmentHistories!.length - 1
//                         ? finding.AuditAmendmentHistories![index + 1]
//                         : null;
//                       const changes = previousAmendment ? detectChanges(amendment, previousAmendment) : [];

//                       return (
//                         <div key={amendment.amendment_id} className="border rounded-md hover:bg-gray-50 transition-colors">
//                           <div
//                             className="flex items-center justify-between p-3 cursor-pointer"
//                             onClick={() => setExpandedAmendments(prev => ({
//                               ...prev,
//                               [amendment.amendment_id]: !prev[amendment.amendment_id]
//                             }))}
//                           >
//                             <div className="flex items-center gap-3">
//                               <div className="flex-shrink-0">
//                                 {isExpanded ? (
//                                   <ChevronDown className="h-4 w-4 text-gray-400" />
//                                 ) : (
//                                   <ChevronRight className="h-4 w-4 text-gray-400" />
//                                 )}
//                               </div>
//                               <div className="flex-1 min-w-0">
//                                 <div className="flex items-center gap-2">
//                                   <div className="font-medium text-gray-900">
//                                     Amendment #{finding.AuditAmendmentHistories!.length - index}
//                                   </div>
//                                   {index === 0 && (
//                                     <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
//                                       Latest
//                                     </span>
//                                   )}
//                                 </div>
//                                 <div className="text-sm text-gray-500 mt-1">
//                                   by {amendment.amendedBy?.username || 'Unknown'} • {formatDate(amendment.amended_at)} at {formatTime(amendment.amended_at)}
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="flex-shrink-0">
//                               {changes.length > 0 && (
//                                 <Badge variant="secondary" className="bg-blue-50 text-blue-700">
//                                   {changes.length} change{changes.length !== 1 ? 's' : ''}
//                                 </Badge>
//                               )}
//                             </div>
//                           </div>

//                           {isExpanded && (
//                             <div className="border-t p-3 bg-gray-50">
//                               <div className="space-y-3">
//                                 {/* Enhanced Change Detection */}
//                                 {changes.length > 0 && (
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
//                                 )}

//                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                                 <div>
//                                   <div className="text-gray-500 mb-1">Amendment Details:</div>
//                                   <div className="space-y-1">
//                                     <div><span className="font-medium">Status:</span> {amendment.status}</div>
//                                     <div><span className="font-medium">Amount:</span> {formatCurrency(Number(amendment.amount))}</div>
//                                   </div>
//                                 </div>
//                                 <div>
//                                   <div className="text-gray-500 mb-1">User Information:</div>
//                                   <div className="space-y-1">
//                                     <div><span className="font-medium">Role:</span> {amendment.amendedBy?.role?.replace(/_/g, ' ')}</div>
//                                     <div><span className="font-medium">Department:</span> {amendment.amendedBy?.department}</div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                           )}
//                         </div>
//                       );
//                     })}

//                   {/* Amendment History Summary */}
//                   <div className="mt-4 pt-4 border-t bg-gray-50 rounded-md p-3">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
//                       <div>
//                         <span className="font-medium">Total amendments:</span> {finding.AuditAmendmentHistories.length}
//                       </div>
//                       <div>
//                         <span className="font-medium">First amendment:</span> {formatDate(
//                           finding.AuditAmendmentHistories
//                             .slice()
//                             .sort((a, b) => new Date(a.amended_at).getTime() - new Date(b.amended_at).getTime())[0]?.amended_at
//                         )}
//                       </div>
//                       <div>
//                         <span className="font-medium">Latest amendment:</span> {formatDate(
//                           finding.AuditAmendmentHistories
//                             .slice()
//                             .sort((a, b) => new Date(b.amended_at).getTime() - new Date(a.amended_at).getTime())[0]?.amended_at
//                         )}
//                       </div>
//                     </div>

//                     {/* Amendment status distribution */}
//                     <div className="mt-3 pt-3 border-t border-gray-200">
//                       <div className="flex flex-wrap gap-2">
//                         {Array.from(new Set(finding.AuditAmendmentHistories.map(a => a.status).filter(Boolean)))
//                           .map(status => {
//                             const count = finding.AuditAmendmentHistories.filter(a => a.status === status).length;
//                             const statusColor = status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' :
//                                               status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
//                                               status === 'Pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
//                                               'bg-gray-100 text-gray-700 border-gray-200';
//                             return (
//                               <span key={status} className={`px-2 py-1 border rounded-full text-xs ${statusColor}`}>
//                                 {status}: {count}
//                               </span>
//                             );
//                           })}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Assignment Information Section */}
//           {(finding.assignedBranch || (finding.AuditFindingAssigneds && finding.AuditFindingAssigneds.length > 0)) && (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Users className="h-5 w-5 text-green-600" />
//                   Assignment Information
//                 </CardTitle>
//                 <CardDescription>
//                   Branch and user assignment details for this audit finding
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {/* Branch Assignment Information */}
//                   {finding.assignedBranch && (
//                     <div className="border rounded-lg p-4 bg-blue-50">
//                       <h5 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
//                         <Tag className="h-4 w-4" />
//                         Branch Assignment
//                       </h5>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <div className="space-y-2">
//                             <div className="text-sm">
//                               <span className="font-medium">Assigned Branch:</span> {finding.assignedBranch.branch_code} - {finding.assignedBranch.branch_name}
//                             </div>
//                             {finding.branchSupervisor && (
//                               <div className="text-sm">
//                                 <span className="font-medium">Branch Supervisor:</span> {finding.branchSupervisor.username}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                         <div>
//                           <div className="space-y-2">
//                             {finding.branch_assigned_at && (
//                               <div className="flex items-center gap-2">
//                                 <Calendar className="h-4 w-4 text-gray-400" />
//                                 <div>
//                                   <div className="text-sm font-medium">Assigned On</div>
//                                   <div className="text-sm text-gray-600">{formatDate(finding.branch_assigned_at)}</div>
//                                 </div>
//                               </div>
//                             )}
//                             {finding.branchAssignedBy && (
//                               <div className="text-sm">
//                                 <span className="font-medium">Assigned By:</span> {finding.branchAssignedBy.username}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* User Assignment Information */}
//                   {finding.AuditFindingAssigneds && finding.AuditFindingAssigneds.length > 0 && (
//                     <>
//                       {finding.assignedBranch && <Separator />}
//                       {finding.AuditFindingAssigneds.map((assignment, index) => (
//                     <div key={assignment.assigned_id} className="border rounded-lg p-4">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <h5 className="font-medium text-gray-900 mb-2">Assigned To</h5>
//                           <div className="space-y-2">
//                             <div className="flex items-center gap-2">
//                               <User className="h-4 w-4 text-gray-400" />
//                               <div>
//                                 <div className="font-medium">{assignment.assignedToUser?.username || 'Unknown User'}</div>
//                                 <div className="text-sm text-gray-500">{assignment.assignedToUser?.email}</div>
//                               </div>
//                             </div>
//                             <div className="text-sm">
//                               <span className="font-medium">Role:</span> {assignment.assignedToUser?.role?.replace(/_/g, ' ')}
//                             </div>
//                             <div className="text-sm">
//                               <span className="font-medium">Department:</span> {assignment.assignedToUser?.department}
//                             </div>
//                           </div>
//                         </div>

//                         <div>
//                           <h5 className="font-medium text-gray-900 mb-2">Assignment Details</h5>
//                           <div className="space-y-2">
//                             <div className="flex items-center gap-2">
//                               <Calendar className="h-4 w-4 text-gray-400" />
//                               <div>
//                                 <div className="text-sm font-medium">Assigned On</div>
//                                 <div className="text-sm text-gray-600">{formatDate(assignment.assigned_at)}</div>
//                               </div>
//                             </div>
//                             <div className="text-sm">
//                               <span className="font-medium">Assigned By:</span> {assignment.assignedByUser?.username || 'Unknown'}
//                             </div>
//                             <div className="text-sm">
//                               <span className="font-medium">Assigner Role:</span> {assignment.assignedByUser?.role?.replace(/_/g, ' ')}
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {index < finding.AuditFindingAssigneds!.length - 1 && (
//                         <Separator className="mt-4" />
//                       )}
//                     </div>
//                   ))}
//                     </>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* Summary Card */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Summary</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <DollarSign className="h-5 w-5 text-gray-400" />
//                 <div>
//                   <div className="text-sm text-gray-500">Amount</div>
//                   <div className="font-medium">{formatCurrency(finding.amount)}</div>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-3">
//                 <Tag className="h-5 w-5 text-gray-400" />
//                 <div>
//                   <div className="text-sm text-gray-500">Category</div>
//                   <div className="font-medium">{finding.Category?.category_name || '-'}</div>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-3">
//                 <Shield className="h-5 w-5 text-gray-400" />
//                 <div>
//                   <div className="text-sm text-gray-500">Risk Level</div>
//                   <div className="font-medium">{finding.RiskLevel?.risk_level_name || '-'}</div>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-3">
//                 <User className="h-5 w-5 text-gray-400" />
//                 <div>
//                   <div className="text-sm text-gray-500">Created By</div>
//                   <div className="font-medium">{finding.createdBy?.username || '-'}</div>
//                   <div className="text-xs text-gray-500">{finding.createdBy?.role?.replace(/_/g, ' ')}</div>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-3">
//                 <Calendar className="h-5 w-5 text-gray-400" />
//                 <div>
//                   <div className="text-sm text-gray-500">Created</div>
//                   <div className="font-medium">{formatDate(finding.createdAt)}</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* IT Audit Specific Information */}
//           {(finding.SystemVulnerability || finding.ComplianceGap || finding.RelevantStandard) && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>IT Audit Information</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 {finding.SystemVulnerability && (
//                   <div>
//                     <div className="text-sm text-gray-500">System Vulnerability</div>
//                       {/* <div className="font-medium">{finding.SystemVulnerability.vulnerability_name}</div> */}

//                      <div className="text-sm sm:text-base text-gray-800">
//                       <span className="font-semibold">Vulnerability Name:</span>{' '}
//                       {finding.SystemVulnerability.vulnerability_name}
//                     </div>

                  

//                      <div className="text-sm sm:text-base text-gray-800">
//                       <span className="font-semibold">Vulnerability Description:</span>{' '}
//                       {finding.SystemVulnerability.vulnerability_description}
//                     </div>

//                      <div className="text-sm sm:text-base text-gray-800">
//                       <span className="font-semibold">Affected System:</span>{' '}
//                       {finding.SystemVulnerability.affected_systems}
//                     </div>


//                      <div className="text-sm sm:text-base text-gray-800">
//                       <span className="font-semibold">Vulnerability Severity Level:</span>{' '}
//                       {finding.SystemVulnerability.severity_level}
//                     </div>

//                     {/* {finding.SystemVulnerability.vulnerability_description && (
//                       <div className="text-sm text-gray-600 mt-1">{finding.SystemVulnerability.vulnerability_description}</div>
//                     )} */}
//                   </div>
//                 )}

//                 {finding.ComplianceGap && (
//                   <div>
//                     <div className="text-sm text-gray-500">Compliance Gap</div>
//                     {/* <div className="font-medium">{finding.ComplianceGap.gap_name}</div>
//                     {finding.ComplianceGap.gap_description && (
//                       <div className="text-sm text-gray-600 mt-1">{finding.ComplianceGap.gap_description}</div>
//                     )} */}

//                     <div className="text-sm sm:text-base text-gray-800">
//                       <span className="font-semibold">Gap Name:</span>{' '}
//                       {finding.ComplianceGap.gap_name}
//                     </div>
//                       <div className="text-sm sm:text-base text-gray-800">
//                       <span className="font-semibold">Gap Description:</span>{' '}
//                       {finding.ComplianceGap.gap_description}
//                     </div>
//                       <div className="text-sm sm:text-base text-gray-800">
//                       <span className="font-semibold">Regulatory Impact:</span>{' '}
//                       {finding.ComplianceGap.regulatory_impact}
//                     </div>

//                   </div>
//                 )}

//                 {finding.RelevantStandard && (
//                   <div>
//                     <div className="text-sm text-gray-500">Relevant Standard</div>
//                     {/* <div className="font-medium">{finding.RelevantStandard.standard_name}</div>
//                     {finding.RelevantStandard.standard_description && (
//                       <div className="text-sm text-gray-600 mt-1">{finding.RelevantStandard.standard_description}</div>
//                     )} */}

//                      <div className="text-sm sm:text-base text-gray-800">
//                       <span className="font-semibold">Standard Name:</span>{' '}
//                       {finding.RelevantStandard.standard_name}
//                     </div>

//                      <div className="text-sm sm:text-base text-gray-800">
//                       <span className="font-semibold">Standard Description:</span>{' '}
//                       {finding.RelevantStandard.standard_description}
//                     </div>

//                      <div className="text-sm sm:text-base text-gray-800">
//                       <span className="font-semibold">Issuing Body:</span>{' '}
//                       {finding.RelevantStandard.issuing_body}
//                     </div>

//                      <div className="text-sm sm:text-base text-gray-800">
//                       <span className="font-semibold">Version:</span>{' '}
//                       {finding.RelevantStandard.version}
//                     </div>


//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           )}






//            {/* Business Audit Specific Information */}
//             {finding.BusinessComplianceGap && (
//               <div className="border border-gray-300 rounded-lg p-4 space-y-2">
//                 <div className="text-lg text-gray-500 underline">Business Compliance Gap</div>

//                 <div className="text-sm sm:text-base text-gray-800">
//                   <span className="font-semibold">Gap Name:</span>{' '}
//                   {finding.BusinessComplianceGap.gap_name}
//                 </div>

//                 {finding.BusinessComplianceGap.gap_description && (
//                   <div className="text-sm sm:text-base text-gray-800">
//                     <span className="font-semibold">Gap Description:</span>{' '}
//                     {finding.BusinessComplianceGap.gap_description}
//                   </div>
//                 )}

//                 {finding.BusinessComplianceGap.regulatory_impact && (
//                   <div className="text-sm sm:text-base text-gray-800">
//                     <span className="font-semibold">Regulatory Impact:</span>{' '}
//                     {finding.BusinessComplianceGap.regulatory_impact}
//                   </div>
//                 )}
//               </div>
//             )}

//         </div>
//       </div>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <AlertTriangle className="h-5 w-5 text-red-500" />
//               Confirm Deletion
//             </DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete this audit finding? This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button 
//               variant="destructive" 
//               onClick={handleDelete}
//               disabled={actionLoading}
//             >
//               {actionLoading ? 'Deleting...' : 'Delete'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* File Preview Dialog */}
//       <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
//         <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Eye className="h-5 w-5" />
//               File Preview: {previewFile?.name}
//             </DialogTitle>
//           </DialogHeader>
//           <div className="flex-1 overflow-auto">
//             {previewFile && (
//               <div className="w-full h-full min-h-[500px]">
//                 {previewFile.type === 'application/pdf' ? (
//                   <iframe
//                     src={previewFile.url}
//                     className="w-full h-full min-h-[500px] border-0"
//                     title={`Preview of ${previewFile.name}`}
//                   />
//                 ) : previewFile.type.startsWith('image/') ? (
//                   <div className="flex items-center justify-center p-4">
//                     <img
//                       src={previewFile.url}
//                       alt={previewFile.name}
//                       className="max-w-full max-h-full object-contain"
//                       style={{ maxHeight: '70vh' }}
//                     />
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center p-8">
//                     <div className="text-center">
//                       <FileIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                       <p className="text-gray-600">Preview not available for this file type</p>
//                       <p className="text-sm text-gray-500 mt-2">
//                         Click download to view the file
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={closePreview}>
//               <X className="h-4 w-4 mr-2" />
//               Close
//             </Button>
//             {previewFile && (
//               <Button
//                 onClick={() => {
//                   const link = document.createElement('a');
//                   link.href = previewFile.url;
//                   link.download = previewFile.name;
//                   link.click();
//                 }}
//               >
//                 <Download className="h-4 w-4 mr-2" />
//                 Download
//               </Button>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Branch Assignment Modal */}
//       {finding && (
//         <BranchAssignmentModal
//           isOpen={branchAssignmentModalOpen}
//           onClose={() => setBranchAssignmentModalOpen(false)}
//           findingId={finding.id}
//           findingTitle={finding.title}
//           onAssignmentSuccess={() => {
//             fetchFinding();
//             setBranchAssignmentModalOpen(false);
//           }}
//         />
//       )}

//       {/* User Assignment Modal */}
//       {finding && finding.assignedBranch && (
//         <UserAssignmentModal
//           isOpen={userAssignmentModalOpen}
//           onClose={() => setUserAssignmentModalOpen(false)}
//           findingId={finding.id}
//           findingTitle={finding.title}
//           branchId={finding.assignedBranch.id}
//           branchName={finding.assignedBranch.branch_name}
//           onAssignmentSuccess={() => {
//             fetchFinding();
//             setUserAssignmentModalOpen(false);
//           }}
//         />
//       )}
//     </div>
//   );
// };


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
  X,
  Activity,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Zap,
  Target,
  Layers,
  GitBranch,
  BookOpen,
  Award
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 animate-pulse">Loading user data...</p>
        </div>
      </div>
    );
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

  // Fetch finding details
  const fetchFinding = async () => {
    setLoading(true);
    try {
      const response = await api.get(`ZAMS/api/audit-findings/${findingId}`);
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
      await api.delete(`ZAMS/api/audit-findings/${finding.id}`);
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
      await api.put(`/ZAMS/api/audit-findings/${finding.id}/rectify/approve`);
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
      await api.put(`/ZAMS/api/audit-findings/${finding.id}/rectify/reject`, {
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

  // Enhanced status badge with animations
  const getStatusBadge = (status: string) => {
    const statusConfig = AUDIT_FINDING_STATUSES.find(s => s.value === status);
    const baseClasses = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 transform hover:scale-105";
    
    const statusStyles = {
      'Pending': `${baseClasses} bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg shadow-yellow-500/30`,
      'In Progress': `${baseClasses} bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg shadow-blue-500/30 animate-pulse`,
      'Resolved': `${baseClasses} bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/30`,
      'Rejected': `${baseClasses} bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg shadow-red-500/30`
    };

    const statusIcons = {
      'Pending': <Clock className="w-3 h-3" />,
      'In Progress': <Activity className="w-3 h-3 animate-spin" />,
      'Resolved': <CheckCircle className="w-3 h-3" />,
      'Rejected': <XCircle className="w-3 h-3" />
    };

    return (
      <span className={statusStyles[status as keyof typeof statusStyles] || `${baseClasses} bg-gray-200 text-gray-800`}>
        {statusIcons[status as keyof typeof statusIcons]}
        {statusConfig?.label || status}
      </span>
    );
  };

  // Enhanced rectification status badge
  const getRectificationStatusBadge = (status: string) => {
    const statusConfig = RECTIFICATION_STATUSES.find(s => s.value === status);
    const baseClasses = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 transform hover:scale-105";
    
    return (
      <span className={`${baseClasses} ${statusConfig?.color || 'bg-gray-100 text-gray-800'}`}>
        {status === 'Pending' && <Clock className="w-3 h-3 animate-pulse" />}
        {status === 'Approved' && <CheckCircle className="w-3 h-3" />}
        {status === 'Rejected' && <XCircle className="w-3 h-3" />}
        {statusConfig?.label || status}
      </span>
    );
  };

  // Format currency with animation-ready output
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
      const response = await api.get(`ZAMS/api/audit-findings/evidence/${evidenceId}/download`, {
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
      const response = await api.get(`ZAMS/api/audit-findings/evidence/${evidenceId}/download`, {
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
    const iconClasses = "h-5 w-5";
    if (mimeType.startsWith('image/')) {
      return <Image className={`${iconClasses} text-blue-500`} />;
    } else if (mimeType === 'application/pdf') {
      return <FileIcon className={`${iconClasses} text-red-500`} />;
    } else if (mimeType.includes('document') || mimeType.includes('word')) {
      return <FileText className={`${iconClasses} text-blue-600`} />;
    } else {
      return <File className={`${iconClasses} text-gray-500`} />;
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

  // Modern Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-pulse"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-lg font-medium text-gray-600 animate-pulse">Loading audit finding details...</p>
            <div className="flex gap-2 mt-4">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modern Not Found State
  if (!finding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-red-400 to-pink-500 rounded-full opacity-20 animate-pulse"></div>
              <AlertCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Audit Finding Not Found</h2>
            <p className="text-gray-600 mb-8">The requested audit finding could not be located.</p>
            {onBack && (
              <Button 
                onClick={onBack} 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main render starts here (Part 3 will continue)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      <div className="relative container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Modern Header Section */}
        <div className="mb-8 animate-fadeIn">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 transition-all duration-300 hover:shadow-2xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                {onBack && (
                  <Button 
                    variant="outline" 
                    onClick={onBack}
                    className="group bg-white/50 hover:bg-white border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-300 hover:shadow-lg"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                    Back
                  </Button>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      {finding.title}
                    </h1>
                  </div>
                  <p className="text-gray-600 ml-14">Audit Finding #{finding.reference_number}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {getStatusBadge(finding.status)}
                
                {/* Action Buttons with Modern Styling */}
                {/* <div className="flex flex-wrap gap-2">
                  {onEdit && (
                    <Button 
                      variant="outline" 
                      onClick={() => onEdit(finding)}
                      className="group bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-300 hover:border-blue-400 transition-all duration-300 hover:shadow-lg"
                    >
                      <Edit className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      Edit
                    </Button>
                  )}

                  {finding.status === 'Pending' && onInitiateRectification && (
                    <Button 
                      onClick={() => onInitiateRectification(finding)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Initiate Rectification
                    </Button>
                  )}

                  {canAssignToUser() && (
                    <Button
                      variant="outline"
                      onClick={() => setUserAssignmentModalOpen(true)}
                      className="group bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-300 hover:border-purple-400 transition-all duration-300 hover:shadow-lg"
                    >
                      <User className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Assign User
                    </Button>
                  )}

                  <Button
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Countdown Timer */}
        {finding.due_date && countdown && finding.status !== 'Resolved' && (
          <Card className="mb-8 overflow-hidden border-0 shadow-2xl animate-slideInUp">
            <div className={`relative ${
              countdown.urgencyLevel === 'red' 
                ? 'bg-gradient-to-r from-red-500 to-pink-600' 
                : countdown.urgencyLevel === 'yellow' 
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                : 'bg-gradient-to-r from-green-400 to-emerald-500'
            }`}>
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)`
                }}></div>
              </div>
              
              <CardContent className="relative p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl bg-white/20 backdrop-blur-sm ${
                      countdown.isOverdue ? 'animate-pulse' : 'animate-bounce'
                    }`}>
                      <Timer className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-white">
                      <div className="text-2xl font-bold">
                        {countdown.isOverdue ? '⚠️ OVERDUE' : '⏰ Time Remaining'}
                      </div>
                      <div className="text-white/80 mt-1">
                        Due: {formatDate(finding.due_date)}
                      </div>
                    </div>
                  </div>

                  <div className="text-center md:text-right">
                    {!countdown.isOverdue && (
                      <div className="text-3xl font-bold text-white font-mono tracking-wider">
                        <span className="inline-block min-w-[3ch] bg-white/20 rounded-lg px-2 py-1 mx-1">{String(countdown.days).padStart(2, '0')}</span>
                        <span className="text-white/60">:</span>
                        <span className="inline-block min-w-[3ch] bg-white/20 rounded-lg px-2 py-1 mx-1">{String(countdown.hours).padStart(2, '0')}</span>
                        <span className="text-white/60">:</span>
                        <span className="inline-block min-w-[3ch] bg-white/20 rounded-lg px-2 py-1 mx-1">{String(countdown.minutes).padStart(2, '0')}</span>
                        <span className="text-white/60">:</span>
                        <span className="inline-block min-w-[3ch] bg-white/20 rounded-lg px-2 py-1 mx-1">{String(countdown.seconds).padStart(2, '0')}</span>
                      </div>
                    )}
                    <div className="text-sm font-medium text-white/90 mt-2">
                      {countdown.urgencyLevel === 'red' 
                        ? '🔴 CRITICAL - Less than 24 hours!' 
                        : countdown.urgencyLevel === 'yellow' 
                        ? '🟡 WARNING - Less than 3 days' 
                        : '🟢 ON TRACK - More than 3 days'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        )}

        {/* Resolved Status Card */}
        {finding.due_date && finding.status === 'Resolved' && (
          <Card className="mb-8 overflow-hidden border-0 shadow-xl bg-gradient-to-r from-green-50 to-emerald-50 animate-slideInUp">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-800">Finding Resolved ✅</div>
                    <div className="text-green-600 mt-1">Original Due Date: {formatDate(finding.due_date)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg px-4 py-2">
                    COMPLETED
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* Finding Details Card */}
            <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fadeInUp">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BookOpen className="h-6 w-6" />
                  Finding Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {[
                  { label: 'Description', value: finding.description, icon: <FileText className="h-5 w-5" /> },
                  { label: 'Criteria', value: finding.criteria, icon: <Target className="h-5 w-5" /> },
                  { label: 'Cause', value: finding.cause, icon: <AlertCircle className="h-5 w-5" /> },
                  { label: 'Impact', value: finding.impact, icon: <TrendingUp className="h-5 w-5" /> },
                  { label: 'Recommendation', value: finding.recommendation, icon: <Award className="h-5 w-5" /> }
                ].map((item, index) => (
                  <div key={index} className="group">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                      <div className="p-2 bg-white rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        <div className="text-indigo-600">{item.icon}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2 text-lg">{item.label}</h4>
                        <p className="text-gray-700 leading-relaxed">{item.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            {/* Evidence Files Section */}
            {finding.evidences && finding.evidences.length > 0 && (
              <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fadeInUp animation-delay-200">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Layers className="h-6 w-6" />
                    Evidence Files
                    <Badge className="bg-white/20 text-white ml-2">
                      {finding.evidences.length} files
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-blue-50">
                    Supporting documents and evidence for this finding
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-3">
                    {finding.evidences.map((evidence, index) => (
                      <div
                        key={evidence.evidence_id}
                        className="group relative flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-transparent hover:border-blue-300 rounded-xl hover:shadow-lg transition-all duration-300 animate-slideInRight"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="p-3 bg-white rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                            {getFileIcon(evidence.mime_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-300">
                              {evidence.original_file_name}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                              <span className="inline-flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {evidence.uploadedBy?.username}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(evidence.created_at).toLocaleDateString()}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <File className="h-3 w-3" />
                                {(evidence.file_size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                            {evidence.description && (
                              <div className="text-sm text-gray-600 mt-2 italic bg-white/50 rounded-lg px-2 py-1 inline-block">
                                "{evidence.description}"
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {canPreviewFile(evidence.mime_type) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => previewFileHandler(
                                evidence.evidence_id,
                                evidence.original_file_name,
                                evidence.mime_type
                              )}
                              className="h-10 w-10 p-0 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-110"
                              title="Preview file"
                            >
                              <Eye className="h-5 w-5" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadFile(
                              evidence.evidence_id,
                              evidence.original_file_name
                            )}
                            className="h-10 w-10 p-0 rounded-xl bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-700 transition-all duration-300 hover:scale-110"
                            title="Download file"
                          >
                            <Download className="h-5 w-5" />
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
              <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fadeInUp animation-delay-300">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <CheckCircle className="h-6 w-6" />
                    Rectification Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                      {getRectificationStatusBadge(finding.AuditFindingRectification.status)}
                    </div>

                    {canApproveRectification(finding) &&
                     finding.AuditFindingRectification.status === 'Pending' && (
                      <div className="flex gap-3">
                        <Button
                          size="sm"
                          onClick={handleApproveRectification}
                          disabled={actionLoading}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={handleRejectRectification}
                          disabled={actionLoading}
                          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-600" />
                      Description
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{finding.AuditFindingRectification.description}</p>
                  </div>

                  {finding.AuditFindingRectification.rejection_reason && (
                    <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                      <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        Rejection Reason
                      </h4>
                      <p className="text-red-700">{finding.AuditFindingRectification.rejection_reason}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    Submitted on {formatDate(finding.AuditFindingRectification.createdAt)}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Amendment History */}
            {finding.AuditAmendmentHistories && finding.AuditAmendmentHistories.length > 0 && (
              <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fadeInUp animation-delay-400">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <History className="h-6 w-6" />
                    Amendment History
                    <Badge className="bg-white/20 text-white">
                      {finding.AuditAmendmentHistories.length} amendments
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-purple-50">
                    Track all changes and modifications made to this finding
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
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
                          <div 
                            key={amendment.amendment_id} 
                            className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-300 transition-all duration-300 hover:shadow-lg animate-slideInLeft"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div
                              className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-gray-50 to-purple-50 hover:from-purple-50 hover:to-indigo-50 transition-all duration-300"
                              onClick={() => setExpandedAmendments(prev => ({
                                ...prev,
                                [amendment.amendment_id]: !prev[amendment.amendment_id]
                              }))}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                                  <ChevronRight className="h-5 w-5 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <span className="font-semibold text-gray-900">
                                      Amendment #{finding.AuditAmendmentHistories!.length - index}
                                    </span>
                                    {index === 0 && (
                                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                        Latest
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                    <span className="inline-flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      {amendment.amendedBy?.username || 'Unknown'}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {formatDate(amendment.amended_at)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {changes.length > 0 && (
                                <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700">
                                  {changes.length} change{changes.length !== 1 ? 's' : ''}
                                </Badge>
                              )}
                            </div>

                            {isExpanded && (
                              <div className="border-t-2 border-gray-200 p-4 bg-white animate-slideDown">
                                {changes.length > 0 && (
                                  <div className="mb-4">
                                    <h5 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                                      <GitBranch className="h-5 w-5" />
                                      Changes from Previous Amendment
                                    </h5>
                                    <div className="space-y-3">
                                      {changes.map((change, changeIndex) => (
                                        <div key={changeIndex} className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                                          <div className="font-medium text-purple-800 mb-2">{change.field}</div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="p-3 bg-white rounded-lg border border-gray-200">
                                              <div className="text-xs font-semibold text-gray-600 mb-1">Before:</div>
                                              <div className="text-sm text-gray-700">{change.before || 'Not specified'}</div>
                                            </div>
                                            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                              <div className="text-xs font-semibold text-green-600 mb-1">After:</div>
                                              <div className="text-sm text-green-700">{change.after || 'Not specified'}</div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="text-gray-600 font-semibold mb-2">Amendment Details</div>
                                    <div className="space-y-1">
                                      <div><span className="font-medium">Status:</span> {amendment.status}</div>
                                      <div><span className="font-medium">Amount:</span> {formatCurrency(Number(amendment.amount))}</div>
                                    </div>
                                  </div>
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="text-gray-600 font-semibold mb-2">User Information</div>
                                    <div className="space-y-1">
                                      <div><span className="font-medium">Role:</span> {amendment.amendedBy?.role?.replace(/_/g, ' ')}</div>
                                      <div><span className="font-medium">Department:</span> {amendment.amendedBy?.department}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            )}
            </div>

{/* Right Sidebar */}
<div className="space-y-6">
  {/* Summary Card */}
  <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fadeInRight">
    <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      <CardTitle className="flex items-center gap-2">
        <Sparkles className="h-5 w-5" />
        Summary
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 space-y-4">
      {[
        { 
          icon: <DollarSign className="h-5 w-5" />, 
          label: 'Amount', 
          value: formatCurrency(finding.amount),
          color: 'from-green-400 to-emerald-500'
        },
        { 
          icon: <Tag className="h-5 w-5" />, 
          label: 'Category', 
          value: finding.Category?.category_name || '-',
          color: 'from-blue-400 to-indigo-500'
        },
        { 
          icon: <Shield className="h-5 w-5" />, 
          label: 'Risk rating', 
          value: finding.RiskRating?.risk_rating_name || '-',
          color: 'from-red-400 to-pink-500'
        },
        { 
          icon: <User className="h-5 w-5" />, 
          label: 'Created By', 
          value: (
            <div>
              <div className="font-medium">{finding.createdBy?.username || '-'}</div>
              <div className="text-xs opacity-75">{finding.createdBy?.role?.replace(/_/g, ' ')}</div>
            </div>
          ),
          color: 'from-purple-400 to-indigo-500'
        },
        { 
          icon: <Calendar className="h-5 w-5" />, 
          label: 'Created', 
          value: formatDate(finding.createdAt),
          color: 'from-orange-400 to-red-500'
        }
      ].map((item, index) => (
        <div 
          key={index} 
          className="group flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:shadow-md animate-slideInRight"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {item.icon}
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-600 font-medium">{item.label}</div>
            <div className="font-semibold text-gray-900 mt-1">{item.value}</div>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>

  {/* IT Audit Information */}
  {(finding.SystemVulnerability || finding.ComplianceGap || finding.RelevantStandard) && (
    <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fadeInRight animation-delay-200">
      <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          IT Audit Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {finding.SystemVulnerability && (
          <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
            <h5 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              System Vulnerability
            </h5>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Name:</span>
                <span className="ml-2 text-gray-900">{finding.SystemVulnerability.vulnerability_name}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Description:</span>
                <div className="mt-1 text-gray-900">{finding.SystemVulnerability.vulnerability_description}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Affected Systems:</span>
                <span className="ml-2 text-gray-900">{finding.SystemVulnerability.affected_systems}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Severity:</span>
                <Badge className="ml-2 bg-gradient-to-r from-red-500 to-pink-600 text-white">
                  {finding.SystemVulnerability.severity_level}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {finding.ComplianceGap && (
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
            <h5 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              Compliance Gap
            </h5>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Gap Name:</span>
                <span className="ml-2 text-gray-900">{finding.ComplianceGap.gap_name}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Description:</span>
                <div className="mt-1 text-gray-900">{finding.ComplianceGap.gap_description}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Regulatory Impact:</span>
                <div className="mt-1 text-gray-900">{finding.ComplianceGap.regulatory_impact}</div>
              </div>
            </div>
          </div>
        )}

        {finding.RelevantStandard && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Relevant Standard
            </h5>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Standard:</span>
                <span className="ml-2 text-gray-900">{finding.RelevantStandard.standard_name}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Description:</span>
                <div className="mt-1 text-gray-900">{finding.RelevantStandard.standard_description}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Issuing Body:</span>
                <span className="ml-2 text-gray-900">{finding.RelevantStandard.issuing_body}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Version:</span>
                <Badge className="ml-2">{finding.RelevantStandard.version}</Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )}

{/* Business Compliance Gap */}
{finding.BusinessComplianceGap && (
              <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fadeInRight animation-delay-300">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Business Compliance Gap
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold text-gray-700">Gap Name:</span>
                        <div className="mt-1 font-medium text-gray-900">{finding.BusinessComplianceGap.gap_name}</div>
                      </div>
                      {finding.BusinessComplianceGap.gap_description && (
                        <div>
                          <span className="font-semibold text-gray-700">Description:</span>
                          <div className="mt-1 text-gray-900">{finding.BusinessComplianceGap.gap_description}</div>
                        </div>
                      )}
                      {finding.BusinessComplianceGap.regulatory_impact && (
                        <div>
                          <span className="font-semibold text-gray-700">Regulatory Impact:</span>
                          <div className="mt-1 text-gray-900">{finding.BusinessComplianceGap.regulatory_impact}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Assignment Information */}
            {(finding.assignedBranch || (finding.AuditFindingAssigneds && finding.AuditFindingAssigneds.length > 0)) && (
              <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fadeInRight animation-delay-400">
                <CardHeader className="bg-gradient-to-r from-teal-500 to-green-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {finding.assignedBranch && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <GitBranch className="h-5 w-5 text-blue-600" />
                        Branch Assignment
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold">Branch:</span>
                          <span className="ml-2">{finding.assignedBranch.branch_code} - {finding.assignedBranch.branch_name}</span>
                        </div>
                        {finding.branchSupervisor && (
                          <div>
                            <span className="font-semibold">Supervisor:</span>
                            <span className="ml-2">{finding.branchSupervisor.username}</span>
                          </div>
                        )}
                        {finding.branch_assigned_at && (
                          <div>
                            <span className="font-semibold">Assigned:</span>
                            <span className="ml-2">{formatDate(finding.branch_assigned_at)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {finding.AuditFindingAssigneds && finding.AuditFindingAssigneds.length > 0 && (
                    <div className="space-y-3">
                      {finding.AuditFindingAssigneds.map((assignment, index) => (
                        <div 
                          key={assignment.assigned_id} 
                          className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 animate-slideInUp"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <h5 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                            <User className="h-5 w-5 text-green-600" />
                            User Assignment
                          </h5>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-semibold">Assigned To:</span>
                              <span className="ml-2">{assignment.assignedToUser?.username || 'Unknown'}</span>
                            </div>
                            <div>
                              <span className="font-semibold">Role:</span>
                              <span className="ml-2">{assignment.assignedToUser?.role?.replace(/_/g, ' ')}</span>
                            </div>
                            <div>
                              <span className="font-semibold">Assigned By:</span>
                              <span className="ml-2">{assignment.assignedByUser?.username || 'Unknown'}</span>
                            </div>
                            <div>
                              <span className="font-semibold">Date:</span>
                              <span className="ml-2">{formatDate(assignment.assigned_at)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="pt-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-red-800">
                    Are you sure you want to delete this audit finding? This action cannot be undone and will permanently remove all associated data.
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6">
              <Button 
                variant="outline" 
                onClick={() => setDeleteDialogOpen(false)}
                className="hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={actionLoading}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg"
              >
                {actionLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Deleting...
                  </span>
                ) : (
                  'Delete Finding'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* File Preview Dialog */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                File Preview: {previewFile?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto mt-4 rounded-lg border-2 border-gray-200">
              {previewFile && (
                <div className="w-full h-full min-h-[500px] bg-gray-50">
                  {previewFile.type === 'application/pdf' ? (
                    <iframe
                      src={previewFile.url}
                      className="w-full h-full min-h-[500px] border-0"
                      title={`Preview of ${previewFile.name}`}
                    />
                  ) : previewFile.type.startsWith('image/') ? (
                    <div className="flex items-center justify-center p-8 bg-checkerboard">
                      <img
                        src={previewFile.url}
                        alt={previewFile.name}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
                        style={{ maxHeight: '70vh' }}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12">
                      <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-4">
                        <FileIcon className="h-16 w-16 text-gray-500" />
                      </div>
                      <p className="text-lg font-semibold text-gray-700">Preview not available</p>
                      <p className="text-sm text-gray-500 mt-2">
                        This file type cannot be previewed in the browser
                      </p>
                      <Button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = previewFile.url;
                          link.download = previewFile.name;
                          link.click();
                        }}
                        className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download File
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <DialogFooter className="mt-4">
              <Button 
                variant="outline" 
                onClick={closePreview}
                className="hover:bg-gray-100"
              >
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
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
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

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideDown {
          from { max-height: 0; opacity: 0; }
          to { max-height: 1000px; opacity: 1; }
        }
        
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
        .animate-slideInUp { animation: slideInUp 0.6s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.6s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.6s ease-out; }
        .animate-slideDown { animation: slideDown 0.4s ease-out; }
        .animate-fadeInRight { animation: fadeInRight 0.6s ease-out; }
        
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        
        .bg-checkerboard {
          background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                            linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                            linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                            linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>
    </div>
  );
};

