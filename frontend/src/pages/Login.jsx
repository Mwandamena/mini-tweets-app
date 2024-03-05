import React, { useState } from "react";

import logo from "../assets/images/twitter-logo.svg";

// icons
import { FcGoogle } from "react-icons/fc";
import { BsApple } from "react-icons/bs";
import Input from "../components/forms/Input";
import Button from "../components/common/Button";
import { MdError } from "react-icons/md";
import { useLogin } from "../hooks/useLogin";

export default function Login() {
  // login hook
  const { login, loading, disabled, error, setError } = useLogin();

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // set formdata
  const onChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
      default:
        break;
    }
  };

  // login function
  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();

    const formBody = {
      email: email,
      password: password,
    };

    await login(formBody);
  };

  return (
    <>
      <main className="h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="max-w-sm p-4">
          {/* header */}
          <div className="flex flex-col items-center gap-4">
            <div>
              <img src={logo} alt="Logo" className="w-24" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-secondary dark:text-white">
                Sign in to Twitter
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
              styles={`hover:bg-extraLightGrey dark:hover:bg-black dark:bg-black dark:text-white`}
              disabled
            />
            <Button
              label="Sign Up with Google"
              outline
              large
              icon={<BsApple />}
              styles={`hover:bg-extraLightGrey dark:hover:bg-black dark:bg-black dark:text-white`}
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
              type="email"
              name="email"
              large
              placeholder="Email"
              onChange={onChange}
              disabled={disabled}
              styles={`hover:bg-extraLightGrey dark:hover:bg-black dark:bg-secondary dark:text-white dark:focus:ring-blue-300 dark:focus:ring`}
            />
            <Input
              type="password"
              name="password"
              large
              placeholder="Password"
              onChange={onChange}
              disabled={disabled}
              styles={`hover:bg-extraLightGrey dark:hover:bg-black dark:bg-secondary dark:text-white dark:focus:ring-blue-300 dark:focus:ring`}
            />
            <Button
              label="Login"
              large
              loading={loading}
              disabled={disabled}
              styles={`bg-black dark:bg-blue-500`}
            />
          </form>

          {/* footer */}
          <div className="mt-4 text-center dark:text-white">
            <p>
              Don't have an account?{" "}
              <a href="/signup" className="text-primary">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
