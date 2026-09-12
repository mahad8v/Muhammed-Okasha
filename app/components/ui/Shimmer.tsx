import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { DimensionValue, StyleSheet, View, useColorScheme } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface ShimmerProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: object;
}

const BAND_WIDTH = 120;

export const Shimmer: React.FC<ShimmerProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}) => {
  const colorScheme = useColorScheme();
  type ColorSchemeKey = keyof typeof Colors;
  const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
  const colors = Colors[scheme];

  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useSharedValue(-BAND_WIDTH);

  useEffect(() => {
    if (containerWidth === 0) return;

    translateX.value = -BAND_WIDTH;
    translateX.value = withRepeat(
      withTiming(containerWidth + BAND_WIDTH, {
        duration: 1100,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [containerWidth, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const highlightColor =
    scheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.75)';

  return (
    <View
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
      style={[
        styles.base,
        { width, height, borderRadius, backgroundColor: colors.cardBgAlt },
        style,
      ]}
    >
      {containerWidth > 0 && (
        <Animated.View style={[styles.band, animatedStyle]}>
          <LinearGradient
            colors={['transparent', highlightColor, 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  band: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: BAND_WIDTH,
  },
});
