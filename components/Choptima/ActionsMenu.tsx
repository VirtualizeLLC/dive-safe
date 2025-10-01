import { DateTime } from 'luxon'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
	onTogglePin?: (actionId: string) => void
}

const ActionsMenu: React.FC<Props> = memo(
	({ checklistMode, onToggleChecklist, onTogglePin }) => {
		const hasAllStepsExpanded = useChoptimaStore((s) => s.hasAllStepsExpanded)
		const setHasAllStepsExpanded = useChoptimaStore(
			(s) => s.setHasAllStepsExpanded,
		)
		const [showSnapshots, setShowSnapshots] = useState(false)
		const [visible, setVisible] = useState(false)
		const [editing, setEditing] = useState(false)

		const saveSnapshot = useChoptimaStore((s) => s.saveSnapshot)
		const startNewSheet = useChoptimaStore((s) => s.startNewSheet)
		const loadedSnapshotName = useChoptimaStore((s) => s.loadedSnapshotName)
		const setLoadedSnapshotName = useChoptimaStore(
			(s) => s.setLoadedSnapshotName,
		)
		const hasUnsavedChanges = useChoptimaStore((s) => s.hasUnsavedChanges)

		const saveName = useMemo(() => {
			if (loadedSnapshotName) return loadedSnapshotName.replace(/_/g, ' ')
			return DateTime.now().toFormat('yyyy-LL-dd_HH:mm')
		}, [loadedSnapshotName])

		const nameInput = useRef(saveName)

		const handleSave = useCallback(() => {
			saveSnapshot(nameInput.current?.trim() || undefined)
		}, [saveSnapshot])

		const confirmAndNewSheet = useCallback(() => {
			const proceed = () => {
				const suggested = DateTime.now().toFormat('yyyy-LL-dd_HH:mm')
				startNewSheet(suggested)
				// Update local input and close menus
				nameInput.current = suggested
				setVisible(false)
			}
			if (hasUnsavedChanges()) {
				Alert.alert(
					'Unsaved changes',
					'Starting a new sheet will discard unsaved changes. Continue?',
					[
						{ text: 'Cancel', style: 'cancel' },
						{ text: 'Start new', style: 'destructive', onPress: proceed },
					],
				)
			} else {
				proceed()
			}
		}, [hasUnsavedChanges, startNewSheet])
		const pinnedActions = useChoptimaStore((s) => s.pinnedActions)

		const setNameInput = useCallback((val: string) => {
			nameInput.current = val
		}, [])

		useEffect(() => {
			setNameInput(saveName)
		}, [saveName, setNameInput])

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
										{/* New sheet */}
										<View style={styles.itemRow}>
											<TouchableOpacity
												style={styles.itemAction}
												onPress={confirmAndNewSheet}
											>
												<Text style={styles.itemText}>New sheet</Text>
											</TouchableOpacity>
											<TouchableOpacity
												style={styles.pin}
												onPress={(e: GestureResponderEvent) => {
													e.stopPropagation()
													onTogglePin?.('new_sheet')
												}}
												accessibilityLabel="Pin new sheet"
											>
												<IconSymbol
													name={'pin'}
													size={18}
													color={
														pinnedActions?.includes('new_sheet') ? '#ff9800' : '#888'
													}
												/>
											</TouchableOpacity>
										</View>

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
													setHasAllStepsExpanded(!hasAllStepsExpanded)
													setVisible(false)
												}}
											>
												<Text style={styles.itemText}>
													{hasAllStepsExpanded ? 'Collapse all' : 'Expand all'}
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
						{pinnedActions?.includes('new_sheet') && (
							<IconBtn
								name="plus"
								onPress={confirmAndNewSheet}
								onLongPress={() => Alert.alert('New sheet')}
								accessibilityLabel="New sheet"
							/>
						)}
						{pinnedActions?.includes('toggle_checklist') && (
							<IconBtn
								name="checkmark.square.fill"
								onPress={onToggleChecklist}
								onLongPress={() => Alert.alert('Toggle checklist')}
								accessibilityLabel="Toggle checklist"
							/>
						)}
						{pinnedActions?.includes('toggle_expand') && (
							<IconBtn
								name="chevron.left.forwardslash.chevron.right"
								onPress={() => setHasAllStepsExpanded(!hasAllStepsExpanded)}
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
								onChangeText={setNameInput}
								placeholder="Sheet name"
								defaultValue={saveName}
								style={styles.nameInput}
							/>
							<View style={styles.renameActions}>
								<TouchableOpacity
									style={styles.renameBtn}
									onPress={() => {
										const name = nameInput.current?.trim() || undefined
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
	pinnedScroll: { width: '100%' },
	pinnedRow: {
		paddingHorizontal: 8,
		flex: 1,
		flexGrow: 1,
		alignItems: 'center',
	},
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
		// gap not supported in RN; use spacing on children instead
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
