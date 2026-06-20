/**
 * TweetSkeleton
 *
 * Loading skeleton that matches TweetCard's exact layout.
 * Uses MUI Skeleton with wave animation.
 */
import { Box, Skeleton, useTheme, type SxProps, type Theme } from '@mui/material';

export interface TweetSkeletonProps {
  /** Number of skeleton rows to render in sequence */
  count?: number;
  sx?: SxProps<Theme>;
}

function SingleTweetSkeleton() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display:      'flex',
        flexDirection: 'row',
        gap:           '12px',
        padding:       '12px 16px',
        borderBottom:  `1px solid ${theme.palette.divider}`,
        width:         '100%',
      }}
      aria-hidden="true"
    >
      {/* Avatar */}
      <Skeleton variant="circular" width={40} height={40} sx={{ flexShrink: 0 }} />

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0, pt: '2px' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', gap: '8px', mb: '8px' }}>
          <Skeleton variant="text" width={120} height={18} sx={{ borderRadius: '4px' }} />
          <Skeleton variant="text" width={80}  height={18} sx={{ borderRadius: '4px' }} />
        </Box>

        {/* Tweet body — 2–3 lines */}
        <Skeleton variant="text" width="100%" height={18} sx={{ borderRadius: '4px', mb: '4px' }} />
        <Skeleton variant="text" width="90%"  height={18} sx={{ borderRadius: '4px', mb: '4px' }} />
        <Skeleton variant="text" width="60%"  height={18} sx={{ borderRadius: '4px', mb: '12px' }} />

        {/* Action bar */}
        <Box sx={{ display: 'flex', gap: '32px' }}>
          {[60, 50, 50, 40].map((w, i) => (
            <Skeleton key={i} variant="text" width={w} height={18} sx={{ borderRadius: '4px' }} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export function TweetSkeleton({ count = 3, sx }: TweetSkeletonProps) {
  return (
    <Box sx={sx} role="status" aria-label="Loading tweets">
      {Array.from({ length: count }).map((_, i) => (
        <SingleTweetSkeleton key={i} />
      ))}
    </Box>
  );
}
