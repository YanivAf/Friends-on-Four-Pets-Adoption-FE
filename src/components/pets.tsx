import { useState, useEffect, useContext } from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import FofContext from "./fofContext";
import PetI from "../interfaces/petI";
import FullUserInfoI from "../interfaces/fullUserInfoI";

import Loader from "./loader";
import Pet from "./pet";

const Pets: React.FC = (): JSX.Element => {
  const {
    currentPath,
    userInfo,
    pets,
    viewedUserInfo,
    searchedTypeString,
    searchInputs,
    whichPets,
    authProcessing,
  } = useContext(FofContext);
  const [petsToRender, setPetsToRender] = useState<PetI[]>(pets);

  useEffect(() => {
    let petsResults: PetI[] = pets;
    const relevantUser: FullUserInfoI =
      currentPath === "/" ? userInfo : viewedUserInfo.user;
    switch (whichPets) {
      case "Saved":
        petsResults = petsResults.filter((petResult) => {
          return (
            petResult._id !== undefined &&
            relevantUser.savedPets?.includes(petResult._id)
          );
        });
        break;
      case "Owned":
        petsResults = petsResults.filter((petResult) => {
          return (
            petResult.adopter === relevantUser._id ||
            petResult.foster === relevantUser._id
          );
        });
        break;
      case "Adopted":
        petsResults = petsResults.filter(
          (petResult) => petResult.adopter === relevantUser._id
        );
        break;
      case "Fostered":
        petsResults = petsResults.filter(
          (petResult) => petResult.foster === relevantUser._id
        );
        break;
      case "Published":
        petsResults = petsResults.filter(
          (petResult) => petResult.publisher === relevantUser._id
        );
        break;
      default:
        petsResults = pets;
    }
    petsResults = petsResults.filter((petResult) => {
      const heightMatch =
        searchInputs[2].minMax === "Min"
          ? Number(petResult.height) >= Number(searchInputs[2].searchedValue)
          : Number(petResult.height) <= Number(searchInputs[2].searchedValue);
      const weightMatch =
        searchInputs[3].minMax === "Min"
          ? Number(petResult.weight) >= Number(searchInputs[3].searchedValue)
          : Number(petResult.weight) <= Number(searchInputs[3].searchedValue);
      const statusMatch =
        whichPets === "General"
          ? searchInputs[0].searchedValue.includes(petResult.adoptionStatus)
          : true;

      return (
        new RegExp(searchedTypeString, "gmi").test(petResult.type) &&
        statusMatch &&
        new RegExp(searchInputs[1].searchedValue.toString(), "gmi").test(
          petResult.petName
        ) &&
        heightMatch &&
        weightMatch
      );
    });
    setPetsToRender(petsResults);
  }, [
    currentPath,
    searchedTypeString,
    searchInputs,
    whichPets,
    pets,
    userInfo,
    viewedUserInfo,
  ]);

  return (
    <>
      {authProcessing ? (
        <Loader />
      ) : (
        <>
          {whichPets !== "General" && currentPath === "/" && (
            <Typography variant="h3" align="center" sx={{ my: 2 }}>
              Your {whichPets} Pets
            </Typography>
          )}
          <Grid container flexDirection="column" alignItems="center">
            {petsToRender.length ? (
              petsToRender.map((petToRender) => {
                return (
                  <Grid item key={petToRender._id}>
                    <Pet petToRender={petToRender} />
                  </Grid>
                );
              })
            ) : (
              <Typography variant="h4" align="center">
                No pets to show...
              </Typography>
            )}
          </Grid>
        </>
      )}
    </>
  );
};

export default Pets;
