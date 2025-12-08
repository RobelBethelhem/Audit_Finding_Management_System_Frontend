// import { useState } from 'react';
// import { AuditFindingsList } from './AuditFindingsList';
// import { CreateFinding } from './CreateFinding';
// import { EditFinding } from './EditFinding';
// import { AuditFindingDetail } from './AuditFindingDetail';
// import { RectificationForm } from './RectificationForm';
// import { DeleteFindingButton } from './DeleteFindingButton';
// import { AssignmentModal } from './AssignmentModal';
// import { AuditRectificationDetail } from './AuditRectificationDetail';
// import { AuditActionPlanDetail } from './AuditActionPlanDetail';
// import { UnifiedCreateFinding } from './UnifiedCreateFinding';
// import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
// import { useDeleteFinding } from '@/hooks/useDeleteFinding';
// import { AuditFinding, getRolePermissions } from '@/types/auditFinding';
// import { User } from '@/hooks/useAuth';
// import { toast } from 'sonner';

// type ViewMode = 'list' | 'create' | 'unified-create' | 'edit' | 'detail' | 'rectify' | 'amend' | 'rectification' | 'action-plan';

// interface AuditFindingsManagementProps {
//   user: User;
// }

// export const AuditFindingsManagement = ({ user }: AuditFindingsManagementProps) => {
//   // Add null check for user
//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   const [viewMode, setViewMode] = useState<ViewMode>('list');
//   const [selectedFinding, setSelectedFinding] = useState<AuditFinding | null>(null);
//   const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [findingToDelete, setFindingToDelete] = useState<AuditFinding | null>(null);
//   const [showAssignmentModal, setShowAssignmentModal] = useState(false);
//   const [findingToAssign, setFindingToAssign] = useState<AuditFinding | null>(null);
//   const [rectificationFinding, setRectificationFinding] = useState<AuditFinding | null>(null);
//   const [actionPlanFinding, setActionPlanFinding] = useState<AuditFinding | null>(null);

//   // Get user permissions
//   const permissions = getRolePermissions(user.role, user.department);
//   const { deleteFinding, loading: deleteLoading } = useDeleteFinding();

//   // Handle navigation
//   const handleCreateNew = () => {
//     setSelectedFinding(null);
//     setViewMode('create');
//   };

//   const handleUnifiedCreate = () => {
//     setSelectedFinding(null);
//     setViewMode('unified-create');
//   };

//   const handleViewDetails = (finding: AuditFinding) => {
//     setSelectedFinding(finding);
//     setSelectedFindingId(finding.id);
//     setViewMode('detail');
//   };

//   const handleEdit = (finding: AuditFinding) => {
//     setSelectedFinding(finding);
//     setViewMode('edit');
//   };

//   const handleDelete = (finding: AuditFinding) => {
//     setFindingToDelete(finding);
//     setShowDeleteDialog(true);
//   };

//   const confirmDelete = async () => {
//     if (!findingToDelete) return;

//     const success = await deleteFinding(findingToDelete.id, findingToDelete.title);
//     if (success) {
//       setShowDeleteDialog(false);
//       setFindingToDelete(null);
//       // Stay on list view to see updated results
//       setViewMode('list');
//     }
//   };

//   const cancelDelete = () => {
//     setShowDeleteDialog(false);
//     setFindingToDelete(null);
//   };

//   const handleInitiateRectification = (finding: AuditFinding) => {
//     setSelectedFinding(finding);
//     setViewMode('rectify');
//   };

//   const handleAmendRectification = (finding: AuditFinding) => {
//     setSelectedFinding(finding);
//     setViewMode('amend');
//   };

//   const handleAssign = (finding: AuditFinding) => {
//     setFindingToAssign(finding);
//     setShowAssignmentModal(true);
//   };

//   const handleAssignmentSuccess = () => {
//     setShowAssignmentModal(false);
//     setFindingToAssign(null);
//     // Optionally refresh the list or show success message
//     // The list will automatically refresh due to the assignment
//   };

//   const handleAssignmentCancel = () => {
//     setShowAssignmentModal(false);
//     setFindingToAssign(null);
//   };

//   const handleRectify = (finding: AuditFinding) => {
//     setRectificationFinding(finding);
//     setViewMode('rectification');
//   };

//   const handleRectificationUpdate = () => {
//     // Navigate back to list view after rectification update
//     setViewMode('list');
//     setRectificationFinding(null);
//   };

