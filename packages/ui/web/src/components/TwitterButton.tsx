/**
 * TwitterButton
 *
 * Extends MUI Button with Twitter-specific variants and exact measurements.
 *
 * Variants (in addition to MUI's contained / outlined / text):
 *   "follow"    — white pill on dark bg (the Follow button)
 *   "following" — outlined pill that becomes "Unfollow" on hover
 *   "primary"   — standard blue filled pill (Tweet, Post)
 *   "danger"    — red filled pill (Block, Delete)
 *
 * Size mapping:
 *   small  — 34px height, 13px font
 *   medium — 36px height, 15px font (default)
 *   large  — 52px height, 17px font
 */
import {
  Button,
  type ButtonProps,
  CircularProgress,
  Box,
} from '@mui/material';
import { useState, forwardRef } from 'react';
import { blue, red, borderRadius } from '@twitter-ds/tokens';

// ---------------------------------------------------------------------------
// Extended prop types
// ---------------------------------------------------------------------------
type TwitterVariant =
  | 'follow'
  | 'following'
  | 'primary'
  | 'danger'
  | ButtonProps['variant'];

export interface TwitterButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: TwitterVariant;
  /** Show loading spinner and disable interaction */
  loading?: boolean;
}

// ---------------------------------------------------------------------------
// Variant style map
// ---------------------------------------------------------------------------
const variantStyles: Record<string, React.CSSProperties> = {
  follow: {
    backgroundColor: '#0F1419',
    color: '#FFFFFF',
    border: 'none',
  },
  primary: {
    backgroundColor: blue[500],
    color: '#FFFFFF',
    border: 'none',
  },
  danger: {
    backgroundColor: red[500],
    color: '#FFFFFF',
    border: 'none',
  },
};

// ---------------------------------------------------------------------------
// TwitterButton
// ---------------------------------------------------------------------------
export const TwitterButton = forwardRef<HTMLButtonElement, TwitterButtonProps>(
  function TwitterButton(
    { variant = 'contained', loading = false, children, disabled, sx, ...rest },
    ref,
  ) {
    const [hoveringFollowing, setHoveringFollowing] = useState(false);

    const isCustomVariant = ['follow', 'following', 'primary', 'danger'].includes(
      variant as string,
    );

    // Map our custom variants to MUI base variants
    const muiVariant: ButtonProps['variant'] =
      variant === 'following' ? 'outlined' : 'contained';

    const customSx = (() => {
      if (variant === 'follow') {
        return {
          backgroundColor: '#0F1419',
          color: '#FFFFFF',
          '&:hover': { backgroundColor: 'rgba(15, 20, 25, 0.85)' },
          '&:disabled': { backgroundColor: 'rgba(15, 20, 25, 0.50)', color: 'rgba(255,255,255,0.60)' },
        };
      }
      if (variant === 'following') {
        return {
          borderColor: hoveringFollowing ? red[500] : undefined,
          color: hoveringFollowing ? red[500] : undefined,
          '&:hover': {
            backgroundColor: 'rgba(244, 33, 46, 0.10)',
            borderColor: red[500],
          },
        };
      }
      if (variant === 'primary') {
        return {
          backgroundColor: blue[500],
          '&:hover': { backgroundColor: blue[600] },
        };
      }
      if (variant === 'danger') {
        return {
          backgroundColor: red[500],
          '&:hover': { backgroundColor: red[700] },
        };
      }
      return {};
    })();

    return (
      <Button
        ref={ref}
        variant={isCustomVariant ? muiVariant : (variant as ButtonProps['variant'])}
        disabled={disabled || loading}
        onMouseEnter={() => variant === 'following' && setHoveringFollowing(true)}
        onMouseLeave={() => variant === 'following' && setHoveringFollowing(false)}
        sx={{
          position:    'relative',
          borderRadius: borderRadius.full,
          ...customSx,
          // Loading state — keep same height, hide text, show spinner
          ...(loading && {
            color:           'transparent !important',
            pointerEvents:   'none',
          }),
          ...sx,
        }}
        {...rest}
      >
        {/* Spinner overlay */}
        {loading && (
          <Box
            sx={{
              position:        'absolute',
              top:             '50%',
              left:            '50%',
              transform:       'translate(-50%, -50%)',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
            }}
          >
            <CircularProgress
              size={16}
              thickness={3}
              sx={{
                color: variant === 'follow' || variant === 'primary' || variant === 'danger'
                  ? '#ffffff'
                  : blue[500],
              }}
            />
          </Box>
        )}

        {/* Label — visually hidden when loading but DOM-present for width */}
        {variant === 'following' && hoveringFollowing ? 'Unfollow' : children}
      </Button>
    );
  },
);
