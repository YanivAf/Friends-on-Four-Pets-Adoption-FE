import React from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Avatar from "@mui/material/Avatar";

import FullUserInfoI from "../interfaces/fullUserInfoI";

interface Props {
  userToRender: FullUserInfoI;
}

const User: React.FC<Props> = ({ userToRender }: Props): JSX.Element => {
  return (
    <Card sx={{ width: 300, m: 1 }}>
      <CardHeader
        avatar={
          <Avatar aria-label="user header">{userToRender.fullName[0]}</Avatar>
        }
        title={userToRender.fullName}
        subheader={userToRender.email}
      />
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          columnGap: "10px",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {userToRender.publishedPets?.length} Published
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {userToRender.adoptedPets?.length} Adopted
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {userToRender.fosteredPets?.length} Fostered
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton
          size="large"
          aria-label="user info"
          color="info"
          href={`/profile-view/${userToRender._id}`}
          title="Info"
        >
          <InfoOutlinedIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default User;
