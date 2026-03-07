import joblib
import pandas as pd
import numpy as np
import os
from dotenv import load_dotenv

load_dotenv()

def predict_price_category(data_dict):
    model_name = os.getenv("MODEL_NAME", "rf_model.pkl")
    model_path = os.path.join("model", model_name)

    if not os.path.exists(model_path):
        return "Error: Modelo no encontrado"

    model = joblib.load(model_path)
    df = pd.DataFrame([data_dict])

    # Feature engineering — igual que en Colab
    df['price_per_sqft']      = 0  # no tenemos precio aún, placeholder
    df['bed_bath_ratio']      = df['bed'] / df['bath']
    df['size_per_bed']        = df['house_size'] / df['bed']
    df['lot_to_house_ratio']  = df['acre_lot'] / df['house_size']
    df['total_rooms_value']   = df['bed'] * df['bath'] * df['house_size']
    df['density_score']       = df['bed'] / df['acre_lot']

    # prev_sold_date no viene del form, usar placeholders
    df['prev_sold_year']        = 2020
    df['years_since_last_sale'] = 2024 - df['prev_sold_year']

    # Limpiar inf y nulos igual que en Colab
    df = df.replace([np.inf, -np.inf], np.nan)
    df = df.fillna(0)

    prediction = model.predict(df)
    return prediction[0]