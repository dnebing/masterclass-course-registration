import React from 'react';
import IconSVG from '@clayui/css/lib/images/icons/icons.svg';

import Liferay from './liferay.js';

/**
 * getIconSpriteMap: Returns the icon sprite map.
 * @returns The icon sprite map.
 */
const getIconSpriteMap = () => {
	const pathThemeImages = Liferay.ThemeDisplay.getPathThemeImages();

	const spritemap = pathThemeImages
		? `${pathThemeImages}/clay/icons.svg`
		: IconSVG;

	return spritemap;
}

export default getIconSpriteMap;
