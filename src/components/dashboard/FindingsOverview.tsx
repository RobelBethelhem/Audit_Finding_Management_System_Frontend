
// import { User } from '@/hooks/useAuth';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { 
//   AlertTriangle, 
//   CheckCircle, 
//   Clock, 
//   FileText, 
//   TrendingUp,
//   Users,
//   Shield,
//   Activity
// } from 'lucide-react';

// interface FindingsOverviewProps {
//   user: User;
// }

// export const FindingsOverview = ({ user }: FindingsOverviewProps) => {
//   // Add comprehensive null checks for user and required properties
//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   // If user data is incomplete, show a message
//   if (!user.role || !user.username) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <p className="text-gray-600">User data is incomplete. Please try logging in again.</p>
//         </div>
//       </div>
//     );
//   }

//   // Mock data - in real app this would come from API
//   const stats = {
//     totalFindings: 142,
//     pendingFindings: 28,
//     resolvedFindings: 89,
//     myFindings: user.role && user.role.includes('Auditor') ? 25 : 0,
//     assignedToMe: user.role && (user.role.includes('Auditee') || user.role.includes('Supervisor')) ? 12 : 0,
//     highRiskFindings: 15,
//     overdueFindings: 8
//   };

//   const recentActivity = [
//     {
//       id: 1,
//       type: 'finding_created',
//       title: 'New audit finding created',
//       description: 'Internal Control Testing - Payment Processing',
//       time: '2 hours ago',
//       severity: 'high'
//     },
//     {
//       id: 2,
//       type: 'rectification_submitted',
//       title: 'Rectification submitted',
//       description: 'IT Security Assessment - Access Control',
//       time: '4 hours ago',
//       severity: 'medium'
//     },
//     {
//       id: 3,
//       type: 'escalation',
//       title: 'Finding escalated',
//       description: 'Compliance Review - Documentation',
//       time: '1 day ago',
//       severity: 'high'
//     }
//   ];

//   const departmentColors = {
//     Business: 'from-blue-500 to-blue-600',
//     IT_Audit: 'from-green-500 to-green-600',
//     Inspection: 'from-purple-500 to-purple-600',
//     Admin: 'from-red-500 to-red-600'
//   };

//   return (
//     <div className="space-y-6">
//       {/* Welcome Section */}
//       <div className={`bg-gradient-to-r ${departmentColors[user.department] || 'bg-gray-600'} rounded-lg p-6 text-white`}>
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold mb-2">
//               Welcome, {user.username}
//             </h1>
//             <p className="text-blue-100 mb-4">
//               {user.department ? user.department.replace('_', ' ') : 'Unknown'} Department • {user.role ? user.role.replace(/_/g, ' ') : 'Unknown Role'}
//             </p>
//             <div className="flex items-center space-x-4 text-sm">
//               <div className="flex items-center space-x-1">
//                 <Activity className="h-4 w-4" />
//                 <span>System Status: Online</span>
//               </div>
//               <div className="flex items-center space-x-1">
//                 <Clock className="h-4 w-4" />
//                 <span>Last Login: Today, 9:30 AM</span>
//               </div>
//             </div>
//           </div>
//           <Shield className="h-16 w-16 opacity-50" />
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-blue-800">
//               Total Findings
//             </CardTitle>
//             <FileText className="h-4 w-4 text-blue-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-blue-900">{stats.totalFindings}</div>
//             <p className="text-xs text-blue-600 mt-1">
//               <TrendingUp className="h-3 w-3 inline mr-1" />
//               +12% from last month
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-yellow-800">
//               Pending Action
//             </CardTitle>
//             <Clock className="h-4 w-4 text-yellow-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-yellow-900">{stats.pendingFindings}</div>
//             <p className="text-xs text-yellow-600 mt-1">
//               {stats.overdueFindings} overdue
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-green-800">
//               Resolved
//             </CardTitle>
//             <CheckCircle className="h-4 w-4 text-green-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-900">{stats.resolvedFindings}</div>
//             <p className="text-xs text-green-600 mt-1">
//               62.7% resolution rate
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-red-800">
//               High Risk
//             </CardTitle>
//             <AlertTriangle className="h-4 w-4 text-red-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-red-900">{stats.highRiskFindings}</div>
//             <p className="text-xs text-red-600 mt-1">
//               Requires immediate attention
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Role-specific cards */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Activity */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center space-x-2">
//               <Activity className="h-5 w-5" />
//               <span>Recent Activity</span>
//             </CardTitle>
//             <CardDescription>
//               Latest updates on audit findings
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {recentActivity.map((activity) => (
//                 <div key={activity.id} className="flex items-start space-x-3">
//                   <div className={`p-2 rounded-full ${
//                     activity.severity === 'high' ? 'bg-red-100' : 
//                     activity.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
//                   }`}>
//                     <div className={`h-2 w-2 rounded-full ${
//                       activity.severity === 'high' ? 'bg-red-500' : 
//                       activity.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
//                     }`} />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium text-gray-900">{activity.title}</p>
//                     <p className="text-sm text-gray-600 truncate">{activity.description}</p>
//                     <p className="text-xs text-gray-500">{activity.time}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Quick Actions */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center space-x-2">
//               <Users className="h-5 w-5" />
//               <span>Quick Actions</span>
//             </CardTitle>
//             <CardDescription>
//               Common tasks for your role
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               {user.role && user.role.includes('Auditor') && !user.role.includes('Auditee') && (
//                 <>
//                   <button className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
//                     <div className="font-medium text-blue-900">Create New Finding</div>
//                     <div className="text-sm text-blue-600">Start a new audit finding</div>
//                   </button>
//                   <button className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
//                     <div className="font-medium text-green-900">Review Rectifications</div>
//                     <div className="text-sm text-green-600">Approve pending rectifications</div>
//                   </button>
//                 </>
//               )}
//               {user.role && (user.role.includes('Auditee') || user.role.includes('Supervisor')) && (
//                 <>
//                   <button className="w-full text-left p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors">
//                     <div className="font-medium text-yellow-900">Submit Rectification</div>
//                     <div className="text-sm text-yellow-600">Respond to assigned findings</div>
//                   </button>
//                   <button className="w-full text-left p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
//                     <div className="font-medium text-purple-900">View Assignments</div>
//                     <div className="text-sm text-purple-600">Check findings assigned to you</div>
//                   </button>
//                 </>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };



























// import React, { useState, useEffect } from 'react';
// import { User } from '@/hooks/useAuth';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { 
//   AlertTriangle, 
//   CheckCircle, 
//   Clock, 
//   FileText, 
//   TrendingUp,
//   TrendingDown,
//   Users,
//   Shield,
//   Activity,
//   Loader2,
//   ArrowUp,
//   ArrowDown,
//   ChevronRight,
//   Calendar,
//   BarChart3
// } from 'lucide-react';
// import analyticsService, { DashboardData } from '@/services/analyticsService';
// import { motion, AnimatePresence } from 'framer-motion';

// interface FindingsOverviewProps {
//   user: User;
// }

// // Animation variants
// const cardVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: (i: number) => ({
//     opacity: 1,
//     y: 0,
//     transition: {
//       delay: i * 0.1,
//       duration: 0.5,
//       ease: "easeOut"
//     }
//   }),
//   hover: {
//     scale: 1.02,
//     transition: { duration: 0.2 }
//   }
// };

// const counterAnimation = {
//   hidden: { opacity: 0, scale: 0.5 },
//   visible: {
//     opacity: 1,
//     scale: 1,
//     transition: {
//       duration: 0.5,
//       ease: "easeOut"
//     }
//   }
// };

// export const FindingsOverview = ({ user }: FindingsOverviewProps) => {
//   const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [animatedStats, setAnimatedStats] = useState({
//     totalFindings: 0,
//     pendingFindings: 0,
//     resolvedFindings: 0,
//     highRiskFindings: 0,
//     overdueFindings: 0,
//     myFindings: 0,
//     assignedToMe: 0
//   });

//   // Fetch dashboard data
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const params: any = {};
        
//         // Add user-specific filters if needed
//         if (user.department) {
//           params.department = user.department;
//         }

//         const dashboard = await analyticsService.getDashboardData(params);
//         setDashboardData(dashboard);

//         // Calculate real metrics from dashboard data
//         if (dashboard) {
//           const statusData = dashboard.status_distribution || [];
//           const actionPlanData = dashboard.action_plan_metrics || [];
//           const workloadData = dashboard.workload_distribution || [];
          
//           // Calculate totals
//           const total = statusData.reduce((sum, item) => sum + item.count, 0);
//           const resolved = statusData.find(item => item.status === 'Resolved')?.count || 0;
//           const pending = statusData.filter(item => 
//             item.status === 'Pending' || 
//             item.status === 'In_Progress' || 
//             item.status === 'Under_Rectification'
//           ).reduce((sum, item) => sum + item.count, 0);
          
//           // Calculate overdue from action plan data
//           const overdue = actionPlanData.find(item => item.status === 'Overdue')?.count || 0;
          
//           // Calculate high risk (using pending with high priority assumption)
//           const highRisk = Math.floor(pending * 0.25); // Assuming 25% are high risk
          
//           // Find user-specific metrics
//           const userWorkload = workloadData.find(item => 
//             item.username === user.username
//           );
//           const assignedToUser = userWorkload?.assigned_count || 0;
          
//           // Calculate user's created findings (if auditor)
//           const userFindings = user.role?.includes('Auditor') 
//             ? Math.floor(total * 0.15) // Assuming auditor created 15% of findings
//             : 0;

//           // Animate the numbers
//           animateValue('totalFindings', total);
//           animateValue('resolvedFindings', resolved);
//           animateValue('pendingFindings', pending);
//           animateValue('highRiskFindings', highRisk);
//           animateValue('overdueFindings', overdue);
//           animateValue('myFindings', userFindings);
//           animateValue('assignedToMe', assignedToUser);
//         }
//       } catch (err) {
//         console.error('Error fetching dashboard data:', err);
//         setError('Failed to load dashboard data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [user]);

//   // Animate number counting
//   const animateValue = (key: string, endValue: number) => {
//     const startValue = 0;
//     const duration = 2000;
//     const startTime = Date.now();

//     const updateValue = () => {
//       const currentTime = Date.now();
//       const elapsed = currentTime - startTime;
      
//       if (elapsed < duration) {
//         const progress = elapsed / duration;
//         const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
//         setAnimatedStats(prev => ({ ...prev, [key]: currentValue }));
//         requestAnimationFrame(updateValue);
//       } else {
//         setAnimatedStats(prev => ({ ...prev, [key]: endValue }));
//       }
//     };

//     requestAnimationFrame(updateValue);
//   };

//   // Recent activity from dashboard data
//   const getRecentActivity = () => {
//     if (!dashboardData) return [];
    
//     // Generate activity based on actual data
//     const activities = [];
    
//     if (dashboardData.status_distribution.length > 0) {
//       const recentStatus = dashboardData.status_distribution[0];
//       activities.push({
//         id: 1,
//         type: 'finding_created',
//         title: 'New audit finding created',
//         description: `${recentStatus.count} findings in ${recentStatus.status} status`,
//         time: '2 hours ago',
//         severity: 'high'
//       });
//     }
    
//     if (dashboardData.action_plan_metrics.length > 0) {
//       activities.push({
//         id: 2,
//         type: 'rectification_submitted',
//         title: 'Rectification submitted',
//         description: 'Action plan status updated',
//         time: '4 hours ago',
//         severity: 'medium'
//       });
//     }
    
//     if (dashboardData.escalation_metrics) {
//       activities.push({
//         id: 3,
//         type: 'escalation',
//         title: 'Finding escalated',
//         description: `${dashboardData.escalation_metrics.total_escalations} escalations this month`,
//         time: '1 day ago',
//         severity: 'high'
//       });
//     }
    
//     return activities;
//   };

//   // Calculate percentage changes
//   const calculateTrend = (current: number, previous: number = 0) => {
//     if (previous === 0) return { value: 0, isUp: true };
//     const change = ((current - previous) / previous) * 100;
//     return { value: Math.abs(change).toFixed(1), isUp: change > 0 };
//   };

//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   if (!user.role || !user.username) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <p className="text-gray-600">User data is incomplete. Please try logging in again.</p>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//         >
//           <Loader2 className="h-12 w-12 text-red-600" />
//         </motion.div>
//         <span className="ml-3 text-gray-700 font-medium">Loading dashboard data...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
//           <p className="text-gray-700">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   const recentActivity = getRecentActivity();
//   const trends = {
//     total: calculateTrend(animatedStats.totalFindings, animatedStats.totalFindings - 10),
//     resolved: calculateTrend(animatedStats.resolvedFindings, animatedStats.resolvedFindings - 5),
//     pending: calculateTrend(animatedStats.pendingFindings, animatedStats.pendingFindings + 3),
//     highRisk: calculateTrend(animatedStats.highRiskFindings, animatedStats.highRiskFindings + 2)
//   };

//   return (
//     <div className="space-y-6">
//       {/* Animated Welcome Section */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="relative overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black rounded-2xl p-8 text-white shadow-2xl"
//       >
//         {/* Animated Background Pattern */}
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] animate-pulse"></div>
//         </div>
        
//         <div className="relative flex items-center justify-between">
//           <div>
//             <motion.h1 
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2, duration: 0.5 }}
//               className="text-3xl font-bold mb-2"
//             >
//               Welcome back, {user.username}
//             </motion.h1>
//             <motion.p 
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3, duration: 0.5 }}
//               className="text-gray-300 mb-4"
//             >
//               {user.department ? user.department.replace('_', ' ') : 'Unknown'} Department • {user.role ? user.role.replace(/_/g, ' ') : 'Unknown Role'}
//             </motion.p>
//             <motion.div 
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.4, duration: 0.5 }}
//               className="flex items-center space-x-6 text-sm"
//             >
//               <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
//                 <Activity className="h-4 w-4 text-red-400" />
//                 <span>System Online</span>
//               </div>
//               <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
//                 <Clock className="h-4 w-4 text-red-400" />
//                 <span>Last Login: Today</span>
//               </div>
//             </motion.div>
//           </div>
//           <motion.div
//             animate={{ 
//               rotate: [0, 10, -10, 10, 0],
//               scale: [1, 1.1, 1]
//             }}
//             transition={{ 
//               duration: 5,
//               repeat: Infinity,
//               repeatDelay: 5
//             }}
//           >
//             <Shield className="h-20 w-20 text-red-500 opacity-50" />
//           </motion.div>
//         </div>
//       </motion.div>

