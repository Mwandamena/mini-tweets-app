import React, { useContext, useEffect, useState } from "react";
import Tweet from "../../components/tweets/Tweet";
import Loading from "../loaders/Loading";
import { UseAuthContext } from "../../hooks/useAuthContext";
import { Link, useLoaderData } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";

export default function Feed() {
  // context
  const { user } = UseAuthContext();
  const { loading, fetchFeed } = useFetch();
  const [feed, setFeed] = useState(null);

  useEffect(() => {
    const userFeed = async () => {
      const data = await fetchFeed();
      setFeed({ ...data });
    };
    userFeed();
  }, [user]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <main className="mb-24 w-full flex flex-col justify-center items-center bg-white dark:bg-secondary text-secondary dark:text-white">
          <div className="max-w-xl mt-2 px-4">
            <h1 className="font-bold text-center md:text-start text-lg">
              Your Feed
            </h1>
            {feed && (
              <div className="mt-2 flex flex-col gap-4 py-4">
                {feed?.feed.length > 0 ? (
                  feed?.feed.map((tweet) => (
                    <Tweet
                      key={tweet.id}
                      author={tweet.author}
                      content={tweet.content}
                      time={tweet.createdAt}
                      token={user.token}
                      id={tweet.authorId}
                    />
                  ))
                ) : (
                  <div className="w-full text-center">
                    <h4>You have no tweets on your feed.</h4>
                    <p>
                      Follow{" "}
                      <Link to="/users" className="text-blue-500">
                        users
                      </Link>{" "}
                      to have tweets on your feed.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      )}
    </>
  );
}
