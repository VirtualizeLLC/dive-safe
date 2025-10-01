import type { Meta, StoryFn } from '@storybook/react'
import React from 'react'
import { ChoptimaAssembly } from './ChoptimaAssembly'

export default {
	title: 'Choptima/ChoptimaAssembly',
	component: ChoptimaAssembly,
} as Meta<typeof ChoptimaAssembly>

const Template: StoryFn<typeof ChoptimaAssembly> = (args) => (
	<ChoptimaAssembly {...args} />
)

export const Default = Template.bind({})
Default.args = {}
