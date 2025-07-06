import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#c9e7ff", "#e0c3fc"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBg}
      >
        {/* Lock Icon/Illustration */}
        <View style={styles.lockIconWrapper}>
          <FontAwesome name="lock" size={64} color="#84CC16" style={{ opacity: 0.9 }} />
        </View>
        {/* Glassmorphism Card */}
        <View style={styles.glassCard}>
          <Text style={styles.heading}>Forgot Password?</Text>
          <Text style={styles.subtitle}>Select a method to reset your password</Text>
          {/* Method Cards */}
          <View style={styles.methodStack}>
            <View style={styles.methodCard}>
              <View style={styles.methodIconCircle}>
                <FontAwesome name="envelope" size={24} color="#84CC16" />
              </View>
              <View>
                <Text style={styles.methodTitle}>Email</Text>
                <Text style={styles.methodDesc}>Send reset link to your email</Text>
              </View>
            </View>
            <View style={[styles.methodCard, styles.methodCardAlt]}>
              <View style={[styles.methodIconCircle, { backgroundColor: '#ECFCD9' }] }>
                <FontAwesome name="phone" size={24} color="#84CC16" />
              </View>
              <View>
                <Text style={styles.methodTitle}>Phone</Text>
                <Text style={styles.methodDesc}>Send code to your phone</Text>
              </View>
            </View>
          </View>
          {/* Google Button */}
          <Pressable
            style={({ pressed }) => [
              styles.googleButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {}}
          >
            <FontAwesome name="google" size={22} color="#EA4335" style={{ marginRight: 10 }} />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </Pressable>
          {/* Continue Button */}
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push('./verify-2fa')}
          >
            <LinearGradient
              colors={["#84CC16", "#4ADE80"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButtonGradient}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
              <View style={{ width: 8 }} />
              <IconSymbol name="arrow.right" size={24} color="#fff" />
            </LinearGradient>
          </Pressable>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIconWrapper: {
    marginTop: 40,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassCard: {
    width: 343,
    minHeight: 480,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 32,
    padding: 32,
    shadowColor: '#313A34',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: Platform.OS === 'web' ? 'blur(16px)' : undefined,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#313A34',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#63705E',
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: '500',
  },
  methodStack: {
    width: '100%',
    marginBottom: 24,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#313A34',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  methodCardAlt: {
    borderWidth: 1.5,
    borderColor: '#84CC16',
    backgroundColor: '#F8FFF0',
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
  methodTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#313A34',
  },
  methodDesc: {
    fontSize: 14,
    color: '#63705E',
    fontWeight: '400',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 28,
    height: 56,
    width: 279,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  googleButtonText: {
    color: '#313A34',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    width: 279,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#84CC16',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  primaryButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
    shadowOpacity: 0.25,
  },
}); 