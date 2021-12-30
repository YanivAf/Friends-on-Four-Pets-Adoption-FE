import { useEffect, useContext } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";

import Loader from "./loader";
import Login from "./login";
import SignUp from "./signUp";
import Home from "./home";
import ProfileView from "./profileView";
import Requests from "./requests";

import FofContext from "./fofContext";

interface P {
  guestsOnly?: boolean;
  adminsOnly?: boolean;
  profileView?: boolean;
  children: React.ReactNode;
}

const MonitoredRoute: React.FC<React.PropsWithChildren<P>> = ({
  guestsOnly,
  adminsOnly,
  profileView,
  children,
}: React.PropsWithChildren<P>): JSX.Element => {
  const { setViewedUserInfo, authProcessing, userInfo } =
    useContext(FofContext);

  useEffect(() => {
    !profileView &&
      setViewedUserInfo({
        user: { _id: "", email: "", fullName: "", phone: "" },
        userPets: [],
      });
  }, [profileView, setViewedUserInfo]);

  return (
    <>
      {
        authProcessing ? ( // if processing
          <Loader /> // show loader
        ) : userInfo._id ? ( // if logged in
          userInfo.admin ? ( // and admin
            guestsOnly ? (
              <Navigate to="/" />
            ) : (
              children
            ) // show page. navigate home if guests page
          ) : guestsOnly || adminsOnly ? ( // if non-admin user and guests/admin page accessed
            <Navigate to="/" />
          ) : (
            children
          ) // navigate home. other pages will be shown
        ) : guestsOnly ? (
          children
        ) : (
          <Navigate to="/login" />
        ) // if guest and accessed guest page - show it, if accessed protected pages- navigate to login
      }
    </>
  );
};

const FofRoutes: React.FC = (): JSX.Element => {
  return (
    <Routes>
      <Route
        path="/signup"
        element={
          <MonitoredRoute guestsOnly>
            <SignUp />
          </MonitoredRoute>
        }
      />
      <Route
        path="/login"
        element={
          <MonitoredRoute guestsOnly>
            <Login />
          </MonitoredRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <MonitoredRoute>
            <ProfileView />
          </MonitoredRoute>
        }
      />
      <Route
        path="/requests"
        element={
          <MonitoredRoute>
            <Requests />
          </MonitoredRoute>
        }
      />
      <Route
        path="/users"
        element={
          <MonitoredRoute adminsOnly>
            <Home />
          </MonitoredRoute>
        }
      />
      <Route
        path="/profile-view/*"
        element={
          <MonitoredRoute adminsOnly profileView>
            <ProfileView />
          </MonitoredRoute>
        }
      />
      <Route path="/" element={<Home />} />
      <Route
        path="*"
        element={
          <p>
            Ummm... We didn't find what you were looking for.{" "}
            {<Link to="/">Go Home</Link>}
          </p>
        }
      />
    </Routes>
  );
};

export default FofRoutes;
