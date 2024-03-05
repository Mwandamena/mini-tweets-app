import { IoMdExit } from "react-icons/io";
import Avatar from "../../common/Avatar";
import { Link, useNavigate } from "react-router-dom";
import { UseAuthContext } from "../../../hooks/useAuthContext";
import { useLogOut } from "../../../hooks/useLogOut";
import { MdDarkMode, MdLightMode, MdSettings } from "react-icons/md";
import { useTheme } from "../../../hooks/useTheme";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BsPerson, BsTools } from "react-icons/bs";

export default function Links() {
  // state
  const [menu, setMenu] = useState(false);
  // context
  const navigate = useNavigate();
  const { logOut } = useLogOut();
  const { setDarkMode, darkMode } = useTheme();

  const navlinks = [
    {
      id: 0,
      name: "Feed",
      src: "/",
    },
    {
      id: 1,
      name: "Users",
      src: "/users",
    },
  ];

  const { user } = UseAuthContext();

  // logout function
  const handleLogOut = () => {
    logOut();
    navigate("/login");
  };

  // function to toggle theme
  const toggleTheme = () => {
    setDarkMode((current) => !current);
  };

  // functon to toggle menu
  const toggleMenu = () => {
    setMenu((current) => !current);
  };

  return (
    <>
      <ul className="hidden md:flex items-center gap-4 justify-center">
        {navlinks?.map((link) => (
          <Link key={link.id} to={link.src}>
            {link.name}
          </Link>
        ))}

        <div className="flex items-center gap-2">
          <button
            className="p-1 hidden gap-2 md:flex items-center hover:bg-gray-200 dark:hover:bg-gray-900 rounded-full"
            onClick={() => toggleMenu()}
          >
            <span>{user ? user?.name : "User"}</span>
            <Avatar />
          </button>
        </div>
        <div className="p-1 bg-white dark:bg-tertiary rounded-full">
          <button className="block" onClick={() => toggleTheme()}>
            {darkMode ? <MdDarkMode size={16} /> : <MdLightMode />}
          </button>
        </div>
      </ul>
      <div className="flex items-center gap-2 md:hidden">
        <button
          className="flex items-center gap-2 p-2 rounded-3xl hover:bg-extraLightGrey dark:hover:bg-tertiary transition-all duration-200"
          onClick={() => toggleMenu()}
        >
          <span>{user?.name}</span>
          <Avatar size={8} />
        </button>
        <div className="p-1 bg-white dark:bg-tertiary rounded-full">
          <button className="block" onClick={() => toggleTheme()}>
            {darkMode ? <MdDarkMode size={16} /> : <MdLightMode />}
          </button>
        </div>
      </div>

      {/* menu */}
      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="max-w-xs fixed top-[84px] right-10 md:right-36 bg-white dark:bg-secondary border border-gray-200 dark:border-gray-800 shadow-xl divide-y divide-veryLightGray dark:divide-gray-800 flex flex-col rounded-md"
          >
            <Link
              to={"/profile"}
              className="inline-flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-950 rounded-t-md"
              onClick={() => toggleMenu()}
            >
              <BsPerson />
              <span>Profile</span>
            </Link>
            <Link
              to={"/settings"}
              className="inline-flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-950"
              onClick={() => toggleMenu()}
            >
              <MdSettings />
              <span>Settings</span>
            </Link>
            <button
              onClick={() => handleLogOut()}
              className="inline-flex gap-2 items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-950 rounded-b-md"
            >
              <IoMdExit className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
