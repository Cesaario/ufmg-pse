import { Box, Paper, SxProps, Typography } from "@mui/material";
import { getApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
import { useObject, useObjectVal } from "react-firebase-hooks/database";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import GraficoTanque from "./GraficoTanque";

interface DadosTanque {
  altura: number;
  valvulaEntrada: boolean;
  valvulaSaida: boolean;
}

const estiloTanque: SxProps = {
  width: "30vw",
  height: "50vh",
};

const containerTexto: SxProps = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const containerInformacao: SxProps = {
  display: "flex",
};

const Tanque = () => {
  const database = getDatabase(getApp());
  const [dado] = useObjectVal<DadosTanque>(ref(database, "informacoesTanque"));

  return (
    <Paper sx={estiloTanque}>
      <GraficoTanque altura={dado?.altura || 0} />
      <Box sx={containerTexto}>
        <Box sx={containerInformacao}>
          <Typography sx={{ marginRight: "4px" }}>
            Válvula de entrada:
          </Typography>
          <Typography fontWeight={700} color={dado?.valvulaEntrada ? "#66bb6a" : "#ef5350"}>
            {dado?.valvulaEntrada ? "LIGADA" : "DESLIGADA"}
          </Typography>
        </Box>
        <Box sx={containerInformacao}>
          <Typography sx={{ marginRight: "4px" }}>Válvula de saída:</Typography>
          <Typography fontWeight={700} color={dado?.valvulaSaida ? "#66bb6a" : "#ef5350"}>
            {dado?.valvulaSaida ? "LIGADA" : "DESLIGADA"}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default Tanque;
