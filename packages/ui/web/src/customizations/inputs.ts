/**
 * customizations/inputs.ts
 *
 * MUI form + input component overrides for the Twitter/X design system.
 * Covers: Button, IconButton, TextField, OutlinedInput, FilledInput,
 * InputLabel, FormHelperText, Select, Autocomplete, Checkbox, Radio, Switch.
 */
import type { Theme, Components } from '@mui/material/styles';
import { blue, neutral, red, borderRadius, duration } from '@twitter-ds/tokens';

export default function inputsCustomizations(theme: Theme): Components {
  const isDark = theme.palette.mode === 'dark';

  return {
    // -------------------------------------------------------------------------
    // Button
    // -------------------------------------------------------------------------
    MuiButton: {
      defaultProps: { disableRipple: true, disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: borderRadius.full,
          fontWeight: 700,
          fontSize: '15px',
          textTransform: 'none',
          padding: '10px 20px',
          boxShadow: 'none',
          transition: `background-color ${duration.fast}ms ease-in-out, transform ${duration.fast}ms ease-in-out`,
          '&:hover': { boxShadow: 'none' },
          '&:active': { transform: 'scale(0.98)' },
          // Keyboard focus ring — WCAG AA
          '&:focus-visible': {
            outline: `2px solid ${blue[500]}`,
            outlineOffset: '2px',
          },
          // Reduced-motion: no scale animation
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
            '&:active': { transform: 'none' },
          },
        },
        contained: {
          '&:hover': { backgroundColor: blue[600] },
        },
        outlined: {
          borderWidth: '1px',
          borderColor: isDark ? neutral[700] : neutral[300],
          color: isDark ? '#E7E9EA' : '#0F1419',
          '&:hover': {
            backgroundColor: isDark
              ? 'rgba(239, 243, 244, 0.10)'
              : 'rgba(15, 20, 25, 0.05)',
            borderColor: isDark ? neutral[700] : neutral[300],
          },
        },
        text: {
          padding: '8px 16px',
          '&:hover': { backgroundColor: theme.palette.action.hover },
        },
        sizeSmall: { padding: '6px 16px', fontSize: '13px' },
        sizeLarge: { padding: '14px 28px', fontSize: '17px', fontWeight: 800 },
      },
    },

    // -------------------------------------------------------------------------
    // IconButton
    // -------------------------------------------------------------------------
    MuiIconButton: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          borderRadius: borderRadius.full,
          padding: 8,
          transition: `background-color ${duration.fast}ms ease-in-out, transform ${duration.fast}ms ease-in-out`,
          '&:hover': { backgroundColor: theme.palette.action.hover },
          '&:active': { transform: 'scale(0.95)' },
          '&:focus-visible': {
            outline: `2px solid ${blue[500]}`,
            outlineOffset: '2px',
          },
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
            '&:active': { transform: 'none' },
          },
        },
      },
    },

    // -------------------------------------------------------------------------
    // TextField — use outlined variant by default
    // -------------------------------------------------------------------------
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },

    // -------------------------------------------------------------------------
    // OutlinedInput
    // -------------------------------------------------------------------------
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.sm, // 4px — Twitter uses square-ish inputs
          backgroundColor: isDark ? neutral[950] : neutral[0],
          fontSize: '15px',
          transition: `background-color ${duration.fast}ms ease-in-out`,

          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: isDark ? neutral[800] : neutral[300],
            borderWidth: '1px',
            transition: `border-color ${duration.fast}ms ease-in-out, border-width ${duration.fast}ms ease-in-out`,
          },
          '&:hover:not(.Mui-focused):not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
            borderColor: isDark ? neutral[700] : neutral[500],
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: blue[500],
            borderWidth: '2px',
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: red[500],
          },
          '&.Mui-disabled': {
            backgroundColor: isDark ? neutral[900] : neutral[100],
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? neutral[800] : neutral[200],
            },
          },
        },
        input: {
          padding: '16px',
          fontSize: '15px',
          color: theme.palette.text.primary,
          '&::placeholder': {
            color: theme.palette.text.secondary,
            opacity: 1,
          },
          '&:disabled': {
            color: theme.palette.text.disabled,
            WebkitTextFillColor: theme.palette.text.disabled,
          },
        },
        multiline: { padding: '16px' },
      },
    },

    // -------------------------------------------------------------------------
    // FilledInput — Twitter's floating-label style for compose areas
    // -------------------------------------------------------------------------
    MuiFilledInput: {
      defaultProps: { disableUnderline: true },
      styleOverrides: {
        root: {
          borderRadius: borderRadius.sm,
          backgroundColor: 'transparent',
          border: `1px solid ${isDark ? neutral[800] : neutral[300]}`,
          fontSize: '15px',
          overflow: 'hidden',
          transition: `border-color ${duration.fast}ms ease-in-out, border-width ${duration.fast}ms ease-in-out`,
          '&:before': { display: 'none' },
          '&:after':  { display: 'none' },
          '&:hover': {
            backgroundColor: 'transparent',
            borderColor: isDark ? neutral[700] : neutral[500],
          },
          '&.Mui-focused': {
            backgroundColor: 'transparent',
            borderColor: blue[500],
            borderWidth: '2px',
          },
          '&.Mui-error':   { borderColor: red[500] },
          '&.Mui-disabled': {
            backgroundColor: isDark ? neutral[900] : neutral[100],
            borderColor: isDark ? neutral[800] : neutral[200],
            opacity: 0.7,
          },
        },
        input: {
          padding: '16px',
          fontSize: '15px',
          color: theme.palette.text.primary,
          '&:disabled': {
            color: theme.palette.text.disabled,
            WebkitTextFillColor: theme.palette.text.disabled,
          },
        },
        multiline: { padding: '28px 16px 12px' },
      },
    },

    // -------------------------------------------------------------------------
    // InputLabel
    // -------------------------------------------------------------------------
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '15px',
          color: theme.palette.text.secondary,
          '&.Mui-focused':  { color: blue[500] },
          '&.Mui-error':    { color: red[500] },
          '&.Mui-disabled': { color: theme.palette.text.disabled },
        },
        outlined: {
          '&.MuiInputLabel-shrink': { fontSize: '13px', fontWeight: 600 },
        },
      },
    },

    // -------------------------------------------------------------------------
    // FormHelperText
    // -------------------------------------------------------------------------
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '13px',
          marginTop: '6px',
          marginLeft: '14px',
          '&.Mui-error': { color: red[500] },
        },
      },
    },

    // -------------------------------------------------------------------------
    // Select
    // -------------------------------------------------------------------------
    MuiSelect: {
      styleOverrides: {
        select: { padding: '16px', fontSize: '15px' },
        icon:   { color: theme.palette.text.secondary },
      },
    },

    // -------------------------------------------------------------------------
    // Autocomplete
    // -------------------------------------------------------------------------
    MuiAutocomplete: {
      styleOverrides: {
        root:           { '& .MuiOutlinedInput-root': { padding: '0' } },
        inputRoot:      { padding: '8px 16px' },
        input:          { padding: '8px 0 !important' },
        popupIndicator: { color: theme.palette.text.secondary },
        paper:          { borderRadius: borderRadius.md, boxShadow: 'rgba(101, 119, 134, 0.20) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px' },
      },
    },

    // -------------------------------------------------------------------------
    // Checkbox
    // -------------------------------------------------------------------------
    MuiCheckbox: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          color: theme.palette.text.secondary,
          '&.Mui-checked': { color: blue[500] },
          '&:hover': { backgroundColor: theme.palette.action.hover },
          '&:focus-visible': { outline: `2px solid ${blue[500]}`, outlineOffset: '2px' },
        },
      },
    },

    // -------------------------------------------------------------------------
    // Radio
    // -------------------------------------------------------------------------
    MuiRadio: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          color: theme.palette.text.secondary,
          '&.Mui-checked': { color: blue[500] },
          '&:hover': { backgroundColor: theme.palette.action.hover },
          '&:focus-visible': { outline: `2px solid ${blue[500]}`, outlineOffset: '2px' },
        },
      },
    },

    // -------------------------------------------------------------------------
    // Switch — iOS-style pill, exactly like Twitter's toggle
    // -------------------------------------------------------------------------
    MuiSwitch: {
      styleOverrides: {
        root:       { width: 51, height: 31, padding: 0 },
        switchBase: {
          padding: 4,
          transition: `transform ${duration.fast}ms ${blue[500]}`,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            color: '#FFFFFF',
            '& + .MuiSwitch-track': {
              backgroundColor: blue[500],
              opacity: 1,
            },
          },
          '&:focus-visible + .MuiSwitch-track': {
            outline: `2px solid ${blue[500]}`,
            outlineOffset: '2px',
          },
        },
        thumb:  { width: 23, height: 23, boxShadow: 'none' },
        track:  {
          borderRadius: borderRadius.full,
          backgroundColor: isDark ? neutral[700] : neutral[300],
          opacity: 1,
          transition: `background-color ${duration.fast}ms ease-in-out`,
        },
      },
    },

    // -------------------------------------------------------------------------
    // ButtonBase / ListItemButton / MenuItem — kill ripple globally
    // -------------------------------------------------------------------------
    MuiButtonBase:      { defaultProps: { disableRipple: true } },
    MuiListItemButton:  { defaultProps: { disableRipple: true } },
    MuiMenuItem: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          fontSize: '15px',
          '&:hover': { backgroundColor: theme.palette.action.hover },
          '&.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
            '&:hover': { backgroundColor: theme.palette.action.selected },
          },
        },
      },
    },
  };
}
