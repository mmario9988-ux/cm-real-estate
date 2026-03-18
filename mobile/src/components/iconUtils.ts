import React from 'react';
import { SvgProps } from 'react-native-svg';

// Wrapper type to ensure color prop compatibility with lucide-react-native
// lucide-react-native icons extend SvgProps which includes color,
// but TypeScript may not always resolve it correctly
export interface IconProps {
  size?: number;
  color?: string;
}

export const iconProps = (size: number, color: string): SvgProps & { size: number } => ({
  size,
  color: color as any,
});
