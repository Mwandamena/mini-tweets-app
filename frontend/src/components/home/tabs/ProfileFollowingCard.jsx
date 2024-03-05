import React, { useState } from "react";
import { UseAuthContext } from "../../../hooks/useAuthContext";
import axios from "axios";
import Avatar from "../../common/Avatar";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProfileFollowingCard({ follow }) {
  // state
  const [followed, setFollowed] = useState(true);
  const { user: currentUser } = UseAuthContext();
  const navigate = useNavigate();

  // follow function
  const handleFollow = async (userId) => {
    const formData = {
      id: currentUser?.id,
      followedId: userId,
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
        setFollowed(true);
        navigate("/profile");
      } catch (error) {
        console.log(error);
        setFollowed(true);
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
        setFollowed(true);
        navigate(0);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <motion.div
      className="w-full flex items-center gap-4 p-2"
      key={follow?.followed.id}
      initial={{
        opacity: 0,
        height: 0,
      }}
      animate={{
        opacity: 1,
        height: "auto",
        transition: {
          duration: 0.15,
          type: "spring",
          bounce: 0,
          opacity: { delay: 0.025 },
        },
      }}
      exit={{
        opacity: 0,
        height: 0,
      }}
      transition={{
        duration: 0.15,
        type: "spring",
        bounce: 0,
        opacity: { delay: 0.03 },
      }}
    >
      <Avatar size={10} />
      <div className="w-full flex justify-between items-start">
        <div className="w-full">
          <Link to={`/users/${follow?.followed.id}`}>
            {follow?.followed.name}
          </Link>
        </div>
        <div className="w-full flex justify-end">
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
        </div>
      </div>
    </motion.div>
  );
}
