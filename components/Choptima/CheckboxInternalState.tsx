import { type FC, useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {
	isChecked: boolean
	onPress: (next: boolean) => void
	// validator should return null if ok or an error message string
	validator?: () => string | null
}

const CheckboxInternalState: FC<Props> = ({
	isChecked,
	onPress,
	validator,
}) => {
	const [checked, setChecked] = useState(isChecked)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => setChecked(isChecked), [isChecked])

	const handlePress = () => {
		// If checking, run validator
		if (!checked) {
			const err = validator ? validator() : null
			if (err) {
				setError(err)
				// briefly show error
				setTimeout(() => setError(null), 2500)
				return
			}
		}
		setChecked((c) => {
			const next = !c
			onPress(next)
			return next
		})
	}

	return (
		<View style={{ alignItems: 'center' }}>
			<TouchableOpacity
				onPress={handlePress}
				style={[styles.checkbox, checked && styles.checkboxChecked]}
				activeOpacity={0.7}
			>
				{checked && <Text style={styles.checkboxMark}>✓</Text>}
			</TouchableOpacity>
			{error ? <Text style={styles.error}>{error}</Text> : null}
		</View>
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
	error: {
		color: '#b00020',
		fontSize: 12,
		marginTop: 6,
		maxWidth: 120,
		textAlign: 'center',
	},
})

export default CheckboxInternalState
