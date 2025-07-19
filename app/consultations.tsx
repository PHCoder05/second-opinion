import { IconSymbol } from '@/components/ui';
import { authService } from '@/src/services/authService';
import { Doctor, medicalRecordsService, SecondOpinionRequest } from '@/src/services/medicalRecordsService';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

interface ConsultationStats {
  total: number;
  pending: number;
  completed: number;
  inProgress: number;
}

export default function ConsultationsScreen() {
  const router = useRouter();
  const [consultations, setConsultations] = useState<SecondOpinionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<ConsultationStats>({ total: 0, pending: 0, completed: 0, inProgress: 0 });
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [doctorModalVisible, setDoctorModalVisible] = useState(false);
  const [recommendedDoctors, setRecommendedDoctors] = useState<Doctor[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');

  // New consultation form state
  const [newConsultation, setNewConsultation] = useState({
    title: '',
    description: '',
    specialty_required: 'General Medicine',
    urgency: 'medium' as SecondOpinionRequest['urgency'],
    symptoms: [] as string[],
    current_diagnosis: '',
    current_treatment: '',
    questions_for_doctor: [] as string[],
  });

  const [symptomInput, setSymptomInput] = useState('');
  const [questionInput, setQuestionInput] = useState('');

  const specialties = [
    'General Medicine', 'Cardiology', 'Neurology', 'Oncology', 'Orthopedics',
    'Dermatology', 'Gastroenterology', 'Endocrinology', 'Pulmonology',
    'Psychiatry', 'Radiology', 'Pathology', 'Emergency Medicine', 'Surgery',
    'Pediatrics', 'Gynecology', 'Urology', 'Ophthalmology', 'ENT'
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low Priority', color: 'rgb(34, 197, 94)', description: 'Can wait 1-2 weeks' },
    { value: 'medium', label: 'Medium Priority', color: 'rgb(251, 204, 21)', description: 'Within a few days' },
    { value: 'high', label: 'High Priority', color: 'rgb(249, 115, 22)', description: 'Within 24 hours' },
    { value: 'urgent', label: 'Urgent', color: 'rgb(239, 68, 68)', description: 'Immediate attention' },
  ];

  const loadConsultations = async () => {
    try {
      const { user } = await authService.getCurrentUser();
      if (!user) {
        router.replace('/signin');
        return;
      }

      const { data, error } = await medicalRecordsService.getUserSecondOpinionRequests(user.id);
      if (data) {
        setConsultations(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('Error loading consultations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (consultations: SecondOpinionRequest[]) => {
    const stats = {
      total: consultations.length,
      pending: consultations.filter(c => ['submitted', 'under_review'].includes(c.status)).length,
      completed: consultations.filter(c => c.status === 'completed').length,
      inProgress: consultations.filter(c => c.status === 'responded').length,
    };
    setStats(stats);
  };

  useEffect(() => {
    loadConsultations();
  }, []);

  const handleCreateConsultation = async () => {
    if (!newConsultation.title.trim() || !newConsultation.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const { user } = await authService.getCurrentUser();
      if (!user) return;

      const consultationData = {
        ...newConsultation,
        questions_for_doctor: newConsultation.questions_for_doctor.filter(q => q.trim()),
        symptoms: newConsultation.symptoms.filter(s => s.trim()),
      };

      const { data, error } = await medicalRecordsService.createSecondOpinionRequest(user.id, consultationData);
      
      if (error) {
        Alert.alert('Error', 'Failed to create consultation request');
        return;
      }

      if (data) {
        setConsultations([data, ...consultations]);
        calculateStats([data, ...consultations]);
        setCreateModalVisible(false);
        resetForm();
        
        // Load recommended doctors
        loadRecommendedDoctors(newConsultation.specialty_required, newConsultation.symptoms);
        setDoctorModalVisible(true);
        
        Alert.alert('Success', 'Consultation request created successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create consultation request');
    }
  };

  const loadRecommendedDoctors = async (specialty: string, symptoms: string[]) => {
    try {
      const { data } = await medicalRecordsService.getRecommendedDoctors(specialty, symptoms, 5);
      if (data) {
        setRecommendedDoctors(data);
      }
    } catch (error) {
      console.error('Error loading recommended doctors:', error);
    }
  };

  const resetForm = () => {
    setNewConsultation({
      title: '',
      description: '',
      specialty_required: 'General Medicine',
      urgency: 'medium',
      symptoms: [],
      current_diagnosis: '',
      current_treatment: '',
      questions_for_doctor: [],
    });
    setSymptomInput('');
    setQuestionInput('');
  };

  const addSymptom = () => {
    if (symptomInput.trim() && !newConsultation.symptoms.includes(symptomInput.trim())) {
      setNewConsultation({
        ...newConsultation,
        symptoms: [...newConsultation.symptoms, symptomInput.trim()]
      });
      setSymptomInput('');
    }
  };

  const removeSymptom = (index: number) => {
    setNewConsultation({
      ...newConsultation,
      symptoms: newConsultation.symptoms.filter((_, i) => i !== index)
    });
  };

  const addQuestion = () => {
    if (questionInput.trim() && !newConsultation.questions_for_doctor.includes(questionInput.trim())) {
      setNewConsultation({
        ...newConsultation,
        questions_for_doctor: [...newConsultation.questions_for_doctor, questionInput.trim()]
      });
      setQuestionInput('');
    }
  };

  const removeQuestion = (index: number) => {
    setNewConsultation({
      ...newConsultation,
      questions_for_doctor: newConsultation.questions_for_doctor.filter((_, i) => i !== index)
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'rgb(100, 112, 103)';
      case 'submitted': return 'rgb(59, 130, 246)';
      case 'under_review': return 'rgb(251, 204, 21)';
      case 'responded': return 'rgb(132, 204, 22)';
      case 'completed': return 'rgb(34, 197, 94)';
      case 'cancelled': return 'rgb(239, 68, 68)';
      default: return 'rgb(100, 112, 103)';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'submitted': return 'Submitted';
      case 'under_review': return 'Under Review';
      case 'responded': return 'Doctor Responded';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    const level = urgencyLevels.find(l => l.value === urgency);
    return level?.color || 'rgb(100, 112, 103)';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFilteredConsultations = () => {
    switch (activeTab) {
      case 'pending':
        return consultations.filter(c => ['submitted', 'under_review'].includes(c.status));
      case 'completed':
        return consultations.filter(c => c.status === 'completed');
      default:
        return consultations;
    }
  };

  const renderConsultationCard = ({ item }: { item: SecondOpinionRequest }) => (
    <Animated.View entering={FadeInDown} style={styles.consultationCard}>
      <View style={styles.consultationHeader}>
        <View style={styles.consultationInfo}>
          <Text style={styles.consultationTitle}>{item.title}</Text>
          <Text style={styles.consultationSpecialty}>{item.specialty_required}</Text>
          <Text style={styles.consultationDate}>{formatDate(item.created_at)}</Text>
        </View>
        <View style={styles.consultationBadges}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
          </View>
          <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(item.urgency) }]}>
            <Text style={styles.urgencyText}>
              {urgencyLevels.find(l => l.value === item.urgency)?.label}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.consultationDescription} numberOfLines={2}>
        {item.description}
      </Text>

      {item.symptoms.length > 0 && (
        <View style={styles.symptomsContainer}>
          <Text style={styles.symptomsLabel}>Symptoms:</Text>
          <Text style={styles.symptomsText}>
            {item.symptoms.slice(0, 3).join(', ')}
            {item.symptoms.length > 3 ? ` +${item.symptoms.length - 3} more` : ''}
          </Text>
        </View>
      )}

      {item.doctor_response && (
        <View style={styles.responseContainer}>
          <IconSymbol name="checkmark.circle.fill" size={16} color="rgb(34, 197, 94)" />
          <Text style={styles.responseText}>Doctor has responded</Text>
        </View>
      )}

      <View style={styles.consultationActions}>
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol name="eye.fill" size={16} color="rgb(59, 130, 246)" />
          <Text style={[styles.actionText, { color: 'rgb(59, 130, 246)' }]}>View Details</Text>
        </TouchableOpacity>
        {item.status === 'draft' && (
          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol name="paperplane.fill" size={16} color="rgb(132, 204, 22)" />
            <Text style={[styles.actionText, { color: 'rgb(132, 204, 22)' }]}>Submit</Text>
          </TouchableOpacity>
        )}
        {item.doctor_response && (
          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol name="message.fill" size={16} color="rgb(168, 85, 247)" />
            <Text style={[styles.actionText, { color: 'rgb(168, 85, 247)' }]}>Chat</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );

  const renderDoctorCard = ({ item }: { item: Doctor }) => (
    <View style={styles.doctorCard}>
      <View style={styles.doctorInfo}>
        <View style={styles.doctorAvatar}>
          <IconSymbol name="account_circle" size={40} color="rgb(132, 204, 22)" />
        </View>
        <View style={styles.doctorDetails}>
          <Text style={styles.doctorName}>{item.name}</Text>
          <Text style={styles.doctorTitle}>{item.title}</Text>
          <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
          <View style={styles.doctorRating}>
            <IconSymbol name="star.fill" size={12} color="rgb(251, 204, 21)" />
            <Text style={styles.ratingText}>{item.rating} ({item.reviews_count} reviews)</Text>
          </View>
        </View>
      </View>
      <View style={styles.doctorActions}>
        <Text style={styles.consultationFee}>${item.consultation_fee}</Text>
        <TouchableOpacity style={styles.selectDoctorButton}>
          <Text style={styles.selectDoctorText}>Select</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading consultations...</Text>
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
        <Text style={styles.headerTitle}>Second Opinions</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setCreateModalVisible(true)}
        >
          <IconSymbol name="plus" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {/* Stats Cards */}
      <Animated.View style={styles.statsContainer} entering={FadeInDown.delay(200)}>
        <View style={styles.statCard}>
          <IconSymbol name="description" size={20} color="rgb(59, 130, 246)" />
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Requests</Text>
        </View>
        <View style={styles.statCard}>
          <IconSymbol name="clock.fill" size={20} color="rgb(251, 204, 21)" />
          <Text style={styles.statNumber}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <IconSymbol name="checkmark.circle.fill" size={20} color="rgb(34, 197, 94)" />
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </Animated.View>

      {/* Tabs */}
      <Animated.View style={styles.tabsContainer} entering={FadeInDown.delay(300)}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Completed</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Consultations List */}
      <FlatList
        data={getFilteredConsultations()}
        renderItem={renderConsultationCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.consultationsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSymbol name="stethoscope" size={64} color="rgb(100, 112, 103)" />
            <Text style={styles.emptyTitle}>No Second Opinion Requests</Text>
            <Text style={styles.emptySubtitle}>
              Get expert medical opinions from top doctors. Create your first consultation request.
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => setCreateModalVisible(true)}
            >
              <Text style={styles.emptyButtonText}>Request Second Opinion</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Protocol Flow FAB */}
      <TouchableOpacity 
        style={styles.protocolFab}
        onPress={() => router.push('/medical-protocol-flow')}
      >
        <IconSymbol name="checkmark.shield" size={24} color="white" />
        <Text style={styles.protocolFabText}>Protocol</Text>
      </TouchableOpacity>

      {/* Create Consultation Modal */}
      <Modal
        visible={createModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Consultation</Text>
            <TouchableOpacity onPress={handleCreateConsultation}>
              <Text style={styles.modalSaveText}>Create</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Title *</Text>
              <TextInput
                style={styles.formInput}
                value={newConsultation.title}
                onChangeText={(text) => setNewConsultation({ ...newConsultation, title: text })}
                placeholder="Brief description of your concern"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Medical Specialty</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.specialtySelector}>
                  {specialties.map((specialty) => (
                    <TouchableOpacity
                      key={specialty}
                      style={[
                        styles.specialtyOption,
                        newConsultation.specialty_required === specialty && styles.selectedSpecialtyOption
                      ]}
                      onPress={() => setNewConsultation({ ...newConsultation, specialty_required: specialty })}
                    >
                      <Text style={[
                        styles.specialtyOptionText,
                        newConsultation.specialty_required === specialty && styles.selectedSpecialtyOptionText
                      ]}>
                        {specialty}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Urgency Level</Text>
              <View style={styles.urgencySelector}>
                {urgencyLevels.map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.urgencyOption,
                      { borderColor: level.color },
                      newConsultation.urgency === level.value && { backgroundColor: level.color }
                    ]}
                    onPress={() => setNewConsultation({ ...newConsultation, urgency: level.value as SecondOpinionRequest['urgency'] })}
                  >
                    <Text style={[
                      styles.urgencyOptionText,
                      { color: newConsultation.urgency === level.value ? 'white' : level.color }
                    ]}>
                      {level.label}
                    </Text>
                    <Text style={[
                      styles.urgencyDescription,
                      { color: newConsultation.urgency === level.value ? 'rgba(255,255,255,0.8)' : 'rgb(100, 112, 103)' }
                    ]}>
                      {level.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Detailed Description *</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={newConsultation.description}
                onChangeText={(text) => setNewConsultation({ ...newConsultation, description: text })}
                placeholder="Provide detailed information about your condition, symptoms, and medical history"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Symptoms</Text>
              <View style={styles.addItemContainer}>
                <TextInput
                  style={styles.addItemInput}
                  value={symptomInput}
                  onChangeText={setSymptomInput}
                  placeholder="Add a symptom"
                  onSubmitEditing={addSymptom}
                />
                <TouchableOpacity style={styles.addItemButton} onPress={addSymptom}>
                  <IconSymbol name="plus" size={16} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.tagsContainer}>
                {newConsultation.symptoms.map((symptom, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{symptom}</Text>
                    <TouchableOpacity onPress={() => removeSymptom(index)}>
                      <IconSymbol name="xmark" size={12} color="rgb(100, 112, 103)" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Current Diagnosis (if any)</Text>
              <TextInput
                style={styles.formInput}
                value={newConsultation.current_diagnosis}
                onChangeText={(text) => setNewConsultation({ ...newConsultation, current_diagnosis: text })}
                placeholder="What has your current doctor diagnosed?"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Current Treatment (if any)</Text>
              <TextInput
                style={styles.formInput}
                value={newConsultation.current_treatment}
                onChangeText={(text) => setNewConsultation({ ...newConsultation, current_treatment: text })}
                placeholder="What treatment are you currently receiving?"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Questions for the Doctor</Text>
              <View style={styles.addItemContainer}>
                <TextInput
                  style={styles.addItemInput}
                  value={questionInput}
                  onChangeText={setQuestionInput}
                  placeholder="Add a specific question"
                  onSubmitEditing={addQuestion}
                />
                <TouchableOpacity style={styles.addItemButton} onPress={addQuestion}>
                  <IconSymbol name="plus" size={16} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.questionsContainer}>
                {newConsultation.questions_for_doctor.map((question, index) => (
                  <View key={index} style={styles.questionItem}>
                    <Text style={styles.questionText}>{question}</Text>
                    <TouchableOpacity onPress={() => removeQuestion(index)}>
                      <IconSymbol name="xmark.circle.fill" size={20} color="rgb(239, 68, 68)" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.attachRecordsSection}>
              <Text style={styles.formLabel}>Attach Medical Records</Text>
              <TouchableOpacity style={styles.attachButton}>
                <IconSymbol name="paperclip" size={20} color="rgb(132, 204, 22)" />
                <Text style={styles.attachButtonText}>Select from Medical Records</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Recommended Doctors Modal */}
      <Modal
        visible={doctorModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDoctorModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setDoctorModalVisible(false)}>
              <Text style={styles.modalCancelText}>Skip</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Recommended Doctors</Text>
            <TouchableOpacity onPress={() => setDoctorModalVisible(false)}>
              <Text style={styles.modalSaveText}>Done</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={recommendedDoctors}
            renderItem={renderDoctorCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.doctorsList}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgb(132, 204, 22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  statCard: {
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
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgb(100, 112, 103)',
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: 'rgba(47, 60, 51, 0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'rgb(132, 204, 22)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgb(100, 112, 103)',
  },
  activeTabText: {
    color: 'white',
  },
  consultationsList: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  consultationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: 'rgba(47, 60, 51, 0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  consultationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  consultationInfo: {
    flex: 1,
  },
  consultationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginBottom: 4,
  },
  consultationSpecialty: {
    fontSize: 14,
    color: 'rgb(59, 130, 246)',
    fontWeight: '500',
    marginBottom: 2,
  },
  consultationDate: {
    fontSize: 12,
    color: 'rgb(100, 112, 103)',
  },
  consultationBadges: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgencyText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  consultationDescription: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    lineHeight: 20,
    marginBottom: 12,
  },
  symptomsContainer: {
    marginBottom: 12,
  },
  symptomsLabel: {
    fontSize: 12,
    color: 'rgb(100, 112, 103)',
    marginBottom: 4,
  },
  symptomsText: {
    fontSize: 14,
    color: 'rgb(49, 58, 52)',
  },
  responseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  responseText: {
    fontSize: 14,
    color: 'rgb(34, 197, 94)',
    fontWeight: '500',
  },
  consultationActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(100, 112, 103, 0.1)',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: 'rgb(132, 204, 22)',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgb(245, 246, 245)',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100, 112, 103, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
  },
  modalCancelText: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(132, 204, 22)',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgb(49, 58, 52)',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(100, 112, 103, 0.2)',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  specialtySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  specialtyOption: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(100, 112, 103, 0.2)',
  },
  selectedSpecialtyOption: {
    backgroundColor: 'rgb(132, 204, 22)',
    borderColor: 'rgb(132, 204, 22)',
  },
  specialtyOptionText: {
    fontSize: 14,
    color: 'rgb(49, 58, 52)',
  },
  selectedSpecialtyOptionText: {
    color: 'white',
  },
  urgencySelector: {
    gap: 8,
  },
  urgencyOption: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
  },
  urgencyOptionText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  urgencyDescription: {
    fontSize: 12,
  },
  addItemContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  addItemInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(100, 112, 103, 0.2)',
  },
  addItemButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgb(132, 204, 22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    color: 'rgb(132, 204, 22)',
    fontWeight: '500',
  },
  questionsContainer: {
    gap: 8,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    color: 'rgb(49, 58, 52)',
    lineHeight: 20,
  },
  attachRecordsSection: {
    marginBottom: 32,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgb(132, 204, 22)',
    borderStyle: 'dashed',
    gap: 8,
  },
  attachButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgb(132, 204, 22)',
  },
  doctorsList: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  doctorCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: 'rgba(47, 60, 51, 0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  doctorInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatar: {
    marginRight: 12,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginBottom: 2,
  },
  doctorTitle: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: 'rgb(59, 130, 246)',
    fontWeight: '500',
    marginBottom: 4,
  },
  doctorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: 'rgb(100, 112, 103)',
  },
  doctorActions: {
    alignItems: 'flex-end',
  },
  consultationFee: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
    marginBottom: 8,
  },
  selectDoctorButton: {
    backgroundColor: 'rgb(132, 204, 22)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selectDoctorText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  protocolFab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgb(132, 204, 22)',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  protocolFabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
}); 