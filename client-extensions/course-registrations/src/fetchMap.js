/**
 * fetchMap.js: Utility routines for fetching picklists as a map.
 */

import api from './api.js';

/**
 * fetchMap: Fetches a picklist and returns it as a map.
 * @param {*} url The URL to fetch the picklist.
 * @returns The map of the picklist.
 */
async function fetchMap(url) {
    // get the promise from the api call
    const response = await api(url);

    if (!response.ok) {
        throw new Error('Failed retrieving picklist');
    }

    // extract the json from the response
    const data = await response.json();

    // extract the map
    const map = data.listTypeEntries.reduce((acc, entry) => {
        acc[entry.key] = entry.name;
        return acc;
    }, {});

    // return the map
    return map;
};

export default fetchMap;