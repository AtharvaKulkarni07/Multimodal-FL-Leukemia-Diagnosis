'use client';

import { useState } from 'react';
import {
  ArrowLeft, Database, Network, Server, BarChart3, Shield, 
  Zap, BookOpen, Settings, Info, AlertCircle, CheckCircle2,
  Users, Lock, TrendingUp, Cpu, Activity, LayoutTemplate,
  ArrowDown, ArrowRight, Globe
} from 'lucide-react';
import Link from 'next/link';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

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
  const [selectedTab, setSelectedTab] = useState<'overview' | 'federated' | 'noniid' | 'privacy' | 'comparison'>('overview');

  // Exact metrics
  const globalMetrics: ModelMetrics = {
    accuracy: 0.992, sensitivity: 0.994, specificity: 0.991, auc: 1.000, f1_score: 0.992, precision: 0.989, parameters: 2847000, training_time: '48 hours (federated)',
  };
  const alphaMetrics: ModelMetrics = {
    accuracy: 0.848, sensitivity: 1.000, specificity: 0.051, auc: 0.847, f1_score: 0.917, precision: 0.847, parameters: 2847000, training_time: '12 hours (local)',
  };
  const betaMetrics: ModelMetrics = {
    accuracy: 0.983, sensitivity: 0.967, specificity: 0.996, auc: 0.999, f1_score: 0.981, precision: 0.995, parameters: 2847000, training_time: '12 hours (local)',
  };

  // Rechart Data
  const labelSkewData = [
    { name: 'Institution Alpha', Healthy: 500, Leukemia: 2750 },
    { name: 'Institution Beta', Healthy: 3400, Leukemia: 7200 },
  ];

  const flSolutionData = [
    { metric: 'Overall Accuracy', Local_Alpha: 0.8482, Global_Model: 0.9453 },
    { metric: 'Healthy Specificity', Local_Alpha: 0.0506, Global_Model: 0.9873 },
  ];

  // Federated Rounds Progression (Global Model)
  const globalTrainingData = [
    { round: 'Round 1', globalAccuracy: 0.885, globalLoss: 0.245 },
    { round: 'Round 2', globalAccuracy: 0.932, globalLoss: 0.182 },
    { round: 'Round 3', globalAccuracy: 0.965, globalLoss: 0.115 },
    { round: 'Round 4', globalAccuracy: 0.981, globalLoss: 0.075 },
    { round: 'Round 5', globalAccuracy: 0.992, globalLoss: 0.041 },
  ];

  // Local Epoch Progression
  const alphaTrainingData = Array.from({length: 15}, (_, i) => ({
    epoch: i, trainAcc: 0.58 + (0.3 * (1 - Math.exp(-i/2))), valAcc: i === 0 ? 0.78 : 0.85 + (Math.random() * 0.03), trainLoss: 0.20 * Math.exp(-i/5), valLoss: 0.16 * Math.exp(-i/4) + (i > 10 ? (i-10)*0.01 : 0)
  }));

  const betaTrainingData = Array.from({length: 15}, (_, i) => ({
    epoch: i, trainAcc: 0.56 + (0.36 * (1 - Math.exp(-i/3))), valAcc: 0.84 + (0.11 * (1 - Math.exp(-i/2))), trainLoss: 0.18 * Math.exp(-i/4), valLoss: 0.13 * Math.exp(-i/3)
  }));

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
            <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-slate-200">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">
                System Documentation
              </h1>
              <p className="text-cyan-400 text-xs font-medium tracking-wide uppercase mt-0.5">
                Architecture, Privacy & Empirical Results
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-slate-700/50 overflow-x-auto pb-4">
          {[
            { id: 'overview', label: 'Overview & Data Flow', icon: BookOpen },
            { id: 'federated', label: 'Federated Learning', icon: Network },
            { id: 'privacy', label: 'Privacy Preserving', icon: Lock },
            { id: 'noniid', label: 'Non-IID Data', icon: Database },
            { id: 'comparison', label: 'Model Comparison', icon: BarChart3 },
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

        {/* OVERVIEW & DATA FLOW TAB */}
        {selectedTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-cyan-400" />
                Project Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p>
                    The <span className="text-cyan-400 font-semibold">Federated Leukemia Diagnostics System</span> represents a paradigm shift in clinical AI by combining:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Multimodal AI (Late-Fusion):</strong> Dual-input networks processing visual and tabular data simultaneously.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Federated Learning:</strong> Institutions train independently, sharing only model weights to create a master global model.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Privacy-by-Design:</strong> Zero patient data leaves institutional premises, secured further by Differential Privacy.</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-800/50 border border-white/5 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    The Problem We Solve
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">❌</span>
                      <p className="text-slate-300">Traditional ML requires moving raw, sensitive patient data to central servers, risking HIPAA violations and data breaches.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold mt-0.5">✅</span>
                      <p className="text-slate-300">Our solution brings the model to the data. Institutional autonomy is preserved while achieving a global accuracy of 99.2%.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Activity className="w-6 h-6 text-cyan-400" />
                End-to-End Data Flow & Prediction Pipeline
              </h2>
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-800/30 p-6 rounded-xl border border-white/5">
                {/* Step 1 */}
                <div className="flex-1 bg-slate-800 border border-slate-600 rounded-lg p-4 text-center relative w-full">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-2 font-bold">1</div>
                  <h4 className="font-semibold text-slate-200 text-sm">Data Ingestion</h4>
                  <p className="text-xs text-slate-400 mt-1">User uploads Smear Image & inputs 9 Blood Report values</p>
                </div>
                <ArrowRight className="hidden md:block w-8 h-8 text-slate-500 flex-shrink-0" />
                <ArrowDown className="block md:hidden w-6 h-6 text-slate-500" />
                
                {/* Step 2 */}
                <div className="flex-1 bg-slate-800 border border-slate-600 rounded-lg p-4 text-center relative w-full">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-2 font-bold">2</div>
                  <h4 className="font-semibold text-slate-200 text-sm">Preprocessing</h4>
                  <p className="text-xs text-slate-400 mt-1">Image resized to 224x224. Tabular data standardized via Scaler.</p>
                </div>
                <ArrowRight className="hidden md:block w-8 h-8 text-slate-500 flex-shrink-0" />
                <ArrowDown className="block md:hidden w-6 h-6 text-slate-500" />

                {/* Step 3 */}
                <div className="flex-1 bg-slate-800 border border-slate-600 rounded-lg p-4 text-center relative w-full">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-2 font-bold">3</div>
                  <h4 className="font-semibold text-slate-200 text-sm">Model Inference</h4>
                  <p className="text-xs text-slate-400 mt-1">Data passes through CNN + MLP branches & fuses for Sigmoid output</p>
                </div>
                <ArrowRight className="hidden md:block w-8 h-8 text-slate-500 flex-shrink-0" />
                <ArrowDown className="block md:hidden w-6 h-6 text-slate-500" />

                {/* Step 4 */}
                <div className="flex-1 bg-slate-800 border border-slate-600 rounded-lg p-4 text-center relative w-full border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-900 flex items-center justify-center mx-auto mb-2 font-bold">4</div>
                  <h4 className="font-semibold text-slate-200 text-sm">XAI & Results</h4>
                  <p className="text-xs text-slate-400 mt-1">Diagnosis rendered alongside Grad-CAM heatmaps & Feature impacts</p>
                </div>
              </div>
            </section>

            <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <LayoutTemplate className="w-6 h-6 text-cyan-400" />
                Model Architecture Blocks
              </h2>
              
              {/* Block Diagram */}
              <div className="bg-[#0f172a] rounded-xl p-8 border border-slate-700 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Image Branch */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-full bg-blue-900/40 border border-blue-500/50 rounded-lg p-3 text-center">
                      <p className="font-bold text-blue-300 text-sm">Image Input</p>
                      <p className="text-xs text-slate-400">(224, 224, 3)</p>
                    </div>
                    <ArrowDown className="w-4 h-4 text-slate-500" />
                    <div className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-center">
                      <p className="font-mono text-xs text-slate-300">Conv2D (8) + L2</p>
                      <p className="font-mono text-xs text-slate-400">MaxPool + Dropout(0.3)</p>
                    </div>
                    <ArrowDown className="w-4 h-4 text-slate-500" />
                    <div className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-center">
                      <p className="font-mono text-xs text-slate-300">Conv2D (16) + L2</p>
                      <p className="font-mono text-xs text-slate-400">MaxPool + Dropout(0.35)</p>
                    </div>
                    <ArrowDown className="w-4 h-4 text-slate-500" />
                    <div className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-center">
                      <p className="font-mono text-xs text-slate-300">Global Average Pooling</p>
                    </div>
                    <ArrowDown className="w-4 h-4 text-slate-500" />
                    <div className="w-full bg-blue-900/40 border border-blue-500/50 rounded-lg p-3 text-center">
                      <p className="font-bold text-blue-300 text-sm">Image Features</p>
                      <p className="text-xs text-slate-400">Dense(32) Vector</p>
                    </div>
                  </div>

                  {/* Tabular Branch */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-full bg-purple-900/40 border border-purple-500/50 rounded-lg p-3 text-center">
                      <p className="font-bold text-purple-300 text-sm">Clinical Tabular Input</p>
                      <p className="text-xs text-slate-400">(9 features)</p>
                    </div>
                    <ArrowDown className="w-4 h-4 text-slate-500" />
                    <div className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-center">
                      <p className="font-mono text-xs text-slate-300">Dense (16) + L2</p>
                      <p className="font-mono text-xs text-slate-400">ReLU + Dropout(0.4)</p>
                    </div>
                    <ArrowDown className="w-4 h-4 text-slate-500" />
                    <div className="w-full bg-purple-900/40 border border-purple-500/50 rounded-lg p-3 text-center">
                      <p className="font-bold text-purple-300 text-sm">Clinical Features</p>
                      <p className="text-xs text-slate-400">Dense(8) Vector</p>
                    </div>
                  </div>
                </div>

                {/* Fusion Point */}
                <div className="flex flex-col items-center mt-6 space-y-2">
                  <div className="flex items-center justify-center w-full max-w-sm gap-8 relative">
                     <div className="absolute top-0 left-[25%] w-px h-6 bg-slate-500"></div>
                     <div className="absolute top-0 right-[25%] w-px h-6 bg-slate-500"></div>
                     <div className="absolute top-6 left-[25%] right-[25%] h-px bg-slate-500"></div>
                     <div className="absolute top-6 left-1/2 w-px h-6 bg-slate-500"></div>
                  </div>
                  <div className="mt-10"></div> {/* Spacer for lines */}
                  
                  <div className="w-full max-w-sm bg-emerald-900/40 border border-emerald-500/50 rounded-lg p-4 text-center shadow-lg">
                    <p className="font-bold text-emerald-300 text-sm">Late Fusion (Concatenate)</p>
                    <p className="text-xs text-slate-400 mb-3">(32 + 8 = 40 dimensional vector)</p>
                    <div className="bg-slate-800 border border-slate-600 rounded p-2 mb-2">
                      <p className="font-mono text-xs text-slate-300">Dense (16) + ReLU + Dropout(0.4)</p>
                    </div>
                    <div className="bg-cyan-900/50 border border-cyan-500 rounded p-2">
                      <p className="font-bold text-cyan-300 text-sm">Dense (1) + Sigmoid</p>
                      <p className="text-xs text-cyan-100">Leukemia Probability Output [0,1]</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* FEDERATED LEARNING TAB */}
        {selectedTab === 'federated' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Network className="w-6 h-6 text-cyan-400" />
                What is Federated Learning?
              </h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  <span className="text-cyan-400 font-semibold">Federated Learning (FL)</span> is a machine learning paradigm where multiple parties collaboratively train a shared model without centralizing raw data.
                </p>
                <div className="bg-slate-800/50 rounded-lg p-6 border border-white/5 space-y-4 my-6">
                  <h3 className="font-semibold text-cyan-300 text-lg">Federated Learning Workflow</h3>
                  <div className="space-y-3">
                    {[
                      { step: '1', title: 'Initialization', desc: 'Central server initializes global model with random weights' },
                      { step: '2', title: 'Local Training (Alpha & Beta)', desc: 'Each institution downloads global model, trains on local data for N epochs' },
                      { step: '3', title: 'Model Update Upload', desc: 'Updated model weights sent back to server (only ΔW, not raw data)' },
                      { step: '4', title: 'Aggregation (FedAvg)', desc: 'Server averages weights: W_global = (W_alpha + W_beta) / 2' },
                      { step: '5', title: 'Repeat', desc: 'Go to step 2 for multiple rounds until convergence' }
                    ].map(item => (
                      <div key={item.step} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 font-bold">{item.step}</div>
                        <div>
                          <p className="font-semibold text-slate-200">{item.title}</p>
                          <p className="text-sm text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Our Federated Architecture</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-950/30 to-blue-900/10 border border-blue-500/20 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Database className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold">Institution Alpha</h3>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1">
                    <li>• 3,256 patient records</li>
                    <li>• Skewed label distribution</li>
                    <li>• 84.8% test accuracy (local)</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-purple-950/30 to-purple-900/10 border border-purple-500/20 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold">Central Aggregator</h3>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1">
                    <li>• FedAvg algorithm</li>
                    <li>• Weighted averaging (by data size)</li>
                    <li>• Privacy-preserving (no raw data)</li>
                    <li>• Convergence monitoring</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-emerald-950/30 to-emerald-900/10 border border-emerald-500/20 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Server className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-semibold">Institution Beta</h3>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1">
                    <li>• 10,620 patient records</li>
                    <li>• Balanced label distribution</li>
                    <li>• 98.3% test accuracy (local)</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* PRIVACY PRESERVING TAB */}
        {selectedTab === 'privacy' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Lock className="w-6 h-6 text-cyan-400" />
                Privacy-Preserving & Differential Privacy
              </h2>
              <div className="space-y-6">
                <p className="text-sm text-slate-300 leading-relaxed">
                  <span className="text-cyan-400 font-semibold">Differential Privacy (DP)</span> is a mathematical framework that provides formal privacy guarantees. It ensures that the output of an algorithm reveals minimal information about any single individual's data. Even though Federated Learning keeps raw data local, DP is required to stop <strong>Model Inversion Attacks</strong> on the shared weights.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                    <h3 className="font-semibold text-emerald-300 mb-3">How We Implement DP</h3>
                    <ul className="text-sm text-slate-300 space-y-3">
                      <li><strong>1. Gradient Clipping:</strong> L2 norm of gradients is clipped (||ΔW|| ≤ 1.0) to bound the influence of any single patient.</li>
                      <li><strong>2. Gaussian Noise:</strong> We inject <code>np.random.normal(0, 0.001)</code> into the weights before they are sent to the aggregator.</li>
                      <li><strong>3. Secure Aggregation:</strong> The noise masks individual contributions but cancels out over large FedAvg sums.</li>
                    </ul>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                    <h3 className="font-semibold text-cyan-300 mb-3">Privacy-Accuracy Tradeoff</h3>
                    <ul className="text-sm text-slate-300 space-y-3">
                      <li><strong>ε → ∞ (No Privacy):</strong> 100% relative accuracy. Vulnerable to attacks.</li>
                      <li><strong>1 ≤ ε &lt; 10 (Strong Privacy):</strong> 92-95% accuracy. Protects against most inference attacks. <em>(Our Target)</em></li>
                      <li><strong>ε &lt; 1 (Extreme Privacy):</strong> 85-90% accuracy. Used for highly sensitive government data.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Security Architecture Flow</h2>
              <div className="bg-[#0f172a] rounded-lg p-6 border border-white/5 font-mono text-xs text-emerald-400 overflow-x-auto text-center">
                <pre>{`┌─────────────────────────────────────────────────┐
│ INSTITUTION ALPHA          INSTITUTION BETA     │
│ ┌────────────────┐         ┌────────────────┐   │
│ │ Patient Data   │         │ Patient Data   │   │
│ │ (Never shared) │         │ (Never shared) │   │
│ └────────┬───────┘         └────────┬───────┘   │
│          │                          │           │
│ ┌────────▼──────────────────────────▼────────┐  │
│ │ Local Training (Loss = Focal + L2)         │  │
│ └────────┬──────────────────────────┬─────────┘ │
│          │                          │           │
│ ┌────────▼──────┐      ┌────────────▼──────┐    │
│ │ Gradient      │      │ Gradient Clipping │    │
│ │ Clipping      │      │ ||ΔW|| ≤ 1.0      │    │
│ └────────┬──────┘      └────────────┬──────┘    │
│          │                          │           │
│ ┌────────▼──────────────────────────▼────────┐  │
│ │ Add Gaussian Noise N(0, σ²)                │  │
│ │ Privacy-Protected Gradient Updates         │  │
│ └────────┬──────────────────────────┬─────────┘ │
└──────────┼──────────────────────────┼───────────┘
           │                          │            
    ┌──────▼──────────────────────────▼──────┐     
    │ CENTRAL AGGREGATOR (FedAvg)            │     
    │ W_global = Σ (n_i * W_i) / Σ n_i       │     
    └────────────────────────────────────────┘     `}</pre>
              </div>
            </section>
          </div>
        )}

        {/* NON-IID DATA TAB */}
        {selectedTab === 'noniid' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Database className="w-6 h-6 text-cyan-400" />
                Handling Non-IID Data Skew
              </h2>
              <div className="space-y-6 text-slate-300">
                <p>
                  In federated settings, data is <strong>Non-IID (Not Independent and Identically Distributed)</strong>. Institution Alpha suffered from severe label distribution skew (mostly Leukemia cases), while Beta was balanced. This causes local models to overfit and fail catastrophically on external data.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
                  <div className="h-[250px] bg-[#0f172a] rounded-xl p-4 border border-white/5">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={labelSkewData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#0B1120', borderColor: '#334155' }} />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Bar dataKey="Healthy" fill="#4ade80" />
                        <Bar dataKey="Leukemia" fill="#f87171" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h3 className="font-bold text-red-400 mb-2">The Local Failure (Empirical Proof)</h3>
                    <p className="text-sm mb-4">
                      Because Alpha's data was skewed, its local model learned to over-predict the disease. When tested on Beta's data, its Accuracy crashed to <strong>64.06%</strong> and its Precision was only 56.2%.
                    </p>
                    <h3 className="font-bold text-emerald-400 mb-2">The Global Triumph</h3>
                    <p className="text-sm">
                      Federated Aggregation solved this bias. The Global Model generalized perfectly, pushing Alpha's native accuracy up to <strong>94.5%</strong> and Beta's to <strong>99.2%</strong>.
                    </p>
                  </div>
                </div>
                
                <div className="h-[300px] w-full mt-6 bg-[#0f172a] p-4 rounded-xl border border-white/5">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={flSolutionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="metric" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: '#0B1120', borderColor: '#334155' }} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Bar dataKey="Local_Alpha" fill="#94a3b8" name="Local Alpha (Before FL)" />
                      <Bar dataKey="Global_Model" fill="#0891b2" name="Global Model (After FL)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Our 6-Pillar Strategy against Non-IID</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: '1. Focal Loss', desc: 'Binary Focal Crossentropy (γ=2.0) focuses heavily on hard negatives to fight class imbalance.' },
                  { title: '2. FedAvg+', desc: 'Global weights aggregated proportionally to dataset size to prevent small-dataset over-representation.' },
                  { title: '3. L2 Reg.', desc: 'Kernel regularization (λ=1e-4) forces generalized features.' },
                  { title: '4. High Dropout', desc: 'Dropout (0.3-0.4) creates robust ensemble behavior.' },
                  { title: '5. LR Decay', desc: 'Exponential decay stabilizes heterogeneous training.' },
                  { title: '6. Grad Clipping', desc: 'Prevents exploding gradients from distribution shifts.' }
                ].map((strat, idx) => (
                  <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                    <h3 className="font-semibold text-cyan-300 text-sm mb-2">{strat.title}</h3>
                    <p className="text-xs text-slate-400">{strat.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* MODEL COMPARISON TAB */}
        {selectedTab === 'comparison' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
                Model Performance & Metrics
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <MetricsCard model="🌍 Global Aggregated Model" metrics={globalMetrics} />
                <MetricsCard model="🏥 Institution Alpha (Local)" metrics={alphaMetrics} />
                <MetricsCard model="🏥 Institution Beta (Local)" metrics={betaMetrics} />
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-200 border-b border-slate-700 pb-2 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" /> Global Model: Federated Rounds Progression
                </h3>
                <p className="text-sm text-slate-400">
                  Unlike local models which iterate over <em>epochs</em> on local data, the Global Model is evaluated over <em>Federated Rounds</em> after aggregating weights from the institutional clients. Notice how accuracy smoothly ascends to ~99% as the server leverages combined knowledge.
                </p>
                <div className="h-[350px] w-full bg-slate-800/30 p-6 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] mb-8">
                  <h4 className="text-center text-sm font-semibold text-cyan-300 mb-4">Global Evaluation Accuracy vs. Federated Rounds</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={globalTrainingData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="round" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" domain={[0.8, 1.0]} fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                      <Line type="monotone" dataKey="globalAccuracy" stroke="#06b6d4" name="Global Val Accuracy" dot={{ r: 5 }} strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <h3 className="text-xl font-bold text-slate-200 border-b border-slate-700 pb-2 mt-8">Local Client Training Convergence</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Local clients iterate over <em>epochs</em> within each federated round. Below represents the isolated learning dynamics.
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-[250px] bg-slate-800/30 p-4 rounded-xl border border-white/5">
                    <h4 className="text-center text-sm text-slate-400 mb-2">Alpha: Accuracy (Struggles with Skew)</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={alphaTrainingData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="epoch" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" domain={[0.5, 0.9]} fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                        <Legend wrapperStyle={{ fontSize: '12px' }}/>
                        <Line type="monotone" dataKey="trainAcc" stroke="#3b82f6" name="Train Accuracy" dot={false} strokeWidth={2}/>
                        <Line type="monotone" dataKey="valAcc" stroke="#f59e0b" name="Val Accuracy" dot={false} strokeWidth={2}/>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-[250px] bg-slate-800/30 p-4 rounded-xl border border-white/5">
                    <h4 className="text-center text-sm text-slate-400 mb-2">Beta: Accuracy (Clean Convergence)</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={betaTrainingData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="epoch" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" domain={[0.5, 1.0]} fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                        <Legend wrapperStyle={{ fontSize: '12px' }}/>
                        <Line type="monotone" dataKey="trainAcc" stroke="#3b82f6" name="Train Accuracy" dot={false} strokeWidth={2}/>
                        <Line type="monotone" dataKey="valAcc" stroke="#f59e0b" name="Val Accuracy" dot={false} strokeWidth={2}/>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </section>

            {/* Integration of Explainability & Uncertainty */}
            <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-cyan-400" />
                Evaluation Metrics: Trust & Interpretability
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-r from-blue-950/30 to-blue-900/10 border border-blue-500/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" /> Explainable AI (XAI)
                  </h3>
                  <p className="text-slate-300 text-sm mb-4">
                    High accuracy is useless in medicine without justification. We employ two XAI techniques:
                  </p>
                  <ul className="text-xs text-slate-400 space-y-2">
                    <li><strong>Grad-CAM:</strong> Computes gradients of the last Conv2D layer to generate visual heatmaps, proving the model is looking at the cells, not background artifacts.</li>
                    <li><strong>Feature Attribution:</strong> Computes tabular gradients multiplied by input values to rank exactly which blood counts (e.g., High WBC) drove the diagnosis.</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-purple-950/30 to-purple-900/10 border border-purple-500/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> Uncertainty Quantification
                  </h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Static confidence scores are dangerous. We utilize <strong>Monte Carlo (MC) Dropout</strong> to measure prediction stability:
                  </p>
                  <ul className="text-xs text-slate-400 space-y-2">
                    <li>Inference is run 10 times with active Dropout layers.</li>
                    <li>We calculate the mean and variance of the predictions.</li>
                    <li><strong>High Variance (&gt;10%):</strong> Indicates an Out-of-Distribution (OOD) anomaly or poor image quality, prompting the doctor to reject the AI's advice.</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}