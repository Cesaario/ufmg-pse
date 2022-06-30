import { Paper, SxProps, Tab, Tabs } from "@mui/material";
import { useState } from "react";

const estiloPainel: SxProps = {
  width: "30vw",
  height: "50vh",
};

const Painel = () => {
  const [value, setValue] = useState(0);

  return (
    <Paper sx={estiloPainel}>
      <Tabs
        value={value}
        onChange={(event, value) => setValue(value)}
        aria-label="basic tabs example"
      >
        <Tab label="Controle" />
        <Tab label="Gráfico" />
        <Tab label="Alarmes" />
      </Tabs>
    </Paper>
  );
};

export default Painel;
