import os
import json
import time
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from sklearn.metrics import classification_report, confusion_matrix

def train_model():
    dataset_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "Rice Leaf Disease Images"))
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
    os.makedirs(output_dir, exist_ok=True)

    print(f"Loading dataset from: {dataset_dir}")
    print(f"Saving model artifacts to: {output_dir}")

    IMG_SIZE = (224, 224)
    BATCH_SIZE = 32
    EPOCHS = 10

    # Load datasets
    train_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_dir,
        validation_split=0.2,
        subset="training",
        seed=123,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_dir,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE
    )

    class_names = train_ds.class_names
    num_classes = len(class_names)
    print(f"Detected classes ({num_classes}): {class_names}")

    # Save class indices mapping
    class_indices = {i: name for i, name in enumerate(class_names)}
    with open(os.path.join(output_dir, "class_indices.json"), "w") as f:
        json.dump(class_indices, f, indent=2)

    # Performance optimization
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

    # Data augmentation
    data_augmentation = tf.keras.Sequential([
        layers.RandomFlip("horizontal_and_vertical"),
        layers.RandomRotation(0.2),
        layers.RandomZoom(0.2),
        layers.RandomContrast(0.1),
    ])

    # Model architecture using MobileNetV2
    base_model = MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights='imagenet'
    )
    base_model.trainable = False  # Freeze base model initially

    inputs = layers.Input(shape=(224, 224, 3))
    x = data_augmentation(inputs)
    x = tf.keras.applications.mobilenet_v2.preprocess_input(x)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.3)(x)
    x = layers.Dense(128, activation='relu')(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(num_classes, activation='softmax')(x)

    model = models.Model(inputs, outputs)

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )

    model.summary()

    print("\nStarting training...")
    start_time = time.time()
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS
    )
    training_time = round(time.time() - start_time, 2)

    # Fine-tuning phase (unfreeze top layers of base model for maximum accuracy)
    print("\nStarting fine-tuning...")
    base_model.trainable = True
    # Freeze all layers before layer 100
    for layer in base_model.layers[:100]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )

    history_fine = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=5
    )

    # Save model
    model_path = os.path.join(output_dir, "paddy_cnn_model.keras")
    model.save(model_path)
    print(f"\nSaved trained model to: {model_path}")

    # Evaluate model
    print("\nEvaluating model on validation set...")
    val_images = []
    val_labels = []
    for images, labels in val_ds:
        val_images.append(images.numpy())
        val_labels.append(labels.numpy())

    val_images = np.concatenate(val_images, axis=0)
    val_labels = np.concatenate(val_labels, axis=0)

    preds = model.predict(val_images)
    pred_classes = np.argmax(preds, axis=1)

    acc = float(np.mean(pred_classes == val_labels))
    cm = confusion_matrix(val_labels, pred_classes).tolist()
    report = classification_report(val_labels, pred_classes, target_names=class_names, output_dict=True)

    metrics = {
        "accuracy": round(acc, 4),
        "classes": class_names,
        "num_classes": num_classes,
        "training_time_seconds": training_time,
        "confusion_matrix": cm,
        "classification_report": report,
        "epochs": EPOCHS + 5,
        "architecture": "MobileNetV2 (Transfer Learning + Fine-tuning)",
        "input_shape": [224, 224, 3],
        "history": {
            "loss": [float(l) for l in history.history['loss'] + history_fine.history['loss']],
            "accuracy": [float(a) for a in history.history['accuracy'] + history_fine.history['accuracy']],
            "val_loss": [float(l) for l in history.history['val_loss'] + history_fine.history['val_loss']],
            "val_accuracy": [float(a) for a in history.history['val_accuracy'] + history_fine.history['val_accuracy']]
        }
    }

    metrics_path = os.path.join(output_dir, "model_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"Validation Accuracy: {acc * 100:.2f}%")
    print(f"Saved metrics to: {metrics_path}")

if __name__ == "__main__":
    train_model()
