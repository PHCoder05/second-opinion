import { DesignTokens } from '@/constants/DesignSystem';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

interface HomeScreenLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showNavigation?: boolean;
  scrollable?: boolean;
}

/**
 * HomeScreen Layout - Exact JSON Implementation
 * Layout: "Vertical stack with top header, central content, bottom navigation."
 * Components: ["Header", "SearchBar", "CardList", "NavigationBar"]
 */
export const HomeScreenLayout: React.FC<HomeScreenLayoutProps> = ({
  children,
  showHeader = true,
  showNavigation = true,
  scrollable = true,
}) => {
  const ContentComponent = scrollable ? ScrollView : View;
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      {showHeader && (
        <View style={styles.header}>
          {/* Header content will be passed as children or custom header component */}
        </View>
      )}
      
      {/* Central Content Area */}
      <ContentComponent 
        style={styles.content}
        contentContainerStyle={scrollable ? styles.scrollContent : undefined}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ContentComponent>
      
      {/* Bottom Navigation - handled by tab navigator */}
      {/* NavigationBar space is reserved but handled by the tab system */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Main container following 12-column flexible grid
  container: {
    flex: 1,
    backgroundColor: DesignTokens.colors.secondary[50], // Background from JSON
  },
  
  // Header section at top
  header: {
    backgroundColor: DesignTokens.colors.neutral.light,
    paddingHorizontal: DesignTokens.spacing.md, // 16px from JSON
    paddingVertical: DesignTokens.spacing.sm,   // 8px from JSON
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.secondary[200],
    // Shadow following JSON shadow specification
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Central content area - flexible and scrollable
  content: {
    flex: 1,
  },
  
  // Scroll content padding
  scrollContent: {
    paddingHorizontal: DesignTokens.spacing.md, // 16px consistent padding
    paddingVertical: DesignTokens.spacing.md,
    paddingBottom: DesignTokens.spacing.xxl, // Extra bottom padding for tab bar
  },
});

export default HomeScreenLayout; 