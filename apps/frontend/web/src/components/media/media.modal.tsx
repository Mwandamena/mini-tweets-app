import { Backdrop, Box, Fade, IconButton, Modal } from "@mui/material";
import Image from "next/image";
import React from "react";
import { IoClose } from "react-icons/io5";
import { useUIStore } from "@/store/ui.store";

function MediaModal() {
  const { isModalOpen, modalImage, closeMediaModal } = useUIStore();

  return (
    <Modal
      open={isModalOpen}
      onClose={closeMediaModal}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
        },
      }}
    >
      <Fade in={isModalOpen}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            outline: "none",
          }}
        >
          <IconButton
            onClick={closeMediaModal}
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
              zIndex: 10,
            }}
          >
            <IoClose size={24} />
          </IconButton>

          <Box sx={{ position: "relative", width: "90%", height: "90%" }}>
            <Image
              src={!!modalImage ? modalImage : ""}
              fill
              alt="Full screen media"
              style={{ objectFit: "contain" }}
              priority
            />
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

export default MediaModal;
