import React from 'react';
import { useApp } from '../../../context/appContext';

const EventCard = ({ slot, onClick, query = '' }) => {
    const { settings } = useApp();
    const subject = settings.subjects.find(s => s.id === slot.subjectId);

    if (slot.type === 'break') {
        return (
            <div className="schedule-slot break">
                <span className="break-line"></span>
            </div>
        );
    }

    // Determine state
    const isEmpty = !subject && !slot.note;
    const matchesQuery = !query
        ? false
        : (subject?.name?.toLowerCase().includes(query) || (slot.note || '').toLowerCase().includes(query));

    return (
        <div
            className={`schedule-slot lecture ${!isEmpty ? 'filled' : 'empty'} ${matchesQuery ? 'match' : ''}`}
            style={subject ? {
                backgroundColor: subject.color + '20',
                borderLeftColor: subject.color
            } : {}}
            onClick={onClick}
        >
            <div className="slot-time-label">{slot.start} - {slot.end}</div>

            {isEmpty ? (
                <div className="empty-state">
                    <span className="add-icon">+</span>
                </div>
            ) : (
                <div className="content-state">
                    {subject && <span className="card-title">{subject.name}</span>}
                    {slot.note && <span className="card-note">{slot.note}</span>}
                </div>
            )}
        </div>
    );
};

export default EventCard;
