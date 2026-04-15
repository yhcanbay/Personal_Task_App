import { api } from './api';

const SETTINGS_KEY = 'planner_settings_v1';

export const DEFAULT_SETTINGS = {
    availability: [{ start: '09:00', end: '18:00' }], // Replaces simple start/end
    divisionCount: 6, // Default division count
    slotDuration: 45, // Minutes (ders süresi) - Legacy, calculated dynamically now
    breakDuration: 10, // Minutes (mola süresi) - Kullanıcı seçebilecek
    theme: 'system', // system | dark | light
    subjects: [
        { id: 'math', name: 'Matematik', color: '#FF5733' },
        { id: 'physics', name: 'Fizik', color: '#33FF57' }
    ]
};

export const settingsService = {
    getSettings: async () => {
        const settings = await api.get(SETTINGS_KEY);
        // Merge with defaults
        const merged = { ...DEFAULT_SETTINGS, ...settings };

        // Migrate legacy start/endTime if availability is missing
        if (!merged.availability && merged.startTime && merged.endTime) {
            merged.availability = [{ start: merged.startTime, end: merged.endTime }];
        }

        if (!merged.theme) merged.theme = DEFAULT_SETTINGS.theme;

        return merged;
    },

    saveSettings: async (newSettings) => {
        return await api.save(SETTINGS_KEY, newSettings);
    },

    resetSettings: async () => {
        return await api.save(SETTINGS_KEY, DEFAULT_SETTINGS);
    }
};
