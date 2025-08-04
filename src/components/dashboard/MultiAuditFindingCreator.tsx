import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Plus,
  Save,
  ArrowLeft,
  FileText,
  CheckCircle,
  X,
} from 'lucide-react';
import { AuditFindingForm } from './AuditFindingForm';
import { AuditFinding, AuditFindingFormData } from '@/types/auditFinding';

interface FindingTab {
  id: string;
  title: string;
  status: 'draft' | 'saved';
  formData: AuditFindingFormData | null;
  savedFindingId?: string;
  hasChanges: boolean;
  selectedFiles: File[];
  existingFiles: any[];
}

interface MultiAuditFindingCreatorProps {
  onBack?: () => void;
  onComplete?: (findings: AuditFinding[]) => void;
  onSwitchToSingle?: () => void;
  className?: string;
  showHeader?: boolean;
  selectedBranchId?: string; // Branch ID from role-based branch selection
}

const createEmptyFormData = (): AuditFindingFormData => ({
  title: '',
  description: '',
  criteria: '',
  cause: '',
  impact: '',
  recommendation: '',
  amount: 0,
  risk_level_id: '',
  category_id: '',
  risk_rating_id: '',
  vulnerability_id: '',
  compliance_gap_id: '',
  standard_id: '',
  status: 'Pending',
  due_date: ''
});

