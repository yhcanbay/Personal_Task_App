import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/appContext';
import { generateTimeSlots } from '../../utils/timeGenerator';
import { ArrowLeft, Save, Camera, Search } from 'lucide-react';
import html2canvas from 'html2canvas';
import DayColumn from './components/DayColumn';
import EditModal from './components/EditModal';
import './SchedulePage.css';

const DAYS = [
    { id: 'monday', label: 'Pazartesi' },
    { id: 'tuesday', label: 'Salı' },
    { id: 'wednesday', label: 'Çarşamba' },
    { id: 'thursday', label: 'Perşembe' },
    { id: 'friday', label: 'Cuma' },
    { id: 'saturday', label: 'Cumartesi' },
    { id: 'sunday', label: 'Pazar' }
];

const SchedulePage = ({ onBack }) => {
    const { settings, schedule, saveSchedule } = useApp();
    const [localSchedule, setLocalSchedule] = useState(null);
    const [selectedDay, setSelectedDay] = useState('monday');
    const [viewMode, setViewMode] = useState('weekly'); // Add missing state
    const [query, setQuery] = useState('');

    // Modal State
    const [activeSlot, setActiveSlot] = useState(null);
    const [customDescription, setCustomDescription] = useState('');

    const handleDownload = async () => {
        const element = document.querySelector('.schedule-grid');
        if (!element) return;

        try {
            const appBg = getComputedStyle(document.documentElement).getPropertyValue('--bg-app')?.trim() || '#0b1220';
            const canvas = await html2canvas(element, {
                scale: 2, // Higher resolution
                backgroundColor: appBg,
                useCORS: true
            });

            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `ders-programi-${viewMode}-${new Date().toISOString().split('T')[0]}.png`;
            link.click();
        } catch (err) {
            console.error('Screenshot failed:', err);
            alert('Ekran görüntüsü alınamadı.');
        }
    };

    const handleSave = () => {
        saveSchedule(localSchedule);
        alert('Plan başarıyla kaydedildi! ✅');
    };

    // Initialize view
    useEffect(() => {
        if (settings) {
            const generatedSlots = generateTimeSlots(settings);

            let initial = null;
            let shouldUseStored = false;

            // Check if stored schedule is valid AND matches current settings
            if (schedule && schedule.monday && schedule.monday.length > 0) {
                // Validation: Compare generated template length with stored schedule length
                // We only check Monday for performance, assuming symmetry
                // We filter out 'break' slots from count or just compare raw length? 
                // The generator returns breaks too. So raw length comparison is good.
                // We also check if the start time of the first slot matches.

                const storedSlots = schedule.monday;
                const matchingLength = storedSlots.length === generatedSlots.length;

                let matchingTimes = true;
                if (matchingLength && storedSlots.length > 0) {
                    // Check first and last slot times
                    if (storedSlots[0].start !== generatedSlots[0].start ||
                        storedSlots[storedSlots.length - 1].end !== generatedSlots[generatedSlots.length - 1].end) {
                        matchingTimes = false;
                    }
                }

                if (matchingLength && matchingTimes) {
                    shouldUseStored = true;
                }
            }

            const nextSchedule = !shouldUseStored
                ? (() => {
                    initial = {};
                    DAYS.forEach(day => {
                        initial[day.id] = generatedSlots.map(slot => ({
                            id: `${day.id}-${slot.id}`,
                            timeSlotId: slot.id,
                            ...slot,
                            subjectId: null,
                            note: ''
                        }));
                    });
                    return initial;
                })()
                : schedule;

            queueMicrotask(() => setLocalSchedule(nextSchedule));
        }
    }, [settings, schedule]);

    const handleSlotClick = (dayId, slotIndex) => {
        const slot = localSchedule[dayId][slotIndex];
        if (slot.type === 'break') return;

        setActiveSlot({ ...slot, dayId, slotIndex });
        setCustomDescription(slot.note || '');
    };

    const handleSelection = (subjectId) => {
        if (!activeSlot) return;

        const { dayId, slotIndex } = activeSlot;
        const newSchedule = { ...localSchedule };
        newSchedule[dayId] = [...newSchedule[dayId]];

        newSchedule[dayId][slotIndex] = {
            ...newSchedule[dayId][slotIndex],
            subjectId: subjectId,
            note: customDescription // Save the note
        };

        setLocalSchedule(newSchedule);
        setActiveSlot(null);
        setCustomDescription('');
    };

    if (!localSchedule) return <div className="loading-screen">Hazırlanıyor...</div>;

    const normalizedQuery = query.trim().toLowerCase();

    const daysRender = viewMode === 'weekly'
        ? DAYS
        : DAYS.filter(d => d.id === selectedDay);

    return (
        <div className="schedule-page fade-in">
            <header className="schedule-header">
                <div className="header-left">
                    <button onClick={onBack} className="btn-icon">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'weekly' ? 'active' : ''}`}
                            onClick={() => setViewMode('weekly')}
                        >
                            Haftalık
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'daily' ? 'active' : ''}`}
                            onClick={() => setViewMode('daily')}
                        >
                            Günlük
                        </button>
                    </div>
                </div>

                <div className="schedule-tools">
                    <div className="search-box" role="search">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ders / not ara…"
                            aria-label="Programda ara"
                        />
                    </div>
                </div>

                {viewMode === 'daily' && (
                    <div className="day-selector">
                        {DAYS.map(day => (
                            <button
                                key={day.id}
                                className={`day-btn ${selectedDay === day.id ? 'active' : ''}`}
                                onClick={() => setSelectedDay(day.id)}
                            >
                                {day.label}
                            </button>
                        ))}
                    </div>
                )}

                <button className="btn-secondary" onClick={handleDownload} title="Ekran Görüntüsü Al">
                    <Camera size={18} />
                </button>
                <button className="btn-primary" onClick={handleSave}>
                    <Save size={18} />
                    Kaydet
                </button>
            </header>

            <div className={`schedule-grid ${viewMode}`}>
                {daysRender.map(day => (
                    <DayColumn
                        key={day.id}
                        dayId={day.id}
                        label={day.label}
                        slots={localSchedule[day.id]}
                        onSlotClick={handleSlotClick}
                        query={normalizedQuery}
                    />
                ))}
            </div>

            {activeSlot && (
                <EditModal
                    activeSlot={activeSlot}
                    customDescription={customDescription}
                    setCustomDescription={setCustomDescription}
                    handleSelection={handleSelection}
                    onClose={() => setActiveSlot(null)}
                />
            )}
        </div>
    );
};

export default SchedulePage;
