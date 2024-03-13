import React from "react";
import UserTweet from "./UserTweet";

export default function TweetTab({ tweets, author }) {
  return (
    <div className="mt-4 w-full flex flex-col gap-4 divide-y divide-veryLightGray dark:divide-gray-800 bg-white dark:bg-secondary text-secondary dark:text-veryLightGray">
      {tweets.length > 0 ? (
        tweets.map((tweet) => (
          <UserTweet
            key={tweet.id}
            name={author}
            content={tweet.content}
            time={tweet.createdAt}
            id={tweet.id}
            authorId={tweet.authorId}
          />
        ))
      ) : (
        <div className="w-full mt-2 text-center">There are no tweets</div>
      )}
    </div>
  );
}
