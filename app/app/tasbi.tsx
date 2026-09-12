import { Colors } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DHIKR_OPTIONS = [
  { label: 'SubhanAllah', target: 33 },
  { label: 'Alhamdulillah', target: 33 },
  { label: 'Allahu Akbar', target: 34 },
  { label: 'La ilaha illallah', target: 100 },
] as const;

export default function TasbiScreen() {
  const colorScheme = useColorScheme();
  type ColorSchemeKey = keyof typeof Colors;
  const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
  const colors = Colors[scheme];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [rounds, setRounds] = useState(0);

  const selected = DHIKR_OPTIONS[selectedIndex];

  const handleTap = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setCount((prev) => {
      const next = prev + 1;
      if (next >= selected.target) {
        setRounds((r) => r + 1);
        return 0;
      }
      return next;
    });
  };

  const handleReset = () => {
    setCount(0);
    setRounds(0);
  };

  const handleSelectDhikr = (index: number) => {
    setSelectedIndex(index);
    setCount(0);
  };

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.heading, { color: colors.text }]}>Tasbi</Text>

      <View style={styles.dhikrRow}>
        {DHIKR_OPTIONS.map((option, index) => {
          const isActive = index === selectedIndex;
          return (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.dhikrChip,
                {
                  backgroundColor: isActive
                    ? Colors.dark.secondary
                    : colors.cardBg,
                },
              ]}
              onPress={() => handleSelectDhikr(index)}
            >
              <Text
                style={[
                  styles.dhikrChipText,
                  { color: isActive ? '#FFFFFF' : colors.text },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.centerContainer}>
        <Text style={[styles.dhikrLabel, { color: colors.text }]}>
          {selected.label}
        </Text>

        <TouchableOpacity
          style={[styles.counterButton, { borderColor: Colors.dark.secondary }]}
          activeOpacity={0.8}
          onPress={handleTap}
        >
          <Text style={[styles.countText, { color: colors.text }]}>
            {count}
          </Text>
          <Text style={[styles.targetText, { color: colors.icon }]}>
            / {selected.target}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.roundsText, { color: colors.icon }]}>
          Rounds completed: {rounds}
        </Text>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={[styles.resetText, { color: Colors.dark.secondary }]}>
            Reset
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  dhikrRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  dhikrChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dhikrChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  dhikrLabel: {
    fontSize: 20,
    fontWeight: '700',
  },
  counterButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 56,
    fontWeight: '700',
  },
  targetText: {
    fontSize: 16,
    fontWeight: '500',
  },
  roundsText: {
    fontSize: 14,
  },
  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  resetText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
