/* eslint-disable @typescript-eslint/no-var-requires */
// Storybook v9 native entry for dynamic in-app loading.
const sb = require('@storybook/react-native')

// If a generated `storybook/entries.js` exists, prefer it (faster for Metro
// and avoids fragile dynamic requires). The generator produces a
// `module.exports = { modules: { './story_0': require('...'), ... } }` shape.
let generated = null
try {
	// eslint-disable-next-line global-require, import/no-dynamic-require
	generated = require('./entries')
} catch (e) {
	// no-op: fallback to the small hand-written map below
}

let storyEntries
if (generated && generated.modules) {
	const modules = generated.modules
	function req(k) {
		return modules[k]
	}
	req.keys = () => Object.keys(modules)
	storyEntries = [{ req, directory: './storybook' }]
} else {
	// tiny require map so Metro bundles stories when a generated file isn't
	// available (dev fallback)
	const modules = {}
	function req(filename) {
		return modules[filename]
	}
	req.keys = () => Object.keys(modules)
	storyEntries = [{ req, directory: './storybook' }]
}

const view = sb.start({ annotations: [], storyEntries, options: {} })

let exported = null
// v9 may return various shapes; prefer a render function or component, then
// fall back to getStorybookUI if present for compatibility.
if (!view) {
	exported = null
} else if (typeof view === 'function') {
	exported = view // component/function
} else if (view && typeof view.render === 'function') {
	exported = view.render
} else if (view && typeof view.getStorybookUI === 'function') {
	exported = view.getStorybookUI({ asyncStorage: null, onDeviceUI: true })
} else {
	exported = view
}

// Export as CommonJS with a `default` property so dynamic `require()` calls in
// the app can do `const sb = require('../storybook').default` as expected.
module.exports = { default: exported }
