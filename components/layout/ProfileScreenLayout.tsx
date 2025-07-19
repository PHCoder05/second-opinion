import { DesignTokens } from '@/constants/DesignSystem';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

interface ProfileScreenLayoutProps {
  children: React.ReactNode;
  avatarSection?: React.ReactNode;
  infoSection?: React.ReactNode;
  buttonGroup?: React.ReactNode;
  scheduleSection?: React.ReactNode;
  scrollable?: boolean;
}

/**
 * ProfileScreen Layout - Exact JSON Implementation
 * Layout: "Top profile image, middle details, bottom actions."
 * Components: ["Avatar", "InfoSection", "ButtonGroup", "ScheduleCalendar"]
 */
export const ProfileScreenLayout: React.FC<ProfileScreenLayoutProps> = ({
  children,
  avatarSection,
  infoSection,
  buttonGroup,
  scheduleSection,
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
        {/* Top Profile Image/Avatar Section */}
        {avatarSection && (
          <View style={styles.avatarSection}>
            {avatarSection}
          </View>
        )}
        
        {/* Middle Details/Info Section */}
        {infoSection && (
          <View style={styles.infoSection}>
            {infoSection}
          </View>
        )}
        
        {/* Schedule Calendar Section */}
        {scheduleSection && (
          <View style={styles.scheduleSection}>
            {scheduleSection}
          </View>
        )}
        
        {/* Custom children content */}
        {children}
        
        {/* Bottom Actions/Button Group */}
        {buttonGroup && (
          <View style={styles.buttonGroup}>
            {buttonGroup}
          </View>
        )}
      </ContentComponent>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Main container with profile-specific styling
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
  
  // Top profile image/avatar section
  avatarSection: {
    alignItems: 'center',
    paddingVertical: DesignTokens.spacing.lg, // 24px from JSON
    paddingHorizontal: DesignTokens.spacing.md, // 16px from JSON
    backgroundColor: DesignTokens.colors.neutral.light,
    // Shadow following JSON shadow specification
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Middle details/info section
  infoSection: {
    paddingVertical: DesignTokens.spacing.lg, // 24px from JSON
    paddingHorizontal: DesignTokens.spacing.md, // 16px from JSON
    backgroundColor: DesignTokens.colors.neutral.light,
    marginTop: DesignTokens.spacing.sm, // 8px gap
    marginHorizontal: DesignTokens.spacing.md,
    borderRadius: DesignTokens.borderRadius.md, // 8px from JSON
    // Shadow following JSON shadow specification
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Schedule calendar section
  scheduleSection: {
    paddingVertical: DesignTokens.spacing.md, // 16px from JSON
    paddingHorizontal: DesignTokens.spacing.md, // 16px from JSON
    backgroundColor: DesignTokens.colors.neutral.light,
    marginTop: DesignTokens.spacing.sm, // 8px gap
    marginHorizontal: DesignTokens.spacing.md,
    borderRadius: DesignTokens.borderRadius.md, // 8px from JSON
    // Shadow following JSON shadow specification
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Bottom actions/button group
  buttonGroup: {
    paddingVertical: DesignTokens.spacing.lg, // 24px from JSON
    paddingHorizontal: DesignTokens.spacing.md, // 16px from JSON
    backgroundColor: DesignTokens.colors.neutral.light,
    marginTop: DesignTokens.spacing.sm, // 8px gap
    marginHorizontal: DesignTokens.spacing.md,
    marginBottom: DesignTokens.spacing.md, // Bottom margin
    borderRadius: DesignTokens.borderRadius.md, // 8px from JSON
    // Shadow following JSON shadow specification
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default ProfileScreenLayout; 