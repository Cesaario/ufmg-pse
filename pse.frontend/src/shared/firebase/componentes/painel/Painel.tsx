import {
  Paper,
  SxProps,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import Alarmes from "./Alarmes";
import Calibracao from "./Calibracao";
import Controle from "./Controle";
import Grafico from "./Grafico";

const estiloPainel: SxProps = {
  width: "40vw",
  height: "70vh",
};

const estiloPainelMobile: SxProps = {
  width: "90vw",
  height: "70vh",
};

const abas: { [key: number]: React.FC } = {
  0: Controle,
  1: Grafico,
  2: Alarmes,
  3: Calibracao,
};

const Painel = () => {
  const [value, setValue] = useState(0);

  const theme = useTheme();
  const telaPequena = useMediaQuery(theme.breakpoints.down("sm"));

  const Aba = abas[value];

  return (
    <Paper sx={telaPequena ? estiloPainelMobile : estiloPainel}>
      <Tabs
        value={value}
        onChange={(event, value) => setValue(value)}
        aria-label="basic tabs example"
      >
        <Tab label="Controle" value={0} />
        <Tab label="Gráfico" value={1} />
        <Tab label="Alarmes" value={2} />
      </Tabs>
      <Aba />
    </Paper>
  );
};

export default Painel;
