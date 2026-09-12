import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';
import Card from '@/components/card';

interface FeatureCardProps {
  icon: React.ComponentType<any>;
  title: string;
  subtitle: string;
  colors: any;
  onPress?: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  subtitle,
  colors,
  onPress,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} disabled={!onPress}>
      <Card>
        <View style={styles.container}>
          <View style={styles.iconWrapper}>
            <Icon width={27} height={27} color={colors.secondary} />
          </View>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={[styles.subtitle, { color: colors.text }]}>
              {subtitle}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconWrapper: {
    borderRightColor: '#cccccc9f',
    borderRightWidth: 0.4,
    paddingRight: 7,
  },
  title: {
    color: Colors.dark.secondary,
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
  },
});
