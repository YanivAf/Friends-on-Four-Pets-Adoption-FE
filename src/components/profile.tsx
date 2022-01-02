import { useState, useEffect, useContext } from "react";

import Loader from "./loader";

import FullUserInfoI from "../interfaces/fullUserInfoI";
import FofContext from "./fofContext";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

import SaveIcon from "@mui/icons-material/Save";

const Profile: React.FC = (): JSX.Element => {
  const { currentPath, viewedUserInfo, userInfo, updateProfile, loading } =
    useContext(FofContext);
  const [userInfoInputs, setUserInputs] = useState<FullUserInfoI>({
    _id: "",
    email: "",
    fullName: "",
    phone: "",
  });

  const handleUserInfo = async (e: any) => {
    try {
      e.preventDefault();
      await updateProfile(userInfoInputs);
      setUserInputs(userInfoInputs);
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  }

  const fullNameRegEx: RegExp =
    /^[a-zA-Z]{2,20}[.]?[ ][a-zA-Z]{2,20}([.]?[ ][a-zA-Z]{2,20})?$/;
  const phoneRegEx: RegExp =
    /^([0]|[+]?972[-]?)(([2-4]|[6-9])|([5][1-9]))[-]?[1-9][0-9]{3}[-]?[0-9]{3}$/;
  const emailRegEx: RegExp = /^\S+@\S+\.\S+$/;
  const passwordRegEx: RegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const disableSubmit: boolean =
    !new RegExp(fullNameRegEx, "gmi").test(userInfoInputs.fullName) ||
    (userInfoInputs.bio &&
      (userInfoInputs.bio.length < 20 || userInfoInputs.bio.length > 200)) ||
    !new RegExp(phoneRegEx, "gmi").test(userInfoInputs.phone) ||
    !new RegExp(emailRegEx, "gmi").test(userInfoInputs.email) ||
    (userInfoInputs.password &&
      !new RegExp(passwordRegEx, "gm").test(userInfoInputs.password)) ||
    userInfoInputs.passwordConfirm !== userInfoInputs.password;

  const readOnly: boolean = userInfo._id !== userInfoInputs._id;

  const handleChange = (e: any) => {
    setUserInputs({ ...userInfoInputs, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    currentPath.indexOf("profile-view") === -1
      ? setUserInputs(userInfo)
      : setUserInputs(viewedUserInfo.user);
  }, [currentPath]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Typography variant="h2" align="center" sx={{ my: 2 }}>
            {userInfoInputs.fullName}'s Profile
          </Typography>
          {readOnly && (
            <Typography variant="body2" align="center">
              Go to <Link href="/users">Users Page</Link>
              {" | "}
              <Link href="/">Pets Page</Link>
            </Typography>
          )}
          <form
            onSubmit={(e) => {
              handleUserInfo(e);
            }}
          >
            <Card
              sx={{
                width: "60vw",
                minWidth: 280,
                maxWidth: 800,
                m: 1,
                p: 1,
                display: "flex",
                flexDirection: "column",
                flexWrap: "nowrap",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexWrap: "nowrap",
                  rowGap: "10px",
                }}
              >
                <TextField
                  label="Full Name"
                  error={
                    !new RegExp(fullNameRegEx, "gmi").test(
                      userInfoInputs.fullName
                    )
                  }
                  helperText={"only letters"}
                  value={userInfoInputs.fullName}
                  name="fullName"
                  onChange={handleChange}
                  InputProps={{ readOnly }}
                  inputProps={{
                    pattern:
                      "^[a-zA-Z]{2,20}[.]?[ ][a-zA-Z]{2,20}([.]?[ ][a-zA-Z]{2,20})?$",
                  }}
                  required
                />
                <TextField
                  label="Bio"
                  error={
                    userInfoInputs.bio !== undefined &&
                    userInfoInputs.bio !== "" &&
                    (userInfoInputs.bio.length < 20 ||
                      userInfoInputs.bio.length > 200)
                  }
                  helperText={"20-200 characters"}
                  multiline
                  value={userInfoInputs.bio}
                  name="bio"
                  onChange={handleChange}
                  InputProps={{ readOnly }}
                  inputProps={{ minLength: 20, maxLength: 200 }}
                />
                <div>
                <Select
                  label="Area"
                  value={userInfoInputs.area !== undefined ? userInfoInputs.area : 'Not Available'}
                  name="area"
                  onChange={handleChange}
                  readOnly={readOnly}
                >
                  <MenuItem value={"North"}>North</MenuItem>
                  <MenuItem value={"Center"}>Center</MenuItem>
                  <MenuItem value={"South"}>South</MenuItem>
                  <MenuItem value={"Not Available"}>Not Available</MenuItem>
                </Select>
                <InputLabel>Area</InputLabel>
                </div>
                <TextField
                  label="Phone"
                  error={
                    !new RegExp(phoneRegEx, "gmi").test(userInfoInputs.phone)
                  }
                  helperText={"israeli phone number"}
                  value={userInfoInputs.phone}
                  name="phone"
                  onChange={handleChange}
                  InputProps={{ readOnly }}
                  inputProps={{
                    pattern:
                      "^([0]|[+]?972[-]?)(([2-4]|[6-9])|([5][1-9]))[-]?[1-9][0-9]{3}[-]?[0-9]{3}$",
                  }}
                  required
                />
                <TextField
                  label="Email"
                  error={
                    !new RegExp(emailRegEx, "gmi").test(userInfoInputs.email)
                  }
                  value={userInfoInputs.email}
                  name="email"
                  onChange={handleChange}
                  InputProps={{ readOnly }}
                  inputProps={{ type: "email" }}
                  required
                />
                {!readOnly && (
                  <>
                    <TextField
                      label="Password"
                      error={
                        userInfoInputs.password !== undefined &&
                        userInfoInputs.password !== "" &&
                        !new RegExp(passwordRegEx, "gm").test(
                          userInfoInputs.password
                        )
                      }
                      helperText={
                        "min. 8 chars, 1 uppercase, 1 lowercase, 1 digit and 1 special char"
                      }
                      value={userInfoInputs.password}
                      name="password"
                      onChange={handleChange}
                      inputProps={{
                        type: "password",
                        pattern:
                          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
                      }}
                    />
                    <TextField
                      label="Confirm Password"
                      error={
                        userInfoInputs.passwordConfirm !== "" &&
                        userInfoInputs.passwordConfirm !==
                          userInfoInputs.password
                      }
                      helperText={"re-type your password"}
                      value={userInfoInputs.passwordConfirm}
                      name="passwordConfirm"
                      onChange={handleChange}
                      inputProps={{
                        type: "password",
                        pattern:
                          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
                      }}
                    />
                  </>
                )}
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
        </>
      )}
    </>
  );
};

export default Profile;
