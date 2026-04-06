import React, { useRef, useState } from 'react';
import { useApp } from '../../context/appContext';
import { Download, Moon, Plus, Save, Sun, Trash2, Upload, ArrowLeft, LaptopMinimal } from 'lucide-react';
import './Settings.css';

const SettingsPage = ({ onBack }) => {
    const { settings, updateSettings, schedule, saveSchedule, todos, saveTodos } = useApp();
    const importFileRef = useRef(null);

    // Local state for form management before saving
    const [formData, setFormData] = useState({
        ...settings,
        // Ensure availability exists if migrating
        availability: settings.availability || [{ start: settings.startTime || '09:00', end: settings.endTime || '18:00' }]
    });

    const [newSubject, setNewSubject] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Time Interval Management
    const handleIntervalChange = (index, field, value) => {
        const newAvailability = [...formData.availability];
        newAvailability[index] = { ...newAvailability[index], [field]: value };
        setFormData(prev => ({ ...prev, availability: newAvailability }));
    };

    const addInterval = () => {
        setFormData(prev => ({
            ...prev,
            availability: [...prev.availability, { start: '12:00', end: '13:00' }]
        }));
    };

    const removeInterval = (index) => {
        if (formData.availability.length === 1) return; // Prevent deleting last one
        setFormData(prev => ({
            ...prev,
            availability: prev.availability.filter((_, i) => i !== index)
        }));
    };

    // Subject Management
    const handleAddSubject = (e) => {
        e.preventDefault();
        if (!newSubject.trim()) return;

        const subject = {
            id: Date.now().toString(),
            name: newSubject,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`
        };

        setFormData(prev => ({
            ...prev,
            subjects: [...prev.subjects, subject]
        }));
        setNewSubject('');
    };

    const removeSubject = (id) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.filter(s => s.id !== id)
        }));
    };

    const handleExport = async () => {
        const payload = {
            version: 1,
            exportedAt: new Date().toISOString(),
            settings,
            schedule,
            todos
        };

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ders-programi-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const openImportPicker = () => {
        importFileRef.current?.click();
    };

    const handleImport = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            if (data?.settings) await updateSettings(data.settings);
            if (data?.schedule) await saveSchedule(data.schedule);
            if (data?.todos) await saveTodos(data.todos);

            alert('Yedek içe aktarıldı. ✅');
        } catch (err) {
            console.error(err);
            alert('Yedek dosyası okunamadı.');
        } finally {
            e.target.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateSettings(formData);
        onBack();
    };

    return (
        <div className="settings-container fade-in">
            <header className="settings-header">
                <button onClick={onBack} className="btn-icon">
                    <ArrowLeft size={24} />
                </button>
                <h1>Ayarlar</h1>
                <button className="btn-primary" onClick={handleSubmit}>
                    <Save size={18} />
                    Kaydet
                </button>
            </header>

            <div className="settings-grid">
                {/* Tema */}
                <section className="settings-card">
                    <h2>Görünüm</h2>

                    <div className="theme-row">
                        <label className="input-label">Tema</label>
                        <div className="segmented">
                            <button
                                type="button"
                                className={`seg-btn ${formData.theme === 'system' ? 'active' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, theme: 'system' }))}
                            >
                                <LaptopMinimal size={16} /> Sistem
                            </button>
                            <button
                                type="button"
                                className={`seg-btn ${formData.theme === 'dark' ? 'active' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, theme: 'dark' }))}
                            >
                                <Moon size={16} /> Koyu
                            </button>
                            <button
                                type="button"
                                className={`seg-btn ${formData.theme === 'light' ? 'active' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, theme: 'light' }))}
                            >
                                <Sun size={16} /> Açık
                            </button>
                        </div>
                    </div>
                </section>

                {/* Zaman Yapılandırması */}
                <section className="settings-card">
                    <h2>Zamanlama & Aralıklar</h2>

                    <div className="intervals-container">
                        <label className="input-label">Müsait Zaman Aralıkları</label>
                        {formData.availability.map((interval, index) => (
                            <div key={index} className="interval-row">
                                <div className="time-inputs">
                                    <input
                                        type="time"
                                        value={interval.start}
                                        onChange={(e) => handleIntervalChange(index, 'start', e.target.value)}
                                        aria-label="Start Time"
                                    />
                                    <span className="separator">-</span>
                                    <input
                                        type="time"
                                        value={interval.end}
                                        onChange={(e) => handleIntervalChange(index, 'end', e.target.value)}
                                        aria-label="End Time"
                                    />
                                </div>
                                <button
                                    onClick={() => removeInterval(index)}
                                    className="btn-danger-text"
                                    disabled={formData.availability.length === 1}
                                    title="Aralığı Sil"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}

                        <button onClick={addInterval} className="btn-secondary btn-full-width">
                            <Plus size={16} /> Yeni Aralık Ekle
                        </button>
                    </div>

                    <hr className="divider" />

                    <div className="form-group">
                        <label>Toplam Ders/Bölüm Sayısı</label>
                        <input
                            type="number"
                            name="divisionCount"
                            min="1"
                            max="30"
                            value={formData.divisionCount || 6}
                            onChange={handleChange}
                        />
                        <small className="hint">Tüm gün toplam kaç derse bölünecek?</small>
                    </div>
                    <div className="form-group">
                        <label>Mola Süresi (Dakika)</label>
                        <input
                            type="number"
                            name="breakDuration"
                            min="0"
                            max="60"
                            value={formData.breakDuration}
                            onChange={handleChange}
                        />
                    </div>
                </section>

                {/* Ders Yönetimi */}
                <section className="settings-card">
                    <h2>Dersler / Konular</h2>
                    <form onSubmit={handleAddSubject} className="add-subject-form">
                        <input
                            type="text"
                            placeholder="Yeni ders adı..."
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                        />
                        <button type="submit" className="btn-secondary">
                            <Plus size={18} />
                        </button>
                    </form>

                    <div className="subjects-list">
                        {formData.subjects.map(subject => (
                            <div key={subject.id} className="subject-item" style={{ borderLeftColor: subject.color }}>
                                <span>{subject.name}</span>
                                <button onClick={() => removeSubject(subject.id)} className="btn-danger-text">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Yedek */}
                <section className="settings-card">
                    <h2>Yedekleme</h2>

                    <div className="backup-actions">
                        <button type="button" className="btn-secondary btn-full-width" onClick={handleExport}>
                            <Download size={18} /> Yedeği Dışa Aktar (JSON)
                        </button>

                        <button type="button" className="btn-secondary btn-full-width" onClick={openImportPicker}>
                            <Upload size={18} /> Yedeği İçe Aktar (JSON)
                        </button>

                        <input
                            ref={importFileRef}
                            type="file"
                            accept="application/json"
                            onChange={handleImport}
                            style={{ display: 'none' }}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SettingsPage;
