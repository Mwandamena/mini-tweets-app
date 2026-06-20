"use client";

import React, { useState, MouseEvent, ReactNode } from "react";
import { Menu, Box } from "@mui/material";

interface ReusableMenuProps {
  trigger: (open: (event: MouseEvent<HTMLElement>) => void) => ReactNode;
  children: (close: () => void) => ReactNode;
  menuSx?: object;
}

const AppMenu = ({ trigger, children, menuSx }: ReusableMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      {trigger(handleOpen)}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            sx: {
              p: 0,
            },
          },
          paper: {
            sx: {
              minWidth: 280,
              p: 0,
              boxShadow:
                "rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px",
              ...menuSx,
            },
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {children(handleClose)}
      </Menu>
    </Box>
  );
};

export default AppMenu;
