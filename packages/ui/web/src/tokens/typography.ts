/**
 * @twitter-ds/tokens — typography
 *
 * Exact values reverse-engineered from twitter.com / x.com.
 * Font stack matches what Twitter ships in production CSS.
 */

export const fontFamily = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  'Helvetica',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
].join(', ');

// ---------------------------------------------------------------------------
// Font-size scale (px — Twitter uses px not rem for predictable density)
// ---------------------------------------------------------------------------
export const fontSize = {
  xs:   13, // caption, helper, label shrunk
  sm:   15, // body default (Twitter base)
  md:   17, // slightly larger body
  lg:   20, // h3
  xl:   23, // h2
  '2xl': 31, // h1
} as const;

// ---------------------------------------------------------------------------
// Font-weight scale
// ---------------------------------------------------------------------------
export const fontWeight = {
  regular: 400,
  medium:  700, // Twitter uses 700 as "medium"
  bold:    800,
  black:   900,
} as const;

// ---------------------------------------------------------------------------
// Line-height scale
// ---------------------------------------------------------------------------
export const lineHeight = {
  tight:   1.2,
  snug:    1.3,
  normal:  1.4,
  relaxed: 1.5,
} as const;

// ---------------------------------------------------------------------------
// Letter-spacing
// ---------------------------------------------------------------------------
export const letterSpacing = {
  tight:  '-0.02em',
  snug:   '-0.01em',
  normal: '0em',
  wide:   '0.08em',
} as const;
