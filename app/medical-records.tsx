import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  Modal,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { authService } from '@/src/services/authService';
import { medicalRecordsService, MedicalRecord } from '@/src/services/medicalRecordsService';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

interface FilterOptions {
  type?: string;
  category?: string;
  status?: string;
  urgency?: string;
}

export default function MedicalRecordsScreen() {
  const router = useRouter();
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterOptions>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // New record form state
  const [newRecord, setNewRecord] = useState({
    title: '',
    type: 'other' as MedicalRecord['type'],
    description: '',
    category: 'General Medicine',
    urgency: 'medium' as MedicalRecord['urgency'],
    provider_name: '',
    facility_name: '',
    date_of_record: new Date().toISOString().split('T')[0],
  });

  const recordTypes = medicalRecordsService.getRecordTypes();
  const categories = medicalRecordsService.getMedicalCategories();
  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'rgb(34, 197, 94)' },
    { value: 'medium', label: 'Medium', color: 'rgb(251, 204, 21)' },
    { value: 'high', label: 'High', color: 'rgb(249, 115, 22)' },
    { value: 'urgent', label: 'Urgent', color: 'rgb(239, 68, 68)' },
  ];

  const loadMedicalRecords = async () => {
    try {
      const { user } = await authService.getCurrentUser();
      if (!user) {
        router.replace('/signin');
        return;
      }

      const { data, error } = await medicalRecordsService.getUserMedicalRecords(user.id, activeFilter);
      if (data) {
        setMedicalRecords(data);
        setFilteredRecords(data);
      }
    } catch (error) {
      console.error('Error loading medical records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedicalRecords();
  }, [activeFilter]);

  useEffect(() => {
    // Filter records based on search query
    if (searchQuery.trim() === '') {
      setFilteredRecords(medicalRecords);
    } else {
      const filtered = medicalRecords.filter(record =>
        record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.provider_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecords(filtered);
    }
  }, [searchQuery, medicalRecords]);

  const handleAddRecord = async () => {
    if (!newRecord.title.trim()) {
      Alert.alert('Error', 'Please enter a title for the record');
      return;
    }

    try {
      const { user } = await authService.getCurrentUser();
      if (!user) return;

      const recordData = {
        ...newRecord,
        date_created: new Date().toISOString(),
      };

      const { data, error } = await medicalRecordsService.createMedicalRecord(user.id, recordData);
      
      if (error) {
        Alert.alert('Error', 'Failed to create medical record');
        return;
      }

      if (data) {
        setMedicalRecords([data, ...medicalRecords]);
        setAddModalVisible(false);
        resetNewRecord();
        Alert.alert('Success', 'Medical record added successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create medical record');
    }
  };

  const resetNewRecord = () => {
    setNewRecord({
      title: '',
      type: 'other',
      description: '',
      category: 'General Medicine',
      urgency: 'medium',
      provider_name: '',
      facility_name: '',
      date_of_record: new Date().toISOString().split('T')[0],
    });
  };

  const handleDeleteRecord = async (recordId: string) => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this medical record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await medicalRecordsService.deleteMedicalRecord(recordId);
            if (!error) {
              setMedicalRecords(medicalRecords.filter(record => record.id !== recordId));
              Alert.alert('Success', 'Medical record deleted');
            } else {
              Alert.alert('Error', 'Failed to delete record');
            }
          },
        },
      ]
    );
  };

  const getUrgencyColor = (urgency: string) => {
    const level = urgencyLevels.find(l => l.value === urgency);
    return level?.color || 'rgb(100, 112, 103)';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lab_result': return 'flask.fill';
      case 'imaging': return 'camera.fill';
      case 'prescription': return 'pills.fill';
      case 'diagnosis': return 'stethoscope';
      case 'treatment_plan': return 'list.clipboard.fill';
      case 'consultation_note': return 'doc.text.fill';
      default: return 'doc.fill';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const applyFilters = (filters: FilterOptions) => {
    setActiveFilter(filters);
    setFilterModalVisible(false);
  };

  const clearFilters = () => {
    setActiveFilter({});
    setFilterModalVisible(false);
  };

  const renderRecordCard = ({ item }: { item: MedicalRecord }) => (
    <Animated.View entering={FadeInDown} style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <View style={styles.recordIconContainer}>
          <IconSymbol name={getTypeIcon(item.type)} size={24} color="rgb(132, 204, 22)" />
        </View>
        <View style={styles.recordInfo}>
          <Text style={styles.recordTitle}>{item.title}</Text>
          <Text style={styles.recordDate}>{formatDate(item.date_of_record)}</Text>
        </View>
        <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(item.urgency) }]}>
          <Text style={styles.urgencyText}>
            {urgencyLevels.find(l => l.value === item.urgency)?.label}
          </Text>
        </View>
      </View>
      
      <Text style={styles.recordCategory}>{item.category}</Text>
      {item.description && (
        <Text style={styles.recordDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      
      {item.provider_name && (
        <Text style={styles.providerName}>Provider: {item.provider_name}</Text>
      )}

      <View style={styles.recordActions}>
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol name="eye.fill" size={16} color="rgb(59, 130, 246)" />
          <Text style={[styles.actionText, { color: 'rgb(59, 130, 246)' }]}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol name="square.and.arrow.up" size={16} color="rgb(132, 204, 22)" />
          <Text style={[styles.actionText, { color: 'rgb(132, 204, 22)' }]}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDeleteRecord(item.id)}
        >
          <IconSymbol name="trash.fill" size={16} color="rgb(239, 68, 68)" />
          <Text style={[styles.actionText, { color: 'rgb(239, 68, 68)' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading medical records...</Text>
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
        <Text style={styles.headerTitle}>Medical Records</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setAddModalVisible(true)}
        >
          <IconSymbol name="plus" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {/* Search and Filter Bar */}
      <Animated.View style={styles.searchContainer} entering={FadeInDown.delay(200)}>
        <View style={styles.searchInputContainer}>
          <IconSymbol name="magnifyingglass" size={20} color="rgb(100, 112, 103)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search medical records..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="rgb(100, 112, 103)"
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <IconSymbol name="line.3.horizontal.decrease.circle" size={24} color="rgb(132, 204, 22)" />
        </TouchableOpacity>
      </Animated.View>

      {/* Records Count and View Toggle */}
      <Animated.View style={styles.controlsContainer} entering={FadeInDown.delay(300)}>
        <Text style={styles.recordCount}>
          {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}
        </Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity 
            style={[styles.viewToggleButton, viewMode === 'list' && styles.activeViewToggle]}
            onPress={() => setViewMode('list')}
          >
            <IconSymbol name="list.bullet" size={20} color={viewMode === 'list' ? 'white' : 'rgb(100, 112, 103)'} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.viewToggleButton, viewMode === 'grid' && styles.activeViewToggle]}
            onPress={() => setViewMode('grid')}
          >
            <IconSymbol name="square.grid.2x2" size={20} color={viewMode === 'grid' ? 'white' : 'rgb(100, 112, 103)'} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Records List */}
      <FlatList
        data={filteredRecords}
        renderItem={renderRecordCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.recordsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSymbol name="doc.text" size={64} color="rgb(100, 112, 103)" />
            <Text style={styles.emptyTitle}>No Medical Records</Text>
            <Text style={styles.emptySubtitle}>
              Add your first medical record to get started with second opinion consultations
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => setAddModalVisible(true)}
            >
              <Text style={styles.emptyButtonText}>Add Record</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Add Record Modal */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setAddModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Medical Record</Text>
            <TouchableOpacity onPress={handleAddRecord}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Title *</Text>
              <TextInput
                style={styles.formInput}
                value={newRecord.title}
                onChangeText={(text) => setNewRecord({ ...newRecord, title: text })}
                placeholder="Enter record title"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.typeSelector}>
                  {recordTypes.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.typeOption,
                        newRecord.type === type.value && styles.selectedTypeOption
                      ]}
                      onPress={() => setNewRecord({ ...newRecord, type: type.value as MedicalRecord['type'] })}
                    >
                      <Text style={[
                        styles.typeOptionText,
                        newRecord.type === type.value && styles.selectedTypeOptionText
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categorySelector}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryOption,
                        newRecord.category === category && styles.selectedCategoryOption
                      ]}
                      onPress={() => setNewRecord({ ...newRecord, category })}
                    >
                      <Text style={[
                        styles.categoryOptionText,
                        newRecord.category === category && styles.selectedCategoryOptionText
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Urgency</Text>
              <View style={styles.urgencySelector}>
                {urgencyLevels.map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.urgencyOption,
                      { borderColor: level.color },
                      newRecord.urgency === level.value && { backgroundColor: level.color }
                    ]}
                    onPress={() => setNewRecord({ ...newRecord, urgency: level.value as MedicalRecord['urgency'] })}
                  >
                    <Text style={[
                      styles.urgencyOptionText,
                      { color: newRecord.urgency === level.value ? 'white' : level.color }
                    ]}>
                      {level.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Date of Record</Text>
              <TextInput
                style={styles.formInput}
                value={newRecord.date_of_record}
                onChangeText={(text) => setNewRecord({ ...newRecord, date_of_record: text })}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Provider Name</Text>
              <TextInput
                style={styles.formInput}
                value={newRecord.provider_name}
                onChangeText={(text) => setNewRecord({ ...newRecord, provider_name: text })}
                placeholder="Doctor or provider name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Facility Name</Text>
              <TextInput
                style={styles.formInput}
                value={newRecord.facility_name}
                onChangeText={(text) => setNewRecord({ ...newRecord, facility_name: text })}
                placeholder="Hospital or clinic name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={newRecord.description}
                onChangeText={(text) => setNewRecord({ ...newRecord, description: text })}
                placeholder="Additional details about this record"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity style={styles.uploadButton}>
              <IconSymbol name="paperclip" size={20} color="rgb(132, 204, 22)" />
              <Text style={styles.uploadButtonText}>Attach Document</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.filterModalOverlay}>
          <View style={styles.filterModalContent}>
            <Text style={styles.filterModalTitle}>Filter Records</Text>
            
            {/* Filter options would go here */}
            <Text style={styles.filterSectionTitle}>Type</Text>
            {/* Type filter options */}
            
            <View style={styles.filterModalButtons}>
              <TouchableOpacity 
                style={styles.filterModalButton}
                onPress={clearFilters}
              >
                <Text style={styles.filterModalButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterModalButton, styles.filterModalApplyButton]}
                onPress={() => applyFilters(activeFilter)}
              >
                <Text style={styles.filterModalApplyButtonText}>Apply</Text>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgb(132, 204, 22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'rgb(49, 58, 52)',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  recordCount: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 2,
  },
  viewToggleButton: {
    padding: 8,
    borderRadius: 6,
  },
  activeViewToggle: {
    backgroundColor: 'rgb(132, 204, 22)',
  },
  recordsList: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  recordCard: {
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
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recordIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recordInfo: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginBottom: 2,
  },
  recordDate: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
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
  recordCategory: {
    fontSize: 14,
    color: 'rgb(59, 130, 246)',
    fontWeight: '500',
    marginBottom: 8,
  },
  recordDescription: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    lineHeight: 20,
    marginBottom: 8,
  },
  providerName: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    marginBottom: 12,
  },
  recordActions: {
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
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  typeOption: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(100, 112, 103, 0.2)',
  },
  selectedTypeOption: {
    backgroundColor: 'rgb(132, 204, 22)',
    borderColor: 'rgb(132, 204, 22)',
  },
  typeOptionText: {
    fontSize: 14,
    color: 'rgb(49, 58, 52)',
  },
  selectedTypeOptionText: {
    color: 'white',
  },
  categorySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryOption: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(100, 112, 103, 0.2)',
  },
  selectedCategoryOption: {
    backgroundColor: 'rgb(132, 204, 22)',
    borderColor: 'rgb(132, 204, 22)',
  },
  categoryOptionText: {
    fontSize: 14,
    color: 'rgb(49, 58, 52)',
  },
  selectedCategoryOptionText: {
    color: 'white',
  },
  urgencySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  urgencyOption: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
  },
  urgencyOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  uploadButton: {
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
    marginBottom: 32,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgb(132, 204, 22)',
  },
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    maxHeight: '70%',
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginBottom: 12,
  },
  filterModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  filterModalButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(100, 112, 103, 0.1)',
  },
  filterModalApplyButton: {
    backgroundColor: 'rgb(132, 204, 22)',
  },
  filterModalButtonText: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
  },
  filterModalApplyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
}); 