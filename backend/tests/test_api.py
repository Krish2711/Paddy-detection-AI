import os
import io
import pytest
from PIL import Image
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "model_loaded" in data

def test_model_info_endpoint():
    response = client.get("/api/model/info")
    assert response.status_code == 200
    data = response.json()
    assert "classes" in data
    assert len(data["classes"]) == 4

def test_invalid_file_upload():
    response = client.post(
        "/api/predict",
        files={"file": ("test.txt", b"dummy content", "text/plain")}
    )
    assert response.status_code == 400

def test_valid_image_prediction_flow():
    # Create a small valid test image in memory
    img = Image.new("RGB", (224, 224), color="green")
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    response = client.post(
        "/api/predict",
        files={"file": ("test_leaf.jpg", buf, "image/jpeg")}
    )
    assert response.status_code == 200
    data = response.json()
    assert "predicted_class" in data
    assert "confidence" in data
    assert "probabilities" in data
    assert "id" in data

    prediction_id = data["id"]

    # Check history endpoint
    hist_response = client.get("/api/predictions")
    assert hist_response.status_code == 200
    hist_data = hist_response.json()
    assert hist_data["total"] >= 1

    # Check export endpoint
    export_response = client.get("/api/predictions/export")
    assert export_response.status_code == 200
    assert "text/csv" in export_response.headers["content-type"]

    # Delete test record
    del_response = client.delete(f"/api/predictions/{prediction_id}")
    assert del_response.status_code == 200
