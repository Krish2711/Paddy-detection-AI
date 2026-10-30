import os
import json
import numpy as np
from PIL import Image
import tensorflow as tf
from backend.app.core.config import settings

class ModelService:
    def __init__(self):
        self.model = None
        self.class_indices = {}
        self.class_names = ['Bacterialblight', 'Blast', 'Brownspot', 'Tungro']
        self.metrics = None
        self.load_model()

    def load_model(self):
        """Load Keras CNN model and class mappings once."""
        try:
            if os.path.exists(settings.CLASS_INDICES_PATH):
                with open(settings.CLASS_INDICES_PATH, 'r') as f:
                    data = json.load(f)
                    # Support both key-index and value-index JSON formats
                    self.class_indices = {int(k): v for k, v in data.items()}
                    self.class_names = [self.class_indices[i] for i in sorted(self.class_indices.keys())]

            if os.path.exists(settings.METRICS_PATH):
                with open(settings.METRICS_PATH, 'r') as f:
                    self.metrics = json.load(f)

            if os.path.exists(settings.MODEL_PATH):
                print(f"Loading Paddy Disease CNN Model from {settings.MODEL_PATH}...")
                self.model = tf.keras.models.load_model(settings.MODEL_PATH)
                print("Model loaded successfully!")
            else:
                print(f"Warning: Model file not found at {settings.MODEL_PATH}.")
                self.model = None
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            self.model = None

    def is_loaded(self) -> bool:
        return self.model is not None

    def get_info(self) -> dict:
        return {
            "model_loaded": self.is_loaded(),
            "architecture": self.metrics.get("architecture", "MobileNetV2 Transfer Learning") if self.metrics else "MobileNetV2 CNN",
            "classes": self.class_names,
            "num_classes": len(self.class_names),
            "input_shape": [224, 224, 3],
            "accuracy": self.metrics.get("accuracy") if self.metrics else None,
            "confusion_matrix": self.metrics.get("confusion_matrix") if self.metrics else None,
            "metrics": self.metrics
        }

    def predict_image(self, image_path: str) -> dict:
        """Runs inference on an uploaded image file with multi-scale Test-Time Augmentation (TTA)."""
        if not self.is_loaded():
            raise RuntimeError("Model is not loaded. Please train or provide a model file.")

        try:
            # 1. Open raw image
            raw_img = Image.open(image_path).convert("RGB")
            w, h = raw_img.size

            # Whole image resized
            img_full = raw_img.resize((224, 224))
            arr_full = np.expand_dims(np.array(img_full, dtype=np.float32), axis=0)

            # Center crop (isolating leaf from outer edges)
            crop_box = (int(w * 0.1), int(h * 0.1), int(w * 0.9), int(h * 0.9))
            img_crop = raw_img.crop(crop_box).resize((224, 224))
            arr_crop = np.expand_dims(np.array(img_crop, dtype=np.float32), axis=0)

            # 2. Multi-crop inference
            p_full = self.model.predict(arr_full, verbose=0)[0]
            p_crop = self.model.predict(arr_crop, verbose=0)[0]

            # Weighted combination (favoring lesion focus)
            preds = 0.45 * p_full + 0.55 * p_crop

            # 3. Softmax / probability extraction
            predicted_idx = int(np.argmax(preds))
            confidence = float(preds[predicted_idx])
            predicted_class = self.class_names[predicted_idx] if predicted_idx < len(self.class_names) else f"Class_{predicted_idx}"

            probabilities = {
                self.class_names[i]: float(preds[i])
                for i in range(len(self.class_names))
            }

            ranked_probs = [
                {"class_name": k, "probability": round(v, 4)}
                for k, v in sorted(probabilities.items(), key=lambda x: x[1], reverse=True)
            ]

            # Uncertainty check
            is_uncertain = confidence < 0.60 or (len(ranked_probs) > 1 and (ranked_probs[0]["probability"] - ranked_probs[1]["probability"]) < 0.20)
            uncertainty_msg = None
            if is_uncertain:
                uncertainty_msg = "Prediction confidence is moderate. Ensure image is a close-up photo focused on the leaf lesion without background clutter."

            return {
                "predicted_class": predicted_class,
                "confidence": round(confidence, 4),
                "probabilities": probabilities,
                "ranked_probabilities": ranked_probs,
                "is_uncertain": is_uncertain,
                "uncertainty_warning": uncertainty_msg
            }
        except Exception as e:
            raise RuntimeError(f"Failed to process image inference: {str(e)}")

model_service = ModelService()
