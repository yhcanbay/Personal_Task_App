/**
 * Converts "HH:mm" string to minutes from midnight
 * @param {string} timeStr 
 * @returns {number}
 */
export const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

/**
 * Converts minutes from midnight to "HH:mm" string
 * @param {number} totalMinutes 
 * @returns {string}
 */
export const minutesToTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Generates schedule slots based on configuration with multiple intervals
 * stored in config.availability.
 * Uses Binary Search to find the optimal lesson duration that satisfies the divisionCount.
 */
export const generateTimeSlots = (config) => {
    const { availability, divisionCount = 6, breakDuration = 10, startTime, endTime } = config;

    // Normalize availability
    let intervals = availability;
    if (!intervals || intervals.length === 0) {
        intervals = [{
            start: startTime || '09:00',
            end: endTime || '18:00'
        }];
    }

    // Pre-process intervals to minutes
    const processedIntervals = intervals.map(inter => ({
        start: timeToMinutes(inter.start),
        end: timeToMinutes(inter.end)
    })).sort((a, b) => a.start - b.start);

    /**
     * Helper: Counts how many lessons of `duration` (plus breaks) fit into all intervals.
     * Logic: We place as many lessons as possible.
     */
    const countFits = (duration) => {
        let count = 0;
        for (const interval of processedIntervals) {
            let current = interval.start;

            // While we fit a lesson: [current, current+duration]
            while (current + duration <= interval.end) {
                count++;
                // Lesson occupies [current, current+duration]
                // Next potential start is current + duration + break
                current += duration + breakDuration;
            }
        }
        return count;
    };

    // --- Binary Search for Optimal Duration ---
    // We want the largest duration D such that countFits(D) >= divisionCount.
    // Although technically if countFits(D) > divisionCount, we could claim D is too small,
    // but usually users want "At least N lessons".
    // Actually, users want EXACTLY N lessons usually.
    // But if we have 50 mins available and want 2 lessons, 25 mins works. 20 mins works (fits 2).
    // We want MAX duration that fits N.

    let low = 15; // Minimum lesson duration in minutes
    let high = 24 * 60; // Max possible
    let bestDuration = 15;

    // First check if even the minimum fits
    if (countFits(low) < divisionCount) {
        // Edge case: Cannot fit requested number of lessons even at min duration.
        // Behavior: Return as many as possible at min duration.
        bestDuration = low;
    } else {
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const c = countFits(mid);

            if (c >= divisionCount) {
                bestDuration = mid;
                low = mid + 1; // Try bigger
            } else {
                high = mid - 1; // Too big, try smaller
            }
        }
    }

    // --- Generate Slots with bestDuration ---
    const slots = [];
    let globalIndex = 0;

    for (const interval of processedIntervals) {
        let current = interval.start;

        while (globalIndex < divisionCount) {
            const lessonEnd = current + bestDuration;

            if (lessonEnd <= interval.end) {
                // Add Lesson
                slots.push({
                    id: `slot-${globalIndex}-lecture`,
                    type: 'lecture',
                    start: minutesToTime(current),
                    end: minutesToTime(lessonEnd),
                    index: globalIndex
                });

                current = lessonEnd; // Head moves to end of lesson

                // Check for Break
                // Condition:
                // 1. Not the last global lesson
                // 2. Break fits in current interval (strictly?)

                if (globalIndex < divisionCount - 1) {
                    const breakEnd = current + breakDuration;

                    // Does break fit?
                    if (breakEnd <= interval.end) {
                        slots.push({
                            id: `slot-${globalIndex}-break`,
                            type: 'break',
                            start: minutesToTime(current),
                            end: minutesToTime(breakEnd)
                        });
                        current = breakEnd;
                    } else {
                        // Break doesn't fit in this interval.
                        // We swallow the break time? Or just stop here?
                        // The next lesson will start in the NEXT interval.
                        // The gap between intervals > breakDuration presumably.
                        // So we just stop scheduling in this interval.
                        current = interval.end; // Force exit or just break
                        break; // Break inner loop, move to next interval
                    }
                }

                globalIndex++;
            } else {
                // Lesson doesn't fit
                break; // Next interval
            }
        }
    }

    return slots;
};
