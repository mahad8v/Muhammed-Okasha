import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface Props {
  width?: number;
  height?: number;
  color?: string;
}

const FajrIcon = ({ width, height, color }: Props) => (
  <Svg
    width={width || 24}
    height={width || 24}
    className="icon"
    viewBox="0 0 1024 1024"
    fill={color}
  >
    <Path d="M32 768h960a32 32 0 1 1 0 64H32a32 32 0 1 1 0-64zm129.408-96a352 352 0 0 1 701.184 0h-64.32a288 288 0 0 0-572.544 0h-64.32zM512 128a32 32 0 0 1 32 32v96a32 32 0 0 1-64 0v-96a32 32 0 0 1 32-32zm407.296 168.704a32 32 0 0 1 0 45.248l-67.84 67.84a32 32 0 1 1-45.248-45.248l67.84-67.84a32 32 0 0 1 45.248 0zm-814.592 0a32 32 0 0 1 45.248 0l67.84 67.84a32 32 0 1 1-45.248 45.248l-67.84-67.84a32 32 0 0 1 0-45.248z" />
  </Svg>
);
export default FajrIcon;
