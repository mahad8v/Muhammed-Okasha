import { Colors } from '@/constants/theme';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ZAKAT_RATE = 0.025;

const formatWithCommas = (value: string): string => {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const [integerPart, ...rest] = cleaned.split('.');
  const withCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (rest.length === 0) {
    return withCommas;
  }

  const decimalPart = rest.join('').slice(0, 2);
  return `${withCommas}.${decimalPart}`;
};

export default function ZakatScreen() {
  const colorScheme = useColorScheme();
  type ColorSchemeKey = keyof typeof Colors;
  const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
  const colors = Colors[scheme];

  const [assetsInput, setAssetsInput] = useState('');

  const totalAssets = useMemo(() => {
    const parsed = parseFloat(assetsInput.replace(/,/g, ''));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }, [assetsInput]);

  const zakatDue = totalAssets * ZAKAT_RATE;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView
        edges={['bottom']}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.heading, { color: colors.text }]}>
          Zakat Calculator
        </Text>

        <View style={styles.content}>
          <Text style={[styles.label, { color: colors.text }]}>
            Total zakatable wealth
          </Text>
          <Text style={[styles.helperText, { color: colors.icon }]}>
            Cash, savings, gold/silver value, and business assets held for a
            full lunar year, above the nisab threshold.
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colors.cardBgAlt,
                backgroundColor: colors.cardBg,
              },
            ]}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={colors.icon}
            value={assetsInput}
            onChangeText={(text) => setAssetsInput(formatWithCommas(text))}
          />

          <View style={[styles.resultCard, { backgroundColor: colors.cardBg }]}>
            <Text style={[styles.resultLabel, { color: colors.icon }]}>
              Zakat due (2.5%)
            </Text>
            <Text style={[styles.resultValue, { color: Colors.dark.secondary }]}>
              {zakatDue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>

          <Text style={[styles.disclaimer, { color: colors.icon }]}>
            This is a simple estimate. Confirm the current nisab threshold and
            your specific situation with a knowledgeable scholar before
            paying.
          </Text>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
  content: {
    padding: 20,
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: '600',
  },
  resultCard: {
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 4,
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  disclaimer: {
    fontSize: 11,
    marginTop: 16,
    lineHeight: 16,
  },
});
