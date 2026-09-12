import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface Props {
  width?: number;
  height?: number;
  color?: string;
}

const HadithIcon = ({ width = 24, color }: Props) => (
  <Ionicons name="book-outline" size={width} color={color} />
);

export default HadithIcon;
