import { useState } from "react";
import { UseAuthContext } from "./useAuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useDeleteAccount = () => {
  // state
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");

  // context
  const { dispatch, user } = UseAuthContext();
  const navigate = useNavigate();

  const deleteAccount = async () => {
    setLoading(true);
    setDisabled(true);
    setError(false);

    console.log(user.id);

    // request
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/users/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      setDisabled(false);
      setError(false);

      // store the data in localstorage
      localStorage.removeItem("user");

      // update auth context
      dispatch({
        type: "LOGOUT",
        payload: null,
      });
      navigate("/login");
    } catch (error) {
      setLoading(false);
      setDisabled(false);
      setError(error?.response.data.message || error.message);
      console.log("USER ERROR: ", error.message);
    }
  };

  return {
    deleteAccount,
    loading,
    disabled,
    error,
    setError,
  };
};
