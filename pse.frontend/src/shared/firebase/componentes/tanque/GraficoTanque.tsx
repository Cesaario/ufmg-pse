import { Box, Typography } from "@mui/material";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const GraficoTanque = ({ altura }: { altura: number }) => {
  const alturaFaltante = 1 - (altura || 0);
  const data = [{ value: altura || 0 }, { value: alturaFaltante }];

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        width: "100%",
        marginBottom: "-20px",
        marginTop: "-50px",
      }}
    >
      <Typography
        sx={{
          position: "absolute",
          top: "57%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        fontSize={16}
      >
        Nível de líquido
      </Typography>
      <Typography
        sx={{
          position: "absolute",
          top: "65%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        fontWeight={"bold"}
      >
        {`${(altura * 100).toFixed(1)}%`}
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            startAngle={180}
            endAngle={0}
            innerRadius="55%"
            data={data}
            dataKey="value"
            labelLine={false}
            blendStroke
            isAnimationActive={false}
            cy="70%"
          >
            <Cell fill="#00acc1" />
            <Cell fill="#eaeaea" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default GraficoTanque;
