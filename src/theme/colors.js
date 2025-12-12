// Color palette extracted from UI screenshots
export const colors = {
  // Background gradients
  backgroundDark: '#1a1d3a',
  backgroundNavy: '#252850',
  backgroundTeal: '#2d5f6f',
  
  // Primary colors
  teal: '#4dd0e1',
  tealDark: '#26c6da',
  cyan: '#80deea',
  cyanLight: '#b2ebf2',
  
  // Purple accents
  purple: '#5e4b8b',
  purpleDark: '#3d2f5b',
  purpleDarker: '#2d1f4b',
  
  // Health score colors (gradient from red to green)
  healthRed: '#ff4444',
  healthOrange1: '#ff6644',
  healthOrange2: '#ff8844',
  healthYellow1: '#ffaa44',
  healthYellow2: '#ffcc44',
  healthYellow3: '#ffdd44',
  healthLime1: '#ccff44',
  healthLime2: '#aaff44',
  healthGreen1: '#88ff44',
  healthGreen2: '#44ff88',
  
  // UI elements
  white: '#ffffff',
  whiteTransparent: 'rgba(255, 255, 255, 0.9)',
  black: '#000000',
  blackTransparent: 'rgba(0, 0, 0, 0.3)',
  
  // Text
  textPrimary: '#ffffff',
  textSecondary: '#b0b0b0',
  textDark: '#1a1d3a',
  
  // Chart colors
  chartBar: '#e0e0e0',
  chartPieRent: '#80deea',
  chartPieEMI: '#4dd0e1',
  chartPieMisc: '#5e4b8b',
  chartPieGrocery: '#3d2f5b',
  chartPieTravel: '#2d1f4b',
  
  // Controls
  controlTeal: '#4dd0e1',
  controlBorder: 'rgba(77, 208, 225, 0.3)',
};

// Health score to color mapping
export const getHealthColor = (score) => {
  if (score >= 81) return colors.healthGreen2;
  if (score >= 61) return colors.healthGreen1;
  if (score >= 41) return colors.healthYellow2;
  if (score >= 21) return colors.healthOrange2;
  return colors.healthRed;
};

// Get health bar segments (10 segments)
export const getHealthBarSegments = (score) => {
  const segments = [
    colors.healthRed,
    colors.healthOrange1,
    colors.healthOrange2,
    colors.healthYellow1,
    colors.healthYellow2,
    colors.healthYellow3,
    colors.healthLime1,
    colors.healthLime2,
    colors.healthGreen1,
    colors.healthGreen2,
  ];
  
  const filledSegments = Math.ceil((score / 100) * 10);
  return segments.map((color, index) => ({
    color,
    filled: index < filledSegments,
  }));
};
