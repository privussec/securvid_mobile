// @flow
import { getLocalVideoTrack } from '../base/tracks';

import 'image-capture';
import './createImageBitmap';

import {
    ADD_FACIAL_EXPRESSION,
    ADD_TO_FACIAL_EXPRESSIONS_BUFFER,
    CLEAR_FACIAL_EXPRESSIONS_BUFFER,
    SET_DETECTION_TIME_INTERVAL,
    START_FACIAL_RECOGNITION,
    STOP_FACIAL_RECOGNITION
} from './actionTypes';
import {
    CPU_TIME_INTERVAL,
    WEBGL_TIME_INTERVAL,
    WEBHOOK_SEND_TIME_INTERVAL
} from './constants';
import { sendDataToWorker, sendFacialExpressionsWebhook } from './functions';
import logger from './logger';

/**
 * Object containing  a image capture of the local track.
 */
let imageCapture;

/**
 * Object where the facial expression worker is stored.
 */
let worker;

/**
 * The last facial expression received from the worker.
 */
let lastFacialExpression;

/**
 * The last facial expression timestamp.
 */
let lastFacialExpressionTimestamp;

/**
 * How many duplicate consecutive expression occurred.
 * If a expression that is not the same as the last one it is reset to 0.
 */
let duplicateConsecutiveExpressions = 0;

/**
 * Variable that keeps the interval for sending expressions to webhook.
 */
let sendInterval;

/**
 * Loads the worker that predicts the facial expression.
 *
 * @returns {void}
 */
export function loadWorker() {
    return function(dispatch: Function) {
        if (!window.Worker) {
            logger.warn('Browser does not support web workers');

            return;
        }
        let baseUrl = '';
        const app: Object = document.querySelector('script[src*="app.bundle.min.js"]');

        if (app) {
            const idx = app.src.lastIndexOf('/');

            baseUrl = `${app.src.substring(0, idx)}/`;
        }
        let workerUrl = `${baseUrl}facial-expressions-worker.min.js`;

        const workerBlob = new Blob([ `importScripts("${workerUrl}");` ], { type: 'application/javascript' });

        workerUrl = window.URL.createObjectURL(workerBlob);
        worker = new Worker(workerUrl, { name: 'Facial Expression Worker' });
        worker.onmessage = function(e: Object) {
            const { type, value } = e.data;

            // receives a message indicating what type of backend tfjs decided to use.
            // it is received after as a response to the first message sent to the worker.
            if (type === 'tf-backend' && value) {
                let detectionTimeInterval = -1;

                if (value === 'webgl') {
                    detectionTimeInterval = WEBGL_TIME_INTERVAL;
                } else if (value === 'cpu') {
                    detectionTimeInterval = CPU_TIME_INTERVAL;
                }
                dispatch(setDetectionTimeInterval(detectionTimeInterval));
            }

            // receives a message with the predicted facial expression.
            if (type === 'facial-expression') {
                sendDataToWorker(worker, imageCapture);
                if (!value) {
                    return;
                }
                if (value === lastFacialExpression) {
                    duplicateConsecutiveExpressions++;
                } else {
                    if (lastFacialExpression && lastFacialExpressionTimestamp) {
                        dispatch(
                        addFacialExpression(
                            lastFacialExpression,
                            duplicateConsecutiveExpressions + 1,
                            lastFacialExpressionTimestamp
                        )
                        );
                    }
                    lastFacialExpression = value;
                    lastFacialExpressionTimestamp = Date.now();
                    duplicateConsecutiveExpressions = 0;
                }
            }
        };
        worker.postMessage({
            id: 'SET_MODELS_URL',
            url: baseUrl
        });
        dispatch(startFacialRecognition());
    };
}

/**
 * Starts the recognition and detection of face expressions.
 *
 * @param  {Object} stream - Video stream.
 * @returns {Function}
 */
