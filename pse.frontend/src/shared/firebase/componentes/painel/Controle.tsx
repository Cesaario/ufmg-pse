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
import { useEffect, useState } from "react";
import { useObjectVal } from "react-firebase-hooks/database";
import { ref, getDatabase, set } from "firebase/database";
import { getApp } from "firebase/app";

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

interface PropriedadesControle {
  modo: "automatico" | "manual";
  nivelIdealAlto: number;
  nivelIdealBaixo: number;
  nivelSeguroAlto: number;
  nivelSeguroBaixo: number;
  statusEntrada: boolean;
  statusSaida: boolean;
}

const Controle = () => {
  const database = getDatabase(getApp());

  const [snapshots, loading, error] = useObjectVal<PropriedadesControle>(
    ref(database, "controle")
  );

  const {
    modo,
    nivelIdealAlto,
    nivelIdealBaixo,
    nivelSeguroAlto,
    nivelSeguroBaixo,
    statusEntrada,
    statusSaida,
  } = snapshots || {};

  const [intervaloNivel, setIntervaloNivel] = useState<number[]>([40, 60]);

  const [intervaloSeguro, setIntervaloSeguro] = useState<number[]>([10, 90]);

  const [modoAutomatico, setModoAutomatico] = useState(modo === "automatico");

  useEffect(() => {
    if (!loading) {
      setIntervaloNivel([nivelIdealBaixo || 0, nivelIdealAlto || 0]);
      setIntervaloSeguro([nivelSeguroBaixo || 0, nivelSeguroAlto || 0]);
      setModoAutomatico(modo === "automatico");
    }
  }, [loading]);

  const atualizarNivelIdeal = () => {
    set(ref(getDatabase(), `controle/nivelIdealBaixo`), intervaloNivel[0]);
    set(ref(getDatabase(), `controle/nivelIdealAlto`), intervaloNivel[1]);
  };

  const atualizarNivelSeguro = () => {
    set(ref(getDatabase(), `controle/nivelSeguroBaixo`), intervaloSeguro[0]);
    set(ref(getDatabase(), `controle/nivelSeguroAlto`), intervaloSeguro[1]);
  };

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
          onChange={(event, value) => {
            setModoAutomatico(value);
            set(
              ref(getDatabase(), `controle/modo`),
              value ? "automatico" : "manual"
            );
          }}
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
          onChange={(event, value) => setIntervaloNivel(value as number[])}
          marks={marcasSlider}
          valueLabelDisplay="auto"
          disabled={!modoAutomatico}
          onChangeCommitted={atualizarNivelIdeal}
        />
        <Box
          sx={{
            marginTop: "16px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="outlined"
            disabled={modoAutomatico}
            sx={{ marginRight: "16px", width: "200px" }}
            color={!statusEntrada ? "success" : "error"}
            onClick={() =>
              set(ref(getDatabase(), `controle/statusEntrada`), !statusEntrada)
            }
          >
            {`${statusEntrada ? "DESLIGAR" : "LIGAR"} ENTRADA`}
          </Button>
          <Button
            variant="outlined"
            disabled={modoAutomatico}
            sx={{ width: "200px" }}
            color={!statusSaida ? "success" : "error"}
            onClick={() =>
              set(ref(getDatabase(), `controle/statusSaida`), !statusSaida)
            }
          >
            {`${statusSaida ? "DESLIGAR" : "LIGAR"} SAIDA`}
          </Button>
        </Box>
      </Box>
      <Divider sx={{ width: "95%", margin: "16px" }} />
      <Box sx={estiloContainerIntervalo}>
        <Typography variant="h6">Nível seguro</Typography>
        <Slider
          value={intervaloSeguro}
          onChange={(event, value) => setIntervaloSeguro(value as number[])}
          marks={marcasSlider}
          valueLabelDisplay="auto"
          sx={{ color: red[400] }}
          onChangeCommitted={atualizarNivelSeguro}
        />
      </Box>
    </Box>
  );
};

export default Controle;
