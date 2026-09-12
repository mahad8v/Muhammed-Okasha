import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import Card from '../card';

interface DayInteraction {
  [key: string]: boolean | 'future';
}

interface StreaksComponentProps {
  currentStreak: number;
  weekInteractions: DayInteraction;
}

const StreaksComponent: React.FC<StreaksComponentProps> = ({
  currentStreak,
  weekInteractions,
}) => {
  const colorScheme = useColorScheme();
  type ColorSchemeKey = keyof typeof Colors;
  const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
  const colors = Colors[scheme] as (typeof Colors)['light'];

  const today = new Date().getDay();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDayStatus = (day: string, index: number) => {
    const interaction = weekInteractions[day];
    const isToday = index === today;
    const isFuture = interaction === 'future' || index > today;

    return {
      isToday,
      isFuture,
      hasInteracted: interaction === true,
      missedDay: interaction === false,
    };
  };

  return (
    <Card>
      <View style={styles.header}>
        <Text style={[styles.streakText, { color: colors.text }]}>
          You're on a {currentStreak} day streak!
        </Text>
      </View>

      <View style={styles.daysContainer}>
        {daysOfWeek.map((day, index) => {
          const status = getDayStatus(day, index);

          return (
            <View key={day} style={styles.dayItem}>
              <Text
                style={[
                  styles.dayLabel,
                  {
                    color: status.isFuture
                      ? colors.tabIconDefault
                      : colors.text,
                  },
                  status.isFuture && styles.futureText,
                ]}
              >
                {day}
              </Text>
              <View
                style={[
                  styles.checkCircle,
                  {
                    backgroundColor: status.hasInteracted
                      ? Colors.dark.secondary
                      : status.missedDay
                        ? '#FF6B6B'
                        : status.isFuture
                          ? colors.tabIconDefault + '40'
                          : colors.tabIconDefault,
                    borderColor: status.hasInteracted
                      ? Colors.dark.secondary
                      : status.missedDay
                        ? '#FF6B6B'
                        : status.isFuture
                          ? colors.tabIconDefault + '40'
                          : '#cccccc',
                  },
                  status.isToday && !status.isFuture && styles.todayCircle,
                  status.isFuture && styles.futureCircle,
                ]}
              >
                {status.hasInteracted ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : status.missedDay ? (
                  <Text style={[styles.checkmark, styles.missedMark]}>✕</Text>
                ) : status.isFuture ? (
                  <Text style={[styles.checkmark, styles.futureMark]}>•</Text>
                ) : (
                  <Text style={[styles.checkmark, styles.missedMark]}>✕</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 24,
    marginRight: 8,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayItem: {
    alignItems: 'center',
    gap: 8,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  futureText: {
    opacity: 0.5,
  },
  checkCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayCircle: {
    borderWidth: 3,
    shadowColor: Colors.dark.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  futureCircle: {
    opacity: 0.4,
    borderStyle: 'dashed',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  missedMark: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  futureMark: {
    color: '#FFFFFF',
    fontSize: 24,
    opacity: 0.6,
  },
  motivationText: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default StreaksComponent;
