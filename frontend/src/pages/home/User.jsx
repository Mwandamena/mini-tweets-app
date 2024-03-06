import { useEffect, useRef, useState } from "react";
import Container from "../../components/common/Container";
import FollowerCard from "../../components/home/tabs/FollowerCard";
import { UseAuthContext } from "../../hooks/useAuthContext";
import { useLoaderData } from "react-router-dom";
import { useNavigation } from "react-router-dom";
import Input from "../../components/forms/Input";
import Button from "../../components/common/Button";
import Loading from "../loaders/Loading";
import { CgSearch, CgSpinner } from "react-icons/cg";

export default function User() {
  // context
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState(null);
  const { user } = UseAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const userId = user?.id;

  const data = useLoaderData();

  const filtered = data?.users.filter((user) => user.id !== userId);

  // search functionality
  const inputRef = useRef();

  const handleSearchInput = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (inputRef.current.value === search) {
        const response = await fetch(
          `${process.env.APP_URL}users/search/?q=${search}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const data = await response.json();
        setResults(data.results);
        setIsLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search, inputRef]);

  if (navigation.state === "loading") {
    <Loading />;
  }

  return (
    <>
      <main className="relative w-full mt-4 mb-20 bg-white dark:bg-secondary">
        <Container>
          <div className="flex flex-col items-center justify-center">
            <div className="max-w-lg">
              <div>
                <div className="text-black dark:text-white">
                  <h1>Follow Users</h1>
                  <p>
                    Follow other people to see what is happening on your feed.
                  </p>
                </div>
              </div>

              <div className="w-full mt-8 sticky top-[74px] z-20 right-0 left-0 p-2 bg-white dark:bg-secondary border-extraLightGrey dark:border-b-gray-800 border-b">
                <form className="flex gap-2" onSubmit={(e) => handleSubmit(e)}>
                  <Input
                    name={"search"}
                    inputRef={inputRef}
                    type="text"
                    placeholder={"Search users"}
                    onChange={handleSearchInput}
                    styles={`w-full py-1 px-2 flex-1 outline-none border border-gray-100 dark:text-white dark:bg-secondary dark:border-gray-800 focus:ring focus:ring-primary/90`}
                  />
                  <Button
                    styles={"bg-blue-500 text-sm max-w-[80px]"}
                    icon={<CgSearch size={16} />}
                    small
                  />
                </form>
              </div>

              {/* list of users */}
              {search ? (
                <div className="mt-2 fex flex-col gap-4 bg-white dark:bg-secondary text-secondary dark:text-veryLightGray">
                  <div className="text-xs">
                    <p className="flex items-center gap-1">
                      <span>Showing search results for </span>
                      <span className="font-bold">{search}</span>
                    </p>
                  </div>
                  <div className="w-full mt-4 flex flex-col gap-4">
                    {isLoading ? (
                      <div className="w-full h-[30vh] flex items-center justify-center">
                        <CgSpinner
                          className="animate-spin text-blue-500"
                          size={28}
                        />
                      </div>
                    ) : (
                      <div className="divide-y divide-veryLightGray dark:divide-gray-800">
                        {results.length > 0 ? (
                          results.map((user, index) => (
                            <FollowerCard key={index} user={user} />
                          ))
                        ) : (
                          <div className="w-full h-[50vh] flex items-center justify-center">
                            <p>No results found</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full mt-4 flex flex-col gap-4 divide-y divide-veryLightGray dark:divide-gray-800">
                  {filtered.length > 0 ? (
                    filtered.map((item) => (
                      <FollowerCard key={item.id} user={item} />
                    ))
                  ) : (
                    <div>
                      <h3>Looks like this list is empty.</h3>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
