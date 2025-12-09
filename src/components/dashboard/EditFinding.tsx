import { useState, useEffect } from 'react';
import { User, useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableCombobox, createComboboxOptions } from '@/components/ui/searchable-combobox';
import { Save, AlertCircle, ArrowLeft, Upload, File, X, Download } from 'lucide-react';
import { toast } from 'sonner';
import {
  Category,
  RiskLevel,
  RiskRating,
  SystemVulnerability,
  ComplianceGap,
  RelevantStandard
} from '@/types/referenceData';
import { AuditFinding, CURRENCY_OPTIONS, CurrencyCode } from '@/types/auditFinding';

interface EditFindingProps {
  user: User;
  findingId: string;
  onBack: () => void;
  onSave?: (finding: AuditFinding) => void;
}

export const EditFinding = ({ user, findingId, onBack, onSave }: EditFindingProps) => {
  console.log('🎯 EditFinding component rendered with findingId:', findingId, 'user:', user?.username);

  const { api } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    criteria: '',
    cause: '',
    impact: '',
    recommendation: '',
    amount: 0,
    currency: 'ETB' as CurrencyCode,
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

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [referenceDataLoading, setReferenceDataLoading] = useState(true);

  // Reference data state
  const [categories, setCategories] = useState<Category[]>([]);
  const [riskLevels, setRiskLevels] = useState<RiskLevel[]>([]);
  const [riskRatings, setRiskRatings] = useState<RiskRating[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<SystemVulnerability[]>([]);
  const [complianceGaps, setComplianceGaps] = useState<ComplianceGap[]>([]);
  const [standards, setStandards] = useState<RelevantStandard[]>([]);

  // File handling state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<any[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const isITAudit = user.department === 'IT_Audit';

  // Fetch reference data
  const fetchReferenceData = async () => {
    console.log('🔄 Starting fetchReferenceData...');
    setReferenceDataLoading(true);
    try {
      console.log('📡 Making API calls to reference data endpoints...');
      const [categoriesRes, riskLevelsRes, riskRatingsRes, vulnerabilitiesRes, complianceGapsRes, standardsRes] = await Promise.all([
        api.get('/ZAMS/api/reference-data/categories?limit=1000'),
        api.get('/ZAMS/api/reference-data/risk-levels?limit=1000'),
        api.get('/ZAMS/api/reference-data/risk-ratings?limit=1000'),
        api.get('/ZAMS/api/reference-data/vulnerabilities?limit=1000'),
        api.get('/ZAMS/api/reference-data/compliance-gaps?limit=1000'),
        api.get('/ZAMS/api/reference-data/standards?limit=1000')
      ]);
      console.log('✅ API calls completed successfully');

      // Handle paginated response format
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
      // Set empty arrays as fallback
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

  // Fetch existing audit finding data
  const fetchAuditFinding = async () => {
    console.log('🔄 Fetching audit finding with ID:', findingId);
    setInitialLoading(true);
    try {
      const response = await api.put(`ZAMS/api/audit-findings/${findingId}`);
      const finding = response.data;
      console.log('✅ Audit finding fetched:', finding);

      // Populate form with existing data
      setFormData({
        title: finding.title || '',
        description: finding.description || '',
        criteria: finding.criteria || '',
        cause: finding.cause || '',
        impact: finding.impact || '',
        recommendation: finding.recommendation || '',
        amount: finding.amount || 0,
        currency: (finding.currency || 'ETB') as CurrencyCode,
        category_id: finding.category_id || '',
        risk_level_id: finding.risk_level_id || '',
        risk_rating_id: finding.risk_rating_id || '',
        due_date: finding.due_date ? finding.due_date.split('T')[0] : '', // Format date for input
        status: finding.status || 'Pending',
        // IT-specific fields
        vulnerability_id: finding.vulnerability_id || '',
        compliance_gap_id: finding.compliance_gap_id || '',
        standard_id: finding.standard_id || ''
      });

      // Load existing evidence files if available
      if (finding.evidences && finding.evidences.length > 0) {
        setExistingFiles(finding.evidences);
      }
    } catch (error: any) {
      console.error('❌ Error fetching audit finding:', error);
      const errorMessage = error.response?.data?.error || 'Failed to fetch audit finding';
      toast.error(errorMessage);
      onBack(); // Go back if we can't load the finding
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 EditFinding mounted, fetching data...');
    Promise.all([fetchReferenceData(), fetchAuditFinding()]);
  }, [findingId]);

  // File handling functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log('Files selected:', files.length, files.map(f => f.name));
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingFile = async (evidenceId: string) => {
    try {
      await api.put(`/ZAMS/api/audit-findings/evidence/${evidenceId}/deactivate`);
      // Refresh the files list to ensure consistency
      await refreshExistingFiles(findingId);
      toast.success('File removed successfully');
    } catch (error) {
      console.error('Error removing file:', error);
      toast.error('Failed to remove file');
    }
  };

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
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const refreshExistingFiles = async (findingId: string) => {
    try {
      const response = await api.put(`ZAMS/api/audit-findings/${findingId}`);
      if (response.data.evidences && response.data.evidences.length > 0) {
        setExistingFiles(response.data.evidences);
      } else {
        setExistingFiles([]);
      }
    } catch (error) {
      console.error('Error refreshing files:', error);
    }
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

      // Refresh the existing files list to show newly uploaded files
      await refreshExistingFiles(findingId);

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
    // if (!formData.title || !formData.description || !formData.criteria ||
    //     !formData.cause || !formData.impact || !formData.recommendation ||
    //     !formData.amount || !formData.category_id || !formData.risk_level_id ||
    //     !formData.risk_rating_id) {
    //   toast.error('Please fill in all required fields');
    //   return;
    // }


    if (!formData.title || !formData.description || !formData.criteria || 
            !formData.cause || !formData.impact || !formData.recommendation ||
             !formData.category_id || 
            !formData.risk_rating_id) {
          toast.error('Please fill in all required fields');
          return;
        }



    // IT Audit specific validation
    // if (isITAudit) {
    //   if (!formData.vulnerability_id || !formData.compliance_gap_id || !formData.standard_id) {
    //     toast.error('IT Audit findings require vulnerability, compliance gap, and standard fields');
    //     return;
    //   }
    // }

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
        currency: formData.currency,
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

      console.log('Updating finding:', apiData);
      const response = await api.put(`/ZAMS/api/audit-findings/${findingId}`, apiData);

      // Upload new files if any
      if (selectedFiles.length > 0) {
        toast.info('Uploading files...');
        await uploadFiles(findingId);
      }

      toast.success('Audit finding updated successfully');

      if (onSave) {
        onSave(response.data);
      }
      onBack();
    } catch (error: any) {
      console.error('Error updating audit finding:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update audit finding';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading || referenceDataLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Finding</h1>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading form data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Finding</h1>
          <p className="text-gray-600">Update audit finding details</p>
        </div>
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
                Audit Finding*
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter a descriptive Audit Finding for the finding"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Audit Finding Description *
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Provide a detailed Audit Finding description of the finding"
                rows={3}
                required
              />
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
                  Amount
                </label>
                <div className="flex gap-2">
                  <Select
                    value={formData.currency}
                    onValueChange={(value: CurrencyCode) => setFormData({...formData, currency: value})}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCY_OPTIONS.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.symbol} {currency.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                    placeholder="Financial amount involved"
                    className="flex-1"
                    required
                  />
                </div>
              </div>
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
              {/* <div>
                <label htmlFor="risk_level" className="block text-sm font-medium text-gray-700 mb-1">
                  Risk Level *
                </label>
                <SearchableCombobox
                  options={createComboboxOptions(riskLevels || [], 'risk_level_name', ['risk_level_description'])}
                  value={formData.risk_level_id}
                  onValueChange={(value) => setFormData({...formData, risk_level_id: value})}
                  placeholder="Select risk level"
                  searchPlaceholder="Search risk levels..."
                  emptyText="No risk levels found"
                  loading={referenceDataLoading}
                  disabled={referenceDataLoading}
                  required
                />
              </div> */}

              <div>
                <label htmlFor="risk_rating" className="block text-sm font-medium text-gray-700 mb-1">
                  Risk Rating *
                </label>
                <SearchableCombobox
                  options={createComboboxOptions(riskRatings || [], 'risk_rating_name', ['risk_rating_description'])}
                  value={formData.risk_rating_id}
                  onValueChange={(value) => setFormData({...formData, risk_rating_id: value})}
                  placeholder="Select risk rating"
                  searchPlaceholder="Search risk ratings..."
                  emptyText="No risk ratings found"
                  loading={referenceDataLoading}
                  disabled={referenceDataLoading}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* IT-Specific Fields */}
        {/* {isITAudit && (
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
                  <SearchableCombobox
                    options={createComboboxOptions(vulnerabilities || [], 'vulnerability_name', ['vulnerability_description'])}
                    value={formData.vulnerability_id}
                    onValueChange={(value) => setFormData({...formData, vulnerability_id: value})}
                    placeholder="Select vulnerability type"
                    searchPlaceholder="Search vulnerability types..."
                    emptyText="No vulnerability types found"
                    loading={referenceDataLoading}
                    disabled={referenceDataLoading}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="compliance_gap_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Compliance Gap *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Description of compliance gap</p>
                  <SearchableCombobox
                    options={createComboboxOptions(complianceGaps || [], 'gap_name', ['gap_description'])}
                    value={formData.compliance_gap_id}
                    onValueChange={(value) => setFormData({...formData, compliance_gap_id: value})}
                    placeholder="Select compliance gap"
                    searchPlaceholder="Search compliance gaps..."
                    emptyText="No compliance gaps found"
                    loading={referenceDataLoading}
                    disabled={referenceDataLoading}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="standard_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Relevant Standard *
                </label>
                <p className="text-xs text-gray-500 mb-2">Applicable standard or framework</p>
                <SearchableCombobox
                  options={createComboboxOptions(standards || [], 'standard_name', ['standard_description'])}
                  value={formData.standard_id}
                  onValueChange={(value) => setFormData({...formData, standard_id: value})}
                  placeholder="Select standard"
                  searchPlaceholder="Search standards..."
                  emptyText="No standards found"
                  loading={referenceDataLoading}
                  disabled={referenceDataLoading}
                  required
                />
              </div>
            </CardContent>
          </Card>
        )} */}

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
                    <SelectItem value="Under_Rectification">Under Rectification</SelectItem>
                    <SelectItem value="In_Progress">In Progress</SelectItem>
                    <SelectItem value="Reviewed">Reviewed</SelectItem>
                    <SelectItem value="Escalated">Escalated</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
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
                <div className={`border-2 border-dashed rounded-lg p-6 ${uploadingFiles ? 'border-blue-300 bg-blue-50' : 'border-gray-300'}`}>
                  <div className="text-center">
                    <Upload className={`mx-auto h-12 w-12 ${uploadingFiles ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
                    <div className="mt-4">
                      <label htmlFor="file-upload" className={`cursor-pointer ${uploadingFiles ? 'pointer-events-none' : ''}`}>
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          {uploadingFiles ? 'Uploading files...' : 'Upload evidence files'}
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
                        disabled={uploadingFiles}
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
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Updating...' : 'Update Finding'}
          </Button>
        </div>
      </form>
    </div>
  );
};
