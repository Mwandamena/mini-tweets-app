import * as React from "react";
import {
  Dialog,
  Box,
  IconButton,
  Typography,
  Link,
  Avatar,
  TextField,
  Button as MuiButton,
  useTheme,
  useMediaQuery,
  styled,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PublicIcon from "@mui/icons-material/Public";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import GifBoxOutlinedIcon from "@mui/icons-material/GifBoxOutlined";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import SentimentSatisfiedOutlinedIcon from "@mui/icons-material/SentimentSatisfiedOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { theme } from "@/theme/theme.material";
import { useUIStore } from "@/store/ui.store";
import AppMenu from "../global/menu";
import ReplyAudienceMenu from "./audience.reply.menu";
import AudienceMenu from "./audience.menu";

export const AudienceButton = styled(MuiButton)(({ theme }) => ({
  textTransform: "none",
  borderRadius: 32,
  padding: "2px 12px",
  minWidth: 0,
  fontSize: "0.85rem",
  fontWeight: "bold",
  color: theme.palette.primary.main,
  borderColor: theme.palette.grey[300],
  "&:hover": {
    backgroundColor: theme.palette.primary.light + "1A",
    borderColor: theme.palette.primary.light,
  },
}));

export default function PostModal() {
  // modal state
  const { isPostModalOpen, closePostModal } = useUIStore();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [postContent, setPostContent] = React.useState("");
  const isPostDisabled = postContent.trim().length === 0;

  return (
    <Dialog
      open={isPostModalOpen}
      onClose={closePostModal}
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 1,
          maxWidth: fullScreen ? "100%" : 600,
          width: "100%",
          height: fullScreen ? "100%" : "auto",
          minHeight: fullScreen ? "100%" : 300,
          boxShadow: fullScreen ? "none" : theme.shadows[24],
          margin: fullScreen ? 0 : 4,
          overflowY: "hidden",
        },
      }}
    >
      <Box
        sx={{
          p: 1,
          borderBottom: `1px solid ${theme.palette.grey[200]}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "background.paper",
        }}
      >
        <IconButton
          onClick={closePostModal}
          size="small"
          sx={{
            mr: "auto",
            "&:hover": { bgcolor: theme.palette.primary.light + "1A" },
          }}
        >
          <CloseIcon />
        </IconButton>
        <Button variant="link">Drafts</Button>
      </Box>

      <Box sx={{ display: "flex", flexGrow: 1, p: 2, overflowY: "auto" }}>
        <Avatar
          src="https://images.pexels.com/photos/17926131/pexels-photo-17926131.jpeg?auto=compress&cs=tinysrgb&h=60&w=60"
          alt="User"
          sx={{ width: 40, height: 40, mr: 2 }}
        />

        <Box sx={{ flexGrow: 1 }}>
          <AppMenu
            trigger={(onOpen) => (
              <AudienceButton
                variant="outlined"
                size="small"
                onClick={onOpen}
                endIcon={
                  <KeyboardArrowDownIcon sx={{ fontSize: "1rem !important" }} />
                }
              >
                Everyone
              </AudienceButton>
            )}
          >
            {(close) => <AudienceMenu onClose={close} />}
          </AppMenu>

          <TextField
            fullWidth
            multiline
            variant="standard"
            placeholder="What's happening?"
            rows={4}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: "1.25rem",
                fontWeight: 500,
                color: theme.palette.text.primary,
                mt: 1,
              },
            }}
            sx={{
              mt: 1,
              "& .MuiInputBase-root": {
                paddingTop: 0,
              },
            }}
          />
        </Box>
      </Box>

      {/* audience reply menu */}
      <AppMenu
        trigger={(onOpen) => (
          <Box
            sx={{
              mt: 2,
              px: 2,
              py: 1,
              borderBottom: `1px solid ${theme.palette.grey[200]}`,
            }}
          >
            <Button
              variant="link"
              size="small"
              startIcon={<PublicIcon sx={{ fontSize: 16, mr: 0.5 }} />}
              onClick={onOpen}
            >
              Everyone can reply
            </Button>
          </Box>
        )}
      >
        {(close) => <ReplyAudienceMenu onClose={close} />}
      </AppMenu>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1.5,
          position: "sticky",
          bottom: 0,
          bgcolor: "background.paper",
        }}
      >
        {/* post actions */}
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {[
            ImageOutlinedIcon,
            GifBoxOutlinedIcon,
            InsertChartOutlinedIcon,
            SentimentSatisfiedOutlinedIcon,
            ScheduleOutlinedIcon,
            LocationOnOutlinedIcon,
          ].map((Icon, index) => (
            <IconButton
              key={index}
              size="small"
              sx={{
                color: theme.palette.primary.main,
                "&:hover": { bgcolor: theme.palette.primary.light + "1A" },
              }}
            >
              <Icon sx={{ fontSize: 20 }} />
            </IconButton>
          ))}
        </Box>

        <MuiButton
          variant="contained"
          disabled={isPostDisabled}
          sx={{
            bgcolor: "primary.main",
            color: "white",
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: 32,
            minWidth: 80,
            py: 0.5,
            ml: 2,
            "&.Mui-disabled": {
              bgcolor: theme.palette.primary.light,
              color: "white",
            },
          }}
        >
          Post
        </MuiButton>
      </Box>
    </Dialog>
  );
}
