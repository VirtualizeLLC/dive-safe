import type React from 'react'
import { useState } from 'react'
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import ChoptimaStep from './ChoptimaStep'
import useChoptimaStore from './useChoptimaStore'

export type AssemblyStep = {
	id: string
	step?: string
	title: string
	content?: string
	images?: string[]
	// nested steps
	children?: AssemblyStep[]
	// optional input definitions for this step (used for validation/subtasks)
	requiredInputs?: { id: string; label: string; placeholder?: string }[]
}

export const steps: AssemblyStep[] = [
	{
		id: '1',
		step: '1',
		title: 'Clean & Dry',
		content:
			'# Clean and dry\n\nIf not completed before storage: steam, rinse and clean the canister, lid, loop hoses, DSV, and counterlungs. Allow all parts to dry completely.',
	},
	{
		id: '2',
		step: '2',
		title: 'Storage',
		content:
			'Store the Choptima in a cool and dry place, away from direct sunlight and extreme temperatures. Ensure all components are dry before storage to prevent mold and corrosion. Ensure O2 sensor are not exposed to high concentrations of O2 during storage.',
	},
]

export const ChoptimaDisassembly: React.FC<{
	hideHeaderToggle?: boolean
	hasCheckListMode?: boolean
}> = ({ hideHeaderToggle, hasCheckListMode }) => {
	// Wire to checklist store so guide reflects saved/loaded state
	const items = useChoptimaStore((s) => s.items)
	const setItem = useChoptimaStore((s) => s.setItem)
	const setField = useChoptimaStore((s) => s.setField)
	const hasAllStepsExpanded = useChoptimaStore((s) => s.hasAllStepsExpanded)
	const setHasAllStepsExpanded = useChoptimaStore(
		(s) => s.setHasAllStepsExpanded,
	)

	const actualExpandAll = hasAllStepsExpanded

	const handleToggle = () => {
		setHasAllStepsExpanded(!hasAllStepsExpanded)
	}

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.inner}>
			<View style={styles.headerRow}>
				<Text style={styles.header}>Disassembly Guide</Text>
				{!hideHeaderToggle && (
					<TouchableOpacity onPress={handleToggle} style={styles.toggleBtn}>
						<Text style={styles.toggleText}>
							{actualExpandAll ? 'Collapse all' : 'Expand all'}
						</Text>
					</TouchableOpacity>
				)}
			</View>

			<View style={styles.steps}>
				{steps.map((s) => (
					<ChoptimaStep
						key={s.id}
						hasCheckListMode={hasCheckListMode}
						requiredInputs={s.requiredInputs}
						step={s.step}
						title={s.title}
						content={s.content}
						images={s.images}
						expanded={actualExpandAll}
						initiallyCollapsed={!actualExpandAll}
						checked={!!items[s.id]?.checked}
						onCheckedChange={(next) => setItem(s.id, { checked: next })}
						values={items[s.id]?.values}
						onInputChange={(inputId: string, value: string) =>
							setField(s.id, inputId, value)
						}
					/>
				))}
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#f2f5f9' },
	inner: { padding: 16, paddingBottom: 48 },
	header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 12,
	},
	toggleBtn: {
		paddingVertical: 6,
		paddingHorizontal: 10,
		backgroundColor: '#e6e6e6',
		borderRadius: 6,
	},
	toggleText: { color: '#333', fontWeight: '600' },
	steps: { marginTop: 8 },
})
