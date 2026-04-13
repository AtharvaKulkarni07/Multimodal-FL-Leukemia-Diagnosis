"""
FastAPI Backend for Multimodal Leukemia Diagnosis System
Serves a dual-input neural network model (Image + Tabular Data)
Supports Global Model, Local Models (Alpha & Beta), and Explainable AI (XAI)
Enhanced with Monte Carlo Dropout for Uncertainty Quantification
"""

import os
import io
import base64
import numpy as np
import cv2
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf
from tensorflow import keras
from PIL import Image
import joblib
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Leukemia Diagnosis API (Federated)",
    description="Multimodal ML model with XAI and Uncertainty Quantification for acute leukemia diagnosis",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for models and scaler
MODELS = {
    "global": None,
    "alpha": None,
    "beta": None
}
SCALER = None

# CORRECTED PATHS
BASE_DIR = os.path.dirname(__file__)
PATHS = {
    "global": os.path.join(BASE_DIR, "../models/global models/global_model.keras"),
    "alpha": os.path.join(BASE_DIR, "../models/base models/local_model_alpha.keras"),
    "beta": os.path.join(BASE_DIR, "../models/base models/local_model_beta.keras"),
    "scaler": os.path.join(BASE_DIR, "../models/scaler/scaler_global.joblib")
}

FEATURE_NAMES = [
    'WBC_count', 'LDH_level', 'Hemoglobin', 'Platelet_count',
    'RBC_count', 'Hematocrit', 'Lymphocyte_percentage',
    'Neutrophil_percentage', 'Uric_acid'
]

class PredictionResponse(BaseModel):
    """Response model for prediction endpoint"""
    classification: str
    confidence: float
    confidence_variance: float  
    confidence_std: float  
    probability_healthy: float
    probability_leukemia: float
    model_used: str
    message: str
    explanation_image: str  # Base64 encoded Grad-CAM heatmap
    feature_importance: dict  # Tabular gradient attributions
    csv_export_data: dict  

# --- XAI ENGINE (EXPLAINABLE AI) ---

