/**
 * index.js: This is the source file for the course-registration custom element.
 *
 * @author dnebinger
 */

import React, { StrictMode } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { ClayIconSpriteContext } from '@clayui/icon';

import App from './App.js';

const spritemap = `${Liferay.ThemeDisplay.getPathThemeImages()}/clay/icons.svg`;

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

/**
 * class CourseRegistration: This is the custom element class for the course registration UI.
 *
 * @author dnebinger
 */
class CourseRegistration extends HTMLElement {
	connectedCallback() {
		render(
			<StrictMode>
				<ClayIconSpriteContext.Provider value={spritemap}>
					<App admin={ stringToBoolean(this.getAttribute('admin')) } />
				</ClayIconSpriteContext.Provider>
			</StrictMode>,
			this
		);
	}

	disconnectedCallback() {
		ReactDOM.unmountComponentAtNode(this);
	}
}

const ELEMENT_NAME = 'course-registration';

if (customElements.get(ELEMENT_NAME)) {
	// eslint-disable-next-line no-console
	console.log(
		`Skipping registration for <${ELEMENT_NAME}> (already registered)`
	);
}
else {
	customElements.define(ELEMENT_NAME, CourseRegistration);
}
