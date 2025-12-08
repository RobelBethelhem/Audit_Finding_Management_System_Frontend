// import { useState, useEffect } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
// import { toast } from 'sonner';
// import { Plus, Edit, Trash2, AlertTriangle, Search } from 'lucide-react';
// import {
//   ReferenceDataType,
//   ReferenceDataItem,
//   Category,
//   RiskLevel,
//   RiskRating,
//   SystemVulnerability,
//   ComplianceGap,
//   BusinessComplianceGap,
//   RelevantStandard,
//   CategoryFormData,
//   RiskLevelFormData,
//   RiskRatingFormData,
//   SystemVulnerabilityFormData,
//   ComplianceGapFormData,
//   BusinessComplianceGapFormData,
//   RelevantStandardFormData
// } from '@/types/referenceData';
// import { Branch, BranchFormData } from '@/types/branch';
// import { User } from '@/types/user';

// interface ReferenceDataManagementProps {
//   user: User;
// }

// export const ReferenceDataManagement = ({ user }: ReferenceDataManagementProps) => {
//   const { api } = useAuth();
  
//   // Add null check for user
//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   const [activeTab, setActiveTab] = useState<ReferenceDataType>('categories');
//   const [data, setData] = useState<Record<ReferenceDataType, ReferenceDataItem[]>>({
//     'categories': [],
//     'risk-levels': [],
//     'risk-ratings': [],
//     'system-vulnerabilities': [],
//     'compliance-gaps': [],
//     'business-compliance-gaps': [],
//     'relevant-standards': [],
//     'branches': []
//   });
//   const [loading, setLoading] = useState(false);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editingItem, setEditingItem] = useState<ReferenceDataItem | null>(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState<ReferenceDataItem | null>(null);

//   // Pagination and search states
//   const [pagination, setPagination] = useState<Record<ReferenceDataType, { page: number; totalPages: number; total: number }>>({
//     'categories': { page: 1, totalPages: 1, total: 0 },
//     'risk-levels': { page: 1, totalPages: 1, total: 0 },
//     'risk-ratings': { page: 1, totalPages: 1, total: 0 },
//     'system-vulnerabilities': { page: 1, totalPages: 1, total: 0 },
//     'compliance-gaps': { page: 1, totalPages: 1, total: 0 },
//     'business-compliance-gaps': { page: 1, totalPages: 1, total: 0 },
//     'relevant-standards': { page: 1, totalPages: 1, total: 0 },
//     'branches': { page: 1, totalPages: 1, total: 0 }
//   });
//   const [searchTerms, setSearchTerms] = useState<Record<ReferenceDataType, string>>({
//     'categories': '',
//     'risk-levels': '',
//     'risk-ratings': '',
//     'system-vulnerabilities': '',
//     'compliance-gaps': '',
//     'business-compliance-gaps': '',
//     'relevant-standards': '',
//     'branches': ''
//   });

//   // Form states for different types
//   const [categoryForm, setCategoryForm] = useState<CategoryFormData>({ category_name: '', category_description: '' });
//   const [riskLevelForm, setRiskLevelForm] = useState<RiskLevelFormData>({ risk_level_name: '', risk_level_description: '' });
//   const [riskRatingForm, setRiskRatingForm] = useState<RiskRatingFormData>({ risk_rating_name: '', risk_rating_description: '' });
//   const [vulnerabilityForm, setVulnerabilityForm] = useState<SystemVulnerabilityFormData>({ 
//     vulnerability_name: '', 
//     vulnerability_description: '', 
//     severity_level: 'Medium',
//     affected_systems: ''
//   });
//   const [complianceGapForm, setComplianceGapForm] = useState<ComplianceGapFormData>({
//     gap_name: '',
//     gap_description: '',
//     regulatory_impact: ''
//   });
//   const [businessComplianceGapForm, setBusinessComplianceGapForm] = useState<BusinessComplianceGapFormData>({
//     gap_name: '',
//     gap_description: '',
//     regulatory_impact: ''
//   });
//   const [standardForm, setStandardForm] = useState<RelevantStandardFormData>({
//     standard_name: '',
//     standard_description: '',
//     issuing_body: '',
//     version: ''
//   });

//   const [branchForm, setBranchForm] = useState<BranchFormData>({
//     branch_code: '',
//     branch_name: '',
//     is_active: true
//   });

//   // Tab configuration
//   const tabs = [
//     { id: 'categories' as ReferenceDataType, label: 'Categories', endpoint: 'categories' },
//     { id: 'risk-levels' as ReferenceDataType, label: 'Risk Levels', endpoint: 'risk-levels' },
//     { id: 'risk-ratings' as ReferenceDataType, label: 'Risk Ratings', endpoint: 'risk-ratings' },
//     { id: 'system-vulnerabilities' as ReferenceDataType, label: 'System Vulnerabilities', endpoint: 'vulnerabilities' },
//     { id: 'compliance-gaps' as ReferenceDataType, label: 'Compliance Gaps', endpoint: 'compliance-gaps' },
//     { id: 'business-compliance-gaps' as ReferenceDataType, label: 'Business Compliance Gaps', endpoint: 'business-compliance-gaps' },
//     { id: 'relevant-standards' as ReferenceDataType, label: 'Relevant Standards', endpoint: 'standards' },
//     { id: 'branches' as ReferenceDataType, label: 'Branches', endpoint: 'branches' }
//   ];

//   // Fetch data for a specific type
//   const fetchData = async (type: ReferenceDataType, page: number = 1, search: string = '') => {
//     setLoading(true);
//     try {
//       const endpoint = tabs.find(tab => tab.id === type)?.endpoint;
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: '10',
//         search: search
//       });

//       let response;
//       if (type === 'branches') {
//         // Branches use a different API endpoint structure
//         response = await api.get(`ZAMS/api/branches?${params.toString()}`);
//       } else {
//         response = await api.get(`ZAMS/api/reference-data/${endpoint}?${params.toString()}`);
//       }

//       const responseData = response.data;

//       // Handle different response structures
//       if (type === 'branches') {
//         setData(prev => ({ ...prev, [type]: responseData.branches || [] }));
//         setPagination(prev => ({
//           ...prev,
//           [type]: {
//             page: responseData.pagination?.page || 1,
//             totalPages: responseData.pagination?.totalPages || 1,
//             total: responseData.pagination?.total || 0
//           }
//         }));
//       } else {
//         setData(prev => ({ ...prev, [type]: responseData.data || [] }));
//         setPagination(prev => ({
//           ...prev,
//           [type]: {
//             page: responseData.page || 1,
//             totalPages: responseData.totalPages || 1,
//             total: responseData.total || 0
//           }
//         }));
//       }
//     } catch (error) {
//       console.error(`Error fetching ${type}:`, error);
//       toast.error(`Failed to fetch ${type.replace('-', ' ')}`);
//       setData(prev => ({ ...prev, [type]: [] }));
//       setPagination(prev => ({
//         ...prev,
//         [type]: { page: 1, totalPages: 1, total: 0 }
//       }));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load data when tab changes
//   useEffect(() => {
//     fetchData(activeTab, 1, searchTerms[activeTab]);
//   }, [activeTab]);

//   // Handle search
//   const handleSearch = (type: ReferenceDataType, searchTerm: string) => {
//     setSearchTerms(prev => ({ ...prev, [type]: searchTerm }));
//     fetchData(type, 1, searchTerm);
//   };

//   // Handle pagination
//   const handlePageChange = (type: ReferenceDataType, page: number) => {
//     fetchData(type, page, searchTerms[type]);
//   };

//   // Reset forms
//   const resetForms = () => {
//     setCategoryForm({ category_name: '', category_description: '' });
//     setRiskLevelForm({ risk_level_name: '', risk_level_description: '' });
//     setRiskRatingForm({ risk_rating_name: '', risk_rating_description: '' });
//     setVulnerabilityForm({ vulnerability_name: '', vulnerability_description: '', severity_level: 'Medium', affected_systems: '' });
//     setComplianceGapForm({ gap_name: '', gap_description: '', regulatory_impact: '' });
//     setStandardForm({ standard_name: '', standard_description: '', issuing_body: '', version: '' });
//     setBranchForm({ branch_code: '', branch_name: '', is_active: true });
//   };

//   // Open create dialog
//   const openCreateDialog = () => {
//     setEditingItem(null);
//     resetForms();
//     setDialogOpen(true);
//   };

//   // Open edit dialog
//   const openEditDialog = (item: ReferenceDataItem) => {
//     setEditingItem(item);
    
//     // Populate form based on item type
//     if ('category_name' in item) {
//       setCategoryForm({ category_name: item.category_name, category_description: item.category_description || '' });
//     } else if ('risk_level_name' in item) {
//       setRiskLevelForm({ risk_level_name: item.risk_level_name, risk_level_description: item.risk_level_description || '' });
//     } else if ('risk_rating_name' in item) {
//       setRiskRatingForm({ risk_rating_name: item.risk_rating_name, risk_rating_description: item.risk_rating_description || '' });
//     } else if ('vulnerability_name' in item) {
//       setVulnerabilityForm({ 
//         vulnerability_name: item.vulnerability_name, 
//         vulnerability_description: item.vulnerability_description || '',
//         severity_level: item.severity_level,
//         affected_systems: item.affected_systems || ''
//       });
//     } else if ('gap_name' in item) {
//       // Differentiate between ComplianceGap and BusinessComplianceGap
//       if ('regulatory_impact' in item) {
//         // This is a ComplianceGap
//         setComplianceGapForm({
//           gap_name: item.gap_name,
//           gap_description: item.gap_description || '',
//           regulatory_impact: item.regulatory_impact || ''
//         });
//       } else {
//         // This is a BusinessComplianceGap (both have gap_name and regulatory_impact, but we need to differentiate by context)
//         // Since both ComplianceGap and BusinessComplianceGap have regulatory_impact, we'll use the activeTab to determine which form to populate
//         if (activeTab === 'business-compliance-gaps') {
//           setBusinessComplianceGapForm({
//             gap_name: item.gap_name,
//             gap_description: item.gap_description || '',
//             regulatory_impact: (item as BusinessComplianceGap).regulatory_impact || ''
//           });
//         }
//       }
//     } else if ('standard_name' in item) {
//       setStandardForm({
//         standard_name: item.standard_name,
//         standard_description: item.standard_description || '',
//         issuing_body: item.issuing_body || '',
//         version: item.version || ''
//       });
//     } else if ('branch_code' in item) {
//       setBranchForm({
//         branch_code: item.branch_code,
//         branch_name: item.branch_name,
//         is_active: item.is_active
//       });
//     }
    
