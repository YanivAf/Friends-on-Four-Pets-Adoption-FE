import { useContext } from "react";
import Modal from "react-modal";

import { modalStyle } from "../styles/allStyle";

import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CloudCircleIcon from "@mui/icons-material/CloudCircle";

import FofContext from "./fofContext";

import Loader from "../components/loader";
import Intro from "../components/intro";
import TogglePets from "../components/togglePets";
import Pets from "../components/pets";
import PetForm from "../components/petForm";
import Users from "../components/users";

Modal.setAppElement("#root");

const Home: React.FC = (): JSX.Element => {
  const context = useContext(FofContext);

  const {
    userInfo,
    pets,
    loading,
    badRequest,
    setPetsLimit,
    petsLimit,
    byWhat,
    openModal,
    modalIsOpen,
    closeModal,
  } = context;

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 50,
      }}
    >
      {badRequest ? (
        <Typography variant="h3" align="center" sx={{ my: 2 }}>
          Server Issues! Please refresh...
        </Typography>
      ) : loading ? (
        <Loader />
      ) : byWhat === "byPet" ? (
        <>
          {!userInfo._id && <Intro />}
          <TogglePets />
          <Pets />
          {pets.length % 20 || pets.length < petsLimit ? (
            <Typography
              color="gray"
              variant="subtitle1"
              align="center"
              sx={{ my: 2 }}
            >
              No more pets to load
            </Typography>
          ) : (
            <Button
              variant="outlined"
              color="success"
              startIcon={<CloudCircleIcon />}
              name={"loadMore"}
              onClick={() => setPetsLimit(petsLimit + 20)}
            >
              Load More
            </Button>
          )}
        </>
      ) : (
        <Users />
      )}
      {userInfo._id && byWhat === "byPet" && (
        <>
          <Fab
            size="medium"
            color="primary"
            aria-label="new pet"
            sx={{ position: "fixed", bottom: 50, right: 20 }}
            onClick={() => openModal()}
          >
            <AddIcon />
          </Fab>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={modalStyle}
          >
            <Fab
              size="small"
              color="primary"
              aria-label="close modal"
              sx={{ position: "absolute", top: 15, right: 0 }}
              onClick={() => closeModal()}
            >
              <CloseIcon />
            </Fab>
            <PetForm />
          </Modal>
        </>
      )}
    </main>
  );
};

export default Home;
