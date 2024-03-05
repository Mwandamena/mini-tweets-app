import { useEffect, useState } from "react";
import Container from "../../components/common/Container";
import Avatar from "../../components/common/Avatar";
import { useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { useHandle } from "../../hooks/useHandle";
import Loading from "../loaders/Loading";

import {
  TweetTab,
  FollowingTab,
  FollowerTab,
} from "../../components/home/tabs/tabs";

// images
import profile from "../../assets/images/image.png";
import UserFollowerTab from "../../components/home/tabs/UserFollowerTab";
import UserFollowingTab from "../../components/home/tabs/UserFollowingTab";

export default function UserProfile() {
  // tab stats and functions
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const { fetchSingleUser, loading } = useFetch();
  const { getHandle } = useHandle();

  // single user data
  const { id } = useParams();
  const handle = getHandle(user?.user.email || "user@gmail.com");

  useEffect(() => {
    const fetchUser = async () => {
      const data = await fetchSingleUser(id);
      setUser({ ...data });
    };
    fetchUser();
  }, []);

  const tabs = [
    {
      id: 0,
      tab: <TweetTab tweets={user?.user.tweets} author={user?.user.name} />,
    },
    {
      id: 1,
      tab: <UserFollowerTab followers={user?.user.following} />,
    },
    {
      id: 2,
      tab: <UserFollowingTab following={user?.user.followers} />,
    },
  ];

  const handleTabChange = (name) => {
    switch (name) {
      case "tweets":
        setCurrentTab(0);
        break;
      case "followers":
        setCurrentTab(1);
        break;
      case "following":
        setCurrentTab(2);
        break;
      default:
        setCurrentTab(0);
        break;
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <main className="w-full mt-4 mb-20 bg-white dark:bg-secondary">
          <Container>
            <div className="w-full flex flex-col items-center">
              <div className="w-full md:max-w-md text-secondary dark:text-white">
                <div>
                  <h2>Profile</h2>
                </div>

                {/* profile name and icon */}
                <div className="mt-4 flex flex-col justify-start">
                  <Avatar size={10} />
                  <div className="mt-2">
                    <h1 className="font-bold text-2xl">{user?.user.name}</h1>
                    <p className="text-tertiary text-xs">@{handle}</p>
                  </div>
                </div>

                {/* following and follower */}
                <div className="mt-6 w-full flex justify-between items-center text-xs">
                  <div className="flex items-center">
                    <h3>Followers:</h3>
                    <span>{user?.user.following.length}</span>
                  </div>
                  <div className="flex items-center">
                    <h3>Following: </h3>
                    <span>{user?.user.followers.length}</span>
                  </div>
                </div>

                {/* profile details tab */}
                <div className="w-full gap-4 sticky top-[74px] left-0 mt-4 flex items-center justify-between bg-white dark:bg-secondary border-veryLightGray dark:border-gray-800 border-b z-20">
                  <button
                    className={`relative after:h-[0.2rem] after:absolute after:w-0 after:bg-primary after:right-0 after:bottom-0  py-4 ${
                      currentTab == 0 && "after:w-full"
                    }`}
                    onClick={() => handleTabChange("tweets")}
                  >
                    <h6>Tweets({user?.user.tweets.length})</h6>
                  </button>
                  <button
                    className={`relative after:h-[0.2rem] after:absolute after:w-0 after:bg-primary after:right-0 after:bottom-0 focus:after:w-full active:after:w-full py-4 ${
                      currentTab == 1 && "after:w-full"
                    }`}
                    onClick={() => handleTabChange("followers")}
                  >
                    <h6>Followers({user?.user.following.length})</h6>
                  </button>
                  <button
                    className={`relative after:h-[0.2rem] after:absolute after:w-0 after:bg-primary after:right-0 after:bottom-0 focus:after:w-full active:after:w-full py-4 ${
                      currentTab == 2 && "after:w-full"
                    }`}
                    onClick={() => handleTabChange("following")}
                  >
                    <h6>Following({user?.user.followers.length})</h6>
                  </button>
                </div>

                {/* show the tabs */}
                <div className="mt-2">{tabs[currentTab].tab}</div>
              </div>
            </div>
          </Container>
        </main>
      )}
    </>
  );
}
