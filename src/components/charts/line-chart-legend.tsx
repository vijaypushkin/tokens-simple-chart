import React, { MouseEventHandler } from "react";
import useChartsStore from "../../stores/charts.store";
import { Box, createStyles } from "@mantine/core";

const useStyles = createStyles({
  root: {
    position: "absolute",
    top: -10,
    left: 50,
  },
  legend: {
    padding: "2px 8px",
    display: "inline-block",
    border: "1px solid #1d1d1d10",
    borderRadius: 4,
    margin: "0 4px",
    fontSize: "0.8rem",
  },

  close: {
    marginLeft: 8,
    opacity: 0.7,
    cursor: "pointer",
  },
});

const RenderLegends =
  (otherProps: {
    setIsTooltipActive: (active: boolean) => void;
    handleMouseLeave: () => MouseEventHandler;
    handleMouseEnter: (line: string) => MouseEventHandler;
  }) =>
  (props: any) => {
    const { classes } = useStyles();
    const tokens = useChartsStore((state) => state.tokens);
    const setTokens = useChartsStore((state) => state.setTokens);

    const removeToken = (token: string) => () => {
      setTokens(tokens.filter((x) => x.name !== token));
    };

    return (
      <foreignObject x={0} y={0} height={56} width={400}>
        <ul
          className={classes.root}
          onMouseEnter={() => otherProps.setIsTooltipActive(false)}
          onMouseLeave={() => otherProps.setIsTooltipActive(true)}
        >
          {props.activePayload?.map((entry: any) => (
            <Box
              component={"li"}
              key={`item-${entry.name}`}
              className={classes.legend}
              sx={{ borderLeft: `4px solid ${entry.color}` }}
              onMouseEnter={otherProps.handleMouseEnter(entry.name)}
              onMouseLeave={otherProps.handleMouseLeave()}
            >
              {entry.name}

              <span className={classes.close} onClick={removeToken(entry.name)}>
                &times;
              </span>
            </Box>
          ))}
        </ul>
      </foreignObject>
    );
  };

export default RenderLegends;
