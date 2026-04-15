import React from 'react';
import DayColumn from './DayColumn';

const ScheduleGrid = ({ schedule, onSlotClick }) => {
    return (
        <div className="schedule-grid">
            {Object.keys(schedule).map((day) => (
                <DayColumn
                    key={day}
                    day={day}
                    items={schedule[day]}
                    onSlotClick={onSlotClick}
                />
            ))}
        </div>
    );
};

export default ScheduleGrid;
