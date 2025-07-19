import { Button, Card, IconSymbol } from '@/components/ui';
import { MedicalColors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

// Complete app flow structure
const APP_FLOW = [
        {
          id: 'welcome',
    title: 'Welcome & Onboarding',
    icon: 'waving-hand',
    color: MedicalColors.primary[600],
    description: 'Trust-building introduction to the platform',
    features: [
      'Platform overview and mission',
      'Medical team credentials',
      'Security and privacy assurance',
      'Evidence-based approach explanation'
    ],
    screens: ['welcome', 'onboarding'],
    timeEstimate: '2-3 minutes',
    trustFactor: 'High - Establishes credibility'
  },
  {
    id: 'consultation_entry',
    title: 'Consultation Entry',
      icon: 'medical-services',
    color: MedicalColors.secondary[600],
    description: 'ATM-like instant access to medical consultation',
    features: [
      '$49 transparent pricing',
      'Two-path selection (Self-Service vs Assisted)',
      'Expected timeline disclosure',
      'Quality assurance guarantees'
    ],
    screens: ['consultation-flow'],
    timeEstimate: '1-2 minutes',
    trustFactor: 'High - Transparent pricing and options'
  },
  {
    id: 'data_collection',
    title: 'Comprehensive Data Collection',
    icon: 'description',
    color: MedicalColors.accent[600],
    description: 'Systematic gathering of medical information',
    features: [
      'Structured medical history',
      'Symptom checker with AI analysis',
      'Visual pain mapping',
      'Document upload capability',
      'Review of systems (ROS)'
    ],
    screens: ['self-service-flow', 'comprehensive-health-assessment', 'symptom-checker'],
    timeEstimate: '15-30 minutes',
    trustFactor: 'Medium - Thorough but time-consuming'
  },
  {
    id: 'assisted_support',
    title: 'Assisted Help Path',
    icon: 'group',
    color: MedicalColors.success[600],
    description: 'SOP-guided support team assistance',
    features: [
      'Real-time chat with medical support',
      'Guided data collection',
      'Document assistance',
      'Clarification of symptoms',
      'Professional guidance'
    ],
    screens: ['assisted-help-flow'],
    timeEstimate: '20-45 minutes',
    trustFactor: 'Very High - Human interaction'
  },
  {
    id: 'medical_protocol',
    title: 'Medical Protocol Processing',
    icon: 'assignment',
    color: MedicalColors.warning[600],
    description: 'Standardized textbook protocol execution',
    features: [
      'Evidence-based review process',
      'Standardized medical protocols',
      'Cross-verification with guidelines',
      'Peer review integration',
      'Quality assurance checks'
    ],
    screens: ['medical-protocol-flow'],
    timeEstimate: '24-48 hours',
    trustFactor: 'Very High - Professional standards'
  },
  {
    id: 'diagnosis_delivery',
    title: 'Diagnosis & Treatment Explanation',
    icon: 'psychology',
    color: MedicalColors.info[600],
    description: 'Clear, comprehensive medical explanation',
    features: [
      'Diagnosis explanation in lay terms',
      'Treatment options with rationale',
      'Visual aids and diagrams',
      'Expected outcomes discussion',
      'Follow-up recommendations'
    ],
    screens: ['ai-assessment-results', 'medical-education'],
    timeEstimate: '10-15 minutes',
    trustFactor: 'Very High - Clear communication'
  },
  {
    id: 'education_support',
    title: 'Patient Education & Support',
    icon: 'menu-book',
    color: MedicalColors.accent[600],
    description: 'Ongoing education and support resources',
    features: [
      'Condition-specific education',
      'Treatment explanations',
      'Lifestyle recommendations',
      'Warning signs to watch for',
      'Follow-up care guidance'
    ],
    screens: ['medical-education'],
    timeEstimate: 'Ongoing',
    trustFactor: 'High - Empowers patients'
  }
];

// Platform statistics and trust indicators
const PLATFORM_STATS = {
  totalConsultations: '25,000+',
  averageResponseTime: '36 hours',
  patientSatisfaction: '4.8/5',
  doctorCredentials: 'Board-certified',
  evidenceLevel: 'Level A',
  protocolCompliance: '99.2%'
};

// Trust building elements
const TRUST_ELEMENTS = [
  {
    id: 'transparency',
    title: 'Complete Transparency',
    description: 'See exactly how we reach our medical conclusions',
    icon: 'visibility',
    color: MedicalColors.success[600]
  },
  {
    id: 'evidence_based',
    title: 'Evidence-Based Medicine',
    description: 'All recommendations follow established medical guidelines',
    icon: 'search',
    color: MedicalColors.info[600]
  },
  {
    id: 'standardized',
    title: 'Standardized Protocols',
    description: 'Same high-quality process for every patient',
    icon: 'verified',
    color: MedicalColors.primary[600]
  },
  {
    id: 'peer_reviewed',
    title: 'Peer Review Process',
    description: 'Multiple physicians review complex cases',
    icon: 'group',
    color: MedicalColors.secondary[600]
  }
];

const AppFlowGuide = () => {
  const router = useRouter();
  const [selectedFlow, setSelectedFlow] = useState<any>(null);
  const [showFlowModal, setShowFlowModal] = useState(false);

  const handleFlowPress = (flow: any) => {
    setSelectedFlow(flow);
    setShowFlowModal(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const navigateToScreen = (screen: string) => {
    setShowFlowModal(false);
    router.push(`/${screen}` as any);
  };

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Second Opinion Platform</Text>
        <Text style={styles.headerSubtitle}>
          ATM-like instant access to medical consultations
        </Text>
      </View>
      
      <View style={styles.platformStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{PLATFORM_STATS.totalConsultations}</Text>
          <Text style={styles.statLabel}>Consultations</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{PLATFORM_STATS.averageResponseTime}</Text>
          <Text style={styles.statLabel}>Response Time</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{PLATFORM_STATS.patientSatisfaction}</Text>
          <Text style={styles.statLabel}>Satisfaction</Text>
        </View>
      </View>
    </View>
  );

  const renderFlowStep = (flow: any, index: number) => (
    <Animated.View 
      key={flow.id}
      entering={FadeInDown.delay(index * 150)}
      style={styles.flowStep}
    >
      <TouchableOpacity
        style={styles.flowCard}
        onPress={() => handleFlowPress(flow)}
      >
        <View style={styles.flowHeader}>
          <View style={[styles.flowIcon, { backgroundColor: `${flow.color}20` }]}>
            <IconSymbol name={flow.icon} size={32} color={flow.color} />
          </View>
          
          <View style={styles.flowInfo}>
            <Text style={styles.flowTitle}>{flow.title}</Text>
            <Text style={styles.flowDescription}>{flow.description}</Text>
          </View>
          
          <View style={styles.flowMeta}>
            <Text style={styles.flowTime}>{flow.timeEstimate}</Text>
            <Text style={styles.flowTrust}>{flow.trustFactor}</Text>
          </View>
        </View>
        
        <View style={styles.flowFeatures}>
          {flow.features.slice(0, 3).map((feature: string, idx: number) => (
            <View key={idx} style={styles.featureItem}>
              <IconSymbol name="checkmark.circle" size={16} color={flow.color} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
          {flow.features.length > 3 && (
            <Text style={styles.moreFeatures}>+{flow.features.length - 3} more features</Text>
          )}
        </View>
        
        <View style={styles.flowFooter}>
          <Text style={styles.screenCount}>
            {flow.screens.length} screen{flow.screens.length > 1 ? 's' : ''}
          </Text>
          <IconSymbol name="chevron.right" size={20} color={MedicalColors.neutral[400]} />
        </View>
      </TouchableOpacity>
        </Animated.View>
  );

  const renderTrustSection = () => (
    <Card variant="default" padding="large" style={styles.trustCard}>
      <Text style={styles.trustTitle}>Why Patients Trust Our Platform</Text>
      <Text style={styles.trustDescription}>
        Built on the principles of transparency, evidence-based medicine, and patient empowerment
      </Text>
      
      <View style={styles.trustElements}>
        {TRUST_ELEMENTS.map((element, index) => (
          <Animated.View
            key={element.id}
            entering={FadeInUp.delay(index * 100)}
            style={styles.trustElement}
          >
            <View style={[styles.trustElementIcon, { backgroundColor: `${element.color}20` }]}>
              <IconSymbol name={element.icon} size={24} color={element.color} />
            </View>
            
            <View style={styles.trustElementContent}>
              <Text style={styles.trustElementTitle}>{element.title}</Text>
              <Text style={styles.trustElementDescription}>{element.description}</Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </Card>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.quickActionsTitle}>Quick Actions</Text>
      
      <View style={styles.quickActionButtons}>
        <Button
          title="Start Consultation"
          onPress={() => router.push('/consultation-flow')}
          variant="primary"
          size="large"
          icon="stethoscope"
          iconPosition="left"
          style={styles.quickActionButton}
        />
        
        <Button
          title="View Sample Results"
          onPress={() => router.push('/ai-assessment-results')}
          variant="outline"
          size="large"
          icon="brain.head.profile"
          iconPosition="left"
          style={styles.quickActionButton}
        />
      </View>
      
      <View style={styles.quickActionButtons}>
        <Button
          title="Medical Education"
          onPress={() => router.push('/medical-education')}
          variant="outline"
          size="medium"
          icon="book.fill"
          iconPosition="left"
          style={styles.quickActionButton}
        />
        
        <Button
          title="Protocol Demo"
          onPress={() => router.push('/medical-protocol-flow')}
          variant="outline"
          size="medium"
          icon="list.bullet.clipboard"
          iconPosition="left"
          style={styles.quickActionButton}
        />
      </View>
    </View>
  );

  const renderFlowModal = () => {
    if (!selectedFlow) return null;

    return (
      <Modal
        visible={showFlowModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFlowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedFlow.title}</Text>
            <TouchableOpacity
              onPress={() => setShowFlowModal(false)}
              style={styles.modalCloseButton}
            >
              <IconSymbol name="xmark" size={24} color={MedicalColors.neutral[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Overview</Text>
              <Text style={styles.modalSectionText}>{selectedFlow.description}</Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Key Features</Text>
              {selectedFlow.features.map((feature: string, index: number) => (
                <View key={index} style={styles.modalFeatureItem}>
                  <IconSymbol name="checkmark.circle" size={16} color={selectedFlow.color} />
                  <Text style={styles.modalFeatureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Screens Included</Text>
              {selectedFlow.screens.map((screen: string, index: number) => (
                    <TouchableOpacity
                  key={index}
                  style={styles.screenItem}
                  onPress={() => navigateToScreen(screen)}
                >
                  <IconSymbol name="rectangle" size={16} color={MedicalColors.primary[600]} />
                  <Text style={styles.screenText}>{screen.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</Text>
                  <IconSymbol name="chevron.right" size={16} color={MedicalColors.neutral[400]} />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Time & Trust</Text>
              <View style={styles.timetrustContainer}>
                <View style={styles.timetrustItem}>
                  <IconSymbol name="clock" size={20} color={MedicalColors.warning[600]} />
                  <Text style={styles.timetrustText}>Time: {selectedFlow.timeEstimate}</Text>
                </View>
                <View style={styles.timetrustItem}>
                  <IconSymbol name="shield.checkered" size={20} color={MedicalColors.success[600]} />
                  <Text style={styles.timetrustText}>Trust: {selectedFlow.trustFactor}</Text>
                </View>
              </View>
                      </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Experience This Flow"
              onPress={() => navigateToScreen(selectedFlow.screens[0])}
              variant="primary"
              size="large"
              icon="arrow_circle_right"
              iconPosition="right"
              fullWidth
            />
                      </View>
                      </View>
      </Modal>
    );
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
          <Text style={styles.headerTitle}>Platform Overview</Text>
          <View style={styles.headerSpacer} />
                  </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInUp.duration(500)}>
            {renderHeader()}
          </Animated.View>

          <View style={styles.flowContainer}>
            <Text style={styles.flowContainerTitle}>Complete Patient Journey</Text>
            <Text style={styles.flowContainerDescription}>
              From initial consultation to ongoing education - see how our platform works
            </Text>
            
            {APP_FLOW.map((flow, index) => renderFlowStep(flow, index))}
          </View>

          {renderTrustSection()}
          {renderQuickActions()}

          <View style={styles.visionSection}>
            <Text style={styles.visionTitle}>Our Vision</Text>
            <Text style={styles.visionText}>
              To provide ATM-like instant access to medical consultations, where patients can get 
              comprehensive second opinions through standardized protocols, transparent explanations, 
              and evidence-based care - building trust through knowledge and involvement.
          </Text>
            
            <View style={styles.visionPoints}>
              <View style={styles.visionPoint}>
                <IconSymbol name="bolt.fill" size={20} color={MedicalColors.warning[600]} />
                <Text style={styles.visionPointText}>Instant access like an ATM</Text>
              </View>
              
              <View style={styles.visionPoint}>
                <IconSymbol name="person.2.fill" size={20} color={MedicalColors.success[600]} />
                <Text style={styles.visionPointText}>Two-path approach (self-service vs assisted)</Text>
              </View>
              
              <View style={styles.visionPoint}>
                <IconSymbol name="search" size={20} color={MedicalColors.info[600]} />
                <Text style={styles.visionPointText}>Standardized textbook protocols</Text>
              </View>
              
              <View style={styles.visionPoint}>
                <IconSymbol name="heart.fill" size={20} color={MedicalColors.error[600]} />
                <Text style={styles.visionPointText}>Trust through transparency</Text>
              </View>
            </View>
          </View>
      </ScrollView>
    </SafeAreaView>

      {renderFlowModal()}
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerSection: {
    marginBottom: 32,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerSubtitle: {
    fontSize: 18,
    color: MedicalColors.neutral[600],
    textAlign: 'center',
    lineHeight: 26,
  },
  platformStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: MedicalColors.neutral[50],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: MedicalColors.primary[600],
  },
  statLabel: {
    fontSize: 12,
    color: MedicalColors.neutral[600],
    marginTop: 4,
  },
  flowContainer: {
    marginBottom: 32,
  },
  flowContainerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginBottom: 8,
  },
  flowContainerDescription: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
    marginBottom: 24,
    lineHeight: 24,
  },
  flowStep: {
    marginBottom: 16,
  },
  flowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  flowHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 16,
  },
  flowIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flowInfo: {
    flex: 1,
  },
  flowTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    marginBottom: 4,
  },
  flowDescription: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    lineHeight: 20,
  },
  flowMeta: {
    alignItems: 'flex-end',
  },
  flowTime: {
    fontSize: 12,
    color: MedicalColors.warning[600],
    fontWeight: '500',
  },
  flowTrust: {
    fontSize: 12,
    color: MedicalColors.success[600],
    fontWeight: '500',
    marginTop: 2,
  },
  flowFeatures: {
    gap: 8,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
  },
  moreFeatures: {
    fontSize: 12,
    color: MedicalColors.neutral[500],
    fontStyle: 'italic',
    marginLeft: 24,
  },
  flowFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: MedicalColors.neutral[200],
  },
  screenCount: {
    fontSize: 12,
    color: MedicalColors.neutral[500],
    fontWeight: '500',
  },
  trustCard: {
    marginBottom: 32,
  },
  trustTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginBottom: 8,
  },
  trustDescription: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
    lineHeight: 24,
    marginBottom: 24,
  },
  trustElements: {
    gap: 16,
  },
  trustElement: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  trustElementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trustElementContent: {
    flex: 1,
  },
  trustElementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    marginBottom: 4,
  },
  trustElementDescription: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    lineHeight: 20,
  },
  quickActionsContainer: {
    marginBottom: 32,
  },
  quickActionsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginBottom: 20,
  },
  quickActionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  quickActionButton: {
    flex: 1,
  },
  visionSection: {
    padding: 20,
    backgroundColor: MedicalColors.primary[50],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MedicalColors.primary[200],
  },
  visionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: MedicalColors.primary[900],
    marginBottom: 12,
  },
  visionText: {
    fontSize: 16,
    color: MedicalColors.primary[700],
    lineHeight: 24,
    marginBottom: 20,
  },
  visionPoints: {
    gap: 12,
  },
  visionPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  visionPointText: {
    fontSize: 14,
    color: MedicalColors.primary[800],
    fontWeight: '500',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: MedicalColors.neutral[200],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  modalCloseButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    marginBottom: 12,
  },
  modalSectionText: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    lineHeight: 20,
  },
  modalFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  modalFeatureText: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
  },
  screenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: MedicalColors.neutral[50],
    borderRadius: 8,
    marginBottom: 8,
  },
  screenText: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
    flex: 1,
  },
  timetrustContainer: {
    gap: 12,
  },
  timetrustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timetrustText: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: MedicalColors.neutral[200],
  },
});

export default AppFlowGuide; 