import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function Verify2FAScreen() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const router = useRouter();

  const handleChange = (val, idx) => {
    const newCode = [...code];
    newCode[idx] = val.replace(/[^0-9]/g, '').slice(0, 1);
    setCode(newCode);
    // Focus next input if filled
    if (val && idx < 5) {
      const next = `codeInput${idx + 1}`;
      refs[next]?.focus();
    }
  };

  const refs = {};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Enter 2FA Code</Text>
          <Text style={styles.subtitle}>We sent a code to your email or phone</Text>
          <View style={styles.codeRow}>
            {[0,1,2,3,4,5].map((i) => (
              <TextInput
                key={i}
                ref={ref => refs[`codeInput${i}`] = ref}
                value={code[i]}
                onChangeText={val => handleChange(val, i)}
                style={styles.codeInput}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
              />
            ))}
          </View>
          <TouchableOpacity style={styles.verifyButton}>
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resendLink}>
            <Text style={styles.resendText}>Resend code</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 343,
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 32,
    shadowColor: '#313A34',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    alignItems: 'center',
  },
  title: {
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
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 12,
  },
  codeInput: {
    width: 44,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 24,
    color: '#313A34',
    backgroundColor: '#F5F5F5',
  },
  verifyButton: {
    width: 343,
    height: 56,
    backgroundColor: '#84CC16',
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  resendLink: {
    marginTop: 8,
  },
  resendText: {
    color: '#63705E',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
}); 