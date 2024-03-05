import axios from "axios";
import { UseAuthContext } from "./useAuthContext";
import { useState } from "react";

export const useFetch = () => {
  const { user } = UseAuthContext();
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const response = await fetch("http://localhost:3000/api/v1/auth/current", {
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
      const response = await axios.get("http://localhost:3000/api/v1/tweets/", {
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
      const response = await axios.get("http://localhost:3000/api/v1/users/", {
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
      const response = await axios.get(
        `http://localhost:3000/api/v1/users/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

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
