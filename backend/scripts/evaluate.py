import os
import json
import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix

def evaluate():
    dataset_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "Rice Leaf Disease Images"))
    model_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
    model_path = os.path.join(model_dir, "paddy_cnn_model.keras")

    if not os.path.exists(model_path):
        print(f"Error: Model file not found at {model_path}")
        return

    print(f"Loading model from {model_path}...")
    model = tf.keras.models.load_model(model_path)

    val_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_dir,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=(224, 224),
        batch_size=32
    )

    class_names = val_ds.class_names

    val_images = []
    val_labels = []
    for images, labels in val_ds:
        val_images.append(images.numpy())
        val_labels.append(labels.numpy())

    val_images = np.concatenate(val_images, axis=0)
    val_labels = np.concatenate(val_labels, axis=0)

    print(f"Running predictions on {len(val_images)} validation images...")
    preds = model.predict(val_images)
    pred_classes = np.argmax(preds, axis=1)

    acc = float(np.mean(pred_classes == val_labels))
    cm = confusion_matrix(val_labels, pred_classes).tolist()
    report = classification_report(val_labels, pred_classes, target_names=class_names, output_dict=True)

    print(f"\n--- Evaluation Results ---")
    print(f"Accuracy: {acc * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(val_labels, pred_classes, target_names=class_names))

    metrics = {
        "accuracy": round(acc, 4),
        "classes": class_names,
        "num_classes": len(class_names),
        "confusion_matrix": cm,
        "classification_report": report
    }

    metrics_path = os.path.join(model_dir, "model_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"Updated metrics in {metrics_path}")

if __name__ == "__main__":
    evaluate()
