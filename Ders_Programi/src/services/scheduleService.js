import { api } from './api';
import { generateTimeSlots } from '../utils/timeGenerator';

const SCHEDULE_KEY = 'planner_schedule_v1';

export const scheduleService = {
    getSchedule: async () => {
        return await api.get(SCHEDULE_KEY);
    },

    saveSchedule: async (schedule) => {
        return await api.save(SCHEDULE_KEY, schedule);
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
