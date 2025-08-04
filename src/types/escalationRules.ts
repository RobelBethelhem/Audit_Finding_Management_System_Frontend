import { Category, RiskLevel, RiskRating, SystemVulnerability, ComplianceGap, RelevantStandard } from './referenceData';

// Escalation Rule Types
export interface EscalationRule {
  id: string;
  department: 'Business' | 'IT_Audit' | 'Inspection';
  risk_level_id?: string;
  category_id?: string;
  risk_rating_id?: string;
  vulnerability_id?: string;
  compliance_gap_id?: string;
  standard_id?: string;
  escalation_level: number;
  days_threshold: number;
  escalate_to_role: string;
  send_reminder_days_before?: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Associated models (when included in API response)
  RiskLevel?: RiskLevel;
  Category?: Category;
  RiskRating?: RiskRating;
  SystemVulnerability?: SystemVulnerability;
  ComplianceGap?: ComplianceGap;
  RelevantStandard?: RelevantStandard;
}

// Form data for creating/updating escalation rules
export interface EscalationRuleFormData {
  department: 'Business' | 'IT_Audit' | 'Inspection';
  risk_level_id?: string;
  category_id?: string;
  risk_rating_id?: string;
  vulnerability_id?: string;
  compliance_gap_id?: string;
  standard_id?: string;
  escalation_level: number;
  days_threshold: number;
  escalate_to_role: string;
  send_reminder_days_before?: number;
  is_active: boolean;
}

// Escalation criteria options
export interface EscalationCriteria {
  type: 'risk_level' | 'category' | 'risk_rating' | 'vulnerability' | 'compliance_gap' | 'standard';
  label: string;
  value: string;
}

// Department options
export const DEPARTMENTS = [
  { value: 'Business', label: 'Business' },
  { value: 'IT_Audit', label: 'IT Audit' },
  { value: 'Inspection', label: 'Inspection' }
] as const;

// Role options for escalation
export const ESCALATION_ROLES = [
  'Auditor',
  'Senior_Auditor',
  'Audit_Supervisor',
  'Audit_Manager',
  'Audit_Director',
  'Department_Head',
  'Admin'
] as const;

export type EscalationRole = typeof ESCALATION_ROLES[number];
