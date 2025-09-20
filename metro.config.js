const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

// Storybook provides a helper to patch Metro config for React Native usage.
// It prevents bundling server/web-only pieces into the RN app.
let config = getDefaultConfig(__dirname);
config.resolver = config.resolver || {};
config.resolver.extraNodeModules = config.resolver.extraNodeModules || {};

// map 'storybook' to the installed @storybook folder so internal imports can resolve
config.resolver.extraNodeModules['storybook'] = path.resolve(__dirname, 'node_modules', '@storybook');
// map some Node built-ins to React Native friendly shims to avoid bundling errors
config.resolver.extraNodeModules['tty'] = path.resolve(__dirname, 'rn-node-shims', 'tty.js');
config.resolver.extraNodeModules['fs'] = path.resolve(__dirname, 'rn-node-shims', 'fs.js');
config.resolver.extraNodeModules['path'] = path.resolve(__dirname, 'rn-node-shims', 'path.js');
config.resolver.extraNodeModules['os'] = path.resolve(__dirname, 'rn-node-shims', 'os.js');

// Ensure Metro resolves .cjs files (storybook ships some CJS files)
config.resolver.sourceExts = [...Array.from(new Set([...(config.resolver.sourceExts || []), 'cjs'])), '.md'];

try {
	// prefer withStorybookConfig/withStorybook if available
	const { withStorybook, withStorybookConfig } = require('@storybook/react-native/metro/withStorybook') || {};
	// Some versions export the helpers directly from paths
	const withSB = require('@storybook/react-native/metro/withStorybook') || require('@storybook/react-native/metro/withStorybookConfig');
	if (typeof withSB === 'function') {
		config = withSB(config);
	}
} catch (e) {
	// If the helper isn't available, fall back to the patched config above.
	// We still have node shims and extra ext resolution applied.
	console.warn('withStorybook helper not applied (ok if not installed):', e?.message || e);
}

module.exports = config;
