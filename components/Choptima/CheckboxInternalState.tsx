import { type FC, useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Checkbox as PaperCheckbox } from 'react-native-paper'

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
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => setChecked(isChecked), [isChecked])

	useEffect(
		() => () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current)
				timerRef.current = null
			}
		},
		[],
	)

	const handlePress = () => {
		// If checking, run validator
		if (!checked) {
			const err = validator ? validator() : null
			if (err) {
				setError(err)
				// briefly show error
				if (timerRef.current) clearTimeout(timerRef.current)
				timerRef.current = setTimeout(() => {
					setError(null)
					timerRef.current = null
				}, 2500)
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
			<PaperCheckbox
				status={checked ? 'checked' : 'unchecked'}
				onPress={handlePress}
				accessibilityLabel="Checklist step checkbox"
				color="#0a84ff"
			/>
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
