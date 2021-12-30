import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import ContextWrapper from "./contextWrapper";
import AdvancedSearch from "./components/advancedSearch";
import FofRoutes from "./components/fofRoutes";
import NavBar from "./components/navBar";

const FriendsOnFour: React.FC = (): JSX.Element => {
  return (
    <ContextWrapper>
      <NavBar />
      <AdvancedSearch />
      <FofRoutes />
      <footer className="Fof-footer">
        <Typography
          variant="body1"
          align="center"
          sx={{ my: 2, fontSize: "calc(6px + 1vmin)" }}
        >
          © all rights reserved to{" "}
          <Link
            href="https://www.linkedin.com/in/yaniv-aflalo-8aa92386/"
            target="_blank"
            rel="noreferrer"
          >
            Yaniv Aflalo
          </Link>
          , full stack developer
        </Typography>
      </footer>
    </ContextWrapper>
  );
};

export default FriendsOnFour;
