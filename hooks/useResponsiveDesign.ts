import { useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

interface ResponsiveBreakpoints {
  mobile: boolean;
  tablet: boolean;
  isMobile: boolean;
  isTablet: boolean;
  screenWidth: number;
  screenHeight: number;
}

/**
 * Responsive Design Hook - Following JSON Specifications
 * Breakpoints from JSON: mobile: "320px-480px", tablet: "481px-768px" 
 * Guidelines: "Adapt layouts for different screen sizes. Use fluid grids and media queries."
 */
export const useResponsiveDesign = (): ResponsiveBreakpoints => {
  const [dimensions, setDimensions] = useState<ScaledSize>(() => Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const { width: screenWidth, height: screenHeight } = dimensions;

  // Breakpoints following exact JSON specifications
  const isMobile = screenWidth >= 320 && screenWidth <= 480;  // "320px-480px"
  const isTablet = screenWidth >= 481 && screenWidth <= 768;  // "481px-768px"

  return {
    mobile: isMobile,
    tablet: isTablet,
    isMobile,
    isTablet,
    screenWidth,
    screenHeight,
  };
};

/**
 * Hook for responsive spacing based on screen size
 * Following JSON's 8px base modular scale
 */
export const useResponsiveSpacing = () => {
  const { isMobile, isTablet } = useResponsiveDesign();

  // Spacing multipliers based on screen size
  const spacingMultiplier = isMobile ? 0.9 : isTablet ? 1.1 : 1.0;

  return {
    xs: Math.round(4 * spacingMultiplier),
    sm: Math.round(8 * spacingMultiplier),   // Small margin from JSON
    md: Math.round(16 * spacingMultiplier),  // Medium margin & card padding from JSON  
    lg: Math.round(24 * spacingMultiplier),  // Large margin from JSON
    xl: Math.round(32 * spacingMultiplier),
    xxl: Math.round(48 * spacingMultiplier),
  };
};

/**
 * Hook for responsive typography based on screen size
 * Following JSON typography specifications with accessibility scaling
 */
export const useResponsiveTypography = () => {
  const { isMobile, isTablet } = useResponsiveDesign();

  // Typography scaling for better readability per JSON guidelines
  // "Use larger sizes for elderly users or low-vision accessibility"
  const fontSizeMultiplier = isMobile ? 0.95 : isTablet ? 1.05 : 1.0;
  
  return {
    small: Math.round(12 * fontSizeMultiplier),     // Exact from JSON
    caption: Math.round(14 * fontSizeMultiplier),   // Exact from JSON
    body: Math.round(16 * fontSizeMultiplier),      // Exact from JSON
    subheading: Math.round(18 * fontSizeMultiplier), // Exact from JSON
    heading: Math.round(24 * fontSizeMultiplier),   // Exact from JSON
    title: Math.round(28 * fontSizeMultiplier),
    largeTitle: Math.round(32 * fontSizeMultiplier),
  };
};

/**
 * Hook for responsive grid layout
 * Following JSON's "12-column flexible grid for responsive design across mobile devices"
 */
export const useResponsiveGrid = () => {
  const { screenWidth, isMobile, isTablet } = useResponsiveDesign();

  // Grid configuration following JSON specifications
  const totalColumns = 12; // "12-column flexible grid"
  const gutterWidth = isMobile ? 8 : isTablet ? 12 : 16; // 8px base from JSON
  const marginWidth = isMobile ? 16 : isTablet ? 24 : 32;

  const availableWidth = screenWidth - (marginWidth * 2);
  const columnWidth = (availableWidth - (gutterWidth * (totalColumns - 1))) / totalColumns;

  const getColumnWidth = (columns: number) => {
    return (columnWidth * columns) + (gutterWidth * (columns - 1));
  };
  
  return {
    totalColumns,
    columnWidth,
    gutterWidth,
    marginWidth,
    availableWidth,
    getColumnWidth,
    containerPadding: marginWidth,
  };
};

/**
 * Hook for responsive touch targets
 * Following JSON accessibility guidelines: "48x48px for mobile usability"
 */
export const useResponsiveTouchTargets = () => {
  const { isMobile, isTablet } = useResponsiveDesign();

  // Touch target sizes following JSON accessibility specifications
  const minimumTouchTarget = 48; // "at least 48x48px for mobile usability"
  const recommendedTouchTarget = isMobile ? 48 : isTablet ? 52 : 56;

  return {
    minimum: minimumTouchTarget,
    recommended: recommendedTouchTarget,
    button: {
      height: recommendedTouchTarget,
      minWidth: recommendedTouchTarget,
    },
    icon: {
      size: isMobile ? 24 : isTablet ? 28 : 32,
      touchArea: recommendedTouchTarget,
    },
  };
};

export default useResponsiveDesign; 