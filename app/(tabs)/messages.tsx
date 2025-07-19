import { Card, IconSymbol } from '@/components/ui';
import { MedicalColors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
  Dimensions,
    FlatList,
    KeyboardAvoidingView,
    Platform,
  RefreshControl,
  ScrollView,
    StatusBar,
  StyleSheet,
    Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
    Extrapolate,
  FadeInDown,
  FadeInUp,
    SlideInDown,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Enhanced messages data with medical context
const MESSAGES_DATA = {
  conversations: [
    {
      id: 1,
      type: 'doctor',
      participant: {
        name: 'Dr. Michael Chen',
        specialty: 'Cardiologist',
        avatar: null,
        status: 'online',
        verified: true,
        hospital: 'City Medical Center',
      },
      lastMessage: {
        text: 'Your lab results look good. Let\'s schedule a follow-up.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        type: 'text',
        sender: 'doctor',
      },
      unreadCount: 2,
      priority: 'high',
      appointmentContext: {
        upcoming: true,
        date: '2024-01-15',
        time: '14:30',
      },
    },
    {
      id: 2,
      type: 'support',
      participant: {
        name: 'Health Support',
        specialty: 'Customer Care',
        avatar: null,
        status: 'online',
        verified: true,
        hospital: 'SecondOpinion Platform',
      },
      lastMessage: {
        text: 'Your insurance coverage has been verified successfully.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        type: 'system',
        sender: 'support',
      },
      unreadCount: 0,
      priority: 'medium',
    },
    {
      id: 3,
      type: 'pharmacy',
      participant: {
        name: 'CityPharm Pharmacy',
        specialty: 'Medication Services',
        avatar: null,
        status: 'offline',
        verified: true,
        hospital: 'Local Pharmacy',
      },
      lastMessage: {
        text: 'Your prescription is ready for pickup.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        type: 'notification',
        sender: 'pharmacy',
      },
      unreadCount: 1,
      priority: 'medium',
    },
    {
      id: 4,
      type: 'doctor',
      participant: {
        name: 'Dr. Sarah Johnson',
        specialty: 'Dermatologist',
        avatar: null,
        status: 'away',
        verified: true,
        hospital: 'Skin Health Institute',
      },
      lastMessage: {
        text: 'The photos you shared look fine. No concerns.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        type: 'text',
        sender: 'doctor',
      },
      unreadCount: 0,
      priority: 'low',
    },
  ],
  currentChat: {
    id: 1,
    participant: {
      name: 'Dr. Michael Chen',
      specialty: 'Cardiologist',
      avatar: null,
      status: 'online',
      verified: true,
      hospital: 'City Medical Center',
    },
    messages: [
      {
        id: 1,
        text: 'Hello! How are you feeling today?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        sender: 'doctor',
        type: 'text',
        status: 'read',
      },
      {
        id: 2,
        text: 'Hi Dr. Chen! I\'m feeling much better after the medication you prescribed.',
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        sender: 'user',
        type: 'text',
        status: 'delivered',
      },
      {
        id: 3,
        text: 'That\'s great to hear! I\'ve reviewed your latest lab results.',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        sender: 'doctor',
        type: 'text',
        status: 'read',
      },
      {
        id: 4,
        text: '',
        timestamp: new Date(Date.now() - 50 * 60 * 1000),
        sender: 'doctor',
        type: 'lab_results',
        status: 'read',
        attachment: {
          type: 'lab_results',
          title: 'Blood Panel Results',
          date: '2024-01-12',
          status: 'Normal',
          details: 'All values within normal range',
        },
      },
      {
        id: 5,
        text: 'Your cholesterol levels have improved significantly. Keep up the good work with your diet!',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        sender: 'doctor',
        type: 'text',
        status: 'read',
      },
      {
        id: 6,
        text: 'Thank you! Should I continue with the current medication?',
        timestamp: new Date(Date.now() - 35 * 60 * 1000),
        sender: 'user',
        type: 'text',
        status: 'delivered',
      },
      {
        id: 7,
        text: '',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        sender: 'doctor',
        type: 'prescription',
        status: 'read',
        attachment: {
          type: 'prescription',
          medication: 'Atorvastatin 20mg',
          dosage: 'Once daily',
          duration: '3 months',
          refills: 2,
        },
      },
      {
        id: 8,
        text: 'Yes, continue with the same dosage. I\'ve sent an updated prescription. Let\'s schedule a follow-up in 3 months.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        sender: 'doctor',
        type: 'text',
        status: 'read',
      },
    ],
  },
  quickReplies: [
    'Thank you, Doctor',
    'I have a question',
    'Can we schedule an appointment?',
    'I\'m feeling better',
    'I have side effects',
    'When is my next visit?',
  ],
};

export default function MessagesScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [activeView, setActiveView] = useState<'conversations' | 'chat'>('conversations');
  const [selectedConversation, setSelectedConversation] = useState<typeof MESSAGES_DATA.conversations[0] | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollViewRef = useRef<FlatList>(null);
  const pulseAnimation = useSharedValue(0);
  const typingAnimation = useSharedValue(0);

  useEffect(() => {
    // Pulse animation for unread messages
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      true
    );

    // Typing indicator animation
    typingAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleConversationPress = async (conversation: typeof MESSAGES_DATA.conversations[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedConversation(conversation);
    setActiveView('chat');
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Add message to chat (in real app, this would be sent to API)
    console.log('Sending message:', messageText);
    setMessageText('');
    
    // Show typing indicator for response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickReply = async (reply: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMessageText(reply);
  };

  const handleAttachmentAction = async (type: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    switch (type) {
      case 'photo':
        Alert.alert('Share Photo', 'Camera and photo library access will be requested.');
        break;
      case 'document':
        Alert.alert('Share Document', 'Document picker will be opened.');
        break;
      case 'audio':
        Alert.alert('Voice Message', 'Audio recording will start.');
        break;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const getConversationIcon = (type: string) => {
    switch (type) {
      case 'doctor':
        return 'medical_services';
      case 'support':
        return 'support_agent';
      case 'pharmacy':
        return 'medication';
      default:
        return 'chat';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return MedicalColors.success[600];
      case 'away':
        return MedicalColors.warning[500];
      case 'offline':
        return MedicalColors.neutral[400];
      default:
        return MedicalColors.neutral[400];
    }
  };

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      pulseAnimation.value,
      [0, 1],
      [0.6, 1],
      Extrapolate.CLAMP
    ),
  }));

  const typingStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      typingAnimation.value,
      [0, 1],
      [0.3, 1],
      Extrapolate.CLAMP
    ),
  }));

  const renderConversationsList = () => (
    <Animated.View
      style={styles.conversationsContainer}
      entering={FadeInUp.duration(800).delay(100)}
    >
      <View style={styles.conversationsHeader}>
        <Text style={styles.screenTitle}>Messages</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert('Search', 'Search conversations feature.');
            }}
          >
            <IconSymbol name="search" size={20} color={MedicalColors.neutral[600]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert('New Message', 'Start a new conversation.');
            }}
          >
            <IconSymbol name="edit" size={20} color={MedicalColors.primary[600]} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.conversationsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Actions */}
      <Animated.View 
          style={styles.quickActions}
          entering={FadeInDown.duration(600).delay(200)}
        >
          <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert('Emergency', 'Connect with emergency services.');
            }}
          >
            <LinearGradient
              colors={[MedicalColors.error[600], MedicalColors.error[700]]}
              style={styles.quickActionGradient}
            >
              <IconSymbol name="emergency" size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.quickActionLabel}>Emergency</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert('Health AI', 'Chat with health AI assistant.');
            }}
          >
            <LinearGradient
              colors={[MedicalColors.primary[600], MedicalColors.primary[700]]}
              style={styles.quickActionGradient}
            >
              <IconSymbol name="smart_toy" size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.quickActionLabel}>Health AI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert('Pharmacy', 'Contact your pharmacy.');
            }}
          >
            <LinearGradient
              colors={[MedicalColors.info[600], MedicalColors.info[700]]}
              style={styles.quickActionGradient}
            >
              <IconSymbol name="medication" size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.quickActionLabel}>Pharmacy</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Conversations List */}
        <View style={styles.conversationsListContent}>
          {MESSAGES_DATA.conversations.map((conversation, index) => (
            <Animated.View
              key={conversation.id}
              entering={SlideInDown.duration(600).delay(300 + index * 100)}
            >
              <TouchableOpacity
                style={styles.conversationItem}
                onPress={() => handleConversationPress(conversation)}
                activeOpacity={0.7}
              >
                <Card variant="outlined" style={styles.conversationCard}>
                  <View style={styles.conversationContent}>
                    <View style={styles.conversationLeft}>
                      <View style={styles.participantAvatar}>
                        <IconSymbol
                          name={getConversationIcon(conversation.type)}
                          size={40}
                          color={MedicalColors.primary[500]}
                        />
                        <View style={[
                          styles.statusIndicator,
                          { backgroundColor: getStatusColor(conversation.participant.status) }
                        ]} />
                        {conversation.participant.verified && (
                          <View style={styles.verifiedIndicator}>
                            <IconSymbol name="verified" size={12} color={MedicalColors.success[600]} />
                  </View>
                        )}
                      </View>

                      <View style={styles.conversationInfo}>
                        <View style={styles.conversationHeader}>
                          <Text style={styles.participantName}>
                            {conversation.participant.name}
                          </Text>
                          {conversation.unreadCount > 0 && (
                            <Animated.View style={[styles.unreadBadge, pulseStyle]}>
                              <Text style={styles.unreadCount}>
                                {conversation.unreadCount}
                              </Text>
                            </Animated.View>
                          )}
                        </View>

                        <Text style={styles.participantSpecialty}>
                          {conversation.participant.specialty} • {conversation.participant.hospital}
                        </Text>

                        <View style={styles.lastMessageContainer}>
                          <Text
                            style={[
                              styles.lastMessageText,
                              conversation.unreadCount > 0 && styles.unreadMessageText
                            ]}
                            numberOfLines={2}
                          >
                            {conversation.lastMessage.type === 'system' ? '📋 ' : ''}
                            {conversation.lastMessage.type === 'notification' ? '🔔 ' : ''}
                            {conversation.lastMessage.text}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.conversationRight}>
                      <Text style={styles.messageTimestamp}>
                        {formatTimestamp(conversation.lastMessage.timestamp)}
                      </Text>

                      {conversation.appointmentContext?.upcoming && (
                        <View style={styles.appointmentIndicator}>
                          <IconSymbol name="schedule" size={12} color={MedicalColors.warning[600]} />
                          <Text style={styles.appointmentText}>
                            {new Date(conversation.appointmentContext.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </Text>
                        </View>
                      )}

                      <IconSymbol name="chevron_right" size={16} color={MedicalColors.neutral[400]} />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
      </Animated.View>
    );

  const renderMessage = ({ item, index }: { item: typeof MESSAGES_DATA.currentChat.messages[0], index: number }) => {
    const isUser = item.sender === 'user';
    const isLastMessage = index === MESSAGES_DATA.currentChat.messages.length - 1;

  return (
      <Animated.View 
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.doctorMessageContainer,
        ]}
        entering={FadeInUp.duration(400).delay(index * 50)}
      >
        {!isUser && (
          <View style={styles.messageAvatar}>
            <IconSymbol name="account_circle" size={32} color={MedicalColors.primary[500]} />
          </View>
        )}

        <View style={styles.messageBubbleContainer}>
          {item.type === 'text' && (
            <View style={[
              styles.messageBubble,
              isUser ? styles.userMessageBubble : styles.doctorMessageBubble,
            ]}>
              <Text style={[
                styles.messageText,
                isUser ? styles.userMessageText : styles.doctorMessageText,
              ]}>
                {item.text}
              </Text>
            </View>
          )}

          {item.type === 'lab_results' && item.attachment && (
            <View style={styles.attachmentBubble}>
        <LinearGradient
                colors={[MedicalColors.info[50], MedicalColors.info[100]]}
                style={styles.attachmentGradient}
              >
                <View style={styles.attachmentHeader}>
                  <IconSymbol name="science" size={24} color={MedicalColors.info[600]} />
                  <Text style={styles.attachmentTitle}>{item.attachment.title}</Text>
                </View>
                <Text style={styles.attachmentDate}>Date: {item.attachment.date}</Text>
                <View style={styles.attachmentStatus}>
                  <Text style={[
                    styles.attachmentStatusText,
                    { color: MedicalColors.success[600] }
                  ]}>
                    Status: {item.attachment.status}
                  </Text>
                </View>
                <Text style={styles.attachmentDetails}>{item.attachment.details}</Text>
                
                <TouchableOpacity
                  style={styles.attachmentAction}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert('Lab Results', 'View detailed lab results.');
                  }}
                >
                  <Text style={styles.attachmentActionText}>View Details</Text>
                  <IconSymbol name="arrow_forward" size={16} color={MedicalColors.info[600]} />
                </TouchableOpacity>
        </LinearGradient>
            </View>
          )}

          {item.type === 'prescription' && item.attachment && (
            <View style={styles.attachmentBubble}>
              <LinearGradient
                colors={[MedicalColors.success[50], MedicalColors.success[100]]}
                style={styles.attachmentGradient}
              >
                <View style={styles.attachmentHeader}>
                  <IconSymbol name="medication" size={24} color={MedicalColors.success[600]} />
                  <Text style={styles.attachmentTitle}>Prescription</Text>
                </View>
                <Text style={styles.prescriptionMedication}>{item.attachment.medication}</Text>
                <Text style={styles.prescriptionDosage}>Dosage: {item.attachment.dosage}</Text>
                <Text style={styles.prescriptionDuration}>Duration: {item.attachment.duration}</Text>
                <Text style={styles.prescriptionRefills}>Refills: {item.attachment.refills}</Text>
                
                <TouchableOpacity
                  style={styles.attachmentAction}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert('Prescription', 'Send to pharmacy or view details.');
                  }}
                >
                  <Text style={styles.attachmentActionText}>Send to Pharmacy</Text>
                  <IconSymbol name="arrow_forward" size={16} color={MedicalColors.success[600]} />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}

          <View style={styles.messageFooter}>
            <Text style={styles.messageTimestamp}>
              {formatTimestamp(item.timestamp)}
            </Text>
            {isUser && (
              <IconSymbol
                name={item.status === 'read' ? 'done_all' : 'done'}
                size={12}
                color={item.status === 'read' ? MedicalColors.primary[600] : MedicalColors.neutral[400]}
              />
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderChatView = () => (
    <KeyboardAvoidingView 
      style={styles.chatContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Chat Header */}
      <Animated.View
        style={styles.chatHeader}
        entering={FadeInDown.duration(600).delay(100)}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            setActiveView('conversations');
            setSelectedConversation(null);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <IconSymbol name="arrow_back" size={24} color={MedicalColors.neutral[600]} />
        </TouchableOpacity>

        {selectedConversation && (
          <View style={styles.chatHeaderInfo}>
            <View style={styles.chatParticipantAvatar}>
              <IconSymbol
                name={getConversationIcon(selectedConversation.type)}
                size={32}
                color={MedicalColors.primary[500]}
              />
              <View style={[
                styles.chatStatusIndicator,
                { backgroundColor: getStatusColor(selectedConversation.participant.status) }
              ]} />
            </View>

            <View style={styles.chatParticipantInfo}>
              <Text style={styles.chatParticipantName}>
                {selectedConversation.participant.name}
              </Text>
              <Text style={styles.chatParticipantStatus}>
                {selectedConversation.participant.status} • {selectedConversation.participant.specialty}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.chatHeaderActions}>
          <TouchableOpacity
            style={styles.chatHeaderButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert('Video Call', 'Start video consultation.');
            }}
          >
            <IconSymbol name="videocam" size={20} color={MedicalColors.primary[600]} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.chatHeaderButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert('Menu', 'Chat options and settings.');
            }}
          >
            <IconSymbol name="more_vert" size={20} color={MedicalColors.neutral[600]} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Messages List */}
      <FlatList
        ref={scrollViewRef}
        data={MESSAGES_DATA.currentChat.messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <Animated.View style={[styles.typingIndicator, typingStyle]}>
          <View style={styles.typingBubble}>
            <View style={styles.typingDots}>
              <View style={[styles.typingDot, { animationDelay: '0ms' }]} />
              <View style={[styles.typingDot, { animationDelay: '160ms' }]} />
              <View style={[styles.typingDot, { animationDelay: '320ms' }]} />
            </View>
          </View>
        </Animated.View>
      )}

      {/* Quick Replies */}
      <Animated.View
        style={styles.quickRepliesContainer}
        entering={FadeInUp.duration(600).delay(400)}
      >
      <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRepliesContent}
        >
          {MESSAGES_DATA.quickReplies.map((reply, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickReplyButton}
              onPress={() => handleQuickReply(reply)}
            >
              <Text style={styles.quickReplyText}>{reply}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
      </Animated.View>

      {/* Message Input */}
      <Animated.View 
        style={styles.messageInputContainer}
        entering={FadeInUp.duration(600).delay(500)}
      >
        <View style={styles.messageInputRow}>
          <TouchableOpacity
            style={styles.attachmentButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert(
                'Share Content',
                'What would you like to share?',
                [
                  { text: 'Photo', onPress: () => handleAttachmentAction('photo') },
                  { text: 'Document', onPress: () => handleAttachmentAction('document') },
                  { text: 'Voice Message', onPress: () => handleAttachmentAction('audio') },
                  { text: 'Cancel', style: 'cancel' },
                ]
              );
            }}
          >
            <IconSymbol name="attach_file" size={20} color={MedicalColors.neutral[600]} />
          </TouchableOpacity>

          <TextInput
            style={styles.messageInput}
            placeholder="Type your message..."
            placeholderTextColor={MedicalColors.neutral[400]}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              messageText.trim() ? styles.sendButtonActive : styles.sendButtonInactive,
            ]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <IconSymbol
              name="send"
              size={20}
              color={messageText.trim() ? '#FFFFFF' : MedicalColors.neutral[400]}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {activeView === 'conversations' ? renderConversationsList() : renderChatView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Conversations View
  conversationsContainer: {
    flex: 1,
  },
  conversationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: MedicalColors.neutral[200],
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: MedicalColors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },

  conversationsList: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  quickActionItem: {
    alignItems: 'center',
    gap: 8,
  },
  quickActionGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: MedicalColors.neutral[600],
  },

  // Conversations List
  conversationsListContent: {
    padding: 20,
    gap: 12,
  },
  conversationItem: {
    width: '100%',
  },
  conversationCard: {
    padding: 16,
  },
  conversationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  participantAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  verifiedIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 1,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: MedicalColors.primary[600],
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  participantSpecialty: {
    fontSize: 12,
    color: MedicalColors.neutral[600],
    marginBottom: 6,
  },
  lastMessageContainer: {
    flex: 1,
  },
  lastMessageText: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    lineHeight: 18,
  },
  unreadMessageText: {
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  conversationRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  messageTimestamp: {
    fontSize: 12,
    color: MedicalColors.neutral[500],
    marginBottom: 4,
  },
  appointmentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: `${MedicalColors.warning[600]}15`,
    borderRadius: 8,
    gap: 4,
    marginBottom: 4,
  },
  appointmentText: {
    fontSize: 10,
    fontWeight: '600',
    color: MedicalColors.warning[600],
  },

  // Chat View
  chatContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: MedicalColors.neutral[200],
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MedicalColors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chatHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatParticipantAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  chatStatusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatParticipantInfo: {
    flex: 1,
  },
  chatParticipantName: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  chatParticipantStatus: {
    fontSize: 12,
    color: MedicalColors.neutral[600],
  },
  chatHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  chatHeaderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MedicalColors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Messages
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 100,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  doctorMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    marginRight: 8,
    marginBottom: 4,
  },
  messageBubbleContainer: {
    maxWidth: '75%',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 4,
  },
  userMessageBubble: {
    backgroundColor: MedicalColors.primary[600],
    borderBottomRightRadius: 4,
  },
  doctorMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  doctorMessageText: {
    color: MedicalColors.neutral[900],
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'flex-end',
  },

  // Attachments
  attachmentBubble: {
    marginBottom: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  attachmentGradient: {
    padding: 16,
  },
  attachmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  attachmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  attachmentDate: {
    fontSize: 12,
    color: MedicalColors.neutral[600],
    marginBottom: 4,
  },
  attachmentStatus: {
    marginBottom: 8,
  },
  attachmentStatusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  attachmentDetails: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
    marginBottom: 12,
  },
  prescriptionMedication: {
    fontSize: 16,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginBottom: 6,
  },
  prescriptionDosage: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
    marginBottom: 2,
  },
  prescriptionDuration: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
    marginBottom: 2,
  },
  prescriptionRefills: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
    marginBottom: 12,
  },
  attachmentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 8,
  },
  attachmentActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: MedicalColors.primary[600],
  },

  // Typing Indicator
  typingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: MedicalColors.neutral[400],
  },

  // Quick Replies
  quickRepliesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quickRepliesContent: {
    gap: 8,
  },
  quickReplyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
  },
  quickReplyText: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
    fontWeight: '500',
  },

  // Message Input
  messageInputContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: MedicalColors.neutral[200],
  },
  messageInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  attachmentButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: MedicalColors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 14,
    color: MedicalColors.neutral[900],
    backgroundColor: '#FFFFFF',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: MedicalColors.primary[600],
  },
  sendButtonInactive: {
    backgroundColor: MedicalColors.neutral[200],
  },
}); 