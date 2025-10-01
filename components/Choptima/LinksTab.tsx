import {
	FlatList,
	Linking,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'

type LinkItem = {
	id: string
	title: string
	url: string
	description?: string
}

// Load JSON data (edit assets/data/choptima-links.json to add/remove links)
const links: LinkItem[] = require('@/assets/data/choptima-links.json')

const LinksTab: React.FC = () => {
	const open = async (url: string) => {
		try {
			const can = await Linking.canOpenURL(url)
			if (can) await Linking.openURL(url)
		} catch (e) {
			console.warn('LinksTab: failed to open URL', url, e)
		}
	}

	const renderItem = ({ item }: { item: LinkItem }) => (
		<TouchableOpacity
			onPress={() => open(item.url)}
			style={styles.item}
			activeOpacity={0.85}
		>
			<View style={styles.itemTextGroup}>
				<Text style={styles.title}>{item.title}</Text>
				{item.description ? (
					<Text style={styles.desc}>{item.description}</Text>
				) : null}
				<Text selectable style={styles.url} numberOfLines={1}>
					{item.url}
				</Text>
			</View>
		</TouchableOpacity>
	)

	return (
		<View style={styles.container}>
			<FlatList
				data={links}
				keyExtractor={(i) => i.id}
				renderItem={renderItem}
				contentContainerStyle={styles.list}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#f7f7f7' },
	list: { padding: 12 },
	item: {
		backgroundColor: '#fff',
		borderRadius: 10,
		padding: 12,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: '#eee',
	},
	itemTextGroup: { gap: 4 },
	title: { fontSize: 16, fontWeight: '700', color: '#111' },
	desc: { fontSize: 14, color: '#444' },
	url: { fontSize: 12, color: '#0a84ff' },
})

export default LinksTab
