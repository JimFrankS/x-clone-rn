import { Redirect, Tabs } from 'expo-router'
import React from 'react'
import { Feather } from '@expo/vector-icons' // icon library
import { useSafeAreaInsets } from 'react-native-safe-area-context' // to handle safe area insets which is useful for devices with notches or rounded corners
import { useAuth } from '@clerk/clerk-expo'

const TabsLayout = () => {

    const insects = useSafeAreaInsets(); // get the safe area insets

    const { isSignedIn } = useAuth(); // check if the user is signed in
    if (!isSignedIn) return <Redirect href="/(auth)" />; // if not signed in, redirect to auth
  return (
    <Tabs screenOptions={{ 
        headerShown: false, // hide the header on each tab,
        tabBarActiveTintColor: '#1DA1F2', // active tab color
        tabBarInactiveTintColor: '#657786', // inactive tab color

        tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1, // border width
            borderTopColor: '#E1E8ED', // border color
            height: 50 + insects.bottom, // height of tab bar plus safe area inset
            paddingTop: 8, // padding top
        },

    
        }}>
        <Tabs.Screen
        name='index'
        options={{
         title : "",
            tabBarIcon: ({color, size}) => <Feather name='home' size={size} color={color} />
        }}
        />
        <Tabs.Screen
        name='search'
        options={{
           title : "",
            tabBarIcon: ({color, size}) => <Feather name='search' size={size} color={color} />
        }}
        />
        <Tabs.Screen
        name='notifications'
        options={{
            title : "",
            tabBarIcon: ({color, size}) => <Feather name='bell' size={size} color={color} />
        }}
        />
        <Tabs.Screen
        name='messages'
        options={{
            title : "",
            tabBarIcon: ({color, size}) => <Feather name='mail' size={size} color={color} />
        }}
        />
        <Tabs.Screen
        name='profile'
        options={{
            title : "",
            tabBarIcon: ({color, size}) => <Feather name='user' size={size} color={color} />
        }}
        />
    </Tabs>
  )
}

export default TabsLayout