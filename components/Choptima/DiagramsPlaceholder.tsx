import type React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const DiagramsPlaceholder: React.FC = () => (
	<View style={styles.placeholder}>
		<Text style={styles.placeholderText}>
			Diagrams and annotated images go here.
		</Text>
	</View>
)

const styles = StyleSheet.create({
	placeholder: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 24,
	},
	placeholderText: { color: '#666', textAlign: 'center' },
})

export default DiagramsPlaceholder