//       {/* Animated Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <AnimatePresence>
//           {/* Total Findings Card */}
//           <motion.div
//             custom={0}
//             initial="hidden"
//             animate="visible"
//             whileHover="hover"
//             variants={cardVariants}
//           >
//             <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
//               <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16" />
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-semibold text-gray-700">
//                   Total Findings
//                 </CardTitle>
//                 <div className="p-2 bg-red-100 rounded-lg">
//                   <FileText className="h-5 w-5 text-red-600" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <motion.div 
//                   initial="hidden"
//                   animate="visible"
//                   variants={counterAnimation}
//                   className="text-3xl font-bold text-black"
//                 >
//                   {animatedStats.totalFindings}
//                 </motion.div>
//                 <div className="flex items-center mt-2">
//                   {trends.total.isUp ? (
//                     <ArrowUp className="h-4 w-4 text-red-500 mr-1" />
//                   ) : (
//                     <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
//                   )}
//                   <span className="text-xs text-gray-600">
//                     {trends.total.value}% from last month
//                   </span>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* Pending Action Card */}
//           <motion.div
//             custom={1}
//             initial="hidden"
//             animate="visible"
//             whileHover="hover"
//             variants={cardVariants}
//           >
//             <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
//               <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -mr-16 -mt-16" />
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-semibold text-gray-700">
//                   Pending Action
//                 </CardTitle>
//                 <div className="p-2 bg-yellow-100 rounded-lg">
//                   <Clock className="h-5 w-5 text-yellow-600" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <motion.div 
//                   initial="hidden"
//                   animate="visible"
//                   variants={counterAnimation}
//                   className="text-3xl font-bold text-black"
//                 >
//                   {animatedStats.pendingFindings}
//                 </motion.div>
//                 <div className="flex items-center mt-2">
//                   <span className="text-xs text-gray-600">
//                     {animatedStats.overdueFindings} overdue items
//                   </span>
//                 </div>
//                 {animatedStats.overdueFindings > 0 && (
//                   <motion.div 
//                     initial={{ width: 0 }}
//                     animate={{ width: '100%' }}
//                     transition={{ delay: 0.5, duration: 0.5 }}
//                     className="h-1 bg-gray-200 rounded-full mt-2 overflow-hidden"
//                   >
//                     <motion.div 
//                       initial={{ width: 0 }}
//                       animate={{ width: `${(animatedStats.overdueFindings / animatedStats.pendingFindings) * 100}%` }}
//                       transition={{ delay: 0.7, duration: 0.5 }}
//                       className="h-full bg-yellow-500 rounded-full"
//                     />
//                   </motion.div>
//                 )}
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* Resolved Card */}
//           <motion.div
//             custom={2}
//             initial="hidden"
//             animate="visible"
//             whileHover="hover"
//             variants={cardVariants}
//           >
//             <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
//               <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16" />
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-semibold text-gray-700">
//                   Resolved
//                 </CardTitle>
//                 <div className="p-2 bg-green-100 rounded-lg">
//                   <CheckCircle className="h-5 w-5 text-green-600" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <motion.div 
//                   initial="hidden"
//                   animate="visible"
//                   variants={counterAnimation}
//                   className="text-3xl font-bold text-black"
//                 >
//                   {animatedStats.resolvedFindings}
//                 </motion.div>
//                 <div className="flex items-center mt-2">
//                   <span className="text-xs text-gray-600">
//                     {animatedStats.totalFindings > 0 
//                       ? `${((animatedStats.resolvedFindings / animatedStats.totalFindings) * 100).toFixed(1)}% resolution rate`
//                       : '0% resolution rate'}
//                   </span>
//                 </div>
//                 <motion.div 
//                   initial={{ width: 0 }}
//                   animate={{ width: '100%' }}
//                   transition={{ delay: 0.5, duration: 0.5 }}
//                   className="h-1 bg-gray-200 rounded-full mt-2 overflow-hidden"
//                 >
//                   <motion.div 
//                     initial={{ width: 0 }}
//                     animate={{ 
//                       width: animatedStats.totalFindings > 0 
//                         ? `${(animatedStats.resolvedFindings / animatedStats.totalFindings) * 100}%`
//                         : '0%'
//                     }}
//                     transition={{ delay: 0.7, duration: 0.5 }}
//                     className="h-full bg-green-500 rounded-full"
//                   />
//                 </motion.div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* High Risk Card */}
//           <motion.div
//             custom={3}
//             initial="hidden"
//             animate="visible"
//             whileHover="hover"
//             variants={cardVariants}
//           >
//             <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-red-50 to-white">
//               <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full -mr-16 -mt-16" />
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-semibold text-gray-700">
//                   High Risk
//                 </CardTitle>
//                 <div className="p-2 bg-red-100 rounded-lg">
//                   <AlertTriangle className="h-5 w-5 text-red-600" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <motion.div 
//                   initial="hidden"
//                   animate="visible"
//                   variants={counterAnimation}
//                   className="text-3xl font-bold text-red-600"
//                 >
//                   {animatedStats.highRiskFindings}
//                 </motion.div>
//                 <motion.p 
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.5 }}
//                   className="text-xs text-red-600 font-medium mt-2"
//                 >
//                   Requires immediate attention
//                 </motion.p>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </AnimatePresence>
//       </div>

//       {/* Role-specific cards */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Activity with Animations */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.4, duration: 0.5 }}
//         >
//           <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
//             <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
//               <CardTitle className="flex items-center space-x-2">
//                 <Activity className="h-5 w-5 text-red-600" />
//                 <span className="text-black">Recent Activity</span>
//               </CardTitle>
//               <CardDescription className="text-gray-600">
//                 Latest updates on audit findings
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="pt-6">
//               <div className="space-y-4">
//                 <AnimatePresence>
//                   {recentActivity.map((activity, index) => (
//                     <motion.div
//                       key={activity.id}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       exit={{ opacity: 0, x: 20 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//                     >
//                       <motion.div 
//                         whileHover={{ scale: 1.1 }}
//                         className={`p-2 rounded-full ${
//                           activity.severity === 'high' ? 'bg-red-100' : 
//                           activity.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
//                         }`}
//                       >
//                         <motion.div 
//                           animate={{ scale: [1, 1.2, 1] }}
//                           transition={{ duration: 2, repeat: Infinity }}
//                           className={`h-2 w-2 rounded-full ${
//                             activity.severity === 'high' ? 'bg-red-500' : 
//                             activity.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
//                           }`} 
//                         />
//                       </motion.div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
//                         <p className="text-sm text-gray-600 truncate">{activity.description}</p>
//                         <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
//                       </div>
//                       <ChevronRight className="h-4 w-4 text-gray-400 mt-1" />
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Quick Actions with Animations */}
//         {/* <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.5, duration: 0.5 }}
//         >
//           <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
//             <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
//               <CardTitle className="flex items-center space-x-2">
//                 <Users className="h-5 w-5 text-red-600" />
//                 <span className="text-black">Quick Actions</span>
//               </CardTitle>
//               <CardDescription className="text-gray-600">
//                 Common tasks for your role
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="pt-6">
//               <div className="space-y-3">
//                 <AnimatePresence>
//                   {user.role && user.role.includes('Auditor') && !user.role.includes('Auditee') && (
//                     <>
//                       <motion.button
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         whileHover={{ scale: 1.02, x: 5 }}
//                         whileTap={{ scale: 0.98 }}
//                         transition={{ duration: 0.2 }}
//                         className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
//                       >
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <div className="font-semibold">Create New Finding</div>
//                             <div className="text-sm text-red-100 mt-1">Start a new audit finding</div>
//                           </div>
//                           <div className="p-2 bg-white/20 rounded-lg">
//                             <FileText className="h-5 w-5" />
//                           </div>
//                         </div>
//                       </motion.button>
//                       <motion.button
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.1 }}
//                         whileHover={{ scale: 1.02, x: 5 }}
//                         whileTap={{ scale: 0.98 }}
//                         className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-md hover:shadow-lg transition-all duration-300"
//                       >
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <div className="font-semibold">Review Rectifications</div>
//                             <div className="text-sm text-gray-300 mt-1">Approve pending rectifications</div>
//                           </div>
//                           <div className="p-2 bg-white/20 rounded-lg">
//                             <CheckCircle className="h-5 w-5" />
//                           </div>
//                         </div>
//                       </motion.button>
//                     </>
//                   )}
//                   {user.role && (user.role.includes('Auditee') || user.role.includes('Supervisor')) && (
//                     <>
//                       <motion.button
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         whileHover={{ scale: 1.02, x: 5 }}
//                         whileTap={{ scale: 0.98 }}
//                         className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
//                       >
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <div className="font-semibold">Submit Rectification</div>
//                             <div className="text-sm text-red-100 mt-1">Respond to assigned findings</div>
//                           </div>
//                           <div className="p-2 bg-white/20 rounded-lg">
//                             <Clock className="h-5 w-5" />
//                           </div>
//                         </div>
//                       </motion.button>
//                       <motion.button
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.1 }}
//                         whileHover={{ scale: 1.02, x: 5 }}
//                         whileTap={{ scale: 0.98 }}
//                         className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-md hover:shadow-lg transition-all duration-300"
//                       >
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <div className="font-semibold">View Assignments</div>
//                             <div className="text-sm text-gray-300 mt-1">Check findings assigned to you</div>
//                           </div>
//                           <div className="p-2 bg-white/20 rounded-lg">
//                             <Users className="h-5 w-5" />
//                           </div>
//                         </div>
//                       </motion.button>
//                     </>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div> */}
//       </div>

