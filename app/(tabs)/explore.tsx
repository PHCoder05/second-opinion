import { Card, IconSymbol } from '@/components/ui';
import { MedicalColors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    Extrapolate,
    FadeInDown,
    FadeInLeft,
    FadeInRight,
    FadeInUp,
    SlideInDown,
    SlideInUp,
    ZoomIn,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

// Enhanced medical content data
const EXPLORE_DATA = {
  featuredContent: [
    {
      id: 1,
      type: 'article',
      title: 'Understanding Heart Health',
      subtitle: 'Complete guide to cardiovascular wellness',
      description: 'Learn about maintaining heart health, risk factors, and prevention strategies from leading cardiologists.',
      category: 'Cardiology',
      readTime: '8 min read',
      difficulty: 'Beginner',
      image: null,
      author: 'Dr. Michael Chen',
      publishDate: '2024-01-10',
      tags: ['heart-health', 'prevention', 'wellness'],
      rating: 4.8,
      views: 15200,
    },
    {
      id: 2,
      type: 'video',
      title: 'Diabetes Management Essentials',
      subtitle: 'Daily tips for living with diabetes',
      description: 'Comprehensive video series covering blood sugar monitoring, diet planning, and medication management.',
      category: 'Endocrinology',
      duration: '15 min',
      difficulty: 'Intermediate',
      image: null,
      author: 'Dr. Sarah Williams',
      publishDate: '2024-01-08',
      tags: ['diabetes', 'management', 'lifestyle'],
      rating: 4.9,
      views: 23100,
    },
    {
      id: 3,
      type: 'interactive',
      title: 'Mental Health Check-in',
      subtitle: 'Interactive wellness assessment',
      description: 'Take our interactive mental health assessment to understand your emotional wellbeing.',
      category: 'Mental Health',
      duration: '10 min',
      difficulty: 'Beginner',
      image: null,
      author: 'Mental Health Team',
      publishDate: '2024-01-12',
      tags: ['mental-health', 'assessment', 'wellbeing'],
      rating: 4.7,
      views: 8900,
    },
  ],
  categories: [
    {
      id: 1,
      name: 'Cardiology',
      icon: 'favorite',
      color: MedicalColors.error[600],
      count: 45,
      trending: true,
    },
    {
      id: 2,
      name: 'Mental Health',
      icon: 'psychology',
      color: MedicalColors.secondary[600],
      count: 38,
      trending: false,
    },
    {
      id: 3,
      name: 'Nutrition',
      icon: 'restaurant',
      color: MedicalColors.success[600],
      count: 52,
      trending: true,
    },
    {
      id: 4,
      name: 'Fitness',
      icon: 'fitness_center',
      color: MedicalColors.warning[600],
      count: 41,
      trending: false,
    },
    {
      id: 5,
      name: 'Preventive Care',
      icon: 'security',
      color: MedicalColors.info[600],
      count: 29,
      trending: true,
    },
    {
      id: 6,
      name: 'Women\'s Health',
      icon: 'pregnant_woman',
      color: MedicalColors.primary[600],
      count: 33,
      trending: false,
    },
  ],
  recentArticles: [
    {
      id: 4,
      title: 'Sleep Hygiene for Better Health',
      category: 'Sleep Medicine',
      readTime: '6 min read',
      author: 'Dr. Lisa Park',
      publishDate: '2024-01-13',
      rating: 4.6,
      image: null,
      summary: 'Essential tips for improving sleep quality and establishing healthy sleep patterns.',
    },
    {
      id: 5,
      title: 'Nutrition Facts: Omega-3 Fatty Acids',
      category: 'Nutrition',
      readTime: '4 min read',
      author: 'Dr. James Rodriguez',
      publishDate: '2024-01-11',
      rating: 4.8,
      image: null,
      summary: 'Understanding the benefits of omega-3s and how to incorporate them into your diet.',
    },
    {
      id: 6,
      title: 'Managing Work-Life Balance',
      category: 'Mental Health',
      readTime: '7 min read',
      author: 'Dr. Emily Johnson',
      publishDate: '2024-01-09',
      rating: 4.5,
      image: null,
      summary: 'Strategies for maintaining mental health while managing professional and personal responsibilities.',
    },
  ],
  healthTools: [
    {
      id: 1,
      name: 'BMI Calculator',
      description: 'Calculate your Body Mass Index and understand what it means for your health',
      icon: 'calculate',
      category: 'Assessment',
      color: MedicalColors.primary[600],
    },
    {
      id: 2,
      name: 'Symptom Checker',
      description: 'Get preliminary insights about your symptoms with our AI-powered tool',
      icon: 'search',
      category: 'Diagnosis',
      color: MedicalColors.info[600],
    },
    {
      id: 3,
      name: 'Medication Reminder',
      description: 'Set up reminders for your medications and track adherence',
      icon: 'alarm',
      category: 'Management',
      color: MedicalColors.success[600],
    },
    {
      id: 4,
      name: 'Health Journal',
      description: 'Track your daily health metrics, mood, and symptoms',
      icon: 'edit_note',
      category: 'Tracking',
      color: MedicalColors.warning[600],
    },
  ],
  trendingTopics: [
    { id: 1, name: 'Heart Disease Prevention', searches: '+25%' },
    { id: 2, name: 'Mental Health Awareness', searches: '+18%' },
    { id: 3, name: 'Diabetes Management', searches: '+15%' },
    { id: 4, name: 'Vaccine Information', searches: '+12%' },
    { id: 5, name: 'Sleep Disorders', searches: '+10%' },
  ],
};

export default function ExploreScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'discover' | 'categories' | 'tools'>('discover');

  const pulseAnimation = useSharedValue(0);
  const floatingAnimation = useSharedValue(0);

  useEffect(() => {
    // Pulse animation for trending content
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      true
    );

    // Floating animation for cards
    floatingAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000 }),
        withTiming(0, { duration: 3000 })
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

  const handleContentPress = async (content: typeof EXPLORE_DATA.featuredContent[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    switch (content.type) {
      case 'article':
        Alert.alert('Article', `Read "${content.title}" by ${content.author}`);
        break;
      case 'video':
        Alert.alert('Video', `Watch "${content.title}" (${content.duration})`);
        break;
      case 'interactive':
        Alert.alert('Interactive Content', `Start "${content.title}" assessment`);
        break;
    }
  };

  const handleCategoryPress = async (category: typeof EXPLORE_DATA.categories[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category.name);
    Alert.alert(category.name, `Explore ${category.count} articles in ${category.name}`);
  };

  const handleToolPress = async (tool: typeof EXPLORE_DATA.healthTools[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    switch (tool.name) {
      case 'BMI Calculator':
        router.push('/bmi-calculator');
        break;
      case 'Symptom Checker':
        router.push('/symptom-checker');
        break;
      case 'Medication Reminder':
        Alert.alert('Medication Reminder', 'Set up your medication schedule.');
        break;
      case 'Health Journal':
        Alert.alert('Health Journal', 'Start tracking your health metrics.');
        break;
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Search Results', `Searching for "${searchQuery}"`);
    setShowSearchModal(false);
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return 'article';
      case 'video':
        return 'play_circle';
      case 'interactive':
        return 'psychology';
      default:
        return 'description';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return MedicalColors.success[600];
      case 'Intermediate':
        return MedicalColors.warning[600];
      case 'Advanced':
        return MedicalColors.error[600];
      default:
        return MedicalColors.neutral[600];
    }
  };

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          pulseAnimation.value,
          [0, 1],
          [1, 1.03],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          floatingAnimation.value,
          [0, 1],
          [0, -3],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const renderTabBar = () => (
    <Animated.View 
      style={styles.tabBar}
      entering={FadeInDown.duration(800).delay(100)}
    >
      {[
        { key: 'discover', label: 'Discover', icon: 'explore' },
        { key: 'categories', label: 'Categories', icon: 'category' },
        { key: 'tools', label: 'Tools', icon: 'build' },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tabItem,
            activeTab === tab.key && styles.activeTabItem,
          ]}
          onPress={() => {
            setActiveTab(tab.key as any);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <IconSymbol
            name={tab.icon}
            size={20}
            color={activeTab === tab.key ? MedicalColors.primary[600] : MedicalColors.neutral[500]}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === tab.key && styles.activeTabLabel,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );

  const renderSearchHeader = () => (
    <Animated.View
      style={styles.searchHeader}
      entering={FadeInDown.duration(600).delay(100)}
    >
      <Text style={styles.screenTitle}>Explore Health</Text>
      
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => {
          setShowSearchModal(true);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <IconSymbol name="search" size={20} color={MedicalColors.neutral[600]} />
        <Text style={styles.searchButtonText}>Search health topics...</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderFeaturedContent = () => (
        <Animated.View 
      style={styles.featuredSection}
      entering={FadeInUp.duration(800).delay(200)}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Content</Text>
        <TouchableOpacity
          style={styles.sectionAction}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert('View All', 'Browse all featured content.');
          }}
        >
          <Text style={styles.sectionActionText}>View All</Text>
          <IconSymbol name="arrow_forward" size={16} color={MedicalColors.primary[600]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredContentScroll}
      >
        {EXPLORE_DATA.featuredContent.map((content, index) => (
          <Animated.View
            key={content.id}
            style={[styles.featuredCard, floatingStyle]}
            entering={SlideInDown.duration(600).delay(300 + index * 150)}
          >
            <TouchableOpacity
              onPress={() => handleContentPress(content)}
              activeOpacity={0.8}
            >
              <Card variant="elevated" style={styles.featuredCardInner}>
                <LinearGradient
                  colors={[MedicalColors.primary[600], MedicalColors.primary[700]]}
                  style={styles.featuredCardHeader}
                >
                  <View style={styles.featuredContentType}>
                    <IconSymbol
                      name={getContentTypeIcon(content.type)}
                      size={20}
                      color="#FFFFFF"
                    />
                    <Text style={styles.contentTypeText}>
                      {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                    </Text>
                  </View>

                  <View style={styles.featuredContentMeta}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{content.category}</Text>
                    </View>
                    
                    <View style={styles.ratingContainer}>
                      <IconSymbol name="star" size={12} color="#FFFFFF" />
                      <Text style={styles.ratingText}>{content.rating}</Text>
                    </View>
                  </View>
          </LinearGradient>

                <View style={styles.featuredCardContent}>
                  <Text style={styles.featuredTitle} numberOfLines={2}>
                    {content.title}
                  </Text>
                  <Text style={styles.featuredSubtitle} numberOfLines={1}>
                    {content.subtitle}
                  </Text>
                  <Text style={styles.featuredDescription} numberOfLines={3}>
                    {content.description}
                  </Text>

                  <View style={styles.featuredCardFooter}>
                    <View style={styles.authorInfo}>
                      <IconSymbol name="account_circle" size={16} color={MedicalColors.neutral[500]} />
                      <Text style={styles.authorText}>{content.author}</Text>
                    </View>

                    <View style={styles.contentStats}>
                      <View style={styles.statItem}>
                        <IconSymbol name="schedule" size={12} color={MedicalColors.neutral[500]} />
                        <Text style={styles.statText}>
                          {content.readTime || content.duration}
                        </Text>
                      </View>
                      
                      <View style={[
                        styles.difficultyBadge,
                        { backgroundColor: `${getDifficultyColor(content.difficulty)}15` }
                      ]}>
                        <Text style={[
                          styles.difficultyText,
                          { color: getDifficultyColor(content.difficulty) }
                        ]}>
                          {content.difficulty}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
        </Animated.View>
  );

  const renderCategories = () => (
    <Animated.View
      style={styles.categoriesSection}
      entering={FadeInLeft.duration(800).delay(400)}
    >
      <Text style={styles.sectionTitle}>Health Categories</Text>
      
      <View style={styles.categoriesGrid}>
        {EXPLORE_DATA.categories.map((category, index) => (
          <Animated.View
            key={category.id}
            style={styles.categoryCard}
            entering={ZoomIn.duration(600).delay(500 + index * 100)}
          >
            <TouchableOpacity
              onPress={() => handleCategoryPress(category)}
              activeOpacity={0.8}
            >
              <Card variant="outlined" style={styles.categoryCardInner}>
                <View style={styles.categoryContent}>
                  <View style={[
                    styles.categoryIcon,
                    { backgroundColor: `${category.color}15` }
                  ]}>
                    <IconSymbol
                      name={category.icon}
                      size={24}
                      color={category.color}
                    />
                    {category.trending && (
                      <Animated.View style={[styles.trendingIndicator, pulseStyle]}>
                        <IconSymbol name="trending_up" size={12} color={MedicalColors.warning[600]} />
                      </Animated.View>
                    )}
              </View>

                  <Text style={styles.categoryName} numberOfLines={2}>
                    {category.name}
                  </Text>
                  
                  <Text style={styles.categoryCount}>
                    {category.count} articles
                  </Text>
              </View>
              </Card>
            </TouchableOpacity>
          </Animated.View>
        ))}
            </View>
    </Animated.View>
  );

  const renderHealthTools = () => (
    <Animated.View
      style={styles.toolsSection}
      entering={FadeInRight.duration(800).delay(600)}
    >
      <Text style={styles.sectionTitle}>Health Tools</Text>
      
      <View style={styles.toolsGrid}>
        {EXPLORE_DATA.healthTools.map((tool, index) => (
          <Animated.View
            key={tool.id}
            style={styles.toolCard}
            entering={SlideInUp.duration(600).delay(700 + index * 100)}
          >
                <TouchableOpacity
              onPress={() => handleToolPress(tool)}
              activeOpacity={0.8}
            >
              <Card variant="elevated" style={styles.toolCardInner}>
                <LinearGradient
                  colors={[tool.color, `${tool.color}80`]}
                  style={styles.toolCardGradient}
                >
                  <View style={styles.toolIcon}>
                    <IconSymbol name={tool.icon} size={32} color="#FFFFFF" />
                  </View>
                </LinearGradient>

                <View style={styles.toolContent}>
                  <Text style={styles.toolName}>{tool.name}</Text>
                  <Text style={styles.toolDescription} numberOfLines={3}>
                    {tool.description}
                  </Text>
                  
                  <View style={styles.toolFooter}>
                    <Text style={styles.toolCategory}>{tool.category}</Text>
                    <IconSymbol name="arrow_forward" size={16} color={MedicalColors.primary[600]} />
                  </View>
                </View>
              </Card>
                </TouchableOpacity>
          </Animated.View>
              ))}
            </View>
    </Animated.View>
  );

  const renderRecentArticles = () => (
    <Animated.View
      style={styles.recentSection}
      entering={FadeInUp.duration(800).delay(800)}
    >
      <Text style={styles.sectionTitle}>Recent Articles</Text>
      
      <View style={styles.recentArticlesList}>
        {EXPLORE_DATA.recentArticles.map((article, index) => (
          <Animated.View
            key={article.id}
            style={styles.recentArticleCard}
            entering={FadeInLeft.duration(600).delay(900 + index * 100)}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert('Article', `Read "${article.title}"`);
              }}
              activeOpacity={0.8}
            >
              <Card variant="outlined" style={styles.recentArticleCardInner}>
                <View style={styles.recentArticleContent}>
                  <View style={styles.recentArticleHeader}>
                    <Text style={styles.recentArticleTitle} numberOfLines={2}>
                      {article.title}
                    </Text>
                    
                    <View style={styles.recentArticleRating}>
                      <IconSymbol name="star" size={12} color={MedicalColors.warning[500]} />
                      <Text style={styles.recentRatingText}>{article.rating}</Text>
                    </View>
                  </View>

                  <Text style={styles.recentArticleSummary} numberOfLines={2}>
                    {article.summary}
                  </Text>

                  <View style={styles.recentArticleFooter}>
                    <View style={styles.recentArticleMeta}>
                      <Text style={styles.recentArticleCategory}>{article.category}</Text>
                      <Text style={styles.recentArticleReadTime}>{article.readTime}</Text>
                    </View>
                    
                    <Text style={styles.recentArticleAuthor}>by {article.author}</Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  const renderTrendingTopics = () => (
    <Animated.View
      style={styles.trendingSection}
      entering={FadeInDown.duration(800).delay(1000)}
    >
      <Text style={styles.sectionTitle}>Trending Topics</Text>
      
      <View style={styles.trendingTopicsList}>
        {EXPLORE_DATA.trendingTopics.map((topic, index) => (
          <Animated.View
            key={topic.id}
            style={[styles.trendingTopicCard, pulseStyle]}
            entering={FadeInRight.duration(600).delay(1100 + index * 50)}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert('Trending Topic', `Explore "${topic.name}"`);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.trendingTopicContent}>
                <View style={styles.trendingTopicInfo}>
                  <IconSymbol name="trending_up" size={16} color={MedicalColors.warning[600]} />
                  <Text style={styles.trendingTopicName}>{topic.name}</Text>
                </View>
                
                <Text style={styles.trendingTopicSearches}>{topic.searches}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  const renderSearchModal = () => (
    <Modal
      visible={showSearchModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowSearchModal(false)}
    >
      <View style={styles.searchModalOverlay}>
        <Animated.View 
          style={styles.searchModalContent}
          entering={SlideInUp.duration(400)}
        >
          <View style={styles.searchModalHeader}>
            <Text style={styles.searchModalTitle}>Search Health Content</Text>
            <TouchableOpacity
              style={styles.searchModalClose}
              onPress={() => setShowSearchModal(false)}
            >
              <IconSymbol name="close" size={24} color={MedicalColors.neutral[600]} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchInputContainer}>
            <IconSymbol name="search" size={20} color={MedicalColors.neutral[500]} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search articles, videos, tools..."
              placeholderTextColor={MedicalColors.neutral[400]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            
            <TouchableOpacity
              style={styles.searchSubmitButton}
              onPress={handleSearch}
            >
              <Text style={styles.searchSubmitText}>Search</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchSuggestions}>
            <Text style={styles.suggestionsTitle}>Popular Searches</Text>
            <View style={styles.suggestionsList}>
              {['Heart Health', 'Diabetes', 'Mental Wellness', 'Nutrition', 'Exercise'].map((suggestion, index) => (
              <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setSearchQuery(suggestion);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {renderSearchHeader()}
      {renderTabBar()}
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'discover' && (
          <>
            {renderFeaturedContent()}
            {renderRecentArticles()}
            {renderTrendingTopics()}
          </>
        )}
        
        {activeTab === 'categories' && renderCategories()}
        {activeTab === 'tools' && renderHealthTools()}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {renderSearchModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Search Header
  searchHeader: {
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
    marginBottom: 12,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: MedicalColors.neutral[100],
    borderRadius: 12,
    gap: 12,
  },
  searchButtonText: {
    fontSize: 14,
    color: MedicalColors.neutral[500],
    flex: 1,
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: MedicalColors.neutral[200],
  },
  tabItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  activeTabItem: {
    backgroundColor: `${MedicalColors.primary[600]}10`,
  },
  tabLabel: {
    fontSize: 12,
    color: MedicalColors.neutral[500],
    fontWeight: '500',
    marginTop: 4,
  },
  activeTabLabel: {
    color: MedicalColors.primary[600],
    fontWeight: '600',
  },

  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },

  // Common Section Styles
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
  },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionActionText: {
    fontSize: 14,
    color: MedicalColors.primary[600],
    fontWeight: '600',
  },

  // Featured Content
  featuredSection: {
    marginBottom: 32,
  },
  featuredContentScroll: {
    gap: 16,
    paddingRight: 20,
  },
  featuredCard: {
    width: screenWidth * 0.8,
  },
  featuredCardInner: {
    overflow: 'hidden',
    padding: 0,
  },
  featuredCardHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredContentType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contentTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  featuredContentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  featuredCardContent: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 14,
    color: MedicalColors.primary[600],
    fontWeight: '600',
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    lineHeight: 20,
    marginBottom: 16,
  },
  featuredCardFooter: {
    gap: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorText: {
    fontSize: 12,
    color: MedicalColors.neutral[600],
    fontWeight: '500',
  },
  contentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: MedicalColors.neutral[500],
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },

  // Categories
  categoriesSection: {
    marginBottom: 32,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryCard: {
    width: (screenWidth - 52) / 2,
  },
  categoryCardInner: {
    padding: 16,
    height: 120,
  },
  categoryContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  categoryIcon: {
    position: 'relative',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  trendingIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 2,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: MedicalColors.neutral[800],
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: MedicalColors.neutral[500],
  },

  // Health Tools
  toolsSection: {
    marginBottom: 32,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toolCard: {
    width: '48%', // Use percentage for 2-column layout
    marginBottom: 12,
  },
  toolCardInner: {
    overflow: 'hidden',
    padding: 0,
  },
  toolCardGradient: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolContent: {
    padding: 16,
  },
  toolName: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    marginBottom: 6,
  },
  toolDescription: {
    fontSize: 12,
    color: MedicalColors.neutral[600],
    lineHeight: 16,
    marginBottom: 12,
  },
  toolFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolCategory: {
    fontSize: 12,
    color: MedicalColors.primary[600],
    fontWeight: '600',
  },

  // Recent Articles
  recentSection: {
    marginBottom: 32,
  },
  recentArticlesList: {
    gap: 12,
  },
  recentArticleCard: {
    width: '100%',
  },
  recentArticleCardInner: {
    padding: 16,
  },
  recentArticleContent: {
    gap: 8,
  },
  recentArticleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  recentArticleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    flex: 1,
    marginRight: 12,
  },
  recentArticleRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recentRatingText: {
    fontSize: 12,
    color: MedicalColors.neutral[600],
    fontWeight: '500',
  },
  recentArticleSummary: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    lineHeight: 18,
  },
  recentArticleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentArticleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recentArticleCategory: {
    fontSize: 12,
    color: MedicalColors.primary[600],
    fontWeight: '600',
  },
  recentArticleReadTime: {
    fontSize: 12,
    color: MedicalColors.neutral[500],
  },
  recentArticleAuthor: {
    fontSize: 12,
    color: MedicalColors.neutral[600],
    fontStyle: 'italic',
  },

  // Trending Topics
  trendingSection: {
    marginBottom: 32,
  },
  trendingTopicsList: {
    gap: 8,
  },
  trendingTopicCard: {
    width: '100%',
  },
  trendingTopicContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
  },
  trendingTopicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  trendingTopicName: {
    fontSize: 14,
    fontWeight: '600',
    color: MedicalColors.neutral[800],
  },
  trendingTopicSearches: {
    fontSize: 12,
    fontWeight: '700',
    color: MedicalColors.success[600],
  },

  // Search Modal
  searchModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  searchModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    maxHeight: '70%',
  },
  searchModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: MedicalColors.neutral[200],
  },
  searchModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
  },
  searchModalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MedicalColors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: MedicalColors.neutral[100],
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: MedicalColors.neutral[900],
  },
  searchSubmitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: MedicalColors.primary[600],
    borderRadius: 8,
  },
  searchSubmitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  searchSuggestions: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[800],
    marginBottom: 12,
  },
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: MedicalColors.neutral[100],
    borderRadius: 16,
  },
  suggestionText: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
    fontWeight: '500',
  },

  bottomSpacing: {
    height: 40,
  },
});
