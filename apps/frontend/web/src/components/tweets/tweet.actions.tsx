import { Stack } from "@mui/material";
import React from "react";
import ActionButton from "./tweet.action";
import { FaRegComment, FaRegHeart } from "react-icons/fa6";
import { TbRepeat } from "react-icons/tb";
import { IoStatsChartOutline } from "react-icons/io5";
import { FiBookmark, FiShare } from "react-icons/fi";

type Props = {};

const TweetActions = (props: Props) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        maxWidth: "100%",
        ml: -1,
        px: 2,
      }}
    >
      <ActionButton
        icon={<FaRegComment size={18} />}
        count="24"
        hoverColor="#1d9bf0"
        hoverBg="rgba(29, 155, 240, 0.1)"
      />
      <ActionButton
        icon={<TbRepeat size={20} className="rotate-90" />}
        count="12"
        hoverColor="#00ba7c"
        hoverBg="rgba(0, 186, 124, 0.1)"
      />
      <ActionButton
        icon={<FaRegHeart size={18} />}
        count="1.2k"
        hoverColor="#f91880"
        hoverBg="rgba(249, 24, 128, 0.1)"
      />
      <ActionButton
        icon={<IoStatsChartOutline size={18} />}
        count="45k"
        hoverColor="#1d9bf0"
        hoverBg="rgba(29, 155, 240, 0.1)"
      />
      <Stack direction={"row"} gap={0.2}>
        <ActionButton
          icon={<FiBookmark size={18} />}
          hoverColor="#1d9bf0"
          hoverBg="rgba(29, 155, 240, 0.1)"
        />
        <ActionButton
          icon={<FiShare size={18} />}
          hoverColor="#1d9bf0"
          hoverBg="rgba(29, 155, 240, 0.1)"
        />
      </Stack>
    </Stack>
  );
};

export default TweetActions;
