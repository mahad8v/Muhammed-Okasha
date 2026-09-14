import BackIcon from '@/components/icons/BackIcon';
import { Colors } from '@/constants/theme';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { TouchableOpacity, useColorScheme } from 'react-native';

export default function TafsirLayout() {
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        headerTintColor: Colors[colorScheme ?? 'light'].text,
      }}
    >
      {/* Surahs available for a single tafsir scholar */}
      <Stack.Screen
        name="scholar/[scholarId]"
        options={{
          title: Array.isArray(params.name)
            ? (params.name[0] ?? 'Scholar')
            : (params.name ?? 'Scholar'),
          headerBackTitle: 'Tafsir',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <BackIcon
                width={24}
                height={24}
                color={Colors[colorScheme ?? 'light'].text}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
