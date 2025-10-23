import type React from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import ChoptimaStep from './ChoptimaStep'
import useChoptimaStore from './useChoptimaStore'

export type AssemblyStep = {
  id: string
  step?: string
  title: string
  content?: string
  images?: string[]
  // nested steps
  children?: AssemblyStep[]
  // optional input definitions for this step (used for validation/subtasks)
  requiredInputs?: { id: string; label: string; placeholder?: string }[]
}

export const assemblyStepData: AssemblyStep[] = [
  {
    id: '1',
    step: '1',
    title: 'Clean & Dry',
    content:
      '# Clean and dry\n\nIf not completed before storage: steam, rinse and clean the canister, lid, loop hoses, DSV, and counterlungs. Allow all parts to dry completely.',
  },
  {
    id: '2',
    step: '2',
    title: 'Cylinders & Gas Analysis',
    content:
      '## Cylinders & gas analysis\n\n- Fill oxygen and bailout/diluent cylinders if needed.\n- Analyze gas for O2 and He content (CO analysis recommended). Record the O2 and He percentages for main gas and any bailout cylinders.',
  },
  {
    id: '3',
    step: '3',
    title: 'Canister Assembly',
    content: '## Canister assembly\n\nPerform the following canister tasks:',
  },
  {
    id: '4',
    step: '5',
    title: 'Inspect canister, head & lid',
    content:
      'Inspect canister, head, and lid for damage, debris, or missing hardware.',
  },
  {
    id: '6',
    step: '6',
    title: 'Inspect scrubber media',
    content:
      'Inspect scrubber media/cartridges (EAC or other sorb) and note type; if using EAC, inspect cartridges for damage and orientation.',
  },
  {
    id: '7',
    step: '7',
    title: 'Pack scrubber',
    content:
      'Pack scrubber canister, install cartridges as required and confirm orientation.',
  },
  {
    id: '8',
    step: '8',
    title: 'Inspect bore plug',
    content: 'Inspect bore plug and confirm correct orientation.',
  },
  {
    id: '9',
    step: '9',
    title: 'Lube O-rings & install head',
    content:
      'Lube head O-rings and flat seals; confirm O-rings on premix/purge tube and install head onto canister.',
  },
  {
    id: '10',
    step: '10',
    title: 'Water trap & lid',
    content:
      'Confirm water trap is installed in lid; lube lid O-rings and flat seals and secure the lid.',
  },
  {
    id: '11',
    step: '11',
    title: 'Calibration & Sensor Setup',
    content:
      '## Calibration & sensor setup\n\nCalibration and sensor checks for controller and HUD.',
  },
  {
    id: '12',
    step: '12',
    title: 'Install calibration caps',
    content: 'Install calibration caps if required.',
  },
  {
    id: '13',
    step: '13',
    title: 'Flush with O2',
    content:
      'Connect O2 hose to controller, turn on controller, and flush with oxygen until PPO2 readings stabilize.',
  },
  {
    id: '14',
    step: '14',
    title: 'Calibrate controller & HUD',
    content:
      'Calibrate controller and HUD following manufacturer instructions.',
  },
  {
    id: '15',
    step: '15',
    title: 'Record O2 sensor readings',
    content:
      'With scrubber filled and flushed with O2, check and record O2 sensor mV readings and verify they are within expected ranges.',
    // require three sensor readings: mv1, mv2, mv3
    requiredInputs: [
      { id: 'mv1', label: 'Sensor 1 (mV)', placeholder: 'e.g. 400' },
      { id: 'mv2', label: 'Sensor 2 (mV)', placeholder: 'e.g. 410' },
      { id: 'mv3', label: 'Sensor 3 (mV)', placeholder: 'e.g. 395' },
    ],
  },
  {
    id: '16',
    step: '16',
    title: 'Battery voltages',
    content:
      'The one cannister SOLO (SOLenoid and Oxygen) AKA SOLO uses a 9V battery and the other cannister OBOE (Oxygen BOard Electronics) - uses a AA Battery',
    requiredInputs: [
      {
        id: 'bat1',
        label: 'DiveCan battery 1 (9volt solenoid + O2) (V)',
        placeholder: 'e.g. 13.2',
      },
      {
        id: 'bat2',
        label:
          'DiveCan battery 2 (AA battery for Oxygen BOard Electronics) (V)',
        placeholder: 'e.g. 13.1',
      },
    ],
  },
  {
    id: '17',
    step: '17',
    title: 'Bag / Loop Setup',
    content: '## Bag and loop setup\n\nSetup bag, hoses and routing.',
  },
  {
    id: '18',
    step: '18',
    title: 'Install water trap tubes',
    content:
      'Install both water trap tubes into counterlungs (note black machined tube for exhale side).',
  },
  {
    id: '19',
    step: '19',
    title: 'Mount scrubber',
    content:
      'Position assembled scrubber canister into unit and secure into counterlungs/seat.',
  },
  {
    id: '20',
    step: '20',
    title: 'Inspect valves & hoses',
    content:
      'Inspect DSV, mushroom valves, mouthpiece, loop hoses, fittings and O-rings for condition.',
  },
  {
    id: '21',
    step: '21',
    title: 'Stereo check',
    content:
      'Connect DSV to loop hoses and perform stereo check to confirm flow direction.',
  },
  {
    id: '22',
    step: '22',
    title: 'Connect loop hoses',
    content:
      'Connect loop hoses to counterlungs and double-check fittings for tightness.',
  },
  {
    id: '23',
    step: '23',
    title: 'Route electronics cables',
    content:
      'Route controller and HUD cables, plug into electronics canister, and stow excess cable.',
  },
  {
    id: '24',
    step: '24',
    title: 'Oxygen Cylinder & Regulator',
    content: '## Oxygen & regulator\n\nInstall oxygen supply and regulator.',
  },
  {
    id: '25',
    step: '25',
    title: 'Attach oxygen hose & manual add',
    content:
      'Attach oxygen supply hose to head fitting and attach manual add/override feed to MAV. Ensure inline shutoff is turned on and locked open with clip.',
  },
  {
    id: '26',
    step: '26',
    title: 'Mount cylinder',
    content: 'Clip and tighten canister cover and mount oxygen cylinder.',
  },
  {
    id: '27',
    step: '27',
    title: 'Attach regulator',
    content: 'Attach regulator and connect oxygen hose to the Y-block.',
  },
  {
    id: '28',
    step: '28',
    title: 'Leak & Pressure Tests',
    content: '## Leak and pressure tests\n\nPerform pressure and leak checks.',
  },
  {
    id: '29',
    step: '29',
    title: 'Negative pressure test',
    content:
      'Ensure ADV is off and perform a negative pressure test for minimum 30s (no inward leaks).',
  },
  {
    id: '30',
    step: '30',
    title: 'Positive pressure test',
    content:
      'Ensure counterlung exhaust valve is closed and perform a positive pressure test for minimum 2 minutes (no outward leaks).',
  },
  {
    id: '31',
    step: '31',
    title: 'Record cylinder pressure',
    content: 'Turn on oxygen and record cylinder pressure (bar).',
  },
  {
    id: '32',
    step: '32',
    title: 'Leak-down check',
    content:
      'Turn off oxygen cylinder and perform leak-down check to confirm system holds pressure.',
  },
  {
    id: '33',
    step: '33',
    title: 'Pre-breathe & Final Checks',
    content:
      '## Pre-breathe & final checks\n\nComplete final pre-breathe and system checks.',
  },
  {
    id: '34',
    step: '34',
    title: 'Pre-breathe',
    content:
      'Turn oxygen back on, open counterlung exhaust valve, set setpoint (example 0.5) and perform a 5-minute pre-breathe while confirming solenoid operation and system stability.',
  },
  {
    id: '35',
    step: '35',
    title: 'Confirm computers & bailout',
    content:
      'Confirm onboard and bailout gases are configured and selected in dive computers and set to CC mode.',
  },
  {
    id: '36',
    step: '36',
    title: 'Bailout checks',
    content:
      'Check bailout regulator hoses, mouthpieces and fittings for tightness; install bailout regulators and verify operation.',
  },
]

