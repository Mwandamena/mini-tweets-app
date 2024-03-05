import { current } from "@reduxjs/toolkit";
import { useState } from "react";

export const useModal = () => {
  const [active, setActive] = useState(false);

  const openModal = () => setActive(true);
  const closeModal = () => setActive(false);

  return { openModal, closeModal, active };
};
