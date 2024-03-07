import React, { useEffect, useState } from "react";
import Avatar from "../../common/Avatar";
import { Link } from "react-router-dom";
import axios from "axios";
import { UseAuthContext } from "../../../hooks/useAuthContext";
UseAuthContext;

export default function FollowerCard({ user, onClick, follow }) {
  // context
  const { user: currentUser } = UseAuthContext();
  const [current, setCurrent] = useState(false);

  // state
  const [followed, setFollowed] = useState(false);

  // check the current user
  useEffect(() => {
    if (currentUser.id == user.id) {
      setCurrent(true);
    }
  }, [user]);

  // function to check if the user has similar followers
  useEffect(() => {
    const checkUsers = () => {
      const similarFollow = user.following.find(
        (item) => currentUser.id === item.followerId
      );
      if (similarFollow) {
        setFollowed(true);
      }
    };
    checkUsers();
  }, [user, currentUser]);

  // handle the follow of the user
  const handleFollow = async () => {
    const formData = {
      id: currentUser?.id,
      followedId: user?.id,
    };

    if (followed) {
      try {
        const data = await axios.post(
          `${import.meta.env.VITE_API_URL}follow/u`,
          formData,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        console.log(data.data);
        setFollowed(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        setFollowed(true);
        const data = await axios.post(
          `${import.meta.env.VITE_API_URL}follow`,
          formData,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="w-full flex items-center gap-4 p-2 bg-white dark:bg-secondary text-secondary dark:text-veryLightGray">
      <Avatar size={12} />
      <div className="w-full flex justify-between items-start">
        <div className="w-full">
          <Link
            to={current ? "/profile" : `/users/${user.id}`}
            className="hover:underline focus:underline"
          >
            {user.name}
          </Link>
        </div>
        <div className="w-full flex justify-end">
          {current ? (
            <div>
              <h6>You</h6>
            </div>
          ) : (
            <button
              className={`py-[0.02rem] px-4  text-xs rounded-lg ${
                followed
                  ? "border border-gray-800/80 text-black dark:text-extraLightGrey dark:bg-gray-900 dark:border-gray-800"
                  : "border text-veryLightGray bg-secondary dark:text-white  dark:bg-gray-600 dark:border-gray-800"
              }`}
              onClick={() => handleFollow()}
            >
              {followed ? "Following" : "Follow"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
