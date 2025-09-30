import React, { useEffect, useState } from 'react'
import {
	Alert,
	FlatList,
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { ChecklistStorage } from '@/app/storage/ChecklistStorage'
import useChoptimaStore from '@/components/Choptima/useChoptimaStore'

const SNAPSHOT_PREFIX = 'checklist:snapshot:'

type SnapshotItem = {
	key: string
	name: string
	createdAt?: number
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
				// try to parse ISO timestamp suffix
				if (name?.startsWith('202')) {
					// name probably is an ISO timestamp variant
					const date = new Date(name)
					if (!Number.isNaN(date.getTime())) createdAt = date.getTime()
				}
				return { key: k, name, createdAt }
			})
			// sort newest first by createdAt or name fallback
			mapped.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
			setItems(mapped)
		} catch (e) {
			console.warn('SnapshotExplorer: failed to load snapshots', e)
			setItems([])
		}
	}, [])

	useEffect(() => {
		if (visible) refresh()
	}, [visible, refresh])

	const handleLoad = (key: string) => {
		Alert.alert(
			'Load snapshot',
			'Load this snapshot and replace the current checklist?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Load',
					style: 'destructive',
					onPress: () => {
						loadSnapshotToStore(key)
						onClose()
					},
				},
			],
		)
	}

	const handleDelete = (key: string) => {
		Alert.alert(
			'Delete snapshot',
			'Are you sure you want to delete this snapshot?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						try {
							ChecklistStorage.delete(key)
						} catch (e) {
							console.warn('SnapshotExplorer: failed to delete', e)
						}
						refresh()
					},
				},
			],
		)
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
