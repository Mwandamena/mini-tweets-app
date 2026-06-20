"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CakeIcon from "@mui/icons-material/Cake";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { ProfileData } from "../types";
import { Stack } from "@mui/material";
import { useUIStore } from "@/store/ui.store";

interface ProfileInfoProps {
  data: ProfileData;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ data }) => {
  // ui store
  const { openEditProfileModal } = useUIStore();
  return (
    <Box className="relative">
      <Box
        component="img"
        src={data.bannerUrl}
        alt="Profile Banner"
        className="w-full h-48 object-cover bg-gray-200"
      />

      <Box className="p-4">
        <Box className="flex justify-between items-end -mt-24 mb-4">
          <Avatar
            alt={data.name}
            src={data.avatarUrl}
            sx={{ width: 140, height: 140 }}
            className="border-4 border-white"
          />
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <IconButton className="w-9 h-9 border border-gray-300">
              <MoreHorizIcon fontSize="small" />
            </IconButton>
            <IconButton className="w-9 h-9 border border-gray-300">
              <MailOutlineIcon fontSize="small" />
            </IconButton>
            <Button
              variant="outlined"
              size="small"
              onClick={openEditProfileModal}
            >
              Update profile
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => console.log("Follow")}
            >
              Follow
            </Button>
          </Stack>
        </Box>

        <Typography
          variant="h5"
          component="h2"
          className="text-xl font-extrabold text-gray-900 leading-none"
        >
          {data.name}
        </Typography>
        <Typography variant="subtitle1" className="text-gray-500 mb-4">
          {data.handle}
        </Typography>

        <Box className="flex flex-wrap items-center text-gray-500 mb-3 text-sm space-x-4">
          <Box className="flex items-center space-x-1">
            <LocationOnIcon fontSize="small" />
            <Typography variant="body2">{data.location}</Typography>
          </Box>
          <Box className="flex items-center space-x-1">
            <CakeIcon fontSize="small" />
            <Typography variant="body2">Born {data.bornDate}</Typography>
          </Box>
          <Box className="flex items-center space-x-1">
            <CalendarTodayIcon fontSize="small" />
            <Typography variant="body2">Joined {data.joinedDate}</Typography>
          </Box>
        </Box>

        <Box className="flex items-center space-x-4 mb-4">
          <Typography
            variant="body2"
            component="span"
            className="text-gray-900 hover:underline cursor-pointer"
          >
            <span className="font-bold">{data.followingCount}</span> Following
          </Typography>
          <Typography
            variant="body2"
            component="span"
            className="text-gray-900 hover:underline cursor-pointer"
          >
            <span className="font-bold">{data.followerCount}</span> Followers
          </Typography>
        </Box>

        {data.followedBy && (
          <Box className="flex items-center space-x-2 mb-4">
            <Avatar
              src={data.followedBy.avatarUrl}
              sx={{ width: 24, height: 24 }}
            />
            <Typography variant="body2" className="text-gray-500">
              Followed by{" "}
              <span className="text-gray-900 font-bold">
                {data.followedBy.name}
              </span>
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProfileInfo;
