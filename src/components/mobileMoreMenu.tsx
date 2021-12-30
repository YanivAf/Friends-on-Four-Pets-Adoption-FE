import * as React from "react";
import { useContext } from "react";

import Cookies from "universal-cookie";

import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";

import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Link from "@mui/material/Link";

import FofContext from "./fofContext";

interface Props {
  mobileMoreMenuId: string;
  mobileMoreAnchorEl: null | HTMLElement;
  setMobileMoreAnchorEl: (el: null | HTMLElement) => void;
  handleLogOut: () => void;
}

const MobileMoreMenu: React.FC<Props> = ({
  mobileMoreMenuId,
  mobileMoreAnchorEl,
  setMobileMoreAnchorEl,
  handleLogOut,
}: Props): JSX.Element => {
  const { currentPath, userInfo, userInfoDispatch, setWhichPets } =
    useContext(FofContext);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMoreMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleApprovedRequsts = () => {
    const cookies = new Cookies();
    cookies.set("whichPets", "Owned", { path: "/", maxAge: 10 });
    cookies.set("userId", userInfo._id, { path: "/", maxAge: 10 });
    setWhichPets("Owned");
    userInfoDispatch({ ...userInfo, recentlyApproved: 0 });
  };

  return (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMoreMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMoreMenuClose}
    >
      <MenuItem>{`Welcome, ${userInfo.fullName}!`}</MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label={`show ${userInfo.incomingRequests?.length} incoming requests`}
          color="inherit"
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
        <Link
          underline="none"
          color="black"
          {...(userInfo.incomingRequests !== undefined &&
            userInfo.incomingRequests?.length > 0 &&
            currentPath !== "/requests" && { href: "/requests" })}
        >
          Incoming Requests
        </Link>
      </MenuItem>
      <MenuItem onClick={() => handleApprovedRequsts()}>
        <IconButton
          size="large"
          aria-label={`show ${userInfo.recentlyApproved} recently approved request`}
          color="inherit"
          {...(currentPath !== "/" && { href: "/" })}
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
        <Link
          underline="none"
          color="black"
          {...(currentPath !== "/" && { href: "/" })}
        >
          Approved Requests
        </Link>
      </MenuItem>
      <MenuItem>User Options</MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="user profile"
          aria-controls="user-profile"
          color="inherit"
          {...(currentPath !== "/profile" && { href: "/profile" })}
        >
          <AccountCircle />
        </IconButton>
        <Link
          underline="none"
          color="black"
          {...(currentPath !== "/profile" && { href: "/profile" })}
        >
          Profile
        </Link>
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleLogOut();
        }}
      >
        <IconButton
          size="large"
          aria-label="logout"
          aria-controls="logout"
          color="inherit"
        >
          <LogoutIcon />
        </IconButton>
        <p>Log Out</p>
      </MenuItem>
    </Menu>
  );
};

export default MobileMoreMenu;
