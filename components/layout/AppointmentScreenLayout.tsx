import { DesignTokens } from '@/constants/DesignSystem';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

interface AppointmentScreenLayoutProps {
  children: React.ReactNode;
  calendarSection?: React.ReactNode;
  timeSlotsSection?: React.ReactNode;
  videoCallInterface?: React.ReactNode;
  confirmationButton?: React.ReactNode;
  scrollable?: boolean;
}

/**
 * AppointmentScreen Layout - Exact JSON Implementation
 * Layout: "Scrollable view with calendar at top, slots below, call controls centered."
 * Components: ["Calendar", "TimeSlots", "VideoCallInterface", "ConfirmationButton"]
 */
export const AppointmentScreenLayout: React.FC<AppointmentScreenLayoutProps> = ({
  children,
  calendarSection,
  timeSlotsSection,
  videoCallInterface,
  confirmationButton,
  scrollable = true,
}) => {
  const ContentComponent = scrollable ? ScrollView : View;
  
  return (
    <SafeAreaView style={styles.container}>
      <ContentComponent 
        style={styles.content}
        contentContainerStyle={scrollable ? styles.scrollContent : undefined}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar at Top */}
        {calendarSection && (
          <View style={styles.calendarSection}>
            {calendarSection}
          </View>
        )}
        
        {/* Time Slots Below Calendar */}
        {timeSlotsSection && (
          <View style={styles.timeSlotsSection}>
            {timeSlotsSection}
          </View>
        )}
        
        {/* Video Call Interface - Centered */}
        {videoCallInterface && (
          <View style={styles.videoCallInterface}>
            {videoCallInterface}
          </View>
        )}
        
        {/* Custom children content */}
        {children}
        
        {/* Confirmation Button at Bottom */}
        {confirmationButton && (
          <View style={styles.confirmationSection}>
            {confirmationButton}
          </View>
        )}
      </ContentComponent>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Main container for appointment screen
  container: {
    flex: 1,
    backgroundColor: DesignTokens.colors.secondary[50], // Background from JSON
  },
  
  // Content area
  content: {
    flex: 1,
  },
  
  // Scroll content padding
  scrollContent: {
    paddingBottom: DesignTokens.spacing.xxl, // Extra bottom padding
  },
  
  // Calendar section at top
  calendarSection: {
    backgroundColor: DesignTokens.colors.neutral.light,
    marginHorizontal: DesignTokens.spacing.md, // 16px from JSON
    marginTop: DesignTokens.spacing.md,
    borderRadius: DesignTokens.borderRadius.md, // 8px from JSON
    padding: DesignTokens.spacing.md, // 16px card padding from JSON
    // Shadow following JSON shadow specification
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Time slots section below calendar
  timeSlotsSection: {
    backgroundColor: DesignTokens.colors.neutral.light,
    marginHorizontal: DesignTokens.spacing.md, // 16px from JSON
    marginTop: DesignTokens.spacing.sm, // 8px gap
    borderRadius: DesignTokens.borderRadius.md, // 8px from JSON
    padding: DesignTokens.spacing.md, // 16px card padding from JSON
    // Shadow following JSON shadow specification
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Video call interface - centered
  videoCallInterface: {
    backgroundColor: DesignTokens.colors.neutral.light,
    marginHorizontal: DesignTokens.spacing.md, // 16px from JSON
    marginTop: DesignTokens.spacing.sm, // 8px gap
    borderRadius: DesignTokens.borderRadius.md, // 8px from JSON
    padding: DesignTokens.spacing.lg, // 24px for video interface
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200, // Adequate space for video controls
    // Shadow following JSON shadow specification
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Confirmation button section at bottom
  confirmationSection: {
    marginTop: DesignTokens.spacing.lg, // 24px gap from JSON
    marginHorizontal: DesignTokens.spacing.md, // 16px from JSON
    marginBottom: DesignTokens.spacing.md,
    // Ensure button meets 48px minimum touch target from JSON
    minHeight: DesignTokens.touchTargets?.minimum || 48,
  },
});

export default AppointmentScreenLayout; 