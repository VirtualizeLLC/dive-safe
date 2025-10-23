const { withGradleProperties } = require('@expo/config-plugins')

// Ensures code shrinking is enabled in release, required for resource shrinking.
const withReleaseMinify = (config) => {
  return withGradleProperties(config, (config) => {
    const items = config.modResults

    const upsert = (name, value) => {
      const idx = items.findIndex(
        (item) => item.type === 'property' && item.key === name,
      )
      if (idx > -1) {
        items[idx].value = value
      } else {
        items.push({ type: 'property', key: name, value })
      }
    }

    // Turn on minify for release so shrinkResources can work
    upsert('android.enableMinifyInReleaseBuilds', 'true')
    // Keep shrink resources enabled for smaller APKs
    upsert('android.enableShrinkResourcesInReleaseBuilds', 'true')

    return config
  })
}

module.exports = withReleaseMinify
