import { useState, useEffect, useContext } from "react";

import FofContext from "./fofContext";
import User from "./user";
import FullUserInfoI from "../interfaces/fullUserInfoI";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const Users: React.FC = (): JSX.Element => {
  const { users, searchedUserString } = useContext(FofContext);
  const [usersToRender, setUsersToRender] = useState<FullUserInfoI[]>(users);

  useEffect(() => {
    let usersResults: FullUserInfoI[] = users;
    usersResults = usersResults.filter((userResult) => {
      return (
        new RegExp(searchedUserString, "gmi").test(userResult.fullName) ||
        new RegExp(searchedUserString, "gmi").test(userResult.email)
      );
    });
    setUsersToRender(usersResults);
  }, [searchedUserString, users]);

  return (
    <>
      <Typography variant="h2" align="center" sx={{ my: 2 }}>
        Users
      </Typography>
      <Grid container wrap="wrap" justifyContent="center">
        {usersToRender.length ? (
          usersToRender.map((userToRender) => {
            return (
              <Grid item key={userToRender._id}>
                <User userToRender={userToRender} />
              </Grid>
            );
          })
        ) : (
          <Typography variant="h4" align="center">
            No users to show...
          </Typography>
        )}
      </Grid>
    </>
  );
};

export default Users;
