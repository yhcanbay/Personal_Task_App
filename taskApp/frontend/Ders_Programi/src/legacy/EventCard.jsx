import React from 'react';

const EventCard = ({ item, onClick }) => {
    const getIcon = (note, type) => {
        if (note === 'Planla') return '+';
        if (type === 'course') return '📚';
        if (note === 'Oyun/Eğlence') return '🎮';
        if (note === 'Mola') return '☕';
        if (note === 'Yemek') return '🍔';
        if (note === 'Soru Çözümü') return '🧠';
        if (note === 'Proje') return '🚀';
        return '📌';
    };

    const isEmpty = item.note === 'Planla';
    const cardClass = `card ${isEmpty ? 'card-empty' : `card-${item.type || 'default'}`}`; // Use item.type for styling

    return (
        <div className={cardClass} onClick={onClick}>
            {isEmpty ? (
                <div className="empty-state">
                    <span className="add-icon">+</span>
                    <span className="add-text">Planla</span>
                </div>
            ) : (
                <div className="content-state">
                    <div className="card-header">
                        <span className="card-title">{item.note}</span>
                        <span className="card-icon">{getIcon(item.note, item.type)}</span>
                    </div>

                    {item.description && (
                        <div className="card-description">
                            "{item.description}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EventCard;
