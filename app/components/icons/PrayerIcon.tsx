import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';
interface Props {
  width: number;
  height: number;
  color: string;
}
const PrayerIcon = ({ width, height, color }: Props) => (
  <Svg
    width={width || 24}
    height={height || 24}
    viewBox="0 0 64 64"
    fill="none"
  >
    <Path
      d="M34 43h18l6 18H6l6-18h8.771"
      style={{
        fill: 'none',
        stroke: color,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
      }}
    />
    <Circle cx={13} cy={27} r={1} />
    <Path
      d="M52 7v3M52 14v3M50 12h-3M57 12h-3"
      style={{
        fill: 'none',
        stroke: color,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
      }}
    />
    <Circle cx={43} cy={4} r={1} />
    <Path
      d="M31.157 24.206 30 19"
      style={{
        fill: '#e7d1c4',
        stroke: color,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
      }}
    />
    <Path
      d="M21.585 10a5.359 5.359 0 0 0 .154 1.556l1.154 4.644a4.093 4.093 0 0 0 1.7 2.435h0l-3.32 21.676L21 43.994a5.594 5.594 0 0 0 5.23 5.582L33 50l-18 3-3.029 3h26.544A6.485 6.485 0 0 0 45 49.315a6.666 6.666 0 0 0-6.754-6.286h-4.775l.4-4.587a9.375 9.375 0 0 0-.016-1.812M28.59 18.911l4.823-1.234-1.838-8.45a4.988 4.988 0 0 0-.461-1.184"
      style={{
        fill: 'none',
        stroke: color,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
      }}
    />
    <Path
      d="M21.9 4.094h7.23a2.071 2.071 0 0 1 2.07 2.072v2.928h0-11.367 0V6.166A2.071 2.071 0 0 1 21.9 4.094Z"
      style={{
        fill: 'none',
        stroke: color,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
      }}
      transform="rotate(-11.102 25.518 6.593)"
    />
    <Path
      d="m45.268 32.841-1.709-3.378"
      style={{
        fill: '#6b4f5b',
        stroke: color,
        strokeLinejoin: 'round',
        strokeWidth: 2,
      }}
    />
    <Path
      d="M49.743 27.835a1.411 1.411 0 0 0-1.738-.448l-4.446 2.076-6.5 3.035-5.707-7.836c-1.039-1.426-2.786-1.923-3.9-1.11h0c-1.116.813-1.179 2.628-.14 4.054l6.09 8.361c1.451 1.992 3.891 2.686 5.45 1.551l6.421-4.677 4.165-3.034a1.413 1.413 0 0 0 .305-1.972ZM38 50h-2M60 52h-5M63 61h-5M56 43h-4M4 52h5M1 61h5M8 43h4"
      style={{
        fill: 'none',
        stroke: color,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
      }}
    />
  </Svg>
);
export default PrayerIcon;
