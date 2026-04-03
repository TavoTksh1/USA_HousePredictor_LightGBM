from fastapi import FastAPI
from pydantic import BaseModel
from model_utils import predict_with_proba
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="PropPredict LightGBM API")

class Property(BaseModel):
    bed: float
    bath: float
    acre_lot: float
    house_size: float
    zip_code: float
    state: str
    city: str
    status: str                    # 'for_sale' | 'sold'
    years_since_last_sale: float = 2.0

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "model": "LightGBM", "version": "2.0"}

@app.post("/predict")
async def handle_prediction(prop: Property):
    result = predict_with_proba(prop.dict())
    category = result["category"]

    segments = {
        "High": {
            "titulo":  "Segmento Premium",
            "accion":  "Asignar asesor VIP. Activar campaña de marketing de lujo y contacto preferencial.",
            "emoji":   "🏆",
            "kpi":     "ROI estimado: +35 % sobre precio de lista",
            "alerta":  None,
        },
        "Medium": {
            "titulo":  "Segmento Estándar",
            "accion":  "Publicar en catálogo general con proceso de aprobación estándar.",
            "emoji":   "🏠",
            "kpi":     "Tiempo estimado de cierre: 30–60 días",
            "alerta":  None,
        },
        "Low": {
            "titulo":  "Segmento Accesible",
            "accion":  "Derivar a línea de financiamiento social. Alertar a compradores de primera vivienda.",
            "emoji":   "🔑",
            "kpi":     "Alta rotación: cierre esperado < 30 días",
            "alerta":  "Candidata a programa de subsidio habitacional",
        },
    }

    info = segments.get(category, segments["Medium"])

    return {
        "categoria":           category,
        "titulo_segmento":     info["titulo"],
        "accion_automatizada": info["accion"],
        "emoji":               info["emoji"],
        "kpi":                 info["kpi"],
        "alerta":              info["alerta"],
        "probabilidades":      result["probabilities"],
        "status":              "success",
    }