import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  // Glob pattern for stories located in the repository `storybook` folder
  stories: ['../components/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
  ],
};

export default main;