export function startFacialRecognition() {
    return async function(dispatch: Function, getState: Function) {
        if (worker === undefined || worker === null) {
            return;
        }
        const state = getState();
        const { recognitionActive } = state['features/facial-recognition'];

        if (recognitionActive) {
            return;
        }
        const localVideoTrack = getLocalVideoTrack(state['features/base/tracks']);

        if (localVideoTrack === undefined) {
            return;
        }
        const stream = localVideoTrack.jitsiTrack.getOriginalStream();

        if (stream === null) {
            return;
        }
        dispatch({ type: START_FACIAL_RECOGNITION });
        logger.log('Start face recognition');
        const firstVideoTrack = stream.getVideoTracks()[0];

        // $FlowFixMe
        imageCapture = new ImageCapture(firstVideoTrack);
        sendDataToWorker(worker, imageCapture);
        sendInterval = setInterval(async () => {
            const result = await sendFacialExpressionsWebhook(getState());

            if (result) {
                dispatch(clearFacialExpressionBuffer());
            }
        }
        , WEBHOOK_SEND_TIME_INTERVAL);
    };
}

/**
 * Stops the recognition and detection of face expressions.
 *
 * @returns {void}
 */
export function stopFacialRecognition() {
    return function(dispatch: Function, getState: Function) {
        const state = getState();
        const { recognitionActive } = state['features/facial-recognition'];

        if (!recognitionActive) {
            imageCapture = null;

            return;
        }
        imageCapture = null;
        worker.postMessage({
            id: 'CLEAR_TIMEOUT'
        });

        if (lastFacialExpression && lastFacialExpressionTimestamp) {
            dispatch(
                        addFacialExpression(
                            lastFacialExpression,
                            duplicateConsecutiveExpressions + 1,
                            lastFacialExpressionTimestamp
                        )
            );
        }
        duplicateConsecutiveExpressions = 0;

        if (sendInterval) {
            clearInterval(sendInterval);
            sendInterval = null;
        }
        dispatch({ type: STOP_FACIAL_RECOGNITION });
        logger.log('Stop face recognition');
    };
}

/**
 * Resets the track in the image capture.
 *
 * @returns {void}
 */
export function resetTrack() {
    return function(dispatch: Function, getState: Function) {
        const state = getState();
        const { jitsiTrack: localVideoTrack } = getLocalVideoTrack(state['features/base/tracks']);
        const stream = localVideoTrack.getOriginalStream();
        const firstVideoTrack = stream.getVideoTracks()[0];

        // $FlowFixMe
        imageCapture = new ImageCapture(firstVideoTrack);

    };
}

/**
 * Changes the track from the image capture with a given one.
 *
 * @param  {Object} track - The track that will be in the new image capture.
 * @returns {void}
 */
export function changeTrack(track: Object) {
    const { jitsiTrack } = track;
    const stream = jitsiTrack.getOriginalStream();
    const firstVideoTrack = stream.getVideoTracks()[0];

    // $FlowFixMe
    imageCapture = new ImageCapture(firstVideoTrack);
}

/**
 * Adds a new facial expression and its duration.
 *
 * @param  {string} facialExpression - Facial expression to be added.
 * @param  {number} duration - Duration in seconds of the facial expression.
 * @param  {number} timestamp - Duration in seconds of the facial expression.
 * @returns {Object}
 */
function addFacialExpression(facialExpression: string, duration: number, timestamp: number) {
    return function(dispatch: Function, getState: Function) {
        const { detectionTimeInterval } = getState()['features/facial-recognition'];
        let finalDuration = duration;

        if (detectionTimeInterval !== -1) {
            finalDuration *= detectionTimeInterval / 1000;
        }
        dispatch({
            type: ADD_FACIAL_EXPRESSION,
            facialExpression,
            duration: finalDuration,
            timestamp
        });
    };
}

/**
 * Sets the time interval for the detection worker post message.
 *
 * @param  {number} time - The time interval.
 * @returns {Object}
 */
function setDetectionTimeInterval(time: number) {
    return {
        type: SET_DETECTION_TIME_INTERVAL,
        time
    };
}

/**
 * Adds a facial expression with its timestamp to the facial expression buffer.
 *
 * @param  {Object} facialExpression - Object containing facial expression string and its timestamp.
 * @returns {Object}
 */
export function addToFacialExpressionsBuffer(facialExpression: Object) {
    return {
        type: ADD_TO_FACIAL_EXPRESSIONS_BUFFER,
        facialExpression
    };
}

/**
 * Clears the facial expressions array in the state.
 *
 * @returns {Object}
 */
function clearFacialExpressionBuffer() {
    return {
        type: CLEAR_FACIAL_EXPRESSIONS_BUFFER
    };
}
