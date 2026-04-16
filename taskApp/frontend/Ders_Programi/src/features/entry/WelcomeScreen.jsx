import React from 'react';
import { Calendar, Settings, FilePlus } from 'lucide-react';
import './WelcomeScreen.css';

const WelcomeScreen = ({ onNavigate }) => {
    return (
        <div className="welcome-container fade-in">
            <div className="welcome-content">
                <div className="logo-area">
                    <Calendar size={64} className="logo-icon" />
                    <h1>Haftalık Planlayıcı ama Ersin hocam yok</h1>
                    <p className="subtitle">Zamanınızı en verimli şekilde yönetin</p>
                </div>

                <div className="action-buttons">
                    <button
                        className="action-card primary"
                        onClick={() => onNavigate('schedule')}
                    >
                        <Calendar size={32} />
                        <div className="text-content">
                            <h3>Saatlik Program</h3>
                            <p>Haftalık ve Günlük detaylı plan</p>
                        </div>
                    </button>

                    <button
                        className="action-card primary"
                        onClick={() => onNavigate('todo')}
                    >
                        <FilePlus size={32} />
                        <div className="text-content">
                            <h3>To-Do Listesi</h3>
                            <p>Yapılacaklar listesi ve görevler</p>
                        </div>
                    </button>

                    <button
                        className="action-card secondary"
                        onClick={() => onNavigate('settings')}
                    >
                        <Settings size={32} />
                        <div className="text-content">
                            <h3>Ayarlar</h3>
                            <p>Dersler, saatler ve tercihler</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
