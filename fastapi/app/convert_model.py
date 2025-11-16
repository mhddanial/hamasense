from tensorflow.keras.models import load_model

# Muat model .h5 lama Anda (pilih yang finetuned atau yang base)
model = load_model('models/best_model_finetuned_6class.h5')

# Simpan dalam format Keras 3 yang baru
model.save('model_pest_disease.keras')