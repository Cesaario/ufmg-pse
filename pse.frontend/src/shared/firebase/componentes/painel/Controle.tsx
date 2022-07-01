import {
  Box,
  Button,
  Divider,
  Slider,
  SxProps,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { useState } from "react";

const estiloContainer: SxProps = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-evenly",
  height: "calc(100% - 48px)",
};

const estiloContainerIntervalo: SxProps = {
  width: 300,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const Controle = () => {
  const [intervaloNivel, setIntervaloNivel] = useState<number | number[]>([
    40, 60,
  ]);
  const [intervaloSeguro, setIntervaloSeguro] = useState<number | number[]>([
    10, 90,
  ]);
  const [modoAutomatico, setModoAutomatico] = useState(true);

  const marcasSlider = [0, 20, 40, 60, 80, 100].map((nivel) => ({
    value: nivel,
    label: `${nivel}%`,
  }));

  return (
    <Box sx={estiloContainer}>
      <Box sx={estiloContainerIntervalo}>
        <ToggleButtonGroup
          color="primary"
          exclusive
          value={modoAutomatico}
          onChange={(event, value) => setModoAutomatico(value)}
          style={{ marginBottom: 16 }}
        >
          <ToggleButton value={true}>Automático</ToggleButton>
          <ToggleButton value={false}>Manual</ToggleButton>
        </ToggleButtonGroup>
        <Typography variant="h6" color={!modoAutomatico ? "gray" : "black"}>
          Nível de líquido
        </Typography>
        <Slider
          value={intervaloNivel}
          onChange={(event, value) => setIntervaloNivel(value)}
          marks={marcasSlider}
          valueLabelDisplay="auto"
          disabled={!modoAutomatico}
        />
        <Box sx={{ marginTop: "16px" }}>
          <Button
            variant="outlined"
            disabled={modoAutomatico}
            sx={{ marginRight: "16px" }}
          >
            LIGAR ENTRADA
          </Button>
          <Button variant="outlined" disabled={modoAutomatico}>
            LIGAR SAIDA
          </Button>
        </Box>
      </Box>
      <Divider sx={{ width: "95%", margin: "16px" }} />
      <Box sx={estiloContainerIntervalo}>
        <Typography variant="h6">Nível seguro</Typography>
        <Slider
          value={intervaloSeguro}
          onChange={(event, value) => setIntervaloSeguro(value)}
          marks={marcasSlider}
          valueLabelDisplay="auto"
          sx={{ color: red[400] }}
        />
      </Box>
    </Box>
  );
};

export default Controle;
