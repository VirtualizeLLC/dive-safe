import { useState } from 'react'
import type { GestureResponderEvent } from 'react-native'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Menu } from 'react-native-paper'
import { IconSymbol } from '@/components/ui/icon-symbol'

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

	return (
		<Menu
			visible={visible}
			onDismiss={() => setVisible(false)}
			anchor={
				<TouchableOpacity
					style={styles.actionsBtn}
					onPressIn={() => setVisible(true)}
					accessibilityLabel="Open actions"
				>
					<Text style={styles.actionsBtnText}>Actions ▾</Text>
				</TouchableOpacity>
			}
		>
			<View style={styles.menuContent}>
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
						onPress={(e: GestureResponderEvent) => {
							e.stopPropagation()
							onTogglePin?.('toggle_checklist')
						}}
						accessibilityLabel="Pin toggle checklist"
					>
						<IconSymbol
							name={'pin'}
							size={18}
							color={
								pinnedActions?.includes('toggle_checklist') ? '#ff9800' : '#888'
							}
						/>
					</TouchableOpacity>
				</View>

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
						onPress={(e: GestureResponderEvent) => {
							e.stopPropagation()
							onTogglePin?.('toggle_expand')
						}}
						accessibilityLabel="Pin expand all"
					>
						<IconSymbol
							name={'pin'}
							size={18}
							color={
								pinnedActions?.includes('toggle_expand') ? '#ff9800' : '#888'
							}
						/>
					</TouchableOpacity>
				</View>

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
						onPress={(e: GestureResponderEvent) => {
							e.stopPropagation()
							onTogglePin?.('save')
						}}
						accessibilityLabel="Pin save"
					>
						<IconSymbol
							name={'pin'}
							size={18}
							color={pinnedActions?.includes('save') ? '#ff9800' : '#888'}
						/>
					</TouchableOpacity>
				</View>

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
						onPress={(e: GestureResponderEvent) => {
							e.stopPropagation()
							onTogglePin?.('snapshots')
						}}
						accessibilityLabel="Pin snapshots"
					>
						<IconSymbol
							name={'pin'}
							size={18}
							color={pinnedActions?.includes('snapshots') ? '#ff9800' : '#888'}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</Menu>
	)
}

const styles = StyleSheet.create({
	menuContent: { width: 260 },
	itemRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10,
		paddingHorizontal: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#f2f2f2',
	},
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
