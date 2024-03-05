import { UseAuthContext } from "./useAuthContext";

export const useLogOut = () => {
  const { dispatch } = UseAuthContext();
  const logOut = () => {
    // remove user from localstorage
    localStorage.removeItem("user");

    // clear the state
    dispatch({
      type: "LOGOUT",
    });
  };

  return {
    logOut,
  };
};
