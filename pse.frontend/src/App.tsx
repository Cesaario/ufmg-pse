import { initializeApp, getApps, getApp } from "firebase/app";
import firebaseConfig from "./shared/firebase/firebaseConfig";
import { ref, getDatabase } from "firebase/database";
import { useObject } from "react-firebase-hooks/database";
import Tanque from "./shared/firebase/componentes/tanque/Tanque";
import {
  Box,
  Paper,
  SxProps,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Painel from "./shared/firebase/componentes/painel/Painel";

const estiloHome: SxProps = {
  fontFamily: "Roboto",
  height: "100%",
  width: "100vw",
  backgroundColor: "#f2f2f2",
  paddingTop: "16px",
};

const estiloContainerCards: SxProps = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  marginTop: "32px",
};

function App() {
  if (!getApps().length) initializeApp(firebaseConfig);

  const database = getDatabase(getApp());

  const theme = useTheme();
  const telaPequena = useMediaQuery(theme.breakpoints.down("sm"));

  const [snapshots, loading, error] = useObject(ref(database, "teste"));

  return (
    <Box sx={estiloHome}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography sx={{ margin: "auto" }} variant="h4">
          PSE - Controle de nível de tanque
        </Typography>
      </Box>
      <Box
        sx={{
          ...estiloContainerCards,
          flexDirection: telaPequena ? "column" : "row",
        }}
      >
        <Tanque />
        <Painel />
      </Box>
    </Box>
  );
}

export default App;
