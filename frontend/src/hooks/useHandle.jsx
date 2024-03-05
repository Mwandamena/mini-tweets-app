export const useHandle = () => {
  const getHandle = (email) => {
    const handle = email.split("@")[0];
    return handle;
  };

  return { getHandle };
};
