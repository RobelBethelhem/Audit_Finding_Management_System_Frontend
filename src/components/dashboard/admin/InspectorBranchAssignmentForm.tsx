import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SearchableDropdown } from '@/components/ui/searchable-dropdown';
import { toast } from 'sonner';
import {
  InspectorBranchAssignment,
  InspectorBranchAssignmentFormData,
  InspectorOption,
  BranchOption
} from '@/types/inspectorBranchAssignment';
import { inspectorBranchAssignmentService } from '@/services/inspectorBranchAssignmentService';

interface InspectorBranchAssignmentFormProps {
  assignment?: InspectorBranchAssignment;
  onSuccess: () => void;
  onCancel: () => void;
}

export const InspectorBranchAssignmentForm: React.FC<InspectorBranchAssignmentFormProps> = ({
  assignment,
  onSuccess,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [inspectors, setInspectors] = useState<InspectorOption[]>([]);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const isEditing = !!assignment;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    trigger
  } = useForm<InspectorBranchAssignmentFormData>({
    defaultValues: {
      inspector_id: assignment?.inspector_id || '',
      assigned_branch_id: assignment?.branch_id || '', // Use branch_id from backend
      start_date: assignment?.start_date ? assignment.start_date.split('T')[0] : '',
      end_date: assignment?.end_date ? assignment.end_date.split('T')[0] : '',
      is_active: assignment?.is_active ?? true
    },
    mode: 'onChange'
  });

  const watchedValues = watch();

  // Load dropdown options
  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true);
        const [inspectorsData, branchesData] = await Promise.all([
          inspectorBranchAssignmentService.getAvailableInspectors(),
          inspectorBranchAssignmentService.getAvailableBranches()
        ]);
        setInspectors(inspectorsData);
        setBranches(branchesData);
      } catch (error) {
        console.error('Error loading options:', error);
        toast.error('Failed to load form options');
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  // Handle form submission
  const onSubmit = async (data: InspectorBranchAssignmentFormData) => {
    try {
      setLoading(true);

      if (isEditing && assignment) {
        await inspectorBranchAssignmentService.update(assignment.assignment_id, {
          inspector_id: data.inspector_id,
          assigned_branch_id: data.assigned_branch_id,
          start_date: data.start_date,
          end_date: data.end_date,
          is_active: data.is_active
        });
      } else {
        await inspectorBranchAssignmentService.create({
          inspector_id: data.inspector_id,
          assigned_branch_id: data.assigned_branch_id,
          start_date: data.start_date,
          end_date: data.end_date
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving assignment:', error);
      const errorMessage = error.response?.data?.error || 'Failed to save inspector branch assignment';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Convert options for SearchableDropdown
  const inspectorOptions = inspectors.map(inspector => ({
    id: inspector.id,
    name: `${inspector.username} (${inspector.role})`,
    description: `${inspector.email || ''} - ${inspector.department || ''}`
  }));

  const branchOptions = branches.map(branch => ({
    id: branch.id,
    name: `${branch.branch_name} (${branch.branch_code})`,
    description: branch.is_active ? 'Active' : 'Inactive'
  }));

  if (loadingOptions) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form options...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Hidden validation inputs */}
      <input
        type="hidden"
        {...register('inspector_id', { required: 'Inspector selection is required' })}
      />
      <input
        type="hidden"
        {...register('assigned_branch_id', { required: 'Branch selection is required' })}
      />

      {/* Inspector Selection */}
      <div className="space-y-2">
        <Label htmlFor="inspector_id">Inspector *</Label>
        <SearchableDropdown
          options={inspectorOptions}
          value={watchedValues.inspector_id}
          onValueChange={(value) => {
            setValue('inspector_id', value);
            trigger('inspector_id');
          }}
          placeholder="Select an inspector..."
          searchPlaceholder="Search inspectors..."
          emptyMessage="No inspectors found"
          disabled={loading}
        />
        {errors.inspector_id && (
          <p className="text-sm text-red-600">{errors.inspector_id.message}</p>
        )}
      </div>

      {/* Branch Selection */}
      <div className="space-y-2">
        <Label htmlFor="assigned_branch_id">Branch *</Label>
        <SearchableDropdown
          options={branchOptions}
          value={watchedValues.assigned_branch_id}
          onValueChange={(value) => {
            setValue('assigned_branch_id', value);
            trigger('assigned_branch_id');
          }}
          placeholder="Select a branch..."
          searchPlaceholder="Search branches..."
          emptyMessage="No branches found"
          disabled={loading}
        />
        {errors.assigned_branch_id && (
          <p className="text-sm text-red-600">{errors.assigned_branch_id.message}</p>
        )}
      </div>

      {/* Start Date */}
      <div className="space-y-2">
        <Label htmlFor="start_date">Start Date *</Label>
        <Input
          id="start_date"
          type="date"
          {...register('start_date', { required: 'Start date is required' })}
          disabled={loading}
        />
        {errors.start_date && (
          <p className="text-sm text-red-600">{errors.start_date.message}</p>
        )}
      </div>

      {/* End Date */}
      <div className="space-y-2">
        <Label htmlFor="end_date">End Date *</Label>
        <Input
          id="end_date"
          type="date"
          {...register('end_date', {
            required: 'End date is required',
            validate: (value) => {
              const startDate = watchedValues.start_date;
              if (startDate && value && new Date(value) <= new Date(startDate)) {
                return 'End date must be after start date';
              }
              return true;
            }
          })}
          disabled={loading}
        />
        {errors.end_date && (
          <p className="text-sm text-red-600">{errors.end_date.message}</p>
        )}
      </div>

      {/* Active Status (only for editing) */}
      {isEditing && (
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={watchedValues.is_active}
            onCheckedChange={(checked) => setValue('is_active', checked)}
            disabled={loading}
          />
          <Label htmlFor="is_active">Active Assignment</Label>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || !watchedValues.inspector_id || !watchedValues.assigned_branch_id || !watchedValues.start_date || !watchedValues.end_date}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEditing ? 'Update Assignment' : 'Create Assignment'
          )}
        </Button>
      </div>

      {/* Validation Summary */}
      {(errors.inspector_id || errors.assigned_branch_id || errors.start_date || errors.end_date) && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600 font-medium">Please fix the following errors:</p>
          <ul className="text-sm text-red-600 mt-1 list-disc list-inside">
            {errors.inspector_id && <li>Inspector selection is required</li>}
            {errors.assigned_branch_id && <li>Branch selection is required</li>}
            {errors.start_date && <li>Start date is required</li>}
            {errors.end_date && <li>End date is required and must be after start date</li>}
          </ul>
        </div>
      )}
    </form>
  );
};
