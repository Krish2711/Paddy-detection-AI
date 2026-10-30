from typing import Dict, List, Optional
from pydantic import BaseModel, Field

class ProbabilityItem(BaseModel):
    class_name: str
    probability: float

class PredictionResponse(BaseModel):
    id: int
    filename: str
    original_filename: str
    image_url: str
    predicted_class: str
    confidence: float
    probabilities: Dict[str, float]
    ranked_probabilities: List[ProbabilityItem]
    is_uncertain: Optional[bool] = False
    uncertainty_warning: Optional[str] = None
    created_at: str

class PredictionListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    records: List[PredictionResponse]

class ModelInfoResponse(BaseModel):
    model_loaded: bool
    architecture: str
    classes: List[str]
    num_classes: int
    input_shape: List[int]
    accuracy: Optional[float] = None
    confusion_matrix: Optional[List[List[int]]] = None
    metrics: Optional[Dict] = None

class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str
    model_loaded: bool
    database_connected: bool
