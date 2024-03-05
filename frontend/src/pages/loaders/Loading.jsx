import { CgSpinner } from "react-icons/cg";

export default function Loading() {
  return (
    <div className="abolute top-[74px] bottom-[70px] flex items-center justify-center w-full h-[70vh]">
      <CgSpinner className="animate-spin text-blue-500 w-8 h-8" />
    </div>
  );
}
