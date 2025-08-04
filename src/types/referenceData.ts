// Reference Data Types
import { Branch, BranchFormData } from './branch';
export interface Category {
  id: string;
  category_name: string;
  category_description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RiskLevel {
  id: string;
  risk_level_name: string;
  risk_level_description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RiskRating {
  id: string;
  risk_rating_name: string;
  risk_rating_description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemVulnerability {
  id: string;
  vulnerability_name: string;
  vulnerability_description?: string;
  severity_level: 'Low' | 'Medium' | 'High' | 'Critical';
  affected_systems?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceGap {
  id: string;
  gap_name: string;
  gap_description?: string;
  regulatory_impact?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RelevantStandard {
  id: string;
  standard_name: string;
  standard_description?: string;
  issuing_body?: string;
  version?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessComplianceGap {
  id: string;
  gap_name: string;
  gap_description?: string;
  regulatory_impact?: string;
  createdAt: string;
  updatedAt: string;
}

// Form data types (for creating/updating)
export interface CategoryFormData {
  category_name: string;
  category_description?: string;
}

export interface RiskLevelFormData {
  risk_level_name: string;
  risk_level_description?: string;
}

export interface RiskRatingFormData {
  risk_rating_name: string;
  risk_rating_description?: string;
}

export interface SystemVulnerabilityFormData {
  vulnerability_name: string;
  vulnerability_description?: string;
  severity_level: 'Low' | 'Medium' | 'High' | 'Critical';
  affected_systems?: string;
}

export interface ComplianceGapFormData {
  gap_name: string;
  gap_description?: string;
  regulatory_impact?: string;
}

export interface RelevantStandardFormData {
  standard_name: string;
  standard_description?: string;
  issuing_body?: string;
  version?: string;
}

export interface BusinessComplianceGapFormData {
  gap_name: string;
  gap_description?: string;
  regulatory_impact?: string;
}

// Reference data type union
export type ReferenceDataType =
  | 'categories'
  | 'risk-levels'
  | 'risk-ratings'
  | 'system-vulnerabilities'
  | 'compliance-gaps'
  | 'business-compliance-gaps'
  | 'relevant-standards'
  | 'branches';

// Generic reference data item
export type ReferenceDataItem =
  | Category
  | RiskLevel
  | RiskRating
  | SystemVulnerability
  | ComplianceGap
  | BusinessComplianceGap
  | RelevantStandard
  | Branch;

// Generic form data
export type ReferenceDataFormData =
  | CategoryFormData
  | RiskLevelFormData
  | RiskRatingFormData
  | SystemVulnerabilityFormData
  | ComplianceGapFormData
  | BusinessComplianceGapFormData
  | RelevantStandardFormData
  | BranchFormData;