//       {/* Performance Metrics Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.6, duration: 0.5 }}
//       >
//         <Card className="border-0 shadow-lg bg-gradient-to-br from-white via-gray-50 to-white">
//           <CardHeader>
//             <CardTitle className="flex items-center space-x-2">
//               <BarChart3 className="h-5 w-5 text-red-600" />
//               <span className="text-black">Performance Overview</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <motion.div 
//                 whileHover={{ scale: 1.05 }}
//                 className="text-center p-4 bg-gradient-to-br from-red-50 to-white rounded-xl"
//               >
//                 <Calendar className="h-6 w-6 text-red-500 mx-auto mb-2" />
//                 <div className="text-2xl font-bold text-black">
//                   {animatedStats.myFindings}
//                 </div>
//                 <div className="text-xs text-gray-600">My Findings</div>
//               </motion.div>
//               <motion.div 
//                 whileHover={{ scale: 1.05 }}
//                 className="text-center p-4 bg-gradient-to-br from-gray-100 to-white rounded-xl"
//               >
//                 <Users className="h-6 w-6 text-gray-600 mx-auto mb-2" />
//                 <div className="text-2xl font-bold text-black">
//                   {animatedStats.assignedToMe}
//                 </div>
//                 <div className="text-xs text-gray-600">Assigned to Me</div>
//               </motion.div>
//               <motion.div 
//                 whileHover={{ scale: 1.05 }}
//                 className="text-center p-4 bg-gradient-to-br from-green-50 to-white rounded-xl"
//               >
//                 <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
//                 <div className="text-2xl font-bold text-black">
//                   {animatedStats.totalFindings > 0 
//                     ? `${((animatedStats.resolvedFindings / animatedStats.totalFindings) * 100).toFixed(0)}%`
//                     : '0%'}
//                 </div>
//                 <div className="text-xs text-gray-600">Resolution Rate</div>
//               </motion.div>
//               <motion.div 
//                 whileHover={{ scale: 1.05 }}
//                 className="text-center p-4 bg-gradient-to-br from-yellow-50 to-white rounded-xl"
//               >
//                 <AlertTriangle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
//                 <div className="text-2xl font-bold text-black">
//                   {animatedStats.overdueFindings}
//                 </div>
//                 <div className="text-xs text-gray-600">Overdue Items</div>
//               </motion.div>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// };


























// import React, { useState, useEffect, useCallback } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { 
//   AlertTriangle, 
//   CheckCircle, 
//   Clock, 
//   FileText, 
//   TrendingUp,
//   TrendingDown,
//   Users,
//   Shield,
//   Activity,
//   Loader2,
//   ArrowUp,
//   ArrowDown,
//   ChevronRight,
//   Calendar,
//   BarChart3,
//   RefreshCw,
//   Building2,
//   Tag,
//   AlertCircle,
//   ChevronLeft
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// interface FindingsOverviewProps {
//   user: any;
// }

// interface AuditFinding {
//   id: string;
//   title: string;
//   status: string;
//   risk_rating_id: string;
//   category_id: string;
//   amount: number;
//   due_date: string;
//   createdAt: string;
//   RiskRating?: {
//     risk_rating_name: string;
//   };
//   Category?: {
//     category_name: string;
//   };
//   branchAssignment?: {
//     assignedBranch?: {
//       branch_name: string;
//       branch_code: string;
//     };
//   };
// }

// // Animation variants
// const cardVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: (i: number) => ({
//     opacity: 1,
//     y: 0,
//     transition: {
//       delay: i * 0.1,
//       duration: 0.5,
//       ease: "easeOut"
//     }
//   }),
//   hover: {
//     scale: 1.02,
//     transition: { duration: 0.2 }
//   }
// };

// const counterAnimation = {
//   hidden: { opacity: 0, scale: 0.5 },
//   visible: {
//     opacity: 1,
//     scale: 1,
//     transition: {
//       duration: 0.5,
//       ease: "easeOut"
//     }
//   }
// };

// const refreshAnimation = {
//   rotate: 360,
//   transition: {
//     duration: 1,
//     ease: "linear"
//   }
// };

// export const FindingsOverview = ({ user }: FindingsOverviewProps) => {
//   const [findings, setFindings] = useState<AuditFinding[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [autoRefreshing, setAutoRefreshing] = useState(false);
//   const [initialRefreshDone, setInitialRefreshDone] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [lastRefresh, setLastRefresh] = useState<Date>(new Date());




//   const [categoryPage, setCategoryPage] = useState(1);
// const [branchPage, setBranchPage] = useState(1);
// const ITEMS_PER_PAGE = 4;






  
//   const [stats, setStats] = useState({
//     totalFindings: 0,
//     pendingFindings: 0,
//     inProgressFindings: 0,
//     resolvedFindings: 0,
//     underRectification: 0,
//     highRiskFindings: 0,
//     mediumRiskFindings: 0,
//     lowRiskFindings: 0,
//     overdueFindings: 0,
//     totalAmount: 0
//   });

//   const [animatedStats, setAnimatedStats] = useState({
//     totalFindings: 0,
//     pendingFindings: 0,
//     resolvedFindings: 0,
//     highRiskFindings: 0,
//     overdueFindings: 0,
//     totalAmount: 0
//   });

//   const [categoryStats, setCategoryStats] = useState<{ name: string; count: number }[]>([]);
//   const [branchStats, setBranchStats] = useState<{ name: string; count: number }[]>([]);
//   const [statusDistribution, setStatusDistribution] = useState<{ status: string; count: number; color: string }[]>([]);








//   // Add these calculations for categories
// const totalCategoryPages = Math.ceil(categoryStats.length / ITEMS_PER_PAGE);
// const paginatedCategories = categoryStats.slice(
//   (categoryPage - 1) * ITEMS_PER_PAGE,
//   categoryPage * ITEMS_PER_PAGE
// );

// // Add these calculations for branches
// const totalBranchPages = Math.ceil(branchStats.length / ITEMS_PER_PAGE);
// const paginatedBranches = branchStats.slice(
//   (branchPage - 1) * ITEMS_PER_PAGE,
//   branchPage * ITEMS_PER_PAGE
// );

//   // Fetch findings data
//   const fetchFindings = useCallback(async () => {
//     try {
//       setError(null);
//       const response = await fetch('https://aps2.zemenbank.com/ZAMS/api/audit-findings?page=1&limit=100000', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch findings');
//       }

//       const data = await response.json();
//       const findingsData = data.data || [];
//       setFindings(findingsData);

//       // Calculate statistics
//       calculateStatistics(findingsData);
//       setLastRefresh(new Date());
//     } catch (err) {
//       console.error('Error fetching findings:', err);
//       setError('Failed to load findings data. Please try again.');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   // Calculate statistics from findings
//   const calculateStatistics = (findingsData: AuditFinding[]) => {
//     const now = new Date();
    
//     // Basic counts
//     const total = findingsData.length;
//     const pending = findingsData.filter(f => f.status === 'Pending').length;
//     const inProgress = findingsData.filter(f => f.status === 'In_Progress').length;
//     const resolved = findingsData.filter(f => f.status === 'Resolved').length;
//     const underRectification = findingsData.filter(f => f.status === 'Under_Rectification').length;
    
//     // Risk levels
//     const highRisk = findingsData.filter(f => 
//       f.RiskRating?.risk_rating_name === 'High' || 
//       f.RiskRating?.risk_rating_name === 'Critical'
//     ).length;
//     const mediumRisk = findingsData.filter(f => 
//       f.RiskRating?.risk_rating_name === 'Medium'
//     ).length;
//     const lowRisk = findingsData.filter(f => 
//       f.RiskRating?.risk_rating_name === 'Low'
//     ).length;
    
//     // Overdue findings
//     const overdue = findingsData.filter(f => {
//       if (f.due_date && f.status !== 'Resolved') {
//         return new Date(f.due_date) < now;
//       }
//       return false;
//     }).length;
    
//     // Total amount
//     const totalAmount = findingsData.reduce((sum, f) => sum + (f.amount || 0), 0);
    
//     // Category statistics
//     const categoryMap = new Map<string, number>();
//     findingsData.forEach(f => {
//       if (f.Category?.category_name) {
//         categoryMap.set(
//           f.Category.category_name, 
//           (categoryMap.get(f.Category.category_name) || 0) + 1
//         );
//       }
//     });
//     const categoryData = Array.from(categoryMap.entries())
//       .map(([name, count]) => ({ name, count }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5); // Top 5 categories
    
//     // Branch statistics
//     const branchMap = new Map<string, number>();
//     findingsData.forEach(f => {
//       if (f.branchAssignment?.assignedBranch?.branch_name) {
//         branchMap.set(
//           f.branchAssignment.assignedBranch.branch_name,
//           (branchMap.get(f.branchAssignment.assignedBranch.branch_name) || 0) + 1
//         );
//       }
//     });
//     const branchData = Array.from(branchMap.entries())
//       .map(([name, count]) => ({ name, count }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5); // Top 5 branches
    
//     // Status distribution for chart
//     const statusDist = [
//       { status: 'Pending', count: pending, color: '#EAB308' },
//       { status: 'In Progress', count: inProgress, color: '#3B82F6' },
//       { status: 'Under Rectification', count: underRectification, color: '#8B5CF6' },
//       { status: 'Resolved', count: resolved, color: '#10B981' }
//     ].filter(s => s.count > 0);
    
//     // Update state
//     setStats({
//       totalFindings: total,
//       pendingFindings: pending,
//       inProgressFindings: inProgress,
//       resolvedFindings: resolved,
//       underRectification: underRectification,
//       highRiskFindings: highRisk,
//       mediumRiskFindings: mediumRisk,
//       lowRiskFindings: lowRisk,
//       overdueFindings: overdue,
//       totalAmount: totalAmount
//     });
    
//     setCategoryStats(categoryData);
//     setBranchStats(branchData);
//     setStatusDistribution(statusDist);
    
//     // Animate stats
//     animateStats({
//       totalFindings: total,
//       pendingFindings: pending,
//       resolvedFindings: resolved,
//       highRiskFindings: highRisk,
//       overdueFindings: overdue,
//       totalAmount: totalAmount
//     });
//   };

//   // Animate number counting
//   const animateStats = (targetStats: any) => {
//     const duration = 2000;
//     const startTime = Date.now();
    
//     const updateValues = () => {
//       const currentTime = Date.now();
//       const elapsed = currentTime - startTime;
      
//       if (elapsed < duration) {
//         const progress = elapsed / duration;
        
//         setAnimatedStats({
//           totalFindings: Math.floor(targetStats.totalFindings * progress),
//           pendingFindings: Math.floor(targetStats.pendingFindings * progress),
//           resolvedFindings: Math.floor(targetStats.resolvedFindings * progress),
//           highRiskFindings: Math.floor(targetStats.highRiskFindings * progress),
//           overdueFindings: Math.floor(targetStats.overdueFindings * progress),
//           totalAmount: Math.floor(targetStats.totalAmount * progress)
//         });
        
//         requestAnimationFrame(updateValues);
//       } else {
//         setAnimatedStats(targetStats);
//       }
//     };
    
//     requestAnimationFrame(updateValues);
//   };

//   // Handle refresh
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchFindings();
    
//     // Trigger page refresh after data is loaded
//     setTimeout(() => {
//       window.location.reload();
//     }, 1000);
//   };

//   // Fetch data on mount and perform single auto-refresh
//   useEffect(() => {
//     const initialLoad = async () => {
//       // First load - fetch data
//       await fetchFindings();
      
//       // Check if we've already done the auto-refresh
//       const hasAutoRefreshed = sessionStorage.getItem('dashboardAutoRefreshed');
      
//       // Only do auto-refresh if we haven't done it yet
//       if (!hasAutoRefreshed) {
//         setTimeout(() => {
//           setAutoRefreshing(true);
//           setRefreshing(true);
//           console.log('Performing one-time automatic refresh...');
          
//           fetchFindings().then(() => {
//             // Mark that we've done the auto-refresh
//             sessionStorage.setItem('dashboardAutoRefreshed', 'true');
            
//             // Reload the page to ensure fresh state
//             setTimeout(() => {
//               console.log('Reloading page with fresh data...');
//               window.location.reload();
//             }, 1000);
//           });
//         }, 1500); // Wait 1.5 seconds after initial load then refresh
//       } else {
//         // Clear the flag after some time (e.g., 30 minutes) to allow future auto-refresh
//         setTimeout(() => {
//           sessionStorage.removeItem('dashboardAutoRefreshed');
//         }, 30 * 60 * 1000); // 30 minutes
//       }
//     };
    
//     initialLoad();
//   }, []); // Empty dependency array to run only once

//   // Format currency
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'ETB',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   // Calculate percentage
//   const calculatePercentage = (value: number, total: number) => {
//     if (total === 0) return 0;
//     return ((value / total) * 100).toFixed(1);
//   };

