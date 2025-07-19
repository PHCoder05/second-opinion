import { MedicalColors } from '@/constants/Colors';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    FadeInDown,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { IconSymbol } from './IconSymbol';

const { width: screenWidth } = Dimensions.get('window');

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  availableDates?: string[];
  minDate?: Date;
  maxDate?: Date;
  theme?: 'light' | 'dark';
}

interface DayData {
  date: Date;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isAvailable: boolean;
  isPast: boolean;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  availableDates = [],
  minDate,
  maxDate,
  theme = 'light',
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<DayData[]>([]);
  
  const monthAnimation = useSharedValue(0);
  const selectedAnimation = useSharedValue(0);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonthIndex = today.getMonth();

  // Generate calendar days for current month
  const generateCalendarDays = (date: Date): DayData[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: DayData[] = [];
    const currentDate = new Date(startDate);
    
    // Generate 42 days (6 weeks) to ensure we have enough days
    for (let i = 0; i < 42; i++) {
      const dayDate = new Date(currentDate);
      const dayString = dayDate.toISOString().split('T')[0];
      
      days.push({
        date: dayDate,
        day: dayDate.getDate(),
        month: dayDate.getMonth(),
        year: dayDate.getFullYear(),
        isCurrentMonth: dayDate.getMonth() === month,
        isToday: dayDate.toDateString() === today.toDateString(),
        isSelected: selectedDate ? dayDate.toDateString() === selectedDate.toDateString() : false,
        isAvailable: availableDates.includes(dayString),
        isPast: dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  useEffect(() => {
    setCalendarDays(generateCalendarDays(currentMonth));
  }, [currentMonth, selectedDate, availableDates]);

  useEffect(() => {
    if (selectedDate) {
      selectedAnimation.value = withSpring(1);
    } else {
      selectedAnimation.value = withTiming(0);
    }
  }, [selectedDate]);

  const goToPreviousMonth = () => {
    monthAnimation.value = withTiming(-1, { duration: 300 });
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
    setTimeout(() => {
      monthAnimation.value = withTiming(0);
    }, 300);
  };

  const goToNextMonth = () => {
    monthAnimation.value = withTiming(1, { duration: 300 });
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
    setTimeout(() => {
      monthAnimation.value = withTiming(0);
    }, 300);
  };

  const handleDateSelect = (day: DayData) => {
    if (day.isPast || !day.isAvailable) return;
    
    onDateSelect?.(day.date);
  };

  const monthAnimationStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          monthAnimation.value,
          [-1, 0, 1],
          [-screenWidth, 0, screenWidth]
        ),
      },
    ],
    opacity: interpolate(
      monthAnimation.value,
      [-1, 0, 1],
      [0.5, 1, 0.5]
    ),
  }));

  const selectedAnimationStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          selectedAnimation.value,
          [0, 1],
          [1, 1.1]
        ),
      },
    ],
  }));

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getDayName = (dayIndex: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex];
  };

  const renderDayHeader = () => (
    <View style={styles.dayHeader}>
      {Array.from({ length: 7 }, (_, i) => (
        <View key={i} style={styles.dayHeaderCell}>
          <Text style={[
            styles.dayHeaderText,
            { color: theme === 'dark' ? MedicalColors.neutral[300] : MedicalColors.neutral[600] }
          ]}>
            {getDayName(i)}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderCalendarDay = (day: DayData, index: number) => {
    const isDisabled = day.isPast || !day.isAvailable;
    const isToday = day.isToday;
    const isSelected = day.isSelected;
    
    return (
      <Animated.View
        key={index}
        style={[
          styles.dayCell,
          isSelected && selectedAnimationStyle,
        ]}
        entering={FadeInDown.delay(index * 10)}
      >
        <TouchableOpacity
          style={[
            styles.dayButton,
            isToday && styles.todayButton,
            isSelected && styles.selectedButton,
            isDisabled && styles.disabledButton,
          ]}
          onPress={() => handleDateSelect(day)}
          disabled={isDisabled}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.dayText,
            !day.isCurrentMonth && styles.otherMonthText,
            isToday && styles.todayText,
            isSelected && styles.selectedText,
            isDisabled && styles.disabledText,
          ]}>
            {day.day}
          </Text>
          
          {day.isAvailable && !day.isPast && (
            <View style={styles.availableIndicator} />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme === 'dark' ? MedicalColors.neutral[900] : MedicalColors.neutral[50] }
    ]}>
      {/* Calendar Header */}
      <View style={[
        styles.header,
        { backgroundColor: theme === 'dark' ? MedicalColors.neutral[800] : MedicalColors.neutral[100] }
      ]}>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={goToPreviousMonth}
          activeOpacity={0.7}
        >
          <IconSymbol name="chevron-left" size={24} color={MedicalColors.primary[600]} />
        </TouchableOpacity>
        
        <Animated.Text
          style={[
            styles.monthText,
            monthAnimationStyle,
            { color: theme === 'dark' ? MedicalColors.neutral[100] : MedicalColors.neutral[900] }
          ]}
        >
          {getMonthName(currentMonth)}
        </Animated.Text>
        
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={goToNextMonth}
          activeOpacity={0.7}
        >
          <IconSymbol name="chevron-right" size={24} color={MedicalColors.primary[600]} />
        </TouchableOpacity>
      </View>

      {/* Day Headers */}
      {renderDayHeader()}

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => renderCalendarDay(day, index))}
      </View>

      {/* Legend */}
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
          <View style={[styles.legendDot, { backgroundColor: MedicalColors.neutral[400] }]} />
          <Text style={[
            styles.legendText,
            { color: theme === 'dark' ? MedicalColors.neutral[300] : MedicalColors.neutral[600] }
          ]}>
            Unavailable
          </Text>
        </View>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: MedicalColors.neutral[200],
  },
  navigationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MedicalColors.neutral[50],
  },
  monthText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  dayHeader: {
    flexDirection: 'row',
    backgroundColor: MedicalColors.neutral[50],
    borderBottomWidth: 1,
    borderBottomColor: MedicalColors.neutral[200],
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
  },
  dayButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
    color: MedicalColors.neutral[800],
  },
  otherMonthText: {
    color: MedicalColors.neutral[400],
  },
  todayButton: {
    backgroundColor: MedicalColors.primary[100],
    borderWidth: 2,
    borderColor: MedicalColors.primary[600],
  },
  todayText: {
    color: MedicalColors.primary[700],
    fontWeight: '700',
  },
  selectedButton: {
    backgroundColor: MedicalColors.primary[600],
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.3,
  },
  disabledText: {
    color: MedicalColors.neutral[400],
  },
  availableIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: MedicalColors.success[600],
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 24,
    borderTopWidth: 1,
    borderTopColor: MedicalColors.neutral[200],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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

export default Calendar; 