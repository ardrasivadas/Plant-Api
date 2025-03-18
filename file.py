import tensorflow as tf
import tensorflow_hub as hub  # Import TensorFlow Hub

# Load the model with custom objects
keras_model = tf.keras.models.load_model(
    r"C:\Users\amjat\OneDrive\Documents\Desktop\PlantNew\annoying.h5",
    custom_objects={'KerasLayer': hub.KerasLayer}  # Add KerasLayer
)
