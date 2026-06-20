/**
 * customizations/navigation.ts
 *
 * Twitter/X navigation components: Tabs, Tab, Drawer, AppBar,
 * BottomNavigation, Breadcrumbs, Link.
 */
import type { Theme, Components } from '@mui/material/styles';
import { blue, neutral, borderRadius, duration } from '@twitter-ds/tokens';

export default function navigationCustomizations(theme: Theme): Components {
  const isDark = theme.palette.mode === 'dark';

  return {
    // -------------------------------------------------------------------------
    // Tabs — the primary feed/explore navigation
    // -------------------------------------------------------------------------
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 53, // Twitter exact tab height
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
        indicator: {
          backgroundColor: blue[500],
          height: 4,
          borderRadius: '2px 2px 0 0',
        },
        flexContainer: {
          height: '100%',
        },
      },
    },

    MuiTab: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '15px',
          minHeight: 53,
          padding: '0 16px',
          color: theme.palette.text.secondary,
          transition: `color ${duration.fast}ms ease-in-out, background-color ${duration.fast}ms ease-in-out`,
          '&.Mui-selected': {
            color: theme.palette.text.primary,
          },
          '&:hover': {
            color: theme.palette.text.primary,
            backgroundColor: isDark
              ? 'rgba(247, 249, 249, 0.10)'
              : 'rgba(15, 20, 25, 0.06)',
          },
          '&:focus-visible': {
            outline: `2px solid ${blue[500]}`,
            outlineOffset: '-2px',
            borderRadius: borderRadius.sm,
          },
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
          },
        },
      },
    },

    // -------------------------------------------------------------------------
    // AppBar — sticky header used in mobile / narrow layouts
    // -------------------------------------------------------------------------
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: isDark
            ? 'rgba(21, 32, 43, 0.85)'   // dim with blur
            : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          boxShadow: 'none',
        },
      },
    },

    // -------------------------------------------------------------------------
    // Drawer — sidebar navigation
    // -------------------------------------------------------------------------
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: theme.palette.background.default,
          borderRight: `1px solid ${theme.palette.divider}`,
          '&::-webkit-scrollbar':       { width: 0 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
        },
      },
    },

    // -------------------------------------------------------------------------
    // BottomNavigation — mobile tab bar
    // -------------------------------------------------------------------------
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.background.default,
          borderTop: `1px solid ${theme.palette.divider}`,
          height: 53,
        },
      },
    },

    MuiBottomNavigationAction: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          color: theme.palette.text.secondary,
          minWidth: 0,
          padding: '0 12px',
          '&.Mui-selected': {
            color: theme.palette.text.primary,
          },
          '&:hover': {
            color: theme.palette.text.primary,
          },
          '&:focus-visible': {
            outline: `2px solid ${blue[500]}`,
            outlineOffset: '2px',
            borderRadius: borderRadius.full,
          },
        },
      },
    },

    // -------------------------------------------------------------------------
    // Breadcrumbs
    // -------------------------------------------------------------------------
    MuiBreadcrumbs: {
      styleOverrides: {
        separator: { color: theme.palette.text.disabled },
        li: { fontSize: '13px' },
      },
    },

    // -------------------------------------------------------------------------
    // Link — Twitter style: blue, no underline by default
    // -------------------------------------------------------------------------
    MuiLink: {
      defaultProps: { underline: 'hover' },
      styleOverrides: {
        root: {
          color: blue[500],
          fontWeight: 400,
          '&:hover': { color: blue[600] },
          '&:focus-visible': {
            outline: `2px solid ${blue[500]}`,
            outlineOffset: '2px',
            borderRadius: '2px',
          },
        },
      },
    },
  };
}
