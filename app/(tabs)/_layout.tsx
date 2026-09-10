import React from 'react';
import { Tabs } from 'expo-router';
import { ModernTabBar } from '@/components/navigation/ModernTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <ModernTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scan',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Flock',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}
