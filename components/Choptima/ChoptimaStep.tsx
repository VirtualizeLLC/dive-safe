import React, { useMemo, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, {
    Easing as ReEasing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'

type Substep = {
  id: string
  step?: string
  title: string
  content?: string
  images?: string[]
}

type Props = {
  title: string
  step?: string
  content?: string // markdown-like
  images?: string[]
  substeps?: Substep[]
  initiallyCollapsed?: boolean
  expanded?: boolean // external control (e.g., expand/collapse all)
  leftAccessory?: React.ReactNode
}

const Collapsible: React.FC<{ collapsed: boolean; children: React.ReactNode }> = ({ collapsed, children }) => {
  const [measuredHeight, setMeasuredHeight] = React.useState(0)
  const animatedHeight = useSharedValue(collapsed ? 0 : measuredHeight)

  React.useEffect(() => {
    // Animate to 0 when collapsed, or to the measured content height when expanded
    const toValue = collapsed ? 0 : measuredHeight
    animatedHeight.value = withTiming(toValue, { duration: 220, easing: ReEasing.out(ReEasing.cubic) })
  }, [collapsed, measuredHeight, animatedHeight])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value,
      overflow: 'hidden',
      opacity: animatedHeight.value > 0 ? 1 : 0,
    }
  })

  return (
    <>
      {/* Visible animated container with constrained height */}
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>

      {/* Offscreen measurement view: measures natural height of children without affecting layout */}
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
    // heading
    if (l.startsWith('### ')) return <Text key={i} style={styles.h3}>{l.replace('### ', '')}</Text>
    if (l.startsWith('## ')) return <Text key={i} style={styles.h2}>{l.replace('## ', '')}</Text>
    if (l.startsWith('# ')) return <Text key={i} style={styles.h1}>{l.replace('# ', '')}</Text>

    // image: ![alt](url)
    const imgMatch = l.match(/!\[(.*?)\]\((.*?)\)/)
    if (imgMatch) {
      const uri = imgMatch[2]
      return (
        <Image
          key={i}
          source={{ uri }}
          style={styles.inlineImage}
          resizeMode="contain"
        />
      )
    }

    // bullet
    if (l.startsWith('- ')) return <Text key={i} style={styles.bullet}>{'• '}{l.replace('- ', '')}</Text>

    // plain
    return <Text key={i} style={styles.p}>{l}</Text>
  })
}

export const ChoptimaStep: React.FC<Props> = ({ step, title, content, images = [], substeps = [], initiallyCollapsed = true, expanded, leftAccessory }) => {
  const [collapsed, setCollapsed] = useState(initiallyCollapsed)

  // If parent provides `expanded`, sync collapsed state to that control
  React.useEffect(() => {
    if (expanded === undefined) return
    setCollapsed(!expanded)
  }, [expanded])

  const parsedContent = useMemo(() => renderMarkdown(content), [content])

  const isChild = useMemo(() => Number.isNaN(Number(step)), [step])

  return (
    <View>
    <View style={styles.stepContainer}>
      <View style={styles.header}>
        {leftAccessory ? <View style={styles.leftAccessory}>{leftAccessory}</View> : null}
        <TouchableOpacity
          onPress={() => setCollapsed((s) => !s)}
          style={styles.headerContent}
          activeOpacity={0.7}
        >
          <Text style={styles.title}>{step ? `${step}. ${title}` : title}</Text>
          <Text style={styles.chev}>{collapsed ? '+' : '-'}</Text>
        </TouchableOpacity>
      </View>

      <Collapsible collapsed={collapsed}>
        <View style={styles.content}>
          {parsedContent}

          {images.map((uri, idx) => (
            <Image key={idx} source={{ uri }} style={styles.image} resizeMode="contain" />
          ))}

          {/* Render substeps if present */}
        </View>
      </Collapsible>
    </View>
    {substeps.length > 0 && substeps.map((ss) => (
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
  substeps: { marginTop: 8, paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: '#eef3ff', backgroundColor: '#fbfdff', paddingVertical: 6 },
  p: { fontSize: 14, color: '#222', marginBottom: 6 },
  bullet: { fontSize: 14, color: '#222', marginBottom: 6, paddingLeft: 4 },
  h1: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  h2: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  h3: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  inlineImage: { width: '100%', height: 180, marginVertical: 8, borderRadius: 6 },
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
