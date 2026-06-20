/**
 * UserCard
 *
 * The "Who to follow" card that appears in Twitter's right sidebar.
 * Also used for profile previews in hover cards.
 *
 * Layout spec (from twitter.com):
 *   - Padding: 12px 16px
 *   - Avatar: 40×40px
 *   - Display name: 15px / 700
 *   - Handle: 15px / 400 / secondary colour
 *   - Bio (optional): 13px / 400
 *   - Follow button: right-aligned, height 34px (small)
 */
import {
  Box,
  Avatar,
  Typography,
  useTheme,
  type SxProps,
  type Theme,
} from '@mui/material';
import { TwitterButton } from './TwitterButton';
import { blue } from '@twitter-ds/tokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface UserCardProps {
  displayName: string;
  handle: string;
  avatarSrc?: string;
  bio?: string;
  verified?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  /** Click on the name/avatar area */
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

// ---------------------------------------------------------------------------
// VerifiedBadge (inline SVG — no icon package dependency)
// ---------------------------------------------------------------------------
function VerifiedBadge() {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      aria-label="Verified account"
      sx={{ width: 16, height: 16, ml: '2px', flexShrink: 0, color: blue[500] }}
    >
      <path
        fill="currentColor"
        d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91C1.88 9.33 1 10.57 1 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.66 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.33-2.19c1.4.46 2.91.2 3.92-.81s1.26-2.52.8-3.91C21.37 14.67 22.25 13.43 22.25 12zm-13.07 4.27l-3.56-3.56 1.41-1.41 2.15 2.15 5.65-5.66 1.41 1.41-7.06 7.07z"
      />
    </Box>
  );
}

// ---------------------------------------------------------------------------
// UserCard
// ---------------------------------------------------------------------------
export function UserCard({
  displayName,
  handle,
  avatarSrc,
  bio,
  verified = false,
  isFollowing = false,
  onFollow,
  onUnfollow,
  onClick,
  sx,
}: UserCardProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display:         'flex',
        alignItems:      'flex-start',
        gap:             '12px',
        padding:         '12px 16px',
        width:           '100%',
        transition:      'background-color 150ms ease-in-out',
        '&:hover':       { backgroundColor: theme.palette.action.hover },
        cursor:          onClick ? 'pointer' : 'default',
        '&:focus-visible': {
          outline:       `2px solid ${blue[500]}`,
          outlineOffset: '-2px',
        },
        ...sx,
      }}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) onClick();
      }}
    >
      {/* Avatar */}
      <Avatar
        src={avatarSrc}
        alt={displayName}
        sx={{ width: 40, height: 40, flexShrink: 0, border: 'none' }}
      >
        {displayName[0]}
      </Avatar>

      {/* Name + handle + bio */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: '1px' }}>
          <Typography
            sx={{
              fontSize:       '15px',
              fontWeight:     700,
              color:          theme.palette.text.primary,
              lineHeight:     1.3,
              overflow:       'hidden',
              textOverflow:   'ellipsis',
              whiteSpace:     'nowrap',
              '&:hover':      { textDecoration: 'underline' },
            }}
          >
            {displayName}
          </Typography>
          {verified && <VerifiedBadge />}
        </Box>

        <Typography
          sx={{
            fontSize:     '15px',
            fontWeight:   400,
            color:        theme.palette.text.secondary,
            lineHeight:   1.3,
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            whiteSpace:   'nowrap',
          }}
        >
          {handle}
        </Typography>

        {bio && (
          <Typography
            sx={{
              fontSize:   '13px',
              fontWeight: 400,
              color:      theme.palette.text.primary,
              lineHeight: 1.4,
              mt:         '4px',
              // Two-line clamp
              display:          '-webkit-box',
              WebkitLineClamp:  2,
              WebkitBoxOrient:  'vertical',
              overflow:         'hidden',
            }}
          >
            {bio}
          </Typography>
        )}
      </Box>

      {/* Follow / Following button */}
      <Box
        sx={{ flexShrink: 0, ml: '8px', alignSelf: 'center' }}
        onClick={(e) => e.stopPropagation()}
      >
        <TwitterButton
          variant={isFollowing ? 'following' : 'follow'}
          size="small"
          onClick={isFollowing ? onUnfollow : onFollow}
          aria-label={isFollowing ? `Unfollow ${displayName}` : `Follow ${displayName}`}
          sx={{ minWidth: 0, px: '16px', height: '34px', fontSize: '14px' }}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </TwitterButton>
      </Box>
    </Box>
  );
}
