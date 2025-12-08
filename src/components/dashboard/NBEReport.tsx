


// // NBEReport.tsx - with reference number search

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { toast } from 'sonner';
// import { 
//   FileText, 
//   Download, 
//   Search, 
//   Calendar, 
//   Filter,
//   Eye,
//   CheckCircle,
//   AlertCircle,
//   Clock,
//   Paperclip,
//   User as UserIcon,
//   Building,
//   Target,
//   X
// } from 'lucide-react';
// import { format } from 'date-fns';
// import { User as UserType } from '@/types/user';

// interface NBEReportProps {
//   user: UserType;
// }

// interface AuditeeResponse {
//   type: 'Rectified' | 'ActionPlan';
//   text: string;
//   status?: string;
//   date?: string;
//   dueDate?: string;
//   progress?: number;
//   responsiblePersons?: Array<{
//     username: string;
//     email: string;
//   }>;
// }

// interface AnnexDoc {
//   id: string;
//   name: string;
//   path: string;
//   description: string;
//   uploaded_at: string;
//   content?: string;
//   mimeType?: string;
//   size?: number;
// }

// interface NBEReportFinding {
//   id: string;
//   reference_number: string;
//   title: string;
//   description: string;
//   criteria: string;
//   cause: string;
//   impact: string;
//   recommendation: string;
//   risk_level: string | null;
//   risk_rating: string | null;
//   category: string | null;
//   status: string;
//   amount: number;
//   due_date: string | null;
//   created_at: string;
//   created_by: {
//     username: string;
//     email: string;
//     department: string;
//   };
//   auditee_response: AuditeeResponse | null;
//   annex_docs: AnnexDoc[];
// }

// interface NBEReportResponse {
//   success: boolean;
//   total: number;
//   page: number;
//   totalPages: number;
//   department: string;
//   user_role: string;
//   data: NBEReportFinding[];
// }

// // Helper function to safely format dates
// const safeFormatDate = (dateValue: string | null | undefined, formatString: string): string => {
//   if (!dateValue) return '-';
  
//   try {
//     const date = new Date(dateValue);
//     // Check if date is valid
//     if (isNaN(date.getTime())) {
//       return '-';
//     }
//     return format(date, formatString);
//   } catch (error) {
//     console.error('Date formatting error:', error);
//     return '-';
//   }
// };

// export const NBEReport = ({ user }: NBEReportProps) => {
//   const { api } = useAuth();
  
//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   const [findings, setFindings] = useState<NBEReportFinding[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedFinding, setSelectedFinding] = useState<NBEReportFinding | null>(null);
//   const [detailDialogOpen, setDetailDialogOpen] = useState(false);
//   const [exportLoading, setExportLoading] = useState(false);

//   // Pagination state
//   const [pagination, setPagination] = useState({
//     page: 1,
//     totalPages: 1,
//     total: 0,
//     limit: 10
//   });

//   // Filter states
//   const [filters, setFilters] = useState({
//     startDate: '',
//     endDate: '',
//     status: '',
//     category_id: '',
//     reference_number: '',
//     page: 1,
//     limit: 10
//   });

//   // Fetch NBE Report data
//   const fetchNBEReport = async (currentFilters = filters) => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       Object.entries(currentFilters).forEach(([key, value]) => {
//         if (value && value !== 'all') params.append(key, value.toString());
//       });

//       const response = await api.get(`/ZAMS/api/audit-findings/NBE_Report?${params.toString()}`);
//       const data: NBEReportResponse = response.data;

//       setFindings(data.data || []);
//       setPagination({
//         page: data.page || 1,
//         totalPages: data.totalPages || 1,
//         total: data.total || 0,
//         limit: 10
//       });
//     } catch (error) {
//       console.error('Error fetching NBE Report:', error);
//       toast.error('Failed to fetch NBE Report data');
//       setFindings([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNBEReport();
//   }, []);

//   // Handle filter changes
//   const handleFilterChange = (key: string, value: string) => {
//     const newFilters = { ...filters, [key]: value, page: 1 };
//     setFilters(newFilters);
//   };

