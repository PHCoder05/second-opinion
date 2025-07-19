import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

// Design System Imports
import { DesignTokens } from '@/constants/DesignSystem';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useResponsiveDesign, useResponsiveSpacing, useResponsiveTouchTargets, useResponsiveTypography } from '@/hooks/useResponsiveDesign';
import { useTheme } from '@/hooks/useThemeContext';

// Component Imports
import { AppointmentScreenLayout } from '@/components/layout/AppointmentScreenLayout';
import { HomeScreenLayout } from '@/components/layout/HomeScreenLayout';
import { ProfileScreenLayout } from '@/components/layout/ProfileScreenLayout';
import {
    AppointmentCard,
    Button,
    Card,
    DoctorCard,
    IconSymbol,
    Typography
} from '@/components/ui';

/**
 * Design System Showcase - Medical App Design System JSON Profile Implementation
 * Demonstrates all components and layouts following exact JSON specifications
 */
export default function DesignSystemShowcase() {
  const router = useRouter();
  const { colors } = useTheme();
  const responsive = useResponsiveDesign();
  const spacing = useResponsiveSpacing();
  const typography = useResponsiveTypography();
  const touchTargets = useResponsiveTouchTargets();
  const accessibility = useAccessibility();

  const [selectedDemo, setSelectedDemo] = useState<'home' | 'profile' | 'appointment' | 'components'>('components');

  // Demo data following JSON specifications
  const demoDoctor = {
    doctorName: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.8,
    experience: "15+ years experience",
    availability: "Available today",
  };

  const demoAppointment = {
    appointmentDate: "March 15, 2024",
    appointmentTime: "10:30 AM",
    doctorName: "Dr. Sarah Johnson",
    appointmentType: "consultation" as const,
    status: "upcoming" as const,
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
        {...accessibility.getAccessibilityProps("Go back", "Return to previous screen")}
      >
        <IconSymbol name="chevron.left" size={24} color={colors.primary} />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <Typography variant="title" weight="bold" color="primary" align="center">
          Medical Design System
        </Typography>
        <Typography variant="body" color="secondary" align="center">
          JSON Profile Implementation v1.0
        </Typography>
      </View>
    </View>
  );

  const renderDemoSelector = () => (
    <View style={styles.demoSelector}>
      <Typography variant="subheading" weight="bold" style={styles.sectionTitle}>
        Screen Layouts (JSON Specifications)
      </Typography>
      
      <View style={styles.demoButtons}>
        {['components', 'home', 'profile', 'appointment'].map((demo) => (
          <TouchableOpacity
            key={demo}
            onPress={() => setSelectedDemo(demo as any)}
            style={[
              styles.demoButton,
              selectedDemo === demo && styles.demoButtonActive,
              { minHeight: touchTargets.minimum }
            ]}
            {...accessibility.getAccessibilityProps(
              `${demo.charAt(0).toUpperCase() + demo.slice(1)} demo`,
              `Switch to ${demo} layout demonstration`
            )}
          >
            <Typography 
              variant="body" 
              weight="semibold"
              color={selectedDemo === demo ? "primary" : "secondary"}
            >
              {demo.charAt(0).toUpperCase() + demo.slice(1)}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderComponentsDemo = () => (
    <ScrollView style={styles.demoContent} showsVerticalScrollIndicator={false}>
      {/* Design Tokens Section */}
      <Card variant="default" padding="medium" style={styles.section}>
        <Typography variant="subheading" weight="bold" style={styles.sectionTitle}>
          Design Tokens (JSON Exact)
        </Typography>
        
        {/* Color Palette */}
        <Typography variant="body" weight="semibold" style={styles.subsectionTitle}>
          Color Palette
        </Typography>
        <View style={styles.colorPalette}>
          {Object.entries(DesignTokens.colors).map(([colorName, colorShades]) => (
            <View key={colorName} style={styles.colorGroup}>
              <Typography variant="caption" style={styles.colorLabel}>
                {colorName}
              </Typography>
              <View style={styles.colorShades}>
                {typeof colorShades === 'object' && colorShades !== null && 
                 Object.entries(colorShades).slice(0, 3).map(([shade, color]) => (
                  <View 
                    key={shade}
                    style={[styles.colorSwatch, { backgroundColor: color as string }]}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Typography Scale */}
        <Typography variant="body" weight="semibold" style={styles.subsectionTitle}>
          Typography Scale (JSON Sizes)
        </Typography>
        {Object.entries(DesignTokens.typography.fontSize).map(([variant, size]) => (
          <Typography
            key={variant}
            variant={variant as any}
            style={[styles.typographyExample, { fontSize: accessibility.getScaledFontSize(size) }]}
          >
            {variant.charAt(0).toUpperCase() + variant.slice(1)} - {size}px
          </Typography>
        ))}

        {/* Spacing System */}
        <Typography variant="body" weight="semibold" style={styles.subsectionTitle}>
          Spacing System (8px Base)
        </Typography>
        <View style={styles.spacingExamples}>
          {Object.entries(DesignTokens.spacing).map(([key, value]) => {
            if (typeof value === 'number') {
              return (
                <View key={key} style={styles.spacingExample}>
                  <View style={[styles.spacingBox, { width: value, height: 20 }]} />
                  <Typography variant="caption">{key}: {value}px</Typography>
                </View>
              );
            }
            return null;
          })}
        </View>
      </Card>

      {/* Card Components */}
      <Card variant="default" padding="medium" style={styles.section}>
        <Typography variant="subheading" weight="bold" style={styles.sectionTitle}>
          Card Components (JSON Specs)
        </Typography>
        
        {/* Doctor Card Example */}
        <Typography variant="body" weight="semibold" style={styles.subsectionTitle}>
          DoctorCard Variant
        </Typography>
        <DoctorCard
          {...demoDoctor}
          onBookPress={() => console.log('Book appointment')}
          onPress={() => console.log('View doctor details')}
        />

        {/* Appointment Card Example */}
        <Typography variant="body" weight="semibold" style={styles.subsectionTitle}>
          AppointmentCard Variant
        </Typography>
        <AppointmentCard
          {...demoAppointment}
          onPress={() => console.log('View appointment')}
          onReschedulePress={() => console.log('Reschedule')}
          onCancelPress={() => console.log('Cancel')}
        />
      </Card>

      {/* Button Components */}
      <Card variant="default" padding="medium" style={styles.section}>
        <Typography variant="subheading" weight="bold" style={styles.sectionTitle}>
          Button Components (JSON Height: 48px)
        </Typography>
        
        <View style={styles.buttonExamples}>
          <Button
            title="Primary Button"
            onPress={() => console.log('Primary pressed')}
            variant="primary"
            icon="stethoscope"
          />
          <Button
            title="Secondary Button"
            onPress={() => console.log('Secondary pressed')}
            variant="secondary"
            icon="calendar"
          />
          <Button
            title="Outline Button"
            onPress={() => console.log('Outline pressed')}
            variant="outline"
            icon="person.fill"
          />
        </View>
      </Card>

      {/* Responsive Design */}
      <Card variant="default" padding="medium" style={styles.section}>
        <Typography variant="subheading" weight="bold" style={styles.sectionTitle}>
          Responsive Design (JSON Breakpoints)
        </Typography>
        
        <Typography variant="body" style={styles.responsiveInfo}>
          Current Screen: {responsive.screenWidth}px × {responsive.screenHeight}px
        </Typography>
        <Typography variant="body" style={styles.responsiveInfo}>
          Device Type: {responsive.isMobile ? 'Mobile (320-480px)' : responsive.isTablet ? 'Tablet (481-768px)' : 'Large Screen'}
        </Typography>
        <Typography variant="body" style={styles.responsiveInfo}>
          Touch Target: {touchTargets.minimum}px minimum
        </Typography>
      </Card>

      {/* Accessibility Features */}
      <Card variant="default" padding="medium" style={styles.section}>
        <Typography variant="subheading" weight="bold" style={styles.sectionTitle}>
          Accessibility Features (JSON Specs)
        </Typography>
        
        <Typography variant="body" style={styles.accessibilityInfo}>
          ✓ VoiceOver Support: {accessibility.isScreenReaderEnabled ? 'Enabled' : 'Available'}
        </Typography>
        <Typography variant="body" style={styles.accessibilityInfo}>
          ✓ High Contrast Modes: {accessibility.isHighContrastEnabled ? 'Active' : 'Available'}
        </Typography>
        <Typography variant="body" style={styles.accessibilityInfo}>
          ✓ Scalable Text: Font Scale {accessibility.fontScale.toFixed(1)}x
        </Typography>
        <Typography variant="body" style={styles.accessibilityInfo}>
          ✓ Alt Text: Implemented for all images
        </Typography>
        <Typography variant="body" style={styles.accessibilityInfo}>
          ✓ Touch Targets: {touchTargets.recommended}px recommended size
        </Typography>
      </Card>
    </ScrollView>
  );

  const renderLayoutDemo = () => {
    switch (selectedDemo) {
      case 'home':
        return (
          <HomeScreenLayout>
            <Typography variant="heading" weight="bold" align="center" style={styles.layoutTitle}>
              HomeScreen Layout Demo
            </Typography>
            <Typography variant="body" align="center" style={styles.layoutDescription}>
              "Vertical stack with top header, central content, bottom navigation."
            </Typography>
            <DoctorCard {...demoDoctor} onBookPress={() => {}} />
            <AppointmentCard {...demoAppointment} />
          </HomeScreenLayout>
        );

      case 'profile':
        return (
          <ProfileScreenLayout
            avatarSection={
              <View style={styles.profileAvatar}>
                <IconSymbol name="account_circle" size={80} color={colors.primary} />
                <Typography variant="subheading" weight="bold" style={styles.profileName}>
                  Dr. Sarah Johnson
                </Typography>
              </View>
            }
            infoSection={
              <View>
                <Typography variant="body" style={styles.profileInfo}>
                  Specialty: Cardiologist
                </Typography>
                <Typography variant="body" style={styles.profileInfo}>
                  Experience: 15+ years
                </Typography>
              </View>
            }
            buttonGroup={
              <Button
                title="Book Appointment"
                onPress={() => {}}
                variant="primary"
                fullWidth
                icon="calendar"
              />
            }
          >
            <Typography variant="heading" weight="bold" align="center" style={styles.layoutTitle}>
              ProfileScreen Layout Demo
            </Typography>
            <Typography variant="body" align="center" style={styles.layoutDescription}>
              "Top profile image, middle details, bottom actions."
            </Typography>
          </ProfileScreenLayout>
        );

      case 'appointment':
        return (
          <AppointmentScreenLayout
            calendarSection={
              <View style={styles.calendarDemo}>
                <IconSymbol name="calendar" size={48} color={colors.primary} />
                <Typography variant="subheading" weight="bold">
                  Calendar Component
                </Typography>
              </View>
            }
            timeSlotsSection={
              <View style={styles.timeSlotsDemo}>
                <Typography variant="body" weight="semibold">Available Time Slots</Typography>
                <View style={styles.timeSlots}>
                  {['9:00 AM', '10:30 AM', '2:00 PM'].map((time) => (
                    <TouchableOpacity key={time} style={styles.timeSlot}>
                      <Typography variant="body">{time}</Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            }
            videoCallInterface={
              <View style={styles.videoCallDemo}>
                <IconSymbol name="videocam" size={48} color={colors.primary} />
                <Typography variant="subheading" weight="bold" align="center">
                  Video Call Interface
                </Typography>
                <Typography variant="body" align="center" color="secondary">
                  Centered call controls
                </Typography>
              </View>
            }
            confirmationButton={
              <Button
                title="Confirm Appointment"
                onPress={() => {}}
                variant="primary"
                fullWidth
                icon="checkmark"
              />
            }
          >
            <Typography variant="heading" weight="bold" align="center" style={styles.layoutTitle}>
              AppointmentScreen Layout Demo
            </Typography>
            <Typography variant="body" align="center" style={styles.layoutDescription}>
              "Scrollable view with calendar at top, slots below, call controls centered."
            </Typography>
          </AppointmentScreenLayout>
        );

      default:
        return renderComponentsDemo();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[DesignTokens.colors.secondary[50], DesignTokens.colors.neutral.light]}
        style={StyleSheet.absoluteFillObject}
      />
      
      {renderHeader()}
      {renderDemoSelector()}
      
      <View style={styles.content}>
        {renderLayoutDemo()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.secondary[200],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DesignTokens.colors.secondary[100],
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: DesignTokens.spacing.md,
  },
  demoSelector: {
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.secondary[200],
  },
  demoButtons: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.sm,
    marginTop: DesignTokens.spacing.sm,
  },
  demoButton: {
    flex: 1,
    paddingVertical: DesignTokens.spacing.sm,
    paddingHorizontal: DesignTokens.spacing.md,
    borderRadius: DesignTokens.borderRadius.sm,
    backgroundColor: DesignTokens.colors.secondary[100],
    alignItems: 'center',
  },
  demoButtonActive: {
    backgroundColor: DesignTokens.colors.primary[100],
  },
  content: {
    flex: 1,
  },
  demoContent: {
    flex: 1,
    paddingHorizontal: DesignTokens.spacing.md,
  },
  section: {
    marginVertical: DesignTokens.spacing.sm,
  },
  sectionTitle: {
    marginBottom: DesignTokens.spacing.md,
    color: DesignTokens.colors.secondary[800],
  },
  subsectionTitle: {
    marginTop: DesignTokens.spacing.md,
    marginBottom: DesignTokens.spacing.sm,
    color: DesignTokens.colors.secondary[700],
  },
  colorPalette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DesignTokens.spacing.sm,
  },
  colorGroup: {
    alignItems: 'center',
  },
  colorLabel: {
    marginBottom: 4,
    fontSize: 10,
  },
  colorShades: {
    flexDirection: 'row',
    gap: 2,
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: DesignTokens.colors.secondary[300],
  },
  typographyExample: {
    marginVertical: 2,
  },
  spacingExamples: {
    gap: DesignTokens.spacing.sm,
  },
  spacingExample: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.sm,
  },
  spacingBox: {
    backgroundColor: DesignTokens.colors.primary[200],
    borderRadius: 2,
  },
  buttonExamples: {
    gap: DesignTokens.spacing.md,
  },
  responsiveInfo: {
    marginVertical: 2,
  },
  accessibilityInfo: {
    marginVertical: 2,
  },
  layoutTitle: {
    marginBottom: DesignTokens.spacing.sm,
  },
  layoutDescription: {
    marginBottom: DesignTokens.spacing.lg,
    fontStyle: 'italic',
  },
  profileAvatar: {
    alignItems: 'center',
  },
  profileName: {
    marginTop: DesignTokens.spacing.sm,
  },
  profileInfo: {
    marginVertical: 2,
  },
  calendarDemo: {
    alignItems: 'center',
    gap: DesignTokens.spacing.sm,
  },
  timeSlotsDemo: {
    gap: DesignTokens.spacing.sm,
  },
  timeSlots: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.sm,
  },
  timeSlot: {
    paddingVertical: DesignTokens.spacing.sm,
    paddingHorizontal: DesignTokens.spacing.md,
    backgroundColor: DesignTokens.colors.primary[100],
    borderRadius: DesignTokens.borderRadius.sm,
  },
  videoCallDemo: {
    alignItems: 'center',
    gap: DesignTokens.spacing.sm,
  },
}); 