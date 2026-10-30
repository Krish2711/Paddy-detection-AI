import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { DetectionPage } from './pages/DetectionPage';
import { ResultsPage } from './pages/ResultsPage';
import { HistoryPage } from './pages/HistoryPage';
import { DiseaseLibraryPage } from './pages/DiseaseLibraryPage';
import { ModelInfoPage } from './pages/ModelInfoPage';
import { SettingsPage } from './pages/SettingsPage';
import { api } from './services/api';
import { HealthInfo, PredictionRecord } from './types';
import { Sprout } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [health, setHealth] = useState<HealthInfo | null>(null);
  const [currentPrediction, setCurrentPrediction] = useState<PredictionRecord | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Sync dark mode class on root HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch health telemetry on startup
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await api.getHealth();
        setHealth(data);
      } catch (err) {
        setHealth(null);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectPredictionById = async (id: number) => {
    try {
      const record = await api.getPredictionById(id);
      setCurrentPrediction(record);
      setActiveTab('results');
    } catch (err) {
      alert('Failed to load prediction details.');
    }
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage setActiveTab={setActiveTab} />;
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} onSelectPrediction={handleSelectPredictionById} />;
      case 'detect':
        return <DetectionPage setActiveTab={setActiveTab} setCurrentPrediction={setCurrentPrediction} />;
      case 'results':
        return <ResultsPage prediction={currentPrediction} setActiveTab={setActiveTab} />;
      case 'history':
        return <HistoryPage onSelectPrediction={handleSelectPredictionById} setActiveTab={setActiveTab} />;
      case 'library':
        return <DiseaseLibraryPage />;
      case 'model':
        return <ModelInfoPage />;
      case 'settings':
        return <SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} />;
      default:
        return <LandingPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        health={health}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {renderActivePage()}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-paddy-600 flex items-center justify-center text-white font-bold">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">PaddyCare AI v1.0.0</span>
            <span>• Precision Agricultural Intelligence</span>
          </div>

          <p className="text-center sm:text-right">
            MobileNetV2 CNN Architecture • FastAPI Backend • SQLite Storage
          </p>
        </div>
      </footer>

    </div>
  );
};

export default App;