//   // Handle search button click
//   const handleSearch = () => {
//     fetchNBEReport(filters);
//   };

//   // Handle clear filters
//   const handleClearFilters = () => {
//     const clearedFilters = {
//       startDate: '',
//       endDate: '',
//       status: '',
//       category_id: '',
//       reference_number: '',
//       page: 1,
//       limit: 10
//     };
//     setFilters(clearedFilters);
//     fetchNBEReport(clearedFilters);
//   };

//   // Handle pagination
//   const handlePageChange = (page: number) => {
//     const newFilters = { ...filters, page };
//     setFilters(newFilters);
//     fetchNBEReport(newFilters);
//   };

//   // View finding details
//   const viewDetails = (finding: NBEReportFinding) => {
//     setSelectedFinding(finding);
//     setDetailDialogOpen(true);
//   };

//   // Export to Word with proper document generation and attachments
//   const exportToWord = async () => {
//     setExportLoading(true);
//     try {
//       toast.info('Generating report with attachments...');
      
//       // Call backend endpoint to generate Word document with attachments
//       const response = await api.post('/ZAMS/api/audit-findings/audit-findings/export-word-with-attachments', {
//         findings: findings,
//         department: user.department,
//         includeAttachments: true  // Set to true to get ZIP with attachments
//       }, {
//         responseType: 'blob',  // Important: tell axios to handle response as blob
//         timeout: 60000  // 60 second timeout for large files
//       });
      
//       // Check if response is a ZIP (with attachments) or just Word doc
//       const contentType = response.headers['content-type'];
//       const contentDisposition = response.headers['content-disposition'];
      
//       // Extract filename from content-disposition header if available
//       let filename = `NBE_Report_${format(new Date(), 'yyyy-MM-dd')}`;
//       if (contentDisposition) {
//         const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
//         if (filenameMatch && filenameMatch[1]) {
//           filename = filenameMatch[1].replace(/['"]/g, '');
//         }
//       }
      
//       // Determine file extension based on content type
//       if (contentType && contentType.includes('zip')) {
//         // It's a ZIP file with attachments
//         filename = filename.endsWith('.zip') ? filename : `${filename}.zip`;
//       } else {
//         // It's just a Word document
//         filename = filename.endsWith('.docx') ? filename : `${filename}.docx`;
//       }
      
//       // Create blob and trigger download
//       const blob = new Blob([response.data], { type: contentType || 'application/octet-stream' });
      
//       // Method 1: Using native browser download
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = filename;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
      
//       toast.success('Report exported successfully with attachments!');
      
//     } catch (error) {
//       console.error('Error exporting to Word:', error);
      
//       // Provide specific error messages
//       if (error.response) {
//         // Server responded with error
//         if (error.response.status === 500) {
//           toast.error('Server error: Failed to generate report. Please try again.');
//         } else if (error.response.status === 404) {
//           toast.error('Export endpoint not found. Please contact IT support.');
//         } else if (error.response.status === 401) {
//           toast.error('Authentication required. Please login again.');
//         } else {
//           toast.error(`Export failed: ${error.response.data?.error || 'Unknown error'}`);
//         }
//       } else if (error.request) {
//         // Request made but no response
//         toast.error('No response from server. Please check your connection.');
//       } else if (error.code === 'ECONNABORTED') {
//         // Timeout
//         toast.error('Export timeout. The report may be too large. Try reducing the date range.');
//       } else {
//         // Other errors
//         toast.error('Failed to export report. Please try again.');
//       }
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   // Get status badge
//   const getStatusBadge = (status: string) => {
//     const statusColors: Record<string, string> = {
//       'Pending': 'bg-yellow-100 text-yellow-800',
//       'Under_Rectification': 'bg-blue-100 text-blue-800',
//       'In_Progress': 'bg-purple-100 text-purple-800',
//       'Reviewed': 'bg-indigo-100 text-indigo-800',
//       'Escalated': 'bg-red-100 text-red-800',
//       'Resolved': 'bg-green-100 text-green-800'
//     };
    
//     return (
//       <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
//         {status.replace(/_/g, ' ')}
//       </Badge>
//     );
//   };

