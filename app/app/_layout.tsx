import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  useLocalSearchParams,
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { queryClient } from './utils/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { AudioPlayerProvider } from '@/context/AudioContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  type ColorSchemeKey = keyof typeof Colors;
  const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
  const themeColors = Colors[scheme];
  const params = useLocalSearchParams();
  const paramName = Array.isArray(params.name) ? params.name[0] : params.name;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <AudioPlayerProvider>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: themeColors.background },
              headerTintColor: themeColors.text,
              headerShadowVisible: false,
              headerBackButtonDisplayMode: 'minimal',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(qibla)" options={{ headerShown: false }} />
            <Stack.Screen name="(quran)" options={{ headerShown: false }} />
            <Stack.Screen name="dua" options={{ title: 'Dua' }} />
            <Stack.Screen name="hadith/index" options={{ title: 'Hadith' }} />
            <Stack.Screen
              name="hadith/[collectionId]"
              options={{ title: paramName ?? 'Hadith' }}
            />
            <Stack.Screen name="tasbi" options={{ title: 'Tasbi' }} />
            <Stack.Screen name="zakat" options={{ title: 'Zakat Calculator' }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: 'modal', title: 'Modal' }}
            />
          </Stack>
          <StatusBar style="auto" />
        </AudioPlayerProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
