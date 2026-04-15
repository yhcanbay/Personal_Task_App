import { api } from './api';
import { generateTimeSlots } from '../utils/timeGenerator';

export const scheduleService = {
    getSchedule: async () => {
        return await api.get('/schedules/weekly');
    },

    saveSchedule: async (schedule) => {
        return await api.put('/schedules/weekly', schedule);
    },

    /**
     * Generates a blank schedule based on settings
     * @param {import('../models/types').ScheduleConfig} config 
     * @returns {Object} Initial schedule structure
     */
    generateTemplate: (config) => {
        const timeSlots = generateTimeSlots(config);
        const initialSchedule = {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: []
        };

        // Initialize empty slots for each day matching the time slots
        Object.keys(initialSchedule).forEach(day => {
            initialSchedule[day] = timeSlots.map(slot => ({
                id: `${day}-${slot.id}`,
                timeSlotId: slot.id,
                ...slot, // spans start/end/type
                subjectId: null, // Empty initially
                note: ''
            }));
        });

        return initialSchedule;
    }
};
