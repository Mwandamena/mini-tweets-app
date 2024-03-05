import { useContext } from "react";
import { PostContext } from "../../context/PostProvider";
import {
  BsPerson,
  BsChat,
  BsPlus,
  BsPersonAdd,
  BsArrowThroughHeart,
} from "react-icons/bs";
import Button from "../common/Button";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLogOut } from "../../hooks/useLogOut";

export default function MobileNavbar() {
  // open the post modal
  const { open, setOpen } = useContext(PostContext);

  // context
  const { logOut } = useLogOut();

  // navigate
  const navigate = useNavigate();

  const handleModal = () => {
    setOpen(true);
  };

  // logout the user
  const handleLogOut = async () => {
    logOut();
    navigate("/login");
  };

  return (
    <div className="md:hidden w-full fixed left-0 -bottom-1 start-0 bg-white dark:bg-secondary border-t border-t-veryLightGray shadow-sm py-4 text-xl z-[999] dark:border-t-gray-800/80">
      <div className="w-full flex justify-around items-center text-tertiary focus:text-black">
        <div>
          <NavLink
            to={`/`}
            className={({ isActive }) =>
              isActive
                ? `text-blue-500 active:text-primary inline-flex flex-col items-center gap-1`
                : `active:text-primary inline-flex flex-col items-center gap-1`
            }
          >
            <BsChat />
            <span className="text-xs">Tweets</span>
          </NavLink>
        </div>
        <div>
          <NavLink
            to={`/users`}
            className={({ isActive }) =>
              isActive
                ? `text-blue-500 active:text-primary inline-flex flex-col items-center gap-1`
                : `active:text-primary inline-flex flex-col items-center gap-1`
            }
          >
            <BsPersonAdd />
            <span className="text-xs">Users</span>
          </NavLink>
        </div>
        <div
          className={`active:text-primary inline-flex flex-col items-center gap-1`}
        >
          <Button
            icon={<BsPlus />}
            styles={`p-2 bg-blue-500`}
            onClick={handleModal}
          />
        </div>
        <div>
          <NavLink
            to={"/profile"}
            className={({ isActive }) =>
              isActive
                ? `text-blue-500 active:text-primary inline-flex flex-col items-center gap-1`
                : `active:text-primary inline-flex flex-col items-center gap-1`
            }
          >
            <BsPerson />
            <span className="text-xs">Profile</span>
          </NavLink>
        </div>
        <div>
          <button
            onClick={() => handleLogOut()}
            className={`active:text-primary inline-flex flex-col items-center gap-1`}
          >
            <BsArrowThroughHeart />
            <span className="text-xs">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
