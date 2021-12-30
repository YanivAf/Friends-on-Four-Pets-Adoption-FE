import { useState, useEffect, useContext } from "react";

import swal from "sweetalert";

import FofContext from "./fofContext";
import FullUserInfoI from "../interfaces/fullUserInfoI";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

import LoginIcon from "@mui/icons-material/Login";

const SignUp: React.FC = (): JSX.Element => {
  const { signup } = useContext(FofContext);
  const [signupInfo, setSignupInfo] = useState<FullUserInfoI>({
    _id: "",
    email: "",
    password: "",
    passwordConfirm: "",
    fullName: "",
    phone: "",
  });
  const [validPassword, setValidPassword] = useState<number>(-1); // -1: regEx faild; 0: verification failed; 1: success;
  const [alertMsg, setAlertMsg] = useState<string>(
    "Your password must contain at least: 8 characters, 1 uppercase letter, 1 lowercase letter, 1 digit and 1 special character"
  );

  const validatePassword = ({ password, passwordConfirm }: FullUserInfoI) => {
    if (password === undefined) return -1;
    const passRegExRule: RegExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // const passRegEx: RegExp = new RegExp(passRegExRule, "gm");  REGEX BUG! https://stackoverflow.com/questions/3891641/regex-test-only-works-every-other-time
    if (!new RegExp(passRegExRule, "gm").test(password)) return -1;
    if (password !== passwordConfirm) return 0;
    return 1;
  };

  const fullNameRegEx: RegExp =
    /^[a-zA-Z]{2,20}[.]?[ ][a-zA-Z]{2,20}([.]?[ ][a-zA-Z]{2,20})?$/;
  const phoneRegEx: RegExp =
    /^([0]|[+]?972[-]?)(([2-4]|[6-9])|([5][1-9]))[-]?[1-9][0-9]{3}[-]?[0-9]{3}$/;
  const emailRegEx: RegExp = /^\S+@\S+\.\S+$/;
  const passwordRegEx: RegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const disableSubmit: boolean =
    !new RegExp(fullNameRegEx, "gmi").test(signupInfo.fullName) ||
    !new RegExp(phoneRegEx, "gmi").test(signupInfo.phone) ||
    !new RegExp(emailRegEx, "gmi").test(signupInfo.email) ||
    (signupInfo.password &&
      !new RegExp(passwordRegEx, "gm").test(signupInfo.password)) ||
    signupInfo.passwordConfirm !== signupInfo.password;

  useEffect(() => {
    setValidPassword(validatePassword(signupInfo));
    if (validPassword !== 1) {
      setAlertMsg(
        validPassword
          ? "Your password must contain at least: 8 characters, 1 uppercase letter, 1 lowercase letter, 1 digit and 1 special character"
          : "Please make sure you have entered the same password"
      );
    }
  }, [signupInfo, validPassword]);

  const handleSignUp = (e: any) => {
    try {
      e.preventDefault();
      if (validPassword !== 1) {
        setValidPassword(validatePassword(signupInfo));
        swal({
          title: "Password Issue",
          text: alertMsg,
          icon: "warning",
          buttons: [false, "Try again"],
        });
        return;
      }

      swal({
        title: `Welcome, ${signupInfo.email}!`,
        icon: "success",
      });
      signup(signupInfo);
    } catch (error: any) {
      const errorMessage = error.message;
      swal({
        title: "Sign Up Issue",
        text: errorMessage,
        icon: "warning",
        buttons: [false, "Try again"],
      });
    }
  };

  const handleChange = (e: any) => {
    setSignupInfo({ ...signupInfo, [e.target.name]: e.target.value });
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 50,
      }}
    >
      <Typography variant="h2" align="center" sx={{ my: 2 }}>
        Sign Up
      </Typography>
      <form
        onSubmit={(e) => {
          handleSignUp(e);
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
                !new RegExp(fullNameRegEx, "gmi").test(signupInfo.fullName)
              }
              helperText={"only letters"}
              value={signupInfo.fullName}
              name="fullName"
              onChange={handleChange}
              inputProps={{
                pattern:
                  "^[a-zA-Z]{2,20}[.]?[ ][a-zA-Z]{2,20}([.]?[ ][a-zA-Z]{2,20})?$",
              }}
              required
            />
            <TextField
              label="Phone"
              error={!new RegExp(phoneRegEx, "gmi").test(signupInfo.phone)}
              helperText={"israeli phone number"}
              value={signupInfo.phone}
              name="phone"
              onChange={handleChange}
              inputProps={{
                pattern:
                  "^([0]|[+]?972[-]?)(([2-4]|[6-9])|([5][1-9]))[-]?[1-9][0-9]{3}[-]?[0-9]{3}$",
              }}
              required
            />
            <TextField
              label="Email"
              error={!new RegExp(emailRegEx, "gmi").test(signupInfo.email)}
              value={signupInfo.email}
              name="email"
              onChange={handleChange}
              inputProps={{ type: "email" }}
              required
            />
            <TextField
              label="Password"
              error={
                signupInfo.password !== undefined &&
                signupInfo.password !== "" &&
                !new RegExp(passwordRegEx, "gm").test(signupInfo.password)
              }
              helperText={
                "min. 8 chars, 1 uppercase, 1 lowercase, 1 digit and 1 special char"
              }
              value={signupInfo.password}
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
                signupInfo.passwordConfirm !== "" &&
                signupInfo.passwordConfirm !== signupInfo.password
              }
              helperText={"re-type your password"}
              value={signupInfo.passwordConfirm}
              name="passwordConfirm"
              onChange={handleChange}
              inputProps={{
                type: "password",
                pattern:
                  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
              }}
            />
          </CardContent>
          <Button
            variant="outlined"
            color="success"
            startIcon={<LoginIcon />}
            type="submit"
            disabled={disableSubmit}
          >
            SignUp
          </Button>
        </Card>
      </form>
      <Typography variant="body1" align="center" sx={{ my: 2 }}>
        Already registered? <Link href="/login">Login</Link>
      </Typography>
    </main>
  );
};

export default SignUp;
