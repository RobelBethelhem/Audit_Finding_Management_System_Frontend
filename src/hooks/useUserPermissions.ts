import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export interface UserPermissionData {
  assignments: { finding_id: string; assigned_to_id: string; assigned_at: string }[];
  actionPlanResponsibilities: { action_plan_id: string; audit_finding_id: string; user_id: string }[];
  escalations: { audit_finding_id: string; escalated_to_id: string; escalation_level: number }[];
  loading: boolean;
  error: string | null;
}

export const useUserPermissions = () => {
  const { api, user } = useAuth();
  const [data, setData] = useState<UserPermissionData>({
    assignments: [],
    actionPlanResponsibilities: [],
    escalations: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!user || !api) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchUserPermissionData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // Fetch all permission-related data in parallel
        const [assignmentsResponse, responsibilitiesResponse, escalationsResponse] = await Promise.all([
          api.get('/api/audit-findings/user-assignments'),
          api.get('/api/action-plans/user-responsibilities'),
          api.get('/api/audit-findings/user-escalations')
        ]);

        setData({
          assignments: assignmentsResponse.data || [],
          actionPlanResponsibilities: responsibilitiesResponse.data || [],
          escalations: escalationsResponse.data || [],
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching user permission data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch user permission data'
        }));
      }
    };

    fetchUserPermissionData();
  }, [user, api]);

  return data;
};
