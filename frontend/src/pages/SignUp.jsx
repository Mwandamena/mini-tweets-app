import { useContext, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

import logo from "../assets/images/twitter-logo.svg";

// icons
import { FcGoogle } from "react-icons/fc";
import { BsApple } from "react-icons/bs";
import { MdError } from "react-icons/md";
import Button from "../components/common/Button";
import Input from "../components/forms/Input";
import { useSignUp } from "../hooks/useSignUp";

export default function Login() {
  // hook
  const { signUp, loading, error, disabled, setError } = useSignUp();

  // form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // set form data
  const onChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  // login function
  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();

    if (username.trim() === " ") {
      setError("Username must not be empty");
    }

    const formBody = {
      username: username,
      password: password,
      email: email,
    };
    await signUp(formBody);
  };

  return (
    <>
      <main className="h-screen flex items-center justify-center bg-white dark:bg-secondary">
        <div className="max-w-sm p-4">
          {/* header */}
          <div className="flex flex-col items-center gap-4">
            <div>
              <img src={logo} alt="Logo" className="w-24" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-secondary dark:text-white">
                Sign Up to Twitter
              </h1>
            </div>
          </div>

          {/* social login buttons */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <Button
              label="Sign Up with Google"
              outline
              large
              icon={<FcGoogle />}
              styles={`hover:bg-extraLightGrey dark:hover:bg-black dark:bg-secondary dark:text-white`}
              disabled
            />
            <Button
              label="Sign Up with Google"
              outline
              large
              icon={<BsApple />}
              styles={`hover:bg-extraLightGrey dark:hover:bg-black dark:bg-secondary dark:text-white`}
              disabled
            />
          </div>

          {/* form */}
          <form
            className="mt-10 flex flex-col gap-2 items-center"
            onSubmit={(e) => handleSubmit(e)}
          >
            {error && (
              <div className="w-full text-start text-xs p-2 bg-rose-200 rounded-md flex items-center justify-between">
                <span className="text-rose-400">{error}</span>
                <MdError className="text-red-400 text-base" />
              </div>
            )}
            <Input
              placeholder="Username"
              large
              name="username"
              type="text"
              onChange={onChange}
              styles={`dark:bg-secondary dark:border-gray-800 dark:focus:ring dark:focus:ring-blue-400 dark:text-white dark:placeholder:text-white`}
            />
            <Input
              type="email"
              name="email"
              large
              placeholder="Email"
              onChange={onChange}
              styles={`dark:bg-secondary dark:border-gray-800 dark:focus:ring dark:focus:ring-blue-400 dark:text-white dark:placeholder:text-white`}
            />
            <Input
              type="password"
              name="password"
              large
              placeholder="Password"
              onChange={onChange}
              styles={`dark:bg-secondary dark:border-gray-800 dark:focus:ring dark:focus:ring-blue-400 dark:text-white dark:placeholder:text-white`}
            />
            <Button
              label="Sign Up"
              large
              loading={loading}
              disabled={disabled}
              styles={`bg-secondary dark:bg-blue-500`}
            />
          </form>

          {/* footer */}
          <div className="mt-4 text-center dark:text-white">
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-primary">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
