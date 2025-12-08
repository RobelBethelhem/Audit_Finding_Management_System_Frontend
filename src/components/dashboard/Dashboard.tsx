
// import { useState, useEffect } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { Sidebar } from './Sidebar';
// import { DashboardHeader } from './DashboardHeader';
// import { FindingsOverview } from './FindingsOverview';
// // FindingsList removed - using AuditFindingsManagement instead
// import { CreateFinding } from './CreateFinding';
// import { MyFindings } from './MyFindings';
// import { AssignedFindings } from './AssignedFindings';
// import { Analytics } from './Analytics';
// import { UserManagement } from './admin/UserManagement';
// import { ReferenceDataManagement } from './admin/ReferenceDataManagement';
// import { EscalationRulesManagement } from './admin/EscalationRulesManagement';
// import { InspectorBranchAssignmentManagement } from './admin/InspectorBranchAssignmentManagement';
// import { AuditFindingsManagement } from './AuditFindingsManagement';
// import { AssignmentManagement } from './AssignmentManagement';
// import { ActionPlansManagement } from './ActionPlansManagement';
// import { UnifiedCreateFinding } from './UnifiedCreateFinding';
// import { toast } from 'sonner';
// import { AuditFinding } from '@/types/auditFinding';
// import { Chat } from '@/components/chat/Chat';
// import { useChat } from '@/contexts/ChatContext';
// import { Badge}  from '@/components/ui/badge';

// // Export the ViewType so it can be imported in Sidebar.tsx
// export type ViewType =
//   | 'overview'
//   | 'findings'
//   | 'my-findings'
//   | 'assigned'
//   | 'analytics'
//   | 'users'
//   | 'reference-data'
//   | 'escalation-rules'
//   | 'assignments'
//   | 'action-plans'
//   | 'inspector-branch-assignment'
//   | 'chat';

// interface DashboardProps {
//   onLogout: () => void;
// }