//   const handleBackFromRectification = () => {
//     setViewMode('list');
//     setRectificationFinding(null);
//   };

//   const handleActionPlan = (finding: AuditFinding) => {
//     setActionPlanFinding(finding);
//     setViewMode('action-plan');
//   };

//   const handleActionPlanUpdate = () => {
//     // Navigate back to list view after action plan update
//     setViewMode('list');
//     setActionPlanFinding(null);
//   };

//   const handleBackFromActionPlan = () => {
//     setViewMode('list');
//     setActionPlanFinding(null);
//   };

//   const handleBackToList = () => {
//     setSelectedFinding(null);
//     setSelectedFindingId(null);
//     setViewMode('list');
//   };

//   const handleSaveSuccess = (finding?: AuditFinding) => {
//     // After successful save, go back to list or detail view
//     if (finding) {
//       setSelectedFinding(finding);
//       setSelectedFindingId(finding.id);
//       setViewMode('detail');
//     } else {
//       handleBackToList();
//     }
//   };

//   const handleRectificationSuccess = () => {
//     // After successful rectification, go back to detail view
//     if (selectedFindingId) {
//       setViewMode('detail');
//     } else {
//       handleBackToList();
//     }
//   };

//   const handleUnifiedCreateComplete = (findings: AuditFinding[]) => {
//     toast.success(`Successfully created ${findings.length} audit finding${findings.length > 1 ? 's' : ''}`);
//     handleBackToList();
//   };

//   // Render based on current view mode
//   switch (viewMode) {
//     case 'create':
//       return (
//         <CreateFinding user={user} />
//       );

//     case 'unified-create':
//       return (
//         <UnifiedCreateFinding
//           user={user}
//           onBack={handleBackToList}
//           onComplete={handleUnifiedCreateComplete}
//         />
//       );

//     case 'edit':
//       return (
//         <EditFinding
//           user={user}
//           findingId={selectedFinding?.id || ''}
//           onBack={handleBackToList}
//           onSave={handleSaveSuccess}
//         />
//       );

//     case 'detail':
//       return (
//         <AuditFindingDetail
//           user={user}
//           findingId={selectedFindingId!}
//           onEdit={handleEdit}
//           onBack={handleBackToList}
//           onInitiateRectification={handleInitiateRectification}
//         />
//       );

//     case 'rectify':
//       return (
//         <RectificationForm
//           user={user}
//           finding={selectedFinding!}
//           onSuccess={handleRectificationSuccess}
//           onCancel={() => setViewMode('detail')}
//           isAmendment={false}
//         />
//       );

//     case 'amend':
//       return (
//         <RectificationForm
//           user={user}
//           finding={selectedFinding!}
//           onSuccess={handleRectificationSuccess}
//           onCancel={() => setViewMode('detail')}
//           isAmendment={true}
//         />
//       );

//     case 'rectification':
//       return rectificationFinding ? (
//         <AuditRectificationDetail
//           finding={rectificationFinding}
//           currentUser={user}
//           onBack={handleBackFromRectification}
//           onRectificationUpdate={handleRectificationUpdate}
//         />
//       ) : null;

//     case 'action-plan':
//       return actionPlanFinding ? (
//         <AuditActionPlanDetail
//           finding={actionPlanFinding}
//           currentUser={user}
//           onBack={handleBackFromActionPlan}
//           onActionPlanUpdate={handleActionPlanUpdate}
//         />
//       ) : null;

//     default:
//       return (
//         <>
//           <AuditFindingsList
//             user={user}
//             onCreateNew={handleCreateNew}
//             onUnifiedCreate={handleUnifiedCreate}
//             onViewDetails={handleViewDetails}
//             onEdit={handleEdit}
//             onDelete={handleDelete}
//             onAssign={handleAssign}
//             onRectify={handleRectify}
//             onActionPlan={handleActionPlan}
//           />

//           <ConfirmationDialog
//             open={showDeleteDialog}
//             onOpenChange={setShowDeleteDialog}
//             title="Delete Audit Finding"
//             description={
//               findingToDelete
//                 ? `Are you sure you want to delete the finding "${findingToDelete.title}"? This action cannot be undone.`
//                 : "Are you sure you want to delete this finding? This action cannot be undone."
//             }
//             confirmText="Delete"
//             cancelText="Cancel"
//             onConfirm={confirmDelete}
//             onCancel={cancelDelete}
//             variant="destructive"
//             loading={deleteLoading}
//           />

