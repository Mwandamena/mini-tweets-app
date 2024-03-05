import TweetAuthor from "./TweetAuthor";
import TweetContent from "./TweetContent";
import TweetTime from "./TweetTime";
import TweetFooter from "./TweetFooter";
import { useHandle } from "../../hooks/useHandle";

export default function Tweet({ token, author, content, time, id }) {
  // get the author handle
  const { getHandle } = useHandle();
  const handle = getHandle(author.email);

  return (
    <div className="max-w-sm relative flex flex-col border border-veryLightGray dark:border-gray-700/70 rounded-md">
      {/* <TweetHeader /> */}
      <div className="flex flex-col gap-1 px-4 py-3">
        <TweetAuthor author={author?.name} handle={handle} id={id} />
        <TweetContent content={content} />
        <TweetTime time={time} />
        <TweetFooter />
      </div>
    </div>
  );
}
