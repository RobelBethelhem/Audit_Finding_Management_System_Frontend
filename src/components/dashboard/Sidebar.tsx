// // src/components/dashboard/Sidebar.tsx
// import {
//   BarChart3,
//   FileText,
//   Plus,
//   User,
//   Users,
//   Menu,
//   X,
//   Home,
//   Settings,
//   Database,
//   GitBranch,
//   UserCheck,
//   ClipboardList,
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
//   Building2
// } from 'lucide-react';
// import { useState, useEffect } from 'react';
// import { User as UserType } from '@/hooks/useAuth';
// import { ViewType } from './Dashboard';
// import { cn } from '@/lib/utils';

// interface SidebarProps {
//   activeView: string;
//   setActiveView: (view: string) => void;
//   isOpen: boolean;
//   onToggle: () => void;
//   onLogout: () => void;
//   user: UserType;
// }

// export const Sidebar = ({ activeView, setActiveView, isOpen, onToggle, onLogout, user }: SidebarProps) => {
//   // Add null check for user
//   if (!user) {
//     return null;
//   }

//   // Collapsed state management with localStorage persistence
//   const [isCollapsed, setIsCollapsed] = useState(() => {
//     const saved = localStorage.getItem('sidebar-collapsed');
//     return saved ? JSON.parse(saved) : false;
//   });

//   // Save collapsed state to localStorage
//   useEffect(() => {
//     localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
//   }, [isCollapsed]);

//   const toggleCollapsed = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   const isAdmin = user.role === 'Admin';
//   const isAuditor = isAdmin || (user.role.includes('Auditor') && !user.role.includes('Auditee'));
//   const isAuditee = user.role.includes('Auditee');
//   const isSupervisor = isAdmin || user.role.includes('Supervisor') || user.role.includes('Director');

//   const menuItems = [
//     {
//       id: 'overview' as ViewType,
//       label: 'Dashboard',
//       icon: Home,
//       show: true
//     },
//     {
//       id: 'findings' as ViewType,
//       label: 'Manage Findings',
//       icon: FileText,
//       show: true
//     },
//     // {
//     //   id: 'my-findings' as ViewType,
//     //   label: 'My Created Findings',
//     //   icon: User,
//     //   show: isAuditor
//     // },
//     // {
//     //   id: 'assigned' as ViewType,
//     //   label: 'Assigned to Me',
//     //   icon: Users,
//     //   show: isAuditee || isSupervisor
//     // },
//     {
//       id: 'analytics' as ViewType,
//       label: 'Analytics',
//       icon: BarChart3,
//       show: isSupervisor || isAdmin
//     },
//     // {
//     //   id: 'assignments' as ViewType,
//     //   label: 'Assignments',
//     //   icon: UserCheck,
//     //   show: isSupervisor
//     // },
//     // {
//     //   id: 'action-plans' as ViewType,
//     //   label: 'Action Plans',
//     //   icon: ClipboardList,
//     //   show: true // All authenticated users can view action plans
//     // },
//     // Admin-specific menu items
//     {
//       id: 'users' as ViewType,
//       label: 'User Management',
//       icon: Users,
//       show: isAdmin
//     },
//     {
//       id: 'reference-data' as ViewType,
//       label: 'Reference Data',
//       icon: Database,
//       show: isAdmin
//     },
//     {
//       id: 'escalation-rules' as ViewType,
//       label: 'Escalation Rules',
//       icon: GitBranch,
//       show: isAdmin
//     },
//     {
//       id: 'inspector-branch-assignment' as ViewType,
//       label: 'Inspector Branch Assignment',
//       icon: Building2,
//       show: isAdmin
//     }
//   ];

//   // Department colors removed since we're using logo instead of colored icon

//   return (
//     <>
//       {/* Overlay for mobile */}
//       {isOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
//           onClick={onToggle}
//         />
//       )}
      
