import { AppointmentScreenLayout } from '@/components/layout/AppointmentScreenLayout';
import { Button, Calendar, Card, IconSymbol, TimeSlotPicker } from '@/components/ui';
import { MedicalColors, MedicalGradients } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    SlideInDown,
    SlideInUp,
    ZoomIn
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

// Mock data for available dates and times
const AVAILABLE_DATA = {
  dates: [
    '2024-01-16',
    '2024-01-17', 
    '2024-01-18',
    '2024-01-19',
    '2024-01-20',
    '2024-01-22',
    '2024-01-23',
    '2024-01-24',
    '2024-01-25',
    '2024-01-26',
  ],
  timeSlots: {
    '2024-01-16': ['09:00', '10:30', '14:00', '15:30'],
    '2024-01-17': ['08:30', '11:00', '13:30', '16:00'],
    '2024-01-18': ['09:30', '12:00', '14:30'],
    '2024-01-19': ['10:00', '11:30', '15:00', '16:30'],
    '2024-01-20': ['09:00', '10:30', '14:00'],
    '2024-01-22': ['08:00', '09:30', '13:00', '14:30'],
    '2024-01-23': ['10:30', '12:00', '15:30'],
    '2024-01-24': ['09:00', '11:00', '14:00', '16:00'],
    '2024-01-25': ['08:30', '10:00', '13:30', '15:00'],
    '2024-01-26': ['09:30', '12:30', '14:30'],
  },
  bookedSlots: {
    '2024-01-16': ['10:00'],
    '2024-01-17': ['14:00'],
    '2024-01-18': ['11:30'],
    '2024-01-19': ['13:00'],
    '2024-01-20': ['11:00'],
  },
};

// Mock doctor data
const DOCTOR_DATA = {
  id: 1,
  name: 'Dr. Emily Rodriguez',
  specialty: 'Neurologist',
  rating: 4.9,
  experience: '18+ years',
  avatar: null,
  verified: true,
  languages: ['English', 'Spanish'],
  hospital: 'Neuro Center',
  consultationFee: 150,
  about: 'Specializes in neurological disorders, migraines, and cognitive health. Dr. Rodriguez has extensive experience in treating complex neurological conditions and is known for her patient-centered approach.',
  education: 'MD - Harvard Medical School',
  certifications: ['Board Certified in Neurology', 'Fellowship in Neuroimaging'],
  workingHours: { start: '09:00', end: '17:00' },
  slotDuration: 30,
};

