import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'

const NullComponent = () => null

export default function StorybookEntry() {
  const StorybookUIRoot: any = useMemo(() => {
    try {
      const Component = require('../.rnstorybook/index')
      return Component?.default ?? NullComponent
    } catch (e) {
      console.warn('Storybook not available', e)
      return NullComponent
    }
  }, [])

  if (!StorybookUIRoot) {
    return (
      <View style={styles.centered}>
        <Text>Storybook not found</Text>
      </View>
    )
  }

  return <View style={{flex: 1}}><StorybookUIRoot /></View>
}

const styles = StyleSheet.create({ centered: { flex: 1, alignItems: 'center', justifyContent: 'center' } })
