import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import Markdown from 'react-native-markdown-display'

// Import the README as a raw string
// If Metro is not configured for .md, you can copy-paste the content here as a fallback
import readme from './readme-content'

export default function ReadmeScreen() {
	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			<Markdown>{readme as unknown as string}</Markdown>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#fff' },
	content: { padding: 16 },
})
