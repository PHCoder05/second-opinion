import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';

interface TabBarIconProps {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}

export function TabBarIcon({ name, color }: TabBarIconProps) {
  return <MaterialIcons size={24} name={name} color={color} />;
} 