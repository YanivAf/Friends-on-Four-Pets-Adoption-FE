import { useState, useContext, createRef } from "react";

import PetI from "../interfaces/petI";
import FofContext from "./fofContext";

import swal from "sweetalert";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

import HomeIcon from "@mui/icons-material/Home";
import TimerIcon from "@mui/icons-material/Timer";
import ErrorIcon from "@mui/icons-material/Error";
import SaveIcon from "@mui/icons-material/Save";

const PetForm: React.FC = (): JSX.Element => {
  const {
    currentPath,
    userInfo,
    pets,
    handleUpdate,
    handleNewPet,
    handleRequest,
    handleReturn,
    userContactInfo,
    modalPetIndex,
  } = useContext(FofContext);
  const existingPet = modalPetIndex !== undefined ? pets[modalPetIndex] : null;
  const petPicRef: any = createRef();
  const [newPetPicUrl, setNewPetPicUrl] = useState<string>(
    `http://localhost:5000/images/default.png`
  );
  const [petInputs, setPetInputs] = useState<PetI>(
    existingPet
      ? {
          ...existingPet,
          height: existingPet.height ? existingPet.height.toString() : "",
          weight: existingPet.weight ? existingPet.weight.toString() : "",
          hypoallergenic: existingPet.hypoallergenic ? "Yes" : "No",
        }
      : {
          type: "",
          petName: "",
          bio: "",
          breed: "",
          height: "",
          weight: "",
          color: "#FFFFFF",
          hypoallergenic: "No",
          dietaryRestrictions: "",
          adoptionStatus: "Available",
        }
  );

  const readOnly: boolean =
    existingPet !== null &&
    (userInfo._id !== existingPet?.publisher ||
      existingPet?.adoptionStatus !== "Available");
  const isAvailable: boolean = existingPet?.adoptionStatus === "Available";
  const isPublisher: boolean = userInfo._id === existingPet?.publisher;
  const isFoster: boolean = userInfo._id === existingPet?.foster;
  const isAdopter: boolean = userInfo._id === existingPet?.adopter;
  const isPetPending: boolean =
    userInfo.fosteredPending?.find(
      (fosteredPet) => fosteredPet === existingPet?._id
    ) ||
    userInfo.adoptedPending?.find(
      (adoptedPet) => adoptedPet === existingPet?._id
    )
      ? true
      : false;

  const ownerOrPublisherContactInfo: string =
    (isPublisher && !isAvailable) ||
    (!isPublisher &&
      !isAvailable &&
      existingPet?.adopter !== userInfo._id &&
      existingPet?.foster !== userInfo._id)
      ? "Owner"
      : "Publisher";

  const disableSubmit: boolean =
    petInputs.petName.length < 2 ||
    petInputs.petName.length > 40 ||
    petInputs.type.length < 3 ||
    petInputs.type.length > 20 ||
    petInputs.bio.length < 20 ||
    petInputs.bio.length > 200 ||
    (petInputs.breed !== undefined &&
      petInputs.breed !== "" &&
      (petInputs.breed.length < 3 || petInputs.breed.length > 20)) ||
    (petInputs.dietaryRestrictions !== undefined &&
      petInputs.dietaryRestrictions !== "" &&
      (petInputs.dietaryRestrictions.length < 10 ||
        petInputs.dietaryRestrictions.length > 80));

  const handlePet = (e: any) => {
    e.preventDefault();
    const pet: PetI = existingPet
      ? {
          ...existingPet,
          ...petInputs,
          height: petInputs.height ? petInputs.height : "",
          weight: petInputs.weight ? petInputs.weight : "",
          hypoallergenic: petInputs.hypoallergenic === "Yes" ? "1" : "0",
        }
      : {
          ...petInputs,
          hypoallergenic: petInputs.hypoallergenic === "Yes" ? "1" : "0",
        };
    existingPet
      ? handleUpdate(pet, petPicRef.current.files[0])
      : handleNewPet(pet, petInputs);
    const contentLegend: HTMLElement | null =
      document.querySelector(".legend-content");
    if (!contentLegend) return;
    contentLegend.style.display = "none";
  };

  const confirmAction = (e: any) => {
    swal({
      title: `${e.target.name} Pet?`,
      icon: "warning",
      buttons: ["Cancel", `${e.target.name}`],
    }).then((willDo: boolean) => {
      if (willDo) {
        e.target.name === "Return"
          ? handleReturn()
          : handleRequest(e.target.name);
      } else swal(`Action cancelled`);
    });
  };

  const handleChange = (e: any) => {
    setPetInputs({ ...petInputs, [e.target.name]: e.target.value });
  };

  const handleNewPetPic = (e: any) => {
    setNewPetPicUrl(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <form
      onSubmit={(e) => {
        handlePet(e);
      }}
    >
      <Card
        sx={{
          width: "80vw",
          minWidth: 200,
          maxWidth: 1024,
          m: 1,
          p: 1,
          maxHeight: "80vh",
          overflowY: "scroll",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
        }}
      >
        {existingPet !== null && (
          <CardMedia
            component="img"
            sx={{ objectPosition: "50% 25%", maxHeight: 300 }}
            image={
              newPetPicUrl.indexOf("default.png") === -1
                ? newPetPicUrl
                : `http://localhost:5000/${existingPet?.petPicture
                    ?.replace(/\\/g, "/")
                    .replace("public/", "")}?timestamp=${Date.now()}`
            }
            alt={`${petInputs.petName}`}
            title={`${petInputs.petName}`}
          />
        )}
        {!readOnly && existingPet !== null && (
          <input
            type={"file"}
            accept="image/jpeg"
            name="petPicture"
            ref={petPicRef}
            onChange={handleNewPetPic}
            style={{ paddingBottom: 30 }}
          />
        )}
        {(!isAvailable || (isAvailable && !isPublisher)) &&
          existingPet !== null && (
            <CardContent
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                rowGap: "10px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <TextField
                  label={ownerOrPublisherContactInfo}
                  defaultValue={userContactInfo.fullName}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                {userInfo.admin && currentPath === "/" && (
                  <Typography variant="body2" align="center">
                    <Link href={`/profile-view/${userContactInfo._id}`}>
                      View Profile
                    </Link>
                  </Typography>
                )}
              </div>
              <TextField
                label="Phone"
                defaultValue={userContactInfo.phone}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Email"
                defaultValue={userContactInfo.email}
                InputProps={{
                  readOnly: true,
                }}
              />
            </CardContent>
          )}
        {existingPet && (
          <CardContent
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-evenly",
              rowGap: "10px",
            }}
          >
            {isPublisher && (
              <Typography variant="h6" align="center">
                Published by you
              </Typography>
            )}
            {isAdopter && (
              <Typography variant="h6" align="center">
                Adopted by you
              </Typography>
            )}
            {isFoster && (
              <Typography variant="h6" align="center">
                Fostered by you
              </Typography>
            )}
            {isPetPending && (
              <Typography variant="h6" align="center">
                Pending for publisher's response
              </Typography>
            )}
            {!isPublisher && !isAdopter && !isPetPending && isAvailable && (
              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                name={"Adopt"}
                onClick={(e: any) => confirmAction(e)}
              >
                Adopt
              </Button>
            )}
            {!isPublisher &&
              !isAdopter &&
              !isFoster &&
              !isPetPending &&
              isAvailable && (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<TimerIcon />}
                  name={"Foster"}
                  onClick={(e: any) => confirmAction(e)}
                >
                  Foster
                </Button>
              )}
            {isFoster && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<ErrorIcon />}
                name={"Return"}
                onClick={(e: any) => confirmAction(e)}
              >
                Return
              </Button>
            )}
          </CardContent>
        )}
        <CardContent
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
            rowGap: "10px",
          }}
        >
          <TextField
            label="Name"
            error={
              petInputs.petName !== "" &&
              (petInputs.petName.length < 2 || petInputs.petName.length > 40)
            }
            helperText={petInputs.petName && "2-40 characters"}
            value={petInputs.petName}
            name="petName"
            onChange={handleChange}
            InputProps={{ readOnly }}
            inputProps={{ pattern: "^[a-zA-Z&() ]{2,40}$" }}
            required
          />
          <TextField
            label="Type"
            error={
              petInputs.type !== "" &&
              (petInputs.type.length < 3 || petInputs.type.length > 20)
            }
            helperText={petInputs.type && "3-20 characters"}
            value={petInputs.type}
            name="type"
            onChange={handleChange}
            InputProps={{ readOnly }}
            inputProps={{ pattern: "^[a-zA-Z&() ]{3,20}$" }}
            required
          />
          {existingPet !== null && (
            <TextField
              label="Status"
              defaultValue={petInputs.adoptionStatus}
              InputProps={{
                readOnly: true,
              }}
            />
          )}
          {(petInputs.breed || !readOnly) && (
            <TextField
              label="Breed"
              error={
                petInputs.breed !== undefined &&
                petInputs.breed !== "" &&
                (petInputs.breed.length < 3 || petInputs.breed.length > 20)
              }
              helperText={petInputs.breed && "3-20 characters"}
              value={petInputs.breed}
              name="breed"
              onChange={handleChange}
              InputProps={{ readOnly }}
              inputProps={{ pattern: "^[a-zA-Z&() ]{3,20}$" }}
            />
          )}
        </CardContent>
        <CardContent
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
            rowGap: "10px",
          }}
        >
          <TextField
            label="Bio"
            error={
              petInputs.bio !== "" &&
              (petInputs.bio.length < 20 || petInputs.bio.length > 200)
            }
            helperText={petInputs.bio && "20-200 characters"}
            multiline
            value={petInputs.bio}
            name="bio"
            onChange={handleChange}
            InputProps={{ readOnly }}
            inputProps={{ minLength: 20, maxLength: 200 }}
            required
          />
          <TextField
            label="Dietary Restrictions"
            error={
              petInputs.dietaryRestrictions !== undefined &&
              petInputs.dietaryRestrictions !== "" &&
              (petInputs.dietaryRestrictions.length < 10 ||
                petInputs.dietaryRestrictions.length > 80)
            }
            helperText={petInputs.dietaryRestrictions && "10-80 characters"}
            multiline
            value={petInputs.dietaryRestrictions}
            name="dietaryRestrictions"
            onChange={handleChange}
            InputProps={{ readOnly }}
            inputProps={{ minLength: 10, maxLength: 80 }}
          />
        </CardContent>
        <CardContent
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
            rowGap: "10px",
          }}
        >
          {(petInputs.height || !readOnly) && (
            <TextField
              label="Height (cm)"
              error={
                petInputs.height !== undefined &&
                petInputs.height !== "" &&
                (Number(petInputs.height) < 1 || Number(petInputs.height) > 100)
              }
              helperText={petInputs.height && "1-100 cm"}
              value={petInputs.height}
              name="height"
              onChange={handleChange}
              InputProps={{ readOnly }}
              inputProps={{ type: "number", max: 100, min: 1 }}
            />
          )}
          {(petInputs.weight || !readOnly) && (
            <TextField
              label="Weight (kg)"
              error={
                petInputs.weight !== undefined &&
                petInputs.weight !== "" &&
                (Number(petInputs.weight) < 0.1 ||
                  Number(petInputs.weight) > 50)
              }
              helperText={petInputs.weight && "0.1-50 kg"}
              value={petInputs.weight}
              name="weight"
              onChange={handleChange}
              InputProps={{ readOnly }}
              inputProps={{ type: "number", max: 50, min: 0.1, step: "0.1" }}
            />
          )}
          <div>
            <input
              type="color"
              value={petInputs.color}
              name="color"
              onChange={handleChange}
              disabled={readOnly}
              style={{
                height: 60,
                width: 60,
                border: 0,
                padding: 0,
                background: "unset",
              }}
            />
            <InputLabel>Pet Color</InputLabel>
          </div>
          <div>
            <Select
              label="Hypoallergenic?"
              value={petInputs.hypoallergenic}
              name="hypoallergenic"
              onChange={handleChange}
              readOnly={readOnly}
            >
              <MenuItem value={"Yes"}>Yes</MenuItem>
              <MenuItem value={"No"}>No</MenuItem>
            </Select>
            <InputLabel>Hypoallergenic?</InputLabel>
          </div>
        </CardContent>
        {!readOnly && (
          <Button
            variant="outlined"
            color="success"
            startIcon={<SaveIcon />}
            type="submit"
            disabled={disableSubmit}
          >
            Save
          </Button>
        )}
      </Card>
    </form>
  );
};

export default PetForm;
