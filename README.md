# 🩸 Privacy-Preserving Multimodal Federated Learning for Acute Leukemia Diagnosis

[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange?logo=tensorflow)](https://www.tensorflow.org/) 
[![Federated Learning](https://img.shields.io/badge/Architecture-Vertical%20FL-blue)](https://en.wikipedia.org/wiki/Federated_learning) 
[![Medical AI](https://img.shields.io/badge/Focus-Leukemia%20Diagnosis-red)](https://www.nature.com/articles/s41598-020-75618-y)

## 🚀 Project Overview
This project implements a **Vertical Federated Learning (Split Neural Network)** architecture to diagnose Acute Leukemia. It solves the critical healthcare problem of **Data Silos**: Hospital A (Imaging) and Hospital B (Pathology) cannot share raw patient data due to privacy regulations (HIPAA/GDPR). Our system trains a high-accuracy multimodal AI without ever moving raw data from its source.

---

## 🏗️ Architecture: The "Privacy Wall"
Unlike standard AI that dumps data into one folder, this project uses **Vertical Federated Learning** to ensure strict modality isolation.



* **Hospital A (Image Silo):** Processes Blood Smear Images using a **ResNet-50** feature extractor. It only transmits "Smashed Data" (128-dimensional latent vectors) to the server.
* **Hospital B (Tabular Silo):** Processes Clinical Biomarkers (WBC, Hemoglobin, Blast %) using a **Multi-Layer Perceptron (MLP)**. It only transmits 32-dimensional latent vectors.
* **Central Fusion Server:** Receives the "smashed" vectors, concatenates them, and completes the final classification. **The server never sees the original images or raw blood counts.**

---

## 🛠️ Tech Stack
* **Deep Learning:** TensorFlow / Keras
* **Feature Extraction:** ResNet-50 (Transfer Learning)
* **Data Processing:** Pandas, NumPy, Scikit-Learn
* **Visualization:** Matplotlib, Seaborn
* **Privacy Protocol:** Vertical Federated Learning (Simulated SplitNN)

---

## 📊 Dataset Information
The project utilizes a multimodal approach:
1.  **Imaging:** Blood smear microscope images (Benign vs. Early/Pre/Pro Leukemia).
2.  **Clinical:** Static pathology records (`pathology_ds.csv`) mapped to each patient including WBC count, Hemoglobin, Platelet count, Blast cell percentage, and LDH levels.

---

## 📈 Key Features
* **Zero Data Leakage:** Pre-processing and scaling are performed locally at each "Hospital" silo using only local training distributions.
* **Modality Fusion:** Late-stage fusion on the server allows the model to learn the correlation between visual cell patterns and chemical blood markers.
* **Privacy-First:** Cryptographic patient alignment (simulated via sorted pseudo-IDs) ensures data belongs to the same patient without sharing raw IDs.
* **Live Training Monitor:** Real-time progress tracking using Keras progress bars during the Split Learning simulation.

---

## 🚀 How to Run
1.  **Prepare Environment:**
    Ensure you have `pathology_ds.csv` and your `kaggle.json` uploaded to the project directory.
2.  **Install Dependencies:**
    ```bash
    pip install tensorflow pandas numpy scikit-learn matplotlib seaborn opencv-python
    ```
3.  **Execute:**
    Run the script. It will automatically download the Kaggle dataset, parse the folders, and begin the isolated training rounds.

---

## 🎯 Results & Metrics
The final model is evaluated using:
* **Accuracy:** Overall diagnostic performance.
* **Precision/Recall:** Critical for medical use-cases (specifically maximizing Recall to minimize False Negatives).
* **Confusion Matrix:** Visualizing the classification performance across Healthy vs. Leukemia classes.

--- 