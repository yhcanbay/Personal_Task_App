import { api } from './api';

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
        const settings = await api.get('/settings');
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
        return await api.put('/settings', newSettings);
    },

    resetSettings: async () => {
        return await api.put('/settings', DEFAULT_SETTINGS);
    }
};
