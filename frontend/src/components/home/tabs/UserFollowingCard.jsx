import React, { useEffect, useState } from "react";
import { UseAuthContext } from "../../../hooks/useAuthContext";
import axios from "axios";
import Avatar from "../../common/Avatar";
import { Link, useNavigate } from "react-router-dom";

export default function UserProfileFollowing({ follow }) {
  // state
  const [followed, setFollowed] = useState(false);
  const [current, setCurrent] = useState(false);
  const { user: currentUser } = UseAuthContext();
  const navigate = useNavigate();

  // function to check if the user has similar followers
  useEffect(() => {
    const checkUsers = () => {
      const similarFollow = currentUser.followers.find(
        (item) => follow.followed.id === item.followedId
      );

      if (similarFollow) {
        setFollowed(true);
      }

      if (currentUser.id === follow.followed.id) {
        setCurrent(true);
      }
    };
    checkUsers();
  }, []);

  // follow function
  const handleFollow = async (userId) => {
    const formData = {
      id: currentUser?.id,
      followedId: userId,
    };

    if (followed) {
      try {
        const data = await axios.post(
          `${process.env.APP_URL}follow/u`,
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
        navigate(`/users/${userId}`);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        setFollowed(true);
        const data = await axios.post(
          `${process.env.APP_URL}follow`,
          formData,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        console.log(data.data);
        navigate(`/users/${userId}`);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div
      className="w-full flex items-center gap-4 p-2"
      key={follow?.followed.id}
    >
      <Avatar size={10} />
      <div className="w-full flex justify-between items-start">
        <div className="w-full">
          <Link to={`/users/${follow?.followed.id}`}>
            {follow?.followed.name}
          </Link>
        </div>
        <div className="w-full flex justify-end">
          {current ? (
            <h6>You</h6>
          ) : (
            <button
              className={`py-[0.02rem] px-4  text-xs rounded-lg ${
                followed
                  ? "border dark:bg-tertiary dark:text-white border-secondary text-black bg-white"
                  : "text-white border-[0.02rem] bg-secondary border-tertiary"
              }`}
              onClick={() => handleFollow(follow?.followed.id)}
            >
              {followed ? "Following" : "Follow"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
