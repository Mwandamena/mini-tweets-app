"use client";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import {
  BellIcon,
  BookmarkSimpleIcon,
  ChatTeardropDotsIcon,
  DotsThreeOutlineIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  UserIcon,
  UserPlusIcon,
} from "@phosphor-icons/react";
import { theme } from "@/theme/theme.material";
import { RiQuillPenLine } from "react-icons/ri";
import { useUIStore } from "@/store/ui.store";
import AppMenu from "../global/menu";
import AccountOptions from "./account.options";

// desktop
const DesktopSidebar = () => {
  // post modal
  const { openPostModal } = useUIStore();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "end",
        height: "100vh",
        borderRight: "1px solid",
        borderColor: "divider",
        pt: 2,
        px: 0.7,
        pb: 2,
        width: "100%",
      }}
    >
      <Stack
        width={180}
        spacing={1}
        direction={"column"}
        alignItems={"start"}
        justifyContent={"space-between"}
      >
        {/* logo */}
        <IconButton size="medium" sx={{ ml: 2, display: "block" }}>
          <Image
            src="/twitter-logo.svg"
            alt="Twitter Logo"
            width={35}
            height={35}
          />
        </IconButton>
        <Button
          href="/"
          startIcon={<HouseIcon size={32} weight="fill" />}
          size="medium"
        >
          Home
        </Button>
        <Button
          href="/explore"
          startIcon={<MagnifyingGlassIcon size={32} />}
          size="medium"
        >
          Explore
        </Button>
        <Button
          href="/notifications"
          startIcon={<BellIcon size={32} />}
          size="medium"
        >
          Notifications
        </Button>
        <Button
          href="/follow"
          startIcon={<UserPlusIcon size={32} />}
          size="medium"
        >
          Follow
        </Button>
        <Button startIcon={<ChatTeardropDotsIcon size={32} />} size="medium">
          Chat
        </Button>
        <Button
          href="/bookmarks"
          startIcon={<BookmarkSimpleIcon size={32} />}
          size="medium"
        >
          Bookmarks
        </Button>
        <Button startIcon={<UserIcon size={32} />} size="medium">
          Profile
        </Button>
        <Button
          variant="contained"
          startIcon={<RiQuillPenLine />}
          size="medium"
          onClick={openPostModal}
        >
          Post
        </Button>
      </Stack>

      {/* profile options */}
      <Stack
        width={180}
        sx={{ pt: 2, px: 0.7 }}
        spacing={1}
        direction={"column"}
        alignItems={"start"}
        justifyContent={"space-between"}
      >
        <AppMenu
          trigger={(open) => (
            <Button
              fullWidth
              size="medium"
              sx={{ justifyContent: "space-between", px: 0.5 }}
              onClick={open}
            >
              <Avatar src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250" />
              <Stack direction={"column"} textAlign={"start"}>
                <Typography variant="body1" noWrap fontWeight={600}>
                  John Doe
                </Typography>
                <Typography variant="body2">@doe</Typography>
              </Stack>
              <DotsThreeOutlineIcon size={24} />
            </Button>
          )}
        >
          {(close) => <AccountOptions />}
        </AppMenu>
      </Stack>
    </Box>
  );
};

// mobile
const MobileSidebar = () => {
  // post modal
  const { openPostModal } = useUIStore();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "end",
        height: "100vh",
        borderRight: "1px solid",
        borderColor: "divider",
        pt: 2,
        pb: 2,
      }}
    >
      <Stack
        width={"100%"}
        spacing={1}
        direction={"column"}
        alignItems={"start"}
        justifyContent={"space-between"}
        sx={{ fontSize: "15px" }}
      >
        {/* logo */}
        <IconButton size="medium" sx={{ ml: 2, display: "block" }}>
          <Image
            src="/twitter-logo.svg"
            alt="Twitter Logo"
            width={35}
            height={35}
          />
        </IconButton>

        {/* Nav Buttons */}
        <IconButton href="/" size="medium">
          <HouseIcon size={30} weight="fill" />
        </IconButton>
        <IconButton href="/explore" size="medium">
          <MagnifyingGlassIcon size={30} />
        </IconButton>
        <IconButton href="/notifications" size="medium">
          <BellIcon size={30} />
        </IconButton>
        <IconButton href="/follow" size="medium">
          <UserPlusIcon size={30} />
        </IconButton>
        <IconButton size="medium">
          <ChatTeardropDotsIcon size={30} />
        </IconButton>
        <IconButton href="/bookmarks" size="medium">
          <BookmarkSimpleIcon size={30} />
        </IconButton>
        <IconButton href="/profile" size="medium">
          <UserIcon size={30} />
        </IconButton>
        <IconButton
          size="medium"
          sx={{
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            "&:hover": {
              backgroundColor: "primary.main",
            },
          }}
          onClick={openPostModal}
        >
          <RiQuillPenLine size={30} />
        </IconButton>
      </Stack>

      {/* profile options */}
      <Stack width={"100%"}>
        <AppMenu
          trigger={(open) => (
            <Avatar
              onClick={open}
              src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
            />
          )}
        >
          {(close) => <AccountOptions />}
        </AppMenu>
      </Stack>
    </Box>
  );
};

const NavButton = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Button
      startIcon={icon}
      sx={{
        borderRadius: "9999px",
        px: 2,
        py: 1.5,
        fontSize: "1.2rem",
        textTransform: "none",
        color: "text.primary",
        justifyContent: "flex-start",
        "& .MuiButton-startIcon": { marginRight: "20px" },
        "& .MuiSvgIcon-root": { fontSize: 30 },
      }}
    >
      {isMobile ? "" : label}
    </Button>
  );
};

function Sidebar() {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return <>{isMobile ? <MobileSidebar /> : <DesktopSidebar />}</>;
}

export default Sidebar;