export default function AppointmentBookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const doctorId = params.doctorId as string;
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState<'calendar' | 'time' | 'confirm'>('calendar');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get available time slots for selected date
  const getAvailableSlots = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return AVAILABLE_DATA.timeSlots[dateString] || [];
  };

  // Get booked slots for selected date
  const getBookedSlots = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return AVAILABLE_DATA.bookedSlots[dateString] || [];
  };

  const handleDateSelect = (date: Date) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDate(date);
    setSelectedTime(null);
    setBookingStep('time');
  };

  const handleTimeSelect = (time: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTime(time);
    setBookingStep('confirm');
  };

  const handleBackToCalendar = () => {
    setBookingStep('calendar');
    setSelectedTime(null);
  };

  const handleBackToTime = () => {
    setBookingStep('time');
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsLoading(true);
    
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowConfirmation(true);
      
      // Auto-close confirmation after 3 seconds
      setTimeout(() => {
        setShowConfirmation(false);
        router.back();
      }, 3000);
      
    } catch (error) {
      Alert.alert('Booking Error', 'Failed to book appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDateDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const renderHeader = () => (
    <Animated.View 
      style={styles.header}
      entering={FadeInDown.duration(800)}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <IconSymbol name="arrow-back" size={24} color={MedicalColors.neutral[800]} />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <Text style={styles.headerSubtitle}>Select date and time</Text>
      </View>
    </Animated.View>
  );

  const renderDoctorInfo = () => (
    <Animated.View 
      style={styles.doctorSection}
      entering={FadeInUp.duration(800).delay(200)}
    >
      <Card variant="elevated" style={styles.doctorCard}>
        <LinearGradient
          colors={MedicalGradients?.primary as [string, string] || ['#007BFF', '#0056D3']}
          style={styles.doctorGradient}
        >
          <View style={styles.doctorContent}>
            <View style={styles.doctorAvatar}>
              <IconSymbol name="person" size={32} color="#FFFFFF" />
            </View>
            
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{DOCTOR_DATA.name}</Text>
              <Text style={styles.doctorSpecialty}>{DOCTOR_DATA.specialty}</Text>
              <View style={styles.doctorRating}>
                <IconSymbol name="star" size={16} color="#FFFFFF" />
                <Text style={styles.ratingText}>{DOCTOR_DATA.rating}</Text>
                <Text style={styles.experienceText}> • {DOCTOR_DATA.experience}</Text>
              </View>
            </View>
            
            <View style={styles.consultationFee}>
              <Text style={styles.feeLabel}>Consultation</Text>
              <Text style={styles.feeAmount}>${DOCTOR_DATA.consultationFee}</Text>
            </View>
          </View>
        </LinearGradient>
      </Card>
    </Animated.View>
  );

  const renderProgressSteps = () => (
    <Animated.View 
      style={styles.progressSection}
      entering={SlideInDown.duration(800).delay(400)}
    >
      <View style={styles.progressSteps}>
        <View style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            { backgroundColor: MedicalColors.primary[600] }
          ]}>
            <IconSymbol name="calendar-today" size={16} color="#FFFFFF" />
          </View>
          <Text style={[
            styles.stepText,
            { color: MedicalColors.primary[600] }
          ]}>
            Date
          </Text>
        </View>
        
        <View style={styles.stepLine} />
        
        <View style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            { backgroundColor: bookingStep === 'time' || bookingStep === 'confirm' ? MedicalColors.primary[600] : MedicalColors.neutral[300] }
          ]}>
            <IconSymbol name="schedule" size={16} color="#FFFFFF" />
          </View>
          <Text style={[
            styles.stepText,
            { color: bookingStep === 'time' || bookingStep === 'confirm' ? MedicalColors.primary[600] : MedicalColors.neutral[500] }
          ]}>
            Time
          </Text>
        </View>
        
        <View style={styles.stepLine} />
        
        <View style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            { backgroundColor: bookingStep === 'confirm' ? MedicalColors.primary[600] : MedicalColors.neutral[300] }
          ]}>
            <IconSymbol name="check" size={16} color="#FFFFFF" />
          </View>
          <Text style={[
            styles.stepText,
            { color: bookingStep === 'confirm' ? MedicalColors.primary[600] : MedicalColors.neutral[500] }
          ]}>
            Confirm
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderCalendarStep = () => (
    <Animated.View 
      style={styles.calendarSection}
      entering={ZoomIn.duration(800).delay(600)}
    >
      <Text style={styles.sectionTitle}>Select Date</Text>
      <Calendar
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        availableDates={AVAILABLE_DATA.dates}
        theme="light"
      />
    </Animated.View>
  );

  const renderTimeStep = () => (
    <Animated.View 
      style={styles.timeSection}
      entering={SlideInUp.duration(800)}
    >
      <View style={styles.timeHeader}>
        <TouchableOpacity
          style={styles.backToCalendar}
          onPress={handleBackToCalendar}
          activeOpacity={0.7}
        >
          <IconSymbol name="arrow-back" size={20} color={MedicalColors.primary[600]} />
          <Text style={styles.backText}>Back to Calendar</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.sectionTitle}>Select Time</Text>
      
      {selectedDate && (
        <TimeSlotPicker
          selectedDate={selectedDate}
          availableSlots={getAvailableSlots(selectedDate)}
          bookedSlots={getBookedSlots(selectedDate)}
          onTimeSelect={handleTimeSelect}
          selectedTime={selectedTime}
          theme="light"
          workingHours={DOCTOR_DATA.workingHours}
          slotDuration={DOCTOR_DATA.slotDuration}
        />
      )}
    </Animated.View>
  );

  const renderConfirmStep = () => (
    <Animated.View 
      style={styles.confirmSection}
      entering={SlideInUp.duration(800)}
    >
      <View style={styles.confirmHeader}>
        <TouchableOpacity
          style={styles.backToTime}
          onPress={handleBackToTime}
          activeOpacity={0.7}
        >
          <IconSymbol name="arrow-back" size={20} color={MedicalColors.primary[600]} />
          <Text style={styles.backText}>Back to Time</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.sectionTitle}>Confirm Appointment</Text>
      
      <Card variant="elevated" style={styles.confirmationCard}>
        <View style={styles.confirmationContent}>
          <View style={styles.confirmationRow}>
            <IconSymbol name="person" size={20} color={MedicalColors.primary[600]} />
            <Text style={styles.confirmationLabel}>Doctor:</Text>
            <Text style={styles.confirmationValue}>{DOCTOR_DATA.name}</Text>
          </View>
          
          <View style={styles.confirmationRow}>
            <IconSymbol name="medical-services" size={20} color={MedicalColors.primary[600]} />
            <Text style={styles.confirmationLabel}>Specialty:</Text>
            <Text style={styles.confirmationValue}>{DOCTOR_DATA.specialty}</Text>
          </View>
          
          <View style={styles.confirmationRow}>
            <IconSymbol name="calendar-today" size={20} color={MedicalColors.primary[600]} />
            <Text style={styles.confirmationLabel}>Date:</Text>
            <Text style={styles.confirmationValue}>
              {selectedDate ? getDateDisplay(selectedDate) : ''}
            </Text>
          </View>
          
          <View style={styles.confirmationRow}>
            <IconSymbol name="schedule" size={20} color={MedicalColors.primary[600]} />
            <Text style={styles.confirmationLabel}>Time:</Text>
            <Text style={styles.confirmationValue}>
              {selectedTime ? getTimeDisplay(selectedTime) : ''}
            </Text>
          </View>
          
          <View style={styles.confirmationRow}>
            <IconSymbol name="attach-money" size={20} color={MedicalColors.primary[600]} />
            <Text style={styles.confirmationLabel}>Fee:</Text>
            <Text style={styles.confirmationValue}>${DOCTOR_DATA.consultationFee}</Text>
          </View>
        </View>
      </Card>
      
      <View style={styles.confirmActions}>
        <Button
          title="Confirm Booking"
          onPress={handleConfirmBooking}
          loading={isLoading}
          variant="primary"
          style={styles.confirmButton}
        />
      </View>
    </Animated.View>
  );

  const renderConfirmationModal = () => (
    <Modal
      visible={showConfirmation}
      transparent
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={styles.confirmationModal}
          entering={ZoomIn.duration(500)}
        >
          <View style={styles.successIcon}>
            <IconSymbol name="check-circle" size={64} color={MedicalColors.success[600]} />
          </View>
          
          <Text style={styles.confirmationTitle}>Appointment Booked!</Text>
          <Text style={styles.confirmationMessage}>
            Your appointment with {DOCTOR_DATA.name} has been successfully scheduled.
          </Text>
          
          <View style={styles.appointmentDetails}>
            <Text style={styles.detailText}>
              {selectedDate ? getDateDisplay(selectedDate) : ''}
            </Text>
            <Text style={styles.detailText}>
              {selectedTime ? getTimeDisplay(selectedTime) : ''}
            </Text>
          </View>
          
          <Text style={styles.reminderText}>
            You'll receive a confirmation email and reminder notifications.
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <AppointmentScreenLayout>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderDoctorInfo()}
        {renderProgressSteps()}
        
        {bookingStep === 'calendar' && renderCalendarStep()}
        {bookingStep === 'time' && renderTimeStep()}
        {bookingStep === 'confirm' && renderConfirmStep()}
      </ScrollView>
      
      {renderConfirmationModal()}
    </AppointmentScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: MedicalColors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
  },
  doctorSection: {
    marginBottom: 24,
  },
  doctorCard: {
    overflow: 'hidden',
  },
  doctorGradient: {
    padding: 20,
  },
  doctorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  doctorRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  experienceText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  consultationFee: {
    alignItems: 'flex-end',
  },
  feeLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
  },
  feeAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressSection: {
    marginBottom: 24,
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '600',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: MedicalColors.neutral[300],
    marginHorizontal: 8,
  },
  calendarSection: {
    marginBottom: 24,
  },
  timeSection: {
    marginBottom: 24,
  },
  timeHeader: {
    marginBottom: 16,
  },
  backToCalendar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backToTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 14,
    color: MedicalColors.primary[600],
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginBottom: 16,
  },
  confirmSection: {
    marginBottom: 24,
  },
  confirmHeader: {
    marginBottom: 16,
  },
  confirmationCard: {
    marginBottom: 24,
  },
  confirmationContent: {
    padding: 20,
  },
  confirmationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[700],
    marginLeft: 12,
    marginRight: 8,
    minWidth: 80,
  },
  confirmationValue: {
    fontSize: 16,
    color: MedicalColors.neutral[900],
    fontWeight: '500',
    flex: 1,
  },
  confirmActions: {
    marginTop: 16,
  },
  confirmButton: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  confirmationModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
  },
  successIcon: {
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    textAlign: 'center',
    marginBottom: 12,
  },
  confirmationMessage: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  appointmentDetails: {
    backgroundColor: MedicalColors.primary[50],
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
  },
  detailText: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.primary[700],
    textAlign: 'center',
    marginBottom: 4,
  },
  reminderText: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    textAlign: 'center',
    lineHeight: 20,
  },
}); 