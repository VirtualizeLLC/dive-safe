import React, { useEffect, useState } from 'react'
import {
	Alert,
	FlatList,
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native'
import { ChecklistStorage } from '@/app/storage/ChecklistStorage'
import useChoptimaStore from '@/components/Choptima/useChoptimaStore'

const SNAPSHOT_PREFIX = 'checklist:snapshot:'

type SnapshotItem = {
	key: string
	name: string
	createdAt?: number
	updatedAt?: number
}

const humanizeTime = (ms?: number) => {
	if (!ms) return ''
	const diff = Date.now() - ms
	const s = Math.floor(diff / 1000)
	if (s < 60) return `${s}s ago`
	const m = Math.floor(s / 60)
	if (m < 60) return `${m}m ago`
	const h = Math.floor(m / 60)
	if (h < 24) return `${h}h ago`
	const d = Math.floor(h / 24)
	return `${d}d ago`
}

const SnapshotExplorer: React.FC<{ visible: boolean; onClose: () => void }> = ({
	visible,
	onClose,
}) => {
	const [items, setItems] = useState<SnapshotItem[]>([])
	const [editingKey, setEditingKey] = useState<string | null>(null)
	const [editingName, setEditingName] = useState<string>('')
	const loadSnapshotToStore = useChoptimaStore((s) => s.loadSnapshot)

	// sorting controls
	type SortBy = 'name' | 'createdAt' | 'updatedAt'
	type SortDir = 'asc' | 'desc'
	const [sortBy, setSortBy] = useState<SortBy>('createdAt')
	const [sortDir, setSortDir] = useState<SortDir>('desc')
	const [sortPickerVisible, setSortPickerVisible] = useState(false)
	const sortLabelMap: Record<SortBy, string> = {
		name: 'Name',
		createdAt: 'Created',
		updatedAt: 'Updated',
	}

	const refresh = React.useCallback(() => {
		try {
			const keys: string[] =
				(
					ChecklistStorage as unknown as { getAllKeys?: () => string[] }
				).getAllKeys?.() || []
			const snapshotKeys = keys.filter((k) => k?.startsWith(SNAPSHOT_PREFIX))
			const mapped: SnapshotItem[] = snapshotKeys.map((k) => {
				const name = k.replace(SNAPSHOT_PREFIX, '')
				let createdAt: number | undefined
				let updatedAt: number | undefined
				// prefer reading from stored payload (createdAt/updatedAt)
				try {
					const raw = ChecklistStorage.getString(k)
					if (raw) {
						const json = JSON.parse(raw)
						if (json?.createdAt) {
							const t = Date.parse(json.createdAt)
							if (!Number.isNaN(t)) createdAt = t
						}
						if (json?.updatedAt) {
							const t = Date.parse(json.updatedAt)
							if (!Number.isNaN(t)) updatedAt = t
						}
					}
				} catch {}
				// legacy fallback: infer from name if it looks like a timestamp
				if (!createdAt && name?.startsWith('202')) {
					const date = new Date(name)
					if (!Number.isNaN(date.getTime())) createdAt = date.getTime()
				}
				return { key: k, name, createdAt, updatedAt }
			})
			// sort using controls
			mapped.sort((a, b) => {
				const dir = sortDir === 'asc' ? 1 : -1
				if (sortBy === 'name') {
					return dir * a.name.localeCompare(b.name)
				}
				const va = (a[sortBy] as number | undefined) ?? 0
				const vb = (b[sortBy] as number | undefined) ?? 0
				return dir * (va - vb)
			})
			setItems(mapped)
		} catch (e) {
			console.warn('SnapshotExplorer: failed to load snapshots', e)
			setItems([])
		}
	}, [sortBy, sortDir])

	useEffect(() => {
		if (visible) refresh()
	}, [visible, refresh])

	const handleLoad = (key: string) => {
		loadSnapshotToStore(key)
		onClose()
		// Alert.alert(
		// 	'Load snapshot',
		// 	'Load this snapshot and replace the current checklist?',
		// 	[
		// 		{ text: 'Cancel', style: 'cancel' },
		// 		{
		// 			text: 'Load',
		// 			style: 'destructive',
		// 			onPress: () => {
		// 				loadSnapshotToStore(key)
		// 				onClose()
		// 			},
		// 		},
		// 	],
		// )
	}

	const handleDelete = (key: string) => {
		try {
			ChecklistStorage.delete(key)
		} catch (e) {
			console.warn('SnapshotExplorer: failed to delete', e)
		}
		refresh()
		// Alert.alert(
		// 	'Delete snapshot',
		// 	'Are you sure you want to delete this snapshot?',
		// 	[
		// 		{ text: 'Cancel', style: 'cancel' },
		// 		{
		// 			text: 'Delete',
		// 			style: 'destructive',
		// 			onPress: () => {
		// 				try {
		// 					ChecklistStorage.delete(key)
		// 				} catch (e) {
		// 					console.warn('SnapshotExplorer: failed to delete', e)
		// 				}
		// 				refresh()
		// 			},
		// 		},
		// 	],
		// )
	}

	const beginRename = (item: SnapshotItem) => {
		setEditingKey(item.key)
		setEditingName(item.name)
	}

	const commitRename = async () => {
		if (!editingKey) return
		const raw = ChecklistStorage.getString(editingKey)
		if (raw == null) return
		const newName = editingName.trim()
		if (!newName) return
		const newKey = `${SNAPSHOT_PREFIX}${newName.replace(/\s+/g, '_')}`
		// avoid clobber
		const exists = ChecklistStorage.getString(newKey)
		if (exists) {
			Alert.alert('Rename failed', 'A snapshot with that name already exists.')
			return
		}
		try {
			ChecklistStorage.set(newKey, raw)
			ChecklistStorage.delete(editingKey)
		} catch (e) {
			console.warn('SnapshotExplorer: rename failed', e)
		}
		setEditingKey(null)
		setEditingName('')
		refresh()
	}

	const renderItem = ({ item }: { item: SnapshotItem }) => (
		<View style={styles.row}>
			<View style={styles.rowLeft}>
				{editingKey === item.key ? (
					<TextInput
						value={editingName}
						onChangeText={setEditingName}
						style={styles.input}
						placeholder="Snapshot name"
						autoFocus
					/>
				) : (
					<View>
						<Text style={styles.title}>{item.name}</Text>
						<Text style={styles.subtitle}>{humanizeTime(item.createdAt)}</Text>
					</View>
				)}
			</View>
			<View style={styles.rowRight}>
				{editingKey === item.key ? (
					<View style={styles.editActions}>
						<TouchableOpacity style={styles.actionBtn} onPress={commitRename}>
							<Text style={styles.actionText}>Save</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionBtn}
							onPress={() => {
								setEditingKey(null)
								setEditingName('')
							}}
						>
							<Text style={styles.actionText}>Cancel</Text>
						</TouchableOpacity>
					</View>
				) : (
					<View style={styles.actionsRow}>
						<TouchableOpacity
							style={styles.actionBtn}
							onPress={() => handleLoad(item.key)}
						>
							<Text style={styles.actionText}>Load</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionBtn}
							onPress={() => beginRename(item)}
						>
							<Text style={styles.actionText}>Rename</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionBtn}
							onPress={() => handleDelete(item.key)}
						>
							<Text style={[styles.actionText, { color: '#d33' }]}>Delete</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
		</View>
	)

	return (
		<Modal visible={visible} animationType="slide" onRequestClose={onClose}>
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>Snapshots</Text>
					<TouchableOpacity onPress={onClose}>
						<Text style={styles.close}>Close</Text>
					</TouchableOpacity>
				</View>

				{/* sorting UI */}
				<View style={styles.sortRow}>
					<View style={styles.sortLeft}>
						<Text style={styles.sortLabel}>Sort by:</Text>
						<TouchableOpacity
							onPress={() => setSortPickerVisible(true)}
							style={[styles.sortChip, styles.sortSelectBtn]}
							accessibilityLabel="Select sort field"
						>
							<Text style={styles.sortChipText}>{sortLabelMap[sortBy]}</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity
						onPress={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
						style={[styles.sortChip, styles.sortDirChip]}
					>
						<Text style={[styles.sortChipText, styles.sortDir]}>
							{sortDir === 'asc' ? 'ASC ↑' : 'DESC ↓'}
						</Text>
					</TouchableOpacity>
				</View>

				{/* sort field picker modal */}
				<Modal
					visible={sortPickerVisible}
					transparent
					animationType="fade"
					onRequestClose={() => setSortPickerVisible(false)}
				>
					<TouchableWithoutFeedback onPress={() => setSortPickerVisible(false)}>
						<View style={styles.overlay}>
							<TouchableWithoutFeedback>
								<View style={styles.pickerContainer}>
									<Text style={styles.pickerTitle}>Sort by</Text>
									{(['name', 'createdAt', 'updatedAt'] as SortBy[]).map(
										(opt) => (
											<TouchableOpacity
												key={opt}
												style={styles.pickerItem}
												onPress={() => {
													setSortBy(opt)
													setSortPickerVisible(false)
												}}
												accessibilityLabel={`Sort by ${sortLabelMap[opt]}`}
											>
												<Text
													style={[
														styles.pickerItemText,
														opt === sortBy && styles.pickerItemTextActive,
													]}
												>
													{sortLabelMap[opt]}
												</Text>
												{opt === sortBy ? (
													<Text style={styles.pickerCheck}>✓</Text>
												) : null}
											</TouchableOpacity>
										),
									)}
								</View>
							</TouchableWithoutFeedback>
						</View>
					</TouchableWithoutFeedback>
				</Modal>

				{items.length === 0 ? (
					<View style={styles.empty}>
						<Text style={styles.emptyText}>
							No snapshots yet. Use Save to create one.
						</Text>
					</View>
				) : (
					<FlatList
						data={items}
						keyExtractor={(i) => i.key}
						renderItem={renderItem}
					/>
				)}
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, paddingTop: 40 },
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	headerTitle: { fontSize: 20, fontWeight: '700' },
	close: { color: '#0a84ff', fontWeight: '600' },
	sortRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 8,
		gap: 12,
		justifyContent: 'space-between',
	},
	sortLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		flexShrink: 1,
	},
	sortLabel: { fontWeight: '700', marginRight: 8 },
	sortChip: {
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 16,
		backgroundColor: '#f2f2f4',
		borderWidth: 1,
		borderColor: '#e2e2e6',
		marginRight: 8,
	},
	sortChipText: { color: '#333', fontWeight: '600' },
	sortDir: { fontWeight: '700' },
	sortDirChip: { paddingHorizontal: 12 },
	sortSelectBtn: { flexShrink: 1 },
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.25)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},
	pickerContainer: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: '#fff',
		borderRadius: 12,
		paddingVertical: 8,
		paddingHorizontal: 8,
		shadowColor: '#000',
		shadowOpacity: 0.15,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 4 },
		elevation: 3,
	},
	pickerTitle: {
		fontSize: 16,
		fontWeight: '700',
		paddingVertical: 8,
		paddingHorizontal: 8,
	},
	pickerItem: {
		paddingVertical: 10,
		paddingHorizontal: 12,
		borderRadius: 8,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	pickerItemText: { color: '#222', fontSize: 15 },
	pickerItemTextActive: { color: '#0a84ff', fontWeight: '700' },
	pickerCheck: { color: '#0a84ff', fontSize: 16, fontWeight: '700' },
	empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	emptyText: { color: '#666' },
	row: {
		flexDirection: 'row',
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#fafafa',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	rowLeft: { flex: 1 },
	rowRight: { marginLeft: 12 },
	title: { fontSize: 16, fontWeight: '600' },
	subtitle: { fontSize: 12, color: '#666' },
	actionsRow: { flexDirection: 'row' },
	actionBtn: {
		marginLeft: 8,
		paddingVertical: 6,
		paddingHorizontal: 10,
		backgroundColor: '#f2f2f2',
		borderRadius: 6,
	},
	actionText: { color: '#333', fontWeight: '600' },
	editActions: { flexDirection: 'row' },
	input: {
		minWidth: 180,
		paddingVertical: 6,
		paddingHorizontal: 8,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 6,
	},
})

export default SnapshotExplorer
