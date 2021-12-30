import * as React from "react";
import { useContext } from "react";

import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";

import SearchIcon from "@mui/icons-material/Search";
import BiotechIcon from "@mui/icons-material/Biotech";

import FofContext from "./fofContext";

interface Props {
  searchOptionsMenuId: string;
  searchOptionsAnchorEl: null | HTMLElement;
  setSearchOptionsAnchorEl: (el: null | HTMLElement) => void;
}

const SearchOptionsMenu: React.FC<Props> = ({
  searchOptionsMenuId,
  searchOptionsAnchorEl,
  setSearchOptionsAnchorEl,
}: Props): JSX.Element => {
  const { currentPath, userInfo, toggleAdvSearch, setSearchInputs } =
    useContext(FofContext);

  const isSearchOptionsMenuOpen = Boolean(searchOptionsAnchorEl);

  const handleSearchOptionsMenuClose = () => {
    setSearchOptionsAnchorEl(null);
  };

  const handleSearchType = () => {
    handleSearchOptionsMenuClose();
    setSearchInputs([
      { by: "adoptionStatus", searchedValue: ["Available"] },
      { by: "petName", searchedValue: "" },
      { by: "height", searchedValue: "", minMax: "Min" },
      { by: "weight", searchedValue: "", minMax: "Min" },
    ]);
  };

  return (
    <Menu
      anchorEl={searchOptionsAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={searchOptionsMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isSearchOptionsMenuOpen}
      onClose={handleSearchOptionsMenuClose}
    >
      {userInfo.admin && (
        <div onClick={toggleAdvSearch(false)}>
          <MenuItem
            onClick={() => {
              handleSearchOptionsMenuClose();
            }}
            {...(currentPath !== "/users" && { href: "/users" })}
          >
            <Link
              underline="none"
              color="black"
              {...(currentPath !== "/users" && { href: "/users" })}
            >
              Users
            </Link>
          </MenuItem>
        </div>
      )}
      <div onClick={toggleAdvSearch(false)}>
        <MenuItem
          onClick={() => handleSearchType()}
          {...(currentPath !== "/" && { href: "/" })}
        >
          <Link
            underline="none"
            color="black"
            {...(currentPath !== "/" && { href: "/" })}
          >
            Pets
          </Link>
        </MenuItem>
        <MenuItem onClick={() => handleSearchType()}>
          <IconButton
            size="large"
            aria-label="basic pets search"
            aria-controls="basic-search-options"
            aria-haspopup="true"
            color="inherit"
            {...(currentPath !== "/" && { href: "/" })}
          >
            <SearchIcon />
          </IconButton>
          <Link
            underline="none"
            color="black"
            {...(currentPath !== "/" && { href: "/" })}
          >
            Basic
          </Link>
        </MenuItem>
      </div>
      <div onClick={toggleAdvSearch(true)}>
        <MenuItem onClick={() => handleSearchType()}>
          <IconButton
            size="large"
            aria-label="advanced pets search"
            aria-controls="advanced-search-options"
            aria-haspopup="true"
            color="inherit"
            {...(currentPath !== "/" && { href: "/" })}
          >
            <BiotechIcon />
          </IconButton>
          <Link
            underline="none"
            color="black"
            {...(currentPath !== "/" && { href: "/" })}
          >
            Advanced
          </Link>
        </MenuItem>
      </div>
    </Menu>
  );
};

export default SearchOptionsMenu;
