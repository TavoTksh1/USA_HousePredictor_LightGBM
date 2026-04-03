import joblib, json, os
import pandas as pd
import numpy as np

MODEL_DIR = "model"

def load_artifacts():
    model    = joblib.load(os.path.join(MODEL_DIR, "lgbm_model.pkl"))
    enc      = joblib.load(os.path.join(MODEL_DIR, "ordinal_encoder.pkl"))
    le_y     = joblib.load(os.path.join(MODEL_DIR, "label_encoder.pkl"))
    with open(os.path.join(MODEL_DIR, "feature_names.json")) as f:
        features = json.load(f)
    with open(os.path.join(MODEL_DIR, "medians.json")) as f:
        medians = json.load(f)
    return model, enc, le_y, features, medians

def predict_with_proba(data: dict) -> dict:
    model, enc, le_y, feature_names, medians = load_artifacts()

    df = pd.DataFrame([data])

    # Feature engineering — igual que Celda 1 del notebook
    df['bed_bath_ratio']     = df['bed'] / df['bath']
    df['size_per_bed']       = df['house_size'] / df['bed']
    df['lot_to_house_ratio'] = df['acre_lot'] / df['house_size']
    df['total_rooms_value']  = df['bed'] * df['bath'] * df['house_size']
    df['density_score']      = df['bed'] / df['acre_lot']

    # brokered_by no viene del formulario → mediana del entrenamiento
    df['brokered_by'] = medians.get('brokered_by', 50000.0)

    # Encode categóricas (OrdinalEncoder ya entrenado)
    cat_cols = ['status', 'city', 'state']
    df[cat_cols] = enc.transform(df[cat_cols].astype(str))

    # Limpiar y alinear columnas al orden exacto del modelo
    df = df.replace([np.inf, -np.inf], np.nan)
    for col in feature_names:
        if col not in df.columns:
            df[col] = medians.get(col, 0)
    df = df[feature_names]
    df = df.fillna({col: medians.get(col, 0) for col in feature_names})

    # Predicción
    pred_enc = model.predict(df)[0]
    proba    = model.predict_proba(df)[0]
    category = le_y.inverse_transform([pred_enc])[0]
    probs    = {cls: round(float(p), 4) for cls, p in zip(le_y.classes_, proba)}

    return {"category": category, "probabilities": probs}