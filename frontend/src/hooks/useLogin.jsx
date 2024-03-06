import { useState } from "react";
import { UseAuthContext } from "./useAuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  // state
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");

  // context
  const { dispatch } = UseAuthContext();
  const navigate = useNavigate();

  const login = async (formBody) => {
    setLoading(true);
    setDisabled(true);
    setError(false);

    // request
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}auth/login`,
        formBody
      );
      const data = response.data;
      setLoading(false);
      setDisabled(false);
      setError(false);

      // store the data in localstorage
      localStorage.setItem("user", JSON.stringify(data));

      // update auth context
      dispatch({
        type: "LOGIN",
        payload: data,
      });
      navigate("/");
    } catch (error) {
      setLoading(false);
      setDisabled(false);
      setError(error?.response.data.message || error.message);
      console.log("LOGIN ERROR: ", error.message);
    }
  };

  return {
    login,
    loading,
    disabled,
    error,
    setError,
  };
};
