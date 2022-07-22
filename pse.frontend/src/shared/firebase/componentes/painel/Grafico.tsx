import { SxProps, Box, useMediaQuery, useTheme } from "@mui/material";
import { getApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
import { useObject, useObjectVal } from "react-firebase-hooks/database";
import {
  CartesianGrid,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from "recharts";

const estiloPainel: SxProps = {
  display: "flex",
  alignItems: "center",
  width: "40vw",
  height: "65vh",
};

const estiloPainelMobile: SxProps = {
  display: "flex",
  alignItems: "center",
  width: "90vw",
  height: "65vh",
};

const estiloContainerGrafico: SxProps = {
  height: "50%",
  width: "100%",
  marginRight: "32px",
};

interface DadoHistorico {
  dataHora: string;
  valor: number;
}

const Grafico = () => {
  const theme = useTheme();
  const telaPequena = useMediaQuery(theme.breakpoints.down("sm"));

  const database = getDatabase(getApp());
  const [dados] = useObject(ref(database, "historicoTanque"));

  const dadosGrafico = Object.values(dados?.val() || []) as DadoHistorico[];

  const formatarStringParaHorario = (dataString: string) => {
    const data = new Date(dataString);
    return `${data.getHours()}:${data.getMinutes()}`;
  };

  return (
    <Box sx={telaPequena ? estiloPainelMobile : estiloPainel}>
      <Box sx={estiloContainerGrafico}>
        <ResponsiveContainer>
          <LineChart
            width={730}
            height={250}
            data={dadosGrafico?.slice(-30) || []}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="dataHora"
              tickFormatter={formatarStringParaHorario}
            />
            <YAxis
              allowDataOverflow
              domain={[0, 100]}
              tickFormatter={(valor) => valor.toFixed(1)}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="valor" stroke="#388e3c" isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default Grafico;
