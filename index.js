// IMPORTANT: Reanimated must be imported at the very top, before any other imports
// to properly install its JSI and initialize its logger configuration.
import 'react-native-reanimated'

import { registerRootComponent } from 'expo'
import Entry from './app/entry'

// registerRootComponent ensures the environment is set up appropriately
// Whether in Expo Go or a native build, this registers the provided component
registerRootComponent(Entry)
