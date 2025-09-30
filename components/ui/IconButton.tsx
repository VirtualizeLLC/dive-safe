import type React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { IconSymbol } from './icon-symbol'

export const IconButton: React.FC<{
	name: Parameters<typeof IconSymbol>[0]['name']
	size?: number
	color?: string
	onPress?: () => void
	onLongPress?: () => void
	accessibilityLabel?: string
}> = ({
	name,
	size = 20,
	color = '#333',
	onPress,
	onLongPress,
	accessibilityLabel,
}) => {
	return (
		<TouchableOpacity
			style={styles.btn}
			onPress={onPress}
			onLongPress={onLongPress}
			accessibilityLabel={accessibilityLabel}
		>
			<IconSymbol name={name} size={size} color={color} />
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	btn: {
		width: 40,
		height: 40,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f2f2f2',
		marginRight: 8,
	},
})

export default IconButton
