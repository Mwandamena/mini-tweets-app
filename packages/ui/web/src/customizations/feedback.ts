/**
 * customizations/feedback.ts
 *
 * Feedback components: Dialog (modal), Snackbar, Alert, Skeleton,
 * Tooltip, Badge, LinearProgress, CircularProgress.
 */
import type { Theme, Components } from '@mui/material/styles';
import { blue, red, amber, green, neutral, borderRadius, duration } from '@twitter-ds/tokens';

export default function feedbackCustomizations(theme: Theme): Components {
  const isDark = theme.palette.mode === 'dark';

  return {
    // -------------------------------------------------------------------------
    // Dialog — Twitter modals use large radius and a diffuse shadow
    // -------------------------------------------------------------------------
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: borderRadius.lg,
          border: `1px solid ${theme.palette.divider}`,
          backgroundImage: 'none',
          boxShadow: 'rgba(101, 119, 134, 0.20) 0px 0px 25px, rgba(101, 119, 134, 0.15) 0px 0px 5px 1px',
          margin: '16px',
          maxHeight: 'calc(100% - 32px)',
        },
        paperFullScreen: {
          borderRadius: 0,
          border: 'none',
          margin: 0,
          maxHeight: '100%',
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '20px',
          fontWeight: 800,
          padding: '16px 20px',
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: { padding: '16px 20px' },
      },
    },

    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          borderTop: `1px solid ${theme.palette.divider}`,
          gap: '8px',
        },
      },
    },

    // -------------------------------------------------------------------------
    // Backdrop
    // -------------------------------------------------------------------------
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: isDark
            ? 'rgba(91, 112, 131, 0.40)'
            : 'rgba(0, 0, 0, 0.50)',
        },
      },
    },

    // -------------------------------------------------------------------------
    // Snackbar — Twitter shows toasts at bottom-center
    // -------------------------------------------------------------------------
    MuiSnackbar: {
      defaultProps: { anchorOrigin: { vertical: 'bottom', horizontal: 'center' } },
    },

    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: blue[500],
          color: '#ffffff',
          borderRadius: borderRadius.full,
          padding: '10px 20px',
          fontWeight: 700,
          fontSize: '15px',
          boxShadow: 'rgba(101, 119, 134, 0.20) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px',
        },
      },
    },

    // -------------------------------------------------------------------------
    // Alert
    // -------------------------------------------------------------------------
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
          fontSize: '15px',
          border: '1px solid',
        },
        standardSuccess: {
          backgroundColor: `${green[500]}18`,
          color: isDark ? green[300] : green[700],
          borderColor: `${green[500]}30`,
        },
        standardError: {
          backgroundColor: `${red[500]}18`,
          color: isDark ? red[300] : red[700],
          borderColor: `${red[500]}30`,
        },
        standardWarning: {
          backgroundColor: `${amber[500]}18`,
          color: isDark ? amber[300] : amber[700],
          borderColor: `${amber[500]}30`,
        },
        standardInfo: {
          backgroundColor: `${blue[500]}18`,
          color: isDark ? blue[300] : blue[700],
          borderColor: `${blue[500]}30`,
        },
      },
    },

    // -------------------------------------------------------------------------
    // Skeleton — Twitter uses wave animation
    // -------------------------------------------------------------------------
    MuiSkeleton: {
      defaultProps: { animation: 'wave' },
      styleOverrides: {
        root: {
          backgroundColor: isDark
            ? 'rgba(247, 249, 249, 0.08)'
            : 'rgba(0, 0, 0, 0.07)',
          '&::after': {
            background: isDark
              ? 'linear-gradient(90deg, transparent, rgba(247, 249, 249, 0.06), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.04), transparent)',
          },
        },
        rectangular: { borderRadius: borderRadius.sm },
        rounded:     { borderRadius: borderRadius.md },
        circular:    { borderRadius: borderRadius.full },
      },
    },

    // -------------------------------------------------------------------------
    // Tooltip — dark popover
    // -------------------------------------------------------------------------
    MuiTooltip: {
      defaultProps: { arrow: true, enterDelay: 500 },
      styleOverrides: {
        tooltip: {
          backgroundColor: isDark ? neutral[0] : '#14171A',
          color:           isDark ? '#14171A'  : neutral[0],
          borderRadius:    borderRadius.sm,
          fontSize:        '13px',
          fontWeight:      700,
          padding:         '4px 12px',
          boxShadow:       'rgba(101, 119, 134, 0.20) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px',
        },
        arrow: {
          color: isDark ? neutral[0] : '#14171A',
        },
      },
    },

    // -------------------------------------------------------------------------
    // Badge — notification dot / count
    // -------------------------------------------------------------------------
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 700,
          fontSize:   '12px',
          minWidth:   '18px',
          height:     '18px',
          padding:    '0 4px',
          borderRadius: borderRadius.full,
        },
        colorPrimary: {
          backgroundColor: blue[500],
          color:           '#ffffff',
        },
        colorError: {
          backgroundColor: red[500],
          color:           '#ffffff',
        },
      },
    },

    // -------------------------------------------------------------------------
    // LinearProgress / CircularProgress
    // -------------------------------------------------------------------------
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height:       4,
          borderRadius: borderRadius.full,
          backgroundColor: isDark
            ? 'rgba(29, 161, 242, 0.20)'
            : 'rgba(29, 161, 242, 0.15)',
        },
        bar: {
          borderRadius: borderRadius.full,
          backgroundColor: blue[500],
        },
      },
    },

    MuiCircularProgress: {
      defaultProps: { color: 'primary' },
      styleOverrides: {
        colorPrimary: { color: blue[500] },
      },
    },
  };
}
