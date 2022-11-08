import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  MouseEventParams,
} from "lightweight-charts";

import { format } from "date-fns";
import { Box } from "@mantine/core";

const DEFAULT_HEIGHT = 300;

export type LineChartProps = {
  data: any[];
  dataUpdatedAt: number;
  color?: string | undefined;
  height?: number | undefined;
  minHeight?: number;
  setValue?: Dispatch<SetStateAction<number | undefined>>; // used for value on hover
  setLabel?: Dispatch<SetStateAction<number | undefined>>; // used for value label on hover
  topLeft?: ReactNode | undefined;
  topRight?: ReactNode | undefined;
  bottomLeft?: ReactNode | undefined;
  bottomRight?: ReactNode | undefined;
} & React.HTMLAttributes<HTMLDivElement>;

const CandleChart = ({
  data,
  dataUpdatedAt,
  color = "#56B2A4",
  setValue,
  setLabel,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  height = DEFAULT_HEIGHT,
  minHeight = DEFAULT_HEIGHT,
  ...rest
}: LineChartProps) => {
  const textColor = "grey";
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartCreated, setChart] = useState<IChartApi | undefined>();

  const handleResize = useCallback(() => {
    if (chartCreated && chartRef?.current?.parentElement) {
      chartCreated.resize(
        chartRef.current.parentElement.clientWidth - 32,
        height
      );
      chartCreated.timeScale().fitContent();
      chartCreated.timeScale().scrollToPosition(0, false);
    }
  }, [chartCreated, chartRef, height]);

  // add event listener for resize
  const isClient = typeof window === "object";
  useEffect(() => {
    if (!isClient) {
      return;
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isClient, chartRef, handleResize]); // Empty array ensures that effect is only run on mount and unmount

  const createChartFn = useCallback(() => {
    if (!chartRef?.current?.parentElement) {
      return;
    }

    const chart = createChart(chartRef.current, {
      height: height,
      width: chartRef.current.parentElement.clientWidth - 32,
      layout: {
        backgroundColor: "transparent",
        textColor: textColor,
        fontFamily: "Roboto",
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        secondsVisible: true,
        tickMarkFormatter: (unixTime: number) =>
          format(unixTime, "MM/dd h:mm a"),
      },
      watermark: {
        visible: false,
      },
      grid: {
        horzLines: {
          visible: false,
        },
        vertLines: {
          visible: false,
        },
      },
      crosshair: {
        horzLine: {
          visible: false,
          labelVisible: false,
        },
        mode: 1,
        vertLine: {
          visible: true,
          labelVisible: false,
          style: 3,
          width: 1,
          color: "#505050",
          labelBackgroundColor: color,
        },
      },
    });

    chart.timeScale().fitContent();
    setChart(chart);
  }, [color, chartCreated, data, height, setValue, textColor]);

  // if chart not instantiated in canvas, create it
  useEffect(() => {
    if (!chartCreated && data && !!chartRef?.current?.parentElement) {
      createChartFn();
    }
  }, [color, chartCreated, data, height, setValue, textColor]);

  const crosshairMoveHandler = useCallback(
    (param: MouseEventParams, series: ISeriesApi<"Candlestick">) => {
      if (
        chartRef?.current &&
        (param === undefined ||
          param.time === undefined ||
          (param && param.point && param.point.x < 0) ||
          (param &&
            param.point &&
            param.point.x > chartRef.current.clientWidth) ||
          (param && param.point && param.point.y < 0) ||
          (param && param.point && param.point.y > height))
      ) {
        // reset values
        setValue && setValue(undefined);
        setLabel && setLabel(undefined);
      } else if (series && param) {
        const timestamp = param.time as number;
        const parsed = param.seriesPrices.get(series) as
          | { open: number }
          | undefined;
        setValue && setValue(parsed?.open);
        setLabel && setLabel(timestamp);
      }
    },
    [setValue, setLabel, chartRef]
  );

  useEffect(() => {
    if (chartCreated && data) {
      const GREEN = "green";
      const RED = "red";

      const series = chartCreated.addCandlestickSeries({
        upColor: GREEN,
        downColor: RED,
        borderDownColor: RED,
        borderUpColor: GREEN,
        wickDownColor: RED,
        wickUpColor: GREEN,
      });

      console.log("setting data");
      chartCreated.unsubscribeCrosshairMove((param) =>
        crosshairMoveHandler(param, series)
      );
      series.setData(data);

      // update the title when hovering on the chart
      chartCreated.subscribeCrosshairMove((param) =>
        crosshairMoveHandler(param, series)
      );
    }
  }, [chartCreated, color, data, height, setValue, setLabel]);

  useEffect(() => {
    if (chartCreated) {
      chartCreated.remove();
      setChart(undefined);
      createChartFn();
    }
  }, [dataUpdatedAt]);

  return (
    <Box
      sx={{
        minHeight,
        width: " 100%",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box>
        {topLeft ?? null}
        {topRight ?? null}
      </Box>
      <div ref={chartRef} id={"candle-chart"} {...rest} />
      <Box>
        {bottomLeft ?? null}
        {bottomRight ?? null}
      </Box>
    </Box>
  );
};

export default CandleChart;
