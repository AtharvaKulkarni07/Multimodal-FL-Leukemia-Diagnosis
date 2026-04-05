'use client';

import { useState, useRef, ChangeEvent, FormEvent, DragEvent } from 'react';
import Image from 'next/image';
import axios from 'axios';
import toast from 'react-hot-toast';

interface PredictionResponse {
  classification: string;
  confidence: number;
  probability_healthy: number;
  probability_leukemia: number;
  message: string;
}

interface FormData {
  WBC_count: string;
  LDH_level: string;
  Hemoglobin: string;
  Platelet_count: string;
  RBC_count: string;
  Hematocrit: string;
  Lymphocyte_percentage: string;
  Neutrophil_percentage: string;
  Uric_acid: string;
}

export default function LeukemiaDiagnosis() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showResults, setShowResults] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    WBC_count: '',
    LDH_level: '',
    Hemoglobin: '',
    Platelet_count: '',
    RBC_count: '',
    Hematocrit: '',
    Lymphocyte_percentage: '',
    Neutrophil_percentage: '',
    Uric_acid: '',
  });

  const featureLabels: Record<keyof FormData, string> = {
    WBC_count: 'WBC Count (10³/μL)',
    LDH_level: 'LDH Level (U/L)',
    Hemoglobin: 'Hemoglobin (g/dL)',
    Platelet_count: 'Platelet Count (10³/μL)',
    RBC_count: 'RBC Count (10⁶/μL)',
    Hematocrit: 'Hematocrit (%)',
    Lymphocyte_percentage: 'Lymphocyte (%)',
    Neutrophil_percentage: 'Neutrophil (%)',
    Uric_acid: 'Uric Acid (mg/dL)',
  };

  // Handle file selection from input
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  // Process file and create preview
  const processFile = (file: File) => {
    const validTypes = ['image/bmp', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a BMP, JPG, or PNG image');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      toast.error('Image size must be less than 10MB');
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    toast.success('Image uploaded successfully');
  };

  // Drag and drop handlers
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  // Handle form input changes
  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const emptyFields = Object.values(formData).filter((val) => val === '');
    if (emptyFields.length > 0) {
      toast.error('Please fill in all clinical features');
      return false;
    }

    const numericValues = Object.values(formData).map((val) => parseFloat(val));
    if (numericValues.some((val) => isNaN(val) || val < 0)) {
      toast.error('Please enter valid positive numbers for all features');
      return false;
    }

    return true;
  };

  // Submit prediction request
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedImage) {
      toast.error('Please upload a blood smear image');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setShowResults(false);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', selectedImage);
      formDataToSend.append('WBC_count', formData.WBC_count);
      formDataToSend.append('LDH_level', formData.LDH_level);
      formDataToSend.append('Hemoglobin', formData.Hemoglobin);
      formDataToSend.append('Platelet_count', formData.Platelet_count);
      formDataToSend.append('RBC_count', formData.RBC_count);
      formDataToSend.append('Hematocrit', formData.Hematocrit);
      formDataToSend.append('Lymphocyte_percentage', formData.Lymphocyte_percentage);
      formDataToSend.append('Neutrophil_percentage', formData.Neutrophil_percentage);
      formDataToSend.append('Uric_acid', formData.Uric_acid);

      const response = await axios.post<PredictionResponse>(
        'http://localhost:8000/predict',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setPrediction(response.data);
      setShowResults(true);
      toast.success('Diagnosis complete!');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || 'Failed to get prediction';
        toast.error(errorMessage || 'Server connection error');
      } else {
        toast.error('An unexpected error occurred');
      }
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setPrediction(null);
    setShowResults(false);
    setFormData({
      WBC_count: '',
      LDH_level: '',
      Hemoglobin: '',
      Platelet_count: '',
      RBC_count: '',
      Hematocrit: '',
      Lymphocyte_percentage: '',
      Neutrophil_percentage: '',
      Uric_acid: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Form reset');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Leukemia Diagnosis System
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Multimodal AI Analysis: Blood Smear Image + Clinical Features
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">v1.0.0</p>
              <p className="text-xs text-slate-500">Medical Diagnosis Tool</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Image Upload */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold mr-3">
                    1
                  </span>
                  Blood Smear Image
                </h2>

                {/* Drag and Drop Zone */}
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                    isDragging
                      ? 'border-cyan-400 bg-cyan-500/10'
                      : 'border-slate-600 bg-slate-700/30 hover:border-slate-500 hover:bg-slate-700/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".bmp,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-slate-900">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-300 font-medium">
                          {selectedImage?.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(selectedImage?.size || 0) > 1024 * 1024
                            ? `${((selectedImage?.size || 0) / (1024 * 1024)).toFixed(2)} MB`
                            : `${((selectedImage?.size || 0) / 1024).toFixed(2)} KB`}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(null);
                            setImagePreview(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          className="mt-3 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm transition-colors"
                        >
                          Change Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <svg
                          className="w-12 h-12 text-slate-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-slate-200 font-medium">
                          Drop your image here
                        </p>
                        <p className="text-slate-400 text-sm mt-1">
                          or click to browse
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 mt-3">
                        BMP, JPG, or PNG (Max 10MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Image Requirements Info Card */}
              <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs mr-2">
                    ℹ
                  </span>
                  Image Requirements
                </h3>
                <ul className="text-xs text-slate-400 space-y-2 ml-7">
                  <li>• High-quality blood smear image</li>
                  <li>• Supported formats: BMP, JPG, PNG</li>
                  <li>• Minimum resolution: 224x224 pixels</li>
                  <li>• Good lighting and contrast</li>
                </ul>
              </div>
            </div>

            {/* Right Column: Clinical Features Form */}
            <div>
              <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold mr-3">
                  2
                </span>
                Clinical Features
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.keys(formData).map((key) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      {featureLabels[key as keyof FormData]}
                    </label>
                    <input
                      type="number"
                      name={key}
                      value={formData[key as keyof FormData]}
                      onChange={handleFormChange}
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-colors"
                    />
                  </div>
                ))}
              </div>

              {/* Clinical Features Info Card */}
              <div className="mt-6 bg-slate-700/40 border border-slate-600 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs mr-2">
                    ℹ
                  </span>
                  Reference Ranges (Normal)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 ml-7">
                  <div>• WBC: 4.5-11 K/μL</div>
                  <div>• LDH: 140-280 U/L</div>
                  <div>• Hemoglobin: 12-17 g/dL</div>
                  <div>• Platelets: 150-400 K/μL</div>
                  <div>• RBC: 4-6 M/μL</div>
                  <div>• Hematocrit: 35-50%</div>
                  <div>• Lymphocytes: 20-40%</div>
                  <div>• Neutrophils: 40-75%</div>
                  <div>• Uric Acid: 3.5-7.2 mg/dL</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>🔬</span>
                  <span>Run Diagnosis</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-slate-200 font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Results Section */}
        {showResults && prediction && (
          <div className="mt-12 space-y-6">
            <div className="border-t border-slate-700 pt-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">
                📋 Diagnosis Results
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Classification Card */}
                <div
                  className={`rounded-xl p-6 border-2 ${
                    prediction.classification === 'Leukemia'
                      ? 'bg-red-900/20 border-red-500/50'
                      : 'bg-green-900/20 border-green-500/50'
                  }`}
                >
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                    Classification
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Result:</span>
                      <span
                        className={`text-3xl font-bold ${
                          prediction.classification === 'Leukemia'
                            ? 'text-red-400'
                            : 'text-green-400'
                        }`}
                      >
                        {prediction.classification === 'Leukemia' ? '⚠️' : '✅'}
                      </span>
                    </div>
                    <div>
                      <p
                        className={`text-2xl font-bold ${
                          prediction.classification === 'Leukemia'
                            ? 'text-red-400'
                            : 'text-green-400'
                        }`}
                      >
                        {prediction.classification}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Confidence Card */}
                <div className="rounded-xl p-6 bg-slate-700/40 border-2 border-cyan-500/30">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                    Confidence Score
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-end justify-between">
                      <span className="text-slate-400">Confidence:</span>
                      <span className="text-3xl font-bold text-cyan-400">
                        {(prediction.confidence * 100).toFixed(1)}%
                      </span>
                    </div>

                    {/* Confidence Progress Bar */}
                    <div className="space-y-2">
                      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full transition-all duration-500"
                          style={{ width: `${prediction.confidence * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        {prediction.confidence > 0.8
                          ? 'High Confidence'
                          : prediction.confidence > 0.6
                          ? 'Moderate Confidence'
                          : 'Low Confidence'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Probability Breakdown */}
              <div className="mt-6 rounded-xl p-6 bg-slate-700/40 border border-slate-600 space-y-4">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  Probability Breakdown
                </h3>

                <div className="space-y-4">
                  {/* Healthy Probability */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300">Healthy</span>
                      <span className="text-sm font-semibold text-green-400">
                        {(prediction.probability_healthy * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${prediction.probability_healthy * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Leukemia Probability */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300">Leukemia</span>
                      <span className="text-sm font-semibold text-red-400">
                        {(prediction.probability_leukemia * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-red-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${prediction.probability_leukemia * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Card */}
              <div className="mt-6 rounded-xl p-4 bg-blue-900/20 border border-blue-500/30">
                <p className="text-blue-300 text-sm">{prediction.message}</p>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 rounded-xl p-4 bg-amber-900/20 border border-amber-500/30">
                <p className="text-amber-300 text-xs leading-relaxed">
                  ⚠️ <strong>Medical Disclaimer:</strong> This tool is for educational and
                  research purposes only. It should not be used as a substitute for
                  professional medical diagnosis. Always consult qualified healthcare
                  professionals for clinical decisions.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-800/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-xs text-slate-500">
            Multimodal Leukemia Diagnosis System • Powered by TensorFlow &amp; FastAPI
          </p>
        </div>
      </footer>
    </div>
  );
}
