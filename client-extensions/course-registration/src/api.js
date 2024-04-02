/**
 * api.js - This contains the shared api() method.
 *
 * @author dnebinger
 */

/* global Liferay */

/**
 * api: Utility method to invoke the headless API with current user authentication.
 * @param url The headless URL portion to call.
 * @param options Options for the call (i.e. GET vs POST, etc).
 * @returns {Promise<Response>} A promise for the response from the headless call.
 */
const api = (url, options = {}) => {
    return fetch(window.location.origin + '/' + url, {
        headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': Liferay.authToken,
        },
        ...options,
    });
};

export default api;
