import Navbar from "./header/Navbar";
import { Navigate, Outlet } from "react-router-dom";
import Button from "../common/Button";
import { BsPlus } from "react-icons/bs";
import MobileNavbar from "./MobileNavbar";
import FormModal from "./FormModal";
import { useContext } from "react";
import { PostContext } from "../../context/PostProvider";

export default function Layout({}) {
  // modal context
  const { open, setOpen } = useContext(PostContext);

  const handleModal = () => {
    setOpen(true);
  };

  return (
    <>
      <main className="relative mt-[74px] flex flex-col justify-between bg-white dark:bg-secondary">
        <Navbar />
        <section className="w-full flex flex-col justify-between">
          <Outlet />
        </section>
        <div className="fixed bottom-6 left-1/2 md:block hidden">
          <Button
            icon={<BsPlus />}
            styles={`p-3 bg-blue-500`}
            onClick={handleModal}
          />
        </div>
        <MobileNavbar />
        <FormModal acitve={open} />
      </main>
    </>
  );
}