//   // Get risk badge
//   const getRiskBadge = (level: string | null) => {
//     if (!level) return null;
    
//     const colors: Record<string, string> = {
//       'High': 'bg-red-100 text-red-800',
//       'Medium': 'bg-yellow-100 text-yellow-800',
//       'Low': 'bg-green-100 text-green-800'
//     };
    
//     return (
//       <Badge className={colors[level] || 'bg-gray-100 text-gray-800'}>
//         {level}
//       </Badge>
//     );
//   };

//   // Format currency
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'ETB',
//       minimumFractionDigits: 0
//     }).format(amount);
//   };

//   // Check if any filters are active
//   const hasActiveFilters = filters.startDate || filters.endDate || filters.status || filters.reference_number;

//   return (
//     <div className="container mx-auto py-6">
//       <div className="mb-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">NBE Audit Report</h1>
//             <p className="text-gray-600">Comprehensive audit findings report for National Bank of Ethiopia</p>
//           </div>
//           <Button onClick={exportToWord} disabled={exportLoading || findings.length === 0}>
//             <Download className="h-4 w-4 mr-2" />
//             Export to Word
//           </Button>
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Audit Findings Report</CardTitle>
//           <CardDescription>
//             View and export detailed audit findings with rectifications and action plans
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {/* Filters */}
//           <div className="mb-6 space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div>
//                 <Label>Reference Number</Label>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <Input
//                     type="text"
//                     placeholder="Search by reference..."
//                     value={filters.reference_number}
//                     onChange={(e) => handleFilterChange('reference_number', e.target.value)}
//                     className="pl-10"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label>Start Date</Label>
//                 <Input
//                   type="date"
//                   value={filters.startDate}
//                   onChange={(e) => handleFilterChange('startDate', e.target.value)}
//                 />
//               </div>
              
//               <div>
//                 <Label>End Date</Label>
//                 <Input
//                   type="date"
//                   value={filters.endDate}
//                   onChange={(e) => handleFilterChange('endDate', e.target.value)}
//                 />
//               </div>

//               <div>
//                 <Label>Status</Label>
//                 <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="All Statuses" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Statuses</SelectItem>
//                     <SelectItem value="Pending">Pending</SelectItem>
//                     <SelectItem value="Under_Rectification">Under Rectification</SelectItem>
//                     <SelectItem value="In_Progress">In Progress</SelectItem>
//                     <SelectItem value="Reviewed">Reviewed</SelectItem>
//                     <SelectItem value="Escalated">Escalated</SelectItem>
//                     <SelectItem value="Resolved">Resolved</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <Button onClick={handleSearch} className="flex-1 md:flex-none">
//                 <Search className="h-4 w-4 mr-2" />
//                 Search
//               </Button>
              
//               {hasActiveFilters && (
//                 <Button variant="outline" onClick={handleClearFilters}>
//                   <X className="h-4 w-4 mr-2" />
//                   Clear Filters
//                 </Button>
//               )}
//             </div>
//           </div>

