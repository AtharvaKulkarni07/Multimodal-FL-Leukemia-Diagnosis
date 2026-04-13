# 🏥 Federated Multimodal Leukemia Diagnosis System

A production-ready Clinical Decision Support System (CDSS) utilizing **Federated Learning**, **Dual-Input Multimodal Neural Networks** (Image + Tabular Data), and **Explainable AI (XAI)** for the secure and interpretable detection of acute leukemia.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.12-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.0+-black.svg)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.15+-orange.svg)
![Status](https://img.shields.io/badge/status-Flagship_Prototype-brightgreen.svg)

---

## ⚡ Fastest Start (2 Steps)

**Terminal 1 - Backend (FastAPI):**
```bash
cd backend 
python -m venv venv
# Windows: venv\Scripts\activate | macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
pip install opencv-python-headless scikit-learn  # Required for XAI and Scaler
python main.py
```

**Terminal 2 - Frontend (Next.js):**
```bash
cd frontend 
npm install
npm install lucide-react recharts axios react-hot-toast # Ensure new UI dependencies are installed
npm run dev
```

Then open: **[http://localhost:3000](http://localhost:3000)** 

---

## ✨ Enterprise Features

### 🎯 Federated Learning & Model Selection
- **Decentralized AI:** Employs a Federated Averaging (`FedAvg`) strategy to train models across institutions without pooling raw patient data.
- **Dynamic Model Switching:** Users can toggle between the **Global Aggregated Model** (99.2% accuracy) and local institutional models (Site Alpha / Site Beta) directly from the UI.
- **Differential Privacy:** Defends against model inversion attacks using local gradient clipping and additive Gaussian noise.

### 🧠 Explainable AI (XAI) & Safety
- **Visual Interpretability (Grad-CAM):** Generates heatmaps over blood smears to prove the neural network is focusing on morphological anomalies, not background artifacts.
- **Tabular Feature Attribution:** Calculates partial derivatives to show exactly which clinical blood counts (e.g., high WBC, low platelets) drove the diagnosis.
- **Uncertainty Quantification:** Utilizes Monte Carlo (MC) Dropout to run multiple inference passes, calculating prediction variance to warn doctors of Out-of-Distribution (OOD) data.

### 🧬 Multimodal Late-Fusion Architecture
- **Dual-Input Analysis:** Combines 224x224 blood smear microscopy images (CNN branch) with 9 clinical laboratory values (MLP branch).
- **Automated Data Processing:** Real-time image normalization, resizing, and tabular standard scaling (`joblib`).
- **One-Click Demo Profiles:** Pre-loaded clinical profiles (Healthy/Leukemia) for fast system validation.

### 🎨 Professional UI & Interactive Documentation
- **Glassmorphism Design:** Sleek, modern dark-themed interface utilizing Tailwind CSS and Lucide React icons.
- **Native Data Visualization:** Built-in documentation page (`/documentation`) featuring interactive `recharts` graphs proving FL convergence, non-IID data handling, and local vs. global performance.

---

## 🏗️ System Architecture

```text
Browser (localhost:3000)
         ↓ (FormData: Image + 9 Features + Model Choice)
    Frontend (Next.js + React)
    - Dynamic Model Selector
    - Demo Data Autofill
    - XAI Visualization Dashboard
         ↓ HTTP POST /predict
    Backend (FastAPI - localhost:8000)
    - Image & Tabular Preprocessing
    - Grad-CAM & Gradient Math Engine
         ↓
    ML Model (TensorFlow/Keras)
    - Late-Fusion Multimodal Network
    - Binary Focal Crossentropy (Handles Class Imbalance)
```

---

## 📁 Project Structure

```text
leukemia-diagnosis/
├── backend/                    # FastAPI application & ML Inference
│   ├── main.py                 # Core server logic & XAI generators
│   └── requirements.txt        
├── frontend/                   # Next.js application
│   ├── app/page.tsx            # Main Diagnostic Dashboard
│   ├── app/documentation/      # Architecture & FL Results Page
│   └── tailwind.config.ts      
├── models/                     # Federated ML assets
    ├── base models/            # Local Institutional Models
    │   ├── local_model_alpha.keras
    │   └── local_model_beta.keras
    ├── global models/          # Aggregated Models
    │   └── global_model.keras  
    └── scaler/                 
        └── scaler_global.joblib # Scikit-learn standardization rules
```

---

## 📊 API Reference

### Base URL: `http://localhost:8000`

**GET `/health`** - Health check & asset verification
```json
{ 
  "status": "healthy", 
  "models_loaded": {"global": true, "alpha": true, "beta": true}, 
  "scaler_loaded": true 
}
```

**POST `/predict`** - Multimodal Inference & XAI Generation
- **Input (FormData):** `file` (Image), `WBC_count` ... `Uric_acid` (Floats), `model_type` (String: "global"|"alpha"|"beta")
- **Output:**
```json
{
  "classification": "Leukemia",
  "confidence": 0.985,
  "model_used": "global",
  "explanation_image": "<base64_gradcam_string>",
  "feature_importance": {"WBC_count": 0.45, "Platelet_count": -0.12...}
}
```

---

## ⚠️ Clinical Disclaimer

**This system is a Clinical Decision Support System (CDSS) prototype built for research and educational purposes under a Federated Learning framework.**

- It is **NOT** a substitute for professional medical diagnosis.
- Results should **NOT** be used for primary clinical decisions.
- Always consult a qualified hematologist or oncologist.