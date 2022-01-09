// @flow

import {
    INIT_SEARCH,
    INIT_UPDATE_STATS,
    UPDATE_STATS,
    INIT_REORDER_STATS,
    RESET_SEARCH_CRITERIA
} from './actionTypes';

/**
 * Starts a search by criteria.
 *
 * @param {string | null} criteria - The search criteria.
 * @returns {Object}
 */
export function initSearch(criteria: string | null) {
    return {
        type: INIT_SEARCH,
        criteria
    };
}

/**
 * Gets the new stats and triggers update.
 *
 * @param {Function} getSpeakerStats - Function to get the speaker stats.
 * @returns {Object}
 */
export function initUpdateStats(getSpeakerStats: Function) {
    return {
        type: INIT_UPDATE_STATS,
        getSpeakerStats
    };
}

/**
 * Updates the stats with new stats.
 *
 * @param {Object} stats - The new stats.
 * @returns {Object}
 */
export function updateStats(stats: Object) {
    return {
        type: UPDATE_STATS,
        stats
    };
}

/**
 * Initiates reordering of the stats.
 *
 * @returns {Object}
 */
export function initReorderStats() {
    return {
        type: INIT_REORDER_STATS
    };
}

/**
 * Resets the search criteria.
 *
 * @returns {Object}
 */
export function resetSearchCriteria() {
    return {
        type: RESET_SEARCH_CRITERIA
    };
}
