from fastapi import FastAPI
from pydantic import BaseModel
from model_utils import predict_price_category

app = FastAPI(title="Real Estate Predictor API")

class Property(BaseModel):
    bed: float
    bath: float
    acre_lot: float
    house_size: float
    # Agrega aquí las demás variables según tu X_train de Colab

@app.post("/predict")
async def handle_prediction(prop: Property):
    category = predict_price_category(prop.dict())
    
    # Lógica de decisión automatizada para el punto 3 de tu parcial
    if category == "High":
        action = "PRIORIDAD ALTA: Asignando Agente VIP y enviando a sección Premium."
    elif category == "Medium":
        action = "APROBACIÓN AUTOMÁTICA: Listado en catálogo estándar."
    else:
        action = "OFERTA: Enviando a sección de precios reducidos."

    return {
        "categoria": category,
        "accion_automatizada": action,
        "status": "Success"
    }