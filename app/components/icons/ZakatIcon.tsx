import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface Props {
  width?: number;
  height?: number;
  color?: string;
}

const ZakatIcon = ({ width = 24, color }: Props) => (
  <Ionicons name="cash-outline" size={width} color={color} />
);

export default ZakatIcon;
