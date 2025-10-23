import type React from 'react'
import { View } from 'react-native'
import { Text } from './Text'

const meta = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
}

export default meta

type Story = {
  args?: Record<string, unknown>
  render?: (args: Record<string, unknown>) => React.ReactNode
}

export const Default: Story = {
  args: {
    children: 'Hello Storybook',
  },
  render: (args: Record<string, unknown>) => (
    <View style={{ padding: 16 }}>
      <Text {...args} />
    </View>
  ),
}
