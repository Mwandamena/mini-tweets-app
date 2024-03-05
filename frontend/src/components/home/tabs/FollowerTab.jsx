import ProfileFollowerCard from "./ProfileFollowerCard";
import UserFollowerCard from "./UserFollowerCard";

export default function FollowerTab({ followers }) {
  return (
    <div className="w-full mt-4 flex flex-col gap-4 text-secondary dark:text-white divide-y divide-veryLightGray dark:divide-gray-800  bg-white dark:bg-secondary">
      {followers?.length > 0 ? (
        followers.map((follower, index) => (
          <ProfileFollowerCard key={index} user={follower} />
        ))
      ) : (
        <div className="w-full mt-2 text-center">There are no followers</div>
      )}
    </div>
  );
}
