import React from "react";
import { useContext } from "react";

import swal from "sweetalert";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import FofContext from "./fofContext";
import RequestI from "../interfaces/requestI";

interface Props {
  requestToRender: RequestI;
}

const Request: React.FC<Props> = ({ requestToRender }: Props): JSX.Element => {
  const { handleResponse } = useContext(FofContext);

  const confirmAction = (response: string) => {
    swal({
      title: `${response} Request to ${requestToRender.type} ${requestToRender.petName}?`,
      icon: "warning",
      buttons: ["Cancel", `${response}`],
    }).then((willDo: boolean) => {
      if (willDo) {
        handleResponse(response, requestToRender);
      } else swal(`Action cancelled`);
    });
  };

  return (
    <Card
      sx={{
        width: "80vw",
        display: "flex",
        justifyContent: "space-between",
        alignContent: "center",
        flexWrap: "wrap",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          columnGap: "10px",
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h6" color="text.primary">
          {requestToRender.byName}
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary">
          request to
        </Typography>
        <Typography variant="h6" color="text.primary">
          {requestToRender.type}
        </Typography>
        <Typography variant="h6" color="text.primary">
          {requestToRender.petName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          (
          <Link href={`tel:${requestToRender.byPhone}`}>
            {requestToRender.byPhone}
          </Link>{" "}
          |{" "}
          <Link href={`mailto:${requestToRender.byEmail}`}>
            {requestToRender.byEmail}
          </Link>
          )
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton
          size="large"
          aria-label="accept"
          color="success"
          onClick={(e) => confirmAction("Accept")}
          title="Accept"
        >
          <CheckCircleOutlineIcon />
        </IconButton>
        <IconButton
          size="large"
          aria-label="decline"
          color="error"
          onClick={(e) => confirmAction("Decline")}
          title="Decline"
        >
          <CancelOutlinedIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default Request;
