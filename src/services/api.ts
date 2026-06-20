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
   * Retrieve a secure JWT authentication token for the Client Portal (Doe Logistics)
   */
  fetchToken: async () => {
    const response = await api.get<{ token: string }>('/api/auth/token');
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
};

export default apiService;
