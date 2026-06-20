/**
 * @twitter-ds/tokens — colors
 *
 * Single source of truth for every colour value used in the Twitter/X design system.
 * These are raw primitives — no MUI, no CSS-in-JS.  Import from `@twitter-ds/tokens`.
 *
 * Naming: palette → role → shade
 */

// ---------------------------------------------------------------------------
// Brand palette (Twitter blue)
// ---------------------------------------------------------------------------
export const blue = {
  100: '#E8F5FD',
  200: '#C4E4FA',
  300: '#8ED0F9',
  400: '#4DB5F5',
  500: '#1DA1F2', // primary.main  ← Twitter blue
  600: '#1A91DA', // primary.dark
  700: '#1681C4',
  800: '#1164A3',
  900: '#0C4880',
} as const;

// ---------------------------------------------------------------------------
// Neutral palette (Twitter greys)
// ---------------------------------------------------------------------------
export const neutral = {
  0:   '#FFFFFF',
  50:  '#F7F9F9',
  100: '#EFF3F4',
  200: '#E1E8ED', // divider (light)
  300: '#CFD9DE', // border default (light)
  400: '#AAB8C2', // text.disabled (light)
  500: '#8899A6',
  600: '#657786', // text.secondary (light)
  700: '#536471',
  800: '#38444D', // divider (dark)
  850: '#2F3A44',
  900: '#253341', // disabledBackground (dark)
  950: '#192734', // paper (dark)
  1000: '#15202B', // background.default (dark)  [Dim mode]
  1100: '#000000',
} as const;

// Twitter true black background
export const trueBlack = {
  default: '#000000',
  paper:   '#16181C',
} as const;

// ---------------------------------------------------------------------------
// Semantic / status palette
// ---------------------------------------------------------------------------
export const red = {
  100: '#FDDCDE',
  300: '#F85866',
  500: '#F4212E', // error.main
  700: '#DC1A27', // error.dark
} as const;

export const amber = {
  100: '#FFF3CD',
  300: '#FFC04C',
  500: '#FFAD1F', // warning.main
  700: '#E69A1A', // warning.dark
} as const;

export const green = {
  100: '#D4EDDA',
  300: '#45CC82',
  500: '#17BF63', // success.main
  700: '#13A556', // success.dark
} as const;

// ---------------------------------------------------------------------------
// Semantic colour map (resolved)
// Not the same as palette — these express intent.
// ---------------------------------------------------------------------------
export const semanticLight = {
  // Text
  textPrimary:   neutral[800 as keyof typeof neutral] as string, // actually #14171A (slightly off neutral scale)
  textSecondary: neutral[600] as string,
  textDisabled:  neutral[400] as string,

  // Backgrounds
  bgDefault: neutral[0] as string,
  bgPaper:   neutral[0] as string,

  // Borders / dividers
  borderDefault: neutral[300] as string,
  divider:       neutral[200] as string,

  // Primary actions
  primary:     blue[500] as string,
  primaryDark: blue[600] as string,
  primaryLight: blue[300] as string,

  // Status
  error:   red[500] as string,
  warning: amber[500] as string,
  success: green[500] as string,

  // Interactive states (alpha values)
  actionHover:    'rgba(29, 161, 242, 0.10)',
  actionSelected: 'rgba(29, 161, 242, 0.15)',
  actionFocus:    'rgba(29, 161, 242, 0.20)',
  actionActive:   blue[500] as string,
  actionDisabledBg: neutral[200] as string,
  actionDisabled:   neutral[400] as string,
} as const;

export const semanticDark = {
  textPrimary:   '#E7E9EA',
  textSecondary: '#8B98A5',
  textDisabled:  '#5B7083',

  bgDefault: neutral[1000] as string,
  bgPaper:   neutral[950] as string,

  borderDefault: neutral[700] as string,
  divider:       neutral[800] as string,

  primary:     blue[500] as string,
  primaryDark: blue[600] as string,
  primaryLight: blue[300] as string,

  error:   red[500] as string,
  warning: amber[500] as string,
  success: green[500] as string,

  actionHover:      'rgba(29, 161, 242, 0.10)',
  actionSelected:   'rgba(29, 161, 242, 0.15)',
  actionFocus:      'rgba(29, 161, 242, 0.20)',
  actionActive:     blue[500] as string,
  actionDisabledBg: neutral[900] as string,
  actionDisabled:   '#5B7083',
} as const;
