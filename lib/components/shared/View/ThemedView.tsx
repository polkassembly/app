import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/lib/hooks/useThemeColor';

export type ContainerType = 'background' | 'secondaryBackground' | 'container' | 'secondaryContainer'

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ContainerType;
};

export function ThemedView({ style, lightColor, darkColor, type = 'background', ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, type);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
