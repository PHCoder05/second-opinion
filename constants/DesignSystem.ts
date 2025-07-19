/**
 * Medical App Design System - Complete Implementation
 * Based on JSON Design System Profile specifications
 * Version 1.0 - Exact replication of design specifications
 */

// Design System Tokens - Exact JSON Implementation
export const DesignSystemTokens = {
  name: "MedicalAppUI",
  version: "1.0",
  description: "A JSON-based design system for replicating consistent medical app interfaces, focusing on doctor appointment and telehealth features.",
  
  // Color Palette - Exact JSON Specifications
  colorPalette: {
    primary: "#007BFF",
    secondary: "#6C757D",
    accent: "#17A2B8",
    background: "#F8F9FA",
    text: "#212529",
    success: "#28A745",
    warning: "#FFC107",
    error: "#DC3545",
    neutral: {
      light: "#FFFFFF",
      dark: "#343A40"
    },
    guidelines: "Use calming blues and greens for trust and health themes. Ensure high contrast (e.g., text on background > 4.5:1 ratio) for accessibility."
  },

  // Typography - Exact JSON Specifications
  typography: {
    fonts: {
      primary: "Roboto",
      secondary: "Helvetica",
      sizes: {
        heading: 24,
        subheading: 18,
        body: 16,
        caption: 14,
        small: 12
      },
      weights: {
        regular: 400,
        bold: 700
      }
    },
    guidelines: "Prioritize sans-serif fonts for readability. Use larger sizes for elderly users or low-vision accessibility. Line height: 1.5 for body text."
  },

  // Spacing - Exact JSON Specifications (8px base modular scale)
  spacing: {
    units: "8px base (modular scale)",
    margins: {
      small: 8,
      medium: 16,
      large: 24
    },
    paddings: {
      card: 16,
      button: "12px 24px"
    },
    guidelines: "Follow a consistent grid system (e.g., 8px grid) for alignment. Ensure touch targets are at least 48x48px for mobile usability."
  },

  // Themes - Light and Dark Mode Support
  themes: {
    light: {
      background: "#FFFFFF",
      text: "#000000"
    },
    dark: {
      background: "#121212",
      text: "#FFFFFF"
    },
    guidelines: "Support dark mode for low-light environments. Auto-switch based on device settings."
  }
};

// Screen Structure Layouts - Exact JSON Implementation
export const ScreenLayouts = {
  screenTypes: [
    {
      type: "HomeScreen",
      components: ["Header", "SearchBar", "CardList", "NavigationBar"],
      layout: "Vertical stack with top header, central content, bottom navigation."
    },
    {
      type: "ProfileScreen", 
      components: ["Avatar", "InfoSection", "ButtonGroup", "ScheduleCalendar"],
      layout: "Top profile image, middle details, bottom actions."
    },
    {
      type: "AppointmentScreen",
      components: ["Calendar", "TimeSlots", "VideoCallInterface", "ConfirmationButton"],
      layout: "Scrollable view with calendar at top, slots below, call controls centered."
    }
  ],
  gridSystem: "12-column flexible grid for responsive design across mobile devices."
};

// Reusable Components - Exact JSON Specifications
export const ComponentSpecs = {
  Card: {
    properties: {
      borderRadius: 8,
      shadow: "0 2px 4px rgba(0,0,0,0.1)",
      background: "{colorPalette.background}"
    },
    variants: ["DoctorCard", "AppointmentCard"],
    guidelines: "Use for listing items like doctors or schedules. Ensure cards are tappable with ripple feedback."
  },
  Button: {
    properties: {
      height: 48,
      borderRadius: 4,
      color: "{colorPalette.primary}",
      textColor: "#FFFFFF"
    },
    variants: ["Primary", "Secondary", "Outline"],
    guidelines: "Make buttons prominent with sufficient padding. Include icons for actions like 'Book Now'."
  },
  NavigationBar: {
    properties: {
      position: "Bottom",
      items: 4,
      icons: true
    },
    guidelines: "Limit to 5 tabs max. Use intuitive icons (e.g., home, profile) for quick access."
  }
};

// Accessibility Features - Exact JSON Specifications
export const AccessibilityFeatures = {
  features: [
    "VoiceOver support",
    "High contrast modes", 
    "Scalable text",
    "Alt text for images"
  ],
  guidelines: "Design for diverse users: large touch targets, color-blind friendly palettes, and screen reader compatibility."
};

// Responsive Design - Exact JSON Specifications
export const ResponsiveDesign = {
  breakpoints: {
    mobile: "320px-480px",
    tablet: "481px-768px"
  },
  guidelines: "Adapt layouts for different screen sizes. Use fluid grids and media queries."
};

