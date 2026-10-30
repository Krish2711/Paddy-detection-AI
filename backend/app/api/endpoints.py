from typing import Optional
from fastapi import APIRouter, Depends, File, UploadFile, Query, Response, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from backend.app.database.db import get_db
from backend.app.services.model_service import model_service
from backend.app.services.prediction_service import prediction_service
from backend.app.schemas.prediction import (
    HealthResponse,
    ModelInfoResponse,
    PredictionResponse,
    PredictionListResponse
)

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def health_check(db: Session = Depends(get_db)):
    db_connected = False
    try:
        db.execute(text("SELECT 1"))
        db_connected = True
    except Exception:
        db_connected = False

    return {
        "status": "healthy" if db_connected else "degraded",
        "app_name": "PaddyCare AI",
        "version": "1.0.0",
        "model_loaded": model_service.is_loaded(),
        "database_connected": db_connected
    }

@router.get("/model/info", response_model=ModelInfoResponse)
def get_model_info():
    return model_service.get_info()

@router.post("/predict", response_model=PredictionResponse)
def predict_disease(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded.")
    return prediction_service.save_prediction(file, db)

@router.get("/predictions", response_model=PredictionListResponse)
def list_predictions(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    disease_class: Optional[str] = Query(None),
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db)
):
    return prediction_service.get_predictions(
        db=db,
        page=page,
        page_size=page_size,
        search=search,
        disease_class=disease_class,
        sort_order=sort_order
    )

@router.get("/predictions/stats")
def get_stats(db: Session = Depends(get_db)):
    return prediction_service.get_dashboard_stats(db)

@router.get("/predictions/export")
def export_csv(db: Session = Depends(get_db)):
    csv_data = prediction_service.export_predictions_csv(db)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=paddycare_predictions_history.csv"}
    )

@router.get("/predictions/{prediction_id}", response_model=PredictionResponse)
def get_prediction(prediction_id: int, db: Session = Depends(get_db)):
    return prediction_service.get_prediction_by_id(prediction_id, db)

@router.delete("/predictions/{prediction_id}")
def delete_prediction(prediction_id: int, db: Session = Depends(get_db)):
    success = prediction_service.delete_prediction(prediction_id, db)
    return {"status": "success", "deleted_id": prediction_id}
