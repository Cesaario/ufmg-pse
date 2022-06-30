import { initializeApp, getApps, getApp } from "firebase/app";
import firebaseConfig from "./shared/firebase/firebaseConfig";

import { ref, getDatabase } from "firebase/database";
import { useObject } from "react-firebase-hooks/database";
import Tanque from "./shared/firebase/componentes/tanque/Tanque";
import { Box, Paper, SxProps, Typography } from "@mui/material";
import Painel from "./shared/firebase/componentes/painel/Painel";

const estiloHome: SxProps = {
  fontFamily: "Roboto",
  height: "calc(100vh - 16px)",
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

  const [snapshots, loading, error] = useObject(ref(database, "teste"));

  console.log(snapshots);

  return (
    <Box sx={estiloHome}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography sx={{ margin: "auto" }} variant="h4">
          PSE - Controle de nível de tanque
        </Typography>
      </Box>
      <Box sx={estiloContainerCards}>
        <Tanque />
        <Painel />
      </Box>
    </Box>
  );
}

export default App;
