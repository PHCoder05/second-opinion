import { Button, Card, IconSymbol, Input } from '@/components/ui';
import { MedicalColors } from '@/constants/Colors';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uri: string;
}

interface PainLocation {
  id: string;
  name: string;
  intensity: number;
  selected: boolean;
}

export default function SelfServiceFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [painLevel, setPainLevel] = useState(0);
  const [painLocations, setPainLocations] = useState<PainLocation[]>([
    { id: 'head', name: 'Head', intensity: 0, selected: false },
    { id: 'neck', name: 'Neck', intensity: 0, selected: false },
    { id: 'chest', name: 'Chest', intensity: 0, selected: false },
    { id: 'abdomen', name: 'Abdomen', intensity: 0, selected: false },
    { id: 'back', name: 'Back', intensity: 0, selected: false },
    { id: 'arms', name: 'Arms', intensity: 0, selected: false },
    { id: 'legs', name: 'Legs', intensity: 0, selected: false },
  ]);
  const [hasAllergies, setHasAllergies] = useState(false);
  const [allergies, setAllergies] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 5;

  const handleDocumentUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const newDocument: UploadedDocument = {
          id: Date.now().toString(),
          name: file.name,
          type: file.mimeType || 'unknown',
          size: file.size || 0,
          uri: file.uri,
        };
        setDocuments([...documents, newDocument]);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload document');
    }
  };

  const handleImageUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        const newDocument: UploadedDocument = {
          id: Date.now().toString(),
          name: `Medical_Image_${Date.now()}.jpg`,
          type: 'image/jpeg',
          size: 0,
          uri: image.uri,
        };
        setDocuments([...documents, newDocument]);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const togglePainLocation = (id: string) => {
    setPainLocations(prev => 
      prev.map(location => 
        location.id === id 
          ? { ...location, selected: !location.selected }
          : location
      )
    );
  };

  const updatePainIntensity = (id: string, intensity: number) => {
    setPainLocations(prev => 
      prev.map(location => 
        location.id === id 
          ? { ...location, intensity }
          : location
      )
    );
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate submission process
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Submission Complete',
        'Your medical information has been submitted successfully. Our medical team will review your case and provide a detailed second opinion within 24-48 hours.',
        [
          { 
            text: 'View Status', 
            onPress: () => router.push('/consultation-status')
          }
        ]
      );
    }, 3000);
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${(currentStep / totalSteps) * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Animated.View entering={FadeIn.duration(500)}>
            <Card variant="default" padding="large" style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <IconSymbol name="description" size={32} color={MedicalColors.primary[600]} />
                <Text style={styles.stepTitle}>Upload Medical Documents</Text>
                <Text style={styles.stepDescription}>
                  Share your existing medical records, test results, or any relevant documents
                </Text>
              </View>

              <View style={styles.uploadSection}>
                <View style={styles.uploadButtons}>
                  <Button
                    title="Upload Documents"
                    onPress={handleDocumentUpload}
                    variant="outline"
                    size="medium"
                    icon="description"
                    iconPosition="left"
                    style={styles.uploadButton}
                  />
                  <Button
                    title="Upload Images"
                    onPress={handleImageUpload}
                    variant="outline"
                    size="medium"
                    icon="photo"
                    iconPosition="left"
                    style={styles.uploadButton}
                  />
                </View>

                {documents.length > 0 && (
                  <View style={styles.documentsContainer}>
                    <Text style={styles.documentsTitle}>Uploaded Documents</Text>
                    {documents.map(doc => (
                      <View key={doc.id} style={styles.documentItem}>
                        <View style={styles.documentInfo}>
                          <IconSymbol 
                            name={doc.type.includes('image') ? 'photo' : 'description'} 
                            size={20} 
                            color={MedicalColors.primary[600]} 
                          />
                          <Text style={styles.documentName}>{doc.name}</Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => removeDocument(doc.id)}
                          style={styles.removeButton}
                        >
                          <IconSymbol name="xmark" size={16} color={MedicalColors.accent[600]} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </Card>
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View entering={FadeIn.duration(500)}>
            <Card variant="default" padding="large" style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <IconSymbol name="favorite" size={32} color={MedicalColors.primary[600]} />
                <Text style={styles.stepTitle}>Chief Complaint</Text>
                <Text style={styles.stepDescription}>
                  What is the main health concern or symptom that brought you here?
                </Text>
              </View>

              <Input
                label="Main Health Concern"
                placeholder="Describe your primary concern in detail..."
                value={chiefComplaint}
                onChangeText={setChiefComplaint}
                multiline
                style={styles.textArea}
                required
              />

              <Input
                label="Additional Symptoms"
                placeholder="List any other symptoms you're experiencing..."
                value={symptoms}
                onChangeText={setSymptoms}
                multiline
                style={styles.textArea}
              />
            </Card>
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View entering={FadeIn.duration(500)}>
            <Card variant="default" padding="large" style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <IconSymbol name="figure.wave" size={32} color={MedicalColors.primary[600]} />
                <Text style={styles.stepTitle}>Pain Assessment</Text>
                <Text style={styles.stepDescription}>
                  Help us understand your pain levels and locations
                </Text>
              </View>

              <View style={styles.painSection}>
                <Text style={styles.painTitle}>Overall Pain Level (0-10)</Text>
                <View style={styles.painScale}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.painLevel,
                        painLevel === level && styles.painLevelSelected
                      ]}
                      onPress={() => setPainLevel(level)}
                    >
                      <Text style={[
                        styles.painLevelText,
                        painLevel === level && styles.painLevelTextSelected
                      ]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.painTitle}>Pain Locations</Text>
                <View style={styles.painLocationsGrid}>
                  {painLocations.map(location => (
                    <TouchableOpacity
                      key={location.id}
                      style={[
                        styles.painLocationItem,
                        location.selected && styles.painLocationItemSelected
                      ]}
                      onPress={() => togglePainLocation(location.id)}
                    >
                      <Text style={[
                        styles.painLocationText,
                        location.selected && styles.painLocationTextSelected
                      ]}>
                        {location.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Card>
          </Animated.View>
        );

      case 4:
        return (
          <Animated.View entering={FadeIn.duration(500)}>
            <Card variant="default" padding="large" style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <IconSymbol name="medication" size={32} color={MedicalColors.primary[600]} />
                <Text style={styles.stepTitle}>Medical History</Text>
                <Text style={styles.stepDescription}>
                  Tell us about your medical history, allergies, and current medications
                </Text>
              </View>

              <View style={styles.allergySection}>
                <View style={styles.allergyHeader}>
                  <Text style={styles.allergyTitle}>Do you have any allergies?</Text>
                  <Switch
                    value={hasAllergies}
                    onValueChange={setHasAllergies}
                    trackColor={{ false: MedicalColors.neutral[200], true: MedicalColors.primary[200] }}
                    thumbColor={hasAllergies ? MedicalColors.primary[600] : MedicalColors.neutral[400]}
                  />
                </View>
                {hasAllergies && (
                  <Input
                    label="Allergies"
                    placeholder="List your allergies and reactions..."
                    value={allergies}
                    onChangeText={setAllergies}
                    multiline
                    style={styles.textArea}
                  />
                )}
              </View>

              <Input
                label="Current Medications"
                placeholder="List all medications you're currently taking..."
                value={currentMedications}
                onChangeText={setCurrentMedications}
                multiline
                style={styles.textArea}
              />
            </Card>
          </Animated.View>
        );

      case 5:
        return (
          <Animated.View entering={FadeIn.duration(500)}>
            <Card variant="default" padding="large" style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <IconSymbol name="checkmark.circle" size={32} color={MedicalColors.secondary[600]} />
                <Text style={styles.stepTitle}>Review & Submit</Text>
                <Text style={styles.stepDescription}>
                  Review your information before submitting for medical review
                </Text>
              </View>

              <View style={styles.reviewSection}>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>Documents Uploaded:</Text>
                  <Text style={styles.reviewValue}>{documents.length} files</Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>Chief Complaint:</Text>
                  <Text style={styles.reviewValue}>{chiefComplaint || 'Not provided'}</Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>Pain Level:</Text>
                  <Text style={styles.reviewValue}>{painLevel}/10</Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>Pain Locations:</Text>
                  <Text style={styles.reviewValue}>
                    {painLocations.filter(p => p.selected).map(p => p.name).join(', ') || 'None selected'}
                  </Text>
                </View>
              </View>

              <Button
                title={isSubmitting ? 'Submitting...' : 'Submit for Review'}
                onPress={handleSubmit}
                variant="primary"
                size="large"
                icon={isSubmitting ? undefined : "arrow.up.circle"}
                iconPosition="right"
                loading={isSubmitting}
                disabled={isSubmitting}
                fullWidth
                style={styles.submitButton}
              />
            </Card>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[MedicalColors.primary[50], MedicalColors.secondary[50], '#FFFFFF']}
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <IconSymbol name="chevron.left" size={24} color={MedicalColors.primary[600]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Self-Service Assessment</Text>
          <View style={styles.headerSpacer} />
        </View>

        {renderProgressBar()}

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {renderStepContent()}
        </ScrollView>

        <View style={styles.navigationButtons}>
          {currentStep > 1 && (
            <Button
              title="Previous"
              onPress={prevStep}
              variant="outline"
              size="medium"
              icon="chevron.left"
              iconPosition="left"
              style={styles.navButton}
            />
          )}
          {currentStep < totalSteps && (
            <Button
              title="Next"
              onPress={nextStep}
              variant="primary"
              size="medium"
              icon="chevron.right"
              iconPosition="right"
              style={[styles.navButton, { marginLeft: 'auto' }]}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: MedicalColors.neutral[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: MedicalColors.primary[600],
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stepCard: {
    marginBottom: 20,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
    textAlign: 'center',
    lineHeight: 24,
  },
  uploadSection: {
    gap: 20,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flex: 1,
  },
  documentsContainer: {
    gap: 12,
  },
  documentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: MedicalColors.neutral[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  painSection: {
    gap: 20,
  },
  painTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  painScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  painLevel: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MedicalColors.neutral[100],
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  painLevelSelected: {
    backgroundColor: MedicalColors.primary[600],
    borderColor: MedicalColors.primary[600],
  },
  painLevelText: {
    fontSize: 14,
    fontWeight: '600',
    color: MedicalColors.neutral[700],
  },
  painLevelTextSelected: {
    color: '#FFFFFF',
  },
  painLocationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  painLocationItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: MedicalColors.neutral[100],
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
    borderRadius: 20,
  },
  painLocationItemSelected: {
    backgroundColor: MedicalColors.primary[600],
    borderColor: MedicalColors.primary[600],
  },
  painLocationText: {
    fontSize: 14,
    fontWeight: '500',
    color: MedicalColors.neutral[700],
  },
  painLocationTextSelected: {
    color: '#FFFFFF',
  },
  allergySection: {
    marginBottom: 20,
  },
  allergyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  allergyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  reviewSection: {
    gap: 16,
    marginBottom: 24,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: MedicalColors.neutral[200],
  },
  reviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: MedicalColors.neutral[700],
    flex: 1,
  },
  reviewValue: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    flex: 2,
    textAlign: 'right',
  },
  submitButton: {
    shadowColor: MedicalColors.primary[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  navigationButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: MedicalColors.neutral[200],
  },
  navButton: {
    minWidth: 100,
  },
}); 