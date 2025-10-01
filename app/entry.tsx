import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useUIPreferencesStore } from '@/components/ui/useUIPreferencesStore'
import FullAppEntry from './full-app-entry'
import { withHocs } from './hocs/withHocs'
import { withRootProviders } from './hocs/withRootProviders'
import StorybookEntry from './storybook-entry'

/**
 * Entry selects between the full app and storybook entry points.
 * You can toggle the entry by setting `global.__SHOW_STORYBOOK = true` before the app mounts,
 * or programmatically change which component to render here.
 */
const Entry = () => {
	// Use UI preferences store for demo controls persistence
	const demoHeaderCollapsed = useUIPreferencesStore(
		(s) => s.demoHeaderCollapsed,
	)
	const setDemoHeaderCollapsed = useUIPreferencesStore(
		(s) => s.setDemoHeaderCollapsed,
	)
	const showStorybook = useUIPreferencesStore((s) => s.showStorybook)
	const setShowStorybook = useUIPreferencesStore((s) => s.setShowStorybook)
	const loadUIPreferences = useUIPreferencesStore((s) => s.loadUIPreferences)

	// Load persisted preferences on mount
	React.useEffect(() => {
		loadUIPreferences()
	}, [loadUIPreferences])

	// keep global flag in sync so other modules can read it if needed
	React.useEffect(() => {
		;(global as unknown as { __SHOW_STORYBOOK?: boolean }).__SHOW_STORYBOOK =
			showStorybook === true
	}, [showStorybook])

	return (
		<>
			{/* Collapsible header */}
			{demoHeaderCollapsed ? (
				<View style={styles.collapsedContainer} pointerEvents="box-none">
					<TouchableOpacity
						style={styles.chevronButton}
						onPress={() => setDemoHeaderCollapsed(false)}
						accessibilityLabel="Expand header"
					>
						<Text style={styles.chevron}>UX</Text>
					</TouchableOpacity>
				</View>
			) : (
				<View style={styles.headerContainer} pointerEvents="box-none">
					<View style={styles.headerRow}>
						<Text style={styles.headerTitle}>Demo Controls</Text>
						<TouchableOpacity
							style={styles.collapseButton}
							onPress={() => setDemoHeaderCollapsed(true)}
							accessibilityLabel="Collapse header"
						>
							<Text style={styles.collapseText}>Close</Text>
						</TouchableOpacity>
					</View>{' '}
					<View style={styles.headerActions}>
						<TouchableOpacity
							style={styles.primaryButton}
							onPress={() => setShowStorybook(false)}
							accessibilityLabel="Show App"
						>
							<Text style={styles.primaryText}>Show App</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.secondaryButton}
							onPress={() => setShowStorybook(true)}
							accessibilityLabel="Show Demo"
						>
							<Text style={styles.secondaryText}>Show Demo</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
			{showStorybook ? <StorybookEntry /> : <FullAppEntry />}
		</>
	)
}

// Compose root-level HOCs here. Provide the HOCs you want to apply in order.
// Example: withHocs(h1, h2)(Entry) => h2(h1(Entry)).
const EnhancedEntry = withHocs(withRootProviders)(Entry)

export default EnhancedEntry

const styles = StyleSheet.create({
	overlay: {
		position: 'absolute',
		top: 18,
		right: 18,
		zIndex: 9999,
		flexDirection: 'row',
		alignItems: 'center',
	},
	button: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
		backgroundColor: 'rgba(0,0,0,0.6)',
	},
	buttonText: {
		color: '#fff',
		fontSize: 12,
	},
	headerContainer: {
		// position: 'absolute',
		// top: 0,
		// left: 0,
		// right: 0,
		backgroundColor: 'rgba(0,0,0,0.7)',
		paddingTop: 36,
		paddingBottom: 12,
		paddingHorizontal: 16,
		zIndex: 9999,
	},
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	headerTitle: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	collapseButton: {
		padding: 6,
	},
	collapseText: { color: '#fff', fontSize: 16 },
	headerActions: {
		marginTop: 12,
		flexDirection: 'row',
		alignItems: 'center',
	},
	primaryButton: {
		paddingVertical: 10,
		paddingHorizontal: 14,
		borderRadius: 8,
		backgroundColor: '#ffffff',
	},
	primaryText: { color: '#000', fontWeight: '600' },
	secondaryButton: {
		marginLeft: 12,
		paddingVertical: 10,
		paddingHorizontal: 14,
		borderRadius: 8,
		backgroundColor: 'rgba(255,255,255,0.12)',
	},
	secondaryText: { color: '#fff', fontWeight: '600' },
	collapsedContainer: {
		position: 'absolute',
		top: 18,
		right: 18,
		zIndex: 9999,
	},
	chevronButton: {
		padding: 8,
		backgroundColor: 'rgba(0,0,0,0.6)',
		borderRadius: 8,
	},
	chevron: { color: '#fff', fontSize: 14 },
})
