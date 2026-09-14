import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface Props {
  width?: number;
  height?: number;
  color?: string;
}

const TafsirIcon = ({ width = 24, color }: Props) => (
  <Ionicons name="reader-outline" size={width} color={color} />
);

export default TafsirIcon;
