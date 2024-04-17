import React, { StrictMode } from 'react'
import { ClayIconSpriteContext } from '@clayui/icon';
import App from './App.jsx'
import './index.css'
import getIconSpriteMap from './util.js'
import stringToBoolean from './stringToBoolean.js';

import { render, unmountComponentAtNode } from 'react-dom';

/**
 * WebComponent: The main web component that renders the App component.
 */
class WebComponent extends HTMLElement {

  /**
   * connectedCallback: Renders the App component into the web component.
   */
  connectedCallback() {
    render(<StrictMode>
				<ClayIconSpriteContext.Provider value={getIconSpriteMap()}>
					<App admin={ stringToBoolean(this.getAttribute('admin')) } />
				</ClayIconSpriteContext.Provider>
     </StrictMode>, this);
  }

  /**
   * disconnectedCallback: Unmounts the App component from the web component. Ensures that
   * anything the component was doing is properly cleaned up and released.
   */
  disconnectedCallback() {
    unmountComponentAtNode(this);
  }
}

const ELEMENT_NAME = 'course-registrations';

if (customElements.get(ELEMENT_NAME)) {
  // eslint-disable-next-line no-console
  console.log(`Skipping registration for <${ELEMENT_NAME}> (already registered)`);
} else {
  customElements.define(ELEMENT_NAME, WebComponent);
}