//   if (loading && !autoRefreshing) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//         >
//           <Loader2 className="h-12 w-12 text-red-600" />
//         </motion.div>
//         <span className="ml-3 text-gray-700 font-medium">Loading dashboard data...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
//           <p className="text-gray-700">{error}</p>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={handleRefresh}
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//           >
//             Try Again
//           </motion.button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 relative">
//       {/* Auto-refresh overlay */}
//       <AnimatePresence>
//         {autoRefreshing && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
//           >
//             <motion.div
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center space-y-4"
//             >
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//               >
//                 <RefreshCw className="h-12 w-12 text-red-600" />
//               </motion.div>
//               <div className="text-center">
//                 <h3 className="text-lg font-semibold text-gray-900">Auto-Refreshing Dashboard</h3>
//                 <p className="text-sm text-gray-600 mt-1">Loading latest audit findings...</p>
//               </div>
//               <motion.div
//                 initial={{ width: 0 }}
//                 animate={{ width: '200px' }}
//                 transition={{ duration: 1.5, ease: "easeInOut" }}
//                 className="h-1 bg-red-600 rounded-full"
//               />
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Animated Welcome Section with Refresh Button */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="relative overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black rounded-2xl p-8 text-white shadow-2xl"
//       >
//         {/* Auto-refresh notification */}
//         <AnimatePresence>
//           {autoRefreshing && (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full flex items-center space-x-2"
//             >
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//               >
//                 <RefreshCw className="h-4 w-4" />
//               </motion.div>
//               <span className="text-sm font-medium">Refreshing...</span>
//             </motion.div>
//           )}
//         </AnimatePresence>
        
//         {/* Animated Background Pattern */}
//         <div className="absolute inset-0 opacity-10">
//           <motion.div 
//             animate={{ 
//               backgroundPosition: ['0% 0%', '100% 100%'],
//             }}
//             transition={{ 
//               duration: 20,
//               repeat: Infinity,
//               repeatType: 'reverse'
//             }}
//             className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"
//           />
//         </div>
        
//         <div className="relative flex items-center justify-between">
//           <div>
//             <motion.h1 
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2, duration: 0.5 }}
//               className="text-3xl font-bold mb-2"
//             >
//               Audit Findings Dashboard
//             </motion.h1>
//             <motion.p 
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3, duration: 0.5 }}
//               className="text-gray-300 mb-4"
//             >
//               Welcome back, {user?.username || 'User'} • {user?.department?.replace('_', ' ') || 'Department'} • {user?.role?.replace(/_/g, ' ') || 'Role'}
//             </motion.p>
//             <motion.div 
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.4, duration: 0.5 }}
//               className="flex items-center space-x-6 text-sm"
//             >
//               <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
//                 <Activity className="h-4 w-4 text-red-400" />
//                 <span>{stats.totalFindings} Total Findings</span>
//               </div>
//               <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
//                 <Clock className="h-4 w-4 text-red-400" />
//                 <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
//               </div>
//             </motion.div>
//           </div>
//           <div className="flex items-center space-x-4">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               animate={refreshing ? refreshAnimation : {}}
//               onClick={handleRefresh}
//               disabled={refreshing}
//               className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-300"
//             >
//               <RefreshCw className={`h-5 w-5 ${refreshing ? 'text-red-400' : 'text-white'}`} />
//             </motion.button>
//             <motion.div
//               animate={{ 
//                 rotate: [0, 10, -10, 10, 0],
//                 scale: [1, 1.1, 1]
//               }}
//               transition={{ 
//                 duration: 5,
//                 repeat: Infinity,
//                 repeatDelay: 5
//               }}
//             >
//               <Shield className="h-20 w-20 text-red-500 opacity-50" />
//             </motion.div>
//           </div>
//         </div>
//       </motion.div>

//       {/* Main Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <AnimatePresence>
//           {/* Total Findings Card */}
//           <motion.div
//             custom={0}
//             initial="hidden"
//             animate="visible"
//             whileHover="hover"
//             variants={cardVariants}
//           >
//             <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
//               <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16" />
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-semibold text-gray-700">
//                   Total Findings
//                 </CardTitle>
//                 <div className="p-2 bg-red-100 rounded-lg">
//                   <FileText className="h-5 w-5 text-red-600" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <motion.div 
//                   initial="hidden"
//                   animate="visible"
//                   variants={counterAnimation}
//                   className="text-3xl font-bold text-black"
//                 >
//                   {animatedStats.totalFindings}
//                 </motion.div>
//                 <div className="flex items-center mt-2">
//                   <span className="text-xs text-gray-600">
//                     Active audit findings in system
//                   </span>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* Pending Findings Card */}
//           <motion.div
//             custom={1}
//             initial="hidden"
//             animate="visible"
//             whileHover="hover"
//             variants={cardVariants}
//           >
//             <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
//               <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -mr-16 -mt-16" />
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-semibold text-gray-700">
//                   Pending Action
//                 </CardTitle>
//                 <div className="p-2 bg-yellow-100 rounded-lg">
//                   <Clock className="h-5 w-5 text-yellow-600" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <motion.div 
//                   initial="hidden"
//                   animate="visible"
//                   variants={counterAnimation}
//                   className="text-3xl font-bold text-black"
//                 >
//                   {animatedStats.pendingFindings}
//                 </motion.div>
//                 <div className="flex items-center mt-2">
//                   <span className="text-xs text-gray-600">
//                     {animatedStats.overdueFindings} overdue • {calculatePercentage(stats.pendingFindings, stats.totalFindings)}% of total
//                   </span>
//                 </div>
//                 {animatedStats.overdueFindings > 0 && (
//                   <motion.div 
//                     initial={{ width: 0 }}
//                     animate={{ width: '100%' }}
//                     transition={{ delay: 0.5, duration: 0.5 }}
//                     className="h-1 bg-gray-200 rounded-full mt-2 overflow-hidden"
//                   >
//                     <motion.div 
//                       initial={{ width: 0 }}
//                       animate={{ width: `${(animatedStats.overdueFindings / animatedStats.pendingFindings) * 100}%` }}
//                       transition={{ delay: 0.7, duration: 0.5 }}
//                       className="h-full bg-yellow-500 rounded-full"
//                     />
//                   </motion.div>
//                 )}
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* Resolved Card */}
//           <motion.div
//             custom={2}
//             initial="hidden"
//             animate="visible"
//             whileHover="hover"
//             variants={cardVariants}
//           >
//             <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
//               <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16" />
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-semibold text-gray-700">
//                   Resolved
//                 </CardTitle>
//                 <div className="p-2 bg-green-100 rounded-lg">
//                   <CheckCircle className="h-5 w-5 text-green-600" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <motion.div 
//                   initial="hidden"
//                   animate="visible"
//                   variants={counterAnimation}
//                   className="text-3xl font-bold text-black"
//                 >
//                   {animatedStats.resolvedFindings}
//                 </motion.div>
//                 <div className="flex items-center mt-2">
//                   <span className="text-xs text-gray-600">
//                     {calculatePercentage(stats.resolvedFindings, stats.totalFindings)}% resolution rate
//                   </span>
//                 </div>
//                 <motion.div 
//                   initial={{ width: 0 }}
//                   animate={{ width: '100%' }}
//                   transition={{ delay: 0.5, duration: 0.5 }}
//                   className="h-1 bg-gray-200 rounded-full mt-2 overflow-hidden"
//                 >
//                   <motion.div 
//                     initial={{ width: 0 }}
//                     animate={{ 
//                       width: `${calculatePercentage(stats.resolvedFindings, stats.totalFindings)}%`
//                     }}
//                     transition={{ delay: 0.7, duration: 0.5 }}
//                     className="h-full bg-green-500 rounded-full"
//                   />
//                 </motion.div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* High Risk Card */}
//           <motion.div
//             custom={3}
//             initial="hidden"
//             animate="visible"
//             whileHover="hover"
//             variants={cardVariants}
//           >
//             <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-red-50 to-white">
//               <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full -mr-16 -mt-16" />
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-semibold text-gray-700">
//                   High Risk
//                 </CardTitle>
//                 <div className="p-2 bg-red-100 rounded-lg">
//                   <AlertTriangle className="h-5 w-5 text-red-600" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <motion.div 
//                   initial="hidden"
//                   animate="visible"
//                   variants={counterAnimation}
//                   className="text-3xl font-bold text-red-600"
//                 >
//                   {animatedStats.highRiskFindings}
//                 </motion.div>
//                 <motion.p 
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.5 }}
//                   className="text-xs text-red-600 font-medium mt-2"
//                 >
//                   Requires immediate attention
//                 </motion.p>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </AnimatePresence>
//       </div>

//       {/* Risk Distribution and Status Distribution */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Risk Distribution */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.4, duration: 0.5 }}
//         >
//           <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
//             <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
//               <CardTitle className="flex items-center space-x-2">
//                 <AlertCircle className="h-5 w-5 text-red-600" />
//                 <span className="text-black">Risk Distribution</span>
//               </CardTitle>
//               <CardDescription className="text-gray-600">
//                 Findings by risk level
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="pt-6">
//               <div className="space-y-4">
//                 <motion.div 
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.1 }}
//                   className="flex items-center justify-between"
//                 >
//                   <div className="flex items-center space-x-3">
//                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
//                     <span className="text-sm font-medium">High Risk</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-xl font-bold">{stats.highRiskFindings}</span>
//                     <span className="text-xs text-gray-500">({calculatePercentage(stats.highRiskFindings, stats.totalFindings)}%)</span>
//                   </div>
//                 </motion.div>

//                 <motion.div 
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.2 }}
//                   className="flex items-center justify-between"
//                 >
//                   <div className="flex items-center space-x-3">
//                     <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
//                     <span className="text-sm font-medium">Medium Risk</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-xl font-bold">{stats.mediumRiskFindings}</span>
//                     <span className="text-xs text-gray-500">({calculatePercentage(stats.mediumRiskFindings, stats.totalFindings)}%)</span>
//                   </div>
//                 </motion.div>

//                 <motion.div 
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.3 }}
//                   className="flex items-center justify-between"
//                 >
//                   <div className="flex items-center space-x-3">
//                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
//                     <span className="text-sm font-medium">Low Risk</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-xl font-bold">{stats.lowRiskFindings}</span>
//                     <span className="text-xs text-gray-500">({calculatePercentage(stats.lowRiskFindings, stats.totalFindings)}%)</span>
//                   </div>
//                 </motion.div>

//                 {/* Visual bar chart */}
//                 <div className="pt-4 space-y-2">
//                   <motion.div 
//                     initial={{ width: 0 }}
//                     animate={{ width: '100%' }}
//                     transition={{ delay: 0.5, duration: 0.5 }}
//                     className="h-8 bg-gray-100 rounded-lg overflow-hidden flex"
//                   >
//                     <motion.div 
//                       initial={{ width: 0 }}
//                       animate={{ width: `${calculatePercentage(stats.highRiskFindings, stats.totalFindings)}%` }}
//                       transition={{ delay: 0.6, duration: 0.5 }}
//                       className="bg-red-500 flex items-center justify-center text-white text-xs font-bold"
//                     >
//                       {stats.highRiskFindings > 0 && `${calculatePercentage(stats.highRiskFindings, stats.totalFindings)}%`}
//                     </motion.div>
//                     <motion.div 
//                       initial={{ width: 0 }}
//                       animate={{ width: `${calculatePercentage(stats.mediumRiskFindings, stats.totalFindings)}%` }}
//                       transition={{ delay: 0.7, duration: 0.5 }}
//                       className="bg-yellow-500 flex items-center justify-center text-white text-xs font-bold"
//                     >
//                       {stats.mediumRiskFindings > 0 && `${calculatePercentage(stats.mediumRiskFindings, stats.totalFindings)}%`}
//                     </motion.div>
//                     <motion.div 
//                       initial={{ width: 0 }}
//                       animate={{ width: `${calculatePercentage(stats.lowRiskFindings, stats.totalFindings)}%` }}
//                       transition={{ delay: 0.8, duration: 0.5 }}
//                       className="bg-green-500 flex items-center justify-center text-white text-xs font-bold"
//                     >
//                       {stats.lowRiskFindings > 0 && `${calculatePercentage(stats.lowRiskFindings, stats.totalFindings)}%`}
//                     </motion.div>
//                   </motion.div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Status Distribution */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.5, duration: 0.5 }}
//         >
//           <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
//             <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
//               <CardTitle className="flex items-center space-x-2">
//                 <Activity className="h-5 w-5 text-red-600" />
//                 <span className="text-black">Status Distribution</span>
//               </CardTitle>
//               <CardDescription className="text-gray-600">
//                 Current status of all findings
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="pt-6">
//               <div className="space-y-4">
//                 {statusDistribution.map((status, index) => (
//                   <motion.div
//                     key={status.status}
//                     initial={{ opacity: 0, x: 20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                     className="space-y-2"
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-medium">{status.status}</span>
//                       <span className="text-sm text-gray-600">{status.count}</span>
//                     </div>
//                     <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                       <motion.div
//                         initial={{ width: 0 }}
//                         animate={{ width: `${calculatePercentage(status.count, stats.totalFindings)}%` }}
//                         transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
//                         className="h-full rounded-full"
//                         style={{ backgroundColor: status.color }}
//                       />
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>

