import type React from 'react'
import { ScrollView, Text } from 'react-native'
import CheckboxInternalState from './CheckboxInternalState'
import { type AssemblyStep, sampleSteps } from './ChoptimaAssembly'
import ChoptimaStep from './ChoptimaStep'
import useChoptimaStore from './useChoptimaStore'

export const AssemblyChecklist: React.FC = () => {
	const items = useChoptimaStore((s) => s.items)
	const setItem = useChoptimaStore((s) => s.setItem)
	const setField = useChoptimaStore((s) => s.setField)

	const handleToggle = (id: string, isChecked: boolean) => {
		console.log('called handleToggle', id, isChecked)
		setItem(id, { checked: isChecked })
	}

	return (
		<ScrollView
			style={{ flex: 1 }}
			contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
		>
			<Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>
				Choptima CCR Assembly Checklist
			</Text>
			{sampleSteps.map((step) => (
				<ChoptimaStep
					key={step.id}
					step={step.step}
					title={step.title}
					content={step.content}
					images={step.images}
					leftAccessory={
						<CheckboxInternalState
							onPress={(isChecked: boolean) => handleToggle(step.id, isChecked)}
							isChecked={items[step.id]?.checked || false}
							validator={() => {
								// runtime-only validation for required child inputs
								if (!step.children) return null
								for (const ss of step.children) {
									if (!ss.inputs) continue
									for (const inp of ss.inputs) {
										const val = items[step.id]?.values?.[inp.id]
										if (!val || String(val).trim() === '')
											return `Please enter ${inp.label}`
									}
								}
								return null
							}}
						/>
					}
					onInputChange={(inputId: string, value: string) =>
						setField(step.id, inputId, value)
					}
				/>
			))}
		</ScrollView>
	)
}

export const AssemblyChecklistControlled: React.FC = () => {
	const items = useChoptimaStore((s) => s.items)
	const setItem = useChoptimaStore((s) => s.setItem)
	const setField = useChoptimaStore((s) => s.setField)
	const hasAllStepsExpanded = useChoptimaStore((s) => s.hasAllStepsExpanded)

	const handleToggle = (id: string, isChecked: boolean) => {
		setItem(id, { checked: isChecked })
	}

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: '#f2f5f9' }}
			contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
		>
			<Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>
				Choptima CCR Assembly Checklist
			</Text>
			{sampleSteps.map((step) => (
				<ChoptimaStep
					key={step.id}
					step={step.step}
					title={step.title}
					content={step.content}
					images={step.images}
					leftAccessory={
						<CheckboxInternalState
							onPress={(isChecked: boolean) => handleToggle(step.id, isChecked)}
							isChecked={items[step.id]?.checked || false}
							validator={() => {
								// runtime-only validation using children inputs
								if (!step.children) return null
								for (const ss of step.children) {
									if (!ss.inputs) continue
									for (const inp of ss.inputs) {
										const val = items[step.id]?.values?.[inp.id]
										if (!val || String(val).trim() === '')
											return `Please enter ${inp.label}`
									}
								}
								return null
							}}
						/>
					}
					onInputChange={(inputId: string, value: string) =>
						setField(step.id, inputId, value)
					}
					expanded={hasAllStepsExpanded}
					initiallyCollapsed={!hasAllStepsExpanded}
				/>
			))}
		</ScrollView>
	)
}

export default AssemblyChecklist
