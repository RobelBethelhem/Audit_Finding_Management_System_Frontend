import { useState } from 'react';
import { ActionPlansList } from './ActionPlansList';
import { ActionPlanForm } from './ActionPlanForm';
import { ActionPlanDetail } from './ActionPlanDetail';
import { ActionPlan, getActionPlanPermissions } from '@/types/actionPlan';
import { User } from '@/types/user';

type ViewMode = 'list' | 'create' | 'edit' | 'detail';

interface ActionPlansManagementProps {
  user: User;
}

export const ActionPlansManagement = ({ user }: ActionPlansManagementProps) => {
  // Add null check for user
  if (!user) {
    return <div>Loading...</div>;
  }

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedActionPlan, setSelectedActionPlan] = useState<ActionPlan | null>(null);
  const [selectedActionPlanId, setSelectedActionPlanId] = useState<string | null>(null);

  // Get user permissions
  const permissions = getActionPlanPermissions(user.role, user.department);

  // Handle navigation
  const handleCreateNew = () => {
    setSelectedActionPlan(null);
    setViewMode('create');
  };

  const handleViewDetails = (actionPlan: ActionPlan) => {
    setSelectedActionPlan(actionPlan);
    setSelectedActionPlanId(actionPlan.action_plan_id);
    setViewMode('detail');
  };

  const handleEdit = (actionPlan: ActionPlan) => {
    setSelectedActionPlan(actionPlan);
    setViewMode('edit');
  };

  const handleDelete = (actionPlan: ActionPlan) => {
    // Delete is handled within the detail view
    handleViewDetails(actionPlan);
  };

  const handleBackToList = () => {
    setSelectedActionPlan(null);
    setSelectedActionPlanId(null);
    setViewMode('list');
  };

  const handleSaveSuccess = (actionPlan: ActionPlan) => {
    // After successful save, go to detail view
    setSelectedActionPlan(actionPlan);
    setSelectedActionPlanId(actionPlan.action_plan_id);
    setViewMode('detail');
  };

  const handleStatusChange = (actionPlan: ActionPlan, newStatus: string) => {
    // Update the selected action plan status if it's the same one
    if (selectedActionPlan && selectedActionPlan.action_plan_id === actionPlan.action_plan_id) {
      setSelectedActionPlan({ ...selectedActionPlan, status: newStatus as any });
    }
  };

  // Render based on current view mode
  switch (viewMode) {
    case 'create':
      return (
        <ActionPlanForm
          user={user}
          onSave={handleSaveSuccess}
          onCancel={handleBackToList}
        />
      );

    case 'edit':
      return (
        <ActionPlanForm
          user={user}
          actionPlan={selectedActionPlan || undefined}
          onSave={handleSaveSuccess}
          onCancel={handleBackToList}
        />
      );

    case 'detail':
      return (
        <ActionPlanDetail
          user={user}
          actionPlanId={selectedActionPlanId!}
          onEdit={handleEdit}
          onBack={handleBackToList}
        />
      );

    default:
      return (
        <ActionPlansList
          user={user}
          onCreateNew={handleCreateNew}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onChangeStatus={handleStatusChange}
        />
      );
  }
};
