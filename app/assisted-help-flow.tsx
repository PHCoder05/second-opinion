import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol, Card, Button, Input } from '@/components/ui';
import { MedicalColors, MedicalGradients } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'support' | 'system';
  timestamp: Date;
  type?: 'text' | 'question' | 'info' | 'document-request';
}

interface SupportAgent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isOnline: boolean;
  specialization: string;
}

export default function AssistedHelpFlow() {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [supportAgent, setSupportAgent] = useState<SupportAgent | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState('connecting');

  useEffect(() => {
    // Simulate connection to support team
    const connectionTimer = setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setCurrentStep('connected');
      
      // Set mock support agent
      setSupportAgent({
        id: '1',
        name: 'Dr. Sarah Johnson',
        role: 'Medical Support Specialist',
        avatar: '👩‍⚕️',
        isOnline: true,
        specialization: 'Internal Medicine'
      });

      // Add welcome messages
      addSystemMessage('Connected to medical support team');
      setTimeout(() => {
        addSupportMessage(
          "Hello! I'm Dr. Sarah Johnson, your medical support specialist. I'll guide you through collecting your medical information to ensure we have everything needed for your second opinion. Let's start with understanding your main health concern."
        );
      }, 1000);
      
      setTimeout(() => {
        addSupportMessage(
          "Could you tell me what brings you here today? What's your main health concern or symptom?",
          'question'
        );
      }, 2000);
      
    }, 3000);

    return () => clearTimeout(connectionTimer);
  }, []);

  const addSystemMessage = (text: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'system',
      timestamp: new Date(),
      type: 'info'
    };
    setMessages(prev => [...prev, message]);
  };

  const addSupportMessage = (text: string, type: 'text' | 'question' | 'info' | 'document-request' = 'text') => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'support',
      timestamp: new Date(),
      type
    };
    setMessages(prev => [...prev, message]);
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate AI/support response
    setTimeout(() => {
      setIsTyping(false);
      handleSupportResponse(userMessage.text);
    }, 1500);
  };

  const handleSupportResponse = (userText: string) => {
    const responses = [
      "Thank you for sharing that information. That helps me understand your situation better.",
      "I see. Can you tell me more about when these symptoms started?",
      "That's important information. Do you have any medical records or test results related to this?",
      "Have you seen any doctors about this concern before? If so, what was their diagnosis or treatment plan?",
      "Are you currently taking any medications for this condition?",
      "Do you have any allergies to medications or other substances?",
      "On a scale of 1-10, how would you rate your pain or discomfort level?",
      "Are there any other symptoms you're experiencing that might be related?",
      "Thank you for providing all that information. Let me help you upload any relevant medical documents you might have."
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    addSupportMessage(randomResponse, 'question');
  };

  const handleDocumentUpload = () => {
    addSupportMessage(
      "I can help you upload your medical documents. Please share any test results, previous diagnoses, or treatment records you have. This will help our medical team provide you with the most accurate second opinion.",
      'document-request'
    );
  };

  const handleCallRequest = () => {
    Alert.alert(
      'Schedule Call',
      'Would you like to schedule a phone call with our medical support team?',
      [
        { text: 'Not now', style: 'cancel' },
        { 
          text: 'Schedule Call', 
          onPress: () => {
            Alert.alert('Call Scheduled', 'We\'ll call you within the next 15 minutes.');
            addSystemMessage('Phone call scheduled - expect a call within 15 minutes');
          }
        }
      ]
    );
  };

  const handleVideoCall = () => {
    Alert.alert(
      'Video Consultation',
      'Start a video call with your medical support specialist?',
      [
        { text: 'Not now', style: 'cancel' },
        { 
          text: 'Start Video Call', 
          onPress: () => {
            Alert.alert('Video Call', 'Video consultation feature coming soon!');
          }
        }
      ]
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.sender === 'user';
    const isSystem = message.sender === 'system';
    
    return (
      <Animated.View
        key={message.id}
        entering={FadeInUp.duration(300)}
        style={[
          styles.messageContainer,
          isUser && styles.userMessageContainer,
          isSystem && styles.systemMessageContainer
        ]}
      >
        {!isUser && !isSystem && (
          <View style={styles.agentAvatar}>
            <Text style={styles.avatarText}>{supportAgent?.avatar}</Text>
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isUser && styles.userMessageBubble,
          isSystem && styles.systemMessageBubble,
          message.type === 'question' && styles.questionBubble,
          message.type === 'document-request' && styles.documentRequestBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser && styles.userMessageText,
            isSystem && styles.systemMessageText
          ]}>
            {message.text}
          </Text>
          <Text style={[
            styles.messageTime,
            isUser && styles.userMessageTime
          ]}>
            {formatTime(message.timestamp)}
          </Text>
        </View>
      </Animated.View>
    );
  };

  if (isConnecting) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[MedicalColors.primary[50], MedicalColors.secondary[50], '#FFFFFF']}
          locations={[0, 0.3, 1]}
          style={StyleSheet.absoluteFillObject}
        />
        
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.connectingContainer}>
            <Animated.View entering={FadeIn.duration(800)} style={styles.connectingContent}>
              <View style={styles.connectingIcon}>
                <LinearGradient
                  colors={MedicalGradients.primary}
                  style={styles.connectingIconGradient}
                >
                  <IconSymbol name="person.2" size={32} color="#FFFFFF" />
                </LinearGradient>
              </View>
              
              <Text style={styles.connectingTitle}>Connecting to Medical Support</Text>
              <Text style={styles.connectingSubtitle}>
                We're connecting you with a medical support specialist who will guide you through the process
              </Text>
              
              <View style={styles.connectingSteps}>
                <View style={styles.connectingStep}>
                  <IconSymbol name="checkmark.circle.fill" size={20} color={MedicalColors.secondary[600]} />
                  <Text style={styles.connectingStepText}>Finding available specialist</Text>
                </View>
                <View style={styles.connectingStep}>
                  <IconSymbol name="checkmark.circle.fill" size={20} color={MedicalColors.secondary[600]} />
                  <Text style={styles.connectingStepText}>Reviewing your consultation request</Text>
                </View>
                <View style={styles.connectingStep}>
                  <IconSymbol name="arrow.clockwise" size={20} color={MedicalColors.primary[600]} />
                  <Text style={styles.connectingStepText}>Establishing secure connection</Text>
                </View>
              </View>
            </Animated.View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[MedicalColors.primary[50], MedicalColors.secondary[50], '#FFFFFF']}
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <IconSymbol name="chevron.left" size={24} color={MedicalColors.primary[600]} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Medical Support</Text>
            {supportAgent && (
              <Text style={styles.headerSubtitle}>
                {supportAgent.name} • {supportAgent.specialization}
              </Text>
            )}
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={handleCallRequest}
              style={styles.headerAction}
            >
              <IconSymbol name="phone" size={20} color={MedicalColors.primary[600]} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleVideoCall}
              style={styles.headerAction}
            >
              <IconSymbol name="video" size={20} color={MedicalColors.primary[600]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={handleDocumentUpload}
          >
            <IconSymbol name="doc.text" size={16} color={MedicalColors.primary[600]} />
            <Text style={styles.quickActionText}>Upload Documents</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => router.push('/symptom-checker')}
          >
            <IconSymbol name="stethoscope" size={16} color={MedicalColors.primary[600]} />
            <Text style={styles.quickActionText}>Symptom Checker</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => addSupportMessage("I need help with understanding my medical records")}
          >
            <IconSymbol name="questionmark.circle" size={16} color={MedicalColors.primary[600]} />
            <Text style={styles.quickActionText}>Get Help</Text>
          </TouchableOpacity>
        </View>

        {/* Chat Messages */}
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          
          {isTyping && (
            <Animated.View
              entering={FadeIn.duration(300)}
              style={styles.typingIndicator}
            >
              <View style={styles.agentAvatar}>
                <Text style={styles.avatarText}>{supportAgent?.avatar}</Text>
              </View>
              <View style={styles.typingBubble}>
                <Text style={styles.typingText}>Dr. Sarah is typing...</Text>
              </View>
            </Animated.View>
          )}
        </ScrollView>

        {/* Message Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type your message..."
              placeholderTextColor={MedicalColors.neutral[400]}
              value={currentMessage}
              onChangeText={setCurrentMessage}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                currentMessage.trim() ? styles.sendButtonActive : styles.sendButtonInactive
              ]}
              onPress={sendMessage}
              disabled={!currentMessage.trim()}
            >
              <IconSymbol 
                name="arrow.up" 
                size={20} 
                color={currentMessage.trim() ? '#FFFFFF' : MedicalColors.neutral[400]} 
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* Support Info */}
        <View style={styles.supportInfo}>
          <View style={styles.supportStatus}>
            <View style={[styles.statusDot, { backgroundColor: MedicalColors.secondary[600] }]} />
            <Text style={styles.statusText}>Medical team online</Text>
          </View>
          <Text style={styles.supportNote}>
            Your conversation is secure and HIPAA compliant
          </Text>
        </View>
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
  connectingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  connectingContent: {
    alignItems: 'center',
  },
  connectingIcon: {
    marginBottom: 24,
  },
  connectingIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: MedicalColors.primary[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  connectingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    textAlign: 'center',
    marginBottom: 12,
  },
  connectingSubtitle: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  connectingSteps: {
    gap: 16,
  },
  connectingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  connectingStepText: {
    fontSize: 16,
    color: MedicalColors.neutral[700],
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: MedicalColors.neutral[200],
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  headerSubtitle: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: MedicalColors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: MedicalColors.primary[100],
    borderRadius: 16,
    gap: 6,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: MedicalColors.primary[700],
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  systemMessageContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  agentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MedicalColors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontSize: 16,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: MedicalColors.neutral[100],
  },
  userMessageBubble: {
    backgroundColor: MedicalColors.primary[600],
    alignSelf: 'flex-end',
  },
  systemMessageBubble: {
    backgroundColor: MedicalColors.secondary[100],
    alignSelf: 'center',
  },
  questionBubble: {
    borderWidth: 1,
    borderColor: MedicalColors.primary[200],
    backgroundColor: MedicalColors.primary[50],
  },
  documentRequestBubble: {
    borderWidth: 1,
    borderColor: MedicalColors.accent[200],
    backgroundColor: MedicalColors.accent[50],
  },
  messageText: {
    fontSize: 16,
    color: MedicalColors.neutral[900],
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  systemMessageText: {
    color: MedicalColors.secondary[800],
    fontWeight: '500',
  },
  messageTime: {
    fontSize: 12,
    color: MedicalColors.neutral[500],
    marginTop: 4,
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  typingBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: MedicalColors.neutral[100],
  },
  typingText: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    fontStyle: 'italic',
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: MedicalColors.neutral[200],
    backgroundColor: '#FFFFFF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: MedicalColors.neutral[900],
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: MedicalColors.primary[600],
  },
  sendButtonInactive: {
    backgroundColor: MedicalColors.neutral[200],
  },
  supportInfo: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: MedicalColors.neutral[50],
  },
  supportStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: MedicalColors.neutral[700],
  },
  supportNote: {
    fontSize: 11,
    color: MedicalColors.neutral[500],
  },
}); 