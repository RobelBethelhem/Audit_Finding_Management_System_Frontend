import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProgressCircle } from '@/components/ui/progress-circle';
import { toast } from 'sonner';
import { ActionPlan, ActionPlanProgressUpdateData } from '@/types/actionPlan';

interface ProgressUpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  actionPlan: ActionPlan;
  onProgressUpdate: (data: ActionPlanProgressUpdateData) => Promise<void>;
}

export const ProgressUpdateDialog: React.FC<ProgressUpdateDialogProps> = ({
  isOpen,
  onClose,
  actionPlan,
  onProgressUpdate
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ActionPlanProgressUpdateData>({
    progress_percentage: actionPlan.progress_percentage || 0,
    progress_justification: ''
  });
  const [errors, setErrors] = useState<{
    progress_percentage?: string;
    progress_justification?: string;
  }>({});

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        progress_percentage: actionPlan.progress_percentage || 0,
        progress_justification: ''
      });
      setErrors({});
    }
  }, [isOpen, actionPlan]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (formData.progress_percentage < 0 || formData.progress_percentage > 100) {
      newErrors.progress_percentage = 'Progress percentage must be between 0 and 100';
    }

    if (!formData.progress_justification.trim()) {
      newErrors.progress_justification = 'Progress justification is required';
    } else if (formData.progress_justification.trim().length < 10) {
      newErrors.progress_justification = 'Progress justification must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onProgressUpdate({
        progress_percentage: formData.progress_percentage,
        progress_justification: formData.progress_justification.trim()
      });
      
      toast.success('Progress updated successfully');
      onClose();
    } catch (error: any) {
      console.error('Error updating progress:', error);
      toast.error(error.response?.data?.error || 'Failed to update progress');
    } finally {
      setLoading(false);
    }
  };

  const handlePercentageChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(100, numValue));
    setFormData(prev => ({ ...prev, progress_percentage: clampedValue }));
    
    // Clear error when user starts typing
    if (errors.progress_percentage) {
      setErrors(prev => ({ ...prev, progress_percentage: undefined }));
    }
  };

  const handleJustificationChange = (value: string) => {
    setFormData(prev => ({ ...prev, progress_justification: value }));
    
    // Clear error when user starts typing
    if (errors.progress_justification) {
      setErrors(prev => ({ ...prev, progress_justification: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Action Plan Progress</DialogTitle>
          <DialogDescription>
            Update the progress percentage and provide justification for the change.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Progress Display */}
          <div className="flex items-center justify-center space-x-6 py-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Current Progress</p>
              <ProgressCircle 
                percentage={actionPlan.progress_percentage || 0} 
                size={80}
                showPercentage={true}
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">New Progress</p>
              <ProgressCircle 
                percentage={formData.progress_percentage} 
                size={80}
                showPercentage={true}
              />
            </div>
          </div>

          {/* Progress Percentage Input */}
          <div className="space-y-2">
            <Label htmlFor="progress_percentage">
              Progress Percentage <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="progress_percentage"
                type="number"
                min="0"
                max="100"
                value={formData.progress_percentage}
                onChange={(e) => handlePercentageChange(e.target.value)}
                className={errors.progress_percentage ? 'border-red-500' : ''}
                placeholder="Enter progress percentage (0-100)"
              />
              <span className="text-sm text-gray-500">%</span>
            </div>
            {errors.progress_percentage && (
              <p className="text-sm text-red-500">{errors.progress_percentage}</p>
            )}
          </div>

          {/* Progress Justification */}
          <div className="space-y-2">
            <Label htmlFor="progress_justification">
              Progress Justification <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="progress_justification"
              value={formData.progress_justification}
              onChange={(e) => handleJustificationChange(e.target.value)}
              className={errors.progress_justification ? 'border-red-500' : ''}
              placeholder="Explain the progress made, activities completed, challenges faced, etc."
              rows={4}
            />
            {errors.progress_justification && (
              <p className="text-sm text-red-500">{errors.progress_justification}</p>
            )}
            <p className="text-sm text-gray-500">
              {formData.progress_justification.length}/500 characters
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Progress'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
