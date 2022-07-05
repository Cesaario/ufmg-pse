import {
  SxProps,
  Box,
  useMediaQuery,
  useTheme,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { getApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
import { useObjectVal } from "react-firebase-hooks/database";

const estiloPainel: SxProps = {
  display: "flex",
  alignItems: "start",
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
};

interface Alarme {
  tipo: string;
  dataHora: string;
}

const Alarmes = () => {
  const theme = useTheme();
  const telaPequena = useMediaQuery(theme.breakpoints.down("sm"));

  const database = getDatabase(getApp());
  const [dados] = useObjectVal<Alarme[]>(ref(database, "alarmes"));

  return (
    <Box sx={telaPequena ? estiloPainelMobile : estiloPainel}>
      <Box sx={estiloContainerGrafico}>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="right">Tipo do Alarme</TableCell>
                <TableCell align="right">Descrição</TableCell>
                <TableCell align="right">Horário</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dados?.map((row) => (
                <TableRow
                  key={row.dataHora}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.tipo}
                  </TableCell>
                  <TableCell align="right">{`Alarme do tipo ${row.tipo}`}</TableCell>
                  <TableCell align="right">
                    {`${new Date(row.dataHora).toLocaleDateString()} ${new Date(
                      row.dataHora
                    ).toLocaleTimeString()}`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Alarmes;
