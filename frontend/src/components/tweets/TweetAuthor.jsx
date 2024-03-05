import React, { useState } from "react";
import Avatar from "../common/Avatar";
import logo from "../../assets/images/twitter-logo.svg";
import { Link } from "react-router-dom";

export default function TweetAuthor({ author, handle, id }) {
  return (
    <div className="w-full flex items-start justify-between">
      <div className="flex items-center gap-2">
        <div>
          <Avatar size={10} />
        </div>
        <div className="flex flex-col gap-0">
          <Link to={`/users/${id}`}>
            <h2>{author}</h2>
          </Link>
          <p className="text-xs text-tertiary lowercase">@{handle}</p>
        </div>
      </div>
      <div>
        <img src={logo} alt="Tweet" className="w-5" />
      </div>
    </div>
  );
}
