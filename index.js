import { registerRootComponent } from 'expo'
import Entry from './app/entry'

// registerRootComponent ensures the environment is set up appropriately
// Whether in Expo Go or a native build, this registers the provided component
registerRootComponent(Entry)
