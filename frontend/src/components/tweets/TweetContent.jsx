import React from "react";

export default function TweetContent({ content }) {
  return (
    <div className="mt-2 text-sm sm:text-base">
      <p>{content}</p>
    </div>
  );
}
