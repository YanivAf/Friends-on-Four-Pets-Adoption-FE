import { useContext } from "react";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import FofContext from "./fofContext";

const TogglePets: React.FC = (): JSX.Element => {
  const { userInfo, viewedUserInfo, whichPets, setWhichPets, setPets } =
    useContext(FofContext);

  const TogglePets = (
    event: React.MouseEvent<HTMLElement>,
    whichPets: string
  ) => {
    setWhichPets(whichPets);
    setPets(viewedUserInfo.userPets);
  };

  return (
    <ToggleButtonGroup
      color="primary"
      aria-label="heightToggle"
      sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
      value={whichPets}
      exclusive
      onChange={TogglePets}
    >
      <ToggleButton
        value="General"
        disabled={whichPets === "General" || userInfo._id === ""}
      >
        General
      </ToggleButton>
      <ToggleButton
        value="Published"
        disabled={whichPets === "Published" || userInfo._id === ""}
      >
        Published
      </ToggleButton>
      <ToggleButton
        value="Adopted"
        disabled={whichPets === "Adopted" || userInfo._id === ""}
      >
        Adopted
      </ToggleButton>
      <ToggleButton
        value="Fostered"
        disabled={whichPets === "Fostered" || userInfo._id === ""}
      >
        Fostered
      </ToggleButton>
      <ToggleButton
        value="Saved"
        disabled={whichPets === "Saved" || userInfo._id === ""}
      >
        Saved
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default TogglePets;
