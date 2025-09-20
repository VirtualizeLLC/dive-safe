import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';

const meta = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
};

export default meta;

type Story = {
  args?: any;
  render?: (args?: any) => React.ReactNode;
};

export const Default: Story = {
  args: {
    children: 'Hello Storybook',
  },
  render: (args: any) => (
    <View style={{ padding: 16 }}>
      <Text {...args} />
    </View>
  ),
};
