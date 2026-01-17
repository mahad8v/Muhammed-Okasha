import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import React, { Children } from 'react';
import { Colors } from '@/constants/theme';

interface cardProps {
  children: React.ReactNode;
}

const Card = ({ children }: cardProps) => {
  const colorScheme = useColorScheme();
  type ColorSchemeKey = keyof typeof Colors;
  const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
  const colors = Colors[scheme];

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
      {children}
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },
});
