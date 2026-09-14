import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import HolyIcon from '@/components/icons/HolyIcon';
import PrayerIcon from '@/components/icons/PrayerIcon';
import BeadIcon from '@/components/icons/BeadIcon';
import CompassIcon from '@/components/icons/CompassIcon';
import DawahIcon from '@/components/icons/Dawag';
import HadithIcon from '@/components/icons/HadithIcon';
import TafsirIcon from '@/components/icons/TafsirIcon';
import ZakatIcon from '@/components/icons/ZakatIcon';
import { FeatureCard } from './FeatureCard';

interface FeaturesGridProps {
  colors: any;
}

export const FeaturesGrid: React.FC<FeaturesGridProps> = ({ colors }) => {
  const features = [
    [
      {
        icon: HolyIcon,
        title: 'Quran',
        subtitle: 'Read quran',
        route: '/quran',
      },
      {
        icon: TafsirIcon,
        title: 'Tafsir',
        subtitle: 'Surah explained',
        route: '/tafsir',
      },
    ],
    [
      {
        icon: CompassIcon,
        title: 'Qibla',
        subtitle: 'Find direction',
        route: '/qibla',
      },
      {
        icon: PrayerIcon,
        title: 'Dua',
        subtitle: 'Pray to Allah',
        route: '/dua',
      },
    ],
    [
      {
        icon: BeadIcon,
        title: 'Tasbi',
        subtitle: 'Prayer Beads',
        route: '/tasbi',
      },
      {
        icon: DawahIcon,
        title: 'Dawah',
        subtitle: 'Call to inslam',
        route: '/dawa',
      },
    ],
    [
      {
        icon: HadithIcon,
        title: 'Hadith',
        subtitle: 'Prophet ﷺ said',
        route: '/hadith',
      },
      {
        icon: ZakatIcon,
        title: 'Zakat',
        subtitle: 'Zakat Calculator',
        route: '/zakat',
      },
    ],
  ] as const;

  return (
    <View style={styles.container}>
      {features.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((feature, colIndex) => {
            const { route, ...cardProps } = feature;
            return (
              <View key={colIndex} style={styles.column}>
                <FeatureCard
                  {...cardProps}
                  colors={colors}
                  onPress={() => router.push(route)}
                />
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  column: {
    flex: 1,
  },
});
