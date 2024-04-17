
/**
 * stringToBoolean: This function will convert a string value to a boolean value.
 * This will give us some flexibility in the way the admin flag attribute is set.
 * @param {*} value The value to convert.
 * @returns boolean value.
 */
function stringToBoolean(value) {
	if (typeof value === 'string') {
		switch (value.toLowerCase().trim()) {
			case "true":
			case "yes":
			case "1":
				return true;
		}
	} else if (typeof value === 'boolean') {
		return value;
	}

	return false;
}

export default stringToBoolean;
