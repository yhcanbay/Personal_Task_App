const API_BASE = '/api';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const api = {
  get: async (path) => request(path),
  put: async (path, data) =>
    request(path, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export const localStoreApi = {
  get: async (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  save: async (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
    return data;
  },

  remove: async (key) => {
    localStorage.removeItem(key);
    return true;
  },
};
