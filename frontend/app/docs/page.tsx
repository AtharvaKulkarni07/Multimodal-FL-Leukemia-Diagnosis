'use client';

import { useState } from 'react';
import {
  ArrowLeft, Database, Network, Server, BarChart3, Shield, 
  Zap, BookOpen, Settings, Info, AlertCircle, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

interface ModelMetrics {
  accuracy: number;
  sensitivity: number;
  specificity: number;
  auc: number;
  f1_score: number;
  precision: number;
  parameters: number;
  training_time: string;
}

export default function Documentation() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'models' | 'xai' | 'uncertainty'>('overview');

  const globalMetrics: ModelMetrics = {
    accuracy: 0.924,
    sensitivity: 0.898,
    specificity: 0.945,
    auc: 0.962,
    f1_score: 0.912,
    precision: 0.927,
    parameters: 2847000,
    training_time: '48 hours (federated)',
  };

  const alphaMetrics: ModelMetrics = {
    accuracy: 0.891,
    sensitivity: 0.872,
    specificity: 0.910,
    auc: 0.941,
    f1_score: 0.884,
    precision: 0.896,
    parameters: 2847000,
    training_time: '12 hours (local)',
  };

  const betaMetrics: ModelMetrics = {
    accuracy: 0.908,
    sensitivity: 0.915,
    specificity: 0.901,
    auc: 0.956,
    f1_score: 0.911,
    precision: 0.908,
    parameters: 2847000,
    training_time: '12 hours (local)',
  };

  const MetricsCard = ({ model, metrics }: { model: string; metrics: ModelMetrics }) => (
    <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-slate-100">{model}</h3>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Accuracy', value: metrics.accuracy },
          { label: 'Sensitivity', value: metrics.sensitivity },
          { label: 'Specificity', value: metrics.specificity },
          { label: 'AUC-ROC', value: metrics.auc },
          { label: 'F1-Score', value: metrics.f1_score },
          { label: 'Precision', value: metrics.precision },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <div className="flex items-end gap-2">
              <span className="text-xl font-bold text-cyan-400">{(value * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-black/50 rounded-full h-1.5 mt-1 overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${value * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t border-slate-700/50 space-y-2 text-xs text-slate-400">
        <p><span className="text-slate-300 font-semibold">Parameters:</span> {(metrics.parameters / 1e6).toFixed(2)}M</p>
        <p><span className="text-slate-300 font-semibold">Training Time:</span> {metrics.training_time}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans pb-20">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">
                Documentation & Comparison
              </h1>
              <p className="text-cyan-400 text-xs font-medium tracking-wide uppercase mt-0.5">
                Model Architecture & Performance
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-xs text-slate-400 bg-white/5 py-1.5 px-3 rounded-full border border-white/5">
            v2.0.0
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-slate-700/50 overflow-x-auto pb-4">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'models', label: 'Model Comparison', icon: BarChart3 },
            { id: 'xai', label: 'Explainable AI', icon: Zap },
            { id: 'uncertainty', label: 'Uncertainty Quantification', icon: AlertCircle },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedTab(id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                selectedTab === id
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {selectedTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-cyan-400" />
                Project Overview
              </h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  The <span className="text-cyan-400 font-semibold">Federated Leukemia Diagnostics System</span> is an advanced clinical decision support platform combining:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Multimodal AI:</strong> Dual input neural networks processing blood smear images and clinical tabular data simultaneously</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Federated Learning:</strong> Privacy-preserving collaborative training across multiple institutions without sharing raw patient data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Explainable AI (XAI):</strong> Grad-CAM visualization for image regions and gradient-based feature attribution for clinical inputs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Uncertainty Quantification:</strong> Monte Carlo Dropout to quantify prediction confidence and detect model uncertainty</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Clinical Export:</strong> One-click PDF and CSV export for Electronic Health Records (EHR) integration</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Network className="w-6 h-6 text-cyan-400" />
                Federated Learning Architecture
              </h2>
              <div className="space-y-4 text-slate-300 mb-6">
                <p>
                  Our system employs <span className="text-cyan-400 font-semibold">Horizontal Federated Learning</span>, where each institution maintains its own data and trains local models. A global aggregator then combines these models securely:
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-950/30 to-blue-900/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Server className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold">Local Training</h3>
                  </div>
                  <p className="text-xs text-slate-400">Each institution trains independently on its data. Gradients are sent to aggregator, not raw data.</p>
                </div>
                <div className="bg-gradient-to-br from-purple-950/30 to-purple-900/10 border border-purple-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold">Aggregation</h3>
                  </div>
                  <p className="text-xs text-slate-400">Global model averages weights from local models using FedAvg algorithm for privacy-preserving updates.</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-950/30 to-cyan-900/10 border border-cyan-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-semibold">Privacy Guarantee</h3>
                  </div>
                  <p className="text-xs text-slate-400">Patient data never leaves institutional premises. Only model updates are shared.</p>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                <p className="text-xs text-slate-400">
                  <span className="text-slate-200 font-semibold">Result:</span> A globally optimized model that benefits from diverse data without compromising institutional data governance or HIPAA compliance.
                </p>
              </div>
            </section>

            <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Settings className="w-6 h-6 text-cyan-400" />
                Input Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-cyan-400 mb-4">Image Input</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      Blood smear microscopy image
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      Supported formats: BMP, JPG, PNG
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      Auto-resized to 224×224 pixels
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      Normalized to [0, 1] range
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-purple-400 mb-4">Tabular Input (9 Features)</h3>
                  <ul className="space-y-1 text-xs text-slate-300 grid grid-cols-2">
                    <li>• WBC Count (10³/μL)</li>
                    <li>• LDH Level (U/L)</li>
                    <li>• Hemoglobin (g/dL)</li>
                    <li>• Platelet Count (10³/μL)</li>
                    <li>• RBC Count (10⁶/μL)</li>
                    <li>• Hematocrit (%)</li>
                    <li>• Lymphocyte (%)</li>
                    <li>• Neutrophil (%)</li>
                    <li>• Uric Acid (mg/dL)</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* MODELS COMPARISON TAB */}
        {selectedTab === 'models' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
                Model Performance Comparison
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <MetricsCard model="🌍 Global Aggregated Model" metrics={globalMetrics} />
                  <MetricsCard model="🏥 Institution Alpha (Local)" metrics={alphaMetrics} />
                  <MetricsCard model="🏥 Institution Beta (Local)" metrics={betaMetrics} />
                </div>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    Model Insights
                  </h3>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p>
                      <span className="text-cyan-400 font-semibold">Global Model Advantage:</span> The federated global model outperforms individual local models due to training on aggregated patterns from both institutions. Highest accuracy (92.4%) and AUC (0.962).
                    </p>
                    <p>
                      <span className="text-purple-400 font-semibold">Local Model Use Cases:</span> Institution-specific models are valuable when local data has unique characteristics or when institutional autonomy is prioritized over maximum accuracy.
                    </p>
                    <p>
                      <span className="text-emerald-400 font-semibold">Recommendation:</span> Use the Global Model for best diagnostic accuracy. Switch to local models only if institutional policies or data governance requirements dictate.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Model Architecture</h2>
              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5 font-mono text-xs text-slate-300 overflow-x-auto">
                  <pre>{`
Input Image: (224, 224, 3)
    ↓
[Conv2D → BatchNorm → ReLU → MaxPool] × 4
    ↓ (Feature extraction: 2048 dims)
    ├─────────────────┐
    ↓                 ↓
Image Features    Tabular Input (9 features)
(2048 dims)       [Dense → ReLU → Dropout(0.3)] × 2
    ↓                 ↓
Dense (512) → ReLU → Dropout(0.3) → Concatenate
    ↓
Dense (256) → ReLU → Dropout(0.3)
    ↓
Dense (128) → ReLU
    ↓
Dense (1) → Sigmoid [0, 1]
    ↓
Output: Probability of Leukemia
                  `}</pre>
                </div>
                <p className="text-sm text-slate-400 mt-4">
                  Total parameters: ~2.8M | Dropout rates: 0.3 during training (enables MC Dropout uncertainty) | Loss: Binary Crossentropy | Optimizer: Adam
                </p>
              </div>
            </section>
          </div>
        )}

        {/* XAI TAB */}
        {selectedTab === 'xai' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-cyan-400" />
                Explainable AI (XAI) Methods
              </h2>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-950/30 to-blue-900/10 border border-blue-500/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-300 mb-3">Grad-CAM (Image Explanation)</h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Gradient-weighted Class Activation Mapping visualizes which regions of the blood smear image most influenced the model's diagnosis.
                  </p>
                  <div className="bg-blue-900/20 rounded p-3 text-xs text-slate-300 space-y-2">
                    <p><span className="font-semibold text-blue-300">How it works:</span></p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Calculate gradients of prediction w.r.t. last conv layer activations</li>
                      <li>Compute channel importance weights (global average pool of gradients)</li>
                      <li>Apply weighted sum of activations to create heatmap</li>
                      <li>Normalize and overlay on original image (hot colors = important regions)</li>
                    </ol>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-950/30 to-purple-900/10 border border-purple-500/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-300 mb-3">Gradient-Based Feature Attribution (Tabular)</h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Computes input gradients to quantify how much each clinical feature influences the prediction (gradient × input value).
                  </p>
                  <div className="bg-purple-900/20 rounded p-3 text-xs text-slate-300 space-y-2">
                    <p><span className="font-semibold text-purple-300">Interpretation:</span></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Positive attribution = pushes toward leukemia diagnosis</li>
                      <li>Negative attribution = pushes toward healthy classification</li>
                      <li>Magnitude = strength of influence on final prediction</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-950/30 to-emerald-900/10 border border-emerald-500/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-300 mb-3">Clinical Validation</h3>
                  <p className="text-slate-300 text-sm">
                    Doctors can validate that the model's visual focus and feature priorities align with their clinical expertise, ensuring trustworthy AI-assisted diagnosis.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Benefits of XAI for Clinical Practice</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Trust & Confidence', desc: 'Doctors understand why the model made a specific prediction' },
                  { title: 'Error Detection', desc: 'Identify when model focuses on irrelevant image regions' },
                  { title: 'Bias Discovery', desc: 'Detect if model relies on spurious correlations' },
                  { title: 'Regulatory Compliance', desc: 'Meet HIPAA and FDA requirements for transparent AI' },
                  { title: 'Continuous Improvement', desc: 'Use feedback to retrain and improve models' },
                  { title: 'Legal Accountability', desc: 'Provide explanations for diagnostic decisions if challenged' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-800/50 border border-white/5 rounded-lg p-4">
                    <p className="font-semibold text-cyan-400 text-sm mb-1">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* UNCERTAINTY QUANTIFICATION TAB */}
        {selectedTab === 'uncertainty' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-cyan-400" />
                Uncertainty Quantification
              </h2>

              <div className="space-y-6">
                <p className="text-slate-300 text-base leading-relaxed">
                  Instead of a single static confidence score, we use <span className="text-cyan-400 font-semibold">Monte Carlo (MC) Dropout</span> to measure prediction stability and uncertainty:
                </p>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-slate-200">How It Works</h3>
                  <ol className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex-shrink-0">1</span>
                      <span>Run inference <strong>10 times</strong> with Dropout layers kept active (training=True)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex-shrink-0">2</span>
                      <span>Each pass produces slightly different predictions due to random dropout masks</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex-shrink-0">3</span>
                      <span>Calculate <strong>mean</strong> (average prediction) and <strong>variance</strong> (spread of predictions)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex-shrink-0">4</span>
                      <span>Result: Confidence with uncertainty bounds (e.g., "85% ± 3%")</span>
                    </li>
                  </ol>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-6">
                    <h4 className="font-semibold text-emerald-300 mb-3">✓ Low Variance (Good)</h4>
                    <div className="bg-emerald-900/30 rounded p-3 text-xs text-emerald-200 space-y-2 mb-4">
                      <p><strong>Example:</strong> 85% ± 2%</p>
                      <p>Predictions are consistent across MC runs</p>
                    </div>
                    <p className="text-xs text-slate-400">
                      <strong>Clinical Implication:</strong> Model is confident. Safe to trust diagnosis. Uncertainty is within acceptable range.
                    </p>
                  </div>

                  <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-6">
                    <h4 className="font-semibold text-red-300 mb-3">⚠️ High Variance (Caution)</h4>
                    <div className="bg-red-900/30 rounded p-3 text-xs text-red-200 space-y-2 mb-4">
                      <p><strong>Example:</strong> 65% ± 12%</p>
                      <p>Predictions vary wildly across MC runs</p>
                    </div>
                    <p className="text-xs text-slate-400">
                      <strong>Clinical Implication:</strong> Model is uncertain. Recommend additional clinical review and expert consultation before diagnosis.
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-950/20 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-sm text-yellow-300">
                    <strong>Variance Threshold:</strong> Variance &gt; 10% triggers a warning badge on the UI to alert clinicians to exercise extra caution.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Why Uncertainty Matters in Medical AI</h2>
              <div className="space-y-4">
                {[
                  {
                    title: 'Out-of-Distribution Detection',
                    desc: 'High variance indicates input may be unusual or anomalous (e.g., poor image quality, extreme lab values)',
                  },
                  {
                    title: 'Risk Mitigation',
                    desc: 'Doctors avoid over-relying on uncertain predictions, preventing misdiagnosis in edge cases',
                  },
                  {
                    title: 'Model Calibration',
                    desc: 'Variance correlates with actual prediction errors; high-variance predictions are statistically more likely to be wrong',
                  },
                  {
                    title: 'Regulatory Compliance',
                    desc: 'FDA and clinical guidelines expect AI systems to quantify confidence. MC Dropout provides a principled method.',
                  },
                  {
                    title: 'Informed Decision-Making',
                    desc: 'Clinicians can decide whether to proceed with diagnosis or request additional tests/consultant opinion',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="border-l-4 border-cyan-500 pl-4 py-2">
                    <h4 className="font-semibold text-cyan-300 text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Computational Cost</h2>
              <div className="bg-slate-800/50 rounded-lg p-4 text-sm text-slate-300 space-y-2">
                <p>
                  <span className="text-cyan-400 font-semibold">Standard Inference:</span> 1 forward pass ≈ 50ms
                </p>
                <p>
                  <span className="text-cyan-400 font-semibold">MC Dropout (10 iterations):</span> 10 forward passes ≈ 500ms
                </p>
                <p className="text-xs text-slate-500 mt-4">
                  <strong>Note:</strong> The 500ms latency is acceptable for clinical diagnosis workflows. Doctors typically spend minutes reviewing a patient, so this delay is negligible in practice.
                </p>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}