//           {/* Summary Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//             <Card>
//               <CardContent className="p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600">Total Findings</p>
//                     <p className="text-2xl font-bold">{pagination.total}</p>
//                   </div>
//                   <FileText className="h-8 w-8 text-gray-400" />
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600">Resolved</p>
//                     <p className="text-2xl font-bold text-green-600">
//                       {findings.filter(f => f.status === 'Resolved').length}
//                     </p>
//                   </div>
//                   <CheckCircle className="h-8 w-8 text-green-400" />
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600">In Progress</p>
//                     <p className="text-2xl font-bold text-blue-600">
//                       {findings.filter(f => f.status === 'In_Progress' || f.status === 'Under_Rectification').length}
//                     </p>
//                   </div>
//                   <Clock className="h-8 w-8 text-blue-400" />
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600">Pending</p>
//                     <p className="text-2xl font-bold text-yellow-600">
//                       {findings.filter(f => f.status === 'Pending').length}
//                     </p>
//                   </div>
//                   <AlertCircle className="h-8 w-8 text-yellow-400" />
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Table */}
//           {loading ? (
//             <div className="flex items-center justify-center py-8">
//               <div className="text-gray-500">Loading report data...</div>
//             </div>
//           ) : findings.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               No findings found for the selected criteria.
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Reference</TableHead>
//                       <TableHead>Title</TableHead>
//                       <TableHead>Category</TableHead>
//                       <TableHead>Risk</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Response</TableHead>
//                       <TableHead>Amount</TableHead>
//                       <TableHead>Created</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {findings.map((finding) => (
//                       <TableRow key={finding.id}>
//                         <TableCell className="font-medium">
//                           {finding.reference_number}
//                         </TableCell>
//                         <TableCell className="max-w-xs">
//                           <div className="truncate" title={finding.title}>
//                             {finding.title}
//                           </div>
//                         </TableCell>
//                         <TableCell>{finding.category || '-'}</TableCell>
//                         <TableCell>{getRiskBadge(finding.risk_level)}</TableCell>
//                         <TableCell>{getStatusBadge(finding.status)}</TableCell>
//                         <TableCell>
//                           {finding.auditee_response ? (
//                             <Badge className={finding.auditee_response.type === 'Rectified' ? 
//                               'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
//                               {finding.auditee_response.type}
//                             </Badge>
//                           ) : (
//                             <Badge className="bg-gray-100 text-gray-800">No Response</Badge>
//                           )}
//                         </TableCell>
//                         <TableCell>
//                           {finding.amount ? formatCurrency(finding.amount) : '-'}
//                         </TableCell>
//                         <TableCell>
//                           {safeFormatDate(finding.created_at, 'MMM dd, yyyy')}
//                         </TableCell>
//                         <TableCell>
//                           <Button variant="ghost" size="sm" onClick={() => viewDetails(finding)}>
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>

//               {/* Pagination */}
//               {pagination.totalPages > 1 && (
//                 <div className="mt-4 flex items-center justify-between">
//                   <div className="text-sm text-gray-500">
//                     Showing {findings.length} of {pagination.total} results
//                   </div>
//                   <Pagination>
//                     <PaginationContent>
//                       <PaginationItem>
//                         <PaginationPrevious 
//                           onClick={pagination.page === 1 ? undefined : () => handlePageChange(pagination.page - 1)}
//                           className={pagination.page === 1 ? "pointer-events-none opacity-50" : ""}
//                         />
//                       </PaginationItem>
                      
//                       {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//                         const page = i + 1;
//                         return (
//                           <PaginationItem key={page}>
//                             <PaginationLink
//                               onClick={() => handlePageChange(page)}
//                               isActive={page === pagination.page}
//                             >
//                               {page}
//                             </PaginationLink>
//                           </PaginationItem>
//                         );
//                       })}
                      
//                       <PaginationItem>
//                         <PaginationNext 
//                           onClick={pagination.page === pagination.totalPages ? undefined : () => handlePageChange(pagination.page + 1)}
//                           className={pagination.page === pagination.totalPages ? "pointer-events-none opacity-50" : ""}
//                         />
//                       </PaginationItem>
//                     </PaginationContent>
//                   </Pagination>
//                 </div>
//               )}
//             </>
//           )}
//         </CardContent>
//       </Card>

//       {/* Detail Dialog */}
//       <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
//         <DialogContent className="max-w-4xl max-h-[80vh]">
//           <DialogHeader>
//             <DialogTitle className="text-xl">
//               Finding Details: {selectedFinding?.reference_number}
//             </DialogTitle>
//             <DialogDescription>
//               Complete details of the audit finding
//             </DialogDescription>
//           </DialogHeader>
          
//           {selectedFinding && (
//             <ScrollArea className="h-[60vh] pr-4">
//               <Tabs defaultValue="details" className="w-full">
//                 <TabsList className="grid w-full grid-cols-3">
//                   <TabsTrigger value="details">Details</TabsTrigger>
//                   <TabsTrigger value="response">Auditee Response</TabsTrigger>
//                   <TabsTrigger value="attachments">Attachments</TabsTrigger>
//                 </TabsList>
                
//                 <TabsContent value="details" className="space-y-4">
//                   <div>
//                     <h3 className="font-semibold mb-2">Title</h3>
//                     <p className="text-gray-700">{selectedFinding.title}</p>
//                   </div>
                  