//               {/* Total Amount */}
//               <div className="mt-6 pt-6 border-t">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium text-gray-600">Total Amount at Risk</span>
//                   <motion.span 
//                     initial={{ opacity: 0, scale: 0.5 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ delay: 0.8, duration: 0.5 }}
//                     className="text-xl font-bold text-red-600"
//                   >
//                     {formatCurrency(animatedStats.totalAmount)}
//                   </motion.span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Top Categories and Branches */}
//      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//   {/* Top Categories */}
// <motion.div
//   initial={{ opacity: 0, y: 20 }}
//   animate={{ opacity: 1, y: 0 }}
//   transition={{ delay: 0.6, duration: 0.5 }}
// >
//   <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
//     <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
//       <CardTitle className="flex items-center space-x-2">
//         <Tag className="h-5 w-5 text-red-600" />
//         <span className="text-black">Top Categories</span>
//       </CardTitle>
//       <CardDescription className="text-gray-600">
//         Most common finding categories
//       </CardDescription>
//     </CardHeader>
//     <CardContent className="pt-6">
//       <div className="space-y-3">
//         <AnimatePresence mode="wait">
//           {paginatedCategories.map((category, index) => (
//             <motion.div
//               key={`${category.name}-${categoryPage}`}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: 20 }}
//               transition={{ delay: index * 0.1 }}
//               whileHover={{ scale: 1.02 }}
//               className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//             >
//               <div className="flex items-center space-x-3">
//                 <motion.div 
//                   whileHover={{ scale: 1.2 }}
//                   className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center"
//                 >
//                   <span className="text-xs font-bold text-red-600">
//                     {(categoryPage - 1) * ITEMS_PER_PAGE + index + 1}
//                   </span>
//                 </motion.div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">{category.name}</p>
//                   <p className="text-xs text-gray-500">
//                     {calculatePercentage(category.count, stats.totalFindings)}% of total
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <span className="text-lg font-bold text-gray-700">{category.count}</span>
//                 <ChevronRight className="h-4 w-4 text-gray-400" />
//               </div>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//         {categoryStats.length === 0 && (
//           <p className="text-sm text-gray-500 text-center py-4">No category data available</p>
//         )}
//       </div>
      
//       {/* Category Pagination Controls */}
//       {totalCategoryPages > 1 && (
//         <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
//           <button
//             onClick={() => setCategoryPage(prev => Math.max(1, prev - 1))}
//             disabled={categoryPage === 1}
//             className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             <ChevronLeft className="h-4 w-4 text-gray-600" />
//           </button>
          
//           <div className="flex items-center space-x-2">
//             {[...Array(totalCategoryPages)].map((_, i) => (
//               <button
//                 key={i + 1}
//                 onClick={() => setCategoryPage(i + 1)}
//                 className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
//                   categoryPage === i + 1
//                     ? 'bg-red-600 text-white'
//                     : 'hover:bg-gray-100 text-gray-600'
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//           </div>
          
//           <button
//             onClick={() => setCategoryPage(prev => Math.min(totalCategoryPages, prev + 1))}
//             disabled={categoryPage === totalCategoryPages}
//             className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             <ChevronRight className="h-4 w-4 text-gray-600" />
//           </button>
//         </div>
//       )}
//     </CardContent>
//   </Card>
// </motion.div>

//   {/* Top Branches */}
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: 0.7, duration: 0.5 }}
//   >
//     <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
//       <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
//         <CardTitle className="flex items-center space-x-2">
//           <Building2 className="h-5 w-5 text-red-600" />
//           <span className="text-black">Top Branches</span>
//         </CardTitle>
//         <CardDescription className="text-gray-600">
//           Branches with most findings
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="pt-6">
//         <div className="space-y-3">
//           <AnimatePresence mode="wait">
//             {paginatedBranches.map((branch, index) => (
//               <motion.div
//                 key={`${branch.name}-${branchPage}`}
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 transition={{ delay: index * 0.1 }}
//                 whileHover={{ scale: 1.02 }}
//                 className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//               >
//                 <div className="flex items-center space-x-3">
//                   <motion.div 
//                     whileHover={{ scale: 1.2 }}
//                     className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
//                   >
//                     <Building2 className="h-4 w-4 text-gray-600" />
//                   </motion.div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">{branch.name}</p>
//                     <p className="text-xs text-gray-500">
//                       {calculatePercentage(branch.count, stats.totalFindings)}% of total
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <span className="text-lg font-bold text-gray-700">{branch.count}</span>
//                   <ChevronRight className="h-4 w-4 text-gray-400" />
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//           {branchStats.length === 0 && (
//             <p className="text-sm text-gray-500 text-center py-4">No branch data available</p>
//           )}
//         </div>
        
//         {/* Branch Pagination Controls */}
//         {totalBranchPages > 1 && (
//           <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
//             <button
//               onClick={() => setBranchPage(prev => Math.max(1, prev - 1))}
//               disabled={branchPage === 1}
//               className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               <ChevronLeft className="h-4 w-4 text-gray-600" />
//             </button>
            
//             <div className="flex items-center space-x-2">
//               {[...Array(totalBranchPages)].map((_, i) => (
//                 <button
//                   key={i + 1}
//                   onClick={() => setBranchPage(i + 1)}
//                   className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
//                     branchPage === i + 1
//                       ? 'bg-red-600 text-white'
//                       : 'hover:bg-gray-100 text-gray-600'
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//             </div>
            
//             <button
//               onClick={() => setBranchPage(prev => Math.min(totalBranchPages, prev + 1))}
//               disabled={branchPage === totalBranchPages}
//               className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               <ChevronRight className="h-4 w-4 text-gray-600" />
//             </button>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   </motion.div>
// </div>

//       {/* Performance Metrics Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.8, duration: 0.5 }}
//       >
//         <Card className="border-0 shadow-lg bg-gradient-to-br from-white via-gray-50 to-white">
//           <CardHeader>
//             <CardTitle className="flex items-center space-x-2">
//               <BarChart3 className="h-5 w-5 text-red-600" />
//               <span className="text-black">Key Performance Indicators</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <motion.div 
//                 whileHover={{ scale: 1.05 }}
//                 className="text-center p-4 bg-gradient-to-br from-red-50 to-white rounded-xl"
//               >
//                 <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />
//                 <div className="text-2xl font-bold text-black">
//                   {stats.overdueFindings}
//                 </div>
//                 <div className="text-xs text-gray-600">Overdue Findings</div>
//               </motion.div>
              
//               <motion.div 
//                 whileHover={{ scale: 1.05 }}
//                 className="text-center p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl"
//               >
//                 <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
//                 <div className="text-2xl font-bold text-black">
//                   {stats.inProgressFindings}
//                 </div>
//                 <div className="text-xs text-gray-600">In Progress</div>
//               </motion.div>
              
//               <motion.div 
//                 whileHover={{ scale: 1.05 }}
//                 className="text-center p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl"
//               >
//                 <Activity className="h-6 w-6 text-purple-500 mx-auto mb-2" />
//                 <div className="text-2xl font-bold text-black">
//                   {stats.underRectification}
//                 </div>
//                 <div className="text-xs text-gray-600">Under Rectification</div>
//               </motion.div>
              
//               <motion.div 
//                 whileHover={{ scale: 1.05 }}
//                 className="text-center p-4 bg-gradient-to-br from-green-50 to-white rounded-xl"
//               >
//                 <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
//                 <div className="text-2xl font-bold text-black">
//                   {calculatePercentage(stats.resolvedFindings, stats.totalFindings)}%
//                 </div>
//                 <div className="text-xs text-gray-600">Resolution Rate</div>
//               </motion.div>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// };













import React, { useState, useEffect, useCallback } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { 

  AlertTriangle, 

  CheckCircle, 

  Clock, 

  FileText, 

  TrendingUp,

  TrendingDown,

  Users,

  Shield,

  Activity,

  Loader2,

  ArrowUp,

  ArrowDown,

  ChevronRight,

  Calendar,

  BarChart3,

  RefreshCw,

  Building2,

  Tag,

  AlertCircle,

  ChevronLeft

} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

import { CURRENCY_OPTIONS, CurrencyCode } from '@/types/auditFinding';

interface FindingsOverviewProps {

  user: any;

  onNavigateToFindings: (filter: { status?: string; riskRating?: string } | null) => void;

}



interface AuditFinding {

  id: string;

  title: string;

  status: string;

  risk_rating_id: string;

  category_id: string;

  amount: number;

  currency?: CurrencyCode;

  due_date: string;

  createdAt: string;

  RiskRating?: {

    risk_rating_name: string;

  };

  Category?: {

    category_name: string;

  };

  branchAssignment?: {

    assignedBranch?: {

      branch_name: string;

      branch_code: string;

    };

  };

}



// Animation variants

const cardVariants = {

  hidden: { opacity: 0, y: 20 },

  visible: (i: number) => ({

    opacity: 1,

    y: 0,

    transition: {

      delay: i * 0.1,

      duration: 0.5,

      ease: "easeOut"

    }

  }),

  hover: {

    scale: 1.02,

    transition: { duration: 0.2 }

  }

};



const counterAnimation = {

  hidden: { opacity: 0, scale: 0.5 },

  visible: {

    opacity: 1,

    scale: 1,

    transition: {

      duration: 0.5,

      ease: "easeOut"

    }

  }

};



const refreshAnimation = {

  rotate: 360,

  transition: {

    duration: 1,

    ease: "linear"

  }

};



