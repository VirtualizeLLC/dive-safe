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

export type AssemblyStep = {
	id: string
	step?: string
	title: string
	content?: string
	images?: string[]
	// nested steps
	children?: AssemblyStep[]
	// optional input definitions for this step (used for validation/subtasks)
	inputs?: { id: string; label: string; placeholder?: string }[]
}

export const sampleSteps: AssemblyStep[] = [
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
		title: 'Cylinders & Gas Analysis',
		content:
			'## Cylinders & gas analysis\n\n- Fill oxygen and bailout/diluent cylinders if needed.\n- Analyze gas for O2 and He content (CO analysis recommended). Record the O2 and He percentages for main gas and any bailout cylinders.',
	},
	{
		id: '3',
		step: '3',
		title: 'Canister Assembly',
		content: '## Canister assembly\n\nPerform the following canister tasks:',
	},
	{
		id: '3a',
		step: '3a',
		title: 'Inspect canister, head & lid',
		content:
			'Inspect canister, head, and lid for damage, debris, or missing hardware.',
	},
	{
		id: '3b',
		step: '3b',
		title: 'Inspect scrubber media',
		content:
			'Inspect scrubber media/cartridges (EAC or other sorb) and note type; if using EAC, inspect cartridges for damage and orientation.',
	},
	{
		id: '3c',
		step: '3c',
		title: 'Pack scrubber',
		content:
			'Pack scrubber canister, install cartridges as required and confirm orientation.',
	},
	{
		id: '3d',
		step: '3d',
		title: 'Inspect bore plug',
		content: 'Inspect bore plug and confirm correct orientation.',
	},
	{
		id: '3e',
		step: '3e',
		title: 'Lube O-rings & install head',
		content:
			'Lube head O-rings and flat seals; confirm O-rings on premix/purge tube and install head onto canister.',
	},
	{
		id: '3f',
		step: '3f',
		title: 'Water trap & lid',
		content:
			'Confirm water trap is installed in lid; lube lid O-rings and flat seals and secure the lid.',
	},
	{
		id: '4',
		step: '4',
		title: 'Calibration & Sensor Setup',
		content:
			'## Calibration & sensor setup\n\nCalibration and sensor checks for controller and HUD.',
	},
	{
		id: '4a',
		step: '4a',
		title: 'Install calibration caps',
		content: 'Install calibration caps if required.',
	},
	{
		id: '4b',
		step: '4b',
		title: 'Flush with O2',
		content:
			'Connect O2 hose to controller, turn on controller, and flush with oxygen until PPO2 readings stabilize.',
	},
	{
		id: '4c',
		step: '4c',
		title: 'Calibrate controller & HUD',
		content:
			'Calibrate controller and HUD following manufacturer instructions.',
	},
	{
		id: '4d',
		step: '4d',
		title: 'Record O2 sensor readings',
		content:
			'With scrubber filled and flushed with O2, check and record O2 sensor mV readings and verify they are within expected ranges.',
		// require three sensor readings: mv1, mv2, mv3
		children: [
			{
				id: '4d-sensors',
				title: 'O2 sensor mV readings',
				inputs: [
					{ id: 'mv1', label: 'Sensor 1 (mV)', placeholder: 'e.g. 400' },
					{ id: 'mv2', label: 'Sensor 2 (mV)', placeholder: 'e.g. 410' },
					{ id: 'mv3', label: 'Sensor 3 (mV)', placeholder: 'e.g. 395' },
				],
			},
		],
	},
	{
		id: '5',
		step: '5',
		title: 'Bag / Loop Setup',
		content: '## Bag and loop setup\n\nSetup bag, hoses and routing.',
	},
	{
		id: '5a',
		step: '5a',
		title: 'Install water trap tubes',
		content:
			'Install both water trap tubes into counterlungs (note black machined tube for exhale side).',
	},
	{
		id: '5b',
		step: '5b',
		title: 'Mount scrubber',
		content:
			'Position assembled scrubber canister into unit and secure into counterlungs/seat.',
	},
	{
		id: '5c',
		step: '5c',
		title: 'Inspect valves & hoses',
		content:
			'Inspect DSV, mushroom valves, mouthpiece, loop hoses, fittings and O-rings for condition.',
	},
	{
		id: '5d',
		step: '5d',
		title: 'Stereo check',
		content:
			'Connect DSV to loop hoses and perform stereo check to confirm flow direction.',
	},
	{
		id: '5e',
		step: '5e',
		title: 'Connect loop hoses',
		content:
			'Connect loop hoses to counterlungs and double-check fittings for tightness.',
	},
	{
		id: '5f',
		step: '5f',
		title: 'Route electronics cables',
		content:
			'Route controller and HUD cables, plug into electronics canister, and stow excess cable.',
	},
	{
		id: '6',
		step: '6',
		title: 'Oxygen Cylinder & Regulator',
		content: '## Oxygen & regulator\n\nInstall oxygen supply and regulator.',
		children: [
			{
				id: '6d-batteries',
				title: 'Battery voltages',
				inputs: [
					{
						id: 'bat1',
						label: 'DiveCan battery 1 (V)',
						placeholder: 'e.g. 13.2',
					},
					{
						id: 'bat2',
						label: 'DiveCan battery 2 (V)',
						placeholder: 'e.g. 13.1',
					},
				],
			},
		],
	},
	{
		id: '6a',
		step: '6a',
		title: 'Attach oxygen hose & manual add',
		content:
			'Attach oxygen supply hose to head fitting and attach manual add/override feed to MAV. Ensure inline shutoff is turned on and locked open with clip.',
	},
	{
		id: '6b',
		step: '6b',
		title: 'Mount cylinder',
		content: 'Clip and tighten canister cover and mount oxygen cylinder.',
	},
	{
		id: '6c',
		step: '6c',
		title: 'Attach regulator',
		content: 'Attach regulator and connect oxygen hose to the Y-block.',
	},
	{
		id: '7',
		step: '7',
		title: 'Leak & Pressure Tests',
		content: '## Leak and pressure tests\n\nPerform pressure and leak checks.',
	},
	{
		id: '7a',
		step: '7a',
		title: 'Negative pressure test',
		content:
			'Ensure ADV is off and perform a negative pressure test for minimum 30s (no inward leaks).',
	},
	{
		id: '7b',
		step: '7b',
		title: 'Positive pressure test',
		content:
			'Ensure counterlung exhaust valve is closed and perform a positive pressure test for minimum 2 minutes (no outward leaks).',
	},
	{
		id: '7c',
		step: '7c',
		title: 'Record cylinder pressure',
		content: 'Turn on oxygen and record cylinder pressure (bar).',
	},
	{
		id: '7d',
		step: '7d',
		title: 'Leak-down check',
		content:
			'Turn off oxygen cylinder and perform leak-down check to confirm system holds pressure.',
	},
	{
		id: '8',
		step: '8',
		title: 'Pre-breathe & Final Checks',
		content:
			'## Pre-breathe & final checks\n\nComplete final pre-breathe and system checks.',
	},
	{
		id: '8a',
		step: '8a',
		title: 'Pre-breathe',
		content:
			'Turn oxygen back on, open counterlung exhaust valve, set setpoint (example 0.5) and perform a 5-minute pre-breathe while confirming solenoid operation and system stability.',
	},
	{
		id: '8b',
		step: '8b',
		title: 'Confirm computers & bailout',
		content:
			'Confirm onboard and bailout gases are configured and selected in dive computers and set to CC mode.',
	},
	{
		id: '8c',
		step: '8c',
		title: 'Bailout checks',
		content:
			'Check bailout regulator hoses, mouthpieces and fittings for tightness; install bailout regulators and verify operation.',
	},
	// Placeholder disassembly step
	{
		id: 'D1',
		step: 'D1',
		title: 'Disassembly / Storage',
		content:
			'Placeholder: Steps for safely disassembling, cleaning, and storing the Choptima after use. Include drying, depressurizing cylinders, and packing procedures.',
	},
]

export const ChoptimaAssembly: React.FC<{
	steps?: AssemblyStep[]
	hasAllStepsExpanded?: boolean
	onToggleExpandAll?: (v: boolean) => void
	hideHeaderToggle?: boolean
}> = ({
	steps = sampleSteps,
	hasAllStepsExpanded,
	onToggleExpandAll,
	hideHeaderToggle,
}) => {
	const [localExpandAll, setLocalExpandAll] = useState(false)

	const actualExpandAll =
		typeof hasAllStepsExpanded === 'boolean' ? hasAllStepsExpanded : localExpandAll

	const handleToggle = () => {
		const next = !actualExpandAll
		if (onToggleExpandAll) onToggleExpandAll(next)
		else setLocalExpandAll(next)
	}

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.inner}>
			<View style={styles.headerRow}>
				<Text style={styles.header}>Choptima CCR Assembly Guide</Text>
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
						step={s.step}
						title={s.title}
						content={s.content}
						images={s.images}
						expanded={actualExpandAll}
						initiallyCollapsed={!actualExpandAll}
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

export default ChoptimaAssembly
