import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableCombobox, createComboboxOptions } from '@/components/ui/searchable-combobox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, AlertTriangle, Clock, Users, Shield } from 'lucide-react';
import { 
  EscalationRule, 
  EscalationRuleFormData, 
  DEPARTMENTS, 
  ESCALATION_ROLES 
} from '@/types/escalationRules';
import { 
  Category, 
  RiskLevel, 
  RiskRating, 
  SystemVulnerability, 
  ComplianceGap, 
  RelevantStandard 
} from '@/types/referenceData';
import { User } from '@/types/user';

interface EscalationRulesManagementProps {
  user: User;
}

export const EscalationRulesManagement = ({ user }: EscalationRulesManagementProps) => {
  const { api } = useAuth();
  
  // Add null check for user
  if (!user) {
    return <div>Loading...</div>;
  }

  const [rules, setRules] = useState<EscalationRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<EscalationRule | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<EscalationRule | null>(null);

  // Reference data for dropdowns
  const [categories, setCategories] = useState<Category[]>([]);
  const [riskLevels, setRiskLevels] = useState<RiskLevel[]>([]);
  const [riskRatings, setRiskRatings] = useState<RiskRating[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<SystemVulnerability[]>([]);
  const [complianceGaps, setComplianceGaps] = useState<ComplianceGap[]>([]);
  const [standards, setStandards] = useState<RelevantStandard[]>([]);
  const [referenceDataLoading, setReferenceDataLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState<EscalationRuleFormData>({
    department: 'Business',
    escalation_level: 1,
    days_threshold: 7,
    escalate_to_role: 'Audit_Supervisor',
    is_active: true
  });

  // Fetch escalation rules
  const fetchRules = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/escalation-rules');
      setRules(response.data || []);
    } catch (error) {
      console.error('Error fetching escalation rules:', error);
      toast.error('Failed to fetch escalation rules');
      setRules([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reference data for dropdowns
  const fetchReferenceData = async () => {
    setReferenceDataLoading(true);
    try {
      const [categoriesRes, riskLevelsRes, riskRatingsRes, vulnerabilitiesRes, complianceGapsRes, standardsRes] = await Promise.all([
        api.get('/api/reference-data/categories?limit=1000'), // Get all items for dropdowns
        api.get('/api/reference-data/risk-levels?limit=1000'),
        api.get('/api/reference-data/risk-ratings?limit=1000'),
        api.get('/api/reference-data/vulnerabilities?limit=1000'),
        api.get('/api/reference-data/compliance-gaps?limit=1000'),
        api.get('/api/reference-data/standards?limit=1000')
      ]);

      // Handle paginated response format: { data: [...], total: ..., page: ... }
      setCategories(categoriesRes.data?.data || categoriesRes.data || []);
      setRiskLevels(riskLevelsRes.data?.data || riskLevelsRes.data || []);
      setRiskRatings(riskRatingsRes.data?.data || riskRatingsRes.data || []);
      setVulnerabilities(vulnerabilitiesRes.data?.data || vulnerabilitiesRes.data || []);
      setComplianceGaps(complianceGapsRes.data?.data || complianceGapsRes.data || []);
      setStandards(standardsRes.data?.data || standardsRes.data || []);
    } catch (error) {
      console.error('Error fetching reference data:', error);
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
    }
  };

  useEffect(() => {
    fetchRules();
    fetchReferenceData();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      department: 'Business',
      escalation_level: 1,
      days_threshold: 7,
      escalate_to_role: 'Audit_Supervisor',
      is_active: true
    });
  };

  // Open create dialog
  const openCreateDialog = () => {
    setEditingRule(null);
    resetForm();
    setDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (rule: EscalationRule) => {
    setEditingRule(rule);
    setFormData({
      department: rule.department,
      risk_level_id: rule.risk_level_id || undefined,
      category_id: rule.category_id || undefined,
      risk_rating_id: rule.risk_rating_id || undefined,
      vulnerability_id: rule.vulnerability_id || undefined,
      compliance_gap_id: rule.compliance_gap_id || undefined,
      standard_id: rule.standard_id || undefined,
      escalation_level: rule.escalation_level,
      days_threshold: rule.days_threshold,
      escalate_to_role: rule.escalate_to_role,
      send_reminder_days_before: rule.send_reminder_days_before,
      is_active: rule.is_active
    });
    setDialogOpen(true);
  };

  // Handle save
  const handleSave = async () => {
    try {
      if (editingRule) {
        // Update
        await api.put(`/api/escalation-rules/${editingRule.id}`, formData);
        toast.success('Escalation rule updated successfully');
      } else {
        // Create
        await api.post('/api/escalation-rules', formData);
        toast.success('Escalation rule created successfully');
      }
      
      setDialogOpen(false);
      fetchRules();
    } catch (error) {
      console.error('Error saving escalation rule:', error);
      toast.error('Failed to save escalation rule');
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!ruleToDelete) return;
    
    try {
      await api.delete(`/api/escalation-rules/${ruleToDelete.id}`);
      toast.success('Escalation rule deleted successfully');
      setDeleteDialogOpen(false);
      setRuleToDelete(null);
      fetchRules();
    } catch (error) {
      console.error('Error deleting escalation rule:', error);
      toast.error('Failed to delete escalation rule');
    }
  };

  // Open delete confirmation
  const openDeleteDialog = (rule: EscalationRule) => {
    setRuleToDelete(rule);
    setDeleteDialogOpen(true);
  };

  // Toggle rule status
  const toggleRuleStatus = async (rule: EscalationRule) => {
    try {
      await api.put(`/api/escalation-rules/${rule.id}`, {
        ...rule,
        is_active: !rule.is_active
      });
      toast.success(`Escalation rule ${rule.is_active ? 'deactivated' : 'activated'} successfully`);
      fetchRules();
    } catch (error) {
      console.error('Error toggling rule status:', error);
      toast.error('Failed to update rule status');
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Escalation Rules Management</h1>
        <p className="text-gray-600">Configure automatic escalation rules for audit findings based on various criteria</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Escalation Rules
            </CardTitle>
            <CardDescription>
              Define rules for automatic escalation of audit findings when thresholds are exceeded
            </CardDescription>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : (
            <EscalationRulesTable 
              rules={rules}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
              onToggleStatus={toggleRuleStatus}
            />
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? 'Edit' : 'Create'} Escalation Rule
            </DialogTitle>
            <DialogDescription>
              {editingRule ? 'Update the' : 'Add a new'} escalation rule for automatic finding escalation
            </DialogDescription>
          </DialogHeader>
          
          {referenceDataLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading reference data...</div>
            </div>
          ) : (
            <EscalationRuleForm
              formData={formData}
              setFormData={setFormData}
              categories={categories}
              riskLevels={riskLevels}
              riskRatings={riskRatings}
              vulnerabilities={vulnerabilities}
              complianceGaps={complianceGaps}
              standards={standards}
              referenceDataLoading={referenceDataLoading}
            />
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={referenceDataLoading}>
              {editingRule ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this escalation rule? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Escalation Rules Table Component
interface EscalationRulesTableProps {
  rules: EscalationRule[];
  onEdit: (rule: EscalationRule) => void;
  onDelete: (rule: EscalationRule) => void;
  onToggleStatus: (rule: EscalationRule) => void;
}

const EscalationRulesTable = ({ rules, onEdit, onDelete, onToggleStatus }: EscalationRulesTableProps) => {
  if (!rules || rules.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No escalation rules found. Click "Add Rule" to create one.
      </div>
    );
  }

  const formatCriteria = (rule: EscalationRule) => {
    const criteria = [];
    if (rule.RiskLevel) criteria.push(`Risk Level: ${rule.RiskLevel.risk_level_name}`);
    if (rule.Category) criteria.push(`Category: ${rule.Category.category_name}`);
    if (rule.RiskRating) criteria.push(`Risk Rating: ${rule.RiskRating.risk_rating_name}`);
    if (rule.SystemVulnerability) criteria.push(`Vulnerability: ${rule.SystemVulnerability.vulnerability_name}`);
    if (rule.ComplianceGap) criteria.push(`Compliance Gap: ${rule.ComplianceGap.gap_name}`);
    if (rule.RelevantStandard) criteria.push(`Standard: ${rule.RelevantStandard.standard_name}`);

    return criteria.length > 0 ? criteria.join(', ') : 'All findings';
  };

  const getDepartmentBadge = (department: string) => {
    const colors = {
      Business: 'bg-blue-100 text-blue-800',
      IT_Audit: 'bg-green-100 text-green-800',
      Inspection: 'bg-purple-100 text-purple-800'
    };
    return (
      <Badge className={colors[department as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {department.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Department</TableHead>
          <TableHead>Criteria</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Threshold</TableHead>
          <TableHead>Escalate To</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-32">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rules.map((rule) => (
          <TableRow key={rule.id}>
            <TableCell>
              {getDepartmentBadge(rule.department)}
            </TableCell>
            <TableCell className="max-w-xs">
              <div className="truncate" title={formatCriteria(rule)}>
                {formatCriteria(rule)}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Level {rule.escalation_level}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {rule.days_threshold} days
              </Badge>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                <div className="font-medium">{rule.escalate_to_role.replace(/_/g, ' ')}</div>
                <div className="text-gray-500">{rule.department.replace('_', ' ')}</div>
              </div>
            </TableCell>
            <TableCell>
              <Switch
                checked={rule.is_active}
                onCheckedChange={() => onToggleStatus(rule)}
              />
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(rule)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(rule)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Escalation Rule Form Component
interface EscalationRuleFormProps {
  formData: EscalationRuleFormData;
  setFormData: (data: EscalationRuleFormData) => void;
  categories: Category[];
  riskLevels: RiskLevel[];
  riskRatings: RiskRating[];
  vulnerabilities: SystemVulnerability[];
  complianceGaps: ComplianceGap[];
  standards: RelevantStandard[];
  referenceDataLoading: boolean;
}

const EscalationRuleForm = ({
  formData,
  setFormData,
  categories,
  riskLevels,
  riskRatings,
  vulnerabilities,
  complianceGaps,
  standards,
  referenceDataLoading
}: EscalationRuleFormProps) => {

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="department">Department *</Label>
            <Select
              value={formData.department}
              onValueChange={(value: 'Business' | 'IT_Audit' | 'Inspection') =>
                setFormData({ ...formData, department: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS && Array.isArray(DEPARTMENTS) ? DEPARTMENTS.map(dept => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                )) : null}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="is_active">Status</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active" className="text-sm">
                {formData.is_active ? 'Active' : 'Inactive'}
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Escalation Criteria */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Escalation Criteria</h3>
        <p className="text-sm text-gray-600">
          Select criteria that will trigger this escalation rule. Leave empty to apply to all findings.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category_id">Category</Label>
            <SearchableCombobox
              options={[
                { value: 'none', label: 'Any Category' },
                ...createComboboxOptions(categories || [], 'category_name', ['category_description'])
              ]}
              value={formData.category_id || 'none'}
              onValueChange={(value) =>
                setFormData({ ...formData, category_id: value === 'none' ? undefined : value })
              }
              placeholder="Select category"
              searchPlaceholder="Search categories..."
              emptyText="No categories found"
              loading={referenceDataLoading}
              disabled={referenceDataLoading}
            />
          </div>

          <div>
            <Label htmlFor="risk_level_id">Risk Level</Label>
            <SearchableCombobox
              options={[
                { value: 'none', label: 'Any Risk Level' },
                ...createComboboxOptions(riskLevels || [], 'risk_level_name', ['risk_level_description'])
              ]}
              value={formData.risk_level_id || 'none'}
              onValueChange={(value) =>
                setFormData({ ...formData, risk_level_id: value === 'none' ? undefined : value })
              }
              placeholder="Select risk level"
              searchPlaceholder="Search risk levels..."
              emptyText="No risk levels found"
              loading={referenceDataLoading}
              disabled={referenceDataLoading}
            />
          </div>

          <div>
            <Label htmlFor="risk_rating_id">Risk Rating</Label>
            <SearchableCombobox
              options={[
                { value: 'none', label: 'Any Risk Rating' },
                ...createComboboxOptions(riskRatings || [], 'risk_rating_name', ['risk_rating_description'])
              ]}
              value={formData.risk_rating_id || 'none'}
              onValueChange={(value) =>
                setFormData({ ...formData, risk_rating_id: value === 'none' ? undefined : value })
              }
              placeholder="Select risk rating"
              searchPlaceholder="Search risk ratings..."
              emptyText="No risk ratings found"
              loading={referenceDataLoading}
              disabled={referenceDataLoading}
            />
          </div>

          <div>
            <Label htmlFor="vulnerability_id">System Vulnerability</Label>
            <SearchableCombobox
              options={[
                { value: 'none', label: 'Any Vulnerability' },
                ...createComboboxOptions(vulnerabilities || [], 'vulnerability_name', ['vulnerability_description'])
              ]}
              value={formData.vulnerability_id || 'none'}
              onValueChange={(value) =>
                setFormData({ ...formData, vulnerability_id: value === 'none' ? undefined : value })
              }
              placeholder="Select vulnerability"
              searchPlaceholder="Search vulnerabilities..."
              emptyText="No vulnerabilities found"
              loading={referenceDataLoading}
              disabled={referenceDataLoading}
            />
          </div>

          <div>
            <Label htmlFor="compliance_gap_id">Compliance Gap</Label>
            <SearchableCombobox
              options={[
                { value: 'none', label: 'Any Compliance Gap' },
                ...createComboboxOptions(complianceGaps || [], 'gap_name', ['gap_description'])
              ]}
              value={formData.compliance_gap_id || 'none'}
              onValueChange={(value) =>
                setFormData({ ...formData, compliance_gap_id: value === 'none' ? undefined : value })
              }
              placeholder="Select compliance gap"
              searchPlaceholder="Search compliance gaps..."
              emptyText="No compliance gaps found"
              loading={referenceDataLoading}
              disabled={referenceDataLoading}
            />
          </div>

          <div>
            <Label htmlFor="standard_id">Relevant Standard</Label>
            <SearchableCombobox
              options={[
                { value: 'none', label: 'Any Standard' },
                ...createComboboxOptions(standards || [], 'standard_name', ['standard_description'])
              ]}
              value={formData.standard_id || 'none'}
              onValueChange={(value) =>
                setFormData({ ...formData, standard_id: value === 'none' ? undefined : value })
              }
              placeholder="Select standard"
              searchPlaceholder="Search standards..."
              emptyText="No standards found"
              loading={referenceDataLoading}
              disabled={referenceDataLoading}
            />
          </div>
        </div>
      </div>

      {/* Escalation Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Escalation Settings</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="escalation_level">Escalation Level *</Label>
            <Input
              id="escalation_level"
              type="number"
              min="1"
              max="10"
              value={formData.escalation_level}
              onChange={(e) => setFormData({ ...formData, escalation_level: parseInt(e.target.value) || 1 })}
              placeholder="Enter escalation level"
              required
            />
          </div>

          <div>
            <Label htmlFor="days_threshold">Days Threshold *</Label>
            <Input
              id="days_threshold"
              type="number"
              min="1"
              value={formData.days_threshold}
              onChange={(e) => setFormData({ ...formData, days_threshold: parseInt(e.target.value) || 1 })}
              placeholder="Enter days threshold"
              required
            />
          </div>

          <div>
            <Label htmlFor="escalate_to_role">Escalate To Role *</Label>
            <Select
              value={formData.escalate_to_role}
              onValueChange={(value) => setFormData({ ...formData, escalate_to_role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ESCALATION_ROLES && Array.isArray(ESCALATION_ROLES) ? ESCALATION_ROLES.map(role => (
                  <SelectItem key={role} value={role}>
                    {role.replace(/_/g, ' ')}
                  </SelectItem>
                )) : null}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="send_reminder_days_before">Reminder Days Before</Label>
            <Input
              id="send_reminder_days_before"
              type="number"
              min="0"
              value={formData.send_reminder_days_before || 2}
              onChange={(e) => setFormData({ ...formData, send_reminder_days_before: parseInt(e.target.value) || 2 })}
              placeholder="Days before to send reminder"
            />
          </div>
        </div>


      </div>
    </div>
  );
};
