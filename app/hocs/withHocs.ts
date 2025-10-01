import type React from 'react'

export const withHocs = (
	...hocs: Array<(c: React.ComponentType) => React.ComponentType>
) => {
	return (BaseComponent: React.ComponentType) => {
		if (!hocs || hocs.length === 0) return BaseComponent
		return hocs.reduce<React.ComponentType>(
			(Comp, hoc) => hoc(Comp),
			BaseComponent,
		)
	}
}
