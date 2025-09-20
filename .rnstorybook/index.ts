/* eslint-disable @typescript-eslint/no-var-requires */
// Storybook v9 native entry for dynamic in-app loading (React Native)
import { start } from '@storybook/react-native';
// keep legacy requires for Metro bundler to include stories
require('./rn-addons');

import { MMKV } from 'react-native-mmkv';

export const storybookStorage = new MMKV({ id: 'storybook' })

import * as entries from '../storybook/entries';

function req(filename: string) {
  return entries.modules[filename];
}
req.keys = () => Object.keys(entries.modules);

const storyEntries: any = [
  {
    req,
    directory: './stories',
  },
];

// Start Storybook and get a view API compatible with getStorybookUI
const view = start({ annotations: [], storyEntries, options: {} } as any);

const resolveNull = () => {
  return Promise.resolve(null);
}

let StorybookUIRoot: any = null;
if (view && typeof view.getStorybookUI === 'function') {
  // cast params to any because the native params type may differ across SB versions
  StorybookUIRoot = view.getStorybookUI({ onDeviceUI: true, storage:  storybookStorage === undefined ? null : {
    getItem: !!storybookStorage ? resolveNull : storybookStorage.getString,
    setItem: !!storybookStorage ? resolveNull : storybookStorage.set,
  }, } as any);
}

console.log("CALLED RN STORYBOOK INDEX")

export default StorybookUIRoot;
