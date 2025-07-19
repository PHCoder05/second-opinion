import { Card, IconSymbol } from '@/components/ui';
import { MedicalColors } from '@/constants/Colors';
import { authService } from '@/src/services/authService';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInLeft,
    SlideInUp
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

// Mock user data - replace with actual user data from auth service
const USER_DATA = {
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@example.com',
  phone: '+1 (555) 123-4567',
  avatar: null,
  role: 'Patient',
  memberSince: 'January 2024',
  lastActive: '2 hours ago',
  preferences: {
    notifications: true,
    darkMode: false,
    language: 'English',
  },
};

const PROFILE_SECTIONS = [
  {
    id: 'personal',
    title: 'Personal Information',
    icon: 'person',
    color: MedicalColors.primary[600],
    items: [
      { label: 'Full Name', value: USER_DATA.name, icon: 'badge' },
      { label: 'Email', value: USER_DATA.email, icon: 'email' },
      { label: 'Phone', value: USER_DATA.phone, icon: 'phone' },
      { label: 'Role', value: USER_DATA.role, icon: 'work' },
    ],
  },
  {
    id: 'account',
    title: 'Account Settings',
    icon: 'settings',
    color: MedicalColors.secondary[600],
    items: [
      { label: 'Change Password', icon: 'lock', action: 'change_password' },
      { label: 'Two-Factor Authentication', icon: 'security', action: '2fa' },
      { label: 'Privacy Settings', icon: 'security', action: 'privacy' },
      { label: 'Data & Storage', icon: 'storage', action: 'storage' },
    ],
  },
  {
    id: 'preferences',
    title: 'Preferences',
    icon: 'tune',
    color: MedicalColors.accent[600],
    items: [
      { label: 'Notifications', icon: 'notifications', action: 'notifications', toggle: true },
      { label: 'Dark Mode', icon: 'brightness_4', action: 'dark_mode', toggle: true },
      { label: 'Language', icon: 'language', action: 'language' },
      { label: 'Accessibility', icon: 'accessibility', action: 'accessibility' },
    ],
  },
  {
    id: 'support',
    title: 'Support & Help',
    icon: 'help',
    color: MedicalColors.info[600],
    items: [
      { label: 'Help Center', icon: 'help', action: 'help' },
      { label: 'Contact Support', icon: 'support_agent', action: 'contact' },
      { label: 'Terms of Service', icon: 'description', action: 'terms' },
      { label: 'Privacy Policy', icon: 'policy', action: 'privacy_policy' },
    ],
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(USER_DATA);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Load actual user data from auth service
      const storedData = await authService.getStoredUserData();
      if (storedData) {
        setUserData(prev => ({
          ...prev,
          email: storedData.email || prev.email,
        }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadUserData();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              
              // Show loading state
              Alert.alert('Signing Out', 'Please wait while we sign you out...');
              
              // Perform logout with timeout
              const logoutPromise = authService.logout();
              const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Logout timeout')), 10000)
              );
              
              const { error } = await Promise.race([logoutPromise, timeoutPromise]);
              
              if (error) {
                throw error;
              }
              
              // Clear any local state
              setUserData({
                name: '',
                email: '',
                role: '',
                avatar: null,
              });
              
              // Navigate to welcome screen immediately
              router.replace('/welcome');
              
            } catch (error) {
              console.error('Logout error:', error);
              
              // Try alternative logout method
              try {
                await authService.signOut();
                router.replace('/welcome');
              } catch (fallbackError) {
                console.error('Fallback logout error:', fallbackError);
                Alert.alert(
                  'Logout Error', 
                  'There was an issue signing you out. Please try again or restart the app.',
                  [
                    { text: 'Try Again', onPress: handleLogout },
                    { text: 'Cancel', style: 'cancel' }
                  ]
                );
              }
            }
          },
        },
      ]
    );
  };

  const handleAction = async (action: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    switch (action) {
      case 'change_password':
        Alert.alert('Change Password', 'Password change feature coming soon!');
        break;
      case '2fa':
        Alert.alert('Two-Factor Authentication', '2FA setup coming soon!');
        break;
      case 'privacy':
        Alert.alert('Privacy Settings', 'Privacy settings coming soon!');
        break;
      case 'storage':
        Alert.alert('Data & Storage', 'Storage settings coming soon!');
        break;
      case 'notifications':
        Alert.alert('Notifications', 'Notification settings coming soon!');
        break;
      case 'dark_mode':
        Alert.alert('Dark Mode', 'Dark mode toggle coming soon!');
        break;
      case 'language':
        Alert.alert('Language', 'Language selection coming soon!');
        break;
      case 'accessibility':
        Alert.alert('Accessibility', 'Accessibility settings coming soon!');
        break;
      case 'help':
        Alert.alert('Help Center', 'Help center coming soon!');
        break;
      case 'contact':
        Alert.alert('Contact Support', 'Contact support coming soon!');
        break;
      case 'terms':
        Alert.alert('Terms of Service', 'Terms of service coming soon!');
        break;
      case 'privacy_policy':
        Alert.alert('Privacy Policy', 'Privacy policy coming soon!');
        break;
      default:
        Alert.alert('Coming Soon', 'This feature is coming soon!');
    }
  };

  const renderProfileHeader = () => (
    <Animated.View
      style={styles.profileHeader}
      entering={FadeInDown.duration(800).delay(200)}
    >
      <Card variant="elevated" style={styles.profileCard}>
        <LinearGradient
          colors={[MedicalColors.primary[600], MedicalColors.primary[700]]}
          style={styles.profileGradient}
        >
          <View style={styles.profileContent}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <IconSymbol name="person" size={40} color="#FFFFFF" />
              </View>
              <View style={styles.onlineIndicator} />
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userData.name}</Text>
              <Text style={styles.profileEmail}>{userData.email}</Text>
              <Text style={styles.profileRole}>{userData.role}</Text>
            </View>
            
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert('Edit Profile', 'Edit profile feature coming soon!');
              }}
            >
              <IconSymbol name="edit" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Appointments</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Consultations</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Reports</Text>
            </View>
          </View>
        </LinearGradient>
      </Card>
    </Animated.View>
  );

  const renderSection = (section: typeof PROFILE_SECTIONS[0], index: number) => (
    <Animated.View
      key={section.id}
      style={styles.section}
      entering={FadeInLeft.duration(600).delay(400 + index * 100)}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <IconSymbol name={section.icon} size={20} color={section.color} />
        </View>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
      
      <Card variant="outlined" style={styles.sectionCard}>
        {section.items.map((item, itemIndex) => (
          <TouchableOpacity
            key={itemIndex}
            style={[
              styles.sectionItem,
              itemIndex === section.items.length - 1 && styles.lastItem,
            ]}
            onPress={() => item.action && handleAction(item.action)}
            activeOpacity={0.7}
          >
            <View style={styles.itemLeft}>
              <IconSymbol name={item.icon} size={20} color={MedicalColors.neutral[600]} />
              <Text style={styles.itemLabel}>{item.label}</Text>
            </View>
            
            <View style={styles.itemRight}>
              {item.value && (
                <Text style={styles.itemValue} numberOfLines={1}>
                  {item.value}
                </Text>
              )}
              {item.toggle && (
                <View style={styles.toggleContainer}>
                  <View style={[styles.toggle, { backgroundColor: MedicalColors.success[600] }]} />
                </View>
              )}
              {!item.toggle && (
                <IconSymbol name="chevron_right" size={16} color={MedicalColors.neutral[400]} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </Card>
    </Animated.View>
  );

  const renderLogoutButton = () => (
    <Animated.View
      style={styles.logoutSection}
      entering={SlideInUp.duration(600).delay(800)}
    >
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.7}
        accessibilityLabel="Sign out button"
        accessibilityHint="Double tap to sign out of your account"
      >
        <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#FFFFFF" />
        <Text style={styles.logoutButtonText}>Sign Out</Text>
      </TouchableOpacity>
      
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderProfileHeader()}
        
        {PROFILE_SECTIONS.map((section, index) => renderSection(section, index))}
        
        {renderLogoutButton()}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  
  // Profile Header
  profileHeader: {
    marginBottom: 24,
  },
  profileCard: {
    overflow: 'hidden',
  },
  profileGradient: {
    padding: 24,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: MedicalColors.success[600],
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  
  // Sections
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: MedicalColors.neutral[800],
  },
  sectionCard: {
    padding: 0,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: MedicalColors.neutral[100],
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
    color: MedicalColors.neutral[800],
    marginLeft: 12,
    fontWeight: '500',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    marginRight: 8,
    maxWidth: 120,
  },
  toggleContainer: {
    marginRight: 8,
  },
  toggle: {
    width: 40,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Logout Section
  logoutSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
    minHeight: 56,
    minWidth: 200,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    color: MedicalColors.neutral[500],
  },
  
  bottomSpacing: {
    height: 40,
  },
}); 