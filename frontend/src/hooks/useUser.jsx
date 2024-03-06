import axios from "axios";
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useUserTweets = () => {
  // context
  const { user } = useAuthContext();
  const [feed, setFeed] = useState([]);

  const getUserTweets = async () => {
    try {
      const response = await axios.get(`${process.env.APP_URL}auth/current`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (response) {
        console.log(response.data);
        return response.data;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error.response.data.message);
      return null;
    }
  };

  return { getUserTweets, feed };
};
