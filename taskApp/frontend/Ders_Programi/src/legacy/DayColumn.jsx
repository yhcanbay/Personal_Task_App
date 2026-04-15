import React from 'react';
import EventCard from './EventCard';

const DayColumn = ({ day, items, onSlotClick }) => {
    return (
        <div className="day-column">
            <div className="day-header">
                {day}
            </div>
            <div className="day-content">
                {items.map((item) => (
                    <div key={item.id} className="time-slot-wrapper">
                        <div className="time-label">
                            {item.time}
                        </div>
                        <EventCard
                            item={item}
                            onClick={() => onSlotClick(day, item)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DayColumn;
