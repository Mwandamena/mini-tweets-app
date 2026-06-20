/**
 * TweetCard
 *
 * Pixel-perfect replica of a Twitter/X tweet card.
 * Measurements reverse-engineered from twitter.com production CSS.
 *
 * Layout spec:
 *   - Outer padding: 12px top/bottom, 16px left/right
 *   - Avatar: 40×40px, circular
 *   - Avatar right margin: 12px
 *   - Display name: 15px / 700 / #14171A (light) or #E7E9EA (dark)
 *   - Handle + timestamp: 15px / 400 / #657786
 *   - Tweet text: 15px / 400, line-height 1.5
 *   - Action row: icon 18px, gap text 13px, full row 44px tall hit target
 *   - Action icon hover: 40px circular bg
 */
import {
  Avatar,
  Box,
  IconButton,
  Typography,
  useTheme,
  type SxProps,
  type Theme,
} from '@mui/material';
import { blue } from '@twitter-ds/tokens';

// ---------------------------------------------------------------------------
// Action button colours (Twitter uses per-action tints on hover)
// ---------------------------------------------------------------------------
const actionColors = {
  reply:     { icon: '#657786', hover: 'rgba(29, 161, 242, 0.10)', active: blue[500] },
  retweet:   { icon: '#657786', hover: 'rgba(23, 191, 99, 0.10)',  active: '#17BF63'  },
  like:      { icon: '#657786', hover: 'rgba(244, 33, 46, 0.10)',  active: '#F4212E'  },
  share:     { icon: '#657786', hover: 'rgba(29, 161, 242, 0.10)', active: blue[500] },
  bookmark:  { icon: '#657786', hover: 'rgba(29, 161, 242, 0.10)', active: blue[500] },
} as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface TweetCardAction {
  icon: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  type: keyof typeof actionColors;
  onClick?: () => void;
}

export interface TweetCardMedia {
  src: string;
  alt: string;
  aspectRatio?: '16/9' | '4/3' | '1/1';
}

export interface TweetCardProps {
  /** Author display name */
  displayName: string;
  /** Author @handle — include the @ */
  handle: string;
  /** Author avatar URL */
  avatarSrc?: string;
  /** Relative or absolute timestamp string, e.g. "2h" or "Mar 29" */
  timestamp: string;
  /** Tweet body — supports plain text, links rendered as styled spans */
  text: string;
  /** Optional media attachments */
  media?: TweetCardMedia[];
  /** Action bar buttons */
  actions?: TweetCardAction[];
  /** Whether this tweet is by a verified / blue-check account */
  verified?: boolean;
  /** Whether this is a quoted tweet (indented, rounded border) */
  isQuote?: boolean;
  /** sx override for the root element */
  sx?: SxProps<Theme>;
  /** Click handler for the card body (not actions) */
  onClick?: () => void;
}

