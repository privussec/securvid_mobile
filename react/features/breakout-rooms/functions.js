// @flow

import _ from 'lodash';

import { getCurrentConference } from '../base/conference';
import { toState } from '../base/redux';

import { FEATURE_KEY } from './constants';

/**
 * Returns the rooms object for breakout rooms.
 *
 * @param {Function|Object} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {Object} Object of rooms.
 */
export const getBreakoutRooms = (stateful: Function | Object) => toState(stateful)[FEATURE_KEY].rooms;

/**
 * Returns the main room.
 *
 * @param {Function|Object} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {Object|undefined} The main room object, or undefined.
 */
export const getMainRoom = (stateful: Function | Object) => {
    const rooms = getBreakoutRooms(stateful);

    return _.find(rooms, (room: Object) => room.isMainRoom);
};

/**
 * Returns the id of the current room.
 *
 * @param {Function|Object} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {string} Room id or undefined.
 */
export const getCurrentRoomId = (stateful: Function | Object) => {
    const conference = getCurrentConference(stateful);

    // $FlowExpectedError
    return conference?.getName();
};

/**
 * Determines whether the local participant is in a breakout room.
 *
 * @param {Function|Object} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {boolean}
 */
export const isInBreakoutRoom = (stateful: Function | Object) => {
    const conference = getCurrentConference(stateful);

    // $FlowExpectedError
    return conference?.getBreakoutRooms()
        ?.isBreakoutRoom();
};
