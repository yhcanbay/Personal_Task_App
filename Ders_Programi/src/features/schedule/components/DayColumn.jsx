import React from 'react';
import EventCard from './EventCard';

const DayColumn = ({ dayId, label, slots, onSlotClick, query = '' }) => {
    return (
        <div className="day-column">
            <div className="day-header">{label}</div>
            <div className="day-content">
                {slots.map((slot, index) => (
                    <div key={slot.id} className="time-slot-wrapper">
                        {/* Time label logic can go here or be hidden based on design */}
                        <EventCard
                            slot={slot}
                            onClick={() => onSlotClick(dayId, index)}
                            query={query}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DayColumn;
