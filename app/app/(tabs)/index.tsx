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
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { queryClient } from '../utils/queryClient';
import { useQuery } from '@tanstack/react-query';
import { getChapters } from '@/services/quranApi';
import { Surah } from '@/types/quranTypes';
import { DailyPrayerResponse } from '@/types/islamicCalenderTypes';
import { fetchCalendar } from '@/services/calenderApi';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';

const HomeScreen = () => {
  const colorScheme = useColorScheme();
  type ColorSchemeKey = keyof typeof Colors;
  const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
  const colors = Colors[scheme] as (typeof Colors)['light'];

  const { data, isLoading } = useQuery<DailyPrayerResponse>({
    queryKey: ['calendar'],
    queryFn: async () => await fetchCalendar(),
  });

  console.log(data?.date.hijri.month.en);

  const blurhash = 'LGFO_ftQ01WBuPNGi^ax02M{^%W=';

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
      />

      <Image
        style={{
          height: 400,
          marginTop: -70,
        }}
        source="https://cdn.pixabay.com/photo/2018/12/17/14/25/mosque-3880493_960_720.jpg"
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      ></Image>
      <View style={[styles.header, { marginTop: -330 }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {data?.date.hijri.month.number} {data?.date.hijri.month.en}{' '}
          {data?.date.hijri.year} AH
        </Text>
      </View>
      <View style={{ marginTop: 300 }}>
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <View
            key={item}
            style={{
              backgroundColor: 'red',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <View>
              <Text style={{ color: colors.text, fontSize: 16 }}>
                Prayer Name
              </Text>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

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
