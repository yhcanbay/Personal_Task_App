import React, { useEffect, useRef } from 'react';
import { courses, activityOptions } from '../data/options';

const EditModal = ({ activeSlot, customDescription, setCustomDescription, handleSelection, onClose }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (activeSlot && inputRef.current) {
            inputRef.current.focus();
        }
    }, [activeSlot]);

    if (!activeSlot) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>

                <div className="modal-header">
                    <div>
                        <h3 className="modal-title">Ne Yapıyoruz?</h3>
                        <p className="modal-subtitle">{activeSlot.day} • {activeSlot.time}</p>
                    </div>
                    <button onClick={onClose} className="close-button">×</button>
                </div>

                <div className="modal-body">
                    <label className="input-label">
                        Opsiyonel Açıklama / Detay:
                    </label>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Örn: Final sunumu, Valorant, 2. Bölüm tekrar..."
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        className="modal-input"
                    />

                    <div className="options-container">

                        <div className="section-title">📚 Dersler</div>
                        <div className="grid-2-col">
                            {courses.map(course => (
                                <button
                                    key={course}
                                    onClick={() => handleSelection(course, 'course')}
                                    className="option-button course-button"
                                >
                                    {course}
                                </button>
                            ))}
                        </div>

                        <div className="section-title">✨ Aktiviteler</div>
                        <div className="grid-2-col">
                            {activityOptions.map(option => (
                                <button
                                    key={option.label}
                                    onClick={() => handleSelection(option.label, option.type)}
                                    className={`option-button activity-button ${option.type}-button`}
                                >
                                    <span className="button-icon">{option.icon}</span>
                                    <span>{option.label}</span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => handleSelection('Planla')}
                            className="option-button clear-button"
                        >
                            🗑️ Temizle / Boş Bırak
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
