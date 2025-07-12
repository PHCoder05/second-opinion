import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol, Card, Button } from '@/components/ui';
import { MedicalColors, MedicalGradients } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

interface ConsultationStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  estimatedTime?: string;
  completedAt?: Date;
}

interface ConsultationDetails {
  id: string;
  submittedAt: Date;
  expectedCompletion: Date;
  currentStep: number;
  totalSteps: number;
  priority: 'standard' | 'urgent' | 'emergency';
  assignedDoctor?: string;
  specialization?: string;
}

export default function ConsultationStatus() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [consultationDetails, setConsultationDetails] = useState<ConsultationDetails>({
    id: 'CONS-2024-001',
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    expectedCompletion: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours from now
    currentStep: 2,
    totalSteps: 5,
    priority: 'standard',
    assignedDoctor: 'Dr. Michael Chen',
    specialization: 'Internal Medicine'
  });

  const [steps, setSteps] = useState<ConsultationStep[]>([
    {
      id: 'submission',
      title: 'Consultation Submitted',
      description: 'Your medical information has been received and verified',
      status: 'completed',
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'review',
      title: 'Initial Review',
      description: 'Medical team is reviewing your case and documents',
      status: 'completed',
      estimatedTime: '2-4 hours',
      completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },
    {
      id: 'assignment',
      title: 'Doctor Assignment',
      description: 'Matching you with the most suitable specialist',
      status: 'in-progress',
      estimatedTime: '4-6 hours'
    },
    {
      id: 'analysis',
      title: 'Medical Analysis',
      description: 'Detailed analysis of your case by specialist',
      status: 'pending',
      estimatedTime: '12-18 hours'
    },
    {
      id: 'report',
      title: 'Second Opinion Report',
      description: 'Comprehensive report with recommendations',
      status: 'pending',
      estimatedTime: '20-24 hours'
    }
  ]);

  const onRefresh = () => {
    setIsRefreshing(true);
    // Simulate fetching updated status
    setTimeout(() => {
      setIsRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'checkmark.circle.fill';
      case 'in-progress':
        return 'arrow.clockwise';
      case 'pending':
        return 'circle';
      default:
        return 'circle';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return MedicalColors.secondary[600];
      case 'in-progress':
        return MedicalColors.primary[600];
      case 'pending':
        return MedicalColors.neutral[400];
      default:
        return MedicalColors.neutral[400];
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return MedicalColors.accent[600];
      case 'emergency':
        return '#EF4444';
      default:
        return MedicalColors.secondary[600];
    }
  };

  const formatTimeRemaining = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  const renderStep = (step: ConsultationStep, index: number) => (
    <Animated.View
      key={step.id}
      entering={FadeInDown.delay(index * 100).duration(600)}
      style={styles.stepContainer}
    >
      <View style={styles.stepIndicator}>
        <View style={[styles.stepIcon, { backgroundColor: getStatusColor(step.status) }]}>
          <IconSymbol
            name={getStatusIcon(step.status)}
            size={16}
            color="#FFFFFF"
          />
        </View>
        {index < steps.length - 1 && (
          <View style={[
            styles.stepLine,
            step.status === 'completed' ? styles.stepLineCompleted : styles.stepLinePending
          ]} />
        )}
      </View>
      
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.stepDescription}>{step.description}</Text>
        
        {step.status === 'completed' && step.completedAt && (
          <Text style={styles.stepTime}>
            Completed {step.completedAt.toLocaleDateString()} at {step.completedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
        
        {step.status === 'in-progress' && (
          <Text style={[styles.stepTime, { color: MedicalColors.primary[600] }]}>
            In progress • {step.estimatedTime}
          </Text>
        )}
        
        {step.status === 'pending' && step.estimatedTime && (
          <Text style={styles.stepTime}>
            Estimated: {step.estimatedTime}
          </Text>
        )}
      </View>
    </Animated.View>
  );

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
          <Text style={styles.headerTitle}>Consultation Status</Text>
          <TouchableOpacity
            onPress={onRefresh}
            style={styles.refreshButton}
          >
            <IconSymbol name="arrow.clockwise" size={20} color={MedicalColors.primary[600]} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Overview Card */}
          <Animated.View entering={FadeInUp.duration(800)}>
            <Card variant="elevated" padding="large" style={styles.overviewCard}>
              <View style={styles.overviewHeader}>
                <View style={styles.consultationInfo}>
                  <Text style={styles.consultationId}>#{consultationDetails.id}</Text>
                  <View style={styles.priorityBadge}>
                    <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(consultationDetails.priority) }]} />
                    <Text style={[styles.priorityText, { color: getPriorityColor(consultationDetails.priority) }]}>
                      {consultationDetails.priority.toUpperCase()}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>
                    {consultationDetails.currentStep} of {consultationDetails.totalSteps} steps completed
                  </Text>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { width: `${(consultationDetails.currentStep / consultationDetails.totalSteps) * 100}%` }
                      ]}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.timeInfo}>
                <View style={styles.timeItem}>
                  <IconSymbol name="clock" size={16} color={MedicalColors.neutral[600]} />
                  <Text style={styles.timeLabel}>Submitted:</Text>
                  <Text style={styles.timeValue}>
                    {consultationDetails.submittedAt.toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.timeItem}>
                  <IconSymbol name="timer" size={16} color={MedicalColors.primary[600]} />
                  <Text style={styles.timeLabel}>Expected completion:</Text>
                  <Text style={[styles.timeValue, { color: MedicalColors.primary[600] }]}>
                    {formatTimeRemaining(consultationDetails.expectedCompletion)}
                  </Text>
                </View>
              </View>

              {consultationDetails.assignedDoctor && (
                <View style={styles.doctorInfo}>
                  <IconSymbol name="person.circle" size={20} color={MedicalColors.secondary[600]} />
                  <View>
                    <Text style={styles.doctorName}>{consultationDetails.assignedDoctor}</Text>
                    <Text style={styles.doctorSpecialization}>{consultationDetails.specialization}</Text>
                  </View>
                </View>
              )}
            </Card>
          </Animated.View>

          {/* Progress Steps */}
          <Animated.View entering={FadeInDown.delay(200).duration(800)}>
            <Card variant="default" padding="large" style={styles.stepsCard}>
              <Text style={styles.stepsTitle}>Progress Timeline</Text>
              <Text style={styles.stepsSubtitle}>
                Track your consultation progress in real-time
              </Text>
              
              <View style={styles.stepsContainer}>
                {steps.map((step, index) => renderStep(step, index))}
              </View>
            </Card>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View entering={FadeInDown.delay(400).duration(800)}>
            <Card variant="outlined" padding="medium" style={styles.actionsCard}>
              <Text style={styles.actionsTitle}>Need Help?</Text>
              
              <View style={styles.actionButtons}>
                <Button
                  title="Contact Support"
                  onPress={() => router.push('/assisted-help-flow')}
                  variant="outline"
                  size="medium"
                  icon="message"
                  iconPosition="left"
                  style={styles.actionButton}
                />
                
                <Button
                  title="Upload More Documents"
                  onPress={() => router.push('/self-service-flow')}
                  variant="outline"
                  size="medium"
                  icon="doc.text"
                  iconPosition="left"
                  style={styles.actionButton}
                />
              </View>
            </Card>
          </Animated.View>

          {/* What's Next */}
          <Animated.View entering={FadeInDown.delay(600).duration(800)}>
            <Card variant="health" padding="large" style={styles.nextStepsCard}>
              <View style={styles.nextStepsHeader}>
                <IconSymbol name="lightbulb" size={24} color={MedicalColors.secondary[600]} />
                <Text style={styles.nextStepsTitle}>What's Next?</Text>
              </View>
              
              <View style={styles.nextStepsList}>
                <View style={styles.nextStepItem}>
                  <IconSymbol name="1.circle.fill" size={20} color={MedicalColors.secondary[600]} />
                  <Text style={styles.nextStepText}>
                    Our specialist will review your case thoroughly
                  </Text>
                </View>
                
                <View style={styles.nextStepItem}>
                  <IconSymbol name="2.circle.fill" size={20} color={MedicalColors.secondary[600]} />
                  <Text style={styles.nextStepText}>
                    You'll receive a detailed second opinion report
                  </Text>
                </View>
                
                <View style={styles.nextStepItem}>
                  <IconSymbol name="3.circle.fill" size={20} color={MedicalColors.secondary[600]} />
                  <Text style={styles.nextStepText}>
                    Optional follow-up consultation available
                  </Text>
                </View>
              </View>
            </Card>
          </Animated.View>
        </ScrollView>
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
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  overviewCard: {
    marginBottom: 20,
  },
  overviewHeader: {
    marginBottom: 20,
  },
  consultationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  consultationId: {
    fontSize: 18,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: MedicalColors.neutral[100],
    borderRadius: 12,
    gap: 4,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    gap: 8,
  },
  progressText: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    fontWeight: '500',
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
  timeInfo: {
    gap: 12,
    marginBottom: 20,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: MedicalColors.secondary[50],
    borderRadius: 12,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  doctorSpecialization: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
  },
  stepsCard: {
    marginBottom: 20,
  },
  stepsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginBottom: 4,
  },
  stepsSubtitle: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    marginBottom: 24,
  },
  stepsContainer: {
    gap: 4,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLine: {
    width: 2,
    height: 40,
    marginTop: 8,
  },
  stepLineCompleted: {
    backgroundColor: MedicalColors.secondary[600],
  },
  stepLinePending: {
    backgroundColor: MedicalColors.neutral[200],
  },
  stepContent: {
    flex: 1,
    paddingBottom: 24,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    lineHeight: 20,
    marginBottom: 8,
  },
  stepTime: {
    fontSize: 12,
    color: MedicalColors.neutral[500],
    fontWeight: '500',
  },
  actionsCard: {
    marginBottom: 20,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    marginBottom: 16,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    width: '100%',
  },
  nextStepsCard: {
    marginBottom: 20,
  },
  nextStepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  nextStepsList: {
    gap: 12,
  },
  nextStepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  nextStepText: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
    lineHeight: 20,
    flex: 1,
  },
}); 