//           <AssignmentModal
//             open={showAssignmentModal}
//             onOpenChange={setShowAssignmentModal}
//             finding={findingToAssign}
//             currentUser={user}
//             onAssignmentSuccess={handleAssignmentSuccess}
//           />


//         </>
//       );
//   }
// };



import { useState } from 'react';

import { AuditFindingsList } from './AuditFindingsList';

import { CreateFinding } from './CreateFinding';

import { EditFinding } from './EditFinding';

import { AuditFindingDetail } from './AuditFindingDetail';

import { RectificationForm } from './RectificationForm';

import { DeleteFindingButton } from './DeleteFindingButton';

import { AssignmentModal } from './AssignmentModal';

import { AuditRectificationDetail } from './AuditRectificationDetail';

import { AuditActionPlanDetail } from './AuditActionPlanDetail';

import { UnifiedCreateFinding } from './UnifiedCreateFinding';

import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

import { useDeleteFinding } from '@/hooks/useDeleteFinding';

import { AuditFinding, getRolePermissions } from '@/types/auditFinding';

import { User } from '@/hooks/useAuth';

import { toast } from 'sonner';



type ViewMode = 'list' | 'create' | 'unified-create' | 'edit' | 'detail' | 'rectify' | 'amend' | 'rectification' | 'action-plan';



interface AuditFindingsManagementProps {

  user: User;

  initialFilter?: { status?: string; riskRating?: string } | null;

}



