import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableCombobox, createComboboxOptions } from '@/components/ui/searchable-combobox';
import { toast } from 'sonner';
import { Save, ArrowLeft, Upload, File, X, Download } from 'lucide-react';
import { 
  AuditFinding, 
  AuditFindingFormData,
  AUDIT_FINDING_STATUSES,
  getRolePermissions
} from '@/types/auditFinding';
import { 
  Category, 
  RiskLevel, 
  RiskRating, 
  SystemVulnerability, 
  ComplianceGap, 
  RelevantStandard, 
  BusinessComplianceGap
} from '@/types/referenceData';
import { User } from '@/types/user';

interface AuditFindingFormProps {
  user: User;
  finding?: AuditFinding;
  initialFormData?: AuditFindingFormData; // For multi-tab mode with unsaved data
  initialSelectedFiles?: File[]; // For multi-tab mode with selected files
  initialExistingFiles?: any[]; // For multi-tab mode with existing files
  onSave?: (finding: AuditFinding) => void;
  onCancel?: () => void;
  hideActions?: boolean;
  onDataChange?: (data: AuditFindingFormData, hasChanges: boolean) => void;
  onFilesChange?: (selectedFiles: File[], existingFiles: any[]) => void;
  selectedBranchId?: string; // Branch ID from role-based branch selection
}