//     setDialogOpen(true);
//   };

//   // Get current form data based on active tab
//   const getCurrentFormData = () => {
//     switch (activeTab) {
//       case 'categories': return categoryForm;
//       case 'risk-levels': return riskLevelForm;
//       case 'risk-ratings': return riskRatingForm;
//       case 'system-vulnerabilities': return vulnerabilityForm;
//       case 'compliance-gaps': return complianceGapForm;
//       case 'business-compliance-gaps': return businessComplianceGapForm;
//       case 'relevant-standards': return standardForm;
//       case 'branches': return branchForm;
//       default: return {};
//     }
//   };

//   // Handle create/update
//   const handleSave = async () => {
//     try {
//       const endpoint = tabs.find(tab => tab.id === activeTab)?.endpoint;
//       const formData = getCurrentFormData();

//       if (activeTab === 'branches') {
//         // Branches use different API endpoint
//         if (editingItem) {
//           await api.put(`/ZAMS/api/branches/${editingItem.id}`, formData);
//           toast.success('Branch updated successfully');
//         } else {
//           await api.post('/ZAMS/api/branches', formData);
//           toast.success('Branch created successfully');
//         }
//       } else {
//         // Other reference data types
//         if (editingItem) {
//           await api.put(`/ZAMS/api/reference-data/${endpoint}/${editingItem.id}`, formData);
//           toast.success(`${activeTab.replace('-', ' ')} updated successfully`);
//         } else {
//           await api.post(`/ZAMS/api/reference-data/${endpoint}`, formData);
//           toast.success(`${activeTab.replace('-', ' ')} created successfully`);
//         }
//       }

//       setDialogOpen(false);
//       fetchData(activeTab, pagination[activeTab]?.page || 1, searchTerms[activeTab]);
//     } catch (error) {
//       console.error('Error saving:', error);
//       toast.error(`Failed to save ${activeTab.replace('-', ' ')}`);
//     }
//   };

//   // Handle delete
//   const handleDelete = async () => {
//     if (!itemToDelete) return;

//     try {
//       if (activeTab === 'branches') {
//         // Branches use different API endpoint
//         await api.delete(`ZAMS/api/branches/${itemToDelete.id}`);
//         toast.success('Branch deleted successfully');
//       } else {
//         const endpoint = tabs.find(tab => tab.id === activeTab)?.endpoint;
//         await api.delete(`ZAMS/api/reference-data/${endpoint}/${itemToDelete.id}`);
//         toast.success(`${activeTab.replace('-', ' ')} deleted successfully`);
//       }

//       setDeleteDialogOpen(false);
//       setItemToDelete(null);
//       fetchData(activeTab, pagination[activeTab]?.page || 1, searchTerms[activeTab]);
//     } catch (error: any) {
//       console.error('Error deleting:', error);
//       if (error.response?.data?.error?.includes('in use') || error.response?.data?.error?.includes('assigned')) {
//         toast.error(`Cannot delete ${activeTab.replace('-', ' ')} that is in use`);
//       } else {
//         toast.error(`Failed to delete ${activeTab.replace('-', ' ')}`);
//       }
//     }
//   };

//   // Open delete confirmation
//   const openDeleteDialog = (item: ReferenceDataItem) => {
//     setItemToDelete(item);
//     setDeleteDialogOpen(true);
//   };

//   return (
//     <div className="container mx-auto py-6">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Reference Data Management</h1>
//         <p className="text-gray-600">Manage categories, risk levels, and other reference data used in audit findings</p>
//       </div>

