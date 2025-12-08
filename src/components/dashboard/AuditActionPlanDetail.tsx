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
import { DatePicker } from '@/components/ui/date-picker';
import { MultiUserSelect } from '@/components/ui/multi-user-select';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  ArrowLeft,
  ClipboardList,
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
  Target,
  Users,
  FileCheck,
  File,
  Paperclip,
  AlertTriangle,
  PlayCircle
} from 'lucide-react';
import { AuditFinding } from '@/types/auditFinding';
import { User as UserType } from '@/types/user';
import { ActionPlanProgressUpdateData } from '@/types/actionPlan';
import { FilePreview } from './FilePreview';
import { ProgressCircle } from '@/components/ui/progress-circle';
import { ProgressUpdateDialog } from './ProgressUpdateDialog';

interface AuditActionPlanDetailProps {
  finding: AuditFinding;
  currentUser: UserType;
  onBack?: () => void;
  onActionPlanUpdate?: () => void;
}

interface ActionPlanData {
  action_plan_id: string;
  audit_finding_id: string;
  submitted_by_id: string;
  action_plan: string;
  timeline: string;
  due_date: string;
  status: 'Pending' | 'Overdue' | 'In_Progress' | 'Completed';
  progress_percentage?: number;
  progress_justification?: string;
  created_at: string;
  updated_at: string;
  createdAt: string;
  updatedAt: string;
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
  evidences?: Array<{
    id: string;
    evidence_id: string;
    action_plan_id: string;
    file_path: string;
    file_name: string;
    file_type: string;
    file_size?: number;
    created_at: string;
    createdAt: string;
    updatedAt: string;
  }>;
  resources?: Array<{
    id: string;
    action_plan_id: string;
    resource_name: string;
    file_path?: string;
    file_name?: string;
    file_type?: string;
    file_size?: number;
    created_at: string;
    createdAt: string;
    updatedAt: string;
  }>;
  responsiblePersons?: Array<{
    responsible_person_id: string;
    user_id: string;
    user?: {
      id: string;
      username: string;
      email: string;
      role: string;
      department: string;
      is_active?: boolean;
      created_at?: string;
    };
    User?: {
      id: string;
      username: string;
      email: string;
      role: string;
      department?: string;
      is_active?: boolean;
      created_at?: string;
    };
  }>;
  amendmentHistory?: Array<{
    id: string;
    action_plan_id: string;
    amend_by_id: string;
    action_plan: string;
    timeline: string;
    status: string;
    progress_percentage?: number;
    progress_justification?: string;
    changes: any;
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

// Action Plan Status configurations
const ACTION_PLAN_STATUSES = [
  { value: 'Pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  { value: 'In_Progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: PlayCircle },
  { value: 'Completed', label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { value: 'Overdue', label: 'Overdue', color: 'bg-red-100 text-red-800', icon: AlertTriangle }
];

export const AuditActionPlanDetail: React.FC<AuditActionPlanDetailProps> = ({
  finding,
  currentUser,
  onBack,
  onActionPlanUpdate
}) => {
  const { api } = useAuth();
  const [actionPlan, setActionPlan] = useState<ActionPlanData | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [editTimeline, setEditTimeline] = useState('');
  const [editDueDate, setEditDueDate] = useState<Date | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [resourceFiles, setResourceFiles] = useState<File[]>([]);
  const [expandedAmendments, setExpandedAmendments] = useState<{ [key: string]: boolean }>({});

  // Status management
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [statusChangeReason, setStatusChangeReason] = useState('');

  // Progress management
  const [showProgressDialog, setShowProgressDialog] = useState(false);

  // Amendment management
  const [showAmendDialog, setShowAmendDialog] = useState(false);
  const [amendActionPlan, setAmendActionPlan] = useState('');
  const [amendTimeline, setAmendTimeline] = useState('');
  const [amendDueDate, setAmendDueDate] = useState<Date | undefined>(undefined);
  const [amendSelectedResponsiblePersons, setAmendSelectedResponsiblePersons] = useState<UserType[]>([]);
  const [amendEvidenceFiles, setAmendEvidenceFiles] = useState<File[]>([]);
  const [amendResourceFiles, setAmendResourceFiles] = useState<File[]>([]);

  // Responsible persons management
  const [selectedResponsiblePersons, setSelectedResponsiblePersons] = useState<UserType[]>([]);

  // Permissions removed - universal access for all users

  // Load all users for responsible persons selection
  const loadUsers = useCallback(async (): Promise<UserType[]> => {
    try {
      const response = await api.get(`ZAMS/api/auth/assignable-users?limit=1000&is_active=true`);

      // Extract users from the correct path in the response
      const rawUsers = response.data.data || response.data.users || response.data || [];

      // Transform the API response to match the User type
      const users: UserType[] = Array.isArray(rawUsers) ? rawUsers.map((user: any) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        is_active: user.is_active ?? true, // Default to true since we're fetching active users
        created_at: user.created_at || new Date().toISOString(), // Default to current date if not provided
        permissions: user.permissions || [],
        supervisor_id: user.supervisor_id,
        profile_image: user.profile_image
      })) : [];

      return users;
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }, [api]);

  // File validation
  const validateFile = (file: File): boolean => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload PDF, DOC, DOCX, XLS, XLSX, or image files.');
      return false;
    }

    if (file.size > maxSize) {
      toast.error('File size too large. Please upload files smaller than 10MB.');
      return false;
    }

    return true;
  };




