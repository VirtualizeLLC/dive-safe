import { useCallback, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { IconSymbol } from './icon-symbol'

export const IconButton: React.FC<{
	name: Parameters<typeof IconSymbol>[0]['name']
	size?: number
	color?: string
	onPress?: () => void
	onLongPress?: () => void
	accessibilityLabel?: string
	label?: string
	showLabelOnLongPress?: boolean
}> = ({
	name,
	size = 20,
	color = '#333',
	onPress,
	onLongPress,
	accessibilityLabel,
	label,
	showLabelOnLongPress = true,
}) => {
	const [showLabel, setShowLabel] = useState(false)

	const handleLongPress = useCallback(() => {
		if (showLabelOnLongPress && label) {
			setShowLabel(true)
		}
		// preserve existing behavior for consumers that still pass a handler
		onLongPress?.()
	}, [label, onLongPress, showLabelOnLongPress])

	const handlePressOut = useCallback(() => {
		if (showLabel) setShowLabel(false)
	}, [showLabel])

	return (
		<View style={styles.wrapper}>
			{showLabel && label ? (
				<View style={styles.tooltip} pointerEvents="none">
					<Text style={styles.tooltipText} numberOfLines={1}>
						{label}
					</Text>
				</View>
			) : null}
			<TouchableOpacity
				style={styles.btn}
				onPress={onPress}
				onLongPress={handleLongPress}
				onPressOut={handlePressOut}
				accessibilityLabel={accessibilityLabel}
				delayLongPress={400}
			>
				<IconSymbol name={name} size={size} color={color} />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	wrapper: {
		position: 'relative',
		marginRight: 8,
	},
	btn: {
		width: 40,
		height: 40,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f2f2f2',
	},
	tooltip: {
		position: 'absolute',
		bottom: 44,
		left: '50%',
		transform: [{ translateX: -50 }],
		paddingHorizontal: 8,
		paddingVertical: 4,
		backgroundColor: 'rgba(0,0,0,0.85)',
		borderRadius: 6,
		zIndex: 10,
		maxWidth: 160,
	},
	tooltipText: {
		color: '#fff',
		fontSize: 12,
	},
})

export default IconButton
