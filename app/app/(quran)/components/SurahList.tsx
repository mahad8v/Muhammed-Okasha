import { Shimmer } from '@/components/ui/Shimmer';
import { Colors } from '@/constants/theme';
import { getChapters } from '@/services/quranApi';
import { Surah } from '@/types/quranTypes';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

/**
 * Lists all 114 surahs of the Quran. Chapter metadata never changes, so it is
 * cached indefinitely (see PersistQueryClientProvider in app/_layout.tsx) and
 * fetched from the network only once across app sessions.
 */
export default function SurahList() {
  const colorScheme = useColorScheme();
  type ColorSchemeKey = keyof typeof Colors;
  const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
  const colors = Colors[scheme];

  const {
    data: surahs,
    isLoading,
    isError,
    error,
  } = useQuery<Surah[]>({
    queryKey: ['chapters'],
    queryFn: getChapters,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const handlePress = (surah: Surah) => {
    router.push({
      pathname: '/surah/[id]',
      params: {
        id: surah.id.toString(),
        name: surah.name_complex,
        arabic: surah.name_arabic,
        verses: surah.verses_count.toString(),
        revelation: surah.revelation_place,
      },
    });
  };

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{ color: colors.text }}>
          Failed to load surahs: {error?.message}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.surahList}>
      {isLoading &&
        Array.from({ length: 10 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.surahItem,
              {
                borderBottomColor:
                  scheme === 'dark' ? colors.cardBgAlt : '#F0F0F0',
              },
            ]}
          >
            <View style={styles.surahLeft}>
              <Shimmer width={40} height={40} borderRadius={20} />
              <View style={[styles.surahInfo, { marginLeft: 16, gap: 6 }]}>
                <Shimmer width="60%" height={14} />
                <Shimmer width="40%" height={12} />
              </View>
            </View>
            <Shimmer width={40} height={16} />
          </View>
        ))}

      {surahs?.map((surah) => (
        <TouchableOpacity
          key={surah.id}
          onPress={() => handlePress(surah)}
          style={[
            styles.surahItem,
            {
              borderBottomColor:
                scheme === 'dark' ? colors.cardBgAlt : '#F0F0F0',
            },
          ]}
        >
          <View style={styles.surahLeft}>
            <View
              style={[
                styles.surahNumberContainer,
                { borderColor: Colors.dark.secondary },
              ]}
            >
              <Text
                style={[styles.surahNumber, { color: Colors.dark.secondary }]}
              >
                {surah.id}
              </Text>
            </View>
            <View style={styles.surahInfo}>
              <Text style={[styles.surahName, { color: colors.text }]}>
                {surah.name_complex}
              </Text>
              <Text style={[styles.surahDetails, { color: '#A67C52' }]}>
                {surah.verses_count} verses | {surah.revelation_place}
              </Text>
            </View>
          </View>
          <Text style={[styles.surahArabic, { color: colors.text }]}>
            {surah.name_arabic}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  surahList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  surahItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  surahLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  surahNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  surahNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  surahDetails: {
    fontSize: 12,
  },
  surahArabic: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
  },
});
