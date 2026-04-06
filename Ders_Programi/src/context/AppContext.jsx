import React, { useState, useEffect } from 'react';
import { settingsService, DEFAULT_SETTINGS } from '../services/settingsService';
import { scheduleService } from '../services/scheduleService';
import { todoService } from '../services/todoService';
import { applyTheme } from '../utils/theme';
import { AppContext } from './appContext';

export const AppProvider = ({ children }) => {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [schedule, setSchedule] = useState(null);
    const [todos, setTodos] = useState({}); // Add todos state
    const [loading, setLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [loadedSettings, loadedSchedule, loadedTodos] = await Promise.all([
                    settingsService.getSettings(),
                    scheduleService.getSchedule(),
                    todoService.getTodos() // Load todos
                ]);
                setSettings(loadedSettings);
                setSchedule(loadedSchedule);
                setTodos(loadedTodos); // Set todos
                applyTheme(loadedSettings?.theme);
            } catch (error) {
                console.error("Failed to load app data", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        applyTheme(settings?.theme);
    }, [settings?.theme]);

    const updateSettings = async (newSettings) => {
        setLoading(true);
        try {
            await settingsService.saveSettings(newSettings);
            setSettings(newSettings);
        } finally {
            setLoading(false);
        }
    };

    const saveSchedule = async (newSchedule) => {
        // Optimistic update
        setSchedule(newSchedule);
        await scheduleService.saveSchedule(newSchedule);
    };

    const saveTodos = async (newTodos) => {
        setTodos(newTodos);
        await todoService.saveTodos(newTodos);
    };

    return (
        <AppContext.Provider value={{
            settings,
            schedule,
            todos,
            loading,
            updateSettings,
            saveSchedule,
            saveTodos
        }}>
            {children}
        </AppContext.Provider>
    );
};
