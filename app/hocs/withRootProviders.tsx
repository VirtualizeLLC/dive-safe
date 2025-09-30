import React from 'react'
import { Provider as PaperProvider } from 'react-native-paper'

export const withRootProviders = (Component: React.ComponentType) => {
  const Wrapped: React.FC<Record<string, unknown>> = (props) => {
    return (
      <PaperProvider>
        <Component {...props} />
      </PaperProvider>
    )
  }
  Wrapped.displayName = `withRootProviders(${Component.displayName || Component.name || 'Component'})`
  return Wrapped
}

export default withRootProviders
