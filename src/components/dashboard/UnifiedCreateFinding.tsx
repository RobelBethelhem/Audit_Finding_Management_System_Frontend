//src/components/dashboard/UnifiedCreateFinding.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  FileText,
  Files,
  Zap,
  Users,
  CheckCircle,
  Layers,
  Building2
} from 'lucide-react';
import { AuditFindingForm } from './AuditFindingForm';
import { MultiAuditFindingCreator } from './MultiAuditFindingCreator';
import { BranchSelection } from './BranchSelection';
import { AuditFinding } from '@/types/auditFinding';
import { User } from '@/types/user';
import { BranchSelectionOption } from '@/services/branchService';

type CreationMode = 'selection' | 'single' | 'multiple';

interface UnifiedCreateFindingProps {
  user: User;
  onBack?: () => void;
  onComplete?: (findings: AuditFinding[]) => void;
  initialMode?: CreationMode;
}

export const UnifiedCreateFinding = ({
  user,
  onBack,
  onComplete,
  initialMode = 'selection'
}: UnifiedCreateFindingProps) => {
  const [mode, setMode] = useState<CreationMode>(initialMode);
  const [hasWorkInProgress, setHasWorkInProgress] = useState(false);

  // Branch selection state
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<BranchSelectionOption | null>(null);
  const [branchSelectionRequired, setBranchSelectionRequired] = useState(true);

  // Mode selection options
  const modeOptions = [
    {
      id: 'single' as CreationMode,
      title: 'Single Finding',
      description: 'Create one audit finding at a time',
      icon: FileText,
      color: 'red',
      features: ['Quick creation', 'Simple workflow', 'Immediate save'],
      recommended: 'For individual findings'
    },
    {
      id: 'multiple' as CreationMode,
      title: 'Multiple Findings',
      description: 'Create and manage multiple findings in tabs',
      icon: Files,
      color: 'red',
      features: ['Batch creation', 'Tab management', 'Bulk operations'],
      recommended: 'For audit sessions with multiple findings'
    }
  ];

  // Handle branch selection
  const handleBranchSelect = (branchId: string, branch: BranchSelectionOption) => {
    setSelectedBranchId(branchId);
    setSelectedBranch(branch);
    setBranchSelectionRequired(false);
  };

  // Check if branch selection is required for the user role
  const isBranchSelectionRequired = () => {
    return ['Resident_Auditors', 'Inspection_Auditors', 'IT_Auditors'].includes(user.role);
  };

  const handleModeSwitch = (newMode: CreationMode) => {
    // Check if branch selection is required and not completed
    if (isBranchSelectionRequired() && !selectedBranch && newMode !== 'selection') {
      toast.error('Please select a branch before proceeding');
      return;
    }

    if (hasWorkInProgress) {
      // In a real implementation, you might want to show a confirmation dialog
      toast.info('Switching modes - any unsaved work will be preserved');
    }
    setMode(newMode);
  };

  const handleSingleComplete = (finding: AuditFinding) => {
    // Add branch information to the finding if selected
    const findingWithBranch = selectedBranch ? {
      ...finding,
      branch_id: selectedBranch.value,
      branch: {
        id: selectedBranch.id,
        branch_code: selectedBranch.branch_code,
        branch_name: selectedBranch.branch_name
      }
    } : finding;

    if (onComplete) {
      onComplete([findingWithBranch]);
    }
  };

  const handleMultipleComplete = (findings: AuditFinding[]) => {
    // Add branch information to all findings if selected
    const findingsWithBranch = selectedBranch ? findings.map(finding => ({
      ...finding,
      branch_id: selectedBranch.value,
      branch: {
        id: selectedBranch.id,
        branch_code: selectedBranch.branch_code,
        branch_name: selectedBranch.branch_name
      }
    })) : findings;

    if (onComplete) {
      onComplete(findingsWithBranch);
    }
  };

  // Mode Selection Screen
  if (mode === 'selection') {
    return (
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Audit Finding</h1>
              <p className="text-gray-600">Choose your preferred creation method</p>
            </div>
          </div>
        </div>

        {/* Branch Selection (if required for user role) */}
        {isBranchSelectionRequired() && (
          <BranchSelection
            user={user}
            selectedBranchId={selectedBranchId}
            onBranchSelect={handleBranchSelect}
            className="max-w-4xl"
          />
        )}

        {/* Mode Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          {modeOptions.map((option) => {
            const Icon = option.icon;
            const isDisabled = isBranchSelectionRequired() && !selectedBranch;

            return (
              <Card
                key={option.id}
                className={cn(
                  "relative overflow-hidden transition-all duration-300",
                  isDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:shadow-lg hover:scale-105 hover:-translate-y-1",
                  "border-2",
                  isDisabled ? "border-gray-200" : "hover:border-red-300"
                )}
                onClick={() => handleModeSwitch(option.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-3 rounded-lg",
                      option.color === 'red' ? "bg-red-100 text-red-600" : "bg-purple-100 text-purple-600"
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{option.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {option.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <Badge variant="outline" className={cn(
                      option.color === 'red' ? "bg-blue-50 text-red-700 border-red-200" : "bg-purple-50 text-purple-700 border-purple-200"
                    )}>
                      {option.recommended}
                    </Badge>
                  </div>
                </CardContent>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </Card>
            );
          })}
        </div>

        {/* Branch Selection Required Message */}
        {isBranchSelectionRequired() && !selectedBranch && (
          <Card className="max-w-4xl border-amber-200 bg-amber-50">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-amber-800 font-medium">Branch Selection Required</p>
                  <p className="text-amber-700 text-sm">
                    Please select a branch above before choosing your creation method.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        {/* <Card className="max-w-4xl">
          <CardContent className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Zap className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Quick Setup</div>
                  <div className="text-sm text-gray-600">Start creating immediately</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Team Ready</div>
                  <div className="text-sm text-gray-600">Assign to team members</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Layers className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Flexible</div>
                  <div className="text-sm text-gray-600">Switch modes anytime</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    );
  }

  // Single Finding Mode
  if (mode === 'single') {
    return (
      <div className="container mx-auto py-6 space-y-6">
        {/* Header with Mode Switch */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setMode('selection')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Selection
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Single Audit Finding</h1>
              <p className="text-gray-600">Create one audit finding with focused workflow</p>
            </div>
          </div>
          
          <Button variant="outline" onClick={() => handleModeSwitch('multiple')}>
            <Files className="h-4 w-4 mr-2" />
            Switch to Multiple Mode
          </Button>
        </div>

        {/* Single Finding Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              New Audit Finding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AuditFindingForm
              user={user}
              onSave={handleSingleComplete}
              onCancel={() => setMode('selection')}
              onDataChange={(_data, hasChanges) => setHasWorkInProgress(hasChanges)}
              selectedBranchId={selectedBranchId}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Multiple Findings Mode
  if (mode === 'multiple') {
    return (
      <div className="container mx-auto py-6">
        <MultiAuditFindingCreator
          onBack={() => setMode('selection')}
          onComplete={handleMultipleComplete}
          onSwitchToSingle={() => handleModeSwitch('single')}
          showHeader={true}
          selectedBranchId={selectedBranchId}
        />
      </div>
    );
  }

  return null;
};
