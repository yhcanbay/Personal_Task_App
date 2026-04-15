import { localStoreApi as api } from './api';

const TODOS_KEY = 'planner_todos_v1';

export const todoService = {
    getTodos: async () => {
        return (await api.get(TODOS_KEY)) || {};
    },

    saveTodos: async (todos) => {
        return await api.save(TODOS_KEY, todos);
    }
};
