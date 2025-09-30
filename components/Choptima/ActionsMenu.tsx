import React from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'

type Props = {
  visible: boolean
  onClose: () => void
  checklistMode: boolean
  onToggleChecklist: () => void
  expandAll: boolean
  onToggleExpandAll: () => void
  onSave: () => void
  onOpenSnapshots: () => void
}

const ActionsMenu: React.FC<Props> = ({ visible, onClose, checklistMode, onToggleChecklist, expandAll, onToggleExpandAll, onSave, onOpenSnapshots }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.container}>
          <Text style={styles.title}>Actions</Text>

          <TouchableOpacity style={styles.item} onPress={() => { onToggleChecklist(); onClose() }}>
            <Text style={styles.itemText}>{checklistMode ? 'Turn checklist OFF' : 'Turn checklist ON'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => { onToggleExpandAll(); onClose() }}>
            <Text style={styles.itemText}>{expandAll ? 'Collapse all' : 'Expand all'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => { onSave(); onClose() }}>
            <Text style={styles.itemText}>Save snapshot</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => { onOpenSnapshots(); onClose() }}>
            <Text style={styles.itemText}>Browse snapshots</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}><Text style={styles.closeText}>Close</Text></TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-start', paddingTop: 80 },
  container: { marginHorizontal: 24, backgroundColor: '#fff', borderRadius: 10, padding: 12, elevation: 6 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  item: { paddingVertical: 10, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#f2f2f2' },
  itemText: { fontSize: 15, color: '#222' },
  closeBtn: { marginTop: 8, alignSelf: 'flex-end', paddingVertical: 6, paddingHorizontal: 8 },
  closeText: { color: '#0a84ff', fontWeight: '600' },
})

export default ActionsMenu
