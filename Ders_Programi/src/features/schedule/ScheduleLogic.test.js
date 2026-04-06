import { describe, it, expect } from 'vitest';
import { generateTimeSlots } from '../../utils/timeGenerator';

describe('Time Generator', () => {
    it('should generate correct number of slots', () => {
        const config = {
            startTime: '09:00',
            endTime: '12:00',
            divisionCount: 3,
            breakDuration: 10
        };
        const slots = generateTimeSlots(config);

        // 3 Lectures + 2 Breaks = 5 Slots
        expect(slots.length).toBe(5);
    });

    it('should calculate correct duration with breaks', () => {
        const config = {
            startTime: '10:00',
            endTime: '11:00', // 60 mins total
            divisionCount: 2,
            breakDuration: 10
        };
        // Available: 60 - 10 = 50 min.
        // Each lesson: 25 min.

        const slots = generateTimeSlots(config);

        // Slot 1: 10:00 - 10:25
        expect(slots[0].start).toBe('10:00');
        expect(slots[0].end).toBe('10:25');

        // Break: 10:25 - 10:35
        expect(slots[1].type).toBe('break');
        expect(slots[1].start).toBe('10:25');
        expect(slots[1].end).toBe('10:35');

        // Slot 2: 10:35 - 11:00
        expect(slots[2].start).toBe('10:35');
        expect(slots[2].end).toBe('11:00');
    });
});
