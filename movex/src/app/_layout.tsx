import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import { WSProvider } from '../services/WSProvider'

const Layout = () => {
  return (
    <WSProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="role" />
       
      </Stack>
    </WSProvider>
  )
}

export default gestureHandlerRootHOC(Layout)