export const ChoptimaAssembly: React.FC<{
  hideHeaderToggle?: boolean
  hasCheckListMode?: boolean
}> = ({ hideHeaderToggle, hasCheckListMode }) => {
  // Wire to checklist store so guide reflects saved/loaded state
  const items = useChoptimaStore((s) => s.items)
  const setItem = useChoptimaStore((s) => s.setItem)
  const setField = useChoptimaStore((s) => s.setField)
  const hasAllStepsExpanded = useChoptimaStore((s) => s.hasAllStepsExpanded)
  const setHasAllStepsExpanded = useChoptimaStore(
    (s) => s.setHasAllStepsExpanded,
  )

  const actualExpandAll = hasAllStepsExpanded

  const handleToggle = () => {
    setHasAllStepsExpanded(!hasAllStepsExpanded)
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Assembly Guide</Text>
        {!hideHeaderToggle && (
          <TouchableOpacity onPress={handleToggle} style={styles.toggleBtn}>
            <Text style={styles.toggleText}>
              {actualExpandAll ? 'Collapse all' : 'Expand all'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.steps}>
        {assemblyStepData.map((s) => (
          <ChoptimaStep
            key={s.id}
            hasCheckListMode={hasCheckListMode}
            requiredInputs={s.requiredInputs}
            step={s.step}
            title={s.title}
            content={s.content}
            images={s.images}
            expanded={actualExpandAll}
            initiallyCollapsed={!actualExpandAll}
            checked={!!items[s.id]?.checked}
            onCheckedChange={(next) => setItem(s.id, { checked: next })}
            values={items[s.id]?.values}
            onInputChange={(inputId: string, value: string) =>
              setField(s.id, inputId, value)
            }
          />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f5f9' },
  inner: { padding: 16, paddingBottom: 48 },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#e6e6e6',
    borderRadius: 6,
  },
  toggleText: { color: '#333', fontWeight: '600' },
  steps: { marginTop: 8 },
})