export const MultiAuditFindingCreator = ({
  onBack,
  onComplete,
  onSwitchToSingle,
  className,
  showHeader = true,
  selectedBranchId
}: MultiAuditFindingCreatorProps) => {
  const { user, api } = useAuth();

  // Simple state management
  const [tabs, setTabs] = useState<FindingTab[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [nextTabId, setNextTabId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tabToDelete, setTabToDelete] = useState<string>('');
  const [savedFindings, setSavedFindings] = useState<AuditFinding[]>([]);

  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Initialize with first tab
  useEffect(() => {
    // console.log('🚀 MultiAuditFindingCreator: Initializing with first tab');
    createNewTab();
  }, []);

  // Create new tab with empty data
  const createNewTab = () => {
    const newTabId = `tab-${nextTabId}`;
    const newTab: FindingTab = {
      id: newTabId,
      title: `Finding ${nextTabId}`,
      status: 'draft',
      formData: createEmptyFormData(),
      hasChanges: false,
      selectedFiles: [],
      existingFiles: []
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTab(newTabId);
    setNextTabId(prev => prev + 1);

    // Scroll new tab into view
    setTimeout(() => scrollTabIntoView(newTabId), 100);
  };

  // Update tab data with stable callback
  const updateTabData = useCallback((tabId: string, formData: AuditFindingFormData, hasChanges: boolean = true) => {
    // console.log(`🔄 MultiAuditFindingCreator: Updating tab ${tabId} data`);
    setTabs(prev => prev.map(tab =>
      tab.id === tabId
        ? {
            ...tab,
            formData,
            hasChanges,
            title: formData.title ? `${formData.title.substring(0, 20)}${formData.title.length > 20 ? '...' : ''}` : tab.title
          }
        : tab
    ));
  }, []);

  // Update tab files with stable callback
  const updateTabFiles = useCallback((tabId: string, selectedFiles: File[], existingFiles: any[] = []) => {
    // console.log(`📁 MultiAuditFindingCreator: Updating tab ${tabId} files`);
    setTabs(prev => prev.map(tab =>
      tab.id === tabId
        ? { ...tab, selectedFiles, existingFiles }
        : tab
    ));
  }, []);

  // Save individual finding
  const saveFinding = async (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab || !tab.formData) {
      toast.error('No data to save');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      // Add form fields
      Object.entries(tab.formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // Add selected branch ID if available
      if (selectedBranchId) {
        formData.append('branch_id', selectedBranchId);
        console.log('🏢 Adding branch_id to FormData:', selectedBranchId);
      }

      // Add files
      tab.selectedFiles.forEach((file) => {
        formData.append('evidence_files', file);
      });

      // Log FormData contents for debugging
      console.log('🚀 MultiAuditFindingCreator: Submitting FormData with:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: [File] ${value.name}`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      let response;
      if (tab.savedFindingId) {
        // Update existing finding
        response = await api.put(`/api/audit-findings/${tab.savedFindingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Create new finding
        response = await api.post('/api/audit-findings', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      // Update tab status
      setTabs(prev => prev.map(t => 
        t.id === tabId 
          ? { 
              ...t, 
              status: 'saved' as const,
              savedFindingId: response.data.id,
              hasChanges: false,
              selectedFiles: [], // Clear selected files after save
              existingFiles: response.data.evidences || []
            }
          : t
      ));

      // Update saved findings list
      setSavedFindings(prev => {
        const existing = prev.find(f => f.id === response.data.id);
        if (existing) {
          return prev.map(f => f.id === response.data.id ? response.data : f);
        } else {
          return [...prev, response.data];
        }
      });

      toast.success(tab.savedFindingId ? 'Finding updated successfully' : 'Finding saved successfully');
    } catch (error) {
      console.error('Error saving finding:', error);
      toast.error('Failed to save finding');
    } finally {
      setLoading(false);
    }
  };

  // Delete tab
  const deleteTab = (tabId: string) => {
    if (tabs.length === 1) {
      toast.error('Cannot delete the last tab');
      return;
    }

    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      
      // If deleting active tab, switch to another tab
      if (activeTab === tabId && newTabs.length > 0) {
        setActiveTab(newTabs[0].id);
      }
      
      return newTabs;
    });
    
    setDeleteDialogOpen(false);
    setTabToDelete('');
  };

  // Scroll tab into view
  const scrollTabIntoView = (tabId: string) => {
    const tabElement = document.querySelector(`[data-tab-id="${tabId}"]`);
    if (tabElement && tabsContainerRef.current) {
      tabElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  };

  // Get current tab with memoization
  const currentTab = useMemo(() =>
    tabs.find(tab => tab.id === activeTab),
    [tabs, activeTab]
  );

  // Create stable callback functions for the current tab with debouncing
  const currentTabDataCallback = useCallback((formData: AuditFindingFormData, hasChanges: boolean) => {
    if (currentTab && currentTab.id) {
      // Only update if the data has actually changed
      const currentFormDataString = JSON.stringify(currentTab.formData);
      const newFormDataString = JSON.stringify(formData);

      if (currentFormDataString !== newFormDataString || currentTab.hasChanges !== hasChanges) {
        updateTabData(currentTab.id, formData, hasChanges);
      }
    }
  }, [currentTab?.id, currentTab?.formData, currentTab?.hasChanges, updateTabData]);

  const currentTabFilesCallback = useCallback((selectedFiles: File[], existingFiles: any[]) => {
    if (currentTab && currentTab.id) {
      // Only update if the files have actually changed
      const currentSelectedCount = currentTab.selectedFiles?.length || 0;
      const currentExistingCount = currentTab.existingFiles?.length || 0;
      const newSelectedCount = selectedFiles?.length || 0;
      const newExistingCount = existingFiles?.length || 0;

      if (currentSelectedCount !== newSelectedCount || currentExistingCount !== newExistingCount) {
        updateTabFiles(currentTab.id, selectedFiles, existingFiles);
      }
    }
  }, [currentTab?.id, currentTab?.selectedFiles?.length, currentTab?.existingFiles?.length, updateTabFiles]);

  // Handle complete
  const handleComplete = () => {
    if (onComplete) {
      onComplete(savedFindings);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string, hasChanges: boolean) => {
    if (status === 'saved' && !hasChanges) {
      return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Saved</Badge>;
    }
    if (hasChanges) {
      return <Badge variant="secondary">Modified</Badge>;
    }
    return <Badge variant="outline">Draft</Badge>;
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Header */}
      {showHeader && (
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {onBack && (
                  <Button variant="outline" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
                <div>
                  <CardTitle>Create Multiple Audit Findings</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Work on multiple findings simultaneously using tabs
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onSwitchToSingle && (
                  <Button variant="outline" onClick={onSwitchToSingle}>
                    <FileText className="h-4 w-4 mr-2" />
                    Single Mode
                  </Button>
                )}
                <Button variant="outline" onClick={createNewTab}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Finding
                </Button>
                {savedFindings.length > 0 && (
                  <Button onClick={handleComplete}>
                    Complete ({savedFindings.length})
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Tabs and Content */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="p-0 flex-1 flex flex-col">
          {/* Tab Navigation */}
          <div className="border-b bg-gray-50/50">
            <div className="flex items-center">
              <div
                ref={tabsContainerRef}
                className="flex-1 overflow-x-auto"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex min-w-max">
                  {tabs.map((tab) => (
                    <div
                      key={tab.id}
                      data-tab-id={tab.id}
                      className={cn(
                        "flex items-center gap-2 px-4 py-3 border-r cursor-pointer transition-colors min-w-[200px]",
                        activeTab === tab.id
                          ? "bg-white border-b-2 border-blue-500"
                          : "hover:bg-gray-100"
                      )}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{tab.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(tab.status, tab.hasChanges)}
                        </div>
                      </div>
                      {tabs.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-red-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTabToDelete(tab.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {currentTab && (
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">{currentTab.title}</h2>
                  {getStatusBadge(currentTab.status, currentTab.hasChanges)}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => saveFinding(currentTab.id)}
                    disabled={loading || !currentTab.formData}
                    variant={currentTab.hasChanges ? "default" : "outline"}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : currentTab.savedFindingId ? 'Update' : 'Save'}
                  </Button>
                </div>
              </div>

              {/* Form */}
              <div className="bg-gray-50/50 rounded-lg p-6">
                {currentTab && (
                  <AuditFindingForm
                    key={`form-${currentTab.id}`} // Unique key for each tab
                    user={user}
                    initialFormData={currentTab.formData}
                    initialSelectedFiles={currentTab.selectedFiles || []}
                    initialExistingFiles={currentTab.existingFiles || []}
                    onDataChange={currentTabDataCallback}
                    onFilesChange={currentTabFilesCallback}
                    hideActions={true}
                    selectedBranchId={selectedBranchId}
                  />
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tab</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this tab? Any unsaved changes will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTab(tabToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
