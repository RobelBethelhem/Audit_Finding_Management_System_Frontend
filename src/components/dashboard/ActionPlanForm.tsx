import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';
import {
  ActionPlan,
  ActionPlanFormData,
  ACTION_PLAN_STATUSES,
  getActionPlanPermissions
} from '@/types/actionPlan';
import { AuditFinding } from '@/types/auditFinding';
import { User } from '@/types/user';
import { FileUpload } from './FilePreview';

interface ActionPlanFormProps {
  user: User;
  actionPlan?: ActionPlan;
  onSave?: (actionPlan: ActionPlan) => void;
  onCancel?: () => void;
}

export const ActionPlanForm = ({ user, actionPlan, onSave, onCancel }: ActionPlanFormProps) => {
  const { api } = useAuth();
  
  // Add null check for user
  if (!user) {
    return <div>Loading...</div>;
  }

  const [loading, setLoading] = useState(false);
  const [referenceDataLoading, setReferenceDataLoading] = useState(true);

  // Get user permissions
  const permissions = getActionPlanPermissions(user.role, user.department);
  const isEditing = !!actionPlan;

  // Form state
  const [formData, setFormData] = useState<ActionPlanFormData>({
    audit_finding_id: '',
    action_plan: '',
    timeline: '',
    responsible_persons_ids: [],
    resource_name: '',
    resource_file: undefined,
    evidence_file: undefined,
    status: 'Draft'
  });

  // Reference data
  const [auditFindings, setAuditFindings] = useState<AuditFinding[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Initialize form data when editing
  useEffect(() => {
    if (actionPlan) {
      setFormData({
        audit_finding_id: actionPlan.audit_finding_id,
        action_plan: actionPlan.action_plan,
        timeline: actionPlan.timeline,
        responsible_persons_ids: actionPlan.responsiblePersons?.map(rp => rp.user_id) || [],
        resource_name: actionPlan.resources?.[0]?.resource_name || '',
        resource_file: undefined,
        evidence_file: undefined,
        status: actionPlan.status
      });
    }
  }, [actionPlan]);

  // Fetch reference data
  const fetchReferenceData = async () => {
    setReferenceDataLoading(true);
    try {
      const [findingsRes, usersRes] = await Promise.all([
        api.get('/ZAMS/api/audit-findings?limit=1000'),
        api.get('/ZAMS/api/users?limit=1000')
      ]);

      setAuditFindings(findingsRes.data?.data || findingsRes.data || []);
      setUsers(usersRes.data?.data || usersRes.data || []);
    } catch (error) {
      console.error('Error fetching reference data:', error);
      toast.error('Failed to fetch reference data');
    } finally {
      setReferenceDataLoading(false);
    }
  };

  useEffect(() => {
    fetchReferenceData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.audit_finding_id || !formData.action_plan || !formData.timeline) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.responsible_persons_ids.length === 0) {
      toast.error('Please select at least one responsible person');
      return;
    }

    setLoading(true);
    try {
      // Create FormData for file uploads
      const submitData = new FormData();

      // Add text fields
      submitData.append('audit_finding_id', formData.audit_finding_id);
      submitData.append('action_plan', formData.action_plan);
      submitData.append('timeline', formData.timeline);
      submitData.append('responsible_persons_ids', JSON.stringify(formData.responsible_persons_ids));

      if (formData.resource_name) {
        submitData.append('resource_name', formData.resource_name);
      }

      if (formData.status) {
        submitData.append('status', formData.status);
      }

      // Add files if present
      if (formData.resource_file) {
        submitData.append('resource', formData.resource_file);
      }

      if (formData.evidence_file) {
        submitData.append('evidence', formData.evidence_file);
      }

      let response;
      if (isEditing) {
        response = await api.put(`/ZAMS/api/action-plans/${actionPlan.action_plan_id}`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Action plan updated successfully');
      } else {
        response = await api.post('/ZAMS/api/action-plans', submitData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Action plan created successfully');
      }

      if (onSave) {
        onSave(response.data.actionPlan || response.data);
      }
    } catch (error: any) {
      console.error('Error saving action plan:', error);
      const errorMessage = error.response?.data?.error || 'Failed to save action plan';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof ActionPlanFormData, value: string | string[] | File | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle responsible person selection
  const handleResponsiblePersonChange = (userId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        responsible_persons_ids: [...prev.responsible_persons_ids, userId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        responsible_persons_ids: prev.responsible_persons_ids.filter(id => id !== userId)
      }));
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(amount);
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
              {isEditing ? 'Edit Action Plan' : 'Create Action Plan'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update the action plan details' : 'Create a new action plan for an audit finding'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? 'Edit Action Plan' : 'New Action Plan'}</CardTitle>
              <CardDescription>
                Fill in all required fields for the action plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="audit_finding_id">Audit Finding *</Label>
                      <Select 
                        value={formData.audit_finding_id} 
                        onValueChange={(value) => handleInputChange('audit_finding_id', value)}
                        disabled={isEditing} // Cannot change finding when editing
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select audit finding" />
                        </SelectTrigger>
                        <SelectContent>
                          {auditFindings.map(finding => (
                            <SelectItem key={finding.id} value={finding.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{finding.title}</span>
                                <span className="text-xs text-gray-500">
                                  {formatCurrency(finding.amount)} - {finding.status}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="timeline">Timeline *</Label>
                      <Input
                        id="timeline"
                        value={formData.timeline}
                        onChange={(e) => handleInputChange('timeline', e.target.value)}
                        placeholder="e.g., 30 days, 3 months"
                        required
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
                          {ACTION_PLAN_STATUSES.map(status => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="action_plan">Action Plan Description *</Label>
                    <Textarea
                      id="action_plan"
                      value={formData.action_plan}
                      onChange={(e) => handleInputChange('action_plan', e.target.value)}
                      placeholder="Describe the detailed action plan to address the audit finding..."
                      rows={6}
                      required
                      className="min-h-[150px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="resource_name">Required Resources</Label>
                    <Input
                      id="resource_name"
                      value={formData.resource_name}
                      onChange={(e) => handleInputChange('resource_name', e.target.value)}
                      placeholder="e.g., Budget allocation, Software licenses, Training materials"
                    />
                  </div>
                </div>

                {/* File Uploads */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">File Attachments</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FileUpload
                      label="Resource File"
                      accept=".jpeg,.jpg,.png,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      value={formData.resource_file}
                      onChange={(file) => handleInputChange('resource_file', file)}
                      maxSize={10 * 1024 * 1024} // 10MB
                    />

                    <FileUpload
                      label="Evidence File"
                      accept=".jpeg,.jpg,.png,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      value={formData.evidence_file}
                      onChange={(file) => handleInputChange('evidence_file', file)}
                      maxSize={10 * 1024 * 1024} // 10MB
                    />
                  </div>
                </div>

                {/* Responsible Persons */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Responsible Persons *</h3>
                  <p className="text-sm text-gray-600">
                    Select the users who will be responsible for implementing this action plan
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto border rounded-md p-4">
                    {users.map(user => (
                      <div key={user.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={formData.responsible_persons_ids.includes(user.id)}
                          onCheckedChange={(checked) => handleResponsiblePersonChange(user.id, checked as boolean)}
                        />
                        <Label htmlFor={`user-${user.id}`} className="text-sm">
                          <div>
                            <div className="font-medium">{user.username}</div>
                            <div className="text-xs text-gray-500">
                              {user.role.replace(/_/g, ' ')} - {user.department}
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  {formData.responsible_persons_ids.length > 0 && (
                    <div className="text-sm text-green-600">
                      {formData.responsible_persons_ids.length} person(s) selected
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                  {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                      Cancel
                    </Button>
                  )}
                  <Button type="submit" disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : (isEditing ? 'Update Action Plan' : 'Create Action Plan')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Guidelines */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-2">Action Plan Should Include:</div>
                <ul className="text-gray-600 space-y-1 text-xs">
                  <li>• Specific corrective actions</li>
                  <li>• Clear implementation steps</li>
                  <li>• Realistic timeline</li>
                  <li>• Resource requirements</li>
                  <li>• Success metrics</li>
                  <li>• Risk mitigation measures</li>
                </ul>
              </div>
              
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-2">Timeline Format:</div>
                <ul className="text-gray-600 space-y-1 text-xs">
                  <li>• Use specific timeframes</li>
                  <li>• Example: "30 days", "3 months"</li>
                  <li>• Consider complexity and resources</li>
                  <li>• Allow buffer time for review</li>
                </ul>
              </div>

              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-2">Status Workflow:</div>
                <ul className="text-gray-600 space-y-1 text-xs">
                  <li>• Draft → Submitted</li>
                  <li>• Submitted → Under Review</li>
                  <li>• Under Review → Approved/Rejected</li>
                  <li>• Approved → In Progress</li>
                  <li>• In Progress → Completed</li>
                </ul>
              </div>

              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-2">File Attachments:</div>
                <ul className="text-gray-600 space-y-1 text-xs">
                  <li>• Supported: PDF, Word, Excel, PowerPoint, Images</li>
                  <li>• Maximum size: 10MB per file</li>
                  <li>• Resource files: Supporting documents</li>
                  <li>• Evidence files: Proof of implementation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
