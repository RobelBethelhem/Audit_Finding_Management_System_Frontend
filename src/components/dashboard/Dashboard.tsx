
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { FindingsOverview } from './FindingsOverview';
// FindingsList removed - using AuditFindingsManagement instead
import { CreateFinding } from './CreateFinding';
import { MyFindings } from './MyFindings';
import { AssignedFindings } from './AssignedFindings';
import { Analytics } from './Analytics';
import { UserManagement } from './admin/UserManagement';
import { ReferenceDataManagement } from './admin/ReferenceDataManagement';
import { EscalationRulesManagement } from './admin/EscalationRulesManagement';
import { InspectorBranchAssignmentManagement } from './admin/InspectorBranchAssignmentManagement';
import { AuditFindingsManagement } from './AuditFindingsManagement';
import { AssignmentManagement } from './AssignmentManagement';
import { ActionPlansManagement } from './ActionPlansManagement';
import { UnifiedCreateFinding } from './UnifiedCreateFinding';
import { toast } from 'sonner';
import { AuditFinding } from '@/types/auditFinding';

// Export the ViewType so it can be imported in Sidebar.tsx
export type ViewType =
  | 'overview'
  | 'findings'
  | 'my-findings'
  | 'assigned'
  | 'analytics'
  | 'users'
  | 'reference-data'
  | 'escalation-rules'
  | 'assignments'
  | 'action-plans'
  | 'inspector-branch-assignment';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Set default view based on user role when user is loaded
  useEffect(() => {
    if (user?.role === 'Admin') {
      setActiveView('users');
    }
  }, [user]);
  
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Create a wrapper function to handle type conversion
  const handleSetActiveView = (view: string) => {
    setActiveView(view as ViewType);
  };
  
  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <FindingsOverview user={user} />;
      case 'findings':
        return <AuditFindingsManagement user={user} />;

      case 'my-findings':
        return <MyFindings user={user} />;
      case 'assigned':
        return <AssignedFindings user={user} />;
      case 'analytics':
        return <Analytics user={user} />;
      case 'users':
        return <UserManagement user={user} />;
      case 'reference-data':
        return <ReferenceDataManagement user={user} />;
      case 'escalation-rules':
        return <EscalationRulesManagement user={user} />;
      case 'inspector-branch-assignment':
        return <InspectorBranchAssignmentManagement user={user} />;
      case 'assignments':
        return <AssignmentManagement user={user} />;
      case 'action-plans':
        return <ActionPlansManagement user={user} />;
      default:
        return <FindingsOverview user={user} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeView={activeView}
        setActiveView={handleSetActiveView}
        isOpen={sidebarOpen}
        onToggle={handleToggleSidebar}
        onLogout={onLogout}
        user={user}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          user={user}
          onLogout={onLogout}
          onMenuToggle={handleToggleSidebar}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};
