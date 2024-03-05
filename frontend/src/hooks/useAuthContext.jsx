import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const UseAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error(
      "useAuthContext must be used within the context of the applicaton"
    );
  }

  return context;
};
