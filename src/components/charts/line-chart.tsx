import React from "react";
import {
  LineChart as RCLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { COLOR_SET_2 } from "../../constants/colors";

interface ILineChartProps {
  data: any[];
  xAxisDataKey: string;
  requiredLines: string[];
}

const LineChart: React.FC<ILineChartProps> = ({
  data,
  xAxisDataKey,
  requiredLines,
}) => {
  const [hoveredLine, setHoveredLine] = React.useState<string | null>(null);

  const handleMouseEnter = (line: string) => () => {
    console.log(line, "mouse enter");
    setHoveredLine(line);
  };

  const handleMouseLeave = (line: string) => () => {
    console.log(line, "mouse leave");
    setHoveredLine(null);
  };

  const getLineStroke = (line: string) => {
    const color = COLOR_SET_2[line === "Tezos" ? 1 : line === "Tether" ? 2 : 0];

    if (hoveredLine == null) {
      return color;
    }

    if (hoveredLine === line) {
      return color;
    }

    return `${color}50`;
  };

  return (
    <RCLineChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xAxisDataKey} padding={{ left: 30, right: 30 }} />
      <YAxis />
      <Tooltip />
      <Legend />
      {requiredLines.map((line) => (
        <Line
          type="monotone"
          dataKey={line}
          key={line}
          stroke={getLineStroke(line)}
          activeDot={false}
          dot={false}
          strokeWidth={2}
          onMouseEnter={handleMouseEnter(line)}
          onMouseLeave={handleMouseLeave(line)}
        />
      ))}
    </RCLineChart>
  );
};

export default LineChart;
