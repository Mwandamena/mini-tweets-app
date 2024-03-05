import ProfileFollowingCard from "./ProfileFollowingCard";
import { AnimatePresence, LayoutGroup } from "framer-motion";

export default function FollowingTab({ following }) {
  return (
    <div className="w-full mt-4 flex flex-col gap-4 divide-y divide-veryLightGray dark:divide-gray-800">
      {following?.length > 0 ? (
        <AnimatePresence initial={false}>
          {following.map((follow, index) => (
            <ProfileFollowingCard key={index} follow={follow} />
          ))}
        </AnimatePresence>
      ) : (
        <div className="w-full mt-2 text-center">Not following anyone</div>
      )}
    </div>
  );
}
