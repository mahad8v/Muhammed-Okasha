import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';
interface Props {
  width?: number;
  height?: number;
  color?: string;
}
const DhuhrIcon = ({ width, height, color }: Props) => (
  <Svg
    width={width || 24}
    height={height || 24}
    fill="none"
    viewBox="0 0 24 24"
  >
    <Circle cx={12} cy={12} r={6} stroke={color} strokeWidth={1.5} />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M12 2v1M12 21v1M22 12h-1M3 12H2"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeWidth={1.5}
      d="m19.07 4.93-.392.393M5.322 18.678l-.393.393M19.07 19.07l-.392-.393M5.322 5.322l-.393-.393"
      opacity={0.5}
    />
  </Svg>
);
export default DhuhrIcon;
