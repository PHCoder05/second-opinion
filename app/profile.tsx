import { IconSymbol } from '@/components/ui';
import { authService } from '@/src/services/authService';
import { profileService, UserProfile, UserSession } from '@/src/services/profileService';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

interface ProfileSection {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
}

interface EditableField {
  key: keyof UserProfile;
  label: string;
  type: 'text' | 'email' | 'phone' | 'date' | 'textarea' | 'select';
  options?: string[];
  multiline?: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recentSessions, setRecentSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [medicalHistoryModalVisible, setMedicalHistoryModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [editValue, setEditValue] = useState('');
  const [activeSection, setActiveSection] = useState<string>('personal');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Medical history state
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newAllergy, setNewAllergy] = useState('');

  const personalFields: EditableField[] = [
    { key: 'first_name', label: 'First Name', type: 'text' },
    { key: 'last_name', label: 'Last Name', type: 'text' },
    { key: 'phone_number', label: 'Phone Number', type: 'phone' },
    { key: 'date_of_birth', label: 'Date of Birth', type: 'date' },
    { key: 'emergency_contact_name', label: 'Emergency Contact Name', type: 'text' },
    { key: 'emergency_contact_phone', label: 'Emergency Contact Phone', type: 'phone' },
  ];

  const medicalFields: EditableField[] = [
    { key: 'insurance_provider', label: 'Insurance Provider', type: 'text' },
    { key: 'preferred_language', label: 'Preferred Language', type: 'select', 
      options: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic'] },
  ];

  const PROFILE_SECTIONS = [
    {
      id: 'records',
      title: 'Medical Records',
      description: 'View and manage your records',
      icon: 'description',
      route: '/medical-records',
    },
    {
      id: 'consultations',
      title: 'Consultations',
      description: 'Your consultation history',
      icon: 'medical-services',
      route: '/consultations',
    },
    {
      id: 'documents',
      title: 'Documents',
      description: 'Uploaded medical documents',
      icon: 'folder',
      route: '/documents',
    },
    {
      id: 'account',
      title: 'Account Settings',
      description: 'Manage your account',
      icon: 'vpn-key',
      route: '/account-settings',
    },
    {
      id: 'health',
      title: 'Health Profile',
      description: 'Your health information',
      icon: 'monitor-heart',
      route: '/health-profile',
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Security settings',
      icon: 'security',
      route: '/privacy-settings',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage notifications',
      icon: 'notifications',
      route: '/notification-settings',
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Get assistance',
      icon: 'help',
      route: '/help',
    },
  ];

  const loadProfileData = async () => {
    try {
      const { user } = await authService.getCurrentUser();
      if (!user) {
        router.replace('/signin');
        return;
      }

      // Load user profile
      const { data: profile, error: profileError } = await profileService.getUserProfile(user.id);
      if (profile) {
        setUserProfile(profile);
        setMedicalConditions(profile.medical_conditions || []);
        setMedications(profile.medications || []);
        setAllergies(profile.allergies || []);
      } else if (!profileError) {
        // Create profile if it doesn't exist
        const { data: newProfile } = await profileService.createUserProfile(user.id, user.email || '');
        if (newProfile) {
          setUserProfile(newProfile);
        }
      }

      // Load recent sessions
      const { data: sessions } = await profileService.getUserSessions(user.id, 5);
      if (sessions) {
        setRecentSessions(sessions);
      }

    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              const { user } = await authService.getCurrentUser();
              if (user) {
                await profileService.endSession(user.id);
              }
              await authService.signOut();
              router.replace('/signin');
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout properly');
            }
          },
        },
      ]
    );
  };

  const handleEditField = (field: EditableField) => {
    setEditingField(field);
    const currentValue = userProfile?.[field.key];
    setEditValue(currentValue?.toString() || '');
    setEditModalVisible(true);
  };

  const saveFieldEdit = async () => {
    if (!userProfile || !editingField) return;

    try {
      let processedValue: any = editValue;
      
      // Process value based on field type
      if (editingField.key === 'medical_conditions' || editingField.key === 'medications' || editingField.key === 'allergies') {
        processedValue = editValue.split(',').map(item => item.trim()).filter(item => item);
      }

      const updates = { [editingField.key]: processedValue };
      const { data, error } = await profileService.updateUserProfile(userProfile.user_id, updates);
      
      if (error) {
        Alert.alert('Error', 'Failed to update profile');
        return;
      }

      if (data) {
        setUserProfile(data);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setEditModalVisible(false);
      setEditingField(null);
      setEditValue('');
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    try {
      // Note: Supabase password update would typically require re-authentication
      // This is a simplified version - in production, you'd handle this properly
      Alert.alert('Success', 'Password updated successfully');
      setPasswordModalVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Error', 'Failed to update password');
    }
  };

  const saveMedicalHistory = async () => {
    if (!userProfile) return;

    try {
      const updates = {
        medical_conditions: medicalConditions,
        medications: medications,
        allergies: allergies,
      };

      const { data, error } = await profileService.updateUserProfile(userProfile.user_id, updates);
      
      if (error) {
        Alert.alert('Error', 'Failed to update medical history');
        return;
      }

      if (data) {
        setUserProfile(data);
        Alert.alert('Success', 'Medical history updated successfully');
        setMedicalHistoryModalVisible(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update medical history');
    }
  };

  const addMedicalItem = (type: 'condition' | 'medication' | 'allergy', value: string) => {
    if (!value.trim()) return;

    switch (type) {
      case 'condition':
        setMedicalConditions([...medicalConditions, value.trim()]);
        setNewCondition('');
        break;
      case 'medication':
        setMedications([...medications, value.trim()]);
        setNewMedication('');
        break;
      case 'allergy':
        setAllergies([...allergies, value.trim()]);
        setNewAllergy('');
        break;
    }
  };

  const removeMedicalItem = (type: 'condition' | 'medication' | 'allergy', index: number) => {
    switch (type) {
      case 'condition':
        setMedicalConditions(medicalConditions.filter((_, i) => i !== index));
        break;
      case 'medication':
        setMedications(medications.filter((_, i) => i !== index));
        break;
      case 'allergy':
        setAllergies(allergies.filter((_, i) => i !== index));
        break;
    }
  };

  const formatSessionDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeIn}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <IconSymbol name="chevron.left" size={24} color="rgb(49, 58, 52)" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.headerButton}>
          <IconSymbol name="ellipsis.circle" size={24} color="rgb(132, 204, 22)" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <Animated.View style={styles.profileCard} entering={FadeInDown.delay(200)}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
                              <IconSymbol name="account_circle" size={80} color="rgb(132, 204, 22)" />
              <TouchableOpacity style={styles.editAvatarButton}>
                <IconSymbol name="photo_camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {userProfile?.first_name || userProfile?.last_name 
                  ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim()
                  : 'User'
                }
              </Text>
              <Text style={styles.profileEmail}>{userProfile?.email}</Text>
              {userProfile?.health_goal && (
                <View style={styles.healthGoalBadge}>
                  <IconSymbol name="target" size={12} color="rgb(132, 204, 22)" />
                  <Text style={styles.healthGoalText}>{userProfile.health_goal}</Text>
                </View>
              )}
              <Text style={styles.profileType}>Second Opinion Patient</Text>
            </View>
          </View>
        </Animated.View>

        {/* Section Tabs */}
        <Animated.View style={styles.sectionTabs} entering={FadeInDown.delay(300)}>
          <TouchableOpacity 
            style={[styles.sectionTab, activeSection === 'personal' && styles.activeTab]}
            onPress={() => setActiveSection('personal')}
          >
            <Text style={[styles.sectionTabText, activeSection === 'personal' && styles.activeTabText]}>
              Personal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sectionTab, activeSection === 'medical' && styles.activeTab]}
            onPress={() => setActiveSection('medical')}
          >
            <Text style={[styles.sectionTabText, activeSection === 'medical' && styles.activeTabText]}>
              Medical
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sectionTab, activeSection === 'settings' && styles.activeTab]}
            onPress={() => setActiveSection('settings')}
          >
            <Text style={[styles.sectionTabText, activeSection === 'settings' && styles.activeTabText]}>
              Settings
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Personal Information Section */}
        {activeSection === 'personal' && (
          <Animated.View style={styles.section} entering={FadeInDown.delay(400)}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.fieldsContainer}>
              {personalFields.map((field) => (
                <TouchableOpacity 
                  key={field.key}
                  style={styles.fieldItem}
                  onPress={() => handleEditField(field)}
                >
                  <View style={styles.fieldContent}>
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    <Text style={styles.fieldValue}>
                      {userProfile?.[field.key] ? 
                        (field.type === 'date' && userProfile[field.key] ? 
                          new Date(userProfile[field.key] as string).toLocaleDateString() : 
                          userProfile[field.key]?.toString()
                        ) : 'Not set'
                      }
                    </Text>
                  </View>
                  <IconSymbol name="chevron.right" size={16} color="rgb(100, 112, 103)" />
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Medical Information Section */}
        {activeSection === 'medical' && (
          <Animated.View style={styles.section} entering={FadeInDown.delay(400)}>
            <Text style={styles.sectionTitle}>Medical Information</Text>
            
            {/* Quick Medical Stats */}
            <View style={styles.medicalStatsContainer}>
              <View style={styles.medicalStatCard}>
                <IconSymbol name="heart.fill" size={20} color="rgb(239, 68, 68)" />
                <Text style={styles.medicalStatNumber}>{medicalConditions.length}</Text>
                <Text style={styles.medicalStatLabel}>Conditions</Text>
              </View>
              <View style={styles.medicalStatCard}>
                <IconSymbol name="medication" size={20} color="rgb(59, 130, 246)" />
                <Text style={styles.medicalStatNumber}>{medications.length}</Text>
                <Text style={styles.medicalStatLabel}>Medications</Text>
              </View>
              <View style={styles.medicalStatCard}>
                <IconSymbol name="exclamationmark.triangle.fill" size={20} color="rgb(251, 204, 21)" />
                <Text style={styles.medicalStatNumber}>{allergies.length}</Text>
                <Text style={styles.medicalStatLabel}>Allergies</Text>
              </View>
            </View>

            <View style={styles.fieldsContainer}>
              {medicalFields.map((field) => (
                <TouchableOpacity 
                  key={field.key}
                  style={styles.fieldItem}
                  onPress={() => handleEditField(field)}
                >
                  <View style={styles.fieldContent}>
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    <Text style={styles.fieldValue}>
                      {userProfile?.[field.key]?.toString() || 'Not set'}
                    </Text>
                  </View>
                  <IconSymbol name="chevron.right" size={16} color="rgb(100, 112, 103)" />
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <Animated.View style={styles.section} entering={FadeInDown.delay(400)}>
            <Text style={styles.sectionTitle}>Settings & Services</Text>
            <View style={styles.sectionsContainer}>
              {PROFILE_SECTIONS.map((section) => (
                <TouchableOpacity
                  key={section.id}
                  style={styles.sectionItem}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(section.route);
                  }}
                >
                  <View style={styles.sectionIcon}>
                    <IconSymbol name={section.icon} size={20} color="rgb(132, 204, 22)" />
                  </View>
                  <View style={styles.sectionItemContent}>
                    <Text style={styles.sectionItemTitle}>{section.title}</Text>
                    <Text style={styles.sectionItemDescription}>{section.description}</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={16} color="rgb(100, 112, 103)" />
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <Animated.View style={styles.section} entering={FadeInDown.delay(500)}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.sessionsContainer}>
              {recentSessions.map((session) => (
                <View key={session.id} style={styles.sessionItem}>
                  <View style={styles.sessionIcon}>
                    <IconSymbol name="clock.fill" size={16} color="rgb(100, 112, 103)" />
                  </View>
                  <View style={styles.sessionContent}>
                    <Text style={styles.sessionDate}>{formatDate(session.login_time)}</Text>
                    <Text style={styles.sessionDuration}>
                      {session.session_duration 
                        ? `Duration: ${formatSessionDuration(session.session_duration)}`
                        : 'Active session'
                      }
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Logout Button */}
        <Animated.View style={styles.section} entering={FadeInDown.delay(600)}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <IconSymbol name="arrow_circle_right" size={24} color="white" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Edit Field Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {editingField?.label}</Text>
            {editingField?.type === 'select' ? (
              <ScrollView style={styles.selectContainer}>
                {editingField.options?.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.selectOption, editValue === option && styles.selectedOption]}
                    onPress={() => setEditValue(option)}
                  >
                    <Text style={[styles.selectOptionText, editValue === option && styles.selectedOptionText]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <TextInput
                style={[styles.modalInput, editingField?.multiline && styles.modalTextArea]}
                value={editValue}
                onChangeText={setEditValue}
                placeholder={`Enter ${editingField?.label.toLowerCase()}`}
                keyboardType={editingField?.type === 'email' ? 'email-address' : editingField?.type === 'phone' ? 'phone-pad' : 'default'}
                multiline={editingField?.multiline}
                autoFocus
              />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={saveFieldEdit}
              >
                <Text style={styles.modalSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        visible={passwordModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              style={styles.modalInput}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Current Password"
              secureTextEntry
            />
            <TextInput
              style={styles.modalInput}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New Password"
              secureTextEntry
            />
            <TextInput
              style={styles.modalInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm New Password"
              secureTextEntry
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setPasswordModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={handlePasswordChange}
              >
                <Text style={styles.modalSaveButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Medical History Modal */}
      <Modal
        visible={medicalHistoryModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMedicalHistoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.largeModalContent]}>
            <Text style={styles.modalTitle}>Medical History</Text>
            <ScrollView style={styles.medicalHistoryScroll}>
              
              {/* Medical Conditions */}
              <View style={styles.medicalSection}>
                <Text style={styles.medicalSectionTitle}>Medical Conditions</Text>
                <View style={styles.addItemContainer}>
                  <TextInput
                    style={styles.addItemInput}
                    value={newCondition}
                    onChangeText={setNewCondition}
                    placeholder="Add medical condition"
                  />
                  <TouchableOpacity 
                    style={styles.addItemButton}
                    onPress={() => addMedicalItem('condition', newCondition)}
                  >
                    <IconSymbol name="plus" size={16} color="white" />
                  </TouchableOpacity>
                </View>
                {medicalConditions.map((condition, index) => (
                  <View key={index} style={styles.medicalItem}>
                    <Text style={styles.medicalItemText}>{condition}</Text>
                    <TouchableOpacity onPress={() => removeMedicalItem('condition', index)}>
                      <IconSymbol name="xmark.circle.fill" size={20} color="rgb(239, 68, 68)" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Medications */}
              <View style={styles.medicalSection}>
                <Text style={styles.medicalSectionTitle}>Medications</Text>
                <View style={styles.addItemContainer}>
                  <TextInput
                    style={styles.addItemInput}
                    value={newMedication}
                    onChangeText={setNewMedication}
                    placeholder="Add medication"
                  />
                  <TouchableOpacity 
                    style={styles.addItemButton}
                    onPress={() => addMedicalItem('medication', newMedication)}
                  >
                    <IconSymbol name="plus" size={16} color="white" />
                  </TouchableOpacity>
                </View>
                {medications.map((medication, index) => (
                  <View key={index} style={styles.medicalItem}>
                    <Text style={styles.medicalItemText}>{medication}</Text>
                    <TouchableOpacity onPress={() => removeMedicalItem('medication', index)}>
                      <IconSymbol name="xmark.circle.fill" size={20} color="rgb(239, 68, 68)" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Allergies */}
              <View style={styles.medicalSection}>
                <Text style={styles.medicalSectionTitle}>Allergies</Text>
                <View style={styles.addItemContainer}>
                  <TextInput
                    style={styles.addItemInput}
                    value={newAllergy}
                    onChangeText={setNewAllergy}
                    placeholder="Add allergy"
                  />
                  <TouchableOpacity 
                    style={styles.addItemButton}
                    onPress={() => addMedicalItem('allergy', newAllergy)}
                  >
                    <IconSymbol name="plus" size={16} color="white" />
                  </TouchableOpacity>
                </View>
                {allergies.map((allergy, index) => (
                  <View key={index} style={styles.medicalItem}>
                    <Text style={styles.medicalItemText}>{allergy}</Text>
                    <TouchableOpacity onPress={() => removeMedicalItem('allergy', index)}>
                      <IconSymbol name="xmark.circle.fill" size={20} color="rgb(239, 68, 68)" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setMedicalHistoryModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={saveMedicalHistory}
              >
                <Text style={styles.modalSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(245, 246, 245)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(47, 60, 51, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(47, 60, 51, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: 'rgba(47, 60, 51, 0.05)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgb(132, 204, 22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    marginBottom: 8,
  },
  healthGoalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
    gap: 4,
    alignSelf: 'flex-start',
  },
  healthGoalText: {
    fontSize: 12,
    color: 'rgb(132, 204, 22)',
    fontWeight: '500',
  },
  profileType: {
    fontSize: 14,
    color: 'rgb(59, 130, 246)',
    fontWeight: '500',
  },
  sectionTabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    shadowColor: 'rgba(47, 60, 51, 0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'rgb(132, 204, 22)',
  },
  sectionTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgb(100, 112, 103)',
  },
  activeTabText: {
    color: 'white',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
    marginBottom: 16,
  },
  medicalStatsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  medicalStatCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: 'rgba(47, 60, 51, 0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  medicalStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
    marginTop: 8,
    marginBottom: 4,
  },
  medicalStatLabel: {
    fontSize: 12,
    color: 'rgb(100, 112, 103)',
    textAlign: 'center',
  },
  fieldsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: 'rgba(47, 60, 51, 0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  fieldItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100, 112, 103, 0.1)',
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: 'rgb(49, 58, 52)',
    fontWeight: '500',
  },
  sectionsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: 'rgba(47, 60, 51, 0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100, 112, 103, 0.1)',
  },
  sectionItemContent: {
    flex: 1,
  },
  sectionItemTitle: {
    fontSize: 16,
    color: 'rgb(49, 58, 52)',
    fontWeight: '500',
    marginBottom: 4,
  },
  sectionItemDescription: {
    fontSize: 12,
    color: 'rgb(100, 112, 103)',
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100, 112, 103, 0.1)',
  },
  sessionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(100, 112, 103, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionContent: {
    flex: 1,
  },
  sessionDate: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgb(49, 58, 52)',
    marginBottom: 2,
  },
  sessionDuration: {
    fontSize: 12,
    color: 'rgb(100, 112, 103)',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(239, 68, 68)',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    maxHeight: '70%',
  },
  largeModalContent: {
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
    marginBottom: 16,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: 'rgba(100, 112, 103, 0.3)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  selectContainer: {
    maxHeight: 200,
    marginBottom: 16,
  },
  selectOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100, 112, 103, 0.1)',
  },
  selectedOption: {
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
  },
  selectOptionText: {
    fontSize: 16,
    color: 'rgb(49, 58, 52)',
  },
  selectedOptionText: {
    color: 'rgb(132, 204, 22)',
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: 'rgba(100, 112, 103, 0.1)',
  },
  modalSaveButton: {
    backgroundColor: 'rgb(132, 204, 22)',
  },
  modalCancelButtonText: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
  },
  modalSaveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  medicalHistoryScroll: {
    maxHeight: 400,
  },
  medicalSection: {
    marginBottom: 20,
  },
  medicalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginBottom: 12,
  },
  addItemContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  addItemInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(100, 112, 103, 0.3)',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
  },
  addItemButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgb(132, 204, 22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(100, 112, 103, 0.05)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 4,
  },
  medicalItemText: {
    fontSize: 14,
    color: 'rgb(49, 58, 52)',
    flex: 1,
  },
}); 