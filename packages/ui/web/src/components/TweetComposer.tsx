/**
 * TweetComposer
 *
 * The compose tweet input used in the Home feed and the "What's happening?" area.
 *
 * Layout spec:
 *   - Outer: 12px 16px padding, bottom border
 *   - Avatar: 40×40px, aligns to first line of textarea
 *   - Textarea: auto-grow, 17px, no border, transparent bg
 *   - Placeholder: "What's happening?" / "Post your reply"
 *   - Divider above the toolbar
 *   - Character counter: red ring when ≤20 remaining, filled red at 0
 *   - Tweet button: disabled until text > 0 and ≤ 280 chars
 */
import {
  Box,
  Avatar,
  Typography,
  Divider,
  CircularProgress,
  useTheme,
  type SxProps,
  type Theme,
} from '@mui/material';
import {
  useState,
  useRef,
  useCallback,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import { TwitterButton } from './TwitterButton';
import { blue, red } from '@twitter-ds/tokens';

const MAX_CHARS = 280;
const WARN_THRESHOLD = 20; // show counter in orange below this
const DANGER_THRESHOLD = 0; // show counter in red at or below this

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface TweetComposerProps {
  /** Author's avatar URL */
  avatarSrc?: string;
  /** Author display name — used for aria-label */
  authorName?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Initial value */
  defaultValue?: string;
  /** Called with the final tweet text when submitted */
  onSubmit?: (text: string) => void | Promise<void>;
  /** Label for the submit button */
  submitLabel?: string;
  /** Show/hide the toolbar (media, gif, poll, etc.) */
  showToolbar?: boolean;
  sx?: SxProps<Theme>;
}

// ---------------------------------------------------------------------------
// CharacterCounter — the circular progress ring + number
// ---------------------------------------------------------------------------
interface CharCounterProps { remaining: number }
function CharCounter({ remaining }: CharCounterProps) {
  const pct = Math.max(0, (MAX_CHARS - Math.max(0, -remaining)) / MAX_CHARS) * 100;
  const isWarning = remaining <= WARN_THRESHOLD && remaining > DANGER_THRESHOLD;
  const isDanger  = remaining <= DANGER_THRESHOLD;
  const color     = isDanger ? red[500] : isWarning ? '#FFAD1F' : blue[500];

  return (
    <Box
      sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      aria-label={`${remaining} characters remaining`}
    >
      {/* Background track */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={22}
        thickness={2.5}
        sx={{ color: 'divider', position: 'absolute' }}
      />
      {/* Foreground progress */}
      <CircularProgress
        variant="determinate"
        value={Math.min(100, pct)}
        size={22}
        thickness={2.5}
        sx={{ color }}
      />
      {/* Numeric label — only visible in warning zone */}
      {remaining <= WARN_THRESHOLD && (
        <Typography
          sx={{
            position:  'absolute',
            fontSize:  '11px',
            fontWeight: 700,
            color,
            lineHeight: 1,
          }}
          aria-hidden
        >
          {remaining < 0 ? remaining : remaining <= 20 ? remaining : ''}
        </Typography>
      )}
    </Box>
  );
}

// ---------------------------------------------------------------------------
// TweetComposer
// ---------------------------------------------------------------------------
export function TweetComposer({
  avatarSrc,
  authorName = 'You',
  placeholder = "What's happening?",
  defaultValue = '',
  onSubmit,
  submitLabel = 'Post',
  showToolbar = true,
  sx,
}: TweetComposerProps) {
  const theme = useTheme();
  const [text, setText] = useState(defaultValue);
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const remaining = MAX_CHARS - text.length;
  const canSubmit  = text.trim().length > 0 && remaining >= 0 && !submitting;

  // Auto-resize the textarea
  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    setText(el.value);
    // Reset height so shrinking works
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl + Enter to submit
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && canSubmit) {
      handleSubmit();
    }
  }, [canSubmit, text]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await onSubmit?.(text.trim());
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, onSubmit, text]);

  return (
    <Box
      sx={{
        display:      'flex',
        flexDirection: 'row',
        gap:           '12px',
        padding:       '12px 16px',
        borderBottom:  `1px solid ${theme.palette.divider}`,
        width:         '100%',
        ...sx,
      }}
    >
      {/* Avatar */}
      <Box sx={{ flexShrink: 0, pt: '4px' }}>
        <Avatar
          src={avatarSrc}
          alt={authorName}
          sx={{ width: 40, height: 40, border: 'none' }}
        >
          {authorName[0]}
        </Avatar>
      </Box>

      {/* Composer body */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Textarea */}
        <Box
          component="textarea"
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={placeholder}
          rows={1}
          maxLength={MAX_CHARS + 50} // allow over-limit so user sees they're over
          sx={{
            width:           '100%',
            minHeight:       '52px',
            border:          'none',
            outline:         'none',
            resize:          'none',
            backgroundColor: 'transparent',
            fontSize:        '20px',
            fontWeight:      400,
            lineHeight:      1.4,
            color:           theme.palette.text.primary,
            fontFamily:      theme.typography.fontFamily,
            overflow:        'hidden',
            pt:              '12px',
            pb:              '4px',
            '&::placeholder': {
              color:  theme.palette.text.secondary,
              opacity: 1,
            },
          }}
        />

        {/* ---------------------------------------------------------------- */}
        {/* Toolbar                                                          */}
        {/* ---------------------------------------------------------------- */}
        {showToolbar && (
          <>
            <Divider sx={{ my: '4px' }} />
            <Box
              sx={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                pt:             '4px',
              }}
            >
              {/* Placeholder for media/emoji buttons — consumers add their own */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', color: blue[500] }}>
                {/* Toolbar icon slots — pass children or use default empty state */}
              </Box>

              {/* Right side: counter + submit */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {text.length > 0 && (
                  <>
                    <CharCounter remaining={remaining} />
                    <Divider orientation="vertical" flexItem sx={{ height: '28px', alignSelf: 'center' }} />
                  </>
                )}

                <TwitterButton
                  variant="primary"
                  size="small"
                  disabled={!canSubmit}
                  loading={submitting}
                  onClick={handleSubmit}
                  aria-label={submitLabel}
                  sx={{ px: '16px', height: '36px', fontSize: '15px', fontWeight: 700 }}
                >
                  {submitLabel}
                </TwitterButton>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
