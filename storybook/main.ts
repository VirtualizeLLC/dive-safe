const config = {
	stories: [
		// Keep a small set that matches the generator output location
		'../components/**/*.stories.@(js|jsx|ts|tsx)',
	],
	addons: [
		// on-device addons remain RN-specific
		'@storybook/addon-ondevice-actions',
		'@storybook/addon-ondevice-controls',
	],
	// Leave framework unspecified for the native runtime; this file's shape
	// is primarily read by tooling that expects ESM `main.*` in v9+.
}

export default config