// ---------------------------------------------------------------------------
// Verified badge SVG (Twitter blue checkmark)
// ---------------------------------------------------------------------------
function VerifiedBadge() {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      aria-label="Verified account"
      sx={{ width: 18, height: 18, ml: '2px', flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path
        d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91C1.88 9.33 1 10.57 1 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.66 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.33-2.19c1.4.46 2.91.2 3.92-.81s1.26-2.52.8-3.91C21.37 14.67 22.25 13.43 22.25 12zm-13.07 4.27l-3.56-3.56 1.41-1.41 2.15 2.15 5.65-5.66 1.41 1.41-7.06 7.07z"
        fill={blue[500]}
      />
    </Box>
  );
}

// ---------------------------------------------------------------------------
// ActionButton — individual tweet action (reply, like, etc.)
// ---------------------------------------------------------------------------
interface ActionButtonProps {
  action: TweetCardAction;
}

function ActionButton({ action }: ActionButtonProps) {
  const colors = actionColors[action.type];
  const color  = action.active ? colors.active : colors.icon;

  return (
    <Box
      sx={{
        display:     'flex',
        alignItems:  'center',
        gap:         '2px',
        color,
        minWidth:    0,
        '&:hover .action-bg': { backgroundColor: colors.hover },
        '&:hover':   { color: colors.active },
        cursor:      'pointer',
      }}
      onClick={(e) => { e.stopPropagation(); action.onClick?.(); }}
      role="button"
      tabIndex={0}
      aria-label={`${action.label}${action.count !== undefined ? `, ${action.count}` : ''}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); action.onClick?.(); } }}
    >
      {/* Icon wrapper — 36px hit target with circular hover bg */}
      <Box
        className="action-bg"
        sx={{
          width:           36,
          height:          36,
          borderRadius:    '50%',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          transition:      'background-color 150ms ease-in-out',
          flexShrink:      0,
          '& svg':         { width: 18, height: 18 },
        }}
      >
        {action.icon}
      </Box>

      {/* Count */}
      {action.count !== undefined && action.count > 0 && (
        <Typography
          variant="caption"
          sx={{
            fontSize:   '13px',
            fontWeight: 400,
            lineHeight: 1,
            color:      'inherit',
            minWidth:   '16px',
          }}
        >
          {action.count >= 1000
            ? `${(action.count / 1000).toFixed(1)}K`
            : action.count}
        </Typography>
      )}
    </Box>
  );
}

// ---------------------------------------------------------------------------
// TweetCard
// ---------------------------------------------------------------------------
export function TweetCard({
  displayName,
  handle,
  avatarSrc,
  timestamp,
  text,
  media,
  actions,
  verified = false,
  isQuote = false,
  sx,
  onClick,
}: TweetCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      onClick={onClick}
      sx={{
        display:         'flex',
        flexDirection:   'row',
        width:           '100%',
        padding:         isQuote ? '12px' : '12px 16px',
        borderBottom:    isQuote ? 'none' : `1px solid ${theme.palette.divider}`,
        border:          isQuote ? `1px solid ${theme.palette.divider}` : undefined,
        borderRadius:    isQuote ? '16px' : 0,
        backgroundColor: 'inherit',
        cursor:          onClick ? 'pointer' : 'default',
        transition:      'background-color 150ms ease-in-out',
        '&:hover':       onClick
          ? { backgroundColor: isDark ? 'rgba(247,249,249,0.03)' : 'rgba(0,0,0,0.03)' }
          : {},
        // Focus ring for keyboard nav
        '&:focus-visible': {
          outline:       `2px solid ${blue[500]}`,
          outlineOffset: '-2px',
        },
        ...sx,
      }}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'article' : undefined}
      onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && onClick) onClick(); }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Left column — avatar                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ flexShrink: 0, mr: '12px', pt: '2px' }}>
        <Avatar
          src={avatarSrc}
          alt={displayName}
          sx={{
            width:  40,
            height: 40,
            border: 'none', // override theme default so feed avatars have no border
          }}
        >
          {displayName[0]}
        </Avatar>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Right column — header + content + actions                           */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Header row: display name · handle · timestamp */}
        <Box
          sx={{
            display:    'flex',
            alignItems: 'center',
            flexWrap:   'wrap',
            gap:        '0 4px',
            mb:         '2px',
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize:    '15px',
              fontWeight:  700,
              color:       theme.palette.text.primary,
              lineHeight:  1.3,
              '&:hover':   { textDecoration: 'underline', cursor: 'pointer' },
            }}
          >
            {displayName}
          </Typography>

          {verified && <VerifiedBadge />}

          <Typography
            component="span"
            sx={{
              fontSize:   '15px',
              fontWeight: 400,
              color:      theme.palette.text.secondary,
              lineHeight: 1.3,
              flexShrink: 0,
            }}
          >
            {handle}
          </Typography>

          <Typography
            component="span"
            sx={{
              fontSize:   '15px',
              fontWeight: 400,
              color:      theme.palette.text.secondary,
              lineHeight: 1.3,
              flexShrink: 0,
              '&::before': { content: '"·"', mr: '4px' },
            }}
          >
            {timestamp}
          </Typography>
        </Box>

        {/* Tweet body */}
        <Typography
          sx={{
            fontSize:    '15px',
            fontWeight:  400,
            lineHeight:  1.5,
            color:       theme.palette.text.primary,
            whiteSpace:  'pre-wrap',
            wordBreak:   'break-word',
            mb:          media?.length ? '12px' : 0,
          }}
        >
          {text}
        </Typography>

        {/* Media */}
        {media && media.length > 0 && (
          <Box
            sx={{
              mt:           '12px',
              borderRadius: '16px',
              overflow:     'hidden',
              border:       `1px solid ${theme.palette.divider}`,
              // Grid layout for multiple images
              display:      media.length > 1 ? 'grid' : 'block',
              gridTemplateColumns: media.length === 2 ? '1fr 1fr' : media.length === 3 ? '1fr 1fr' : '1fr 1fr',
              gridTemplateRows:    media.length === 3 ? 'auto auto' : undefined,
              gap:                 '2px',
              maxHeight:           '510px',
            }}
          >
            {media.map((m, i) => (
              <Box
                key={i}
                component="img"
                src={m.src}
                alt={m.alt}
                sx={{
                  width:      '100%',
                  height:     '100%',
                  objectFit:  'cover',
                  display:    'block',
                  aspectRatio: media.length === 1 ? (m.aspectRatio ?? '16/9') : '1/1',
                  // Third image in a 3-image grid spans full width on second row
                  ...(media.length === 3 && i === 2 && { gridColumn: '1 / -1', aspectRatio: '2/1' }),
                }}
              />
            ))}
          </Box>
        )}

        {/* Action bar */}
        {actions && actions.length > 0 && (
          <Box
            sx={{
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'space-between',
              mt:              '4px',
              mx:              '-8px', // visually align icons to content edge
              maxWidth:        '425px',
            }}
          >
            {actions.map((action) => (
              <ActionButton key={action.type} action={action} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
