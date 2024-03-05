// react router
import {
  RouterProvider,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";

// components
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/home/Profile";
import Settngs from "./pages/home/Settings";
import User from "./pages/home/User";
import NotFound from "./pages/404";
import Feed from "./pages/home/Feed";
import Layout from "./components/home/Layout";
import { PostProvider } from "./context/PostProvider";
import UserProfile from "./pages/home/UserProfile";
import { UseAuthContext } from "./hooks/useAuthContext";
import { useFetch } from "./hooks/useFetch";
import ThemeProvider from "./context/ThemeProvider";
import Settings from "./pages/home/Settings";

function App() {
  const { user } = UseAuthContext();
  const { fetchUser, fetchFeed, fetchUsers } = useFetch();

  // react router
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={user ? <Layout /> : <Navigate to="/login" />}
          errorElement={<Error />}
        >
          <Route
            index={true}
            path="/"
            element={<Feed />}
            loader={fetchFeed}
            errorElement={<Error />}
          />
          <Route
            path="/profile"
            element={<Profile />}
            loader={fetchUser}
            errorElement={<Error />}
          />
          <Route
            path="/users/"
            element={<User />}
            loader={fetchUsers}
            errorElement={<Error />}
          />
          <Route
            path="/users/:id"
            element={<UserProfile />}
            errorElement={<Error />}
          />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return (
    <>
      <PostProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </PostProvider>
    </>
  );
}

export default App;
