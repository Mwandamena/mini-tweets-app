/**
 * customizations/surfaces.ts
 *
 * Card, Paper, Divider — the surfaces layer of the Twitter/X design system.
 * Twitter uses NO card elevation. Cards are separated by a 1px border.
 */
import type { Theme, Components } from '@mui/material/styles';
import { borderRadius, duration } from '@twitter-ds/tokens';

export default function surfacesCustomizations(theme: Theme): Components {
  return {
    // -------------------------------------------------------------------------
    // Card — Twitter cards are flat and full-width with a bottom border
    // -------------------------------------------------------------------------
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderRadius: 0,
          backgroundColor: 'inherit',
          // All cards in the feed use a bottom divider line:
          // individual pages/modals can override this
        },
      },
      variants: [
        // Tweet card — the primary feed item
        {
          props: { variant: 'outlined' } as Record<string, string>,
          style: {
            borderRadius: 0,
            border: 'none',
            borderBottom: `1px solid ${theme.palette.divider}`,
            padding: '12px 16px',
            width: '100%',
            backgroundColor: 'inherit',
            cursor: 'pointer',
            transition: `background-color ${duration.fast}ms ease-in-out`,
            '&:hover': { backgroundColor: theme.palette.action.hover },
          },
        },
        // Profile / info card — rounded with border
        {
          props: { variant: 'elevation' } as Record<string, string>,
          style: {
            borderRadius: borderRadius.lg,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: 'none',
            overflow: 'hidden',
          },
        },
      ],
    },

    // -------------------------------------------------------------------------
    // CardContent
    // -------------------------------------------------------------------------
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '0',
          '&:last-child': { paddingBottom: '0' },
        },
      },
    },

    // -------------------------------------------------------------------------
    // Paper — popover/dropdown surfaces
    // -------------------------------------------------------------------------
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: theme.palette.background.paper,
        },
        rounded: {
          borderRadius: borderRadius.lg,
        },
        outlined: {
          borderColor: theme.palette.divider,
        },
        elevation1: {
          boxShadow: 'rgba(101, 119, 134, 0.20) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px',
        },
        elevation2: {
          boxShadow: 'rgba(101, 119, 134, 0.20) 0px 0px 20px, rgba(101, 119, 134, 0.15) 0px 0px 4px 1px',
        },
        elevation3: {
          boxShadow: 'rgba(101, 119, 134, 0.20) 0px 0px 25px, rgba(101, 119, 134, 0.15) 0px 0px 5px 1px',
        },
      },
    },

    // -------------------------------------------------------------------------
    // Divider
    // -------------------------------------------------------------------------
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: theme.palette.divider,
        },
      },
    },

    // -------------------------------------------------------------------------
    // CssBaseline — scrollbar, body defaults
    // -------------------------------------------------------------------------
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.palette.divider} transparent`,
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.divider,
            borderRadius: '4px',
          },
        },
        // Global reduced-motion reset
        '*, *::before, *::after': {
          '@media (prefers-reduced-motion: reduce)': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
          },
        },
      },
    },
  };
}
