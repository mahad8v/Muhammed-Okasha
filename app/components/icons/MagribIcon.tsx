import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface Props {
  width?: number;
  height?: number;
  color?: string;
}

const MagribIcon = ({ width, height, color }: Props) => (
  <Svg
    width={width || 24}
    height={height || 24}
    fill="none"
    viewBox="0 0 24 24"
  >
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 22h8M5 19h14M2 16h20"
    />
    <Path
      stroke={color}
      strokeWidth={1.5}
      d="M12 6a6 6 0 0 0-4.5 9.969h9A6 6 0 0 0 12 6Z"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M12 2v1M22 12h-1M3 12H2M19.07 4.93l-.392.393M5.322 5.322l-.393-.393"
    />
  </Svg>
);
export default MagribIcon;
