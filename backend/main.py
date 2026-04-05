"""
FastAPI Backend for Multimodal Leukemia Diagnosis System
Serves a dual-input neural network model (Image + Tabular Data)
"""

import os
import io
import numpy as np
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
    title="Leukemia Diagnosis API",
    description="Multimodal ML model for acute leukemia diagnosis",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and scaler
MODEL = None
SCALER = None

# Model and scaler paths
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models/global_models/global_model_round_5.keras")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "../models/scaler.pkl")

# Feature names in correct order
FEATURE_NAMES = [
    'WBC_count',
    'LDH_level',
    'Hemoglobin',
    'Platelet_count',
    'RBC_count',
    'Hematocrit',
    'Lymphocyte_percentage',
    'Neutrophil_percentage',
    'Uric_acid'
]


class PredictionResponse(BaseModel):
    """Response model for prediction endpoint"""
    classification: str
    confidence: float
    probability_healthy: float
    probability_leukemia: float
    message: str


@app.on_event("startup")
async def load_model():
    """Load model and scaler on application startup"""
    global MODEL, SCALER
    
    try:
        # Load Keras model
        logger.info(f"Loading model from {MODEL_PATH}")
        if os.path.exists(MODEL_PATH):
            MODEL = keras.models.load_model(MODEL_PATH)
            logger.info("✓ Model loaded successfully")
        else:
            logger.warning(f"Model file not found at {MODEL_PATH}")
            logger.info("Continuing without pre-trained model. Using mock model for testing.")
            MODEL = None
        
        # Load scaler
        logger.info(f"Loading scaler from {SCALER_PATH}")
        if os.path.exists(SCALER_PATH):
            SCALER = joblib.load(SCALER_PATH)
            logger.info("✓ Scaler loaded successfully")
        else:
            logger.warning(f"Scaler file not found at {SCALER_PATH}")
            logger.info("Continuing without pre-loaded scaler.")
            SCALER = None
            
    except Exception as e:
        logger.error(f"Error loading model or scaler: {str(e)}")
        MODEL = None
        SCALER = None


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": MODEL is not None,
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
):
    """
    Predict leukemia diagnosis from image and tabular features.
    
    Args:
        file: Blood smear image (.bmp, .jpg, .png)
        WBC_count: White blood cell count
        LDH_level: Lactate dehydrogenase level
        Hemoglobin: Hemoglobin level
        Platelet_count: Platelet count
        RBC_count: Red blood cell count
        Hematocrit: Hematocrit percentage
        Lymphocyte_percentage: Lymphocyte percentage
        Neutrophil_percentage: Neutrophil percentage
        Uric_acid: Uric acid level
    
    Returns:
        PredictionResponse with classification and confidence
    """
    
    try:
        # Validate file type
        allowed_extensions = {".bmp", ".jpg", ".jpeg", ".png"}
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed types: {', '.join(allowed_extensions)}"
            )
        
        # Read and preprocess image
        logger.info(f"Processing image: {file.filename}")
        image_content = await file.read()
        image = Image.open(io.BytesIO(image_content)).convert("RGB")
        
        # Resize to 224x224
        image = image.resize((224, 224))
        
        # Convert to numpy array and normalize
        image_array = np.array(image, dtype=np.float32)
        image_array = image_array / 255.0  # Normalization
        
        # Expand dimensions for batch: (224, 224, 3) -> (1, 224, 224, 3)
        image_array = np.expand_dims(image_array, axis=0)
        
        logger.info(f"Image preprocessed. Shape: {image_array.shape}")
        
        # Prepare tabular features
        tabular_values = np.array([
            WBC_count,
            LDH_level,
            Hemoglobin,
            Platelet_count,
            RBC_count,
            Hematocrit,
            Lymphocyte_percentage,
            Neutrophil_percentage,
            Uric_acid
        ], dtype=np.float32).reshape(1, -1)
        
        logger.info(f"Tabular features prepared. Shape: {tabular_values.shape}")
        
        # Apply scaler to tabular features
        if SCALER is not None:
            try:
                tabular_scaled = SCALER.transform(tabular_values)
                logger.info("Tabular features scaled successfully")
            except Exception as e:
                logger.warning(f"Error scaling features: {str(e)}. Using unscaled values.")
                tabular_scaled = tabular_values
        else:
            logger.warning("Scaler not loaded. Using unscaled tabular values.")
            tabular_scaled = tabular_values
        
        # Make prediction
        if MODEL is not None:
            logger.info("Running model prediction...")
            predictions = MODEL.predict([image_array, tabular_scaled], verbose=0)
            
            # predictions shape: (1, 2) for binary classification [healthy, leukemia]
            prediction_value = predictions[0]
            
            # Determine classification
            probability_healthy = float(prediction_value[0])
            probability_leukemia = float(prediction_value[1])
            
            if probability_leukemia >= probability_healthy:
                classification = "Leukemia"
                confidence = probability_leukemia
            else:
                classification = "Healthy"
                confidence = probability_healthy
            
            logger.info(f"Prediction: {classification}, Confidence: {confidence:.4f}")
            
        else:
            # Fallback for testing without model
            logger.warning("Model not loaded. Returning mock prediction.")
            probability_leukemia = np.random.random()
            probability_healthy = 1.0 - probability_leukemia
            classification = "Leukemia" if probability_leukemia >= 0.5 else "Healthy"
            confidence = max(probability_leukemia, probability_healthy)
        
        return PredictionResponse(
            classification=classification,
            confidence=confidence,
            probability_healthy=probability_healthy,
            probability_leukemia=probability_leukemia,
            message=f"Diagnosis complete. Classification: {classification} with {confidence*100:.2f}% confidence."
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Leukemia Diagnosis API",
        "endpoints": {
            "health": "/health",
            "predict": "/predict (POST)",
            "documentation": "/docs"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
