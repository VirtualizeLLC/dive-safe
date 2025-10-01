import Slider from '@react-native-community/slider'
import { Asset } from 'expo-asset'
import type React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
	ActivityIndicator,
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import Pdf from 'react-native-pdf'

type Props = {
	visible: boolean
	onClose: () => void
	title?: string
	assetId?: number
	uri?: string
}

const PdfModal: React.FC<Props> = ({
	visible,
	onClose,
	title,
	assetId,
	uri,
}) => {
	const [resolvedUri, setResolvedUri] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(0)
	const [gotoInput, setGotoInput] = useState('')
	const [scale, setScale] = useState(1)
	const [minScale] = useState(1)
	const [maxScale] = useState(3)
	const pdfRef = useRef<{ setPage?: (p: number) => void } | null>(null)

	useEffect(() => {
		let cancelled = false
		const resolve = async () => {
			setError(null)
			if (!visible) {
				setResolvedUri(null)
				return
			}
			if (assetId) {
				try {
					setLoading(true)
					const asset = Asset.fromModule(assetId)
					if (!asset.downloaded) await asset.downloadAsync()
					const link = asset.localUri ?? asset.uri
					if (!cancelled) setResolvedUri(link ?? null)
				} catch {
					if (!cancelled) setError('Failed to load PDF asset')
				} finally {
					if (!cancelled) setLoading(false)
				}
			} else if (uri) {
				setResolvedUri(uri)
			} else {
				setResolvedUri(null)
			}
		}
		void resolve()
		return () => {
			cancelled = true
		}
	}, [visible, assetId, uri])

	const source = useMemo(
		() => (resolvedUri ? { uri: resolvedUri } : undefined),
		[resolvedUri],
	)

	const goToPage = (p: number) => {
		if (!totalPages) return
		const clamped = Math.min(totalPages, Math.max(1, Math.floor(p)))
		setPage(clamped)
		pdfRef.current?.setPage?.(clamped)
	}
	const incPage = (delta: number) => goToPage(page + delta)
	const changeScale = (delta: number) => {
		const next = Math.max(
			minScale,
			Math.min(maxScale, Number((scale + delta).toFixed(2))),
		)
		setScale(next)
	}
	const resetScale = () => setScale(1)

	return (
		<Modal visible={visible} animationType="slide" onRequestClose={onClose}>
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.title} numberOfLines={1}>
						{title ?? 'Document'}
					</Text>
					<Text style={styles.pageBadge}>
						{totalPages > 0 ? `Page ${page} / ${totalPages}` : ''}
					</Text>
					<TouchableOpacity onPress={onClose} style={styles.closeBtn}>
						<Text style={styles.closeText}>Close</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.body}>
					{loading && (
						<View style={styles.center}>
							<ActivityIndicator />
						</View>
					)}
					{!!error && (
						<View style={styles.center}>
							<Text style={styles.error}>{error}</Text>
						</View>
					)}
					{!loading && !error && source && (
						<>
							<Pdf
								ref={(r) => {
									pdfRef.current = r
								}}
								style={StyleSheet.absoluteFill}
								source={source}
								trustAllCerts={false}
								enablePaging={false}
								onLoadComplete={(n) => {
									setTotalPages(n)
									setPage(1)
								}}
								onPageChanged={(p) => setPage(p)}
								onScaleChanged={(s) => setScale(s)}
								scale={scale}
								minScale={minScale}
								maxScale={maxScale}
								onError={() => setError('Failed to render PDF')}
							/>
							{totalPages > 0 && (
								<View style={styles.footer}>
									<View style={styles.footerRow}>
										<TouchableOpacity
											style={styles.btnSm}
											onPress={() => incPage(-1)}
										>
											<Text style={styles.btnSmText}>Prev</Text>
										</TouchableOpacity>
										<Slider
											style={styles.slider}
											minimumValue={1}
											maximumValue={Math.max(1, totalPages)}
											value={page}
											step={1}
											minimumTrackTintColor="#0a84ff"
											maximumTrackTintColor="#555"
											thumbTintColor="#0a84ff"
											onValueChange={(v) => goToPage(v)}
										/>
										<TouchableOpacity
											style={styles.btnSm}
											onPress={() => incPage(1)}
										>
											<Text style={styles.btnSmText}>Next</Text>
										</TouchableOpacity>
									</View>
									<View style={styles.footerRow}>
										<View style={styles.gotoGroup}>
											<Text style={styles.gotoLabel}>Go to</Text>
											<TextInput
												style={styles.gotoInput}
												keyboardType="number-pad"
												value={gotoInput}
												onChangeText={setGotoInput}
												placeholder={`${page}`}
												placeholderTextColor="#aaa"
												onSubmitEditing={() => {
													const num = Number(gotoInput)
													if (!Number.isNaN(num)) goToPage(num)
													setGotoInput('')
												}}
											/>
											<TouchableOpacity
												style={styles.btnSm}
												onPress={() => {
													const num = Number(gotoInput)
													if (!Number.isNaN(num)) goToPage(num)
													setGotoInput('')
												}}
											>
												<Text style={styles.btnSmText}>Go</Text>
											</TouchableOpacity>
										</View>
										<View style={styles.zoomGroup}>
											<TouchableOpacity
												style={styles.btnSm}
												onPress={() => changeScale(-0.25)}
											>
												<Text style={styles.btnSmText}>-</Text>
											</TouchableOpacity>
											<Text
												style={styles.zoomLabel}
											>{`${(scale * 100).toFixed(0)}%`}</Text>
											<TouchableOpacity
												style={styles.btnSm}
												onPress={() => changeScale(0.25)}
											>
												<Text style={styles.btnSmText}>+</Text>
											</TouchableOpacity>
											<TouchableOpacity
												style={styles.btnSm}
												onPress={resetScale}
											>
												<Text style={styles.btnSmText}>Reset</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>
							)}
						</>
					)}
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#000' },
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 12,
		paddingVertical: 10,
		backgroundColor: '#111',
	},
	title: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
		flex: 1,
		marginRight: 8,
	},
	pageBadge: { color: '#ddd', fontSize: 12, marginRight: 12 },
	closeBtn: {
		paddingHorizontal: 10,
		paddingVertical: 6,
		backgroundColor: '#333',
		borderRadius: 6,
	},
	closeText: { color: '#fff', fontWeight: '600' },
	body: { flex: 1 },
	center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	error: { color: 'white' },
	footer: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		padding: 8,
		backgroundColor: 'rgba(0,0,0,0.66)',
		gap: 6,
	},
	footerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 8,
	},
	slider: { flex: 1, marginHorizontal: 8 },
	btnSm: {
		backgroundColor: '#333',
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 6,
	},
	btnSmText: { color: '#fff', fontWeight: '600' },
	zoomGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
	zoomLabel: { color: '#fff', width: 48, textAlign: 'center' },
	gotoGroup: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
	gotoLabel: { color: '#fff' },
	gotoInput: {
		backgroundColor: '#222',
		color: '#fff',
		paddingHorizontal: 8,
		paddingVertical: 6,
		borderRadius: 6,
		minWidth: 64,
	},
	// (deduplicated style keys above)
})

export default PdfModal
