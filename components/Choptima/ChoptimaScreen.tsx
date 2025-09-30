import React, { useState, useCallback, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, Pressable, View, ScrollView } from 'react-native';
import SnapshotExplorer from '@/components/Snapshots/SnapshotExplorer'
import ChoptimaAssembly from './ChoptimaAssembly';
import ChoptimaStep from './ChoptimaStep';
import { ChecklistStorage } from '@/app/storage/ChecklistStorage';
import useChoptimaStore from './useChoptimaStore'
import TabButton from './TabButton'
import CheckboxInternalState from './CheckboxInternalState'
import AssemblyChecklist, { AssemblyChecklistControlled } from './AssemblyChecklist'
import DiagramsPlaceholder from './DiagramsPlaceholder'

export const ChoptimaScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assembly' | 'disassembly' | 'diagrams'>('assembly');
  const [checklistMode, setChecklistMode] = useState(false);
  const [expandAll, setExpandAll] = useState(false);
  const [showSnapshots, setShowSnapshots] = useState(false)
  const saveSnapshot = useChoptimaStore((s) => s.saveSnapshot)

  
  const handleSave = useCallback(() => {
    console.log('Saving snapshot...')
    // create a name that the snapshot explorer can parse easily
    // call without a name so the store will use the 'checklist:snapshot:ISO' key format
    saveSnapshot()
  }, [saveSnapshot])

  return (
    <>
    <View style={styles.container}>

      <View style={styles.tabsRow}>
        <TabButton label="Assembly" active={activeTab === 'assembly'} onPress={() => setActiveTab('assembly')} />
        <TabButton label="Disassembly" active={activeTab === 'disassembly'} onPress={() => setActiveTab('disassembly')} />
        <TabButton label="Diagrams" active={activeTab === 'diagrams'} onPress={() => setActiveTab('diagrams')} />
      </View>

      {/* Controls that sit under the tabs (e.g., checklist toggle for Assembly) */}
      <View style={styles.tabControlsRow}>
        {activeTab === 'assembly' && (
          <>
            <TouchableOpacity
              style={[styles.toggleChecklistBtn, checklistMode && styles.toggleChecklistBtnActive]}
              onPress={() => setChecklistMode((v) => !v)}
            >
              <Text style={[styles.toggleChecklistText, checklistMode && styles.toggleChecklistTextActive]}>
                {checklistMode ? 'Checklist: ON' : 'Checklist: OFF'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleChecklistBtn, expandAll && styles.toggleChecklistBtnActive, { marginLeft: 10 }]}
              onPress={() => setExpandAll((v) => !v)}
            >
              <Text style={[styles.toggleChecklistText, expandAll && styles.toggleChecklistTextActive]}>
                {expandAll ? 'Collapse all' : 'Expand all'}
              </Text>
            </TouchableOpacity>
            <Pressable
              style={[styles.toggleChecklistBtn, expandAll && styles.toggleChecklistBtnActive, { marginLeft: 10 }]}
              onPress={handleSave}
            >
              <Text style={[styles.toggleChecklistText, expandAll && styles.toggleChecklistTextActive]}>
                Save
              </Text>
            </Pressable>
            <Pressable
              style={[styles.toggleChecklistBtn, expandAll && styles.toggleChecklistBtnActive, { marginLeft: 10 }]}
              onPress={() => setShowSnapshots(true)}
            >
              <Text style={[styles.toggleChecklistText, expandAll && styles.toggleChecklistTextActive]}>Snapshots</Text>
            </Pressable>
          </>
        )}
      </View>

      <View style={styles.content}>
  {activeTab === 'assembly' && (checklistMode ? <AssemblyChecklistControlled expandAll={expandAll} /> : <ChoptimaAssembly expandAll={expandAll} hideHeaderToggle />)}
        {activeTab === 'disassembly' && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Disassembly steps not yet authored.</Text>
          </View>
        )}
        {activeTab === 'diagrams' && <DiagramsPlaceholder />}
      </View>
    </View>
    <SnapshotExplorer visible={showSnapshots} onClose={() => setShowSnapshots(false)} />
    </>
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
  toggleChecklistBtn: { alignSelf: 'flex-start', paddingVertical: 2, paddingHorizontal: 10, borderRadius: 6, backgroundColor: '#e6e6e6', marginRight: 8, height: 32, justifyContent: 'center', alignItems: 'center' },
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
  tabControlsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: '#eee' },
});

export default ChoptimaScreen
