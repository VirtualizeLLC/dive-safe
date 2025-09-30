import { create } from 'zustand'
import { ChecklistStorage } from '@/app/storage/ChecklistStorage'

type ChecklistItemState = {
	checked: boolean
	notes?: string
}

type ChoptimaState = {
	// current in-memory items for the active namespace
	items: Record<string, ChecklistItemState>
	// current namespace (e.g., rebreather model or id)
	namespace?: string
	setNamespace: (ns?: string) => void
	loadNamespace: (ns?: string) => void
	setItem: (id: string, patch: Partial<ChecklistItemState>) => void
	removeItem: (id: string) => void
	clear: () => void
	saveSnapshot: (name?: string) => void
	listNamespaces: () => string[]
	listSnapshots: () => string[]
	loadSnapshot: (key: string) => void
}

const STORAGE_PREFIX = 'checklist'

function storageKeyFor(ns?: string) {
	return ns ? `${STORAGE_PREFIX}:${ns}` : `${STORAGE_PREFIX}:default`
}

// debounce helpers: batch writes to MMKV to avoid excessive syncs
const PERSIST_DEBOUNCE_MS = 1000
const pendingTimers: Record<string, number> = {}
const pendingPayloads: Record<string, string> = {}

function persistNow(
	ns: string | undefined,
	payload: Record<string, ChecklistItemState>,
) {
	const key = storageKeyFor(ns)
	try {
		ChecklistStorage.set(key, JSON.stringify(payload))
	} catch (e) {
		console.warn('useChoptimaStore: failed to persist to storage', key, e)
	}
}

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

export const useChoptimaStore = create<ChoptimaState>((set, get) => ({
	items: {},
	namespace: undefined,

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
		const snapshotName =
			name || `${STORAGE_PREFIX}:snapshot:${new Date().toISOString()}`
		try {
			const data = JSON.stringify(get().items)
			ChecklistStorage.set(snapshotName, data)
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
		} catch (e) {
			console.warn('useChoptimaStore: failed to load snapshot', key, e)
		}
	},
}))

export default useChoptimaStore
