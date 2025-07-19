import {
    Body,
    Button,
    Caption,
    Card,
    DiagnosisText,
    ErrorText,
    IconSymbol,
    Input,
    Label,
    MedicalLabel,
    SuccessText,
    Title,
    Typography,
    WarningText
} from '@/components/ui';
import {
    MedicalColors,
    MedicalGradients,
    Spacing
} from '@/constants/Colors';
import { useResponsiveDesign, useResponsiveStyles } from '@/hooks/useResponsiveDesign';
import { useTheme, useThemeColors } from '@/hooks/useThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';

export const DesignSystemShowcase: React.FC = () => {
  const theme = useTheme();
  const colors = useThemeColors();
  const responsive = useResponsiveDesign();
  const responsiveStyles = useResponsiveStyles();
  
  const [inputValue, setInputValue] = useState('');
  const [switchValue, setSwitchValue] = useState(false);

  const renderColorPalette = () => (
    <Card padding="large" style={styles.section}>
      <Title style={{ color: colors.text }}>Color Palette</Title>
      <Caption style={{ color: colors.textSecondary, marginBottom: Spacing.md }}>
        Medical App Design System - Exact JSON Specifications
      </Caption>
      
      <View style={styles.colorGrid}>
        {/* Primary Colors */}
        <View style={styles.colorSection}>
          <Label style={{ color: colors.text }}>Primary (#007BFF)</Label>
          <View style={styles.colorRow}>
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <View
                key={shade}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: MedicalColors.primary[shade] }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Secondary Colors */}
        <View style={styles.colorSection}>
          <Label style={{ color: colors.text }}>Secondary (#6C757D)</Label>
          <View style={styles.colorRow}>
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <View
                key={shade}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: MedicalColors.secondary[shade] }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Accent Colors */}
        <View style={styles.colorSection}>
          <Label style={{ color: colors.text }}>Accent (#17A2B8)</Label>
          <View style={styles.colorRow}>
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <View
                key={shade}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: MedicalColors.accent[shade] }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Semantic Colors */}
        <View style={styles.colorSection}>
          <Label style={{ color: colors.text }}>Semantic Colors</Label>
          <View style={styles.colorRow}>
            <View style={[styles.colorSwatch, { backgroundColor: MedicalColors.success[500] }]} />
            <View style={[styles.colorSwatch, { backgroundColor: MedicalColors.warning[500] }]} />
            <View style={[styles.colorSwatch, { backgroundColor: MedicalColors.error[500] }]} />
            <View style={[styles.colorSwatch, { backgroundColor: MedicalColors.info[500] }]} />
          </View>
        </View>
      </View>
    </Card>
  );

  const renderTypography = () => (
    <Card padding="large" style={styles.section}>
      <Title style={{ color: colors.text }}>Typography System</Title>
      <Caption style={{ color: colors.textSecondary, marginBottom: Spacing.md }}>
        Roboto font family with standardized sizes and weights
      </Caption>
      
      <View style={styles.typographySection}>
        <Typography variant="largeTitle" weight="bold" style={{ color: colors.text }}>
          Large Title (32px, Bold)
        </Typography>
        <Typography variant="title" weight="bold" style={{ color: colors.text }}>
          Title (28px, Bold)
        </Typography>
        <Typography variant="heading" weight="semibold" style={{ color: colors.text }}>
          Heading (24px, Semibold)
        </Typography>
        <Typography variant="subheading" weight="medium" style={{ color: colors.text }}>
          Subheading (18px, Medium)
        </Typography>
        <Typography variant="body" style={{ color: colors.text }}>
          Body Text (16px, Regular) - This is the primary text size for content.
        </Typography>
        <Typography variant="caption" style={{ color: colors.textSecondary }}>
          Caption (14px, Regular) - Used for secondary information
        </Typography>
        <Typography variant="small" style={{ color: colors.textSecondary }}>
          Small Text (12px, Regular) - Used for fine print
        </Typography>
      </View>

      {/* Medical-specific typography */}
      <View style={styles.typographySection}>
        <Label style={{ color: colors.text }}>Medical Typography Components</Label>
        <MedicalLabel>Medical Label Component</MedicalLabel>
        <DiagnosisText>Diagnosis: Hypertension (Primary)</DiagnosisText>
        <SuccessText>✓ Normal blood pressure reading</SuccessText>
        <WarningText>⚠ Elevated heart rate detected</WarningText>
        <ErrorText>✗ Critical value - immediate attention required</ErrorText>
      </View>
    </Card>
  );

  const renderComponents = () => (
    <Card padding="large" style={styles.section}>
      <Title style={{ color: colors.text }}>UI Components</Title>
      <Caption style={{ color: colors.textSecondary, marginBottom: Spacing.md }}>
        Design system components with exact specifications
      </Caption>
      
      {/* Buttons */}
      <View style={styles.componentSection}>
        <Label style={{ color: colors.text }}>Buttons (4px border radius, 48px height)</Label>
        <View style={styles.buttonRow}>
          <Button
            title="Primary"
            onPress={() => {}}
            variant="primary"
            size="medium"
            icon="heart.fill"
            iconPosition="left"
          />
          <Button
            title="Secondary"
            onPress={() => {}}
            variant="secondary"
            size="medium"
          />
          <Button
            title="Outline"
            onPress={() => {}}
            variant="outline"
            size="medium"
          />
        </View>
        
        <View style={styles.buttonRow}>
          <Button
            title="Small"
            onPress={() => {}}
            variant="primary"
            size="small"
          />
          <Button
            title="Medium"
            onPress={() => {}}
            variant="primary"
            size="medium"
          />
          <Button
            title="Large"
            onPress={() => {}}
            variant="primary"
            size="large"
          />
        </View>
      </View>

      {/* Cards */}
      <View style={styles.componentSection}>
        <Label style={{ color: colors.text }}>Cards (8px border radius, shadow: 0 2px 4px rgba(0,0,0,0.1))</Label>
        <View style={styles.cardRow}>
          <Card variant="default" padding="medium" style={styles.sampleCard}>
            <Body style={{ color: colors.text }}>Default Card</Body>
          </Card>
          <Card variant="outlined" padding="medium" style={styles.sampleCard}>
            <Body style={{ color: colors.text }}>Outlined Card</Body>
          </Card>
        </View>
        
        <View style={styles.cardRow}>
          <Card variant="health" padding="medium" style={styles.sampleCard}>
            <Body>Health Card</Body>
          </Card>
          <Card variant="warning" padding="medium" style={styles.sampleCard}>
            <Body>Warning Card</Body>
          </Card>
        </View>
      </View>

      {/* Inputs */}
      <View style={styles.componentSection}>
        <Label style={{ color: colors.text }}>Input Components</Label>
        <Input
          label="Standard Input"
          placeholder="Enter your text here..."
          value={inputValue}
          onChangeText={setInputValue}
          leftIcon="person.fill"
        />
        <Input
          label="Password Input"
          placeholder="Enter password..."
          secureTextEntry
        />
        <Input
          label="Input with Error"
          placeholder="This has an error..."
          error="This field is required"
        />
      </View>
    </Card>
  );

  const renderSpacingSystem = () => (
    <Card padding="large" style={styles.section}>
      <Title style={{ color: colors.text }}>Spacing System</Title>
      <Caption style={{ color: colors.textSecondary, marginBottom: Spacing.md }}>
        8px base unit modular scale
      </Caption>
      
      <View style={styles.spacingDemo}>
        {Object.entries(Spacing).map(([key, value]) => (
          <View key={key} style={styles.spacingItem}>
            <Body style={{ color: colors.text }}>{key.toUpperCase()}: {value}px</Body>
            <View style={[styles.spacingBar, { width: value * 2, backgroundColor: colors.primary }]} />
          </View>
        ))}
      </View>
    </Card>
  );

  const renderAccessibilityFeatures = () => (
    <Card padding="large" style={styles.section}>
      <Title style={{ color: colors.text }}>Accessibility Features</Title>
      <Caption style={{ color: colors.textSecondary, marginBottom: Spacing.md }}>
        High contrast, scalable text, and screen reader support
      </Caption>
      
      <View style={styles.accessibilitySection}>
        <View style={styles.themeToggle}>
          <Label style={{ color: colors.text }}>Theme Mode</Label>
          <View style={styles.toggleRow}>
            <Button
              title="Light"
              onPress={() => theme.setThemeMode('light')}
              variant={theme.themeMode === 'light' ? 'primary' : 'outline'}
              size="small"
            />
            <Button
              title="Dark"
              onPress={() => theme.setThemeMode('dark')}
              variant={theme.themeMode === 'dark' ? 'primary' : 'outline'}
              size="small"
            />
            <Button
              title="Auto"
              onPress={() => theme.setThemeMode('auto')}
              variant={theme.themeMode === 'auto' ? 'primary' : 'outline'}
              size="small"
            />
          </View>
        </View>

        <View style={styles.themeToggle}>
          <Label style={{ color: colors.text }}>Accessibility Mode</Label>
          <View style={styles.toggleRow}>
            <Button
              title="Default"
              onPress={() => theme.setAccessibilityMode('default')}
              variant={theme.accessibilityMode === 'default' ? 'primary' : 'outline'}
              size="small"
            />
            <Button
              title="High Contrast"
              onPress={() => theme.setAccessibilityMode('highContrast')}
              variant={theme.accessibilityMode === 'highContrast' ? 'primary' : 'outline'}
              size="small"
            />
            <Button
              title="Low Vision"
              onPress={() => theme.setAccessibilityMode('lowVision')}
              variant={theme.accessibilityMode === 'lowVision' ? 'primary' : 'outline'}
              size="small"
            />
          </View>
        </View>
      </View>
    </Card>
  );

  const renderResponsiveDesign = () => (
    <Card padding="large" style={styles.section}>
      <Title style={{ color: colors.text }}>Responsive Design</Title>
      <Caption style={{ color: colors.textSecondary, marginBottom: Spacing.md }}>
        Current device: {responsive.deviceType} ({responsive.width}x{responsive.height})
      </Caption>
      
      <View style={styles.responsiveDemo}>
        <Body style={{ color: colors.text }}>Device Type: {responsive.deviceType}</Body>
        <Body style={{ color: colors.text }}>Orientation: {responsive.orientation}</Body>
        <Body style={{ color: colors.text }}>Container Padding: {responsive.containerPadding}px</Body>
        <Body style={{ color: colors.text }}>Gutter Width: {responsive.gutterWidth}px</Body>
        
        <View style={[responsiveStyles.container, { backgroundColor: colors.surface, marginTop: Spacing.md, paddingVertical: Spacing.md }]}>
          <Body style={{ color: colors.text, textAlign: 'center' }}>
            Responsive Container (max-width: {responsive.maxContainerWidth}px)
          </Body>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={responsiveStyles.container}>
          <View style={styles.header}>
            <LinearGradient
                              colors={MedicalGradients?.primary || ['#007BFF', '#0056D3']}
              style={styles.headerGradient}
            >
              <IconSymbol name="paintbrush.fill" size={32} color="#FFFFFF" />
            </LinearGradient>
            <Title style={{ color: colors.text }}>Medical App Design System</Title>
            <Caption style={{ color: colors.textSecondary }}>
              JSON Profile Implementation Showcase
            </Caption>
          </View>

          {renderColorPalette()}
          {renderTypography()}
          {renderComponents()}
          {renderSpacingSystem()}
          {renderAccessibilityFeatures()}
          {renderResponsiveDesign()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  headerGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  colorGrid: {
    gap: Spacing.md,
  },
  colorSection: {
    marginBottom: Spacing.md,
  },
  colorRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  typographySection: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  componentSection: {
    marginBottom: Spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    flexWrap: 'wrap',
  },
  cardRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  sampleCard: {
    flex: 1,
    minHeight: 60,
    justifyContent: 'center',
  },
  spacingDemo: {
    gap: Spacing.sm,
  },
  spacingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  spacingBar: {
    height: 8,
    borderRadius: 4,
  },
  accessibilitySection: {
    gap: Spacing.lg,
  },
  themeToggle: {
    gap: Spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  responsiveDemo: {
    gap: Spacing.sm,
  },
}); 