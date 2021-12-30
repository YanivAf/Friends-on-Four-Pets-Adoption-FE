import * as React from "react";
import { useState, useContext } from "react";

import swal from "sweetalert";
import Cookies from "universal-cookie";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import PetsIcon from "@mui/icons-material/Pets";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Search, StyledInputBase } from "../styles/allStyle";

import UserMenu from "./userMenu";
import MobileMoreMenu from "./mobileMoreMenu";
import SearchOptionsMenu from "./searchOptionsMenu";

import FofContext from "./fofContext";

const NavBar: React.FC = (): JSX.Element => {
  const {
    currentPath,
    userInfo,
    userInfoDispatch,
    searchInputs,
    searchedTypeString,
    setSearchedTypeString,
    searchedUserString,
    setSearchedUserString,
    byWhat,
    getPets,
    getUsers,
    toggleAdvSearch,
    setWhichPets,
    logout,
  } = useContext(FofContext);

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOptionsAnchorEl, setSearchOptionsAnchorEl] =
    useState<null | HTMLElement>(null);

  const userMenuId = "user-menu";
  const mobileMoreMenuId = "mobile-menu";
  const searchOptionsMenuId = "search-options-menu";

  const handleLogOut = () => {
    try {
      swal({
        title: "Log out?",
        icon: "warning",
        buttons: ["Cancel", "Yes"],
        dangerMode: true,
      }).then(async (willLogout: boolean) => {
        if (willLogout) {
          setWhichPets("General");
          logout();
          swal({
            title: "You Are Logged Out",
            text: `See you next time!`,
            icon: "success",
            buttons: [false, "Bye"],
          });
        }
      });
    } catch (error) {
      console.error("error logging out: ", error);
    }
  };

  const handleMobileMoreMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setMobileMoreAnchorEl(event.currentTarget);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setUserAnchorEl(event.currentTarget);

  const handleSearchOptionsMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setSearchOptionsAnchorEl(event.currentTarget);

  const handleApprovedRequests = () => {
    const cookies = new Cookies();
    cookies.set("whichPets", "Owned", { path: "/", maxAge: 10 });
    cookies.set("userId", userInfo._id, { path: "/", maxAge: 10 });
    setWhichPets("Owned");
    userInfoDispatch({ ...userInfo, recentlyApproved: 0 });
  };

  return (
    <Box sx={{ flexGrow: 1, position: "sticky", top: 0, zIndex: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            {...(currentPath !== "/" && { href: "/" })}
            edge="start"
            color="inherit"
            title="Pets Collections"
            sx={{ mr: 2 }}
          >
            <PetsIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Friends on Four
          </Typography>
          {(currentPath === "/" || currentPath === "/users") && (
            <>
              <Search>
                <StyledInputBase
                  inputProps={{
                    "aria-label": "search",
                    style: {
                      paddingLeft: "8px",
                      fontSize: "calc(6px + 1vmin)",
                    },
                  }}
                  disabled={false}
                  placeholder={`Filter by ${
                    byWhat === "byPet" ? "pet type" : "user"
                  }…`}
                  value={
                    byWhat === "byPet" ? searchedTypeString : searchedUserString
                  }
                  onChange={(e) => {
                    byWhat === "byPet"
                      ? setSearchedTypeString(e.target.value)
                      : setSearchedUserString(e.target.value);
                  }}
                />
              </Search>
              <div onClick={toggleAdvSearch(false)}>
                <IconButton
                  size="large"
                  aria-label="get search results"
                  aria-controls={searchOptionsMenuId}
                  aria-haspopup="true"
                  onClick={() => {
                    byWhat === "byPet"
                      ? getPets(searchInputs, searchedTypeString)
                      : getUsers();
                  }}
                  color="inherit"
                  title="Search/Reset"
                >
                  <SearchIcon />
                </IconButton>
              </div>
            </>
          )}
          {userInfo._id && (
            <IconButton
              size="large"
              aria-label="show search options"
              aria-controls={searchOptionsMenuId}
              aria-haspopup="true"
              onClick={(e) => handleSearchOptionsMenuOpen(e)}
              color="inherit"
              title="Search Options"
            >
              <ManageSearchIcon />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            <Typography
              variant="subtitle1"
              noWrap
              component="div"
              sx={{ marginBottom: "0" }}
            >
              {`Welcome, ${userInfo.fullName ? userInfo.fullName : "guest"}!`}
            </Typography>
            {userInfo._id && (
              <>
                <IconButton
                  size="large"
                  aria-label={`show ${userInfo.incomingRequests?.length} incoming requests`}
                  color="inherit"
                  title="Incoming Requests"
                  {...(userInfo.incomingRequests !== undefined &&
                    userInfo.incomingRequests?.length > 0 &&
                    currentPath !== "/requests" && { href: "/requests" })}
                >
                  <Badge
                    badgeContent={userInfo.incomingRequests?.length}
                    color="error"
                    invisible={
                      userInfo.incomingRequests === undefined ||
                      userInfo.incomingRequests?.length === 0
                    }
                  >
                    <MailIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  size="large"
                  aria-label={`show ${userInfo.recentlyApproved} recently approved request`}
                  color="inherit"
                  title="Approved Requests"
                  {...(currentPath !== "/" && { href: "/" })}
                  onClick={() => handleApprovedRequests()}
                >
                  <Badge
                    badgeContent={userInfo.recentlyApproved}
                    color="error"
                    invisible={
                      userInfo.recentlyApproved === undefined ||
                      userInfo.recentlyApproved === 0
                    }
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </>
            )}
            <IconButton
              size="large"
              edge="end"
              aria-label="user menu"
              aria-controls={userMenuId}
              aria-haspopup="true"
              color="inherit"
              title="Profile Options"
              onClick={(e) => handleUserMenuOpen(e)}
              {...(!userInfo._id && { href: "/login" })}
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            {userInfo._id ? (
              <IconButton
                size="large"
                edge="end"
                aria-label="show more"
                aria-controls={mobileMoreMenuId}
                aria-haspopup="true"
                onClick={(e) => handleMobileMoreMenuOpen(e)}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            ) : (
              <IconButton
                size="large"
                edge="end"
                aria-label="user menu"
                aria-controls={userMenuId}
                aria-haspopup="true"
                color="inherit"
                href="/login"
              >
                <AccountCircle />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {userInfo._id && (
        <>
          <UserMenu
            {...{ userMenuId, userAnchorEl, setUserAnchorEl, handleLogOut }}
          />
          <MobileMoreMenu
            {...{
              mobileMoreMenuId,
              mobileMoreAnchorEl,
              setMobileMoreAnchorEl,
              handleLogOut,
            }}
          />
          <SearchOptionsMenu
            {...{
              searchOptionsMenuId,
              searchOptionsAnchorEl,
              setSearchOptionsAnchorEl,
            }}
          />
        </>
      )}
    </Box>
  );
};

export default NavBar;
