import React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import TweetCard from "@/components/tweets/tweet.card";
import BookmarkHeader from "@/components/bookmarks/bookmarks.header";
import { BOOKMARK_DATA } from "@/components/bookmarks/constants";
import { BookmarkItem } from "@/components/bookmarks/types";

export default function App() {
  return (
    <Box className="flex flex-col">
      <div className="max-w-2xl w-full mx-auto bg-white">
        <BookmarkHeader />
        <Divider className="my-0" />

        <Box>
          {BOOKMARK_DATA.map((bookmark: BookmarkItem, index: number) => (
            <React.Fragment key={bookmark.id}>
              <TweetCard
                id={`${bookmark.id}`}
                authorName={bookmark.userName}
                authorImage={bookmark.avatarUrl}
                content={bookmark.content[0]}
                createdAt="24-04-2026"
              />
            </React.Fragment>
          ))}
        </Box>
      </div>
    </Box>
  );
}
