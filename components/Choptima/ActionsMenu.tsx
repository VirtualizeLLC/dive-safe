import { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Menu } from 'react-native-paper'

type Props = {
	checklistMode: boolean
	onToggleChecklist: () => void
	expandAll: boolean
	onToggleExpandAll: () => void
	onSave: () => void
	onOpenSnapshots: () => void
	pinnedActions?: string[]
	onTogglePin?: (actionId: string) => void
}

const ActionsMenu: React.FC<Props> = ({
	checklistMode,
	onToggleChecklist,
	expandAll,
	onToggleExpandAll,
	onSave,
	onOpenSnapshots,
	pinnedActions,
	onTogglePin,
}) => {
	const [visible, setVisible] = useState(false)
	useEffect(() => {
		return () => {
			// no timers to clean up anymore
		}
	}, [])

	return (
		<Menu
			visible={visible}
			onDismiss={() => setVisible(false)}
			anchor={
				<TouchableOpacity
					style={styles.actionsBtn}
					onPress={() => setVisible(true)}
				>
					<Text style={styles.actionsBtnText}>Actions ▾</Text>
				</TouchableOpacity>
			}
		>
			<View style={styles.menuContent}>
				{/* Turn checklist ON/OFF */}
				<View style={styles.itemRow}>
					<TouchableOpacity
						style={styles.itemAction}
						onPress={() => {
							onToggleChecklist()
							setVisible(false)
						}}
					>
						<Text style={styles.itemText}>
							{checklistMode ? 'Turn checklist OFF' : 'Turn checklist ON'}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.pin}
						onPress={() => onTogglePin?.('toggle_checklist')}
					>
						<Text style={styles.pinText}>
							{pinnedActions?.includes('toggle_checklist') ? '📌' : '📍'}
						</Text>
					</TouchableOpacity>
				</View>

				{/* Expand/Collapse all */}
				<View style={styles.itemRow}>
					<TouchableOpacity
						style={styles.itemAction}
						onPress={() => {
							onToggleExpandAll()
							setVisible(false)
						}}
					>
						<Text style={styles.itemText}>
							{expandAll ? 'Collapse all' : 'Expand all'}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.pin}
						onPress={() => onTogglePin?.('toggle_expand')}
					>
						<Text style={styles.pinText}>
							{pinnedActions?.includes('toggle_expand') ? '📌' : '📍'}
						</Text>
					</TouchableOpacity>
				</View>

				{/* Save snapshot */}
				<View style={styles.itemRow}>
					<TouchableOpacity
						style={styles.itemAction}
						onPress={() => {
							onSave()
							setVisible(false)
						}}
					>
						<Text style={styles.itemText}>Save snapshot</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.pin}
						onPress={() => onTogglePin?.('save')}
					>
						<Text style={styles.pinText}>
							{pinnedActions?.includes('save') ? '📌' : '📍'}
						</Text>
					</TouchableOpacity>
				</View>

				{/* Browse snapshots */}
				<View style={styles.itemRow}>
					<TouchableOpacity
						style={styles.itemAction}
						onPress={() => {
							onOpenSnapshots()
							setVisible(false)
						}}
					>
						<Text style={styles.itemText}>Browse snapshots</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.pin}
						onPress={() => onTogglePin?.('snapshots')}
					>
						<Text style={styles.pinText}>
							{pinnedActions?.includes('snapshots') ? '📌' : '📍'}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Menu>
	)
}

const styles = StyleSheet.create({
	menuContent: { width: 260 },
	item: {
		paddingVertical: 10,
		paddingHorizontal: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#f2f2f2',
	},
	itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#f2f2f2' },
	itemAction: { flex: 1 },
	itemText: { fontSize: 15, color: '#222' },
	actionsBtn: {
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: 6,
		backgroundColor: '#e6e6e6',
	},
	actionsBtnText: { color: '#333', fontWeight: '600' },
	pin: { position: 'absolute', right: 8, top: 12, padding: 6 },
	pinText: { fontSize: 14 },
})

export default ActionsMenu
