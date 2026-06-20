/**
 * customizations/dataDisplay.ts
 *
 * Data display components: Avatar, Chip, Typography, List, ListItem,
 * Popover, Menu, Table.
 */
import type { Theme, Components } from '@mui/material/styles';
import { blue, neutral, borderRadius, duration } from '@twitter-ds/tokens';

export default function dataDisplayCustomizations(theme: Theme): Components {
  const isDark = theme.palette.mode === 'dark';

  return {
    // -------------------------------------------------------------------------
    // Avatar — Twitter uses circular avatars with a subtle border
    // -------------------------------------------------------------------------
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: `2px solid ${theme.palette.background.default}`,
          fontWeight: 700,
          backgroundColor: isDark
            ? 'rgba(29, 161, 242, 0.20)'
            : 'rgba(29, 161, 242, 0.15)',
          color: blue[500],
        },
        img: {
          objectFit: 'cover',
        },
      },
    },

    MuiAvatarGroup: {
      styleOverrides: {
        avatar: {
          borderColor: theme.palette.background.default,
          '&:hover': { zIndex: 1 },
        },
      },
    },

    // -------------------------------------------------------------------------
    // Chip — hashtags, topic pills
    // -------------------------------------------------------------------------
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.full,
          fontWeight: 700,
          fontSize: '13px',
          height: '30px',
          transition: `background-color ${duration.fast}ms ease-in-out`,
        },
        filled: {
          backgroundColor: isDark
            ? 'rgba(29, 161, 242, 0.15)'
            : 'rgba(29, 161, 242, 0.10)',
          color: blue[500],
          '&:hover': {
            backgroundColor: isDark
              ? 'rgba(29, 161, 242, 0.25)'
              : 'rgba(29, 161, 242, 0.18)',
          },
          '&:focus': {
            backgroundColor: isDark
              ? 'rgba(29, 161, 242, 0.30)'
              : 'rgba(29, 161, 242, 0.22)',
          },
        },
        outlined: {
          borderColor: theme.palette.divider,
          color: theme.palette.text.primary,
          '&:hover': { backgroundColor: theme.palette.action.hover },
        },
        deleteIcon: {
          color: blue[500],
          '&:hover': { color: blue[600] },
        },
      },
    },

    // -------------------------------------------------------------------------
    // Typography — default colour assignments
    // -------------------------------------------------------------------------
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: 'h1', h2: 'h2', h3: 'h3',
          h4: 'h4', h5: 'h5', h6: 'h6',
          subtitle1: 'p', subtitle2: 'p',
          body1: 'p', body2: 'p',
        },
      },
    },

    // -------------------------------------------------------------------------
    // List & ListItem
    // -------------------------------------------------------------------------
    MuiListItem: {
      styleOverrides: {
        root: { padding: '0' },
      },
    },

    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '15px',
          fontWeight: 400,
          color: theme.palette.text.primary,
        },
        secondary: {
          fontSize: '13px',
          color: theme.palette.text.secondary,
        },
      },
    },

    MuiListSubheader: {
      styleOverrides: {
        root: {
          fontSize: '13px',
          fontWeight: 700,
          color: theme.palette.text.secondary,
          backgroundColor: 'transparent',
          lineHeight: '32px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        },
      },
    },

    // -------------------------------------------------------------------------
    // Popover / Menu — the same "who to follow" / context menus
    // -------------------------------------------------------------------------
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: borderRadius.lg,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: 'rgba(101, 119, 134, 0.20) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px',
          backgroundImage: 'none',
          minWidth: '180px',
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: borderRadius.lg,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: 'rgba(101, 119, 134, 0.20) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px',
          backgroundImage: 'none',
          minWidth: '200px',
        },
        list: { padding: '4px 0' },
      },
    },

    // -------------------------------------------------------------------------
    // Table — data tables used in analytics/trending
    // -------------------------------------------------------------------------
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${theme.palette.divider}`,
          padding: '12px 16px',
          fontSize: '15px',
        },
        head: {
          fontWeight: 700,
          color: theme.palette.text.secondary,
          fontSize: '13px',
          backgroundColor: theme.palette.background.paper,
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: `background-color ${duration.fast}ms ease-in-out`,
          '&:hover': {
            backgroundColor: isDark
              ? 'rgba(247, 249, 249, 0.03)'
              : 'rgba(0, 0, 0, 0.02)',
          },
          '&.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
            '&:hover': { backgroundColor: theme.palette.action.selected },
          },
        },
      },
    },

    // -------------------------------------------------------------------------
    // Pagination
    // -------------------------------------------------------------------------
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.full,
          fontWeight: 700,
          '&.Mui-selected': {
            backgroundColor: blue[500],
            color: '#ffffff',
            '&:hover': { backgroundColor: blue[600] },
          },
          '&:hover': { backgroundColor: theme.palette.action.hover },
        },
      },
    },
  };
}