export const AuditFindingsManagement = ({ user, initialFilter }: AuditFindingsManagementProps) => {

  // Add null check for user

  if (!user) {

    return <div>Loading...</div>;

  }



  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const [selectedFinding, setSelectedFinding] = useState<AuditFinding | null>(null);

  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [findingToDelete, setFindingToDelete] = useState<AuditFinding | null>(null);

  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  const [findingToAssign, setFindingToAssign] = useState<AuditFinding | null>(null);

  const [rectificationFinding, setRectificationFinding] = useState<AuditFinding | null>(null);

  const [actionPlanFinding, setActionPlanFinding] = useState<AuditFinding | null>(null);



  // Get user permissions

  const permissions = getRolePermissions(user.role, user.department);

  const { deleteFinding, loading: deleteLoading } = useDeleteFinding();



  // Handle navigation

  const handleCreateNew = () => {

    setSelectedFinding(null);

    setViewMode('create');

  };



  const handleUnifiedCreate = () => {

    setSelectedFinding(null);

    setViewMode('unified-create');

  };



  const handleViewDetails = (finding: AuditFinding) => {

    setSelectedFinding(finding);

    setSelectedFindingId(finding.id);

    setViewMode('detail');

  };



  const handleEdit = (finding: AuditFinding) => {

    setSelectedFinding(finding);

    setViewMode('edit');

  };



  const handleDelete = (finding: AuditFinding) => {

    setFindingToDelete(finding);

    setShowDeleteDialog(true);

  };



  const confirmDelete = async () => {

    if (!findingToDelete) return;



    const success = await deleteFinding(findingToDelete.id, findingToDelete.title);

    if (success) {

      setShowDeleteDialog(false);

      setFindingToDelete(null);

      // Stay on list view to see updated results

      setViewMode('list');

    }

  };



  const cancelDelete = () => {

    setShowDeleteDialog(false);

    setFindingToDelete(null);

  };



  const handleInitiateRectification = (finding: AuditFinding) => {

    setSelectedFinding(finding);

    setViewMode('rectify');

  };



  const handleAmendRectification = (finding: AuditFinding) => {

    setSelectedFinding(finding);

    setViewMode('amend');

  };



  const handleAssign = (finding: AuditFinding) => {

    setFindingToAssign(finding);

    setShowAssignmentModal(true);

  };



  const handleAssignmentSuccess = () => {

    setShowAssignmentModal(false);

    setFindingToAssign(null);

    // Optionally refresh the list or show success message

    // The list will automatically refresh due to the assignment

  };



  const handleAssignmentCancel = () => {

    setShowAssignmentModal(false);

    setFindingToAssign(null);

  };



  const handleRectify = (finding: AuditFinding) => {

    setRectificationFinding(finding);

    setViewMode('rectification');

  };



  const handleRectificationUpdate = () => {

    // Navigate back to list view after rectification update

    setViewMode('list');

    setRectificationFinding(null);

  };



  const handleBackFromRectification = () => {

    setViewMode('list');

    setRectificationFinding(null);

  };



  const handleActionPlan = (finding: AuditFinding) => {

    setActionPlanFinding(finding);

    setViewMode('action-plan');

  };



  const handleActionPlanUpdate = () => {

    // Navigate back to list view after action plan update

    setViewMode('list');

    setActionPlanFinding(null);

  };



  const handleBackFromActionPlan = () => {

    setViewMode('list');

    setActionPlanFinding(null);

  };



  const handleBackToList = () => {

    setSelectedFinding(null);

    setSelectedFindingId(null);

    setViewMode('list');

  };



  const handleSaveSuccess = (finding?: AuditFinding) => {

    // After successful save, go back to list or detail view

    if (finding) {

      setSelectedFinding(finding);

      setSelectedFindingId(finding.id);

      setViewMode('detail');

    } else {

      handleBackToList();

    }

  };



  const handleRectificationSuccess = () => {

    // After successful rectification, go back to detail view

    if (selectedFindingId) {

      setViewMode('detail');

    } else {

      handleBackToList();

    }

  };



  const handleUnifiedCreateComplete = (findings: AuditFinding[]) => {

    toast.success(`Successfully created ${findings.length} audit finding${findings.length > 1 ? 's' : ''}`);

    handleBackToList();

  };



  // Render based on current view mode

  switch (viewMode) {

    case 'create':

      return (

        <CreateFinding user={user} />

      );



    case 'unified-create':

      return (

        <UnifiedCreateFinding

          user={user}

          onBack={handleBackToList}

          onComplete={handleUnifiedCreateComplete}

        />

      );



    case 'edit':

      return (

        <EditFinding

          user={user}

          findingId={selectedFinding?.id || ''}

          onBack={handleBackToList}

          onSave={handleSaveSuccess}

        />

      );



    case 'detail':

      return (

        <AuditFindingDetail

          user={user}

          findingId={selectedFindingId!}

          onEdit={handleEdit}

          onBack={handleBackToList}

          onInitiateRectification={handleInitiateRectification}

        />

      );



    case 'rectify':

      return (

        <RectificationForm

          user={user}

          finding={selectedFinding!}

          onSuccess={handleRectificationSuccess}

          onCancel={() => setViewMode('detail')}

          isAmendment={false}

        />

      );



    case 'amend':

      return (

        <RectificationForm

          user={user}

          finding={selectedFinding!}

          onSuccess={handleRectificationSuccess}

          onCancel={() => setViewMode('detail')}

          isAmendment={true}

        />

      );



    case 'rectification':

      return rectificationFinding ? (

        <AuditRectificationDetail

          finding={rectificationFinding}

          currentUser={user}

          onBack={handleBackFromRectification}

          onRectificationUpdate={handleRectificationUpdate}

        />

      ) : null;



    case 'action-plan':

      return actionPlanFinding ? (

        <AuditActionPlanDetail

          finding={actionPlanFinding}

          currentUser={user}

          onBack={handleBackFromActionPlan}

          onActionPlanUpdate={handleActionPlanUpdate}

        />

      ) : null;



    default:

      return (

        <>

          <AuditFindingsList

            user={user}

            onCreateNew={handleCreateNew}

            onUnifiedCreate={handleUnifiedCreate}

            onViewDetails={handleViewDetails}

            onEdit={handleEdit}

            onDelete={handleDelete}

            onAssign={handleAssign}

            onRectify={handleRectify}

            onActionPlan={handleActionPlan}

            initialFilter={initialFilter}

          />



          <ConfirmationDialog

            open={showDeleteDialog}

            onOpenChange={setShowDeleteDialog}

            title="Delete Audit Finding"

            description={

              findingToDelete

                ? `Are you sure you want to delete the finding "${findingToDelete.title}"? This action cannot be undone.`

                : "Are you sure you want to delete this finding? This action cannot be undone."

            }

            confirmText="Delete"

            cancelText="Cancel"

            onConfirm={confirmDelete}

            onCancel={cancelDelete}

            variant="destructive"

            loading={deleteLoading}

          />



          <AssignmentModal

            open={showAssignmentModal}

            onOpenChange={setShowAssignmentModal}

            finding={findingToAssign}

            currentUser={user}

            onAssignmentSuccess={handleAssignmentSuccess}

          />





        </>

      );

  }

};