//       {/* Sidebar */}
//       <div className={cn(
//         "fixed lg:static inset-y-0 left-0 z-10 bg-white shadow-lg transform transition-all duration-300 ease-in-out",
//         isCollapsed ? "w-20" : "w-64",
//         isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//       )}>
//         <div className="flex flex-col h-full">
//           {/* Header */}
//           <div className="p-4 border-b">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="flex-shrink-0">
//                   <img
//                     src="/logo.png"
//                     alt="Zemen Bank Logo"
//                     className={cn(
//                       "object-contain",
//                       isCollapsed ? "h-8 w-8" : "h-10 w-10"
//                     )}
//                   />
//                 </div>
//                 {!isCollapsed && (
//                   <div>
//                     <h2 className="font-bold text-gray-900">Audit Management</h2>
//                     <p className="text-sm text-gray-500">{user.department} Department</p>
//                   </div>
//                 )}
//               </div>

//               {/* Toggle Button */}
//               <button
//                 onClick={toggleCollapsed}
//                 className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
//                 title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//               >
//                 {isCollapsed ? (
//                   <ChevronRight className="h-4 w-4 text-gray-600" />
//                 ) : (
//                   <ChevronLeft className="h-4 w-4 text-gray-600" />
//                 )}
//               </button>
//             </div>
//           </div>
          
//           {/* User info */}
//           <div className="p-4 border-b">
//             <div className={cn(
//               "flex items-center",
//               isCollapsed ? "justify-center" : "space-x-3"
//             )}>
//               <div
//                 className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
//                 title={isCollapsed ? `${user.username} (${user.role})` : undefined}
//               >
//                 <User className="h-6 w-6 text-gray-600" />
//               </div>
//               {!isCollapsed && (
//                 <div>
//                   <p className="font-medium text-gray-900">{user.username}</p>
//                   <p className="text-xs text-gray-500">{user.role}</p>
//                 </div>
//               )}
//             </div>
//           </div>
          
//           {/* Menu items */}
//           <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
//             {menuItems
//               .filter(item => item.show)
//               .map(item => (
//                 <button
//                   key={item.id}
//                   onClick={() => setActiveView(item.id)}
//                   className={cn(
//                     "w-full flex items-center rounded-lg text-left transition-colors",
//                     isCollapsed ? "justify-center px-3 py-3" : "space-x-3 px-3 py-2",
//                     activeView === item.id
//                       ? "bg-red-600 text-white"
//                       : "text-gray-700 hover:bg-gray-100"
//                   )}
//                   title={isCollapsed ? item.label : undefined}
//                 >
//                   <item.icon className="h-5 w-5 flex-shrink-0" />
//                   {!isCollapsed && (
//                     <span className="transition-opacity duration-200">{item.label}</span>
//                   )}
//                 </button>
//               ))
//             }
//           </nav>
          
//           {/* Footer */}
//           <div className="p-4 border-t">
//             <button
//               onClick={onLogout}
//               className={cn(
//                 "w-full flex items-center rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors",
//                 isCollapsed ? "justify-center px-3 py-3" : "space-x-3 px-3 py-2"
//               )}
//               title={isCollapsed ? "Sign Out" : undefined}
//             >
//               <LogOut className="h-5 w-5 flex-shrink-0" />
//               {!isCollapsed && (
//                 <span className="transition-opacity duration-200">Sign Out</span>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };



// // src/components/dashboard/Sidebar.tsx - UPDATED with Chat
// import {
//   BarChart3,
//   FileText,
//   Plus,
//   User,
//   Users,
//   Menu,
//   X,
//   Home,
//   Settings,
//   Database,
//   GitBranch,
//   UserCheck,
//   ClipboardList,
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
//   Building2,
//   MessageCircle // NEW - Add this import
// } from 'lucide-react';
// import { useState, useEffect } from 'react';
// import { User as UserType } from '@/hooks/useAuth';
// import { ViewType } from './Dashboard';
// import { cn } from '@/lib/utils';
// import { Badge } from '@/components/ui/badge'; // NEW - Add this import

// interface SidebarProps {
//   activeView: string;
//   setActiveView: (view: string) => void;
//   isOpen: boolean;
//   onToggle: () => void;
//   onLogout: () => void;
//   user: UserType;
//   unreadCount?: number; // NEW - Add unread count prop
// }

