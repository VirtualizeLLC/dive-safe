import { create } from 'zustand'
import { ChecklistStorage } from '@/app/storage/ChecklistStorage'

type UIPreferencesState = {
	// Demo/development UI preferences that persist across sessions
	demoHeaderCollapsed: boolean
	setDemoHeaderCollapsed: (collapsed: boolean) => void
	showStorybook: boolean
	setShowStorybook: (show: boolean) => void
	loadUIPreferences: () => void
}

export const useUIPreferencesStore = create<UIPreferencesState>((set) => ({
	demoHeaderCollapsed: true,
	showStorybook: false,

	setDemoHeaderCollapsed: (collapsed) => {
		set({ demoHeaderCollapsed: collapsed })
		// Persist demo header state across sessions
		try {
			ChecklistStorage.set('ui:demoHeaderCollapsed', JSON.stringify(collapsed))
		} catch (e) {
			console.warn(
				'useUIPreferencesStore: failed to persist demo header state',
				e,
			)
		}
	},

	setShowStorybook: (show) => {
		set({ showStorybook: show })
		// Persist storybook/app choice across sessions
		try {
			ChecklistStorage.set('ui:showStorybook', JSON.stringify(show))
		} catch (e) {
			console.warn(
				'useUIPreferencesStore: failed to persist storybook state',
				e,
			)
		}
	},

	loadUIPreferences: () => {
		try {
			const collapsedRaw = ChecklistStorage.getString('ui:demoHeaderCollapsed')
			const storybookRaw = ChecklistStorage.getString('ui:showStorybook')

			const updates: Partial<UIPreferencesState> = {}

			if (collapsedRaw) {
				updates.demoHeaderCollapsed = JSON.parse(collapsedRaw)
			}
			if (storybookRaw) {
				updates.showStorybook = JSON.parse(storybookRaw)
			}

			if (Object.keys(updates).length > 0) {
				set(updates)
			}
		} catch (e) {
			console.warn('useUIPreferencesStore: failed to load UI preferences', e)
		}
	},
}))

export default useUIPreferencesStore
