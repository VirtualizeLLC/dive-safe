import { Asset } from 'expo-asset'
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

// Ordered list as requested
const MANUALS = [
	{
		id: 'assembly_checklist',
		title: 'Choptima Assembly Checklist',
		asset: require('@/assets/pdfs/O2ptima-CM-Assembly-Checklist.pdf'),
	},
	{
		id: 'o2ptima_manual',
		title: 'O2ptima CMCL User Manual (Rev D)',
		asset: require('@/assets/pdfs/O2ptima-CMCL-User-Manual-Rev-D-August-2022.pdf'),
	},
	{
		id: 'petrel3_manual',
		title: 'Shearwater Petrel 3 Manual',
		asset: require('@/assets/pdfs/Petrel-3_Technical_Manual_RevB.pdf'),
	},
	{
		id: 'shearwater_hud',
		title: 'Shearwater HUD Manual',
		asset: require('@/assets/pdfs/Shearwater-HUD.pdf'),
	},
] as const

export type ManualItem = (typeof MANUALS)[number]

const ManualsTab: React.FC = () => {
	const [openingId, setOpeningId] = useState<string | null>(null)

	const openManual = useCallback(async (assetId: number, id: string) => {
		setOpeningId(id)
		try {
			const asset = Asset.fromModule(assetId)
			if (!asset.downloaded) {
				await asset.downloadAsync()
			}
			const link = asset.localUri ?? asset.uri
			if (link) {
				await Linking.openURL(link)
			}
		} catch {
			// optionally surface error UI
		} finally {
			setOpeningId(null)
		}
	}, [])

	const openDiveRite = useCallback(async () => {
		const url = 'https://manuals.diverite.com/'
		try {
			const can = await Linking.canOpenURL(url)
			if (can) await Linking.openURL(url)
		} catch {
			// ignore
		}
	}, [])

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Manuals</Text>
			</View>

			<View style={styles.card}>
				<Text style={styles.cardTitle}>Preloaded manuals</Text>
				{MANUALS.map((m) => (
					<TouchableOpacity
						key={m.id}
						style={styles.item}
						activeOpacity={0.8}
						onPress={() => openManual(m.asset, m.id)}
					>
						<Text style={styles.itemTitle}>
							{m.title}
							{openingId === m.id ? ' (opening...)' : ''}
						</Text>
					</TouchableOpacity>
				))}
			</View>

			<View style={styles.card}>
				<Text style={styles.cardTitle}>Get the latest from Dive Rite</Text>
				<TouchableOpacity
					style={styles.linkBtn}
					onPress={openDiveRite}
					activeOpacity={0.85}
				>
					<Text style={styles.linkBtnText}>Open Dive Rite Manuals</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default ManualsTab

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#f2f5f9', padding: 12 },
	header: { paddingVertical: 8, paddingHorizontal: 4 },
	headerTitle: { fontSize: 20, fontWeight: '700' },
	card: {
		backgroundColor: '#fff',
		borderRadius: 10,
		padding: 12,
		marginTop: 12,
	},
	cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
	item: { paddingVertical: 10 },
	itemTitle: { fontSize: 15, color: '#0a84ff', fontWeight: '600' },
	linkBtn: {
		alignSelf: 'flex-start',
		backgroundColor: '#0a84ff',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		marginTop: 6,
	},
	linkBtnText: { color: '#fff', fontWeight: '600' },
	// no modal/pdf styles needed for external viewer approach
})