//       <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ReferenceDataType)}>
//         <TabsList className="grid grid-cols-2 md:grid-cols-7 gap-2 mb-6">
//           {tabs.map(tab => (
//             <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
//               {tab.label}
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         {tabs.map(tab => (
//           <TabsContent key={tab.id} value={tab.id}>
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between">
//                 <div>
//                   <CardTitle>{tab.label}</CardTitle>
//                   <CardDescription>
//                     Manage {tab.label.toLowerCase()} used in audit findings
//                   </CardDescription>
//                 </div>
//                 <Button onClick={openCreateDialog}>
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add {tab.label.slice(0, -1)}
//                 </Button>
//               </CardHeader>
//               <CardContent>
//                 {/* Search Input */}
//                 <div className="mb-4">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                     <Input
//                       placeholder={`Search ${tab.label.toLowerCase()}...`}
//                       value={searchTerms[tab.id]}
//                       onChange={(e) => handleSearch(tab.id, e.target.value)}
//                       className="pl-10"
//                     />
//                   </div>
//                 </div>

//                 {loading ? (
//                   <div className="flex items-center justify-center py-8">
//                     <div className="text-gray-500">Loading...</div>
//                   </div>
//                 ) : (
//                   <>
//                     <ReferenceDataTable
//                       data={data[tab.id]}
//                       type={tab.id}
//                       onEdit={openEditDialog}
//                       onDelete={openDeleteDialog}
//                     />

//                     {/* Pagination */}
//                     {pagination[tab.id] && pagination[tab.id].totalPages > 1 && (
//                       <div className="mt-4 flex items-center justify-between">
//                         <div className="text-sm text-gray-500">
//                           Showing {data[tab.id]?.length || 0} of {pagination[tab.id]?.total || 0} results
//                         </div>
//                         <Pagination>
//                           <PaginationContent>
//                             <PaginationItem>
//                               <PaginationPrevious
//                                 onClick={pagination[tab.id]?.page === 1 ? undefined : () => handlePageChange(tab.id, (pagination[tab.id]?.page || 1) - 1)}
//                                 className={pagination[tab.id]?.page === 1 ? "pointer-events-none opacity-50" : ""}
//                               />
//                             </PaginationItem>

//                             {Array.from({ length: pagination[tab.id]?.totalPages || 1 }, (_, i) => i + 1).map((page) => (
//                               <PaginationItem key={page}>
//                                 <PaginationLink
//                                   onClick={() => handlePageChange(tab.id, page)}
//                                   isActive={page === pagination[tab.id]?.page}
//                                 >
//                                   {page}
//                                 </PaginationLink>
//                               </PaginationItem>
//                             ))}

//                             <PaginationItem>
//                               <PaginationNext
//                                 onClick={pagination[tab.id]?.page === pagination[tab.id]?.totalPages ? undefined : () => handlePageChange(tab.id, (pagination[tab.id]?.page || 1) + 1)}
//                                 className={pagination[tab.id]?.page === pagination[tab.id]?.totalPages ? "pointer-events-none opacity-50" : ""}
//                               />
//                             </PaginationItem>
//                           </PaginationContent>
//                         </Pagination>
//                       </div>
//                     )}
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>
//         ))}
//       </Tabs>

//       {/* Create/Edit Dialog */}
//       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>
//               {editingItem ? 'Edit' : 'Create'} {activeTab.replace('-', ' ').slice(0, -1)}
//             </DialogTitle>
//             <DialogDescription>
//               {editingItem ? 'Update the' : 'Add a new'} {activeTab.replace('-', ' ').slice(0, -1).toLowerCase()}
//             </DialogDescription>
//           </DialogHeader>
          
//           <ReferenceDataForm
//             type={activeTab}
//             categoryForm={categoryForm}
//             setCategoryForm={setCategoryForm}
//             riskLevelForm={riskLevelForm}
//             setRiskLevelForm={setRiskLevelForm}
//             riskRatingForm={riskRatingForm}
//             setRiskRatingForm={setRiskRatingForm}
//             vulnerabilityForm={vulnerabilityForm}
//             setVulnerabilityForm={setVulnerabilityForm}
//             complianceGapForm={complianceGapForm}
//             setComplianceGapForm={setComplianceGapForm}
//             businessComplianceGapForm={businessComplianceGapForm}
//             setBusinessComplianceGapForm={setBusinessComplianceGapForm}
//             standardForm={standardForm}
//             setStandardForm={setStandardForm}
//             branchForm={branchForm}
//             setBranchForm={setBranchForm}
//           />
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSave}>
//               {editingItem ? 'Update' : 'Create'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <AlertTriangle className="h-5 w-5 text-red-500" />
//               Confirm Deletion
//             </DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete this {activeTab.replace('-', ' ').slice(0, -1).toLowerCase()}? 
//               This action cannot be undone and may fail if the item is in use by audit findings.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={handleDelete}>
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// // Reference Data Table Component
// interface ReferenceDataTableProps {
//   data: ReferenceDataItem[];
//   type: ReferenceDataType;
//   onEdit: (item: ReferenceDataItem) => void;
//   onDelete: (item: ReferenceDataItem) => void;
// }

// const ReferenceDataTable = ({ data, type, onEdit, onDelete }: ReferenceDataTableProps) => {
//   if (!data || data.length === 0) {
//     return (
//       <div className="text-center py-8 text-gray-500">
//         No {type.replace('-', ' ')} found. Click "Add" to create one.
//       </div>
//     );
//   }

//   const renderTableHeaders = () => {
//     switch (type) {
//       case 'categories':
//         return (
//           <>
//             <TableHead>Name</TableHead>
//             <TableHead>Description</TableHead>
//             <TableHead>Created</TableHead>
//             <TableHead className="w-24">Actions</TableHead>
//           </>
//         );
//       case 'risk-levels':
//         return (
//           <>
//             <TableHead>Name</TableHead>
//             <TableHead>Description</TableHead>
//             <TableHead>Created</TableHead>
//             <TableHead className="w-24">Actions</TableHead>
//           </>
//         );
//       case 'risk-ratings':
//         return (
//           <>
//             <TableHead>Name</TableHead>
//             <TableHead>Description</TableHead>
//             <TableHead>Created</TableHead>
//             <TableHead className="w-24">Actions</TableHead>
//           </>
//         );
//       case 'system-vulnerabilities':
//         return (
//           <>
//             <TableHead>Name</TableHead>
//             <TableHead>Severity</TableHead>
//             <TableHead>Affected Systems</TableHead>
//             <TableHead>Created</TableHead>
//             <TableHead className="w-24">Actions</TableHead>
//           </>
//         );
//       case 'compliance-gaps':
//         return (
//           <>
//             <TableHead>Name</TableHead>
//             <TableHead>Description</TableHead>
//             <TableHead>Regulatory Impact</TableHead>
//             <TableHead>Created</TableHead>
//             <TableHead className="w-24">Actions</TableHead>
//           </>
//         );

//       case 'business-compliance-gaps':
//         return (
//           <>
//             <TableHead>Name</TableHead>
//             <TableHead>Description</TableHead>
//             <TableHead>Regulatory Impact</TableHead>
//             <TableHead>Created</TableHead>
//             <TableHead className="w-24">Actions</TableHead>
//           </>
//         );

//       case 'relevant-standards':
//         return (
//           <>
//             <TableHead>Name</TableHead>
//             <TableHead>Issuing Body</TableHead>
//             <TableHead>Version</TableHead>
//             <TableHead>Created</TableHead>
//             <TableHead className="w-24">Actions</TableHead>
//           </>
//         );
//       case 'branches':
//         return (
//           <>
//             <TableHead>Branch Code</TableHead>
//             <TableHead>Branch Name</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Created</TableHead>
//             <TableHead className="w-24">Actions</TableHead>
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   const renderTableRow = (item: ReferenceDataItem) => {
//     const formatDate = (dateString: string) => {
//       return new Date(dateString).toLocaleDateString();
//     };

//     const getSeverityBadge = (severity: string) => {
//       const colors = {
//         Low: 'bg-green-100 text-green-800',
//         Medium: 'bg-yellow-100 text-yellow-800',
//         High: 'bg-orange-100 text-orange-800',
//         Critical: 'bg-red-100 text-red-800'
//       };
//       return (
//         <Badge className={colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
//           {severity}
//         </Badge>
//       );
//     };

//     switch (type) {
//       case 'categories':
//         const category = item as Category;
//         return (
//           <TableRow key={item.id}>
//             <TableCell className="font-medium">{category.category_name}</TableCell>
//             <TableCell>{category.category_description || '-'}</TableCell>
//             <TableCell>{formatDate(category.createdAt)}</TableCell>
//             <TableCell>
//               <div className="flex gap-2">
//                 <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
//                   <Edit className="h-4 w-4" />
//                 </Button>
//                 <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </TableCell>
//           </TableRow>
//         );
//       case 'risk-levels':
//         const riskLevel = item as RiskLevel;
//         return (
//           <TableRow key={item.id}>
//             <TableCell className="font-medium">{riskLevel.risk_level_name}</TableCell>
//             <TableCell>{riskLevel.risk_level_description || '-'}</TableCell>
//             <TableCell>{formatDate(riskLevel.createdAt)}</TableCell>
//             <TableCell>
//               <div className="flex gap-2">
//                 <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
//                   <Edit className="h-4 w-4" />
//                 </Button>
//                 <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </TableCell>
//           </TableRow>
//         );
//       case 'risk-ratings':
//         const riskRating = item as RiskRating;
//         return (
//           <TableRow key={item.id}>
//             <TableCell className="font-medium">{riskRating.risk_rating_name}</TableCell>
//             <TableCell>{riskRating.risk_rating_description || '-'}</TableCell>
//             <TableCell>{formatDate(riskRating.createdAt)}</TableCell>
//             <TableCell>
//               <div className="flex gap-2">
//                 <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
//                   <Edit className="h-4 w-4" />
//                 </Button>
//                 <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </TableCell>
//           </TableRow>
//         );
//       case 'system-vulnerabilities':
//         const vulnerability = item as SystemVulnerability;
//         return (
//           <TableRow key={item.id}>
//             <TableCell className="font-medium">{vulnerability.vulnerability_name}</TableCell>
//             <TableCell>{getSeverityBadge(vulnerability.severity_level)}</TableCell>
//             <TableCell>{vulnerability.affected_systems || '-'}</TableCell>
//             <TableCell>{formatDate(vulnerability.createdAt)}</TableCell>
//             <TableCell>
//               <div className="flex gap-2">
//                 <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
//                   <Edit className="h-4 w-4" />
//                 </Button>
//                 <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </TableCell>
//           </TableRow>
//         );
//       case 'compliance-gaps':
//         const gap = item as ComplianceGap;
//         return (
//           <TableRow key={item.id}>
//             <TableCell className="font-medium">{gap.gap_name}</TableCell>
//             <TableCell>{gap.gap_description || '-'}</TableCell>
//             <TableCell>{gap.regulatory_impact || '-'}</TableCell>
//             <TableCell>{formatDate(gap.createdAt)}</TableCell>
//             <TableCell>
//               <div className="flex gap-2">
//                 <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
//                   <Edit className="h-4 w-4" />
//                 </Button>
//                 <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </TableCell>
//           </TableRow>
//         );
//       case 'business-compliance-gaps':
//         const businessGap = item as BusinessComplianceGap;
//         return (
//           <TableRow key={item.id}>
//             <TableCell className="font-medium">{businessGap.gap_name}</TableCell>
//             <TableCell>{businessGap.gap_description || '-'}</TableCell>
//             <TableCell>{businessGap.regulatory_impact || '-'}</TableCell>
//             <TableCell>{formatDate(businessGap.createdAt)}</TableCell>
//             <TableCell>
//               <div className="flex gap-2">
//                 <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
//                   <Edit className="h-4 w-4" />
//                 </Button>
//                 <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </TableCell>
//           </TableRow>
//         );
//       case 'relevant-standards':
//         const standard = item as RelevantStandard;
//         return (
//           <TableRow key={item.id}>
//             <TableCell className="font-medium">{standard.standard_name}</TableCell>
//             <TableCell>{standard.issuing_body || '-'}</TableCell>
//             <TableCell>{standard.version || '-'}</TableCell>
//             <TableCell>{formatDate(standard.createdAt)}</TableCell>
//             <TableCell>
//               <div className="flex gap-2">
//                 <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
//                   <Edit className="h-4 w-4" />
//                 </Button>
//                 <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </TableCell>
//           </TableRow>
//         );
//       case 'branches':
//         const branch = item as Branch;
//         return (
//           <TableRow key={item.id}>
//             <TableCell className="font-medium">{branch.branch_code}</TableCell>
//             <TableCell>{branch.branch_name}</TableCell>
//             <TableCell>
//               <Badge className={branch.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
//                 {branch.is_active ? 'Active' : 'Inactive'}
//               </Badge>
//             </TableCell>
//             <TableCell>{formatDate(branch.created_at)}</TableCell>
//             <TableCell>
//               <div className="flex gap-2">
//                 <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
//                   <Edit className="h-4 w-4" />
//                 </Button>
//                 <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </TableCell>
//           </TableRow>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <Table>
//       <TableHeader>
//         <TableRow>
//           {renderTableHeaders()}
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {data.map(renderTableRow)}
//       </TableBody>
//     </Table>
//   );
// };

// // Reference Data Form Component
// interface ReferenceDataFormProps {
//   type: ReferenceDataType;
//   categoryForm: CategoryFormData;
//   setCategoryForm: (form: CategoryFormData) => void;
//   riskLevelForm: RiskLevelFormData;
//   setRiskLevelForm: (form: RiskLevelFormData) => void;
//   riskRatingForm: RiskRatingFormData;
//   setRiskRatingForm: (form: RiskRatingFormData) => void;
//   vulnerabilityForm: SystemVulnerabilityFormData;
//   setVulnerabilityForm: (form: SystemVulnerabilityFormData) => void;
//   complianceGapForm: ComplianceGapFormData;
//   setComplianceGapForm: (form: ComplianceGapFormData) => void;

//   businessComplianceGapForm: BusinessComplianceGapFormData;
//   setBusinessComplianceGapForm: (form: BusinessComplianceGapFormData) => void;
//   standardForm: RelevantStandardFormData;
//   setStandardForm: (form: RelevantStandardFormData) => void;
//   branchForm: BranchFormData;
//   setBranchForm: (form: BranchFormData) => void;
// }

// const ReferenceDataForm = ({
//   type,
//   categoryForm,
//   setCategoryForm,
//   riskLevelForm,
//   setRiskLevelForm,
//   riskRatingForm,
//   setRiskRatingForm,
//   vulnerabilityForm,
//   setVulnerabilityForm,
//   complianceGapForm,
//   setComplianceGapForm,
//   businessComplianceGapForm,
//   setBusinessComplianceGapForm,
//   standardForm,
//   setStandardForm,
//   branchForm,
//   setBranchForm
// }: ReferenceDataFormProps) => {

//   switch (type) {
//     case 'categories':
//       return (
//         <div className="space-y-4">
//           <div>
//             <Label htmlFor="category_name">Category Name *</Label>
//             <Input
//               id="category_name"
//               value={categoryForm.category_name}
//               onChange={(e) => setCategoryForm({ ...categoryForm, category_name: e.target.value })}
//               placeholder="Enter category name"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="category_description">Description</Label>
//             <Textarea
//               id="category_description"
//               value={categoryForm.category_description}
//               onChange={(e) => setCategoryForm({ ...categoryForm, category_description: e.target.value })}
//               placeholder="Enter category description"
//               rows={3}
//             />
//           </div>
//         </div>
//       );

//     case 'risk-levels':
//       return (
//         <div className="space-y-4">
//           <div>
//             <Label htmlFor="risk_level_name">Risk Level Name *</Label>
//             <Input
//               id="risk_level_name"
//               value={riskLevelForm.risk_level_name}
//               onChange={(e) => setRiskLevelForm({ ...riskLevelForm, risk_level_name: e.target.value })}
//               placeholder="Enter risk level name"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="risk_level_description">Description</Label>
//             <Textarea
//               id="risk_level_description"
//               value={riskLevelForm.risk_level_description}
//               onChange={(e) => setRiskLevelForm({ ...riskLevelForm, risk_level_description: e.target.value })}
//               placeholder="Enter risk level description"
//               rows={3}
//             />
//           </div>
//         </div>
//       );

//     case 'risk-ratings':
//       return (
//         <div className="space-y-4">
//           <div>
//             <Label htmlFor="risk_rating_name">Risk Rating Name *</Label>
//             <Input
//               id="risk_rating_name"
//               value={riskRatingForm.risk_rating_name}
//               onChange={(e) => setRiskRatingForm({ ...riskRatingForm, risk_rating_name: e.target.value })}
//               placeholder="Enter risk rating name"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="risk_rating_description">Description</Label>
//             <Textarea
//               id="risk_rating_description"
//               value={riskRatingForm.risk_rating_description}
//               onChange={(e) => setRiskRatingForm({ ...riskRatingForm, risk_rating_description: e.target.value })}
//               placeholder="Enter risk rating description"
//               rows={3}
//             />
//           </div>
//         </div>
//       );

//     case 'system-vulnerabilities':
//       return (
//         <div className="space-y-4">
//           <div>
//             <Label htmlFor="vulnerability_name">Vulnerability Name *</Label>
//             <Input
//               id="vulnerability_name"
//               value={vulnerabilityForm.vulnerability_name}
//               onChange={(e) => setVulnerabilityForm({ ...vulnerabilityForm, vulnerability_name: e.target.value })}
//               placeholder="Enter vulnerability name"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="severity_level">Severity Level *</Label>
//             <Select
//               value={vulnerabilityForm.severity_level}
//               onValueChange={(value: 'Low' | 'Medium' | 'High' | 'Critical') =>
//                 setVulnerabilityForm({ ...vulnerabilityForm, severity_level: value })
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select severity level" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Low">Low</SelectItem>
//                 <SelectItem value="Medium">Medium</SelectItem>
//                 <SelectItem value="High">High</SelectItem>
//                 <SelectItem value="Critical">Critical</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <Label htmlFor="affected_systems">Affected Systems</Label>
//             <Input
//               id="affected_systems"
//               value={vulnerabilityForm.affected_systems}
//               onChange={(e) => setVulnerabilityForm({ ...vulnerabilityForm, affected_systems: e.target.value })}
//               placeholder="Enter affected systems"
//             />
//           </div>
//           <div>
//             <Label htmlFor="vulnerability_description">Description</Label>
//             <Textarea
//               id="vulnerability_description"
//               value={vulnerabilityForm.vulnerability_description}
//               onChange={(e) => setVulnerabilityForm({ ...vulnerabilityForm, vulnerability_description: e.target.value })}
//               placeholder="Enter vulnerability description"
//               rows={3}
//             />
//           </div>
//         </div>
//       );

//     case 'compliance-gaps':
//       return (
//         <div className="space-y-4">
//           <div>
//             <Label htmlFor="gap_name">Gap Name *</Label>
//             <Input
//               id="gap_name"
//               value={complianceGapForm.gap_name}
//               onChange={(e) => setComplianceGapForm({ ...complianceGapForm, gap_name: e.target.value })}
//               placeholder="Enter gap name"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="regulatory_impact">Regulatory Impact</Label>
//             <Input
//               id="regulatory_impact"
//               value={complianceGapForm.regulatory_impact}
//               onChange={(e) => setComplianceGapForm({ ...complianceGapForm, regulatory_impact: e.target.value })}
//               placeholder="Enter regulatory impact"
//             />
//           </div>
//           <div>
//             <Label htmlFor="gap_description">Description</Label>
//             <Textarea
//               id="gap_description"
//               value={complianceGapForm.gap_description}
//               onChange={(e) => setComplianceGapForm({ ...complianceGapForm, gap_description: e.target.value })}
//               placeholder="Enter gap description"
//               rows={3}
//             />
//           </div>
//         </div>
//       );

//     case 'business-compliance-gaps':
//       return (
//         <div className="space-y-4">
//           <div>
//             <Label htmlFor="gap_name">Gap Name *</Label>
//             <Input
//               id="gap_name"
//               value={businessComplianceGapForm.gap_name}
//               onChange={(e) => setBusinessComplianceGapForm({ ...businessComplianceGapForm, gap_name: e.target.value })}
//               placeholder="Enter gap name"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="regulatory_impact">Regulatory Impact</Label>
//             <Input
//               id="regulatory_impact"
//               value={businessComplianceGapForm.regulatory_impact}
//               onChange={(e) => setBusinessComplianceGapForm({ ...businessComplianceGapForm, regulatory_impact: e.target.value })}
//               placeholder="Enter regulatory impact"
//             />
//           </div>
//           <div>
//             <Label htmlFor="gap_description">Description</Label>
//             <Textarea
//               id="gap_description"
//               value={businessComplianceGapForm.gap_description}
//               onChange={(e) => setBusinessComplianceGapForm({ ...businessComplianceGapForm, gap_description: e.target.value })}
//               placeholder="Enter gap description"
//               rows={3}
//             />
//           </div>
//         </div>
//       );

//     case 'relevant-standards':
//       return (
//         <div className="space-y-4">
//           <div>
//             <Label htmlFor="standard_name">Standard Name *</Label>
//             <Input
//               id="standard_name"
//               value={standardForm.standard_name}
//               onChange={(e) => setStandardForm({ ...standardForm, standard_name: e.target.value })}
//               placeholder="Enter standard name"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="issuing_body">Issuing Body</Label>
//             <Input
//               id="issuing_body"
//               value={standardForm.issuing_body}
//               onChange={(e) => setStandardForm({ ...standardForm, issuing_body: e.target.value })}
//               placeholder="Enter issuing body"
//             />
//           </div>
//           <div>
//             <Label htmlFor="version">Version</Label>
//             <Input
//               id="version"
//               value={standardForm.version}
//               onChange={(e) => setStandardForm({ ...standardForm, version: e.target.value })}
//               placeholder="Enter version"
//             />
//           </div>
//           <div>
//             <Label htmlFor="standard_description">Description</Label>
//             <Textarea
//               id="standard_description"
//               value={standardForm.standard_description}
//               onChange={(e) => setStandardForm({ ...standardForm, standard_description: e.target.value })}
//               placeholder="Enter standard description"
//               rows={3}
//             />
//           </div>
//         </div>
//       );

//     case 'branches':
//       return (
//         <div className="space-y-4">
//           <div>
//             <Label htmlFor="branch_code">Branch Code *</Label>
//             <Input
//               id="branch_code"
//               value={branchForm.branch_code}
//               onChange={(e) => setBranchForm({ ...branchForm, branch_code: e.target.value.toUpperCase() })}
//               placeholder="Enter branch code (e.g., BR001)"
//               required
//               maxLength={20}
//             />
//           </div>
//           <div>
//             <Label htmlFor="branch_name">Branch Name *</Label>
//             <Input
//               id="branch_name"
//               value={branchForm.branch_name}
//               onChange={(e) => setBranchForm({ ...branchForm, branch_name: e.target.value })}
//               placeholder="Enter branch name"
//               required
//               maxLength={100}
//             />
//           </div>
//           <div className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               id="is_active"
//               checked={branchForm.is_active}
//               onChange={(e) => setBranchForm({ ...branchForm, is_active: e.target.checked })}
//               className="rounded border-gray-300"
//             />
//             <Label htmlFor="is_active">Active</Label>
//           </div>
//         </div>
//       );

//     default:
//       return <div>Unknown form type</div>;
//   }
// };




import { useState, useEffect } from 'react';

import { useAuth } from '@/hooks/useAuth';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

import { toast } from 'sonner';

import { Plus, Edit, Trash2, AlertTriangle, Search, Database, Shield, AlertCircle, FileText, Building, Target, Layers, BarChart } from 'lucide-react';

import {

  ReferenceDataType,

  ReferenceDataItem,

  Category,

  RiskLevel,

  RiskRating,

  SystemVulnerability,

  ComplianceGap,

  BusinessComplianceGap,

  RelevantStandard,

  CategoryFormData,

  RiskLevelFormData,

  RiskRatingFormData,

  SystemVulnerabilityFormData,

  ComplianceGapFormData,

  BusinessComplianceGapFormData,

  RelevantStandardFormData

} from '@/types/referenceData';

import { Branch, BranchFormData } from '@/types/branch';

import { User } from '@/types/user';



interface ReferenceDataManagementProps {

  user: User;

}



export const ReferenceDataManagement = ({ user }: ReferenceDataManagementProps) => {

  const { api } = useAuth();

  

  // Add null check for user

  if (!user) {

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          <span className="text-gray-600 font-medium">Loading...</span>
        </div>
      </div>
    );

  }



  const [activeTab, setActiveTab] = useState<ReferenceDataType>('categories');

  const [data, setData] = useState<Record<ReferenceDataType, ReferenceDataItem[]>>({

    'categories': [],

    'risk-levels': [],

    'risk-ratings': [],

    'system-vulnerabilities': [],

    'compliance-gaps': [],

    'business-compliance-gaps': [],

    'relevant-standards': [],

    'branches': []

  });

  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingItem, setEditingItem] = useState<ReferenceDataItem | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [itemToDelete, setItemToDelete] = useState<ReferenceDataItem | null>(null);



  // Pagination and search states

  const [pagination, setPagination] = useState<Record<ReferenceDataType, { page: number; totalPages: number; total: number }>>({

    'categories': { page: 1, totalPages: 1, total: 0 },

    'risk-levels': { page: 1, totalPages: 1, total: 0 },

    'risk-ratings': { page: 1, totalPages: 1, total: 0 },

    'system-vulnerabilities': { page: 1, totalPages: 1, total: 0 },

    'compliance-gaps': { page: 1, totalPages: 1, total: 0 },

    'business-compliance-gaps': { page: 1, totalPages: 1, total: 0 },

    'relevant-standards': { page: 1, totalPages: 1, total: 0 },

    'branches': { page: 1, totalPages: 1, total: 0 }

  });

  const [searchTerms, setSearchTerms] = useState<Record<ReferenceDataType, string>>({

    'categories': '',

    'risk-levels': '',

    'risk-ratings': '',

    'system-vulnerabilities': '',

    'compliance-gaps': '',

    'business-compliance-gaps': '',

    'relevant-standards': '',

    'branches': ''

  });



  // Form states for different types

  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({ category_name: '', category_description: '' });

  const [riskLevelForm, setRiskLevelForm] = useState<RiskLevelFormData>({ risk_level_name: '', risk_level_description: '' });

  const [riskRatingForm, setRiskRatingForm] = useState<RiskRatingFormData>({ risk_rating_name: '', risk_rating_description: '' });

  const [vulnerabilityForm, setVulnerabilityForm] = useState<SystemVulnerabilityFormData>({ 

    vulnerability_name: '', 

    vulnerability_description: '', 

    severity_level: 'Medium',

    affected_systems: ''

  });

  const [complianceGapForm, setComplianceGapForm] = useState<ComplianceGapFormData>({

    gap_name: '',

    gap_description: '',

    regulatory_impact: ''

  });

  const [businessComplianceGapForm, setBusinessComplianceGapForm] = useState<BusinessComplianceGapFormData>({

    gap_name: '',

    gap_description: '',

    regulatory_impact: ''

  });

  const [standardForm, setStandardForm] = useState<RelevantStandardFormData>({

    standard_name: '',

    standard_description: '',

    issuing_body: '',

    version: ''

  });



  const [branchForm, setBranchForm] = useState<BranchFormData>({

    branch_code: '',

    branch_name: '',

    is_active: true

  });



  // Tab configuration with icons

  const tabs = [

    { id: 'categories' as ReferenceDataType, label: 'Categories', endpoint: 'categories', icon: Layers, color: 'text-red-600' },

    { id: 'risk-levels' as ReferenceDataType, label: 'Risk Levels', endpoint: 'risk-levels', icon: BarChart, color: 'text-orange-600' },

    { id: 'risk-ratings' as ReferenceDataType, label: 'Risk Ratings', endpoint: 'risk-ratings', icon: Target, color: 'text-yellow-600' },

    { id: 'system-vulnerabilities' as ReferenceDataType, label: 'System Vulnerabilities', endpoint: 'vulnerabilities', icon: Shield, color: 'text-red-600' },

    { id: 'compliance-gaps' as ReferenceDataType, label: 'Compliance Gaps', endpoint: 'compliance-gaps', icon: AlertCircle, color: 'text-purple-600' },

    { id: 'business-compliance-gaps' as ReferenceDataType, label: 'Business Compliance Gaps', endpoint: 'business-compliance-gaps', icon: FileText, color: 'text-blue-600' },

    { id: 'relevant-standards' as ReferenceDataType, label: 'Relevant Standards', endpoint: 'standards', icon: Database, color: 'text-green-600' },

    { id: 'branches' as ReferenceDataType, label: 'Branches', endpoint: 'branches', icon: Building, color: 'text-indigo-600' }

  ];



  // Fetch data for a specific type

  const fetchData = async (type: ReferenceDataType, page: number = 1, search: string = '') => {

    setLoading(true);

    try {

      const endpoint = tabs.find(tab => tab.id === type)?.endpoint;

      const params = new URLSearchParams({

        page: page.toString(),

        limit: '10',

        search: search

      });



      let response;

      if (type === 'branches') {

        // Branches use a different API endpoint structure

        response = await api.get(`ZAMS/api/branches?${params.toString()}`);

      } else {

        response = await api.get(`ZAMS/api/reference-data/${endpoint}?${params.toString()}`);

      }



      const responseData = response.data;



      // Handle different response structures

      if (type === 'branches') {

        setData(prev => ({ ...prev, [type]: responseData.branches || [] }));

        setPagination(prev => ({

          ...prev,

          [type]: {

            page: responseData.pagination?.page || 1,

            totalPages: responseData.pagination?.totalPages || 1,

            total: responseData.pagination?.total || 0

          }

        }));

      } else {

        setData(prev => ({ ...prev, [type]: responseData.data || [] }));

        setPagination(prev => ({

          ...prev,

          [type]: {

            page: responseData.page || 1,

            totalPages: responseData.totalPages || 1,

            total: responseData.total || 0

          }

        }));

      }

    } catch (error) {

      console.error(`Error fetching ${type}:`, error);

      toast.error(`Failed to fetch ${type.replace('-', ' ')}`);

      setData(prev => ({ ...prev, [type]: [] }));

      setPagination(prev => ({

        ...prev,

        [type]: { page: 1, totalPages: 1, total: 0 }

      }));

    } finally {

      setLoading(false);

    }

  };



  // Load data when tab changes

  useEffect(() => {

    fetchData(activeTab, 1, searchTerms[activeTab]);

  }, [activeTab]);



  // Handle search

  const handleSearch = (type: ReferenceDataType, searchTerm: string) => {

    setSearchTerms(prev => ({ ...prev, [type]: searchTerm }));

    fetchData(type, 1, searchTerm);

  };



  // Handle pagination

  const handlePageChange = (type: ReferenceDataType, page: number) => {

    fetchData(type, page, searchTerms[type]);

  };



  // Reset forms

  const resetForms = () => {

    setCategoryForm({ category_name: '', category_description: '' });

    setRiskLevelForm({ risk_level_name: '', risk_level_description: '' });

    setRiskRatingForm({ risk_rating_name: '', risk_rating_description: '' });

    setVulnerabilityForm({ vulnerability_name: '', vulnerability_description: '', severity_level: 'Medium', affected_systems: '' });

    setComplianceGapForm({ gap_name: '', gap_description: '', regulatory_impact: '' });

    setBusinessComplianceGapForm({ gap_name: '', gap_description: '', regulatory_impact: '' });

    setStandardForm({ standard_name: '', standard_description: '', issuing_body: '', version: '' });

    setBranchForm({ branch_code: '', branch_name: '', is_active: true });

  };



  // Open create dialog

  const openCreateDialog = () => {

    setEditingItem(null);

    resetForms();

    setDialogOpen(true);

  };



  // Open edit dialog

  const openEditDialog = (item: ReferenceDataItem) => {

    setEditingItem(item);

    

    // Populate form based on item type

    if ('category_name' in item) {

      setCategoryForm({ category_name: item.category_name, category_description: item.category_description || '' });

    } else if ('risk_level_name' in item) {

      setRiskLevelForm({ risk_level_name: item.risk_level_name, risk_level_description: item.risk_level_description || '' });

    } else if ('risk_rating_name' in item) {

      setRiskRatingForm({ risk_rating_name: item.risk_rating_name, risk_rating_description: item.risk_rating_description || '' });

    } else if ('vulnerability_name' in item) {

      setVulnerabilityForm({ 

        vulnerability_name: item.vulnerability_name, 

        vulnerability_description: item.vulnerability_description || '',

        severity_level: item.severity_level,

        affected_systems: item.affected_systems || ''

      });

    } else if ('gap_name' in item) {

      // Differentiate between ComplianceGap and BusinessComplianceGap

      if (activeTab === 'business-compliance-gaps') {

        setBusinessComplianceGapForm({

          gap_name: item.gap_name,

          gap_description: item.gap_description || '',

          regulatory_impact: (item as BusinessComplianceGap).regulatory_impact || ''

        });

      } else {

        setComplianceGapForm({

          gap_name: item.gap_name,

          gap_description: item.gap_description || '',

          regulatory_impact: item.regulatory_impact || ''

        });

      }

    } else if ('standard_name' in item) {

      setStandardForm({

        standard_name: item.standard_name,

        standard_description: item.standard_description || '',

        issuing_body: item.issuing_body || '',

        version: item.version || ''

      });

    } else if ('branch_code' in item) {

      setBranchForm({

        branch_code: item.branch_code,

        branch_name: item.branch_name,

        is_active: item.is_active

      });

    }

    

    setDialogOpen(true);

  };



  // Get current form data based on active tab

  const getCurrentFormData = () => {

    switch (activeTab) {

      case 'categories': return categoryForm;

      case 'risk-levels': return riskLevelForm;

      case 'risk-ratings': return riskRatingForm;

      case 'system-vulnerabilities': return vulnerabilityForm;

      case 'compliance-gaps': return complianceGapForm;

      case 'business-compliance-gaps': return businessComplianceGapForm;

      case 'relevant-standards': return standardForm;

      case 'branches': return branchForm;

      default: return {};

    }

  };



  // Handle create/update

  const handleSave = async () => {

    try {

      const endpoint = tabs.find(tab => tab.id === activeTab)?.endpoint;

      const formData = getCurrentFormData();



      if (activeTab === 'branches') {

        // Branches use different API endpoint

        if (editingItem) {

          await api.put(`/ZAMS/api/branches/${editingItem.id}`, formData);

          toast.success('Branch updated successfully');

        } else {

          await api.post('/ZAMS/api/branches', formData);

          toast.success('Branch created successfully');

        }

      } else {

        // Other reference data types

        if (editingItem) {

          await api.put(`/ZAMS/api/reference-data/${endpoint}/${editingItem.id}`, formData);

          toast.success(`${activeTab.replace('-', ' ')} updated successfully`);

        } else {

          await api.post(`/ZAMS/api/reference-data/${endpoint}`, formData);

          toast.success(`${activeTab.replace('-', ' ')} created successfully`);

        }

      }



      setDialogOpen(false);

      fetchData(activeTab, pagination[activeTab]?.page || 1, searchTerms[activeTab]);

    } catch (error) {

      console.error('Error saving:', error);

      toast.error(`Failed to save ${activeTab.replace('-', ' ')}`);

    }

  };



  // Handle delete

  const handleDelete = async () => {

    if (!itemToDelete) return;



    try {

      if (activeTab === 'branches') {

        // Branches use different API endpoint

        await api.delete(`ZAMS/api/branches/${itemToDelete.id}`);

        toast.success('Branch deleted successfully');

      } else {

        const endpoint = tabs.find(tab => tab.id === activeTab)?.endpoint;

        await api.delete(`ZAMS/api/reference-data/${endpoint}/${itemToDelete.id}`);

        toast.success(`${activeTab.replace('-', ' ')} deleted successfully`);

      }



      setDeleteDialogOpen(false);

      setItemToDelete(null);

      fetchData(activeTab, pagination[activeTab]?.page || 1, searchTerms[activeTab]);

    } catch (error: any) {

      console.error('Error deleting:', error);

      if (error.response?.data?.error?.includes('in use') || error.response?.data?.error?.includes('assigned')) {

        toast.error(`Cannot delete ${activeTab.replace('-', ' ')} that is in use`);

      } else {

        toast.error(`Failed to delete ${activeTab.replace('-', ' ')}`);

      }

    }

  };



  // Open delete confirmation

  const openDeleteDialog = (item: ReferenceDataItem) => {

    setItemToDelete(item);

    setDeleteDialogOpen(true);

  };



  const activeTabConfig = tabs.find(tab => tab.id === activeTab);

  const IconComponent = activeTabConfig?.icon || Database;



  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">

      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* Header Section */}

        <div className="mb-8 text-center">

          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl mb-4 shadow-lg">

            <Database className="h-8 w-8 text-white" />

          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-700 to-gray-900 bg-clip-text text-transparent mb-2">

            Reference Data Management

          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">

            Manage categories, risk levels, and other reference data used in audit findings with professional precision

          </p>

        </div>



        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ReferenceDataType)} className="space-y-8">

          {/* Enhanced Tab Navigation */}

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2">

            <TabsList className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2 bg-transparent p-0">

              {tabs.map((tab) => {

                const TabIcon = tab.icon;

                return (

                  <TabsTrigger 

                    key={tab.id} 

                    value={tab.id} 

                    className="relative flex flex-col items-center p-4 rounded-xl transition-all duration-300 ease-in-out data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-50 group"

                  >

                    <TabIcon className={`h-5 w-5 mb-2 transition-colors duration-300 ${activeTab === tab.id ? 'text-white' : tab.color}`} />

                    <span className="text-xs font-medium leading-tight text-center group-data-[state=active]:text-white">

                      {tab.label}

                    </span>

                    {activeTab === tab.id && (

                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg animate-pulse" />

                    )}

                  </TabsTrigger>

                );

              })}

            </TabsList>

          </div>



          {/* Content Area */}

          {tabs.map(tab => (

            <TabsContent key={tab.id} value={tab.id} className="mt-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">

              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">

                <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8">

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">

                    <div className="flex items-center space-x-4">

                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">

                        <IconComponent className="h-8 w-8 text-white" />

                      </div>

                      <div>

                        <CardTitle className="text-2xl font-bold text-white">

                          {tab.label}

                        </CardTitle>

                        <CardDescription className="text-red-100 text-base">

                          Manage {tab.label.toLowerCase()} used in audit findings

                        </CardDescription>

                      </div>

                    </div>

                    <Button 

                      onClick={openCreateDialog}

                      className="bg-white text-red-600 hover:bg-red-50 shadow-lg border-0 font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"

                    >

                      <Plus className="h-5 w-5 mr-2" />

                      Add {tab.label.slice(0, -1)}

                    </Button>

                  </div>

                </CardHeader>

                <CardContent className="p-8">

                  {/* Enhanced Search Input */}

                  <div className="mb-8">

                    <div className="relative max-w-md">

                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />

                      <Input

                        placeholder={`Search ${tab.label.toLowerCase()}...`}

                        value={searchTerms[tab.id]}

                        onChange={(e) => handleSearch(tab.id, e.target.value)}

                        className="pl-12 pr-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 bg-white shadow-sm"

                      />

                    </div>

                  </div>



                  {loading ? (

                    <div className="flex items-center justify-center py-16">

                      <div className="flex flex-col items-center space-y-4">

                        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>

                        <div className="text-gray-500 font-medium">Loading {tab.label.toLowerCase()}...</div>

                      </div>

                    </div>

                  ) : (

                    <>

                      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

                        <ReferenceDataTable

                          data={data[tab.id]}

                          type={tab.id}

                          onEdit={openEditDialog}

                          onDelete={openDeleteDialog}

                        />

                      </div>



                      {/* Enhanced Pagination */}

                      {pagination[tab.id] && pagination[tab.id].totalPages > 1 && (

                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 bg-gray-50 rounded-xl p-4">

                          <div className="text-sm text-gray-600 font-medium">

                            Showing <span className="text-red-600 font-bold">{data[tab.id]?.length || 0}</span> of <span className="text-red-600 font-bold">{pagination[tab.id]?.total || 0}</span> results

                          </div>

                          <Pagination>

                            <PaginationContent className="space-x-2">

                              <PaginationItem>

                                <PaginationPrevious

                                  onClick={pagination[tab.id]?.page === 1 ? undefined : () => handlePageChange(tab.id, (pagination[tab.id]?.page || 1) - 1)}

                                  className={`${pagination[tab.id]?.page === 1 ? "pointer-events-none opacity-50" : "hover:bg-red-50 hover:text-red-600"} transition-colors duration-200`}

                                />

                              </PaginationItem>



                              {Array.from({ length: pagination[tab.id]?.totalPages || 1 }, (_, i) => i + 1).map((page) => (

                                <PaginationItem key={page}>

                                  <PaginationLink

                                    onClick={() => handlePageChange(tab.id, page)}

                                    isActive={page === pagination[tab.id]?.page}

                                    className={`${page === pagination[tab.id]?.page ? "bg-red-600 text-white hover:bg-red-700" : "hover:bg-red-50 hover:text-red-600"} transition-colors duration-200`}

                                  >

                                    {page}

                                  </PaginationLink>

                                </PaginationItem>

                              ))}



                              <PaginationItem>

                                <PaginationNext

                                  onClick={pagination[tab.id]?.page === pagination[tab.id]?.totalPages ? undefined : () => handlePageChange(tab.id, (pagination[tab.id]?.page || 1) + 1)}

                                  className={`${pagination[tab.id]?.page === pagination[tab.id]?.totalPages ? "pointer-events-none opacity-50" : "hover:bg-red-50 hover:text-red-600"} transition-colors duration-200`}

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

            </TabsContent>

          ))}

        </Tabs>



        {/* Enhanced Create/Edit Dialog */}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

          <DialogContent className="max-w-md border-0 shadow-2xl rounded-2xl bg-white">

            <DialogHeader className="pb-6 border-b border-gray-100">

              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-3">

                <div className="p-2 bg-red-100 rounded-lg">

                  <IconComponent className="h-6 w-6 text-red-600" />

                </div>

                <span>

                  {editingItem ? 'Edit' : 'Create'} {activeTab.replace('-', ' ').slice(0, -1)}

                </span>

              </DialogTitle>

              <DialogDescription className="text-gray-600 text-base mt-2">

                {editingItem ? 'Update the' : 'Add a new'} {activeTab.replace('-', ' ').slice(0, -1).toLowerCase()} to your system

              </DialogDescription>

            </DialogHeader>

            

            <div className="py-6">

              <ReferenceDataForm

                type={activeTab}

                categoryForm={categoryForm}

                setCategoryForm={setCategoryForm}

                riskLevelForm={riskLevelForm}

                setRiskLevelForm={setRiskLevelForm}

                riskRatingForm={riskRatingForm}

                setRiskRatingForm={setRiskRatingForm}

                vulnerabilityForm={vulnerabilityForm}

                setVulnerabilityForm={setVulnerabilityForm}

                complianceGapForm={complianceGapForm}

                setComplianceGapForm={setComplianceGapForm}

                businessComplianceGapForm={businessComplianceGapForm}

                setBusinessComplianceGapForm={setBusinessComplianceGapForm}

                standardForm={standardForm}

                setStandardForm={setStandardForm}

                branchForm={branchForm}

                setBranchForm={setBranchForm}

              />

            </div>

            

            <DialogFooter className="pt-6 border-t border-gray-100 space-x-3">

              <Button 

                variant="outline" 

                onClick={() => setDialogOpen(false)}

                className="px-6 py-2 border-2 border-gray-300 hover:border-gray-400 rounded-xl transition-all duration-200"

              >

                Cancel

              </Button>

              <Button 

                onClick={handleSave}

                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"

              >

                {editingItem ? 'Update' : 'Create'}

              </Button>

            </DialogFooter>

          </DialogContent>

        </Dialog>



        {/* Enhanced Delete Confirmation Dialog */}

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>

          <DialogContent className="border-0 shadow-2xl rounded-2xl bg-white">

            <DialogHeader className="pb-6">

              <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">

                <div className="p-2 bg-red-100 rounded-lg">

                  <AlertTriangle className="h-6 w-6 text-red-600" />

                </div>

                Confirm Deletion

              </DialogTitle>

              <DialogDescription className="text-gray-600 text-base leading-relaxed mt-3">

                Are you sure you want to delete this {activeTab.replace('-', ' ').slice(0, -1).toLowerCase()}? 

                <br />

                <span className="font-medium text-red-600">This action cannot be undone</span> and may fail if the item is in use by audit findings.

              </DialogDescription>

            </DialogHeader>

            <DialogFooter className="pt-6 space-x-3">

              <Button 

                variant="outline" 

                onClick={() => setDeleteDialogOpen(false)}

                className="px-6 py-2 border-2 border-gray-300 hover:border-gray-400 rounded-xl transition-all duration-200"

              >

                Cancel

              </Button>

              <Button 

                variant="destructive" 

                onClick={handleDelete}

                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"

              >

                Delete

              </Button>

            </DialogFooter>

          </DialogContent>

        </Dialog>

      </div>

    </div>

  );

};



// Enhanced Reference Data Table Component

interface ReferenceDataTableProps {

  data: ReferenceDataItem[];

  type: ReferenceDataType;

  onEdit: (item: ReferenceDataItem) => void;

  onDelete: (item: ReferenceDataItem) => void;

}



const ReferenceDataTable = ({ data, type, onEdit, onDelete }: ReferenceDataTableProps) => {

  if (!data || data.length === 0) {

    return (

      <div className="text-center py-16">

        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">

          <Database className="h-12 w-12 text-gray-400" />

        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">No {type.replace('-', ' ')} found</h3>

        <p className="text-gray-500">Click "Add" to create your first {type.replace('-', ' ').slice(0, -1).toLowerCase()}</p>

      </div>

    );

  }



  const renderTableHeaders = () => {

    switch (type) {

      case 'categories':

        return (

          <>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Name</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Description</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Created</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50 w-24">Actions</TableHead>

          </>

        );

      case 'risk-levels':

        return (

          <>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Name</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Description</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Created</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50 w-24">Actions</TableHead>

          </>

        );

      case 'risk-ratings':

        return (

          <>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Name</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Description</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Created</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50 w-24">Actions</TableHead>

          </>

        );

      case 'system-vulnerabilities':

        return (

          <>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Name</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Severity</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Affected Systems</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Created</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50 w-24">Actions</TableHead>

          </>

        );

      case 'compliance-gaps':

        return (

          <>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Name</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Description</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Regulatory Impact</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Created</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50 w-24">Actions</TableHead>

          </>

        );



      case 'business-compliance-gaps':

        return (

          <>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Name</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Description</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Regulatory Impact</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Created</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50 w-24">Actions</TableHead>

          </>

        );



      case 'relevant-standards':

        return (

          <>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Name</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Issuing Body</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Version</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Created</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50 w-24">Actions</TableHead>

          </>

        );

      case 'branches':

        return (

          <>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Branch Code</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Branch Name</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Status</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50">Created</TableHead>

            <TableHead className="font-bold text-gray-900 bg-gray-50 w-24">Actions</TableHead>

          </>

        );

      default:

        return null;

    }

  };



  const renderTableRow = (item: ReferenceDataItem) => {

    const formatDate = (dateString: string) => {

      return new Date(dateString).toLocaleDateString();

    };



    const getSeverityBadge = (severity: string) => {

      const colors = {

        Low: 'bg-green-100 text-green-800 border-green-200',

        Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',

        High: 'bg-orange-100 text-orange-800 border-orange-200',

        Critical: 'bg-red-100 text-red-800 border-red-200'

      };

      return (

        <Badge className={`${colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'} border font-medium px-3 py-1`}>

          {severity}

        </Badge>

      );

    };



    switch (type) {

      case 'categories':

        const category = item as Category;

        return (

          <TableRow key={item.id} className="hover:bg-red-50/50 transition-colors duration-200">

            <TableCell className="font-semibold text-gray-900">{category.category_name}</TableCell>

            <TableCell className="text-gray-600">{category.category_description || '-'}</TableCell>

            <TableCell className="text-gray-500 text-sm">{formatDate(category.createdAt)}</TableCell>

            <TableCell>

              <div className="flex gap-2">

                <Button 

                  variant="ghost" 

                  size="sm" 

                  onClick={() => onEdit(item)}

                  className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"

                >

                  <Edit className="h-4 w-4" />

                </Button>

                <Button 

                  variant="ghost" 

                  size="sm" 

                  onClick={() => onDelete(item)}

                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"

                >

                  <Trash2 className="h-4 w-4" />

                </Button>

              </div>

            </TableCell>

          </TableRow>

        );

      case 'risk-levels':

        const riskLevel = item as RiskLevel;

        return (

          <TableRow key={item.id} className="hover:bg-red-50/50 transition-colors duration-200">

            <TableCell className="font-semibold text-gray-900">{riskLevel.risk_level_name}</TableCell>

            <TableCell className="text-gray-600">{riskLevel.risk_level_description || '-'}</TableCell>

            <TableCell className="text-gray-500 text-sm">{formatDate(riskLevel.createdAt)}</TableCell>

            <TableCell>

              <div className="flex gap-2">

                <Button 

                  variant="ghost" 

                  size="sm" 

                  onClick={() => onEdit(item)}

                  className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"

                >

                  <Edit className="h-4 w-4" />

                </Button>

                <Button 

                  variant="ghost" 

                  size="sm" 

                  onClick={() => onDelete(item)}

                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"

                >

                  <Trash2 className="h-4 w-4" />

                </Button>

              </div>

            </TableCell>

          </TableRow>

        );

      case 'risk-ratings':

        const riskRating = item as RiskRating;

        return (

          <TableRow key={item.id} className="hover:bg-red-50/50 transition-colors duration-200">

            <TableCell className="font-semibold text-gray-900">{riskRating.risk_rating_name}</TableCell>

            <TableCell className="text-gray-600">{riskRating.risk_rating_description || '-'}</TableCell>

            <TableCell className="text-gray-500 text-sm">{formatDate(riskRating.createdAt)}</TableCell>

            <TableCell>

              <div className="flex gap-2">

                <Button 

                  variant="ghost" 

                  size="sm" 

                  onClick={() => onEdit(item)}

                  className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"

                >

                  <Edit className="h-4 w-4" />

                </Button>

                <Button 

                  variant="ghost" 

                  size="sm" 

                  onClick={() => onDelete(item)}

                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"

                >

                  <Trash2 className="h-4 w-4" />

                </Button>

              </div>

            </TableCell>

          </TableRow>

        );

      case 'system-vulnerabilities':

        const vulnerability = item as SystemVulnerability;

        return (

          <TableRow key={item.id} className="hover:bg-red-50/50 transition-colors duration-200">

            <TableCell className="font-semibold text-gray-900">{vulnerability.vulnerability_name}</TableCell>

            <TableCell>{getSeverityBadge(vulnerability.severity_level)}</TableCell>

            <TableCell className="text-gray-600">{vulnerability.affected_systems || '-'}</TableCell>

            <TableCell className="text-gray-500 text-sm">{formatDate(vulnerability.createdAt)}</TableCell>

            <TableCell>

              <div className="flex gap-2">

                <Button 

                  variant="ghost" 

                  size="sm" 

                  onClick={() => onEdit(item)}

                  className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"

                >

                  <Edit className="h-4 w-4" />

                </Button>

                <Button 

                  variant="ghost" 

                  size="sm" 

                  onClick={() => onDelete(item)}

                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"

                >

                  <Trash2 className="h-4 w-4" />

                </Button>

              </div>

            </TableCell>

          </TableRow>

        );

      case 'compliance-gaps':

        const gap = item as ComplianceGap;

        return (

          <TableRow key={item.id} className="hover:bg-red-50/50 transition-colors duration-200">

            <TableCell className="font-semibold text-gray-900">{gap.gap_name}</TableCell>

            <TableCell className="text-gray-600">{gap.gap_description || '-'}</TableCell>

            <TableCell className="text-gray-600">{gap.regulatory_impact || '-'}</TableCell>

            <TableCell className="text-gray-500 text-sm">{formatDate(gap.createdAt)}</TableCell>

            <TableCell>

              <div className="flex gap-2">

                <Button 

                  variant="ghost" 

                  size="sm" 

                  onClick={() => onEdit(item)}

                  className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"

                >

                  <Edit className="h-4 w-4" />

                </Button>

                <Button 

                  variant="ghost" 

                  size="sm" 

                  onClick={() => onDelete(item)}

                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"

                >

                  <Trash2 className="h-4 w-4" />

                </Button>

              </div>

            </TableCell>

          </TableRow>

        );

      case 'business-compliance-gaps':

        const businessGap = item as BusinessComplianceGap;

        return (

          <TableRow key={item.id} className="hover:bg-red-50/50 transition-colors duration-200">

            <TableCell className="font-semibold text-gray-900">{businessGap.gap_name}</TableCell>

            <TableCell className="text-gray-600">{businessGap.gap_description || '-'}</TableCell>

            <TableCell className="text-gray-600">{businessGap.regulatory_impact || '-'}</TableCell>

            <TableCell className="text-gray-500 text-sm">{formatDate(businessGap.createdAt)}</TableCell>

            <TableCell>

              <div className="flex gap-2">

                <Button 

                  variant="ghost" 

                  size="sm" 

                  onClick={() => onEdit(item)}

                  className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"

                >

                  <Edit className="h-4 w-4" />

                </Button>

                <Button 

                  variant="ghost" 

                  size="sm" 

                  onClick={() => onDelete(item)}

                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"

                >

                  <Trash2 className="h-4 w-4" />

                </Button>

              </div>

            </TableCell>

          </TableRow>

        );

      case 'relevant-standards':

        const standard = item as RelevantStandard;

        return (

          <TableRow key={item.id} className="hover:bg-red-50/50 transition-colors duration-200">

            <TableCell className="font-semibold text-gray-900">{standard.standard_name}</TableCell>

            <TableCell className="text-gray-600">{standard.issuing_body || '-'}</TableCell>

            <TableCell className="text-gray-600">{standard.version || '-'}</TableCell>

            <TableCell className="text-gray-500 text-sm">{formatDate(standard.createdAt)}</TableCell>

            <TableCell>

              <div className="flex gap-2">

                <Button 

                  variant="ghost" 

                  size="sm" 

                  onClick={() => onEdit(item)}

                  className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"

                >

                  <Edit className="h-4 w-4" />

                </Button>

                <Button 

                  variant="ghost" 

                  size="sm" 

                  onClick={() => onDelete(item)}

                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"

                >

                  <Trash2 className="h-4 w-4" />

                </Button>

              </div>

            </TableCell>

          </TableRow>

        );

      case 'branches':

        const branch = item as Branch;

        return (

          <TableRow key={item.id} className="hover:bg-red-50/50 transition-colors duration-200">

            <TableCell className="font-semibold text-gray-900">{branch.branch_code}</TableCell>

            <TableCell className="text-gray-600">{branch.branch_name}</TableCell>

            <TableCell>

              <Badge className={`${branch.is_active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'} border font-medium px-3 py-1`}>

                {branch.is_active ? 'Active' : 'Inactive'}

              </Badge>

            </TableCell>

            <TableCell className="text-gray-500 text-sm">{formatDate(branch.created_at)}</TableCell>

            <TableCell>

              <div className="flex gap-2">

                <Button 

                  variant="ghost" 

                  size="sm" 

                  onClick={() => onEdit(item)}

                  className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"

                >

                  <Edit className="h-4 w-4" />

                </Button>

                <Button 

                  variant="ghost" 

                  size="sm" 

                  onClick={() => onDelete(item)}

                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"

                >

                  <Trash2 className="h-4 w-4" />

                </Button>

              </div>

            </TableCell>

          </TableRow>

        );

      default:

        return null;

    }

  };



  return (

    <Table>

      <TableHeader>

        <TableRow>

          {renderTableHeaders()}

        </TableRow>

      </TableHeader>

      <TableBody>

        {data.map(renderTableRow)}

      </TableBody>

    </Table>

  );

};



// Enhanced Reference Data Form Component

interface ReferenceDataFormProps {

  type: ReferenceDataType;

  categoryForm: CategoryFormData;

  setCategoryForm: (form: CategoryFormData) => void;

  riskLevelForm: RiskLevelFormData;

  setRiskLevelForm: (form: RiskLevelFormData) => void;

  riskRatingForm: RiskRatingFormData;

  setRiskRatingForm: (form: RiskRatingFormData) => void;

  vulnerabilityForm: SystemVulnerabilityFormData;

  setVulnerabilityForm: (form: SystemVulnerabilityFormData) => void;

  complianceGapForm: ComplianceGapFormData;

  setComplianceGapForm: (form: ComplianceGapFormData) => void;

  businessComplianceGapForm: BusinessComplianceGapFormData;

  setBusinessComplianceGapForm: (form: BusinessComplianceGapFormData) => void;

  standardForm: RelevantStandardFormData;

  setStandardForm: (form: RelevantStandardFormData) => void;

  branchForm: BranchFormData;

  setBranchForm: (form: BranchFormData) => void;

}



const ReferenceDataForm = ({

  type,

  categoryForm,

  setCategoryForm,

  riskLevelForm,

  setRiskLevelForm,

  riskRatingForm,

  setRiskRatingForm,

  vulnerabilityForm,

  setVulnerabilityForm,

  complianceGapForm,

  setComplianceGapForm,

  businessComplianceGapForm,

  setBusinessComplianceGapForm,

  standardForm,

  setStandardForm,

  branchForm,

  setBranchForm

}: ReferenceDataFormProps) => {



  switch (type) {

    case 'categories':

      return (

        <div className="space-y-6">

          <div className="space-y-2">

            <Label htmlFor="category_name" className="text-sm font-semibold text-gray-700">Category Name *</Label>

            <Input

              id="category_name"

              value={categoryForm.category_name}

              onChange={(e) => setCategoryForm({ ...categoryForm, category_name: e.target.value })}

              placeholder="Enter category name"

              required

              className="border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200"

            />

          </div>

          <div className="space-y-2">

            <Label htmlFor="category_description" className="text-sm font-semibold text-gray-700">Description</Label>

            <Textarea

              id="category_description"

              value={categoryForm.category_description}

              onChange={(e) => setCategoryForm({ ...categoryForm, category_description: e.target.value })}

              placeholder="Enter category description"

              rows={3}

              className="border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200 resize-none"

            />

          </div>

        </div>

      );



    case 'risk-levels':

      return (

        <div className="space-y-6">

          <div className="space-y-2">

            <Label htmlFor="risk_level_name" className="text-sm font-semibold text-gray-700">Risk Level Name *</Label>

            <Input

              id="risk_level_name"

              value={riskLevelForm.risk_level_name}

              onChange={(e) => setRiskLevelForm({ ...riskLevelForm, risk_level_name: e.target.value })}

              placeholder="Enter risk level name"

              required

              className="border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200"

            />

          </div>

          <div className="space-y-2">

            <Label htmlFor="risk_level_description" className="text-sm font-semibold text-gray-700">Description</Label>

            <Textarea

              id="risk_level_description"

              value={riskLevelForm.risk_level_description}

              onChange={(e) => setRiskLevelForm({ ...riskLevelForm, risk_level_description: e.target.value })}

              placeholder="Enter risk level description"

              rows={3}

              className="border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200 resize-none"

            />

          </div>

        </div>

      );



    case 'risk-ratings':

      return (

        <div className="space-y-6">

          <div className="space-y-2">

            <Label htmlFor="risk_rating_name" className="text-sm font-semibold text-gray-700">Risk Rating Name *</Label>

            <Input

              id="risk_rating_name"

              value={riskRatingForm.risk_rating_name}

              onChange={(e) => setRiskRatingForm({ ...riskRatingForm, risk_rating_name: e.target.value })}

              placeholder="Enter risk rating name"

              required

              className="border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200"

            />

          </div>

          <div className="space-y-2">

            <Label htmlFor="risk_rating_description" className="text-sm font-semibold text-gray-700">Description</Label>

            <Textarea

              id="risk_rating_description"

              value={riskRatingForm.risk_rating_description}

              onChange={(e) => setRiskRatingForm({ ...riskRatingForm, risk_rating_description: e.target.value })}

              placeholder="Enter risk rating description"

              rows={3}

              className="border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200 resize-none"

            />

          </div>

        </div>

      );



    case 'system-vulnerabilities':

      return (

        <div className="space-y-6">

          <div className="space-y-2">

            <Label htmlFor="vulnerability_name" className="text-sm font-semibold text-gray-700">Vulnerability Name *</Label>

            <Input

              id="vulnerability_name"

              value={vulnerabilityForm.vulnerability_name}

              onChange={(e) => setVulnerabilityForm({ ...vulnerabilityForm, vulnerability_name: e.target.value })}

              placeholder="Enter vulnerability name"

              required

              className="border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200"

            />

          </div>

          <div className="space-y-2">

            <Label htmlFor="severity_level" className="text-sm font-semibold text-gray-700">Severity Level *</Label>

            <Select

              value={vulnerabilityForm.severity_level}

              onValueChange={(value: 'Low' | 'Medium' | 'High' | 'Critical') =>

                setVulnerabilityForm({ ...vulnerabilityForm, severity_level: value })

              }

            >

              <SelectTrigger className="border-2 border-gray-200 focus:border-red-500 rounded-lg">

                <SelectValue placeholder="Select severity level" />

              </SelectTrigger>

              <SelectContent>

                <SelectItem value="Low">Low</SelectItem>

                <SelectItem value="Medium">Medium</SelectItem>

                <SelectItem value="High">High</SelectItem>

                <SelectItem value="Critical">Critical</SelectItem>

              </SelectContent>

            </Select>

          </div>

          <div className="space-y-2">

            <Label htmlFor="affected_systems" className="text-sm font-semibold text-gray-700">Affected Systems</Label>

            <Input

              id="affected_systems"

              value={vulnerabilityForm.affected_systems}

              onChange={(e) => setVulnerabilityForm({ ...vulnerabilityForm, affected_systems: e.target.value })}

              placeholder="Enter affected systems"

              className="border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200"

            />

          </div>

          <div className="space-y-2">

            <Label htmlFor="vulnerability_description" className="text-sm font-semibold text-gray-700">Description</Label>

            <Textarea

              id="vulnerability_description"

              value={vulnerabilityForm.vulnerability_description}

              onChange={(e) => setVulnerabilityForm({ ...vulnerabilityForm, vulnerability_description: e.target.value })}

              placeholder="Enter vulnerability description"

              rows={3}

              className="border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200 resize-none"

            />

          </div>

        </div>

      );



    case 'compliance-gaps':

      return (

        <div className="space-y-6">

          <div className="space-y-2">

            <Label htmlFor="gap_name" className="text-sm font-semibold text-gray-700">Gap Name *</Label>

            <Input

              id="gap_name"

              value={complianceGapForm.gap_name}

              onChange={(e) => setComplianceGapForm({ ...complianceGapForm, gap_name: e.target.value })}

              placeholder="Enter gap name"

              required

              className="border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200"

            />

          </div>

          <div className="space-y-2">

            <Label htmlFor="regulatory_impact" className="text-sm font-semibold text-gray-700">Regulatory Impact</Label>

            <Input

              id="regulatory_impact"

              value={complianceGapForm.regulatory_impact}

              onChange={(e) => setComplianceGapForm({ ...complianceGapForm, regulatory_impact: e.target.value })}

              placeholder="Enter regulatory impact"

              className="border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200"

            />

          </div>

          <div className="space-y-2">

            <Label htmlFor="gap_description" className="text-sm font-semibold text-gray-700">Description</Label>

            <Textarea

              id="gap_description"

              value={complianceGapForm.gap_description}

              onChange={(e) => setComplianceGapForm({ ...complianceGapForm, gap_description: e.target.value })}

              placeholder="Enter gap description"

              rows={3}

              className="border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200 resize-none"

            />

          </div>

        </div>

      );



    case 'business-compliance-gaps':

      return (

        <div className="space-y-6">

          <div className="space-y-2">

            <Label htmlFor="gap_name" className="text-sm font-semibold text-gray-700">Gap Name *</Label>

            <Input

              id="gap_name"

              value={businessComplianceGapForm.gap_name}

              onChange={(e) => setBusinessComplianceGapForm({ ...businessComplianceGapForm, gap_name: e.target.value })}

              placeholder="Enter gap name"

              required

              className="border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200"

            />

          </div>

          <div className="space-y-2">

            <Label htmlFor="regulatory_impact" className="text-sm font-semibold text-gray-700">Regulatory Impact</Label>

            <Input

              id="regulatory_impact"

              value={businessComplianceGapForm.regulatory_impact}

              onChange={(e) => setBusinessComplianceGapForm({ ...businessComplianceGapForm, regulatory_impact: e.target.value })}

              placeholder="Enter regulatory impact"

              className="border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200"

            />

          </div>

          <div className="space-y-2">

            <Label htmlFor="gap_description" className="text-sm font-semibold text-gray-700">Description</Label>

            <Textarea

              id="gap_description"

              value={businessComplianceGapForm.gap_description}

              onChange={(e) => setBusinessComplianceGapForm({ ...businessComplianceGapForm, gap_description: e.target.value })}

              placeholder="Enter gap description"

              rows={3}

              className="border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200 resize-none"

            />

          </div>

        </div>

      );



    case 'relevant-standards':

      return (

        <div className="space-y-6">

          <div className="space-y-2">

            <Label htmlFor="standard_name" className="text-sm font-semibold text-gray-700">Standard Name *</Label>

            <Input

              id="standard_name"

              value={standardForm.standard_name}

              onChange={(e) => setStandardForm({ ...standardForm, standard_name: e.target.value })}

              placeholder="Enter standard name"

              required

              className="border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200"

            />

          </div>

          <div className="space-y-2">

            <Label htmlFor="issuing_body" className="text-sm font-semibold text-gray-700">Issuing Body</Label>

            <Input

              id="issuing_body"

              value={standardForm.issuing_body}

              onChange={(e) => setStandardForm({ ...standardForm, issuing_body: e.target.value })}

              placeholder="Enter issuing body"

              className="border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200"

            />

          </div>

          <div className="space-y-2">

            <Label htmlFor="version" className="text-sm font-semibold text-gray-700">Version</Label>

            <Input

              id="version"

              value={standardForm.version}

              onChange={(e) => setStandardForm({ ...standardForm, version: e.target.value })}

              placeholder="Enter version"

              className="border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200"

            />

          </div>

          <div className="space-y-2">

            <Label htmlFor="standard_description" className="text-sm font-semibold text-gray-700">Description</Label>

            <Textarea

              id="standard_description"

              value={standardForm.standard_description}

              onChange={(e) => setStandardForm({ ...standardForm, standard_description: e.target.value })}

              placeholder="Enter standard description"

              rows={3}

              className="border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200 resize-none"

            />

          </div>

        </div>

      );



    case 'branches':

      return (

        <div className="space-y-6">

          <div className="space-y-2">

            <Label htmlFor="branch_code" className="text-sm font-semibold text-gray-700">Branch Code *</Label>

            <Input

              id="branch_code"

              value={branchForm.branch_code}

              onChange={(e) => setBranchForm({ ...branchForm, branch_code: e.target.value.toUpperCase() })}

              placeholder="Enter branch code (e.g., BR001)"

              required

              maxLength={20}

              className="border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200"

            />

          </div>

          <div className="space-y-2">

            <Label htmlFor="branch_name" className="text-sm font-semibold text-gray-700">Branch Name *</Label>

            <Input

              id="branch_name"

              value={branchForm.branch_name}

              onChange={(e) => setBranchForm({ ...branchForm, branch_name: e.target.value })}

              placeholder="Enter branch name"

              required

              maxLength={100}

              className="border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200"

            />

          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">

            <input

              type="checkbox"

              id="is_active"

              checked={branchForm.is_active}

              onChange={(e) => setBranchForm({ ...branchForm, is_active: e.target.checked })}

              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"

            />

            <Label htmlFor="is_active" className="text-sm font-semibold text-gray-700 cursor-pointer">

              Active Branch

            </Label>

          </div>

        </div>

      );



    default:

      return (

        <div className="text-center py-8">

          <div className="text-gray-500">Unknown form type</div>

        </div>

      );

  }

};
