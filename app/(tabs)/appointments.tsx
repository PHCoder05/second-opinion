import { AppointmentScreenLayout } from '@/components/layout/AppointmentScreenLayout';
import { Button, Card, IconSymbol } from '@/components/ui';
import { MedicalColors, MedicalGradients } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    Extrapolate,
    FadeIn,
    FadeInDown,
    FadeInUp,
    SlideInDown,
    ZoomIn,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

// Enhanced appointments data
const APPOINTMENT_DATA = {
  upcoming: [
    {
      id: 1,
      doctor: {
        name: 'Dr. Michael Chen',
      specialty: 'Cardiologist',
        rating: 4.9,
        experience: '15+ years',
        avatar: null,
        verified: true,
        languages: ['English', 'Mandarin'],
        hospital: 'City Medical Center',
      },
      appointment: {
        date: '2024-01-15',
        time: '14:30',
        duration: 30,
        type: 'consultation',
        mode: 'video',
        reason: 'Follow-up consultation',
        notes: 'Bring recent lab results',
        status: 'confirmed',
        canReschedule: true,
        reminderSet: true,
      },
    },
    {
      id: 2,
      doctor: {
        name: 'Dr. Sarah Johnson',
      specialty: 'Dermatologist',
        rating: 4.8,
        experience: '12+ years',
        avatar: null,
        verified: true,
        languages: ['English', 'Spanish'],
        hospital: 'Skin Health Institute',
      },
      appointment: {
        date: '2024-01-18',
        time: '10:00',
        duration: 45,
        type: 'examination',
        mode: 'in-person',
        reason: 'Skin examination',
        notes: 'Annual check-up',
        status: 'confirmed',
        canReschedule: true,
        reminderSet: false,
      },
    },
  ],
  past: [
    {
      id: 3,
      doctor: {
        name: 'Dr. James Wilson',
        specialty: 'General Medicine',
        rating: 4.7,
        experience: '10+ years',
        avatar: null,
        verified: true,
        languages: ['English'],
        hospital: 'General Hospital',
      },
      appointment: {
        date: '2024-01-10',
        time: '09:00',
        duration: 30,
        type: 'consultation',
        mode: 'video',
        reason: 'Health check-up',
        notes: 'Complete physical examination',
        status: 'completed',
        canReschedule: false,
        reminderSet: false,
      },
    },
  ],
  availableSlots: {
    '2024-01-16': ['09:00', '10:30', '14:00', '15:30'],
    '2024-01-17': ['08:30', '11:00', '13:30', '16:00'],
    '2024-01-18': ['09:30', '12:00', '14:30'],
  },
  specialists: [
    {
      id: 1,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Neurologist',
      rating: 4.9,
      experience: '18+ years',
      avatar: null,
      verified: true,
      languages: ['English', 'Spanish'],
      hospital: 'Neuro Center',
      nextAvailable: '2024-01-20',
      consultationFee: 150,
      about: 'Specializes in neurological disorders, migraines, and cognitive health.',
    },
    {
      id: 2,
      name: 'Dr. Robert Kim',
      specialty: 'Orthopedist',
      rating: 4.8,
      experience: '20+ years',
      avatar: null,
      verified: true,
      languages: ['English', 'Korean'],
      hospital: 'Sports Medicine Clinic',
      nextAvailable: '2024-01-19',
      consultationFee: 180,
      about: 'Expert in sports injuries, joint replacement, and spine surgery.',
    },
    {
      id: 3,
      name: 'Dr. Lisa Thompson',
      specialty: 'Psychiatrist',
      rating: 4.9,
      experience: '14+ years',
      avatar: null,
      verified: true,
      languages: ['English', 'French'],
      hospital: 'Mental Health Center',
      nextAvailable: '2024-01-17',
      consultationFee: 120,
      about: 'Specializes in anxiety, depression, and cognitive behavioral therapy.',
    },
  ],
};

