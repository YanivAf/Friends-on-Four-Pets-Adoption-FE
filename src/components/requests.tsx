import { useContext } from "react";

import FofContext from "./fofContext";
import Request from "./request";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const Requests: React.FC = (): JSX.Element => {
  const { userInfo } = useContext(FofContext);

  return (
    <>
      <Typography variant="h2" align="center" sx={{ my: 2 }}>
        Requests
      </Typography>
      <Grid container flexDirection="column" alignItems="center" rowGap="10px">
        {userInfo.incomingRequests?.length ? (
          userInfo.incomingRequests.map((requestToRender) => {
            return (
              <Grid item key={requestToRender._id}>
                <Request requestToRender={requestToRender} />
              </Grid>
            );
          })
        ) : (
          <Typography variant="h4" align="center">
            No requests to show...
          </Typography>
        )}
      </Grid>
    </>
  );
};

export default Requests;
