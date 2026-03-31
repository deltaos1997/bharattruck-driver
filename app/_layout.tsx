import { Tabs } from 'expo-router'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#1a2d3d', borderTopColor: '#2d4a5e' },
        tabBarActiveTintColor: '#f4a261',
        tabBarInactiveTintColor: '#6c757d'
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="🚛" color={color} />
          )
        }}
      />
    </Tabs>
  )
}

function TabIcon({ emoji, color }: { emoji: string, color: string }) {
  const { Text } = require('react-native')
  return <Text style={{ fontSize: 20, opacity: color === '#f4a261' ? 1 : 0.5 }}>{emoji}</Text>
}