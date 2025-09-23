import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import ChoptimaAssembly, { sampleSteps } from './ChoptimaAssembly';
import ChoptimaStep from './ChoptimaStep';


const TabButton: React.FC<{ label: string; active: boolean; onPress: () => void }> = ({ label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.tab, active && styles.tabActive]}
    activeOpacity={0.8}
    accessibilityRole="button"
  >
    <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
  </TouchableOpacity>
);

// Checklist mode for assembly steps (rendered inside Assembly view)
const AssemblyChecklist: React.FC = () => {
  const [checked, setChecked] = useState<{ [id: string]: boolean }>({});

  const handleToggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <ScrollView style={styles.checklistContainer} contentContainerStyle={styles.inner}>
      <Text style={styles.header}>Choptima CCR Assembly Checklist</Text>
      {sampleSteps.map((step) => (
        <ChoptimaStep
          key={step.id}
          step={step.step}
          title={step.title}
          content={step.content}
          images={step.images}
          leftAccessory={(
            <TouchableOpacity
              onPress={() => handleToggle(step.id)}
              style={[styles.checkbox, checked[step.id] && styles.checkboxChecked]}
              activeOpacity={0.7}
            >
              {checked[step.id] && <Text style={styles.checkboxMark}>✓</Text>}
            </TouchableOpacity>
          )}
        />
      ))}
    </ScrollView>
  )
}

const DiagramsPlaceholder: React.FC = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Diagrams and annotated images go here.</Text>
  </View>
)

export const ChoptimaScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assembly' | 'disassembly' | 'diagrams'>('assembly');
  const [checklistMode, setChecklistMode] = useState(false);

  return (
    <View style={styles.container}>

      <View style={styles.tabsRow}>
        <TabButton label="Assembly" active={activeTab === 'assembly'} onPress={() => setActiveTab('assembly')} />
        <TabButton label="Disassembly" active={activeTab === 'disassembly'} onPress={() => setActiveTab('disassembly')} />
        <TabButton label="Diagrams" active={activeTab === 'diagrams'} onPress={() => setActiveTab('diagrams')} />
      </View>

      {/* Controls that sit under the tabs (e.g., checklist toggle for Assembly) */}
      <View style={styles.tabControlsRow}>
        {activeTab === 'assembly' && (
          <TouchableOpacity
            style={[styles.toggleChecklistBtn, checklistMode && styles.toggleChecklistBtnActive]}
            onPress={() => setChecklistMode((v) => !v)}
          >
            <Text style={[styles.toggleChecklistText, checklistMode && styles.toggleChecklistTextActive]}>
              {checklistMode ? 'Checklist: ON' : 'Checklist: OFF'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {activeTab === 'assembly' && (checklistMode ? <AssemblyChecklist /> : <ChoptimaAssembly />)}
        {activeTab === 'disassembly' && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Disassembly steps not yet authored.</Text>
          </View>
        )}
        {activeTab === 'diagrams' && <DiagramsPlaceholder />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabsRow: { flexDirection: 'row', padding: 8, backgroundColor: '#fff' },
  tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, marginRight: 8 },
  tabActive: { backgroundColor: '#0a84ff' },
  tabText: { color: '#333', fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  toggleRow: { flexDirection: 'row', justifyContent: 'flex-end', padding: 8, backgroundColor: '#f7f7f7' },
  toggleChecklistBtn: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6, backgroundColor: '#e6e6e6' },
  toggleChecklistBtnActive: { backgroundColor: '#0a84ff' },
  toggleChecklistText: { color: '#333', fontWeight: '600' },
  toggleChecklistTextActive: { color: '#fff' },
  content: { flex: 1 },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  placeholderText: { color: '#666', textAlign: 'center' },
  checklistContainer: { flex: 1, backgroundColor: '#f2f5f9' },
  inner: { padding: 16, paddingBottom: 48 },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  checklistItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  checkbox: {
    width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#bbb',
    marginRight: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff'
  },
  checkboxChecked: { backgroundColor: '#0a84ff', borderColor: '#0a84ff' },
  checkboxMark: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  checklistText: { fontSize: 16, color: '#222' },
  checklistTextChecked: { color: '#aaa', textDecorationLine: 'line-through' },
  headerRowSingle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  tabControlsRow: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fafafa', borderBottomWidth: 1, borderBottomColor: '#eee' },
});

export default ChoptimaScreen
