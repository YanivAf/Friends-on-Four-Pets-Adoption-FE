import { useState, useContext } from "react";

import swal from "sweetalert";

import FofContext from "./fofContext";
import { CredentialsStateI } from "../interfaces/statesI";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

import LoginIcon from "@mui/icons-material/Login";

const Login: React.FC = (): JSX.Element => {
  const { login } = useContext(FofContext);
  const [credentials, setCredentials] = useState<CredentialsStateI>({
    email: "",
    password: "",
  });

  const handleLogin = (e: any) => {
    try {
      e.preventDefault();
      login(credentials);
    } catch (error: any) {
      const errorMessage = error.message;
      swal({
        title: "Login Issue",
        text: errorMessage,
        icon: "warning",
        buttons: [false, "Try again"],
      });
    }
  };

  const handleChange = (e: any) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const emailRegEx: RegExp = /^\S+@\S+\.\S+$/;
  const passwordRegEx: RegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const disableSubmit: boolean =
    (credentials.email !== "" &&
      !new RegExp(emailRegEx, "gmi").test(credentials.email)) ||
    (credentials.password !== "" &&
      !new RegExp(passwordRegEx, "gm").test(credentials.password));

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
        Login
      </Typography>
      <form
        onSubmit={(e) => {
          handleLogin(e);
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
              label="Email"
              error={!new RegExp(emailRegEx, "gmi").test(credentials.email)}
              value={credentials.email}
              name="email"
              onChange={handleChange}
              inputProps={{ type: "email" }}
              required
            />
            <TextField
              label="Password"
              error={
                credentials.password !== undefined &&
                credentials.password !== "" &&
                !new RegExp(passwordRegEx, "gm").test(credentials.password)
              }
              helperText={
                "min. 8 chars, 1 uppercase, 1 lowercase, 1 digit and 1 special char"
              }
              value={credentials.password}
              name="password"
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
            color="primary"
            startIcon={<LoginIcon />}
            type="submit"
            disabled={disableSubmit}
          >
            Login
          </Button>
        </Card>
      </form>
      <Typography variant="body1" align="center" sx={{ my: 2 }}>
        Not registered? <Link href="/signup">Sign up</Link>
      </Typography>
    </main>
  );
};

export default Login;
