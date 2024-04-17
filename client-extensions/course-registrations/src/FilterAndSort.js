/**
 * Filter and sort functions for the course registrations page.
 */

/**
 * sortData: Sorts the data based on the sort settings.
 * @param {*} data data to sort.
 * @param {*} sort sort settings.
 * @returns The sorted data.
 */
const sortData = (data, sort) => {
    // if no data, nothing to filter or sort
    if (!data || data.length === 0) {
        return [];
    }

    if (sort) {
        return data.sort((a, b) => {
            let colA = a[sort.column];
            let colB = b[sort.column];

            // the sort column is simple, but we need to match against the hierarchical data.
            switch (sort.column) {
                case "attendeeName":
                    colA = a["creator"]["name"];
                    colB = b["creator"]["name"];
                    break;
                case "courseName":
                    colA = a["course"]["name"];
                    colB = b["course"]["name"];
                    break;
                case "registrationStatus":
                    colA = a["registrationStatus"]["name"];
                    colB = b["registrationStatus"]["name"];
                    break;
            }

            let cmp = new Intl.Collator("en", { numeric: true }).compare(
                colA, colB);

            if (sort.direction === "descending") {
                cmp *= -1;
            }

            return cmp;
        });
    }

    return data;
};

/**
 * filterTest: Tests the item against the filter query.
 * @param item The item to test.
 * @param filterQuery The filter query.
 * @returns True if the item matches the filter query, false otherwise.
 */
const filterTest = (item, filterQuery) => {
    return item.course.name.toLowerCase().includes(filterQuery) ||
        item.registrationStatus.name.toLowerCase().includes(filterQuery);
}

/**
 * filterTestAttendee: Tests the item against the filter query that includes the attendee name.
 * @param item The item to test.
 * @param filterQuery The filter query.
 * @returns True if the item matches the filter query, false otherwise.
 */
const filterTestAttendee = (item, filterQuery) => {
    return item.course.name.toLowerCase().includes(filterQuery) || 
        item.creator.name.toLowerCase().includes(filterQuery) ||
        item.registrationStatus.name.toLowerCase().includes(filterQuery);
}

/**
 * filterAndSortData: Filters and sorts the data based on the current filter and sort settings.
 * @param data The data to filter and sort.
 * @param filterQuery The filter query.
 * @param sort The sort settings.
 * @param attendee Flag to indicate whether to filter on attendee.
 * @returns The filtered and sorted data.
 */
const filterAndSortData = ( data, filterQuery, sort, attendee = false ) => {
    // if no data, nothing to filter or sort
    if (!data || data.length === 0) {
        return [];
    }

    // if filter has been provided
    if (filterQuery.length > 0) {
        // apply the right filter on the data
        let filteredData = attendee ? 
            data.filter(item => filterTestAttendee(item, filterQuery)) : data.filter(item => filterTest(item, filterQuery));

        // if sort has been set, sort the filtered data
        if (sort && sort.column && sort.direction) {
            filteredData = sortData(filteredData, sort);
        }

        return filteredData;
    }

    // no filter, just need to sort the data

    // verify sort has been set
    if (!sort || !sort.column || !sort.direction) {
        return data;
    }
    
    return sortData(data, sort);
};

export { sortData };
export default filterAndSortData;
