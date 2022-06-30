import { initializeApp, getApps, getApp } from "firebase/app";
import firebaseConfig from "./shared/firebase/firebaseConfig";

import { ref, getDatabase } from "firebase/database";
import { useObject } from "react-firebase-hooks/database";
import Tanque from "./shared/firebase/componentes/tanque/Tanque";
import { Box, Paper, SxProps } from "@mui/material";
import Painel from "./shared/firebase/componentes/painel/Painel";

const estiloHome: SxProps = {
  fontFamily: "Roboto",
  height: "100vh",
  width: "100vw",
  backgroundColor: "#f2f2f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
};

function App() {
  if (!getApps().length) initializeApp(firebaseConfig);

  const database = getDatabase(getApp());

  const [snapshots, loading, error] = useObject(ref(database, "teste"));

  console.log(snapshots);

  return (
    <Box sx={estiloHome}>
      <Tanque />
      <Painel />
    </Box>
  );
}

export default App;
