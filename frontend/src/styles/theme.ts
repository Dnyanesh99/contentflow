export const theme = {
  colors: {
    primary: '#818CF8', // Vibrant Indigo
    primaryHover: '#6366F1',
    secondary: '#38BDF8', // Light blue
    success: '#34D399', // Bright emerald
    danger: '#F87171', // Bright red
    warning: '#FBBF24', // Amber
    background: '#0B0F19', // Deep dark space background
    surface: 'rgba(17, 24, 39, 0.75)', // Glass surface
    surfaceHover: 'rgba(31, 41, 55, 0.85)',
    surfaceSolid: '#111827',
    text: '#F9FAFB', // Crisp white text
    textMuted: '#B9C0CB', // Accessible Gray text (WCAG AA Compliant contrast on dark background)
    border: 'rgba(255, 255, 255, 0.08)', // Subtle glass borders
    nodeBorder: 'rgba(255, 255, 255, 0.15)',
    nodeBackground: 'rgba(17, 24, 39, 0.9)',
    
    // Brand Colors
    slack: '#E01E5A', // Brighter slack pink/red
    openai: '#10A37F',
    contentful: '#2D64F6',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    round: '50px',
  },
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.15)',
    md: '0 8px 24px rgba(0, 0, 0, 0.25)',
    lg: '0 16px 40px rgba(0, 0, 0, 0.4)',
    glowPrimary: '0 0 20px rgba(129, 140, 248, 0.4)',
    glowSuccess: '0 0 20px rgba(52, 211, 153, 0.4)',
  },
  animation: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  }
};
