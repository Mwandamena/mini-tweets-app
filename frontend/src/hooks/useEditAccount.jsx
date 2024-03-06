import { useState } from "react";
import { UseAuthContext } from "./useAuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useEditAccount = () => {
  // state
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");

  // context
  const { dispatch, user } = UseAuthContext();
  const navigate = useNavigate();

  const editAccount = async (formBody) => {
    setLoading(true);
    setDisabled(true);
    setError(false);

    // request
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}users/${user.id}`,
        formBody,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      setDisabled(false);
      setError(false);

      const data = response.data;

      // store the data in localstorage
      localStorage.setItem("user", JSON.stringify(data));

      // update auth context
      dispatch({
        type: "LOGIN",
        payload: data,
      });
      navigate("/settings");
    } catch (error) {
      setLoading(false);
      setDisabled(false);
      setError(error?.response.data.message || error.message);
      console.log("USER ERROR: ", error.message);
    }
  };

  return {
    editAccount,
    loading,
    disabled,
    error,
    setError,
  };
};
