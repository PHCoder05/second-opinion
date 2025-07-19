import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';

type IconFamilyType = 'material' | 'material-community';

interface IconSymbolProps {
  name: string;
  size?: number;
  color?: string;
  family?: IconFamilyType;
}

const iconMap = {
  // Health & Medical
  'favorite': { family: 'material', name: 'favorite' },
  'monitor-heart': { family: 'material', name: 'favorite' }, // fallback as monitor-heart doesn't exist
  'monitor_heart': { family: 'material', name: 'favorite' }, // fallback as monitor-heart doesn't exist
  'monitor-weight': { family: 'material', name: 'scale' },
  'bedtime': { family: 'material', name: 'bedtime' },
  'medical-services': { family: 'material', name: 'local-hospital' }, // medical-services doesn't exist
  'medical_services': { family: 'material', name: 'local-hospital' }, // medical-services doesn't exist
  'description': { family: 'material', name: 'description' },
  'school': { family: 'material', name: 'school' },
  'air': { family: 'material', name: 'air' },
  'thermostat': { family: 'material', name: 'thermostat' },
  'medication': { family: 'material', name: 'medication' },
  'healing': { family: 'material', name: 'healing' },
  'water-drop': { family: 'material', name: 'water-drop' },
  'water_drop': { family: 'material', name: 'water-drop' },
  'fitness-center': { family: 'material', name: 'fitness-center' },
  'directions-walk': { family: 'material', name: 'directions-walk' },
  'directions-run': { family: 'material', name: 'directions-run' },
  
  // Navigation & UI
  'account-circle': { family: 'material', name: 'account-circle' },
  'account_circle': { family: 'material', name: 'account-circle' },
  'person': { family: 'material', name: 'person' },
  'people': { family: 'material', name: 'people' },
  'group': { family: 'material', name: 'group' },
  'cancel': { family: 'material', name: 'cancel' },
  'send': { family: 'material', name: 'send' },
  'message': { family: 'material', name: 'message' },
  'menu-book': { family: 'material', name: 'menu-book' },
  'palette': { family: 'material', name: 'palette' },
  'flash-on': { family: 'material', name: 'flash-on' },
  'radio-button-checked': { family: 'material', name: 'radio-button-checked' },
  'circle': { family: 'material', name: 'circle' },
  'looks-one': { family: 'material', name: 'looks-one' },
  'looks-two': { family: 'material', name: 'looks-two' },
  'looks-3': { family: 'material', name: 'looks-3' },
  'person-add': { family: 'material', name: 'person-add' },
  'favorite-border': { family: 'material', name: 'favorite-border' },
  'list-alt': { family: 'material', name: 'list-alt' },
  'local-hospital': { family: 'material', name: 'local-hospital' },
  'local_hospital': { family: 'material', name: 'local-hospital' }, // Fix: add underscore version
  'scale': { family: 'material', name: 'scale' },
  'settings': { family: 'material', name: 'settings' },
  'notifications': { family: 'material', name: 'notifications' },
  'warning': { family: 'material', name: 'warning' },
  'phone': { family: 'material', name: 'phone' },
  'location-on': { family: 'material', name: 'location-on' },
  'videocam': { family: 'material', name: 'videocam' },
  'home': { family: 'material', name: 'home' },
  'search': { family: 'material', name: 'search' },
  'chat': { family: 'material', name: 'chat' },
  'chevron-right': { family: 'material', name: 'chevron-right' },
  'chevron_right': { family: 'material', name: 'chevron-right' },
  'chevron-left': { family: 'material', name: 'chevron-left' },
  'chevron_left': { family: 'material', name: 'chevron-left' },
  'chevron.right': { family: 'material', name: 'chevron-right' },
  'chevron.left': { family: 'material', name: 'chevron-left' },
  'chevron.up': { family: 'material', name: 'keyboard-arrow-up' }, // Fix: add chevron.up mapping
  'chevron.down': { family: 'material', name: 'keyboard-arrow-down' }, // Fix: add chevron.down mapping
  'group': { family: 'material', name: 'group' },
  'access-time': { family: 'material', name: 'access-time' },
  'schedule': { family: 'material', name: 'schedule' },
  'verified': { family: 'material', name: 'verified' },
  'verified-user': { family: 'material', name: 'verified-user' },
  'verified_user': { family: 'material', name: 'verified-user' },
  'check-circle': { family: 'material', name: 'check-circle' },
  'arrow-upward': { family: 'material', name: 'arrow-upward' },
  'arrow-downward': { family: 'material', name: 'arrow-downward' },
  'arrow-forward': { family: 'material', name: 'arrow-forward' },
  'arrow_forward': { family: 'material', name: 'arrow-forward' },
  'arrow_circle_right': { family: 'material', name: 'arrow-circle-right' },
  'monitor_heart': { family: 'material', name: 'monitor-heart' },
  'water_drop': { family: 'material', name: 'water-drop' },
  'psychology': { family: 'material', name: 'psychology' },
  'star': { family: 'material', name: 'star' },
  'photo': { family: 'material', name: 'photo' },
  'photo_camera': { family: 'material', name: 'photo-camera' },
  'science': { family: 'material', name: 'science' },
  'assignment': { family: 'material', name: 'assignment' },
  
  // SF Symbol fallbacks to Material Design
  'heart.fill': { family: 'material', name: 'favorite' },
  'person.fill': { family: 'material', name: 'person' },
  'person.2.fill': { family: 'material', name: 'people' },
  'person.3.fill': { family: 'material', name: 'group' },
  'person.2': { family: 'material', name: 'people' },
  'person.badge.plus': { family: 'material', name: 'person-add' },
  'checkmark.circle': { family: 'material', name: 'check-circle' },
  'checkmark.circle.fill': { family: 'material', name: 'check-circle' },
  'checkmark.shield': { family: 'material', name: 'verified-user' },
  'exclamationmark.triangle.fill': { family: 'material', name: 'warning' },
  'exclamationmark.triangle': { family: 'material', name: 'warning' }, // Fix: add exclamationmark.triangle mapping
  'exclamationmark.circle': { family: 'material', name: 'error' }, // Fix: add exclamationmark.circle mapping
  'clock.fill': { family: 'material', name: 'schedule' },
  'clock': { family: 'material', name: 'schedule' },
  'eye.fill': { family: 'material', name: 'visibility' },
  'eye.slash.fill': { family: 'material', name: 'visibility-off' },
  'trash.fill': { family: 'material', name: 'delete' },
  'xmark.circle.fill': { family: 'material', name: 'cancel' },
  'paperplane.fill': { family: 'material', name: 'send' },
  'message.fill': { family: 'material', name: 'message' },
  'book.fill': { family: 'material', name: 'menu-book' },
  'paintbrush.fill': { family: 'material', name: 'palette' },
  'bolt.fill': { family: 'material', name: 'flash-on' },
  'phone.fill': { family: 'material', name: 'phone' },
  'envelope.fill': { family: 'material', name: 'email' },
  'largecircle.fill.circle': { family: 'material', name: 'radio-button-checked' },
  'circle.fill': { family: 'material', name: 'circle' },
  '1.circle.fill': { family: 'material', name: 'looks-one' },
  '2.circle.fill': { family: 'material', name: 'looks-two' },
  '3.circle.fill': { family: 'material', name: 'looks-3' },
  'figure.walk': { family: 'material', name: 'directions-walk' },
  'figure.wave': { family: 'material', name: 'waving-hand' }, // Fix: add missing mapping
  'list.bullet.clipboard': { family: 'material', name: 'list-alt' },
  'arrow.clockwise': { family: 'material', name: 'refresh' },
  'heart': { family: 'material', name: 'favorite-border' },
  'minus': { family: 'material', name: 'remove' },
  
  // Logout and navigation icons
  'rectangle.portrait.and.arrow.right': { family: 'material', name: 'logout' },
  'logout': { family: 'material', name: 'logout' },
  'arrow.right': { family: 'material', name: 'arrow-forward' },
  'arrow.left': { family: 'material', name: 'arrow-back' },
  'arrow.up': { family: 'material', name: 'arrow-upward' },
  'arrow.down': { family: 'material', name: 'arrow-downward' },
  
  // Additional missing icons
  'doc.fill': { family: 'material', name: 'description' },
  'shield.fill': { family: 'material', name: 'verified-user' },
  'star.fill': { family: 'material', name: 'star' },
  'cpu': { family: 'material', name: 'memory' },
  'crown.fill': { family: 'material', name: 'star' },
  'lock.fill': { family: 'material', name: 'lock' },
  'questionmark.circle': { family: 'material', name: 'help' },
  
  // Additional missing icons from warnings
  'check_circle': { family: 'material', name: 'check-circle' },
  'video_call': { family: 'material', name: 'videocam' },
  'record_voice_over': { family: 'material', name: 'record-voice-over' },
  'folder_shared': { family: 'material', name: 'folder-shared' },
  'event_note': { family: 'material', name: 'event-note' },
  'play_circle': { family: 'material', name: 'play-circle' },
  'brightness_4': { family: 'material', name: 'brightness-4' },
  'check_circle': { family: 'material', name: 'check-circle' },
  'rectangle.portrait.and.arrow.right': { family: 'material', name: 'logout' },
  'questionmark.circle': { family: 'material', name: 'help' },
  'doc.fill': { family: 'material', name: 'description' },
  'shield.fill': { family: 'material', name: 'verified-user' },
  'star.fill': { family: 'material', name: 'star' },
  'cpu': { family: 'material', name: 'memory' },
  'crown.fill': { family: 'material', name: 'star' },
  'lock.fill': { family: 'material', name: 'lock' },
  'add_circle': { family: 'material', name: 'add-circle' },
  'history': { family: 'material', name: 'history' },
  'attach-money': { family: 'material', name: 'attach-money' },
  'medical-services': { family: 'material', name: 'local-hospital' },
  'today': { family: 'material', name: 'today' },
  'event_available': { family: 'material', name: 'event-available' },
  'videocam': { family: 'material', name: 'videocam' },
  'local_hospital': { family: 'material', name: 'local-hospital' },
  'verified': { family: 'material', name: 'verified-user' },
  'notifications': { family: 'material', name: 'notifications' },
  'close': { family: 'material', name: 'close' },
  
  // Status & Actions
  'check': { family: 'material', name: 'check' },
  'close': { family: 'material', name: 'close' },
  'add': { family: 'material', name: 'add' },
  'remove': { family: 'material', name: 'remove' },
  'edit': { family: 'material', name: 'edit' },
  'delete': { family: 'material', name: 'delete' },
  'refresh': { family: 'material', name: 'refresh' },
  'more-vert': { family: 'material', name: 'more-vert' },
  'more-horiz': { family: 'material', name: 'more-horiz' },
  'menu': { family: 'material', name: 'menu' },
  
  // Form & Input
  'visibility': { family: 'material', name: 'visibility' },
  'visibility-off': { family: 'material', name: 'visibility-off' },
  'calendar-today': { family: 'material', name: 'calendar-today' },
  'calendar': { family: 'material', name: 'calendar-today' }, // Fix: add calendar mapping
  'today': { family: 'material', name: 'today' }, // Fix: add today mapping
  'event_available': { family: 'material', name: 'event-available' }, // Fix: add event_available mapping
  'event': { family: 'material', name: 'event' },
  'attach-file': { family: 'material', name: 'attach-file' },
  'photo-camera': { family: 'material', name: 'photo-camera' },
  'image': { family: 'material', name: 'image' },
  
  // Communication
  'email': { family: 'material', name: 'email' },
  'phone-enabled': { family: 'material', name: 'phone-enabled' },
  'message': { family: 'material', name: 'message' },
  'forum': { family: 'material', name: 'forum' },
  'share': { family: 'material', name: 'share' },
  
  // Additional Medical Icons from Material Community
  'stethoscope': { family: 'material-community', name: 'stethoscope' },
  'pill': { family: 'material-community', name: 'pill' },
  'medical-bag': { family: 'material-community', name: 'medical-bag' },
  'heart-pulse': { family: 'material-community', name: 'heart-pulse' },
  'brain': { family: 'material-community', name: 'brain' },
  'stomach': { family: 'material-community', name: 'stomach' },
  'lungs': { family: 'material-community', name: 'lungs' },
  'bandage': { family: 'material-community', name: 'bandage' },
  'hospital': { family: 'material-community', name: 'hospital' },
  'ambulance': { family: 'material-community', name: 'ambulance' },
  'dna': { family: 'material-community', name: 'dna' },
  'microscope': { family: 'material-community', name: 'microscope' },
  
  // Fix: Add missing icon mappings
  'arrow.up.circle': { family: 'material', name: 'keyboard-arrow-up' }, // Fallback for arrow.up.circle
  'person.circle': { family: 'material', name: 'account-circle' }, // Fallback for person.circle
  'xmark': { family: 'material', name: 'close' }, // Fix: add xmark mapping
  'checkmark': { family: 'material', name: 'check' }, // Fix: add checkmark mapping
  'trending_flat': { family: 'material', name: 'trending-flat' }, // Fix: add trending_flat mapping
  'trending_up': { family: 'material', name: 'trending-up' }, // Fix: add trending_up mapping
  'trending_down': { family: 'material', name: 'trending-down' }, // Fix: add trending_down mapping
  'directions_walk': { family: 'material', name: 'directions-walk' }, // Fix: add directions_walk mapping
  'local_fire_department': { family: 'material', name: 'local-fire-department' }, // Fix: add local_fire_department mapping
  'fitness_center': { family: 'material', name: 'fitness-center' }, // Fix: add fitness_center mapping
  'self_improvement': { family: 'material', name: 'self-improvement' }, // Fix: add self_improvement mapping
  'emergency': { family: 'material', name: 'emergency' }, // Fix: add emergency mapping
  'smart_toy': { family: 'material', name: 'smart-toy' }, // Fix: add smart_toy mapping
  'support_agent': { family: 'material', name: 'support-agent' }, // Fix: add support_agent mapping
  'more_vert': { family: 'material', name: 'more-vert' }, // Fix: add more_vert mapping
  'history': { family: 'material', name: 'history' }, // Fix: add history mapping
  'add_circle': { family: 'material', name: 'add-circle' }, // Fix: add add_circle mapping
  'explore': { family: 'material', name: 'explore' }, // Fix: add explore mapping
  'category': { family: 'material', name: 'category' }, // Fix: add category mapping
  'build': { family: 'material', name: 'build' }, // Fix: add build mapping
};

export function IconSymbol({ name, size = 24, color = '#000000', family = 'material' }: IconSymbolProps) {
  // First try to get the mapped icon
  const iconInfo = iconMap[name];
  
  if (iconInfo) {
    // If we have a mapping, use it
    try {
      switch (iconInfo.family) {
        case 'material-community':
          return <MaterialCommunityIcons name={iconInfo.name} size={size} color={color} />;
        default:
          return <MaterialIcons name={iconInfo.name} size={size} color={color} />;
      }
    } catch (error) {
      console.warn(`Failed to render mapped icon ${name}:`, error);
    }
  }
  
  // If no mapping exists or the mapped icon failed, try to use the name directly
  try {
    if (family === 'material-community') {
      return <MaterialCommunityIcons name={name} size={size} color={color} />;
    } else {
      return <MaterialIcons name={name} size={size} color={color} />;
    }
  } catch (error) {
    console.warn(`Failed to render icon ${name} directly:`, error);
    // Fallback to a default icon if everything fails
    return <MaterialIcons name="help" size={size} color={color} />;
  }
}

export default IconSymbol;