// export const Sidebar = ({ 
//   activeView, 
//   setActiveView, 
//   isOpen, 
//   onToggle, 
//   onLogout, 
//   user,
//   unreadCount = 0 // NEW - Default to 0
// }: SidebarProps) => {
//   // Add null check for user
//   if (!user) {
//     return null;
//   }

//   // Collapsed state management with localStorage persistence
//   const [isCollapsed, setIsCollapsed] = useState(() => {
//     const saved = localStorage.getItem('sidebar-collapsed');
//     return saved ? JSON.parse(saved) : false;
//   });

//   // Save collapsed state to localStorage
//   useEffect(() => {
//     localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
//   }, [isCollapsed]);

//   const toggleCollapsed = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   const isAdmin = user.role === 'Admin';
//   const isAuditor = isAdmin || (user.role.includes('Auditor') && !user.role.includes('Auditee'));
//   const isAuditee = user.role.includes('Auditee');
//   const isSupervisor = isAdmin || user.role.includes('Supervisor') || user.role.includes('Director');

//   const menuItems = [
//     {
//       id: 'overview' as ViewType,
//       label: 'Dashboard',
//       icon: Home,
//       show: true,
//       badge: undefined
//     },
//     {
//       id: 'findings' as ViewType,
//       label: 'Manage Findings',
//       icon: FileText,
//       show: true,
//       badge: undefined
//     },
//     {
//       id: 'analytics' as ViewType,
//       label: 'Analytics',
//       icon: BarChart3,
//       show: isSupervisor || isAdmin,
//       badge: undefined
//     },
//     // NEW - Chat menu item
//     {
//       id: 'chat' as ViewType,
//       label: 'Chat',
//       icon: MessageCircle,
//       show: true, // Available to all users
//       badge: unreadCount > 0 ? unreadCount : undefined // Show unread count badge
//     },
//     // Admin-specific menu items
//     {
//       id: 'users' as ViewType,
//       label: 'User Management',
//       icon: Users,
//       show: isAdmin,
//       badge: undefined
//     },
//     {
//       id: 'reference-data' as ViewType,
//       label: 'Reference Data',
//       icon: Database,
//       show: isAdmin,
//       badge: undefined
//     },
//     {
//       id: 'escalation-rules' as ViewType,
//       label: 'Escalation Rules',
//       icon: GitBranch,
//       show: isAdmin,
//       badge: undefined
//     },
//     {
//       id: 'inspector-branch-assignment' as ViewType,
//       label: 'Inspector Branch Assignment',
//       icon: Building2,
//       show: isAdmin,
//       badge: undefined
//     }
//   ];

//   return (
//     <>
//       {/* Overlay for mobile */}
//       {isOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
//           onClick={onToggle}
//         />
//       )}
      
//       {/* Sidebar */}
//       <div className={cn(
//         "fixed lg:static inset-y-0 left-0 z-10 bg-white shadow-lg transform transition-all duration-300 ease-in-out",
//         isCollapsed ? "w-20" : "w-64",
//         isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//       )}>
//         <div className="flex flex-col h-full">
//           {/* Header */}
//           <div className="p-4 border-b">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="flex-shrink-0">
//                   <img
//                     src="/logo.png"
//                     alt="Zemen Bank Logo"
//                     className={cn(
//                       "object-contain",
//                       isCollapsed ? "h-8 w-8" : "h-10 w-10"
//                     )}
//                   />
//                 </div>
//                 {!isCollapsed && (
//                   <div>
//                     <h2 className="font-bold text-gray-900">Audit Management</h2>
//                     <p className="text-sm text-gray-500">{user.department} Department</p>
//                   </div>
//                 )}
//               </div>

//               {/* Toggle Button */}
//               <button
//                 onClick={toggleCollapsed}
//                 className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
//                 title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//               >
//                 {isCollapsed ? (
//                   <ChevronRight className="h-4 w-4 text-gray-600" />
//                 ) : (
//                   <ChevronLeft className="h-4 w-4 text-gray-600" />
//                 )}
//               </button>
//             </div>
//           </div>
          
