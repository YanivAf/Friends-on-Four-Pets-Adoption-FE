import { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import { modalStyle } from "../styles/allStyle";

import axios from "axios";
import swal from "sweetalert";

import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import Button from "@mui/material/Button";

import CloseIcon from "@mui/icons-material/Close";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import DoDisturbOffIcon from "@mui/icons-material/DoDisturbOff";

import Loader from "./loader";
import Profile from "./profile";
import TogglePets from "./togglePets";
import Pets from "./pets";
import PetForm from "../components/petForm";

import FofContext from "./fofContext";

const ProfileView: React.FC = (): JSX.Element => {
  const {
    userInfo,
    viewedUserInfo,
    badRequest,
    loading,
    modalIsOpen,
    closeModal,
  } = useContext(FofContext);
  const [banned, setBanned] = useState<boolean>(
    viewedUserInfo.user?.banned === true ? true : false
  );

  const toggleBanUser = async () => {
    try {
      const action = banned ? "Un-Ban" : "Ban";
      swal({
        title: `${action} User?`,
        icon: "warning",
        buttons: ["Cancel", action],
        dangerMode: true,
      }).then(async (willToggle: boolean) => {
        if (willToggle) {
          await axios.put(
            `http://localhost:5000/user/${viewedUserInfo.user._id}/toggle-ban`,
            {},
            { withCredentials: true }
          );
          setBanned(!banned);
        } else swal(`Ban cancelled`);
      });
    } catch (error) {
      console.error("Error banning user: ", error);
    }
  };

  useEffect(() => {
    setBanned(viewedUserInfo.user?.banned === true ? true : false);
  }, [loading, viewedUserInfo]);

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
      ) : (
        <>
          <Profile />
          {viewedUserInfo.user._id !== "" && (
            <>
              {userInfo.admin && !viewedUserInfo.user.admin && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={
                    banned ? <DoDisturbOffIcon /> : <DoDisturbOnIcon />
                  }
                  name={"Ban"}
                  onClick={(e: any) => toggleBanUser()}
                >
                  {banned ? "Un-ban User" : "Ban User"}
                </Button>
              )}
              <Typography variant="h3" align="center" sx={{ my: 2 }}>
                {viewedUserInfo.user.fullName}'s Pets
              </Typography>
              <TogglePets />
              <Pets />
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
        </>
      )}
    </main>
  );
};

export default ProfileView;
