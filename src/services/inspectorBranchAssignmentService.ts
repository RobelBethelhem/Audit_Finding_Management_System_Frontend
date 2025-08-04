import api from './api';
import {
  InspectorBranchAssignment,
  CreateInspectorBranchAssignmentRequest,
  UpdateInspectorBranchAssignmentRequest,
  InspectorBranchAssignmentResponse,
  AssignmentApiResponse,
  DeleteAssignmentApiResponse,
  InspectorOption,
  BranchOption
} from '@/types/inspectorBranchAssignment';

// Filter parameters interface
export interface AssignmentFilters {
  search?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
}

export const inspectorBranchAssignmentService = {
  // Get all inspector branch assignments with filtering
  async getAll(page = 1, limit = 10, filters: AssignmentFilters = {}): Promise<InspectorBranchAssignmentResponse> {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      // Add filter parameters if they exist
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.startDateFrom) {
        params.append('start_date_from', filters.startDateFrom);
      }
      if (filters.startDateTo) {
        params.append('start_date_to', filters.startDateTo);
      }
      if (filters.endDateFrom) {
        params.append('end_date_from', filters.endDateFrom);
      }
      if (filters.endDateTo) {
        params.append('end_date_to', filters.endDateTo);
      }

      const response = await api.get(
        `/api/inspector-branch-assignments?${params.toString()}`
      );

      // Debug logging for API service
      console.log('🔍 Service API URL:', `/api/inspector-branch-assignments?${params.toString()}`);
      console.log('🔍 Service raw response:', response);
      console.log('🔍 Service response data:', response.data);

      return response.data;
    } catch (error) {
      console.error('Error fetching inspector branch assignments:', error);
      throw error;
    }
  },

  // Get inspector branch assignment by ID
  async getById(id: string): Promise<InspectorBranchAssignment> {
    try {
      const response = await api.get(
        `/api/inspector-branch-assignments/${id}`
      );
      return response.data.assignment;
    } catch (error) {
      console.error('Error fetching inspector branch assignment:', error);
      throw error;
    }
  },

  // Create new inspector branch assignment
  async create(data: CreateInspectorBranchAssignmentRequest): Promise<AssignmentApiResponse> {
    try {
      const response = await api.post(
        `/api/inspector-branch-assignments`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error creating inspector branch assignment:', error);
      throw error;
    }
  },

  // Update inspector branch assignment
  async update(id: string, data: UpdateInspectorBranchAssignmentRequest): Promise<AssignmentApiResponse> {
    try {
      const response = await api.put(
        `/api/inspector-branch-assignments/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error updating inspector branch assignment:', error);
      throw error;
    }
  },

  // Delete inspector branch assignment
  async delete(id: string): Promise<DeleteAssignmentApiResponse> {
    try {
      const response = await api.delete(
        `/api/inspector-branch-assignments/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting inspector branch assignment:', error);
      throw error;
    }
  },

  // Get available inspectors for assignment
  async getAvailableInspectors(): Promise<InspectorOption[]> {
    try {
      const response = await api.get(
        `/api/inspector-branch-assignments/available-inspectors`
      );
      return response.data.inspectors;
    } catch (error) {
      console.error('Error fetching available inspectors:', error);
      throw error;
    }
  },

  // Get available branches for assignment
  async getAvailableBranches(): Promise<BranchOption[]> {
    try {
      const response = await api.get(
        `/api/inspector-branch-assignments/available-branches`
      );
      return response.data.branches;
    } catch (error) {
      console.error('Error fetching available branches:', error);
      throw error;
    }
  },

  // Get assignments by inspector ID
  async getByInspectorId(inspectorId: string): Promise<InspectorBranchAssignment[]> {
    try {
      const response = await api.get(
        `/api/inspector-branch-assignments/inspector/${inspectorId}`
      );
      return response.data.assignments;
    } catch (error) {
      console.error('Error fetching assignments by inspector:', error);
      throw error;
    }
  },

  // Get assignments by branch ID
  async getByBranchId(branchId: string): Promise<InspectorBranchAssignment[]> {
    try {
      const response = await api.get(
        `/api/inspector-branch-assignments/branch/${branchId}`
      );
      return response.data.assignments;
    } catch (error) {
      console.error('Error fetching assignments by branch:', error);
      throw error;
    }
  }
};
