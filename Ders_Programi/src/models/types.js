/**
 * @typedef {Object} Subject
 * @property {string} id
 * @property {string} name
 * @property {string} color
 */

/**
 * @typedef {Object} ScheduleConfig
 * @property {string} startTime - HH:mm format (e.g., "09:00")
 * @property {string} endTime - HH:mm format (e.g., "18:00")
 * @property {number} slotDuration - minutes per lecture
 * @property {number} breakDuration - minutes per break
 * @property {Subject[]} subjects - Available subjects
 */

/**
 * @typedef {Object} TimeSlot
 * @property {string} id - Unique ID
 * @property {string} start - HH:mm
 * @property {string} end - HH:mm
 * @property {string} type - 'lecture' | 'break'
 */

export const Types = {}; // Empty export to treat as module
