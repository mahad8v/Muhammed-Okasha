import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Prayer } from '../hooks/usePrayerTime';
import { Colors } from '@/constants/theme';

interface PrayerHeaderProps {
  hijriDate:
    | {
        day: string;
        month: { en: string };
        year: string;
      }
    | undefined;
  nextPrayer: Prayer | undefined;
  timeRemaining: string;
}

export const PrayerHeader: React.FC<PrayerHeaderProps> = ({
  hijriDate,
  nextPrayer,
  timeRemaining,
}) => {
  const blurhash = 'LGFO_ftQ01WBuPNGi^ax02M{^%W=';

  return (
    <View style={styles.imageContainer}>
      <Image
        style={styles.image}
        source={require('@/assets/images/backgroundimage.png')}
        placeholder={{ blurhash }}
        contentFit="cover"
        contentPosition="center"
        transition={1000}
      />
      <View style={styles.overlay} />
      <View style={styles.dateOverlay}>
        <View style={styles.headerRow}>
          <View style={{ marginBottom: 15, alignItems: 'center' }}>
            <Text style={styles.dateText}>
              {hijriDate?.day} {hijriDate?.month.en} {hijriDate?.year} AH
            </Text>
          </View>

          {nextPrayer && (
            <View style={styles.nextPrayerWrapper}>
              <View style={styles.nextPrayerContainer}>
                <Text style={styles.nextPrayerName}>{timeRemaining}</Text>
                <Text style={styles.nextPrayerName}>remaining before</Text>
                <Text style={styles.nextPrayerName}>{nextPrayer.name}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    height: 290,
    position: 'relative',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  dateOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  headerRow: {
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 70,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  nextPrayerWrapper: {
    flexDirection: 'column',
  },
  nextPrayerContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  nextPrayerLabel: {
    fontSize: 13,
    color: '#E0E0E0',
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  nextPrayerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  timeRemaining: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.secondary,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
