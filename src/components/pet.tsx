import React from "react";
import { useState, useContext } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SaveIcon from "@mui/icons-material/Save";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import PetI from "../interfaces/petI";
import FofContext from "./fofContext";

import axios from "axios";

interface Props {
  petToRender: PetI;
}

const Pet: React.FC<Props> = ({ petToRender }: Props): JSX.Element => {
  const { domain, headers, userInfo, userInfoDispatch, openModal, confirmDelete } =
    useContext(FofContext);

  const [saved, setSaved] = useState<boolean>(
    userInfo.savedPets?.find((savedPet) => savedPet === petToRender._id)
      ? true
      : false
  );
  const [loved, setLoved] = useState<boolean>(
    userInfo.lovedPets?.find((lovedPet) => lovedPet === petToRender._id)
      ? true
      : false
  );
  const [lovesCount, setLovesCount] = useState<number>(
    petToRender.loves ? petToRender.loves : 0
  );

  const isPending: boolean =
    userInfo.adoptedPending?.find(
      (pendingPet) => pendingPet === petToRender._id
    ) ||
    userInfo.fosteredPending?.find(
      (pendingPet) => pendingPet === petToRender._id
    )
      ? true
      : false;
  const isAdopter: boolean = userInfo._id === petToRender.adopter;
  const isFoster: boolean = userInfo._id === petToRender.foster;
  const isPublisher: boolean = userInfo._id === petToRender.publisher;
  const notAvailable: boolean = petToRender.adoptionStatus !== "Available";

  const handleLove = async () => {
    try {
      setLoved(!loved);
      loved ? setLovesCount(lovesCount - 1) : setLovesCount(lovesCount + 1);
      const { data } = loved
        ? await axios.delete(
            `${domain}/pet/${petToRender._id}/love`,
            {
              withCredentials: true,
              headers
            }
        )
        : await axios.post(
            `${domain}/pet/${petToRender._id}/love`,
            {},
            {
              withCredentials: true,
              headers
            }
          );
      const { loves, lovedPets } = data;
      setLovesCount(loves);
      userInfoDispatch({ ...userInfo, lovedPets });
    } catch (e) {
      console.error("Error updating lovedPets in document: ", e);
    }
  };

  const handleSave = async () => {
    try {
      setSaved(!saved);
      const { data } = saved
        ? await axios.delete(
            `${domain}/pet/${petToRender._id}/save`,
            {
              withCredentials: true,
              headers
            }
          )
        : await axios.post(
            `${domain}/pet/${petToRender._id}/save`,
            {},
            {
              withCredentials: true,
              headers
            }
          );
      const { savedPets } = data;
      userInfoDispatch({ ...userInfo, savedPets });
    } catch (e) {
      console.error("Error updating savedPets in document: ", e);
    }
  };

  return (
    <Card sx={{ width: "50vw", minWidth: 250, maxWidth: 600, m: 1 }}>
      {((userInfo._id === petToRender.publisher || userInfo.admin) && petToRender.adoptionStatus === "Available") && (
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <IconButton
            size="large"
            aria-label="delete pet"
            color="warning"
            onClick={() => {
              if (petToRender._id !== undefined) confirmDelete(petToRender._id);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      )}
      {petToRender.petPicture && (
        <CardMedia
          component="img"
          sx={{ objectPosition: "50% 25%", height: "30vw", minHeight: 140 }}
          image={petToRender.petPicture.indexOf("cutewallpaper") === -1
          ? `${domain}/${petToRender.petPicture
              ?.replace(/\\/g, "/")
              .replace("public/", "")}?timestamp=${Date.now()}`
          : 'https://cutewallpaper.org/25/animal-footprints-wallpaper/100-free-paw-print-amp-paw-images.png'}
          alt={`${petToRender.petName}`}
          title={`${petToRender.petName}`}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {petToRender.petName}
        </Typography>
        <Typography
          variant="body2"
          color={
            petToRender.adoptionStatus === "Available"
              ? "text.secondary"
              : "text.primary"
          }
        >
          {petToRender.adoptionStatus}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton
          size="large"
          aria-label="pet info"
          disabled={
            notAvailable && !isAdopter && !isFoster  && !isPublisher && userInfo.admin !== true 
          }
          color="info"
          {...(userInfo._id
            ? {
                onClick: () => {
                  if (petToRender._id !== undefined) openModal(petToRender._id);
                },
              }
            : { href: "/login" })}
          title="Info"
        >
          <InfoOutlinedIcon />
        </IconButton>
        <IconButton
          size="large"
          aria-label="love/unlove pet"
          color="secondary"
          {...(userInfo._id
            ? { onClick: () => handleLove() }
            : { href: "/login" })}
          title={loved ? "You loved this pet" : "Love"}
        >
          {loved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="caption">
          {lovesCount && `${lovesCount}`}
        </Typography>
        {!isPublisher && !isAdopter && (
          <>
            <IconButton
              size="large"
              aria-label="save/unsave pet"
              color="secondary"
              {...(userInfo._id
                ? { onClick: () => handleSave() }
                : { href: "/login" })}
              disabled={isPending && !notAvailable}
              title={saved ? "You saved this pet" : "Save"}
            >
              {saved ? <SaveIcon /> : <SaveOutlinedIcon />}
            </IconButton>
            {isPending && (
              <Typography variant="caption" sx={{ ml: 1 }}>
                Pending
              </Typography>
            )}
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default Pet;
