import { useEffect, useState } from "react";
import Container from "../../components/common/Container";
import Avatar from "../../components/common/Avatar";

import {
  TweetTab,
  FollowingTab,
  FollowerTab,
} from "../../components/home/tabs/tabs";

// images
import { UseAuthContext } from "../../hooks/useAuthContext";
import { useHandle } from "../../hooks/useHandle";
import { Link, useLoaderData, useNavigation } from "react-router-dom";
import Loading from "../loaders/Loading";
import { useFetch } from "../../hooks/useFetch";
import { CgMenu } from "react-icons/cg";

export default function Profile() {
  // hooks
  const { user } = UseAuthContext();
  const { getHandle } = useHandle();
  const { fetchUser, loading } = useFetch();
  const navigation = useNavigation();

  // current user state
  const [currentUser, setCurrentUser] = useState(null);

  // get handle
  const handle = getHandle(user?.email);
  const data = useLoaderData();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const data = await fetchUser();
      setCurrentUser({ ...data });
    };
    fetchCurrentUser();
  }, []);

  // tab stats and functions
  const [CurrentTab, setCurrentTab] = useState(0);

  const tabs = [
    {
      id: 1,
      tab: <TweetTab tweets={data?.tweets} author={user.name} />,
    },
    {
      id: 1,
      tab: <FollowerTab followers={data?.following} />,
    },
    {
      id: 1,
      tab: <FollowingTab following={data?.followers} />,
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
              <div className="w-full md:max-w-md text-secondary dark:text-veryLightGray">
                <div>
                  <h2>Your Profile</h2>
                </div>

                {/* profile name and icon */}
                <div className="mt-4 flex flex-col justify-start">
                  <Avatar size={10} />
                  <div className="mt-2">
                    <h1 className="font-bold text-2xl">{user.name}</h1>
                    <p className="text-tertiary text-xs">@{handle}</p>
                  </div>
                </div>

                {/* following and follower */}
                <div className="mt-6 w-full flex justify-between items-center text-xs">
                  <div className="flex items-center">
                    <h3>Followers: </h3>
                    <span>{data?.following.length}</span>
                  </div>
                  <div className="flex items-center">
                    <h3>Following: </h3>
                    <span>{data?.followers.length}</span>
                  </div>
                </div>

                {/* profile details tab */}
                <div className="w-full gap-4 sticky top-[74px] left-0 mt-4 flex items-center justify-between bg-white dark:bg-secondary border-extraLightGrey dark:border-gray-800 border-b z-20">
                  <button
                    className={`relative after:h-[0.2rem] after:absolute after:w-0 after:bg-primary after:right-0 after:bottom-0 active:after:w-full py-4 ${
                      CurrentTab === 0 && "after:w-full"
                    }`}
                    onClick={() => handleTabChange("tweets")}
                  >
                    <h6>Tweets({data?.tweets.length})</h6>
                  </button>
                  <button
                    className={`relative after:h-[0.2rem] after:absolute after:w-0 after:bg-primary after:right-0 after:bottom-0 py-4 ${
                      CurrentTab === 1 && "after:w-full"
                    }`}
                    onClick={() => handleTabChange("followers")}
                  >
                    <h6>Followers({data?.following.length})</h6>
                  </button>
                  <button
                    className={`relative after:h-[0.2rem] after:absolute after:w-0 after:bg-primary after:right-0 after:bottom-0 py-4 ${
                      CurrentTab === 2 && "after:w-full"
                    }`}
                    onClick={() => handleTabChange("following")}
                  >
                    <h6>Following({data?.followers.length})</h6>
                  </button>
                </div>

                {/* show the tabs */}
                <div className="mt-2">{tabs[CurrentTab].tab}</div>
              </div>
            </div>
          </Container>
        </main>
      )}
    </>
  );
}
