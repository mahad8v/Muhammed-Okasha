import AsrIcon from '@/components/icons/AsrIcon';
import BackIcon from '@/components/icons/BackIcon';
import { Colors } from '@/constants/theme';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { TouchableOpacity, useColorScheme } from 'react-native';

export default function QuranLayout() {
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
          // backgroundColor: 'red',
        },
        headerTintColor: Colors[colorScheme ?? 'light'].text,
      }}
    >
      {/* Surah Details */}
      <Stack.Screen
        name="surah/[id]"
        options={{
          title: Array.isArray(params.name)
            ? (params.name[0] ?? 'Surah')
            : (params.name ?? 'Surah'),
          headerBackTitle: 'Quran',
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

      {/* Surahs available for a single reciter */}
      <Stack.Screen
        name="reciters/[reciterId]"
        options={{
          title: Array.isArray(params.name)
            ? (params.name[0] ?? 'Reciter')
            : (params.name ?? 'Reciter'),
          headerBackTitle: 'Quran',
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

      {/* Manage downloaded (offline) surahs */}
      <Stack.Screen
        name="downloads"
        options={{
          title: 'Downloads',
          headerBackTitle: 'Quran',
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
