import logo from "../../../assets/images/twitter-logo.svg";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <div className="flex items-center">
      <Link to={"/"}>
        <img src={logo} alt="Logo" className="w-10" />
      </Link>
    </div>
  );
}
