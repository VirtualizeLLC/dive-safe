import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { ChecklistStorage } from '@/app/storage/ChecklistStorage'

type ChecklistItemState = {
	checked: boolean
	notes?: string
	// arbitrary named values for inputs/subtasks
	values?: Record<string, string>
}

type ChoptimaState = {
	// current in-memory items for the active namespace
	items: Record<string, ChecklistItemState>
	// current namespace (e.g., rebreather model or id)
	namespace?: string
	setNamespace: (ns?: string) => void
	loadNamespace: (ns?: string) => void
	setItem: (id: string, patch: Partial<ChecklistItemState>) => void
	setField: (id: string, fieldId: string, value: string) => void
	removeItem: (id: string) => void
	clear: () => void
	saveSnapshot: (name?: string) => void
	listNamespaces: () => string[]
	listSnapshots: () => string[]
	loadSnapshot: (key: string) => void
	// pinned UI actions persisted to MMKV
	pinnedActions: string[]
	setPinnedActions: (ids: string[]) => void
	togglePinnedAction: (actionId: string) => void
	loadPinnedActions: () => void
	// currently loaded snapshot name (safe name used in storage)
	loadedSnapshotName?: string
	setLoadedSnapshotName: (name?: string) => void
}

const STORAGE_PREFIX = 'checklist'

function storageKeyFor(ns?: string) {
	return ns ? `${STORAGE_PREFIX}:${ns}` : `${STORAGE_PREFIX}:default`
}

// debounce helpers: batch writes to MMKV to avoid excessive syncs
const PERSIST_DEBOUNCE_MS = 1000
const pendingTimers: Record<string, number> = {}
const pendingPayloads: Record<string, string> = {}

function schedulePersist(
	ns: string | undefined,
	payload: Record<string, ChecklistItemState>,
) {
	const key = storageKeyFor(ns)
	// clear existing timer
	const existing = pendingTimers[key]
	if (existing) {
		clearTimeout(existing)
	}
	// store latest payload
	pendingPayloads[key] = JSON.stringify(payload)
	// schedule a new write
	const t = setTimeout(() => {
		try {
			const raw = pendingPayloads[key]
			if (raw != null) {
				ChecklistStorage.set(key, raw)
				delete pendingPayloads[key]
			}
		} catch (e) {
			console.warn(
				'useChoptimaStore: failed persisting debounced payload',
				key,
				e,
			)
		}
		delete pendingTimers[key]
	}, PERSIST_DEBOUNCE_MS) as unknown as number
	pendingTimers[key] = t
}

function listAllKeys(): string[] {
	try {
		// MMKV exposes getAllKeys()
		const keysRaw = (
			ChecklistStorage as unknown as { getAllKeys?: () => string[] }
		).getAllKeys?.()
		const keys: string[] = keysRaw || []
		return keys
	} catch (e) {
		console.warn('useChoptimaStore: failed to list storage keys', e)
		return []
	}
}

function pinnedStorageKey(ns?: string) {
	return ns
		? `${STORAGE_PREFIX}:pinned:${ns}`
		: `${STORAGE_PREFIX}:pinned:default`
}

