import type React from 'react'
import { ScrollView, Text } from 'react-native'
import CheckboxInternalState from './CheckboxInternalState'
import { assemblyStepData } from './ChoptimaAssembly'
import ChoptimaStep from './ChoptimaStep'
import useChoptimaStore from './useChoptimaStore'

export const ChoptimaAssemblyChecklistControlled: React.FC = () => {
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
				Assembly Checklist
			</Text>
			{assemblyStepData.map((step) => (
				<ChoptimaStep
					key={step.id}
					{...step}
					leftAccessory={
						<CheckboxInternalState
							onPress={(isChecked: boolean) => handleToggle(step.id, isChecked)}
							isChecked={items[step.id]?.checked || false}
							validator={() => {
								// runtime-only validation using children inputs
								if (!step.children) return null
								for (const ss of step.children) {
									if (!ss.requiredInputs) continue
									for (const inp of ss.requiredInputs) {
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
