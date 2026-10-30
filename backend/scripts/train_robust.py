import os
import re
import json
import random
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from PIL import Image

def train_robust_model():
    dataset_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "Rice Leaf Disease Images"))
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
    os.makedirs(output_dir, exist_ok=True)

    classes = ['Bacterialblight', 'Blast', 'Brownspot', 'Tungro']
    class_to_idx = {c: i for i, c in enumerate(classes)}

    all_filepaths = []
    all_labels = []

    for c in classes:
        folder = os.path.join(dataset_dir, c)
        for f in os.listdir(folder):
            if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                all_filepaths.append(os.path.join(folder, f))
                all_labels.append(class_to_idx[c])

    print(f"Total images collected: {len(all_filepaths)}")

    combined = list(zip(all_filepaths, all_labels))
    random.seed(42)
    random.shuffle(combined)
    all_filepaths, all_labels = zip(*combined)
    all_filepaths = list(all_filepaths)
    all_labels = list(all_labels)

    split = int(0.85 * len(all_filepaths))
    train_paths, val_paths = all_filepaths[:split], all_filepaths[split:]
    train_labels, val_labels = all_labels[:split], all_labels[split:]

    IMG_SIZE = (224, 224)
    BATCH_SIZE = 32

    def load_and_preprocess(path, label):
        img = tf.io.read_file(path)
        img = tf.io.decode_jpeg(img, channels=3)
        img = tf.image.resize(img, IMG_SIZE)
        return img, label

    train_ds = tf.data.Dataset.from_tensor_slices((train_paths, train_labels))
    train_ds = train_ds.shuffle(1000).map(load_and_preprocess, num_parallel_calls=tf.data.AUTOTUNE)

    val_ds = tf.data.Dataset.from_tensor_slices((val_paths, val_labels))
    val_ds = val_ds.map(load_and_preprocess, num_parallel_calls=tf.data.AUTOTUNE)

    # Aggressive Data Augmentation to prevent background memorization
    data_augmentation = tf.keras.Sequential([
        layers.RandomFlip("horizontal_and_vertical"),
        layers.RandomRotation(0.3),
        layers.RandomZoom((-0.2, 0.3)),  # Zoom right in on lesions
        layers.RandomTranslation(0.15, 0.15),
        layers.RandomContrast(0.2),
        layers.RandomBrightness(0.2)
    ])

    base_model = MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights='imagenet'
    )
    base_model.trainable = False

    inputs = layers.Input(shape=(224, 224, 3))
    x = data_augmentation(inputs)
    x = tf.keras.applications.mobilenet_v2.preprocess_input(x)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.4)(x)
    x = layers.Dense(128, activation='relu')(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(len(classes), activation='softmax')(x)

    model = models.Model(inputs, outputs)

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )

    train_ds = train_ds.batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)
    val_ds = val_ds.batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)

    print("\nTraining feature head (frozen backbone)...")
    model.fit(train_ds, validation_data=val_ds, epochs=8)

    # Gentle fine-tuning only on top 20 layers
    print("\nFine-tuning top layers...")
    base_model.trainable = True
    for layer in base_model.layers[:-25]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=5e-5),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )

    model.fit(train_ds, validation_data=val_ds, epochs=5)

    model_path = os.path.join(output_dir, "paddy_cnn_model.keras")
    model.save(model_path)
    print(f"Model saved to {model_path}")

    # Test directly on user uploaded blast image
    test_img_path = os.path.join(os.path.dirname(__file__), "..", "uploads", "7523df3792974361b1be440827be700d.png")
    if os.path.exists(test_img_path):
        img = Image.open(test_img_path).convert("RGB").resize((224, 224))
        arr = np.expand_dims(np.array(img, dtype=np.float32), 0)
        p = model.predict(arr)[0]
        print("\n--- Test on User Image (Actual Blast) ---")
        for i, c in enumerate(classes):
            print(f"{c}: {p[i]*100:.2f}%")

if __name__ == "__main__":
    train_robust_model()
