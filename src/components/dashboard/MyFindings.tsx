
import { User } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Users, Calendar, AlertTriangle } from 'lucide-react';

interface MyFindingsProps {
  user: User;
}

export const MyFindings = ({ user }: MyFindingsProps) => {
  // Mock data for findings created by the current user
  const myFindings = [
    {
      id: '1',
      title: 'Internal Control Testing - Payment Processing',
      description: 'Identified weakness in payment authorization process requiring immediate attention.',
      status: 'pending',
      risk_level: 'high',
      category: 'Internal Controls',
      created_at: '2024-01-15',
      due_date: '2024-02-15',
      assigned_to: ['James Wilson', 'Finance Team'],
      rectifications_count: 0,
      escalations_count: 0
    },
    {
      id: '2',
      title: 'Financial Audit - Revenue Recognition',
      description: 'Discrepancies identified in revenue recognition practices.',
      status: 'resolved',
      risk_level: 'medium',
      category: 'Financial',
      created_at: '2024-01-10',
      due_date: '2024-01-25',
      assigned_to: ['Finance Team'],
      rectifications_count: 2,
      escalations_count: 1
    },
    {
      id: '3',
      title: 'Operational Risk Assessment',
      description: 'Process gaps identified in customer onboarding procedures.',
      status: 'in_progress',
      risk_level: 'medium',
      category: 'Operational Risk',
      created_at: '2024-01-08',
      due_date: '2024-02-08',
      assigned_to: ['Operations Manager', 'Compliance Officer'],
      rectifications_count: 1,
      escalations_count: 0
    }
  ];

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

  const pendingCount = myFindings.filter(f => f.status === 'pending').length;
  const inProgressCount = myFindings.filter(f => f.status === 'in_progress').length;
  const resolvedCount = myFindings.filter(f => f.status === 'resolved').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Created Findings</h1>
        <p className="text-gray-600">Audit findings that you have created and are tracking</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-900">{myFindings.length}</div>
            <div className="text-sm text-blue-700">Total Created</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-900">{pendingCount}</div>
            <div className="text-sm text-yellow-700">Pending</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-900">{inProgressCount}</div>
            <div className="text-sm text-purple-700">In Progress</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-900">{resolvedCount}</div>
            <div className="text-sm text-green-700">Resolved</div>
          </CardContent>
        </Card>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {myFindings.map((finding) => (
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
                      {finding.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{finding.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {finding.created_at}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Due: {finding.due_date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{finding.assigned_to.length} Assignees</span>
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Rectifications:</span> {finding.rectifications_count}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className="text-sm font-medium text-gray-700">Assigned to: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {finding.assigned_to.map((assignee, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {assignee}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Rectifications: {finding.rectifications_count}</span>
                    </div>
                    {finding.escalations_count > 0 && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Escalations: {finding.escalations_count}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-gray-500">
                    Category: {finding.category}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {myFindings.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No findings created yet</h3>
            <p className="text-gray-600">You haven't created any audit findings yet. Create your first finding to get started.</p>
            <Button className="mt-4">Create New Finding</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
