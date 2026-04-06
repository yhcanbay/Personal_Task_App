import React, { useState } from 'react';
import { AppProvider } from './context/AppContext.jsx';
import { useApp } from './context/appContext';
import WelcomeScreen from './features/entry/WelcomeScreen';
import SettingsPage from './features/settings/SettingsPage';
import SchedulePage from './features/schedule/SchedulePage';
import TodoPage from './features/todo/TodoPage';
import './App.css';

const AppContent = () => {
  const { loading } = useApp();
  const [currentView, setCurrentView] = useState('welcome'); // welcome, settings, schedule

  if (loading) {
    return <div className="loading-screen">Yükleniyor...</div>;
  }

  const renderView = () => {
    switch (currentView) {
      case 'settings':
        return <SettingsPage onBack={() => setCurrentView('welcome')} />;
      case 'schedule':
        return <SchedulePage onBack={() => setCurrentView('welcome')} />;
      case 'todo':
        return <TodoPage onBack={() => setCurrentView('welcome')} />; // Use TodoPage
      case 'welcome':
      default:
        return <WelcomeScreen onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="main-layout">
      {renderView()}
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;