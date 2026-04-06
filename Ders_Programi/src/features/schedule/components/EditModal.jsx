import React, { useEffect, useRef } from 'react';
import { useApp } from '../../../context/appContext';
import { X } from 'lucide-react';
import './EditModal.css';

const EditModal = ({ activeSlot, customDescription, setCustomDescription, handleSelection, onClose }) => {
    const inputRef = useRef(null);
    const { settings } = useApp();

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
                        <p className="modal-subtitle">
                            {activeSlot.start} - {activeSlot.end}
                        </p>
                    </div>
                    <button onClick={onClose} className="close-button">
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <label className="input-label">
                        Not / Açıklama:
                    </label>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Örn: Final sunumu, Spor, Dinlenme..."
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        className="modal-input"
                    />

                    <div className="options-container">

                        <div className="section-title">📚 Dersler</div>
                        <div className="grid-2-col">
                            {settings.subjects.map(subject => (
                                <button
                                    key={subject.id}
                                    onClick={() => handleSelection(subject.id)}
                                    className="option-button"
                                    style={{ borderLeft: `4px solid ${subject.color}` }}
                                >
                                    {subject.name}
                                </button>
                            ))}
                            {settings.subjects.length === 0 && (
                                <p className="no-subs">Henüz ders eklenmemiş. Ayarlardan ekleyebilirsiniz.</p>
                            )}
                        </div>

                        <div className="section-title">✨ Diğer</div>
                        <button
                            onClick={() => handleSelection(null)}
                            className="option-button clear-button"
                        >
                            🗑️ Temizle / Boş
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