export const AuditFindingForm = ({
  user,
  finding,
  initialFormData,
  initialSelectedFiles = [],
  initialExistingFiles = [],
  onSave,
  onCancel,
  hideActions,
  onDataChange,
  onFilesChange,
  selectedBranchId
}: AuditFindingFormProps) => {
  // console.log('🎯 AuditFindingForm component rendered with user:', user?.username, 'role:', user?.role, 'department:', user?.department);

  const { api } = useAuth();

  // Add null check for user
  if (!user) {
    console.log('❌ No user provided to AuditFindingForm');
    return <div>Loading...</div>;
  }

  const [loading, setLoading] = useState(false);
  const [referenceDataLoading, setReferenceDataLoading] = useState(true);

  // Get user permissions
  const permissions = getRolePermissions(user.role, user.department);
  const isEditing = !!finding;

  // Debug: Check if IT fields should be shown
  // console.log('🔧 IT Fields Debug:', {
  //   userRole: user.role,
  //   userDepartment: user.department,
  //   requiresITFields: permissions.requiresITFields,
  //   shouldShowITFields: user.department === 'IT_Audit'
  // });

  // console.log('📋 Form initialized with permissions:', permissions);

  // Form state
  const [formData, setFormData] = useState<AuditFindingFormData>({
    title: '',
    description: '',
    criteria: '',
    cause: '',
    impact: '',
    recommendation: '',
    amount: 0,
    risk_level_id: '',
    category_id: '',
    risk_rating_id: '',
    vulnerability_id: '',
    compliance_gap_id: '',
    standard_id: '',
    status: 'Pending',
    due_date: ''
  });

  // Reference data
  const [categories, setCategories] = useState<Category[]>([]);
  const [riskLevels, setRiskLevels] = useState<RiskLevel[]>([]);
  const [riskRatings, setRiskRatings] = useState<RiskRating[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<SystemVulnerability[]>([]);
  const [businessComplianceGaps, setBusinessComplianceGaps] = useState<BusinessComplianceGap[]>([]);
  const [complianceGaps, setComplianceGaps] = useState<ComplianceGap[]>([]);
  const [standards, setStandards] = useState<RelevantStandard[]>([]);

  // File handling state - initialize with props
  const [selectedFiles, setSelectedFiles] = useState<File[]>(initialSelectedFiles);
  const [existingFiles, setExistingFiles] = useState<any[]>(initialExistingFiles);

  // Track initial form data for change detection - updates when finding changes
  const [initialFormDataForChangeDetection, setInitialFormDataForChangeDetection] = useState(formData);

  // Refs to prevent infinite loops
  const isInitializedRef = useRef(false);
  const lastInitialDataRef = useRef<string>('');

  // Memoize the initial form data to prevent unnecessary re-renders
  const memoizedInitialFormData = useMemo(() => {
    if (finding) {
      return {
        title: finding.title,
        description: finding.description,
        criteria: finding.criteria,
        cause: finding.cause,
        impact: finding.impact,
        recommendation: finding.recommendation,
        amount: finding.amount,
        risk_level_id: finding.risk_level_id,
        category_id: finding.category_id,
        risk_rating_id: finding.risk_rating_id,
        vulnerability_id: finding.vulnerability_id || '',
        compliance_gap_id: finding.compliance_gap_id || '',
        standard_id: finding.standard_id || '',
        status: finding.status as AuditFindingFormData['status'],
        due_date: finding.due_date ? finding.due_date.split('T')[0] : ''
      };
    } else if (initialFormData) {
      return { ...initialFormData };
    } else {
      return {
        title: '',
        description: '',
        criteria: '',
        cause: '',
        impact: '',
        recommendation: '',
        amount: 0,
        risk_level_id: '',
        category_id: '',
        risk_rating_id: '',
        vulnerability_id: '',
        compliance_gap_id: '',
        standard_id: '',
        status: 'Pending',
        due_date: ''
      };
    }
  }, [finding, initialFormData]);

  // Initialize form data when the memoized data changes
  useEffect(() => {
    const currentDataString = JSON.stringify({
      memoizedInitialFormData,
      findingId: finding?.id,
      initialSelectedFiles: initialSelectedFiles?.length || 0,
      initialExistingFiles: initialExistingFiles?.length || 0
    });

    // Only initialize if data has actually changed
    if (lastInitialDataRef.current !== currentDataString) {
      console.log('🔄 AuditFindingForm: Initializing form data (data changed)');

      setFormData(memoizedInitialFormData as AuditFindingFormData);
      setInitialFormDataForChangeDetection(memoizedInitialFormData as AuditFindingFormData);

      // Handle files
      if (finding && finding.evidences) {
        setExistingFiles(finding.evidences);
        setSelectedFiles([]);
      } else {
        setSelectedFiles(initialSelectedFiles || []);
        setExistingFiles(initialExistingFiles || []);
      }

      lastInitialDataRef.current = currentDataString;
      isInitializedRef.current = true;
    }
  }, [memoizedInitialFormData, finding, initialSelectedFiles, initialExistingFiles]);

  // Fetch reference data - EXACT COPY from working EscalationRulesManagement
  const fetchReferenceData = async () => {
    console.log('🔄 Starting fetchReferenceData...');
    setReferenceDataLoading(true);
    try {
      console.log('📡 Making API calls to reference data endpoints...');
      const [categoriesRes, riskLevelsRes, riskRatingsRes, vulnerabilitiesRes, complianceGapsRes, standardsRes, businessComplianceGapsRes] = await Promise.all([
        api.get('/api/reference-data/categories?limit=1000'), // Get all items for dropdowns
        api.get('/api/reference-data/risk-levels?limit=1000'),
        api.get('/api/reference-data/risk-ratings?limit=1000'),
        api.get('/api/reference-data/vulnerabilities?limit=1000'),
        api.get('/api/reference-data/compliance-gaps?limit=1000'),
        api.get('/api/reference-data/standards?limit=1000'),
        api.get('/api/reference-data/business-compliance-gaps?limit=1000')
      ]);
      console.log('✅ API calls completed successfully');

      // Handle paginated response format: { data: [...], total: ..., page: ... } - EXACT COPY
      setCategories(categoriesRes.data?.data || categoriesRes.data || []);
      setRiskLevels(riskLevelsRes.data?.data || riskLevelsRes.data || []);
      setRiskRatings(riskRatingsRes.data?.data || riskRatingsRes.data || []);
      setVulnerabilities(vulnerabilitiesRes.data?.data || vulnerabilitiesRes.data || []);
      setComplianceGaps(complianceGapsRes.data?.data || complianceGapsRes.data || []);
      setBusinessComplianceGaps(businessComplianceGapsRes.data?.data || businessComplianceGapsRes.data || []);
      setStandards(standardsRes.data?.data || standardsRes.data || []);

      console.log('📊 Reference Data Loaded:', {
        categories: (categoriesRes.data?.data || categoriesRes.data || []).length,
        riskLevels: (riskLevelsRes.data?.data || riskLevelsRes.data || []).length,
        riskRatings: (riskRatingsRes.data?.data || riskRatingsRes.data || []).length,
        vulnerabilities: (vulnerabilitiesRes.data?.data || vulnerabilitiesRes.data || []).length,
        complianceGaps: (complianceGapsRes.data?.data || complianceGapsRes.data || []).length,
        businessComplianceGaps: (businessComplianceGapsRes.data?.data || businessComplianceGapsRes.data || []).length,
        standards: (standardsRes.data?.data || standardsRes.data || []).length
      });


    } catch (error) {
      console.error('❌ Error fetching reference data:', error);
      toast.error('Failed to fetch reference data');
      // Set empty arrays as fallback - EXACT COPY from working implementation
      setCategories([]);
      setRiskLevels([]);
      setRiskRatings([]);
      setVulnerabilities([]);
      setComplianceGaps([]);
      setStandards([]);
    } finally {
      setReferenceDataLoading(false);
      console.log('🏁 fetchReferenceData completed');
    }
  };

  useEffect(() => {
    console.log('🚀 AuditFindingForm mounted, calling fetchReferenceData...');
    console.log('🔍 API instance available:', !!api);
    console.log('🔍 User available:', !!user);

    if (!api) {
      console.error('❌ API instance not available');
      return;
    }

    // Test if API is working with a simple call first
    const testAPI = async () => {
      try {
        console.log('🧪 Testing API with simple call...');
        const testResponse = await api.get('/api/reference-data/categories?limit=5');
        console.log('✅ Test API call successful:', testResponse.data);
      } catch (error) {
        console.error('❌ Test API call failed:', error);
        console.error('❌ Error details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
      }
    };

    testAPI();
    fetchReferenceData();
  }, [api]);

  // Only notify parent when user actually changes something, not on every render
  const notifyParentOfChanges = useCallback(() => {
    if (onDataChange && isInitializedRef.current) {
      const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialFormDataForChangeDetection) ||
                        selectedFiles.length > 0;
      onDataChange(formData, hasChanges);
    }
  }, [formData, selectedFiles, onDataChange, initialFormDataForChangeDetection]);

  const notifyParentOfFileChanges = useCallback(() => {
    if (onFilesChange && isInitializedRef.current) {
      onFilesChange(selectedFiles, existingFiles);
    }
  }, [selectedFiles, existingFiles, onFilesChange]);

  // Remove automatic useEffect calls that cause infinite loops
  // Instead, we'll call these functions only when user actually makes changes

  // File handling functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newSelectedFiles = [...selectedFiles, ...files];
    setSelectedFiles(newSelectedFiles);

    // Notify parent of file changes
    if (onFilesChange && isInitializedRef.current) {
      onFilesChange(newSelectedFiles, existingFiles);
    }
  };

  const removeSelectedFile = (index: number) => {
    const newSelectedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newSelectedFiles);

    // Notify parent of file changes
    if (onFilesChange && isInitializedRef.current) {
      onFilesChange(newSelectedFiles, existingFiles);
    }
  };

  const removeExistingFile = async (evidenceId: string) => {
    try {
      await api.put(`/api/audit-findings/evidence/${evidenceId}/deactivate`);
      const newExistingFiles = existingFiles.filter(file => file.evidence_id !== evidenceId);
      setExistingFiles(newExistingFiles);

      // Notify parent of file changes
      if (onFilesChange && isInitializedRef.current) {
        onFilesChange(selectedFiles, newExistingFiles);
      }

      toast.success('File removed successfully');
    } catch (error) {
      console.error('Error removing file:', error);
      toast.error('Failed to remove file');
    }
  };

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
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };



  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.description || !formData.criteria || 
        !formData.cause || !formData.impact || !formData.recommendation ||
        !formData.amount || !formData.risk_level_id || !formData.category_id || 
        !formData.risk_rating_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    // IT Audit specific validation
    if (permissions.requiresITFields) {
      if (!formData.vulnerability_id || !formData.compliance_gap_id || !formData.standard_id) {
        toast.error('IT Audit findings require vulnerability, compliance gap, and standard fields');
        return;
      }
    }

    setLoading(true);
    try {
      let response;

      // Check if we have files to upload or if we're in multi-tab mode
      const hasFiles = selectedFiles.length > 0;
      const isMultiTabMode = hideActions; // hideActions indicates multi-tab mode

      if (hasFiles && !isMultiTabMode) {
        // Single mode with files - use FormData
        const formDataWithFiles = new FormData();

        // Add form fields
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formDataWithFiles.append(key, value.toString());
          }
        });

        // Add selected branch ID if available
        if (selectedBranchId) {
          formDataWithFiles.append('branch_id', selectedBranchId);
          console.log('🏢 Adding branch_id to FormData:', selectedBranchId);
        }

        // Add files
        selectedFiles.forEach((file) => {
          formDataWithFiles.append('evidence_files', file);
        });

        console.log('🚀 Submitting audit finding with FormData (files included)');

        if (isEditing) {
          response = await api.put(`/api/audit-findings/${finding.id}`, formDataWithFiles, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          toast.success('Audit finding updated successfully');
        } else {
          response = await api.post('/api/audit-findings', formDataWithFiles, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          toast.success('Audit finding created successfully');
        }
      } else {
        // No files or multi-tab mode - use JSON
        const submitData = {
          ...formData,
          ...(selectedBranchId && { branch_id: selectedBranchId })
        };

        console.log('🚀 Submitting audit finding with JSON data:', {
          ...submitData,
          branch_id: selectedBranchId || 'Not provided'
        });

        if (isEditing) {
          response = await api.put(`/api/audit-findings/${finding.id}`, submitData);
          toast.success('Audit finding updated successfully');
        } else {
          response = await api.post('/api/audit-findings', submitData);
          toast.success('Audit finding created successfully');
        }

        // Files are handled by parent component in multi-tab mode
      }

      if (onSave) {
        onSave(response.data);
      }
    } catch (error: any) {
      console.error('Error saving audit finding:', error);
      const errorMessage = error.response?.data?.error || 'Failed to save audit finding';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof AuditFindingFormData, value: string | number) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Notify parent component of data changes (only when user actually changes something)
    if (onDataChange && isInitializedRef.current) {
      const hasChanges = JSON.stringify(newFormData) !== JSON.stringify(initialFormDataForChangeDetection) ||
                        selectedFiles.length > 0;
      onDataChange(newFormData, hasChanges);
    }
  };



  if (referenceDataLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading reference data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex items-center gap-4">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Audit Finding' : 'Create Audit Finding'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update the audit finding details' : 'Create a new audit finding'}
            </p>
            {/* Debug button to manually test API */}
            {/* <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                console.log('🔄 Manual API test triggered');
                fetchReferenceData();
              }}
            >
              🧪 Test API
            </Button> */}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Finding' : 'New Finding'}</CardTitle>
          <CardDescription>
            {permissions.requiresITFields 
              ? 'Fill in all required fields including IT-specific information'
              : 'Fill in all required fields for the audit finding'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter finding title"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter detailed description"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="amount">Amount (ETB) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                    placeholder="Enter amount"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => handleInputChange('due_date', e.target.value)}
                    placeholder="Select due date"
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {AUDIT_FINDING_STATUSES.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="evidence_files">Evidence Files</Label>
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              Upload evidence files
                            </span>
                            <span className="mt-1 block text-sm text-gray-500">
                              PDF, DOC, DOCX, JPG, PNG up to 10MB each
                            </span>
                          </label>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={handleFileSelect}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Selected Files */}
                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-900">Selected Files:</h4>
                        {selectedFiles.map((file, index) => (
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
                              onClick={() => removeSelectedFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Existing Files */}
                    {existingFiles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-900">Existing Files:</h4>
                        {existingFiles.map((file) => (
                          <div key={file.evidence_id} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md">
                            <div className="flex items-center gap-2">
                              <File className="h-4 w-4 text-green-600" />
                              <div>
                                <div className="font-medium text-sm">{file.original_file_name}</div>
                                <div className="text-xs text-gray-500">
                                  {(file.file_size / 1024 / 1024).toFixed(2)} MB •
                                  Uploaded by {file.uploadedBy?.username} •
                                  {new Date(file.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => downloadFile(file.evidence_id, file.original_file_name)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExistingFile(file.evidence_id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Risk Assessment</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category_id">Category *</Label>
                  <SearchableCombobox
                    options={createComboboxOptions(categories || [], 'category_name')}
                    value={formData.category_id}
                    onValueChange={(value) => handleInputChange('category_id', value)}
                    placeholder="Select category"
                    searchPlaceholder="Search categories..."
                    emptyText="No categories found"
                    loading={referenceDataLoading}
                    disabled={referenceDataLoading}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="risk_level_id">Risk Level *</Label>
                  <SearchableCombobox
                    options={createComboboxOptions(riskLevels || [], 'risk_level_name')}
                    value={formData.risk_level_id}
                    onValueChange={(value) => handleInputChange('risk_level_id', value)}
                    placeholder="Select risk level"
                    searchPlaceholder="Search risk levels..."
                    emptyText="No risk levels found"
                    loading={referenceDataLoading}
                    disabled={referenceDataLoading}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="risk_rating_id">Risk Rating *</Label>
                  <SearchableCombobox
                    options={createComboboxOptions(riskRatings || [], 'risk_rating_name')}
                    value={formData.risk_rating_id}
                    onValueChange={(value) => handleInputChange('risk_rating_id', value)}
                    placeholder="Select risk rating"
                    searchPlaceholder="Search risk ratings..."
                    emptyText="No risk ratings found"
                    loading={referenceDataLoading}
                    disabled={referenceDataLoading}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Business Audit Specific Fields */}
            {!permissions.requiresITFields && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Business Audit Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="business_compliance_gap_id">Compliance Gap *</Label>
                    <p className="text-xs text-gray-500 mb-2">Description of compliance gap</p>
                    <SearchableCombobox
                      options={createComboboxOptions(businessComplianceGaps || [], 'gap_name')}
                      value={formData.business_compliance_gap_id}
                      onValueChange={(value) => handleInputChange('business_compliance_gap_id', value)}
                      placeholder="Select business compliance gap"
                      searchPlaceholder="Search business compliance gaps..."
                      emptyText="No business compliance gaps found"
                      loading={referenceDataLoading}
                      disabled={referenceDataLoading}
                      required
                    />
                  </div>



                  
                </div>
              </div>
            )}




            {permissions.requiresITFields && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">IT Audit Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vulnerability_id">Vulnerability Type *</Label>
                    <p className="text-xs text-gray-500 mb-2">Type of vulnerability identified</p>
                    <SearchableCombobox
                      options={createComboboxOptions(vulnerabilities || [], 'vulnerability_name')}
                      value={formData.vulnerability_id}
                      onValueChange={(value) => handleInputChange('vulnerability_id', value)}
                      placeholder="Select vulnerability type"
                      searchPlaceholder="Search vulnerability types..."
                      emptyText="No vulnerability types found"
                      loading={referenceDataLoading}
                      disabled={referenceDataLoading}
                      required
                    />
                  </div>



                  <div>
                    <Label htmlFor="compliance_gap_id">Compliance Gap *</Label>
                    <p className="text-xs text-gray-500 mb-2">Description of compliance gap</p>
                    <SearchableCombobox
                      options={createComboboxOptions(complianceGaps || [], 'gap_name')}
                      value={formData.compliance_gap_id}
                      onValueChange={(value) => handleInputChange('compliance_gap_id', value)}
                      placeholder="Select compliance gap"
                      searchPlaceholder="Search compliance gaps..."
                      emptyText="No compliance gaps found"
                      loading={referenceDataLoading}
                      disabled={referenceDataLoading}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="standard_id">Relevant Standard *</Label>
                    <p className="text-xs text-gray-500 mb-2">Applicable standard or framework</p>
                    <SearchableCombobox
                      options={createComboboxOptions(standards || [], 'standard_name')}
                      value={formData.standard_id}
                      onValueChange={(value) => handleInputChange('standard_id', value)}
                      placeholder="Select standard"
                      searchPlaceholder="Search standards..."
                      emptyText="No standards found"
                      loading={referenceDataLoading}
                      disabled={referenceDataLoading}
                      required
                    />
                  </div>
                </div>
              </div>
            )}


            {/* Detailed Analysis */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Detailed Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="criteria">Criteria *</Label>
                  <Textarea
                    id="criteria"
                    value={formData.criteria}
                    onChange={(e) => handleInputChange('criteria', e.target.value)}
                    placeholder="Enter audit criteria"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cause">Cause *</Label>
                  <Textarea
                    id="cause"
                    value={formData.cause}
                    onChange={(e) => handleInputChange('cause', e.target.value)}
                    placeholder="Enter root cause"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="impact">Impact *</Label>
                  <Textarea
                    id="impact"
                    value={formData.impact}
                    onChange={(e) => handleInputChange('impact', e.target.value)}
                    placeholder="Enter impact description"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="recommendation">Recommendation *</Label>
                  <Textarea
                    id="recommendation"
                    value={formData.recommendation}
                    onChange={(e) => handleInputChange('recommendation', e.target.value)}
                    placeholder="Enter recommendations"
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            {!hideActions && (
              <div className="flex justify-end gap-4 pt-6 border-t">
                {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : (isEditing ? 'Update Finding' : 'Create Finding')}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
