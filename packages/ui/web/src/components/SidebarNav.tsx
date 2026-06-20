/**
 * SidebarNav
 *
 * Twitter/X left sidebar navigation shell.
 * Responsive: full labels on lg+, icon-only on md, hidden on sm-.
 *
 * Layout spec:
 *   - Width: 275px (lg+), 88px (md)
 *   - Nav item height: 52px
 *   - Nav item border-radius: 9999px (pill)
 *   - Active item: bold text, no background
 *   - Hover: semi-transparent bg fill
 *   - Twitter logo: 34×34px
 *   - Tweet button: full-width on lg+, 52×52px circle on md
 */
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  type SxProps,
  type Theme,
} from "@mui/material";
import { TwitterButton } from "./TwitterButton";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface SidebarNavItem {
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  label: string;
  href?: string;
  badge?: number;
  active?: boolean;
  onClick?: () => void;
}

export interface SidebarNavProps {
  items: SidebarNavItem[];
  onTweet?: () => void;
  tweetLabel?: string;
  /** Slot for the user account switcher at the bottom */
  accountSlot?: React.ReactNode;
  sx?: SxProps<Theme>;
}

// ---------------------------------------------------------------------------
// Twitter logo (X / Bird)
// ---------------------------------------------------------------------------
function XLogo() {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      aria-label="X (Twitter)"
      sx={{ width: 30, height: 30 }}
    >
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </Box>
  );
}

// ---------------------------------------------------------------------------
// NavItem
// ---------------------------------------------------------------------------
interface NavItemProps {
  item: SidebarNavItem;
  compact: boolean;
}

function NavItem({ item, compact }: NavItemProps) {
  const theme = useTheme();

  return (
    <Box
      component={item.href ? "a" : "div"}
      href={item.href}
      onClick={item.onClick}
      role={item.href ? undefined : "button"}
      tabIndex={0}
      aria-current={item.active ? "page" : undefined}
      aria-label={compact ? item.label : undefined}
      onKeyDown={(e: React.KeyboardEvent) => {
        if ((e.key === "Enter" || e.key === " ") && item.onClick)
          item.onClick();
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: compact ? "12px" : "12px 12px",
        borderRadius: "9999px",
        cursor: "pointer",
        textDecoration: "none",
        color: theme.palette.text.primary,
        width: compact ? "fit-content" : "100%",
        transition: "background-color 150ms ease-in-out",
        position: "relative",

        "&:hover": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(247, 249, 249, 0.10)"
              : "rgba(15, 20, 25, 0.10)",
        },
        "&:focus-visible": {
          outline: `2px solid ${blue[500]}`,
          outlineOffset: "2px",
        },
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 26,
          height: 26,
          flexShrink: 0,
          "& svg": { width: 26, height: 26 },
          position: "relative",
        }}
      >
        {item.active ? (item.activeIcon ?? item.icon) : item.icon}

        {/* Badge */}
        {item.badge !== undefined && item.badge > 0 && (
          <Box
            aria-label={`${item.badge} notifications`}
            sx={{
              position: "absolute",
              top: -4,
              right: -4,
              minWidth: 18,
              height: 18,
              borderRadius: "9999px",
              backgroundColor: blue[500],
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
            }}
          >
            {item.badge > 99 ? "99+" : item.badge}
          </Box>
        )}
      </Box>

      {/* Label — hidden in compact mode */}
      {!compact && (
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: item.active ? 700 : 400,
            lineHeight: 1.3,
            color: "inherit",
          }}
        >
          {item.label}
        </Typography>
      )}
    </Box>
  );
}

// ---------------------------------------------------------------------------
// SidebarNav
// ---------------------------------------------------------------------------
export function SidebarNav({
  items,
  onTweet,
  tweetLabel = "Post",
  accountSlot,
  sx,
}: SidebarNavProps) {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <Box
      component="nav"
      aria-label="Main navigation"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: compact ? "center" : "flex-start",
        height: "100%",
        padding: "0 12px",
        width: compact ? 88 : 275,
        flexShrink: 0,
        ...sx,
      }}
    >
      {/* X Logo */}
      <Box
        sx={{
          padding: "12px",
          borderRadius: "9999px",
          mb: "4px",
          mt: "4px",
          cursor: "pointer",
          color: theme.palette.text.primary,
          transition: "background-color 150ms ease-in-out",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(247, 249, 249, 0.10)"
                : "rgba(15, 20, 25, 0.10)",
          },
          "&:focus-visible": {
            outline: `2px solid ${blue[500]}`,
            outlineOffset: "2px",
          },
        }}
        tabIndex={0}
        role="link"
        aria-label="Go to home"
      >
        <XLogo />
      </Box>

      {/* Nav items */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          width: "100%",
          alignItems: compact ? "center" : "flex-start",
          flex: 1,
        }}
      >
        {items.map((item) => (
          <NavItem key={item.label} item={item} compact={compact} />
        ))}

        {/* Tweet / Post button */}
        {onTweet && (
          <Box sx={{ mt: "16px", width: compact ? "auto" : "100%" }}>
            {compact ? (
              // Round button (icon only)
              <Box
                onClick={onTweet}
                role="button"
                tabIndex={0}
                aria-label={tweetLabel}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") onTweet();
                }}
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "9999px",
                  backgroundColor: blue[500],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background-color 150ms ease-in-out",
                  "&:hover": { backgroundColor: "#1A91DA" },
                  "&:focus-visible": {
                    outline: `2px solid ${blue[500]}`,
                    outlineOffset: "3px",
                  },
                  "& svg": { width: 24, height: 24, color: "#fff" },
                }}
              >
                {/* Compose icon */}
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-4.339 1.148-8.469 3.95-11.45C14.62 7.421 17.38 5.1 23 5V3z" />
                  <path d="M22 5.5c-3.43.14-6.77 1.78-9.13 4.34C10.3 12.57 9 15.62 9 18.8V22h2v-3.2c0-2.67 1.1-5.2 3.13-7.4C16.4 9.18 19.23 7.64 22 7.5V5.5z" />
                  <path d="M21 8c-2.84.16-5.59 1.59-7.58 3.84C11.52 14.07 10.5 16.6 10.5 19.3V22H12v-2.7c0-2.26.85-4.41 2.42-6.24C16.2 11.23 18.63 9.92 21 9.83V8z" />
                </svg>
              </Box>
            ) : (
              <TwitterButton
                variant="primary"
                onClick={onTweet}
                fullWidth
                sx={{ height: 52, fontSize: "17px", fontWeight: 800 }}
              >
                {tweetLabel}
              </TwitterButton>
            )}
          </Box>
        )}
      </Box>

      {/* Account switcher slot */}
      {accountSlot && (
        <Box sx={{ width: "100%", pb: "12px", mt: "auto" }}>{accountSlot}</Box>
      )}
    </Box>
  );
}
