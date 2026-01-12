import { SearchIcon } from '@/components/icons/SearchIcon';
import { Colors } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { queryClient } from '../utils/queryClient';
import { useQuery } from '@tanstack/react-query';
import { getChapters } from '@/services/quranApi';
import { Surah } from '@/types/quranTypes';

const QuranScreen = () => {
  const colorScheme = useColorScheme();
  type ColorSchemeKey = keyof typeof Colors;
  const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
  const colors = Colors[scheme] as (typeof Colors)['light'];

  const [selectedTab, setSelectedTab] = useState('Sura');

  const lastReadSurahs = [
    { name: 'Al-Baqarah', verse: 'Verse 285' },
    { name: 'Al-Mumtahanah', verse: 'Verse 9' },
    { name: 'Al-Mulk', verse: 'Verse 12' },
  ];

  const {
    data: surahs,
    isLoading,
    isError,
    error,
  } = useQuery<Surah[]>({
    queryKey: ['chapters'],
    queryFn: () => getChapters(),
  });

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Al Quran
        </Text>
        <TouchableOpacity style={[styles.searchButton]}>
          <SearchIcon width={25} height={25} color={Colors.dark.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Surah List */}
        <View style={styles.surahList}>
          {surahs?.map((surah: Surah) => (
            <TouchableOpacity
              key={surah.id}
              style={[
                styles.surahItem,
                {
                  borderBottomColor:
                    scheme === 'dark' ? colors.cardBgAlt : '#F0F0F0',
                },
              ]}
              onPress={() =>
                router.push({
                  pathname: '/(home)/SurahDetails',
                  params: {
                    number: surah.id.toString(),
                    name: surah.name_complex,
                    arabic: surah.name_arabic,
                    verses: surah.verses_count,
                    revelation: surah.revelation_place,
                  },
                })
              }
            >
              <View style={styles.surahLeft}>
                <View
                  style={[
                    styles.surahNumberContainer,
                    { borderColor: Colors.dark.secondary },
                  ]}
                >
                  <Text
                    style={[
                      styles.surahNumber,
                      { color: Colors.dark.secondary },
                    ]}
                  >
                    {surah.id}
                  </Text>
                </View>
                <View style={styles.surahInfo}>
                  <Text style={[styles.surahName, { color: colors.text }]}>
                    {surah.name_complex}
                  </Text>
                  <Text style={[styles.surahDetails, { color: '#A67C52' }]}>
                    {surah.verses_count} | {surah.revelation_place}
                  </Text>
                </View>
              </View>
              <Text style={[styles.surahArabic, { color: colors.text }]}>
                {surah.name_arabic}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuranScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
  },
  tabTextActive: {
    fontWeight: '600',
  },
  surahList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
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
    borderWidth: 2,
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  surahDetails: {
    fontSize: 12,
  },
  surahArabic: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});
