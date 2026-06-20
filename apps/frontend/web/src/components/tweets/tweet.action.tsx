"use client";
import { Stack, IconButton, Typography } from "@mui/material";
import { FaRegComment, FaRegHeart } from "react-icons/fa6";
import { TbRepeat } from "react-icons/tb";
import { IoStatsChartOutline } from "react-icons/io5";
import { FiShare } from "react-icons/fi";

interface ActionProps {
  icon: React.ReactNode;
  count?: string | number;
  hoverColor: string;
  hoverBg: string;
}

const ActionButton = ({ icon, count, hoverColor, hoverBg }: ActionProps) => (
  <Stack
    direction="row"
    alignItems="center"
    spacing={0.1}
    sx={{
      color: "text.secondary",
      cursor: "pointer",
      pointerEvents: "auto",
      transition: "color 0.2s",
      "&:hover": {
        color: hoverColor,
        "& .MuiIconButton-root": {
          backgroundColor: hoverBg,
          color: hoverColor,
        },
      },
    }}
  >
    <IconButton size="small" sx={{ transition: "background-color 0.2s" }}>
      {icon}
    </IconButton>
    {count && <Typography variant="caption">{count}</Typography>}
  </Stack>
);

export default ActionButton;
