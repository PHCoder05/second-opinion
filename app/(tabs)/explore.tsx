import { IconSymbol } from '@/components/ui/IconSymbol';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

interface NavigationItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  backgroundColor: string;
  route?: string;
  action?: () => void;
}

interface NavigationCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  items: NavigationItem[];
}

export default function ExploreScreen() {
  const router = useRouter();

  const handleNavigation = (route?: string, action?: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (action) {
      action();
    } else if (route) {
      router.push(route as any);
    }
  };

  const navigationCategories: NavigationCategory[] = [
    {
      id: 'consultation',
      title: 'Consultation Services',
      description: 'Get expert medical opinions and consultations',
      icon: 'stethoscope',
      color: 'rgb(132, 204, 22)',
      items: [
        {
          id: 'second-opinion',
          title: 'Second Opinion',
          subtitle: 'Expert medical consultation',
          icon: 'person.2.fill',
          color: 'rgb(132, 204, 22)',
          backgroundColor: 'rgba(132, 204, 22, 0.1)',
          route: '/consultation-flow',
        },
        {
          id: 'self-service',
          title: 'Self-Service ($29)',
          subtitle: 'AI-guided consultation',
          icon: 'person.fill',
          color: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          route: '/self-service-flow',
        },
        {
          id: 'assisted-help',
          title: 'Assisted Help ($79)',
          subtitle: 'Expert-guided consultation',
          icon: 'person.3.fill',
          color: 'rgb(168, 85, 247)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          route: '/assisted-help-flow',
        },
        {
          id: 'consultation-history',
          title: 'Consultation History',
          subtitle: 'View past consultations',
          icon: 'clock.fill',
          color: 'rgb(100, 112, 103)',
          backgroundColor: 'rgba(100, 112, 103, 0.1)',
          route: '/consultations',
        },
      ],
    },
    {
      id: 'health-tools',
      title: 'Health Assessment Tools',
      description: 'Comprehensive health evaluation and monitoring',
      icon: 'heart.fill',
      color: 'rgb(239, 68, 68)',
      items: [
        {
          id: 'health-assessment',
          title: 'Health Assessment',
          subtitle: 'Complete health evaluation',
          icon: 'heart.text.square.fill',
          color: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          route: '/comprehensive-health-assessment',
        },
        {
          id: 'symptom-checker',
          title: 'Symptom Checker',
          subtitle: 'AI-powered symptom analysis',
          icon: 'magnifyingglass.circle.fill',
          color: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          route: '/symptom-checker',
        },
        {
          id: 'pain-mapping',
          title: 'Visual Pain Mapping',
          subtitle: 'Interactive body diagram',
          icon: 'figure.walk',
          color: 'rgb(249, 115, 22)',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          route: '/symptom-checker',
        },
        {
          id: 'ai-results',
          title: 'AI Assessment Results',
          subtitle: 'View AI analysis results',
          icon: 'brain.head.profile',
          color: 'rgb(168, 85, 247)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          route: '/ai-assessment-results',
        },
      ],
    },
    {
      id: 'medical-protocol',
      title: 'Medical Protocol & Education',
      description: 'Evidence-based medical protocols and education',
      icon: 'book.closed.fill',
      color: 'rgb(16, 185, 129)',
      items: [
        {
          id: 'medical-protocol',
          title: 'Medical Protocol Flow',
          subtitle: 'Review → Order → Treat',
          icon: 'list.bullet.clipboard.fill',
          color: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          route: '/medical-protocol-flow',
        },
        {
          id: 'medical-education',
          title: 'Medical Education',
          subtitle: 'Learn about conditions',
          icon: 'book.closed.fill',
          color: 'rgb(132, 204, 22)',
          backgroundColor: 'rgba(132, 204, 22, 0.1)',
          route: '/medical-education',
        },
        {
          id: 'treatment-plans',
          title: 'Treatment Plans',
          subtitle: 'Personalized treatment',
          icon: 'pills.fill',
          color: 'rgb(168, 85, 247)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          route: '/medical-protocol-flow',
        },
      ],
    },
    {
      id: 'records-management',
      title: 'Medical Records & Profile',
      description: 'Manage your health information securely',
      icon: 'doc.text.fill',
      color: 'rgb(59, 130, 246)',
      items: [
        {
          id: 'medical-records',
          title: 'Medical Records',
          subtitle: 'Manage documents',
          icon: 'doc.text.fill',
          color: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          route: '/medical-records',
        },
        {
          id: 'health-profile',
          title: 'Health Profile',
          subtitle: 'Personal health info',
          icon: 'person.crop.circle.fill',
          color: 'rgb(100, 112, 103)',
          backgroundColor: 'rgba(100, 112, 103, 0.1)',
          route: '/profile',
        },
        {
          id: 'upload-documents',
          title: 'Upload Documents',
          subtitle: 'Add medical files',
          icon: 'doc.badge.plus',
          color: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          route: '/medical-records',
        },
      ],
    },
    {
      id: 'appointments',
      title: 'Appointments & Communication',
      description: 'Schedule and manage your healthcare appointments',
      icon: 'calendar.badge.plus',
      color: 'rgb(251, 204, 21)',
      items: [
        {
          id: 'appointments',
          title: 'Appointments',
          subtitle: 'Schedule & manage',
          icon: 'calendar.badge.plus',
          color: 'rgb(251, 204, 21)',
          backgroundColor: 'rgba(251, 204, 21, 0.1)',
          action: () => Alert.alert('Coming Soon', 'Appointment booking coming soon!'),
        },
        {
          id: 'messages',
          title: 'AI Health Assistant',
          subtitle: 'Chat with AI assistant',
          icon: 'message.fill',
          color: 'rgb(132, 204, 22)',
          backgroundColor: 'rgba(132, 204, 22, 0.1)',
          action: () => Alert.alert('Coming Soon', 'AI Health Assistant coming soon!'),
        },
        {
          id: 'live-chat',
          title: 'Live Chat Support',
          subtitle: 'Real-time medical support',
          icon: 'bubble.left.and.bubble.right.fill',
          color: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          action: () => Alert.alert('Coming Soon', 'Live chat support coming soon!'),
        },
      ],
    },
    {
      id: 'coming-soon',
      title: 'Coming Soon Features',
      description: 'Exciting features in development',
      icon: 'sparkles',
      color: 'rgb(168, 85, 247)',
      items: [
        {
          id: 'vitals-tracking',
          title: 'Vitals Tracking',
          subtitle: 'Monitor health metrics',
          icon: 'waveform.path.ecg',
          color: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          action: () => Alert.alert('Coming Soon', 'Vitals tracking coming soon!'),
        },
        {
          id: 'medication-reminders',
          title: 'Medication Reminders',
          subtitle: 'Never miss a dose',
          icon: 'pills.fill',
          color: 'rgb(168, 85, 247)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          action: () => Alert.alert('Coming Soon', 'Medication reminders coming soon!'),
        },
        {
          id: 'doctor-directory',
          title: 'Find Doctors',
          subtitle: 'Browse specialists',
          icon: 'person.3.fill',
          color: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          action: () => Alert.alert('Coming Soon', 'Doctor directory coming soon!'),
        },
        {
          id: 'health-reports',
          title: 'Health Reports',
          subtitle: 'Comprehensive reports',
          icon: 'chart.bar.fill',
          color: 'rgb(251, 204, 21)',
          backgroundColor: 'rgba(251, 204, 21, 0.1)',
          action: () => Alert.alert('Coming Soon', 'Health reports coming soon!'),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Animated.View style={styles.header} entering={FadeIn}>
          <Text style={styles.headerTitle}>All Features</Text>
          <Text style={styles.headerSubtitle}>
            Explore all available features and services in your Second Opinion app
          </Text>
          
          {/* App Flow Guide Button */}
          <TouchableOpacity 
            style={styles.flowGuideButton}
            onPress={() => handleNavigation('/app-flow-guide')}
            activeOpacity={0.8}
          >
            <IconSymbol name="map" size={20} color="rgb(132, 204, 22)" />
            <Text style={styles.flowGuideText}>View Complete App Flow</Text>
            <IconSymbol name="chevron.right" size={16} color="rgb(132, 204, 22)" />
          </TouchableOpacity>
        </Animated.View>

        {/* Navigation Categories */}
        {navigationCategories.map((category, categoryIndex) => (
          <Animated.View
            key={category.id}
            style={styles.categorySection}
            entering={FadeInDown.delay(categoryIndex * 100)}
          >
            {/* Category Header */}
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                <IconSymbol name={category.icon} size={24} color={category.color} />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>
            </View>

            {/* Category Items */}
            <View style={styles.categoryItems}>
              {category.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.navigationItem, { backgroundColor: item.backgroundColor }]}
                  onPress={() => handleNavigation(item.route, item.action)}
                  activeOpacity={0.8}
                >
                  <View style={styles.itemIcon}>
                    <IconSymbol name={item.icon} size={24} color={item.color} />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemTitle, { color: item.color }]}>
                      {item.title}
                    </Text>
                    <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={16} color="rgb(100, 112, 103)" />
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        ))}

        {/* Footer */}
        <Animated.View style={styles.footer} entering={FadeInDown.delay(600)}>
          <Text style={styles.footerText}>
            More features are being added regularly. Stay tuned for updates!
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(245, 246, 245)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    lineHeight: 24,
  },
  categorySection: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    lineHeight: 20,
  },
  categoryItems: {
    gap: 12,
  },
  navigationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(100, 112, 103, 0.1)',
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    textAlign: 'center',
    lineHeight: 20,
  },
  flowGuideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(132, 204, 22, 0.2)',
  },
  flowGuideText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(132, 204, 22)',
    marginLeft: 8,
    marginRight: 8,
  },
});
