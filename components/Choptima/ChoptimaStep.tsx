import React, { useMemo, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, {
    Easing as ReEasing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'

type Props = {
  title: string
  content?: string // markdown-like
  images?: string[]
  initiallyCollapsed?: boolean
}

const Collapsible: React.FC<{ collapsed: boolean; children: React.ReactNode }> = ({ collapsed, children }) => {
  const progress = useSharedValue(collapsed ? 0 : 1)

  React.useEffect(() => {
    progress.value = withTiming(collapsed ? 0 : 1, { duration: 220, easing: ReEasing.out(ReEasing.cubic) })
  }, [collapsed, progress])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [{ scaleY: progress.value }],
      // keep origin top by setting transform origin equivalent via transform
    }
  })

  return <Animated.View style={animatedStyle}>{children}</Animated.View>
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

export const ChoptimaStep: React.FC<Props> = ({ title, content, images = [], initiallyCollapsed = true }) => {
  const [collapsed, setCollapsed] = useState(initiallyCollapsed)

  const parsedContent = useMemo(() => renderMarkdown(content), [content])

  return (
    <View style={styles.stepContainer}>
      <TouchableOpacity
        onPress={() => setCollapsed((s) => !s)}
        style={styles.header}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.chev}>{collapsed ? '+' : '-'}</Text>
      </TouchableOpacity>

      <Collapsible collapsed={collapsed}>
        <View style={styles.content}>
          {parsedContent}

          {images.map((uri, idx) => (
            <Image key={idx} source={{ uri }} style={styles.image} resizeMode="contain" />
          ))}
        </View>
      </Collapsible>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  title: { fontSize: 16, fontWeight: '600' },
  chev: { fontSize: 18, fontWeight: '600', color: '#333' },
  content: { padding: 12, backgroundColor: '#fff' },
  p: { fontSize: 14, color: '#222', marginBottom: 6 },
  bullet: { fontSize: 14, color: '#222', marginBottom: 6, paddingLeft: 4 },
  h1: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  h2: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  h3: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  inlineImage: { width: '100%', height: 180, marginVertical: 8, borderRadius: 6 },
  image: { width: '100%', height: 220, marginTop: 8, borderRadius: 6 },
})

export default ChoptimaStep
