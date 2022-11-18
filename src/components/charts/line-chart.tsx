import React from "react";
import {
  Customized,
  Line,
  LineChart as RCLineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COLOR_SET_2 } from "../../constants/colors";
import RenderLegends from "./line-chart-legend";

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
  const [isTooltipActive, setIsTooltipActive] = React.useState<boolean>(false);

  const handleMouseEnter = (line: string) => () => {
    setHoveredLine(line);
  };

  const handleMouseLeave = () => () => {
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
      <XAxis dataKey={xAxisDataKey} padding={{ left: 30, right: 30 }} />
      <YAxis domain={[0.8, 1.2]} />
      <Tooltip
        cursor={false}
        wrapperStyle={isTooltipActive ? {} : { display: "none" }}
      />
      <Customized
        component={RenderLegends({
          handleMouseEnter,
          handleMouseLeave,
          setIsTooltipActive,
        })}
      />
      {requiredLines.map((line) => (
        <Line
          type="monotone"
          dataKey={line}
          key={line}
          stroke={getLineStroke(line)}
          dot={false}
          strokeWidth={2}
          onMouseEnter={handleMouseEnter(line)}
          onMouseLeave={handleMouseLeave()}
        />
      ))}
    </RCLineChart>
  );
};

export default LineChart;