  // const isAmendRectificationButton = currentUser.role === 'Auditees'  || currentUser.role === 'Auditee_Supervisor' || currentUser.role === 'IT_Auditees' || currentUser.role === 'IT_Auditees_Supervisor' || currentUser.role === 'Inspection_Auditees'  || currentUser.role === 'Inspection_Auditees_Supervisor';
  // const isApproveRectificationButton =  currentUser.role === 'Resident_Auditors' || currentUser.role === 'Audit_Supervisor'  || currentUser.role === 'IT_Auditors_Director' || currentUser.role === 'IT_Auditors_Supervisor' || currentUser.role === 'IT_Auditors'  || currentUser.role === 'Inspection_Auditors' || currentUser.role === 'Inspection_Auditors_Supervisor';
  // const isAuditAddendumRectificationButton = currentUser.role === 'Resident_Auditors' || currentUser.role === 'Audit_Supervisor'  || currentUser.role === 'IT_Auditors_Director' || currentUser.role === 'IT_Auditors_Supervisor' || currentUser.role === 'IT_Auditors'  || currentUser.role === 'Inspection_Auditors' || currentUser.role === 'Inspection_Auditors_Supervisor';
  // const isAmenButton = currentUser.role === 'Auditees'  || currentUser.role === 'Auditee_Supervisor' || currentUser.role === 'IT_Auditees' || currentUser.role === 'IT_Auditees_Supervisor' || currentUser.role === 'Inspection_Auditees'  || currentUser.role === 'Inspection_Auditees_Supervisor';
  const isCreateActionPlanButton = currentUser.role === 'Auditees'  || currentUser.role === 'Auditee_Supervisor' || currentUser.role === 'IT_Auditees' || currentUser.role === 'IT_Auditees_Supervisor' || currentUser.role === 'Inspection_Auditees'  || currentUser.role === 'Inspection_Auditees_Supervisor';





  // Handle file selection
  const handleFileSelect = (files: FileList | null, type: 'evidence' | 'resource') => {
    if (!files) return;

    const validFiles: File[] = [];
    Array.from(files).forEach(file => {
      if (validateFile(file)) {
        validFiles.push(file);
      }
    });

    if (type === 'evidence') {
      setEvidenceFiles(prev => [...prev, ...validFiles]);
    } else {
      setResourceFiles(prev => [...prev, ...validFiles]);
    }
  };

  // Remove file
  const removeFile = (index: number, type: 'evidence' | 'resource') => {
    if (type === 'evidence') {
      setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
    } else {
      setResourceFiles(prev => prev.filter((_, i) => i !== index));
    }
  };



  // Fetch action plan data
  const fetchActionPlanData = useCallback(async () => {
    if (!finding) return;

    setLoading(true);
    try {
      // First, fetch the finding data to get action plan IDs
      const findingResponse = await api.get(`ZAMS/api/audit-findings/${finding.id}`);
      const findingData = findingResponse.data;

      // Check if the finding has action plan data
      if (findingData.ActionPlans && findingData.ActionPlans.length > 0) {
        const actionPlanId = findingData.ActionPlans[0].action_plan_id;

        // Fetch the full action plan details with files from the dedicated endpoint
        const actionPlanResponse = await api.get(`ZAMS/api/action-plans/${actionPlanId}`);
        console.log('Action Plan API Response:', actionPlanResponse.data);
        console.log('Due Date from API:', actionPlanResponse.data.due_date);
        setActionPlan(actionPlanResponse.data);


      } else {
        // No action plans exist, show create form
        setActionPlan(null);
      }
    } catch (error: any) {
      console.error('Error fetching action plan data:', error);
      toast.error('Failed to fetch action plan data');
    } finally {
      setLoading(false);
    }
  }, [api, finding]);

  useEffect(() => {
    if (finding) {
      fetchActionPlanData();
    }
  }, [finding, fetchActionPlanData]);



