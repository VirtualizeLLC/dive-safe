import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import ChoptimaStep from './ChoptimaStep'

type AssemblyStep = {
  id: string
  title: string
  content?: string
  images?: string[]
}

const sampleSteps: AssemblyStep[] = [
  {
    id: '1',
    title: 'Unpack the Choptima CCR',
    content: '# Unpacking\n\n- Carefully remove the unit from the case.\n- Inspect for visible damage.\n\n## What\'s in the box\n- Rebreather unit\n- Mouthpiece\n- Oxygen cylinder bracket\n\n![](https://placekitten.com/800/400)\n',
  },
  {
    id: '2',
    title: 'Attach the Oxygen Cylinder',
    content: '## Attach the cylinder\n\n1. Ensure the cylinder valve is closed.\n2. Slide the cylinder into the bracket until it locks.\n3. Tighten the securing strap.\n\n![](https://placehold.co/800x400?text=Cylinder)\n',
  },
  {
    id: '3',
    title: 'Connect the Scrubber Canister',
    content: '### Scrubber\n\n- Open the scrubber bay.\n- Insert the canister with the arrow pointing inward.\n- Close the bay and verify the O-ring seal.\n',
  },
]

export const ChoptimaAssembly: React.FC<{ steps?: AssemblyStep[] }> = ({ steps = sampleSteps }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      <Text style={styles.header}>Choptima CCR Assembly Guide</Text>
      <View style={styles.steps}>
        {steps.map((s) => (
          <ChoptimaStep key={s.id} title={s.title} content={s.content} images={s.images} initiallyCollapsed={true} />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f5f9' },
  inner: { padding: 16, paddingBottom: 48 },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  steps: { marginTop: 8 },
})

export default ChoptimaAssembly