export default function AppointmentsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'book'>('upcoming');
  const [selectedDoctor, setSelectedDoctor] = useState<typeof APPOINTMENT_DATA.specialists[0] | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const pulseAnimation = useSharedValue(0);
  const floatingAnimation = useSharedValue(0);

  useEffect(() => {
    // Pulse animation for urgent notifications
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0, { duration: 1500 })
      ),
      -1,
      true
    );

    // Floating animation for cards
    floatingAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000 }),
        withTiming(0, { duration: 3000 })
      ),
      -1,
      true
    );
  }, []);

  // Debug modal state changes
  useEffect(() => {
    console.log('Modal state changed:', showBookingModal, 'Doctor:', selectedDoctor?.name);
  }, [showBookingModal, selectedDoctor]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleAppointmentAction = async (action: string, appointmentId: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    switch (action) {
      case 'reschedule':
        Alert.alert('Reschedule Appointment', 'Would you like to reschedule this appointment?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Reschedule', onPress: () => console.log('Reschedule appointment') },
        ]);
        break;
      case 'cancel':
        Alert.alert('Cancel Appointment', 'Are you sure you want to cancel this appointment?', [
          { text: 'No', style: 'cancel' },
          { text: 'Yes, Cancel', style: 'destructive', onPress: () => console.log('Cancel appointment') },
        ]);
        break;
      case 'join':
        Alert.alert('Join Video Call', 'Ready to join your appointment?', [
          { text: 'Not Yet', style: 'cancel' },
          { text: 'Join Call', onPress: () => console.log('Join video call') },
        ]);
        break;
      case 'reminder':
        Alert.alert('Reminder Set', 'You will be notified 30 minutes before your appointment.');
        break;
      case 'view':
        Alert.alert('Appointment Details', `Appointment ID: ${appointmentId}\nDate: ${APPOINTMENT_DATA.past.find(item => item.id === appointmentId)?.appointment.date}\nTime: ${APPOINTMENT_DATA.past.find(item => item.id === appointmentId)?.appointment.time}`);
        break;
      case 'book_again':
        const pastAppointment = APPOINTMENT_DATA.past.find(item => item.id === appointmentId);
        if (pastAppointment) {
          handleBookAppointment(pastAppointment.doctor);
        }
        break;
    }
  };

  const handleBookAppointment = async (doctor: typeof APPOINTMENT_DATA.specialists[0]) => {
    console.log('handleBookAppointment called with doctor:', doctor.name);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedDoctor(doctor);
    setSelectedDate(null);
    setSelectedTime(null);
    setShowBookingModal(true);
    console.log('Modal should be visible now');
  };

  const confirmBooking = async () => {
    if (!selectedDate || !selectedTime || !selectedDoctor) return;
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Appointment Booked!',
      `Your appointment with ${selectedDoctor.name} is scheduled for ${selectedDate} at ${selectedTime}.`,
      [{ text: 'OK', onPress: () => {
        setShowBookingModal(false);
        setSelectedDoctor(null);
        setSelectedDate(null);
        setSelectedTime(null);
      }}]
    );
  };

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          pulseAnimation.value,
          [0, 1],
          [1, 1.05],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          floatingAnimation.value,
          [0, 1],
          [0, -5],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const renderTabBar = () => (
    <Animated.View 
      style={styles.tabBar}
      entering={FadeInDown.duration(800).delay(100)}
    >
      {[
        { key: 'upcoming', label: 'Upcoming', icon: 'schedule', count: APPOINTMENT_DATA.upcoming.length },
        { key: 'past', label: 'Past', icon: 'history', count: APPOINTMENT_DATA.past.length },
        { key: 'book', label: 'Book New', icon: 'add_circle', count: null },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tabItem,
            activeTab === tab.key && styles.activeTabItem,
          ]}
          onPress={() => {
            setActiveTab(tab.key as any);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <View style={styles.tabIconContainer}>
            <IconSymbol
              name={tab.icon}
              size={20}
              color={activeTab === tab.key ? MedicalColors.primary[600] : MedicalColors.neutral[500]}
            />
            {tab.count !== null && tab.count > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{tab.count}</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.tabLabel,
              activeTab === tab.key && styles.activeTabLabel,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );

  const renderUpcomingAppointments = () => (
    <Animated.View
      style={styles.appointmentsSection}
      entering={FadeInUp.duration(800).delay(200)}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        <TouchableOpacity
          style={styles.todayFilter}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <IconSymbol name="today" size={16} color={MedicalColors.primary[600]} />
          <Text style={styles.todayFilterText}>Today</Text>
        </TouchableOpacity>
      </View>

      {APPOINTMENT_DATA.upcoming.length === 0 ? (
        <Animated.View
          style={styles.emptyState}
          entering={FadeIn.duration(800).delay(400)}
        >
          <View style={styles.emptyStateIcon}>
            <IconSymbol name="event_available" size={64} color={MedicalColors.neutral[400]} />
          </View>
          <Text style={styles.emptyStateTitle}>No Upcoming Appointments</Text>
          <Text style={styles.emptyStateSubtitle}>Book a new appointment with our specialists</Text>
          <Button
            variant="primary"
            size="medium"
            icon="add"
            onPress={() => setActiveTab('book')}
            style={styles.emptyStateButton}
          >
            Book Appointment
          </Button>
        </Animated.View>
      ) : (
        <View style={styles.appointmentsList}>
          {APPOINTMENT_DATA.upcoming.map((item, index) => {
            console.log('Rendering appointment:', item.id, 'Doctor:', item.doctor.name, 'Specialty:', item.doctor.specialty);
            return (
            <Animated.View
              key={item.id}
              style={[styles.appointmentCardContainer, floatingStyle]}
              entering={SlideInDown.duration(600).delay(300 + index * 150)}
            >
              <Card variant="elevated" style={styles.appointmentCard}>
                {/* Appointment Header */}
                <View style={styles.appointmentHeader}>
                  <LinearGradient
                    colors={item.appointment.mode === 'video' ? (MedicalGradients?.primary || ['#007BFF', '#0056D3']) : (MedicalGradients?.secondary || ['#6C757D', '#495057'])}
                    style={styles.appointmentTypeGradient}
                  >
                    <View style={styles.appointmentTypeContent}>
                      <IconSymbol
                        name={item.appointment.mode === 'video' ? 'videocam' : 'local_hospital'}
                        size={20}
                        color="#FFFFFF"
                      />
                      <Text style={styles.appointmentTypeText}>
                        {item.appointment.mode === 'video' ? 'Video Call' : 'In-Person'}
                      </Text>
                    </View>
                  </LinearGradient>

                  <View style={styles.appointmentMeta}>
                    <Text style={styles.appointmentDate}>
                      {new Date(item.appointment.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                    <Text style={styles.appointmentTime}>{item.appointment.time}</Text>
                  </View>
                </View>

                {/* Doctor Information */}
                <View style={styles.doctorSection}>
                  <View style={styles.doctorInfo}>
                    <View style={styles.doctorAvatar}>
                      <IconSymbol name="account_circle" size={48} color={MedicalColors.primary[500]} />
                      {item.doctor.verified && (
                        <View style={styles.verifiedBadge}>
                          <IconSymbol name="verified" size={12} color={MedicalColors.success[600]} />
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.doctorDetails}>
                      <Text style={[styles.doctorName, { color: '#000000' }]} numberOfLines={1}>
                        {item.doctor.name || 'Doctor Name Not Available'}
                      </Text>
                      <Text style={[styles.doctorSpecialty, { color: '#666666' }]} numberOfLines={1}>
                        {item.doctor.specialty || 'Specialty Not Available'}
                      </Text>
                      
                      <View style={styles.doctorMeta}>
                        <View style={styles.rating}>
                          <IconSymbol name="star" size={12} color={MedicalColors.warning[500]} />
                          <Text style={[styles.ratingText, { color: '#000000' }]}>{item.doctor.rating || 'N/A'}</Text>
                        </View>
                        <Text style={[styles.experience, { color: '#666666' }]}>{item.doctor.experience || 'Experience N/A'}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.appointmentDetails}>
                    <Text style={[styles.appointmentReason, { color: '#000000' }]} numberOfLines={2}>
                      {item.appointment.reason || 'Appointment reason not specified'}
                    </Text>
                    {item.appointment.notes && (
                      <Text style={[styles.appointmentNotes, { color: '#666666' }]} numberOfLines={2}>
                        Note: {item.appointment.notes}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Appointment Actions */}
                <View style={styles.appointmentActions}>
                  <View style={styles.actionButtonsLeft}>
                    {item.appointment.mode === 'video' && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.joinButton]}
                        onPress={() => handleAppointmentAction('join', item.id)}
                      >
                        <IconSymbol name="videocam" size={16} color="#FFFFFF" />
                        <Text style={styles.joinButtonText}>Join</Text>
                      </TouchableOpacity>
                    )}

                    {!item.appointment.reminderSet && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.reminderButton]}
                        onPress={() => handleAppointmentAction('reminder', item.id)}
                      >
                        <IconSymbol name="notifications" size={16} color={MedicalColors.info[600]} />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.actionButtonsRight}>
                    {item.appointment.canReschedule && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.rescheduleButton]}
                        onPress={() => handleAppointmentAction('reschedule', item.id)}
                      >
                        <IconSymbol name="schedule" size={16} color={MedicalColors.warning[600]} />
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={[styles.actionButton, styles.cancelButton]}
                      onPress={() => handleAppointmentAction('cancel', item.id)}
                    >
                      <IconSymbol name="close" size={16} color={MedicalColors.error[600]} />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            </Animated.View>
          );
        })}
        </View>
      )}
    </Animated.View>
  );

  const renderPastAppointments = () => (
    <Animated.View
      style={styles.appointmentsSection}
      entering={FadeInUp.duration(800).delay(200)}
    >
      <Text style={styles.sectionTitle}>Past Appointments</Text>

      {APPOINTMENT_DATA.past.length === 0 ? (
        <Animated.View
          style={styles.emptyState}
          entering={FadeIn.duration(800).delay(400)}
        >
          <View style={styles.emptyStateIcon}>
            <IconSymbol name="history" size={64} color={MedicalColors.neutral[400]} />
          </View>
          <Text style={styles.emptyStateTitle}>No Past Appointments</Text>
          <Text style={styles.emptyStateSubtitle}>Your appointment history will appear here</Text>
        </Animated.View>
      ) : (
        <View style={styles.appointmentsList}>
          {APPOINTMENT_DATA.past.map((item, index) => (
            <Animated.View
              key={item.id}
              style={styles.appointmentCardContainer}
              entering={SlideInDown.duration(600).delay(300 + index * 150)}
            >
              <Card variant="outlined" style={[styles.appointmentCard, styles.pastAppointmentCard]}>
                <View style={styles.pastAppointmentHeader}>
                  <View style={styles.pastAppointmentDate}>
                    <Text style={styles.pastDateText}>
                      {new Date(item.appointment.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                    <Text style={styles.pastTimeText}>{item.appointment.time}</Text>
                  </View>
                  
                  <View style={styles.completedBadge}>
                    <IconSymbol name="check_circle" size={16} color={MedicalColors.success[600]} />
                    <Text style={styles.completedText}>Completed</Text>
                  </View>
                </View>

                {/* Doctor Information for Past Appointments */}
                <View style={styles.pastDoctorSection}>
                  <View style={styles.pastDoctorInfo}>
                    <View style={styles.pastDoctorAvatar}>
                      <IconSymbol name="account_circle" size={40} color={MedicalColors.neutral[500]} />
                    </View>
                    
                    <View style={styles.pastDoctorDetails}>
                      <Text style={styles.pastDoctorName}>{item.doctor.name}</Text>
                      <Text style={styles.pastDoctorSpecialty}>{item.doctor.specialty}</Text>
                      
                      <View style={styles.pastDoctorMeta}>
                        <View style={styles.pastRating}>
                          <IconSymbol name="star" size={12} color={MedicalColors.warning[500]} />
                          <Text style={styles.pastRatingText}>{item.doctor.rating}</Text>
                        </View>
                        <Text style={styles.pastExperience}>{item.doctor.experience}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.pastAppointmentDetails}>
                    <Text style={styles.pastAppointmentReason}>{item.appointment.reason}</Text>
                    {item.appointment.notes && (
                      <Text style={styles.pastAppointmentNotes}>Note: {item.appointment.notes}</Text>
                    )}
                  </View>
                </View>

                {/* Past Appointment Actions */}
                <View style={styles.pastAppointmentActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.viewDetailsButton]}
                    onPress={() => handleAppointmentAction('view', item.id)}
                  >
                    <IconSymbol name="description" size={16} color={MedicalColors.primary[600]} />
                    <Text style={styles.viewDetailsText}>View Details</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.bookAgainButton]}
                    onPress={() => handleAppointmentAction('book_again', item.id)}
                  >
                    <IconSymbol name="schedule" size={16} color={MedicalColors.success[600]} />
                    <Text style={styles.bookAgainText}>Book Again</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            </Animated.View>
          ))}
        </View>
      )}
    </Animated.View>
  );

  const renderBookAppointment = () => (
    <Animated.View
      style={styles.bookingSection}
      entering={FadeInUp.duration(800).delay(200)}
    >
      <Text style={styles.sectionTitle}>Find Specialists</Text>
      
      <View style={styles.specialistsList}>
        {APPOINTMENT_DATA.specialists.map((specialist, index) => (
        <Animated.View 
            key={specialist.id}
            style={[styles.specialistCard, floatingStyle]}
            entering={ZoomIn.duration(600).delay(300 + index * 150)}
          >
            <Card variant="elevated" style={styles.specialistCardInner}>
              <View style={styles.specialistHeader}>
                <View style={styles.specialistInfo}>
                  <View style={styles.specialistAvatar}>
                    <IconSymbol name="account_circle" size={64} color={MedicalColors.primary[500]} />
                    {specialist.verified && (
                      <View style={styles.specialistVerifiedBadge}>
                        <IconSymbol name="verified" size={16} color={MedicalColors.success[600]} />
                      </View>
                    )}
                  </View>

                  <View style={styles.specialistDetails}>
                    <Text style={styles.specialistName}>{specialist.name}</Text>
                    <Text style={styles.specialistSpecialty}>{specialist.specialty}</Text>
                    
                    <View style={styles.specialistMeta}>
                      <View style={styles.specialistRating}>
                        <IconSymbol name="star" size={14} color={MedicalColors.warning[500]} />
                        <Text style={styles.specialistRatingText}>{specialist.rating}</Text>
                      </View>
                      <Text style={styles.specialistExperience}>{specialist.experience}</Text>
                    </View>

                    <Text style={styles.specialistHospital}>{specialist.hospital}</Text>
                  </View>
                </View>

                <View style={styles.specialistActions}>
                  <Text style={styles.consultationFee}>${specialist.consultationFee}</Text>
                  <Text style={styles.nextAvailable}>
                    Next: {new Date(specialist.nextAvailable).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              </View>

              <Text style={styles.specialistAbout}>{specialist.about}</Text>

              <View style={styles.specialistLanguages}>
                <Text style={styles.languagesLabel}>Languages:</Text>
                <View style={styles.languagesList}>
                  {specialist.languages.map((language, idx) => (
                    <View key={idx} style={styles.languageTag}>
                      <Text style={styles.languageText}>{language}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.specialistBookingActions}>
                <TouchableOpacity
                  style={styles.viewProfileButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert('Doctor Profile', `View ${specialist.name}'s detailed profile and reviews.`);
                  }}
                >
                  <Text style={styles.viewProfileText}>View Profile</Text>
                </TouchableOpacity>

                <Button
                  variant="primary"
                  size="small"
                  icon="schedule"
                  onPress={() => {
                    console.log('Book Now button pressed for:', specialist.name);
                    handleBookAppointment(specialist);
                  }}
                  style={styles.bookButton}
                >
                  Book Now
                </Button>
              </View>
            </Card>
        </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  const renderBookingModal = () => {
    console.log('Rendering modal, showBookingModal:', showBookingModal, 'selectedDoctor:', selectedDoctor?.name);
    
    if (!showBookingModal) {
      console.log('Modal is not visible');
      return null;
    }
    
    return (
      <Modal
        visible={showBookingModal}
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            console.log('Overlay pressed - closing modal');
            setShowBookingModal(false);
          }}
        >
          <TouchableOpacity 
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalBackButton}
                onPress={() => {
                  console.log('Back button pressed');
                  setShowBookingModal(false);
                }}
              >
                <IconSymbol name="chevron_left" size={24} color={MedicalColors.neutral[600]} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Book Appointment</Text>
              <View style={styles.modalHeaderSpacer} />
            </View>

            {selectedDoctor && (
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {/* Doctor Information Card */}
                <View style={styles.selectedDoctorInfo}>
                  <View style={styles.doctorCard}>
                    <LinearGradient
                      colors={MedicalGradients?.primary as [string, string] || ['#007BFF', '#0056D3'] as [string, string]}
                      style={styles.doctorGradient}
                    >
                      <View style={styles.doctorContent}>
                        <View style={styles.doctorAvatar}>
                          <IconSymbol name="person" size={32} color="#FFFFFF" />
                        </View>
                        
                        <View style={styles.doctorInfo}>
                          <Text style={styles.doctorName}>{selectedDoctor.name}</Text>
                          <Text style={styles.doctorSpecialty}>{selectedDoctor.specialty}</Text>
                          <View style={styles.doctorRating}>
                            <IconSymbol name="star" size={16} color="#FFFFFF" />
                            <Text style={styles.ratingText}>{selectedDoctor.rating}</Text>
                            <Text style={styles.experienceText}> • {selectedDoctor.experience}</Text>
                          </View>
                        </View>
                        
                        <View style={styles.consultationFee}>
                          <Text style={styles.feeLabel}>Consultation</Text>
                          <Text style={styles.feeAmount}>${selectedDoctor.consultationFee}</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </View>
                </View>

                {/* Progress Steps */}
                <View style={styles.progressSection}>
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
                    
                    <View style={[
                      styles.stepLine,
                      { backgroundColor: selectedDate ? MedicalColors.primary[600] : MedicalColors.neutral[300] }
                    ]} />
                    
                    <View style={styles.stepContainer}>
                      <View style={[
                        styles.stepCircle,
                        { backgroundColor: selectedDate ? MedicalColors.primary[600] : MedicalColors.neutral[300] }
                      ]}>
                        <IconSymbol name="schedule" size={16} color="#FFFFFF" />
                      </View>
                      <Text style={[
                        styles.stepText,
                        { color: selectedDate ? MedicalColors.primary[600] : MedicalColors.neutral[500] }
                      ]}>
                        Time
                      </Text>
                    </View>
                    
                    <View style={[
                      styles.stepLine,
                      { backgroundColor: selectedTime ? MedicalColors.primary[600] : MedicalColors.neutral[300] }
                    ]} />
                    
                    <View style={styles.stepContainer}>
                      <View style={[
                        styles.stepCircle,
                        { backgroundColor: selectedTime ? MedicalColors.primary[600] : MedicalColors.neutral[300] }
                      ]}>
                        <IconSymbol name="check" size={16} color="#FFFFFF" />
                      </View>
                      <Text style={[
                        styles.stepText,
                        { color: selectedTime ? MedicalColors.primary[600] : MedicalColors.neutral[500] }
                      ]}>
                        Confirm
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Simple Calendar Section */}
                <View style={styles.calendarSection}>
                  <Text style={styles.modalSectionTitle}>Select Date</Text>
                  <Text style={styles.simpleText}>Available appointments this week</Text>
                  
                  <View style={styles.simpleDateGrid}>
                    {[
                      { date: '2024-01-16', display: 'Today, Jan 16', available: true },
                      { date: '2024-01-17', display: 'Tomorrow, Jan 17', available: true },
                      { date: '2024-01-18', display: 'Thursday, Jan 18', available: true },
                    ].map((dateOption) => (
                      <TouchableOpacity
                        key={dateOption.date}
                        style={[
                          styles.simpleDateButton,
                          selectedDate?.toISOString().split('T')[0] === dateOption.date && styles.selectedDateButton
                        ]}
                        onPress={() => {
                          setSelectedDate(new Date(dateOption.date));
                          setSelectedTime(null); // Reset time when date changes
                          console.log('Date selected:', dateOption.display);
                        }}
                      >
                        <Text style={[
                          styles.simpleDateText,
                          selectedDate?.toISOString().split('T')[0] === dateOption.date && styles.selectedDateText
                        ]}>
                          {dateOption.display}
                        </Text>
                        {dateOption.available && (
                          <Text style={styles.availabilityText}>Available</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Simple Time Selection */}
                {selectedDate && (
                  <View style={styles.timeSection}>
                    <Text style={styles.modalSectionTitle}>Select Time</Text>
                    <View style={styles.simpleTimeGrid}>
                      {(APPOINTMENT_DATA.availableSlots[selectedDate.toISOString().split('T')[0]] || ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM']).map((time) => (
                        <TouchableOpacity
                          key={time}
                          style={[
                            styles.simpleTimeButton,
                            selectedTime === time && styles.selectedTimeButton
                          ]}
                          onPress={() => {
                            setSelectedTime(time);
                            console.log('Time selected:', time);
                          }}
                        >
                          <Text style={[
                            styles.simpleTimeText,
                            selectedTime === time && styles.selectedTimeText
                          ]}>
                            {time}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.simpleCancelButton}
                    onPress={() => {
                      console.log('Cancel pressed');
                      setShowBookingModal(false);
                    }}
                  >
                    <Text style={styles.simpleCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.simpleConfirmButton,
                      (!selectedDate || !selectedTime) && styles.disabledButton
                    ]}
                    disabled={!selectedDate || !selectedTime}
                    onPress={() => {
                      if (selectedDate && selectedTime) {
                        confirmBooking();
                      }
                    }}
                  >
                    <Text style={styles.simpleConfirmText}>Confirm Booking</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <AppointmentScreenLayout
      headerTitle="Appointments"
      showNotifications
      calendarSection={
        <Animated.View style={[styles.quickStats, pulseStyle]} entering={FadeIn.duration(800).delay(100)}>
          <LinearGradient
                            colors={MedicalGradients?.primary || ['#007BFF', '#0056D3']}
            style={styles.quickStatsGradient}
          >
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{APPOINTMENT_DATA.upcoming.length}</Text>
              <Text style={styles.statLabel}>Upcoming</Text>
          </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{APPOINTMENT_DATA.past.length}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{APPOINTMENT_DATA.specialists.length}</Text>
              <Text style={styles.statLabel}>Specialists</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      }
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {renderTabBar()}
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'upcoming' && renderUpcomingAppointments()}
        {activeTab === 'past' && renderPastAppointments()}
        {activeTab === 'book' && renderBookAppointment()}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {renderBookingModal()}
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

  // Quick Stats
  quickStats: {
    margin: 20,
    marginBottom: 0,
  },
  quickStatsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
    borderRadius: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: MedicalColors.neutral[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  activeTabItem: {
    backgroundColor: `${MedicalColors.primary[600]}10`,
  },
  tabIconContainer: {
    position: 'relative',
  },
  tabBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: MedicalColors.error[600],
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tabLabel: {
    fontSize: 12,
    color: MedicalColors.neutral[500],
    fontWeight: '500',
    marginTop: 4,
  },
  activeTabLabel: {
    color: MedicalColors.primary[600],
    fontWeight: '600',
  },

  // Common Section Styles
  appointmentsSection: {
    marginBottom: 32,
  },
  bookingSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  todayFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: `${MedicalColors.primary[600]}10`,
    borderRadius: 16,
    gap: 4,
  },
  todayFilterText: {
    fontSize: 12,
    color: MedicalColors.primary[600],
    fontWeight: '600',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: MedicalColors.neutral[700],
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: MedicalColors.neutral[500],
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    minWidth: 160,
  },

  // Appointments List
  appointmentsList: {
    gap: 16,
  },
  appointmentCardContainer: {
    width: '100%',
  },
  appointmentCard: {
    padding: 0,
    overflow: 'hidden',
  },

  // Appointment Header
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  appointmentTypeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  appointmentTypeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appointmentTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  appointmentMeta: {
    alignItems: 'flex-end',
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
  },
  appointmentTime: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    fontWeight: '500',
  },

  // Doctor Section
  doctorSection: {
    padding: 16,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  doctorAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 2,
  },
  doctorDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    marginBottom: 6,
  },
  doctorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: MedicalColors.neutral[600],
    fontWeight: '500',
  },
  experience: {
    fontSize: 12,
    color: MedicalColors.neutral[500],
  },
  appointmentDetails: {
    backgroundColor: MedicalColors.neutral[50],
    padding: 12,
    borderRadius: 8,
  },
  appointmentReason: {
    fontSize: 14,
    fontWeight: '600',
    color: MedicalColors.neutral[800],
    marginBottom: 4,
  },
  appointmentNotes: {
    fontSize: 12,
    color: MedicalColors.neutral[600],
    fontStyle: 'italic',
  },

  // Appointment Actions
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: MedicalColors.neutral[200],
  },
  actionButtonsLeft: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButtonsRight: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButton: {
    backgroundColor: MedicalColors.success[600],
    flexDirection: 'row',
    paddingHorizontal: 16,
    width: 'auto',
    gap: 6,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  reminderButton: {
    backgroundColor: `${MedicalColors.info[600]}15`,
  },
  rescheduleButton: {
    backgroundColor: `${MedicalColors.warning[600]}15`,
  },
  cancelButton: {
    backgroundColor: `${MedicalColors.error[600]}15`,
  },

  // Past Appointments
  pastAppointmentCard: {
    backgroundColor: MedicalColors.neutral[50],
  },
  pastAppointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: MedicalColors.neutral[200],
  },
  pastAppointmentDate: {
    alignItems: 'flex-start',
  },
  pastDateText: {
    fontSize: 16,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginBottom: 2,
  },
  pastTimeText: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${MedicalColors.success[600]}10`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: MedicalColors.success[600],
  },
  pastDoctorSection: {
    padding: 16,
  },
  pastDoctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pastDoctorAvatar: {
    marginRight: 12,
  },
  pastDoctorDetails: {
    flex: 1,
  },
  pastDoctorName: {
    fontSize: 14,
    fontWeight: '600',
    color: MedicalColors.neutral[700],
    marginBottom: 2,
  },
  pastDoctorSpecialty: {
    fontSize: 12,
    color: MedicalColors.neutral[500],
  },
  pastDoctorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pastRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pastRatingText: {
    fontSize: 12,
    color: MedicalColors.neutral[600],
    fontWeight: '500',
  },
  pastExperience: {
    fontSize: 12,
    color: MedicalColors.neutral[500],
  },
  pastAppointmentDetails: {
    backgroundColor: MedicalColors.neutral[50],
    padding: 12,
    borderRadius: 8,
  },
  pastAppointmentReason: {
    fontSize: 14,
    fontWeight: '600',
    color: MedicalColors.neutral[800],
    marginBottom: 4,
  },
  pastAppointmentNotes: {
    fontSize: 12,
    color: MedicalColors.neutral[600],
    fontStyle: 'italic',
  },
  pastAppointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: MedicalColors.neutral[200],
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: `${MedicalColors.primary[600]}10`,
    borderRadius: 16,
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '600',
    color: MedicalColors.primary[600],
  },
  bookAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: `${MedicalColors.success[600]}10`,
    borderRadius: 16,
    gap: 4,
  },
  bookAgainText: {
    fontSize: 12,
    fontWeight: '600',
    color: MedicalColors.success[600],
  },

  // Specialists
  specialistsList: {
    gap: 20,
  },
  specialistCard: {
    width: '100%',
  },
  specialistCardInner: {
    padding: 20,
  },
  specialistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  specialistInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  specialistAvatar: {
    position: 'relative',
    marginRight: 16,
  },
  specialistVerifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 2,
  },
  specialistDetails: {
    flex: 1,
  },
  specialistName: {
    fontSize: 18,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginBottom: 4,
  },
  specialistSpecialty: {
    fontSize: 14,
    color: MedicalColors.primary[600],
    fontWeight: '600',
    marginBottom: 8,
  },
  specialistMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  specialistRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specialistRatingText: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
    fontWeight: '600',
  },
  specialistExperience: {
    fontSize: 12,
    color: MedicalColors.neutral[500],
  },
  specialistHospital: {
    fontSize: 12,
    color: MedicalColors.neutral[600],
    fontWeight: '500',
  },
  specialistActions: {
    alignItems: 'flex-end',
  },
  consultationFee: {
    fontSize: 18,
    fontWeight: '700',
    color: MedicalColors.success[600],
    marginBottom: 4,
  },
  nextAvailable: {
    fontSize: 12,
    color: MedicalColors.neutral[500],
  },
  specialistAbout: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    lineHeight: 20,
    marginBottom: 16,
  },
  specialistLanguages: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  languagesLabel: {
    fontSize: 12,
    color: MedicalColors.neutral[600],
    fontWeight: '600',
    marginRight: 8,
  },
  languagesList: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  languageTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: MedicalColors.neutral[100],
    borderRadius: 12,
  },
  languageText: {
    fontSize: 10,
    color: MedicalColors.neutral[600],
    fontWeight: '500',
  },
  specialistBookingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  viewProfileButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: MedicalColors.neutral[100],
    borderRadius: 8,
    alignItems: 'center',
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: MedicalColors.neutral[700],
  },
  bookButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: MedicalColors.primary[600],
    borderRadius: 8,
    gap: 6,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Booking Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    minHeight: '50%',
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: MedicalColors.neutral[200],
  },
  modalBackButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MedicalColors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderSpacer: {
    width: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MedicalColors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    flex: 1,
  },
  selectedDoctorInfo: {
    padding: 24,
    backgroundColor: MedicalColors.neutral[50],
    marginBottom: 24,
  },
  doctorCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  doctorGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
  },
  doctorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  doctorAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: MedicalColors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorInfo: {
    marginLeft: 16,
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  doctorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  experienceText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  consultationFee: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  feeLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  feeAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Progress Steps
  progressSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: MedicalColors.neutral[100],
    borderRadius: 12,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    fontSize: 12,
    marginTop: 8,
  },
  stepLine: {
    flex: 1,
    height: 1,
    backgroundColor: MedicalColors.neutral[300],
  },

  // Calendar Section
  calendarSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  simpleDateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 12,
  },
  simpleDateButton: {
    backgroundColor: MedicalColors.primary[100],
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: '45%', // Adjust as needed for grid layout
  },
  simpleDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.primary[600],
  },
  selectedDateButton: {
    backgroundColor: MedicalColors.primary[200],
    borderWidth: 1,
    borderColor: MedicalColors.primary[600],
  },
  selectedDateText: {
    color: MedicalColors.primary[600],
  },
  availabilityText: {
    fontSize: 10,
    color: MedicalColors.success[600],
    fontWeight: '600',
    marginTop: 4,
  },

  // Time Selection Section
  timeSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },

  // Confirmation Section
  confirmationSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  confirmationCard: {
    borderRadius: 12,
    padding: 16,
  },
  confirmationContent: {
    gap: 12,
  },
  confirmationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confirmationLabel: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    fontWeight: '600',
  },
  confirmationValue: {
    fontSize: 14,
    color: MedicalColors.neutral[900],
    fontWeight: '600',
  },

  // Modal Actions
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  modalCancelButton: {
    flex: 1,
  },
  modalConfirmButton: {
    flex: 1,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginBottom: 16,
  },
  bottomSpacing: {
    height: 20,
  },

  // Simple Styles for Booking Modal
  simpleText: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    textAlign: 'center',
    marginBottom: 16,
  },
  simpleTimeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 12,
  },
  simpleTimeButton: {
    backgroundColor: MedicalColors.neutral[100],
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: '45%', // Adjust as needed for grid layout
  },
  simpleTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: MedicalColors.neutral[800],
  },
  selectedTimeButton: {
    backgroundColor: MedicalColors.primary[100],
    borderWidth: 1,
    borderColor: MedicalColors.primary[600],
  },
  selectedTimeText: {
    color: MedicalColors.primary[600],
  },
  disabledButton: {
    backgroundColor: MedicalColors.neutral[300],
    opacity: 0.7,
  },
  simpleCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: MedicalColors.neutral[200],
    borderRadius: 12,
    alignItems: 'center',
  },
  simpleCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[700],
  },
  simpleConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: MedicalColors.primary[600],
    borderRadius: 12,
    alignItems: 'center',
  },
  simpleConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}); 