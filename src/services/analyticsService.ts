import api from './api';

export interface StatusDistribution {
  status: string;
  count: number;
}

export interface RiskLevelDistribution {
  'riskLevel.risk_level_name': string;
  count: number;
}

export interface DepartmentDistribution {
  'createdBy.department': string;
  count: number;
}

export interface TrendData {
  period: string;
  count: number;
}

export interface ActionPlanMetrics {
  status: string;
  count: number;
  overdue_rate?: number;
}

export interface EscalationTrend {
  escalation_level: number;
  date: string;
  count: number;
}

export interface WorkloadData {
  username: string;
  assigned_count: number;
  department?: string;
}

export interface ComplianceGapData {
  'complianceGap.compliance_gap_name': string;
  count: number;
}

export interface TimelineData {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  due_date: string;
  total_days: number;
  days_elapsed: number;
  is_overdue: number;
}

export interface TimelineAnalytics {
  timeline_data: TimelineData[];
  summary: {
    total_findings: number;
    overdue_count: number;
    avg_total_days: number;
    avg_days_elapsed: number;
  };
}

export interface DashboardData {
  status_distribution: StatusDistribution[];
  department_distribution: DepartmentDistribution[];
  action_plan_metrics: ActionPlanMetrics[];
  escalation_metrics: { total_escalations: number };
  workload_distribution: WorkloadData[];
}

// Common analytics parameters interface
export interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
  department?: string;
}

class AnalyticsService {
  // Get audit findings by status
  async getAuditFindingsByStatus(params: AnalyticsParams = {}): Promise<StatusDistribution[]> {
    const response = await api.get('/ZAMS/api/analytics/audit-findings/status', { params });
    return response.data.data;
  }

  // Get audit findings by risk level
  async getAuditFindingsByRiskLevel(params: AnalyticsParams = {}): Promise<RiskLevelDistribution[]> {
    const response = await api.get('/ZAMS/api/analytics/audit-findings/risk-level', { params });
    return response.data.data;
  }

  // Get audit findings by department
  async getAuditFindingsByDepartment(params: AnalyticsParams = {}): Promise<DepartmentDistribution[]> {
    const response = await api.get('/ZAMS/api/analytics/audit-findings/department', { params });
    return response.data.data;
  }

  // Get audit findings trends
  async getAuditFindingsTrends(params?: AnalyticsParams & {
    groupBy?: 'day' | 'week' | 'month' | 'year';
  }): Promise<TrendData[]> {
    const response = await api.get('/ZAMS/api/analytics/audit-findings/trends', { params });
    return response.data.data;
  }

  // Get action plan metrics
  async getActionPlanMetrics(params: AnalyticsParams = {}): Promise<ActionPlanMetrics[]> {
    const response = await api.get('/ZAMS/api/analytics/action-plans/metrics', { params });
    return response.data.data;
  }

  // Get escalation trends
  async getEscalationTrends(params?: AnalyticsParams): Promise<EscalationTrend[]> {
    const response = await api.get('/ZAMS/api/analytics/escalations/trends', { params });
    return response.data.data;
  }

  // Get user workload distribution
  async getUserWorkloadDistribution(params: AnalyticsParams = {}): Promise<WorkloadData[]> {
    const response = await api.get('/ZAMS/api/analytics/users/workload', { params });
    return response.data.data;
  }

  // Get compliance gap analysis
  async getComplianceGapAnalysis(params: AnalyticsParams = {}): Promise<ComplianceGapData[]> {
    const response = await api.get('/ZAMS/api/analytics/compliance/gaps', { params });
    return response.data.data;
  }

  // Get timeline analytics
  async getTimelineAnalytics(params: AnalyticsParams = {}): Promise<TimelineAnalytics> {
    const response = await api.get('/ZAMS/api/analytics/timeline/analytics', { params });
    return response.data.data;
  }

  // Get comprehensive dashboard data using working endpoints
  async getDashboardData(params: AnalyticsParams = {}): Promise<DashboardData> {
    try {
      const [
        statusData,
        departmentData,
        actionPlanData,
        workloadData
      ] = await Promise.all([
        this.getAuditFindingsByStatus(params),
        this.getAuditFindingsByDepartment(params),
        this.getActionPlanMetrics(params),
        this.getUserWorkloadDistribution(params)
      ]);

      return {
        status_distribution: statusData,
        department_distribution: departmentData,
        action_plan_metrics: actionPlanData,
        escalation_metrics: { total_escalations: 0 },
        workload_distribution: workloadData
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  // Export chart data as CSV
  exportToCSV(data: any[], filename: string): void {
    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Convert data to CSV format
  private convertToCSV(data: any[]): string {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in values
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
  }

  // Download chart as PNG
  downloadChartAsPNG(chartRef: HTMLElement, filename: string): void {
    // This would require html2canvas library
    // For now, we'll implement a basic version
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Basic implementation - in production, use html2canvas
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    } catch (error) {
      console.error('Error downloading chart as PNG:', error);
    }
  }

  // Download chart as PDF
  downloadChartAsPDF(chartRef: HTMLElement, filename: string): void {
    // This would require jsPDF library
    // For now, we'll implement a basic version
    try {
      console.log('PDF download functionality would be implemented here');
      // In production, use jsPDF with html2canvas
    } catch (error) {
      console.error('Error downloading chart as PDF:', error);
    }
  }
}

export default new AnalyticsService();
