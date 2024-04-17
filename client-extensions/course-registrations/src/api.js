import Liferay from './liferay.js';

const {REACT_APP_LIFERAY_HOST = window.location.origin} = process.env;

/**
 * api - This function is a simple wrapper around the fetch API that adds the CSRF token to the headers.
 * @param {*} url The portion of the URL that comes after the host.
 * @param {*} options Optional options to pass to the fetch function.
 * @returns A promise on the result of the fetch function.
 */
const api = async (url, options = {}) => {
	const opts = {
		headers: {
			'accept': 'application/json',
			'Content-Type': 'application/json',
			'x-csrf-token': Liferay.authToken,
		},
		...options,
	};

	console.log("API call to ", REACT_APP_LIFERAY_HOST + '/' + url, " with options ", opts);

	return fetch(REACT_APP_LIFERAY_HOST + '/' + url, opts);
};

export default api;
