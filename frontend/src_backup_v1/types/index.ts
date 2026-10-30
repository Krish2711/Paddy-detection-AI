export interface ProbabilityItem {
  class_name: string;
  probability: number;
}

export interface PredictionRecord {
  id: number;
  filename: string;
  original_filename: string;
  image_url: string;
  predicted_class: string;
  confidence: number;
  probabilities: Record<string, number>;
  ranked_probabilities: ProbabilityItem[];
  is_uncertain?: boolean;
  uncertainty_warning?: string;
  created_at: string;
}

export interface PredictionListResponse {
  total: number;
  page: number;
  page_size: number;
  records: PredictionRecord[];
}

export interface ModelInfo {
  model_loaded: boolean;
  architecture: string;
  classes: string[];
  num_classes: number;
  input_shape: number[];
  accuracy: number | null;
  confusion_matrix: number[][] | null;
  metrics: {
    accuracy?: number;
    training_time_seconds?: number;
    epochs?: number;
    history?: {
      loss: number[];
      accuracy: number[];
      val_loss: number[];
      val_accuracy: number[];
    };
    classification_report?: Record<string, any>;
  } | null;
}

export interface HealthInfo {
  status: string;
  app_name: string;
  version: string;
  model_loaded: boolean;
  database_connected: boolean;
}

export interface DashboardStats {
  total_analyses: number;
  class_distribution: Record<string, number>;
  recent_predictions: PredictionRecord[];
  model_info: ModelInfo;
}

export interface DiseaseDetail {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  symptoms: string[];
  environmentalFactors: string[];
  prevention: string[];
  management: string[];
  whenToSeekExpert: string;
  severity: 'Healthy' | 'Moderate' | 'High' | 'Severe';
  color: string;
}
