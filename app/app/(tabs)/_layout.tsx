import { HapticTab } from '@/components/haptic-tab';
import CompassIcon from '@/components/icons/CompassIcon';
import { HomeIcon } from '@/components/icons/HomeIcon';
import { QuranIcon } from '@/components/icons/QuranIcon';
import { Colors } from '@/constants/theme';
import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].secondary,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'dark'].tabIconDefault,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopWidth: 0.3,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <HomeIcon width={25} height={25} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="quran"
        options={{
          title: 'Quran',
          tabBarIcon: ({ color }) => (
            <QuranIcon width={25} height={25} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="qibla"
        options={{
          title: 'Qibla',
          tabBarIcon: ({ color }) => (
            <CompassIcon width={25} height={25} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="fig"
        options={{
          title: 'Fig',
          tabBarIcon: ({ color }) => (
            <CompassIcon width={25} height={25} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
