import os
import csv
import io
import uuid
import json
from typing import Optional, List, Dict
from datetime import datetime
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.config import settings
from backend.app.database.models import PredictionRecord
from backend.app.services.model_service import model_service

class PredictionService:
    @staticmethod
    def save_prediction(file: UploadFile, db: Session) -> dict:
        # 1. Validate file extension
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file format '{ext}'. Allowed formats: {', '.join(settings.ALLOWED_EXTENSIONS)}"
            )

        # 2. Read contents and check size
        contents = file.file.read()
        if len(contents) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail=f"File size exceeds maximum limit of {settings.MAX_UPLOAD_SIZE_MB}MB."
            )

        # 3. Save file to uploads folder
        unique_filename = f"{uuid.uuid4().hex}{ext}"
        saved_path = os.path.join(settings.UPLOADS_DIR, unique_filename)
        with open(saved_path, "wb") as f:
            f.write(contents)

        # 4. Perform ML Inference
        try:
            inference_result = model_service.predict_image(saved_path)
        except Exception as e:
            # Clean up uploaded image if inference fails
            if os.path.exists(saved_path):
                os.remove(saved_path)
            raise HTTPException(status_code=500, detail=str(e))

        # 5. Persist prediction in SQLite database
        image_url = f"/uploads/{unique_filename}"
        record = PredictionRecord(
            filename=unique_filename,
            original_filename=file.filename or "uploaded_leaf.jpg",
            image_url=image_url,
            predicted_class=inference_result["predicted_class"],
            confidence=inference_result["confidence"],
            probabilities_json=json.dumps(inference_result["probabilities"]),
            created_at=datetime.utcnow()
        )

        db.add(record)
        db.commit()
        db.refresh(record)

        res = record.to_dict()
        res["ranked_probabilities"] = inference_result["ranked_probabilities"]
        res["is_uncertain"] = inference_result.get("is_uncertain", False)
        res["uncertainty_warning"] = inference_result.get("uncertainty_warning")
        return res

    @staticmethod
    def get_predictions(
        db: Session,
        page: int = 1,
        page_size: int = 10,
        search: Optional[str] = None,
        disease_class: Optional[str] = None,
        sort_order: str = "desc"
    ) -> dict:
        query = db.query(PredictionRecord)

        if search:
            search_term = f"%{search.strip()}%"
            query = query.filter(
                (PredictionRecord.original_filename.ilike(search_term)) |
                (PredictionRecord.predicted_class.ilike(search_term))
            )

        if disease_class and disease_class.strip().lower() != "all":
            query = query.filter(PredictionRecord.predicted_class.ilike(disease_class.strip()))

        if sort_order == "asc":
            query = query.order_by(PredictionRecord.created_at.asc(), PredictionRecord.id.asc())
        else:
            query = query.order_by(PredictionRecord.created_at.desc(), PredictionRecord.id.desc())

        total = query.count()
        offset = (page - 1) * page_size
        records = query.offset(offset).limit(page_size).all()

        record_dicts = []
        for r in records:
            d = r.to_dict()
            probs = d["probabilities"]
            d["ranked_probabilities"] = [
                {"class_name": k, "probability": round(v, 4)}
                for k, v in sorted(probs.items(), key=lambda x: x[1], reverse=True)
            ]
            record_dicts.append(d)

        return {
            "total": total,
            "page": page,
            "page_size": page_size,
            "records": record_dicts
        }

    @staticmethod
    def get_prediction_by_id(prediction_id: int, db: Session) -> dict:
        record = db.query(PredictionRecord).filter(PredictionRecord.id == prediction_id).first()
        if not record:
            raise HTTPException(status_code=404, detail="Prediction record not found.")

        d = record.to_dict()
        probs = d["probabilities"]
        d["ranked_probabilities"] = [
            {"class_name": k, "probability": round(v, 4)}
            for k, v in sorted(probs.items(), key=lambda x: x[1], reverse=True)
        ]
        return d

    @staticmethod
    def delete_prediction(prediction_id: int, db: Session) -> bool:
        record = db.query(PredictionRecord).filter(PredictionRecord.id == prediction_id).first()
        if not record:
            raise HTTPException(status_code=404, detail="Prediction record not found.")

        # Remove image file if it exists
        file_path = os.path.join(settings.UPLOADS_DIR, record.filename)
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass

        db.delete(record)
        db.commit()
        return True

    @staticmethod
    def export_predictions_csv(db: Session) -> str:
        records = db.query(PredictionRecord).order_by(PredictionRecord.created_at.desc()).all()

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "ID", "Original Filename", "Predicted Class", "Confidence Score",
            "Probabilities", "Created At", "Image URL"
        ])

        for r in records:
            writer.writerow([
                r.id,
                r.original_filename,
                r.predicted_class,
                f"{r.confidence * 100:.2f}%",
                r.probabilities_json,
                r.created_at.isoformat(),
                r.image_url
            ])

        return output.getvalue()

    @staticmethod
    def get_dashboard_stats(db: Session) -> dict:
        total = db.query(PredictionRecord).count()
        records = db.query(PredictionRecord).all()

        class_counts: Dict[str, int] = {}
        for r in records:
            class_counts[r.predicted_class] = class_counts.get(r.predicted_class, 0) + 1

        recent_records = (
            db.query(PredictionRecord)
            .order_by(PredictionRecord.created_at.desc())
            .limit(5)
            .all()
        )

        recent_dicts = []
        for r in recent_records:
            d = r.to_dict()
            recent_dicts.append(d)

        return {
            "total_analyses": total,
            "class_distribution": class_counts,
            "recent_predictions": recent_dicts,
            "model_info": model_service.get_info()
        }

prediction_service = PredictionService()
