import { useEffect, useState } from "react";
import Container from "../../components/common/Container";
import Avatar from "../../components/common/Avatar";

// images
import { UseAuthContext } from "../../hooks/useAuthContext";
import { useNavigation } from "react-router-dom";
import { IoMdTrash } from "react-icons/io";
import { MdError, MdPages } from "react-icons/md";
import Input from "../../components/forms/Input";
import Button from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import Modal from "../../components/home/Modal";
import { CgSpinner } from "react-icons/cg";
import { useDeleteAccount } from "../../hooks/useDeleteAccount";
import { useEditAccount } from "../../hooks/useEditAccount";

export default function Settings() {
  // hooks
  const { user } = UseAuthContext();
  const {
    deleteAccount,
    disabled,
    error,
    loading: isLoading,
  } = useDeleteAccount();
  const {
    editAccount,
    disabled: editDisabled,
    error: editError,
    loading: editLoading,
    setError,
  } = useEditAccount();
  const navigation = useNavigation();
  const { active, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState({
    username: user.name,
    email: user.email,
    password: "",
    oldPassword: "",
  });

  // set input values
  const handleOnChangle = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle submit
  const handleSubmit = (e) => {
    setError("");
    console.log(formData.username);
    e.preventDefault();

    // validation
    if (!formData.username || formData.username.trim().length === 0) {
      return setError("Username cannot be empty");
    }

    if (!formData.email || formData.email.trim().length === 0) {
      return setError("Email cannot be empty");
    }

    if (!formData.password || formData.password.trim().length === 0) {
      return setError("New password cannot be empty");
    }

    if (!formData.oldPassword || formData.oldPassword.trim().length === 0) {
      return setError("Old password cannot be empty");
    }

    if (formData.password.trim() < 5) {
      return setError("Password must be atleast greater than 5 characters");
    }

    const formBody = {
      username: formData.username,
      email: formData.email,
      oldPassword: formData.oldPassword,
      newPassword: formData.password,
    };

    // edit the user
    editAccount(formBody);
  };

  // delete account function
  const handleDelete = () => {
    deleteAccount();
  };

  // delete modal content
  const deleteModalBody = (
    <div className="w-full flex flex-col gap-2 text-center">
      <div className="mt-2">
        <p>Are you sure you want to delete your account?</p>
        <p>This action cannot be undone!</p>
      </div>
      <div className="mt-4 w-full flex gap-2">
        <button
          className="flex-1 inline-flex justify-center items-center p-2 bg-rose-500 rounded-md text-white dark:text-white"
          onClick={() => handleDelete()}
        >
          {isLoading ? (
            <CgSpinner className="animate-spin text-white" size={20} />
          ) : (
            "Delete"
          )}
        </button>
        <button
          className="flex-1 p-2 border border-gray-200 dark:border-gray-800 rounded-md text-secondary dark:text-white disabled:opacity-65"
          disabled={disabled}
          onClick={() => closeModal()}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <>
      <main className="w-full mt-4 mb-20 bg-white dark:bg-secondary">
        <Container>
          <div className="w-full flex flex-col items-center">
            <div className="w-full md:max-w-md text-secondary dark:text-veryLightGray">
              <div>
                <h2>Settings</h2>
              </div>

              {/* profile name and icon */}
              <div className="mt-4 flex flex-col justify-start">
                <Avatar size={10} />
                <div className="mt-2">
                  <h1 className="font-bold text-2xl">{user.name}</h1>
                </div>
              </div>

              {/* delete account */}
              <div className="flex items-center gap-1 mt-4 divide-x divide-veryLightGray dark:divide-gray-800">
                <div className="text-rose-400">
                  <button
                    className="p-1 inline-flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md"
                    onClick={() => openModal()}
                  >
                    <IoMdTrash />
                    <span>Delete account</span>
                  </button>
                </div>
                <div className="pl-1">
                  <div className="p-1 inline-flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md">
                    <MdPages />
                    <a href="#">Privacy policy</a>
                  </div>
                </div>
              </div>

              {/* edit profile */}
              <div className="mt-4">
                <h2>Edit your profile</h2>
                <p className="text-xs">
                  Edit your username, email and password below
                </p>

                {/* form error */}
                {editError && (
                  <div className="mt-2 w-full text-start text-xs p-2 bg-rose-200 rounded-md flex items-center justify-between">
                    <span className="text-rose-400">{editError}</span>
                    <MdError className="text-red-400 text-base" />
                  </div>
                )}

                {/* form */}
                <form
                  className="mt-4 flex flex-col gap-4 text-sm max-w-xs"
                  onSubmit={(e) => handleSubmit(e)}
                >
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name">Edit Name</label>
                    <Input
                      name={"username"}
                      value={formData.username}
                      placeholder={"Username"}
                      type={"text"}
                      styles={`py-1 px-4 hover:bg-extraLightGrey dark:hover:bg-black dark:bg-secondary dark:text-white dark:focus:ring-blue-300 dark:focus:ring`}
                      onChange={handleOnChangle}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email">Edit Your Email address</label>
                    <span className="p-1 text-xs text-green-800 inline-flex items-center gap-2">
                      <MdError />{" "}
                      <span>
                        The first word before the @ becomes your handle
                      </span>
                    </span>
                    <Input
                      name={"email"}
                      value={formData.email}
                      placeholder={"Email"}
                      type={"email"}
                      styles={`py-1 px-4 hover:bg-extraLightGrey dark:hover:bg-black dark:bg-secondary dark:text-white dark:focus:ring-blue-300 dark:focus:ring`}
                      onChange={handleOnChangle}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="oldPassword">Old Password</label>
                    <Input
                      name={"oldPassword"}
                      placeholder={"Old password"}
                      type={"password"}
                      styles={`py-1 px-4 hover:bg-extraLightGrey dark:hover:bg-black dark:bg-secondary dark:text-white dark:focus:ring-blue-300 dark:focus:ring`}
                      onChange={handleOnChangle}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="newPassword">New Password</label>
                    <Input
                      name={"password"}
                      placeholder={"New password"}
                      type={"password"}
                      styles={`py-1 px-4 hover:bg-extraLightGrey dark:hover:bg-black dark:bg-secondary dark:text-white dark:focus:ring-blue-300 dark:focus:ring`}
                      onChange={handleOnChangle}
                    />
                  </div>
                  <div>
                    <Button
                      type={"submit"}
                      loading={editLoading}
                      disabled={editDisabled}
                      small
                      label={"Edit Profile"}
                      styles={"block bg-green-500 py-2"}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* delete modal */}
          <Modal
            title={"Delete Account"}
            content={deleteModalBody}
            active={active}
          />
        </Container>
      </main>
    </>
  );
}
