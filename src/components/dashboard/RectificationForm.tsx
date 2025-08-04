import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { FileText, Upload, ArrowLeft, Send } from 'lucide-react';
import { AuditFinding } from '@/types/auditFinding';
import { User } from '@/types/user';

interface RectificationFormProps {
  user: User;
  finding: AuditFinding;
  onSuccess?: () => void;
  onCancel?: () => void;
  isAmendment?: boolean;
}

export const RectificationForm = ({ 
  user, 
  finding, 
  onSuccess, 
  onCancel,
  isAmendment = false 
}: RectificationFormProps) => {
  const { api } = useAuth();
  
  // Add null check for user
  if (!user) {
    return <div>Loading...</div>;
  }

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: ''
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      toast.error('Please provide a description of the rectification');
      return;
    }

    setLoading(true);
    try {
      let endpoint;
      let successMessage;

      if (isAmendment) {
        endpoint = `/api/audit-findings/${finding.id}/rectify/amend`;
        successMessage = 'Rectification amended successfully';
      } else {
        endpoint = `/api/audit-findings/${finding.id}/rectify`;
        successMessage = 'Rectification submitted successfully';
      }

      await api.post(endpoint, { description: formData.description });
      
      toast.success(successMessage);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error submitting rectification:', error);
      const errorMessage = error.response?.data?.error || 'Failed to submit rectification';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex items-center gap-4">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isAmendment ? 'Amend Rectification' : 'Initiate Rectification'}
            </h1>
            <p className="text-gray-600">
              {isAmendment 
                ? 'Update your rectification based on the feedback received'
                : 'Provide details of how you plan to address this audit finding'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {isAmendment ? 'Amendment Details' : 'Rectification Details'}
              </CardTitle>
              <CardDescription>
                {isAmendment 
                  ? 'Provide updated information addressing the rejection feedback'
                  : 'Describe your plan to rectify this audit finding'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="description">
                    {isAmendment ? 'Amendment Description' : 'Rectification Description'} *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={isAmendment 
                      ? "Describe how you've addressed the feedback and updated your rectification plan..."
                      : "Describe your plan to address this finding, including specific actions, timelines, and responsible parties..."
                    }
                    rows={8}
                    required
                    className="min-h-[200px]"
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    Provide detailed information about your rectification plan
                  </div>
                </div>



                <div className="flex justify-end gap-4 pt-6 border-t">
                  {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                      Cancel
                    </Button>
                  )}
                  <Button type="submit" disabled={loading}>
                    <Send className="h-4 w-4 mr-2" />
                    {loading 
                      ? 'Submitting...' 
                      : (isAmendment ? 'Submit Amendment' : 'Submit Rectification')
                    }
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Finding Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Finding Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Title</div>
                <div className="font-medium">{finding.title}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">Description</div>
                <div className="text-sm text-gray-700 line-clamp-3">{finding.description}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">Recommendation</div>
                <div className="text-sm text-gray-700 line-clamp-3">{finding.recommendation}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">Amount</div>
                <div className="font-medium">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'ETB',
                    minimumFractionDigits: 0
                  }).format(finding.amount)}
                </div>
              </div>

              {/* Show rejection reason if this is an amendment */}
              {isAmendment && finding.AuditFindingRectification?.rejection_reason && (
                <div className="border-t pt-4">
                  <div className="text-sm text-red-600 font-medium">Rejection Reason</div>
                  <div className="text-sm text-red-700 mt-1">
                    {finding.AuditFindingRectification.rejection_reason}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guidelines Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-1">Include in your response:</div>
                <ul className="text-gray-600 space-y-1 text-xs">
                  <li>• Specific corrective actions</li>
                  <li>• Implementation timeline</li>
                  <li>• Responsible parties</li>
                  <li>• Preventive measures</li>
                  <li>• Detailed implementation plan</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
