import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SearchableDropdown } from '@/components/ui/searchable-dropdown';
import { Building2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { branchService, BranchSelectionOption } from '@/services/branchService';
import { User } from '@/types/user';

interface BranchSelectionProps {
  user: User;
  selectedBranchId?: string;
  onBranchSelect: (branchId: string, branch: BranchSelectionOption) => void;
  disabled?: boolean;
  className?: string;
}

export const BranchSelection: React.FC<BranchSelectionProps> = ({
  user,
  selectedBranchId,
  onBranchSelect,
  disabled = false,
  className = ''
}) => {
  // Early return if user is not provided
  if (!user || !user.id || !user.role) {
    return (
      <Card className={className}>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">
            Invalid user information provided
          </div>
        </CardContent>
      </Card>
    );
  }

  const [branches, setBranches] = useState<BranchSelectionOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFixed, setIsFixed] = useState(false);
  const [defaultBranch, setDefaultBranch] = useState<BranchSelectionOption | undefined>();
  const [error, setError] = useState<string | null>(null);

  // Load branches based on user role
  const loadBranches = async () => {
    if (!user?.id || !user?.role) {
      setError('Invalid user information');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await branchService.getBranchesForUser(user);

      // Validate result structure
      if (!result || !Array.isArray(result.branches)) {
        throw new Error('Invalid response structure from branch service');
      }

      setBranches(result.branches);
      setIsFixed(result.isFixed);
      setDefaultBranch(result.defaultBranch);

      // Auto-select default branch if available and no branch is selected
      if (result.defaultBranch && !selectedBranchId && onBranchSelect) {
        onBranchSelect(result.defaultBranch.value, result.defaultBranch);
      }

    } catch (error: any) {
      console.error('Error loading branches:', error);
      const errorMessage = error?.message || 'Failed to load available branches. Please try again.';
      setError(errorMessage);
      toast.error('Failed to load available branches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, [user.id, user.role]);

  // Get role-specific information (memoized to prevent unnecessary re-renders)
  const roleInfo = useMemo(() => {
    switch (user?.role) {
      case 'Resident_Auditors':
        return {
          title: 'Assigned Branch',
          description: 'Your findings will be assigned to your designated branch',
          badgeColor: 'bg-red-100 text-red-800',
          badgeText: 'Fixed Assignment'
        };
      case 'Inspection_Auditors':
        return {
          title: 'Select Branch',
          description: 'Choose from your assigned branches for this audit finding',
          badgeColor: 'bg-red-100 text-red-800',
          badgeText: 'Inspector Assigned'
        };
      case 'IT_Auditors':
        return {
          title: 'Select Branch',
          description: 'Choose any branch for this audit finding',
          badgeColor: 'bg-red-100 text-red-800',
          badgeText: 'Full Access'
        };
      default:
        return {
          title: 'Branch Selection',
          description: 'Select a branch for this audit finding',
          badgeColor: 'bg-gray-100 text-gray-800',
          badgeText: 'Standard'
        };
    }
  }, [user?.role]);

  // Memoize selected branch to prevent unnecessary re-renders
  const selectedBranch = useMemo(() =>
    branches.find(branch => branch.value === selectedBranchId),
    [branches, selectedBranchId]
  );

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Branch Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading branches...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Branch Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-center">
            <div>
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Branches</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={loadBranches} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (branches.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Branch Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-center">
            <div>
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Branches Available</h3>
              <p className="text-gray-600">
                {user.role === 'Resident_Auditors' && 'No branch is assigned to your account. Please contact your administrator.'}
                {user.role === 'Inspection_Auditors' && 'No branches are assigned to you. Please contact your supervisor.'}
                {user.role === 'IT_Auditors' && 'No branches are available in the system.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {roleInfo.title}
          </CardTitle>
          <Badge className={roleInfo.badgeColor}>
            {roleInfo.badgeText}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{roleInfo.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isFixed && defaultBranch ? (
          // Fixed branch selection (Resident_Auditors)
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-black-600" />
              <div>
                <div className="font-medium text-blue-900">{defaultBranch.label}</div>
                <div className="text-sm text-red-700">Automatically assigned to your branch</div>
              </div>
            </div>
          </div>
        ) : (
          // Selectable branch dropdown
          <div className="space-y-2">
            <SearchableDropdown
              options={branches.map(branch => ({
                id: branch.value,
                name: branch.label || `${branch.branch_code} - ${branch.branch_name}`
              }))}
              value={selectedBranchId || ''}
              onValueChange={(value) => {
                const branch = branches.find(b => b.value === value);
                if (branch && onBranchSelect) {
                  onBranchSelect(value, branch);
                }
              }}
              placeholder="Select a branch..."
              searchPlaceholder="Search branches..."
              emptyMessage="No branches found"
              disabled={disabled}
            />
            
            {selectedBranch && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">
                    Selected: <strong>{selectedBranch.label}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Branch count info */}
        <div className="text-xs text-gray-500 pt-2 border-t">
          {branches.length === 1 ? '1 branch available' : `${branches.length} branches available`}
          {user.role === 'Inspection_Auditors' && ' (assigned to you)'}
        </div>
      </CardContent>
    </Card>
  );
};
