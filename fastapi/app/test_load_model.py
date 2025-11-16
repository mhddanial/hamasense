from tensorflow.keras.models import load_model

MODEL_PATH = "model_artifacts/best_model_initial_6class.h5"

model = load_model(MODEL_PATH, compile=False)
print("Model loaded OK!")
print(model.summary())
