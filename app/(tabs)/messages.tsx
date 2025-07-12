import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function MessagesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <IconSymbol name="message.fill" size={64} color="rgb(132, 204, 22)" />
        <Text style={styles.title}>AI Health Assistant</Text>
        <Text style={styles.subtitle}>Chat with our AI-powered health assistant for personalized guidance</Text>
        <Text style={styles.comingSoon}>Coming Soon!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(245, 246, 245)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  comingSoon: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgb(132, 204, 22)',
  },
}); 