import React from "react";

import Typography from "@mui/material/Typography";

const Intro: React.FC = (): JSX.Element => {
  return (
    <>
      <Typography variant="h2" align="center">
        Welcome!
      </Typography>
      <Typography variant="h5" align="center" sx={{ my: 2 }}>
        "Friends on Four" is a service for pet owners or shelters that are
        looking for fosters and adopters.
      </Typography>
      <Typography variant="h5" align="center" sx={{ my: 2 }}>
        It also serves as a platform for people looking to foster or adopt.
      </Typography>
      <Typography variant="h4" align="center" sx={{ my: 2 }}>
        Hope you'll enjoy it!
      </Typography>
    </>
  );
};

export default Intro;
