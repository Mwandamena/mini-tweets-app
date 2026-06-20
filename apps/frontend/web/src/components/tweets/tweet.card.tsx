"use client";

import {
  Card,
  Collapse,
  IconButton,
  Stack,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { TbRepeat } from "react-icons/tb";
import { useState } from "react";
import { FaRegComment, FaRegHeart } from "react-icons/fa6";
import ActionButton from "./tweet.action";
import { IoStatsChartOutline } from "react-icons/io5";
import { FiBookmark, FiShare } from "react-icons/fi";
import Image from "next/image";
import { useUIStore } from "@/store/ui.store";
import AppMenu from "../global/menu";
import TweetOptions from "./tweet.options";
import { useRouter } from "next/navigation";

interface TweetCardProps {
  authorName: string;
  authorImage?: string;
  content: string;
  createdAt: string;
  repostedBy?: string;
  media?: string[] | null;
  id: string;
}

function TweetCard({
  id,
  authorName,
  authorImage,
  content,
  createdAt,
  repostedBy,
  media,
}: TweetCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);

  // Handle card click - navigates to tweet detail
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    const isInteractive = target.closest(
      'button, a, [role="button"], [role="presentation"], .MuiBackdrop-root, .MuiModal-root, .MuiMenu-root, .MuiPopover-root'
    );

    if (!isInteractive) {
      router.push(
        `/${authorName.replace(/\s+/g, "").toLowerCase()}/status/${id}`
      );
    }
  };

  return (
    <Card
      variant="tweet"
      sx={{
        p: 0,
        cursor: "pointer",
        "&:hover": {
          bgcolor: "grey.50",
        },
      }}
      onClick={handleCardClick}
    >
      <Stack sx={{ p: 1 }}>
        {repostedBy && (
          <Stack direction="row" alignItems="center" gap={1.5} ml={5} mb={0.5}>
            <TbRepeat size={16} color="gray" className="rotate-90" />
            <Typography
              variant="caption"
              fontWeight={500}
              color="textSecondary"
            >
              {repostedBy} Reposted
            </Typography>
          </Stack>
        )}

        <Stack direction="row" gap={1.5} alignItems="start">
          <Avatar src={authorImage} sx={{ width: 38, height: 38 }}>
            {authorName.charAt(0)}
          </Avatar>

          <Stack width="100%" direction="column" gap={0.5}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack
                direction="row"
                alignItems="center"
                gap={0.5}
                flexWrap="wrap"
              >
                <Typography fontWeight={500} variant="subtitle2">
                  {authorName}
                </Typography>
                <Typography
                  fontWeight={400}
                  variant="caption"
                  color="textSecondary"
                >
                  @{authorName.replace(/\s+/g, "").toLowerCase()} · {createdAt}
                </Typography>
              </Stack>

              <AppMenu
                menuSx={{
                  minWidth: 120,
                }}
                trigger={(openMenu) => (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      openMenu(e);
                    }}
                  >
                    <PiDotsThreeOutlineFill />
                  </IconButton>
                )}
              >
                {(close) => <TweetOptions />}
              </AppMenu>
            </Stack>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Typography
                variant="body1"
                sx={{ whiteSpace: "pre-wrap", mt: 0.5 }}
              >
                {content}
              </Typography>
            </Collapse>

            {media && media.length > 0 && (
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 9",
                  borderRadius: "16px",
                  overflow: "hidden",
                  mt: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  display: "grid",
                  gridTemplateColumns: media.length === 1 ? "1fr" : "1fr 1fr",
                  gridTemplateRows: media.length <= 2 ? "1fr" : "1fr 1fr",
                  gap: "2px",
                }}
              >
                {media.map((src, idx) => (
                  <Box
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      useUIStore.setState({
                        isModalOpen: true,
                        modalImage: src,
                      });
                    }}
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      cursor: "pointer",
                      gridRow:
                        media.length === 3 && idx === 0 ? "span 2" : "auto",
                      "&:hover": {
                        opacity: 0.9,
                      },
                    }}
                  >
                    <Image
                      src={src}
                      fill
                      alt={`Tweet media ${idx}`}
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </Box>
                ))}
              </Box>
            )}

            {/* action buttons */}
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mt: 1, maxWidth: "100%", ml: -1 }}
              onClick={(e) => e.stopPropagation()}
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
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

export default TweetCard;