// Design Tokens Export for Cross-Platform Usage
export const DesignTokens = {
  colors: {
    primary: {
      50: '#E3F2FD',
      100: '#BBDEFB', 
      200: '#90CAF9',
      300: '#64B5F6',
      400: '#42A5F5',
      500: '#007BFF', // Main primary color from JSON
      600: '#0056D3',
      700: '#0043AA',
      800: '#003281',
      900: '#002658',
    },
    secondary: {
      50: '#F8F9FA', // Background from JSON
      100: '#E9ECEF',
      200: '#DEE2E6', 
      300: '#CED4DA',
      400: '#ADB5BD',
      500: '#6C757D', // Main secondary color from JSON
      600: '#495057',
      700: '#343A40', // Neutral dark from JSON
      800: '#212529', // Main text color from JSON
      900: '#121212',
    },
    accent: {
      50: '#E0F7FA',
      100: '#B2EBF2',
      200: '#80DEEA',
      300: '#4DD0E1', 
      400: '#26C6DA',
      500: '#17A2B8', // Main accent color from JSON
      600: '#00ACC1',
      700: '#0097A7',
      800: '#00838F',
      900: '#006064',
    },
    success: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#28A745', // Success color from JSON
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
    },
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#FFC107', // Warning color from JSON
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },
    error: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#DC3545', // Error color from JSON
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    },
    neutral: {
      light: '#FFFFFF', // Exact from JSON
      dark: '#343A40', // Exact from JSON
      50: '#F8F9FA',
      100: '#E9ECEF',
      200: '#DEE2E6',
      300: '#CED4DA',
      400: '#ADB5BD',
      500: '#6C757D',
      600: '#495057',
      700: '#343A40',
      800: '#212529',
      900: '#121212',
    }
  },
  typography: {
    fontFamily: {
      primary: 'Roboto', // Exact from JSON
      secondary: 'Helvetica', // Exact from JSON
      system: 'System'
    },
    fontSize: {
      small: 12, // Exact from JSON
      caption: 14, // Exact from JSON  
      body: 16, // Exact from JSON
      subheading: 18, // Exact from JSON
      heading: 24, // Exact from JSON
      title: 28,
      largeTitle: 32
    },
    fontWeight: {
      regular: '400', // Exact from JSON
      medium: '500',
      semibold: '600', 
      bold: '700' // Exact from JSON
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5, // Exact from JSON specification
      loose: 1.8
    }
  },
  spacing: {
    // 8px base modular scale - Exact from JSON
    xs: 4,
    sm: 8, // Small margin from JSON
    md: 16, // Medium margin & card padding from JSON
    lg: 24, // Large margin from JSON
    xl: 32,
    xxl: 48,
    
    // Button padding specification from JSON: "12px 24px"
    buttonPadding: {
      vertical: 12,
      horizontal: 24
    }
  },
  borderRadius: {
    sm: 4, // Button border radius from JSON
    md: 8, // Card border radius from JSON
    lg: 12,
    xl: 16,
    full: 9999
  },
  shadows: {
    // Card shadow specification from JSON: "0 2px 4px rgba(0,0,0,0.1)"
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    elevated: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6
    }
  }
};

// Medical Context Specific Tokens
export const MedicalTokens = {
  gradients: {
    primary: ['#007BFF', '#0056D3'],
    secondary: ['#6C757D', '#495057'],
    accent: ['#17A2B8', '#00ACC1'],
    success: ['#28A745', '#16A34A'],
    warning: ['#FFC107', '#D97706'],
    error: ['#DC3545', '#DC2626'],
    health: ['#28A745', '#17A2B8'],
    background: ['#F8F9FA', '#E9ECEF'],
    card: ['#FFFFFF', '#F8F9FA'],
    calm: ['#17A2B8', '#007BFF'],
  },
  iconSizes: {
    small: 16,
    medium: 24,
    large: 32,
    xlarge: 48
  },
  touchTargets: {
    minimum: 48, // Accessibility specification from JSON
    recommended: 56
  }
};

// Theme Configuration for Light/Dark Mode
export const ThemeConfiguration = {
  light: {
    background: '#FFFFFF', // Exact from JSON
    surface: '#F8F9FA',
    text: '#000000', // Exact from JSON  
    textSecondary: '#6C757D',
    textDisabled: '#ADB5BD',
    primary: '#007BFF',
    secondary: '#6C757D', 
    accent: '#17A2B8',
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
    border: '#DEE2E6',
    divider: '#E9ECEF',
    cardBackground: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.1)'
  },
  dark: {
    background: '#121212', // Exact from JSON
    surface: '#343A40',
    text: '#FFFFFF', // Exact from JSON
    textSecondary: '#ADB5BD',
    textDisabled: '#6C757D',
    primary: '#17A2B8',
    secondary: '#6C757D',
    accent: '#007BFF', 
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
    border: '#495057',
    divider: '#343A40',
    cardBackground: '#343A40',
    cardShadow: 'rgba(0, 0, 0, 0.4)'
  }
};

// Best Practices Guidelines from JSON
export const DesignGuidelines = {
  replicationTokens: {
    description: "Use design tokens for consistency. Export to JSON for tools like Style Dictionary to generate code.",
    example: "Transform JSON tokens into CSS/SCSS or native code (e.g., Swift/Kotlin) for cross-platform replication."
  },
  responsiveDesign: {
    breakpoints: {
      mobile: "320px-480px", // Exact from JSON
      tablet: "481px-768px" // Exact from JSON
    },
    guidelines: "Adapt layouts for different screen sizes. Use fluid grids and media queries."
  },
  bestPractices: "Focus on minimalism to reduce cognitive load. Test for usability in medical contexts (e.g., quick access to scheduling). Iterate with prototypes."
};

export default DesignSystemTokens; 