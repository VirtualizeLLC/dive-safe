import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ChoptimaAssembly from './ChoptimaAssembly';

const TabButton: React.FC<{ label: string; active: boolean; onPress: () => void }> = ({ label, active, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
    <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
  </TouchableOpacity>
)

const ChecklistPlaceholder: React.FC = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Checklist view coming soon — add step checkboxes here.</Text>
  </View>
)

const DiagramsPlaceholder: React.FC = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Diagrams and annotated images go here.</Text>
  </View>
)

export const ChoptimaScreen: React.FC = () => {
  const [tab, setTab] = useState<'assembly' | 'checklist' | 'diagrams'>('assembly')

  return (
    <View style={styles.container}>
      <View style={styles.tabsRow}>
        <TabButton label="Assembly" active={tab === 'assembly'} onPress={() => setTab('assembly')} />
        <TabButton label="Checklist" active={tab === 'checklist'} onPress={() => setTab('checklist')} />
        <TabButton label="Diagrams" active={tab === 'diagrams'} onPress={() => setTab('diagrams')} />
      </View>

      <View style={styles.content}>
        {tab === 'assembly' && <ChoptimaAssembly />}
        {tab === 'checklist' && <ChecklistPlaceholder />}
        {tab === 'diagrams' && <DiagramsPlaceholder />}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabsRow: { flexDirection: 'row', padding: 8, backgroundColor: '#fff' },
  tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, marginRight: 8 },
  tabActive: { backgroundColor: '#0a84ff' },
  tabText: { color: '#333', fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  content: { flex: 1 },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  placeholderText: { color: '#666', textAlign: 'center' },
})

export default ChoptimaScreen
