
import { useState, useEffect } from 'react';
import { User, useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableCombobox, createComboboxOptions } from '@/components/ui/searchable-combobox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Save, AlertCircle, Check, ChevronsUpDown, Upload, File, X, Download } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Category,
  RiskLevel,
  RiskRating,
  SystemVulnerability,
  ComplianceGap,
  RelevantStandard
} from '@/types/referenceData';

interface CreateFindingProps {
  user: User;
}

export const CreateFinding = ({ user }: CreateFindingProps) => {
  console.log('🎯 CreateFinding component rendered with user:', user?.username, 'role:', user?.role, 'department:', user?.department);

  const { api } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    criteria: '',
    cause: '',
    impact: '',
    recommendation: '',
    amount: 0,
    category_id: '',
    risk_level_id: '',
    risk_rating_id: '',
    due_date: '',
    status: 'Pending',
    // IT-specific fields
    vulnerability_id: '',
    compliance_gap_id: '',
    standard_id: ''
  });

  // File attachments removed as per user request
  const [loading, setLoading] = useState(false);
  const [referenceDataLoading, setReferenceDataLoading] = useState(true);

  // File handling state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  // Combobox open states for searchable dropdowns
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [riskLevelOpen, setRiskLevelOpen] = useState(false);
  const [riskRatingOpen, setRiskRatingOpen] = useState(false);
  const [vulnerabilityOpen, setVulnerabilityOpen] = useState(false);
  const [complianceGapOpen, setComplianceGapOpen] = useState(false);
  const [standardOpen, setStandardOpen] = useState(false);

  // Search states for filtering dropdown options
  const [categorySearch, setCategorySearch] = useState('');
  const [riskLevelSearch, setRiskLevelSearch] = useState('');
  const [riskRatingSearch, setRiskRatingSearch] = useState('');
  const [vulnerabilitySearch, setVulnerabilitySearch] = useState('');
  const [complianceGapSearch, setComplianceGapSearch] = useState('');
  const [standardSearch, setStandardSearch] = useState('');

  // Reference data state - Initialize with empty arrays to prevent undefined errors
  const [categories, setCategories] = useState<Category[]>([]);
  const [riskLevels, setRiskLevels] = useState<RiskLevel[]>([]);
  const [riskRatings, setRiskRatings] = useState<RiskRating[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<SystemVulnerability[]>([]);
  const [complianceGaps, setComplianceGaps] = useState<ComplianceGap[]>([]);
  const [standards, setStandards] = useState<RelevantStandard[]>([]);

  const isITAudit = user.department === 'IT_Audit';

  // Debug IT Audit condition
  console.log('🔧 IT Audit Debug:', {
    userDepartment: user.department,
    isITAudit: isITAudit,
    shouldShowITFields: isITAudit,
    userRole: user.role
  });

  // Fetch reference data - EXACT COPY from working EscalationRulesManagement
  const fetchReferenceData = async () => {
    console.log('🔄 Starting fetchReferenceData...');
    setReferenceDataLoading(true);
    try {
      console.log('📡 Making API calls to reference data endpoints...');
      const [categoriesRes, riskLevelsRes, riskRatingsRes, vulnerabilitiesRes, complianceGapsRes, standardsRes] = await Promise.all([
        api.get('/api/reference-data/categories?limit=1000'), // Get all items for dropdowns
        api.get('/api/reference-data/risk-levels?limit=1000'),
        api.get('/api/reference-data/risk-ratings?limit=1000'),
        api.get('/api/reference-data/vulnerabilities?limit=1000'),
        api.get('/api/reference-data/compliance-gaps?limit=1000'),
        api.get('/api/reference-data/standards?limit=1000')
      ]);
      console.log('✅ API calls completed successfully');

      // Handle paginated response format: { data: [...], total: ..., page: ... } - EXACT COPY
      // Ensure arrays are always set, even if response is malformed
      const categoriesData = Array.isArray(categoriesRes.data?.data) ? categoriesRes.data.data :
                            Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
      const riskLevelsData = Array.isArray(riskLevelsRes.data?.data) ? riskLevelsRes.data.data :
                            Array.isArray(riskLevelsRes.data) ? riskLevelsRes.data : [];
      const riskRatingsData = Array.isArray(riskRatingsRes.data?.data) ? riskRatingsRes.data.data :
                             Array.isArray(riskRatingsRes.data) ? riskRatingsRes.data : [];
      const vulnerabilitiesData = Array.isArray(vulnerabilitiesRes.data?.data) ? vulnerabilitiesRes.data.data :
                                 Array.isArray(vulnerabilitiesRes.data) ? vulnerabilitiesRes.data : [];
      const complianceGapsData = Array.isArray(complianceGapsRes.data?.data) ? complianceGapsRes.data.data :
                                Array.isArray(complianceGapsRes.data) ? complianceGapsRes.data : [];
      const standardsData = Array.isArray(standardsRes.data?.data) ? standardsRes.data.data :
                           Array.isArray(standardsRes.data) ? standardsRes.data : [];

      setCategories(categoriesData);
      setRiskLevels(riskLevelsData);
      setRiskRatings(riskRatingsData);
      setVulnerabilities(vulnerabilitiesData);
      setComplianceGaps(complianceGapsData);
      setStandards(standardsData);

      console.log('📊 Reference Data Loaded:', {
        categories: categoriesData.length,
        riskLevels: riskLevelsData.length,
        riskRatings: riskRatingsData.length,
        vulnerabilities: vulnerabilitiesData.length,
        complianceGaps: complianceGapsData.length,
        standards: standardsData.length
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
    console.log('🚀 CreateFinding mounted, calling fetchReferenceData...');
    fetchReferenceData();
  }, []);

  // File handling functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log('Files selected:', files.length, files.map(f => f.name));
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (findingId: string) => {
    if (selectedFiles.length === 0) {
      console.log('No files to upload');
      return;
    }

    console.log('Starting file upload for finding:', findingId, 'Files:', selectedFiles.length);
    setUploadingFiles(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
        console.log('Adding file to FormData:', file.name, file.size);
      });

      const response = await api.post(`/api/audit-findings/${findingId}/evidence`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('File upload response:', response.data);

      setSelectedFiles([]);
      toast.success('Files uploaded successfully');
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation - Match exact backend model requirements
    if (!formData.title || !formData.description || !formData.criteria ||
        !formData.cause || !formData.impact || !formData.recommendation ||
        !formData.amount || !formData.category_id || !formData.risk_level_id ||
        !formData.risk_rating_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    // IT Audit specific validation
    if (isITAudit) {
      if (!formData.vulnerability_id || !formData.compliance_gap_id || !formData.standard_id) {
        toast.error('IT Audit findings require vulnerability, compliance gap, and standard fields');
        return;
      }
    }

    setLoading(true);
    try {
      // Prepare data for API - Match exact backend model
      const apiData = {
        title: formData.title,
        description: formData.description,
        criteria: formData.criteria,
        cause: formData.cause,
        impact: formData.impact,
        recommendation: formData.recommendation,
        amount: parseFloat(formData.amount.toString()) || 0,
        category_id: formData.category_id,
        risk_level_id: formData.risk_level_id,
        risk_rating_id: formData.risk_rating_id,
        status: formData.status,
        due_date: formData.due_date || null,
        // IT fields
        vulnerability_id: formData.vulnerability_id || null,
        compliance_gap_id: formData.compliance_gap_id || null,
        standard_id: formData.standard_id || null
      };

      console.log('Creating finding:', apiData);
      const response = await api.post('/api/audit-findings', apiData);

      // Upload files if any
      if (selectedFiles.length > 0) {
        toast.info('Uploading files...');
        await uploadFiles(response.data.id);
      }

      toast.success('Audit finding created successfully');

      // Reset form
      setFormData({
        title: '',
        description: '',
        criteria: '',
        cause: '',
        impact: '',
        recommendation: '',
        amount: 0,
        category_id: '',
        risk_level_id: '',
        risk_rating_id: '',
        due_date: '',
        status: 'Pending',
        vulnerability_id: '',
        compliance_gap_id: '',
        standard_id: ''
      });
      // File attachments removed
    } catch (error: any) {
      console.error('Error creating audit finding:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create audit finding';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // File upload functionality removed as per user request

  if (referenceDataLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Finding</h1>
          <p className="text-gray-600">Loading reference data...</p>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading dropdowns...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Finding</h1>
        <p className="text-gray-600">Document a new audit finding for investigation</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Finding Title *
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter a descriptive title for the finding"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Provide a detailed description of the finding"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="criteria" className="block text-sm font-medium text-gray-700 mb-1">
                  Criteria *
                </label>
                <Textarea
                  id="criteria"
                  value={formData.criteria}
                  onChange={(e) => setFormData({...formData, criteria: e.target.value})}
                  placeholder="Audit criteria or standards used"
                  rows={2}
                  required
                />
              </div>

              <div>
                <label htmlFor="cause" className="block text-sm font-medium text-gray-700 mb-1">
                  Cause *
                </label>
                <Textarea
                  id="cause"
                  value={formData.cause}
                  onChange={(e) => setFormData({...formData, cause: e.target.value})}
                  placeholder="Root cause of the finding"
                  rows={2}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="impact" className="block text-sm font-medium text-gray-700 mb-1">
                  Impact *
                </label>
                <Textarea
                  id="impact"
                  value={formData.impact}
                  onChange={(e) => setFormData({...formData, impact: e.target.value})}
                  placeholder="Impact or consequence of the finding"
                  rows={2}
                  required
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (ETB) *
                </label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                  placeholder="Financial amount involved"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <SearchableCombobox
                options={createComboboxOptions(categories || [], 'category_name', ['category_description'])}
                value={formData.category_id}
                onValueChange={(value) => setFormData({...formData, category_id: value})}
                placeholder="Select category"
                searchPlaceholder="Search categories..."
                emptyText="No categories found"
                loading={referenceDataLoading}
                disabled={referenceDataLoading}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="risk_level" className="block text-sm font-medium text-gray-700 mb-1">
                  Risk Level *
                </label>
                <Popover
                  open={riskLevelOpen && !referenceDataLoading}
                  onOpenChange={(open) => {
                    setRiskLevelOpen(open);
                    if (!open) setRiskLevelSearch('');
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={riskLevelOpen}
                      className="w-full justify-between"
                      disabled={referenceDataLoading}
                    >
                      {formData.risk_level_id
                        ? riskLevels.find((level) => level.id === formData.risk_level_id)?.risk_level_name
                        : "Select risk level..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    {!referenceDataLoading && Array.isArray(riskLevels) && riskLevels.length > 0 ? (
                      <div className="max-h-60 overflow-auto">
                        <div className="p-2">
                          <Input
                            placeholder="Search risk levels..."
                            className="mb-2"
                            value={riskLevelSearch}
                            onChange={(e) => setRiskLevelSearch(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          {riskLevels
                            .filter(level =>
                              level.risk_level_name.toLowerCase().includes(riskLevelSearch.toLowerCase())
                            )
                            .map((level) => (
                              <div
                                key={level.id}
                                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setFormData({...formData, risk_level_id: level.id});
                                  setRiskLevelOpen(false);
                                  setRiskLevelSearch('');
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.risk_level_id === level.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {level.risk_level_name}
                              </div>
                            ))}
                          {riskLevels.filter(level =>
                            level.risk_level_name.toLowerCase().includes(riskLevelSearch.toLowerCase())
                          ).length === 0 && riskLevelSearch && (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              No risk levels found
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        {referenceDataLoading ? "Loading risk levels..." : "No risk levels available"}
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label htmlFor="risk_rating" className="block text-sm font-medium text-gray-700 mb-1">
                  Risk Rating *
                </label>
                <Popover
                  open={riskRatingOpen && !referenceDataLoading}
                  onOpenChange={(open) => {
                    setRiskRatingOpen(open);
                    if (!open) setRiskRatingSearch('');
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={riskRatingOpen}
                      className="w-full justify-between"
                      disabled={referenceDataLoading}
                    >
                      {formData.risk_rating_id
                        ? riskRatings.find((rating) => rating.id === formData.risk_rating_id)?.risk_rating_name
                        : "Select risk rating..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    {!referenceDataLoading && Array.isArray(riskRatings) && riskRatings.length > 0 ? (
                      <div className="max-h-60 overflow-auto">
                        <div className="p-2">
                          <Input
                            placeholder="Search risk ratings..."
                            className="mb-2"
                            value={riskRatingSearch}
                            onChange={(e) => setRiskRatingSearch(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          {riskRatings
                            .filter(rating =>
                              rating.risk_rating_name.toLowerCase().includes(riskRatingSearch.toLowerCase())
                            )
                            .map((rating) => (
                              <div
                                key={rating.id}
                                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setFormData({...formData, risk_rating_id: rating.id});
                                  setRiskRatingOpen(false);
                                  setRiskRatingSearch('');
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.risk_rating_id === rating.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {rating.risk_rating_name}
                              </div>
                            ))}
                          {riskRatings.filter(rating =>
                            rating.risk_rating_name.toLowerCase().includes(riskRatingSearch.toLowerCase())
                          ).length === 0 && riskRatingSearch && (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              No risk ratings found
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        {referenceDataLoading ? "Loading risk ratings..." : "No risk ratings available"}
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* IT-Specific Fields */}
        {(() => {
          console.log('🎯 Rendering IT Audit section check:', { isITAudit, userDepartment: user.department });
          return isITAudit;
        })() && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <span>IT Audit Specific Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vulnerability_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Vulnerability Type *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Type of vulnerability identified</p>
                  <Popover
                    open={vulnerabilityOpen && !referenceDataLoading}
                    onOpenChange={(open) => {
                      setVulnerabilityOpen(open);
                      if (!open) setVulnerabilitySearch('');
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={vulnerabilityOpen}
                        className="w-full justify-between"
                        disabled={referenceDataLoading}
                      >
                        {formData.vulnerability_id
                          ? vulnerabilities.find((vuln) => vuln.id === formData.vulnerability_id)?.vulnerability_name
                          : "Select vulnerability type..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      {!referenceDataLoading && Array.isArray(vulnerabilities) && vulnerabilities.length > 0 ? (
                        <div className="max-h-60 overflow-auto">
                          <div className="p-2">
                            <Input
                              placeholder="Search vulnerability types..."
                              className="mb-2"
                              value={vulnerabilitySearch}
                              onChange={(e) => setVulnerabilitySearch(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            {vulnerabilities
                              .filter(vuln =>
                                vuln.vulnerability_name.toLowerCase().includes(vulnerabilitySearch.toLowerCase())
                              )
                              .map((vuln) => (
                                <div
                                  key={vuln.id}
                                  className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    setFormData({...formData, vulnerability_id: vuln.id});
                                    setVulnerabilityOpen(false);
                                    setVulnerabilitySearch('');
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.vulnerability_id === vuln.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {vuln.vulnerability_name}
                                </div>
                              ))}
                            {vulnerabilities.filter(vuln =>
                              vuln.vulnerability_name.toLowerCase().includes(vulnerabilitySearch.toLowerCase())
                            ).length === 0 && vulnerabilitySearch && (
                              <div className="px-3 py-2 text-sm text-gray-500">
                                No vulnerability types found
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-500">
                          {referenceDataLoading ? "Loading vulnerability types..." : "No vulnerability types available"}
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label htmlFor="compliance_gap_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Compliance Gap *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Description of compliance gap</p>
                  <Popover
                    open={complianceGapOpen && !referenceDataLoading}
                    onOpenChange={(open) => {
                      setComplianceGapOpen(open);
                      if (!open) setComplianceGapSearch('');
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={complianceGapOpen}
                        className="w-full justify-between"
                        disabled={referenceDataLoading}
                      >
                        {formData.compliance_gap_id
                          ? complianceGaps.find((gap) => gap.id === formData.compliance_gap_id)?.gap_name
                          : "Select compliance gap..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      {!referenceDataLoading && Array.isArray(complianceGaps) && complianceGaps.length > 0 ? (
                        <div className="max-h-60 overflow-auto">
                          <div className="p-2">
                            <Input
                              placeholder="Search compliance gaps..."
                              className="mb-2"
                              value={complianceGapSearch}
                              onChange={(e) => setComplianceGapSearch(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            {complianceGaps
                              .filter(gap =>
                                gap.gap_name.toLowerCase().includes(complianceGapSearch.toLowerCase())
                              )
                              .map((gap) => (
                                <div
                                  key={gap.id}
                                  className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    setFormData({...formData, compliance_gap_id: gap.id});
                                    setComplianceGapOpen(false);
                                    setComplianceGapSearch('');
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.compliance_gap_id === gap.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {gap.gap_name}
                                </div>
                              ))}
                            {complianceGaps.filter(gap =>
                              gap.gap_name.toLowerCase().includes(complianceGapSearch.toLowerCase())
                            ).length === 0 && complianceGapSearch && (
                              <div className="px-3 py-2 text-sm text-gray-500">
                                No compliance gaps found
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-500">
                          {referenceDataLoading ? "Loading compliance gaps..." : "No compliance gaps available"}
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <label htmlFor="standard_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Relevant Standard *
                </label>
                <p className="text-xs text-gray-500 mb-2">Applicable standard or framework</p>
                <Popover
                  open={standardOpen && !referenceDataLoading}
                  onOpenChange={(open) => {
                    setStandardOpen(open);
                    if (!open) setStandardSearch('');
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={standardOpen}
                      className="w-full justify-between"
                      disabled={referenceDataLoading}
                    >
                      {formData.standard_id
                        ? standards.find((standard) => standard.id === formData.standard_id)?.standard_name
                        : "Select standard..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    {!referenceDataLoading && Array.isArray(standards) && standards.length > 0 ? (
                      <div className="max-h-60 overflow-auto">
                        <div className="p-2">
                          <Input
                            placeholder="Search standards..."
                            className="mb-2"
                            value={standardSearch}
                            onChange={(e) => setStandardSearch(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          {standards
                            .filter(standard =>
                              standard.standard_name.toLowerCase().includes(standardSearch.toLowerCase())
                            )
                            .map((standard) => (
                              <div
                                key={standard.id}
                                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setFormData({...formData, standard_id: standard.id});
                                  setStandardOpen(false);
                                  setStandardSearch('');
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.standard_id === standard.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {standard.standard_name}
                              </div>
                            ))}
                          {standards.filter(standard =>
                            standard.standard_name.toLowerCase().includes(standardSearch.toLowerCase())
                          ).length === 0 && standardSearch && (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              No standards found
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        {referenceDataLoading ? "Loading standards..." : "No standards available"}
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations & Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Recommendations & Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="recommendation" className="block text-sm font-medium text-gray-700 mb-1">
                Recommendation *
              </label>
              <Textarea
                id="recommendation"
                value={formData.recommendation}
                onChange={(e) => setFormData({...formData, recommendation: e.target.value})}
                placeholder="Provide recommendations to address this finding"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In_Progress">In Progress</SelectItem>
                    <SelectItem value="Reviewed">Reviewed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label htmlFor="evidence_files" className="block text-sm font-medium text-gray-700 mb-1">
                Evidence Files
              </label>
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File attachments section removed as per user request */}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Creating...' : 'Create Finding'}
          </Button>
        </div>
      </form>
    </div>
  );
};