export const FindingsOverview = ({ user, onNavigateToFindings }: FindingsOverviewProps) => {

  const [findings, setFindings] = useState<AuditFinding[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [autoRefreshing, setAutoRefreshing] = useState(false);

  const [initialRefreshDone, setInitialRefreshDone] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());









  const [categoryPage, setCategoryPage] = useState(1);

const [branchPage, setBranchPage] = useState(1);

const ITEMS_PER_PAGE = 4;













  

  const [stats, setStats] = useState({

    totalFindings: 0,

    pendingFindings: 0,

    inProgressFindings: 0,

    resolvedFindings: 0,

    underRectification: 0,

    reviewedFindings: 0,

    lessonTakenFindings: 0,

    highRiskFindings: 0,

    mediumRiskFindings: 0,

    lowRiskFindings: 0,

    overdueFindings: 0,

    totalAmount: 0

  });



  const [animatedStats, setAnimatedStats] = useState({

    totalFindings: 0,

    pendingFindings: 0,

    resolvedFindings: 0,

    reviewedFindings: 0,

    lessonTakenFindings: 0,

    highRiskFindings: 0,

    overdueFindings: 0,

    totalAmount: 0

  });



  const [categoryStats, setCategoryStats] = useState<{ name: string; count: number }[]>([]);

  const [branchStats, setBranchStats] = useState<{ name: string; count: number }[]>([]);

  // Totals grouped by currency
  const [currencyTotals, setCurrencyTotals] = useState<Record<string, number>>({});

  const [statusDistribution, setStatusDistribution] = useState<{ status: string; count: number; color: string }[]>([]);

















  // Add these calculations for categories

const totalCategoryPages = Math.ceil(categoryStats.length / ITEMS_PER_PAGE);

const paginatedCategories = categoryStats.slice(

  (categoryPage - 1) * ITEMS_PER_PAGE,

  categoryPage * ITEMS_PER_PAGE

);



// Add these calculations for branches

const totalBranchPages = Math.ceil(branchStats.length / ITEMS_PER_PAGE);

const paginatedBranches = branchStats.slice(

  (branchPage - 1) * ITEMS_PER_PAGE,

  branchPage * ITEMS_PER_PAGE

);



  // Fetch findings data

  const fetchFindings = useCallback(async () => {

    try {

      setError(null);

      const response = await fetch('https://aps2.zemenbank.com/ZAMS/api/audit-findings?page=1&limit=100000', {

        headers: {

          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,

          'Content-Type': 'application/json'

        }

      });



      if (!response.ok) {

        throw new Error('Failed to fetch findings');

      }



      const data = await response.json();

      const findingsData = data.data || [];

      setFindings(findingsData);



      // Calculate statistics

      calculateStatistics(findingsData);

      setLastRefresh(new Date());

    } catch (err) {

      console.error('Error fetching findings:', err);

      setError('Failed to load findings data. Please try again.');

    } finally {

      setLoading(false);

      setRefreshing(false);

    }

  }, []);



  // Calculate statistics from findings

  const calculateStatistics = (findingsData: AuditFinding[]) => {

    const now = new Date();

    

    // Basic counts

    const total = findingsData.length;

    const pending = findingsData.filter(f => f.status === 'Pending').length;

    const inProgress = findingsData.filter(f => f.status === 'In_Progress').length;

    const resolved = findingsData.filter(f => f.status === 'Resolved').length;

    const underRectification = findingsData.filter(f => f.status === 'Under_Rectification').length;

    const reviewed = findingsData.filter(f => f.status === 'Reviewed').length;

    const lessonTaken = findingsData.filter(f => f.status === 'Lesson_Taken').length;

    

    // Risk levels

    const highRisk = findingsData.filter(f => 

      f.RiskRating?.risk_rating_name === 'High' || 

      f.RiskRating?.risk_rating_name === 'Critical'

    ).length;

    const mediumRisk = findingsData.filter(f => 

      f.RiskRating?.risk_rating_name === 'Medium'

    ).length;

    const lowRisk = findingsData.filter(f => 

      f.RiskRating?.risk_rating_name === 'Low'

    ).length;

    

    // Overdue findings

    const overdue = findingsData.filter(f => {

      if (f.due_date && f.status !== 'Resolved') {

        return new Date(f.due_date) < now;

      }

      return false;

    }).length;

    

    // Total amount
    const totalAmount = findingsData.reduce((sum, f) => sum + (f.amount || 0), 0);

    // Calculate totals by currency
    const currencyTotalsData: Record<string, number> = {};
    findingsData.forEach(f => {
      const currency = f.currency || 'ETB';
      currencyTotalsData[currency] = (currencyTotalsData[currency] || 0) + (f.amount || 0);
    });
    setCurrencyTotals(currencyTotalsData);

    // Category statistics

    const categoryMap = new Map<string, number>();

    findingsData.forEach(f => {

      if (f.Category?.category_name) {

        categoryMap.set(

          f.Category.category_name, 

          (categoryMap.get(f.Category.category_name) || 0) + 1

        );

      }

    });

    const categoryData = Array.from(categoryMap.entries())

      .map(([name, count]) => ({ name, count }))

      .sort((a, b) => b.count - a.count)

      .slice(0, 5); // Top 5 categories

    

    // Branch statistics

    const branchMap = new Map<string, number>();

    findingsData.forEach(f => {

      if (f.branchAssignment?.assignedBranch?.branch_name) {

        branchMap.set(

          f.branchAssignment.assignedBranch.branch_name,

          (branchMap.get(f.branchAssignment.assignedBranch.branch_name) || 0) + 1

        );

      }

    });

    const branchData = Array.from(branchMap.entries())

      .map(([name, count]) => ({ name, count }))

      .sort((a, b) => b.count - a.count)

      .slice(0, 5); // Top 5 branches

    

    // Status distribution for chart

    const statusDist = [

      { status: 'Pending', count: pending, color: '#EAB308' },

      { status: 'In Progress', count: inProgress, color: '#3B82F6' },

      { status: 'Under Rectification', count: underRectification, color: '#8B5CF6' },

      { status: 'Reviewed', count: reviewed, color: '#A855F7' },

      { status: 'Lesson Taken', count: lessonTaken, color: '#14B8A6' },

      { status: 'Resolved', count: resolved, color: '#10B981' }

    ].filter(s => s.count > 0);

    

    // Update state

    setStats({

      totalFindings: total,

      pendingFindings: pending,

      inProgressFindings: inProgress,

      resolvedFindings: resolved,

      underRectification: underRectification,

      reviewedFindings: reviewed,

      lessonTakenFindings: lessonTaken,

      highRiskFindings: highRisk,

      mediumRiskFindings: mediumRisk,

      lowRiskFindings: lowRisk,

      overdueFindings: overdue,

      totalAmount: totalAmount

    });

    

    setCategoryStats(categoryData);

    setBranchStats(branchData);

    setStatusDistribution(statusDist);

    

    // Animate stats

    animateStats({

      totalFindings: total,

      pendingFindings: pending,

      resolvedFindings: resolved,

      reviewedFindings: reviewed,

      lessonTakenFindings: lessonTaken,

      highRiskFindings: highRisk,

      overdueFindings: overdue,

      totalAmount: totalAmount

    });

  };



  // Animate number counting

  const animateStats = (targetStats: any) => {

    const duration = 2000;

    const startTime = Date.now();

    

    const updateValues = () => {

      const currentTime = Date.now();

      const elapsed = currentTime - startTime;

      

      if (elapsed < duration) {

        const progress = elapsed / duration;

        

        setAnimatedStats({

          totalFindings: Math.floor(targetStats.totalFindings * progress),

          pendingFindings: Math.floor(targetStats.pendingFindings * progress),

          resolvedFindings: Math.floor(targetStats.resolvedFindings * progress),

          reviewedFindings: Math.floor(targetStats.reviewedFindings * progress),

          lessonTakenFindings: Math.floor(targetStats.lessonTakenFindings * progress),

          highRiskFindings: Math.floor(targetStats.highRiskFindings * progress),

          overdueFindings: Math.floor(targetStats.overdueFindings * progress),

          totalAmount: Math.floor(targetStats.totalAmount * progress)

        });

        

        requestAnimationFrame(updateValues);

      } else {

        setAnimatedStats(targetStats);

      }

    };

    

    requestAnimationFrame(updateValues);

  };



  // Handle refresh

  const handleRefresh = async () => {

    setRefreshing(true);

    await fetchFindings();

    

    // Trigger page refresh after data is loaded

    setTimeout(() => {

      window.location.reload();

    }, 1000);

  };



  // Fetch data on mount and perform single auto-refresh

  useEffect(() => {

    const initialLoad = async () => {

      // First load - fetch data

      await fetchFindings();

      

      // Check if we've already done the auto-refresh

      const hasAutoRefreshed = sessionStorage.getItem('dashboardAutoRefreshed');

      

      // Only do auto-refresh if we haven't done it yet

      if (!hasAutoRefreshed) {

        setTimeout(() => {

          setAutoRefreshing(true);

          setRefreshing(true);

          console.log('Performing one-time automatic refresh...');

          

          fetchFindings().then(() => {

            // Mark that we've done the auto-refresh

            sessionStorage.setItem('dashboardAutoRefreshed', 'true');

            

            // Reload the page to ensure fresh state

            setTimeout(() => {

              console.log('Reloading page with fresh data...');

              window.location.reload();

            }, 1000);

          });

        }, 1500); // Wait 1.5 seconds after initial load then refresh

      } else {

        // Clear the flag after some time (e.g., 30 minutes) to allow future auto-refresh

        setTimeout(() => {

          sessionStorage.removeItem('dashboardAutoRefreshed');

        }, 30 * 60 * 1000); // 30 minutes

      }

    };

    

    initialLoad();

  }, []); // Empty dependency array to run only once



  // Format currency with dynamic currency code
  const formatCurrency = (amount: number, currencyCode: CurrencyCode = 'ETB') => {
    const currencyOption = CURRENCY_OPTIONS.find(c => c.value === currencyCode);
    const symbol = currencyOption?.symbol || currencyCode;

    const formattedAmount = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);

    return `${symbol} ${formattedAmount}`;
  };

  // Calculate totals grouped by currency
  const calculateTotalsByCurrency = (findingsData: AuditFinding[]) => {
    const totals: Record<string, number> = {};
    findingsData.forEach(f => {
      const currency = f.currency || 'ETB';
      totals[currency] = (totals[currency] || 0) + (f.amount || 0);
    });
    return totals;
  };



  // Calculate percentage

  const calculatePercentage = (value: number, total: number) => {

    if (total === 0) return 0;

    return ((value / total) * 100).toFixed(1);

  };



  if (loading && !autoRefreshing) {

    return (

      <div className="flex items-center justify-center h-64">

        <motion.div

          animate={{ rotate: 360 }}

          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}

        >

          <Loader2 className="h-12 w-12 text-red-600" />

        </motion.div>

        <span className="ml-3 text-gray-700 font-medium">Loading dashboard data...</span>

      </div>

    );

  }



  if (error) {

    return (

      <div className="flex items-center justify-center h-64">

        <div className="text-center">

          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />

          <p className="text-gray-700">{error}</p>

          <motion.button

            whileHover={{ scale: 1.05 }}

            whileTap={{ scale: 0.95 }}

            onClick={handleRefresh}

            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"

          >

            Try Again

          </motion.button>

        </div>

      </div>

    );

  }



  return (

    <div className="space-y-6 relative">

      {/* Auto-refresh overlay */}

      <AnimatePresence>

        {autoRefreshing && (

          <motion.div

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"

          >

            <motion.div

              initial={{ scale: 0.8, opacity: 0 }}

              animate={{ scale: 1, opacity: 1 }}

              exit={{ scale: 0.8, opacity: 0 }}

              className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center space-y-4"

            >

              <motion.div

                animate={{ rotate: 360 }}

                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}

              >

                <RefreshCw className="h-12 w-12 text-red-600" />

              </motion.div>

              <div className="text-center">

                <h3 className="text-lg font-semibold text-gray-900">Auto-Refreshing Dashboard</h3>

                <p className="text-sm text-gray-600 mt-1">Loading latest audit findings...</p>

              </div>

              <motion.div

                initial={{ width: 0 }}

                animate={{ width: '200px' }}

                transition={{ duration: 1.5, ease: "easeInOut" }}

                className="h-1 bg-red-600 rounded-full"

              />

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>



      {/* Animated Welcome Section with Refresh Button */}

      <motion.div

        initial={{ opacity: 0, y: -20 }}

        animate={{ opacity: 1, y: 0 }}

        transition={{ duration: 0.5 }}

        className="relative overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black rounded-2xl p-8 text-white shadow-2xl"

      >

        {/* Auto-refresh notification */}

        <AnimatePresence>

          {autoRefreshing && (

            <motion.div

              initial={{ opacity: 0, y: -20 }}

              animate={{ opacity: 1, y: 0 }}

              exit={{ opacity: 0, y: -20 }}

              className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full flex items-center space-x-2"

            >

              <motion.div

                animate={{ rotate: 360 }}

                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}

              >

                <RefreshCw className="h-4 w-4" />

              </motion.div>

              <span className="text-sm font-medium">Refreshing...</span>

            </motion.div>

          )}

        </AnimatePresence>

        

        {/* Animated Background Pattern */}

        <div className="absolute inset-0 opacity-10">

          <motion.div 

            animate={{ 

              backgroundPosition: ['0% 0%', '100% 100%'],

            }}

            transition={{ 

              duration: 20,

              repeat: Infinity,

              repeatType: 'reverse'

            }}

            className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"

          />

        </div>

        

        <div className="relative flex items-center justify-between">

          <div>

            <motion.h1 

              initial={{ opacity: 0, x: -20 }}

              animate={{ opacity: 1, x: 0 }}

              transition={{ delay: 0.2, duration: 0.5 }}

              className="text-3xl font-bold mb-2"

            >

              Audit Findings Dashboard

            </motion.h1>

            <motion.p 

              initial={{ opacity: 0, x: -20 }}

              animate={{ opacity: 1, x: 0 }}

              transition={{ delay: 0.3, duration: 0.5 }}

              className="text-gray-300 mb-4"

            >

              Welcome back, {user?.username || 'User'} • {user?.department?.replace('_', ' ') || 'Department'} • {user?.role?.replace(/_/g, ' ') || 'Role'}

            </motion.p>

            <motion.div 

              initial={{ opacity: 0 }}

              animate={{ opacity: 1 }}

              transition={{ delay: 0.4, duration: 0.5 }}

              className="flex items-center space-x-6 text-sm"

            >

              <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">

                <Activity className="h-4 w-4 text-red-400" />

                <span>{stats.totalFindings} Total Findings</span>

              </div>

              <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">

                <Clock className="h-4 w-4 text-red-400" />

                <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>

              </div>

            </motion.div>

          </div>

          <div className="flex items-center space-x-4">

            <motion.button

              whileHover={{ scale: 1.05 }}

              whileTap={{ scale: 0.95 }}

              animate={refreshing ? refreshAnimation : {}}

              onClick={handleRefresh}

              disabled={refreshing}

              className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-300"

            >

              <RefreshCw className={`h-5 w-5 ${refreshing ? 'text-red-400' : 'text-white'}`} />

            </motion.button>

            <motion.div

              animate={{ 

                rotate: [0, 10, -10, 10, 0],

                scale: [1, 1.1, 1]

              }}

              transition={{ 

                duration: 5,

                repeat: Infinity,

                repeatDelay: 5

              }}

            >

              <Shield className="h-20 w-20 text-red-500 opacity-50" />

            </motion.div>

          </div>

        </div>

      </motion.div>



      {/* Main Stats Grid */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">

        <AnimatePresence>

          {/* Total Findings Card */}

          <motion.div

            custom={0}

            initial="hidden"

            animate="visible"

            whileHover="hover"

            variants={cardVariants}

            onClick={() => onNavigateToFindings(null)}

            className="cursor-pointer"

          >

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">

              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16" />

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

                <CardTitle className="text-sm font-semibold text-gray-700">

                  Total Findings

                </CardTitle>

                <div className="p-2 bg-red-100 rounded-lg">

                  <FileText className="h-5 w-5 text-red-600" />

                </div>

              </CardHeader>

              <CardContent>

                <motion.div 

                  initial="hidden"

                  animate="visible"

                  variants={counterAnimation}

                  className="text-3xl font-bold text-black"

                >

                  {animatedStats.totalFindings}

                </motion.div>

                <div className="flex items-center mt-2">

                  <span className="text-xs text-gray-600">

                    Active audit findings in system

                  </span>

                </div>

              </CardContent>

            </Card>

          </motion.div>



          {/* Pending Findings Card */}

          <motion.div

            custom={1}

            initial="hidden"

            animate="visible"

            whileHover="hover"

            variants={cardVariants}

            onClick={() => onNavigateToFindings({ status: 'Pending' })}

            className="cursor-pointer"

          >

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">

              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -mr-16 -mt-16" />

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

                <CardTitle className="text-sm font-semibold text-gray-700">

                  Pending Action

                </CardTitle>

                <div className="p-2 bg-yellow-100 rounded-lg">

                  <Clock className="h-5 w-5 text-yellow-600" />

                </div>

              </CardHeader>

              <CardContent>

                <motion.div 

                  initial="hidden"

                  animate="visible"

                  variants={counterAnimation}

                  className="text-3xl font-bold text-black"

                >

                  {animatedStats.pendingFindings}

                </motion.div>

                <div className="flex items-center mt-2">

                  <span className="text-xs text-gray-600">

                    {animatedStats.overdueFindings} overdue • {calculatePercentage(stats.pendingFindings, stats.totalFindings)}% of total

                  </span>

                </div>

                {animatedStats.overdueFindings > 0 && (

                  <motion.div 

                    initial={{ width: 0 }}

                    animate={{ width: '100%' }}

                    transition={{ delay: 0.5, duration: 0.5 }}

                    className="h-1 bg-gray-200 rounded-full mt-2 overflow-hidden"

                  >

                    <motion.div 

                      initial={{ width: 0 }}

                      animate={{ width: `${(animatedStats.overdueFindings / animatedStats.pendingFindings) * 100}%` }}

                      transition={{ delay: 0.7, duration: 0.5 }}

                      className="h-full bg-yellow-500 rounded-full"

                    />

                  </motion.div>

                )}

              </CardContent>

            </Card>

          </motion.div>



          {/* Resolved Card */}

          <motion.div

            custom={2}

            initial="hidden"

            animate="visible"

            whileHover="hover"

            variants={cardVariants}

            onClick={() => onNavigateToFindings({ status: 'Resolved' })}

            className="cursor-pointer"

          >

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">

              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16" />

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

                <CardTitle className="text-sm font-semibold text-gray-700">

                  Resolved

                </CardTitle>

                <div className="p-2 bg-green-100 rounded-lg">

                  <CheckCircle className="h-5 w-5 text-green-600" />

                </div>

              </CardHeader>

              <CardContent>

                <motion.div 

                  initial="hidden"

                  animate="visible"

                  variants={counterAnimation}

                  className="text-3xl font-bold text-black"

                >

                  {animatedStats.resolvedFindings}

                </motion.div>

                <div className="flex items-center mt-2">

                  <span className="text-xs text-gray-600">

                    {calculatePercentage(stats.resolvedFindings, stats.totalFindings)}% resolution rate

                  </span>

                </div>

                <motion.div 

                  initial={{ width: 0 }}

                  animate={{ width: '100%' }}

                  transition={{ delay: 0.5, duration: 0.5 }}

                  className="h-1 bg-gray-200 rounded-full mt-2 overflow-hidden"

                >

                  <motion.div 

                    initial={{ width: 0 }}

                    animate={{ 

                      width: `${calculatePercentage(stats.resolvedFindings, stats.totalFindings)}%`

                    }}

                    transition={{ delay: 0.7, duration: 0.5 }}

                    className="h-full bg-green-500 rounded-full"

                  />

                </motion.div>

              </CardContent>

            </Card>

          </motion.div>



          {/* High Risk Card */}

          <motion.div

            custom={3}

            initial="hidden"

            animate="visible"

            whileHover="hover"

            variants={cardVariants}

            onClick={() => onNavigateToFindings({ riskRating: 'High' })}

            className="cursor-pointer"

          >

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-red-50 to-white">

              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full -mr-16 -mt-16" />

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

                <CardTitle className="text-sm font-semibold text-gray-700">

                  High Risk

                </CardTitle>

                <div className="p-2 bg-red-100 rounded-lg">

                  <AlertTriangle className="h-5 w-5 text-red-600" />

                </div>

              </CardHeader>

              <CardContent>

                <motion.div

                  initial="hidden"

                  animate="visible"

                  variants={counterAnimation}

                  className="text-3xl font-bold text-red-600"

                >

                  {animatedStats.highRiskFindings}

                </motion.div>

                <motion.p

                  initial={{ opacity: 0 }}

                  animate={{ opacity: 1 }}

                  transition={{ delay: 0.5 }}

                  className="text-xs text-red-600 font-medium mt-2"

                >

                  Requires immediate attention

                </motion.p>

              </CardContent>

            </Card>

          </motion.div>



          {/* Reviewed Card */}

          <motion.div

            custom={4}

            initial="hidden"

            animate="visible"

            whileHover="hover"

            variants={cardVariants}

            onClick={() => onNavigateToFindings({ status: 'Reviewed' })}

            className="cursor-pointer"

          >

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">

              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16" />

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

                <CardTitle className="text-sm font-semibold text-gray-700">

                  Reviewed

                </CardTitle>

                <div className="p-2 bg-purple-100 rounded-lg">

                  <CheckCircle className="h-5 w-5 text-purple-600" />

                </div>

              </CardHeader>

              <CardContent>

                <motion.div

                  initial="hidden"

                  animate="visible"

                  variants={counterAnimation}

                  className="text-3xl font-bold text-black"

                >

                  {animatedStats.reviewedFindings}

                </motion.div>

                <div className="flex items-center mt-2">

                  <span className="text-xs text-gray-600">

                    {calculatePercentage(stats.reviewedFindings, stats.totalFindings)}% of total

                  </span>

                </div>

                <motion.div

                  initial={{ width: 0 }}

                  animate={{ width: '100%' }}

                  transition={{ delay: 0.5, duration: 0.5 }}

                  className="h-1 bg-gray-200 rounded-full mt-2 overflow-hidden"

                >

                  <motion.div

                    initial={{ width: 0 }}

                    animate={{

                      width: `${calculatePercentage(stats.reviewedFindings, stats.totalFindings)}%`

                    }}

                    transition={{ delay: 0.7, duration: 0.5 }}

                    className="h-full bg-purple-500 rounded-full"

                  />

                </motion.div>

              </CardContent>

            </Card>

          </motion.div>



          {/* Lesson Taken Card */}

          <motion.div

            custom={5}

            initial="hidden"

            animate="visible"

            whileHover="hover"

            variants={cardVariants}

            onClick={() => onNavigateToFindings({ status: 'Lesson_Taken' })}

            className="cursor-pointer"

          >

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">

              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full -mr-16 -mt-16" />

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

                <CardTitle className="text-sm font-semibold text-gray-700">

                  Lesson Taken

                </CardTitle>

                <div className="p-2 bg-teal-100 rounded-lg">

                  <CheckCircle className="h-5 w-5 text-teal-600" />

                </div>

              </CardHeader>

              <CardContent>

                <motion.div

                  initial="hidden"

                  animate="visible"

                  variants={counterAnimation}

                  className="text-3xl font-bold text-black"

                >

                  {animatedStats.lessonTakenFindings}

                </motion.div>

                <div className="flex items-center mt-2">

                  <span className="text-xs text-gray-600">

                    {calculatePercentage(stats.lessonTakenFindings, stats.totalFindings)}% of total

                  </span>

                </div>

                <motion.div

                  initial={{ width: 0 }}

                  animate={{ width: '100%' }}

                  transition={{ delay: 0.5, duration: 0.5 }}

                  className="h-1 bg-gray-200 rounded-full mt-2 overflow-hidden"

                >

                  <motion.div

                    initial={{ width: 0 }}

                    animate={{

                      width: `${calculatePercentage(stats.lessonTakenFindings, stats.totalFindings)}%`

                    }}

                    transition={{ delay: 0.7, duration: 0.5 }}

                    className="h-full bg-teal-500 rounded-full"

                  />

                </motion.div>

              </CardContent>

            </Card>

          </motion.div>

        </AnimatePresence>

      </div>



      {/* Risk Distribution and Status Distribution */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Risk Distribution */}

        <motion.div

          initial={{ opacity: 0, x: -20 }}

          animate={{ opacity: 1, x: 0 }}

          transition={{ delay: 0.4, duration: 0.5 }}

        >

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">

            <CardHeader className="bg-gradient-to-r from-gray-50 to-white">

              <CardTitle className="flex items-center space-x-2">

                <AlertCircle className="h-5 w-5 text-red-600" />

                <span className="text-black">Risk Distribution</span>

              </CardTitle>

              <CardDescription className="text-gray-600">

                Findings by risk level

              </CardDescription>

            </CardHeader>

            <CardContent className="pt-6">

              <div className="space-y-4">

                <motion.div 

                  initial={{ opacity: 0, x: -20 }}

                  animate={{ opacity: 1, x: 0 }}

                  transition={{ delay: 0.1 }}

                  className="flex items-center justify-between"

                >

                  <div className="flex items-center space-x-3">

                    <div className="w-3 h-3 rounded-full bg-red-500"></div>

                    <span className="text-sm font-medium">High Risk</span>

                  </div>

                  <div className="flex items-center space-x-2">

                    <span className="text-xl font-bold">{stats.highRiskFindings}</span>

                    <span className="text-xs text-gray-500">({calculatePercentage(stats.highRiskFindings, stats.totalFindings)}%)</span>

                  </div>

                </motion.div>



                <motion.div 

                  initial={{ opacity: 0, x: -20 }}

                  animate={{ opacity: 1, x: 0 }}

                  transition={{ delay: 0.2 }}

                  className="flex items-center justify-between"

                >

                  <div className="flex items-center space-x-3">

                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>

                    <span className="text-sm font-medium">Medium Risk</span>

                  </div>

                  <div className="flex items-center space-x-2">

                    <span className="text-xl font-bold">{stats.mediumRiskFindings}</span>

                    <span className="text-xs text-gray-500">({calculatePercentage(stats.mediumRiskFindings, stats.totalFindings)}%)</span>

                  </div>

                </motion.div>



                <motion.div 

                  initial={{ opacity: 0, x: -20 }}

                  animate={{ opacity: 1, x: 0 }}

                  transition={{ delay: 0.3 }}

                  className="flex items-center justify-between"

                >

                  <div className="flex items-center space-x-3">

                    <div className="w-3 h-3 rounded-full bg-green-500"></div>

                    <span className="text-sm font-medium">Low Risk</span>

                  </div>

                  <div className="flex items-center space-x-2">

                    <span className="text-xl font-bold">{stats.lowRiskFindings}</span>

                    <span className="text-xs text-gray-500">({calculatePercentage(stats.lowRiskFindings, stats.totalFindings)}%)</span>

                  </div>

                </motion.div>



                {/* Visual bar chart */}

                <div className="pt-4 space-y-2">

                  <motion.div 

                    initial={{ width: 0 }}

                    animate={{ width: '100%' }}

                    transition={{ delay: 0.5, duration: 0.5 }}

                    className="h-8 bg-gray-100 rounded-lg overflow-hidden flex"

                  >

                    <motion.div 

                      initial={{ width: 0 }}

                      animate={{ width: `${calculatePercentage(stats.highRiskFindings, stats.totalFindings)}%` }}

                      transition={{ delay: 0.6, duration: 0.5 }}

                      className="bg-red-500 flex items-center justify-center text-white text-xs font-bold"

                    >

                      {stats.highRiskFindings > 0 && `${calculatePercentage(stats.highRiskFindings, stats.totalFindings)}%`}

                    </motion.div>

                    <motion.div 

                      initial={{ width: 0 }}

                      animate={{ width: `${calculatePercentage(stats.mediumRiskFindings, stats.totalFindings)}%` }}

                      transition={{ delay: 0.7, duration: 0.5 }}

                      className="bg-yellow-500 flex items-center justify-center text-white text-xs font-bold"

                    >

                      {stats.mediumRiskFindings > 0 && `${calculatePercentage(stats.mediumRiskFindings, stats.totalFindings)}%`}

                    </motion.div>

                    <motion.div 

                      initial={{ width: 0 }}

                      animate={{ width: `${calculatePercentage(stats.lowRiskFindings, stats.totalFindings)}%` }}

                      transition={{ delay: 0.8, duration: 0.5 }}

                      className="bg-green-500 flex items-center justify-center text-white text-xs font-bold"

                    >

                      {stats.lowRiskFindings > 0 && `${calculatePercentage(stats.lowRiskFindings, stats.totalFindings)}%`}

                    </motion.div>

                  </motion.div>

                </div>

              </div>

            </CardContent>

          </Card>

        </motion.div>



        {/* Status Distribution */}

        <motion.div

          initial={{ opacity: 0, x: 20 }}

          animate={{ opacity: 1, x: 0 }}

          transition={{ delay: 0.5, duration: 0.5 }}

        >

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">

            <CardHeader className="bg-gradient-to-r from-gray-50 to-white">

              <CardTitle className="flex items-center space-x-2">

                <Activity className="h-5 w-5 text-red-600" />

                <span className="text-black">Status Distribution</span>

              </CardTitle>

              <CardDescription className="text-gray-600">

                Current status of all findings

              </CardDescription>

            </CardHeader>

            <CardContent className="pt-6">

              <div className="space-y-4">

                {statusDistribution.map((status, index) => (

                  <motion.div

                    key={status.status}

                    initial={{ opacity: 0, x: 20 }}

                    animate={{ opacity: 1, x: 0 }}

                    transition={{ delay: index * 0.1 }}

                    className="space-y-2"

                  >

                    <div className="flex items-center justify-between">

                      <span className="text-sm font-medium">{status.status}</span>

                      <span className="text-sm text-gray-600">{status.count}</span>

                    </div>

                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">

                      <motion.div

                        initial={{ width: 0 }}

                        animate={{ width: `${calculatePercentage(status.count, stats.totalFindings)}%` }}

                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}

                        className="h-full rounded-full"

                        style={{ backgroundColor: status.color }}

                      />

                    </div>

                  </motion.div>

                ))}

              </div>



              {/* Total Amount by Currency */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-600">Total Amount at Risk</span>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(currencyTotals).length > 0 ? (
                      Object.entries(currencyTotals).map(([currency, amount], index) => (
                        <motion.div
                          key={currency}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                          className="flex items-center gap-1 px-3 py-1 bg-red-50 rounded-lg"
                        >
                          <span className="text-lg font-bold text-red-600">
                            {formatCurrency(amount, currency as CurrencyCode)}
                          </span>
                        </motion.div>
                      ))
                    ) : (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="text-lg font-bold text-red-600"
                      >
                        {formatCurrency(0, 'ETB')}
                      </motion.span>
                    )}
                  </div>
                </div>
              </div>

            </CardContent>

          </Card>

        </motion.div>

      </div>



      {/* Top Categories and Branches */}

     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

  {/* Top Categories */}

