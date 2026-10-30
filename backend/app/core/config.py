import os

class Settings:
    APP_NAME: str = "PaddyCare AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    BASE_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    MODELS_DIR: str = os.path.join(BASE_DIR, "models")
    MODEL_PATH: str = os.path.join(MODELS_DIR, "paddy_cnn_model.keras")
    CLASS_INDICES_PATH: str = os.path.join(MODELS_DIR, "class_indices.json")
    METRICS_PATH: str = os.path.join(MODELS_DIR, "model_metrics.json")
    
    UPLOADS_DIR: str = os.path.join(BASE_DIR, "uploads")
    DATABASE_PATH: str = os.path.join(BASE_DIR, "paddycare.db")
    DATABASE_URL: str = f"sqlite:///{DATABASE_PATH}"
    
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_EXTENSIONS: set = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
    
    CORS_ORIGINS: list = ["*"]

settings = Settings()
os.makedirs(settings.UPLOADS_DIR, exist_ok=True)
os.makedirs(settings.MODELS_DIR, exist_ok=True)
