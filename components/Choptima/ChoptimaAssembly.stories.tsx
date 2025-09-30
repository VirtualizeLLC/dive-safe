import type { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import ChoptimaAssembly from './ChoptimaAssembly'

export default {
	title: 'Choptima/ChoptimaAssembly',
	component: ChoptimaAssembly,
} as ComponentMeta<typeof ChoptimaAssembly>

const Template: ComponentStory<typeof ChoptimaAssembly> = (args) => (
	<ChoptimaAssembly {...args} />
)

export const Default = Template.bind({})
Default.args = {}