<motion.div

  initial={{ opacity: 0, y: 20 }}

  animate={{ opacity: 1, y: 0 }}

  transition={{ delay: 0.6, duration: 0.5 }}

>

  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">

    <CardHeader className="bg-gradient-to-r from-gray-50 to-white">

      <CardTitle className="flex items-center space-x-2">

        <Tag className="h-5 w-5 text-red-600" />

        <span className="text-black">Top Categories</span>

      </CardTitle>

      <CardDescription className="text-gray-600">

        Most common finding categories

      </CardDescription>

    </CardHeader>

    <CardContent className="pt-6">

      <div className="space-y-3">

        <AnimatePresence mode="wait">

          {paginatedCategories.map((category, index) => (

            <motion.div

              key={`${category.name}-${categoryPage}`}

              initial={{ opacity: 0, x: -20 }}

              animate={{ opacity: 1, x: 0 }}

              exit={{ opacity: 0, x: 20 }}

              transition={{ delay: index * 0.1 }}

              whileHover={{ scale: 1.02 }}

              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"

            >

              <div className="flex items-center space-x-3">

                <motion.div 

                  whileHover={{ scale: 1.2 }}

                  className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center"

                >

                  <span className="text-xs font-bold text-red-600">

                    {(categoryPage - 1) * ITEMS_PER_PAGE + index + 1}

                  </span>

                </motion.div>

                <div>

                  <p className="text-sm font-medium text-gray-900">{category.name}</p>

                  <p className="text-xs text-gray-500">

                    {calculatePercentage(category.count, stats.totalFindings)}% of total

                  </p>

                </div>

              </div>

              <div className="flex items-center space-x-2">

                <span className="text-lg font-bold text-gray-700">{category.count}</span>

                <ChevronRight className="h-4 w-4 text-gray-400" />

              </div>

            </motion.div>

          ))}

        </AnimatePresence>

        {categoryStats.length === 0 && (

          <p className="text-sm text-gray-500 text-center py-4">No category data available</p>

        )}

      </div>

      

      {/* Category Pagination Controls */}

      {totalCategoryPages > 1 && (

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">

          <button

            onClick={() => setCategoryPage(prev => Math.max(1, prev - 1))}

            disabled={categoryPage === 1}

            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"

          >

            <ChevronLeft className="h-4 w-4 text-gray-600" />

          </button>

          

          <div className="flex items-center space-x-2">

            {[...Array(totalCategoryPages)].map((_, i) => (

              <button

                key={i + 1}

                onClick={() => setCategoryPage(i + 1)}

                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${

                  categoryPage === i + 1

                    ? 'bg-red-600 text-white'

                    : 'hover:bg-gray-100 text-gray-600'

                }`}

              >

                {i + 1}

              </button>

            ))}

          </div>

          

          <button

            onClick={() => setCategoryPage(prev => Math.min(totalCategoryPages, prev + 1))}

            disabled={categoryPage === totalCategoryPages}

            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"

          >

            <ChevronRight className="h-4 w-4 text-gray-600" />

          </button>

        </div>

      )}

    </CardContent>

  </Card>

</motion.div>



  {/* Top Branches */}

  <motion.div

    initial={{ opacity: 0, y: 20 }}

    animate={{ opacity: 1, y: 0 }}

    transition={{ delay: 0.7, duration: 0.5 }}

  >

    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">

      <CardHeader className="bg-gradient-to-r from-gray-50 to-white">

        <CardTitle className="flex items-center space-x-2">

          <Building2 className="h-5 w-5 text-red-600" />

          <span className="text-black">Top Branches</span>

        </CardTitle>

        <CardDescription className="text-gray-600">

          Branches with most findings

        </CardDescription>

      </CardHeader>

      <CardContent className="pt-6">

        <div className="space-y-3">

          <AnimatePresence mode="wait">

            {paginatedBranches.map((branch, index) => (

              <motion.div

                key={`${branch.name}-${branchPage}`}

                initial={{ opacity: 0, x: 20 }}

                animate={{ opacity: 1, x: 0 }}

                exit={{ opacity: 0, x: -20 }}

                transition={{ delay: index * 0.1 }}

                whileHover={{ scale: 1.02 }}

                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"

              >

                <div className="flex items-center space-x-3">

                  <motion.div 

                    whileHover={{ scale: 1.2 }}

                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"

                  >

                    <Building2 className="h-4 w-4 text-gray-600" />

                  </motion.div>

                  <div>

                    <p className="text-sm font-medium text-gray-900">{branch.name}</p>

                    <p className="text-xs text-gray-500">

                      {calculatePercentage(branch.count, stats.totalFindings)}% of total

                    </p>

                  </div>

                </div>

                <div className="flex items-center space-x-2">

                  <span className="text-lg font-bold text-gray-700">{branch.count}</span>

                  <ChevronRight className="h-4 w-4 text-gray-400" />

                </div>

              </motion.div>

            ))}

          </AnimatePresence>

          {branchStats.length === 0 && (

            <p className="text-sm text-gray-500 text-center py-4">No branch data available</p>

          )}

        </div>

        

        {/* Branch Pagination Controls */}

        {totalBranchPages > 1 && (

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">

            <button

              onClick={() => setBranchPage(prev => Math.max(1, prev - 1))}

              disabled={branchPage === 1}

              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"

            >

              <ChevronLeft className="h-4 w-4 text-gray-600" />

            </button>

            

            <div className="flex items-center space-x-2">

              {[...Array(totalBranchPages)].map((_, i) => (

                <button

                  key={i + 1}

                  onClick={() => setBranchPage(i + 1)}

                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${

                    branchPage === i + 1

                      ? 'bg-red-600 text-white'

                      : 'hover:bg-gray-100 text-gray-600'

                  }`}

                >

                  {i + 1}

                </button>

              ))}

            </div>

            

            <button

              onClick={() => setBranchPage(prev => Math.min(totalBranchPages, prev + 1))}

              disabled={branchPage === totalBranchPages}

              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"

            >

              <ChevronRight className="h-4 w-4 text-gray-600" />

            </button>

          </div>

        )}

      </CardContent>

    </Card>

  </motion.div>

