/**
 * Mock API Simulation
 * This layer mimics a backend API interaction (e.g., Spring Boot).
 * It uses localStorage for persistence and adds artificial delay.
 */

const DELAY_MS = 300; // Network latency simulation

export const api = {
  /**
   * Generic GET request
   * @param {string} key - LocalStorage key
   * @returns {Promise<any>}
   */
  get: async (key) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem(key);
        resolve(data ? JSON.parse(data) : null);
      }, DELAY_MS);
    });
  },

  /**
   * Generic POST/PUT request
   * @param {string} key - LocalStorage key
   * @param {any} data - Data to save
   * @returns {Promise<any>}
   */
  save: async (key, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(key, JSON.stringify(data));
        resolve(data);
      }, DELAY_MS);
    });
  },

  /**
   * Clear specific data
   * @param {string} key 
   */
  remove: async (key) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem(key);
        resolve(true);
      }, DELAY_MS);
    });
  }
};
