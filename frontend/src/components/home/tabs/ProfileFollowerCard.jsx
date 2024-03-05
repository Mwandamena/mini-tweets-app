import React, { useEffect, useState } from "react";
import { UseAuthContext } from "../../../hooks/useAuthContext";
import axios from "axios";
import Avatar from "../../common/Avatar";
import { Link, useNavigate } from "react-router-dom";

export default function ProfileFollowerCard({ user }) {
  const { user: currentUser } = UseAuthContext();
  const [followed, setFollowed] = useState(false);
  const navigate = useNavigate();

  // function to check if the user has similar followers
  useEffect(() => {
    const checkUsers = () => {
      const similarFollow = currentUser.followers.find(
        (item) => user.follower.id === item.followedId
      );
      if (similarFollow) {
        setFollowed(true);
      }
    };
    checkUsers();
  }, [user, currentUser]);

  // follow function
  const handleFollow = async () => {
    const formData = {
      id: currentUser?.id,
      followedId: user?.follower.id,
    };

    if (followed) {
      try {
        const data = await axios.post(
          "http://localhost:3000/api/v1/follow/u",
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
        navigate(`/profile`);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        setFollowed(true);
        const data = await axios.post(
          "http://localhost:3000/api/v1/follow",
          formData,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        console.log(data.data);
        navigate("/profile");
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="w-full flex items-center gap-4 p-2 bg-white dark:bg-secondary">
      <Avatar size={10} />
      <div className="w-full flex justify-between items-start">
        <div className="w-full">
          <Link to={`/users/${user?.follower.id}`}>{user?.follower.name}</Link>
        </div>
        <div className="w-full flex justify-end">
          <button
            className={`py-[0.02rem] px-4  text-xs rounded-lg ${
              followed
                ? "border dark:bg-tertiary dark:text-white border-secondary text-black bg-white"
                : "text-white border-[0.02rem] bg-secondary border-tertiary"
            }`}
            onClick={() => handleFollow()}
          >
            <h6>{followed ? "Following" : "Follow"}</h6>
          </button>
        </div>
      </div>
    </div>
  );
}
