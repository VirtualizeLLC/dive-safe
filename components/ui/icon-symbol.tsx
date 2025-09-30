// Use Expo's icon package so font assets and resolution are handled by Expo.
// This avoids manual linking and resolution issues that can occur when
// importing vector icons directly from react-native-vector-icons in an
// Expo-managed project.

import { MaterialIcons } from '@expo/vector-icons'
import type { SymbolViewProps, SymbolWeight } from 'expo-symbols'
import type { ComponentProps } from 'react'
import type { OpaqueColorValue, StyleProp, TextStyle } from 'react-native'

type IconMapping = Record<
	SymbolViewProps['name'],
	ComponentProps<typeof MaterialIcons>['name']
>
type IconSymbolName = keyof typeof MAPPING

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
	'house.fill': 'home',
	'paperplane.fill': 'send',
	'chevron.left.forwardslash.chevron.right': 'code',
	'chevron.right': 'chevron-right',
	// common actions used in the app - map SF-like names to Material icons
	'checkmark.square.fill': 'check-box',
	'chevron.down': 'expand-more',
	'square.and.arrow.down': 'save',
	clock: 'history',
	// pin/bookmark
	pin: 'push-pin',
} as IconMapping

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
	name,
	size = 24,
	color,
	style,
}: {
	name: IconSymbolName
	size?: number
	color: string | OpaqueColorValue
	style?: StyleProp<TextStyle>
	weight?: SymbolWeight
}) {
	return (
		<MaterialIcons
			color={color}
			size={size}
			name={MAPPING[name]}
			style={style}
		/>
	)
}
