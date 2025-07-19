import { MedicalColors } from '@/constants/Colors';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeInDown,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { IconSymbol } from './IconSymbol';

const { width: screenWidth } = Dimensions.get('window');

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  isSelected: boolean;
  isBooked: boolean;
  duration: number; // in minutes
}

interface TimeSlotPickerProps {
  selectedDate?: Date;
  availableSlots?: string[];
  bookedSlots?: string[];
  onTimeSelect?: (time: string) => void;
  selectedTime?: string;
  theme?: 'light' | 'dark';
  workingHours?: { start: string; end: string };
  slotDuration?: number; // in minutes
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedDate,
  availableSlots = [],
  bookedSlots = [],
  onTimeSelect,
  selectedTime,
  theme = 'light',
  workingHours = { start: '09:00', end: '17:00' },
  slotDuration = 30,
}) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(selectedTime || null);
  
  const selectionAnimation = useSharedValue(0);

  // Generate time slots based on working hours
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startTime = new Date(`2000-01-01T${workingHours.start}`);
    const endTime = new Date(`2000-01-01T${workingHours.end}`);
    
    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      const timeString = currentTime.toTimeString().slice(0, 5);
      const isAvailable = availableSlots.includes(timeString);
      const isBooked = bookedSlots.includes(timeString);
      const isSelected = selectedSlot === timeString;
      
      slots.push({
        id: timeString,
        time: timeString,
        available: isAvailable && !isBooked,
        isSelected,
        isBooked,
        duration: slotDuration,
      });
      
      // Add slot duration to current time
      currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
    }
    
    return slots;
  };

  useEffect(() => {
    setTimeSlots(generateTimeSlots());
  }, [selectedDate, availableSlots, bookedSlots, selectedSlot]);

  useEffect(() => {
    if (selectedSlot) {
      selectionAnimation.value = withSpring(1);
    } else {
      selectionAnimation.value = withTiming(0);
    }
  }, [selectedSlot]);

  const handleTimeSelect = (slot: TimeSlot) => {
    if (!slot.available || slot.isBooked) return;
    
    setSelectedSlot(slot.time);
    onTimeSelect?.(slot.time);
  };

  const getTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getSlotStatus = (slot: TimeSlot) => {
    if (slot.isBooked) return 'booked';
    if (slot.available) return 'available';
    return 'unavailable';
  };

  const getSlotColor = (slot: TimeSlot) => {
    const status = getSlotStatus(slot);
    switch (status) {
      case 'available':
        return MedicalColors.primary[600];
      case 'booked':
        return MedicalColors.error[600];
      case 'unavailable':
        return MedicalColors.neutral[400];
      default:
        return MedicalColors.neutral[400];
    }
  };

  const getSlotBackground = (slot: TimeSlot) => {
    if (slot.isSelected) {
      return MedicalColors.primary[600];
    }
    
    const status = getSlotStatus(slot);
    switch (status) {
      case 'available':
        return theme === 'dark' ? MedicalColors.neutral[800] : MedicalColors.neutral[50];
      case 'booked':
        return MedicalColors.error[50];
      case 'unavailable':
        return theme === 'dark' ? MedicalColors.neutral[900] : MedicalColors.neutral[100];
      default:
        return theme === 'dark' ? MedicalColors.neutral[900] : MedicalColors.neutral[100];
    }
  };

  const getSlotBorderColor = (slot: TimeSlot) => {
    if (slot.isSelected) {
      return MedicalColors.primary[600];
    }
    
    const status = getSlotStatus(slot);
    switch (status) {
      case 'available':
        return MedicalColors.primary[200];
      case 'booked':
        return MedicalColors.error[200];
      case 'unavailable':
        return MedicalColors.neutral[200];
      default:
        return MedicalColors.neutral[200];
    }
  };

  const renderTimeSlot = (slot: TimeSlot, index: number) => {
    const isDisabled = !slot.available || slot.isBooked;
    
    return (
      <Animated.View
        key={slot.id}
        style={[
          styles.slotContainer,
          { opacity: isDisabled ? 0.6 : 1 }
        ]}
        entering={FadeInDown.delay(index * 50)}
      >
        <TouchableOpacity
          style={[
            styles.timeSlot,
            {
              backgroundColor: getSlotBackground(slot),
              borderColor: getSlotBorderColor(slot),
            },
            slot.isSelected && styles.selectedSlot,
          ]}
          onPress={() => handleTimeSelect(slot)}
          disabled={isDisabled}
          activeOpacity={0.7}
        >
          <View style={styles.timeContent}>
            <Text style={[
              styles.timeText,
              {
                color: slot.isSelected 
                  ? '#FFFFFF' 
                  : theme === 'dark' 
                    ? MedicalColors.neutral[100] 
                    : MedicalColors.neutral[800],
              },
            ]}>
              {getTimeDisplay(slot.time)}
            </Text>
            
            <Text style={[
              styles.durationText,
              {
                color: slot.isSelected 
                  ? 'rgba(255,255,255,0.8)' 
                  : theme === 'dark' 
                    ? MedicalColors.neutral[400] 
                    : MedicalColors.neutral[600],
              },
            ]}>
              {slot.duration} min
            </Text>
          </View>
          
          {slot.isBooked && (
            <View style={styles.bookedIndicator}>
              <IconSymbol name="close" size={16} color={MedicalColors.error[600]} />
            </View>
          )}
          
          {slot.isSelected && (
            <View style={styles.selectedIndicator}>
              <IconSymbol name="check" size={16} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderLegend = () => (
    <View style={styles.legend}>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: MedicalColors.primary[600] }]} />
        <Text style={[
          styles.legendText,
          { color: theme === 'dark' ? MedicalColors.neutral[300] : MedicalColors.neutral[600] }
        ]}>
          Available
        </Text>
      </View>
      
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: MedicalColors.error[600] }]} />
        <Text style={[
          styles.legendText,
          { color: theme === 'dark' ? MedicalColors.neutral[300] : MedicalColors.neutral[600] }
        ]}>
          Booked
        </Text>
      </View>
      
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: MedicalColors.neutral[400] }]} />
        <Text style={[
          styles.legendText,
          { color: theme === 'dark' ? MedicalColors.neutral[300] : MedicalColors.neutral[600] }
        ]}>
          Unavailable
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme === 'dark' ? MedicalColors.neutral[900] : MedicalColors.neutral[50] }
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <IconSymbol name="schedule" size={20} color={MedicalColors.primary[600]} />
        <Text style={[
          styles.headerText,
          { color: theme === 'dark' ? MedicalColors.neutral[100] : MedicalColors.neutral[900] }
        ]}>
          Select Time
        </Text>
      </View>
      
      {/* Selected Date Display */}
      {selectedDate && (
        <View style={styles.dateDisplay}>
          <Text style={[
            styles.dateText,
            { color: theme === 'dark' ? MedicalColors.neutral[300] : MedicalColors.neutral[600] }
          ]}>
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
      )}
      
      {/* Time Slots Grid */}
      <ScrollView 
        style={styles.slotsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.slotsContent}
      >
        <View style={styles.slotsGrid}>
          {timeSlots.map((slot, index) => renderTimeSlot(slot, index))}
        </View>
      </ScrollView>
      
      {/* Legend */}
      {renderLegend()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: MedicalColors.neutral[200],
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
  },
  dateDisplay: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: MedicalColors.neutral[200],
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  slotsContainer: {
    maxHeight: 300,
  },
  slotsContent: {
    padding: 16,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  slotContainer: {
    width: '48%',
  },
  timeSlot: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 80,
  },
  selectedSlot: {
    shadowColor: MedicalColors.primary[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  timeContent: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bookedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: MedicalColors.error[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: MedicalColors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: MedicalColors.neutral[200],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default TimeSlotPicker; 