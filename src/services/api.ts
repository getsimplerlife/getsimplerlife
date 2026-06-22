import axios from 'axios';

// Create a configured axios instance
const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  needs: string[];
  message: string;
}

export interface MetricKPIs {
  hoursSavedThisMonth: number;
  leadsProcessed: number;
  avgResponseTimeMinutes: number;
  targetResponseReductionPercent: number;
}

export interface MetricHistory {
  week: string;
  hoursSaved: number;
}

export interface MetricsResponse {
  client: string;
  activeWorkflows: number;
  kpis: MetricKPIs;
  history: MetricHistory[];
}

export const apiService = {
  /**
   * Submit a lead inquiry to the backend
   */
  submitLead: async (formData: LeadFormData) => {
    const response = await api.post('/api/leads', formData);
    return response.data;
  },

  /**
   * Retrieve a secure JWT authentication token for the Client Portal (personalized with email)
   */
  fetchToken: async (email?: string) => {
    const url = email ? `/api/auth/token?email=${encodeURIComponent(email)}` : '/api/auth/token';
    const response = await api.get<{ token: string }>(url);
    return response.data.token;
  },

  /**
   * Fetch live KPI metrics using JWT authorization
   */
  fetchMetrics: async (token: string) => {
    const response = await api.get<MetricsResponse>('/api/metrics', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Fetch all scheduled bookings
   */
  fetchBookings: async () => {
    const response = await api.get<{ success: boolean; bookings: { date: string; time: string }[] }>('/api/bookings');
    return response.data;
  },

  /**
   * Fetch all leads (Admin only)
   */
  fetchAdminLeads: async () => {
    const response = await api.get<{ success: boolean; leads: any[] }>('/api/admin/leads');
    return response.data;
  },

  /**
   * Trigger report generation for a lead (Admin only)
   */
  generateReport: async (leadId: string) => {
    const response = await api.post<{ success: boolean; message: string; htmlReport?: string }>('/api/admin/generate-report', { leadId });
    return response.data;
  },
};

export default apiService;
