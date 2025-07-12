import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import * as Haptics from 'expo-haptics';

interface HealthGoalCardProps {
  id: string;
  title: string;
  icon: string;
  iconColor: string;
  backgroundColor: string;
  isSelected: boolean;
  onPress: (id: string) => void;
}

const HealthGoalCard: React.FC<HealthGoalCardProps> = ({
  id,
  title,
  icon,
  iconColor,
  backgroundColor,
  isSelected,
  onPress,
}) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(id);
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.cardSelected,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.info}>
          <View style={[styles.iconContainer, { backgroundColor }]}>
            <IconSymbol
              name={icon}
              size={24}
              color={iconColor}
            />
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>
        
        <View style={styles.radioContainer}>
          {isSelected ? (
            <IconSymbol
              name="largecircle.fill.circle"
              size={24}
              color="rgb(132, 204, 22)"
            />
          ) : (
            <View style={styles.radioEmpty} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 27,
    padding: 12,
    shadowColor: 'rgba(47, 60, 51, 0.05)',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  cardSelected: {
    borderWidth: 1,
    borderColor: 'rgb(132, 204, 22)',
    shadowColor: 'rgba(132, 204, 22, 0.25)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgb(49, 58, 52)',
    flex: 1,
  },
  radioContainer: {
    marginLeft: 16,
  },
  radioEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(162, 169, 164, 0.8)',
  },
});

export default HealthGoalCard; 