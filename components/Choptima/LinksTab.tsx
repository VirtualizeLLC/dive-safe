import {
	FlatList,
	Linking,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { Asset } from 'expo-asset'

type LinkRef =
	| { title: string; url: string }
	| { title: string; assetKey: keyof typeof ASSET_MAP }
type LinkGroup = {
	id: string
	title: string
	description?: string
	links: LinkRef[]
}

// Map JSON asset keys to bundled assets
const ASSET_MAP = {
	assembly_checklist: require('@/assets/pdfs/O2ptima-CM-Assembly-Checklist.pdf'),
	o2ptima_manual: require('@/assets/pdfs/O2ptima-CMCL-User-Manual-Rev-D-August-2022.pdf'),
	petrel3_manual: require('@/assets/pdfs/Petrel-3_Technical_Manual_RevB.pdf'),
	shearwater_hud: require('@/assets/pdfs/Shearwater-HUD.pdf'),
} as const

// Load JSON data (edit assets/data/choptima-links.json to add/remove links)
const groups: LinkGroup[] = require('@/assets/data/choptima-links.json')

const LinksTab: React.FC = () => {
	const openUrl = async (url: string) => {
		try {
			const can = await Linking.canOpenURL(url)
			if (can) await Linking.openURL(url)
		} catch (e) {
			console.warn('LinksTab: failed to open URL', url, e)
		}
	}

	const openAsset = async (assetId: number) => {
		try {
			const asset = Asset.fromModule(assetId)
			if (!asset.downloaded) {
				await asset.downloadAsync()
			}
			const link = asset.localUri ?? asset.uri
			if (link) await Linking.openURL(link)
		} catch (e) {
			console.warn('LinksTab: failed to open asset', e)
		}
	}

	const displayHostname = (url: string) => {
		try {
			const u = new URL(url)
			return u.hostname.replace(/^www\./, '')
		} catch {
			return undefined
		}
	}

	const renderItem = ({ item }: { item: LinkGroup }) => (
		<View style={styles.card}>
			<View style={styles.cardHeader}>
				<Text style={styles.title}>{item.title}</Text>
				{item.description ? (
					<Text style={styles.desc}>{item.description}</Text>
				) : null}
			</View>
			<View style={styles.linksList}>
				{item.links?.map((lnk) => {
					const key = 'url' in lnk ? `${item.id}:${lnk.title}:${lnk.url}` : `${item.id}:${lnk.title}:${lnk.assetKey}`
					const onPress = () => {
						if ('url' in lnk) return openUrl(lnk.url)
						const assetId = ASSET_MAP[lnk.assetKey]
						return openAsset(assetId)
					}
					const host = 'url' in lnk ? displayHostname(lnk.url) : undefined
					return (
						<TouchableOpacity key={key} onPress={onPress} style={styles.linkRow} activeOpacity={0.85}>
							<Text style={styles.linkTitle}>{lnk.title}</Text>
							{host ? <Text style={styles.linkHost}>{host}</Text> : null}
						</TouchableOpacity>
					)
				})}
			</View>
		</View>
	)

	return (
		<View style={styles.container}>
			<FlatList
				data={groups}
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
	card: {
		backgroundColor: '#fff',
		borderRadius: 10,
		padding: 12,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: '#eee',
	},
	cardHeader: { gap: 4, marginBottom: 8 },
	title: { fontSize: 16, fontWeight: '700', color: '#111' },
	desc: { fontSize: 14, color: '#444' },
	linksList: { gap: 6 },
	linkRow: {
		paddingVertical: 8,
		paddingHorizontal: 10,
		backgroundColor: '#f9fafb',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#f0f0f0',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	linkTitle: { fontSize: 15, color: '#0a84ff', fontWeight: '600' },
	linkHost: { fontSize: 12, color: '#666', marginLeft: 12 },
})

export default LinksTab
