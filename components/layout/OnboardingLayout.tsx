import { IconSymbol } from '@/components/ui';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

interface OnboardingLayoutProps {
  backgroundColor: string;
  progress: string;
  title: string;
  subtitle: string;
  onNext: () => void;
  onSkip: () => void;
  onBack?: () => void;
  children: React.ReactNode;
}

const OnboardingLayout = ({
  backgroundColor,
  progress,
  title,
  subtitle,
  onNext,
  onSkip,
  onBack,
  children,
}: OnboardingLayoutProps) => {
  const handleNextPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onNext();
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor }]} entering={FadeIn}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.nav}>
          {onBack ? (
            <TouchableOpacity style={styles.navButton} onPress={onBack}>
              <IconSymbol name="chevron.left" color="rgb(49, 58, 52)" size={24} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 48 }} />
          )}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: progress }]} />
          </View>
          <TouchableOpacity onPress={onSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.illustrationContainer}>{children}</View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleNextPress}>
            <Text style={styles.primaryButtonText}>Continue</Text>
            <IconSymbol name="chevron.right" color="white" size={24} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  footer: {
    paddingTop: 20,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 16,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(49, 58, 52, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(49, 58, 52, 0.1)',
    borderRadius: 4,
    marginHorizontal: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgb(49, 58, 52)',
    borderRadius: 4,
  },
  skipText: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgb(49, 58, 52)',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'rgb(100, 112, 103)',
    paddingHorizontal: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(49, 58, 52)',
    borderRadius: 28,
    paddingVertical: 18,
    width: '100%',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default OnboardingLayout; 