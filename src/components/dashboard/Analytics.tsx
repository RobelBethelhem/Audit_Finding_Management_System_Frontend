
import React, { useState, useEffect, useRef } from 'react';
import { User } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadialBarChart,
  RadialBar,
  ComposedChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Download,
  FileText,
  Image,
  Filter,
  Calendar,
  Loader2,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Users
} from 'lucide-react';
import analyticsService, {
  DashboardData,
  StatusDistribution,
  RiskLevelDistribution,
  TrendData,
  TimelineAnalytics
} from '@/services/analyticsService';
import { EnhancedExportService } from '@/services/exportService';

import DrillDownModal from '@/components/dashboard/DrillDownModal';
import { DateRange } from 'react-day-picker';

// Chart type definitions
export type ChartType = 'area' | 'line' | 'bar' | 'pie' | 'scatter' | 'radialBar' | 'composed';

interface ChartTypeOption {
  value: ChartType;
  label: string;
  icon: React.ReactNode;
}

interface AnalyticsProps {
  user: User;
}

export const Analytics = ({ user }: AnalyticsProps) => {
  // State for real data
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [trendsData, setTrendsData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states with defaults
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    return {
      from: thirtyDaysAgo,
      to: today
    };
  });
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  // Chart type states
  const [trendsChartType, setTrendsChartType] = useState<ChartType>('area');
  const [statusChartType, setStatusChartType] = useState<ChartType>('pie');
  const [departmentChartType, setDepartmentChartType] = useState<ChartType>('bar');
  const [actionPlanChartType, setActionPlanChartType] = useState<ChartType>('pie');
  const [workloadChartType, setWorkloadChartType] = useState<ChartType>('bar');





  // Drill-down state
  const [drillDownModal, setDrillDownModal] = useState<{
    isOpen: boolean;
    data: {
      type: string;
      value: string;
      label: string;
      data: any[];
    } | null;
  }>({
    isOpen: false,
    data: null
  });

  // Chart refs for downloading
  const statusChartRef = useRef<HTMLDivElement>(null);
  const riskChartRef = useRef<HTMLDivElement>(null);
  const trendsChartRef = useRef<HTMLDivElement>(null);
  const departmentChartRef = useRef<HTMLDivElement>(null);
  const actionPlanChartRef = useRef<HTMLDivElement>(null);
  const workloadChartRef = useRef<HTMLDivElement>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Prepare parameters including date and department filtering
        const params: any = {};

        if (dateRange?.from && dateRange?.to) {
          params.startDate = dateRange.from.toISOString();
          params.endDate = dateRange.to.toISOString();
        }

        if (selectedDepartment && selectedDepartment !== 'all') {
          params.department = selectedDepartment;
        }

        const dashboard = await analyticsService.getDashboardData(params);
        setDashboardData(dashboard);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dateRange, selectedDepartment]);

  // Fetch trends data when date range, groupBy, or department changes
  useEffect(() => {
    const fetchTrendsData = async () => {
      if (!dateRange?.from || !dateRange?.to) return;

      try {
        const params: any = {
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
          groupBy
        };

        if (selectedDepartment && selectedDepartment !== 'all') {
          params.department = selectedDepartment;
        }

        const trends = await analyticsService.getAuditFindingsTrends(params);
        setTrendsData(trends);
      } catch (err) {
        console.error('Error fetching trends data:', err);
      }
    };

    fetchTrendsData();
  }, [dateRange, groupBy, selectedDepartment]);



  // Remove the trends data fetching for now since that endpoint isn't working

  // Transform data for charts
  const getStatusChartData = () => {
    if (!dashboardData?.status_distribution) return [];
    return dashboardData.status_distribution.map(item => ({
      status: item.status,
      count: item.count
    }));
  };

  // Remove risk level chart data since that endpoint isn't working

  const getDepartmentChartData = () => {
    if (!dashboardData?.department_distribution) return [];
    return dashboardData.department_distribution.map(item => ({
      department: item['createdBy.department'],
      count: item.count
    }));
  };

  const getActionPlanChartData = () => {
    if (!dashboardData?.action_plan_metrics) return [];
    return dashboardData.action_plan_metrics.map(item => ({
      status: item.status,
      count: item.count,
      overdue_rate: item.overdue_rate || 0
    }));
  };

  const getWorkloadChartData = () => {
    if (!dashboardData?.workload_distribution) return [];
    return dashboardData.workload_distribution.slice(0, 10).map(item => ({
      username: item.username,
      assigned_count: item.assigned_count
    }));
  };

  // Helper function to get risk level colors
  const getRiskLevelColor = (riskLevel: string): string => {
    const colors: { [key: string]: string } = {
      'Low': '#10B981',
      'Medium': '#F59E0B',
      'High': '#F97316',
      'Critical': '#EF4444'
    };
    return colors[riskLevel] || '#6B7280';
  };

  // Load filter configuration
  useEffect(() => {
    const loadFilterConfig = async () => {
      try {
        // In a real implementation, these would come from API endpoints
        // For now, we'll use mock data based on the dashboard data
        if (dashboardData) {
          const departments = dashboardData.department_distribution.map(dept => ({
            value: dept.department || 'Unknown',
            label: dept.department || 'Unknown',
            count: dept.count
          }));

          const statuses = dashboardData.status_distribution.map(status => ({
            value: status.status,
            label: status.status.replace('_', ' '),
            count: status.count
          }));

          const actionPlanStatuses = dashboardData.action_plan_metrics.map(ap => ({
            value: ap.status || 'null',
            label: ap.status || 'No Status',
            count: ap.count
          }));

          setFilterConfig({
            departments,
            riskLevels: [
              { value: 'High', label: 'High Risk', count: 0 },
              { value: 'Medium', label: 'Medium Risk', count: 0 },
              { value: 'Low', label: 'Low Risk', count: 0 }
            ],
            statuses: [...statuses, ...actionPlanStatuses],
            categories: [
              { value: 'Financial', label: 'Financial', count: 0 },
              { value: 'Operational', label: 'Operational', count: 0 },
              { value: 'Compliance', label: 'Compliance', count: 0 },
              { value: 'IT', label: 'IT Security', count: 0 }
            ],
            users: dashboardData.workload_distribution.map(user => ({
              value: user.id,
              label: user.username,
              count: user.assigned_count
            }))
          });
        }
      } catch (error) {
        console.error('Error loading filter configuration:', error);
      }
    };

    loadFilterConfig();
  }, [dashboardData]);

  // Calculate key metrics first
  const getKeyMetrics = () => {
    if (!dashboardData) return { total: 0, resolved: 0, pending: 0, overdue: 0 };

    const statusData = dashboardData.status_distribution;
    const actionPlanData = dashboardData.action_plan_metrics;

    // Calculate audit findings metrics
    const total = statusData.reduce((sum, item) => sum + item.count, 0);
    const resolved = statusData.find(item => item.status === 'Resolved')?.count || 0;
    const pending = statusData.filter(item =>
      item.status === 'Pending' ||
      item.status === 'In_Progress' ||
      item.status === 'Under_Rectification'
    ).reduce((sum, item) => sum + item.count, 0);

    // Calculate overdue from action plan data (action plans with "Overdue" status)
    const overdue = actionPlanData.find(item => item.status === 'Overdue')?.count || 0;

    return { total, resolved, pending, overdue };
  };

  const keyMetrics = getKeyMetrics();



  // Drill-down handlers
  const handleDrillDown = (type: string, value: string, label: string, data: any[]) => {
    setDrillDownModal({
      isOpen: true,
      data: { type, value, label, data }
    });
  };

  const handleCloseDrillDown = () => {
    setDrillDownModal({
      isOpen: false,
      data: null
    });
  };

  const handleNavigateToDetail = (type: string, id: string) => {
    // In a real implementation, this would navigate to the detail page
    console.log(`Navigate to ${type} detail:`, id);
    // You could use react-router here: navigate(`/${type}/${id}`);
  };

  // Chart type options
  const chartTypeOptions: ChartTypeOption[] = [
    { value: 'area', label: 'Area Chart', icon: <TrendingUp className="h-4 w-4" /> },
    { value: 'line', label: 'Line Chart', icon: <TrendingUp className="h-4 w-4" /> },
    { value: 'bar', label: 'Bar Chart', icon: <BarChart3 className="h-4 w-4" /> },
    { value: 'pie', label: 'Pie Chart', icon: <PieChartIcon className="h-4 w-4" /> },
    { value: 'scatter', label: 'Scatter Plot', icon: <Activity className="h-4 w-4" /> },
    { value: 'radialBar', label: 'Radial Bar', icon: <Activity className="h-4 w-4" /> },
    { value: 'composed', label: 'Combined Chart', icon: <BarChart3 className="h-4 w-4" /> }
  ];

  // Chart Type Selector Component
  const ChartTypeSelector = ({
    value,
    onChange,
    label
  }: {
    value: ChartType;
    onChange: (value: ChartType) => void;
    label: string;
  }) => (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{label}:</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {chartTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                {option.icon}
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  // Dynamic Chart Renderer
  const renderChart = (
    chartType: ChartType,
    data: any[],
    config: {
      dataKey?: string;
      xAxisKey?: string;
      yAxisKey?: string;
      colors?: string[];
      height?: number;
      onElementClick?: (data: any) => void;
      drillDownType?: string;
    }
  ) => {
    const {
      dataKey = 'count',
      xAxisKey = 'name',
      colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
      height = 300,
      onElementClick,
      drillDownType
    } = config;

    // Handle chart element clicks for drill-down
    const handleElementClick = (data: any) => {
      if (onElementClick && drillDownType) {
        onElementClick(data);
      }
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey={dataKey} stroke={colors[0]} fill={colors[0]} fillOpacity={0.3} />
          </AreaChart>
        );

      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={dataKey} stroke={colors[0]} strokeWidth={2} />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey={dataKey}
              fill={colors[0]}
              onClick={handleElementClick}
              style={{ cursor: onElementClick ? 'pointer' : 'default' }}
            />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
              onClick={handleElementClick}
              style={{ cursor: onElementClick ? 'pointer' : 'default' }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );

      case 'scatter':
        return (
          <ScatterChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis dataKey={dataKey} />
            <Tooltip />
            <Scatter dataKey={dataKey} fill={colors[0]} />
          </ScatterChart>
        );

      case 'radialBar':
        return (
          <RadialBarChart data={data} cx="50%" cy="50%" innerRadius="10%" outerRadius="80%">
            <RadialBar dataKey={dataKey} cornerRadius={10} fill={colors[0]} />
            <Tooltip />
          </RadialBarChart>
        );

      case 'composed':
        return (
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={dataKey} fill={colors[0]} />
            <Line type="monotone" dataKey={dataKey} stroke={colors[1]} />
          </ComposedChart>
        );

      default:
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={dataKey} fill={colors[0]} />
          </BarChart>
        );
    }
  };

  // Enhanced Export functions
  const handleExportCSV = (data: any[], filename: string) => {
    EnhancedExportService.exportToCSV(data, {
      filename,
      title: `Analytics Export - ${filename}`,
      includeTimestamp: true
    });
  };

  const handleExportPNG = (chartRef: React.RefObject<HTMLDivElement>, filename: string) => {
    EnhancedExportService.exportToPNG(chartRef, filename, {
      quality: 2,
      backgroundColor: '#ffffff'
    });
  };

  const handleExportExcel = () => {
    const sheets = [
      {
        name: 'Status Distribution',
        data: getStatusChartData(),
        title: 'Audit Findings by Status'
      },
      {
        name: 'Department Distribution',
        data: getDepartmentChartData(),
        title: 'Audit Findings by Department'
      },
      {
        name: 'Action Plan Metrics',
        data: getActionPlanChartData(),
        title: 'Action Plan Status Distribution'
      },
      {
        name: 'Trends Data',
        data: trendsData,
        title: 'Audit Findings Trends Over Time'
      },
      {
        name: 'User Workload',
        data: getWorkloadChartData(),
        title: 'User Workload Distribution'
      }
    ];

    EnhancedExportService.exportToExcel(sheets, 'analytics-dashboard-report');
  };

  const handleExportPDF = async () => {
    const charts = [
      {
        chartRef: statusChartRef,
        title: 'Findings by Status',
        data: getStatusChartData()
      },
      {
        chartRef: trendsChartRef,
        title: 'Audit Findings Trends Over Time',
        data: trendsData
      },
      {
        chartRef: departmentChartRef,
        title: 'Findings by Department',
        data: getDepartmentChartData()
      },
      {
        chartRef: actionPlanChartRef,
        title: 'Action Plan Status',
        data: getActionPlanChartData()
      },
      {
        chartRef: workloadChartRef,
        title: 'User Workload Distribution',
        data: getWorkloadChartData()
      }
    ];

    const summaryData = {
      'Total Findings': keyMetrics.total,
      'Resolved': keyMetrics.resolved,
      'Pending': keyMetrics.pending,
      'Overdue': keyMetrics.overdue,
      'Department': selectedDepartment && selectedDepartment !== 'all' ? selectedDepartment : 'All Departments',
      'Date Range': dateRange?.from && dateRange?.to
        ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
        : 'All Time',
      'Time Grouping': groupBy
    };

    await EnhancedExportService.exportToPDF(charts, summaryData, {
      filename: 'analytics-dashboard-report',
      title: 'Audit Analytics Dashboard Report',
      subtitle: 'Comprehensive Analysis of Audit Findings and Action Plans'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading analytics data...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertTriangle className="h-8 w-8 text-red-600" />
        <span className="ml-2 text-red-600">{error}</span>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="ml-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters and Export Options */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive overview of audit findings and performance metrics</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <DatePickerWithRange
            date={dateRange}
            onDateChange={setDateRange}
            className="w-full sm:w-auto"
          />

          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {dashboardData?.department_distribution
                ?.filter((dept) => dept['createdBy.department'] && dept['createdBy.department'].trim() !== '')
                ?.map((dept) => (
                  <SelectItem key={dept['createdBy.department']} value={dept['createdBy.department']}>
                    {dept['createdBy.department']}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select value={groupBy} onValueChange={(value: 'day' | 'week' | 'month' | 'year') => setGroupBy(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>

          {/* Enhanced Export Options */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              PDF Report
            </Button>
          </div>
        </div>
      </div>



      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-900">{keyMetrics.total}</div>
                <div className="text-sm text-blue-700">Total Findings</div>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2 text-xs text-blue-600">
              All audit findings
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-900">{keyMetrics.resolved}</div>
                <div className="text-sm text-green-700">Resolved</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 text-xs text-green-600">
              {keyMetrics.total > 0 ? Math.round((keyMetrics.resolved / keyMetrics.total) * 100) : 0}% resolution rate
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-900">{keyMetrics.pending}</div>
                <div className="text-sm text-yellow-700">Pending</div>
              </div>
              <TrendingDown className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="mt-2 text-xs text-yellow-600">
              {keyMetrics.total > 0 ? Math.round((keyMetrics.pending / keyMetrics.total) * 100) : 0}% of total
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-900">{keyMetrics.overdue}</div>
                <div className="text-sm text-red-700">Overdue</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="mt-2 text-xs text-red-600">
              Requires immediate attention
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution - Dynamic Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Findings by Status</CardTitle>
            <div className="flex items-center gap-4">
              <ChartTypeSelector
                value={statusChartType}
                onChange={setStatusChartType}
                label="Chart Type"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportCSV(getStatusChartData(), 'findings-by-status')}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportPNG(statusChartRef, 'findings-by-status')}
                >
                  <Image className="h-4 w-4 mr-1" />
                  PNG
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent ref={statusChartRef}>
            <ResponsiveContainer width="100%" height={300}>
              {renderChart(statusChartType, getStatusChartData(), {
                dataKey: 'count',
                xAxisKey: 'name',
                colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
                onElementClick: (data) => handleDrillDown(
                  'status',
                  data.name,
                  `Findings with status: ${data.name}`,
                  [data] // In real implementation, this would be detailed findings
                ),
                drillDownType: 'status'
              })}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trends Over Time - Dynamic Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Audit Findings Trends Over Time</CardTitle>
            <div className="flex items-center gap-4">
              <ChartTypeSelector
                value={trendsChartType}
                onChange={setTrendsChartType}
                label="Chart Type"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportCSV(trendsData, 'audit-findings-trends')}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportPNG(trendsChartRef, 'audit-findings-trends')}
                >
                  <Image className="h-4 w-4 mr-1" />
                  PNG
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent ref={trendsChartRef}>
            <ResponsiveContainer width="100%" height={400}>
              {renderChart(trendsChartType, trendsData, {
                dataKey: 'count',
                xAxisKey: 'period',
                colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
              })}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution - Dynamic Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Findings by Department</CardTitle>
            <div className="flex items-center gap-4">
              <ChartTypeSelector
                value={departmentChartType}
                onChange={setDepartmentChartType}
                label="Chart Type"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportCSV(getDepartmentChartData(), 'findings-by-department')}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent ref={departmentChartRef}>
            <ResponsiveContainer width="100%" height={300}>
              {renderChart(departmentChartType, getDepartmentChartData(), {
                dataKey: 'count',
                xAxisKey: 'department',
                colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'],
                onElementClick: (data) => handleDrillDown(
                  'department',
                  data.department,
                  `Department: ${data.department}`,
                  [data] // In real implementation, this would be users in the department
                ),
                drillDownType: 'department'
              })}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Action Plan Metrics - Dynamic Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Action Plan Status</CardTitle>
            <div className="flex items-center gap-4">
              <ChartTypeSelector
                value={actionPlanChartType}
                onChange={setActionPlanChartType}
                label="Chart Type"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportCSV(getActionPlanChartData(), 'action-plan-metrics')}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent ref={actionPlanChartRef}>
            <ResponsiveContainer width="100%" height={300}>
              {renderChart(actionPlanChartType, getActionPlanChartData(), {
                dataKey: 'count',
                xAxisKey: 'status',
                colors: ['#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#8B5CF6']
              })}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Workload Distribution - Dynamic Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>User Workload Distribution (Top 10)</CardTitle>
            <div className="flex items-center gap-4">
              <ChartTypeSelector
                value={workloadChartType}
                onChange={setWorkloadChartType}
                label="Chart Type"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportCSV(getWorkloadChartData(), 'user-workload-distribution')}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent ref={workloadChartRef}>
            <ResponsiveContainer width="100%" height={400}>
              {renderChart(workloadChartType, getWorkloadChartData(), {
                dataKey: 'assigned_count',
                xAxisKey: 'username',
                colors: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444']
              })}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Analytics Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Analytics Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">
                  {keyMetrics.total}
                </div>
                <div className="text-sm text-blue-700">Total Findings</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-900">
                  {keyMetrics.resolved}
                </div>
                <div className="text-sm text-green-700">Resolved</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-900">
                  {keyMetrics.pending}
                </div>
                <div className="text-sm text-yellow-700">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Escalation Metrics */}
        {dashboardData?.escalation_metrics && (
          <Card>
            <CardHeader>
              <CardTitle>Escalation Metrics (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <div className="text-4xl font-bold text-orange-900 mb-2">
                  {dashboardData.escalation_metrics.total_escalations}
                </div>
                <div className="text-lg text-orange-700">Total Escalations</div>
                <div className="mt-4 text-sm text-gray-600">
                  Escalations requiring management attention
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Export All Data */}
      <Card>
        <CardHeader>
          <CardTitle>Export Analytics Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => dashboardData && handleExportCSV([dashboardData], 'complete-dashboard-data')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export All Data (CSV)
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Print Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Drill-Down Modal */}
      {drillDownModal.data && (
        <DrillDownModal
          isOpen={drillDownModal.isOpen}
          onClose={handleCloseDrillDown}
          initialData={drillDownModal.data}
          onNavigateToDetail={handleNavigateToDetail}
        />
      )}
    </div>
  );
};
