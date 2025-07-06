import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';

export default function VerificationSentCard({ onResend }: { onResend?: () => void }) {
  return (
    <ThemedView style={styles.card}>
      {/* Illustration Placeholder */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require('../assets/images/partial-react-logo.png')} // Placeholder image
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>
      {/* Main Text */}
      <ThemedText type="title" style={styles.title}>
        We've Sent Verification{"\n"}Code to ****••••**24
      </ThemedText>
      {/* Subtext */}
      <ThemedText type="default" style={styles.subtitle}>
        {"Didn't receive the link? Then re-send\nthe password below!"}
      </ThemedText>
      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={onResend} activeOpacity={0.8}>
        <ThemedText type="button" style={styles.buttonText}>
          Re-Send Password
        </ThemedText>
        <IconSymbol name="lock" size={18} color="#fff" style={styles.buttonIcon} />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 40,
    padding: 24,
    width: 340,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.1,
    shadowRadius: 31,
    elevation: 10,
    marginVertical: 24,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  illustration: {
    width: 180,
    height: 120,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#85cc16',
    borderRadius: 21,
    height: 48,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 0,
  },
}); 