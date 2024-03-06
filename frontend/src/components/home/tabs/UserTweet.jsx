import React, { useState } from "react";
import Avatar from "../../common/Avatar";
import moment from "moment";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { UseAuthContext } from "../../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { IoTrashBinOutline } from "react-icons/io5";
import { FiEdit2 } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import Modal from "../Modal";
import { useModal } from "../../../hooks/useModal";

export default function UserTweet({ name, content, time, id, authorId }) {
  // state
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState(false);
  const [tweet, setTweet] = useState("");
  const [loading, setLoading] = useState(false);

  // utils
  const { user } = UseAuthContext();
  const navigate = useNavigate();
  const { active, openModal, closeModal } = useModal();

  // delete tweet function
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}tweets/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response.data);
      navigate("/profile");
      setLoading(false);
      closeModal();
      setEdit(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
      closeModal();
    }
  };

  // edit the tweet
  const handleSubmit = async () => {
    setLoading(true);

    if (tweet === "") {
      setLoading(false);
      return setError("Please type something");
    }

    const formBody = {
      content: tweet,
    };

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}tweets/${id}`,
        formBody,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response.data);
      navigate("/profile");
      setLoading(false);
      setEdit(false);
    } catch (error) {
      console.log(error);
      setEdit(false);
      setLoading(false);
    }
  };

  // delete modal content
  const body = (
    <div className="w-full flex flex-col gap-2 text-center">
      <div className="mt-2">
        <p className="text-sm">Are you sure you want to delete this tweet?</p>
      </div>
      <div className="mt-4 w-full flex gap-2">
        <button
          className="flex-1 inline-flex justify-center items-center p-2 bg-rose-500 rounded-md text-white dark:text-white"
          onClick={handleDelete}
        >
          {loading ? (
            <CgSpinner className="animate-spin text-white" size={20} />
          ) : (
            "Delete"
          )}
        </button>
        <button
          className="flex-1 p-2 border border-gray-200 dark:border-gray-800 rounded-md text-secondary dark:text-white"
          onClick={closeModal}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const editBody = (
    <div className="mt-2">
      <textarea
        name="content"
        id="content"
        cols="30"
        rows="6"
        placeholder={"Your edit"}
        className={`p-2 overflow-y-auto rounded-md outline-none border border-veryLightGray dark:border-gray-800 bg-white dark:bg-secondary ${
          error && "border border-rose-400"
        }`}
        onChange={(e) => setTweet(e.target.value)}
        onFocus={() => setError("")}
      >
        {content}
      </textarea>
      <div className="mt-4 w-full flex gap-2">
        <button
          type="button"
          className="flex-1 inline-flex justify-center items-center p-2 bg-green-500 rounded-md text-white dark:text-white"
          onClick={handleSubmit}
        >
          {loading ? (
            <CgSpinner className="animate-spin text-white" size={20} />
          ) : (
            "Edit"
          )}
        </button>
        <button
          type="button"
          className="flex-1 p-2 border border-gray-200 dark:border-gray-800 rounded-md text-secondary dark:text-white"
          onClick={() => setEdit(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const formated = moment(time).fromNow();
  return (
    <>
      <div className="flex gap-3 items-start p-2">
        <Avatar size={10} />
        <div className="w-full">
          <div className="flex justify-between items-center">
            <h2 className="text-base">{name}</h2>
            <span className="text-tertiary text-xs">{formated}</span>
          </div>
          <div className="w-full text-sm">
            <p>{content}</p>
          </div>
          {user.id === authorId ? (
            <div className="w-full mt-2 flex justify-end gap-2 text-xs divide-x divide-veryLightGray dark:divide-gray-800">
              <div className="p-1">
                <button
                  className="hover:text-rose-400 focus:text-rose-400 rounded-sm"
                  onClick={() => openModal()}
                >
                  <IoTrashBinOutline size={20} />
                </button>
              </div>
              <div className="p-1">
                <button
                  className="hover:text-green-400 focus:text-green-400 rounded-sm"
                  onClick={() => setEdit(true)}
                >
                  <FiEdit2 size={16} />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Modal active={active} title={"Delete tweet"} content={body} />
      <Modal active={edit} title={"Edit tweet"} content={editBody} />
    </>
  );
}
