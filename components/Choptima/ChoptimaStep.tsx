import React, { useEffect, useMemo, useState } from 'react'
import {
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { Checkbox as PaperCheckbox } from 'react-native-paper'
import Animated, {
	Easing as ReEasing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated'

import CheckboxInternalState from './CheckboxInternalState'

type Substep = {
	id: string
	step?: string
	title: string
	content?: string
	images?: string[]
	inputs?: { id: string; label: string; placeholder?: string }[]
}

type Props = {
	title: string
	step?: string
	content?: string
	images?: string[]
	substeps?: Substep[]
	checked?: boolean
	onCheckedChange?: (next: boolean) => void
	onInputChange?: (inputId: string, value: string) => void
	values?: Record<string, string>
	initiallyCollapsed?: boolean
	expanded?: boolean
	leftAccessory?: React.ReactNode
}

const Collapsible: React.FC<{
	collapsed: boolean
	children: React.ReactNode
}> = ({ collapsed, children }) => {
	const [measuredHeight, setMeasuredHeight] = React.useState(0)
	const animatedHeight = useSharedValue(collapsed ? 0 : measuredHeight)

	React.useEffect(() => {
		const toValue = collapsed ? 0 : measuredHeight
		animatedHeight.value = withTiming(toValue, {
			duration: 220,
			easing: ReEasing.out(ReEasing.cubic),
		})
	}, [collapsed, measuredHeight, animatedHeight])

	const animatedStyle = useAnimatedStyle(() => ({
		height: animatedHeight.value,
		overflow: 'hidden',
		opacity: animatedHeight.value > 0 ? 1 : 0,
	}))

	return (
		<>
			<Animated.View style={animatedStyle}>{children}</Animated.View>
			<View
				style={styles._measure}
				pointerEvents="none"
				onLayout={(e) => {
					const h = Math.round(e.nativeEvent.layout.height)
					if (h > 0 && h !== measuredHeight) setMeasuredHeight(h)
				}}
			>
				{children}
			</View>
		</>
	)
}

function renderMarkdown(content?: string) {
	if (!content) return null
	const lines = content.split(/\r?\n/)
	return lines.map((l, i) => {
		const key = `${i}-${l}`
		if (l.startsWith('### '))
			return (
				<Text key={key} style={styles.h3}>
					{l.replace('### ', '')}
				</Text>
			)
		if (l.startsWith('## '))
			return (
				<Text key={key} style={styles.h2}>
					{l.replace('## ', '')}
				</Text>
			)
		if (l.startsWith('# '))
			return (
				<Text key={key} style={styles.h1}>
					{l.replace('# ', '')}
				</Text>
			)

		const imgMatch = l.match(/!\[(.*?)\]\((.*?)\)/)
		if (imgMatch) {
			const uri = imgMatch[2]
			return (
				<Image
					key={`${i}-${uri}`}
					source={{ uri }}
					style={styles.inlineImage}
					resizeMode="contain"
				/>
			)
		}

		if (l.startsWith('- '))
			return (
				<Text key={key} style={styles.bullet}>
					{'• '}
					{l.replace('- ', '')}
				</Text>
			)

		return (
			<Text key={key} style={styles.p}>
				{l}
			</Text>
		)
	})
}

export const ChoptimaStep: React.FC<Props> = ({
	step,
	title,
	content,
	images = [],
	substeps = [],
	initiallyCollapsed = true,
	expanded,
	leftAccessory,
	onInputChange,
	values,
	checked: checkedProp,
	onCheckedChange,
}) => {
	const [collapsed, setCollapsed] = useState(initiallyCollapsed)
	const [internalChecked, setInternalChecked] = useState<boolean>(!!checkedProp)
	const checked = checkedProp === undefined ? internalChecked : checkedProp
	const [hasValidationError, setHasValidationError] = useState(false)

	useEffect(() => {
		if (expanded === undefined) return
		setCollapsed(!expanded)
	}, [expanded])

	const parsedContent = useMemo(() => renderMarkdown(content), [content])

	const requiredInputIds = useMemo(() => {
		const ids: string[] = []
		for (const ss of substeps) {
			if (ss.inputs) for (const inp of ss.inputs) ids.push(inp.id)
		}
		return ids
	}, [substeps])

	const validator = React.useCallback(() => {
		if (requiredInputIds.length === 0) return null
		const missing = requiredInputIds.filter((id) => {
			const v = values?.[id]
			return v === undefined || v === null || String(v).trim() === ''
		})
		if (missing.length > 0) return 'Please enter required data'
		return null
	}, [requiredInputIds, values])

	useEffect(() => {
		if (!hasValidationError) return
		if (validator() === null) setHasValidationError(false)
	}, [hasValidationError, validator])

	return (
		<View>
			<View
				style={[
					styles.stepContainer,
					hasValidationError && styles.stepContainerError,
				]}
			>
				<View style={styles.header}>
					{leftAccessory ? (
						<View style={styles.leftAccessory}>{leftAccessory}</View>
					) : (
						<View style={styles.leftAccessory}>
							<PaperCheckbox
								status={checked ? 'checked' : 'unchecked'}
								onPress={() => {
									const err = validator()
									if (err) {
										setHasValidationError(true)
										return
									}
									const next = !checked
									if (onCheckedChange) onCheckedChange(next)
									else setInternalChecked(next)
								}}
								color="#0a84ff"
							/>
						</View>
					)}
					<TouchableOpacity
						onPress={() => setCollapsed((s) => !s)}
						style={styles.headerContent}
						activeOpacity={0.7}
					>
						<Text style={styles.title}>
							{step ? `${step}. ${title}` : title}
						</Text>
						<Text style={styles.chev}>{collapsed ? '+' : '-'}</Text>
					</TouchableOpacity>
				</View>

				<Collapsible collapsed={collapsed}>
					<View style={styles.content}>
						{parsedContent}

						{images.map((uri) => (
							<Image
								key={uri}
								source={{ uri }}
								style={styles.image}
								resizeMode="contain"
							/>
						))}

						{substeps.length > 0 && (
							<View style={styles.substeps}>
								{substeps.map((ss) => (
									<View key={ss.id} style={{ marginBottom: 8 }}>
										<Text style={{ fontWeight: '600' }}>{ss.title}</Text>
										{ss.content ? (
											<Text style={styles.p}>{ss.content}</Text>
										) : null}
										{ss.inputs?.map((inp) => (
											<View key={inp.id} style={{ marginTop: 6 }}>
												<Text style={{ fontSize: 13, color: '#444' }}>
													{inp.label}
												</Text>
												<TextInput
													placeholder={inp.placeholder || ''}
													style={{
														borderWidth: 1,
														borderColor: '#ddd',
														padding: 8,
														borderRadius: 6,
														marginTop: 6,
													}}
													onChangeText={(t: string) =>
														onInputChange?.(inp.id, t)
													}
													value={values?.[inp.id] || ''}
													accessibilityLabel={`${title}-${inp.id}`}
												/>
											</View>
										))}
									</View>
								))}
							</View>
						)}
					</View>
				</Collapsible>
			</View>

			{substeps.length > 0 &&
				substeps.map((ss) => (
					<ChoptimaStep
						key={ss.id}
						step={ss.step}
						title={ss.title}
						content={ss.content}
						images={ss.images}
						initiallyCollapsed={true}
					/>
				))}
		</View>
	)
}

const styles = StyleSheet.create({
	stepContainer: {
		marginVertical: 8,
		borderRadius: 8,
		backgroundColor: '#fff',
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: '#e6e6e6',
	},
	stepContainerError: {
		borderColor: '#b00020',
		backgroundColor: '#fff6f6',
	},
	header: {
		padding: 12,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f7f7f7',
	},
	headerContent: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	leftAccessory: {
		marginRight: 8,
		zIndex: 2,
	},
	title: { fontSize: 16, fontWeight: '600' },
	chev: { fontSize: 18, fontWeight: '600', color: '#333' },
	content: { padding: 12, backgroundColor: '#fff' },
	substeps: {
		marginTop: 8,
		paddingLeft: 12,
		borderLeftWidth: 2,
		borderLeftColor: '#eef3ff',
		backgroundColor: '#fbfdff',
		paddingVertical: 6,
	},
	p: { fontSize: 14, color: '#222', marginBottom: 6 },
	bullet: { fontSize: 14, color: '#222', marginBottom: 6, paddingLeft: 4 },
	h1: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
	h2: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
	h3: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
	inlineImage: {
		width: '100%',
		height: 180,
		marginVertical: 8,
		borderRadius: 6,
	},
	image: { width: '100%', height: 220, marginTop: 8, borderRadius: 6 },
	_measure: {
		position: 'absolute',
		opacity: 0,
		left: -9999,
		top: -9999,
		width: '100%',
		zIndex: -9999,
	},
})

export default ChoptimaStep