  // Handle create action plan
  const handleCreateActionPlan = async () => {
    if (!finding || !editText.trim()) {
      toast.error('Please provide action plan description');
      return;
    }

    if (!editDueDate) {
      toast.error('Please select a due date');
      return;
    }

    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('action_plan', editText);
      formData.append('timeline', editTimeline || '');
      formData.append('due_date', format(editDueDate, 'yyyy-MM-dd'));
      formData.append('audit_finding_id', finding.id);
      formData.append('status', 'Draft');
      formData.append('submitted_by_id', currentUser.id);

      // Add responsible persons
      if (selectedResponsiblePersons.length > 0) {
        formData.append('responsible_persons_ids', JSON.stringify(selectedResponsiblePersons.map(p => p.id)));
      }

      // Add evidence files
      evidenceFiles.forEach((file) => {
        formData.append(`evidence_files`, file);
      });

      // Add resource files
      resourceFiles.forEach((file) => {
        formData.append(`resource_files`, file);
      });

      // Add legacy file if selected (for backward compatibility)
      if (selectedFile) {
        formData.append('evidence', selectedFile);
      }

      await api.post(`/ZAMS/api/action-plans`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Action plan created successfully');
      setIsEditing(false);
      setEditText('');
      setEditTimeline('');
      setEditDueDate(undefined);
      setSelectedFile(null);
      setEvidenceFiles([]);
      setResourceFiles([]);
      setSelectedResponsiblePersons([]);
      fetchActionPlanData();
      if (onActionPlanUpdate) {
        onActionPlanUpdate();
      }
    } catch (error: any) {
      console.error('Error creating action plan:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create action plan';
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle amend action plan
  const handleAmendActionPlan = async () => {
    if (!finding || !actionPlan || !editText.trim()) {
      toast.error('Please provide action plan description');
      return;
    }

    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('action_plan', editText);
      formData.append('timeline', editTimeline || '');

      if (editDueDate) {
        formData.append('due_date', format(editDueDate, 'yyyy-MM-dd'));
      }

      // Add responsible persons
      if (selectedResponsiblePersons.length > 0) {
        formData.append('responsible_persons_ids', JSON.stringify(selectedResponsiblePersons.map(p => p.id)));
      }

      // Add evidence files
      evidenceFiles.forEach((file) => {
        formData.append(`evidence_files`, file);
      });

      // Add resource files
      resourceFiles.forEach((file) => {
        formData.append(`resource_files`, file);
      });

      // Add legacy file if selected (for backward compatibility)
      if (selectedFile) {
        formData.append('evidence', selectedFile);
      }

      await api.put(`/ZAMS/api/action-plans/${actionPlan.action_plan_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Action plan amended successfully');
      setIsEditing(false);
      setEditText('');
      setEditTimeline('');
      setEditDueDate(undefined);
      setSelectedFile(null);
      setEvidenceFiles([]);
      setResourceFiles([]);
      setSelectedResponsiblePersons([]);
      fetchActionPlanData();
      if (onActionPlanUpdate) {
        onActionPlanUpdate();
      }
    } catch (error: any) {
      console.error('Error amending action plan:', error);
      const errorMessage = error.response?.data?.error || 'Failed to amend action plan';
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = async () => {
    if (!finding || !actionPlan || !selectedStatus) return;

    // Check if reason is required for certain status changes
    const requiresReason = selectedStatus === 'Completed' && !statusChangeReason.trim();
    if (requiresReason) {
      toast.error('Please provide a reason for marking as completed');
      return;
    }

    setActionLoading(true);
    try {
      const payload: any = {
        status: selectedStatus
      };

      // Add reason if provided
      if (statusChangeReason.trim()) {
        payload.reason = statusChangeReason;
      }

      await api.put(`/ZAMS/api/action-plans/${actionPlan.action_plan_id}`, payload);

      const statusLabel = ACTION_PLAN_STATUSES.find(s => s.value === selectedStatus)?.label || selectedStatus;
      toast.success(`Action plan status updated to ${statusLabel}`);

      setShowStatusDialog(false);
      setSelectedStatus('');
      setStatusChangeReason('');
      fetchActionPlanData();

      if (onActionPlanUpdate) {
        onActionPlanUpdate();
      }
    } catch (error: any) {
      console.error('Error updating action plan status:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update action plan status';
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Get available status transitions
  const getAvailableStatuses = () => {
    if (!actionPlan) return [];

    const currentStatus = actionPlan.status;
    const allStatuses = ACTION_PLAN_STATUSES.filter(status => status.value !== currentStatus);

    // Define allowed transitions based on current status
    switch (currentStatus) {
      case 'Pending':
        return allStatuses.filter(s => ['In_Progress', 'Completed'].includes(s.value));
      case 'In_Progress':
        return allStatuses.filter(s => ['Completed', 'Pending'].includes(s.value));
      case 'Completed':
        return allStatuses.filter(s => ['In_Progress'].includes(s.value));
      case 'Overdue':
        return allStatuses.filter(s => ['In_Progress', 'Completed'].includes(s.value));
      default:
        return allStatuses;
    }
  };

  // Check if status change requires confirmation
  const requiresConfirmation = (status: string) => {
    return ['Completed'].includes(status);
  };

  // Handle progress update
  const handleProgressUpdate = async (data: ActionPlanProgressUpdateData) => {
    if (!finding || !actionPlan) return;

    try {
      const response = await api.put(`/ZAMS/api/action-plans/${actionPlan.action_plan_id}/progress`, data);

      // Update the action plan data with new progress
      setActionPlan(prev => prev ? {
        ...prev,
        progress_percentage: data.progress_percentage,
        progress_justification: data.progress_justification
      } : null);

      // Refresh the action plan data to get updated amendment history
      await fetchActionPlanData();

      if (onActionPlanUpdate) {
        onActionPlanUpdate();
      }
    } catch (error: any) {
      console.error('Error updating progress:', error);
      throw error; // Re-throw to let the dialog handle the error
    }
  };

  // Handle submit amendment form
  const handleSubmitAmendment = async () => {
    if (!finding || !actionPlan) return;

    setActionLoading(true);
    try {
      const formData = new FormData();

      // Add basic fields
      formData.append('action_plan', amendActionPlan);
      formData.append('timeline', amendTimeline || '');

      if (amendDueDate) {
        formData.append('due_date', amendDueDate.toISOString().split('T')[0]);
      }

      // Add responsible persons
      if (amendSelectedResponsiblePersons.length > 0) {
        formData.append('responsible_persons_ids', JSON.stringify(amendSelectedResponsiblePersons.map(p => p.id)));
      }

      // Add evidence files
      amendEvidenceFiles.forEach((file) => {
        formData.append(`evidence_files`, file);
      });

      // Add resource files
      amendResourceFiles.forEach((file) => {
        formData.append(`resource_files`, file);
      });

      await api.put(`/ZAMS/api/action-plans/${actionPlan.action_plan_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Action plan amended successfully');
      setShowAmendDialog(false);

      // Reset amendment form
      setAmendActionPlan('');
      setAmendTimeline('');
      setAmendDueDate(undefined);
      setAmendSelectedResponsiblePersons([]);
      setAmendEvidenceFiles([]);
      setAmendResourceFiles([]);

      fetchActionPlanData();
      if (onActionPlanUpdate) {
        onActionPlanUpdate();
      }
    } catch (error: any) {
      console.error('Error amending action plan:', error);
      const errorMessage = error.response?.data?.error || 'Failed to amend action plan';
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Initialize amendment form with current data
  const initializeAmendmentForm = () => {
    if (actionPlan) {
      setAmendActionPlan(actionPlan.action_plan || '');
      setAmendTimeline(actionPlan.timeline || '');

      if (actionPlan.due_date) {
        try {
          const dueDate = new Date(actionPlan.due_date);
          if (!isNaN(dueDate.getTime())) {
            setAmendDueDate(dueDate);
          } else {
            console.warn('Invalid due_date format in amendment form:', actionPlan.due_date);
            setAmendDueDate(undefined);
          }
        } catch (error) {
          console.error('Error parsing due_date in amendment form:', actionPlan.due_date, error);
          setAmendDueDate(undefined);
        }
      } else {
        console.log('No due_date available for amendment form:', actionPlan);
        setAmendDueDate(undefined);
      }

      // Set current responsible persons
      if (actionPlan.responsiblePersons) {
        const currentResponsiblePersons = actionPlan.responsiblePersons
          .filter(rp => rp.user || rp.User)
          .map(rp => {
            const user = rp.user || rp.User;
            return {
              id: user!.id,
              username: user!.username,
              email: user!.email,
              role: user!.role,
              department: user!.department || '',
              is_active: user!.is_active ?? true,
              created_at: user!.created_at || new Date().toISOString(),
              permissions: [],
              supervisor_id: undefined,
              profile_image: undefined
            };
          });
        setAmendSelectedResponsiblePersons(currentResponsiblePersons);
      }

      setShowAmendDialog(true);
    }
  };



  // Handle download evidence
  const handleDownloadEvidence = async (evidence: any) => {
    try {
      const evidenceId = evidence.evidence_id || evidence.id;
      if (!evidenceId) {
        toast.error('Evidence ID not found');
        return;
      }

      const response = await api.get(`ZAMS/api/action-plans/evidence/${evidenceId}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', evidence.file_name || 'evidence');
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

  // Handle download resource
  const handleDownloadResource = async (resource: any) => {
    try {
      const resourceId = resource.resource_id || resource.id;
      if (!resourceId) {
        toast.error('Resource ID not found');
        return;
      }

      const response = await api.get(`ZAMS/api/action-plans/resource/${resourceId}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', resource.file_name || resource.resource_name || 'resource');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Resource file downloaded successfully');
    } catch (error: any) {
      console.error('Error downloading resource:', error);
      const errorMessage = error.response?.data?.error || 'Failed to download resource file';
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

  // Get action plan status badge
  const getActionPlanStatusBadge = (status: string) => {
    const statusConfig = ACTION_PLAN_STATUSES.find(s => s.value === status);
    return (
      <Badge className={statusConfig?.color || 'bg-gray-100 text-gray-800'}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  // Detect changes between amendments
  const getChanges = (current: any, previous: any) => {
    const changes: Array<{ field: string; before: string; after: string }> = [];

    if (current.action_plan !== previous.action_plan) {
      changes.push({
        field: 'Action Plan Description',
        before: previous.action_plan,
        after: current.action_plan
      });
    }

    if (current.timeline !== previous.timeline) {
      changes.push({
        field: 'Timeline',
        before: previous.timeline,
        after: current.timeline
      });
    }

    // Check for progress changes
    if (current.progress_percentage !== previous.progress_percentage) {
      changes.push({
        field: 'Progress Percentage',
        before: `${previous.progress_percentage || 0}%`,
        after: `${current.progress_percentage || 0}%`
      });
    }

    if (current.progress_justification !== previous.progress_justification) {
      changes.push({
        field: 'Progress Justification',
        before: previous.progress_justification || 'No justification provided',
        after: current.progress_justification || 'No justification provided'
      });
    }

    return changes;
  };

  // Check if user can create action plan
  const canCreateActionPlan = () => {
    if (!finding) return false;

    // Check if finding doesn't have action plan yet (removed role permission check)
    return !actionPlan;
  };

  // Check if user can amend action plan - Universal access for all users
  const canAmendActionPlan = () => {
    if (!finding || !actionPlan) return false;

    // All users can amend action plans if status allows it
    const allowedStatuses = ['Pending', 'In_Progress'];
    return allowedStatuses.includes(actionPlan.status);
  };

  // Check if user can change status
  const canChangeStatus = () => {
    if (!finding || !actionPlan) return false;

    // All users can change status (removed role permission check)
    return true;
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
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
              <p className="text-gray-600">Action Plan Management</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {actionPlan && getActionPlanStatusBadge(actionPlan.status)}

            {/* Action Buttons */}
            <div className="flex gap-2 ml-4">
              {canAmendActionPlan() && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(true);
                    setEditText(actionPlan!.action_plan);
                    setEditTimeline(actionPlan!.timeline || '');

                    // Set due date if available
                    if (actionPlan!.due_date) {
                      try {
                        const dueDate = new Date(actionPlan!.due_date);
                        if (!isNaN(dueDate.getTime())) {
                          setEditDueDate(dueDate);
                        } else {
                          console.warn('Invalid due_date format:', actionPlan!.due_date);
                          setEditDueDate(undefined);
                        }
                      } catch (error) {
                        console.error('Error parsing due_date:', actionPlan!.due_date, error);
                        setEditDueDate(undefined);
                      }
                    } else {
                      console.log('No due_date available in actionPlan:', actionPlan);
                      setEditDueDate(undefined);
                    }

                    // Set current responsible persons
                    if (actionPlan!.responsiblePersons) {
                      const currentResponsiblePersons = actionPlan!.responsiblePersons
                        .filter(rp => rp.user)
                        .map(rp => ({
                          id: rp.user!.id,
                          username: rp.user!.username,
                          email: rp.user!.email,
                          role: rp.user!.role,
                          department: rp.user!.department,
                          is_active: rp.user!.is_active ?? true,
                          created_at: rp.user!.created_at || new Date().toISOString(),
                          permissions: [],
                          supervisor_id: undefined,
                          profile_image: undefined
                        }));
                      setSelectedResponsiblePersons(currentResponsiblePersons);
                    }
                  }}
                  disabled={actionLoading}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Amend Action Plan
                </Button>
              )}

              {/* Progress Change Button */}
              <Button
                variant="outline"
                onClick={() => setShowProgressDialog(true)}
                disabled={actionLoading}
              >
                <Target className="h-4 w-4 mr-2" />
                Progress Change
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Finding Details */}
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
                <h4 className="font-medium text-gray-900 mb-2">Recommendation</h4>
                <p className="text-gray-700">{finding.recommendation}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Plan Section */}
          {actionPlan ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Action Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Status</h4>
                    <div className="mt-1">
                      {getActionPlanStatusBadge(actionPlan.status)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {canAmendActionPlan() && (
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

                    {canChangeStatus() && (
                      <Select
                        value=""
                        onValueChange={(value) => {
                          setSelectedStatus(value);
                          if (requiresConfirmation(value)) {
                            setShowStatusDialog(true);
                          } else {
                            // For simple status changes, update immediately
                            setSelectedStatus(value);
                            handleStatusChange();
                          }
                        }}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Change Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableStatuses().map((status) => {
                            const Icon = status.icon;
                            return (
                              <SelectItem key={status.value} value={status.value}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  <span>{status.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            (canCreateActionPlan() && isCreateActionPlanButton) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Create Action Plan
                  </CardTitle>
                  <CardDescription>
                    No action plan has been created for this finding yet. You can create one below.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setIsEditing(true)}
                    disabled={actionLoading}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Create Action Plan
                  </Button>
                </CardContent>
              </Card>
            )
          )}

          {/* Action Plan Details */}
          {actionPlan && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Action Plan Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <div className="text-sm text-gray-500">Submitted On</div>
                      <div className="font-medium">{formatDate(actionPlan.created_at)}</div>
                      <div className="text-xs text-gray-500">{formatTime(actionPlan.created_at)}</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="text-sm text-gray-500 mb-2">Action Plan Description</div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-700">{actionPlan.action_plan}</p>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-2">Timeline</div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-700">{actionPlan.timeline}</p>
                  </div>
                </div>

                {/* Progress Display */}
                <div>
                  <div className="text-sm text-gray-500 mb-3">Progress Status</div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-md border">
                    <ProgressCircle
                      percentage={actionPlan.progress_percentage || 0}
                      size={60}
                      showPercentage={true}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-lg">
                        {actionPlan.progress_percentage || 0}% Complete
                      </div>
                      {actionPlan.progress_justification && (
                        <div className="text-sm text-gray-600 mt-1">
                          <strong>Latest Update:</strong> {actionPlan.progress_justification}
                        </div>
                      )}
                      {!actionPlan.progress_justification && (
                        <div className="text-sm text-gray-400 mt-1">
                          No progress updates yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Responsible Persons */}
                {actionPlan.responsiblePersons && actionPlan.responsiblePersons.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <div className="text-sm text-gray-500 mb-3">Responsible Persons ({actionPlan.responsiblePersons.length})</div>
                      <div className="space-y-2">
                        {actionPlan.responsiblePersons.map((rp) => {
                          // Handle both user and User (capital U) from API
                          const user = rp.user || rp.User;
                          return (
                            <div key={rp.responsible_person_id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md border">
                              <Users className="h-4 w-4 text-blue-500" />
                              <div className="flex-1">
                                <div className="font-medium text-sm">{user?.username}</div>
                                <div className="text-xs text-gray-500">
                                  {user?.role?.replace(/_/g, ' ')} • {user?.department}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {user?.email}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}



                {/* Evidence Files */}
                {actionPlan.evidences && actionPlan.evidences.length > 0 ? (
                  <>
                    <Separator />
                    <div>
                      <div className="text-sm text-gray-500 mb-3">Evidence Files ({actionPlan.evidences.length})</div>
                      <div className="space-y-3">
                        {actionPlan.evidences.map((evidence, index) => (
                          <div key={evidence.evidence_id || evidence.id || index} className="border p-3 rounded-md">
                            <div className="text-sm font-medium">{evidence.file_name || 'Unknown File'}</div>
                            <div className="text-xs text-gray-500">
                              Type: {evidence.file_type || 'Unknown'} |
                              Path: {evidence.file_path || 'No path'} |
                              ID: {evidence.evidence_id || evidence.id || 'No ID'}
                            </div>
                            {/* Simple file display with download */}
                            <div className="flex items-center justify-between mt-2 p-2 bg-white border rounded">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{evidence.file_name || 'Evidence File'}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    // Create download handler for evidence
                                    if (evidence.file_path) {
                                      const fileUrl = `${import.meta.env.VITE_API_URL || 'https://aps2.zemenbank.com/ZAMS/api'}/${evidence.file_path}`;
                                      const link = document.createElement('a');
                                      link.href = fileUrl;
                                      link.download = evidence.file_name || 'evidence';
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                    }
                                  }}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>

                            {/* Try FilePreview component too */}
                            <FilePreview
                              file={evidence}
                              type="evidence"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-md">
                    No evidence files found
                  </div>
                )}

                {/* Resource Files */}
                {actionPlan.resources && actionPlan.resources.length > 0 ? (
                  <>
                    <Separator />
                    <div>
                      <div className="text-sm text-gray-500 mb-3">Resource Files ({actionPlan.resources.length})</div>
                      <div className="space-y-3">
                        {actionPlan.resources.map((resource, index) => (
                          <div key={resource.id || index} className="border p-3 rounded-md">
                            <div className="text-sm font-medium">{resource.file_name || resource.resource_name || 'Unknown File'}</div>
                            <div className="text-xs text-gray-500">
                              Type: {resource.file_type || 'Unknown'} |
                              Path: {resource.file_path || 'No path'} |
                              ID: {resource.id || 'No ID'}
                            </div>
                            {/* Simple file display with download */}
                            <div className="flex items-center justify-between mt-2 p-2 bg-white border rounded">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{resource.file_name || resource.resource_name || 'Resource File'}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDownloadResource(resource)}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>

                            {/* Try FilePreview component too */}
                            <FilePreview
                              file={resource}
                              type="resource"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-md">
                    No resource files found
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <div className="font-medium">
                    {actionPlan ? getActionPlanStatusBadge(actionPlan.status) : 'No Action Plan'}
                  </div>
                </div>
              </div>

              {actionPlan && (
                <>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Submitted By</div>
                      <div className="font-medium">{actionPlan.submittedBy?.username || 'Unknown'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Created</div>
                      <div className="font-medium">{formatDate(actionPlan.created_at)}</div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Evidence Files
          {actionPlan && actionPlan.evidences && actionPlan.evidences.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Evidence Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {actionPlan.evidences.map((evidence) => (
                    <div
                      key={evidence.evidence_id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium">{evidence.file_name}</div>
                          <div className="text-xs text-gray-500">
                            {evidence.file_type} • Uploaded {formatDate(evidence.created_at)}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadEvidence(evidence)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )} */}
        </div>
      </div>

      {/* Amendment History - Chronological Order */}
      {actionPlan && actionPlan.amendmentHistory && actionPlan.amendmentHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Amendment History
              <span className="text-sm font-normal text-gray-500">
                ({actionPlan.amendmentHistory.length} amendment{actionPlan.amendmentHistory.length !== 1 ? 's' : ''})
              </span>
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Complete chronological history of all amendments and changes
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Sort amendments by amended_at date (newest first) for chronological order */}
              {actionPlan.amendmentHistory
                .slice()
                .sort((a, b) => new Date(b.amended_at).getTime() - new Date(a.amended_at).getTime())
                .map((amendment, index) => (
                <div key={amendment.id} className="border rounded-md hover:bg-gray-50 transition-colors">
                  <div
                    className="flex items-center justify-between p-3 cursor-pointer"
                    onClick={() => setExpandedAmendments(prev => ({
                      ...prev,
                      [amendment.id]: !prev[amendment.id]
                    }))}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {expandedAmendments[amendment.id] ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-gray-900">
                            Amendment #{actionPlan.amendmentHistory.length - index}
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

                  {expandedAmendments[amendment.id] && (
                    <div className="border-t p-3 bg-gray-50">
                      <div className="space-y-3">
                        {/* Change Detection - Compare with previous amendment in chronological order */}
                        {(() => {
                          // Get the sorted array for proper chronological comparison
                          const sortedAmendments = actionPlan.amendmentHistory
                            .slice()
                            .sort((a, b) => new Date(b.amended_at).getTime() - new Date(a.amended_at).getTime());

                          const currentIndex = sortedAmendments.findIndex(a => a.id === amendment.id);
                          const previousAmendment = sortedAmendments[currentIndex + 1];

                          if (!previousAmendment) return null;

                          const changes = getChanges(amendment, previousAmendment);

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
                          <div className="text-sm font-medium text-gray-700 mb-1">Action Plan Description</div>
                          <div className="bg-white p-2 rounded border text-sm">
                            {amendment.action_plan || 'Not specified'}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Timeline</div>
                          <div className="bg-white p-2 rounded border text-sm">
                            {amendment.timeline || 'Not specified'}
                          </div>
                        </div>

                        {/* Progress Information */}
                        {(amendment.progress_percentage !== undefined || amendment.progress_justification) && (
                          <div>
                            <div className="text-sm font-medium text-gray-700 mb-2">Progress Update</div>
                            <div className="bg-white p-3 rounded border">
                              <div className="flex items-center gap-3 mb-2">
                                <ProgressCircle
                                  percentage={amendment.progress_percentage || 0}
                                  size={40}
                                  showPercentage={true}
                                />
                                <div>
                                  <div className="text-sm font-medium">
                                    {amendment.progress_percentage || 0}% Complete
                                  </div>
                                </div>
                              </div>
                              {amendment.progress_justification && (
                                <div className="text-sm text-gray-600 mt-2">
                                  <strong>Justification:</strong> {amendment.progress_justification}
                                </div>
                              )}
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

              {/* Amendment History Summary */}
              <div className="mt-4 pt-4 border-t bg-gray-50 rounded-md p-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Total amendments:</span> {actionPlan.amendmentHistory.length}
                  </div>
                  <div>
                    <span className="font-medium">First amendment:</span> {formatDate(
                      actionPlan.amendmentHistory
                        .slice()
                        .sort((a, b) => new Date(a.amended_at).getTime() - new Date(b.amended_at).getTime())[0]?.amended_at
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Latest amendment:</span> {formatDate(
                      actionPlan.amendmentHistory
                        .slice()
                        .sort((a, b) => new Date(b.amended_at).getTime() - new Date(a.amended_at).getTime())[0]?.amended_at
                    )}
                  </div>
                </div>

                {/* Amendment status distribution */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(actionPlan.amendmentHistory.map(a => a.status).filter(Boolean)))
                      .map(status => {
                        const count = actionPlan.amendmentHistory.filter(a => a.status === status).length;
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
            </div>
          </CardContent>
        </Card>
      )}
      </div>

      {/* Editing Form Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              {actionPlan ? 'Amend Action Plan' : 'Create Action Plan'}
            </DialogTitle>
            <DialogDescription>
              {actionPlan ? 'Update the action plan description and provide additional evidence if needed.' : 'Provide a detailed description of the action plan to address this audit finding.'}
            </DialogDescription>
          </DialogHeader>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label htmlFor="action-plan-text">Action Plan Description</Label>
                <Textarea
                  id="action-plan-text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Describe the action plan to address this audit finding..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="due-date">Due Date *</Label>
                  <DatePicker
                    date={editDueDate}
                    onDateChange={setEditDueDate}
                    placeholder="Select due date"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="timeline">Timeline (Optional)</Label>
                  <Input
                    id="timeline"
                    value={editTimeline}
                    onChange={(e) => setEditTimeline(e.target.value)}
                    placeholder="e.g., 30 days, 3 months"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Responsible Persons Section */}
              <div>
                <Label>Responsible Persons (Optional)</Label>
                <MultiUserSelect
                  selectedUsers={selectedResponsiblePersons}
                  onUsersChange={setSelectedResponsiblePersons}
                  placeholder="Select responsible persons..."
                  searchPlaceholder="Search users..."
                  onLoadUsers={loadUsers}
                  className="mt-1"
                />
              </div>

              {/* Evidence Files Section */}
              <div>
                <Label htmlFor="evidence-files">Evidence Files (Optional)</Label>
                <Input
                  id="evidence-files"
                  type="file"
                  multiple
                  onChange={(e) => handleFileSelect(e.target.files, 'evidence')}
                  className="mt-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload supporting evidence files (PDF, DOC, DOCX, XLS, XLSX, images). Max 10MB per file.
                </p>

                {/* Evidence Files List */}
                {evidenceFiles.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <div className="text-sm font-medium text-gray-700">Evidence Files:</div>
                    {evidenceFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4 text-blue-600" />
                          <div>
                            <div className="font-medium text-sm">{file.name}</div>
                            <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index, 'evidence')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resource Files Section */}
              <div>
                <Label htmlFor="resource-files">Resource Files (Optional)</Label>
                <Input
                  id="resource-files"
                  type="file"
                  multiple
                  onChange={(e) => handleFileSelect(e.target.files, 'resource')}
                  className="mt-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload resource files for implementation (PDF, DOC, DOCX, XLS, XLSX, images). Max 10MB per file.
                </p>

                {/* Resource Files List */}
                {resourceFiles.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <div className="text-sm font-medium text-gray-700">Resource Files:</div>
                    {resourceFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4 text-green-600" />
                          <div>
                            <div className="font-medium text-sm">{file.name}</div>
                            <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index, 'resource')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditText('');
                  setEditTimeline('');
                  setEditDueDate(undefined);
                  setSelectedFile(null);
                  setEvidenceFiles([]);
                  setResourceFiles([]);
                  setSelectedResponsiblePersons([]);
                }}
                disabled={actionLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={actionPlan ? handleAmendActionPlan : handleCreateActionPlan}
                disabled={actionLoading || !editText.trim() || (!actionPlan && !editDueDate)}
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {actionPlan ? 'Save Amendment' : 'Create Action Plan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Status Change Confirmation Dialog */}
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedStatus && (
                  <>
                    {(() => {
                      const status = ACTION_PLAN_STATUSES.find(s => s.value === selectedStatus);
                      const Icon = status?.icon || Clock;
                      return <Icon className="h-5 w-5" />;
                    })()}
                    Change Status to {ACTION_PLAN_STATUSES.find(s => s.value === selectedStatus)?.label}
                  </>
                )}
              </DialogTitle>
              <DialogDescription>
                {selectedStatus === 'Completed'
                  ? 'Please provide details about the completion of this action plan.'
                  : 'You can optionally provide a reason for this status change.'
                }
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="status-reason">
                  {selectedStatus === 'Completed' ? 'Completion Details *' : 'Reason (Optional)'}
                </Label>
                <Textarea
                  id="status-reason"
                  value={statusChangeReason}
                  onChange={(e) => setStatusChangeReason(e.target.value)}
                  placeholder={
                    selectedStatus === 'Completed'
                      ? 'Describe what was completed and any relevant details...'
                      : 'Provide additional context for this status change...'
                  }
                  rows={4}
                  className="mt-1"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowStatusDialog(false);
                  setSelectedStatus('');
                  setStatusChangeReason('');
                }}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleStatusChange}
                disabled={actionLoading || (selectedStatus === 'Completed' && !statusChangeReason.trim())}
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  (() => {
                    const status = ACTION_PLAN_STATUSES.find(s => s.value === selectedStatus);
                    const Icon = status?.icon || Clock;
                    return <Icon className="h-4 w-4 mr-2" />;
                  })()
                )}
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Amendment Dialog */}
        <Dialog open={showAmendDialog} onOpenChange={setShowAmendDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-blue-600" />
                Amend Action Plan
              </DialogTitle>
              <DialogDescription>
                Modify the action plan details. All changes will be tracked in the amendment history.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Action Plan Text */}
              <div>
                <Label htmlFor="amend-action-plan">Action Plan *</Label>
                <Textarea
                  id="amend-action-plan"
                  value={amendActionPlan}
                  onChange={(e) => setAmendActionPlan(e.target.value)}
                  placeholder="Describe the action plan to address this finding..."
                  rows={6}
                  className="mt-1"
                />
              </div>

              {/* Timeline and Due Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amend-timeline">Timeline</Label>
                  <Input
                    id="amend-timeline"
                    value={amendTimeline}
                    onChange={(e) => setAmendTimeline(e.target.value)}
                    placeholder="e.g., 30 days, Q1 2024, etc."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="amend-due-date">Due Date</Label>
                  <DatePicker
                    date={amendDueDate}
                    onDateChange={setAmendDueDate}
                    placeholder="Select due date"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Responsible Persons */}
              <div>
                <Label htmlFor="amend-responsible-persons">Responsible Persons (Optional)</Label>
                <MultiUserSelect
                  selectedUsers={amendSelectedResponsiblePersons}
                  onUsersChange={setAmendSelectedResponsiblePersons}
                  placeholder="Select responsible persons..."
                  searchPlaceholder="Search users..."
                  onLoadUsers={loadUsers}
                  className="mt-1"
                />
              </div>

              {/* Evidence Files */}
              <div>
                <Label htmlFor="amend-evidence-files">Evidence Files (Optional)</Label>
                <Input
                  id="amend-evidence-files"
                  type="file"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setAmendEvidenceFiles(Array.from(e.target.files));
                    }
                  }}
                  className="mt-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload evidence files (PDF, DOC, DOCX, XLS, XLSX, images). Max 10MB per file.
                </p>

                {/* Evidence Files List */}
                {amendEvidenceFiles.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <div className="text-sm font-medium text-gray-700">Evidence Files:</div>
                    {amendEvidenceFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-blue-600" />
                          <div>
                            <div className="font-medium text-sm">{file.name}</div>
                            <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setAmendEvidenceFiles(prev => prev.filter((_, i) => i !== index));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resource Files */}
              <div>
                <Label htmlFor="amend-resource-files">Resource Files (Optional)</Label>
                <Input
                  id="amend-resource-files"
                  type="file"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setAmendResourceFiles(Array.from(e.target.files));
                    }
                  }}
                  className="mt-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload resource files for implementation (PDF, DOC, DOCX, XLS, XLSX, images). Max 10MB per file.
                </p>

                {/* Resource Files List */}
                {amendResourceFiles.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <div className="text-sm font-medium text-gray-700">Resource Files:</div>
                    {amendResourceFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4 text-green-600" />
                          <div>
                            <div className="font-medium text-sm">{file.name}</div>
                            <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setAmendResourceFiles(prev => prev.filter((_, i) => i !== index));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAmendDialog(false);
                  setAmendActionPlan('');
                  setAmendTimeline('');
                  setAmendDueDate(undefined);
                  setAmendSelectedResponsiblePersons([]);
                  setAmendEvidenceFiles([]);
                  setAmendResourceFiles([]);
                }}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitAmendment}
                disabled={actionLoading || !amendActionPlan.trim()}
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Amendment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Progress Update Dialog */}
        {actionPlan && (
          <ProgressUpdateDialog
            isOpen={showProgressDialog}
            onClose={() => setShowProgressDialog(false)}
            actionPlan={actionPlan as any}
            onProgressUpdate={handleProgressUpdate}
          />
        )}
    </>
  );
};
