import UserFollowerCard from "./UserFollowerCard";

export default function UserFollowerTab({ followers }) {
  return (
    <div className="w-full mt-4 flex flex-col gap-4 divide-y divide-veryLightGray dark:divide-gray-800 text-secondary dark:text-white">
      {followers?.length > 0 ? (
        followers.map((follower, index) => (
          <UserFollowerCard key={index} user={follower} />
        ))
      ) : (
        <div className="w-full mt-2 text-center">There are no followers</div>
      )}
    </div>
  );
}
