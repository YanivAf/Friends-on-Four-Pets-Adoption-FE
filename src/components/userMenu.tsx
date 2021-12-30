import * as React from "react";
import { useContext } from "react";

import fofContext from "./fofContext";

import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";

import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircle from "@mui/icons-material/AccountCircle";

interface Props {
  userMenuId: string;
  userAnchorEl: null | HTMLElement;
  setUserAnchorEl: (el: null | HTMLElement) => void;
  handleLogOut: () => void;
}

const UserMenu: React.FC<Props> = ({
  userMenuId,
  userAnchorEl,
  setUserAnchorEl,
  handleLogOut,
}: Props): JSX.Element => {
  const { currentPath } = useContext(fofContext);

  const isUserMenuOpen = Boolean(userAnchorEl);

  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
  };

  return (
    <Menu
      anchorEl={userAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      id={userMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isUserMenuOpen}
      onClose={handleUserMenuClose}
    >
      <MenuItem onClick={() => handleUserMenuClose()}>
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
          handleUserMenuClose();
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

export default UserMenu;
