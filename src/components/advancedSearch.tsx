import * as React from "react";
import { useContext } from "react";

import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Fab from "@mui/material/Fab";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SearchIcon from "@mui/icons-material/Search";

import FofContext from "./fofContext";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function AdvancedSearch() {
  const {
    userInfo,
    toggleAdvSearch,
    advSearchOn,
    searchInputs,
    setSearchInputs,
    getPets,
    searchedTypeString,
  } = useContext(FofContext);

  const handleChange = ({ target }: any) => {
    const { value, name } = target;
    const searchPropertyIndex = searchInputs.findIndex(
      (property) => property.by === name
    );
    const searchedValue =
      name === "adoptionStatus" && typeof value === "string"
        ? value.split(",")
        : value;
    const updatedSearchInputs = [...searchInputs];
    updatedSearchInputs[searchPropertyIndex].searchedValue = searchedValue;
    setSearchInputs(updatedSearchInputs);
  };

  const handleMinMaxHChange = (
    event: React.MouseEvent<HTMLElement>,
    newMinMax: string
  ) => {
    const updatedSearchInputs = [...searchInputs];
    updatedSearchInputs[2].minMax = newMinMax;
    setSearchInputs(updatedSearchInputs);
  };

  const handleMinMaxWChange = (
    event: React.MouseEvent<HTMLElement>,
    newMinMax: string
  ) => {
    const updatedSearchInputs = [...searchInputs];
    updatedSearchInputs[3].minMax = newMinMax;
    setSearchInputs(updatedSearchInputs);
  };

  return (
    <SwipeableDrawer
      disableEnforceFocus
      hideBackdrop
      anchor={"top"}
      open={advSearchOn}
      onClose={toggleAdvSearch(false)}
      onOpen={toggleAdvSearch(true)}
      PaperProps={{
        sx: {
          maxWidth: 1024,
          display: "flex",
          margin: "auto",
          overflowX: "auto",
        },
      }}
      sx={{ zIndex: 0 }}
    >
      <Box sx={{ width: "auto", paddingTop: 10 }} role="presentation">
        <Toolbar>
          <form
            style={{ display: "flex", columnGap: "10px", paddingBottom: 10 }}
          >
            <div>
              {userInfo.admin ? (
                <Select
                  sx={{ width: 150, marginRight: 5 }}
                  value={searchInputs[0].searchedValue}
                  multiple
                  onChange={handleChange}
                  name="adoptionStatus"
                  input={<OutlinedInput label="Status" />}
                  renderValue={(selected) =>
                    Array.isArray(selected) && selected.join(", ")
                  }
                  MenuProps={MenuProps}
                >
                  <MenuItem value={"Available"}>
                    <Checkbox
                      checked={
                        searchInputs[0].searchedValue.indexOf("Available") !==
                        -1
                      }
                    />
                    <ListItemText primary={"Available"} />
                  </MenuItem>
                  <MenuItem value={"Fostered"}>
                    <Checkbox
                      checked={
                        searchInputs[0].searchedValue.indexOf("Fostered") !== -1
                      }
                    />
                    <ListItemText primary={"Fostered"} />
                  </MenuItem>
                  <MenuItem value={"Adopted"}>
                    <Checkbox
                      checked={
                        searchInputs[0].searchedValue.indexOf("Adopted") !== -1
                      }
                    />
                    <ListItemText primary={"Adopted"} />
                  </MenuItem>
                </Select>
              ) : (
                <div style={{ width: 75, marginRight: 5 }}></div>
              )}
            </div>
            <TextField
              sx={{ width: 150, marginRight: 5 }}
              label="Name"
              value={searchInputs[1].searchedValue}
              onChange={handleChange}
              name="petName"
              inputProps={{ pattern: "^[a-zA-Z&() ]{2,40}$" }}
            />
            <ToggleButtonGroup
              color="primary"
              aria-label="heightToggle"
              value={searchInputs[2].minMax}
              exclusive
              onChange={handleMinMaxHChange}
            >
              <ToggleButton
                value="Min"
                disabled={searchInputs[2].minMax === "Min"}
              >
                Min
              </ToggleButton>
              <ToggleButton
                value="Max"
                disabled={searchInputs[2].minMax === "Max"}
              >
                Max
              </ToggleButton>
            </ToggleButtonGroup>
            <TextField
              sx={{ width: 150, marginRight: 5 }}
              label="Height (cm)"
              value={searchInputs[2].searchedValue}
              onChange={handleChange}
              name="height"
              inputProps={{ type: "number", max: 100, min: 1 }}
            />
            <ToggleButtonGroup
              color="primary"
              aria-label="weightToggle"
              value={searchInputs[3].minMax}
              exclusive
              onChange={handleMinMaxWChange}
            >
              <ToggleButton
                value="Min"
                disabled={searchInputs[3].minMax === "Min"}
              >
                Min
              </ToggleButton>
              <ToggleButton
                value="Max"
                disabled={searchInputs[3].minMax === "Max"}
              >
                Max
              </ToggleButton>
            </ToggleButtonGroup>
            <TextField
              sx={{ width: 150 }}
              label="Weight (kg)"
              value={searchInputs[3].searchedValue}
              onChange={handleChange}
              name="weight"
              inputProps={{ type: "number", max: 50, min: 0.1, step: "0.1" }}
            />
          </form>
        </Toolbar>
      </Box>
      <Fab
        size="medium"
        color="secondary"
        aria-label="close-adv-search"
        sx={{ position: "fixed", top: 180, left: 20 }}
        onClick={toggleAdvSearch(false)}
      >
        <ExpandLessIcon />
      </Fab>
      <div onClick={toggleAdvSearch(false)}>
        <Fab
          size="medium"
          color="primary"
          aria-label="search"
          sx={{ position: "fixed", top: 180, right: 20 }}
          title="Search/Reset"
          onClick={() => {
            getPets(searchInputs, searchedTypeString);
          }}
        >
          <SearchIcon />
        </Fab>
      </div>
    </SwipeableDrawer>
  );
}