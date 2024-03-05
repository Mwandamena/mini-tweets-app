import UserFollowingCard from "./UserFollowingCard";

export default function UserFollowingTab({ following }) {
  return (
    <div className="w-full mt-4 flex flex-col gap-4 divide-y divide-veryLightGray dark:divide-gray-800">
      {following?.length > 0 ? (
        following.map((follow, index) => (
          <UserFollowingCard key={index} follow={follow} />
        ))
      ) : (
        <div className="w-full mt-2 text-center">Not following anyone</div>
      )}
    </div>
  );
}
