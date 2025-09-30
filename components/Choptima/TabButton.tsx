import type React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

const TabButton: React.FC<{
	label: string
	active: boolean
	onPress: () => void
}> = ({ label, active, onPress }) => (
	<TouchableOpacity
		onPress={onPress}
		style={[styles.tab, active && styles.tabActive]}
		activeOpacity={0.8}
		accessibilityRole="button"
	>
		<Text style={[styles.tabText, active && styles.tabTextActive]}>
			{label}
		</Text>
	</TouchableOpacity>
)

const styles = StyleSheet.create({
	tab: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 6,
		marginRight: 8,
	},
	tabActive: { backgroundColor: '#0a84ff' },
	tabText: { color: '#333', fontWeight: '600' },
	tabTextActive: { color: '#fff' },
})

export default TabButton
