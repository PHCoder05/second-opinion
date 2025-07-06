import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Pressable, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { IconSymbol } from '../components/ui/IconSymbol';
import VerificationSentCard from '../components/VerificationSentCard';

const METHOD_OPTIONS = [
  {
    key: 'email',
    icon: 'email',
    title: 'Email Address',
    desc: 'Send via email address securely.',
  },
  {
    key: '2fa',
    icon: 'lock',
    title: '2 Factor Authentication',
    desc: 'Send via 2FA securely.',
  },
  {
    key: 'authenticator',
    icon: 'google', // If 'google' is not valid, use 'email' or another mapped icon
    title: 'Google Authenticator',
    desc: 'Send via authenticator securely.',
  },
] as const;

type MethodKey = typeof METHOD_OPTIONS[number]['key'] | null;

export default function ForgotPasswordScreen() {
  const [selectedMethod, setSelectedMethod] = useState<MethodKey>(null);
  const router = useRouter();

  const handleResend = () => {
    // TODO: Implement resend logic
    alert('Resend password link!');
  };

  // Back button logic
  const handleBack = () => {
    if (selectedMethod) {
      setSelectedMethod(null); // Go back to method selection
    } else {
      router.back(); // Go back in navigation stack
    }
  };

  // Show verification card after method selection
  if (selectedMethod) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F6F6' }}>
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
            <View style={styles.backCircle}>
              <IconSymbol name="chevron.left" size={22} color="#313A34" />
            </View>
          </TouchableOpacity>
          <VerificationSentCard onResend={handleResend} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F6F6' }}>
      {/* Optional: Subtle background lock icon */}
      <View style={styles.bgIconWrapper} pointerEvents="none">
        <IconSymbol name="lock" size={180} color="#E5E7EB" style={{ opacity: 0.18 }} />
      </View>
      <View style={styles.innerContainer}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <View style={styles.backCircle}>
            <IconSymbol name="chevron.left" size={22} color="#313A34" />
          </View>
        </TouchableOpacity>
        {/* Heading */}
        <ThemedText type="title" style={styles.heading}>Forgot Password</ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          Select which methods you'd like to reset.
        </ThemedText>
        {/* Method Options */}
        <View style={styles.methodList}>
          {METHOD_OPTIONS.map(option => (
            <Pressable
              key={option.key}
              style={({ pressed }) => [
                styles.methodCard,
                selectedMethod === option.key && styles.methodCardSelected,
                pressed && styles.methodCardPressed,
              ]}
              onPress={() => setSelectedMethod(option.key)}
            >
              <View style={[styles.methodIconCircle, selectedMethod === option.key && styles.methodIconCircleSelected]}>
                <IconSymbol name={option.icon as any} size={24} color={selectedMethod === option.key ? '#85cc16' : '#63705E'} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText type="subtitle" style={styles.methodTitle}>{option.title}</ThemedText>
                <ThemedText type="default" style={styles.methodDesc}>{option.desc}</ThemedText>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
      {/* Primary Button at bottom */}
      <View style={styles.bottomButtonWrapper}>
        <Pressable
          style={[styles.primaryButton, !selectedMethod && { opacity: 0.5 }]}
          onPress={() => selectedMethod && setSelectedMethod(selectedMethod)}
          disabled={!selectedMethod}
        >
          <ThemedText type="defaultSemiBold" style={styles.primaryButtonText}>Reset Password</ThemedText>
          <IconSymbol name="arrow.right" size={20} color="#fff" style={{ marginLeft: 8 }} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  innerContainer: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 24,
    zIndex: 2,
  },
  bgIconWrapper: {
    position: 'absolute',
    left: -30,
    bottom: 0,
    zIndex: 0,
  },
  backButton: {
    marginBottom: 24,
    alignSelf: 'flex-start',
    zIndex: 2,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#313A34',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#313A34',
    marginBottom: 8,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    color: '#63705E',
    marginBottom: 32,
    textAlign: 'left',
    fontWeight: '500',
  },
  methodList: {
    marginBottom: 32,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#313A34',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1.5,
    borderColor: 'transparent',
    zIndex: 2,
  },
  methodCardSelected: {
    borderColor: '#85cc16',
    shadowOpacity: 0.15,
  },
  methodCardPressed: {
    opacity: 0.7,
    backgroundColor: '#F3F3F3',
  },
  methodIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  methodIconCircleSelected: {
    backgroundColor: '#ECFCD9',
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#313A34',
    marginBottom: 2,
  },
  methodDesc: {
    fontSize: 14,
    color: '#63705E',
    fontWeight: '400',
  },
  bottomButtonWrapper: {
    padding: 24,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4C9A2A',
    borderRadius: 16,
    height: 48,
    width: width - 48,
    alignSelf: 'center',
    opacity: 1,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 