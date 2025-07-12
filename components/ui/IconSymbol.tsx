// Fallback for using MaterialIcons on Android and web.

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialCommunityIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Basic navigation
  'house.fill': 'home',
  'house': 'home-outline',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code-tags',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'arrow.left': 'arrow-left',
  'arrow.right': 'arrow-right',
  
  // Authentication
  'email': 'email-outline',
  'lock': 'lock-outline',
  'eye': 'eye-outline',
  'eye-off': 'eye-off-outline',
  'facebook': 'facebook',
  'google': 'google',
  'apple': 'apple',
  'alert-circle-outline': 'alert-circle-outline',
  
  // Health & Medical
  'heart.fill': 'heart',
  'heart': 'heart-outline',
  'stethoscope': 'stethoscope',
  'pills.fill': 'pill',
  'pills': 'pill',
  'brain.head.profile': 'brain',
  'waveform.path.ecg': 'heart-pulse',
  'figure.walk': 'walk',
  'heart.text.square.fill': 'heart-plus',
  
  // Documents & Records
  'doc.text.fill': 'file-document',
  'doc.text': 'file-document-outline',
  'doc.badge.plus': 'file-plus',
  'doc.text.magnifyingglass': 'file-search',
  'folder.fill': 'folder',
  'folder': 'folder-outline',
  
  // Communication
  'message.fill': 'message',
  'message': 'message-outline',
  'bubble.left.and.bubble.right.fill': 'chat',
  'phone.fill': 'phone',
  'phone': 'phone-outline',
  
  // Calendar & Time
  'calendar.badge.plus': 'calendar-plus',
  'calendar': 'calendar-outline',
  'clock.fill': 'clock',
  'clock': 'clock-outline',
  
  // People & Users
  'person.fill': 'account',
  'person': 'account-outline',
  'person.2.fill': 'account-multiple',
  'person.2': 'account-multiple-outline',
  'person.3.fill': 'account-group',
  'person.3': 'account-group-outline',
  'person.crop.circle.fill': 'account-circle',
  'person.crop.circle': 'account-circle-outline',
  
  // Interface Elements
  'square.grid.3x3.fill': 'grid',
  'square.grid.3x3': 'grid-large',
  'ellipsis.circle.fill': 'dots-horizontal-circle',
  'ellipsis.circle': 'dots-horizontal-circle-outline',
  'plus.circle.fill': 'plus-circle',
  'plus.circle': 'plus-circle-outline',
  'plus': 'plus',
  'minus': 'minus',
  'xmark': 'close',
  'checkmark': 'check',
  'checkmark.circle.fill': 'check-circle',
  'checkmark.circle': 'check-circle-outline',
  
  // Search & Analysis
  'magnifyingglass.circle.fill': 'magnify',
  'magnifyingglass': 'magnify',
  'chart.bar.fill': 'chart-bar',
  'chart.bar': 'chart-bar',
  'list.bullet.clipboard.fill': 'clipboard-list',
  'list.bullet.clipboard': 'clipboard-list-outline',
  
  // Education & Learning
  'book.closed.fill': 'book',
  'book.closed': 'book-outline',
  'graduation.cap.fill': 'school',
  'graduation.cap': 'school-outline',
  
  // Miscellaneous
  'sparkles': 'auto-fix',
  'gear': 'cog',
  'gear.fill': 'cog',
  'info.circle': 'information-outline',
  'info.circle.fill': 'information',
  'exclamationmark.triangle': 'alert-triangle',
  'exclamationmark.triangle.fill': 'alert-triangle',
  'shield.checkmark': 'shield-check',
  'shield.checkmark.fill': 'shield-check',
  'location.fill': 'map-marker',
  'location': 'map-marker-outline',
  
  // Additional icons for app flow guide
  'person.badge.plus': 'account-plus',
  'hand.wave.fill': 'hand-wave',
  'list.number': 'format-list-numbered',
  'video': 'video-outline',
  'lock.shield': 'shield-lock',
  'arrow.triangle.branch': 'source-branch',
  'text.bubble': 'comment-text',
  'text.bubble.fill': 'comment-text',
  'questionmark.circle': 'help-circle',
  'person.crop.circle.badge.checkmark': 'account-check',
  'text.alignleft': 'format-align-left',
  'checkmark.seal.fill': 'certificate',
  'square.and.arrow.up': 'export',
  'map': 'map-outline',
  'chevron.up': 'chevron-up',
  'chevron.down': 'chevron-down',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconName = MAPPING[name];
  if (!iconName) {
    return null;
  }

  return <MaterialCommunityIcons color={color} size={size} name={iconName} style={style} />;
}
