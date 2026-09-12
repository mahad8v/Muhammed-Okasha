import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { Prayer } from '../hooks/usePrayerTime';

interface PrayerTimesRowProps {
  prayers: Prayer[];
  currentPrayerIndex: number;
  colors: any;
  scheme: 'light' | 'dark';
}

export const PrayerTimesRow: React.FC<PrayerTimesRowProps> = ({
  prayers,
  currentPrayerIndex,
  colors,
  scheme,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.row}>
        {prayers.map((prayer, index) => {
          const isCurrentPrayer = index === currentPrayerIndex;
          const IconComponent = prayer.svg;

          return (
            <View key={prayer.name} style={styles.prayerItem}>
              <Text
                style={[
                  styles.prayerName,
                  {
                    fontWeight: isCurrentPrayer ? '500' : '400',
                    color: colors.text,
                  },
                ]}
              >
                {prayer.name}
              </Text>
              <View style={styles.iconContainer}>
                <IconComponent
                  width={25}
                  height={25}
                  color={isCurrentPrayer ? Colors.dark.secondary : colors.text}
                />
              </View>
              <Text
                style={[
                  styles.prayerTime,
                  {
                    fontWeight: isCurrentPrayer ? '500' : '400',
                    color: colors.text,
                  },
                ]}
              >
                {prayer.time}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  prayerItem: {
    marginBottom: 8,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  prayerName: {
    fontSize: 14,
  },
  iconContainer: {
    margin: 4,
  },
  prayerTime: {
    fontSize: 14,
  },
});
