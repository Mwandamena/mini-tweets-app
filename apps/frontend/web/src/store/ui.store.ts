import { create } from "zustand";

interface UIState {
  isModalOpen: boolean;
  modalImage: string | null;
  openMediaModal: (src: string) => void;
  closeMediaModal: () => void;

  activeTab: "forYou" | "following" | "communities";
  setActiveTab: (tab: "forYou" | "following" | "communities") => void;

  // profile tab
  profileTab: "posts" | "replies" | "media";
  setProfileTab: (tab: "posts" | "replies" | "media") => void;

  // post modal
  isPostModalOpen: boolean;
  openPostModal: () => void;
  closePostModal: () => void;

  // edit profile modal
  isEditProfileModalOpen: boolean;
  openEditProfileModal: () => void;
  closeEditProfileModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  modalImage: null,
  openMediaModal: (src) => set({ isModalOpen: true, modalImage: src }),
  closeMediaModal: () => set({ isModalOpen: false, modalImage: null }),

  activeTab: "forYou",
  setActiveTab: (tab) => set({ activeTab: tab }),

  profileTab: "posts",
  setProfileTab: (tab) => set({ profileTab: tab }),

  // post modal
  isPostModalOpen: false,
  openPostModal: () => set({ isPostModalOpen: true }),
  closePostModal: () => set({ isPostModalOpen: false }),

  // edit profile modal
  isEditProfileModalOpen: false,
  openEditProfileModal: () => set({ isEditProfileModalOpen: true }),
  closeEditProfileModal: () => set({ isEditProfileModalOpen: false }),
}));