//                   <div>
//                     <h3 className="font-semibold mb-2">Description</h3>
//                     <p className="text-gray-700">{selectedFinding.description}</p>
//                   </div>
                  
//                   <div>
//                     <h3 className="font-semibold mb-2">Criteria</h3>
//                     <p className="text-gray-700">{selectedFinding.criteria}</p>
//                   </div>
                  
//                   <div>
//                     <h3 className="font-semibold mb-2">Root Cause</h3>
//                     <p className="text-gray-700">{selectedFinding.cause}</p>
//                   </div>
                  
//                   <div>
//                     <h3 className="font-semibold mb-2">Impact</h3>
//                     <p className="text-gray-700">{selectedFinding.impact}</p>
//                   </div>
                  
//                   <div>
//                     <h3 className="font-semibold mb-2">Recommendation</h3>
//                     <p className="text-gray-700">{selectedFinding.recommendation}</p>
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <h3 className="font-semibold mb-2">Risk Level</h3>
//                       {getRiskBadge(selectedFinding.risk_level)}
//                     </div>
//                     <div>
//                       <h3 className="font-semibold mb-2">Status</h3>
//                       {getStatusBadge(selectedFinding.status)}
//                     </div>
//                   </div>
                  
//                   {selectedFinding.amount && (
//                     <div>
//                       <h3 className="font-semibold mb-2">Amount</h3>
//                       <p className="text-gray-700">{formatCurrency(selectedFinding.amount)}</p>
//                     </div>
//                   )}
                  
//                   <div>
//                     <h3 className="font-semibold mb-2">Created By</h3>
//                     <div className="flex items-center gap-2">
//                       <UserIcon className="h-4 w-4 text-gray-400" />
//                       <span>{selectedFinding.created_by.username} ({selectedFinding.created_by.department})</span>
//                     </div>
//                   </div>
//                 </TabsContent>
                
//                 <TabsContent value="response" className="space-y-4">
//                   {selectedFinding.auditee_response ? (
//                     <>
//                       <div className="flex items-center gap-2 mb-4">
//                         <Badge className={selectedFinding.auditee_response.type === 'Rectified' ? 
//                           'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
//                           {selectedFinding.auditee_response.type}
//                         </Badge>
//                         {selectedFinding.auditee_response.status && (
//                           <Badge>{selectedFinding.auditee_response.status}</Badge>
//                         )}
//                       </div>
                      
//                       <div>
//                         <h3 className="font-semibold mb-2">Response Text</h3>
//                         <p className="text-gray-700">{selectedFinding.auditee_response.text}</p>
//                       </div>
                      
//                       {selectedFinding.auditee_response.dueDate && (
//                         <div>
//                           <h3 className="font-semibold mb-2">Due Date</h3>
//                           <p className="text-gray-700">
//                             {safeFormatDate(selectedFinding.auditee_response.dueDate, 'MMMM dd, yyyy')}
//                           </p>
//                         </div>
//                       )}
                      
//                       {selectedFinding.auditee_response.progress !== undefined && (
//                         <div>
//                           <h3 className="font-semibold mb-2">Progress</h3>
//                           <div className="flex items-center gap-2">
//                             <div className="flex-1 bg-gray-200 rounded-full h-2">
//                               <div 
//                                 className="bg-blue-600 h-2 rounded-full" 
//                                 style={{ width: `${selectedFinding.auditee_response.progress}%` }}
//                               />
//                             </div>
//                             <span className="text-sm text-gray-600">
//                               {selectedFinding.auditee_response.progress}%
//                             </span>
//                           </div>
//                         </div>
//                       )}
                      
//                       {selectedFinding.auditee_response.responsiblePersons && 
//                        selectedFinding.auditee_response.responsiblePersons.length > 0 && (
//                         <div>
//                           <h3 className="font-semibold mb-2">Responsible Persons</h3>
//                           <div className="space-y-2">
//                             {selectedFinding.auditee_response.responsiblePersons.map((person, index) => (
//                               <div key={index} className="flex items-center gap-2">
//                                 <UserIcon className="h-4 w-4 text-gray-400" />
//                                 <span>{person.username} ({person.email})</span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     <div className="text-center py-8 text-gray-500">
//                       No auditee response has been submitted for this finding.
//                     </div>
//                   )}
//                 </TabsContent>
                
