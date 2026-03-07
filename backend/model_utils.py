import joblib
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv() # Carga las variables del .env

def predict_price_category(data_dict):
    # Obtener nombre del modelo desde el .env
    model_name = os.getenv("MODEL_NAME", "rf_model.pkl")
    model_path = os.path.join("model", model_name)
    
    if not os.path.exists(model_path):
        return "Error: Modelo no encontrado"

    model = joblib.load(model_path)
    df = pd.DataFrame([data_dict])
    prediction = model.predict(df)
    return prediction[0]