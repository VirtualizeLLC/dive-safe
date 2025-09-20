import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

export default {
	title: 'Button',
}

export const Primary = () => (
	<View style={styles.center}>
		<Pressable style={styles.button} onPress={() => alert('pressed')}>
			<Text style={styles.text}>Primary Button</Text>
		</Pressable>
	</View>
)

const styles = StyleSheet.create({
	center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
	button: { backgroundColor: '#0b84ff', padding: 12, borderRadius: 8 },
	text: { color: 'white', fontWeight: '600' },
})