//                 <TabsContent value="attachments" className="space-y-4">
//                   {selectedFinding.annex_docs.length > 0 ? (
//                     <div className="space-y-3">
//                       {selectedFinding.annex_docs.map((doc) => (
//                         <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
//                           <div className="flex items-center gap-3">
//                             <Paperclip className="h-5 w-5 text-gray-400" />
//                             <div>
//                               <p className="font-medium">{doc.name}</p>
//                               <p className="text-sm text-gray-500">{doc.description}</p>
//                               {doc.size && (
//                                 <p className="text-xs text-gray-400">
//                                   Size: {(doc.size / 1024).toFixed(2)} KB
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                           <Button variant="outline" size="sm">
//                             <Download className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8 text-gray-500">
//                       No attachments available for this finding.
//                     </div>
//                   )}
//                 </TabsContent>
//               </Tabs>
//             </ScrollArea>
//           )}
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };





















import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { 
  FileText, 
  Download, 
  Search, 
  Calendar, 
  Filter,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  Paperclip,
  User as UserIcon,
  Building,
  Target,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { User as UserType } from '@/types/user';

interface NBEReportProps {
  user: UserType;
}

interface AnnexDoc {
  id: string;
  name: string;
  path: string;
  description: string;
  uploaded_at: string;
  content?: string;
  mimeType?: string;
  size?: number;
}

interface NBEReportFinding {
  id: string;
  reference_number: string;
  title: string;
  description: string;
  criteria: string;
  cause: string;
  impact: string;
  recommendation: string;
  risk_level: string | null;
  risk_rating: string | null;
  category: string | null;
  status: string;
  amount: number;
  due_date: string | null;
  created_at: string;
  created_by: {
    username: string;
    email: string;
    department: string;
  };
  auditee_response: string;  // Changed to string
  annex_docs: AnnexDoc[];
}

interface NBEReportResponse {
  success: boolean;
  total: number;
  page: number;
  totalPages: number;
  department: string;
  user_role: string;
  data: NBEReportFinding[];
}

// Helper function to safely format dates
const safeFormatDate = (dateValue: string | null | undefined, formatString: string): string => {
  if (!dateValue) return '-';
  
  try {
    const date = new Date(dateValue);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '-';
    }
    return format(date, formatString);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '-';
  }
};

