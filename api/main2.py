import tensorflow as tf
import os

# Use the absolute path to your saved_model folder
path = r"C:\Users\nihal\OneDrive\Desktop\CNN project\saved_models\1"

# Confirm it's accessible
print("Path exists:", os.path.exists(path))

# Try loading
model = tf.saved_model.load(path)

# Show available signatures
print("Available signatures:")
print(model.signatures)
