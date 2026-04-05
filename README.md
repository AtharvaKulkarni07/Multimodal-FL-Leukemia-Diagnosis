# 🏥 Multimodal Leukemia Diagnosis System - Web Application

A full-stack medical diagnosis web application using **Dual-Input Multimodal Neural Networks** (Image + Tabular Data) for acute leukemia detection.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-green.svg)
![Node.js](https://img.shields.io/badge/node.js-16.0+-green.svg)
![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen.svg)

---

## ⚡ Fastest Start (2 Steps)

**Terminal 1 - Backend:**
```bash
cd backend && python -m venv venv
# Windows: venv\Scripts\activate | macOS/Linux: source venv/bin/activate
pip install -r requirements.txt && python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm install && npm run dev
```

Then open: **[http://localhost:3000](http://localhost:3000)** ✅

---

## ✨ Features

### 🎯 Core Functionality
- **Dual-Input Analysis:** Combines blood smear microscopy images with clinical laboratory values
- **TensorFlow/Keras Model:** Trained dual-input neural network for binary classification
- **Real-time Predictions:** Fast inference with confidence scores
- **Professional UI:** Modern dark-themed interface optimized for medical use

### 🖼️ Image Processing
- ✅ Support for BMP, JPG, PNG formats
- ✅ Automatic resize to 224×224 pixels
- ✅ Pixel normalization (0-255 → 0-1)
- ✅ Drag-and-drop upload with preview
- ✅ File validation and error handling

### 📊 Clinical Data Input
- ✅ 9 blood chemistry parameters (WBC, LDH, Hemoglobin, Platelets, RBC, Hematocrit, Lymphocytes, Neutrophils, Uric Acid)
- ✅ Real-time validation
- ✅ Reference ranges displayed
- ✅ Automated feature scaling

### 🎨 User Interface
- ✅ Responsive two-column layout
- ✅ Dark professional theme (slate/gray)
- ✅ Real-time form validation
- ✅ Loading states and animations
- ✅ Toast notifications
- ✅ Detailed result visualization
- ✅ Probability breakdown charts

---

## 🏗️ System Architecture

```
Browser (localhost:3000)
         ↓
    Frontend (Next.js + React)
    - Drag-drop image upload
    - Clinical feature form
    - Results visualization
         ↓ HTTP/FormData
    Backend (FastAPI - localhost:8000)
    - Image preprocessing
    - Feature scaling
    - Model inference
         ↓
    ML Model (TensorFlow/Keras)
    - Dual-input neural network
    - Binary classification
```

---

## 🛠️ Technology Stack

### Backend
- **Python 3.8+** with **FastAPI** (web framework)
- **TensorFlow/Keras** (ML model serving)
- **scikit-learn** (feature scaling)
- **Pillow** (image processing)
- **uvicorn** (ASGI server)

### Frontend
- **Next.js** (React framework with TypeScript)
- **Tailwind CSS** (dark theme styling)
- **Axios** (HTTP client)
- **react-hot-toast** (notifications)

---

## 📁 Project Structure

```
leukemia-diagnosis/
├── backend/                    # FastAPI application
│   ├── main.py                # Core server logic
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile             # Docker image
│   └── .env.example           # Configuration template
├── frontend/                   # Next.js application
│   ├── app/page.tsx           # Main dashboard
│   ├── tailwind.config.ts     # Dark theme config
│   ├── Dockerfile             # Docker image
│   └── .env.example           # Configuration template
├── models/                     # ML models & scalers
    ├── global_models/
    │   └── global_model_round_5.keras  
    └── scaler.pkl                      

```

---

## 💫 Key Capabilities

| Feature | Details |
|---------|---------|
| **Image Upload** | Drag-drop or click to upload BMP/JPG/PNG (max 10MB) |
| **Form Validation** | Real-time numeric validation with reference ranges |
| **Model Inference** | <1s prediction with confidence scoring |
| **Results Display** | Classification + probability breakdown charts |
| **Error Handling** | Comprehensive validation and user feedback |
| **CORS Support** | Configured for localhost:3000 |
| **Dark Theme** | Professional medical interface (slate/gray tones) |
| **Responsive Design** | Works on desktop and tablet |

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.8+** and **Node.js 16+**

### Standard Setup (Recommended)

1. **Clone/Download Project**
   ```bash
   cd leukemia-diagnosis
   ```

2. **Setup Backend** (Terminal 1)
   ```bash
   cd backend
   python -m venv venv
   # Windows: venv\Scripts\activate
   # macOS/Linux: source venv/bin/activate
   pip install -r requirements.txt
   python main.py
   ```

3. **Setup Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access Dashboard**
   ```
   http://localhost:3000
   ```

---

## 🧪 Testing

```bash
# Check backend health
curl http://localhost:8000/health

# View API documentation
http://localhost:8000/docs

# Access frontend
http://localhost:3000
```

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| **Backend won't start** | Check Python version (3.8+), activate venv, reinstall with `pip install -r requirements.txt` |
| **Frontend won't start** | Check Node version (16+), try `npm cache clean --force && npm install` |
| **CORS errors** | Ensure backend running on port 8000, check allow_origins in main.py |
| **Port in use** | Backend: change to port 8001; Frontend: `npm run dev -- -p 3001` |


---

## 📊 API Reference

### Base URL: `http://localhost:8000`

**GET `/health`** - Health check
```json
{ "status": "healthy", "model_loaded": true, "scaler_loaded": true }
```

**POST `/predict`** - Diagnosis prediction
- Input: Image file + 9 clinical features
- Output: Classification + confidence scores
- Full docs: `http://localhost:8000/docs`

---

## ⚠️ Medical Disclaimer

**This system is for educational and research purposes only.**

- NOT a substitute for professional medical diagnosis
- Results should NOT be used for clinical decisions
- Always consult qualified healthcare professionals
- Ensure compliance with healthcare regulations (HIPAA, GDPR)

---

## 📈 Project Stats

- **Backend Routes:** 3 (/health, /predict, /docs)
- **Frontend Components:** 1 (Dashboard)
- **API Endpoints:** 2 (Health, Prediction)
- **Form Fields:** 9 clinical + 1 image
- **Supported Formats:** BMP, JPG, PNG
- **Model Outputs:** Binary classification with confidence

---

## 🤝 Contributing

Contributions welcome! Follow these steps:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push branch (`git push origin feature/name`)
5. Open Pull Request

---

## 📞 Need Help?

1. Review API docs at `http://localhost:8000/docs`
2. Open an issue on GitHub

---

## 🎓 Resources

- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **Next.js Docs:** https://nextjs.org/
- **TensorFlow:** https://www.tensorflow.org/
- **Tailwind CSS:** https://tailwindcss.com/

---

**Version:** 1.0.0 | **Status:** Production Ready | **Last Updated:** March 2026
