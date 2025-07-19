import OnboardingLayout from '@/components/layout/OnboardingLayout';
import { IconSymbol } from '@/components/ui';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const OnboardingScreenStep2 = () => {
  const router = useRouter();

  return (
    <OnboardingLayout
      backgroundColor="rgb(255, 235, 235)"
      progress="33%"
      title="Emphatic Wellness AI Chatbot for All"
      subtitle="Wellness AI Chatbot at your fingertips."
      onNext={() => router.push('/onboarding-step3')}
      onBack={() => router.back()}
      onSkip={() => router.push('/(tabs)')}
    >
      <View style={styles.illustration}>
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <IconSymbol name="smart_toy" size={32} color="rgb(220, 38, 38)" />
            <Text style={styles.chatTitle}>AI Wellness Assistant</Text>
          </View>
          <View style={styles.chatBubbles}>
            <View style={styles.aiBubble}>
              <Text style={styles.bubbleText}>Hello! How can I help you today?</Text>
            </View>
            <View style={styles.userBubble}>
              <Text style={styles.userBubbleText}>I have a headache</Text>
            </View>
            <View style={styles.aiBubble}>
              <Text style={styles.bubbleText}>Let me analyze your symptoms...</Text>
            </View>
          </View>
          <View style={styles.typingIndicator}>
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
          </View>
        </View>
      </View>
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  illustration: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  chatHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(220, 38, 38)',
    marginTop: 8,
  },
  chatBubbles: {
    marginBottom: 16,
  },
  aiBubble: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  bubbleText: {
    fontSize: 14,
    color: 'rgb(220, 38, 38)',
  },
  userBubble: {
    backgroundColor: 'rgb(220, 38, 38)',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  userBubbleText: {
    fontSize: 14,
    color: 'white',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(220, 38, 38, 0.5)',
    marginRight: 4,
  },
});

export default OnboardingScreenStep2; 