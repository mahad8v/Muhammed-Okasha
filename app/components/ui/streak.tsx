import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import Card from '../card';

interface StreaksComponentProps {
  currentStreak: number;
  colorScheme: 'light' | 'dark';
}

const StreaksComponent: React.FC<StreaksComponentProps> = ({
  currentStreak,
  colorScheme,
}) => {
  const colors = Colors[colorScheme];

  const today = new Date().getDay();

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isChecked = (index: number) => {
    const daysBack = today - index;
    if (daysBack >= 0) {
      return index <= today && today - index < currentStreak;
    } else {
      const adjustedDaysBack = 7 + daysBack;
      return adjustedDaysBack < currentStreak;
    }
  };

  return (
    <Card>
      <View style={styles.header}>
        <Text style={[styles.streakText, { color: colors.text }]}>
          You're on the {currentStreak} day streaks!
        </Text>
      </View>

      <View style={styles.daysContainer}>
        {daysOfWeek.map((day, index) => {
          const checked = isChecked(index);
          const isToday = index === today;

          return (
            <View key={day} style={styles.dayItem}>
              <Text style={[styles.dayLabel, { color: colors.text }]}>
                {day}
              </Text>
              <View
                style={[
                  styles.checkCircle,
                  {
                    backgroundColor: checked
                      ? Colors.dark.secondary
                      : colors.tabIconDefault,
                    borderColor: checked ? Colors.dark.secondary : '#cccccc',
                  },
                  isToday && styles.todayCircle,
                ]}
              >
                {checked ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : (
                  <Text style={styles.checkmark}>x</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* <Text style={[styles.motivationText, { color: colors.text }]}>
        interact each day so your streak won't reset
      </Text> */}
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
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  motivationText: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default StreaksComponent;
