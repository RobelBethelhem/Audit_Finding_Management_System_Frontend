
import { User } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Eye, 
  Upload, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Calendar,
  User as UserIcon,
  FileText
} from 'lucide-react';

interface AssignedFindingsProps {
  user: User;
}

export const AssignedFindings = ({ user }: AssignedFindingsProps) => {
  // Mock data for findings assigned to the current user
  const assignedFindings = [
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
      assigned_at: '2024-01-16',
      can_rectify: true,
      rectification_status: null,
      escalation_level: 0
    },
    {
      id: '2',
      title: 'Compliance Documentation Review',
      description: 'Missing documentation for regulatory compliance requirements.',
      status: 'in_progress',
      risk_level: 'medium',
      category: 'Compliance',
      created_by: 'Emma Davis',
      created_at: '2024-01-12',
      due_date: '2024-02-01',
      assigned_at: '2024-01-13',
      can_rectify: true,
      rectification_status: 'submitted',
      escalation_level: 0
    },
    {
      id: '3',
      title: 'IT Security Assessment - Access Control',
      description: 'Unauthorized access privileges found in production systems.',
      status: 'escalated',
      risk_level: 'critical',
      category: 'IT Security',
      created_by: 'Michael Chen',
      created_at: '2024-01-10',
      due_date: '2024-01-25',
      assigned_at: '2024-01-11',
      can_rectify: false,
      rectification_status: 'rejected',
      escalation_level: 1
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

  const getRectificationStatusColor = (status: string | null) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const pendingCount = assignedFindings.filter(f => f.status === 'pending').length;
  const inProgressCount = assignedFindings.filter(f => f.status === 'in_progress').length;
  const overdueCount = assignedFindings.filter(f => isOverdue(f.due_date)).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assigned to Me</h1>
        <p className="text-gray-600">Audit findings that require your attention and action</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-900">{assignedFindings.length}</div>
            <div className="text-sm text-blue-700">Total Assigned</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-900">{pendingCount}</div>
            <div className="text-sm text-yellow-700">Pending Action</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-900">{inProgressCount}</div>
            <div className="text-sm text-purple-700">In Progress</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-900">{overdueCount}</div>
            <div className="text-sm text-red-700">Overdue</div>
          </CardContent>
        </Card>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {assignedFindings.map((finding) => (
          <Card key={finding.id} className={`hover:shadow-md transition-shadow ${
            isOverdue(finding.due_date) ? 'border-red-200 bg-red-50' : ''
          }`}>
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
                    {isOverdue(finding.due_date) && (
                      <Badge className="bg-red-100 text-red-800">
                        <Clock className="h-3 w-3 mr-1" />
                        OVERDUE
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{finding.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <UserIcon className="h-4 w-4" />
                      <span>By: {finding.created_by}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Assigned: {finding.assigned_at}</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${
                      isOverdue(finding.due_date) ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      <AlertTriangle className="h-4 w-4" />
                      <span>Due: {finding.due_date}</span>
                    </div>
                    <div className="text-gray-600">
                      Category: {finding.category}
                    </div>
                  </div>

                  {/* Rectification Status */}
                  {finding.rectification_status && (
                    <div className="mb-4">
                      <Badge className={getRectificationStatusColor(finding.rectification_status)}>
                        Rectification: {finding.rectification_status.toUpperCase()}
                      </Badge>
                    </div>
                  )}

                  {/* Escalation Level */}
                  {finding.escalation_level > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Escalation Level: {finding.escalation_level}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-4">
                <div className="flex flex-wrap gap-2">
                  {finding.can_rectify && !finding.rectification_status && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Submit Rectification
                    </Button>
                  )}
                  
                  {finding.rectification_status === 'rejected' && (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <FileText className="h-4 w-4 mr-1" />
                      Amend Rectification
                    </Button>
                  )}
                  
                  {finding.rectification_status === 'submitted' && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Awaiting Approval
                    </Badge>
                  )}
                  
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-1" />
                    Upload Evidence
                  </Button>
                  
                  {user.role.includes('Supervisor') && (
                    <>
                      <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {assignedFindings.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assigned findings</h3>
            <p className="text-gray-600">You don't have any audit findings assigned to you at the moment.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
