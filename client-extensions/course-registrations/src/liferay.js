/**
 * liferay.js - This file defines the Liferay object so it is available in the React components.
 */

/**
 * Define the Liferay object if it is not already defined. The regular Liferay object will
 * be assigned to the window, but for testing and mock purposes we can create one to use
 * like is done here.
 */
const Liferay = window.Liferay || {
	OAuth2: {
		getAuthorizeURL: () => '',
		getBuiltInRedirectURL: () => '',
		getIntrospectURL: () => '',
		getTokenURL: () => '',
		getUserAgentApplication: (_serviceName) => {},
	},
	OAuth2Client: {
		FromParameters: (_options) => {
			return {};
		},
		FromUserAgentApplication: (_userAgentApplicationId) => {
			return {};
		},
		fetch: (_url, _options = {}) => {},
	},
	ThemeDisplay: {
		getCompanyGroupId: () => 0,
		getPathThemeImages: () => '',
		getScopeGroupId: () => 32815,
		getSiteGroupId: () => 32815,
		isSignedIn: () => {
			return false;
		},
	},
	authToken: '',
};

export default Liferay;