def generate_xai_data(model, image_array, tabular_array):
    """Generates Grad-CAM heatmap and tabular feature attributions."""
    
    # 1. Find the last Conv2D layer for the image explanation
    conv_layer = None
    for layer in reversed(model.layers):
        if isinstance(layer, tf.keras.layers.Conv2D):
            conv_layer = layer
            break
            
    if conv_layer is None:
        logger.warning("No Conv2D layer found. Skipping Image XAI.")
        return None, np.zeros(len(FEATURE_NAMES))

    # 2. Build gradient model
    grad_model = tf.keras.models.Model(
        inputs=model.inputs,
        outputs=[conv_layer.output, model.output]
    )

    # 3. Convert BOTH inputs to TensorFlow tensors to prevent mixed-type errors
    image_tensor = tf.convert_to_tensor(image_array, dtype=tf.float32)
    tabular_tensor = tf.convert_to_tensor(tabular_array, dtype=tf.float32)

    # 4. Calculate Gradients
    with tf.GradientTape(persistent=True) as tape:
        # We watch the tabular tensor so we can calculate feature importance
        tape.watch(tabular_tensor)
        
        # Pass both as unified tensors
        conv_outputs, predictions = grad_model([image_tensor, tabular_tensor])
        pred_value = predictions[:, 0] # Sigmoid output

    # --- IMAGE GRAD-CAM ---
    grads = tape.gradient(pred_value, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    conv_outputs = conv_outputs[0]
    heatmap = tf.reduce_sum(tf.multiply(pooled_grads, conv_outputs), axis=-1)
    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    heatmap = heatmap.numpy()

    # --- TABULAR ATTRIBUTIONS ---
    tab_grads = tape.gradient(pred_value, tabular_tensor)[0].numpy()
    feature_attributions = tab_grads * tabular_array[0] 

    return heatmap, feature_attributions

def apply_heatmap(original_image_bytes, heatmap, alpha=0.4):
    """Overlays the heatmap onto the original image and returns Base64."""
    if heatmap is None:
        return ""
        
    nparr = np.frombuffer(original_image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img = cv2.resize(img, (224, 224))

    heatmap_resized = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
    heatmap_resized = np.uint8(255 * heatmap_resized)
    heatmap_colored = cv2.applyColorMap(heatmap_resized, cv2.COLORMAP_JET)
    
    superimposed_img = cv2.addWeighted(heatmap_colored, alpha, img, 1 - alpha, 0)
    _, buffer = cv2.imencode('.jpg', superimposed_img)
    return base64.b64encode(buffer).decode('utf-8')


# --- MONTE CARLO DROPOUT FOR UNCERTAINTY QUANTIFICATION ---

def monte_carlo_dropout_inference(model, image_array, tabular_array, num_iterations=10):
    """
    Performs multiple forward passes with dropout enabled to estimate uncertainty.
    
    Args:
        model: Keras model
        image_array: Preprocessed image (1, 224, 224, 3)
        tabular_array: Scaled tabular data (1, 9)
        num_iterations: Number of MC passes (default 10)
    
    Returns:
        mean_prediction: Mean probability across iterations
        std_prediction: Standard deviation of predictions
        all_predictions: Array of all predictions
    """
    predictions_list = []
    
    # Create a custom function to enable dropout during inference
    def predict_with_dropout(model, image, tabular):
        # Use model.call with training=True to enable dropout
        return model([image, tabular], training=True)
    
    for _ in range(num_iterations):
        pred = predict_with_dropout(model, image_array, tabular_array)
        predictions_list.append(pred.numpy()[0, 0])
    
    predictions_array = np.array(predictions_list)
    mean_prediction = np.mean(predictions_array)
    std_prediction = np.std(predictions_array)
    
    return mean_prediction, std_prediction, predictions_array


# --- FASTAPI ROUTES ---

@app.on_event("startup")
async def load_assets():
    """Load all models and the scaler on application startup"""
    global MODELS, SCALER
    
    for model_name, path in PATHS.items():
        if model_name == "scaler": continue
        logger.info(f"Loading {model_name} model from {path}")
        if os.path.exists(path):
            try:
                MODELS[model_name] = keras.models.load_model(path)
                logger.info(f"✓ {model_name.capitalize()} model loaded.")
            except Exception as e:
                logger.error(f"Failed to load {model_name} model: {str(e)}")
        else:
            logger.warning(f"File not found: {path}")

    logger.info(f"Loading scaler from {PATHS['scaler']}")
    if os.path.exists(PATHS['scaler']):
        try:
            SCALER = joblib.load(PATHS['scaler'])
            logger.info("✓ Scaler loaded.")
        except Exception as e:
            logger.error(f"Failed to load scaler: {str(e)}")
    else:
        logger.warning("Scaler not found.")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "models_loaded": {name: (model is not None) for name, model in MODELS.items()},
        "scaler_loaded": SCALER is not None
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict(
    file: UploadFile = File(...),
    WBC_count: float = Form(...),
    LDH_level: float = Form(...),
    Hemoglobin: float = Form(...),
    Platelet_count: float = Form(...),
    RBC_count: float = Form(...),
    Hematocrit: float = Form(...),
    Lymphocyte_percentage: float = Form(...),
    Neutrophil_percentage: float = Form(...),
    Uric_acid: float = Form(...),
    model_type: str = Form("global"),
):
    model_type = model_type.lower()
    if model_type not in MODELS or MODELS[model_type] is None:
         raise HTTPException(status_code=400, detail=f"Model '{model_type}' is not loaded.")
         
    try:
        # 1. Process Image
        image_content = await file.read()
        image = Image.open(io.BytesIO(image_content)).convert("RGB")
        image = image.resize((224, 224))
        image_array = np.expand_dims(np.array(image, dtype=np.float32) / 255.0, axis=0)
        
        # 2. Process Tabular Data
        tabular_values = np.array([[
            WBC_count, LDH_level, Hemoglobin, Platelet_count, RBC_count,
            Hematocrit, Lymphocyte_percentage, Neutrophil_percentage, Uric_acid
        ]], dtype=np.float32)
        
        tabular_scaled = SCALER.transform(tabular_values) if SCALER else tabular_values
        
        # 3. Model Inference with Monte Carlo Dropout
        active_model = MODELS[model_type]
        mean_prediction, std_prediction, mc_predictions = monte_carlo_dropout_inference(
            active_model, image_array, tabular_scaled, num_iterations=10
        )
        
        probability_leukemia = float(mean_prediction)
        probability_healthy = 1.0 - probability_leukemia
        
        classification = "Leukemia" if probability_leukemia >= 0.5 else "Healthy"
        confidence = max(probability_leukemia, probability_healthy)
        
        # Uncertainty quantification
        variance = float(std_prediction ** 2)
        confidence_std = float(std_prediction)

        # 4. Explainable AI (XAI) Generation
        raw_heatmap, tab_attributions = generate_xai_data(active_model, image_array, tabular_scaled)
        heatmap_base64 = apply_heatmap(image_content, raw_heatmap)
        
        feature_importance = {
            FEATURE_NAMES[i]: float(tab_attributions[i])
            for i in range(len(FEATURE_NAMES))
        }
        
        # 5. CSV Export Data
        csv_export_data = {
            "clinical_features": {
                "WBC_count": WBC_count,
                "LDH_level": LDH_level,
                "Hemoglobin": Hemoglobin,
                "Platelet_count": Platelet_count,
                "RBC_count": RBC_count,
                "Hematocrit": Hematocrit,
                "Lymphocyte_percentage": Lymphocyte_percentage,
                "Neutrophil_percentage": Neutrophil_percentage,
                "Uric_acid": Uric_acid
            },
            "mc_predictions": [float(p) for p in mc_predictions],
            "model_info": {
                "model_type": model_type,
                "num_mc_iterations": 10,
                "mean_prediction": float(mean_prediction),
                "std_prediction": float(std_prediction)
            }
        }
            
        return PredictionResponse(
            classification=classification,
            confidence=confidence,
            confidence_variance=variance,
            confidence_std=confidence_std,
            probability_healthy=probability_healthy,
            probability_leukemia=probability_leukemia,
            model_used=model_type,
            explanation_image=heatmap_base64,
            feature_importance=feature_importance,
            csv_export_data=csv_export_data,
            message=f"Diagnosis and interpretability via {model_type.capitalize()} Model complete. Uncertainty quantified via {10} MC iterations."
        )
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)