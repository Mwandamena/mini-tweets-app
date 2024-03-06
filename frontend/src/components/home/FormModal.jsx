import { useContext, useState } from "react";
import { PostContext } from "../../context/PostProvider";

import Button from "../common/Button";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UseAuthContext } from "../../hooks/useAuthContext";

export default function FormModal({ acitve }) {
  // open the post modal
  const { user } = UseAuthContext();
  const { open, setOpen } = useContext(PostContext);
  const navigate = useNavigate();

  // state
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");

  const handleModal = () => {
    setOpen(false);
    setDisabled(false);
    setLoading(false);
    setError(false);
  };

  // form submit
  const handleSubmit = async (e) => {
    setDisabled(true);
    setLoading(true);
    e.preventDefault();

    if (content === "") {
      setLoading(false);
      setDisabled(false);
      setError("Please type something");
    }

    try {
      const formData = {
        authorId: user.id,
        content,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}tweets`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response) {
        setLoading(false);
        setDisabled(false);
        setOpen(false);
        navigate("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AnimatePresence>
        {acitve && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 w-full bg-black/80 flex flex-col items-center justify-center z-[200] dark:backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.1,
                },
              }}
              exit={{
                opacity: 0,
              }}
              className="bg-white border border-gray-800 max-w-lg p-4  rounded-lg z-[200] dark:bg-secondary text-secondary dark:text-white"
            >
              {/* modal header */}
              <div className="text-center">
                <h2>Post</h2>
              </div>
              {/* modal form */}
              <form
                className="mt-4 flex flex-col gap-2"
                onSubmit={(e) => handleSubmit(e)}
              >
                <textarea
                  name="content"
                  id="content"
                  cols="25"
                  rows="10"
                  placeholder={"What is happening?"}
                  className={`p-2 rounded-md outline-none bg-white dark:bg-secondary ${
                    error && "border border-rose-400"
                  }`}
                  onChange={(e) => setContent(e.target.value)}
                  onFocus={() => setError("")}
                ></textarea>
                {error && (
                  <span className="text-xs text-rose-400">{error}</span>
                )}
                {/* modal footer */}
                <div className="w-full flex gap-4 justify-between mt-4">
                  <Button
                    label={loading ? "" : "Post"}
                    large
                    styles={"rounded-md bg-blue-500"}
                    type={"submit"}
                    disabled={disabled}
                    loading={loading}
                  />
                  <Button
                    label={"Cancel"}
                    large
                    outline
                    styles={
                      "rounded-md dark:bg-tertiary dark:border-tertiary text-secondary dark:text-white"
                    }
                    type={"button"}
                    onClick={handleModal}
                  />
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
