import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context' // to handle safe area insets
import SignOutButton from '@/components/SignOutButton'

const HomeScreen = () => {
  return (
    <SafeAreaView className='flex-1 items-center'>
      <Text>Home Screen</Text>
      <SignOutButton />
    </SafeAreaView>
  )
}

export default HomeScreen