// export const Dashboard = ({ onLogout }: DashboardProps) => {
//   const { user } = useAuth();
//   const { unreadCount } = useChat();
//   const [activeView, setActiveView] = useState<ViewType>('overview');
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   if( !user) {
//     toast.error('You must be logged in to access the dashboard.');
//     return null; 
//   }

//   // Set default view based on user role when user is loaded
//   useEffect(() => {
//     if (user?.role === 'Admin') {
//       setActiveView('users');
//     }
//   }, [user]);
  
//   const handleToggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   // Create a wrapper function to handle type conversion
//   const handleSetActiveView = (view: string) => {
//     setActiveView(view as ViewType);
//   };
  
//   const renderContent = () => {
//     switch (activeView) {
//       case 'overview':
//         return <FindingsOverview user={user} />;
//       case 'findings':
//         return <AuditFindingsManagement user={user} />;

//       case 'my-findings':
//         return <MyFindings user={user} />;
//       case 'assigned':
//         return <AssignedFindings user={user} />;
//       case 'analytics':
//         return <Analytics user={user} />;
//       case 'users':
//         return <UserManagement user={user} />;
//       case 'reference-data':
//         return <ReferenceDataManagement user={user} />;
//       case 'escalation-rules':
//         return <EscalationRulesManagement user={user} />;
//       case 'inspector-branch-assignment':
//         return <InspectorBranchAssignmentManagement user={user} />;
//       case 'assignments':
//         return <AssignmentManagement user={user} />;
//       case 'action-plans':
//         return <ActionPlansManagement user={user} />;
//       case 'chat':
//         return <Chat />;
//       default:
//         return <FindingsOverview user={user} />;
//     }
//   };

//   return (
//     <div className="flex h-screen overflow-hidden">
//       <Sidebar
//         activeView={activeView}
//         setActiveView={handleSetActiveView}
//         isOpen={sidebarOpen}
//         onToggle={handleToggleSidebar}
//         onLogout={onLogout}
//         user={user}
//       />
      
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <DashboardHeader
//           user={user}
//           onLogout={onLogout}
//           onMenuToggle={handleToggleSidebar}
//         />
        
//         <main className="flex-1 overflow-auto">
//           <div className="p-6">
//             {renderContent()}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };












// // src/components/dashboard/Dashboard.tsx - SAFE VERSION
// import { useState, useEffect } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { Sidebar } from './Sidebar';
// import { DashboardHeader } from './DashboardHeader';
// import { FindingsOverview } from './FindingsOverview';
// import { CreateFinding } from './CreateFinding';
// import { MyFindings } from './MyFindings';
// import { AssignedFindings } from './AssignedFindings';
// import { Analytics } from './Analytics';
// import { UserManagement } from './admin/UserManagement';
// import { ReferenceDataManagement } from './admin/ReferenceDataManagement';
// import { EscalationRulesManagement } from './admin/EscalationRulesManagement';
// import { InspectorBranchAssignmentManagement } from './admin/InspectorBranchAssignmentManagement';
// import { AuditFindingsManagement } from './AuditFindingsManagement';
// import { AssignmentManagement } from './AssignmentManagement';
// import { ActionPlansManagement } from './ActionPlansManagement';
// import { UnifiedCreateFinding } from './UnifiedCreateFinding';
// import { toast } from 'sonner';
// import { AuditFinding } from '@/types/auditFinding';
// import { Chat } from '@/components/chat/Chat';
// import { Badge } from '@/components/ui/badge';

// // Create a safe hook that won't break if ChatProvider isn't available
// const useChatSafely = () => {
//   try {
//     // Dynamic import to avoid errors if the context doesn't exist
//     const { useChat } = require('@/contexts/ChatContext');
//     return useChat();
//   } catch (error) {
//     // Return a stub object if chat isn't available
//     return {
//       unreadCount: 0,
//       conversations: [],
//       activeConversation: null,
//       messages: [],
//       typingUsers: new Map(),
//       onlineUsers: {},
//       loading: false,
//       messagesLoading: false,
//       error: null,
//       // Stub functions that do nothing
//       loadConversations: async () => {},
//       createConversation: async () => { throw new Error('Chat not available'); },
//       selectConversation: async () => {},
//       sendMessage: async () => {},
//       editMessage: async () => {},
//       deleteMessage: async () => {},
//       addReaction: async () => {},
//       removeReaction: async () => {},
//       forwardMessage: async () => {},
//       markMessagesAsRead: async () => {},
//       loadMoreMessages: async () => {},
//       searchMessages: async () => [],
//       addParticipants: async () => {},
//       removeParticipant: async () => {},
//       updateConversation: async () => {},
//       startTyping: () => {},
//       stopTyping: () => {},
//       refreshConversations: async () => {},
//       clearActiveConversation: () => {}
//     };
//   }
// };

// // Export the ViewType so it can be imported in Sidebar.tsx
// export type ViewType =
//   | 'overview'
//   | 'findings'
//   | 'my-findings'
//   | 'assigned'
//   | 'analytics'
//   | 'users'
//   | 'reference-data'
//   | 'escalation-rules'
//   | 'assignments'
//   | 'action-plans'
//   | 'inspector-branch-assignment'
//   | 'chat';

// interface DashboardProps {
//   onLogout: () => void;
// }

// export const Dashboard = ({ onLogout }: DashboardProps) => {
//   // ALL hooks must be called unconditionally and in the same order
//   const { user } = useAuth();
//   const [activeView, setActiveView] = useState<ViewType>('overview');
//   const [sidebarOpen, setSidebarOpen] = useState(false);
  
//   // Use the safe chat hook
//   const chatContext = useChatSafely();
//   const unreadCount = chatContext?.unreadCount || 0;

//   // Set default view based on user role when user is loaded
//   useEffect(() => {
//     if (user?.role === 'Admin') {
//       setActiveView('users');
//     }
//   }, [user]);

//   // Show error toast if no user (but do it in useEffect to avoid render issues)
//   useEffect(() => {
//     if (!user) {
//       toast.error('You must be logged in to access the dashboard.');
//     }
//   }, [user]);

//   // AFTER all hooks, we can do early return
//   if (!user) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-4">Not Authenticated</h2>
//           <p className="text-gray-600 mb-4">Please log in to access the dashboard.</p>
//           <button
//             onClick={onLogout}
//             className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }
  
//   const handleToggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   // Create a wrapper function to handle type conversion
//   const handleSetActiveView = (view: string) => {
//     setActiveView(view as ViewType);
//   };
  
//   const renderContent = () => {
//     switch (activeView) {
//       case 'overview':
//         return <FindingsOverview user={user} />;
//       case 'findings':
//         return <AuditFindingsManagement user={user} />;
//       case 'my-findings':
//         return <MyFindings user={user} />;
//       case 'assigned':
//         return <AssignedFindings user={user} />;
//       case 'analytics':
//         return <Analytics user={user} />;
//       case 'users':
//         return <UserManagement user={user} />;
//       case 'reference-data':
//         return <ReferenceDataManagement user={user} />;
//       case 'escalation-rules':
//         return <EscalationRulesManagement user={user} />;
//       case 'inspector-branch-assignment':
//         return <InspectorBranchAssignmentManagement user={user} />;
//       case 'assignments':
//         return <AssignmentManagement user={user} />;
//       case 'action-plans':
//         return <ActionPlansManagement user={user} />;
//       case 'chat':
//         // Only render Chat if we have a valid chat context
//         return chatContext ? <Chat /> : (
//           <div className="flex items-center justify-center h-full">
//             <p className="text-gray-500">Chat service is not available</p>
//           </div>
//         );
//       default:
//         return <FindingsOverview user={user} />;
//     }
//   };

//   return (
//     <div className="flex h-screen overflow-hidden">
//       <Sidebar
//         activeView={activeView}
//         setActiveView={handleSetActiveView}
//         isOpen={sidebarOpen}
//         onToggle={handleToggleSidebar}
//         onLogout={onLogout}
//         user={user}
//         unreadCount={unreadCount}
//       />
      
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <DashboardHeader
//           user={user}
//           onLogout={onLogout}
//           onMenuToggle={handleToggleSidebar}
//         />
        
//         <main className="flex-1 overflow-auto">
//           <div className="p-6">
//             {renderContent()}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };





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

import { Chat } from '@/components/chat/Chat';

import { Badge } from '@/components/ui/badge';

import { NBEReport } from './NBEReport';





// Create a safe hook that won't break if ChatProvider isn't available

const useChatSafely = () => {

  try {

    // Dynamic import to avoid errors if the context doesn't exist

    const { useChat } = require('@/contexts/ChatContext');

    return useChat();

  } catch (error) {

    // Return a stub object if chat isn't available

    return {

      unreadCount: 0,

      conversations: [],

      activeConversation: null,

      messages: [],

      typingUsers: new Map(),

      onlineUsers: {},

      loading: false,

      messagesLoading: false,

      error: null,

      // Stub functions that do nothing

      loadConversations: async () => {},

      createConversation: async () => { throw new Error('Chat not available'); },

      selectConversation: async () => {},

      sendMessage: async () => {},

      editMessage: async () => {},

      deleteMessage: async () => {},

      addReaction: async () => {},

      removeReaction: async () => {},

      forwardMessage: async () => {},

      markMessagesAsRead: async () => {},

      loadMoreMessages: async () => {},

      searchMessages: async () => [],

      addParticipants: async () => {},

      removeParticipant: async () => {},

      updateConversation: async () => {},

      startTyping: () => {},

      stopTyping: () => {},

      refreshConversations: async () => {},

      clearActiveConversation: () => {}

    };

  }

};



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

  | 'inspector-branch-assignment'

  | 'chat'

  | 'nbe-report';



interface DashboardProps {

  onLogout: () => void;

}



export const Dashboard = ({ onLogout }: DashboardProps) => {

  const { user } = useAuth();

  const [activeView, setActiveView] = useState<ViewType>('overview');

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [findingsFilter, setFindingsFilter] = useState<{ status?: string; riskRating?: string } | null>(null);





    // Use the safe chat hook

    const chatContext = useChatSafely();

    const unreadCount = chatContext?.unreadCount || 0;



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

        return <FindingsOverview user={user} onNavigateToFindings={(filter) => {

          setFindingsFilter(filter);

          setActiveView('findings');

        }} />;

      case 'findings':

        return <AuditFindingsManagement user={user} initialFilter={findingsFilter} />;



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

      case 'nbe-report':

        return <NBEReport user={user} />;

      case 'assignments':

        return <AssignmentManagement user={user} />;

      case 'action-plans':

        return <ActionPlansManagement user={user} />;

        case 'chat':

        // Only render Chat if we have a valid chat context

        return chatContext ? <Chat /> : (

          <div className="flex items-center justify-center h-full">

            <p className="text-gray-500">Chat service is not available</p>

          </div>

        );

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