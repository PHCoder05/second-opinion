import { DesignTokens } from '@/constants/DesignSystem';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from './Card';
import IconSymbol from './IconSymbol';

interface DoctorCardProps {
  doctorName: string;
  specialty: string;
  rating?: number;
  experience?: string;
  imageUrl?: string;
  availability?: string;
  onPress?: () => void;
  onBookPress?: () => void;
}

interface AppointmentCardProps {
  appointmentDate: string;
  appointmentTime: string;
  doctorName: string;
  appointmentType: 'consultation' | 'follow-up' | 'emergency';
  status: 'upcoming' | 'completed' | 'cancelled';
  onPress?: () => void;
  onReschedulePress?: () => void;
  onCancelPress?: () => void;
}

/**
 * DoctorCard Component - Following JSON ComponentSpecs
 * Variant: DoctorCard
 * Guidelines: "Use for listing items like doctors or schedules. Ensure cards are tappable with ripple feedback."
 */
export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctorName,
  specialty,
  rating = 0,
  experience,
  imageUrl,
  availability,
  onPress,
  onBookPress,
}) => {
  return (
    <Card
      variant="default"
      padding="medium"
      onPress={onPress}
      style={styles.doctorCard}
      accessibilityLabel={`Doctor ${doctorName}, ${specialty}`}
      accessibilityHint="Tap to view doctor details"
    >
      <View style={styles.doctorCardContent}>
        {/* Doctor Image/Avatar */}
        <View style={styles.doctorImageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.doctorImage} />
          ) : (
            <View style={styles.doctorImagePlaceholder}>
              <IconSymbol name="account_circle" size={48} color={DesignTokens.colors.secondary[400]} />
            </View>
          )}
        </View>
        
        {/* Doctor Info */}
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{doctorName}</Text>
          <Text style={styles.doctorSpecialty}>{specialty}</Text>
          
          {/* Rating */}
          {rating > 0 && (
            <View style={styles.ratingContainer}>
              <IconSymbol name="star" size={16} color={DesignTokens.colors.warning[500]} />
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            </View>
          )}
          
          {/* Experience */}
          {experience && (
            <Text style={styles.experienceText}>{experience}</Text>
          )}
          
          {/* Availability */}
          {availability && (
            <Text style={styles.availabilityText}>{availability}</Text>
          )}
        </View>
        
        {/* Book Now Button */}
        {onBookPress && (
          <TouchableOpacity
            style={styles.bookButton}
            onPress={onBookPress}
            accessibilityRole="button"
            accessibilityLabel="Book appointment"
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
};

/**
 * AppointmentCard Component - Following JSON ComponentSpecs
 * Variant: AppointmentCard
 * Guidelines: "Use for listing items like doctors or schedules. Ensure cards are tappable with ripple feedback."
 */
export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointmentDate,
  appointmentTime,
  doctorName,
  appointmentType,
  status,
  onPress,
  onReschedulePress,
  onCancelPress,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'upcoming':
        return DesignTokens.colors.primary[500];
      case 'completed':
        return DesignTokens.colors.success[500];
      case 'cancelled':
        return DesignTokens.colors.error[500];
      default:
        return DesignTokens.colors.secondary[500];
    }
  };

  const getTypeIcon = () => {
    switch (appointmentType) {
      case 'consultation':
        return 'stethoscope';
      case 'follow-up':
        return 'calendar';
      case 'emergency':
        return 'exclamationmark.triangle.fill';
      default:
        return 'calendar';
    }
  };

  return (
    <Card
      variant="default"
      padding="medium"
      onPress={onPress}
      style={styles.appointmentCard}
      accessibilityLabel={`Appointment with ${doctorName} on ${appointmentDate} at ${appointmentTime}`}
      accessibilityHint="Tap to view appointment details"
    >
      <View style={styles.appointmentCardContent}>
        {/* Status Indicator */}
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
        
        {/* Appointment Icon */}
        <View style={styles.appointmentIconContainer}>
          <IconSymbol 
            name={getTypeIcon()} 
            size={24} 
            color={DesignTokens.colors.primary[500]} 
          />
        </View>
        
        {/* Appointment Info */}
        <View style={styles.appointmentInfo}>
          <Text style={styles.appointmentDate}>{appointmentDate}</Text>
          <Text style={styles.appointmentTime}>{appointmentTime}</Text>
          <Text style={styles.appointmentDoctor}>Dr. {doctorName}</Text>
          <Text style={styles.appointmentType}>{appointmentType.charAt(0).toUpperCase() + appointmentType.slice(1)}</Text>
        </View>
        
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
        </View>
        
        {/* Action Buttons */}
        {status === 'upcoming' && (
          <View style={styles.appointmentActions}>
            {onReschedulePress && (
              <TouchableOpacity
                style={styles.rescheduleButton}
                onPress={onReschedulePress}
                accessibilityRole="button"
                accessibilityLabel="Reschedule appointment"
              >
                <IconSymbol name="calendar" size={16} color={DesignTokens.colors.primary[500]} />
              </TouchableOpacity>
            )}
            {onCancelPress && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onCancelPress}
                accessibilityRole="button"
                accessibilityLabel="Cancel appointment"
              >
                <IconSymbol name="xmark" size={16} color={DesignTokens.colors.error[500]} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  // DoctorCard Styles
  doctorCard: {
    marginBottom: DesignTokens.spacing.sm, // 8px gap
  },
  
  doctorCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  doctorImageContainer: {
    marginRight: DesignTokens.spacing.md, // 16px gap
  },
  
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  
  doctorImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: DesignTokens.colors.secondary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  doctorInfo: {
    flex: 1,
  },
  
  doctorName: {
    fontSize: DesignTokens.typography.fontSize.subheading, // 18px from JSON
    fontWeight: DesignTokens.typography.fontWeight.bold, // 700 from JSON
    color: DesignTokens.colors.secondary[800],
    fontFamily: DesignTokens.typography.fontFamily.primary, // Roboto from JSON
  },
  
  doctorSpecialty: {
    fontSize: DesignTokens.typography.fontSize.body, // 16px from JSON
    color: DesignTokens.colors.secondary[600],
    marginTop: 2,
    fontFamily: DesignTokens.typography.fontFamily.primary, // Roboto from JSON
  },
  
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: DesignTokens.spacing.xs, // 4px
  },
  
  ratingText: {
    fontSize: DesignTokens.typography.fontSize.caption, // 14px from JSON
    color: DesignTokens.colors.warning[600],
    marginLeft: 4,
    fontFamily: DesignTokens.typography.fontFamily.primary, // Roboto from JSON
  },
  
  experienceText: {
    fontSize: DesignTokens.typography.fontSize.caption, // 14px from JSON
    color: DesignTokens.colors.secondary[500],
    marginTop: 2,
    fontFamily: DesignTokens.typography.fontFamily.primary, // Roboto from JSON
  },
  
  availabilityText: {
    fontSize: DesignTokens.typography.fontSize.caption, // 14px from JSON
    color: DesignTokens.colors.success[600],
    marginTop: 2,
    fontFamily: DesignTokens.typography.fontFamily.primary, // Roboto from JSON
  },
  
  bookButton: {
    backgroundColor: DesignTokens.colors.primary[500], // #007BFF from JSON
    paddingVertical: DesignTokens.spacing.buttonPadding?.vertical || 12, // 12px from JSON
    paddingHorizontal: DesignTokens.spacing.buttonPadding?.horizontal || 24, // 24px from JSON
    borderRadius: DesignTokens.borderRadius.sm, // 4px from JSON
    minHeight: 48, // Minimum touch target from JSON
  },
  
  bookButtonText: {
    color: DesignTokens.colors.neutral.light, // #FFFFFF from JSON
    fontSize: DesignTokens.typography.fontSize.body, // 16px from JSON
    fontWeight: DesignTokens.typography.fontWeight.bold, // 700 from JSON
    fontFamily: DesignTokens.typography.fontFamily.primary, // Roboto from JSON
    textAlign: 'center',
  },
  
  // AppointmentCard Styles
  appointmentCard: {
    marginBottom: DesignTokens.spacing.sm, // 8px gap
  },
  
  appointmentCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  
  statusIndicator: {
    width: 4,
    height: '100%',
    position: 'absolute',
    left: -DesignTokens.spacing.md, // Extend to card edge
    borderRadius: 2,
  },
  
  appointmentIconContainer: {
    marginRight: DesignTokens.spacing.md, // 16px gap
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DesignTokens.colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  appointmentInfo: {
    flex: 1,
  },
  
  appointmentDate: {
    fontSize: DesignTokens.typography.fontSize.subheading, // 18px from JSON
    fontWeight: DesignTokens.typography.fontWeight.bold, // 700 from JSON
    color: DesignTokens.colors.secondary[800],
    fontFamily: DesignTokens.typography.fontFamily.primary, // Roboto from JSON
  },
  
  appointmentTime: {
    fontSize: DesignTokens.typography.fontSize.body, // 16px from JSON
    color: DesignTokens.colors.primary[600],
    marginTop: 2,
    fontFamily: DesignTokens.typography.fontFamily.primary, // Roboto from JSON
  },
  
  appointmentDoctor: {
    fontSize: DesignTokens.typography.fontSize.caption, // 14px from JSON
    color: DesignTokens.colors.secondary[600],
    marginTop: 2,
    fontFamily: DesignTokens.typography.fontFamily.primary, // Roboto from JSON
  },
  
  appointmentType: {
    fontSize: DesignTokens.typography.fontSize.caption, // 14px from JSON
    color: DesignTokens.colors.secondary[500],
    marginTop: 2,
    fontFamily: DesignTokens.typography.fontFamily.primary, // Roboto from JSON
  },
  
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: DesignTokens.spacing.sm, // 8px
    borderRadius: DesignTokens.borderRadius.sm, // 4px from JSON
    marginRight: DesignTokens.spacing.sm, // 8px
  },
  
  statusText: {
    color: DesignTokens.colors.neutral.light, // #FFFFFF from JSON
    fontSize: DesignTokens.typography.fontSize.small, // 12px from JSON
    fontWeight: DesignTokens.typography.fontWeight.bold, // 700 from JSON
    fontFamily: DesignTokens.typography.fontFamily.primary, // Roboto from JSON
  },
  
  appointmentActions: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.sm, // 8px gap
  },
  
  rescheduleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DesignTokens.colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  cancelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DesignTokens.colors.error[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { AppointmentCard, DoctorCard };