export const NBEReport = ({ user }: NBEReportProps) => {
  const { api } = useAuth();
  
  if (!user) {
    return <div>Loading...</div>;
  }

  const [findings, setFindings] = useState<NBEReportFinding[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState<NBEReportFinding | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });

  // Filter states
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    category_id: '',
    reference_number: '',
    page: 1,
    limit: 10
  });

  // Fetch NBE Report data
  const fetchNBEReport = async (currentFilters = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value && value !== 'all') params.append(key, value.toString());
      });

      const response = await api.get(`/ZAMS/api/audit-findings/NBE_Report?${params.toString()}`);
      const data: NBEReportResponse = response.data;

      // Debug: Check what auditee_response looks like
      console.log('Sample finding data:', data.data[0]);
      if (data.data[0]) {
        console.log('auditee_response:', data.data[0].auditee_response);
      }

      setFindings(data.data || []);
      setPagination({
        page: data.page || 1,
        totalPages: data.totalPages || 1,
        total: data.total || 0,
        limit: 10
      });
    } catch (error) {
      console.error('Error fetching NBE Report:', error);
      toast.error('Failed to fetch NBE Report data');
      setFindings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNBEReport();
  }, []);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
  };

  // Handle search button click
  const handleSearch = () => {
    fetchNBEReport(filters);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    const clearedFilters = {
      startDate: '',
      endDate: '',
      status: '',
      category_id: '',
      reference_number: '',
      page: 1,
      limit: 10
    };
    setFilters(clearedFilters);
    fetchNBEReport(clearedFilters);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchNBEReport(newFilters);
  };

  // View finding details
  const viewDetails = (finding: NBEReportFinding) => {
    setSelectedFinding(finding);
    setDetailDialogOpen(true);
  };

  // Export to Word with proper document generation and attachments
  const exportToWord = async () => {
    setExportLoading(true);
    try {
      toast.info('Generating report with attachments...');
      
      // Call backend endpoint to generate Word document with attachments
      const response = await api.post('/ZAMS/api/audit-findings/audit-findings/export-word-with-attachments', {
        findings: findings,
        department: user.department,
        includeAttachments: true  // Set to true to get ZIP with attachments
      }, {
        responseType: 'blob',  // Important: tell axios to handle response as blob
        timeout: 60000  // 60 second timeout for large files
      });
      
      // Check if response is a ZIP (with attachments) or just Word doc
      const contentType = response.headers['content-type'];
      const contentDisposition = response.headers['content-disposition'];
      
      // Extract filename from content-disposition header if available
      let filename = `NBE_Report_${format(new Date(), 'yyyy-MM-dd')}`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      // Determine file extension based on content type
      if (contentType && contentType.includes('zip')) {
        // It's a ZIP file with attachments
        filename = filename.endsWith('.zip') ? filename : `${filename}.zip`;
      } else {
        // It's just a Word document
        filename = filename.endsWith('.docx') ? filename : `${filename}.docx`;
      }
      
      // Create blob and trigger download
      const blob = new Blob([response.data], { type: contentType || 'application/octet-stream' });
      
      // Method 1: Using native browser download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Report exported successfully with attachments!');
      
    } catch (error) {
      console.error('Error exporting to Word:', error);
      
      // Provide specific error messages
      if (error.response) {
        // Server responded with error
        if (error.response.status === 500) {
          toast.error('Server error: Failed to generate report. Please try again.');
        } else if (error.response.status === 404) {
          toast.error('Export endpoint not found. Please contact IT support.');
        } else if (error.response.status === 401) {
          toast.error('Authentication required. Please login again.');
        } else {
          toast.error(`Export failed: ${error.response.data?.error || 'Unknown error'}`);
        }
      } else if (error.request) {
        // Request made but no response
        toast.error('No response from server. Please check your connection.');
      } else if (error.code === 'ECONNABORTED') {
        // Timeout
        toast.error('Export timeout. The report may be too large. Try reducing the date range.');
      } else {
        // Other errors
        toast.error('Failed to export report. Please try again.');
      }
    } finally {
      setExportLoading(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Under_Rectification': 'bg-blue-100 text-blue-800',
      'In_Progress': 'bg-purple-100 text-purple-800',
      'Reviewed': 'bg-indigo-100 text-indigo-800',
      'Escalated': 'bg-red-100 text-red-800',
      'Resolved': 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  };

  // Get risk badge
  const getRiskBadge = (level: string | null) => {
    if (!level) return null;
    
    const colors: Record<string, string> = {
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={colors[level] || 'bg-gray-100 text-gray-800'}>
        {level}
      </Badge>
    );
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Check if any filters are active
  const hasActiveFilters = filters.startDate || filters.endDate || filters.status || filters.reference_number;

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">NBE Audit Report</h1>
            <p className="text-gray-600">Comprehensive audit findings report for National Bank of Ethiopia</p>
          </div>
          <Button onClick={exportToWord} disabled={exportLoading || findings.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export to Word
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Findings Report</CardTitle>
          <CardDescription>
            View and export detailed audit findings with rectifications and action plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Reference Number</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by reference..."
                    value={filters.reference_number}
                    onChange={(e) => handleFilterChange('reference_number', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>
              
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>

              <div>
                <Label>Status</Label>
                <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Under_Rectification">Under Rectification</SelectItem>
                    <SelectItem value="In_Progress">In Progress</SelectItem>
                    <SelectItem value="Reviewed">Reviewed</SelectItem>
                    <SelectItem value="Escalated">Escalated</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={handleSearch} className="flex-1 md:flex-none">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              
              {hasActiveFilters && (
                <Button variant="outline" onClick={handleClearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Findings</p>
                    <p className="text-2xl font-bold">{pagination.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Resolved</p>
                    <p className="text-2xl font-bold text-green-600">
                      {findings.filter(f => f.status === 'Resolved').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {findings.filter(f => f.status === 'In_Progress' || f.status === 'Under_Rectification').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {findings.filter(f => f.status === 'Pending').length}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading report data...</div>
            </div>
          ) : findings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No findings found for the selected criteria.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Reference</TableHead>
                      <TableHead className="w-[200px]">Title</TableHead>
                      <TableHead className="w-[150px]">Category</TableHead>
                      <TableHead className="w-[80px]">Risk</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="min-w-[250px] w-[300px]">Response</TableHead>
                      <TableHead className="w-[100px]">Amount</TableHead>
                      <TableHead className="w-[110px]">Created</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {findings.map((finding) => (
                      <TableRow key={finding.id}>
                        <TableCell className="font-medium">
                          {finding.reference_number}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={finding.title}>
                            {finding.title}
                          </div>
                        </TableCell>
                        <TableCell>{finding.category || '-'}</TableCell>
                        <TableCell>{getRiskBadge(finding.risk_level)}</TableCell>
                        <TableCell>{getStatusBadge(finding.status)}</TableCell>
                        <TableCell className="min-w-[250px] max-w-[300px]">
                          <div className="whitespace-normal break-words text-sm">
                            {finding.auditee_response && finding.auditee_response.trim() !== '' 
                              ? finding.auditee_response 
                              : 'No Response Yet'}
                          </div>
                        </TableCell>
                        <TableCell>
                          {finding.amount ? formatCurrency(finding.amount) : '-'}
                        </TableCell>
                        <TableCell>
                          {safeFormatDate(finding.created_at, 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => viewDetails(finding)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {findings.length} of {pagination.total} results
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={pagination.page === 1 ? undefined : () => handlePageChange(pagination.page - 1)}
                          className={pagination.page === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={page === pagination.page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={pagination.page === pagination.totalPages ? undefined : () => handlePageChange(pagination.page + 1)}
                          className={pagination.page === pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Finding Details: {selectedFinding?.reference_number}
            </DialogTitle>
            <DialogDescription>
              Complete details of the audit finding
            </DialogDescription>
          </DialogHeader>
          
          {selectedFinding && (
            <ScrollArea className="h-[60vh] pr-4">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="response">Auditee Response</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Title</h3>
                    <p className="text-gray-700">{selectedFinding.title}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-700">{selectedFinding.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Criteria</h3>
                    <p className="text-gray-700">{selectedFinding.criteria}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Root Cause</h3>
                    <p className="text-gray-700">{selectedFinding.cause}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Impact</h3>
                    <p className="text-gray-700">{selectedFinding.impact}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Recommendation</h3>
                    <p className="text-gray-700">{selectedFinding.recommendation}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Risk Level</h3>
                      {getRiskBadge(selectedFinding.risk_level)}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Status</h3>
                      {getStatusBadge(selectedFinding.status)}
                    </div>
                  </div>
                  
                  {selectedFinding.amount && (
                    <div>
                      <h3 className="font-semibold mb-2">Amount</h3>
                      <p className="text-gray-700">{formatCurrency(selectedFinding.amount)}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-semibold mb-2">Created By</h3>
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-gray-400" />
                      <span>{selectedFinding.created_by.username} ({selectedFinding.created_by.department})</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="response" className="space-y-4">
                  {selectedFinding.auditee_response && selectedFinding.auditee_response !== 'No Response Yet' ? (
                    <>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="font-semibold mb-2 text-blue-900">Auditee Response</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {selectedFinding.auditee_response}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No auditee response has been submitted for this finding.
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="attachments" className="space-y-4">
                  {selectedFinding.annex_docs.length > 0 ? (
                    <div className="space-y-3">
                      {selectedFinding.annex_docs.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Paperclip className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-gray-500">{doc.description}</p>
                              {doc.size && (
                                <p className="text-xs text-gray-400">
                                  Size: {(doc.size / 1024).toFixed(2)} KB
                                </p>
                              )}
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No attachments available for this finding.
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </ScrollArea>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
