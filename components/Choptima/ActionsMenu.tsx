import { memo, useCallback, useMemo, useRef, useState } from 'react'
import type { GestureResponderEvent } from 'react-native'
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { IconButton, Menu } from 'react-native-paper'
import IconBtn from '@/components/ui/IconButton'
import { IconSymbol } from '@/components/ui/icon-symbol'
import SnapshotExplorer from '../Snapshots/SnapshotExplorer'
import useChoptimaStore from './useChoptimaStore'

type Props = {
	checklistMode: boolean
	onToggleChecklist: () => void
	expandAll: boolean
	onToggleExpandAll: () => void
	setExpandAll: (v: boolean) => void
	setChecklistMode: (v: boolean) => void
	onTogglePin?: (actionId: string) => void
}

const ActionsMenu: React.FC<Props> = memo(
	({
		checklistMode,
		onToggleChecklist,
		expandAll,
		setExpandAll,
		setChecklistMode,
		onToggleExpandAll,
		onTogglePin,
	}) => {
		const [showSnapshots, setShowSnapshots] = useState(false)
		const [visible, setVisible] = useState(false)
		const [editing, setEditing] = useState(false)
		const [nameInput, setNameInput] = useState('')

		const saveSnapshot = useChoptimaStore((s) => s.saveSnapshot)
		const loadedSnapshotName = useChoptimaStore((s) => s.loadedSnapshotName)
		const setLoadedSnapshotName = useChoptimaStore(
			(s) => s.setLoadedSnapshotName,
		)

		const handleSave = useCallback(() => {
			console.log('Saving snapshot...')
			saveSnapshot()
		}, [saveSnapshot])
		const pinnedActions = useChoptimaStore((s) => s.pinnedActions)

		const saveName = useMemo(
			() =>
				loadedSnapshotName
					? loadedSnapshotName.replace(/_/g, ' ')
					: new Date().toISOString(),
			[loadedSnapshotName],
		)

		return (
			<View
				style={{
					position: 'relative',
					flexDirection: 'column',
					// alignItems: 'center',
				}}
			>
				<View style={{ flexDirection: 'row', flexGrow: 1, flexShrink: 1 }}>
					<View
						style={{
							position: 'relative',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<IconButton
							onPress={() => {
								setVisible(true)
							}}
							icon={'dots-vertical'}
							size={24}
							style={[styles.actionsBtn, { flexDirection: 'row' }]}
						/>
						<View
							style={{ position: 'absolute', top: 32, left: 0, zIndex: 1000 }}
						>
							{visible && (
								<Menu
									visible={visible}
									onDismiss={() => {
										setVisible(false)
									}}
									mode="elevated"
									anchor={
										<View
											style={[styles.actionsBtn, { height: 0, width: 0 }]}
										/>
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
													{checklistMode
														? 'Turn checklist OFF'
														: 'Turn checklist ON'}
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
														pinnedActions?.includes('toggle_checklist')
															? '#ff9800'
															: '#888'
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
														pinnedActions?.includes('toggle_expand')
															? '#ff9800'
															: '#888'
													}
												/>
											</TouchableOpacity>
										</View>

										<View style={styles.itemRow}>
											<TouchableOpacity
												style={styles.itemAction}
												onPress={() => {
													handleSave()
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
													color={
														pinnedActions?.includes('save') ? '#ff9800' : '#888'
													}
												/>
											</TouchableOpacity>
										</View>

										<View style={styles.itemRow}>
											<TouchableOpacity
												style={styles.itemAction}
												onPress={() => {
													setShowSnapshots(true)
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
													color={
														pinnedActions?.includes('snapshots')
															? '#ff9800'
															: '#888'
													}
												/>
											</TouchableOpacity>
										</View>
									</View>
								</Menu>
							)}
						</View>
					</View>
					{/* separator */}
					<View style={styles.actionsSeparator} />
					{/* horizontally scrollable pinned actions */}
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.pinnedRow}
						style={styles.pinnedScroll}
					>
						{pinnedActions?.includes('toggle_checklist') && (
							<IconBtn
								name="checkmark.square.fill"
								onPress={() => setChecklistMode((v) => !v)}
								onLongPress={() => Alert.alert('Toggle checklist')}
								accessibilityLabel="Toggle checklist"
							/>
						)}
						{pinnedActions?.includes('toggle_expand') && (
							<IconBtn
								name="chevron.down"
								onPress={() => setExpandAll((v) => !v)}
								onLongPress={() => Alert.alert('Toggle expand/collapse')}
								accessibilityLabel="Toggle expand/collapse"
							/>
						)}
						{pinnedActions?.includes('save') && (
							<IconBtn
								name="square.and.arrow.down"
								onPress={handleSave}
								onLongPress={() => Alert.alert('Save snapshot')}
								accessibilityLabel="Save snapshot"
							/>
						)}
						{pinnedActions?.includes('snapshots') && (
							<IconBtn
								name="clock"
								onPress={() => setShowSnapshots(true)}
								onLongPress={() => Alert.alert('Open snapshots')}
								accessibilityLabel="Open snapshots"
							/>
						)}
					</ScrollView>
				</View>

				{/* lower panel showing current sheet name and rename control */}
				<View style={styles.lowerPanel}>
					{editing ? (
						<>
							<TextInput
								value={saveName}
								onChangeText={setNameInput}
								placeholder="Sheet name"
								defaultValue={Date.now().toString()}
								style={styles.nameInput}
							/>
							<View style={styles.renameActions}>
								<TouchableOpacity
									style={styles.renameBtn}
									onPress={() => {
										const name = nameInput.trim() || undefined
										saveSnapshot(name)
										setLoadedSnapshotName(
											name ? name.replace(/\s+/g, '_') : undefined,
										)
										setEditing(false)
									}}
								>
									<Text style={styles.renameBtnText}>Save</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.renameBtn, styles.renameCancel]}
									onPress={() => setEditing(false)}
								>
									<Text style={styles.renameBtnText}>Cancel</Text>
								</TouchableOpacity>
							</View>
						</>
					) : (
						<>
							<Text style={styles.sheetLabel}>Sheet: {saveName}</Text>
							<IconButton
								onPress={() => {
									setNameInput(
										loadedSnapshotName
											? loadedSnapshotName.replace(/_/g, ' ')
											: '',
									)
									setEditing(true)
								}}
								size={20}
								icon="pencil"
								style={styles.editIcon}
							/>
						</>
					)}
				</View>
				<SnapshotExplorer
					visible={showSnapshots}
					onClose={() => setShowSnapshots(false)}
				/>
			</View>
		)
	},
)

ActionsMenu.displayName = 'ActionsMenu'

const styles = StyleSheet.create({
	pinnedScroll: { flex: 1 },
	pinnedRow: { alignItems: 'center' },
	menuContent: { width: 260 },
	actionsSeparator: {
		width: 1,
		height: 36,
		backgroundColor: '#e6e6e6',
		marginHorizontal: 10,
	},
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
	lowerPanel: {
		marginLeft: 8,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	nameInput: {
		minWidth: 180,
		paddingVertical: 6,
		paddingHorizontal: 8,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#ddd',
		backgroundColor: '#fff',
	},
	renameActions: { flexDirection: 'row', marginLeft: 8 },
	renameBtn: {
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: 6,
		backgroundColor: '#0a84ff',
		marginRight: 8,
	},
	renameCancel: { backgroundColor: '#999' },
	renameBtnText: { color: '#fff', fontWeight: '600' },
	sheetLabel: { color: '#333', marginRight: 8 },
	editIcon: { marginLeft: 4 },
})

export default ActionsMenu