</div>



      {/* Performance Metrics Section */}

      <motion.div

        initial={{ opacity: 0, y: 20 }}

        animate={{ opacity: 1, y: 0 }}

        transition={{ delay: 0.8, duration: 0.5 }}

      >

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white via-gray-50 to-white">

          <CardHeader>

            <CardTitle className="flex items-center space-x-2">

              <BarChart3 className="h-5 w-5 text-red-600" />

              <span className="text-black">Key Performance Indicators</span>

            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <motion.div 

                whileHover={{ scale: 1.05 }}

                className="text-center p-4 bg-gradient-to-br from-red-50 to-white rounded-xl"

              >

                <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />

                <div className="text-2xl font-bold text-black">

                  {stats.overdueFindings}

                </div>

                <div className="text-xs text-gray-600">Overdue Findings</div>

              </motion.div>

              

              <motion.div 

                whileHover={{ scale: 1.05 }}

                className="text-center p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl"

              >

                <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />

                <div className="text-2xl font-bold text-black">

                  {stats.inProgressFindings}

                </div>

                <div className="text-xs text-gray-600">In Progress</div>

              </motion.div>

              

              <motion.div 

                whileHover={{ scale: 1.05 }}

                className="text-center p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl"

              >

                <Activity className="h-6 w-6 text-purple-500 mx-auto mb-2" />

                <div className="text-2xl font-bold text-black">

                  {stats.underRectification}

                </div>

                <div className="text-xs text-gray-600">Under Rectification</div>

              </motion.div>

              

              <motion.div 

                whileHover={{ scale: 1.05 }}

                className="text-center p-4 bg-gradient-to-br from-green-50 to-white rounded-xl"

              >

                <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />

                <div className="text-2xl font-bold text-black">

                  {calculatePercentage(stats.resolvedFindings, stats.totalFindings)}%

                </div>

                <div className="text-xs text-gray-600">Resolution Rate</div>

              </motion.div>

            </div>

          </CardContent>

        </Card>

      </motion.div>

    </div>

  );

};
