/**
 * @twitter-ds/tokens — layout & motion
 */

// ---------------------------------------------------------------------------
// Spacing — base unit is 8px (matches MUI default)
// ---------------------------------------------------------------------------
export const spacing = {
  unit: 8, // 1 token = 8px
  // Named shortcuts used in component specs:
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  '2xl': 48,
} as const;

// ---------------------------------------------------------------------------
// Border radius
// ---------------------------------------------------------------------------
export const borderRadius = {
  none:  0,
  sm:    4,
  md:    8,
  lg:    16,   // MUI theme.shape.borderRadius (16 in Twitter clone)
  full:  9999, // pill / avatar / icon buttons
} as const;

// ---------------------------------------------------------------------------
// Shadows  (Twitter style — soft diffuse, no hard drop)
// ---------------------------------------------------------------------------
export const shadows = [
  'none',
  // shadow[1] — card hover, dropdown
  'rgba(101, 119, 134, 0.20) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px',
  // shadow[2]
  'rgba(101, 119, 134, 0.20) 0px 0px 20px, rgba(101, 119, 134, 0.15) 0px 0px 4px 1px',
  // shadow[3] — modals
  'rgba(101, 119, 134, 0.20) 0px 0px 25px, rgba(101, 119, 134, 0.15) 0px 0px 5px 1px',
  // shadow[4]
  'rgba(101, 119, 134, 0.20) 0px 0px 30px, rgba(101, 119, 134, 0.15) 0px 0px 6px 1px',
  // shadow[5]
  'rgba(101, 119, 134, 0.20) 0px 0px 35px, rgba(101, 119, 134, 0.15) 0px 0px 7px 1px',
] as const;

// Pad to MUI's required 25-element array
export const muiShadows = [
  ...shadows,
  ...Array<string>(19).fill('none'),
] as unknown as [
  'none', string, string, string, string, string,
  string, string, string, string, string, string,
  string, string, string, string, string, string,
  string, string, string, string, string, string, string
];

// ---------------------------------------------------------------------------
// Breakpoints (Twitter clone — slightly narrower than MUI defaults)
// ---------------------------------------------------------------------------
export const breakpoints = {
  xs:  0,
  sm:  600,
  md:  1000, // sidebar collapses here
  lg:  1280,
  xl:  1920,
} as const;

// ---------------------------------------------------------------------------
// Motion / transitions — duration scale (ms)
// ---------------------------------------------------------------------------
export const duration = {
  instant:    0,
  fastest:   75,  // micro feedback (icon swap)
  fast:     150,  // interactive hover — default
  base:     200,  // exit animations
  moderate: 250,  // enter animations
  slow:     300,  // deliberate transitions
  slowest:  500,  // page-level
} as const;

// Easing curves
export const easing = {
  standard:   'cubic-bezier(0.4, 0, 0.2, 1)',
  decelerate: 'cubic-bezier(0.0, 0, 0.2, 1)', // enter
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',    // exit
  sharp:      'cubic-bezier(0.4, 0, 0.6, 1)',
} as const;

// Z-index layer map — never use raw numbers outside this map
export const zIndex = {
  base:       0,
  raised:   100,
  dropdown: 1000,
  sticky:   1100,
  appBar:   1200,
  drawer:   1300,
  modal:    1400,
  popover:  1500,
  toast:    1600,
  tooltip:  1700,
} as const;
