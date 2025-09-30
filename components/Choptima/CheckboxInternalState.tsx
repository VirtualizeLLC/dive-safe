import React, { type FC, useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

const CheckboxInternalState: FC<{
	onPress: (nextState: boolean) => void
	isChecked: boolean
}> = ({ onPress, isChecked }) => {
	const [checked, setChecked] = useState(isChecked)

	useEffect(() => {
		setChecked(isChecked)
	}, [isChecked])

	const handlePress = () => {
		setChecked((s) => {
			const nextState = !s
			onPress(nextState)
			return nextState
		})
	}

	return (
		<TouchableOpacity
			onPress={handlePress}
			style={[styles.checkbox, checked && styles.checkboxChecked]}
			activeOpacity={0.7}
		>
			{checked && <Text style={styles.checkboxMark}>✓</Text>}
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: 6,
		borderWidth: 2,
		borderColor: '#bbb',
		marginRight: 12,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
	},
	checkboxChecked: { backgroundColor: '#0a84ff', borderColor: '#0a84ff' },
	checkboxMark: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
})

export default CheckboxInternalState
