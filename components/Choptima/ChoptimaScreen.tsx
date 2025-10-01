import type React from 'react'
import { memo, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import ActionsMenu from './ActionsMenu'
import { AssemblyChecklistControlled } from './AssemblyChecklist'
import ChoptimaAssembly from './ChoptimaAssembly'
import DiagramsPlaceholder from './DiagramsPlaceholder'
import LinksTab from './LinksTab'
import ManualsTab from './ManualsTab'
import TabButton from './TabButton'
import useChoptimaStore from './useChoptimaStore'

export const ChoptimaScreen: React.FC = memo(() => {
	const [activeTab, setActiveTab] = useState<
		'assembly' | 'disassembly' | 'diagrams' | 'links' | 'manuals'
	>('assembly')
	// Keep checklistMode as local state (doesn't need global persistence)
	const [checklistMode, setChecklistMode] = useState(false)
	// pinned actions persisted in store
	const pinnedActions = useChoptimaStore((s) => s.pinnedActions)
	const togglePinnedAction = useChoptimaStore((s) => s.togglePinnedAction)
	const loadPinnedActions = useChoptimaStore((s) => s.loadPinnedActions)

	// initialize persisted pinned actions when this screen mounts
	useEffect(() => {
		loadPinnedActions()
		// debug: log pinned actions after attempting to load
		console.log('ChoptimaScreen: called loadPinnedActions')
	}, [loadPinnedActions])

	useEffect(() => {
		console.log('ChoptimaScreen: pinnedActions changed ->', pinnedActions)
	}, [pinnedActions])

	return (
		<>
			<View style={styles.container}>
				<ScrollView horizontal style={styles.tabsRow}>
					<TabButton
						label="Assembly"
						active={activeTab === 'assembly'}
						onPress={() => setActiveTab('assembly')}
					/>
					<TabButton
						label="Disassembly"
						active={activeTab === 'disassembly'}
						onPress={() => setActiveTab('disassembly')}
					/>
					<TabButton
						label="Diagrams"
						active={activeTab === 'diagrams'}
						onPress={() => setActiveTab('diagrams')}
					/>
					<TabButton
						label="Links"
						active={activeTab === 'links'}
						onPress={() => setActiveTab('links')}
					/>
					<TabButton
						label="Manuals"
						active={activeTab === 'manuals'}
						onPress={() => setActiveTab('manuals')}
					/>
				</ScrollView>

				{/* Compact Actions button that opens the actions menu */}
				<View style={styles.tabControlsRow}>
					{activeTab === 'assembly' && (
						<>
							{/* Actions button on the far left (anchor provided by ActionsMenu) */}
							<ActionsMenu
								checklistMode={checklistMode}
								onToggleChecklist={() => setChecklistMode(!checklistMode)}
								onTogglePin={(actionId: string) => togglePinnedAction(actionId)}
							/>
						</>
					)}
				</View>

				<View style={styles.content}>
					{activeTab === 'assembly' &&
						(checklistMode ? (
							<AssemblyChecklistControlled />
						) : (
							<ChoptimaAssembly hideHeaderToggle />
						))}
					{activeTab === 'disassembly' && (
						<View style={styles.placeholder}>
							<Text style={styles.placeholderText}>
								Disassembly steps not yet authored.
							</Text>
						</View>
					)}
					{activeTab === 'diagrams' && <DiagramsPlaceholder />}
					{activeTab === 'links' && <LinksTab />}
					{activeTab === 'manuals' && <ManualsTab />}
				</View>
			</View>
			{/* ActionsMenu anchor is rendered in the controls row above */}
		</>
	)
})

ChoptimaScreen.displayName = 'ChoptimaScreen'

const styles = StyleSheet.create({
	container: { flex: 1 },
	tabsRow: {
		flexGrow: 0,
		padding: 8,
		backgroundColor: '#fff',
	},
	tab: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 6,
		marginRight: 8,
	},
	tabActive: { backgroundColor: '#0a84ff' },
	tabText: { color: '#333', fontWeight: '600' },
	tabTextActive: { color: '#fff' },
	toggleRow: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		padding: 8,
		backgroundColor: '#f7f7f7',
	},
	toggleChecklistBtn: {
		alignSelf: 'flex-start',
		paddingVertical: 2,
		paddingHorizontal: 10,
		borderRadius: 6,
		backgroundColor: '#e6e6e6',
		marginRight: 8,
		height: 32,
		justifyContent: 'center',
		alignItems: 'center',
	},
	toggleChecklistBtnActive: { backgroundColor: '#0a84ff' },
	toggleChecklistText: { color: '#333', fontWeight: '600' },
	toggleChecklistTextActive: { color: '#fff' },
	content: { flex: 1 },
	placeholder: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 24,
	},
	placeholderText: { color: '#666', textAlign: 'center' },
	checklistContainer: { flex: 1, backgroundColor: '#f2f5f9' },
	inner: { padding: 16, paddingBottom: 48 },
	header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
	checklistItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10,
	},
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: 6,
		borderWidth: 2,
		borderColor: '#bbb',
		marginRight: 12,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
	},
	checkboxChecked: { backgroundColor: '#0a84ff', borderColor: '#0a84ff' },
	checkboxMark: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
	checklistText: { fontSize: 16, color: '#222' },
	checklistTextChecked: { color: '#aaa', textDecorationLine: 'line-through' },
	headerRowSingle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 12,
	},
	headerTitle: { fontSize: 18, fontWeight: '700' },
	tabControlsRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 6,
		backgroundColor: 'transparent',
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	actionsBtn: {
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: 6,
		backgroundColor: '#e6e6e6',
	},
	actionsBtnText: { color: '#333', fontWeight: '600' },
	actionsSeparator: {
		width: 1,
		height: 36,
		backgroundColor: '#e6e6e6',
		marginHorizontal: 10,
	},
	pinnedRow: { alignItems: 'center' },
	pinnedScroll: { flex: 1 },
	iconQuick: {
		width: 40,
		height: 40,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
		marginRight: 8,
		borderWidth: 1,
		borderColor: '#eee',
	},
})

export default ChoptimaScreen
