import axios from 'axios';
import {
  HealthInfo,
  ModelInfo,
  PredictionRecord,
  PredictionListResponse,
  DashboardStats
} from '../types';

const API_BASE = '/api';

export const api = {
  getHealth: async (): Promise<HealthInfo> => {
    const res = await axios.get<HealthInfo>(`${API_BASE}/health`);
    return res.data;
  },

  getModelInfo: async (): Promise<ModelInfo> => {
    const res = await axios.get<ModelInfo>(`${API_BASE}/model/info`);
    return res.data;
  },

  predictDisease: async (file: File): Promise<PredictionRecord> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post<PredictionRecord>(`${API_BASE}/predict`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  getPredictions: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    disease_class?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<PredictionListResponse> => {
    const res = await axios.get<PredictionListResponse>(`${API_BASE}/predictions`, { params });
    return res.data;
  },

  getPredictionById: async (id: number): Promise<PredictionRecord> => {
    const res = await axios.get<PredictionRecord>(`${API_BASE}/predictions/${id}`);
    return res.data;
  },

  deletePrediction: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/predictions/${id}`);
  },

  getExportCsvUrl: (): string => {
    return `${API_BASE}/predictions/export`;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await axios.get<DashboardStats>(`${API_BASE}/predictions/stats`);
    return res.data;
  }
};
