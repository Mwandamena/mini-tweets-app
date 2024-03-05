import { createContext, useState } from "react";

export const PostContext = createContext();

export function PostProvider({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <PostContext.Provider value={{ open, setOpen }}>
      {children}
    </PostContext.Provider>
  );
}
