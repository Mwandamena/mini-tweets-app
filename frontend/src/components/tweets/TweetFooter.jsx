import { BsHeart, BsPerson, BsShare } from "react-icons/bs";

export default function TweetFooter() {
  return (
    <div className="mt-2 flex items-center justify-between text-tertiary">
      <div className="flex items-center gap-1">
        <BsHeart />
      </div>
      <div className="flex items-center gap-1">
        <BsPerson />
        <span>0</span>
      </div>
      <div className="flex items-center gap-1">
        <BsShare />
      </div>
    </div>
  );
}
