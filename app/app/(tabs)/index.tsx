import { Colors } from '@/constants/theme';
import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DhuhrIcon from '@/components/icons/dhuhr';
import MagribIcon from '@/components/icons/MagribIcon';
import IshaIcon from '@/components/icons/IshaIcon';
import AsrIcon from '@/components/icons/AsrIcon';
import FajrIcon from '@/components/icons/FajrIcon';
import StreaksComponent from '@/components/ui/streak';
import { Shimmer } from '@/components/ui/Shimmer';
import { useCalendar } from '../(home)/hooks/useCalender';
import { Prayer, usePrayerTimes } from '../(home)/hooks/usePrayerTime';
import { useStreak } from '../(home)/hooks/useStreak';
import { PrayerHeader } from '../(home)/components/PrayerHeader';
import { PrayerTimesRow } from '../(home)/components/PrayerTimes';
import { FeaturesGrid } from '../(home)/components/FeatureGrid';
const HomeScreen = () => {
  const colorScheme = useColorScheme();
  type ColorSchemeKey = keyof typeof Colors;
  const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
  const colors = Colors[scheme] as (typeof Colors)['light'];

  const { data, isLoading } = useCalendar();

  const fivePrayers: Prayer[] = [
    { name: 'Fajr', time: data?.timings.Fajr, svg: FajrIcon },
    { name: 'Dhuhr', time: data?.timings.Dhuhr, svg: DhuhrIcon },
    { name: 'Asr', time: data?.timings.Asr, svg: AsrIcon },
    { name: 'Maghrib', time: data?.timings.Maghrib, svg: MagribIcon },
    { name: 'Isha', time: data?.timings.Isha, svg: IshaIcon },
  ];

  const { prayerInfo, formatTimeRemaining } = usePrayerTimes(fivePrayers);
  const { currentStreak, weekInteractions } = useStreak();

  const nextPrayer =
    prayerInfo.nextPrayerIndex !== -1
      ? fivePrayers[prayerInfo.nextPrayerIndex]
      : undefined;

  return (
    <SafeAreaView
      edges={[]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <>
            <View style={styles.headerSkeleton}>
              <Shimmer width={180} height={16} />
              <Shimmer width={120} height={28} style={{ marginTop: 12 }} />
            </View>
            <View style={styles.prayerRowSkeleton}>
              {Array.from({ length: 5 }).map((_, index) => (
                <View key={index} style={styles.prayerSkeletonItem}>
                  <Shimmer width={36} height={12} />
                  <Shimmer width={25} height={25} borderRadius={13} />
                  <Shimmer width={40} height={12} />
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            <PrayerHeader
              hijriDate={data?.date.hijri}
              nextPrayer={nextPrayer}
              timeRemaining={formatTimeRemaining(prayerInfo.timeUntilNext)}
            />

            <PrayerTimesRow
              prayers={fivePrayers}
              currentPrayerIndex={prayerInfo.currentPrayerIndex}
              colors={colors}
              scheme={scheme}
            />
          </>
        )}

        <View style={styles.streaksContainer}>
          <StreaksComponent
            currentStreak={currentStreak}
            weekInteractions={weekInteractions}
          />
        </View>

        <FeaturesGrid colors={colors} />
      </ScrollView>
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
  streaksContainer: {
    paddingHorizontal: 20,
  },
  headerSkeleton: {
    height: 290,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 90,
  },
  prayerRowSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -20,
  },
  prayerSkeletonItem: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
});