//           {/* User info */}
//           <div className="p-4 border-b">
//             <div className={cn(
//               "flex items-center",
//               isCollapsed ? "justify-center" : "space-x-3"
//             )}>
//               <div
//                 className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
//                 title={isCollapsed ? `${user.username} (${user.role})` : undefined}
//               >
//                 <User className="h-6 w-6 text-gray-600" />
//               </div>
//               {!isCollapsed && (
//                 <div>
//                   <p className="font-medium text-gray-900">{user.username}</p>
//                   <p className="text-xs text-gray-500">{user.role}</p>
//                 </div>
//               )}
//             </div>
//           </div>
          
//           {/* Menu items */}
//           <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
//             {menuItems
//               .filter(item => item.show)
//               .map(item => (
//                 <button
//                   key={item.id}
//                   onClick={() => setActiveView(item.id)}
//                   className={cn(
//                     "w-full flex items-center rounded-lg text-left transition-colors relative", // Added 'relative'
//                     isCollapsed ? "justify-center px-3 py-3" : "px-3 py-2",
//                     activeView === item.id
//                       ? "bg-red-600 text-white"
//                       : "text-gray-700 hover:bg-gray-100"
//                   )}
//                   title={isCollapsed ? `${item.label}${item.badge ? ` (${item.badge})` : ''}` : undefined}
//                 >
//                   <div className={cn("flex items-center", !isCollapsed && "space-x-3")}>
//                     <div className="relative">
//                       <item.icon className="h-5 w-5 flex-shrink-0" />
//                       {/* Badge for collapsed state */}
//                       {isCollapsed && item.badge && (
//                         <Badge 
//                           variant="destructive" 
//                           className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
//                         >
//                           {item.badge > 99 ? '99+' : item.badge}
//                         </Badge>
//                       )}
//                     </div>
//                     {!isCollapsed && (
//                       <>
//                         <span className="transition-opacity duration-200 flex-1">{item.label}</span>
//                         {/* Badge for expanded state */}
//                         {item.badge && (
//                           <Badge 
//                             variant={activeView === item.id ? "secondary" : "destructive"} 
//                             className="ml-auto"
//                           >
//                             {item.badge > 99 ? '99+' : item.badge}
//                           </Badge>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 </button>
//               ))
//             }
//           </nav>
          
//           {/* Footer */}
//           <div className="p-4 border-t">
//             <button
//               onClick={onLogout}
//               className={cn(
//                 "w-full flex items-center rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors",
//                 isCollapsed ? "justify-center px-3 py-3" : "space-x-3 px-3 py-2"
//               )}
//               title={isCollapsed ? "Sign Out" : undefined}
//             >
//               <LogOut className="h-5 w-5 flex-shrink-0" />
//               {!isCollapsed && (
//                 <span className="transition-opacity duration-200">Sign Out</span>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };



import {
  BarChart3,
  FileText,
  Plus,
  User,
  Users,
  Menu,
  X,
  Home,
  Settings,
  Database,
  GitBranch,
  UserCheck,
  ClipboardList,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  MessageCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { User as UserType } from '@/hooks/useAuth';
import { ViewType } from './Dashboard';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
  user: UserType;
  unreadCount?: number;
}