export const useChoptimaStore = create<ChoptimaState>((set, get) => ({
	items: {},
	namespace: undefined,
	pinnedActions: [],
	loadedSnapshotName: undefined,

	setNamespace: (ns) => {
		set({ namespace: ns })
		// immediately try to load for this namespace
		if (ns) {
			const raw = ChecklistStorage.getString(storageKeyFor(ns))
			if (raw) {
				try {
					const parsed = JSON.parse(raw)
					set({ items: parsed })
				} catch (e) {
					// ignore parse errors
					console.warn(
						'useChoptimaStore: failed to parse stored checklist for',
						ns,
						e,
					)
					set({ items: {} })
				}
			} else {
				set({ items: {} })
			}
		} else {
			set({ items: {} })
		}

		// when namespace changes, ensure pinned actions for that namespace are loaded
		try {
			const loader = get().loadPinnedActions
			if (typeof loader === 'function') {
				loader()
			}
		} catch {
			// ignore
		}
	},

	// pinned actions persistence
	setPinnedActions: (ids) => {
		set({ pinnedActions: ids })
		try {
			const key = pinnedStorageKey(get().namespace)
			const raw = JSON.stringify(ids)
			ChecklistStorage.set(key, raw)
		} catch (e) {
			console.warn('useChoptimaStore: failed to persist pinned actions', e)
		}
	},

	togglePinnedAction: (actionId) => {
		set((state) => {
			const prev = state.pinnedActions || []
			const next = prev.includes(actionId)
				? prev.filter((p) => p !== actionId)
				: [...prev, actionId]
			// persist with logging
			try {
				const key = pinnedStorageKey(state.namespace)
				const raw = JSON.stringify(next)
				ChecklistStorage.set(key, raw)
			} catch (e) {
				console.warn(
					'useChoptimaStore: failed to persist toggled pinned action',
					e,
				)
			}
			return { pinnedActions: next }
		})
	},

	loadPinnedActions: () => {
		try {
			const key = pinnedStorageKey(get().namespace)
			const raw = ChecklistStorage.getString(key)
			if (raw) {
				const parsed = JSON.parse(raw)
				if (Array.isArray(parsed)) {
					set({ pinnedActions: parsed })
				}
			}
		} catch (e) {
			console.warn('useChoptimaStore: failed to load pinned actions', e)
		}
	},

	setLoadedSnapshotName: (name) => {
		set({ loadedSnapshotName: name })
	},

	loadNamespace: (ns) => {
		// alias for setNamespace
		get().setNamespace(ns)
	},

	setItem: (id, patch) => {
		set((state) => {
			const next = {
				...state.items,
				[id]: { ...(state.items[id] || { checked: false }), ...patch },
			}
			schedulePersist(state.namespace, next)
			return { items: next }
		})
	},

	setField: (id, fieldId, value) => {
		set((state) => {
			const current = state.items[id] || { checked: false, values: {} }
			const nextItem = {
				...current,
				values: { ...(current.values || {}), [fieldId]: value },
			}
			const next = { ...state.items, [id]: nextItem }
			schedulePersist(state.namespace, next)
			return { items: next }
		})
	},

	removeItem: (id) => {
		set((state) => {
			const next = { ...state.items }
			delete next[id]
			schedulePersist(state.namespace, next)
			return { items: next }
		})
	},

	clear: () => {
		set((state) => {
			if (state.namespace) {
				try {
					ChecklistStorage.delete(storageKeyFor(state.namespace))
				} catch (e) {
					console.warn(
						'useChoptimaStore: failed to clear storage for namespace',
						state.namespace,
						e,
					)
				}
			}
			schedulePersist(state.namespace, {})
			return { items: {} }
		})
	},

	saveSnapshot: (name) => {
		// Always write snapshots under the canonical prefix so explorers and lists can find them.
		try {
			const timestamp = new Date().toISOString()
			const safeName = name
				? String(name).trim().replace(/\s+/g, '_')
				: timestamp
			const snapshotKey = `${STORAGE_PREFIX}:snapshot:${safeName}`
			const data = JSON.stringify(get().items)
			ChecklistStorage.set(snapshotKey, data)
			// record the loaded snapshot name when saving
			set({ loadedSnapshotName: safeName })
		} catch (e) {
			console.warn('useChoptimaStore: failed to save snapshot', e)
		}
	},
	listNamespaces: () => {
		const keys = listAllKeys()
		// namespaces are keys that start with STORAGE_PREFIX: and are not snapshots
		const ns: Set<string> = new Set()
		keys.forEach((k) => {
			if (!k) return
			if (!k.startsWith(`${STORAGE_PREFIX}:`)) return
			// snapshot keys include ":snapshot:"
			if (k.includes(':snapshot:')) return
			const parts = k.split(':')
			// STORAGE_PREFIX:namespace or STORAGE_PREFIX:default
			if (parts.length >= 2) {
				ns.add(parts.slice(1).join(':'))
			}
		})
		return Array.from(ns)
	},

	listSnapshots: () => {
		const keys = listAllKeys()
		console.log('ALL KEYS', keys)
		return keys.filter((k) => k?.startsWith(`${STORAGE_PREFIX}:snapshot:`))
	},

	loadSnapshot: (key) => {
		try {
			const raw = ChecklistStorage.getString(key)
			if (!raw) return
			const parsed = JSON.parse(raw)
			set({ items: parsed })
			// try to extract a human key portion from the storage key
			try {
				const marker = `${STORAGE_PREFIX}:snapshot:`
				if (key?.startsWith(marker)) {
					const name = key.slice(marker.length)
					set({ loadedSnapshotName: name })
				}
			} catch (_e) {
				// ignore
			}
		} catch (e) {
			console.warn('useChoptimaStore: failed to load snapshot', key, e)
		}
	},
}))

// todo migrate to named export
export default useChoptimaStore
