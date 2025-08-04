
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Eye, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  FileText,
  Calendar,
  User as UserIcon
} from 'lucide-react';

interface FindingsListProps {
  user: User;
}

interface Finding {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'escalated' | 'resolved';
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  created_by: string;
  created_at: string;
  due_date: string;
  assigned_to?: string;
  department: string;
}

export const FindingsList = ({ user }: FindingsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  // Mock data - in real app this would come from API
  const findings: Finding[] = [
    {
      id: '1',
      title: 'Internal Control Testing - Payment Processing',
      description: 'Identified weakness in payment authorization process requiring immediate attention.',
      status: 'pending',
      risk_level: 'high',
      category: 'Internal Controls',
      created_by: 'Sarah Johnson',
      created_at: '2024-01-15',
      due_date: '2024-02-15',
      assigned_to: 'James Wilson',
      department: 'Business'
    },
    {
      id: '2',
      title: 'IT Security Assessment - Access Control',
      description: 'Unauthorized access privileges found in production systems.',
      status: 'in_progress',
      risk_level: 'critical',
      category: 'IT Security',
      created_by: 'Michael Chen',
      created_at: '2024-01-14',
      due_date: '2024-01-28',
      assigned_to: 'IT Team Lead',
      department: 'IT_Audit'
    },
    {
      id: '3',
      title: 'Compliance Review - Documentation',
      description: 'Missing documentation for regulatory compliance requirements.',
      status: 'escalated',
      risk_level: 'medium',
      category: 'Compliance',
      created_by: 'Emma Davis',
      created_at: '2024-01-12',
      due_date: '2024-02-01',
      assigned_to: 'Compliance Officer',
      department: 'Inspection'
    },
    {
      id: '4',
      title: 'Financial Audit - Revenue Recognition',
      description: 'Discrepancies identified in revenue recognition practices.',
      status: 'resolved',
      risk_level: 'medium',
      category: 'Financial',
      created_by: 'Sarah Johnson',
      created_at: '2024-01-10',
      due_date: '2024-01-25',
      assigned_to: 'Finance Team',
      department: 'Business'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <FileText className="h-4 w-4" />;
      case 'escalated':
        return <AlertTriangle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'escalated':
        return 'bg-red-100 text-red-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFindings = findings.filter(finding => {
    const matchesSearch = finding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         finding.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || finding.status === filterStatus;
    const matchesRisk = filterRisk === 'all' || finding.risk_level === filterRisk;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Findings</h1>
          <p className="text-gray-600">Manage and track all audit findings</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search findings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Advanced Filters</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Findings List */}
      <div className="space-y-4">
        {filteredFindings.map((finding) => (
          <Card key={finding.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{finding.title}</h3>
                    <Badge className={getRiskColor(finding.risk_level)}>
                      {finding.risk_level.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(finding.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(finding.status)}
                        <span>{finding.status.replace('_', ' ').toUpperCase()}</span>
                      </div>
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{finding.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <UserIcon className="h-4 w-4" />
                      <span>Created by: {finding.created_by}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {finding.created_at}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Due: {finding.due_date}</span>
                    </div>
                  </div>
                  
                  {finding.assigned_to && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Assigned to:</span> {finding.assigned_to}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFindings.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No findings found</h3>
            <p className="text-gray-600">No audit findings match your current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
