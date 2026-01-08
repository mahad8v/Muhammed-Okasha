import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface Props {
  width?: number;
  height?: number;
  color?: string;
}

export default function FigIcon({ width, height, color }: Props) {
  return (
    <Svg
      width={width || 24}
      height={height || 24}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth="2" />
      <Path
        d="M12 6v6l3 3"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}