export const Sidebar = ({ activeView, setActiveView, isOpen, onToggle, onLogout, user,  unreadCount = 0 }: SidebarProps) => {
  // Add null check for user
  if (!user) {
    return null;
  }

  // Collapsed state management with localStorage persistence
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isAdmin = user.role === 'Admin';
  const isAuditor = isAdmin || (user.role.includes('Auditor') && !user.role.includes('Auditee'));
  const isAuditee = user.role.includes('Auditee');
  const isSupervisor = isAdmin || user.role.includes('Supervisor') || user.role.includes('Director');
  const isAuditorSupervisor = isAdmin || user.role.includes('Audit_Supervisor') || user.role.includes('IT_Auditors_Supervisor') || user.role.includes('Inspection_Auditors_Supervisor') || user.role.includes('IT_Auditors_Director');
  const isCanAssignment = isAdmin ||user.role.includes('IT_Auditors_Supervisor' ) || user.role.includes('Inspection_Auditors_Supervisor') || user.role.includes('IT_Auditors_Director');
  const isCanAnalytics = isAdmin ||user.role.includes('IT_Auditors_Director');

  const menuItems = [
    {
      id: 'overview' as ViewType,
      label: 'Dashboard',
      icon: Home,
      show: true
    },
    {
      id: 'findings' as ViewType,
      label: 'Manage Findings',
      icon: FileText,
      show: true
    },
    // {
    //   id: 'my-findings' as ViewType,
    //   label: 'My Created Findings',
    //   icon: User,
    //   show: isAuditor
    // },
    // {
    //   id: 'assigned' as ViewType,
    //   label: 'Assigned to Me',
    //   icon: Users,
    //   show: isAuditee || isSupervisor
    // },
    {
      id: 'analytics' as ViewType,
      label: 'Analytics',
      icon: BarChart3,
      show: isCanAnalytics
    },
    // {
    //   id: 'assignments' as ViewType,
    //   label: 'Assignments',
    //   icon: UserCheck,
    //   show: isSupervisor
    // },
    // {
    //   id: 'action-plans' as ViewType,
    //   label: 'Action Plans',
    //   icon: ClipboardList,
    //   show: true // All authenticated users can view action plans
    // },
    // Admin-specific menu items

    {
      id: 'nbe-report' as ViewType,
      label: 'Audit Report',
      icon:FileSpreadsheet,
      show: isAuditorSupervisor || isAdmin
    },

    {
      id: 'users' as ViewType,
      label: 'User Management',
      icon: Users,
      show: isAuditorSupervisor
    },
    {
      id: 'reference-data' as ViewType,
      label: 'Reference Data',
      icon: Database,
      show: isAuditorSupervisor
    },
    {
      id: 'escalation-rules' as ViewType,
      label: 'Escalation Rules',
      icon: GitBranch,
      show: isAuditorSupervisor
    },
    {
      id: 'inspector-branch-assignment' as ViewType,
      label: 'Assignment',
      icon: Building2,
      show: isCanAssignment
    },
      {
    id: 'chat' as ViewType,
    label: 'Chat',
    icon: MessageCircle,
    show: true, // Available to all users
    badge: unreadCount > 0 ? unreadCount : undefined // Show unread count badge
  },
  ];

  // Department colors removed since we're using logo instead of colored icon

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-10 bg-white shadow-lg transform transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <img
                    src="/logo.png"
                    alt="Zemen Bank Logo"
                    className={cn(
                      "object-contain",
                      isCollapsed ? "h-8 w-8" : "h-10 w-10"
                    )}
                  />
                </div>
                {!isCollapsed && (
                  <div>
                    <h2 className="font-bold text-gray-900">Audit Management</h2>
                    <p className="text-sm text-gray-500">{user.department} Department</p>
                  </div>
                )}
              </div>

              {/* Toggle Button */}
              <button
                onClick={toggleCollapsed}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                )}
              </button>
            </div>
          </div>
          
          {/* User info */}
          <div className="p-4 border-b">
            <div className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "space-x-3"
            )}>
              <div
                className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                title={isCollapsed ? `${user.username} (${user.role})` : undefined}
              >
                <User className="h-6 w-6 text-gray-600" />
              </div>
              {!isCollapsed && (
                <div>
                  <p className="font-medium text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Menu items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems
              .filter(item => item.show)
              .map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={cn(
                    "w-full flex items-center rounded-lg text-left transition-colors",
                    isCollapsed ? "justify-center px-3 py-3" : "space-x-3 px-3 py-2",
                    activeView === item.id
                      ? "bg-red-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="transition-opacity duration-200">{item.label}</span>
                  )}
                </button>
              ))
            }
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t">
            <button
              onClick={onLogout}
              className={cn(
                "w-full flex items-center rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors",
                isCollapsed ? "justify-center px-3 py-3" : "space-x-3 px-3 py-2"
              )}
              title={isCollapsed ? "Sign Out" : undefined}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="transition-opacity duration-200">Sign Out</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
