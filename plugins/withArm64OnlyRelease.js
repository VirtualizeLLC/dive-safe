const { withAppBuildGradle } = require('@expo/config-plugins')

// A small config plugin to conditionally enforce arm64-only ABI for release builds.
// It updates android/app/build.gradle, adding ndk { abiFilters "arm64-v8a" } in release buildType
// based on an env var or defaults to true for CI beta builds.
const withArm64OnlyRelease = (config) => {
	return withAppBuildGradle(config, (config) => {
		const enableArm64 = process.env.ANDROID_ARM64_ONLY_RELEASE
			? process.env.ANDROID_ARM64_ONLY_RELEASE === 'true'
			: true

		if (!enableArm64) return config

		let contents = config.modResults.contents

		// Insert ndk { abiFilters "arm64-v8a" } inside release { ... }
		if (/buildTypes[\s\S]*?release\s*\{/.test(contents)) {
			contents = contents.replace(
				/(release\s*\{[\s\S]*?)(\n\s*\})/m,
				(match) => {
					if (/ndk\s*\{[\s\S]*?abiFilters/.test(match)) {
						return match // already has ndk config
					}
					const insertion = `\n            // Enforced by withArm64OnlyRelease config plugin\n            ndk {\n                abiFilters "arm64-v8a"\n            }\n        `
					return match.replace(/\n\s*\}\s*$/m, `${insertion}\n        }`)
				},
			)
			config.modResults.contents = contents
		}

		return config
	})
}

module.exports = withArm64OnlyRelease
