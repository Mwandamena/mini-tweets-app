/**
 * shared-theme/themePrimitives.ts
 *
 * Maps @twitter-ds/tokens → MUI createTheme() primitives.
 * Nothing here is component-specific.  Components live in customizations/.
 */
import type { PaletteOptions, ThemeOptions } from '@mui/material/styles';
import {
  blue,
  neutral,
  red,
  amber,
  green,
  semanticLight,
  semanticDark,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  borderRadius,
  breakpoints as bpValues,
  muiShadows,
} from '@twitter-ds/tokens';

// ---------------------------------------------------------------------------
// Palette factory — returns light or dark palette options
// ---------------------------------------------------------------------------
export function getDesignTokens(mode: 'light' | 'dark'): PaletteOptions {
  const s = mode === 'light' ? semanticLight : semanticDark;

  return {
    mode,
    primary: {
      main:          blue[500],
      light:         blue[300],
      dark:          blue[600],
      contrastText:  '#ffffff',
    },
    secondary: {
      main:         mode === 'light' ? '#14171A' : '#E7E9EA',
      light:        mode === 'light' ? neutral[600] : neutral[50],
      dark:         mode === 'light' ? '#000000'  : '#8B98A5',
      contrastText: mode === 'light' ? '#ffffff'  : '#000000',
    },
    error: {
      main:         red[500],
      light:        red[300],
      dark:         red[700],
      contrastText: '#ffffff',
    },
    warning: {
      main:         amber[500],
      light:        amber[300],
      dark:         amber[700],
      contrastText: mode === 'light' ? '#14171A' : '#14171A',
    },
    success: {
      main:         green[500],
      light:        green[300],
      dark:         green[700],
      contrastText: '#ffffff',
    },
    background: {
      default: s.bgDefault,
      paper:   s.bgPaper,
    },
    text: {
      primary:   s.textPrimary,
      secondary: s.textSecondary,
      disabled:  s.textDisabled,
    },
    divider: s.divider,
    action: {
      active:           s.actionActive,
      hover:            s.actionHover,
      selected:         s.actionSelected,
      disabled:         s.actionDisabled,
      disabledBackground: s.actionDisabledBg,
      focus:            s.actionFocus,
    },
  };
}

// ---------------------------------------------------------------------------
// Typography — pixel-exact Twitter/X values
// ---------------------------------------------------------------------------
export const typography: ThemeOptions['typography'] = {
  fontFamily,
  fontSize:            fontSize.sm,   // MUI base font size (15px)
  fontWeightLight:     fontWeight.regular,
  fontWeightRegular:   fontWeight.regular,
  fontWeightMedium:    fontWeight.medium,
  fontWeightBold:      fontWeight.black,

  h1: {
    fontSize:      `${fontSize['2xl']}px`,
    fontWeight:    fontWeight.black,
    lineHeight:    lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontSize:      `${fontSize.xl}px`,
    fontWeight:    fontWeight.black,
    lineHeight:    lineHeight.snug,
    letterSpacing: letterSpacing.snug,
  },
  h3: {
    fontSize:   `${fontSize.lg}px`,
    fontWeight: fontWeight.black,
    lineHeight: lineHeight.normal,
  },
  h4: {
    fontSize:   `${fontSize.md}px`,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
  },
  h5: {
    fontSize:   `${fontSize.sm}px`,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
  },
  h6: {
    fontSize:   `${fontSize.xs}px`,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
  },
  body1: {
    fontSize:   `${fontSize.sm}px`,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.relaxed,
  },
  body2: {
    fontSize:   `${fontSize.xs}px`,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
  },
  button: {
    fontSize:      `${fontSize.sm}px`,
    fontWeight:    fontWeight.medium,
    textTransform: 'none',
    lineHeight:    lineHeight.normal,
  },
  caption: {
    fontSize:   `${fontSize.xs}px`,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
  },
  overline: {
    fontSize:      `${fontSize.xs}px`,
    fontWeight:    fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: letterSpacing.wide,
    lineHeight:    lineHeight.normal,
  },
};

// ---------------------------------------------------------------------------
// Shape
// ---------------------------------------------------------------------------
export const shape: ThemeOptions['shape'] = {
  borderRadius: borderRadius.lg, // 16px — Twitter's base radius for cards/dialogs
};

// ---------------------------------------------------------------------------
// Breakpoints
// ---------------------------------------------------------------------------
export const breakpointsConfig: ThemeOptions['breakpoints'] = {
  values: bpValues,
};

// ---------------------------------------------------------------------------
// Shadows
// ---------------------------------------------------------------------------
export { muiShadows as themeShadows };
