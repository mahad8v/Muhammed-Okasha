import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface Props {
  width?: number;
  height?: number;
  color?: string;
}

const BackIcon = ({ width, height, color }: Props) => (
  <Svg
    width={width || 24}
    height={height || 24}
    fill={color}
    viewBox="0 -960 960 960"
  >
    <Path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
  </Svg>
);
export default BackIcon;
