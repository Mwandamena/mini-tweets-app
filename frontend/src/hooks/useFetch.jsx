import axios from "axios";
import { UseAuthContext } from "./useAuthContext";
import { useState } from "react";

export const useFetch = () => {
  const { user } = UseAuthContext();
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}auth/current`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (response.ok) {
      setLoading(false);
      return response.json();
    } else {
      setLoading(false);
      return null;
    }
  };

  const fetchFeed = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}tweets`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response) {
        setLoading(false);
        return response.data;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error.message);
      return null;
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}users`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response) {
        setLoading(false);
        return response.data;
      }
    } catch (error) {
      console.log(error.message);
      return null;
    }
  };

  const fetchSingleUser = async (id) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}users/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response) {
        setLoading(false);
        return response.data;
      } else {
        setLoading(false);
        return null;
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
      return null;
    }
  };

  return {
    fetchUser,
    fetchFeed,
    fetchUsers,
    fetchSingleUser,
    loading,
    setLoading,
  };
};
