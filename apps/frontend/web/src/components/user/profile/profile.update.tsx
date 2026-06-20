"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  AlertTitle,
  Dialog,
  FormControl,
  FormLabel,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { theme } from "@/theme/theme.material";
import { UserUpdateSchema } from "@mta/constants";
import { useForm } from "react-hook-form";
import { MdError } from "react-icons/md";
import { useUIStore } from "@/store/ui.store";

const EditProfileModal: React.FC = () => {
  const [apiError, setApiError] = React.useState<string | null>(null);

  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  //  use form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
    clearErrors,
  } = useForm<UserUpdateSchema>({
    mode: "onBlur",
  });

  // ui state
  const { isEditProfileModalOpen, closeEditProfileModal } = useUIStore();

  const onSubmit = async (data: any) => {
    console.log("Login successful, ready to redirect.");
  };

  const handleSave = () => {
    console.log("Save profile");
    closeEditProfileModal();
  };

  return (
    <Dialog
      open={isEditProfileModalOpen}
      onClose={() => closeEditProfileModal}
      fullScreen={fullScreen}
      slotProps={{
        paper: {
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
        },
      }}
    >
      <Box className="relative flex flex-col overflow-auto">
        <Box className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
          <IconButton size="medium" onClick={closeEditProfileModal}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h4" className="font-bold">
            Edit your profile
          </Typography>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>

        {/* Scrollable Content */}
        <Box className="flex-1 overflow-y-auto pb-8">
          <Box className="relative h-40 bg-gray-200 flex items-center justify-center">
            <IconButton className="bg-gray-700 bg-opacity-70 text-white p-3 rounded-full">
              <CameraAltIcon fontSize="medium" />
            </IconButton>
          </Box>

          <Box className="relative px-4 pb-1">
            <Avatar
              sx={{ width: 128, height: 128 }}
              className="absolute -top-16 left-4 border-4 border-white bg-gray-300"
            >
              <IconButton className="absolute inset-0 bg-gray-700 bg-opacity-70 text-white p-3 rounded-full">
                <CameraAltIcon fontSize="medium" />
              </IconButton>
            </Avatar>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className="pt-1 px-4 space-y-6"
          >
            <Stack spacing={2}>
              {(apiError || errors.root) && (
                <Alert
                  severity="error"
                  icon={<MdError />}
                  sx={{
                    borderRadius: 2,
                    bgcolor: "error.light",
                    color: "error.contrastText",
                  }}
                >
                  <AlertTitle sx={{ m: 0 }}>
                    {apiError || errors.root?.message}
                  </AlertTitle>
                </Alert>
              )}

              <FormControl>
                <FormLabel htmlFor="username" sx={{ fontWeight: 600 }}>
                  Username
                </FormLabel>
                <TextField
                  type="text"
                  placeholder="Edit your name"
                  fullWidth
                  size="medium"
                  required
                  {...register("username")}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  autoFocus
                  variant="outlined"
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="bio" sx={{ fontWeight: 600 }}>
                  Your bio
                </FormLabel>
                <TextField
                  type="text"
                  placeholder="Edit your bio"
                  fullWidth
                  size="medium"
                  multiline
                  required
                  {...register("bio")}
                  error={!!errors.bio}
                  helperText={errors.bio?.message}
                  autoFocus
                  variant="outlined"
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="location" sx={{ fontWeight: 600 }}>
                  Location
                </FormLabel>
                <TextField
                  type="text"
                  placeholder="Edit your location"
                  fullWidth
                  size="medium"
                  required
                  {...register("location")}
                  error={!!errors.location}
                  helperText={errors.location?.message}
                  autoFocus
                  variant="outlined"
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="website" sx={{ fontWeight: 600 }}>
                  Website
                </FormLabel>
                <TextField
                  type="url"
                  placeholder="Edit your website"
                  fullWidth
                  size="medium"
                  required
                  {...register("website")}
                  error={!!errors.website}
                  helperText={errors.website?.message}
                  autoFocus
                  variant="outlined"
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="website" sx={{ fontWeight: 600 }}>
                  Date of birth
                </FormLabel>
                <TextField
                  type="date"
                  placeholder=""
                  fullWidth
                  size="medium"
                  required
                  {...register("dateOfBirth")}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth?.message}
                  autoFocus
                  variant="outlined"
                />
              </FormControl>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EditProfileModal;
