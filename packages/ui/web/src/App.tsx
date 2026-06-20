/**
 * Demo App — Twitter/X Home Feed layout
 *
 * Shows the full three-column layout:
 *   Left: SidebarNav
 *   Center: Feed (composer + tweets)
 *   Right: Search + Who to Follow + Trends
 */
import { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
  InputBase,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import AppTheme, { useColorMode } from '@twitter-ds/theme';
import {
  TweetCard,
  TweetComposer,
  TweetSkeleton,
  TwitterButton,
  UserCard,
  SidebarNav,
  type TweetCardProps,
  type SidebarNavItem,
} from '@twitter-ds/ui';
import { blue } from '@twitter-ds/tokens';

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------
const SEED_TWEETS: TweetCardProps[] = [
  {
    displayName: 'Andrej Karpathy',
    handle: '@karpathy',
    timestamp: '2h',
    verified: true,
    text: 'The bitter lesson is one of the most important insights in ML. General methods that leverage computation will always win in the long run.\n\nBut there is a second bitter lesson: you also need good data.',
    actions: [
      { type: 'reply',   icon: <ReplyIcon   />, label: 'Reply',    count: 84  },
      { type: 'retweet', icon: <RetweetIcon />, label: 'Retweet',  count: 312 },
      { type: 'like',    icon: <LikeIcon    />, label: 'Like',     count: 2100 },
      { type: 'share',   icon: <ShareIcon   />, label: 'Share' },
    ],
  },
  {
    displayName: 'Vercel',
    handle: '@vercel',
    timestamp: '4h',
    verified: true,
    text: 'Next.js 15 is here.\n\n- Async Request APIs\n- Caching semantics update\n- React 19 support\n- Turbopack stable\n\nFaster, smarter, more predictable.',
    actions: [
      { type: 'reply',   icon: <ReplyIcon   />, label: 'Reply',   count: 224  },
      { type: 'retweet', icon: <RetweetIcon />, label: 'Retweet', count: 1500 },
      { type: 'like',    icon: <LikeIcon    />, label: 'Like',    count: 9800 },
      { type: 'share',   icon: <ShareIcon   />, label: 'Share' },
    ],
  },
  {
    displayName: 'Dan Abramov',
    handle: '@dan_abramov',
    timestamp: '6h',
    text: 'One of the most confusing things about React Compiler is that it doesn\'t actually "compile" React in any meaningful sense — it compiles your *JavaScript* to avoid redundant re-renders.',
    actions: [
      { type: 'reply',   icon: <ReplyIcon   />, label: 'Reply',   count: 156 },
      { type: 'retweet', icon: <RetweetIcon />, label: 'Retweet', count: 430 },
      { type: 'like',    icon: <LikeIcon    />, label: 'Like',    count: 3400 },
      { type: 'share',   icon: <ShareIcon   />, label: 'Share' },
    ],
  },
];

const WHO_TO_FOLLOW = [
  { displayName: 'Theo', handle: '@t3dotgg', verified: true, bio: 'Filmmaker → Twitch → Startups. Building upload.io. Very online.' },
  { displayName: 'Lee Robinson', handle: '@leeerob', verified: true, bio: 'VP Product at Vercel. React, Next.js, and developer experience.' },
  { displayName: 'Josh W. Comeau', handle: '@JoshWComeau', bio: 'Teaching developers to love CSS again. Creator of css-for-js.dev.' },
];

const TRENDS = [
  { category: 'Technology · Trending', topic: 'React Compiler', tweets: '14.2K' },
  { category: 'Trending in Tech', topic: 'Next.js 15', tweets: '8.5K' },
  { category: 'AI · Trending', topic: 'Claude 3.5', tweets: '32.1K' },
  { category: 'Trending worldwide', topic: 'TypeScript 5.5', tweets: '6.8K' },
];

// ---------------------------------------------------------------------------
// Icon components (inline SVG — no @mui/icons-material dep for demo)
// ---------------------------------------------------------------------------
function ReplyIcon()   { return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/></svg>; }
function RetweetIcon() { return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/></svg>; }
function LikeIcon()    { return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/></svg>; }
function ShareIcon()   { return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"/></svg>; }
function HomeIcon()    { return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.58 7.35L12.475 1.897c-.297-.16-.653-.16-.95 0L1.425 7.35c-.486.264-.667.87-.405 1.356.18.335.525.525.88.525.16 0 .324-.038.475-.12l.734-.396 1.59 11.25c.216 1.214 1.31 2.062 2.66 2.062h9.282c1.35 0 2.444-.848 2.662-2.088l1.588-11.225.737.398c.485.263 1.092.082 1.354-.404.263-.485.083-1.092-.404-1.356zM12 15.435c-1.895 0-3.438-1.54-3.438-3.436 0-1.895 1.543-3.44 3.438-3.44 1.895 0 3.438 1.545 3.438 3.44 0 1.896-1.543 3.436-3.438 3.436z"/></svg>; }
function ExploreIcon() { return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5 4.694 0 8.5 3.806 8.5 8.5 0 1.986-.682 3.815-1.814 5.262l4.276 4.276-1.414 1.414-4.276-4.276C13.815 19.818 11.986 20.5 10.25 20.5c-4.694 0-8.5-3.806-8.5-8.5z"/></svg>; }
function BellIcon()    { return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.996 2c-4.62 0-8.37 3.75-8.37 8.37v.03c0 1.83-.48 3.63-1.39 5.2L.58 18.35c-.22.37-.23.84-.02 1.22s.61.63 1.04.63h20.76c.43 0 .83-.25 1.04-.63.21-.38.2-.85-.02-1.22l-1.66-2.75c-.91-1.51-1.39-3.23-1.39-4.98v-.67C20.35 5.75 16.61 2 12 2h-.004zm0 2c3.52 0 6.37 2.85 6.37 6.37v.67c0 2.09.57 4.13 1.63 5.93l.44.73H4.55l.43-.73c1.07-1.8 1.63-3.83 1.63-5.9v-.67C6.61 6.88 9.46 4 12.00 4l-.004 0zm0 18c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"/></svg>; }
function MsgIcon()     { return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5V15.5c0 1.381-1.119 2.5-2.5 2.5h-6.5l-6 4.5V18h-2.5c-1.381 0-2.5-1.119-2.5-2.5V5.5zm2.5-.5c-.276 0-.5.224-.5.5V15.5c0 .276.224.5.5.5h4.5v2.5l3.75-2.5H19.5c.276 0 .5-.224.5-.5V5.5c0-.276-.224-.5-.5-.5H4.498z"/></svg>; }
function ProfileIcon() { return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4z"/></svg>; }
function MoonIcon()    { return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.1 2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10c0-.3 0-.6-.1-.9-1 1.1-2.4 1.9-4 1.9-3 0-5.5-2.5-5.5-5.5 0-1.5.6-2.9 1.6-3.9-.5-.1-1.3-.6-2-.6z"/></svg>; }
function SunIcon()     { return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/></svg>; }

// ---------------------------------------------------------------------------
// Inner App (needs access to useColorMode hook → must be inside AppTheme)
// ---------------------------------------------------------------------------
function InnerApp() {
  const theme = useTheme();
  const { mode, toggleMode } = useColorMode();
  const isDark = mode === 'dark';
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.up('md'));

  const [activeTab, setActiveTab] = useState(0);
  const [tweets, setTweets] = useState<TweetCardProps[]>(SEED_TWEETS);
  const [following, setFollowing] = useState<Record<string, boolean>>({});

  const handleTweet = useCallback(async (text: string) => {
    // Simulate network delay
    await new Promise<void>((r) => setTimeout(r, 600));
    const newTweet: TweetCardProps = {
      displayName: 'You',
      handle: '@you',
      timestamp: 'now',
      text,
      actions: [
        { type: 'reply',   icon: <ReplyIcon   />, label: 'Reply',   count: 0 },
        { type: 'retweet', icon: <RetweetIcon />, label: 'Retweet', count: 0 },
        { type: 'like',    icon: <LikeIcon    />, label: 'Like',    count: 0 },
        { type: 'share',   icon: <ShareIcon   />, label: 'Share' },
      ],
    };
    setTweets((prev) => [newTweet, ...prev]);
  }, []);

  const navItems: SidebarNavItem[] = [
    { label: 'Home',          icon: <HomeIcon    />, active: true  },
    { label: 'Explore',       icon: <ExploreIcon />                },
    { label: 'Notifications', icon: <BellIcon    />, badge: 3      },
    { label: 'Messages',      icon: <MsgIcon     />               },
    { label: 'Profile',       icon: <ProfileIcon />               },
  ];

  return (
    <Box
      sx={{
        display:         'flex',
        justifyContent:  'center',
        minHeight:       '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Left sidebar                                                         */}
      {/* ------------------------------------------------------------------ */}
      {isMediumScreen && (
        <Box
          sx={{
            position:  'sticky',
            top:       0,
            height:    '100vh',
            display:   'flex',
            flexDirection: 'column',
          }}
        >
          <SidebarNav
            items={navItems}
            onTweet={() => {}}
            accountSlot={
              <Box
                sx={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          '12px',
                  padding:      '12px',
                  borderRadius: '9999px',
                  cursor:       'pointer',
                  transition:   'background-color 150ms ease-in-out',
                  '&:hover':    { backgroundColor: theme.palette.action.hover },
                }}
              >
                <Box
                  sx={{
                    width:          40,
                    height:         40,
                    borderRadius:   '50%',
                    backgroundColor: blue[500],
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    color:          '#fff',
                    fontWeight:     700,
                    fontSize:       '15px',
                    flexShrink:     0,
                  }}
                >
                  Y
                </Box>
                {isLargeScreen && (
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: '15px', fontWeight: 700, color: theme.palette.text.primary, lineHeight: 1.3 }}>You</Typography>
                    <Typography sx={{ fontSize: '13px', color: theme.palette.text.secondary, lineHeight: 1.3 }}>@you</Typography>
                  </Box>
                )}
              </Box>
            }
          />
        </Box>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Center feed                                                          */}
      {/* ------------------------------------------------------------------ */}
      <Box
        component="main"
        sx={{
          flex:        1,
          maxWidth:    600,
          minWidth:    0,
          borderLeft:  `1px solid ${theme.palette.divider}`,
          borderRight: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Feed header */}
        <Box
          sx={{
            position:        'sticky',
            top:             0,
            zIndex:          1100,
            backgroundColor: isDark
              ? 'rgba(21, 32, 43, 0.85)'
              : 'rgba(255, 255, 255, 0.85)',
            backdropFilter:       'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom:         `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box
            sx={{
              display:    'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px:         '16px',
              pt:         '8px',
            }}
          >
            <Typography sx={{ fontSize: '20px', fontWeight: 800 }}>Home</Typography>

            {/* Dark/light toggle */}
            <IconButton
              onClick={toggleMode}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              size="small"
              sx={{ color: theme.palette.text.secondary }}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </IconButton>
          </Box>

          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v as number)}
            aria-label="Feed tabs"
          >
            <Tab label="For you" id="tab-0" aria-controls="feed-0" />
            <Tab label="Following" id="tab-1" aria-controls="feed-1" />
          </Tabs>
        </Box>

        {/* Composer */}
        <TweetComposer
          placeholder="What's happening?"
          onSubmit={handleTweet}
          submitLabel="Post"
        />

        {/* Tweet feed */}
        <Box role="feed" aria-label="Tweet feed">
          {tweets.map((tweet, i) => (
            <TweetCard key={i} {...tweet} onClick={() => {}} />
          ))}
        </Box>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Right sidebar — only on lg+                                          */}
      {/* ------------------------------------------------------------------ */}
      {isLargeScreen && (
        <Box
          sx={{
            width:     350,
            flexShrink: 0,
            padding:   '12px 20px',
            position:  'sticky',
            top:       0,
            height:    '100vh',
            overflowY: 'auto',
            '&::-webkit-scrollbar': { width: 0 },
          }}
        >
          {/* Search bar */}
          <Paper
            elevation={0}
            sx={{
              display:      'flex',
              alignItems:   'center',
              borderRadius: '9999px',
              backgroundColor: isDark ? '#202327' : '#EFF3F4',
              px:           '16px',
              py:           '6px',
              mb:           '16px',
              gap:          '12px',
              '&:focus-within': {
                backgroundColor: theme.palette.background.default,
                outline: `1px solid ${blue[500]}`,
              },
            }}
          >
            <Box sx={{ color: theme.palette.text.secondary, display: 'flex', '& svg': { width: 18, height: 18 } }}>
              <ExploreIcon />
            </Box>
            <InputBase
              placeholder="Search"
              fullWidth
              inputProps={{ 'aria-label': 'Search Twitter' }}
              sx={{
                fontSize: '15px',
                color:    theme.palette.text.primary,
                '& input::placeholder': { color: theme.palette.text.secondary, opacity: 1 },
              }}
            />
          </Paper>

          {/* What's happening */}
          <Paper
            elevation={0}
            sx={{
              borderRadius:    '16px',
              border:          `1px solid ${theme.palette.divider}`,
              overflow:        'hidden',
              mb:              '16px',
            }}
          >
            <Typography sx={{ fontSize: '20px', fontWeight: 800, p: '12px 16px' }}>
              What's happening
            </Typography>
            {TRENDS.map((trend, i) => (
              <Box
                key={i}
                sx={{
                  px:         '16px',
                  py:         '12px',
                  cursor:     'pointer',
                  transition: 'background-color 150ms ease-in-out',
                  '&:hover':  { backgroundColor: theme.palette.action.hover },
                  borderTop:  i > 0 ? `1px solid ${theme.palette.divider}` : 'none',
                }}
              >
                <Typography sx={{ fontSize: '13px', color: theme.palette.text.secondary, mb: '2px' }}>
                  {trend.category}
                </Typography>
                <Typography sx={{ fontSize: '15px', fontWeight: 700, mb: '2px' }}>
                  {trend.topic}
                </Typography>
                <Typography sx={{ fontSize: '13px', color: theme.palette.text.secondary }}>
                  {trend.tweets} posts
                </Typography>
              </Box>
            ))}
          </Paper>

          {/* Who to follow */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              border:       `1px solid ${theme.palette.divider}`,
              overflow:     'hidden',
            }}
          >
            <Typography sx={{ fontSize: '20px', fontWeight: 800, p: '12px 16px' }}>
              Who to follow
            </Typography>
            {WHO_TO_FOLLOW.map((user) => (
              <Box key={user.handle} sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
                <UserCard
                  displayName={user.displayName}
                  handle={user.handle}
                  verified={user.verified}
                  bio={user.bio}
                  isFollowing={following[user.handle] ?? false}
                  onFollow={() => setFollowing((f) => ({ ...f, [user.handle]: true }))}
                  onUnfollow={() => setFollowing((f) => ({ ...f, [user.handle]: false }))}
                />
              </Box>
            ))}
          </Paper>
        </Box>
      )}
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Root — wraps with AppTheme
// ---------------------------------------------------------------------------
export default function App() {
  return (
    <AppTheme defaultMode="light">
      <InnerApp />
    </AppTheme>
  );
}
