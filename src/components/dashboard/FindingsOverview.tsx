
import { User } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  TrendingUp,
  Users,
  Shield,
  Activity
} from 'lucide-react';

interface FindingsOverviewProps {
  user: User;
}

export const FindingsOverview = ({ user }: FindingsOverviewProps) => {
  // Add comprehensive null checks for user and required properties
  if (!user) {
    return <div>Loading...</div>;
  }

  // If user data is incomplete, show a message
  if (!user.role || !user.username) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">User data is incomplete. Please try logging in again.</p>
        </div>
      </div>
    );
  }

  // Mock data - in real app this would come from API
  const stats = {
    totalFindings: 142,
    pendingFindings: 28,
    resolvedFindings: 89,
    myFindings: user.role && user.role.includes('Auditor') ? 25 : 0,
    assignedToMe: user.role && (user.role.includes('Auditee') || user.role.includes('Supervisor')) ? 12 : 0,
    highRiskFindings: 15,
    overdueFindings: 8
  };

  const recentActivity = [
    {
      id: 1,
      type: 'finding_created',
      title: 'New audit finding created',
      description: 'Internal Control Testing - Payment Processing',
      time: '2 hours ago',
      severity: 'high'
    },
    {
      id: 2,
      type: 'rectification_submitted',
      title: 'Rectification submitted',
      description: 'IT Security Assessment - Access Control',
      time: '4 hours ago',
      severity: 'medium'
    },
    {
      id: 3,
      type: 'escalation',
      title: 'Finding escalated',
      description: 'Compliance Review - Documentation',
      time: '1 day ago',
      severity: 'high'
    }
  ];

  const departmentColors = {
    Business: 'from-blue-500 to-blue-600',
    IT_Audit: 'from-green-500 to-green-600',
    Inspection: 'from-purple-500 to-purple-600',
    Admin: 'from-red-500 to-red-600'
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className={`bg-gradient-to-r ${departmentColors[user.department] || 'bg-gray-600'} rounded-lg p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome, {user.username}
            </h1>
            <p className="text-blue-100 mb-4">
              {user.department ? user.department.replace('_', ' ') : 'Unknown'} Department • {user.role ? user.role.replace(/_/g, ' ') : 'Unknown Role'}
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Activity className="h-4 w-4" />
                <span>System Status: Online</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Last Login: Today, 9:30 AM</span>
              </div>
            </div>
          </div>
          <Shield className="h-16 w-16 opacity-50" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Total Findings
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.totalFindings}</div>
            <p className="text-xs text-blue-600 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">
              Pending Action
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{stats.pendingFindings}</div>
            <p className="text-xs text-yellow-600 mt-1">
              {stats.overdueFindings} overdue
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Resolved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.resolvedFindings}</div>
            <p className="text-xs text-green-600 mt-1">
              62.7% resolution rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">
              High Risk
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{stats.highRiskFindings}</div>
            <p className="text-xs text-red-600 mt-1">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Role-specific cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Latest updates on audit findings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    activity.severity === 'high' ? 'bg-red-100' : 
                    activity.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    <div className={`h-2 w-2 rounded-full ${
                      activity.severity === 'high' ? 'bg-red-500' : 
                      activity.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>
              Common tasks for your role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user.role && user.role.includes('Auditor') && !user.role.includes('Auditee') && (
                <>
                  <button className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                    <div className="font-medium text-blue-900">Create New Finding</div>
                    <div className="text-sm text-blue-600">Start a new audit finding</div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                    <div className="font-medium text-green-900">Review Rectifications</div>
                    <div className="text-sm text-green-600">Approve pending rectifications</div>
                  </button>
                </>
              )}
              {user.role && (user.role.includes('Auditee') || user.role.includes('Supervisor')) && (
                <>
                  <button className="w-full text-left p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors">
                    <div className="font-medium text-yellow-900">Submit Rectification</div>
                    <div className="text-sm text-yellow-600">Respond to assigned findings</div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                    <div className="font-medium text-purple-900">View Assignments</div>
                    <div className="text-sm text-purple-600">Check findings assigned to you</div>
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
