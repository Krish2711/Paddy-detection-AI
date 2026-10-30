from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from backend.app.database.db import Base

class PredictionRecord(Base):
    __tablename__ = "prediction_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    image_url = Column(String(512), nullable=False)
    predicted_class = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)
    probabilities_json = Column(Text, nullable=False)  # JSON string of all class probabilities
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        import json
        return {
            "id": self.id,
            "filename": self.filename,
            "original_filename": self.original_filename,
            "image_url": self.image_url,
            "predicted_class": self.predicted_class,
            "confidence": round(self.confidence, 4),
            "probabilities": json.loads(self.probabilities_json) if self.probabilities_json else {},
            "created_at": self.created_at.isoformat()
        }
