import type React from 'react'
import { ScrollView, Text } from 'react-native'
import CheckboxInternalState from './CheckboxInternalState'
import { sampleSteps } from './ChoptimaAssembly'
import ChoptimaStep from './ChoptimaStep'
import useChoptimaStore from './useChoptimaStore'

export const AssemblyChecklist: React.FC = () => {
	const items = useChoptimaStore((s) => s.items)
	const setItem = useChoptimaStore((s) => s.setItem)

	const handleToggle = (id: string, isChecked: boolean) => {
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
						/>
					}
				/>
			))}
		</ScrollView>
	)
}

interface AssemblyChecklistProps {
	expandAll?: boolean
}
export const AssemblyChecklistControlled: React.FC<AssemblyChecklistProps> = ({
	expandAll,
}) => {
	const items = useChoptimaStore((s) => s.items)
	const setItem = useChoptimaStore((s) => s.setItem)

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
						/>
					}
					expanded={expandAll}
					initiallyCollapsed={!expandAll}
				/>
			))}
		</ScrollView>
	)
}

export default AssemblyChecklist
